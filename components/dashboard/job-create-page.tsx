'use client';
import { Trans, useLingui } from '@lingui/react/macro';


import { useState } from 'react';
import { useRouter } from '@/i18n/navigation.hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, Sparkles, Briefcase, Plus, X } from 'lucide-react';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { useTaxonomy } from '@/lib/use-taxonomy';
import { APP_CONFIG } from '@/lib/config';

export default function JobCreatePage({ backHref }: { backHref: string }) {
  const { t } = useLingui();
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
            <Trans comment="job-create-page Button visible text">Back to Jobs
          </Trans></Button>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-2">
          <Briefcase className="w-3.5 h-3.5" /> <Trans comment="job-create-page div visible text">Permanent &amp; Contract Employment
        </Trans></div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
          <Trans comment="job-create-page h1 visible text">Create Job Posting
        </Trans></h1>
        <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
          <Trans comment="job-create-page p visible text">Publish a new job vacancy on the MANTECH marketplace for Cameroon talent.
        </Trans></p>
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
              <Trans comment="job-create-page Label visible text">Job Title </Trans><span className="text-red-400">{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"*"}</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t({ message: "e.g. Senior Backend Engineer, Finance Manager, Logistics Supervisor", comment: "job-create-page component placeholder attribute" })}
              required
              className="h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
              <Trans comment="job-create-page Label visible text">Job Description &amp; Responsibilities </Trans><span className="text-red-400">{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"*"}</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t({ message: "Describe the role, key responsibilities, qualifications, and benefits...", comment: "job-create-page component placeholder attribute" })}
              rows={5}
              required
              className="bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-sm leading-relaxed"
            />
          </div>

          {/* Department & Education */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="department" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                <Trans comment="job-create-page Label visible text">Department
              </Trans></Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder={t({ message: "e.g. Technical Operations, Accounts, Human Resources", comment: "job-create-page component placeholder attribute" })}
                className="h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="educationLevel" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                <Trans comment="job-create-page Label visible text">Education Level
              </Trans></Label>
              <Input
                id="educationLevel"
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                placeholder={t({ message: "e.g. Bachelor / BSc, HND, Master / Ingénieur", comment: "job-create-page component placeholder attribute" })}
                className="h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          {/* Connected Professional Field & Specialization */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fieldId" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                <Trans comment="job-create-page Label visible text">Professional Field </Trans><span className="text-red-400">{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"*"}</span>
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
                <option value=""><Trans comment="job-create-page option visible text">Select professional field</Trans></option>
                {availableFields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
                <option value="other"><Trans comment="job-create-page option visible text">Other (Specify below)</Trans></option>
              </select>

              {formData.fieldId === 'other' && (
                <div className="mt-2">
                  <Input
                    id="fieldOther"
                    value={formData.fieldOther}
                    onChange={(e) => setFormData({ ...formData, fieldOther: e.target.value })}
                    placeholder={t({ message: "Enter custom professional field", comment: "job-create-page component placeholder attribute" })}
                    className="h-10 bg-slate-800 border-slate-700 text-white text-xs"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="specializationId" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                <Trans comment="job-create-page Label visible text">Specialization
              </Trans></Label>
              <select
                id="specializationId"
                value={formData.specializationId}
                onChange={(e) => setFormData({ ...formData, specializationId: e.target.value })}
                className="w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value=""><Trans comment="job-create-page option visible text">Select specialization</Trans></option>
                {selectedFieldObj?.specializations?.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="other"><Trans comment="job-create-page option visible text">Other (Specify below)</Trans></option>
              </select>

              {formData.specializationId === 'other' && (
                <div className="mt-2">
                  <Input
                    id="specializationOther"
                    value={formData.specializationOther}
                    onChange={(e) => setFormData({ ...formData, specializationOther: e.target.value })}
                    placeholder={t({ message: "Enter custom specialization", comment: "job-create-page component placeholder attribute" })}
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
                <Trans comment="job-create-page Label visible text">Region </Trans><span className="text-red-400">{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"*"}</span>
              </Label>
              <select
                id="regionId"
                value={formData.regionId}
                onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                className="w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value=""><Trans comment="job-create-page option visible text">Select region</Trans></option>
                {availableRegions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"("}{r.capital}{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{")"}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="city" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                <Trans comment="job-create-page Label visible text">City / Town </Trans><span className="text-red-400">{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"*"}</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder={t({ message: "e.g. Douala, Yaoundé, Buea, Bafoussam", comment: "job-create-page component placeholder attribute" })}
                required
                className="h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          {/* Work Mode & Job Type */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="workMode" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                <Trans comment="job-create-page Label visible text">Work Mode
              </Trans></Label>
              <select
                id="workMode"
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                className="w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="ONSITE"><Trans comment="job-create-page option visible text">On-Site (At Office)</Trans></option>
                <option value="HYBRID"><Trans comment="job-create-page option visible text">Hybrid (Flexible)</Trans></option>
                <option value="REMOTE"><Trans comment="job-create-page option visible text">Fully Remote</Trans></option>
              </select>
            </div>

            <div>
              <Label htmlFor="type" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                <Trans comment="job-create-page Label visible text">Contract Type
              </Trans></Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="FULL_TIME"><Trans comment="job-create-page option visible text">Full-Time Permanent (CDI)</Trans></option>
                <option value="PART_TIME"><Trans comment="job-create-page option visible text">Part-Time</Trans></option>
                <option value="CONTRACT"><Trans comment="job-create-page option visible text">Fixed-Term Contract (CDD)</Trans></option>
                <option value="FREELANCE"><Trans comment="job-create-page option visible text">Freelance / Consultant</Trans></option>
              </select>
            </div>

            <div>
              <Label htmlFor="expiryDate" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                <Trans comment="job-create-page Label visible text">Application Expiry Date </Trans><span className="text-red-400">{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"*"}</span>
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
                <Trans comment="job-create-page Label visible text">Salary Min (XAF FCFA)
              </Trans></Label>
              <Input
                id="salaryMinXAF"
                type="number"
                value={formData.salaryMinXAF}
                onChange={(e) => setFormData({ ...formData, salaryMinXAF: e.target.value })}
                placeholder={t({ message: "e.g. 150000", comment: "job-create-page component placeholder attribute" })}
                className="h-11 bg-slate-800/80 border-slate-700 text-white text-xs focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="salaryMaxXAF" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
                <Trans comment="job-create-page Label visible text">Salary Max (XAF FCFA)
              </Trans></Label>
              <Input
                id="salaryMaxXAF"
                type="number"
                value={formData.salaryMaxXAF}
                onChange={(e) => setFormData({ ...formData, salaryMaxXAF: e.target.value })}
                placeholder={t({ message: "e.g. 350000", comment: "job-create-page component placeholder attribute" })}
                className="h-11 bg-slate-800/80 border-slate-700 text-white text-xs focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <Label className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1.5">
              <Trans comment="job-create-page Label visible text">Required Skills
            </Trans></Label>
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
                placeholder={t({ message: "Type a skill and press Enter or click Add (e.g. React, Financial Audit, Sales)", comment: "job-create-page component placeholder attribute" })}
                className="h-11 bg-slate-800/80 border-slate-700 text-white text-xs placeholder-slate-500 focus:border-cyan-400"
              />
              <Button
                type="button"
                onClick={() => handleSkillAdd(formData.skillInput)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4"
              >
                <Plus className="w-4 h-4 mr-1" /> <Trans comment="job-create-page Button visible text">Add
              </Trans></Button>
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
                      {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"×"}</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Application Method */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <Label className="text-xs font-semibold text-slate-200 uppercase tracking-wide block">
              <Trans comment="job-create-page Label visible text">Application Method
            </Trans></Label>
            <div className="grid gap-3 sm:grid-cols-3">
              <div
                onClick={() => setFormData({ ...formData, applicationMethod: 'MANTECH', applicationUrl: '' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.applicationMethod === 'MANTECH'
                    ? 'border-cyan-500 bg-cyan-950/40 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold"><Trans comment="job-create-page div visible text">Apply via MANTECH</Trans></div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug"><Trans comment="job-create-page div visible text">Direct candidate CV &amp; Passport submission</Trans></div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, applicationMethod: 'COMPANY_WEBSITE' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.applicationMethod === 'COMPANY_WEBSITE'
                    ? 'border-cyan-500 bg-cyan-950/40 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold"><Trans comment="job-create-page div visible text">Company Website</Trans></div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug"><Trans comment="job-create-page div visible text">Redirect to your career portal</Trans></div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, applicationMethod: 'EXTERNAL' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.applicationMethod === 'EXTERNAL'
                    ? 'border-cyan-500 bg-cyan-950/40 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold"><Trans comment="job-create-page div visible text">External Platform</Trans></div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug"><Trans comment="job-create-page div visible text">LinkedIn, Indeed, or email</Trans></div>
              </div>
            </div>

            {formData.applicationMethod !== 'MANTECH' && (
              <div className="mt-3">
                <Label htmlFor="applicationUrl" className="text-xs font-semibold text-slate-200 uppercase tracking-wide block mb-1">
                  <Trans comment="job-create-page Label visible text">Application Link / URL </Trans><span className="text-red-400">{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"*"}</span>
                </Label>
                <Input
                  id="applicationUrl"
                  type="url"
                  value={formData.applicationUrl}
                  onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                  placeholder={t({ message: "https://company.com/careers/apply-123", comment: "job-create-page component placeholder attribute" })}
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
              <Trans comment="job-create-page Button visible text">Cancel
            </Trans></Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs px-6 shadow-lg shadow-cyan-900/40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <Trans comment="job-create-page component visible text">Publishing Job...
                </Trans></>
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
