import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { jsonError } from '@/lib/authz';
import { requireAdminUser } from '@/lib/admin-dashboard';

const schema = z.object({
  isVerified: z.boolean(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    const body = schema.parse(await request.json());

    const passport = await prisma.internPassport.findUnique({
      where: { id },
      include: { internProfile: true },
    });
    if (!passport) {
      return NextResponse.json({ error: 'Intern Passport not found' }, { status: 404 });
    }

    const updated = await prisma.internPassport.update({
      where: { id: passport.id },
      data: { isVerified: body.isVerified },
    });

    await notifyUser({
      userId: passport.internProfile.userId,
      title: body.isVerified ? 'Intern Passport verified' : 'Intern Passport verification removed',
      message: body.isVerified
        ? `Your Intern Passport ${passport.passportNumber} is verified and visible to recruiters.`
        : `Verification was removed from Intern Passport ${passport.passportNumber}. Contact MANTECH support on WhatsApp.`,
      category: 'system',
      link: '/intern-passports/me',
    });

    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: 'PASSPORT_VERIFICATION_UPDATED',
      entityType: 'InternPassport',
      entityId: passport.id,
      details: { passportNumber: passport.passportNumber, isVerified: body.isVerified },
      request,
    });

    return NextResponse.json({ passport: { id: updated.id, isVerified: updated.isVerified } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
