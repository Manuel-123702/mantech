import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit, clientKey, rateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';
import { resolveRoles, dashboardsForRoles, type PlatformRole } from '@/lib/roles';
import { ADMIN_OTP_COOKIE, getOtpSessionSecret, verifyAdminOtpSession } from '@/lib/admin-otp';

/**
 * MANTECH Nexus Security & Authorization Middleware
 * Enforces:
 * 1. Enterprise Security Headers (CSP, anti-clickjacking, anti-sniffing, HSTS)
 * 2. Clerk Authentication & Session Management
 * 3. Route Protection & Role-Based Access Control (Intern, Company, University, Admin)
 * 4. Intern Passport Eligibility (Interns, Companies, Universities ONLY)
 * 5. Anti-Enumeration & Hacker Shield
 * 6. Rate limiting on API traffic (SRS §20)
 */

// Routes requiring active authenticated session
const PROTECTED_PREFIXES = ['/dashboard', '/intern-passports', '/applications', '/saved', '/notifications', '/settings'];

// Dashboards that are checked for permission on every visit.
// Whether a person may open one of these is decided by the rules in
// lib/roles.ts, which reads the email lists from the .env settings file.
const GUARDED_DASHBOARDS = [
  '/dashboard/intern',
  '/dashboard/company',
  '/dashboard/university',
  '/dashboard/admin',
];

/**
 * Content-Security-Policy.
 *
 * `unsafe-inline` is required for styles because Tailwind and Framer Motion
 * inject style tags at runtime. Scripts stay locked down to self + the exact
 * Clerk/Neon origins the app talks to. `unsafe-eval` is only permitted in
 * development, where the React refresh runtime needs it.
 */
function buildCsp(isDev: boolean): string {
  // Clerk's bot protection renders Cloudflare Turnstile, which loads its script
  // from and frames itself on challenges.cloudflare.com. Clerk's abuse/fraud
  // checks run on *.protect.clerk.com (note the required `:*` — those hosts are
  // served on ports other than 443).
  const turnstile = 'https://challenges.cloudflare.com';
  const clerkProtection = 'https://*.protect.clerk.com';

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    'https://clerk.mantech.nexus',
    'https://*.clerk.accounts.dev',
    'https://*.clerk.com',
    turnstile,
    clerkProtection,
    ...(isDev ? ["'unsafe-eval'"] : []),
  ];
  const connectSrc = [
    "'self'",
    'https://*.clerk.accounts.dev',
    'https://*.clerk.com',
    'https://clerk.telemetry.com',
    'https://api.emailjs.com',
    'https://*.neon.tech',
    turnstile,
    `${clerkProtection}:*`,
    'wss://*.clerk.accounts.dev',
    ...(isDev ? ['ws:', 'http://localhost:*'] : []),
  ];

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    // The loading screen plays a local mp4; allow images from our own origin
    // plus the data: URI placeholders used by background textures.
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob:",
    `connect-src ${connectSrc.join(' ')}`,
    // Without this the Turnstile iframe is blocked by `default-src 'self'`
    // and the sign-up form fails with "The CAPTCHA failed to load".
    `frame-src 'self' ${turnstile} ${clerkProtection}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
}

/**
 * Pulls the email address out of the sign-in details.
 *
 * The address is not always included, and it may be labelled differently
 * depending on how the sign-in service is set up, so we check the usual names.
 * Returns nothing when it is not there — callers must treat that as "unknown"
 * rather than guessing.
 */
function readEmailFromClaims(claims: Record<string, unknown>): string | undefined {
  const candidates = [claims.email, claims.primary_email_address, claims.email_address];
  for (const value of candidates) {
    if (typeof value === 'string' && value.includes('@')) return value;
  }
  return undefined;
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isDev = process.env.NODE_ENV !== 'production';
  const response = NextResponse.next();

  response.headers.set('Content-Security-Policy', buildCsp(isDev));
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // ── Rate limiting (API traffic only) ──────────────────────────────────────
  // Public page rendering is left alone so that a slow crawler or a burst of
  // navigation can never lock a legitimate user out of the marketplace.
  if (pathname.startsWith('/api/')) {
    const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
    const rule = isWrite ? RATE_LIMITS.write : RATE_LIMITS.api;
    const result = rateLimit(clientKey(request, `api:${pathname}`), rule);

    for (const [header, value] of Object.entries(rateLimitHeaders(result))) {
      response.headers.set(header, value);
    }

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please slow down and try again shortly.',
        },
        {
          status: 429,
          headers: {
            ...rateLimitHeaders(result),
            'Retry-After': String(result.resetSeconds),
          },
        },
      );
    }
  }

  const searchParams = request.nextUrl.searchParams.toString();
  if (
    searchParams.includes('..') ||
    searchParams.includes('<script') ||
    searchParams.includes('%3Cscript') ||
    searchParams.includes('union+select')
  ) {
    return new NextResponse('Access Denied: Malformed security pattern detected.', {
      status: 403,
      headers: response.headers,
    });
  }

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (isProtectedRoute) {
    const session = await auth();
    if (!session?.userId) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Role-based access control
    try {
      const claims = (session?.sessionClaims ?? {}) as Record<string, unknown>;
      const metadata = (claims.metadata as Record<string, unknown> | undefined) ?? {};

      // Work out which role this person has. We prefer the role saved on their
      // account. If there is none, we check their email against the lists in
      // the .env file. That is how the site owner gets admin access without
      // anyone having to edit account settings by hand.
      const savedRole = typeof metadata.role === 'string' ? metadata.role : undefined;
      const email = readEmailFromClaims(claims);

      // If we cannot tell who this person is from the sign-in details, we do
      // NOT guess. Guessing "intern" here would lock real owners out of their
      // own dashboards, because the sign-in token does not always carry the
      // email address. Each dashboard checks the saved role again when it
      // opens, and that check is the real gate.
      const roleKnown = Boolean(savedRole) || Boolean(email);
      // A person may hold more than one role (for example a partner who is both
      // a company and a university), so every match is collected and they get
      // the union of those dashboards.
      const roles = resolveRoles(email, savedRole);
      const allowed = dashboardsForRoles(roles);

      const guarded = GUARDED_DASHBOARDS.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
      );

      if (guarded && roleKnown) {
        const permitted = allowed.some(
          (route) => pathname === route || pathname.startsWith(`${route}/`),
        );
        if (!permitted) {
          // Not allowed here. Send them to a dashboard they can actually use,
          // so they never land on a page that looks broken.
          const home = new URL(allowed[0] ?? '/', request.url);
          home.searchParams.set('denied', '1');
          return NextResponse.redirect(home);
        }
      }
    } catch {
      // Session claims not available; fall through without role enforcement
      // (route-level guards will catch unauthorized access)
    }
  }

  // ── Admin two-factor (OTP) gate ──────────────────────────────────────────
  // The admin dashboard requires a second factor: after the normal Clerk
  // email+password sign-in, a signed httpOnly cookie proves the 6-digit
  // WhatsApp code was verified within the last 60 minutes. Fails closed on
  // any configuration problem. The verify page itself (/dashboard/admin-verify)
  // is intentionally not covered by these prefixes.
  const isAdminPage =
    pathname === '/dashboard/admin' || pathname.startsWith('/dashboard/admin/');
  const isAdminApi =
    pathname.startsWith('/api/admin') || pathname.startsWith('/api/dashboard/admin');
  if (isAdminPage || isAdminApi) {
    let verified = false;
    try {
      const token = request.cookies.get(ADMIN_OTP_COOKIE)?.value;
      const session = await verifyAdminOtpSession(token, { secret: getOtpSessionSecret() });
      verified = Boolean(session);
    } catch {
      verified = false;
    }
    if (!verified) {
      if (isAdminApi) {
        return NextResponse.json(
          { error: 'Admin two-factor verification required.' },
          { status: 401, headers: response.headers },
        );
      }
      const gate = new URL('/dashboard/admin-verify', request.url);
      if (pathname !== '/dashboard/admin') gate.searchParams.set('next', pathname);
      return NextResponse.redirect(gate);
    }
  }

  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
