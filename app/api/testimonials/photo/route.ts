import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

export const runtime = 'nodejs';

/**
 * Lets a visitor add a photo to their experience. The photo is completely
 * optional — the form works fine without it.
 *
 * Unlike a CV, this picture is meant to be seen, so it is uploaded as a normal
 * public picture. We still check the type and size, keep only the returned
 * address (never the raw file), and let the site handle it safely.
 */

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

const utapi = process.env.UPLOADTHING_TOKEN
  ? new UTApi({ token: process.env.UPLOADTHING_TOKEN })
  : null;

export async function POST(request: Request) {
  try {
    if (!utapi) {
      return NextResponse.json(
        { error: 'Photo uploads are not available right now. You can still send your message.' },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No photo was received.' }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: 'Please choose a JPG, PNG or WebP photo.' },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'Please choose a photo under 2 MB.' },
        { status: 400 },
      );
    }

    const uploaded = await utapi.uploadFiles(file, { acl: 'public-read' });
    if (uploaded.error || !uploaded.data) {
      console.error('Testimonial photo upload failed:', uploaded.error);
      return NextResponse.json(
        { error: 'We could not add that photo. You can still send your message.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: uploaded.data.url });
  } catch (error) {
    console.error('Testimonial photo error:', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}