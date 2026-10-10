import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { syncDbUser } from '@/lib/authz';
import { notifyUser } from '@/lib/audit';

// Phone numbers are stored in international format. Local Cameroon numbers
// ("671 234 567", "0671 234 567") and bare country-code forms are normalized
// to "+237..." so validation never rejects a legitimate local number.
const phoneSchema = () =>
  z
    .string()
    .transform((value) => value.trim().replace(/[\s\-().]/g, ''))
    .refine((value) => /^\+?\d{8,15}$/.test(value), {
      message: 'Enter a valid phone number (e.g. +237 671 234 567)',
    })
    .transform((value) => {
      const digits = value.replace(/^\+/, '');
      if (digits.length === 9) return `+237${digits}`;
      if (digits.length === 10 && digits.startsWith('0')) return `+237${digits.slice(1)}`;
      if (digits.length === 12 && digits.startsWith('237')) return `+${digits}`;
      return value.startsWith('+') ? value : `+${value}`;
    });

function zodErrorResponse(error: z.ZodError) {
  const first = error.issues[0];
  const message = first ? `${first.path.join('.') || 'form'}: ${first.message}` : 'Invalid data';
  return NextResponse.json({ error: message, details: error.issues }, { status: 400 });
}

const registrationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: phoneSchema(),
  qualification: z.string().min(1),
  academicLevel: z.string().min(1),
  institution: z.string().min(1),
  fieldOfStudy: z.string().min(1),
  specialization: z.string().optional(),
  educationStartYear: z.string().min(4),
  educationEndYear: z.string().optional(),
  isCurrentEducation: z.boolean().optional(),
  region: z.string().min(1),
  city: z.string().min(1),
  preferredWorkMode: z.enum(['ONSITE', 'HYBRID', 'REMOTE']),
  availability: z.string().optional(),
  skills: z.array(z.string()).min(1),
  headline: z.string().optional(),
  summary: z.string().optional(),
  isPhonePublic: z.boolean().optional(),
  isCvSearchable: z.boolean().optional(),
  cvUrl: z.string().url(),
  cvFileKey: z.string().min(1),
  cvFileName: z.string(),
  cvFileSize: z.number(),
  photoUrl: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const user = await syncDbUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (user.role !== 'INTERN') {
      return NextResponse.json({ error: 'Only intern accounts can register an Intern Passport.' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = registrationSchema.parse(body);

    // Check if user already has an intern profile
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { internProfile: true },
    });

    if (existingUser?.internProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 400 });
    }

    // Get or create field
    const field = await prisma.field.findUnique({
      where: { id: validatedData.fieldOfStudy },
    });

    // Get or create region
    const region = await prisma.region.findUnique({
      where: { id: validatedData.region },
    });

    // Create intern profile
    const internProfile = await prisma.internProfile.create({
      data: {
        userId: user.id,
        phone: validatedData.phone,
        isPhonePublic: validatedData.isPhonePublic || false,
        qualification: validatedData.qualification,
        academicLevel: validatedData.academicLevel,
        institution: validatedData.institution,
        fieldOfStudyId: field?.id,
        specializationId: validatedData.specialization ? (await prisma.specialization.findFirst({
          where: { name: validatedData.specialization },
        }))?.id : undefined,
        regionId: region?.id,
        city: validatedData.city,
        preferredWorkMode: validatedData.preferredWorkMode,
        availability: validatedData.availability,
        cvUrl: validatedData.cvUrl,
        cvFileName: validatedData.cvFileName,
        cvFileSize: validatedData.cvFileSize,
        isCvSearchable: validatedData.isCvSearchable ?? true,
        readinessScore: 50, // Initial score
        profileCompleted: true,
      },
    });

    // Create passport
    const passportNumber = `MN-${region?.code || 'CM'}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    await prisma.internPassport.create({
      data: {
        internProfileId: internProfile.id,
        passportNumber,
        headline: validatedData.headline,
        summary: validatedData.summary,
        isVerified: false,
      },
    });

    // Create education record
    await prisma.education.create({
      data: {
        internProfileId: internProfile.id,
        institution: validatedData.institution,
        qualification: validatedData.qualification,
        field: field?.name || '',
        startYear: parseInt(validatedData.educationStartYear),
        endYear: validatedData.educationEndYear ? parseInt(validatedData.educationEndYear) : null,
        isCurrent: validatedData.isCurrentEducation || false,
      },
    });

    // Add skills
    for (const skillName of validatedData.skills) {
      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: {
          name: skillName,
          slug: skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category: 'General',
        },
      });

      await prisma.internProfileSkill.create({
        data: {
          internProfileId: internProfile.id,
          skillId: skill.id,
          proficiency: 'intermediate',
        },
      });
    }

    // Update user role if not set
    await prisma.user.update({
      where: { id: user.id },
      data: { fullName: user.fullName, avatarUrl: validatedData.photoUrl || user.avatarUrl },
    });

    // Create CV file metadata
    await prisma.cVFileMetadata.create({
      data: {
        internProfileId: internProfile.id,
        fileKey: validatedData.cvFileKey,
        fileName: validatedData.cvFileName,
        fileUrl: validatedData.cvUrl,
        fileSize: validatedData.cvFileSize,
        mimeType: 'application/pdf',
        isSecure: true,
      },
    });

    await notifyUser({
      userId: user.id,
      title: 'Your Intern Passport is ready',
      message: 'Your profile is now available for verified organizations to discover. You can update your details and privacy settings at any time.',
      category: 'account',
      link: '/dashboard/intern/passport',
    });

    return NextResponse.json({ 
      success: true, 
      internProfileId: internProfile.id,
      passportNumber,
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return zodErrorResponse(error);
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

const profilePatchSchema = z.object({
  phone: phoneSchema().optional(),
  bio: z.string().max(4000).optional(),
  headline: z.string().max(200).optional(),
  availability: z.string().max(120).optional(),
  workMode: z.string().optional(),
  preferredWorkMode: z.enum(['ONSITE', 'HYBRID', 'REMOTE']).optional(),
  city: z.string().max(120).optional(),
  isPhonePublic: z.boolean().optional(),
  isCvSearchable: z.boolean().optional(),
  qualification: z.string().max(200).optional(),
  academicLevel: z.string().max(80).optional(),
  institution: z.string().max(200).optional(),
});

function normalizeWorkMode(value?: string) {
  if (!value) return undefined;
  const compact = value.replace(/[-\s]/g, '_').toUpperCase();
  if (compact === 'ON_SITE' || compact === 'ONSITE') return 'ONSITE' as const;
  if (compact === 'HYBRID' || compact === 'REMOTE') return compact as 'HYBRID' | 'REMOTE';
  return undefined;
}

export async function PATCH(request: Request) {
  try {
    const user = await syncDbUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (user.role !== 'INTERN') {
      return NextResponse.json({ error: 'Only intern accounts can update this profile.' }, { status: 403 });
    }

    const body = profilePatchSchema.parse(await request.json());
    const profile = await prisma.internProfile.findUnique({
      where: { userId: user.id },
      include: { passport: true },
    });
    if (!profile) {
      return NextResponse.json({ error: 'Complete intern registration first.' }, { status: 400 });
    }

    const preferredWorkMode = body.preferredWorkMode || normalizeWorkMode(body.workMode);

    await prisma.internProfile.update({
      where: { id: profile.id },
      data: {
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.availability !== undefined ? { availability: body.availability } : {}),
        ...(preferredWorkMode ? { preferredWorkMode } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.isPhonePublic !== undefined ? { isPhonePublic: body.isPhonePublic } : {}),
        ...(body.isCvSearchable !== undefined ? { isCvSearchable: body.isCvSearchable } : {}),
        ...(body.qualification !== undefined ? { qualification: body.qualification } : {}),
        ...(body.academicLevel !== undefined ? { academicLevel: body.academicLevel } : {}),
        ...(body.institution !== undefined ? { institution: body.institution } : {}),
      },
    });

    if (body.bio !== undefined || body.headline !== undefined) {
      await prisma.internPassport.upsert({
        where: { internProfileId: profile.id },
        create: {
          internProfileId: profile.id,
          passportNumber: `MN-CM-${new Date().getFullYear()}-${profile.id.slice(0, 4).toUpperCase()}`,
          headline: body.headline || null,
          summary: body.bio || null,
        },
        update: {
          ...(body.headline !== undefined ? { headline: body.headline } : {}),
          ...(body.bio !== undefined ? { summary: body.bio } : {}),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Intern profile patch error:', error);
    if (error instanceof z.ZodError) {
      return zodErrorResponse(error);
    }
    return NextResponse.json({ error: 'Could not save profile' }, { status: 500 });
  }
}
