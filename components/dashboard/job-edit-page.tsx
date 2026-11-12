'use client';
import { Trans, useLingui } from '@lingui/react/macro';


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation.hooks';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useTaxonomy } from '@/lib/use-taxonomy';

type FormState = {
  title: string;
  description: string;
  department: string;
  fieldId: string;
  specializationId: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationLevel: string;
  regionId: string;
  city: string;
  location: string;
  workMode: string;
  salaryMinXAF: string;
  salaryMaxXAF: string;
  type: string;
  expiryDate: string;
  isRemote: boolean;
  isFeatured: boolean;
  applicationMethod: string;
  applicationUrl: string;
  externalPlatform: string;
  instructions: string;
  contactEmail: string;
};

const emptyForm: FormState = {
  title: '',
  description: '',
  department: '',
  fieldId: '',
  specializationId: '',
  requiredSkills: [],
  preferredSkills: [],
  educationLevel: '',
  regionId: '',
  city: '',
  location: '',
  workMode: 'ONSITE',
  salaryMinXAF: '',
  salaryMaxXAF: '',
  type: 'FULL_TIME',
  expiryDate: '',
  isRemote: false,
  isFeatured: false,
  applicationMethod: 'MANTECH',
  applicationUrl: '',
  externalPlatform: '',
  instructions: '',
  contactEmail: '',
};

export default function JobEditPage({ backHref }: { backHref: string }) {
  const { t } = useLingui();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { fields, regions, error: taxonomyError } = useTaxonomy();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        if (!res.ok) throw new Error('Could not load job');
        const data = await res.json();
        const j = data.job;
        setForm({
          title: j.title || '',
          description: j.description || '',
          department: j.department || '',
          fieldId: j.fieldId || '',
          specializationId: j.specializationId || '',
          requiredSkills: j.requiredSkills || [],
          preferredSkills: j.preferredSkills || [],
          educationLevel: j.educationLevel || '',
          regionId: j.regionId || '',
          city: j.city || '',
          location: j.location || '',
          workMode: j.workMode || 'ONSITE',
          salaryMinXAF: j.salaryMinXAF ? String(j.salaryMinXAF) : '',
          salaryMaxXAF: j.salaryMaxXAF ? String(j.salaryMaxXAF) : '',
          type: j.type || 'FULL_TIME',
          expiryDate: j.expiryDate ? new Date(j.expiryDate).toISOString().slice(0, 10) : '',
          isRemote: !!j.isRemote,
          isFeatured: !!j.isFeatured,
          applicationMethod: j.applicationMethod || 'MANTECH',
          applicationUrl: j.applicationUrl || '',
          externalPlatform: j.externalPlatform || '',
          instructions: j.instructions || '',
          contactEmail: j.contactEmail || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job');
      } finally {
        setLoading(false);
      }
    })();
  }, [params?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/jobs/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          salaryMinXAF: form.salaryMinXAF ? Number(form.salaryMinXAF) : null,
          salaryMaxXAF: form.salaryMaxXAF ? Number(form.salaryMaxXAF) : null,
          expiryDate: form.expiryDate ? new Date(form.expiryDate) : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update job');
      }

      router.push(backHref);
    } catch (err: any) {
      setError(err.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  const handleSkillAdd = (skill: string, type: 'required' | 'preferred') => {
    if (skill && !form[type === 'required' ? 'requiredSkills' : 'preferredSkills'].includes(skill)) {
      setForm(prev => ({
        ...prev,
        [type === 'required' ? 'requiredSkills' : 'preferredSkills']:
          [...prev[type === 'required' ? 'requiredSkills' : 'preferredSkills'], skill],
      }));
    }
  };

  const handleSkillRemove = (skill: string, type: 'required' | 'preferred') => {
    setForm(prev => ({
      ...prev,
      [type === 'required' ? 'requiredSkills' : 'preferredSkills']:
        prev[type === 'required' ? 'requiredSkills' : 'preferredSkills'].filter(s => s !== skill),
    }));
  };

  if (loading) {
    return (
      <div className="container-mantech px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Loader2 className="w-8 h-8 mx-auto animate-spin mb-4 text-slate-400" />
            <p className="text-sm text-slate-500"><Trans comment="job-edit-page p visible text">Loading job…</Trans></p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-mantech px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <h2 className="text-sm font-semibold text-red-800">{error}</h2>
            <Link href={backHref} className="mt-4 inline-block">
              <Button variant="outline"><Trans comment="job-edit-page Button visible text">Back to Jobs</Trans></Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-mantech px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href={backHref}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <Trans comment="job-edit-page Button visible text">Back to Jobs
            </Trans></Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900"><Trans comment="job-edit-page h1 visible text">Edit Job Posting</Trans></h1>
          <p className="text-slate-600">
            <Trans comment="job-edit-page p visible text">Update the details of this job vacancy.
          </Trans></p>
        </div>

        {taxonomyError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-6">
            {taxonomyError}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-6">
            {error}
          </div>
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title"><Trans comment="job-edit-page Label visible text">Job Title *</Trans></Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={t({ message: "e.g. Software Engineer, Accountant, Marketing Manager", comment: "job-edit-page component placeholder attribute" })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description"><Trans comment="job-edit-page Label visible text">Job Description *</Trans></Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={t({ message: "Describe the role, responsibilities, and what the candidate will do…", comment: "job-edit-page component placeholder attribute" })}
                  rows={5}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="department"><Trans comment="job-edit-page Label visible text">Department</Trans></Label>
                  <Input
                    id="department"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder={t({ message: "e.g. Engineering, Sales, HR", comment: "job-edit-page component placeholder attribute" })}
                  />
                </div>
                <div>
                  <Label htmlFor="educationLevel"><Trans comment="job-edit-page Label visible text">Education Level</Trans></Label>
                  <Input
                    id="educationLevel"
                    value={form.educationLevel}
                    onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
                    placeholder={t({ message: "e.g. Bachelor, HND, Master", comment: "job-edit-page component placeholder attribute" })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="field"><Trans comment="job-edit-page Label visible text">Professional Field</Trans></Label>
                  <Select
                    onValueChange={(value) => setForm({ ...form, fieldId: value, specializationId: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t({ message: "Select field", comment: "job-edit-page component placeholder attribute" })} />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="specialization"><Trans comment="job-edit-page Label visible text">Specialization</Trans></Label>
                  <Select
                    onValueChange={(value) => setForm({ ...form, specializationId: value })}
                    disabled={!form.fieldId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t({ message: "Select specialization", comment: "job-edit-page component placeholder attribute" })} />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.find((f) => f.id === form.fieldId)?.specializations.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="region"><Trans comment="job-edit-page Label visible text">Region</Trans></Label>
                  <Select onValueChange={(value) => setForm({ ...form, regionId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t({ message: "Select region", comment: "job-edit-page component placeholder attribute" })} />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="city"><Trans comment="job-edit-page Label visible text">City *</Trans></Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder={t({ message: "e.g. Douala, Yaoundé", comment: "job-edit-page component placeholder attribute" })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location"><Trans comment="job-edit-page Label visible text">Location / Address</Trans></Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder={t({ message: "e.g. Bonapriso, Douala", comment: "job-edit-page component placeholder attribute" })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="workMode"><Trans comment="job-edit-page Label visible text">Work Mode</Trans></Label>
                  <Select
                    value={form.workMode}
                    onValueChange={(value) => setForm({ ...form, workMode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t({ message: "Select work mode", comment: "job-edit-page component placeholder attribute" })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONSITE"><Trans comment="job-edit-page SelectItem visible text">On-site</Trans></SelectItem>
                      <SelectItem value="HYBRID"><Trans comment="job-edit-page SelectItem visible text">Hybrid</Trans></SelectItem>
                      <SelectItem value="REMOTE"><Trans comment="job-edit-page SelectItem visible text">Remote</Trans></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type"><Trans comment="job-edit-page Label visible text">Job Type</Trans></Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) => setForm({ ...form, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t({ message: "Select type", comment: "job-edit-page component placeholder attribute" })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME"><Trans comment="job-edit-page SelectItem visible text">Full-time</Trans></SelectItem>
                      <SelectItem value="PART_TIME"><Trans comment="job-edit-page SelectItem visible text">Part-time</Trans></SelectItem>
                      <SelectItem value="CONTRACT"><Trans comment="job-edit-page SelectItem visible text">Contract</Trans></SelectItem>
                      <SelectItem value="INTERNSHIP"><Trans comment="job-edit-page SelectItem visible text">Internship</Trans></SelectItem>
                      <SelectItem value="VOLUNTEER"><Trans comment="job-edit-page SelectItem visible text">Volunteer</Trans></SelectItem>
                      <SelectItem value="FREELANCE"><Trans comment="job-edit-page SelectItem visible text">Freelance</Trans></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Checkbox
                    checked={form.isRemote}
                    onCheckedChange={(checked) => setForm({ ...form, isRemote: !!checked })}
                  />
                  <Label htmlFor="isRemote" className="ml-2 text-sm text-slate-600">
                    <Trans comment="job-edit-page Label visible text">Remote position
                  </Trans></Label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="salaryMinXAF"><Trans comment="job-edit-page Label visible text">Salary Min (XAF)</Trans></Label>
                  <Input
                    id="salaryMinXAF"
                    type="number"
                    value={form.salaryMinXAF}
                    onChange={(e) => setForm({ ...form, salaryMinXAF: e.target.value })}
                    placeholder={t({ message: "e.g. 150000", comment: "job-edit-page component placeholder attribute" })}
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMaxXAF"><Trans comment="job-edit-page Label visible text">Salary Max (XAF)</Trans></Label>
                  <Input
                    id="salaryMaxXAF"
                    type="number"
                    value={form.salaryMaxXAF}
                    onChange={(e) => setForm({ ...form, salaryMaxXAF: e.target.value })}
                    placeholder={t({ message: "e.g. 300000", comment: "job-edit-page component placeholder attribute" })}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate"><Trans comment="job-edit-page Label visible text">Expiry Date *</Trans></Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  <Trans comment="job-edit-page h3 visible text">Required Skills
                </Trans></h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.requiredSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/60 text-xs font-semibold text-blue-800 flex items-center gap-2">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill, 'required')}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"×"}</button>
                    </span>
                  ))}
                  {form.requiredSkills.length === 0 && (
                    <p className="text-xs text-slate-400 italic"><Trans comment="job-edit-page p visible text">No required skills added yet.</Trans></p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="new-required-skill"
                    placeholder={t({ message: "Add a required skill…", comment: "job-edit-page component placeholder attribute" })}
                    className="flex-1 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById('new-required-skill') as HTMLInputElement | null;
                      if (input?.value) {
                        handleSkillAdd(input.value, 'required');
                        input.value = '';
                      }
                    }}
                  >
                    <Trans comment="job-edit-page Button visible text">Add
                  </Trans></Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  <Trans comment="job-edit-page h3 visible text">Preferred Skills
                </Trans></h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.preferredSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-2">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill, 'preferred')}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"×"}</button>
                    </span>
                  ))}
                  {form.preferredSkills.length === 0 && (
                    <p className="text-xs text-slate-400 italic"><Trans comment="job-edit-page p visible text">No preferred skills added yet.</Trans></p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="new-preferred-skill"
                    placeholder={t({ message: "Add a preferred skill…", comment: "job-edit-page component placeholder attribute" })}
                    className="flex-1 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById('new-preferred-skill') as HTMLInputElement | null;
                      if (input?.value) {
                        handleSkillAdd(input.value, 'preferred');
                        input.value = '';
                      }
                    }}
                  >
                    <Trans comment="job-edit-page Button visible text">Add
                  </Trans></Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  <Trans comment="job-edit-page h3 visible text">Application Method
                </Trans></h3>
                <div>
                  <Label htmlFor="applicationMethod"><Trans comment="job-edit-page Label visible text">Application Method *</Trans></Label>
                  <Select
                    onValueChange={(value) => setForm({ ...form, applicationMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t({ message: "Select application method", comment: "job-edit-page component placeholder attribute" })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANTECH"><Trans comment="job-edit-page SelectItem visible text">Apply on MANTECH</Trans></SelectItem>
                      <SelectItem value="COMPANY_WEBSITE"><Trans comment="job-edit-page SelectItem visible text">Apply on Company Website</Trans></SelectItem>
                      <SelectItem value="EXTERNAL"><Trans comment="job-edit-page SelectItem visible text">Apply Externally</Trans></SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(form.applicationMethod === 'COMPANY_WEBSITE' || form.applicationMethod === 'EXTERNAL') && (
                  <div className="mt-4">
                    <Label htmlFor="applicationUrl"><Trans comment="job-edit-page Label visible text">Application URL *</Trans></Label>
                    <Input
                      id="applicationUrl"
                      value={form.applicationUrl}
                      onChange={(e) => setForm({ ...form, applicationUrl: e.target.value })}
                      placeholder={t({ message: "https://...", comment: "job-edit-page component placeholder attribute" })}
                    />
                  </div>
                )}

                {form.applicationMethod === 'EXTERNAL' && (
                  <div className="mt-4">
                    <Label htmlFor="externalPlatform"><Trans comment="job-edit-page Label visible text">Platform Name</Trans></Label>
                    <Input
                      id="externalPlatform"
                      value={form.externalPlatform}
                      onChange={(e) => setForm({ ...form, externalPlatform: e.target.value })}
                      placeholder={t({ message: "e.g. LinkedIn, University Portal", comment: "job-edit-page component placeholder attribute" })}
                    />
                  </div>
                )}

                <div className="mt-4">
                  <Label htmlFor="instructions"><Trans comment="job-edit-page Label visible text">Application Instructions</Trans></Label>
                  <Textarea
                    id="instructions"
                    value={form.instructions}
                    onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                    placeholder={t({ message: "Any specific instructions for applicants…", comment: "job-edit-page component placeholder attribute" })}
                    rows={3}
                  />
                </div>

                <div className="mt-4">
                  <Label htmlFor="contactEmail"><Trans comment="job-edit-page Label visible text">Contact Email</Trans></Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    placeholder={t({ message: "recruitment@company.cm", comment: "job-edit-page component placeholder attribute" })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Link href={backHref}>
                  <Button variant="outline" type="button">
                    <Trans comment="job-edit-page Button visible text">Cancel
                  </Trans></Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <Trans comment="job-edit-page component visible text">Saving…
                    </Trans></>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      <Trans comment="job-edit-page component visible text">Save changes
                    </Trans></>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}