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
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Upload,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Zap,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type PostMode = 'flyer' | 'whatsapp' | 'link';
type PostType = 'job' | 'internship';

export function QuickPostClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialType = searchParams.get('type') === 'internship' ? 'internship' : 'job';
  const [postType, setPostType] = useState<PostType>(initialType);
  const [mode, setMode] = useState<PostMode>('flyer');

  // Form State
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('+237 ');
  const [city, setCity] = useState('Douala');
  const [whatsappText, setWhatsappText] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [isUrgentBoosted, setIsUrgentBoosted] = useState(true); // Default true for free launch promo!

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
        if (!flyerFile) {
          toast.error('Please select an image flyer / poster to upload');
          setSubmitting(false);
          return;
        }

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
      }

      const effectiveTitle =
        title.trim() ||
        (mode === 'flyer'
          ? `${postType === 'internship' ? 'Internship' : 'Job'} Opportunity (${city})`
          : 'New Opening');

      const payload = {
        title: effectiveTitle,
        organizationName: employerName.trim() || 'Verified Employer',
        city: city || 'Douala',
        workMode: 'ONSITE',
        type: postType === 'internship' ? 'INTERNSHIP' : 'FULL_TIME',
        description:
          mode === 'flyer'
            ? `Opportunity flyer uploaded by employer. Contact directly via WhatsApp/Phone: ${whatsappPhone}.\n\n[Flyer URL]: ${flyerUrl}`
            : mode === 'whatsapp'
            ? `${whatsappText}\n\nDirect WhatsApp/Phone Contact: ${whatsappPhone}`
            : `Apply directly at official link: ${externalUrl}\n\nContact: ${whatsappPhone}`,
        applicationMethod: mode === 'link' ? 'COMPANY_WEBSITE' : 'EXTERNAL',
        applicationUrl: mode === 'link' ? externalUrl : undefined,
        flyerUrl: flyerUrl || undefined,
        contactPhone: whatsappPhone,
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
                href={publishedData.type === 'internship' ? '/internships' : '/jobs'}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95"
              >
                View on Marketplace <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => {
                  setPublishedData(null);
                  setFlyerFile(null);
                  setFlyerPreview(null);
                  setTitle('');
                  setWhatsappText('');
                  setExternalUrl('');
                }}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white"
              >
                Post Another Opportunity
              </button>
            </div>
          </motion.div>
        ) : (
          /* FORM VIEW */
          <div>
            {/* Header */}
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md mb-3">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                Quick 10-Second Post • No Login Required
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Publish a Job or Internship
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300">
                Choose how you want to post. Upload an image flyer, paste a WhatsApp text, or share
                a link.
              </p>
            </div>

            {/* Step 1: Category Selector (Job vs Internship) */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPostType('job')}
                className={`flex-1 max-w-[200px] flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-bold transition-all border ${
                  postType === 'job'
                    ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 shadow-lg shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Job Vacancy
              </button>
              <button
                type="button"
                onClick={() => setPostType('internship')}
                className={`flex-1 max-w-[200px] flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-bold transition-all border ${
                  postType === 'internship'
                    ? 'border-blue-500 bg-blue-950/60 text-blue-300 shadow-lg shadow-blue-500/20'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                Internship
              </button>
            </div>

            {/* Step 2: Posting Mode Tabs (Flyer vs WhatsApp vs Link) */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl border border-slate-800 bg-slate-900/80 mb-6 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setMode('flyer')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
                  mode === 'flyer'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                <span>Upload Flyer</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('whatsapp')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
                  mode === 'whatsapp'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp Text</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('link')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
                  mode === 'link'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                <span>Paste Link</span>
              </button>
            </div>

            {/* Step 3: Form Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* MODE 1: FLYER UPLOAD (Pure & Simple, NO department / specialization!) */}
                {mode === 'flyer' && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                        Upload Announcement Flyer (Affiche) <span className="text-red-400">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-6 text-center transition-all bg-slate-950/60">
                        <input
                          id="flyer-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFlyerChange(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <label htmlFor="flyer-input" className="cursor-pointer block">
                          {flyerPreview ? (
                            <div className="space-y-3">
                              <div className="relative mx-auto h-48 w-48 rounded-xl overflow-hidden border border-cyan-500/40 shadow-lg">
                                <Image
                                  src={flyerPreview}
                                  alt="Flyer Preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <p className="text-xs font-bold text-cyan-300">
                                Click to change flyer image
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-10 w-10 mx-auto text-cyan-400" />
                              <p className="text-sm font-bold text-white">
                                Click to select recruitment poster / flyer
                              </p>
                              <p className="text-xs text-slate-400">
                                PNG, JPG, or WebP (everything is on the image!)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="title"
                          className="text-xs font-semibold text-slate-300 block mb-1.5"
                        >
                          Role Title (e.g. Cook, Nurse, Waiter, Cashier)
                        </Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Line Cook / Cuisinier"
                          className="bg-slate-950/60 border-slate-700 text-white"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="employerName"
                          className="text-xs font-semibold text-slate-300 block mb-1.5"
                        >
                          Enterprise or Business Name
                        </Label>
                        <Input
                          id="employerName"
                          value={employerName}
                          onChange={(e) => setEmployerName(e.target.value)}
                          placeholder="e.g. Restaurant La Fourchette"
                          className="bg-slate-950/60 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 2: WHATSAPP TEXT */}
                {mode === 'whatsapp' && (
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="whatsappText"
                        className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                      >
                        Paste WhatsApp / Social Media Announcement{' '}
                        <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        id="whatsappText"
                        value={whatsappText}
                        onChange={(e) => setWhatsappText(e.target.value)}
                        placeholder="Paste the forwarded WhatsApp recruitment message here... (e.g. Urgently hiring 2 waiters in Douala Akwa. Salary 80,000 FCFA. Contact 699...)"
                        rows={5}
                        required
                        className="bg-slate-950/60 border-slate-700 text-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="title"
                          className="text-xs font-semibold text-slate-300 block mb-1.5"
                        >
                          Role Title <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Storekeeper / Sales Agent"
                          required
                          className="bg-slate-950/60 border-slate-700 text-white"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="employerName"
                          className="text-xs font-semibold text-slate-300 block mb-1.5"
                        >
                          Enterprise or Employer Name
                        </Label>
                        <Input
                          id="employerName"
                          value={employerName}
                          onChange={(e) => setEmployerName(e.target.value)}
                          placeholder="e.g. Santa Lucia Supermarket"
                          className="bg-slate-950/60 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 3: LINK */}
                {mode === 'link' && (
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="externalUrl"
                        className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5"
                      >
                        Job / Application Link (URL) <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="externalUrl"
                        type="url"
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                        placeholder="https://linkedin.com/jobs/... or https://careers.company.cm"
                        required
                        className="bg-slate-950/60 border-slate-700 text-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="title"
                          className="text-xs font-semibold text-slate-300 block mb-1.5"
                        >
                          Role Title <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Telecommunications Engineer"
                          required
                          className="bg-slate-950/60 border-slate-700 text-white"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="employerName"
                          className="text-xs font-semibold text-slate-300 block mb-1.5"
                        >
                          Enterprise / Organization
                        </Label>
                        <Input
                          id="employerName"
                          value={employerName}
                          onChange={(e) => setEmployerName(e.target.value)}
                          placeholder="e.g. Orange Cameroun"
                          className="bg-slate-950/60 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Shared Contact & City Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <Label
                      htmlFor="whatsappPhone"
                      className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-400" />
                      WhatsApp / Contact Phone <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="whatsappPhone"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      placeholder="+237 6XX XXX XXX"
                      required
                      className="bg-slate-950/60 border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="city"
                      className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5"
                    >
                      <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                      City / Location
                    </Label>
                    <select
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 rounded-xl bg-slate-950/60 border border-slate-700 text-white px-3 text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Douala">Douala (Littoral)</option>
                      <option value="Yaoundé">Yaoundé (Centre)</option>
                      <option value="Buea">Buea (South-West)</option>
                      <option value="Limbe">Limbe (South-West)</option>
                      <option value="Bafoussam">Bafoussam (West)</option>
                      <option value="Bamenda">Bamenda (North-West)</option>
                      <option value="Garoua">Garoua (North)</option>
                      <option value="Maroua">Maroua (Far North)</option>
                      <option value="Ngaoundéré">Ngaoundéré (Adamawa)</option>
                      <option value="Kribi">Kribi (South)</option>
                      <option value="Bertoua">Bertoua (East)</option>
                    </select>
                  </div>
                </div>

                {/* MONETIZATION FEATURE: URGENT BOOST (FREE PROMO) */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">
                            Urgent Top-Listing &amp; WhatsApp Alert Boost
                          </h4>
                          <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-extrabold">
                            PROMO 0 FCFA
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Highlights your opportunity in gold and broadcasts to candidate WhatsApp
                          groups. (Regular: 3,500 FCFA).
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isUrgentBoosted}
                      onChange={(e) => setIsUrgentBoosted(e.target.checked)}
                      className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 font-bold text-sm text-white shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-opacity"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Publishing Instantly...
                    </span>
                  ) : (
                    <span>
                      Publish {postType === 'internship' ? 'Internship' : 'Job'} Free (1 Click)
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

