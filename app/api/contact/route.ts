import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/emailjs';
import { APP_CONFIG } from '@/lib/config';
import { rateLimit, clientKey, RATE_LIMITS } from '@/lib/rate-limit';
import { logDatabaseUnavailable } from '@/lib/db-health';

const contactSchema = z.object({
  name: z.string().min(2, 'Please provide your name.').max(120),
  email: z.string().email('Please provide a valid email address.').max(200),
  subject: z.string().min(2, 'Please provide a subject.').max(200),
  message: z.string().min(10, 'Please write a longer message.').max(5000),
  // Honeypot: real users never fill a hidden field. Bots (and stray browser
  // autofill on a field named "website") do. We ACCEPT any content here so a
  // filled honeypot does NOT fail validation — the handler below then silently
  // discards it (returns ok:true without sending). Rejecting it here would turn
  // the "pretend success" path into dead code and wrongly return 400 to bots.
  website: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    // Stricter budget than the global API default: contact spam is the most
    // likely abuse vector on a public form.
    if (!rateLimit(clientKey(request, 'api:contact'), RATE_LIMITS.write).success) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please try again later.' },
        { status: 429 },
      );
    }

    const parsed = contactSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid submission.' },
        { status: 400 },
      );
    }
    // Honeypot filled => pretend success so bots get no signal, but send nothing.
    if (parsed.data.website && parsed.data.website.trim()) {
      return NextResponse.json({ ok: true });
    }

    const { name, email, subject, message } = parsed.data;
    const fullSubject = `[MANTECH Contact] ${subject}`;

    // Persist first: the database record is the durable copy of the enquiry.
    // Notifications require a real User FK, so we look up (or create) the
    // platform support account rather than inventing a userId.
    let persisted = false;
    try {
      let supportUser = await prisma.user.findFirst({
        where: { email: APP_CONFIG.contacts.email },
        select: { id: true },
      });
      if (!supportUser) {
        supportUser = await prisma.user.create({
          data: {
            // `clerkId` is required + unique but has no default. A stable
            // sentinel keeps this idempotent without inventing a real account.
            clerkId: `mantech-support:${APP_CONFIG.contacts.email}`,
            email: APP_CONFIG.contacts.email,
            fullName: 'MANTECH Support',
            role: 'ADMIN',
          },
          select: { id: true },
        });
      }
      await prisma.notification.create({
        data: {
          userId: supportUser.id,
          title: `Contact enquiry: ${subject}`,
          message: `From ${name} <${email}>\n\n${message}`,
          category: 'contact',
        },
      });
      persisted = true;
    } catch (dbError) {
      logDatabaseUnavailable('contact:persist', dbError);
    }

    const delivered = await sendEmail({
      to_email: APP_CONFIG.contacts.email,
      to_name: APP_CONFIG.name,
      subject: fullSubject,
      message: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      from_name: name,
      reply_to: email,
    });

    return NextResponse.json({ ok: true, delivered, persisted });
  } catch (error) {
    console.error('[contact] submission failed:', error);
    // Never leak internals to the client.
    return NextResponse.json(
      { error: 'We could not send your message right now. Please try again or use WhatsApp.' },
      { status: 500 },
    );
  }
}
