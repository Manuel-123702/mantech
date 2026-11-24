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
import { broadcastNewOpportunity } from '@/lib/notification-sound';

type PostMode = 'flyer' | 'text_form' | 'link';
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

  // Mode 2: Joined Announcement & Quick Form State (WhatsApp + Detailed Merged)
  const [formCompany, setFormCompany] = useState(''); // REQUIRED: Company / Institute Name
  const [formTitle, setFormTitle] = useState(''); // OPTIONAL
  const [formText, setFormText] = useState(''); // OPTIONAL: WhatsApp forward or details
  const [formCity, setFormCity] = useState('Douala'); // OPTIONAL
  const [formPhone, setFormPhone] = useState('+237 '); // OPTIONAL
  const [formWorkMode, setFormWorkMode] = useState('ONSITE'); // OPTIONAL
  const [formSkills, setFormSkills] = useState(''); // OPTIONAL
  const [formSalaryMin, setFormSalaryMin] = useState(''); // OPTIONAL
  const [formSalaryMax, setFormSalaryMax] = useState(''); // OPTIONAL
  const [formEducation, setFormEducation] = useState('All levels welcome'); // OPTIONAL
  const [logoFile, setLogoFile] = useState<File | null>(null); // OPTIONAL logo/brand upload
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Mode 3: External Link State
  const [externalUrl, setExternalUrl] = useState('');
  const [linkDetails, setLinkDetails] = useState(''); // REQUIRED details/description of the link

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

        const companyName = formCompany.trim() || 'Entreprise Partenaire';
        const flyerTitle =
          formTitle.trim() ||
          (formCompany.trim()
            ? `${formCompany.trim()} — ${postType === 'internship' ? 'Avis de Stage' : 'Avis de Recrutement'}`
            : postType === 'internship'
            ? 'Avis de Stage (Flyer)'
            : 'Avis de Recrutement (Flyer)');

        payload = {
          title: flyerTitle,
          organizationName: companyName,
          companyName: companyName,
          city: formCity || 'Douala',
          workMode: 'ONSITE',
          type: postType === 'internship' ? 'INTERNSHIP' : 'FULL_TIME',
          postType: postType,
          description: `Affiche de recrutement officielle publiée directement par l'employeur. Consultez le visuel pour l'intégralité des modalités.`,
          flyerUrl: permanentFlyerUrl,
          contactPhone: formPhone.trim() !== '+237' && formPhone.trim() ? formPhone.trim() : undefined,
          isFeatured: isUrgentBoosted,
          expiryDate: effectiveExpiry.toISOString(),
          isVisualFlyerOnly: true,
          isLinkOnly: false,
        };
      }

      // ── METHOD 2: JOINED ANNOUNCEMENT & FORM (WHATSAPP + DETAILED) ────────
      else if (mode === 'text_form') {
        if (!formCompany.trim()) {
          toast.error('Please specify the company or institute name');
          setSubmitting(false);
          return;
        }

        // Upload logo if provided
        let uploadedLogoUrl = null;
        if (logoFile) {
          try {
            const logoFormData = new FormData();
            logoFormData.append('file', logoFile);
            const logoRes = await fetch('/api/postings/upload-flyer', {
              method: 'POST',
              body: logoFormData,
            });
            if (logoRes.ok) {
              const logoData = await logoRes.json();
              uploadedLogoUrl = logoData.flyerUrl;
            }
          } catch (e) {
            console.warn('Optional logo upload failed:', e);
          }
        }

        const lines = formText.trim().split('\n').filter(Boolean);
        const autoTitle =
          formTitle.trim() ||
          lines[0]?.slice(0, 70) ||
          `${postType === 'internship' ? 'Stage' : 'Poste'} — ${formCompany.trim()}`;

        const autoDescription =
          formText.trim() ||
          `Opportunité ${postType === 'internship' ? 'de stage' : "d'emploi"} auprès de ${formCompany.trim()}. Contactez directement l'employeur pour les modalités.`;

        payload = {
          title: autoTitle,
          organizationName: formCompany.trim(),
          companyName: formCompany.trim(),
          logoUrl: uploadedLogoUrl,
          city: formCity || 'Douala',
          workMode: formWorkMode || 'ONSITE',
          type: postType === 'internship' ? 'INTERNSHIP' : 'FULL_TIME',
          postType: postType,
          description: autoDescription,
          educationLevel: formEducation,
          requiredSkills: formSkills
            ? formSkills.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          salaryMinXAF: formSalaryMin ? parseInt(formSalaryMin, 10) : undefined,
          salaryMaxXAF: formSalaryMax ? parseInt(formSalaryMax, 10) : undefined,
          contactPhone: formPhone.trim() !== '+237' && formPhone.trim() ? formPhone.trim() : undefined,
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

        if (!linkDetails.trim() || linkDetails.trim().length < 10) {
          toast.error('Please provide details about the opportunity or requirements for this link (Required).');
          setSubmitting(false);
          return;
        }

        let domain = 'Company Portal';
        try {
          const u = new URL(externalUrl.startsWith('http') ? externalUrl : `https://${externalUrl}`);
          domain = u.hostname.replace(/^www\./, '');
        } catch {}

        const companyName = formCompany.trim() || domain;
        const linkTitle =
          formTitle.trim() ||
          `${postType === 'internship' ? 'Offre de Stage' : "Offre d'Emploi"} — ${companyName}`;

        const fullDescription = `${linkDetails.trim()}\n\n🔗 Portail Officiel de Recrutement : ${externalUrl}`;

        payload = {
          title: linkTitle,
          organizationName: companyName,
          companyName: companyName,
          city: formCity || 'Douala',
          workMode: 'ONSITE',
          type: postType === 'internship' ? 'INTERNSHIP' : 'FULL_TIME',
          postType: postType,
          description: fullDescription,
          applicationMethod: 'COMPANY_WEBSITE',
          applicationUrl: externalUrl,
          externalUrl: externalUrl,
          contactPhone: formPhone.trim() !== '+237' && formPhone.trim() ? formPhone.trim() : undefined,
          isFeatured: isUrgentBoosted,
          expiryDate: effectiveExpiry.toISOString(),
          isVisualFlyerOnly: false,
          isLinkOnly: true,
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
      const slug = resData.job?.slug || resData.slug || 'latest';

      setPublishedData({
        slug,
        title: payload.title,
        type: postType,
        mode: mode,
      });

      // Play WhatsApp chime and broadcast alert
      broadcastNewOpportunity({
        title: payload.title,
        companyName: payload.companyName || payload.organizationName || 'Entreprise Vérifiée',
        city: payload.city || 'Douala',
        type: postType,
        slug,
        timestamp: Date.now(),
      });

      // Move view UPWARD smoothly so user sees success and choices
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      toast.success(
        `${postType === 'internship' ? 'Internship' : 'Job'} published successfully!`
      );
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong while publishing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b17] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {publishedData ? (
          /* SUCCESS STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-emerald-500/40 bg-slate-900/90 p-8 sm:p-12 text-center backdrop-blur-2xl shadow-2xl space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                Live &amp; Synchronized Across Cameroon
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {publishedData.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Your opportunity is now actively published and discoverable on MANTECH Nexus.
              </p>
            </div>

            {/* Quick Actions (Direct Clickable Links) */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                href={`/${publishedData.type === 'internship' ? 'internships' : 'jobs'}/${publishedData.slug}`}
                className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl px-6 py-4 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>View Published Opportunity</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setPublishedData(null);
                  setFlyerFile(null);
                  setFlyerPreview(null);
                  setLogoFile(null);
                  setLogoPreview(null);
                  setFormCompany('');
                  setFormTitle('');
                  setFormText('');
                  setLinkDetails('');
                  setExternalUrl('');
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="px-6 py-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Post Another Opportunity
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer"
              >
                Go to Homepage
              </Link>
            </div>
          </motion.div>
        ) : (
          /* FORM VIEW */
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1.5 text-xs font-extrabold text-cyan-300 shadow-lg shadow-cyan-500/10">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Zero Login Required · 100% Free Public Posting</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
                Publish a Job or Internship
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Choose your preferred method: drop a visual image poster, write an announcement specifying your company or institute name, or share an external career link.
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

            {/* 3 Streamlined Method Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMode('flyer')}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  mode === 'flyer'
                    ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <ImageIcon className="h-5 w-5" />
                <span className="text-xs sm:text-sm font-bold">1. Poster Flyer</span>
                <span className="text-[11px] opacity-75">Upload Image Only</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('text_form')}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  mode === 'text_form'
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500/50'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs sm:text-sm font-bold">2. Announcement &amp; Form</span>
                <span className="text-[11px] opacity-75">Company Name + Paste/Details</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('link')}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  mode === 'link'
                    ? 'border-blue-500 bg-blue-950/60 text-blue-300 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/50'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <LinkIcon className="h-5 w-5" />
                <span className="text-xs sm:text-sm font-bold">3. Career Link</span>
                <span className="text-[11px] opacity-75">External URL Only</span>
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
                        <div className="relative max-w-sm mx-auto aspect-[3/4] rounded-xl overflow-hidden border border-cyan-500/40 shadow-xl bg-slate-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={flyerPreview}
                            alt="Flyer Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-xs text-slate-300 truncate font-mono">
                            {flyerFile?.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleFlyerChange(null)}
                            className="p-1.5 rounded-lg bg-red-900/50 text-red-400 hover:bg-red-800/80 text-xs transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-8">
                        <div className="w-14 h-14 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center mx-auto mb-3 text-cyan-400 group-hover:scale-105 transition-transform">
                          <Upload className="w-6 h-6" />
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

                  {/* Optional Quick Fields for Flyer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="flyerCompany" className="text-xs font-semibold text-slate-300">
                        Company / Employer Name (Optional)
                      </Label>
                      <Input
                        id="flyerCompany"
                        placeholder="e.g. MTN, Boutique Chic, Cabinet…"
                        value={formCompany}
                        onChange={(e) => setFormCompany(e.target.value)}
                        className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="flyerPhone" className="text-xs font-semibold text-slate-300">
                        WhatsApp Contact Phone (Optional)
                      </Label>
                      <Input
                        id="flyerPhone"
                        placeholder="+237 6xx xx xx xx"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  MODE 2: JOINED ANNOUNCEMENT & QUICK FORM (WHATSAPP + DETAILS)
                  ───────────────────────────────────────────────────────────── */}
              {mode === 'text_form' && (
                <div className="space-y-5">
                  {/* Company / Institute Name (REQUIRED) */}
                  <div className="space-y-2">
                    <Label htmlFor="formCompany" className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Company / Employer / Institute Name *:</span>
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Required</span>
                    </Label>
                    <Input
                      id="formCompany"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      placeholder="e.g. MTN Cameroon, Université de Douala, Boutique Modern, Orange, Cabinet Médical..."
                      className="bg-slate-950 border-emerald-500/50 focus:border-emerald-400 text-white text-xs h-12 rounded-xl placeholder-slate-500"
                      required
                    />
                    <p className="text-[11px] text-slate-400">
                      Specify the name of your enterprise, institution, startup, hospital, or commercial shop.
                    </p>
                  </div>

                  {/* Optional Company Logo or Brand Image */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                        <span>Company Logo / Brand Image (Optional):</span>
                      </span>
                      <span className="text-[10px] text-slate-500">PNG, JPG, WEBP</span>
                    </Label>
                    {logoPreview ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-emerald-500/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-12 h-12 rounded-lg object-contain bg-slate-900 border border-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white font-medium truncate">{logoFile?.name}</p>
                          <p className="text-[10px] text-emerald-400">Attached to posting</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                          className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition-colors text-xs text-slate-400 hover:text-white">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>Upload Logo or Brand Image (Optional)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            setLogoFile(f);
                            if (f) setLogoPreview(URL.createObjectURL(f));
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Position Title (OPTIONAL) */}
                  <div className="space-y-2">
                    <Label htmlFor="formTitle" className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Position / Role Title (Optional):</span>
                      <span className="text-[10px] text-slate-500 font-normal">Auto-generated if left blank</span>
                    </Label>
                    <Input
                      id="formTitle"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder={`e.g. ${postType === 'internship' ? 'Stagiaire Informatique, Assistant Comptable' : 'Commercial Terrain, Caissière, Développeur'}`}
                      className="bg-slate-950 border-slate-800 text-white text-xs h-11 rounded-xl placeholder-slate-600"
                    />
                  </div>

                  {/* Big Paste Announcement / Description Area (OPTIONAL) */}
                  <div className="space-y-2">
                    <Label htmlFor="formText" className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Announcement Message / WhatsApp Forward / Requirements (Optional):</span>
                      <span className="text-[10px] text-slate-500 font-normal">Paste text or type requirements</span>
                    </Label>
                    <Textarea
                      id="formText"
                      rows={6}
                      value={formText}
                      onChange={(e) => setFormText(e.target.value)}
                      placeholder="Paste your WhatsApp broadcast message, job description, or requirements here..."
                      className="bg-slate-950 border-slate-800 text-white text-xs leading-relaxed rounded-xl placeholder-slate-600"
                    />
                  </div>

                  {/* City & WhatsApp Phone (OPTIONAL) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="formCity" className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span>City / Location:</span>
                        <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                      </Label>
                      <select
                        id="formCity"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {CAMEROON_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="formPhone" className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span>WhatsApp / Contact Phone:</span>
                        <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                      </Label>
                      <Input
                        id="formPhone"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+237 6XXXXXXXX"
                        className="bg-slate-950 border-slate-800 text-white text-xs h-11 rounded-xl placeholder-slate-600"
                      />
                    </div>
                  </div>

                  {/* Work Mode & Compensation (OPTIONAL) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="formWorkMode" className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span>Work Mode:</span>
                        <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                      </Label>
                      <select
                        id="formWorkMode"
                        value={formWorkMode}
                        onChange={(e) => setFormWorkMode(e.target.value)}
                        className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3"
                      >
                        {WORK_MODES.map((wm) => (
                          <option key={wm.id} value={wm.id}>{wm.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="formSalary" className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span>{postType === 'internship' ? 'Monthly Stipend (XAF):' : 'Salary (XAF):'}</span>
                        <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                      </Label>
                      <Input
                        id="formSalary"
                        type="number"
                        value={formSalaryMin}
                        onChange={(e) => setFormSalaryMin(e.target.value)}
                        placeholder="e.g. 50000, 150000"
                        className="bg-slate-950 border-slate-800 text-white text-xs h-11 rounded-xl placeholder-slate-600"
                      />
                    </div>
                  </div>

                  {/* Skills (OPTIONAL) */}
                  <div className="space-y-2">
                    <Label htmlFor="formSkills" className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Key Skills or Tags:</span>
                      <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                    </Label>
                    <Input
                      id="formSkills"
                      value={formSkills}
                      onChange={(e) => setFormSkills(e.target.value)}
                      placeholder="e.g. Vente, Comptabilité, Excel, React, Permis B (comma separated)"
                      className="bg-slate-950 border-slate-800 text-white text-xs h-11 rounded-xl placeholder-slate-600"
                    />
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
                      className="bg-slate-950 border-slate-800 text-white text-xs h-11 rounded-xl"
                      required
                    />
                    <p className="text-[11px] text-slate-400">
                      Candidates will be redirected straight to this verified company portal.
                    </p>
                  </div>

                  {/* Opportunity Details (REQUIRED per user instructions) */}
                  <div className="space-y-2">
                    <Label htmlFor="linkDetails" className="text-xs font-bold text-white flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span>Opportunity Details &amp; Requirements *:</span>
                      </span>
                      <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Required</span>
                    </Label>
                    <Textarea
                      id="linkDetails"
                      rows={5}
                      value={linkDetails}
                      onChange={(e) => setLinkDetails(e.target.value)}
                      placeholder="Give clear details about this link: role responsibilities, qualifications, deadline, who can apply, and instructions. Candidates read this before opening the external portal."
                      className="bg-slate-950 border-cyan-500/50 focus:border-cyan-400 text-white text-xs leading-relaxed rounded-xl placeholder-slate-500"
                      required
                    />
                    <p className="text-[11px] text-slate-400">
                      Candidates will read these details on MANTECH Nexus before clicking through to the external portal.
                    </p>
                  </div>

                  {/* Quick Fields for Link: Title & WhatsApp Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <Label htmlFor="linkTitle" className="text-xs font-semibold text-slate-300">
                        Position / Role Title (Optional)
                      </Label>
                      <Input
                        id="linkTitle"
                        placeholder="e.g. Senior Data Analyst, Mécanicien…"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="linkPhone" className="text-xs font-semibold text-slate-300">
                        WhatsApp Contact Phone (Optional)
                      </Label>
                      <Input
                        id="linkPhone"
                        placeholder="+237 6xx xx xx xx"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  EXPIRY DATE SETTING (RULE §5: USER FIXES EXPIRING DATE)
                  ───────────────────────────────────────────────────────────── */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Listing Expiration (Auto-Archive):</span>
                  </Label>
                  <span className="text-[10px] text-slate-400">
                    Visible for +1 week after expiring before auto-removal
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '7', label: '1 Week (Urgent)' },
                    { id: '14', label: '2 Weeks' },
                    { id: '30', label: '30 Days (Standard)' },
                    { id: 'custom', label: 'Custom Date' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setExpiryOption(opt.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        expiryOption === opt.id
                          ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {expiryOption === 'custom' && (
                  <div className="pt-2">
                    <Input
                      type="date"
                      value={customExpiryDate}
                      onChange={(e) => setCustomExpiryDate(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white text-xs h-10 w-full sm:w-60"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                )}
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  GOLD BADGE BOOST TOGGLE (RULE §2)
                  ───────────────────────────────────────────────────────────── */}
              <div className="p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Featured Enterprise Gold Badge (Free Launch Promotion)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pins your posting at the top of listings and in the Homepage Gold Badge showcase.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUrgentBoosted(!isUrgentBoosted)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    isUrgentBoosted ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      isUrgentBoosted ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-cyan-600/25 transition-all"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Publishing Opportunity...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Publish Now · 100% Free
                  </span>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
