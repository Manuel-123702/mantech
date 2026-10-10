/**
 * Checks the rules behind the testimonial form.
 *
 * The promises we are proving:
 *   - Every field is required, except the photo.
 *   - "Choose" fields only accept an option from the list.
 *   - "Choose or type" fields also accept the visitor's own words.
 *   - A visitor cannot send the placeholder "Something else" as a real answer.
 *   - Ratings always land on a whole number between 1 and 5.
 *
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  OTHER_OPTION,
  TESTIMONIAL_FOCUSES,
  TESTIMONIAL_REGIONS,
  TESTIMONIAL_ROLES,
  checkTestimonialField,
  normaliseRating,
} from '../lib/testimonial-fields.ts';

test('only the photo may be left blank', () => {
  const optional = checkTestimonialField('photoUrl', '');
  assert.equal(optional.ok, true);
  assert.equal(optional.ok && optional.value, '');

  // Every other field refuses an empty answer, and says which one it was.
  for (const field of ['name', 'email', 'role', 'company', 'region', 'focus', 'message', 'details']) {
    const result = checkTestimonialField(field, '   ');
    assert.equal(result.ok, false, `${field} should be required`);
    assert.match(result.ok === false ? result.error : '', /required/i);
  }
});

test('whitespace never counts as an answer', () => {
  assert.equal(checkTestimonialField('name', '   \n  ').ok, false);
});

test('an answer that is too short is rejected with a helpful message', () => {
  const result = checkTestimonialField('name', 'A');
  assert.equal(result.ok, false);
  assert.match(result.ok === false ? result.error : '', /more detail/i);
});

test('an over-long answer is rejected', () => {
  const result = checkTestimonialField('name', 'x'.repeat(500));
  assert.equal(result.ok, false);
  assert.match(result.ok === false ? result.error : '', /under/i);
});

test('region must be one of the ten Cameroon regions', () => {
  for (const region of TESTIMONIAL_REGIONS) {
    assert.equal(checkTestimonialField('region', region).ok, true, region);
  }
  // A made-up region is not silently accepted.
  const invented = checkTestimonialField('region', 'Mars');
  assert.equal(invented.ok, false);
  assert.match(invented.ok === false ? invented.error : '', /from the list/i);
});

test('role accepts a listed option or the visitor\'s own words', () => {
  for (const role of TESTIMONIAL_ROLES) {
    assert.equal(checkTestimonialField('role', role).ok, true, role);
  }
  // Someone whose job title we never anticipated can still answer.
  const own = checkTestimonialField('role', 'Robotics Technician');
  assert.equal(own.ok, true);
  assert.equal(own.ok && own.value, 'Robotics Technician');
});

test('focus accepts a listed option or the visitor\'s own words', () => {
  for (const focus of TESTIMONIAL_FOCUSES) {
    assert.equal(checkTestimonialField('focus', focus).ok, true, focus);
  }
  assert.equal(checkTestimonialField('focus', 'Career advice').ok, true);
});

test('the "Something else" placeholder is never stored as a real answer', () => {
  // Otherwise a visitor who picks "Something else" and forgets to type would
  // end up published with that placeholder as their job title.
  assert.equal(checkTestimonialField('role', OTHER_OPTION).ok, false);
  assert.equal(checkTestimonialField('focus', OTHER_OPTION).ok, false);
});

test('surrounding spaces are trimmed away', () => {
  const result = checkTestimonialField('company', '  Yango Cameroun  ');
  assert.equal(result.ok && result.value, 'Yango Cameroun');
});

test('a listed option still matches once it is trimmed', () => {
  assert.equal(checkTestimonialField('region', '  Littoral ').ok, true);
});

test('the short quote and the full story both need real content', () => {
  assert.equal(checkTestimonialField('message', 'Too short.').ok, false);
  assert.equal(checkTestimonialField('details', 'Also too short.').ok, false);

  const quote = checkTestimonialField(
    'message',
    'I found four telecom internships in a single week.',
  );
  assert.equal(quote.ok, true);
});

test('ratings stay whole numbers between one and five', () => {
  assert.equal(normaliseRating(5), 5);
  assert.equal(normaliseRating(0), 1);
  assert.equal(normaliseRating(9), 5);
  assert.equal(normaliseRating('4'), 4);
  assert.equal(normaliseRating(4.6), 5);
  // Anything unusable falls back to a happy rating rather than breaking.
  assert.equal(normaliseRating('abc'), 5);
  assert.equal(normaliseRating(undefined), 5);
});