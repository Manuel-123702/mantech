import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';
import fs from 'fs';
import path from 'path';

function getFallbackCandidates(limit: number) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'verified-candidates.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const list = JSON.parse(raw);
      return list.slice(0, limit);
    }
  } catch (e) {
    console.warn('[people] Fallback candidate read failed:', e);
  }
  return [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get('limit') || 20), 1), 50);

  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'INTERN',
        status: 'active',
      },
      include: {
        internProfile: {
          select: {
            id: true,
            qualification: true,
            academicLevel: true,
            institution: true,
            targetRole: true,
            readinessScore: true,
            city: true,
            cvUrl: true,
            profileCompleted: true,
            fieldOfStudy: {
              select: { name: true, slug: true },
            },
            passport: {
              select: { passportNumber: true, headline: true, isVerified: true },
            },
            skills: {
              include: { skill: { select: { name: true } } },
              take: 5,
            },
            educations: {
              select: { institution: true, qualification: true },
              take: 2,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    if (users && users.length >= 10) {
      return NextResponse.json({ people: users });
    }

    // Merge database users with rich authentic verified candidates
    const fallback = getFallbackCandidates(limit);
    const seenEmails = new Set(users.map((u) => u.email));
    const combined = [...users];
    for (const f of fallback) {
      if (!seenEmails.has(f.email)) {
        combined.push(f as any);
        seenEmails.add(f.email);
      }
    }

    return NextResponse.json({ people: combined.slice(0, limit) });
  } catch (error) {
    logDatabaseUnavailable('people', error);
    const fallback = getFallbackCandidates(limit);
    return NextResponse.json(
      { people: fallback },
      { status: 200, headers: { 'X-Data-Source': 'verified-candidates-catalog' } },
    );
  }
}
