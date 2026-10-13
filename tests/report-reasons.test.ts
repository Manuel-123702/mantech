/**
 * Moderation-report primitives — reason/target guards + details handling.
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  REPORT_REASONS,
  REPORT_TARGET_TYPES,
  REPORT_STATUSES,
  REPORT_DETAILS_MAX,
  isReportReason,
  isReportTargetType,
  isReportStatus,
  normalizeReportDetails,
  reportNeedsDetails,
} from '../lib/report-reasons.ts';

test('every declared reason/target/status is recognised by its guard', () => {
  for (const reason of REPORT_REASONS) assert.equal(isReportReason(reason), true);
  for (const target of REPORT_TARGET_TYPES) assert.equal(isReportTargetType(target), true);
  for (const status of REPORT_STATUSES) assert.equal(isReportStatus(status), true);
});

test('guards reject junk input', () => {
  assert.equal(isReportReason('scam'), false); // case-sensitive
  assert.equal(isReportReason('FREE'), false);
  assert.equal(isReportReason(42), false);
  assert.equal(isReportReason(null), false);
  assert.equal(isReportTargetType('ARTICLE'), false);
  assert.equal(isReportTargetType(''), false);
  assert.equal(isReportStatus('CLOSED'), false);
});

test('normalizeReportDetails trims, caps and nulls empty input', () => {
  assert.equal(normalizeReportDetails('  hello  '), 'hello');
  assert.equal(normalizeReportDetails('   '), null);
  assert.equal(normalizeReportDetails(''), null);
  assert.equal(normalizeReportDetails(undefined), null);
  assert.equal(normalizeReportDetails(123), null);
  const long = 'x'.repeat(REPORT_DETAILS_MAX + 200);
  assert.equal(normalizeReportDetails(long)?.length, REPORT_DETAILS_MAX);
});

test('OTHER reason requires details; every other reason does not', () => {
  assert.equal(reportNeedsDetails('OTHER', ''), true);
  assert.equal(reportNeedsDetails('OTHER', '   '), true);
  assert.equal(reportNeedsDetails('OTHER', null), true);
  assert.equal(reportNeedsDetails('OTHER', 'Explained'), false);
  assert.equal(reportNeedsDetails('SCAM', ''), false);
  assert.equal(reportNeedsDetails('SPAM', undefined), false);
});