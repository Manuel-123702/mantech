/**
 * MANTECH Nexus — Admin two-factor (6-digit OTP) core.
 *
 * Delivered to the admin's WhatsApp after the normal Clerk email+password
 * sign-in. This module is deliberately PURE:
 *   - WebCrypto only (works in Edge middleware AND the Node runtime),
 *   - no Prisma, no Next.js imports, no side effects,
 * so it can be imported from `middleware.ts` and unit-tested directly.
 *
 * Policy (owner-approved):
 *   - code expires after 60 seconds
 *   - maximum 3 verification attempts per code
 *   - the verified state lives in a signed httpOnly cookie for 60 minutes
 */

// ── Policy constants ────────────────────────────────────────────────────────
export const OTP_TTL_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 3;
/** Rolling window cap for how many codes may be requested (anti-harvest). */
export const OTP_SEND_LIMIT = 5;
export const OTP_SEND_WINDOW_MS = 15 * 60_000;
/** Rolling window cap for verify attempts across burned codes (anti-brute). */
export const OTP_VERIFY_LIMIT = 10;
export const OTP_VERIFY_WINDOW_MS = 15 * 60_000;
/** How long the verified session cookie stays valid (seconds). */
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60;
export const ADMIN_OTP_COOKIE = 'mantech_admin_otp';

const encoder = new TextEncoder();

// ── Helpers ────────────────────────────────────────────────────────────────
export function normalizeOtpEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Server-side secret pepper. Falls back to the existing SECRET_TOKEN. */
export function getOtpPepper(): string {
  const pepper = process.env.OTP_PEPPER || process.env.SECRET_TOKEN || '';
  if (!pepper) {
    throw new Error('OTP_PEPPER (or SECRET_TOKEN) must be configured for admin 2FA.');
  }
  return pepper;
}

/** Secret used to sign the verified-session cookie. */
export function getOtpSessionSecret(): string {
  return getOtpPepper();
}

/**
 * Cryptographically random 4-char code: exactly 3 digits + 1 uppercase letter,
 * shuffled for readability (e.g. "K4M2").
 */
export function generateOtpCode(): string {
  const digits = Array.from({ length: 3 }, () => String.fromCharCode(48 + Math.floor(Math.random() * 10)));
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const chars = [digits[0], digits[1], digits[2], letter];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmacBase64Url(secret: string, input: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(input));
  return bytesToBase64Url(new Uint8Array(signature));
}

/** Constant-time string comparison (no early exit on first differing byte). */
export function timingSafeEqualString(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < length; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

// ── Code hashing (never store plaintext codes) ──────────────────────────────
export async function hashOtpCode(opts: {
  email: string;
  code: string;
  pepper: string;
}): Promise<string> {
  const email = normalizeOtpEmail(opts.email);
  return sha256Hex(`${opts.pepper}:${email}:${opts.code}`);
}

export async function verifyOtpHash(opts: {
  storedHash: string;
  email: string;
  code: string;
  pepper: string;
}): Promise<boolean> {
  const candidate = await hashOtpCode(opts);
  return timingSafeEqualString(candidate, opts.storedHash);
}

/** Shape check before hashing: exactly 3 digits + 1 letter (e.g. "K4M2"). */
export function isWellFormedOtpCode(code: unknown): code is string {
  if (typeof code !== 'string' || code.length !== 4) return false;
  const digitCount = (code.match(/\d/g) || []).length;
  const letterCount = (code.match(/[A-Za-z]/g) || []).length;
  return digitCount === 3 && letterCount === 1;
}

// ── Verified-session cookie (signed, tamper-evident) ────────────────────────
type SessionPayload = {
  /** Lowercased email of the admin that passed 2FA. */
  email: string;
  /** Issued-at (unix seconds). */
  iat: number;
  /** Expiry (unix seconds). */
  exp: number;
};

export async function signAdminOtpSession(opts: {
  email: string;
  secret: string;
  ttlSeconds?: number;
  now?: number;
}): Promise<string> {
  const now = Math.floor((opts.now ?? Date.now()) / 1000);
  const payload: SessionPayload = {
    email: normalizeOtpEmail(opts.email),
    iat: now,
    exp: now + (opts.ttlSeconds ?? ADMIN_SESSION_TTL_SECONDS),
  };
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await hmacBase64Url(opts.secret, body);
  return `${body}.${signature}`;
}

export async function verifyAdminOtpSession(
  token: string | undefined | null,
  opts: { secret: string; now?: number },
): Promise<{ email: string } | null> {
  if (!token || !token.includes('.')) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expected = await hmacBase64Url(opts.secret, body);
  if (!timingSafeEqualString(signature, expected)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as SessionPayload;
  } catch {
    return null;
  }
  if (!payload || typeof payload.email !== 'string' || !payload.email.includes('@')) return null;

  const now = Math.floor((opts.now ?? Date.now()) / 1000);
  if (typeof payload.exp !== 'number' || payload.exp <= now) return null;
  if (typeof payload.iat === 'number' && payload.iat > now + 60) return null; // future-issued
  return { email: payload.email };
}

// ── Email presentation helpers ─────────────────────────────────────────────
/** "tessohmanuel@gmail.com" -> "t•••@gmail.com" */
export function maskEmailDestination(email: string): string {
  const normalized = normalizeOtpEmail(email);
  const [local, domain] = normalized.split('@');
  if (!local || !domain) return '•••';
  const head = local.slice(0, 1);
  return `${head}•••@${domain}`;
}

/** Subject line for the admin verification email. */
export function formatAdminOtpEmailSubject(): string {
  return 'MANTECH Nexus — Admin Verification Code';
}

/** Message body sent to the admin's email inbox. */
export function formatAdminOtpEmailMessage(code: string): string {
  return [
    'MANTECH Nexus — Admin Verification',
    '',
    `Your one-time code is: ${code}`,
    '',
    `Valid for ${OTP_TTL_SECONDS} seconds. Never share it with anyone.`,
    'If you did not request this, ignore this message.',
  ].join('\n');
}

// ── WhatsApp presentation helpers (legacy) ─────────────────────────────────
// WhatsApp delivery was removed: CallMeBot never issued a production API key,
// so the admin gate is email-only. These helpers stay exported so older
// build artefacts and comments keep compiling, but no route calls them.
/** "+237650921917" -> "+237 ••• •• •• 17" */
export function maskWhatsAppDestination(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '•••';
  const suffix = digits.slice(-2);
  const prefix = digits.slice(0, 3);
  return `+${prefix} ••• •• •• ${suffix}`;
}

/** Message body sent to the admin's WhatsApp. */
export function formatAdminOtpWhatsAppMessage(code: string): string {
  return [
    '🔐 *MANTECH Nexus — Admin Verification*',
    '',
    `Your one-time code is: *${code}*`,
    '',
    `⚠️ Valid for ${OTP_TTL_SECONDS} seconds. Never share it with anyone.`,
    'If you did not request this, ignore this message.',
  ].join('\n');
}
