'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Filter,
  Star,
  BookOpen,
  MapPin,
  Briefcase,
  Eye,
  FileText,
  Send,
  BookmarkPlus,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useTaxonomy } from '@/lib/use-taxonomy';

type Candidate = {
  id: string;
  user: { fullName: string; avatarUrl?: string | null };
  passport?: { headline?: string | null; summary?: string | null; passportNumber?: string } | null;
  fieldOfStudy?: { name: string } | null;
  specialization?: { name: string } | null;
  region?: { name: string } | null;
  city?: string | null;
  qualification?: string;
  academicLevel?: string | null;
  availability?: string | null;
  preferredWorkMode?: string;
  readinessScore?: number;
  skills?: { skill: { name: string } }[];
  isSaved?: boolean;
  cvFiles?: { id: string; fileName: string }[];
};

export default function CandidatesPage() {
  const { fields, regions, error: taxonomyError } = useTaxonomy();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [cvAccessId, setCvAccessId] = useState<string | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvLoading, setCvLoading] = useState(false);

  const [filters, setFilters] = useState({
    q: '',
    fieldId: '',
    regionId: '',
    qualification: '',
    workMode: '',
    availability: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const res = await fetch(`/api/candidates?${params.toString()}`);
      if (res.status === 403) {
        setIsVerified(false);
        setCandidates([]);
      } else if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not load candidates');
      } else {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  async function handleSearch() {
    await loadCandidates();
  }

  async function saveCandidate(internProfileId: string) {
    setSavingId(internProfileId);
    try {
      const res = await fetch('/api/candidates/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internProfileId }),
      });
      if (res.ok) {
        setCandidates((prev) =>
          prev.map((c) => (c.id === internProfileId ? { ...c, isSaved: true } : c))
        );
      }
    } finally {
      setSavingId(null);
    }
  }

  async function contactCandidate() {
    if (!contactId) return;
    setSavingId(contactId);
    try {
      const res = await fetch('/api/candidate-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internProfileId: contactId,
          message: contactMessage,
          requestedPhoneAccess: true,
          requestedCvAccess: true,
        }),
      });
      if (res.ok) {
        setContactId(null);
        setContactMessage('');
      }
    } finally {
      setSavingId(null);
    }
  }

  async function viewCV(internProfileId: string, cvId?: string) {
    setCvAccessId(internProfileId);
    setCvLoading(true);
    setCvUrl(null);
    try {
      if (!cvId) throw new Error('No CV has been uploaded for this intern.');
      const res = await fetch(`/api/cv/${cvId}/access`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setCvUrl(data.url);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'CV access not authorized. Contact MANTECH for verification.');
      }
    } finally {
      setCvLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Intern Discovery</h2>
          <p className="text-sm text-slate-500">
            Search Intern Passports, shortlist candidates, and request authorized CV access.
          </p>
        </div>
      </div>

      {!isVerified && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Verification required</p>
            <p className="mt-1">
              Candidate search and CV access unlock after MANTECH verifies your organization.
            </p>
          </div>
        </div>
      )}
      {taxonomyError && <p role="alert" className="text-sm text-red-700">{taxonomyError}</p>}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name, headline, qualification, or skills…"
                className="pl-9"
                value={filters.q}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters((v) => !v)}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid gap-4 rounded-xl border bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label>Field</Label>
                <Select
                  onValueChange={(value) =>
                    setFilters((f) => ({ ...f, fieldId: value === 'all' ? '' : value }))
                  }
                  value={filters.fieldId || 'all'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All fields" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All fields</SelectItem>
                    {fields.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Region</Label>
                <Select
                  onValueChange={(value) =>
                    setFilters((f) => ({ ...f, regionId: value === 'all' ? '' : value }))
                  }
                  value={filters.regionId || 'all'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    {regions.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Work mode</Label>
                <Select
                  onValueChange={(value) =>
                    setFilters((f) => ({ ...f, workMode: value === 'all' ? '' : value }))
                  }
                  value={filters.workMode || 'all'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="ONSITE">On-site</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Availability</Label>
                <Input
                  placeholder="e.g. Immediate"
                  value={filters.availability}
                  onChange={(e) => setFilters((f) => ({ ...f, availability: e.target.value }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            {isVerified
              ? 'No candidates match your search. Try broader filters.'
              : 'Candidate discovery is locked until organization verification.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {candidates.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
                    {c.user.fullName.split(' ').map((s) => s[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {c.user.fullName}
                      </h3>
                      {c.isSaved && (
                        <Badge variant="secondary" className="shrink-0">
                          <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                          Saved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                      {c.passport?.headline || c.fieldOfStudy?.name || 'Intern Passport'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  {c.qualification && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                      <BookOpen className="h-3 w-3" />
                      {c.qualification}
                    </span>
                  )}
                  {c.region?.name && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                      <MapPin className="h-3 w-3" />
                      {c.city || c.region.name}
                    </span>
                  )}
                  {c.preferredWorkMode && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                      <Briefcase className="h-3 w-3" />
                      {c.preferredWorkMode}
                    </span>
                  )}
                  {typeof c.readinessScore === 'number' && (
                    <Badge variant="outline">Readiness {c.readinessScore}</Badge>
                  )}
                </div>

                {c.skills && c.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {c.skills.slice(0, 5).map((s) => (
                      <span
                        key={s.skill.name}
                        className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700"
                      >
                        {s.skill.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 border-t pt-3">
                  <Link
                    href={`/intern-passports/${c.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Passport
                    </Button>
                  </Link>
                  <Dialog onOpenChange={(o) => o && viewCV(c.id, c.cvFiles?.[0]?.id)} open={cvAccessId === c.id}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!isVerified}
                        className="w-full"
                      >
                        <FileText className="mr-1.5 h-3.5 w-3.5" />
                        View CV
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Authorized CV access</DialogTitle>
                        <DialogDescription>
                          Access is audited and tied to your verified organization.
                        </DialogDescription>
                      </DialogHeader>
                      {cvLoading ? (
                        <div className="py-6 text-center text-slate-500">
                          Requesting secure access…
                        </div>
                      ) : cvUrl ? (
                        <div className="space-y-3">
                          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            Secure access granted. Access logged.
                          </p>
                          <Button asChild className="w-full">
                            <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                              <FileText className="mr-2 h-4 w-4" />
                              Open CV
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <div className="py-4 text-sm text-slate-500">
                          CV access could not be issued. Upgrade to Professional or verify your
                          organization via WhatsApp.
                        </div>
                      )}
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setCvAccessId(null);
                            setCvUrl(null);
                          }}
                        >
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={savingId === c.id || c.isSaved || !isVerified}
                    onClick={() => saveCandidate(c.id)}
                  >
                    {c.isSaved ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                        Saved
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
                        Shortlist
                      </>
                    )}
                  </Button>
                  <Dialog onOpenChange={(o) => o && setContactId(c.id)} open={contactId === c.id}>
                    <DialogTrigger asChild>
                      <Button size="sm" disabled={!isVerified}>
                        <Send className="mr-1.5 h-3.5 w-3.5" />
                        Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact {c.user.fullName}</DialogTitle>
                        <DialogDescription>
                          Send a recruitment request. The candidate can approve phone and CV
                          access.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Label>Message</Label>
                        <Textarea
                          rows={5}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Introduce your team, the role, and why you are reaching out…"
                        />
                      </div>
                      <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button variant="ghost" onClick={() => setContactId(null)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={contactCandidate}
                          disabled={savingId === c.id}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send request
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
