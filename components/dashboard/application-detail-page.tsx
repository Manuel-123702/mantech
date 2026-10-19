'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';
import { waCandidateLink } from '@/lib/whatsapp';
import {
  ArrowLeft,
  FileText,
  Mail,
  Phone,
  Star,
  Calendar,
  Send,
  BookOpen,
  MapPin,
  Briefcase,
  FileCheck,
  Clock,
  UserCheck,
  XCircle,
  MessageSquare,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { StatusBadge } from '@/components/company/status-badge';
import { cn } from '@/lib/utils';

type ApplicationDetail = {
  id: string;
  status: string;
  coverLetter?: string | null;
  candidateRating?: number | null;
  internalNotes?: string | null;
  readinessScore?: number;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  internProfile: {
    id: string;
    phone?: string | null;
    isPhonePublic?: boolean;
    qualification?: string;
    academicLevel?: string | null;
    institution?: string | null;
    region?: { name: string } | null;
    city?: string | null;
    preferredWorkMode?: string;
    availability?: string | null;
    cvUrl?: string;
    cvFileName?: string | null;
    cvFiles?: { id: string; fileName: string }[];
    readinessScore?: number;
    user: { fullName: string; email: string; avatarUrl?: string | null };
    passport?: { headline?: string | null; summary?: string | null; passportNumber?: string } | null;
    fieldOfStudy?: { name: string } | null;
    specialization?: { name: string } | null;
    skills?: { skill: { name: string }; proficiency?: string }[];
    educations?: { institution: string; qualification: string; field: string; startYear: number; endYear?: number | null; isCurrent?: boolean }[];
  };
  opportunity: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    department?: string | null;
    city?: string;
    workMode?: string;
    durationMonths?: number;
    applicationMethod?: string;
    deadline?: string;
  };
  interviews?: {
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
  }[];
  placement?: {
    id: string;
    department?: string | null;
    status: string;
    startDate: string;
    endDate: string;
    objectives?: string | null;
    onboardingItems?: { id: string; title: string; description?: string | null; isRequired?: boolean; isCompleted?: boolean }[];
  } | null;
  statusHistory?: { status: string; note?: string | null; actorName?: string | null; createdAt: string }[];
};

const STATUSES = [
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'PLACEMENT_PENDING',
  'PLACED',
  'INTERNSHIP_ACTIVE',
  'COMPLETED',
  'REJECTED',
  'WITHDRAWN',
  'ARCHIVED',
];

export default function ApplicationDetailPage({ basePath }: { basePath: string }) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [interviewOpen, setInterviewOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    scheduledAt: '',
    durationMinutes: 45,
    type: 'online' as 'online' | 'onsite' | 'phone',
    meetingLink: '',
    locationAddress: '',
    interviewerName: '',
    instructions: '',
  });

  const [placementOpen, setPlacementOpen] = useState(false);
  const [placementForm, setPlacementForm] = useState({
    department: '',
    startDate: '',
    endDate: '',
    objectives: '',
  });

  const loadApplication = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/applications/${params.id}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not load application');
      }
      const data = await res.json();
      const a = data.application as ApplicationDetail;
      setApp(a);
      setRating(a.candidateRating ?? null);
      setNotes(a.internalNotes || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) void loadApplication();
  }, [loadApplication, params?.id]);

  async function updateStatus(nextStatus: string) {
    if (!app) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, candidateRating: rating, internalNotes: notes }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Update failed');
      }
      const d = await res.json();
      setApp({ ...app, ...d.application });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveMetadata() {
    if (!app) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateRating: rating, internalNotes: notes }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Save failed');
      }
      const d = await res.json();
      setApp({ ...app, ...d.application });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function rejectApplication() {
    if (!app) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', rejectionReason: rejectReason }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Update failed');
      }
      const d = await res.json();
      setApp({ ...app, ...d.application });
      setRejectOpen(false);
      setRejectReason('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function scheduleInterview() {
    if (!app) return;
    setSaving(true);
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: app.id, ...interviewForm }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Could not schedule interview');
      }
      setInterviewOpen(false);
      await loadApplication();
      setInterviewForm({
        scheduledAt: '',
        durationMinutes: 45,
        type: 'online',
        meetingLink: '',
        locationAddress: '',
        interviewerName: '',
        instructions: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function createPlacement() {
    if (!app) return;
    setSaving(true);
    try {
      const res = await fetch('/api/placements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: app.id, ...placementForm }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Could not create placement');
      }
      setPlacementOpen(false);
      await loadApplication();
      setPlacementForm({ department: '', startDate: '', endDate: '', objectives: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
    );
  }

  if (!app) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-slate-500">
          {error || 'Application not found.'}
        </CardContent>
      </Card>
    );
  }

  const initials = app.internProfile.user.fullName
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`${basePath}/applications`}>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All applications
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {app.internProfile.user.fullName}
                  </h2>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-slate-500">
                  Applied for <Link href={`/internships/${app.opportunity.slug}`} className="text-blue-600 hover:underline font-medium">{app.opportunity.title}</Link>
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {app.internProfile.user.email}
                  </span>
                  {app.internProfile.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {app.internProfile.phone}
                    </span>
                  )}
                  {app.internProfile.fieldOfStudy?.name && (
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {app.internProfile.fieldOfStudy.name}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Applied {new Date(app.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-wrap gap-2 justify-end">
              {app.status === 'SUBMITTED' && (
                <Button onClick={() => updateStatus('UNDER_REVIEW')} disabled={saving}>
                  Start review
                </Button>
              )}
              {(app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW') && (
                <Button variant="outline" onClick={() => updateStatus('SHORTLISTED')} disabled={saving}>
                  <Star className="mr-2 h-4 w-4" />
                  Shortlist
                </Button>
              )}
              {(app.status === 'SHORTLISTED' || app.status === 'UNDER_REVIEW') && (
                <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule interview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Schedule interview</DialogTitle>
                      <DialogDescription>
                        The candidate will be notified automatically.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label>Date & time *</Label>
                        <Input
                          type="datetime-local"
                          value={interviewForm.scheduledAt}
                          onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          min={15}
                          max={240}
                          value={interviewForm.durationMinutes}
                          onChange={(e) => setInterviewForm({ ...interviewForm, durationMinutes: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={interviewForm.type}
                          onValueChange={(v: any) => setInterviewForm({ ...interviewForm, type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">Online / video</SelectItem>
                            <SelectItem value="onsite">On-site</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {interviewForm.type === 'online' && (
                        <div className="sm:col-span-2">
                          <Label>Meeting link</Label>
                          <Input
                            placeholder="https://meet.google.com/..."
                            value={interviewForm.meetingLink}
                            onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                          />
                        </div>
                      )}
                      {interviewForm.type === 'onsite' && (
                        <div className="sm:col-span-2">
                          <Label>Location address</Label>
                          <Input
                            placeholder="Office address"
                            value={interviewForm.locationAddress}
                            onChange={(e) => setInterviewForm({ ...interviewForm, locationAddress: e.target.value })}
                          />
                        </div>
                      )}
                      <div className="sm:col-span-2">
                        <Label>Interviewer</Label>
                        <Input
                          placeholder="Name of interviewer"
                          value={interviewForm.interviewerName}
                          onChange={(e) => setInterviewForm({ ...interviewForm, interviewerName: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Instructions for candidate</Label>
                        <Textarea
                          rows={3}
                          value={interviewForm.instructions}
                          onChange={(e) => setInterviewForm({ ...interviewForm, instructions: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                      <Button variant="ghost" onClick={() => setInterviewOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={scheduleInterview} disabled={saving || !interviewForm.scheduledAt}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                        Schedule
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {(app.status === 'INTERVIEW' || app.status === 'SHORTLISTED') && (
                <Button variant="outline" onClick={() => updateStatus('SELECTED')} disabled={saving}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Mark as selected
                </Button>
              )}
              {(app.status === 'SELECTED' || app.status === 'PLACEMENT_PENDING') && (
                <Dialog open={placementOpen} onOpenChange={setPlacementOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <FileCheck className="mr-2 h-4 w-4" />
                      Create placement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Create internship placement</DialogTitle>
                      <DialogDescription>
                        Confirm start, end, and objectives. The intern will be notified.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label>Department</Label>
                        <Input
                          placeholder={app.opportunity.department || 'e.g. Engineering'}
                          value={placementForm.department}
                          onChange={(e) => setPlacementForm({ ...placementForm, department: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Start date *</Label>
                        <Input
                          type="date"
                          value={placementForm.startDate}
                          onChange={(e) => setPlacementForm({ ...placementForm, startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>End date *</Label>
                        <Input
                          type="date"
                          value={placementForm.endDate}
                          onChange={(e) => setPlacementForm({ ...placementForm, endDate: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Objectives</Label>
                        <Textarea
                          rows={4}
                          value={placementForm.objectives}
                          onChange={(e) => setPlacementForm({ ...placementForm, objectives: e.target.value })}
                          placeholder="Learning goals, projects, or deliverables…"
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                      <Button variant="ghost" onClick={() => setPlacementOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={createPlacement}
                        disabled={saving || !placementForm.startDate || !placementForm.endDate}
                      >
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck className="mr-2 h-4 w-4" />}
                        Create placement
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="ml-auto sm:ml-0">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject application</DialogTitle>
                    <DialogDescription>
                      You can optionally share a reason.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Label>Reason (optional)</Label>
                    <Textarea
                      rows={4}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Brief reason for rejection…"
                    />
                  </div>
                  <DialogFooter className="flex-col gap-2 sm:flex-row">
                    <Button variant="ghost" onClick={() => setRejectOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={rejectApplication} disabled={saving}>
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                      Confirm reject
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Candidate</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="placement">Placement</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {app.internProfile.passport?.summary && (
                    <div className="rounded-xl bg-slate-50 p-4 text-slate-700">
                      {app.internProfile.passport.summary}
                    </div>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Qualification</p>
                      <p className="font-medium text-slate-900">{app.internProfile.qualification || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Academic level</p>
                      <p className="font-medium text-slate-900">{app.internProfile.academicLevel || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Institution</p>
                      <p className="font-medium text-slate-900">{app.internProfile.institution || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Specialization</p>
                      <p className="font-medium text-slate-900">{app.internProfile.specialization?.name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Location</p>
                      <p className="font-medium text-slate-900 inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        {app.internProfile.city || app.internProfile.region?.name || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Work mode</p>
                      <p className="font-medium text-slate-900 inline-flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                        {app.internProfile.preferredWorkMode || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Availability</p>
                      <p className="font-medium text-slate-900">{app.internProfile.availability || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Readiness</p>
                      <p className="font-medium text-slate-900">{app.internProfile.readinessScore ?? app.readinessScore ?? '—'}</p>
                    </div>
                  </div>

                  {app.internProfile.cvFiles?.[0] && (
                    <div className="rounded-xl border bg-slate-50 p-3">
                      <p className="mb-2 text-sm text-slate-700">{app.internProfile.cvFiles[0].fileName}</p>
                      <Button variant="outline" onClick={async () => {
                        const response = await fetch(`/api/cv/${app.internProfile.cvFiles?.[0].id}/access`, { method: 'POST' });
                        const data = await response.json();
                        if (response.ok && data.signedUrl) window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
                        else setError(data.error || 'CV access could not be authorized.');
                      }}>
                        <FileText className="mr-2 h-4 w-4" />Open authorized CV
                      </Button>
                    </div>
                  )}

                  {app.internProfile.skills && app.internProfile.skills.length > 0 && (
                    <div>
                      <p className="text-xs uppercase text-slate-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {app.internProfile.skills.map((s) => (
                          <Badge key={s.skill.name} variant="secondary">
                            {s.skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {app.internProfile.educations && app.internProfile.educations.length > 0 && (
                    <div>
                      <p className="text-xs uppercase text-slate-500 mb-2">Education</p>
                      <div className="space-y-2">
                        {app.internProfile.educations.map((e, i) => (
                          <div key={i} className="rounded-lg border p-3">
                            <p className="font-medium text-slate-900">
                              {e.qualification} · {e.field}
                            </p>
                            <p className="text-sm text-slate-500">
                              {e.institution} · {e.startYear}
                              {e.endYear ? ` – ${e.endYear}` : e.isCurrent ? ' – Present' : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="application" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cover letter</CardTitle>
                </CardHeader>
                <CardContent>
                  {app.coverLetter ? (
                    <div className="whitespace-pre-wrap text-sm text-slate-700">{app.coverLetter}</div>
                  ) : (
                    <p className="text-slate-500 text-sm">Candidate did not include a cover letter.</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Opportunity summary</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Role</p>
                      <p className="font-medium text-slate-900">{app.opportunity.title}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Department</p>
                      <p className="font-medium text-slate-900">{app.opportunity.department || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Location</p>
                      <p className="font-medium text-slate-900">{app.opportunity.city || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Work mode</p>
                      <p className="font-medium text-slate-900">{app.opportunity.workMode || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Duration</p>
                      <p className="font-medium text-slate-900">
                        {app.opportunity.durationMonths ? `${app.opportunity.durationMonths} months` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Deadline</p>
                      <p className="font-medium text-slate-900">
                        {app.opportunity.deadline ? new Date(app.opportunity.deadline).toLocaleDateString() : '—'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interviews" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Interviews</CardTitle>
                  <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        New interview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Schedule interview</DialogTitle>
                        <DialogDescription>
                          The candidate will be notified automatically.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Label>Date & time *</Label>
                          <Input
                            type="datetime-local"
                            value={interviewForm.scheduledAt}
                            onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Duration (minutes)</Label>
                          <Input
                            type="number"
                            min={15}
                            max={240}
                            value={interviewForm.durationMinutes}
                            onChange={(e) => setInterviewForm({ ...interviewForm, durationMinutes: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select
                            value={interviewForm.type}
                            onValueChange={(v: any) => setInterviewForm({ ...interviewForm, type: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">Online / video</SelectItem>
                              <SelectItem value="onsite">On-site</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {interviewForm.type === 'online' && (
                          <div className="sm:col-span-2">
                            <Label>Meeting link</Label>
                            <Input
                              placeholder="https://meet.google.com/..."
                              value={interviewForm.meetingLink}
                              onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                            />
                          </div>
                        )}
                        {interviewForm.type === 'onsite' && (
                          <div className="sm:col-span-2">
                            <Label>Location address</Label>
                            <Input
                              placeholder="Office address"
                              value={interviewForm.locationAddress}
                              onChange={(e) => setInterviewForm({ ...interviewForm, locationAddress: e.target.value })}
                            />
                          </div>
                        )}
                        <div className="sm:col-span-2">
                          <Label>Interviewer</Label>
                          <Input
                            placeholder="Name of interviewer"
                            value={interviewForm.interviewerName}
                            onChange={(e) => setInterviewForm({ ...interviewForm, interviewerName: e.target.value })}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label>Instructions</Label>
                          <Textarea
                            rows={3}
                            value={interviewForm.instructions}
                            onChange={(e) => setInterviewForm({ ...interviewForm, instructions: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button variant="ghost" onClick={() => setInterviewOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={scheduleInterview} disabled={saving || !interviewForm.scheduledAt}>
                          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                          Schedule
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {!app.interviews || app.interviews.length === 0 ? (
                    <p className="py-8 text-center text-slate-500">No interviews yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {app.interviews.map((iv) => (
                        <div key={iv.id} className="rounded-xl border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold text-slate-900">
                                <Calendar className="mr-2 inline h-4 w-4 text-slate-500" />
                                {new Date(iv.scheduledAt).toLocaleString()}
                              </p>
                              <p className="text-sm text-slate-500">
                                {iv.type} · {iv.durationMinutes || 45} min
                                {iv.interviewerName ? ` · ${iv.interviewerName}` : ''}
                              </p>
                            </div>
                            <Badge variant={iv.status === 'cancelled' ? 'destructive' : iv.status === 'completed' ? 'default' : 'secondary'}>
                              {iv.status}
                            </Badge>
                          </div>
                          {iv.meetingLink && (
                            <p className="mt-2 text-sm text-blue-700 break-all">
                              <a href={iv.meetingLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {iv.meetingLink}
                              </a>
                            </p>
                          )}
                          {iv.locationAddress && (
                            <p className="mt-2 text-sm text-slate-600">{iv.locationAddress}</p>
                          )}
                          {iv.instructions && (
                            <p className="mt-2 text-sm text-slate-600">{iv.instructions}</p>
                          )}
                          {iv.feedbackNotes && (
                            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                              <p className="font-semibold text-slate-900 mb-1">Feedback</p>
                              {iv.feedbackNotes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="placement" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Placement & onboarding</CardTitle>
                  <Dialog open={placementOpen} onOpenChange={setPlacementOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" disabled={app.status !== 'SELECTED' && app.status !== 'PLACEMENT_PENDING' && !!app.placement}>
                        <FileCheck className="mr-2 h-4 w-4" />
                        {app.placement ? 'Active placement' : 'Create placement'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Create internship placement</DialogTitle>
                        <DialogDescription>
                          Confirm start, end, and objectives. The intern will be notified.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Label>Department</Label>
                          <Input
                            placeholder={app.opportunity.department || 'e.g. Engineering'}
                            value={placementForm.department}
                            onChange={(e) => setPlacementForm({ ...placementForm, department: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Start date *</Label>
                          <Input
                            type="date"
                            value={placementForm.startDate}
                            onChange={(e) => setPlacementForm({ ...placementForm, startDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>End date *</Label>
                          <Input
                            type="date"
                            value={placementForm.endDate}
                            onChange={(e) => setPlacementForm({ ...placementForm, endDate: e.target.value })}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label>Objectives</Label>
                          <Textarea
                            rows={4}
                            value={placementForm.objectives}
                            onChange={(e) => setPlacementForm({ ...placementForm, objectives: e.target.value })}
                            placeholder="Learning goals, projects, or deliverables…"
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button variant="ghost" onClick={() => setPlacementOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={createPlacement}
                          disabled={saving || !placementForm.startDate || !placementForm.endDate}
                        >
                          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck className="mr-2 h-4 w-4" />}
                          Create placement
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {!app.placement ? (
                    <p className="py-8 text-center text-slate-500">
                      No placement created yet. Select the intern first, then create a placement.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2 text-sm">
                        <div>
                          <p className="text-xs uppercase text-slate-500">Status</p>
                          <StatusBadge status={app.placement.status} />
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-500">Department</p>
                          <p className="font-medium text-slate-900">{app.placement.department || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-500">Start</p>
                          <p className="font-medium text-slate-900">
                            {new Date(app.placement.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-500">End</p>
                          <p className="font-medium text-slate-900">
                            {new Date(app.placement.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {app.placement.objectives && (
                        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                          <p className="font-semibold text-slate-900 mb-1">Objectives</p>
                          {app.placement.objectives}
                        </div>
                      )}
                      {app.placement.onboardingItems && app.placement.onboardingItems.length > 0 && (
                        <div>
                          <p className="text-xs uppercase text-slate-500 mb-2">Onboarding checklist</p>
                          <div className="space-y-2">
                            {app.placement.onboardingItems.map((item) => (
                              <div
                                key={item.id}
                                className={cn(
                                  'rounded-lg border p-3 flex items-start gap-3',
                                  item.isCompleted && 'bg-emerald-50 border-emerald-200'
                                )}
                              >
                                {item.isCompleted ? (
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                                ) : (
                                  <Clock className="mt-0.5 h-4 w-4 text-slate-400" />
                                )}
                                <div>
                                  <p className="font-medium text-slate-900">{item.title}</p>
                                  {item.description && (
                                    <p className="text-sm text-slate-500">{item.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Status history</CardTitle>
                </CardHeader>
                <CardContent>
                  {!app.statusHistory || app.statusHistory.length === 0 ? (
                    <p className="py-8 text-center text-slate-500">No activity recorded.</p>
                  ) : (
                    <ol className="space-y-4 border-l border-slate-200 pl-4">
                      {app.statusHistory.map((h, i) => (
                        <li key={i} className="relative">
                          <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={h.status} />
                            <span className="text-xs text-slate-500">
                              {new Date(h.createdAt).toLocaleString()}
                              {h.actorName ? ` · ${h.actorName}` : ''}
                            </span>
                          </div>
                          {h.note && <p className="mt-1 text-sm text-slate-600">{h.note}</p>}
                        </li>
                      ))}
                    </ol>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="mb-2 block">Status</Label>
                <Select
                  value={app.status}
                  onValueChange={(v) => updateStatus(v)}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replaceAll('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Candidate rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1"
                    >
                      <Star
                        className={cn(
                          'h-7 w-7 transition-colors',
                          rating && n <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">
                  <MessageSquare className="mr-1 inline h-3.5 w-3.5" />
                  Internal notes
                </Label>
                <Textarea
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Private recruiter notes about this candidate…"
                />
              </div>

              <Button className="w-full" onClick={saveMetadata} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Save notes & rating
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {waCandidateLink(app.internProfile.phone) ? (
                <Button variant="outline" asChild className="w-full justify-start">
                  <a
                    href={waCandidateLink(app.internProfile.phone, 'regarding your application on MANTECH Nexus')!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="mr-2 h-4 w-4" title="WhatsApp" />
                    WhatsApp candidate
                  </a>
                </Button>
              ) : null}
              {app.internProfile.phone && (
                <Button variant="outline" asChild className="w-full justify-start">
                  <a href={`tel:${app.internProfile.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call {app.internProfile.phone}
                  </a>
                </Button>
              )}
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href={`/intern-passports/${app.internProfile.id}`} target="_blank">
                  <FileText className="mr-2 h-4 w-4" />
                  View Intern Passport
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className || ''}`} />;
}
