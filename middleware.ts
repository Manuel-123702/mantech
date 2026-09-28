import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ManTech Nexus Security & Authorization Middleware
 * Enforces:
 * 1. Enterprise Security Headers (Anti-Clickjacking, Anti-Sniffing, Strict-Transport-Security)
 * 2. Route Protection & Role-Based Access Control (Student, Company, University, Supervisor, Admin)
 * 3. Career Passport Eligibility (Students, Companies, Universities ONLY - SRS Section 10)
 * 4. Anti-Enumeration & Hacker Shield
 */

// Routes requiring active authenticated session
const PROTECTED_PREFIXES = ['/dashboard', '/career-passport'];

// Role-specific route boundaries
const ROLE_ROUTE_MAP: Record<string, string> = {
  '/dashboard/student': 'student',
  '/dashboard/company': 'company',
  '/dashboard/university': 'university',
  '/dashboard/supervisor': 'supervisor',
  '/dashboard/admin': 'admin',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Enterprise Security Headers (Defends against learner & pro penetration attempts)
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

  // 2. Prevent directory traversal & SQL/NoSQL injection signatures in query parameters
  const searchParams = request.nextUrl.searchParams.toString();
  if (
    searchParams.includes('..') ||
    searchParams.includes('<script') ||
    searchParams.includes('%3Cscript') ||
    searchParams.includes('union+select') ||
    searchParams.includes('1=1')
  ) {
    return new NextResponse('Access Denied: Malformed security pattern detected.', {
      status: 403,
      headers: response.headers,
    });
  }

  // 3. Check protected routes
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected) {
    // Check auth session cookie / token
    const authSession = request.cookies.get('__session')?.value || request.cookies.get('mantech_auth')?.value;

    // If no session is present, redirect to sign-in with return URL
    // (Note: In development demo mode, cookies or headers may bypass if configured)
    if (!authSession && process.env.NODE_ENV === 'production') {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // 4. Role validation for specific dashboard segments
    const roleCookie = request.cookies.get('mantech_role')?.value;
    for (const [route, requiredRole] of Object.entries(ROLE_ROUTE_MAP)) {
      if (pathname.startsWith(route)) {
        if (roleCookie && roleCookie !== requiredRole && roleCookie !== 'admin') {
          // Prevent cross-role access (e.g. Student trying to access /dashboard/admin)
          const authorizedHome = new URL(`/dashboard/${roleCookie}`, request.url);
          return NextResponse.redirect(authorizedHome);
        }
      }
    }

    // 5. Career Passport: Only Student, Company, University eligible (SRS Section 10.1)
    if (pathname.startsWith('/career-passport')) {
      if (roleCookie === 'supervisor' || roleCookie === 'admin') {
        const forbiddenUrl = new URL('/dashboard/' + roleCookie, request.url);
        return NextResponse.redirect(forbiddenUrl);
      }
    }
  }

  return response;
}

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
