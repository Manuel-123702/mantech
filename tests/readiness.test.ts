/**
 * Profile readiness checklist (SRS §6, §7).
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildReadinessChecklist,
  readinessPercent,
  nextActions,
  type ReadinessProfile,
} from '../lib/readiness.ts';

const COMPLETE: ReadinessProfile = {
  hasCv: true,
  hasPhoto: true,
  hasPhone: true,
  hasQualification: true,
  hasField: true,
  hasSkills: true,
  hasEducation: true,
  hasLocation: true,
  hasAvailability: true,
  hasSummary: true,
};

const EMPTY: ReadinessProfile = {
  hasCv: false,
  hasPhoto: false,
  hasPhone: false,
  hasQualification: false,
  hasField: false,
  hasSkills: false,
  hasEducation: false,
  hasLocation: false,
  hasAvailability: false,
  hasSummary: false,
};

test('an empty profile is 0% ready and every item is outstanding', () => {
  const items = buildReadinessChecklist(EMPTY);
  assert.equal(items.every((i) => !i.done), true);
  assert.equal(readinessPercent(items), 0);
});

test('a fully complete profile is 100% ready', () => {
  const items = buildReadinessChecklist(COMPLETE);
  assert.equal(items.every((i) => i.done), true);
  assert.equal(readinessPercent(items), 100);
});

test('the CV, phone and qualification are tracked as mandatory items', () => {
  const items = buildReadinessChecklist(EMPTY);
  const ids = items.map((i) => i.id);
  for (const mandatory of ['cv', 'phone', 'qualification']) {
    assert.ok(ids.includes(mandatory), `${mandatory} must be part of the checklist`);
  }
});

test('every checklist item links somewhere the intern can act', () => {
  const items = buildReadinessChecklist(EMPTY);
  for (const item of items) {
    assert.ok(item.href.startsWith('/'), `${item.id} must deep-link internally`);
    assert.ok(item.label.length > 0, `${item.id} needs a label`);
    assert.ok(item.detail.length > 0, `${item.id} needs an explanation`);
  }
});

test('readiness scales with completed items', () => {
  const half: ReadinessProfile = { ...EMPTY, hasCv: true, hasPhone: true, hasQualification: true, hasField: true, hasSkills: true };
  const percent = readinessPercent(buildReadinessChecklist(half));
  assert.equal(percent, 50);
});

test('next actions only lists outstanding items and respects the limit', () => {
  const partial: ReadinessProfile = { ...EMPTY, hasCv: true, hasPhoto: true };
  const todo = nextActions(buildReadinessChecklist(partial), 3);
  assert.equal(todo.length, 3);
  assert.equal(todo.every((i) => !i.done), true);
  assert.equal(todo.some((i) => i.id === 'cv'), false, 'completed items must not reappear');
});

test('a complete profile has no next actions', () => {
  assert.deepEqual(nextActions(buildReadinessChecklist(COMPLETE)), []);
});

test('readinessPercent never divides by zero', () => {
  assert.equal(readinessPercent([]), 0);
});