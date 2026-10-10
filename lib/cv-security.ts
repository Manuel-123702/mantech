/**
 * CV Security Utilities
 * Handles signed URL generation and validation for secure CV access
 */

const CV_ACCESS_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds

export function generateCVToken(cvId: string): string {
  const timestamp = Date.now();
  const data = `${cvId}:${timestamp}`;
  return Buffer.from(data).toString('base64');
}

export function validateCVToken(token: string, cvId: string): boolean {
  try {
    const data = Buffer.from(token, 'base64').toString('utf-8');
    const [tokenCvId, timestamp] = data.split(':');

    if (tokenCvId !== cvId) {
      return false;
    }

    const tokenTime = parseInt(timestamp, 10);
    const now = Date.now();

    return now - tokenTime < CV_ACCESS_EXPIRY;
  } catch {
    return false;
  }
}

export function generateSignedUrl(baseUrl: string, cvId: string): string {
  const token = generateCVToken(cvId);
  return `${baseUrl}?token=${token}`;
}
