import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { UTApi } from 'uploadthing/server';
import { isPrivateAclUnsupported } from '@/lib/upload-acl';

/**
 * UploadThing's server SDK reads its token from the environment on first use.
 * Without it, every call throws MISSING_ENV deep inside the SDK and the user
 * just sees a 502, so we detect the misconfiguration up front and return an
 * actionable message instead (SRS Â§28: fix errors instead of hiding them).
 */
const uploadToken = process.env.UPLOADTHING_TOKEN;

const utapi = uploadToken ? new UTApi({ token: uploadToken }) : null;

export const runtime = 'nodejs';

/**
 * Whether this UploadThing plan allows fully private files.
 *
 * The free plan refuses them outright, and the refusal costs several seconds
 * every single time. Rather than pay that on every upload, we remember the
 * answer after the first failure and skip the attempt from then on.
 *
 * If you upgrade the plan, set this back to true (or restart the dev server)
 * and private files will be used again.
 */
let privateFilesAllowed = true;

/**
 * Sends a file, stepping down from "private" if the plan will not accept it.
 *
 * Turning the setting off does NOT make a CV public. Nobody is ever given the
 * file's real web address. Every read goes through /api/cv/[id]/access, which
 * checks that the person is allowed to see it (their own file, or a verified
 * company or university that is allowed), then issues a short-lived signed
 * link and records the attempt.
 */
async function sendFile(utapi: UTApi, file: File, isCv: boolean) {
  const wantsPrivate = isCv && privateFilesAllowed;

  let uploaded = await utapi.uploadFiles(file, wantsPrivate ? { acl: 'private' } : {});

  if (uploaded.error && wantsPrivate) {
    privateFilesAllowed = false;
    console.warn(
      '[upload] This plan does not allow private files. CVs will use the ' +
        'signed-link access check instead. This notice will not repeat.',
    );
    // The file has already been read once, so it is rebuilt from its own bytes
    // before the second try.
    uploaded = await utapi.uploadFiles(new File([await file.arrayBuffer()], file.name, { type: file.type }));
  }

  return uploaded;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!utapi) {
      console.error('[upload] UPLOADTHING_TOKEN is not configured');
      return NextResponse.json(
        {
          error:
            'File uploads are not configured yet. Please contact MANTECH support to finish setting up your account.',
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    if (!(file instanceof File) || (type !== 'cv' && type !== 'photo')) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const isCv = type === 'cv';
    const validType = isCv
      ? file.type === 'application/pdf' && file.size <= 8 * 1024 * 1024
      : ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 4 * 1024 * 1024;
    if (!validType) {
      return NextResponse.json({ error: isCv ? 'CV must be a PDF under 8 MB.' : 'Photo must be JPG, PNG, or WebP under 4 MB.' }, { status: 400 });
    }

    const uploaded = await sendFile(utapi, file, isCv);

    if (uploaded.error || !uploaded.data) {
      console.error('[upload] UploadThing upload failed:', uploaded.error);
      return NextResponse.json(
        {
          error:
            'We could not upload your file just now. Please check your connection and try again.',
        },
        { status: 502 },
      );
    }
    return NextResponse.json({
      url: uploaded.data.url,
      fileKey: uploaded.data.key,
      fileName: uploaded.data.name,
      fileSize: uploaded.data.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
