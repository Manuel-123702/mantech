/**
 * Opportunity-alert matching + message builders.
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  matchesAlert,
  findAlertMatches,
  isBroadAlert,
  normalizeWorkMode,
  type AlertCriteria,
} from '../lib/alert-matching.ts';
import {
  buildOpportunityAlert,
  buildOpportunityDigest,
  buildListingWhatsAppAlert,
  type AlertOpportunityCard,
} from '../lib/alert-messages.ts';

const criteria = (c: Partial<AlertCriteria> = {}): AlertCriteria => ({
  regions: c.regions ?? [],
  cities: c.cities ?? [],
  workModes: c.workModes ?? [],
});

test('a broad alert (no preferences) matches any opportunity', () => {
  const c = criteria();
  assert.equal(isBroadAlert(c), true);
  assert.equal(matchesAlert(c, { regionName: 'Littoral', city: 'Douala', workMode: 'REMOTE' }), true);
  assert.equal(matchesAlert(c, { regionName: 'Far North', city: 'Maroua', workMode: 'ONSITE' }), true);
});

test('region filter matches case-insensitively and rejects other regions', () => {
  const c = criteria({ regions: ['Littoral'] });
  assert.equal(matchesAlert(c, { regionName: 'littoral' }), true);
  assert.equal(matchesAlert(c, { regionName: '  Littoral  ' }), true);
  assert.equal(matchesAlert(c, { regionName: 'Centre' }), false);
});

test('city filter matches only the listed city', () => {
  const c = criteria({ cities: ['Douala'] });
  assert.equal(matchesAlert(c, { city: 'douala' }), true);
  assert.equal(matchesAlert(c, { city: 'Yaoundé' }), false);
});

test('work-mode filter treats onsite variants as equal', () => {
  assert.equal(normalizeWorkMode('On-site'), 'onsite');
  assert.equal(normalizeWorkMode('on site'), 'onsite');
  assert.equal(normalizeWorkMode('ONSITE'), 'onsite');
  assert.equal(normalizeWorkMode('Hybrid'), 'hybrid');

  const c = criteria({ workModes: ['onsite'] });
  assert.equal(matchesAlert(c, { workMode: 'on-site' }), true);
  assert.equal(matchesAlert(c, { workMode: 'REMOTE' }), false);
});

test('multiple non-empty preferences are combined with AND', () => {
  const c = criteria({ regions: ['Littoral'], workModes: ['remote'] });
  // region OK + mode OK
  assert.equal(matchesAlert(c, { regionName: 'Littoral', workMode: 'remote' }), true);
  // region OK but mode wrong
  assert.equal(matchesAlert(c, { regionName: 'Littoral', workMode: 'onsite' }), false);
  // mode OK but region wrong
  assert.equal(matchesAlert(c, { regionName: 'Centre', workMode: 'remote' }), false);
});

test('findAlertMatches keeps only matching opportunities, preserving order', () => {
  const opps = [
    { id: 'a', regionName: 'Littoral', city: 'Douala' },
    { id: 'b', regionName: 'Centre', city: 'Yaoundé' },
    { id: 'c', regionName: 'Littoral', city: 'Douala' },
  ];
  const matched = findAlertMatches(criteria({ cities: ['Douala'] }), opps);
  assert.deepEqual(matched.map((o) => o.id), ['a', 'c']);
});

test('a region with a missing opportunity value never matches a non-empty region filter', () => {
  const c = criteria({ regions: ['Littoral'] });
  assert.equal(matchesAlert(c, { regionName: null }), false);
  assert.equal(matchesAlert(c, {}), false);
});

test('single opportunity alert email contains the essentials', () => {
  const { subject, message } = buildOpportunityAlert({
    title: 'Backend Intern',
    organizationName: 'Orange Cameroun',
    city: 'Douala',
    regionName: 'Littoral',
    workMode: 'hybrid',
    url: 'https://mantech.test/internships/backend-intern',
  });
  assert.match(subject, /Backend Intern/);
  assert.match(message, /Orange Cameroun/);
  assert.match(message, /Douala, Littoral/);
  assert.match(message, /Hybrid/);
  assert.match(message, /https:\/\/mantech\.test\/internships\/backend-intern/);
});

test('digest email lists every opportunity and pluralises the subject', () => {
  const opps: AlertOpportunityCard[] = [
    { title: 'Backend Intern', organizationName: 'Orange', city: 'Douala', workMode: 'remote', url: 'https://x/1' },
    { title: 'Data Intern', organizationName: 'MTN', city: 'Yaoundé', workMode: 'onsite', url: 'https://x/2' },
  ];
  const { subject, message } = buildOpportunityDigest(opps);
  assert.match(subject, /^2 new internships/);
  assert.match(message, /Backend Intern/);
  assert.match(message, /Data Intern/);
  assert.match(message, /https:\/\/x\/1/);
  assert.match(message, /https:\/\/x\/2/);
});

test('instant WhatsApp alert names the listing kind and deep link', () => {
  const wa = buildListingWhatsAppAlert({
    title: 'Backend Intern',
    organizationName: 'Orange Cameroun',
    city: 'Douala',
    regionName: 'Littoral',
    workMode: 'hybrid',
    url: 'https://mantech.test/internships/backend-intern',
    kind: 'internship',
  });
  assert.match(wa, /New internship alert/);
  assert.match(wa, /Backend Intern/);
  assert.match(wa, /Orange Cameroun/);
  assert.match(wa, /Douala, Littoral/);
  assert.match(wa, /https:\/\/mantech\.test\/internships\/backend-intern/);
  assert.match(wa, /STOP/);
});

test('instant WhatsApp alert labels jobs and routes to /jobs', () => {
  const wa = buildListingWhatsAppAlert({
    title: 'Senior Accountant',
    organizationName: 'SABC',
    city: 'Yaoundé',
    workMode: 'onsite',
    url: 'https://mantech.test/jobs/senior-accountant',
    kind: 'job',
  });
  assert.match(wa, /New job alert/);
  assert.match(wa, /Senior Accountant/);
  assert.match(wa, /https:\/\/mantech\.test\/jobs\/senior-accountant/);
});

test('instant WhatsApp alert never crashes when the org is missing', () => {
  const wa = buildListingWhatsAppAlert({
    title: 'Field Volunteer',
    url: 'https://mantech.test/internships/field-volunteer',
  });
  assert.match(wa, /Field Volunteer/);
  assert.match(wa, /Cameroon/);
});
