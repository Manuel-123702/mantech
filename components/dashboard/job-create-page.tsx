'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, Sparkles, Briefcase, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useTaxonomy } from '@/lib/use-taxonomy';
import { APP_CONFIG } from '@/lib/config';

export default function JobCreatePage({ backHref }: { backHref: string }) {
  const router = useRouter();
  const { fields: dbFields, regions: dbRegions, error: taxonomyError } = useTaxonomy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback merged taxonomy
  const availableFields = dbFields.length > 0 ? dbFields : APP_CONFIG.professionalFields.map(f => ({
    id: f.id,
    name: f.name,
    slug: f.slug,
    category: f.category,
    specializations: f.specializations.map((s, idx) => ({ id: `${f.id}_s${idx}`, name: s, slug: s.toLowerCase().replace(/\s+/g, '-') })),
  }));

  const availableRegions = dbRegions.length > 0 ? dbRegions : APP_CONFIG.cameroonRegions.map(r => ({
    id: r.id,
    name: r.name,
    code: r.name.substring(0, 2).toUpperCase(),
    capital: r.capital,
    locations: r.cities.map((c, idx) => ({ id: `${r.id}_c${idx}`, city: c })),
  }));

  // Default expiry date: 60 days from today
  const defaultExpiry = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    fieldId: '',
    fieldOther: '',
    specializationId: '',
    specializationOther: '',
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    skillInput: '',
    educationLevel: 'Bachelor Degree / HND',
    regionId: '',
    city: 'Douala',
    location: '',
    workMode: 'ONSITE',
    salaryMinXAF: '',
    salaryMaxXAF: '',
    type: 'FULL_TIME',
    postingDate: new Date().toISOString().split('T')[0],
    expiryDate: defaultExpiry,
    isRemote: false,
    isFeatured: false,
    applicationMethod: 'MANTECH',
    applicationUrl: '',
    externalPlatform: '',
    instructions: '',
    contactEmail: '',
  });

  const selectedFieldObj = availableFields.find(
    (f) => f.id === formData.fieldId || f.name === formData.fieldId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title.trim()) {
        throw new Error('Please enter a job title');
      }

      const payload = {
        ...formData,
        fieldId: formData.fieldId === 'other' ? undefined : (formData.fieldId || undefined),
        specializationId: formData.specializationId === 'other' ? undefined : (formData.specializationId || undefined),
        salaryMinXAF: formData.salaryMinXAF ? Number(formData.salaryMinXAF) : null,
        salaryMaxXAF: formData.salaryMaxXAF ? Number(formData.salaryMaxXAF) : null,
        city: formData.city.trim() || 'Douala',
        expiryDate: formData.expiryDate || defaultExpiry,
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create job');
      }

      router.push(backHref);
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdd = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.requiredSkills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, trimmed],
        skillInput: '',
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
    }));
  };

  return (
    <div className="container-mantech px-4 py-8 text-white max-w-4xl mx-auto">
      {/* Header with High-Contrast Text */}
      <div className="mb-8">
        <Link href={backHref}>
          <Button
            variant="ghost"
            className="mb-4 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-2">
          <Briefcase className="w-3.5 h-3.5" /> Permanent &amp; Contract Employment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
          Create Job Posting
        </h1>
        <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
          Publish a new job vacancy on the MANTECH marketplace for Cameroon talent.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-xs font-medium text-red-200 mb-6 backdrop-blur-md">
          {error}
        </div>
      )}

      {/* Form Card in Dark Glassmorphism */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <Label htmlFor="title" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
              Job Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Senior Backend Engineer, Finance Manager, Logistics Supervisor"
              required
              className="h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
              Job Description &amp; Responsibilities <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the role, key responsibilities, qualifications, and benefits..."
              rows={5}
              required
              className="bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-sm leading-relaxed"
            />
          </div>

          {/* Department & Education */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="department" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                Department
              </Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Technical Operations, Accounts, Human Resources"
                className="h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="educationLevel" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                Education Level
              </Label>
              <Input
                id="educationLevel"
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                placeholder="e.g. Bachelor / BSc, HND, Master / Ingénieur"
                className="h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          {/* Connected Professional Field & Specialization */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fieldId" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                Professional Field <span className="text-red-400">*</span>
              </Label>
              <select
                id="fieldId"
                value={formData.fieldId}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    fieldId: e.target.value,
                    specializationId: '',
                    fieldOther: e.target.value === 'other' ? formData.fieldOther : '',
                  });
                }}
                className="w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="">Select professional field</option>
                {availableFields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
                <option value="other">Other (Specify below)</option>
              </select>

              {formData.fieldId === 'other' && (
                <div className="mt-2">
                  <Input
                    id="fieldOther"
                    value={formData.fieldOther}
                    onChange={(e) => setFormData({ ...formData, fieldOther: e.target.value })}
                    placeholder="Enter custom professional field"
                    className="h-10 bg-slate-800 border-slate-700 text-white text-xs"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="specializationId" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                Specialization
              </Label>
              <select
                id="specializationId"
                value={formData.specializationId}
                onChange={(e) => setFormData({ ...formData, specializationId: e.target.value })}
                className="w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="">Select specialization</option>
                {selectedFieldObj?.specializations?.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="other">Other (Specify below)</option>
              </select>

              {formData.specializationId === 'other' && (
                <div className="mt-2">
                  <Input
                    id="specializationOther"
                    value={formData.specializationOther}
                    onChange={(e) => setFormData({ ...formData, specializationOther: e.target.value })}
                    placeholder="Enter custom specialization"
                    className="h-10 bg-slate-800 border-slate-700 text-white text-xs"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Region & City */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="regionId" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                Region <span className="text-red-400">*</span>
              </Label>
              <select
                id="regionId"
                value={formData.regionId}
                onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                className="w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="">Select region</option>
                {availableRegions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.capital})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="city" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                City / Town <span className="text-red-400">*</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Douala, Yaoundé, Buea, Bafoussam"
                required
                className="h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          {/* Work Mode & Job Type */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="workMode" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                Work Mode
              </Label>
              <select
                id="workMode"
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                className="w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="ONSITE">On-Site (At Office)</option>
                <option value="HYBRID">Hybrid (Flexible)</option>
                <option value="REMOTE">Fully Remote</option>
              </select>
            </div>

            <div>
              <Label htmlFor="type" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                Contract Type
              </Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="FULL_TIME">Full-Time Permanent (CDI)</option>
                <option value="PART_TIME">Part-Time</option>
                <option value="CONTRACT">Fixed-Term Contract (CDD)</option>
                <option value="FREELANCE">Freelance / Consultant</option>
              </select>
            </div>

            <div>
              <Label htmlFor="expiryDate" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                Application Expiry Date <span className="text-red-400">*</span>
              </Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
                className="h-11 bg-slate-800/80 border-slate-700 text-white text-xs focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Salary in XAF */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="salaryMinXAF" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                Salary Min (XAF FCFA)
              </Label>
              <Input
                id="salaryMinXAF"
                type="number"
                value={formData.salaryMinXAF}
                onChange={(e) => setFormData({ ...formData, salaryMinXAF: e.target.value })}
                placeholder="e.g. 150000"
                className="h-11 bg-slate-800/80 border-slate-700 text-white text-xs focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="salaryMaxXAF" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                Salary Max (XAF FCFA)
              </Label>
              <Input
                id="salaryMaxXAF"
                type="number"
                value={formData.salaryMaxXAF}
                onChange={(e) => setFormData({ ...formData, salaryMaxXAF: e.target.value })}
                placeholder="e.g. 350000"
                className="h-11 bg-slate-800/80 border-slate-700 text-white text-xs focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <Label className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
              Required Skills
            </Label>
            <div className="flex gap-2">
              <Input
                value={formData.skillInput}
                onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSkillAdd(formData.skillInput);
                  }
                }}
                placeholder="Type a skill and press Enter or click Add (e.g. React, Financial Audit, Sales)"
                className="h-11 bg-slate-800/80 border-slate-700 text-white text-xs placeholder-slate-500 focus:border-cyan-400"
              />
              <Button
                type="button"
                onClick={() => handleSkillAdd(formData.skillInput)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            {formData.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-950/80 border border-cyan-500/40 text-cyan-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="text-slate-400 hover:text-red-400 text-xs ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Application Method */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <Label className="text-xs font-semibold text-slate-200 uppercase tracking-wide block">
              Application Method
            </Label>
            <div className="grid gap-3 sm:grid-cols-3">
              <div
                onClick={() => setFormData({ ...formData, applicationMethod: 'MANTECH', applicationUrl: '' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.applicationMethod === 'MANTECH'
                    ? 'border-cyan-500 bg-cyan-950/40 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">Apply via MANTECH</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">Direct candidate CV &amp; Passport submission</div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, applicationMethod: 'COMPANY_WEBSITE' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.applicationMethod === 'COMPANY_WEBSITE'
                    ? 'border-cyan-500 bg-cyan-950/40 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">Company Website</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">Redirect to your career portal</div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, applicationMethod: 'EXTERNAL' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.applicationMethod === 'EXTERNAL'
                    ? 'border-cyan-500 bg-cyan-950/40 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">External Platform</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">LinkedIn, Indeed, or email</div>
              </div>
            </div>

            {formData.applicationMethod !== 'MANTECH' && (
              <div className="mt-3">
                <Label htmlFor="applicationUrl" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1">
                  Application Link / URL <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="applicationUrl"
                  type="url"
                  value={formData.applicationUrl}
                  onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                  placeholder="https://company.com/careers/apply-123"
                  required={formData.applicationMethod !== 'MANTECH'}
                  className="h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-xs"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(backHref)}
              disabled={loading}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs px-6 shadow-lg shadow-cyan-900/40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing Job...
                </>
              ) : (
                'Publish Job Vacancy (0 FCFA)'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
