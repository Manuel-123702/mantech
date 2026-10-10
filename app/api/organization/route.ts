import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireOrganizationContext, requireUser } from '@/lib/authz';

const createSchema = z.object({
  type: z.enum(['company', 'university']).default('company'),
  name: z.string().min(2),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  industryId: z.string().optional(),
  regionId: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  size: z.string().optional(),
  universityType: z.string().optional(),
  faculties: z.array(z.string()).optional(),
});

const updateSchema = createSchema.omit({ type: true }).partial().extend({
  logoUrl: z.string().url().optional().or(z.literal('')),
  techStack: z.array(z.string()).optional(),
  perks: z.array(z.string()).optional(),
  branches: z.array(z.string()).optional(),
});

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Math.random().toString(36).slice(2, 6)
  );
}

export async function GET() {
  try {
    const { organization } = await requireOrganizationContext({ requireOrg: true });
    return NextResponse.json({ organization });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (user.organizationMembers.length > 0) {
      return NextResponse.json({ error: 'You already belong to an organization' }, { status: 400 });
    }

    const body = createSchema.parse(await request.json());
    const isUniversity = body.type === 'university';
    const memberRole = isUniversity ? 'UNIVERSITY' : 'COMPANY';
    const organization = await prisma.organization.create({
      data: {
        name: body.name,
        slug: slugify(body.name),
        type: isUniversity ? 'UNIVERSITY' : 'COMPANY',
        description: body.description,
        website: body.website || null,
        email: body.email || user.email,
        phone: body.phone,
        industryId: body.industryId || null,
        regionId: body.regionId || null,
        city: body.city,
        address: body.address,
        size: body.size,
        verificationStatus: 'PENDING',
        ...(isUniversity
          ? {
              universityProfile: {
                create: {
                  universityType: body.universityType,
                  faculties: body.faculties || [],
                },
              },
            }
          : { companyProfile: { create: {} } }),
        members: {
          create: {
            userId: user.id,
            isOwner: true,
            role: 'owner',
            jobTitle: isUniversity ? 'Placement Officer' : 'Recruiter',
          },
        },
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { role: user.role === 'ADMIN' ? 'ADMIN' : memberRole },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role === 'ADMIN' ? 'ADMIN' : memberRole,
      action: 'CREATE_ORGANIZATION',
      entityType: 'Organization',
      entityId: organization.id,
      details: { name: organization.name, type: organization.type },
      request,
    });

    return NextResponse.json({ organization }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const { user, membership, organization } = await requireOrganizationContext({ requireOrg: true });
    if (!organization || !membership) throw new AuthError(400, 'Organization profile required');
    if (!membership.isOwner && membership.role !== 'admin' && user.role !== 'ADMIN') {
      throw new AuthError(403, 'Only organization admins can update the profile');
    }

    const body = updateSchema.parse(await request.json());
    const isUniversity = organization.type === 'UNIVERSITY';
    const updated = await prisma.organization.update({
      where: { id: organization.id },
      data: {
        name: body.name,
        description: body.description,
        website: body.website || undefined,
        email: body.email || undefined,
        phone: body.phone,
        industryId: body.industryId || undefined,
        regionId: body.regionId || undefined,
        city: body.city,
        address: body.address,
        size: body.size,
        logoUrl: body.logoUrl || undefined,
        ...(isUniversity
          ? {
              universityProfile: {
                upsert: {
                  create: {
                    universityType: body.universityType,
                    faculties: body.faculties || [],
                  },
                  update: {
                    universityType: body.universityType,
                    faculties: body.faculties,
                  },
                },
              },
            }
          : {
              companyProfile: {
                upsert: {
                  create: {
                    techStack: body.techStack || [],
                    perks: body.perks || [],
                    branches: body.branches || [],
                  },
                  update: {
                    techStack: body.techStack,
                    perks: body.perks,
                    branches: body.branches,
                  },
                },
              },
            }),
      },
      include: { companyProfile: true, universityProfile: true, industry: true, region: true },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'UPDATE_ORGANIZATION',
      entityType: 'Organization',
      entityId: updated.id,
      request,
    });

    return NextResponse.json({ organization: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
