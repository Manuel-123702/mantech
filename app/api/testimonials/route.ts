import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  TESTIMONIAL_FIELDS,
  checkTestimonialField,
  normaliseRating,
} from '@/lib/testimonial-fields';

export const dynamic = 'force-dynamic';

/**
 * Experiences shared by visitors. No account needed to send one.
 *
 * Every field is required except the photo. Because the form and this endpoint
 * share one list of fields, a visitor cannot get past the form and then be
 * rejected here for a value the form never offered them.
 */

/** People can read the approved messages. Email is never included. */
export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: 'APPROVED' },
    orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
    take: 60,
    select: {
      id: true,
      name: true,
      role: true,
      company: true,
      region: true,
      focus: true,
      photoUrl: true,
      message: true,
      details: true,
      rating: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'We could not read that message.' }, { status: 400 });
  }

  // Check every written field and report the first problem, so the visitor is
  // told exactly what needs fixing. The rating is skipped here because it is a
  // number, not written text — it is checked separately below.
  const data: Record<string, string> = {};
  for (const field of TESTIMONIAL_FIELDS) {
    if (field.name === 'rating') continue;
    const result = checkTestimonialField(field.name, body[field.name]);
    if (!result.ok) {
      return NextResponse.json({ error: result.error, field: field.name }, { status: 400 });
    }
    data[field.name] = result.value;
  }

  const email = data.email!;
  // A basic shape check. We only use this to reply, never to publish.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { error: 'Please check the email address.', field: 'email' },
      { status: 400 },
    );
  }

  const photoUrl = data.photoUrl?.trim();
  if (photoUrl && !/^https:\/\//i.test(photoUrl)) {
    return NextResponse.json(
      { error: 'The photo could not be used. Please choose it again.', field: 'photoUrl' },
      { status: 400 },
    );
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      name: data.name!,
      email,
      role: data.role!,
      company: data.company!,
      region: data.region!,
      focus: data.focus!,
      message: data.message!,
      details: data.details!,
      rating: normaliseRating(body.rating),
      photoUrl: photoUrl || null,
      // New messages wait for a check before they appear on the public page.
      status: 'PENDING',
    },
    select: { id: true },
  });

  return NextResponse.json(
    {
      id: testimonial.id,
      message: 'Thank you. Your experience will appear on this page once we have read it.',
    },
    { status: 201 },
  );
}