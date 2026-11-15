import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UTApi } from 'uploadthing/server';

export const runtime = 'nodejs';

const uploadToken = process.env.UPLOADTHING_TOKEN;
const utapi = uploadToken ? new UTApi({ token: uploadToken }) : null;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Please select a portrait image.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Photo size must be under 10MB.' }, { status: 400 });
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `photo_${Date.now()}_${cleanName}`;

    // 1. Try UploadThing if configured
    if (utapi) {
      try {
        const uploadResult = await utapi.uploadFiles(file);
        if (uploadResult?.data?.url) {
          return NextResponse.json({
            ok: true,
            photoUrl: uploadResult.data.url,
            photoFileKey: uploadResult.data.key || fileKey,
            photoFileName: file.name,
            photoFileSize: file.size,
          });
        }
      } catch (utErr) {
        console.warn('[upload-photo] UploadThing failed, falling back to local file storage:', utErr);
      }
    }

    // 2. Reliable Local Fallback Storage
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'photos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileKey);
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer) as any);

    const photoUrl = `/uploads/photos/${fileKey}`;

    return NextResponse.json({
      ok: true,
      photoUrl,
      photoFileKey: fileKey,
      photoFileName: file.name,
      photoFileSize: file.size,
    });
  } catch (error) {
    console.error('[upload-photo] Error processing photo:', error);
    return NextResponse.json(
      { error: 'Failed to process portrait image.' },
      { status: 500 }
    );
  }
}

