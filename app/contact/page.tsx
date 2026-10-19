'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Building2,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';
import { APP_CONFIG } from '@/lib/config';
import { waSupportLink, waDisplayPhone } from '@/lib/whatsapp';
import { FloatingBadge } from '@/components/shared/section-animations';

type InquiryPreset = {
  id: string;
  label: string;
  subject: string;
  waPrompt: string;
};

const INQUIRY_PRESETS: InquiryPreset[] = [
  {
    id: 'intern',
    label: 'Intern Candidate Help',
    subject: 'Intern Passport & Placement Inquiry',
    waPrompt: 'Hello MANTECH, I am an internship candidate seeking assistance with my Intern Passport and applications.',
  },
  {
    id: 'employer',
    label: 'Host Enterprise & Hiring',
    subject: 'Corporate Internship Hosting & Candidate Access',
    waPrompt: 'Hello MANTECH, I represent a company interested in publishing internship opportunities and hiring verified candidates.',
  },
  {
    id: 'university',
    label: 'University Placement Office',
    subject: 'Academic Convention & Institution Dashboard',
    waPrompt: 'Hello MANTECH, I am reaching out from a university placement office regarding student internship conventions.',
  },
  {
    id: 'support',
    label: 'Technical & Audit Support',
    subject: 'Platform Technical Assistance',
    waPrompt: 'Hello MANTECH, I need technical support with my account access or platform telemetry.',
  },
];

const FAQS = [
  {
    q: 'How fast will I receive a response from MANTECH?',
    a: 'For fastest resolution, our WhatsApp Concierge typically replies within 15 minutes during working hours (Monday to Friday, 08:00 – 18:00 WAT). Contact form and email inquiries receive a formal written reply within 4 business hours.',
  },
  {
    q: 'Is MANTECH Nexus completely free for students and interns?',
    a: 'Yes. Profile creation, Intern Passport generation, verified readiness scoring, and applying to all published internship opportunities are 100% free for students across Cameroon. We strictly prohibit any fees charged to candidates.',
  },
  {
    q: 'How do Cameroonian employers get verified to hire interns?',
    a: 'Enterprises and institutions submit their registration number, company headquarters address, and authorized recruiter credentials. Our compliance team verifies corporate credentials within 24 hours before candidates can be searched or shortlisted.',
  },
  {
    q: 'Do you cover regions outside Douala and Yaoundé?',
    a: 'Yes. MANTECH serves all 10 administrative regions of Cameroon (Centre, Littoral, West, South-West, North-West, Adamawa, Far-North, North, East, and South) through active academic and corporate partnerships in Buea, Bamenda, Dschang, Ngaoundéré, and Maroua.',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('intern');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: INQUIRY_PRESETS[0].subject,
    message: '',
  });

  const handlePresetSelect = (preset: InquiryPreset) => {
    setSelectedPreset(preset.id);
    setForm((prev) => ({
      ...prev,
      subject: preset.subject,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website: honeypot }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        throw new Error(data?.error || 'We could not send your message.');
      }
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'We could not send your message. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const currentPreset = INQUIRY_PRESETS.find((p) => p.id === selectedPreset) || INQUIRY_PRESETS[0];

  return (
    <div className="overflow-hidden bg-[#070d18] min-h-screen text-slate-100">
      {/* ── HERO BANNER (DARK NEXUS) ── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-br from-[#020d14] via-[#041826] to-[#031220] py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: "url('/images/contact_hero_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />
        {/* Deep overlay to keep text crisp white — keeps contrast WCAG AA */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020d14]/85 via-[#041826]/75 to-[#031220]/80" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FloatingBadge className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Support Concierge & Regional Network
              </span>
            </FloatingBadge>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-2">
              Connect With{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                MANTECH Nexus
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              Direct assistance for student candidates, enterprise recruiters, and university placement coordinators across Cameroon&apos;s 10 regions.
            </p>

            {/* SLA Transparency Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>WhatsApp: &lt; 15 Min Response</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-blue-300">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Email Inquiries: &lt; 4 Hours</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-purple-300">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>100% Audited Dispatch</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SPLIT INTERACTIVE SECTION (DARK NEXUS) ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-80 h-80 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            {/* ── LEFT COLUMN: DIRECT CHANNELS (5 COLS) ── */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  Direct Communication Channels
                </h2>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Select your inquiry type to open an instant pre-filled WhatsApp concierge chat, or transmit a secure message directly to our national desk.
                </p>
              </div>

              {/* Inquiry Presets Pills */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Select What You Need:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {INQUIRY_PRESETS.map((preset) => {
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        className={`rounded-xl p-3 text-left transition-all border text-xs font-semibold ${
                          isSelected
                            ? 'border-cyan-400/80 bg-cyan-950/40 text-cyan-200 shadow-md shadow-cyan-500/10'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PRIMARY CHANNEL: WHATSAPP CONCIERGE */}
              <a
                href={waSupportLink(currentPreset.waPrompt)}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block group overflow-hidden rounded-3xl border-2 border-emerald-500/60 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 p-6 shadow-xl transition-all duration-300 hover:border-emerald-400 hover:shadow-emerald-500/20 hover:-translate-y-0.5"
              >
                <div className="absolute top-0 right-0 rounded-bl-2xl bg-emerald-500 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Instant Chat · Priority
                </div>

                <div className="flex items-start gap-4 mt-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                    <WhatsAppIcon className="h-7 w-7 text-emerald-400" title="WhatsApp" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      WhatsApp Concierge
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 font-mono">
                      {waDisplayPhone()}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Instant response for {currentPreset.label}. Click to launch pre-formatted chat on your phone or desktop.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                      Open WhatsApp Chat <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>



              {/* HEADQUARTERS & REGIONAL OFFICES */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                <div className="flex items-center gap-3 text-cyan-400">
                  <Building2 className="w-5 h-5" />
                  <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                    Physical Presence in Cameroon
                  </h4>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="border-l-2 border-cyan-400/60 pl-3">
                    <strong className="text-white block">Douala HQ (Littoral)</strong>
                    <span className="text-slate-400">
                      Boulevard de la Liberté, Akwa / Bonanjo Financial Hub · Central Operations
                    </span>
                  </div>
                  <div className="border-l-2 border-blue-400/60 pl-3">
                    <strong className="text-white block">Yaoundé Hub (Centre)</strong>
                    <span className="text-slate-400">
                      Carrefour Bastos / ENSPY Innovation Corridor · Academic & MINESUP Coordination
                    </span>
                  </div>
                  <div className="border-l-2 border-emerald-400/60 pl-3">
                    <strong className="text-white block">National Coverage (10 Regions)</strong>
                    <span className="text-slate-400">
                      Active desks in Buea, Bamenda, Dschang, Ngaoundéré, and Maroua.
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mon – Fri: 08:00 – 18:00 WAT | Sat: 09:00 – 13:00 WAT</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: INTERACTIVE FORM (7 COLS) ── */}
            <div className="lg:col-span-7">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-900 p-8 sm:p-12 text-center shadow-2xl"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 shadow-lg">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white">
                    Message Dispatched Successfully!
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 max-w-md leading-relaxed">
                    Thank you, <strong className="text-white">{form.name || 'valued partner'}</strong>. Your inquiry has been logged into our support ticketing queue. A MANTECH team specialist will review your request and reply to <strong className="text-cyan-300">{form.email}</strong> shortly.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      className="rounded-xl border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({
                          name: '',
                          email: '',
                          subject: INQUIRY_PRESETS[0].subject,
                          message: '',
                        });
                      }}
                    >
                      Send Another Message
                    </Button>
                    <a
                      href={waSupportLink(`Following up on my message from ${form.name}: ${form.subject}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md"
                    >
                      <WhatsAppIcon className="w-4 h-4" /> Priority WhatsApp Follow-up
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-7 sm:p-10 shadow-2xl backdrop-blur-xl"
                >
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Official Contact Portal
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-white mt-1">
                      Send a Secure Message
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      All messages are audited and routed directly to the appropriate regional supervisor.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Honeypot hidden field */}
                    <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input
                        id="website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Vanessa Kamga"
                          className="mt-1.5 h-11 rounded-xl border-slate-700 bg-slate-950/60 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="e.g. v.kamga@ubuea.cm"
                          className="mt-1.5 h-11 rounded-xl border-slate-700 bg-slate-950/60 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Subject Line *
                      </Label>
                      <Input
                        id="subject"
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="What can we assist you with?"
                        className="mt-1.5 h-11 rounded-xl border-slate-700 bg-slate-950/60 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Message Details *
                      </Label>
                      <Textarea
                        id="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Please include relevant information such as your university, institution, company name, or internship passport number..."
                        className="mt-1.5 rounded-xl border-slate-700 bg-slate-950/60 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none text-sm"
                      />
                    </div>

                    {errorMessage && (
                      <div
                        role="alert"
                        className="flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-950/30 p-3.5 text-xs text-red-300"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm"
                    >
                      {loading ? 'Transmitting to Dispatch Queue...' : 'Transmit Message to MANTECH'}
                      {!loading && <Send className="ml-2 h-4 w-4" />}
                    </Button>

                    <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 mt-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Encrypted transmission. Your information is never sold or shared.</span>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE FAQ SECTION (DARK NEXUS) ── */}
      <section className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-[#070d18] to-[#0a1428] relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Immediate Answers
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Find instant clarification on verification timelines, university conventions, and recruiter access.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors hover:border-slate-700"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-cyan-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-cyan-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
