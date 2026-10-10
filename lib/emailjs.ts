export interface EmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  [key: string]: string | number;
}

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

// EmailJS permits one send request per second per account. Serialize sends in
// this process and leave the database notification as the reliable fallback.
let emailQueue: Promise<void> = Promise.resolve();
let nextSendAt = 0;

export function sendEmail(params: EmailParams): Promise<boolean> {
  if (!serviceId || !templateId || !publicKey) return Promise.resolve(false);
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
      if (!response.ok) console.error('EmailJS rejected a notification email.', response.status);
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
