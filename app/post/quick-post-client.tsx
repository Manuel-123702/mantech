'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  MessageSquare,
  Link as LinkIcon,
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Upload,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Zap,
  Building2,
  DollarSign,
  Layers,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type PostMode = 'flyer' | 'whatsapp' | 'link' | 'detailed';
type PostType = 'job' | 'internship';

const CAMEROON_CITIES = [
  'Douala',
  'Yaoundé',
  'Buea',
  'Limbe',
  'Bafoussam',
  'Bamenda',
  'Garoua',
  'Maroua',
  'Ngaoundéré',
  'Kribi',
  'Bertoua',
  'Ebolowa',
  'Other / Remote',
];

const WORK_MODES = [
  { id: 'ONSITE', label: 'On-site (Au bureau / Sur site)' },
  { id: 'HYBRID', label: 'Hybrid (Mixte présentiel / télétravail)' },
  { id: 'REMOTE', label: '100% Remote (Télétravail complet)' },
];

export function QuickPostClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialType = searchParams.get('type') === 'internship' ? 'internship' : 'job';
  const [postType, setPostType] = useState<PostType>(initialType);
  const [mode, setMode] = useState<PostMode>('flyer');

  // Shared Form State (No Login Required)
  const [title, setTitle] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('+237 ');
  const [city, setCity] = useState('Douala');
  const [isUrgentBoosted, setIsUrgentBoosted] = useState(true); // Default true for 0 FCFA launch promo!

  // Mode 1: Flyer State
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);

  // Mode 2: WhatsApp State
  const [whatsappText, setWhatsappText] = useState('');

  // Mode 3: External Link State
  const [externalUrl, setExternalUrl] = useState('');

  // Mode 4: Detailed Form State
  const [detailedDescription, setDetailedDescription] = useState('');
  const [workMode, setWorkMode] = useState('ONSITE');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [educationLevel, setEducationLevel] = useState('All levels welcome');

  const [submitting, setSubmitting] = useState(false);
  const [publishedData, setPublishedData] = useState<{
    slug: string;
    title: string;
    type: string;
  } | null>(null);

  const handleFlyerChange = (file: File | null) => {
    setFlyerFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFlyerPreview(url);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    } else {
      setFlyerPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let flyerUrl = '';

      // Upload flyer if mode is flyer
      if (mode === 'flyer') {
        if (!flyerFile && !flyerPreview) {
          toast.error('Please select an image flyer or poster to upload');
          setSubmitting(false);
          return;
        }

        if (flyerFile) {
          try {
            const formData = new FormData();
            formData.append('file', flyerFile);
            const uploadRes = await fetch('/api/interns/upload-photo', {
              method: 'POST',
              body: formData,
            });

            if (uploadRes.ok) {
              const uploadJson = await uploadRes.json();
              flyerUrl = uploadJson.photoUrl || '';
            }
          } catch (uploadErr) {
            console.warn('[post] Flyer upload warning:', uploadErr);
          }
        }
      }

      if (mode === 'whatsapp' && !whatsappText.trim()) {
        toast.error('Please paste your WhatsApp announcement text');
        setSubmitting(false);
        return;
      }

      if (mode === 'link' && !externalUrl.trim()) {
        toast.error('Please enter the job application or website link');
        setSubmitting(false);
        return;
      }

      const effectiveTitle =
        title.trim() ||
        (mode === 'flyer'
          ? `${postType === 'internship' ? 'Internship' : 'Job'} Opening (${city})`
          : employerName.trim()
          ? `${postType === 'internship' ? 'Internship' : 'Job'} at ${employerName.trim()}`
          : 'New Professional Opportunity');

      let finalDescription = '';
      if (mode === 'flyer') {
        finalDescription = `Recruitment flyer uploaded by employer. Contact directly via WhatsApp/Phone: ${whatsappPhone || 'MANTECH'}.\n\n[Flyer URL]: ${flyerUrl || flyerPreview || ''}`;
      } else if (mode === 'whatsapp') {
        finalDescription = `${whatsappText}\n\nDirect WhatsApp/Phone Contact: ${whatsappPhone || 'MANTECH'}`;
      } else if (mode === 'link') {
        finalDescription = `Apply directly at official careers portal: ${externalUrl}\n\nContact: ${whatsappPhone || 'MANTECH'}`;
      } else {
        finalDescription = detailedDescription || `${effectiveTitle} opening at ${employerName || 'Verified Enterprise'}. Contact: ${whatsappPhone || 'MANTECH'}`;
      }

      const payload = {
        title: effectiveTitle,
        organizationName: employerName.trim() || 'Verified Enterprise',
        city: city || 'Douala',
        workMode: workMode || 'ONSITE',
        type: postType === 'internship' ? 'INTERNSHIP' : 'FULL_TIME',
        postType: postType,
        description: finalDescription,
        applicationMethod: mode === 'link' ? 'COMPANY_WEBSITE' : 'MANTECH',
        applicationUrl: mode === 'link' ? externalUrl : undefined,
        flyerUrl: flyerUrl || flyerPreview || undefined,
        contactPhone: whatsappPhone || '+237 600 000 000',
        requiredSkills: requiredSkills
          ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        salaryMinXAF: salaryMin ? parseInt(salaryMin, 10) : undefined,
        salaryMaxXAF: salaryMax ? parseInt(salaryMax, 10) : undefined,
        educationLevel: educationLevel || undefined,
        isFeatured: isUrgentBoosted,
      };

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to publish posting');
      }

      const resData = await res.json();
      const generatedSlug = resData.job?.slug || resData.slug || 'latest';

      toast.success(
        `🎉 ${postType === 'internship' ? 'Internship' : 'Job'} Published Successfully!`
      );
      setPublishedData({
        slug: generatedSlug,
        title: effectiveTitle,
        type: postType,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error publishing posting';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Graphic */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('/images/portal_dash_bg.svg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {publishedData ? (
          /* SUCCESS VIEW */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-8 text-center backdrop-blur-xl shadow-2xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3">
              100% Free National Launch
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Opportunity is Live on MANTECH!
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-lg mx-auto">
              Your {publishedData.type} &ldquo;{publishedData.title}&rdquo; has been posted and is
              now accessible to talent across Cameroon&apos;s 10 regions.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={
                  publishedData.type === 'internship'
                    ? `/internships/${publishedData.slug}`
                    : `/jobs/${publishedData.slug}`
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95"
              >
                View Your Opportunity <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => {
                  setPublishedData(null);
                  setFlyerFile(null);
                  setFlyerPreview(null);
                  setTitle('');
                  setWhatsappText('');
                  setDetailedDescription('');
                }}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                Post Another Opportunity
              </button>
            </div>
          </motion.div>
        ) : (
          /* FORM VIEW */
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1.5 text-xs font-extrabold text-cyan-300 shadow-lg shadow-cyan-500/10">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Zero Login Required · 100% Free National Rollout</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
                Publish a Job or Internship
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                Choose your preferred way to recruit: drop a Canva flyer image, paste a WhatsApp forward, share an external portal link, or write a detailed job description.
              </p>
            </div>

            {/* Type Selector (Job vs Internship) */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-900/90 p-1.5 border border-slate-800 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setPostType('job')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  postType === 'job'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Job Opening (Emploi)</span>
              </button>
              <button
                type="button"
                onClick={() => setPostType('internship')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  postType === 'internship'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Internship (Stage)</span>
              </button>
            </div>

            {/* Mode Tabs (Flyer vs WhatsApp vs Link vs Detailed) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMode('flyer')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  mode === 'flyer'
                    ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 shadow-md shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                <span className="text-xs font-bold">1. Poster Flyer</span>
                <span className="text-[10px] opacity-75">Upload Image</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('whatsapp')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  mode === 'whatsapp'
                    ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs font-bold">2. WhatsApp Text</span>
                <span className="text-[10px] opacity-75">Paste Forward</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('link')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  mode === 'link'
                    ? 'border-blue-500 bg-blue-950/50 text-blue-300 shadow-md shadow-blue-500/20'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                <span className="text-xs font-bold">3. Career Link</span>
                <span className="text-[10px] opacity-75">External URL</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('detailed')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  mode === 'detailed'
                    ? 'border-indigo-500 bg-indigo-950/50 text-indigo-300 shadow-md shadow-indigo-500/20'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span className="text-xs font-bold">4. Detailed Form</span>
                <span className="text-[10px] opacity-75">Skills & Salary</span>
              </button>
            </div>

            {/* The Main Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
            >
              {/* MODE 1: FLYER UPLOAD */}
              {mode === 'flyer' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-dashed border-cyan-500/40 bg-cyan-950/10 p-6 text-center hover:border-cyan-500 transition-colors relative">
                    {flyerPreview ? (
                      <div className="space-y-3">
                        <div className="relative mx-auto h-64 max-w-sm overflow-hidden rounded-xl border border-slate-700">
                          <Image
                            src={flyerPreview}
                            alt="Flyer preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-xs text-cyan-300 font-semibold">{flyerFile?.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleFlyerChange(null)}
                          className="text-xs border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                        >
                          Change Flyer
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center space-y-3 py-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">
                            Click to upload recruitment poster or flyer
                          </p>
                          <p className="text-xs text-slate-400">
                            PNG, JPG, WEBP up to 10MB · Everything is visible on the image
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFlyerChange(e.target.files?.[0] || null)}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    💡 <em>No department or specialization needed! Your flyer contains all requirements.</em>
                  </p>
                </div>
              )}

              {/* MODE 2: WHATSAPP FORWARD */}
              {mode === 'whatsapp' && (
                <div className="space-y-2">
                  <Label htmlFor="waText" className="text-xs font-bold text-slate-300">
                    Paste WhatsApp Broadcast / Forwarded Message:
                  </Label>
                  <Textarea
                    id="waText"
                    rows={6}
                    value={whatsappText}
                    onChange={(e) => setWhatsappText(e.target.value)}
                    placeholder="Paste the recruitment message copied from your WhatsApp groups or chats here..."
                    className="bg-slate-950 border-slate-800 text-white text-xs leading-relaxed"
                    required
                  />
                </div>
              )}

              {/* MODE 3: CAREER LINK */}
              {mode === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="linkUrl" className="text-xs font-bold text-slate-300">
                    Direct Careers Portal / LinkedIn Job Link:
                  </Label>
                  <Input
                    id="linkUrl"
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://company.com/careers/job-123 or https://linkedin.com/jobs/..."
                    className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    Candidates who click &ldquo;Apply&rdquo; will be redirected straight to this link.
                  </p>
                </div>
              )}

              {/* MODE 4: DETAILED HR FORM */}
              {mode === 'detailed' && (
                <div className="space-y-4 pt-1">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300">
                      Detailed Job / Internship Description:
                    </Label>
                    <Textarea
                      rows={6}
                      value={detailedDescription}
                      onChange={(e) => setDetailedDescription(e.target.value)}
                      placeholder="Outline core responsibilities, team missions, daily tasks, tools used..."
                      className="bg-slate-950 border-slate-800 text-white text-xs leading-relaxed"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">
                        Work Mode (Mode de travail)
                      </Label>
                      <select
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value)}
                        className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3"
                      >
                        {WORK_MODES.map((wm) => (
                          <option key={wm.id} value={wm.id}>
                            {wm.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">
                        Minimum Education Level (Niveau académique)
                      </Label>
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3"
                      >
                        <option value="All levels welcome">All levels welcome (Tous niveaux)</option>
                        <option value="Baccalauréat / GCE A-Level">Baccalauréat / GCE A-Level</option>
                        <option value="Bac+2 (BTS / DUT / HND)">Bac+2 (BTS / DUT / HND)</option>
                        <option value="Bac+3 (Licence / Bachelor)">Bac+3 (Licence / Bachelor)</option>
                        <option value="Bac+5 (Master / Ingénieur)">Bac+5 (Master / Ingénieur)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300">
                      Required Skills (Compétences requises — séparées par des virgules):
                    </Label>
                    <Input
                      value={requiredSkills}
                      onChange={(e) => setRequiredSkills(e.target.value)}
                      placeholder="e.g. React, Node.js, Accounting, Sales, Customer Service"
                      className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">
                        Salary / Monthly Stipend Min (XAF - Optionnel)
                      </Label>
                      <Input
                        type="number"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        placeholder="e.g. 50000"
                        className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">
                        Salary / Stipend Max (XAF - Optionnel)
                      </Label>
                      <Input
                        type="number"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        placeholder="e.g. 150000"
                        className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SHARED FIELDS ACROSS ALL MODES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-bold text-slate-300">
                    Role / Position Title:
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sales Associate, Registered Nurse, Fullstack Dev"
                    className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employer" className="text-xs font-bold text-slate-300">
                    Company / Employer / Shop Name:
                  </Label>
                  <Input
                    id="employer"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    placeholder="e.g. Boutique Modern, Orange, Cabinet Médical..."
                    className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-bold text-slate-300">
                    City / Location (Cameroon):
                  </Label>
                  <select
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {CAMEROON_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-300">
                    WhatsApp or Phone Contact (For applicants):
                  </Label>
                  <Input
                    id="phone"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+237 6XXXXXXXX"
                    className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                    required
                  />
                </div>
              </div>

              {/* URGENT BOOST OPTION (FREE PROMO) */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      Apply Urgent Placement Boost (Top Ranking)
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      0 FCFA Launch Promo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Pins this posting at the top of search listings with a priority highlight badge.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isUrgentBoosted}
                  onChange={(e) => setIsUrgentBoosted(e.target.checked)}
                  className="h-5 w-5 rounded border-amber-500 text-amber-500 accent-amber-500 cursor-pointer shrink-0"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Publishing Opportunity...</span>
                ) : (
                  <>
                    <span>
                      Publish {postType === 'internship' ? 'Internship' : 'Job'} (100% Free · No Login)
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
