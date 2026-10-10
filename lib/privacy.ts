const PRIVATE_FILE_FIELDS = new Set(['cvUrl', 'resumeUrl', 'fileUrl', 'fileKey']);

export function redactPrivateInternData<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => redactPrivateInternData(item)) as T;
  }

  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(source)) {
      if (PRIVATE_FILE_FIELDS.has(key)) continue;
      if (key === 'phone' && source.isPhonePublic === false) continue;
      result[key] = redactPrivateInternData(item);
    }
    return result as T;
  }

  return value;
}
