'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTaxonomy } from '@/lib/use-taxonomy';

export default function JobCreatePage({ backHref }: { backHref: string }) {
  const router = useRouter();
  const { fields, regions, error: taxonomyError } = useTaxonomy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    fieldId: '',
    specializationId: '',
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    educationLevel: '',
    regionId: '',
    city: '',
    location: '',
    workMode: 'ONSITE',
    salaryMinXAF: '',
    salaryMaxXAF: '',
    type: 'FULL_TIME',
    postingDate: '',
    expiryDate: '',
    isRemote: false,
    isFeatured: false,
    applicationMethod: 'MANTECH',
    applicationUrl: '',
    externalPlatform: '',
    instructions: '',
    contactEmail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salaryMinXAF: formData.salaryMinXAF ? Number(formData.salaryMinXAF) : null,
          salaryMaxXAF: formData.salaryMaxXAF ? Number(formData.salaryMaxXAF) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create job');
      }

      router.push(backHref);
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdd = (skill: string, type: 'required' | 'preferred') => {
    if (skill && !formData[type === 'required' ? 'requiredSkills' : 'preferredSkills'].includes(skill)) {
      setFormData(prev => ({
        ...prev,
        [type === 'required' ? 'requiredSkills' : 'preferredSkills']:
          [...prev[type === 'required' ? 'requiredSkills' : 'preferredSkills'], skill],
      }));
    }
  };

  const handleSkillRemove = (skill: string, type: 'required' | 'preferred') => {
    setFormData(prev => ({
      ...prev,
      [type === 'required' ? 'requiredSkills' : 'preferredSkills']:
        prev[type === 'required' ? 'requiredSkills' : 'preferredSkills'].filter(s => s !== skill),
    }));
  };

  return (
    <div className="container-mantech px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href={backHref}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Create Job Posting</h1>
          <p className="text-slate-600">
            Publish a new job vacancy on the MANTECH marketplace for Cameroon talent.
          </p>
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
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Software Engineer, Accountant, Marketing Manager"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and what the candidate will do…"
                  rows={5}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Engineering, Sales, HR"
                  />
                </div>
                <div>
                  <Label htmlFor="educationLevel">Education Level</Label>
                  <Input
                    id="educationLevel"
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    placeholder="e.g. Bachelor, HND, Master"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="field">Professional Field</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, fieldId: value, specializationId: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
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
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, specializationId: value })}
                    disabled={!formData.fieldId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.find((f) => f.id === formData.fieldId)?.specializations.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, regionId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
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
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Douala, Yaoundé"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location / Address</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bonapriso, Douala"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="workMode">Work Mode</Label>
                  <Select
                    value={formData.workMode}
                    onValueChange={(value) => setFormData({ ...formData, workMode: value })}
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
                <div>
                  <Label htmlFor="type">Job Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full-time</SelectItem>
                      <SelectItem value="PART_TIME">Part-time</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                      <SelectItem value="INTERNSHIP">Internship</SelectItem>
                      <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                      <SelectItem value="FREELANCE">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Checkbox
                    checked={formData.isRemote}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRemote: !!checked })}
                  />
                  <Label htmlFor="isRemote" className="ml-2 text-sm text-slate-600">
                    Remote position
                  </Label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="salaryMinXAF">Salary Min (XAF)</Label>
                  <Input
                    id="salaryMinXAF"
                    type="number"
                    value={formData.salaryMinXAF}
                    onChange={(e) => setFormData({ ...formData, salaryMinXAF: e.target.value })}
                    placeholder="e.g. 150000"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMaxXAF">Salary Max (XAF)</Label>
                  <Input
                    id="salaryMaxXAF"
                    type="number"
                    value={formData.salaryMaxXAF}
                    onChange={(e) => setFormData({ ...formData, salaryMaxXAF: e.target.value })}
                    placeholder="e.g. 300000"
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <hr className="border-slate-200" />

              <div>
                <Label>Required Skills (optional)</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-0.5 text-blue-600 hover:text-red-600"
                        onClick={() => handleSkillRemove(skill, 'required')}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Type a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const skill = e.currentTarget.value.trim();
                      if (skill) {
                        handleSkillAdd(skill, 'required');
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>

              <hr className="border-slate-200" />

              <div>
                <Label>Application Method</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.applicationMethod === 'MANTECH'}
                      onCheckedChange={(checked) => {
                        if (checked) setFormData({ ...formData, applicationMethod: 'MANTECH', applicationUrl: '', externalPlatform: '' });
                      }}
                    />
                    <Label htmlFor="applicationMethod-MANTECH" className="text-sm cursor-pointer">
                      Apply via MANTECH
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.applicationMethod === 'COMPANY_WEBSITE'}
                      onCheckedChange={(checked) => {
                        if (checked) setFormData({ ...formData, applicationMethod: 'COMPANY_WEBSITE', applicationUrl: '', externalPlatform: '' });
                      }}
                    />
                    <Label htmlFor="applicationMethod-COMPANY_WEBSITE" className="text-sm cursor-pointer">
                      Apply via Company Website
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.applicationMethod === 'EXTERNAL'}
                      onCheckedChange={(checked) => {
                        if (checked) setFormData({ ...formData, applicationMethod: 'EXTERNAL', applicationUrl: '', externalPlatform: '' });
                      }}
                    />
                    <Label htmlFor="applicationMethod-EXTERNAL" className="text-sm cursor-pointer">
                      External Platform
                    </Label>
                  </div>
                </div>
                {formData.applicationMethod === 'EXTERNAL' && (
                  <div className="mt-3">
                    <Label htmlFor="externalPlatform">External Platform Name</Label>
                    <Input
                      id="externalPlatform"
                      value={formData.externalPlatform}
                      onChange={(e) => setFormData({ ...formData, externalPlatform: e.target.value })}
                      placeholder="e.g. LinkedIn, Indeed..."
                    />
                  </div>
                )}
                {(formData.applicationMethod === 'COMPANY_WEBSITE' || formData.applicationMethod === 'EXTERNAL') && (
                  <div className="mt-3">
                    <Label htmlFor="applicationUrl">Application URL</Label>
                    <Input
                      id="applicationUrl"
                      type="url"
                      value={formData.applicationUrl}
                      onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                      placeholder="https://example.com/apply"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(backHref)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Job Posting
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}