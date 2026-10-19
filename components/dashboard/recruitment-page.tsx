'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileCheck,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ClipboardList,
  UserCheck,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type PlacementItem = {
  id: string;
  department?: string | null;
  status: string;
  startDate: string;
  endDate: string;
  objectives?: string | null;
  createdAt: string;
  updatedAt: string;
  internProfile: {
    id: string;
    user: { fullName: string; email: string; avatarUrl?: string | null };
  };
  application: {
    id: string;
    status: string;
    opportunity: { id: string; title: string };
  };
  onboardingItems?: {
    id: string;
    title: string;
    description?: string | null;
    isRequired?: boolean;
    isCompleted?: boolean;
    completedAt?: string | null;
  }[];
};

export default function RecruitmentPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [placements, setPlacements] = useState<PlacementItem[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('active');

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    applicationId: '',
    department: '',
    startDate: '',
    endDate: '',
    objectives: '',
  });

  const [placementId, setPlacementId] = useState<string | null>(null);
  const [statusForm, setStatusForm] = useState('CONFIRMED');

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [placeRes, appRes] = await Promise.all([
        fetch('/api/placements'),
        fetch('/api/applications'),
      ]);
      if (!placeRes.ok) {
        const d = await placeRes.json().catch(() => ({}));
        throw new Error(d.error || 'Could not load placements');
      }
      const placeData = await placeRes.json();
      setPlacements(placeData.placements || []);

      if (appRes.ok) {
        const d = await appRes.json();
        const selecteds = (d.applications || []).filter(
          (a: any) => a.status === 'SELECTED' || a.status === 'PLACEMENT_PENDING'
        );
        setApplications(selecteds);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const partitioned = useMemo(() => {
    const all = placements;
    const now = new Date();
    return {
      all,
      pending: all.filter((p) => p.status === 'PENDING'),
      confirmed: all.filter((p) => p.status === 'CONFIRMED'),
      active: all.filter((p) => {
        if (p.status !== 'ACTIVE' && p.status !== 'CONFIRMED') return false;
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        return start <= now && end >= now;
      }).concat(all.filter((p) => p.status === 'ACTIVE')),
      completed: all.filter((p) => p.status === 'COMPLETED'),
      cancelled: all.filter((p) => p.status === 'CANCELLED'),
    };
  }, [placements]);

  const displayed =
    tab === 'active'
      ? partitioned.active
      : tab === 'pending'
        ? partitioned.pending
        : tab === 'completed'
          ? partitioned.completed
          : tab === 'cancelled'
            ? partitioned.cancelled
            : partitioned.all;

  const stats = useMemo(() => {
    return {
      total: placements.length,
      active: partitioned.active.length,
      pending: partitioned.pending.length,
      completed: partitioned.completed.length,
    };
  }, [placements, partitioned]);

  async function createPlacement() {
    if (!form.applicationId || !form.startDate || !form.endDate) return;
    setSaving(true);
    try {
      const res = await fetch('/api/placements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Could not create placement');
      }
      setCreateOpen(false);
      setForm({ applicationId: '', department: '', startDate: '', endDate: '', objectives: '' });
      await loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updatePlacementStatus(pid: string, next: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/placements/${pid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Update failed');
      }
      await loadData();
      setPlacementId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleOnboarding(placementId: string, itemId: string, newState: boolean) {
    setSaving(true);
    try {
      const res = await fetch(`/api/onboarding/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: newState }),
      });
      if (res.ok) await loadData();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Recruitment & Placements</h2>
          <p className="text-sm text-slate-500">
            Selected interns, placement confirmations, active internships, and onboarding milestones.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New placement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create internship placement</DialogTitle>
              <DialogDescription>
                Select a candidate that has already been marked as &ldquo;Selected&rdquo;.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Candidate *</Label>
                <SelectFallback
                  value={form.applicationId}
                  onChange={(v) => setForm({ ...form, applicationId: v })}
                  options={applications.map((a) => ({
                    value: a.id,
                    label: `${a.internProfile?.user?.fullName} — ${a.opportunity?.title}`,
                  }))}
                  placeholder="Select selected candidate"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Department</Label>
                <Input
                  placeholder="e.g. Engineering, Marketing"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
              <div>
                <Label>Start date *</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End date *</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Objectives</Label>
                <Textarea
                  rows={4}
                  value={form.objectives}
                  onChange={(e) => setForm({ ...form, objectives: e.target.value })}
                  placeholder="Learning goals, projects, or expected deliverables…"
                />
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createPlacement} disabled={saving || !form.applicationId || !form.startDate || !form.endDate}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck className="mr-2 h-4 w-4" />}
                Create placement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500">Placements</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500">Active internships</p>
            <p className="text-2xl font-bold text-emerald-700">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500">Pending confirm</p>
            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-blue-700">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {applications.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Awaiting placement ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {applications.map((a) => (
                <Link
                  key={a.id}
                  href={`${basePath}/applications/${a.id}`}
                  className="rounded-xl border bg-white p-3 text-sm hover:border-amber-300 hover:bg-amber-50 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {a.internProfile?.user?.fullName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{a.opportunity?.title}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-amber-600" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-0">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <UserCheck className="mx-auto mb-2 h-10 w-10 text-slate-300" />
              <p>No placements in this view.</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {displayed.map((p) => {
                const start = new Date(p.startDate);
                const end = new Date(p.endDate);
                const now = new Date();
                const total = end.getTime() - start.getTime();
                const progress =
                  total > 0 ? Math.max(0, Math.min(100, ((now.getTime() - start.getTime()) / total) * 100)) : 0;
                const doneItems = p.onboardingItems?.filter((i) => i.isCompleted).length || 0;
                const totalItems = p.onboardingItems?.length || 0;
                const initials = p.internProfile.user.fullName
                  .split(' ')
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join('');

                return (
                  <Card key={p.id} className={cn(
                    'border-l-4',
                    p.status === 'ACTIVE' && 'border-l-emerald-500',
                    p.status === 'COMPLETED' && 'border-l-blue-500',
                    p.status === 'PENDING' && 'border-l-amber-500',
                    p.status === 'CANCELLED' && 'border-l-red-500',
                    p.status === 'CONFIRMED' && 'border-l-indigo-500',
                  )}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm font-bold">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-slate-900 truncate">
                                {p.internProfile.user.fullName}
                              </p>
                              <Badge
                                variant={
                                  p.status === 'COMPLETED'
                                    ? 'default'
                                    : p.status === 'CANCELLED'
                                      ? 'destructive'
                                      : p.status === 'PENDING'
                                        ? 'secondary'
                                        : 'outline'
                                }
                              >
                                {p.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 truncate">{p.application.opportunity.title}</p>
                            <p className="mt-1 text-xs text-slate-500 inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {start.toLocaleDateString()} → {end.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Dialog
                          open={placementId === p.id}
                          onOpenChange={(o) => o && setPlacementId(p.id)}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              Update
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update placement status</DialogTitle>
                              <DialogDescription>
                                Change the status of {p.internProfile.user.fullName}&apos;s placement.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>New status</Label>
                                <SelectFallback
                                  value={statusForm}
                                  onChange={setStatusForm}
                                  options={[
                                    { value: 'PENDING', label: 'Pending' },
                                    { value: 'CONFIRMED', label: 'Confirmed' },
                                    { value: 'ACTIVE', label: 'Active' },
                                    { value: 'COMPLETED', label: 'Completed' },
                                    { value: 'CANCELLED', label: 'Cancelled' },
                                  ]}
                                />
                              </div>
                            </div>
                            <DialogFooter className="flex-col gap-2 sm:flex-row">
                              <Button variant="ghost" onClick={() => setPlacementId(null)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={() => updatePlacementStatus(p.id, statusForm)}
                                disabled={saving}
                              >
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                Save status
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {p.department && (
                        <p className="text-xs text-slate-500">
                          <span className="font-semibold">Department:</span> {p.department}
                        </p>
                      )}

                      {(p.status === 'ACTIVE' || p.status === 'CONFIRMED') && (
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span>Internship progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {p.onboardingItems && p.onboardingItems.length > 0 && (
                        <div className="rounded-xl border bg-slate-50/60 p-3">
                          <p className="text-xs font-semibold text-slate-700 mb-2 inline-flex items-center gap-1">
                            <ClipboardList className="h-3.5 w-3.5" />
                            Onboarding ({doneItems}/{totalItems})
                          </p>
                          <ul className="space-y-2">
                            {p.onboardingItems.map((item) => (
                              <li key={item.id}>
                                <label className="flex items-start gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    checked={!!item.isCompleted}
                                    onChange={(e) => toggleOnboarding(p.id, item.id, e.target.checked)}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className={cn(
                                        'text-sm',
                                        item.isCompleted && 'text-slate-500 line-through'
                                      )}
                                    >
                                      {item.title}
                                    </p>
                                    {item.description && (
                                      <p className="text-xs text-slate-500">{item.description}</p>
                                    )}
                                  </div>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {p.objectives && (
                        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                          <span className="font-semibold text-slate-900">Objectives:</span>{' '}
                          {p.objectives}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                        <Link href={`${basePath}/applications/${p.application.id}`}>
                          <Button size="sm" variant="ghost">
                            Application
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SelectFallback({
  value,
  onChange,
  options,
  placeholder = 'Select',
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
