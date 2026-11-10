'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useTaxonomy } from '@/lib/use-taxonomy';
import { APP_CONFIG } from '@/lib/config';

export default function InternRegistrationPage() {
  const router = useRouter();
  const { user } = useUser();
  const { fields: dbFields, regions: dbRegions } = useTaxonomy();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    passportNumber?: string;
    fullName: string;
    qualification: string;
    field: string;
    region: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: '',
    isPhonePublic: false,

    // Education & Qualification
    qualification: '',
    qualificationOther: '',
    academicLevel: '',
    academicLevelOther: '',
    institution: '',
    fieldOfStudy: '',
    fieldOfStudyOther: '',
    specialization: '',
    specializationOther: '',
    educationStartYear: '',
    educationEndYear: '',
    isCurrentEducation: false,

    // Location & Preferences
    region: '',
    regionOther: '',
    city: '',
    preferredWorkMode: 'HYBRID',
    preferredWorkModeOther: '',
    availability: 'IMMEDIATE',
    availabilityOther: '',

    // Skills
    skills: [] as string[],
    skillInput: '',

    // Profile Details
    headline: '',
    summary: '',
    isCvSearchable: true,

    // Work Experience
    experiences: [] as { companyName: string; roleTitle: string; durationMonths: string; location: string }[],
  });

  const totalSteps = 4;
  const currentYear = new Date().getFullYear();

  // Combine taxonomy from config and live database
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

  const selectedFieldObj = availableFields.find(
    (f) => f.id === formData.fieldOfStudy || f.name === formData.fieldOfStudy
  );

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSkillAdd = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed], skillInput: '' }));
      setError(null);
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  const scrollToField = (fieldId: string) => {
    const el = document.getElementById(fieldId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  };

  const validateCurrentStep = (currentStep: number): { ok: boolean; message?: string; fieldId?: string } => {
    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        return { ok: false, message: 'Please enter your Full Name', fieldId: 'fullName' };
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
        return { ok: false, message: 'Please enter a valid Email Address', fieldId: 'email' };
      }
      if (!formData.phone.trim() || !isValidPhone(formData.phone)) {
        return { ok: false, message: 'Please enter a valid Cameroon Phone Number (e.g. 671 234 567)', fieldId: 'phone' };
      }
      return { ok: true };
    }

    if (currentStep === 2) {
      if (!formData.qualification) {
        return { ok: false, message: 'Please select your Diploma / Qualification', fieldId: 'qualification' };
      }
      if (formData.qualification === 'other' && !formData.qualificationOther.trim()) {
        return { ok: false, message: 'Please specify your qualification', fieldId: 'qualificationOther' };
      }
      if (!formData.academicLevel) {
        return { ok: false, message: 'Please select your Academic Level', fieldId: 'academicLevel' };
      }
      if (!formData.institution.trim()) {
        return { ok: false, message: 'Please enter your University or Institution', fieldId: 'institution' };
      }
      if (!formData.fieldOfStudy) {
        return { ok: false, message: 'Please select your Professional Field', fieldId: 'fieldOfStudy' };
      }
      if (formData.fieldOfStudy === 'other' && !formData.fieldOfStudyOther.trim()) {
        return { ok: false, message: 'Please specify your professional field', fieldId: 'fieldOfStudyOther' };
      }
      if (!formData.educationStartYear) {
        return { ok: false, message: 'Please enter your Education Start Year', fieldId: 'educationStartYear' };
      }
      const startYearNum = Number(formData.educationStartYear);
      if (startYearNum < 1990 || startYearNum > currentYear) {
        return { ok: false, message: `Start year must be between 1990 and ${currentYear}`, fieldId: 'educationStartYear' };
      }
      if (formData.educationEndYear && !formData.isCurrentEducation) {
        const endYearNum = Number(formData.educationEndYear);
        if (endYearNum < startYearNum) {
          return { ok: false, message: 'End year cannot be earlier than your start year', fieldId: 'educationEndYear' };
        }
        if (endYearNum > currentYear + 6) {
          return { ok: false, message: `End year cannot be greater than ${currentYear + 6}`, fieldId: 'educationEndYear' };
        }
      }
      return { ok: true };
    }

    if (currentStep === 3) {
      if (!formData.region) {
        return { ok: false, message: 'Please select your Region in Cameroon', fieldId: 'region' };
      }
      if (!formData.city.trim()) {
        return { ok: false, message: 'Please enter your City or Town (e.g. Douala, Yaoundé, Buea)', fieldId: 'city' };
      }
      if (formData.skills.length === 0) {
        return { ok: false, message: 'Please enter and add at least one professional skill', fieldId: 'skillInput' };
      }
      return { ok: true };
    }

    if (currentStep === 4) {
      if (!cvFile) {
        return { ok: false, message: 'Please select and upload your CV (PDF document)', fieldId: 'cv-upload' };
      }
      if (!photoFile) {
        return { ok: false, message: 'Please select a profile portrait photo for your Intern Passport', fieldId: 'photo-upload' };
      }
      return { ok: true };
    }

    return { ok: true };
  };

  const handleNext = () => {
    const result = validateCurrentStep(step);
    if (!result.ok) {
      setError(result.message || 'Please fill in this required field');
      if (result.fieldId) {
        scrollToField(result.fieldId);
      }
      return;
    }
    setError(null);
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    const result = validateCurrentStep(4);
    if (!result.ok) {
      setError(result.message || 'Please upload both your CV and photo');
      if (result.fieldId) scrollToField(result.fieldId);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Upload CV
      const cvFormData = new FormData();
      if (cvFile) cvFormData.append('file', cvFile);
      const cvRes = await fetch('/api/interns/upload-cv', { method: 'POST', body: cvFormData });
      if (!cvRes.ok) {
        const errJson = await cvRes.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed uploading CV document. Please verify file is a valid PDF under 8MB.');
      }
      const cvData = await cvRes.json();

      // 2. Upload Photo
      const photoFormData = new FormData();
      if (photoFile) photoFormData.append('file', photoFile);
      const photoRes = await fetch('/api/interns/upload-photo', { method: 'POST', body: photoFormData });
      if (!photoRes.ok) {
        const errJson = await photoRes.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed uploading profile photo. Please verify image format.');
      }
      const photoData = await photoRes.json();

      // 3. Register intern profile
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        isPhonePublic: formData.isPhonePublic,
        qualification: formData.qualification === 'other' ? formData.qualificationOther : formData.qualification,
        academicLevel: formData.academicLevel === 'other' ? formData.academicLevelOther : formData.academicLevel,
        institution: formData.institution.trim(),
        fieldOfStudy: formData.fieldOfStudy === 'other' ? formData.fieldOfStudyOther : formData.fieldOfStudy,
        specialization: formData.specialization === 'other' ? formData.specializationOther : formData.specialization,
        educationStartYear: formData.educationStartYear,
        educationEndYear: formData.isCurrentEducation ? undefined : formData.educationEndYear,
        isCurrentEducation: formData.isCurrentEducation,
        region: formData.region === 'other' ? formData.regionOther : formData.region,
        city: formData.city.trim(),
        preferredWorkMode: formData.preferredWorkMode,
        availability: formData.availability,
        skills: formData.skills,
        headline: formData.headline || `${formData.qualification} in ${selectedFieldObj?.name || formData.fieldOfStudy}`,
        summary: formData.summary || `${formData.fullName} - Qualified in ${formData.institution}.`,
        isCvSearchable: formData.isCvSearchable,
        experiences: formData.experiences
          .filter((e) => e.companyName.trim() && e.roleTitle.trim())
          .map((e) => ({
            companyName: e.companyName.trim(),
            roleTitle: e.roleTitle.trim(),
            durationMonths: parseInt(e.durationMonths, 10) || 3,
            location: e.location.trim() || formData.city.trim() || 'Cameroon',
          })),
        cvUrl: cvData.cvUrl,
        cvFileKey: cvData.cvFileKey,
        cvFileName: cvData.cvFileName,
        cvFileSize: cvData.cvFileSize,
        photoUrl: photoData.photoUrl,
      };

      const regRes = await fetch('/api/interns/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const regData = await regRes.json();
      if (!regRes.ok) {
        throw new Error(regData.error || 'Registration failed. Please check your information and try again.');
      }

      setSuccessData({
        passportNumber: regData.passportNumber || regData.passport?.passportNumber || 'MN-CM-2026-ACTIVE',
        fullName: formData.fullName,
        qualification: formData.qualification,
        field: selectedFieldObj?.name || formData.fieldOfStudy,
        region: formData.city + ', Cameroon',
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your data and retry.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE VIEW
  if (isSuccess && successData) {
    return (
      <div
        className="min-h-screen relative bg-cover bg-center bg-fixed text-white flex items-center justify-center p-4 sm:p-6"
        style={{ backgroundImage: "url('/images/intern_dash_bg.svg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md" />

        <div className="relative z-10 max-w-xl w-full rounded-3xl border border-emerald-500/40 bg-slate-900/95 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" /> Intern Passport Verified
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {successData.fullName}!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your Cameroon Intern Passport has been created with full credential readiness. You can now apply directly to verified host enterprises and receive instant WhatsApp opportunities.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-5 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Digital Passport ID:</span>
              <span className="text-sm font-mono font-bold text-cyan-300">{successData.passportNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Discipline:</span>
              <span className="text-xs font-semibold text-white truncate max-w-[200px]">{successData.field}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Readiness Score:</span>
              <span className="text-xs font-bold text-emerald-400">100% (CV &amp; Passport Ready)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/internships" className="flex-1">
              <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs">
                <Briefcase className="w-4 h-4 mr-2" />
                Browse Internships
              </Button>
            </Link>
            <Link href="/jobs" className="flex-1">
              <Button variant="outline" className="w-full h-11 border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-bold">
                Browse Cameroon Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-fixed text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundImage: "url('/images/intern_dash_bg.svg')" }}
    >
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[3px]" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <Logo size={120} />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-300 mb-3">
            <Award className="w-3.5 h-3.5 text-cyan-400" /> Free Intern Passport Registration
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Complete Your Intern Profile
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
            Build your cryptographically verified Intern Passport to connect with accredited host enterprises across all 10 regions of Cameroon.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                  step >= stepNum
                    ? 'bg-blue-600 text-white shadow-blue-600/30 border border-blue-400/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {step > stepNum ? <Check className="w-4 h-4 text-emerald-300" /> : `0${stepNum}`}
              </div>
              {stepNum < totalSteps && (
                <div
                  className={`w-12 sm:w-16 h-1 mx-2 rounded-full transition-colors ${
                    step > stepNum ? 'bg-blue-500' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 rounded-2xl border-red-500/40 bg-red-950/60 text-red-200 backdrop-blur-md">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 01 / 04</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Personal Contact Details</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Provide your official name and direct phone number so verified recruiters can reach you.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g. David Kamga"
                    className="mt-1.5 h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Email Address <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="mt-1.5 h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Phone Number (WhatsApp Preferred) <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+237 671 234 567 or 671 234 567"
                    className="mt-1.5 h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct WhatsApp notifications for job and interview alerts will be sent here.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="isPhonePublic"
                    checked={formData.isPhonePublic}
                    onCheckedChange={(c) => handleInputChange('isPhonePublic', !!c)}
                  />
                  <Label htmlFor="isPhonePublic" className="text-xs text-slate-300 font-normal cursor-pointer">
                    Make phone number visible to verified recruiting companies
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION & QUALIFICATION */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 02 / 04</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Education &amp; Professional Discipline</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Specify your qualification level and academic field to match relevant host openings.
                </p>
              </div>

              <div className="space-y-4">
                {/* Diploma/Qualification */}
                <div>
                  <Label htmlFor="qualification" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Diploma / Qualification <span className="text-red-400">*</span>
                  </Label>
                  <select
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) => {
                      handleInputChange('qualification', e.target.value);
                      if (e.target.value !== 'other') handleInputChange('qualificationOther', '');
                    }}
                    className="mt-1.5 w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Select your qualification</option>
                    <option value="HND">HND (Higher National Diploma / BTS)</option>
                    <option value="BSc">Bachelor&apos;s Degree (BSc / Licence)</option>
                    <option value="BEng">Bachelor of Engineering (BEng / Ingénieur)</option>
                    <option value="MSc">Master&apos;s Degree (MSc / Master)</option>
                    <option value="PhD">Doctorate / PhD</option>
                    <option value="other">Other (Please specify)</option>
                  </select>

                  {formData.qualification === 'other' && (
                    <div className="mt-2">
                      <Input
                        id="qualificationOther"
                        value={formData.qualificationOther}
                        onChange={(e) => handleInputChange('qualificationOther', e.target.value)}
                        placeholder="Enter your specific qualification (e.g. DSEP, Professional Certificate)"
                        className="h-10 bg-slate-800/80 border-slate-700 text-white text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Academic Level */}
                <div>
                  <Label htmlFor="academicLevel" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Academic Level <span className="text-red-400">*</span>
                  </Label>
                  <select
                    id="academicLevel"
                    value={formData.academicLevel}
                    onChange={(e) => {
                      handleInputChange('academicLevel', e.target.value);
                      if (e.target.value !== 'other') handleInputChange('academicLevelOther', '');
                    }}
                    className="mt-1.5 w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Select your academic level</option>
                    <option value="Undergraduate">Undergraduate (Current Student)</option>
                    <option value="Recent Graduate">Recent Graduate (&lt; 2 years)</option>
                    <option value="Postgraduate">Postgraduate (Master / PhD)</option>
                    <option value="Vocational / Professional">Vocational / Professional Trainee</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Institution */}
                <div>
                  <Label htmlFor="institution" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    University / Higher Institute <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    placeholder="e.g. University of Yaoundé I, University of Buea, ENSPY, IUC"
                    className="mt-1.5 h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400"
                  />
                </div>

                {/* Professional Field */}
                <div>
                  <Label htmlFor="fieldOfStudy" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Professional Field <span className="text-red-400">*</span>
                  </Label>
                  <select
                    id="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={(e) => {
                      handleInputChange('fieldOfStudy', e.target.value);
                      handleInputChange('specialization', '');
                      if (e.target.value !== 'other') handleInputChange('fieldOfStudyOther', '');
                    }}
                    className="mt-1.5 w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Select your professional field</option>
                    {availableFields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                    <option value="other">Other (Please specify)</option>
                  </select>

                  {formData.fieldOfStudy === 'other' && (
                    <div className="mt-2">
                      <Input
                        id="fieldOfStudyOther"
                        value={formData.fieldOfStudyOther}
                        onChange={(e) => handleInputChange('fieldOfStudyOther', e.target.value)}
                        placeholder="Enter your professional field"
                        className="h-10 bg-slate-800/80 border-slate-700 text-white text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Specialization (Dynamic from selected field) */}
                <div>
                  <Label htmlFor="specialization" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Specialization
                  </Label>
                  <select
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => {
                      handleInputChange('specialization', e.target.value);
                      if (e.target.value !== 'other') handleInputChange('specializationOther', '');
                    }}
                    className="mt-1.5 w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Select specialization</option>
                    {selectedFieldObj?.specializations?.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>

                  {formData.specialization === 'other' && (
                    <div className="mt-2">
                      <Input
                        id="specializationOther"
                        value={formData.specializationOther}
                        onChange={(e) => handleInputChange('specializationOther', e.target.value)}
                        placeholder="Enter your specialization"
                        className="h-10 bg-slate-800/80 border-slate-700 text-white text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Start & End Year with validation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="educationStartYear" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                      Start Year <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="educationStartYear"
                      type="number"
                      value={formData.educationStartYear}
                      onChange={(e) => handleInputChange('educationStartYear', e.target.value)}
                      placeholder="2020"
                      min="1990"
                      max={currentYear}
                      className="mt-1.5 h-11 bg-slate-800/80 border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <Label htmlFor="educationEndYear" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                      End Year {!formData.isCurrentEducation && <span className="text-red-400">*</span>}
                    </Label>
                    <Input
                      id="educationEndYear"
                      type="number"
                      value={formData.educationEndYear}
                      onChange={(e) => handleInputChange('educationEndYear', e.target.value)}
                      placeholder="2024"
                      min={formData.educationStartYear || '1990'}
                      max={currentYear + 6}
                      disabled={formData.isCurrentEducation}
                      className="mt-1.5 h-11 bg-slate-800/80 border-slate-700 text-white text-xs disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="isCurrentEducation"
                    checked={formData.isCurrentEducation}
                    onCheckedChange={(c) => {
                      handleInputChange('isCurrentEducation', !!c);
                      if (c) handleInputChange('educationEndYear', '');
                    }}
                  />
                  <Label htmlFor="isCurrentEducation" className="text-xs text-slate-300 font-normal cursor-pointer">
                    I am currently enrolled / studying here
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION & PREFERENCES */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 03 / 04</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Location &amp; Skills</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Tell us where you are based and the technical skills you bring.
                </p>
              </div>

              <div className="space-y-4">
                {/* Region */}
                <div>
                  <Label htmlFor="region" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Region <span className="text-red-400">*</span>
                  </Label>
                  <select
                    id="region"
                    value={formData.region}
                    onChange={(e) => {
                      handleInputChange('region', e.target.value);
                      if (e.target.value !== 'other') handleInputChange('regionOther', '');
                    }}
                    className="mt-1.5 w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Select your region</option>
                    {availableRegions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.capital})
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="city" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    City / Town <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="e.g. Douala, Yaoundé, Buea, Bamenda, Bafoussam"
                    className="mt-1.5 h-11 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400"
                  />
                </div>

                {/* Work Mode */}
                <div>
                  <Label htmlFor="preferredWorkMode" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Preferred Work Mode
                  </Label>
                  <select
                    id="preferredWorkMode"
                    value={formData.preferredWorkMode}
                    onChange={(e) => handleInputChange('preferredWorkMode', e.target.value)}
                    className="mt-1.5 w-full h-11 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="ONSITE">On-Site (At Company Office)</option>
                    <option value="HYBRID">Hybrid (Flexible Office &amp; Remote)</option>
                    <option value="REMOTE">Fully Remote</option>
                  </select>
                </div>

                {/* Skills tags */}
                <div>
                  <Label htmlFor="skillInput" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Skills &amp; Technologies <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      id="skillInput"
                      value={formData.skillInput}
                      onChange={(e) => handleInputChange('skillInput', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSkillAdd(formData.skillInput);
                        }
                      }}
                      placeholder="Type a skill and press Enter (e.g. React, Financial Modeling, AutoCAD)"
                      className="h-11 bg-slate-800/80 border-slate-700 text-white text-xs placeholder-slate-500 focus:border-cyan-400"
                    />
                    <Button
                      type="button"
                      onClick={() => handleSkillAdd(formData.skillInput)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4"
                    >
                      Add
                    </Button>
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/80 border border-blue-500/40 text-blue-200"
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
              </div>
            </div>
          )}

          {/* STEP 4: CV & PHOTO UPLOAD */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 04 / 04</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">CV &amp; Professional Photo</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Upload your CV document and official portrait to complete your Intern Passport.
                </p>
              </div>

              <div className="space-y-5">
                {/* CV Upload */}
                <div id="cv-upload">
                  <Label htmlFor="cv" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Digital CV (PDF Document) <span className="text-red-400">*</span>
                  </Label>
                  <div className="mt-1.5 border-2 border-dashed border-slate-700 hover:border-blue-400 rounded-2xl p-6 text-center transition-colors bg-slate-800/40">
                    <input
                      id="cv"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="cv" className="cursor-pointer block">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                      <p className="text-xs font-bold text-white">
                        {cvFile ? cvFile.name : 'Click to select PDF CV document'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">PDF document up to 8MB</p>
                    </label>
                  </div>
                </div>

                {/* Photo Upload */}
                <div id="photo-upload">
                  <Label htmlFor="photo" className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                    Professional Portrait Photo <span className="text-red-400">*</span>
                  </Label>
                  <div className="mt-1.5 border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-6 text-center transition-colors bg-slate-800/40">
                    <input
                      id="photo"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="photo" className="cursor-pointer block">
                      <GraduationCap className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                      <p className="text-xs font-bold text-white">
                        {photoFile ? photoFile.name : 'Click to select profile portrait'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">JPG, PNG or WebP up to 4MB</p>
                    </label>
                  </div>
                </div>

                {/* Privacy Toggle */}
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="isCvSearchable"
                    checked={formData.isCvSearchable}
                    onCheckedChange={(c) => handleInputChange('isCvSearchable', !!c)}
                  />
                  <Label htmlFor="isCvSearchable" className="text-xs text-slate-300 font-normal cursor-pointer">
                    Allow verified recruiters across Cameroon to discover my Intern Passport
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={loading}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
              >
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 shadow-lg shadow-blue-600/30"
              >
                Next Step <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-7 shadow-lg shadow-emerald-900/40"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Passport...
                  </>
                ) : (
                  <>
                    Complete &amp; Generate Passport
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
