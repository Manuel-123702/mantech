import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';
import {
  TESTIMONIAL_FIELDS,
  checkTestimonialField,
  normaliseRating,
} from '@/lib/testimonial-fields';
import { VERIFIED_COMMUNITY_STORIES } from '@/lib/cameroon-directory';
import { getI18nInstance } from '@/app/appRouterI18n';
import { resolveLocale } from '@/i18n/locales';

export const dynamic = 'force-dynamic';

/** People can read the approved messages. Email is never included. */
export async function GET(request: Request) {
  const locale = resolveLocale(request.headers.get('x-mantech-locale'));
  const i18n = getI18nInstance(locale);
  const mapFallback = () => VERIFIED_COMMUNITY_STORIES.map((story) => ({
    ...story,
    role: i18n._(story.role),
    focus: i18n._(story.focus),
    message: i18n._(story.message),
    details: i18n._(story.details),
    createdAt: new Date().toISOString(),
  }));
  try {
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

    if (testimonials && testimonials.length > 0) {
      return NextResponse.json({ testimonials });
    }

    // Synchronized verified community stories fallback
    return NextResponse.json({ testimonials: mapFallback() });
  } catch (error) {
    logDatabaseUnavailable('testimonials', error);
    return NextResponse.json({ testimonials: mapFallback() });
  }
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: 'We could not read that message.' }, { status: 400 });
    }

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
        status: 'APPROVED',
      },
      select: { id: true },
    });

    return NextResponse.json(
      {
        id: testimonial.id,
        message: 'Thank you! Your experience has been published and is now live on this page.',
      },
      { status: 201 },
    );
  } catch (error) {
    logDatabaseUnavailable('testimonials', error);
    return NextResponse.json(
      { error: 'Database temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }
}
