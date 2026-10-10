/**
 * Who is allowed to open which dashboard.
 *
 * Simple rules:
 *   1. Anyone who has signed in can open the Intern Dashboard and the Intern
 *      Passport. Those two belong to every member.
 *   2. The Company, University and Admin dashboards are restricted. To open
 *      them, your email must be listed in the matching list inside the `.env`
 *      settings file (ADMIN_EMAILS, COMPANY_EMAILS or UNIVERSITY_EMAILS).
 *   3. If your email is on none of those lists, you stay on the intern side.
 *      Typing someone else's dashboard address will not open it — the site
 *      quietly sends you back to a dashboard you are allowed to use.
 *   4. Admins are the platform owners. They can look at every dashboard.
 *
 * All these rules live in this one file so every part of the site agrees on who
 * can see what. Nothing else decides roles on its own.
 */

export type PlatformRole = 'INTERN' | 'COMPANY' | 'UNIVERSITY' | 'ADMIN';

const VALID_ROLES: readonly string[] = ['INTERN', 'COMPANY', 'UNIVERSITY', 'ADMIN'];

/** Dashboards that every signed-in member may open, whatever their role. */
const EVERYONE_CAN_OPEN = ['/dashboard/intern', '/dashboard/intern/passport'];

/** Lower-cases and trims an email so small spelling differences do not matter. */
export function normalizeEmail(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

/**
 * Turns a list of emails into a clean array.
 * People can write them separated by commas, spaces or semicolons.
 */
export function parseEmailList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[\s,;]+/)
    .map(normalizeEmail)
    .filter(Boolean);
}

/** Reads an email list from the settings file, with an optional backup value. */
function emailsFromEnv(name: string, backup?: string): string[] {
  const fromFile = parseEmailList(process.env[name]);
  if (fromFile.length > 0) return fromFile;
  return parseEmailList(backup);
}

/** The platform owner emails. These people can open every dashboard. */
export function adminEmails(raw?: string | null): string[] {
  return raw !== undefined
    ? parseEmailList(raw)
    : emailsFromEnv('ADMIN_EMAILS', process.env.MANTECH_EMAIL);
}

/** The emails allowed to open the Company dashboard. */
export function companyEmails(raw?: string | null): string[] {
  return raw !== undefined ? parseEmailList(raw) : emailsFromEnv('COMPANY_EMAILS');
}

/** The emails allowed to open the University dashboard. */
export function universityEmails(raw?: string | null): string[] {
  return raw !== undefined ? parseEmailList(raw) : emailsFromEnv('UNIVERSITY_EMAILS');
}

function isOnList(email: string | null | undefined, list: string[]): boolean {
  const normalized = normalizeEmail(email);
  return normalized !== '' && list.includes(normalized);
}

export function isAdminEmail(email: string | null | undefined, raw?: string | null): boolean {
  return isOnList(email, adminEmails(raw));
}

export function isCompanyEmail(email: string | null | undefined, raw?: string | null): boolean {
  return isOnList(email, companyEmails(raw));
}

export function isUniversityEmail(email: string | null | undefined, raw?: string | null): boolean {
  return isOnList(email, universityEmails(raw));
}

/** Turns a saved value into a valid role, or returns null if it is not one. */
export function parseRole(value: unknown): PlatformRole | null {
  if (typeof value !== 'string') return null;
  const upper = value.trim().toUpperCase();
  return VALID_ROLES.includes(upper) ? (upper as PlatformRole) : null;
}

/**
 * Every role a signed-in person actually holds.
 *
 * Someone can appear on more than one list — a partner who is both a company and
 * a university is a real case, not a hypothetical one. Returning every match
 * means such a person opens both dashboards instead of silently getting only the
 * first one that happened to be checked.
 *
 * Order runs most-powerful first, so `roles[0]` is the primary role used when
 * only one has to be stored on the account.
 */
export function resolveRoles(
  email: string | null | undefined,
  savedRole?: unknown,
  emails?: { admin?: string; company?: string; university?: string },
): PlatformRole[] {
  const adminList = emails ? parseEmailList(emails.admin) : adminEmails();
  const companyList = emails ? parseEmailList(emails.company) : companyEmails();
  const universityList = emails ? parseEmailList(emails.university) : universityEmails();

  const held: PlatformRole[] = [];
  // Most powerful first: an admin always wins over anything else.
  if (isOnList(email, adminList)) held.push('ADMIN');
  if (isOnList(email, companyList)) held.push('COMPANY');
  if (isOnList(email, universityList)) held.push('UNIVERSITY');

  // The saved role is kept so an onboarded account keeps working even when it is
  // not (yet) on any list.
  const saved = parseRole(savedRole);
  if (saved && !held.includes(saved)) held.push(saved);

  // Nobody is ever left with nothing: everyone is at least an intern.
  if (held.length === 0) return ['INTERN'];
  // Every holder of any role is also a member, so the intern side is open too.
  return held;
}

/**
 * The single main role for this person.
 *
 * This is what gets stored on the account, so it stays one value. It is the
 * most powerful role held, which is why an admin is never demoted by this.
 */
export function resolveRole(
  email: string | null | undefined,
  savedRole?: unknown,
  emails?: { admin?: string; company?: string; university?: string },
): PlatformRole {
  return resolveRoles(email, savedRole, emails)[0] ?? 'INTERN';
}

/** Every dashboard any one of these roles is allowed to open, without repeats. */
export function dashboardsForRoles(roles: readonly PlatformRole[]): string[] {
  const combined: string[] = [];

  for (const role of roles) {
    for (const dashboard of dashboardsForRole(role)) {
      if (!combined.includes(dashboard)) combined.push(dashboard);
    }
  }

  return combined;
}

/** Every dashboard this role is allowed to open. */
export function dashboardsForRole(role: PlatformRole): string[] {
  // Every member can always use the intern side.
  const base = [...EVERYONE_CAN_OPEN];

  if (role === 'ADMIN') {
    // An admin runs the platform, so every dashboard is open to them.
    return [...base, '/dashboard/company', '/dashboard/university', '/dashboard/admin'];
  }
  if (role === 'COMPANY') return [...base, '/dashboard/company'];
  if (role === 'UNIVERSITY') return [...base, '/dashboard/university'];

  return base;
}

/** True when any of these roles may open the given dashboard address. */
export function canAccessDashboardRoles(
  roles: readonly PlatformRole[],
  pathname: string,
): boolean {
  return dashboardsForRoles(roles).some(
    (allowed) => pathname === allowed || pathname.startsWith(`${allowed}/`),
  );
}

/** True when this role is allowed to open the given dashboard address. */
export function canAccessDashboard(role: PlatformRole, pathname: string): boolean {
  return canAccessDashboardRoles([role], pathname);
}
