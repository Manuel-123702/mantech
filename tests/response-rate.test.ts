import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeResponseRate,
  MIN_APPLICATIONS,
  RESPONSE_WINDOW_DAYS,
} from '../lib/response-rate.ts';

const DAY = 24 * 60 * 60 * 1000;

function submittedOn(day: number) {
  return new Date(Date.UTC(2026, 0, 1 + day));
}

function historyEntry(status: string, day: number) {
  return { status, createdAt: submittedOn(day) };
}

test('empty history means zero applications, no badge', () => {
  const stats = computeResponseRate([]);
  assert.equal(stats.received, 0);
  assert.equal(stats.ratePercent, 0);
  assert.equal(stats.publishable, false);
  assert.equal(stats.label, null);
});

test('the initial SUBMITTED entry never counts as a recruiter response', () => {
  const stats = computeResponseRate([
    { createdAt: submittedOn(0), history: [historyEntry('SUBMITTED', 0)] },
  ]);
  assert.equal(stats.responded, 0);
  assert.equal(stats.ratePercent, 0);
});

test('a fast status change counts as responded within the window', () => {
  const stats = computeResponseRate([
    {
      createdAt: submittedOn(0),
      history: [historyEntry('SUBMITTED', 0), historyEntry('UNDER_REVIEW', 2)],
    },
  ]);
  assert.equal(stats.responded, 1);
  assert.equal(stats.respondedWithinWindow, 1);
  assert.equal(stats.ratePercent, 100);
});

test('a response after the window still counts as responded, not as fast', () => {
  const stats = computeResponseRate([
    {
      createdAt: submittedOn(0),
      history: [historyEntry('SUBMITTED', 0), historyEntry('SHORTLISTED', RESPONSE_WINDOW_DAYS + 1)],
    },
  ]);
  assert.equal(stats.responded, 1);
  assert.equal(stats.respondedWithinWindow, 0);
});

test('a response exactly at the window boundary counts as fast', () => {
  const stats = computeResponseRate([
    {
      createdAt: submittedOn(0),
      history: [historyEntry('SUBMITTED', 0), historyEntry('UNDER_REVIEW', RESPONSE_WINDOW_DAYS)],
    },
  ]);
  assert.equal(stats.respondedWithinWindow, 1);
});

test('the badge is hidden until the sample is large enough', () => {
  const few = Array.from({ length: MIN_APPLICATIONS - 1 }, () => ({
    createdAt: submittedOn(0),
    history: [historyEntry('SUBMITTED', 0), historyEntry('UNDER_REVIEW', 1)],
  }));
  const fewStats = computeResponseRate(few);
  assert.equal(fewStats.publishable, false);
  assert.equal(fewStats.label, null);

  const enough = [...few, { createdAt: submittedOn(0), history: [historyEntry('SUBMITTED', 0)] }];
  const enoughStats = computeResponseRate(enough);
  assert.equal(enoughStats.publishable, true);
  assert.equal(enoughStats.label, 'Usually replies within a week');
});

test('labels track the overall response rate', () => {
  const make = (responded: number, total: number) =>
    Array.from({ length: total }, (_, index) => ({
      createdAt: submittedOn(0),
      history:
        index < responded
          ? [historyEntry('SUBMITTED', 0), historyEntry('UNDER_REVIEW', 1)]
          : [historyEntry('SUBMITTED', 0)],
    }));
  assert.equal(computeResponseRate(make(10, 10)).label, 'Usually replies within a week');
  assert.equal(computeResponseRate(make(8, 10)).label, 'Usually replies within a week');
  assert.equal(computeResponseRate(make(6, 10)).label, 'Replies to about half of applicants');
  assert.equal(computeResponseRate(make(2, 10)).label, 'Replies to some applicants');
  assert.equal(computeResponseRate(make(0, 10)).label, 'Replies rarely so far');
});
