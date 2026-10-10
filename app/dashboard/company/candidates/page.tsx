import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Eye } from 'lucide-react';
import { CvDownloadButton } from '@/components/cv-download-button';
import type { Prisma } from '@prisma/client';
import { getPackageLimits } from '@/lib/package-limits';
import { reserveCandidateViews } from '@/lib/candidate-usage';

export default async function CompanyCandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    field?: string;
    specialization?: string;
    qualification?: string;
    region?: string;
    city?: string;
    availability?: string;
    workMode?: string;
  }>;
}) {
  const { organization, user } = await requireCompanyDashboard();
  if (!organization) return null;

  const isVerified = organization.verificationStatus === 'VERIFIED';
  if (!isVerified) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidate Discovery</h1>
          <p className="text-slate-600 text-sm">Candidate discovery unlocks after organization verification.</p>
        </div>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <p className="text-sm text-amber-900">
              <strong>Verification required:</strong> Only verified organizations can search Intern Passports or access CVs.
            </p>
            <Link href="/dashboard/company/settings" className="mt-4 inline-block">
              <Button variant="outline" size="sm">Request Verification</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { q, field, specialization, qualification, region, city, availability, workMode } = await searchParams;
  const packageLimits = await getPackageLimits(organization.packageCode);

  const where: Prisma.InternProfileWhereInput = {
    isCvSearchable: true,
    profileCompleted: true,
    user: { status: 'active' },
  };
  const searchConditions: Prisma.InternProfileWhereInput[] = [];

  if (q) {
    searchConditions.push({
      OR: [
        { user: { fullName: { contains: q, mode: 'insensitive' } } },
        { qualification: { contains: q, mode: 'insensitive' } },
        { educations: { some: { qualification: { contains: q, mode: 'insensitive' } } } },
        { skills: { some: { skill: { name: { contains: q, mode: 'insensitive' } } } } },
      ],
    });
  }

  if (field) {
    where.fieldOfStudy = { name: { contains: field, mode: 'insensitive' } };
  }

  if (specialization) {
    where.specialization = { name: { contains: specialization, mode: 'insensitive' } };
  }

  if (qualification) {
    searchConditions.push({
      OR: [
        { qualification: { contains: qualification, mode: 'insensitive' } },
        { educations: { some: { qualification: { contains: qualification, mode: 'insensitive' } } } },
      ],
    });
  }

  if (region) {
    where.region = { name: { contains: region, mode: 'insensitive' } };
  }

  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (availability) where.availability = { contains: availability, mode: 'insensitive' };
  const normalizedWorkMode = workMode?.toUpperCase();
  if (
    normalizedWorkMode === 'ONSITE' ||
    normalizedWorkMode === 'HYBRID' ||
    normalizedWorkMode === 'REMOTE'
  ) {
    where.preferredWorkMode = normalizedWorkMode;
  }
  if (searchConditions.length) where.AND = searchConditions;

  const candidates = await prisma.internProfile.findMany({
    where,
    include: {
      user: { select: { fullName: true, avatarUrl: true } },
      fieldOfStudy: true,
      specialization: true,
      region: true,
      skills: { include: { skill: true } },
      passport: true,
      cvFiles: {
        where: { isSecure: true },
        select: { id: true, fileName: true },
        orderBy: { uploadedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { readinessScore: 'desc' },
    take: 50,
  });
  const usage = await reserveCandidateViews({
    organizationId: organization.id,
    actorId: user.id,
    actorRole: user.role,
    profileIds: candidates.map((candidate) => candidate.id),
    monthlyLimit: packageLimits.monthlyCandidateViews,
  });
  const permittedCandidates = candidates.filter((candidate) => usage.allowedIds.has(candidate.id));

  const fields = await prisma.field.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  const regions = await prisma.region.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidate Discovery</h1>
          <p className="text-slate-600 text-sm">Search and discover intern candidates across Cameroon.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <form method="get" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  name="q"
                  placeholder="Search by name, qualification, or skills..."
                  defaultValue={q}
                  className="pl-10"
                />
              </div>
            </div>
            <label className="text-xs font-medium text-slate-600">
              Field
              <select
                name="field"
                defaultValue={field || ''}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="">All Fields</option>
                {fields.map((f) => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600">
              Specialization
              <Input name="specialization" defaultValue={specialization} className="mt-1" placeholder="e.g. Accounting" />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Qualification / education
              <Input name="qualification" defaultValue={qualification} className="mt-1" placeholder="e.g. HND, BSc" />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Region
              <select
                name="region"
                defaultValue={region || ''}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="">All Regions</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600">
              City / town
              <Input name="city" defaultValue={city} className="mt-1" placeholder="Douala, Yaoundé..." />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Availability
              <Input name="availability" defaultValue={availability} className="mt-1" placeholder="e.g. Immediate" />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Work mode
              <select
                name="workMode"
                defaultValue={workMode || ''}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="">All Work Modes</option>
                <option value="ONSITE">On-site</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
              </select>
            </label>
            <div className="flex items-end gap-2">
              <Button type="submit">
                <Filter className="w-4 h-4 mr-2" />
                Apply
              </Button>
              <Link href="/dashboard/company/candidates">
                <Button type="button" variant="outline">Clear</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {candidates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No candidates found</h3>
              <p className="text-slate-600 text-sm">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        ) : permittedCandidates.length === 0 ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-8 text-center">
              <h3 className="font-semibold text-amber-950">Monthly candidate-view limit reached</h3>
              <p className="mt-2 text-sm text-amber-900">
                Your package allows {packageLimits.monthlyCandidateViews} candidate views per month.
                Contact MANTECH to request an upgrade.
              </p>
              <Link href="/dashboard/company/billing" className="mt-4 inline-block">
                <Button variant="outline">Review packages</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          permittedCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {candidate.user.fullName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">{candidate.user.fullName}</h3>
                          <Badge variant="secondary" className="text-xs">
                            Readiness: {candidate.readinessScore}%
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{candidate.qualification}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>{candidate.fieldOfStudy?.name}</span>
                          {candidate.specialization && <span>• {candidate.specialization.name}</span>}
                          <span>• {candidate.region?.name}</span>
                          <span>• {candidate.city}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {candidate.skills.slice(0, 5).map((skill) => (
                            <Badge key={skill.id} variant="outline" className="text-xs">
                              {skill.skill.name}
                            </Badge>
                          ))}
                          {candidate.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 sm:w-auto w-full">
                    <Link href={`/intern-passports/${candidate.id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="w-4 h-4 mr-2" />
                        View Passport
                      </Button>
                    </Link>
                    {candidate.cvFiles[0] && (
                      <CvDownloadButton cvId={candidate.cvFiles[0].id} internProfileId={candidate.id} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {candidates.length > 0 && (
        <div className="text-center text-sm text-slate-600">
          Showing {permittedCandidates.length} candidates · {usage.used}
          {packageLimits.monthlyCandidateViews === 9999
            ? ' monthly views (unlimited)'
            : ` of ${packageLimits.monthlyCandidateViews} monthly views used`}
        </div>
      )}
    </div>
  );
}
