/**
 * Intern History timeline (SRS §7, §11).
 *
 * The journey must be derived from real records only — never fabricated — and
 * must never leak data from one intern into another's timeline.
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildInternHistory,
  summarizeHistory,
  statusLabel,
  type HistoryApplication,
  type InternHistoryInput,
} from '../lib/intern-history.ts';

const PROFILE_DATE = new Date('2026-01-10T08:00:00.000Z');

function baseInput(overrides: Partial<InternHistoryInput> = {}): InternHistoryInput {
  return {
    applications: [],
    achievements: [],
    profileCreatedAt: PROFILE_DATE,
    hasPassport: false,
    hasCv: false,
    passportNumber: null,
    ...overrides,
  };
}

function application(overrides: Partial<HistoryApplication> = {}): HistoryApplication {
  return {
    id: 'app-1',
    status: 'SUBMITTED',
    createdAt: new Date('2026-02-01T09:00:00.000Z'),
    opportunity: { title: 'Backend Intern', organization: { name: 'Mantech Labs' } },
    statusHistory: [],
    interviews: [],
    placement: null,
    ...overrides,
  };
}

// ── Empty / baseline journey ───────────────────────────────────────────────

test('a brand new intern still has a non-empty journey', () => {
  const entries = buildInternHistory(baseInput());
  assert.equal(entries.length, 1);
  assert.equal(entries[0]!.title, 'Joined MANTECH');
  assert.equal(entries[0]!.tone, 'milestone');
});

test('passport and CV milestones only appear when they actually exist', () => {
  const bare = buildInternHistory(baseInput());
  assert.equal(bare.some((e) => e.title === 'Intern Passport issued'), false);
  assert.equal(bare.some((e) => e.title === 'CV uploaded'), false);

  const complete = buildInternHistory(
    baseInput({ hasPassport: true, hasCv: true, passportNumber: 'MTN-CM-2026-0042' }),
  );
  const passport = complete.find((e) => e.title === 'Intern Passport issued');
  assert.ok(passport, 'passport milestone must be present');
  assert.match(passport!.description, /MTN-CM-2026-0042/);
  assert.equal(complete.some((e) => e.title === 'CV uploaded'), true);
});

test('an application produces an entry carrying its real organization', () => {
  const entries = buildInternHistory(baseInput({ applications: [application()] }));
  const applied = entries.find((e) => e.category === 'application');
  assert.ok(applied);
  assert.equal(applied!.title, 'Applied to Backend Intern');
  assert.equal(applied!.organization, 'Mantech Labs');
});

test('status transitions are projected and the initial submit is not duplicated', () => {
  const entries = buildInternHistory(
    baseInput({
      applications: [
        application({
          statusHistory: [
            { id: 'h1', status: 'SUBMITTED', createdAt: new Date('2026-02-01T09:00:00Z') },
            { id: 'h2', status: 'SHORTLISTED', createdAt: new Date('2026-02-05T09:00:00Z') },
            { id: 'h3', status: 'INTERVIEW', createdAt: new Date('2026-02-09T09:00:00Z') },
          ],
        }),
      ],
    }),
  );

  const statuses = entries.filter((e) => e.category === 'status');
  assert.deepEqual(
    statuses.map((e) => e.title).sort(),
    ['Interview stage', 'Shortlisted'],
    'SUBMITTED must not repeat as a separate transition',
  );
});
// __APPEND_TESTS__
test('shortlisting reads as progress while selection reads as a milestone', () => {
  const short = buildInternHistory(
    baseInput({
      applications: [
        application({
          status: 'SHORTLISTED',
          statusHistory: [{ id: 'h', status: 'SHORTLISTED', createdAt: new Date('2026-02-05T09:00:00Z') }],
        }),
      ],
    }),
  );
  assert.equal(short.find((e) => e.title === 'Shortlisted')!.tone, 'progress');

  const selected = buildInternHistory(
    baseInput({
      applications: [
        application({
          status: 'SELECTED',
          statusHistory: [{ id: 'h', status: 'SELECTED', createdAt: new Date('2026-02-05T09:00:00Z') }],
        }),
      ],
    }),
  );
  assert.equal(selected.find((e) => e.title === 'Selected')!.tone, 'milestone');
});

test('a rejection is shown as closed, never as progress', () => {
  const entries = buildInternHistory(
    baseInput({
      applications: [
        application({
          status: 'REJECTED',
          statusHistory: [{ id: 'h', status: 'REJECTED', createdAt: new Date('2026-02-06T09:00:00Z') }],
        }),
      ],
    }),
  );
  const rejected = entries.find((e) => e.title === 'Application closed');
  assert.ok(rejected);
  assert.equal(rejected!.tone, 'closed');
});

test('interviews are projected and a cancelled one is not counted as progress', () => {
  const entries = buildInternHistory(
    baseInput({
      applications: [
        application({
          interviews: [
            { id: 'i1', scheduledAt: new Date('2026-02-10T10:00:00Z'), status: 'scheduled', type: 'online' },
            { id: 'i2', scheduledAt: new Date('2026-02-12T10:00:00Z'), status: 'cancelled', type: 'onsite' },
          ],
        }),
      ],
    }),
  );

  assert.equal(entries.filter((e) => e.category === 'interview').length, 2);
  const cancelled = entries.find((e) => e.title === 'Interview cancelled');
  assert.equal(cancelled!.tone, 'closed');

  assert.equal(summarizeHistory(entries).interviews, 1, 'only the live interview counts');
});

test('a placement becomes a milestone with a readable duration', () => {
  const entries = buildInternHistory(
    baseInput({
      applications: [
        application({
          placement: {
            id: 'pl1',
            status: 'CONFIRMED',
            startDate: new Date('2026-03-01T00:00:00Z'),
            endDate: new Date('2026-08-01T00:00:00Z'),
            department: 'Engineering',
          },
        }),
      ],
    }),
  );

  const placement = entries.find((e) => e.category === 'placement');
  assert.ok(placement);
  assert.equal(placement!.tone, 'milestone');
  assert.match(placement!.description, /Department: Engineering/);
  assert.match(placement!.description, /5 months/);
  assert.equal(summarizeHistory(entries).placements, 1);
});

test('achievements from the passport appear as milestones', () => {
  const entries = buildInternHistory(
    baseInput({
      achievements: [
        {
          id: 'a1',
          title: 'Certified Data Analyst',
          category: 'certification',
          issuer: 'MANTECH Academy',
          issueDate: new Date('2026-04-15T00:00:00Z'),
          description: null,
        },
      ],
    }),
  );
  const achievement = entries.find((e) => e.category === 'achievement');
  assert.ok(achievement);
  assert.equal(achievement!.tone, 'milestone');
  assert.match(achievement!.description, /MANTECH Academy/);
  assert.equal(summarizeHistory(entries).achievements, 1);
});

// ── Ordering & integrity ───────────────────────────────────────────────────

test('history is ordered newest first', () => {
  const entries = buildInternHistory(
    baseInput({
      applications: [
        application({
          id: 'old',
          createdAt: new Date('2026-02-01T09:00:00Z'),
          statusHistory: [{ id: 'h-old', status: 'SHORTLISTED', createdAt: new Date('2026-02-03T09:00:00Z') }],
        }),
        application({
          id: 'new',
          createdAt: new Date('2026-05-01T09:00:00Z'),
          statusHistory: [{ id: 'h-new', status: 'SELECTED', createdAt: new Date('2026-05-04T09:00:00Z') }],
        }),
      ],
      achievements: [
        {
          id: 'ach',
          title: 'Internship Certificate',
          category: 'verified_internship',
          issuer: 'Mantech Labs',
          issueDate: new Date('2026-08-20T00:00:00Z'),
          description: null,
        },
      ],
    }),
  );

  const times = entries.map((e) => Date.parse(e.occurredAt));
  assert.deepEqual(times, [...times].sort((a, b) => b - a), 'entries must read newest first');
});

test('entry ids are unique so React keys are stable', () => {
  const entries = buildInternHistory(
    baseInput({
      applications: [
        application({
          statusHistory: [
            { id: 'h1', status: 'SHORTLISTED', createdAt: new Date('2026-02-05T09:00:00Z') },
            { id: 'h2', status: 'INTERVIEW', createdAt: new Date('2026-02-06T09:00:00Z') },
          ],
        }),
      ],
    }),
  );
  const ids = entries.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate ids would break list rendering');
});

test('ordering is deterministic for entries sharing a timestamp', () => {
  const input = baseInput({ hasPassport: true, hasCv: true });
  assert.deepEqual(
    buildInternHistory(input).map((e) => e.id),
    buildInternHistory(input).map((e) => e.id),
  );
});

test('every entry carries a title, a valid date and an internal deep link', () => {
  const entries = buildInternHistory(
    baseInput({ applications: [application()], hasPassport: true }),
  );
  for (const entry of entries) {
    assert.ok(entry.title.length > 0, 'entry must have a title');
    assert.ok(!Number.isNaN(Date.parse(entry.occurredAt)), 'entry must have a valid date');
    assert.ok(entry.href === null || entry.href.startsWith('/'), 'links stay internal');
  }
});

test('summary totals match the rendered entries', () => {
  const entries = buildInternHistory(
    baseInput({
      applications: [
        application({
          status: 'INTERVIEW',
          interviews: [{ id: 'i', scheduledAt: new Date('2026-02-10T10:00:00Z'), status: 'scheduled', type: 'online' }],
        }),
        application({ id: 'app-2', createdAt: new Date('2026-03-01T09:00:00Z') }),
      ],
      achievements: [
        { id: 'ach', title: 'Cert', category: 'certification', issuer: 'Org', issueDate: new Date('2026-04-01T00:00:00Z'), description: null },
      ],
    }),
  );
  const summary = summarizeHistory(entries);
  assert.equal(summary.total, entries.length);
  assert.equal(summary.applications, 2);
  assert.equal(summary.interviews, 1);
  assert.equal(summary.achievements, 1);
});

test('statusLabel humanises known and unknown statuses', () => {
  assert.equal(statusLabel('SHORTLISTED'), 'Shortlisted');
  assert.equal(statusLabel('SOMETHING_NEW'), 'something new');
});

// ── Privacy (SRS §7 — a timeline must never expose private intern data) ────

test('the timeline builder returns only what it was given', () => {
  const mine = buildInternHistory(
    baseInput({
      applications: [
        application({ opportunity: { title: 'My Role', organization: { name: 'My Org' } } }),
      ],
    }),
  );
  const serialized = JSON.stringify(mine);
  assert.equal(serialized.includes('My Org'), true);
  assert.equal(serialized.includes('My Role'), true);
  // No CV URL, storage key or phone number may ever appear in a timeline.
  assert.equal(/"cvUrl"|"fileKey"|"phone"/.test(serialized), false);
});