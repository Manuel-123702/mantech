/**
 * Boost rules — day guards, window math and status/decision guards.
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BOOST_MIN_DAYS,
  BOOST_MAX_DAYS,
  BOOST_DAY_OPTIONS,
  BOOST_STATUSES,
  BOOST_STATUS_LABELS,
  isValidBoostDays,
  boostEndsAt,
  isBoostWindowOver,
  canDecideBoost,
  canRequestBoost,
} from '../lib/boost-rules.ts';

test('day guard accepts only integers inside the 1-90 range', () => {
  for (const days of [BOOST_MIN_DAYS, 7, 30, BOOST_MAX_DAYS]) {
    assert.equal(isValidBoostDays(days), true);
  }
  assert.equal(isValidBoostDays(0), false);
  assert.equal(isValidBoostDays(-3), false);
  assert.equal(isValidBoostDays(BOOST_MAX_DAYS + 1), false);
  assert.equal(isValidBoostDays(7.5), false);
  assert.equal(isValidBoostDays(NaN), false);
  assert.equal(isValidBoostDays('14'), false);
  assert.equal(isValidBoostDays(null), false);
});

test('preset day options are valid boost lengths', () => {
  for (const days of BOOST_DAY_OPTIONS) assert.equal(isValidBoostDays(days), true);
});

test('boostEndsAt adds whole days to the start time', () => {
  const start = new Date('2026-01-01T00:00:00.000Z');
  assert.equal(boostEndsAt(7, start).toISOString(), '2026-01-08T00:00:00.000Z');
  assert.equal(boostEndsAt(1, start).toISOString(), '2026-01-02T00:00:00.000Z');
  assert.equal(boostEndsAt(90, start).toISOString(), '2026-04-01T00:00:00.000Z');
});

test('isBoostWindowOver is inclusive at the boundary and false without an end', () => {
  const now = new Date('2026-06-15T12:00:00.000Z');
  assert.equal(isBoostWindowOver(new Date('2026-06-15T12:00:00.000Z'), now), true);
  assert.equal(isBoostWindowOver(new Date('2026-06-15T11:59:59.999Z'), now), true);
  assert.equal(isBoostWindowOver(new Date('2026-06-15T12:00:00.001Z'), now), false);
  assert.equal(isBoostWindowOver(null, now), false);
  assert.equal(isBoostWindowOver(undefined, now), false);
});

test('only REQUESTED boosts can be decided by an admin', () => {
  assert.equal(canDecideBoost('REQUESTED'), true);
  for (const status of ['APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED', '', null, 42]) {
    assert.equal(canDecideBoost(status), false);
  }
});

test('only PUBLISHED opportunities can be boosted', () => {
  assert.equal(canRequestBoost('PUBLISHED'), true);
  for (const status of ['DRAFT', 'PENDING_REVIEW', 'REJECTED', 'ARCHIVED', '', null]) {
    assert.equal(canRequestBoost(status), false);
  }
});

test('every status has a display label', () => {
  for (const status of BOOST_STATUSES) {
    assert.equal(typeof BOOST_STATUS_LABELS[status], 'string');
    assert.ok(BOOST_STATUS_LABELS[status].length > 0);
  }
});