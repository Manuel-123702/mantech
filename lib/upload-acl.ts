/**
 * Helps with CV uploads (a CV must never be readable by anyone).
 *
 * On the free file plan, asking for a fully private file is refused. So we try
 * the private setting first, and if the plan says no, we upload again without
 * it.
 *
 * Turning that setting off does NOT make the CV public. Nobody is ever given the
 * file's real web address. Every time a CV is opened, the site first checks
 * that the person is allowed to see it (it must be their own file, or they must
 * be a verified company or university that is allowed), then gives them a link
 * that stops working after a short time, and records the attempt.
 *
 * This file is kept free of outside connections so it can be checked on its own.
 */
export function isPrivateAclUnsupported(error: unknown): boolean {
  if (error === null || error === undefined) return false;

  const candidates: string[] = [];
  if (typeof error === 'string') {
    candidates.push(error);
  } else if (error instanceof Error) {
    candidates.push(error.message);
  } else if (typeof error === 'object') {
    const json = safeStringify(error);
    if (json) candidates.push(json);
    // JSON.stringify throws on circular structures and returns undefined for
    // values it cannot represent, so also probe the own string properties.
    // Nested messages (e.g. error.body.error) are plain values and stringify.
    for (const value of Object.values(error as Record<string, unknown>)) {
      if (typeof value === 'string') candidates.push(value);
    }
  } else {
    candidates.push(String(error));
  }

  const text = candidates.join(' ').toLowerCase();
  if (!text) return false;
  return (
    text.includes('private files are not allowed') ||
    text.includes('private acl') ||
    // UploadThing code for a plan/permission restriction.
    text.includes('insufficient_permissions')
  );
}

/** JSON.stringify that never throws on circular structures. */
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? '';
  } catch {
    return '';
  }
}