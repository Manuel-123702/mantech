import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, Users, Plus } from 'lucide-react';

const STATUS_CONFIG: Record<string, { variant: string; label: string }> = {
  DRAFT: { variant: 'outline', label: 'Draft' },
  PENDING_REVIEW: { variant: 'secondary', label: 'Pending Review' },
  APPROVED: { variant: 'default', label: 'Approved' },
  PUBLISHED: { variant: 'default', label: 'Published' },
  SUSPENDED: { variant: 'destructive', label: 'Suspended' },
  EXPIRED: { variant: 'outline', label: 'Expired' },
  ARCHIVED: { variant: 'outline', label: 'Archived' },
  REJECTED: { variant: 'destructive', label: 'Rejected' },
};

export default async function CompanyJobsPage() {
  const { organization } = await requireCompanyDashboard();
  if (!organization) return null;

  const jobs = await prisma.job.findMany({
    where: { organizationId: organization.id },
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Job Postings</h2>
          <p className="text-sm text-slate-500">
            Manage your company&apos;s job vacancies on the MANTECH marketplace.
          </p>
        </div>
        <Link href="/dashboard/company/jobs/create">
          <Button className="bg-blue-600 hover:bg-blue-500">
            <Plus className="w-4 h-4 mr-2" />
            Post a Job
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">No jobs posted yet.</p>
              <p className="text-xs text-slate-500 mt-2">
                Start by creating your first job posting to attract talent.
              </p>
              <Link href="/dashboard/company/jobs/create" className="mt-4 inline-block">
                <Button size="sm">Create Your First Job</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500">
                    <th className="px-4 py-3 font-medium">Job Title</th>
                    <th className="px-4 py-3 font-medium">City</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Applications</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const status = STATUS_CONFIG[job.moderationStatus] || STATUS_CONFIG.DRAFT;
                    return (
                      <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <Link href={`/dashboard/company/jobs/${job.id}/edit`} className="font-medium text-slate-900 hover:text-blue-600">
                            {job.title}
                          </Link>
                          <p className="text-xs text-slate-500 mt-1">{job.city}</p>
                        </td>
                        <td className="px-4 py-3">{job.city}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{job.type}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-slate-700">{job._count.applications}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/dashboard/company/jobs/${job.id}/edit`}
                            className="text-xs text-blue-600 hover:underline mr-2"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${job.title}"? This cannot be undone.`)) {
                                fetch(`/api/jobs/${job.id}`, { method: 'DELETE' }).then(() => {
                                  window.location.reload();
                                });
                              }
                            }}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}