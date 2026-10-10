import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE = (process.env.NEXT_PUBLIC_APP_URL || 'https://mantech.nexus').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/internships',
    '/companies',
    '/universities',
    '/fields',
    '/locations',
    '/pricing',
    '/resources',
    '/success-stories',
    '/testimonials',
    '/about',
    '/contact',
    '/how-it-works',
    '/career-passport',
  ].map((p) => ({
    url: `${BASE}${p || '/'}`,
    lastModified: new Date(),
    changeFrequency: p === '' || p === '/internships' ? 'daily' : 'weekly',
    priority: p === '' ? 1 : p === '/internships' ? 0.9 : 0.7,
  }));

  try {
    const [opps, fields, regions] = await Promise.all([
      prisma.internshipOpportunity.findMany({
        where: { moderationStatus: 'PUBLISHED', deadline: { gte: new Date() } },
        select: { slug: true, updatedAt: true },
        take: 500,
        orderBy: { updatedAt: 'desc' },
      }).catch(() => []),
      prisma.field.findMany({ select: { slug: true } }).catch(() => []),
      prisma.region.findMany({ select: { code: true, id: true } }).catch(() => []),
    ]);

    const dynamic: MetadataRoute.Sitemap = [
      ...opps.filter((o) => o.slug).map((o) => ({
        url: `${BASE}/internships/${o.slug}`,
        lastModified: o.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
      ...fields.filter((f) => f.slug).map((f) => ({
        url: `${BASE}/fields/${f.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...regions.map((r) => ({
        url: `${BASE}/locations/${(r.code || r.id).toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ];

    return [...staticRoutes, ...dynamic];
  } catch {
    return staticRoutes;
  }
}
