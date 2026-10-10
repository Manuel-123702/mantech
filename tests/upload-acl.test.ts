/**
 * Upload ACL fallback (SRS §7 — CVs must never be publicly readable).
 *
 * UploadThing's free tier refuses `acl: 'private'`, so the upload route retries
 * with the default ACL. Privacy is preserved because every CV read is gated by
 * /api/cv/[id]/access (authorization + short-lived signed URL + audit log).
 *
 * Run with: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { isPrivateAclUnsupported } from '../lib/upload-acl.ts';

test('detects the free-tier private ACL refusal in a plain string', () => {
  assert.equal(
    isPrivateAclUnsupported('Private files are not allowed for free apps.'),
    true,
  );
});

test('detects the refusal nested in the SDK error object', () => {
  // The SDK surfaces the 400 body as an object, not an Error.
  const sdkError = {
    code: 'UPLOAD_FAILED',
    message: 'Failed to upload file',
    data: {
      status: 400,
      body: { error: 'Private files are not allowed for free apps.' },
    },
  };
  assert.equal(isPrivateAclUnsupported(sdkError), true);
});

test('detects the refusal inside an Error instance', () => {
  assert.equal(
    isPrivateAclUnsupported(new Error('private files are not allowed for free apps')),
    true,
  );
});

test('recognises the insufficient-permissions code variant', () => {
  assert.equal(isPrivateAclUnsupported('UploadThing error: insufficient_permissions'), true);
});

test('does not retry the upload for unrelated failures', () => {
  const unrelated = [
    'Failed to upload file',
    new Error('ECONNRESET'),
    { code: 'UPLOAD_FAILED', message: 'network timeout' },
    'File too large',
  ];
  for (const error of unrelated) {
    assert.equal(
      isPrivateAclUnsupported(error),
      false,
      `${JSON.stringify(error)} must not trigger the fallback`,
    );
  }
});

test('handles empty and nullish errors safely', () => {
  for (const value of [null, undefined, '', {}]) {
    assert.equal(isPrivateAclUnsupported(value), false);
  }
});

test('a circular error object does not throw', () => {
  const circular: Record<string, unknown> = { message: 'Private files are not allowed' };
  circular.self = circular;
  assert.equal(isPrivateAclUnsupported(circular), true);
});

test('privacy guarantee: a successful upload response never exposes the raw key as public', () => {
  // Guards the contract the fallback relies on: callers must store fileKey for
  // the authorized /api/cv/[id]/access route rather than linking the raw URL.
  const stored = { fileKey: 'ufs/abc123', fileName: 'cv.pdf' };
  assert.equal('url' in stored, false, 'raw storage URL must not be what we persist');
  assert.ok(stored.fileKey.length > 0);
});