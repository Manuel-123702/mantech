import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  deadlineDate: z.string(),
  institutionName: z.string().optional(),
  note: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: session.userId },
      include: { internProfile: true },
    });

    if (!user || !user.internProfile) {
      return NextResponse.json({ error: 'Intern profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { deadlineDate, institutionName, note } = parsed.data;

    // Update intern profile with urgent academic placement metadata
    const updated = await prisma.internProfile.update({
      where: { id: user.internProfile.id },
      data: {
        availability: `URGENT_ACADEMIC_DEADLINE: ${deadlineDate}${institutionName ? ` · ${institutionName}` : ''}${note ? ` (${note})` : ''}`,
      },
    });

    // Notify candidate
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: '🎓 Priority Academic Dispatch Activated',
        message: `Your strict academic deadline (${new Date(deadlineDate).toLocaleDateString()}) has been registered. Your profile is marked for priority matching across active host enterprises.`,
        category: 'system',
        link: '/dashboard/intern',
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      deadlineDate,
      availability: updated.availability,
    });
  } catch (err) {
    console.error('[urgent-match] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
