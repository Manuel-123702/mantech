/**
 * Rate limiter (SRS §20 — mandatory) and privacy redaction (SRS §7).
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  rateLimit,
  resetAllRateLimits,
  rateLimitHeaders,
  clientKey,
  RATE_LIMITS,
} from '../lib/rate-limit.ts';
import { redactPrivateInternData } from '../lib/privacy.ts';

test.beforeEach(() => resetAllRateLimits());

test('rateLimit allows requests up to the configured limit', () => {
  const rule = { limit: 3, windowMs: 60_000 };
  assert.equal(rateLimit('a', rule).success, true);
  assert.equal(rateLimit('a', rule).success, true);
  assert.equal(rateLimit('a', rule).success, true, 'third call is the last allowed');
});

test('rateLimit blocks once the limit is exceeded', () => {
  const rule = { limit: 2, windowMs: 60_000 };
  rateLimit('b', rule);
  rateLimit('b', rule);
  const third = rateLimit('b', rule);
  assert.equal(third.success, false, 'fourth call must be rejected');
  assert.equal(third.remaining, 0);
});

test('rateLimit isolates keys from each other', () => {
  const rule = { limit: 1, windowMs: 60_000 };
  assert.equal(rateLimit('ip-1', rule).success, true);
  assert.equal(rateLimit('ip-1', rule).success, false, 'ip-1 is exhausted');
  assert.equal(rateLimit('ip-2', rule).success, true, 'ip-2 must be unaffected');
});

test('rateLimit reports remaining budget and resets after the window', async () => {
  const rule = { limit: 5, windowMs: 40 };
  const first = rateLimit('c', rule);
  assert.equal(first.remaining, 4);
  assert.equal(first.limit, 5);
  await new Promise((r) => setTimeout(r, 60));
  const afterWindow = rateLimit('c', rule);
  assert.equal(afterWindow.success, true, 'window must roll over');
  assert.equal(afterWindow.remaining, 4, 'count restarts in the new window');
});

test('rateLimitHeaders exposes standard budget headers', () => {
  const headers = rateLimitHeaders(rateLimit('d', { limit: 10, windowMs: 60_000 }));
  assert.equal(headers['X-RateLimit-Limit'], '10');
  assert.equal(headers['X-RateLimit-Remaining'], '9');
  assert.ok(Number(headers['X-RateLimit-Reset']) > 0);
});

test('clientKey falls back to "unknown" rather than throwing', () => {
  const key = clientKey(new Request('http://x/api', { headers: {} }), 'api:/internships');
  assert.equal(key, 'api:/internships:unknown');
});

test('clientKey prefers the forwarded client IP', () => {
  const key = clientKey(
    new Request('http://x/api', { headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' } }),
    'api:/x',
  );
  assert.equal(key, 'api:/x:203.0.113.7', 'first hop is the real client');
});

test('shipped write budget is stricter than the read budget', () => {
  assert.ok(
    RATE_LIMITS.write.limit < RATE_LIMITS.api.limit,
    'write endpoints must have the tighter budget',
  );
});

// ── Privacy (SRS §7: CVs must never leak into org dashboards) ───────────────

test('redactPrivateInternData strips CV and file fields', () => {
  const input = {
    id: 'p1',
    fullName: 'Intern',
    cvUrl: 'https://storage/cv.pdf',
    resumeUrl: 'https://storage/resume.pdf',
    fileUrl: 'https://storage/file.pdf',
    fileKey: 'secret-key',
  };
  const output = redactPrivateInternData(input) as Record<string, unknown>;
  for (const key of ['cvUrl', 'resumeUrl', 'fileUrl', 'fileKey']) {
    assert.equal(key in output, false, `${key} must not be exposed`);
  }
  assert.equal(output.fullName, 'Intern', 'public fields survive');
});

test('redactPrivateInternData removes phone when the intern hid it', () => {
  const hidden = redactPrivateInternData({
    phone: '+237 6...',
    isPhonePublic: false,
  }) as Record<string, unknown>;
  assert.equal('phone' in hidden, false);

  const visible = redactPrivateInternData({
    phone: '+237 6...',
    isPhonePublic: true,
  }) as Record<string, unknown>;
  assert.equal(visible.phone, '+237 6...');
});

test('redactPrivateInternData walks nested structures and arrays', () => {
  const output = redactPrivateInternData({
    candidates: [{ id: 'a', cvUrl: 'x' }, { id: 'b', cvUrl: 'y' }],
  }) as { candidates: Record<string, unknown>[] };
  assert.equal('cvUrl' in output.candidates[0]!, false);
  assert.equal('cvUrl' in output.candidates[1]!, false);
  assert.equal(output.candidates[1]!.id, 'b');
});