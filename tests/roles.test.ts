/**
 * Checks that the right people can open the right dashboards.
 *
 * The rules we are proving:
 *   - Everyone who has signed in can open the Intern Dashboard and Passport.
 *   - Company, University and Admin dashboards need a matching email.
 *   - A listed email beats a smaller role already saved on the account, so
 *     adding an email to the .env file immediately gives that access.
 *
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeEmail,
  parseEmailList,
  parseRole,
  isAdminEmail,
  isCompanyEmail,
  isUniversityEmail,
  resolveRole,
  resolveRoles,
  dashboardsForRole,
  dashboardsForRoles,
  canAccessDashboard,
  canAccessDashboardRoles,
} from '../lib/roles.ts';

const OWNER = 'tessohmanuel@gmail.com';
const COMPANY_PERSON = 'hr@douala-digital.com';
const UNIVERSITY_PERSON = 'placement@university-buea.cm';
const RANDOM_PERSON = 'random.person@gmail.com';

// Email lists used in the checks, so the tests never depend on the real
// settings file on your computer.
const EMAILS = {
  admin: OWNER,
  company: COMPANY_PERSON,
  university: UNIVERSITY_PERSON,
};

/** resolveRole pinned to the test email lists. */
function roleFor(email: string | null | undefined, saved?: unknown) {
  return resolveRole(email, saved, EMAILS);
}

// ── Reading email lists ────────────────────────────────────────────────────

test('an email list separated by commas, spaces or semicolons is read cleanly', () => {
  assert.deepEqual(parseEmailList('a@x.com, b@x.com;c@x.com  d@x.com'), [
    'a@x.com',
    'b@x.com',
    'c@x.com',
    'd@x.com',
  ]);
});

test('an empty email list is handled without breaking', () => {
  assert.deepEqual(parseEmailList(''), []);
  assert.deepEqual(parseEmailList(null), []);
  assert.deepEqual(parseEmailList('  ,  '), []);
});

test('small spelling differences in an email do not matter', () => {
  assert.equal(normalizeEmail('  Owner@Gmail.COM '), 'owner@gmail.com');
  assert.equal(isAdminEmail('  TessOhManuel@Gmail.com ', OWNER), true);
});

// ── Choosing the right role ────────────────────────────────────────────────

test('a listed owner becomes an admin', () => {
  assert.equal(isAdminEmail(OWNER, OWNER), true);
  assert.equal(roleFor(OWNER), 'ADMIN');
});

test('a listed company person becomes a company user', () => {
  assert.equal(isCompanyEmail(COMPANY_PERSON, COMPANY_PERSON), true);
  assert.equal(roleFor(COMPANY_PERSON), 'COMPANY');
});

test('a listed university person becomes a university user', () => {
  assert.equal(isUniversityEmail(UNIVERSITY_PERSON, UNIVERSITY_PERSON), true);
  assert.equal(roleFor(UNIVERSITY_PERSON), 'UNIVERSITY');
});

test('anyone else is treated as an intern', () => {
  assert.equal(roleFor(RANDOM_PERSON), 'INTERN');
  assert.equal(roleFor(''), 'INTERN');
  assert.equal(roleFor(null), 'INTERN');
});

test('a lookalike email is not accepted as an owner', () => {
// ── A listed email wins over a smaller saved role ──────────────────────────
// This is what stops a site owner being locked out: adding their email to a
// list in the .env file must lift them up the next time they sign in.

test('a listed email wins over a smaller role already saved', () => {
  assert.equal(roleFor(OWNER, 'INTERN'), 'ADMIN');
  assert.equal(roleFor(COMPANY_PERSON, 'INTERN'), 'COMPANY');
  assert.equal(roleFor(UNIVERSITY_PERSON, 'INTERN'), 'UNIVERSITY');
});

test('a role already saved is kept when the email is on no list', () => {
  assert.equal(roleFor(RANDOM_PERSON, 'COMPANY'), 'COMPANY');
  assert.equal(roleFor(RANDOM_PERSON, 'UNIVERSITY'), 'UNIVERSITY');
  assert.equal(roleFor(RANDOM_PERSON, 'ADMIN'), 'ADMIN');
});

test('an unrecognised saved role falls back to an intern', () => {
  assert.equal(roleFor(OWNER, 'GODMODE'), 'ADMIN');
  assert.equal(roleFor(RANDOM_PERSON, 'GODMODE'), 'INTERN');
});

test('only the four known roles are accepted as a saved role', () => {
  assert.equal(parseRole('ADMIN'), 'ADMIN');
  assert.equal(parseRole('company'), 'COMPANY');
  assert.equal(parseRole('SUPERUSER'), null);
  assert.equal(parseRole(undefined), null);
});

// ── Who can open which dashboard ───────────────────────────────────────────

test('every signed-in member can open the intern dashboard and the passport', () => {
  for (const role of ['INTERN', 'COMPANY', 'UNIVERSITY', 'ADMIN'] as const) {
    assert.equal(canAccessDashboard(role, '/dashboard/intern'), true);
    assert.equal(canAccessDashboard(role, '/dashboard/intern/passport'), true);
  }
});

test('an admin can open all five dashboards', () => {
  assert.equal(dashboardsForRole('ADMIN').length, 5);
  for (const path of [
    '/dashboard/intern',
    '/dashboard/intern/passport',
    '/dashboard/company',
    '/dashboard/university',
    '/dashboard/admin',
  ]) {
    assert.equal(canAccessDashboard('ADMIN', path), true, `${path} should open for an admin`);
  }
});

test('an intern is refused the company, university and admin dashboards', () => {
  assert.equal(canAccessDashboard('INTERN', '/dashboard/company'), false);
  assert.equal(canAccessDashboard('INTERN', '/dashboard/university'), false);
  assert.equal(canAccessDashboard('INTERN', '/dashboard/admin'), false);
});

test('typing an inner company page address does not open it for an intern', () => {
  assert.equal(
    canAccessDashboard('INTERN', '/dashboard/company/opportunities'),
    false,
    'a deeper address must not slip past the check',
  );
});

test('a company user can open only the company dashboard', () => {
  assert.equal(canAccessDashboard('COMPANY', '/dashboard/company'), true);
  assert.equal(canAccessDashboard('COMPANY', '/dashboard/university'), false);
  assert.equal(canAccessDashboard('COMPANY', '/dashboard/admin'), false);
});

test('a university user can open only the university dashboard', () => {
  assert.equal(canAccessDashboard('UNIVERSITY', '/dashboard/university'), true);
  assert.equal(canAccessDashboard('UNIVERSITY', '/dashboard/company'), false);
  assert.equal(canAccessDashboard('UNIVERSITY', '/dashboard/admin'), false);
});

test('a member can open their own inner pages', () => {
  assert.equal(canAccessDashboard('INTERN', '/dashboard/intern/applications'), true);
  assert.equal(canAccessDashboard('INTERN', '/dashboard/intern/history'), true);
});
  assert.equal(isAdminEmail('tessohmanuel@gmail.com.evil.net', OWNER), false);
  assert.equal(isAdminEmail('xtessohmanuel@gmail.com', OWNER), false);
});
﻿

// --- Someone who holds more than one role -----------------------------------
//
// A partner who is both a company and a university used to be given only the
// first role that matched, so the other dashboard silently stayed closed. These
// checks pin the multi-role behaviour that replaced it.

const BOTH_PERSON = 'partner@dual.cm';

const DUAL_EMAILS = {
  admin: OWNER,
  company: BOTH_PERSON,
  university: BOTH_PERSON,
};

test('someone on both the company and university lists holds both roles', () => {
  assert.deepEqual(resolveRoles(BOTH_PERSON, undefined, DUAL_EMAILS), [
    'COMPANY',
    'UNIVERSITY',
  ]);
});

test('a two-role person opens four dashboards, not three', () => {
  const dashboards = dashboardsForRoles(resolveRoles(BOTH_PERSON, undefined, DUAL_EMAILS));
  assert.deepEqual(dashboards, [
    '/dashboard/intern',
    '/dashboard/intern/passport',
    '/dashboard/company',
    '/dashboard/university',
  ]);
});

test('a two-role person can reach both dashboards, but not the admin one', () => {
  const roles = resolveRoles(BOTH_PERSON, undefined, DUAL_EMAILS);
  assert.equal(canAccessDashboardRoles(roles, '/dashboard/company'), true);
  assert.equal(canAccessDashboardRoles(roles, '/dashboard/university'), true);
  assert.equal(canAccessDashboardRoles(roles, '/dashboard/admin'), false);
});

test('a two-role person still reaches the intern dashboard and passport', () => {
  const roles = resolveRoles(BOTH_PERSON, undefined, DUAL_EMAILS);
  assert.equal(canAccessDashboardRoles(roles, '/dashboard/intern'), true);
  assert.equal(canAccessDashboardRoles(roles, '/dashboard/intern/passport'), true);
});

test('an admin can open all five dashboards', () => {
  const roles = resolveRoles(OWNER, undefined, EMAILS);
  assert.deepEqual(roles, ['ADMIN']);
  assert.equal(dashboardsForRoles(roles).length, 5);
  for (const route of [
    '/dashboard/intern',
    '/dashboard/intern/passport',
    '/dashboard/company',
    '/dashboard/university',
    '/dashboard/admin',
  ]) {
    assert.equal(canAccessDashboardRoles(roles, route), true, route);
  }
});

test('a two-role list never grants admin by accident', () => {
  const dashboards = dashboardsForRoles(resolveRoles(BOTH_PERSON, undefined, DUAL_EMAILS));
  assert.equal(dashboards.includes('/dashboard/admin'), false);
});

test('the strongest role is always first, so the account stores admin', () => {
  // Listed as company and university, but also the platform owner.
  const both = resolveRoles(OWNER, 'UNIVERSITY', DUAL_EMAILS);
  assert.equal(both[0], 'ADMIN');
  assert.equal(resolveRole(OWNER, 'UNIVERSITY', DUAL_EMAILS), 'ADMIN');
});

test('combining roles never repeats a dashboard', () => {
  const dashboards = dashboardsForRoles(['ADMIN', 'COMPANY', 'UNIVERSITY']);
  assert.equal(new Set(dashboards).size, dashboards.length);
  assert.equal(dashboards.length, 5);
});
