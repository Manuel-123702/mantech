'use client';
import { Trans, useLingui } from '@lingui/react/macro';


import { useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/i18n/navigation.hooks';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Calendar,
  Video,
  MapPin,
  Phone,
  Clock,
  User,
  ChevronRight,
  Plus,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileText,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type InterviewItem = {
  id: string;
  scheduledAt: string;
  durationMinutes?: number;
  type?: string;
  meetingLink?: string | null;
  locationAddress?: string | null;
  interviewerName?: string | null;
  instructions?: string | null;
  status?: string;
  feedbackNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  application: {
    id: string;
    status: string;
    internProfile: {
      id: string;
      user: { fullName: string; email: string };
    };
    opportunity: {
      id: string;
      title: string;
    };
  };
};

export default function InterviewsPage({ basePath }: { basePath: string }) {
  const { t } = useLingui();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('upcoming');

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<{ id: string; name: string; opportunity: string }[]>([]);
  const [form, setForm] = useState({
    applicationId: '',
    scheduledAt: '',
    durationMinutes: 45,
    type: 'online' as 'online' | 'onsite' | 'phone',
    meetingLink: '',
    locationAddress: '',
    interviewerName: '',
    instructions: '',
  });

  const [feedbackOpen, setFeedbackOpen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [outcome, setOutcome] = useState<'completed' | 'cancelled' | 'rescheduled'>('completed');

  async function loadInterviews() {
    setLoading(true);
    setError(null);
    try {
      const [interviewsRes, applicationsRes] = await Promise.all([
        fetch('/api/interviews'),
        fetch('/api/applications'),
      ]);
      if (!interviewsRes.ok) {
        const d = await interviewsRes.json().catch(() => ({}));
        throw new Error(d.error || 'Could not load interviews');
      }
      const interviewsData = await interviewsRes.json();
      setInterviews(interviewsData.interviews || []);

      if (applicationsRes.ok) {
        const appsData = await applicationsRes.json();
        const list = (appsData.applications || [])
          .filter((a: any) => ['SHORTLISTED', 'UNDER_REVIEW', 'INTERVIEW', 'SELECTED'].includes(a.status))
          .map((a: any) => ({
            id: a.id,
            name: a.internProfile?.user?.fullName || 'Candidate',
            opportunity: a.opportunity?.title || 'Opportunity',
          }));
        setSelectedApplications(list);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInterviews();
  }, []);

  const now = new Date();

  const all = [...interviews].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );
  const upcoming = all.filter(
    (iv) => new Date(iv.scheduledAt) >= now && iv.status !== 'cancelled'
  );
  const past = all.filter(
    (iv) => new Date(iv.scheduledAt) < now || iv.status === 'completed' || iv.status === 'cancelled'
  );

  const displayList = tab === 'upcoming' ? upcoming : tab === 'past' ? past : all;

  async function scheduleInterview() {
    if (!form.applicationId || !form.scheduledAt) return;
    setSaving(true);
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Could not schedule interview');
      }
      setCreateOpen(false);
      setForm({
        applicationId: '',
        scheduledAt: '',
        durationMinutes: 45,
        type: 'online',
        meetingLink: '',
        locationAddress: '',
        interviewerName: '',
        instructions: '',
      });
      await loadInterviews();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveOutcome(ivId: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/interviews/${ivId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: outcome, feedbackNotes: feedback }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Could not update interview');
      }
      await loadInterviews();
      setFeedbackOpen(null);
      setFeedback('');
      setOutcome('completed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const stats = useMemo(() => {
    const scheduled = interviews.filter((iv) => iv.status === 'scheduled').length;
    const completed = interviews.filter((iv) => iv.status === 'completed').length;
    const cancelled = interviews.filter((iv) => iv.status === 'cancelled').length;
    return {
      total: interviews.length,
      scheduled,
      completed,
      cancelled,
      upcoming: upcoming.length,
    };
  }, [interviews, upcoming]);

  function TypeIcon({ type }: { type?: string }) {
    if (type === 'online') return <Video className="h-4 w-4" />;
    if (type === 'onsite') return <MapPin className="h-4 w-4" />;
    return <Phone className="h-4 w-4" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900"><Trans comment="interviews-page h2 visible text">Interviews</Trans></h2>
          <p className="text-sm text-slate-500">
            <Trans comment="interviews-page p visible text">Schedule, track, and record outcomes for candidate interviews.
          </Trans></p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <Trans comment="interviews-page Button visible text">Schedule interview
            </Trans></Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle><Trans comment="interviews-page DialogTitle visible text">Schedule new interview</Trans></DialogTitle>
              <DialogDescription>
                <Trans comment="interviews-page DialogDescription visible text">The candidate will receive an automated notification.
              </Trans></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label><Trans comment="interviews-page Label visible text">Candidate / application *</Trans></Label>
                <Select value={form.applicationId} onValueChange={(v) => setForm({ ...form, applicationId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t({ message: "Select a shortlisted candidate", comment: "interviews-page component placeholder attribute" })} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedApplications.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"— "}{a.opportunity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label><Trans comment="interviews-page Label visible text">Date & time *</Trans></Label>
                <Input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                />
              </div>
              <div>
                <Label><Trans comment="interviews-page Label visible text">Duration (minutes)</Trans></Label>
                <Input
                  type="number"
                  min={15}
                  max={240}
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label><Trans comment="interviews-page Label visible text">Type</Trans></Label>
                <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online"><Trans comment="interviews-page SelectItem visible text">Online / video</Trans></SelectItem>
                    <SelectItem value="onsite"><Trans comment="interviews-page SelectItem visible text">On-site</Trans></SelectItem>
                    <SelectItem value="phone"><Trans comment="interviews-page SelectItem visible text">Phone</Trans></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.type === 'online' && (
                <div className="sm:col-span-2">
                  <Label><Trans comment="interviews-page Label visible text">Meeting link</Trans></Label>
                  <Input
                    placeholder={t({ message: "https://meet.google.com/...", comment: "interviews-page component placeholder attribute" })}
                    value={form.meetingLink}
                    onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                  />
                </div>
              )}
              {form.type === 'onsite' && (
                <div className="sm:col-span-2">
                  <Label><Trans comment="interviews-page Label visible text">Location address</Trans></Label>
                  <Input
                    placeholder={t({ message: "Office address", comment: "interviews-page component placeholder attribute" })}
                    value={form.locationAddress}
                    onChange={(e) => setForm({ ...form, locationAddress: e.target.value })}
                  />
                </div>
              )}
              <div className="sm:col-span-2">
                <Label><Trans comment="interviews-page Label visible text">Interviewer</Trans></Label>
                <Input
                  placeholder={t({ message: "Name of interviewer", comment: "interviews-page component placeholder attribute" })}
                  value={form.interviewerName}
                  onChange={(e) => setForm({ ...form, interviewerName: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label><Trans comment="interviews-page Label visible text">Instructions for candidate</Trans></Label>
                <Textarea
                  rows={3}
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                <Trans comment="interviews-page Button visible text">Cancel
              </Trans></Button>
              <Button onClick={scheduleInterview} disabled={saving || !form.applicationId || !form.scheduledAt}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                <Trans comment="interviews-page Button visible text">Schedule interview
              </Trans></Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500"><Trans comment="interviews-page p visible text">Total</Trans></p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500"><Trans comment="interviews-page p visible text">Upcoming</Trans></p>
            <p className="text-2xl font-bold text-blue-700">{stats.upcoming}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500"><Trans comment="interviews-page p visible text">Scheduled</Trans></p>
            <p className="text-2xl font-bold text-indigo-700">{stats.scheduled}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500"><Trans comment="interviews-page p visible text">Completed</Trans></p>
            <p className="text-2xl font-bold text-emerald-700">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-slate-500"><Trans comment="interviews-page p visible text">Cancelled</Trans></p>
            <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming"><Trans comment="interviews-page TabsTrigger visible text">Upcoming</Trans></TabsTrigger>
              <TabsTrigger value="past"><Trans comment="interviews-page TabsTrigger visible text">Past</Trans></TabsTrigger>
              <TabsTrigger value="all"><Trans comment="interviews-page TabsTrigger visible text">All</Trans></TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : displayList.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Calendar className="mx-auto mb-2 h-10 w-10 text-slate-300" />
              <p><Trans comment="interviews-page p visible text">No interviews to display.</Trans></p>
            </div>
          ) : (
            <div className="divide-y rounded-xl border">
              {displayList.map((iv) => {
                const when = new Date(iv.scheduledAt);
                const isPast = when < now || iv.status === 'completed' || iv.status === 'cancelled';
                return (
                  <div key={iv.id} className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="hidden sm:flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          <span className="text-[10px] uppercase tracking-wide opacity-80">
                            {when.toLocaleString(undefined, { month: 'short' })}
                          </span>
                          <span className="text-xl font-bold leading-none">
                            {when.getDate()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`${basePath}/applications/${iv.application.id}`}
                              className="font-semibold text-slate-900 hover:underline"
                            >
                              {iv.application.internProfile.user.fullName}
                            </Link>
                            <Badge variant="outline" className="inline-flex items-center gap-1 text-xs">
                              <TypeIcon type={iv.type} />
                              {iv.type}
                            </Badge>
                            <Badge
                              variant={
                                iv.status === 'completed'
                                  ? 'default'
                                  : iv.status === 'cancelled'
                                    ? 'destructive'
                                    : 'secondary'
                              }
                            >
                              {iv.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {iv.application.opportunity.title}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {when.toLocaleString()} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"· "}{iv.durationMinutes || 45} <Trans comment="interviews-page span visible text">min
                            </Trans></span>
                            {iv.interviewerName && (
                              <span className="inline-flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {iv.interviewerName}
                              </span>
                            )}
                            {iv.meetingLink && (
                              <a
                                href={iv.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-700 hover:underline break-all"
                              >
                                <Video className="h-3 w-3" />
                                <Trans comment="interviews-page a visible text">Meeting link
                              </Trans></a>
                            )}
                            {iv.locationAddress && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {iv.locationAddress}
                              </span>
                            )}
                          </div>
                          {iv.instructions && (
                            <p className="mt-2 text-xs text-slate-600 rounded-md bg-slate-50 p-2">
                              <Trans comment="interviews-page p visible text">Instructions: </Trans>{iv.instructions}
                            </p>
                          )}
                          {iv.feedbackNotes && (
                            <p className="mt-2 text-xs text-slate-700 rounded-md bg-emerald-50 border border-emerald-200 p-2">
                              <span className="font-semibold"><Trans comment="interviews-page span visible text">Outcome:</Trans></span> {iv.feedbackNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                        <Link
                          href={`${basePath}/applications/${iv.application.id}`}
                        >
                          <Button size="sm" variant="outline">
                            <FileText className="mr-1.5 h-3.5 w-3.5" />
                            <Trans comment="interviews-page Button visible text">Application
                            </Trans><ChevronRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        {!isPast && (
                          <Dialog
                            open={feedbackOpen === iv.id}
                            onOpenChange={(o) => o && setFeedbackOpen(iv.id)}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm"><Trans comment="interviews-page Button visible text">Record outcome</Trans></Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle><Trans comment="interviews-page DialogTitle visible text">Interview outcome</Trans></DialogTitle>
                                <DialogDescription>
                                  <Trans comment="interviews-page DialogDescription visible text">Mark this interview with its result and add feedback notes.
                                </Trans></DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label><Trans comment="interviews-page Label visible text">Outcome</Trans></Label>
                                  <Select
                                    value={outcome}
                                    onValueChange={(v: any) => setOutcome(v)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="completed">
                                        <span className="inline-flex items-center gap-2">
                                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                          <Trans comment="interviews-page span visible text">Completed
                                        </Trans></span>
                                      </SelectItem>
                                      <SelectItem value="rescheduled">
                                        <span className="inline-flex items-center gap-2">
                                          <RefreshCw className="h-4 w-4 text-amber-600" />
                                          <Trans comment="interviews-page span visible text">Rescheduled / No show
                                        </Trans></span>
                                      </SelectItem>
                                      <SelectItem value="cancelled">
                                        <span className="inline-flex items-center gap-2">
                                          <XCircle className="h-4 w-4 text-red-600" />
                                          <Trans comment="interviews-page span visible text">Cancelled
                                        </Trans></span>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label><Trans comment="interviews-page Label visible text">Feedback notes</Trans></Label>
                                  <Textarea
                                    rows={5}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder={t({ message: "How it went, follow-up, hiring recommendation…", comment: "interviews-page component placeholder attribute" })}
                                  />
                                </div>
                              </div>
                              <DialogFooter className="flex-col gap-2 sm:flex-row">
                                <Button variant="ghost" onClick={() => setFeedbackOpen(null)}>
                                  <Trans comment="interviews-page Button visible text">Cancel
                                </Trans></Button>
                                <Button onClick={() => saveOutcome(iv.id)} disabled={saving}>
                                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                  <Trans comment="interviews-page Button visible text">Save outcome
                                </Trans></Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
