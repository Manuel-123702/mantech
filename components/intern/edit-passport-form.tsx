'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import { useTaxonomy } from '@/hooks/use-taxonomy';
import { APP_CONFIG } from '@/lib/config';
import {
  Save,
  ArrowLeft,
  Loader2,
  Camera,
  Trash2,
  FileText,
  Upload,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export interface EditPassportFormProps {
  initialData: {
    fullName: string;
    email: string;
    avatarUrl: string | null;
    phone: string;
    isPhonePublic: boolean;
    qualification: string;
    academicLevel: string;
    institution: string;
    fieldOfStudyId: string;
    fieldOfStudyName: string;
    specializationId: string;
    specializationName: string;
    regionId: string;
    city: string;
    preferredWorkMode: string;
    availability: string;
    skills: string[];
    headline: string;
    bio: string;
    targetRole: string;
    targetIndustries: string;
    careerGoals: string;
    skillsToImprove: string;
    isCvSearchable: boolean;
    cvUrl: string | null;
    cvFileName: string | null;
    cvFileSize: number | null;
  };
}

export function EditPassportForm({ initialData }: EditPassportFormProps) {
  const router = useRouter();
  const { fields: dbFields, regions: dbRegions } = useTaxonomy();

  const availableFields =
    dbFields.length > 0
      ? dbFields
      : APP_CONFIG.professionalFields.map((f) => ({
          id: f.id,
          name: f.name,
          slug: f.slug,
          specializations: [],
        }));

  const availableRegions =
    dbRegions.length > 0
      ? dbRegions
      : APP_CONFIG.cameroonRegions.map((r) => ({
          id: r.id,
          code: r.id,
          name: r.name,
        }));

  const [form, setForm] = useState({
    fullName: initialData.fullName,
    avatarUrl: initialData.avatarUrl,
    phone: initialData.phone,
    isPhonePublic: initialData.isPhonePublic,
    qualification: initialData.qualification,
    academicLevel: initialData.academicLevel,
    institution: initialData.institution,
    fieldOfStudy: initialData.fieldOfStudyId || initialData.fieldOfStudyName,
    specialization: initialData.specializationId || initialData.specializationName,
    regionId: initialData.regionId,
    city: initialData.city,
    preferredWorkMode: initialData.preferredWorkMode || 'ONSITE',
    availability: initialData.availability || 'IMMEDIATELY',
    skills: initialData.skills,
    skillInput: '',
    headline: initialData.headline,
    bio: initialData.bio,
    targetRole: initialData.targetRole,
    targetIndustries: initialData.targetIndustries,
    careerGoals: initialData.careerGoals,
    skillsToImprove: initialData.skillsToImprove,
    isCvSearchable: initialData.isCvSearchable,
    cvUrl: initialData.cvUrl || '',
    cvFileKey: '',
    cvFileName: initialData.cvFileName || '',
    cvFileSize: initialData.cvFileSize || 0,
  });

  const [photoUploading, setPhotoUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const selectedFieldObj = availableFields.find(
    (f) => f.id === form.fieldOfStudy || f.name === form.fieldOfStudy,
  );

  const handlePhotoUpload = async (file: File) => {
    setPhotoUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/interns/upload-photo', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload photo');
      setForm((prev) => ({ ...prev, avatarUrl: data.photoUrl }));
    } catch (err: any) {
      setError(err.message || 'Photo upload failed');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setForm((prev) => ({ ...prev, avatarUrl: null }));
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleCvUpload = async (file: File) => {
    setCvUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/interns/upload-cv', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload CV');
      setForm((prev) => ({
        ...prev,
        cvUrl: data.cvUrl,
        cvFileKey: data.cvFileKey || '',
        cvFileName: data.cvFileName || file.name,
        cvFileSize: data.cvFileSize || file.size,
      }));
    } catch (err: any) {
      setError(err.message || 'CV upload failed');
    } finally {
      setCvUploading(false);
    }
  };

  const addSkill = () => {
    const clean = form.skillInput.trim();
    if (clean && !form.skills.includes(clean)) {
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, clean],
        skillInput: '',
      }));
    }
  };

  const removeSkill = (s: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item !== s),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload: Record<string, any> = {
        fullName: form.fullName,
        avatarUrl: form.avatarUrl,
        phone: form.phone,
        isPhonePublic: form.isPhonePublic,
        qualification: form.qualification,
        academicLevel: form.academicLevel,
        institution: form.institution,
        fieldOfStudy: form.fieldOfStudy,
        specialization: form.specialization,
        regionId: form.regionId,
        city: form.city,
        preferredWorkMode: form.preferredWorkMode,
        availability: form.availability,
        skills: form.skills,
        headline: form.headline,
        bio: form.bio,
        targetRole: form.targetRole,
        targetIndustries: form.targetIndustries,
        careerGoals: form.careerGoals,
        skillsToImprove: form.skillsToImprove,
        isCvSearchable: form.isCvSearchable,
      };

      if (form.cvUrl) {
        payload.cvUrl = form.cvUrl;
        payload.cvFileKey = form.cvFileKey || undefined;
        payload.cvFileName = form.cvFileName;
        payload.cvFileSize = form.cvFileSize;
      }

      const res = await fetch('/api/interns/register', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save changes');
      }

      setSuccessMsg('Profile updated successfully! Redirecting to your Passport...');
      router.refresh();
      setTimeout(() => {
        router.push('/dashboard/intern/passport');
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Edit Candidate Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Update any of your registration details, photo, skills, or CV.
          </p>
        </div>
        <Link href="/dashboard/intern/passport">
          <Button
            type="button"
            className="bg-slate-800 text-white border border-slate-600 hover:bg-slate-700 hover:text-white rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Passport
          </Button>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/50 p-3.5 text-xs sm:text-sm text-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/50 p-3.5 text-xs sm:text-sm text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Profile Photo Section */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 space-y-4">
        <h2 className="text-base font-bold text-white font-heading">Profile Photo</h2>
        <div className="flex flex-wrap items-center gap-5">
          <CandidateAvatar
            src={form.avatarUrl}
            name={form.fullName || 'Candidate'}
            size={88}
            className="border-2 border-blue-400/40 shadow-lg"
          />
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handlePhotoUpload(file);
              }}
            />
            <Button
              type="button"
              disabled={photoUploading}
              onClick={() => photoInputRef.current?.click()}
              className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white text-xs font-bold rounded-xl"
            >
              {photoUploading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="mr-1.5 h-3.5 w-3.5" />
              )}
              {form.avatarUrl ? 'Change Photo' : 'Upload Photo'}
            </Button>
            {form.avatarUrl && (
              <Button
                type="button"
                onClick={handleRemovePhoto}
                className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white text-xs font-bold rounded-xl"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Remove Photo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Personal Information */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 space-y-4">
        <h2 className="text-base font-bold text-white font-heading">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="text-xs text-slate-300">Full Name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              required
              className="mt-1.5 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-xs text-slate-300">Email Address</Label>
            <Input
              id="email"
              value={initialData.email}
              disabled
              className="mt-1.5 bg-slate-800/50 border-slate-700 text-slate-400"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-xs text-slate-300">Phone Number</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              required
              className="mt-1.5 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 mt-auto">
            <div>
              <p className="text-xs font-semibold text-white">Show Phone Publicly</p>
              <p className="text-[11px] text-slate-400">Visible to verified recruiters</p>
            </div>
            <Switch
              checked={form.isPhonePublic}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isPhonePublic: v }))}
            />
          </div>
        </div>
      </div>

      {/* 3. Academic & Professional Background */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 space-y-4">
        <h2 className="text-base font-bold text-white font-heading">Education &amp; Field</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="qualification" className="text-xs text-slate-300">Diploma / Qualification</Label>
            <Input
              id="qualification"
              value={form.qualification}
              onChange={(e) => setForm((p) => ({ ...p, qualification: e.target.value }))}
              className="mt-1.5 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="academicLevel" className="text-xs text-slate-300">Academic Level</Label>
            <Input
              id="academicLevel"
              value={form.academicLevel}
              onChange={(e) => setForm((p) => ({ ...p, academicLevel: e.target.value }))}
              placeholder="e.g. Bachelor / HND / Master"
              className="mt-1.5 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="institution" className="text-xs text-slate-300">University / Institution</Label>
            <Input
              id="institution"
              value={form.institution}
              onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))}
              className="mt-1.5 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="fieldOfStudy" className="text-xs text-slate-300">Professional Field</Label>
            <select
              id="fieldOfStudy"
              value={form.fieldOfStudy}
              onChange={(e) =>
                setForm((p) => ({ ...p, fieldOfStudy: e.target.value, specialization: '' }))
              }
              className="mt-1.5 w-full h-10 rounded-md bg-slate-800 border border-slate-700 px-3 text-sm text-white"
            >
              <option value="">Select field</option>
              {availableFields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="specialization" className="text-xs text-slate-300">Specialization</Label>
            {selectedFieldObj?.specializations && selectedFieldObj.specializations.length > 0 ? (
              <select
                id="specialization"
                value={form.specialization}
                onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
                className="mt-1.5 w-full h-10 rounded-md bg-slate-800 border border-slate-700 px-3 text-sm text-white"
              >
                <option value="">Select specialization</option>
                {selectedFieldObj.specializations.map((sp: any) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="specialization"
                value={form.specialization}
                onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
                placeholder="Specialization"
                className="mt-1.5 bg-slate-800 border-slate-700 text-white"
              />
            )}
          </div>
        </div>
      </div>

      {/* 4. Location & Work Preferences */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 space-y-4">
        <h2 className="text-base font-bold text-white font-heading">Location &amp; Preferences</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="regionId" className="text-xs text-slate-300">Cameroon Region</Label>
            <select
              id="regionId"
              value={form.regionId}
              onChange={(e) => setForm((p) => ({ ...p, regionId: e.target.value }))}
              className="mt-1.5 w-full h-10 rounded-md bg-slate-800 border border-slate-700 px-3 text-sm text-white"
            >
              <option value="">Select region</option>
              {availableRegions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="city" className="text-xs text-slate-300">City</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              placeholder="Douala, Yaoundé, Buea..."
              className="mt-1.5 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="preferredWorkMode" className="text-xs text-slate-300">Work Mode</Label>
            <select
              id="preferredWorkMode"
              value={form.preferredWorkMode}
              onChange={(e) => setForm((p) => ({ ...p, preferredWorkMode: e.target.value }))}
              className="mt-1.5 w-full h-10 rounded-md bg-slate-800 border border-slate-700 px-3 text-sm text-white"
            >
              <option value="ONSITE">On-Site</option>
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
          <div>
            <Label htmlFor="availability" className="text-xs text-slate-300">Availability</Label>
            <select
              id="availability"
              value={form.availability}
              onChange={(e) => setForm((p) => ({ ...p, availability: e.target.value }))}
              className="mt-1.5 w-full h-10 rounded-md bg-slate-800 border border-slate-700 px-3 text-sm text-white"
            >
              <option value="IMMEDIATELY">Immediately</option>
              <option value="WITHIN_1_MONTH">Within 1 Month</option>
              <option value="WITHIN_3_MONTHS">Within 3 Months</option>
              <option value="SUMMER">Summer / Academic Break</option>
              <option value="PART_TIME">Part-Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Skills */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 space-y-4">
        <h2 className="text-base font-bold text-white font-heading">Skills</h2>
        <div className="flex gap-2">
          <Input
            value={form.skillInput}
            onChange={(e) => setForm((p) => ({ ...p, skillInput: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill (e.g. React, Accounting, AutoCAD)"
            className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
          />
          <Button
            type="button"
            onClick={addSkill}
            className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white font-bold text-xs shrink-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 border border-blue-500/40 text-blue-200"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 6. Professional Headline, Bio & Career Goals */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 space-y-4">
        <h2 className="text-base font-bold text-white font-heading">Professional Summary</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="headline" className="text-xs text-slate-300">Passport Headline</Label>
            <Input
              id="headline"
              value={form.headline}
              onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
              placeholder="e.g. Software Engineering Graduate | Fullstack Developer"
              className="mt-1.5 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="targetRole" className="text-xs text-slate-300">Target Role</Label>
            <Input
              id="targetRole"
              value={form.targetRole}
              onChange={(e) => setForm((p) => ({ ...p, targetRole: e.target.value }))}
              className="mt-1.5 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="bio" className="text-xs text-slate-300">Professional Summary / Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              className="mt-1.5 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-white">Allow Recruiter Discovery</p>
              <p className="text-[11px] text-slate-400">Show your Passport in the Talent Directory</p>
            </div>
            <Switch
              checked={form.isCvSearchable}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isCvSearchable: v }))}
            />
          </div>
        </div>
      </div>

      {/* 7. CV Upload */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 space-y-4">
        <h2 className="text-base font-bold text-white font-heading">Curriculum Vitae (PDF)</h2>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-5 w-5 text-blue-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-white truncate">
                {form.cvFileName || 'No CV uploaded yet'}
              </p>
              {form.cvFileSize > 0 && (
                <p className="text-[11px] text-slate-400">
                  {(form.cvFileSize / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>
          <input
            ref={cvInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleCvUpload(file);
            }}
          />
          <Button
            type="button"
            disabled={cvUploading}
            onClick={() => cvInputRef.current?.click()}
            className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white text-xs font-bold rounded-xl shrink-0"
          >
            {cvUploading ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="mr-1.5 h-3.5 w-3.5" />
            )}
            {form.cvUrl ? 'Replace CV (PDF)' : 'Upload CV (PDF)'}
          </Button>
        </div>
      </div>

      {/* Submit Controls */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <Link href="/dashboard/intern/passport">
          <Button
            type="button"
            className="bg-slate-800 text-white border border-slate-600 hover:bg-slate-700 hover:text-white rounded-xl text-xs font-bold px-5"
          >
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={saving || photoUploading || cvUploading}
          className="bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold px-6 shadow-lg"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
