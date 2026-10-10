/**
 * Authorization rules (SRS §20 "server-side authorization", §13 university
 * dual-mode, §26 "test unauthorized access explicitly") and the safe shape
 * accessors that prevent "Objects are not valid as a React child".
 *
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AuthError,
  assertRecruiterAccess,
  jsonError,
  isUniqueConstraintViolation,
} from '../lib/authz-policy.ts';
import {
  fieldNameOf,
  regionNameOf,
  specializationNameOf,
  organizationNameOf,
  organizationLogoOf,
  industryNameOf,
  nameOf,
} from '../lib/catalog-shape.ts';

// ── Unauthorized access must be rejected ─────────────────────────────────────

test('a university without canRecruitInterns is denied recruiter access', () => {
  assert.throws(
    () =>
      assertRecruiterAccess(
        { role: 'UNIVERSITY' },
        { type: 'UNIVERSITY', universityProfile: { canRecruitInterns: false } },
      ),
    (error: unknown) =>
      error instanceof AuthError && error.status === 403,
    'coordination-only universities must not reach recruiter features',
  );
});

test('a university without a profile is denied recruiter access', () => {
  assert.throws(
    () =>
      assertRecruiterAccess(
        { role: 'UNIVERSITY' },
        { type: 'UNIVERSITY', universityProfile: null },
      ),
    AuthError,
  );
});

test('a university with canRecruitInterns is allowed', () => {
  assert.doesNotThrow(() =>
    assertRecruiterAccess(
      { role: 'UNIVERSITY' },
      { type: 'UNIVERSITY', universityProfile: { canRecruitInterns: true } },
    ),
  );
});

test('company and intern roles are not gated by the university recruiter rule', () => {
  assert.doesNotThrow(() =>
    assertRecruiterAccess({ role: 'COMPANY' }, null),
    'a company without an org context is handled elsewhere, not here',
  );
  assert.doesNotThrow(() => assertRecruiterAccess({ role: 'INTERN' }, null));
});

// ── Errors must map to safe HTTP statuses without leaking internals ──────────

test('AuthError preserves its intended status', () => {
  assert.deepEqual(jsonError(new AuthError(403, 'Organization access required')), {
    body: { error: 'Organization access required' },
    status: 403,
  });
});

test('unexpected errors are masked as a generic 500', () => {
  const result = jsonError(new Error('postgresql://user:hunter2@host/db failed'));
  assert.equal(result.status, 500);
  assert.equal(
    JSON.stringify(result.body).includes('hunter2'),
    false,
    'internal error details must never reach the client',
  );
});

test('non-Error throws still produce a safe response', () => {
  assert.deepEqual(jsonError('boom'), {
    body: { error: 'An unexpected error occurred.' },
    status: 500,
  });
});

// ── First-visit sync must survive concurrent requests (P2002) ───────────────
//
// `syncDbUser` does read-then-create. A prefetch racing the navigation can
// leave two requests both seeing "no user", both INSERTing, and the loser
// crashing the page with a unique-constraint error. The guard re-reads the
// row instead.

test('isUniqueConstraintViolation recognises the Prisma code', () => {
  assert.equal(isUniqueConstraintViolation({ code: 'P2002' }), true);
});

test('isUniqueConstraintViolation recognises a message-only error', () => {
  assert.equal(
    isUniqueConstraintViolation(
      new Error('Unique constraint failed on the fields: (`clerkId`)'),
    ),
    true,
  );
});

test('isUniqueConstraintViolation ignores unrelated failures', () => {
  assert.equal(isUniqueConstraintViolation({ code: 'P2003' }), false);
  assert.equal(isUniqueConstraintViolation(new Error('connection reset')), false);
  assert.equal(isUniqueConstraintViolation(null), false);
  assert.equal(isUniqueConstraintViolation('Unique constraint failed'), false);
  assert.equal(isUniqueConstraintViolation(undefined), false);
});

test('a duplicate-email conflict surfaces a safe 409, not a driver error', () => {
  // When re-reading by clerkId finds nothing, the clash was on `email` for a
  // different Clerk account — a genuine conflict the user must be told about.
  const error = new AuthError(409, 'An account already exists for this email address');
  const result = jsonError(error);
  assert.equal(result.status, 409);
  assert.equal(
    JSON.stringify(result.body).includes('Unique constraint'),
    false,
    'raw driver wording must never reach the client',
  );
  assert.match(result.body.error, /already exists/i);
});

// ── Shape accessors must always return primitives (never objects) ────────────

test('nested Prisma relations resolve to names, not objects', () => {
  const record = {
    field: { id: 'f1', name: 'Software', slug: 'software', category: 'TECH' },
    region: { id: 'r1', name: 'Littoral' },
    specialization: { id: 's1', name: 'Frontend' },
    organization: { name: 'MANTECH Labs', logoUrl: 'https://cdn/logo.png' },
  };
  assert.equal(fieldNameOf(record), 'Software');
  assert.equal(regionNameOf(record), 'Littoral');
  assert.equal(specializationNameOf(record), 'Frontend');
  assert.equal(organizationNameOf(record), 'MANTECH Labs');
  assert.equal(organizationLogoOf(record), 'https://cdn/logo.png');

  for (const value of [
    fieldNameOf(record),
    regionNameOf(record),
    specializationNameOf(record),
    organizationNameOf(record),
  ]) {
    assert.equal(typeof value, 'string', 'must be a primitive so React can render it');
  }
});

test('legacy flat-string records keep working', () => {
  const flat = { field: 'Software', region: 'Littoral', specialization: 'Frontend' };
  assert.equal(fieldNameOf(flat), 'Software');
  assert.equal(regionNameOf(flat), 'Littoral');
  assert.equal(specializationNameOf(flat), 'Frontend');
});

test('missing relations resolve to null instead of throwing', () => {
  assert.equal(fieldNameOf({}), null);
  assert.equal(fieldNameOf({ field: null }), null);
  assert.equal(regionNameOf({}), null);
  assert.equal(specializationNameOf({}), null);
  assert.equal(organizationNameOf({}), null);
  assert.equal(organizationLogoOf({}), null);
});

test('nameOf falls back to id and handles non-objects', () => {
  assert.equal(nameOf('plain'), 'plain');
  assert.equal(nameOf(''), null);
  assert.equal(nameOf({ id: 'abc' }), 'abc');
  assert.equal(nameOf({}), null);
});

// ── /companies regression: nested region/industry must never reach JSX ───────
// The /api/companies payload uses `include: { region: true, industry: true }`,
// so `region` is an object like { id, name, capital, code, ..., locations }.
// Rendering it directly threw "Objects are not valid as a React child".

test('company region relation resolves to a renderable name', () => {
  const region = {
    id: 'reg_littoral',
    name: 'Littoral',
    capital: 'Douala',
    code: 'LIT',
    description: null,
    isActive: true,
    locations: [{ id: 'loc_1', regionId: 'reg_littoral', city: 'Douala', isActive: true }],
  };

  const company = {
    name: 'MTN Cameroon',
    industry: { id: 'ind_tech', name: 'Telecommunications', slug: 'telco' },
    region,
    city: 'Douala',
  };

  assert.equal(regionNameOf(company), 'Littoral');
  assert.equal(industryNameOf(company), 'Telecommunications');

  // Every value the card interpolates must be a primitive, or React throws.
  const rendered = [company.name, industryNameOf(company), company.city, regionNameOf(company)];
  for (const value of rendered) {
    assert.equal(typeof value, 'string', `"${String(value)}" must be renderable`);
  }

  // The region dropdown compares against the resolved name, not the object.
  assert.equal(regionNameOf(company) === 'Littoral', true);
  assert.equal(regionNameOf(company) === 'Centre', false);
});

test('company search tolerates a non-matching term without throwing', () => {
  // Previously: `c.industry.toLowerCase()` on a relation object. The throw was
  // masked by || short-circuiting on an empty search, then fired on first
  // keystroke that did not match the company name.
  const company = {
    name: 'MTN Cameroon',
    industry: { id: 'ind_tech', name: 'Telecommunications' },
    region: { id: 'reg_littoral', name: 'Littoral' },
    city: 'Douala',
  };

  const haystack = [company.name, industryNameOf(company), company.city, regionNameOf(company)]
    .filter((v): v is string => typeof v === 'string' && v.length > 0)
    .join(' ')
    .toLowerCase();

  assert.equal(haystack.includes('telecommunications'), true, 'industry is searchable by name');
  assert.equal(haystack.includes('douala'), true, 'city is searchable');
  assert.equal(haystack.includes('littoral'), true, 'region is searchable by name');
  assert.equal(haystack.includes('zzzz'), false, 'unrelated term simply yields no match');
});

test('company card degrades gracefully when region and city are absent', () => {
  const company = { name: 'Acme', industry: null, region: null, city: null };
  assert.equal(regionNameOf(company), null);
  assert.equal(industryNameOf(company), null);

  const location = [company.city, regionNameOf(company)].filter(Boolean).join(', ');
  assert.equal(location, '', 'no stray "null, undefined" or empty badge is rendered');
});