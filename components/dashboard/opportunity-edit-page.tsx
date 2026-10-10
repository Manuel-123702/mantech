'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  durationMonths: number;
  startDate: string;
  endDate: string;
  deadline: string;
  isPaid: boolean;
  allowanceXAF: number;
  positions: number;
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
  durationMonths: 3,
  startDate: '',
  endDate: '',
  deadline: '',
  isPaid: false,
  allowanceXAF: 0,
  positions: 1,
  applicationMethod: 'MANTECH',
  applicationUrl: '',
  externalPlatform: '',
  instructions: '',
  contactEmail: '',
};

export default function OpportunityEditPage({ backHref }: { backHref: string }) {
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
        const res = await fetch(`/api/opportunities/${params.id}`);
        if (!res.ok) throw new Error('Could not load opportunity');
        const data = await res.json();
        const o = data.opportunity;
        setForm({
          title: o.title || '',
          description: o.description || '',
          department: o.department || '',
          fieldId: o.fieldId || '',
          specializationId: o.specializationId || '',
          requiredSkills: o.requiredSkills || [],
          preferredSkills: o.preferredSkills || [],
          educationLevel: o.educationLevel || '',
          regionId: o.regionId || '',
          city: o.city || '',
          location: o.location || '',
          workMode: o.workMode || 'ONSITE',
          durationMonths: o.durationMonths || 3,
          startDate: o.startDate ? new Date(o.startDate).toISOString().slice(0, 10) : '',
          endDate: o.endDate ? new Date(o.endDate).toISOString().slice(0, 10) : '',
          deadline: o.deadline ? new Date(o.deadline).toISOString().slice(0, 10) : '',
          isPaid: !!o.isPaid,
          allowanceXAF: o.allowanceXAF || 0,
          positions: o.positions || 1,
          applicationMethod: o.applicationMethod || 'MANTECH',
          applicationUrl: o.applicationUrl || '',
          externalPlatform: o.externalPlatform || '',
          instructions: o.instructions || '',
          contactEmail: o.contactEmail || '',
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [params?.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/opportunities/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Could not update opportunity');
      }
      router.push(backHref);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const handleSkillAdd = (skill: string, type: 'requiredSkills' | 'preferredSkills') => {
    if (skill && !form[type].includes(skill)) {
      setForm((prev) => ({ ...prev, [type]: [...prev[type], skill] }));
    }
  };

  const handleSkillRemove = (skill: string, type: 'requiredSkills' | 'preferredSkills') => {
    setForm((prev) => ({ ...prev, [type]: prev[type].filter((s) => s !== skill) }));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 px-4 py-8">
        <div className="h-10 w-1/3 rounded-lg bg-slate-100 animate-pulse" />
        <div className="h-40 w-full rounded-2xl bg-slate-100 animate-pulse" />
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
              Back to Opportunities
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Edit Internship Opportunity</h1>
          <p className="text-slate-600 mt-2">
            Update details, requirements, or timeline for this posting.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {taxonomyError && <p role="alert" className="text-sm text-red-700">{taxonomyError}</p>}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div>
                  <Label htmlFor="title">Opportunity Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Field & Specialization</h3>

                <div>
                  <Label htmlFor="fieldId">Professional Field</Label>
                  <Select
                    value={form.fieldId}
                    onValueChange={(value) => setForm({ ...form, fieldId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select professional field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specializationId">Specialization</Label>
                  <Select
                    value={form.specializationId}
                    onValueChange={(value) => setForm({ ...form, specializationId: value })}
                    disabled={!form.fieldId}
                  >
                    <SelectTrigger id="specializationId">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.find((field) => field.id === form.fieldId)?.specializations.map((specialization) => (
                        <SelectItem key={specialization.id} value={specialization.id}>
                          {specialization.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skills</h3>

                <div>
                  <Label>Required Skills</Label>
                  <p className="text-xs text-slate-500 mb-2">Press Enter to add a skill</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skill, 'requiredSkills')}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Type a required skill and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSkillAdd(e.currentTarget.value, 'requiredSkills');
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                <div>
                  <Label>Preferred Skills</Label>
                  <p className="text-xs text-slate-500 mb-2">Press Enter to add a skill</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.preferredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skill, 'preferredSkills')}
                          className="hover:text-emerald-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Type a preferred skill and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSkillAdd(e.currentTarget.value, 'preferredSkills');
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location & Work Mode</h3>

                <div>
                  <Label htmlFor="regionId">Region</Label>
                  <Select
                    value={form.regionId}
                    onValueChange={(value) => setForm({ ...form, regionId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">City/Town *</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Specific Location</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="workMode">Work Mode *</Label>
                  <Select
                    value={form.workMode}
                    onValueChange={(value) => setForm({ ...form, workMode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select work mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONSITE">On-site</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                      <SelectItem value="REMOTE">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Duration & Dates</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="durationMonths">Duration (Months) *</Label>
                    <Input
                      id="durationMonths"
                      type="number"
                      min="1"
                      max="24"
                      value={form.durationMonths}
                      onChange={(e) => setForm({ ...form, durationMonths: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="positions">Number of Positions *</Label>
                    <Input
                      id="positions"
                      type="number"
                      min="1"
                      value={form.positions}
                      onChange={(e) => setForm({ ...form, positions: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">Application Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compensation</h3>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPaid"
                    checked={form.isPaid}
                    onCheckedChange={(checked) => setForm({ ...form, isPaid: checked as boolean })}
                  />
                  <Label htmlFor="isPaid" className="text-sm">
                    This is a paid internship
                  </Label>
                </div>

                {form.isPaid && (
                  <div>
                    <Label htmlFor="allowanceXAF">Monthly Allowance (XAF)</Label>
                    <Input
                      id="allowanceXAF"
                      type="number"
                      value={form.allowanceXAF}
                      onChange={(e) => setForm({ ...form, allowanceXAF: parseInt(e.target.value) })}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Application Method</h3>

                <div>
                  <Label htmlFor="applicationMethod">Application Method *</Label>
                  <Select
                    value={form.applicationMethod}
                    onValueChange={(value) => setForm({ ...form, applicationMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select application method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANTECH">Apply on MANTECH</SelectItem>
                      <SelectItem value="COMPANY_WEBSITE">Apply on Company Website</SelectItem>
                      <SelectItem value="EXTERNAL">Apply Externally</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(form.applicationMethod === 'COMPANY_WEBSITE' || form.applicationMethod === 'EXTERNAL') && (
                  <div>
                    <Label htmlFor="applicationUrl">Application URL</Label>
                    <Input
                      id="applicationUrl"
                      value={form.applicationUrl}
                      onChange={(e) => setForm({ ...form, applicationUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {form.applicationMethod === 'EXTERNAL' && (
                  <div>
                    <Label htmlFor="externalPlatform">Platform Name</Label>
                    <Input
                      id="externalPlatform"
                      value={form.externalPlatform}
                      onChange={(e) => setForm({ ...form, externalPlatform: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="instructions">Application Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={form.instructions}
                    onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Link href={backHref}>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save changes
                    </>
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
