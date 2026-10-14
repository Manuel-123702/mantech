export interface EmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  [key: string]: string | number;
}

// Read the keys at call time rather than at module load. Next.js can load this
// module before the environment is fully populated (and the dev server must be
// restarted after editing .env), so capturing the values once at import time
// could freeze an empty/old configuration. Reading inside the function keeps a
// running server honest as soon as .env changes are picked up.
function readEmailConfig() {
  return {
    serviceId: (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '').trim(),
    templateId: (process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '').trim(),
    publicKey: (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '').trim(),
    privateKey: (process.env.EMAILJS_PRIVATE_KEY || '').trim(),
  };
}

// True when all three EmailJS keys are present. Used by callers to show a
// precise "email not configured" state instead of a generic failure.
export function isEmailConfigured(): boolean {
  const { serviceId, templateId, publicKey } = readEmailConfig();
  return Boolean(serviceId && templateId && publicKey);
}

// EmailJS permits one send request per second per account. Serialize sends in
// this process and leave the database notification as the reliable fallback.
let emailQueue: Promise<void> = Promise.resolve();
let nextSendAt = 0;

export function sendEmail(params: EmailParams): Promise<boolean> {
  const { serviceId, templateId, publicKey, privateKey } = readEmailConfig();
  if (!serviceId || !templateId || !publicKey || !privateKey) return Promise.resolve(false);
  let resolveResult: (result: boolean) => void;
  const result = new Promise<boolean>(resolve => { resolveResult = resolve; });
  emailQueue = emailQueue.then(async () => {
    const delay = Math.max(0, nextSendAt - Date.now());
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    nextSendAt = Date.now() + 1100;
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: params,
        }),
      });
      resolveResult(response.ok);
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        console.error('EmailJS rejected a notification email.', response.status, detail.slice(0, 500));
      }
    } catch (error) {
      resolveResult(false);
      console.error('EmailJS notification delivery failed.', error);
    }
  }).catch(error => {
    resolveResult(false);
    console.error('EmailJS queue failed.', error);
  });
  return result;
}

export const emailTemplates = {
  notification: (name: string, email: string, subject: string, message: string) => ({
    to_email: email,
    to_name: name,
    subject,
    message,
  }),
};
