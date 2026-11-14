'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  PhoneCall,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Send,
  Building2,
  School,
  X,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface RevenueStream {
  id: string;
  title: string;
  category: 'Employers' | 'Candidates' | 'Universities' | 'Advertisers';
  standardPriceXAF: number;
  promoPriceXAF: number;
  badge: string;
  description: string;
  benefits: string[];
}

const REVENUE_STREAMS: RevenueStream[] = [
  {
    id: 'stream-1',
    title: 'Urgent & Top-Listing Placement Boost',
    category: 'Employers',
    standardPriceXAF: 3500,
    promoPriceXAF: 0,
    badge: 'High Conversion',
    description:
      'Pin your job or internship opening to the top of the homepage and search catalog with a prominent gold highlight badge.',
    benefits: [
      'Top-of-page sticky placement for 30 days',
      'Gold "Urgent Recruitment" highlight frame',
      '3.8x faster candidate application rate',
    ],
  },
  {
    id: 'stream-2',
    title: 'Priority WhatsApp Alert Broadcast Blast',
    category: 'Employers',
    standardPriceXAF: 7500,
    promoPriceXAF: 0,
    badge: 'Fast Response',
    description:
      'Direct push dispatch of your job or internship flyer to over 15,000+ active student and graduate WhatsApp subscribers across Cameroon.',
    benefits: [
      'Immediate push to regional WhatsApp broadcast lists',
      'Direct WhatsApp chat redirect link for candidates',
      'Targeted by city (Douala, Yaoundé, Buea, etc.)',
    ],
  },
  {
    id: 'stream-3',
    title: 'Talent Directory Direct Contact Unlock',
    category: 'Employers',
    standardPriceXAF: 25000,
    promoPriceXAF: 0,
    badge: 'Recruiter Favorite',
    description:
      'Unlimited instant access to unmasked candidate phone numbers, direct WhatsApp links, and verified PDF CV downloads.',
    benefits: [
      'Direct phone & WhatsApp numbers revealed',
      'Downloadable original candidate PDF CVs',
      'Search across 60 professional fields',
    ],
  },
  {
    id: 'stream-4',
    title: 'Candidate "Passport Pro" Verification Badge',
    category: 'Candidates',
    standardPriceXAF: 1500,
    promoPriceXAF: 0,
    badge: 'Job Seeker Boost',
    description:
      'Gold verification checkmark on the Intern Passport proving academic authenticity, plus top placement in company search results.',
    benefits: [
      'Verified Talent trust badge on profile',
      'Priority rank in employer candidate searches',
      'Automated standardized PDF resume generator',
    ],
  },
  {
    id: 'stream-5',
    title: 'Corporate Brand Spotlight Header Banner',
    category: 'Advertisers',
    standardPriceXAF: 45000,
    promoPriceXAF: 0,
    badge: 'Employer Branding',
    description:
      'Custom visual employer spotlight banner across the MANTECH marketplace header and email newsletters.',
    benefits: [
      'Prominent billboard banner across platform',
      'Direct click-through to company career hub',
      'Over 85,000 monthly impressions in Cameroon',
    ],
  },
  {
    id: 'stream-6',
    title: 'University Dual-Mode Oversight SaaS',
    category: 'Universities',
    standardPriceXAF: 450000,
    promoPriceXAF: 0,
    badge: 'Institutional Partner',
    description:
      'Digital student internship supervision dashboard with tripartite conventions, supervisor evaluations, and MINESUP reports.',
    benefits: [
      'Digital tripartite convention workflow',
      'Student logbook tracking & weekly supervisor reviews',
      'Institutional accreditation data export',
    ],
  },
];

export function PricingFeaturesSection() {
  const [selectedStream, setSelectedStream] = useState<RevenueStream | null>(null);
  const [momoPhone, setMomoPhone] = useState('67');
  const [momoProvider, setMomoProvider] = useState<'MTN' | 'ORANGE'>('MTN');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (momoPhone.length < 9) {
      toast.error('Please enter a valid 9-digit Cameroon phone number (e.g. 67XXXXXXX)');
      return;
    }

    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      toast.success(
        `🎉 ${selectedStream?.title} Unlocked Successfully at 0 FCFA (Promo Launch Trial)!`
      );
    }, 1800);
  };

  return (
    <div className="mt-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md mb-3">
          <Zap className="h-3.5 w-3.5 text-cyan-400" />
          Monetization &amp; Future Growth Architecture
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          6 Future Revenue Streams for Cameroon
        </h2>
        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          Currently unlocked at <strong className="text-emerald-400">0 FCFA Free Promo</strong> for
          our national launch. Test how employers, candidates, and universities can activate premium
          features via MTN MoMo and Orange Money.
        </p>
      </div>

      {/* Grid of 6 Revenue Streams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REVENUE_STREAMS.map((stream) => (
          <div
            key={stream.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl transition-all duration-200 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                  {stream.category}
                </span>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300">
                  {stream.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                {stream.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{stream.description}</p>

              {/* Price Display */}
              <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through">
                    {stream.standardPriceXAF.toLocaleString()} FCFA
                  </span>
                  <div className="text-lg font-black text-emerald-400">0 FCFA</div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-2 py-1 rounded-lg">
                  Free Launch Promo
                </span>
              </div>

              {/* Benefits */}
              <ul className="space-y-2 mb-6">
                {stream.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={() => {
                setSelectedStream(stream);
                setPaymentSuccess(false);
              }}
              className="w-full h-10 rounded-xl bg-slate-800 hover:bg-cyan-600 text-xs font-bold text-white border border-slate-700/80 hover:border-cyan-500 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Test MoMo Activation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {/* MOBILE MONEY MODAL SIMULATION */}
      <AnimatePresence>
        {selectedStream && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-cyan-500/30 bg-slate-900/98 p-6 text-white shadow-2xl backdrop-blur-2xl"
            >
              <button
                onClick={() => setSelectedStream(null)}
                className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              {paymentSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Feature Activated (0 FCFA)!</h3>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    <strong>{selectedStream.title}</strong> is now live on your account under the
                    National Launch Promotion.
                  </p>
                  <Button
                    onClick={() => setSelectedStream(null)}
                    className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
                  >
                    Close Simulation
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSimulatePayment} className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Cameroon Mobile Money Test</h3>
                      <p className="text-[11px] text-cyan-400 font-semibold">
                        {selectedStream.title}
                      </p>
                    </div>
                  </div>

                  {/* Pricing summary */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Launch Price:</span>
                    <span className="font-extrabold text-emerald-400 text-sm">
                      0 FCFA (Normally {selectedStream.standardPriceXAF.toLocaleString()} FCFA)
                    </span>
                  </div>

                  {/* MoMo Provider selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Select Mobile Money Operator:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMomoProvider('MTN')}
                        className={`rounded-xl p-2.5 text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                          momoProvider === 'MTN'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-slate-950/50 text-slate-400 border-slate-800'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        MTN MoMo (*126#)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMomoProvider('ORANGE')}
                        className={`rounded-xl p-2.5 text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                          momoProvider === 'ORANGE'
                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                            : 'bg-slate-950/50 text-slate-400 border-slate-800'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                        Orange Money (#150#)
                      </button>
                    </div>
                  </div>

                  {/* Phone input */}
                  <div>
                    <label
                      htmlFor="momoPhone"
                      className="text-xs font-semibold text-slate-300 block mb-1.5"
                    >
                      Phone Number (Cameroon +237):
                    </label>
                    <Input
                      id="momoPhone"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      placeholder="67X XXX XXX"
                      maxLength={9}
                      className="bg-slate-950 border-slate-700 text-white font-mono text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={processingPayment}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20"
                  >
                    {processingPayment ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Simulating USSD Push to Phone...
                      </span>
                    ) : (
                      <span>Confirm 0 FCFA Activation</span>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

