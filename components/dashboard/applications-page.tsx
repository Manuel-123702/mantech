'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Search,
  Eye,
  Calendar,
  Star,
  ChevronRight,
  Users,
  Filter,
} from 'lucide-react';
import { StatusBadge } from '@/components/company/status-badge';

type ApplicationItem = {
  id: string;
  status: string;
  coverLetter?: string | null;
  candidateRating?: number | null;
  readinessScore?: number;
  createdAt: string;
  updatedAt: string;
  internProfile: {
    id: string;
    user: { fullName: string; email: string; avatarUrl?: string | null };
    passport?: { headline?: string | null } | null;
    fieldOfStudy?: { name: string } | null;
  };
  opportunity: {
    id: string;
    title: string;
    slug: string;
  };
  interviews?: { id: string; scheduledAt: string; status: string }[];
  placement?: { id: string; status: string } | null;
};

const STATUSES = [
  'ALL',
  'SUBMITTED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'PLACED',
  'INTERNSHIP_ACTIVE',
  'COMPLETED',
  'REJECTED',
  'WITHDRAWN',
  'ARCHIVED',
];

const PIPELINE_TABS = [
  { value: 'pipeline', label: 'Pipeline', includes: ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'] },
  { value: 'received', label: 'Received', includes: ['SUBMITTED'] },
  { value: 'review', label: 'Under review', includes: ['UNDER_REVIEW'] },
  { value: 'shortlisted', label: 'Shortlisted', includes: ['SHORTLISTED'] },
  { value: 'interview', label: 'Interviews', includes: ['INTERVIEW'] },
  { value: 'placed', label: 'Placed / Active', includes: ['PLACED', 'INTERNSHIP_ACTIVE', 'COMPLETED'] },
  { value: 'rejected', label: 'Rejected / withdrawn', includes: ['REJECTED', 'WITHDRAWN', 'ARCHIVED'] },
];

export default function ApplicationsPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [opportunityFilter, setOpportunityFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('pipeline');

  async function loadApplications() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/applications');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not load applications');
      }
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const opportunities = useMemo(() => {
    const map = new Map<string, string>();
    applications.forEach((a) => map.set(a.opportunity.id, a.opportunity.title));
    return Array.from(map.entries());
  }, [applications]);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      if (tab !== 'ALL' && tab !== 'pipeline') {
        const found = PIPELINE_TABS.find((t) => t.value === tab);
        if (found && !found.includes.includes(app.status)) return false;
      } else if (tab === 'pipeline') {
        const pipe = PIPELINE_TABS[0].includes;
        if (!pipe.includes(app.status)) return false;
      }
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
      if (opportunityFilter !== 'ALL' && app.opportunity.id !== opportunityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = [
          app.internProfile.user.fullName,
          app.internProfile.user.email,
          app.opportunity.title,
          app.internProfile.fieldOfStudy?.name,
          app.internProfile.passport?.headline || '',
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [applications, statusFilter, opportunityFilter, search, tab]);

  const stats = useMemo(() => {
    const base = applications;
    return {
      total: base.length,
      received: base.filter((a) => a.status === 'SUBMITTED').length,
      review: base.filter((a) => a.status === 'UNDER_REVIEW').length,
      shortlisted: base.filter((a) => a.status === 'SHORTLISTED').length,
      interview: base.filter((a) => a.status === 'INTERVIEW').length,
      selected: base.filter((a) => a.status === 'SELECTED' || a.status === 'PLACED' || a.status === 'INTERNSHIP_ACTIVE').length,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Applications</h2>
          <p className="text-sm text-slate-500">
            Review, shortlist, interview, and recruit from submitted applications.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500">Received</p>
            <p className="text-2xl font-bold text-blue-700">{stats.received}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500">Under review</p>
            <p className="text-2xl font-bold text-indigo-700">{stats.review}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500">Shortlisted</p>
            <p className="text-2xl font-bold text-amber-700">{stats.shortlisted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500">Interviews</p>
            <p className="text-2xl font-bold text-purple-700">{stats.interview}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500">Selected / Placed</p>
            <p className="text-2xl font-bold text-emerald-700">{stats.selected}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-4 sm:grid-cols-7">
              {PIPELINE_TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] lg:grid-cols-[1fr_200px_200px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search candidate, email, or opportunity…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={opportunityFilter} onValueChange={setOpportunityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Opportunity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All opportunities</SelectItem>
                {opportunities.map(([id, title]) => (
                  <SelectItem key={id} value={id}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === 'ALL' ? 'All statuses' : s.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No applications match the current filters.
            </div>
          ) : (
            <div className="divide-y rounded-xl border">
              {filtered.map((app) => (
                <Link
                  key={app.id}
                  href={`${basePath}/applications/${app.id}`}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3 flex-1">
                    <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                      {app.internProfile.user.fullName
                        .split(' ')
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 truncate">
                          {app.internProfile.user.fullName}
                        </p>
                        {app.candidateRating && (
                          <Badge variant="outline" className="shrink-0">
                            <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                            {app.candidateRating}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {app.opportunity.title}
                        {app.internProfile.fieldOfStudy?.name && (
                          <> · {app.internProfile.fieldOfStudy.name}</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="hidden items-center gap-4 sm:flex">
                    <div className="text-right text-xs text-slate-500">
                      <div className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      {app.interviews && app.interviews.length > 0 && (
                        <div className="inline-flex items-center gap-1 ml-3">
                          <FileText className="h-3 w-3" />
                          {app.interviews.length} interview
                          {app.interviews.length === 1 ? '' : 's'}
                        </div>
                      )}
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
