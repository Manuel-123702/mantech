import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

/**
 * Dedicated recruitment flyer / communiqué upload endpoint.
 * Stores flyers as real image files on disk at /public/uploads/flyers/
 * ensuring permanent URLs that never expire like blob URLs.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Please select an image file.' }, { status: 400 });
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size must be under 15MB.' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `flyer_${Date.now()}_${cleanBase}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'flyers');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, new Uint8Array(arrayBuffer));

    const flyerUrl = `/uploads/flyers/${fileName}`;

    return NextResponse.json({
      ok: true,
      flyerUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error('[upload-flyer] Error saving flyer:', error);
    return NextResponse.json(
      { error: 'Failed to process recruitment image.' },
      { status: 500 }
    );
  }
}
