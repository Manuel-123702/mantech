/**
 * Referral code primitives — generation + format guard.
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateReferralCode,
  isReferralCodeFormat,
  REFERRAL_CODE_LENGTH,
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE,
} from '../lib/referral-codes.ts';

test('generated codes have the expected length and alphabet', () => {
  for (let i = 0; i < 200; i += 1) {
    const code = generateReferralCode();
    assert.equal(code.length, REFERRAL_CODE_LENGTH);
    assert.equal(
      isReferralCodeFormat(code),
      true,
      `generated code ${code} must pass the format guard`,
    );
  }
});

test('generator respects an injected random source (deterministic in tests)', () => {
  // Always index 0 → first alphabet character, repeated.
  const code = generateReferralCode(() => 0);
  assert.equal(code.length, REFERRAL_CODE_LENGTH);
  assert.equal(new Set(code).size, 1);
});

test('format guard accepts real codes and rejects junk', () => {
  assert.equal(isReferralCodeFormat('K7MQ2XBD'), true);
  // Wrong length.
  assert.equal(isReferralCodeFormat('K7MQ2XB'), false);
  assert.equal(isReferralCodeFormat('K7MQ2XBDX'), false);
  // Look-alike / ambiguous characters are not in the alphabet (0, O, 1, I).
  assert.equal(isReferralCodeFormat('0O1I0O1I'), false);
  // Lowercase, spaces and URL noise are rejected.
  assert.equal(isReferralCodeFormat('k7mq2xbd'), false);
  assert.equal(isReferralCodeFormat(' K7MQ2XB'), false);
  assert.equal(isReferralCodeFormat('K7MQ2XB%20'), false);
  assert.equal(isReferralCodeFormat(''), false);
});

test('cookie constants are sane', () => {
  assert.equal(REFERRAL_COOKIE, 'mantech_referral');
  // 30 days in seconds.
  assert.equal(REFERRAL_COOKIE_MAX_AGE, 60 * 60 * 24 * 30);
});