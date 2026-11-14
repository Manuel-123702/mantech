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
      return NextResponse.json({ error: 'Please select a valid CV document.' }, { status: 400 });
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'CV file size must be under 15MB.' }, { status: 400 });
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `cv_${Date.now()}_${cleanName}`;

    // 1. Try UploadThing if configured
    if (utapi) {
      try {
        const uploadResult = await utapi.uploadFiles(file);
        if (uploadResult?.data?.url) {
          return NextResponse.json({
            ok: true,
            cvUrl: uploadResult.data.url,
            cvFileKey: uploadResult.data.key || fileKey,
            cvFileName: file.name,
            cvFileSize: file.size,
          });
        }
      } catch (utErr) {
        console.warn('[upload-cv] UploadThing failed, falling back to local file storage:', utErr);
      }
    }

    // 2. Reliable Local Fallback Storage
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileKey);
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    const cvUrl = `/uploads/cvs/${fileKey}`;

    return NextResponse.json({
      ok: true,
      cvUrl,
      cvFileKey: fileKey,
      cvFileName: file.name,
      cvFileSize: file.size,
    });
  } catch (error) {
    console.error('[upload-cv] Error processing CV:', error);
    return NextResponse.json(
      { error: 'Failed to process CV document. Please verify the file is a valid PDF.' },
      { status: 500 }
    );
  }
}

