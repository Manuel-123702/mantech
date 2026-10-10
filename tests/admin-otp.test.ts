/**
 * Admin 2FA core (SRS security hardening): code shape, hashing-at-rest,
 * signed session cookie, masking. Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ADMIN_SESSION_TTL_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_TTL_SECONDS,
  formatAdminOtpWhatsAppMessage,
  generateOtpCode,
  hashOtpCode,
  isWellFormedOtpCode,
  maskWhatsAppDestination,
  normalizeOtpEmail,
  signAdminOtpSession,
  timingSafeEqualString,
  verifyAdminOtpSession,
  verifyOtpHash,
} from '../lib/admin-otp.ts';

const PEPPER = 'test-pepper-only';

test('policy constants match the owner-approved spec', () => {
  assert.equal(OTP_TTL_SECONDS, 60, 'codes expire after 60 seconds');
  assert.equal(OTP_MAX_ATTEMPTS, 3, 'three chances per code');
  assert.equal(ADMIN_SESSION_TTL_SECONDS, 60 * 60, 'verified session lasts 60 minutes');
});

test('generateOtpCode always yields a 6-digit zero-padded string', () => {
  for (let i = 0; i < 200; i += 1) {
    const code = generateOtpCode();
    assert.match(code, /^\d{6}$/);
  }
});

test('generateOtpCode produces varied values', () => {
  const seen = new Set<string>();
  for (let i = 0; i < 300; i += 1) seen.add(generateOtpCode());
  assert.ok(seen.size > 100, `expected variety, got ${seen.size} distinct codes`);
});

test('hashOtpCode is deterministic, email-scoped and never stores plaintext', async () => {
  const email = 'Owner@Mantech.Nexus';
  const code = '042113';
  const hash = await hashOtpCode({ email, code, pepper: PEPPER });
  const again = await hashOtpCode({ email, code, pepper: PEPPER });

  assert.equal(hash, again, 'same inputs produce the same hash');
  assert.match(hash, /^[0-9a-f]{64}$/, 'sha-256 hex digest');
  assert.ok(!hash.includes(code), 'plaintext code must not appear in the hash');

  const otherEmail = await hashOtpCode({ email: 'other@mantech.nexus', code, pepper: PEPPER });
  assert.notEqual(hash, otherEmail, 'hashes are bound to the email');
  const otherPepper = await hashOtpCode({ email, code, pepper: 'different' });
  assert.notEqual(hash, otherPepper, 'hashes are bound to the pepper');
});

test('verifyOtpHash accepts the right code and rejects everything else', async () => {
  const email = 'admin@mantech.nexus';
  const code = '900007';
  const storedHash = await hashOtpCode({ email, code, pepper: PEPPER });

  assert.equal(
    await verifyOtpHash({ storedHash, email, code, pepper: PEPPER }),
    true,
    'correct code verifies',
  );
  assert.equal(
    await verifyOtpHash({ storedHash, email, code: '900008', pepper: PEPPER }),
    false,
    'one digit off must fail',
  );
  assert.equal(
    await verifyOtpHash({ storedHash, email: 'attacker@mantech.nexus', code, pepper: PEPPER }),
    false,
    'code cannot be replayed for another email',
  );
});

test('isWellFormedOtpCode rejects non 6-digit input', () => {
  assert.equal(isWellFormedOtpCode('123456'), true);
  assert.equal(isWellFormedOtpCode('000000'), true, 'leading zeros are valid');
  assert.equal(isWellFormedOtpCode('12345'), false);
  assert.equal(isWellFormedOtpCode('1234567'), false);
  assert.equal(isWellFormedOtpCode('12345a'), false);
  assert.equal(isWellFormedOtpCode(123456), false, 'numbers are not accepted, only strings');
});

test('signed admin session round-trips and carries the email', async () => {
  const token = await signAdminOtpSession({ email: 'Owner@Mantech.Nexus', secret: PEPPER });
  const session = await verifyAdminOtpSession(token, { secret: PEPPER });
  assert.ok(session);
  assert.equal(session.email, 'owner@mantech.nexus', 'email normalized to lowercase');
});

test('admin session rejects tampering, wrong secret, garbage and expiry', async () => {
  const token = await signAdminOtpSession({ email: 'admin@mantech.nexus', secret: PEPPER });

  const tampered = `${token.slice(0, -2)}xy`;
  assert.equal(await verifyAdminOtpSession(tampered, { secret: PEPPER }), null, 'tampered token');
  assert.equal(
    await verifyAdminOtpSession(token, { secret: 'other-secret' }),
    null,
    'wrong signing secret',
  );
  assert.equal(await verifyAdminOtpSession('not-a-token', { secret: PEPPER }), null, 'garbage');
  assert.equal(await verifyAdminOtpSession('', { secret: PEPPER }), null, 'empty');
  assert.equal(await verifyAdminOtpSession(undefined, { secret: PEPPER }), null, 'missing cookie');

  const now = Date.now();
  const expired = await signAdminOtpSession({
    email: 'admin@mantech.nexus',
    secret: PEPPER,
    ttlSeconds: 60,
    now: now - 120_000,
  });
  assert.equal(await verifyAdminOtpSession(expired, { secret: PEPPER, now }), null, 'past expiry');

  const future = await signAdminOtpSession({
    email: 'admin@mantech.nexus',
    secret: PEPPER,
    now: now + 10 * 60_000,
  });
  assert.equal(await verifyAdminOtpSession(future, { secret: PEPPER, now }), null, 'future iat');
});

test('session payload cannot be rewritten without the secret', async () => {
  const token = await signAdminOtpSession({ email: 'real@mantech.nexus', secret: PEPPER });
  const [body] = token.split('.');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as {
    email: string;
  };
  payload.email = 'attacker@mantech.nexus';
  const forgedBody = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const forged = `${forgedBody}.${token.split('.')[1]}`;
  assert.equal(await verifyAdminOtpSession(forged, { secret: PEPPER }), null);
});

test('masking never leaks the full destination', () => {
  const masked = maskWhatsAppDestination('237650921917');
  assert.equal(masked, '+237 ••• •• •• 17');
  assert.ok(!masked.includes('50921'));
  assert.equal(maskWhatsAppDestination('12'), '•••');
});

test('normalizeOtpEmail trims and lowercases', () => {
  assert.equal(normalizeOtpEmail('  Owner@Mantech.NEXUS '), 'owner@mantech.nexus');
});

test('timingSafeEqualString compares fully', () => {
  assert.equal(timingSafeEqualString('abc', 'abc'), true);
  assert.equal(timingSafeEqualString('abc', 'abd'), false);
  assert.equal(timingSafeEqualString('abc', 'abcd'), false, 'length mismatch fails');
  assert.equal(timingSafeEqualString('', ''), true);
});

test('WhatsApp OTP message includes the code, TTL and a share warning', () => {
  const message = formatAdminOtpWhatsAppMessage('123456');
  assert.ok(message.includes('123456'));
  assert.ok(message.includes('60 seconds'));
  assert.ok(message.toLowerCase().includes('never share'));
});
