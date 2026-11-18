'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  Calendar,
  Zap,
  Trash2,
  ExternalLink,
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

  // Mode 1: Pure Image Flyer State
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);

  // Mode 2: WhatsApp Broadcast State
  const [whatsappText, setWhatsappText] = useState('');
  const [whatsappCity, setWhatsappCity] = useState('Douala');
  const [whatsappPhone, setWhatsappPhone] = useState('+237 ');

  // Mode 3: External Link State
  const [externalUrl, setExternalUrl] = useState('');

  // Mode 4: Detailed Form State
  const [detailedTitle, setDetailedTitle] = useState('');
  const [detailedCompany, setDetailedCompany] = useState('');
  const [detailedCity, setDetailedCity] = useState('Douala');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [workMode, setWorkMode] = useState('ONSITE');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [educationLevel, setEducationLevel] = useState('All levels welcome');
  const [detailedPhone, setDetailedPhone] = useState('+237 ');

  // Expiring Date State (Rule §5)
  const [expiryOption, setExpiryOption] = useState<string>('30');
  const [customExpiryDate, setCustomExpiryDate] = useState<string>('');
  const [isUrgentBoosted, setIsUrgentBoosted] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [publishedData, setPublishedData] = useState<{
    slug: string;
    title: string;
    type: string;
    mode: PostMode;
  } | null>(null);

  const handleFlyerChange = (file: File | null) => {
    setFlyerFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFlyerPreview(url);
    } else {
      setFlyerPreview(null);
    }
  };

  const getEffectiveExpiryDate = (): Date => {
    if (expiryOption === 'custom' && customExpiryDate) {
      return new Date(customExpiryDate);
    }
    const days = parseInt(expiryOption, 10) || 30;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const effectiveExpiry = getEffectiveExpiryDate();
      let payload: Record<string, any> = {};

      // ── METHOD 1: PURE FLYER / IMAGE ──────────────────────────────────────
      if (mode === 'flyer') {
        if (!flyerFile) {
          toast.error('Please select an image flyer or poster to upload');
          setSubmitting(false);
          return;
        }

        // Upload flyer to permanent storage
        const formData = new FormData();
        formData.append('file', flyerFile);
        const uploadRes = await fetch('/api/postings/upload-flyer', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to upload flyer image');
        }

        const uploadJson = await uploadRes.json();
        const permanentFlyerUrl = uploadJson.flyerUrl;

        const baseCleanName = flyerFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const flyerTitle = `${postType === 'internship' ? 'Stage' : 'Emploi'} Flyer — ${baseCleanName}`;

        payload = {
          title: flyerTitle,
          organizationName: 'Enterprise Announcement',
          city: 'Cameroon',
          workMode: 'ONSITE',
          type: postType === 'internship' ? 'INTERNSHIP' : 'FULL_TIME',
          postType: postType,
          description: `Visual recruitment poster published directly by employer. Review image flyer for full application requirements.`,
          flyerUrl: permanentFlyerUrl,
          isFeatured: isUrgentBoosted,
          expiryDate: effectiveExpiry.toISOString(),
          isVisualFlyerOnly: true,
          isLinkOnly: false,
        };
      }

      // ── METHOD 2: WHATSAPP BROADCAST / TEXT ──────────────────────────────
      else if (mode === 'whatsapp') {
        if (!whatsappText.trim()) {
          toast.error('Please paste your WhatsApp announcement message');
          setSubmitting(false);
          return;
        }

        const lines = whatsappText.trim().split('\n').filter(Boolean);
        const autoTitle = lines[0]?.slice(0, 70) || `${postType === 'internship' ? 'Internship' : 'Job'} via WhatsApp Broadcast`;

        payload = {
          title: autoTitle,
          organizationName: 'WhatsApp Community Recruitment',
          city: whatsappCity || 'Douala',
          workMode: 'ONSITE',
          type: postType === 'internship' ? 'INTERNSHIP' : 'FULL_TIME',
          postType: postType,
          description: whatsappText,
          contactPhone: whatsappPhone.trim() || undefined,
          isFeatured: isUrgentBoosted,
          expiryDate: effectiveExpiry.toISOString(),
          isVisualFlyerOnly: false,
          isLinkOnly: false,
        };
      }

      // ── METHOD 3: EXTERNAL CAREER PORTAL / LINK ──────────────────────────
      else if (mode === 'link') {
        if (!externalUrl.trim()) {
          toast.error('Please enter the career portal or job link');
          setSubmitting(false);
          return;
        }

        let domain = 'Company Portal';
        try {
          const u = new URL(externalUrl.startsWith('http') ? externalUrl : `https://${externalUrl}`);
          domain = u.hostname.replace(/^www\./, '');
        } catch {}

        payload = {
          title: `${postType === 'internship' ? 'Internship' : 'Job'} Opening (${domain})`,
          organizationName: domain,
          city: 'Cameroon / Remote',
          workMode: 'ONSITE',
          type: postType === 'internship' ? 'INTERNSHIP' : 'FULL_TIME',
          postType: postType,
          description: `Apply directly at the verified corporate portal: ${externalUrl}`,
          applicationMethod: 'COMPANY_WEBSITE',
          applicationUrl: externalUrl,
          externalUrl: externalUrl,
          isFeatured: isUrgentBoosted,
          expiryDate: effectiveExpiry.toISOString(),
          isVisualFlyerOnly: false,
          isLinkOnly: true,
        };
      }

      // ── METHOD 4: DETAILED HR FORM ───────────────────────────────────────
      else if (mode === 'detailed') {
        if (!detailedTitle.trim()) {
          toast.error('Please enter the position title');
          setSubmitting(false);
          return;
        }
        if (!detailedCompany.trim()) {
          toast.error('Please enter the employer or company name');
          setSubmitting(false);
          return;
        }
        if (!detailedDescription.trim()) {
          toast.error('Please write the job/internship description');
          setSubmitting(false);
          return;
        }

        payload = {
          title: detailedTitle.trim(),
          organizationName: detailedCompany.trim(),
          city: detailedCity,
          workMode: workMode,
          type: postType === 'internship' ? 'INTERNSHIP' : 'FULL_TIME',
          postType: postType,
          description: detailedDescription.trim(),
          educationLevel: educationLevel,
          requiredSkills: requiredSkills
            ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          salaryMinXAF: salaryMin ? parseInt(salaryMin, 10) : undefined,
          salaryMaxXAF: salaryMax ? parseInt(salaryMax, 10) : undefined,
          contactPhone: detailedPhone.trim() || undefined,
          isFeatured: isUrgentBoosted,
          expiryDate: effectiveExpiry.toISOString(),
          isVisualFlyerOnly: false,
          isLinkOnly: false,
        };
      }

      // Send to jobs endpoint
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
        title: payload.title,
        type: postType,
        mode: mode,
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
                  publishedData.mode === 'flyer'
                    ? publishedData.type === 'internship' ? '/internships/flyers' : '/jobs/flyers'
                    : publishedData.mode === 'link'
                      ? publishedData.type === 'internship' ? '/internships/links' : '/jobs/links'
                      : publishedData.type === 'internship'
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
                  setWhatsappText('');
                  setExternalUrl('');
                  setDetailedTitle('');
                  setDetailedCompany('');
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
                Choose your preferred method: drop an image flyer, paste a WhatsApp forward, share an external portal link, or fill out a detailed HR form.
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

            {/* 4 Method Selector Tabs */}
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
                <span className="text-[10px] opacity-75">Upload Image Only</span>
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
                <span className="text-xs font-bold">2. WhatsApp Forward</span>
                <span className="text-[10px] opacity-75">Paste Text Message</span>
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
                <span className="text-[10px] opacity-75">External URL Only</span>
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
                <span className="text-[10px] opacity-75">Full Structure</span>
              </button>
            </div>

            {/* The Main Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
            >
              {/* ─────────────────────────────────────────────────────────────
                  MODE 1: PURE IMAGE FLYER UPLOAD (Like e-commerce product upload)
                  ───────────────────────────────────────────────────────────── */}
              {mode === 'flyer' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-dashed border-cyan-500/40 bg-cyan-950/10 p-6 text-center hover:border-cyan-500 transition-colors relative">
                    {flyerPreview ? (
                      <div className="space-y-4">
                        <div className="relative mx-auto max-w-sm rounded-xl border border-slate-700 overflow-hidden shadow-2xl bg-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={flyerPreview}
                            alt="Flyer preview"
                            className="w-full h-auto max-h-96 object-contain mx-auto"
                          />
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-xs text-cyan-300 font-semibold truncate max-w-xs">
                            {flyerFile?.name}
                          </span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleFlyerChange(null)}
                            className="h-8 text-xs bg-rose-600/80 hover:bg-rose-600 text-white flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center space-y-3 py-10">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20">
                          <Upload className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-bold text-white">
                            Upload Recruitment Poster or Flyer Image
                          </p>
                          <p className="text-xs text-slate-400">
                            PNG, JPG, WEBP up to 15MB · Displays as a visual poster in the Notice Board gallery
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFlyerChange(e.target.files?.[0] || null)}
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  MODE 2: WHATSAPP BROADCAST FORWARD
                  ───────────────────────────────────────────────────────────── */}
              {mode === 'whatsapp' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="waText" className="text-xs font-bold text-slate-300">
                      Paste WhatsApp Announcement or Group Broadcast:
                    </Label>
                    <Textarea
                      id="waText"
                      rows={7}
                      value={whatsappText}
                      onChange={(e) => setWhatsappText(e.target.value)}
                      placeholder="Paste the recruitment message copied directly from your WhatsApp groups or chats here..."
                      className="bg-slate-950 border-slate-800 text-white text-xs leading-relaxed"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="waCity" className="text-xs font-bold text-slate-300">
                        City / Location:
                      </Label>
                      <select
                        id="waCity"
                        value={whatsappCity}
                        onChange={(e) => setWhatsappCity(e.target.value)}
                        className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {CAMEROON_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="waPhone" className="text-xs font-bold text-slate-300">
                        WhatsApp Contact Phone for Applicants:
                      </Label>
                      <Input
                        id="waPhone"
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        placeholder="+237 6XXXXXXXX"
                        className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  MODE 3: EXTERNAL CAREER LINK ONLY
                  ───────────────────────────────────────────────────────────── */}
              {mode === 'link' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkUrl" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                      <span>Official Careers Portal or Application URL:</span>
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
                      Candidates will be redirected straight to this verified portal.
                    </p>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  MODE 4: DETAILED HR STRUCTURED FORM
                  ───────────────────────────────────────────────────────────── */}
              {mode === 'detailed' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="detailedTitle" className="text-xs font-bold text-slate-300">
                        Role / Position Title *:
                      </Label>
                      <Input
                        id="detailedTitle"
                        value={detailedTitle}
                        onChange={(e) => setDetailedTitle(e.target.value)}
                        placeholder="e.g. Sales Associate, Registered Nurse, Fullstack Dev"
                        className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="detailedCompany" className="text-xs font-bold text-slate-300">
                        Company / Employer Name *:
                      </Label>
                      <Input
                        id="detailedCompany"
                        value={detailedCompany}
                        onChange={(e) => setDetailedCompany(e.target.value)}
                        placeholder="e.g. Boutique Modern, Orange, Cabinet Médical..."
                        className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="detailedCity" className="text-xs font-bold text-slate-300">
                        City / Location:
                      </Label>
                      <select
                        id="detailedCity"
                        value={detailedCity}
                        onChange={(e) => setDetailedCity(e.target.value)}
                        className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {CAMEROON_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="detailedWorkMode" className="text-xs font-bold text-slate-300">
                        Work Mode:
                      </Label>
                      <select
                        id="detailedWorkMode"
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value)}
                        className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3"
                      >
                        {WORK_MODES.map((wm) => (
                          <option key={wm.id} value={wm.id}>{wm.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300">
                      Minimum Education Level:
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

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300">
                      Required Skills (Compétences séparées par des virgules):
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
                        Salary / Monthly Stipend Min (XAF - Optional):
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
                        Salary / Monthly Stipend Max (XAF - Optional):
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

                  <div className="space-y-2">
                    <Label htmlFor="detailedDesc" className="text-xs font-bold text-slate-300">
                      Job / Internship Description *:
                    </Label>
                    <Textarea
                      id="detailedDesc"
                      rows={5}
                      value={detailedDescription}
                      onChange={(e) => setDetailedDescription(e.target.value)}
                      placeholder="Outline core responsibilities, team missions, daily tasks..."
                      className="bg-slate-950 border-slate-800 text-white text-xs leading-relaxed"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="detailedPhone" className="text-xs font-bold text-slate-300">
                      WhatsApp or Phone Contact (For applicants):
                    </Label>
                    <Input
                      id="detailedPhone"
                      value={detailedPhone}
                      onChange={(e) => setDetailedPhone(e.target.value)}
                      placeholder="+237 6XXXXXXXX"
                      className="bg-slate-950 border-slate-800 text-white text-xs h-11"
                    />
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  EXPIRING DATE SELECTOR (All Modes: User sets expiry date)
                  ───────────────────────────────────────────────────────────── */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <Label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Application Deadline &amp; Expiring Date</span>
                  </Label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Shows for 1 extra week after expiry before auto-deletion
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: '14 Days (2 Semaines)', val: '14' },
                    { label: '30 Days (1 Mois)', val: '30' },
                    { label: '60 Days (2 Mois)', val: '60' },
                    { label: 'Custom Date', val: 'custom' },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setExpiryOption(preset.val)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        expiryOption === preset.val
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {expiryOption === 'custom' && (
                  <Input
                    type="date"
                    value={customExpiryDate}
                    onChange={(e) => setCustomExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-slate-950 border-slate-800 text-white text-xs h-10 mt-1"
                    required
                  />
                )}
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  URGENT BOOST OPTION (FREE PROMO)
                  ───────────────────────────────────────────────────────────── */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      Apply Urgent Placement Gold Badge
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      0 FCFA Launch Promo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Pins this posting at the top of listings with a glowing Gold Badge and homepage feature.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isUrgentBoosted}
                  onChange={(e) => setIsUrgentBoosted(e.target.checked)}
                  className="h-5 w-5 rounded border-amber-500 text-amber-500 accent-amber-500 cursor-pointer shrink-0"
                />
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  SUBMIT BUTTON
                  ───────────────────────────────────────────────────────────── */}
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
                      {mode === 'flyer'
                        ? `Publish ${postType === 'internship' ? 'Internship' : 'Job'} Flyer (Image Only)`
                        : mode === 'link'
                          ? `Publish Official Career Link`
                          : mode === 'whatsapp'
                            ? `Publish WhatsApp Announcement`
                            : `Publish ${postType === 'internship' ? 'Internship' : 'Job'} (Detailed Form)`}
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
