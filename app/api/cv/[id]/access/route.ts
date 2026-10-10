import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';
import { prisma } from '@/lib/prisma';
import { AuthError, requireUser } from '@/lib/authz';
import { getPackageLimits } from '@/lib/package-limits';
import { reserveCandidateViews } from '@/lib/candidate-usage';

// Uses the shared token from .env, and degrades to null when it is missing so
// this route returns a clear 503 instead of crashing the module.
const utapi = process.env.UPLOADTHING_TOKEN
  ? new UTApi({ token: process.env.UPLOADTHING_TOKEN })
  : null;

/**
 * Single authorization core shared by GET and POST.
 *
 * Every read of a secure CV — regardless of how the route was reached — must
 * run the same ownership/organization checks, consume the same candidate-view
 * quota, and write the same audit entry. Keeping the logic in one function is
 * what makes it safe to expose both verbs.
 */
async function handleCvAccess(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();

    if (!utapi) {
      console.error('[cv/access] UPLOADTHING_TOKEN is not configured');
      return NextResponse.json(
        { error: 'CV access is temporarily unavailable. Please contact MANTECH support.' },
        { status: 503 },
      );
    }

    const cvFile = await prisma.cVFileMetadata.findUnique({
      where: { id },
      include: {
        internProfile: { select: { id: true, userId: true, isCvSearchable: true } },
      },
    });
    if (!cvFile) {
      return NextResponse.json({ error: 'CV file not found' }, { status: 404 });
    }

    let organizationId: string | null = null;
    if (user.role === 'INTERN' && user.internProfile?.id === cvFile.internProfileId) {
      // Interns can access only their own CV.
    } else if (user.role === 'ADMIN') {
      organizationId = null;
    } else if (user.role === 'COMPANY' || user.role === 'UNIVERSITY') {
      const membership = user.organizationMembers[0];
      const organization = membership?.organizationId
        ? await prisma.organization.findUnique({
            where: { id: membership.organizationId },
            include: { universityProfile: true },
          })
        : null;
      if (!organization || organization.verificationStatus !== 'VERIFIED') {
        throw new AuthError(403, 'Verified organization access required');
      }
      if (user.role === 'UNIVERSITY' && !organization.universityProfile?.canRecruitInterns) {
        throw new AuthError(403, 'Recruiting interns is disabled for this university account');
      }
      const hasApplication = await prisma.application.findFirst({
        where: { internProfileId: cvFile.internProfileId, opportunity: { organizationId: organization.id } },
        select: { id: true },
      });
      if (!cvFile.internProfile.isCvSearchable && !hasApplication) {
        throw new AuthError(403, 'This intern has disabled CV discovery');
      }
      organizationId = organization.id;
      const limits = await getPackageLimits(organization.packageCode);
      const usage = await reserveCandidateViews({
        organizationId: organization.id,
        actorId: user.id,
        actorRole: user.role,
        profileIds: [cvFile.internProfileId],
        monthlyLimit: limits.monthlyCandidateViews,
        request,
      });
      if (!usage.allowedIds.has(cvFile.internProfileId)) {
        throw new AuthError(403, 'Your monthly candidate-view limit has been reached. Upgrade your package to continue.');
      }
    } else {
      throw new AuthError(403, 'Unauthorized CV access');
    }

    if (!cvFile.isSecure || !cvFile.fileKey) {
      throw new AuthError(403, 'Secure CV file is unavailable');
    }
    const { ufsUrl: signedUrl } = await utapi.generateSignedURL(cvFile.fileKey, { expiresIn: 15 * 60 });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorRole: user.role,
        action: 'CV_ACCESS_GRANTED',
        entityType: 'CVFileMetadata',
        entityId: cvFile.id,
        details: JSON.stringify({
          internProfileId: cvFile.internProfileId,
          organizationId,
          fileName: cvFile.fileName,
        }),
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({ url: signedUrl, signedUrl, fileName: cvFile.fileName });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('CV access error:', error);
    return NextResponse.json({ error: 'Failed to access CV' }, { status: 500 });
  }
}

// POST is the primary verb: the Download buttons on the candidates page,
// application detail and passport pages all call it via fetch().
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return handleCvAccess(request, context);
}

// GET exists so a pasted or bookmarked /api/cv/[id]/access link no longer
// answers with the router's default bare 405. It runs the exact same
// authorization flow, so opening the URL directly behaves identically to the
// Download button instead of failing.
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return handleCvAccess(request, context);
}
