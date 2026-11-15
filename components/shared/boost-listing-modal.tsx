'use client';

import { useState } from 'react';
import {
  Zap,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  ArrowRight,
  Loader2,
  Check,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface BoostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemType: 'job' | 'internship';
  itemTitle: string;
  onSuccess?: () => void;
}

const BOOST_PLANS = [
  {
    days: 7,
    name: '7-Day Fast Track',
    badge: 'Popular',
    standardPrice: 3500,
    features: ['Top 3 priority ranking', 'Urgent highlight badge', '3x more candidate views'],
  },
  {
    days: 14,
    name: '14-Day Full Search',
    badge: 'Best Value',
    standardPrice: 6500,
    features: ['Top priority placement', 'Urgent highlight badge', 'Included in weekly digest'],
  },
  {
    days: 30,
    name: '30-Day Sticky Spotlight',
    badge: 'Maximum Reach',
    standardPrice: 12000,
    features: ['Month-long pinned placement', 'Urgent badge & social blast', 'Candidate direct notifications'],
  },
];

export function BoostListingModal({
  isOpen,
  onClose,
  itemId,
  itemType,
  itemTitle,
  onSuccess,
}: BoostListingModalProps) {
  const [selectedDays, setSelectedDays] = useState(7);
  const [provider, setProvider] = useState<'MOMO' | 'ORANGE_MONEY'>('MOMO');
  const [momoNumber, setMomoNumber] = useState('671234567');
  const [isPromoMode, setIsPromoMode] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successDone, setSuccessDone] = useState(false);

  const selectedPlan = BOOST_PLANS.find((p) => p.days === selectedDays) || BOOST_PLANS[0];
  const payableAmount = isPromoMode ? 0 : selectedPlan.standardPrice;

  const handleActivateBoost = async () => {
    setSubmitting(true);
    try {
      const endpoint =
        itemType === 'job'
          ? `/api/jobs/${itemId}/boost`
          : `/api/opportunities/${itemId}/boost`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days: selectedDays,
          paymentMethod: isPromoMode ? 'PROMO' : provider,
          payerPhone: momoNumber,
          note: `Boosted via MANTECH Web Portal for ${selectedDays} days`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessDone(true);
        toast.success(`🎉 ${itemTitle} is now boosted at the top of listings!`);
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.error || 'Failed to activate placement boost.');
      }
    } catch (err) {
      toast.error('Network error while activating boost.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccessDone(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-slate-950 border-slate-800 text-white p-6 rounded-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-500/30 px-3 py-0.5 rounded-full">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              Listing Placement Boost
            </span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Launch Promo Active
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-white">
            Boost & Pin This Listing to Top
          </DialogTitle>
          <p className="text-xs text-slate-400 line-clamp-1">
            Applying boost to: <strong className="text-slate-200">{itemTitle}</strong>
          </p>
        </DialogHeader>

        {successDone ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Placement Boost Activated!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your posting is now highlighted with a priority badge and pinned at the very top of{' '}
              {itemType === 'job' ? 'Jobs' : 'Internships'} search results across Cameroon.
            </p>
            <Button
              onClick={handleClose}
              className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs px-6 py-2.5 rounded-xl"
            >
              Done & View Listing
            </Button>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Plan selection */}
            <div className="grid grid-cols-3 gap-2.5">
              {BOOST_PLANS.map((plan) => (
                <button
                  key={plan.days}
                  type="button"
                  onClick={() => setSelectedDays(plan.days)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedDays === plan.days
                      ? 'border-cyan-500 bg-cyan-950/40 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {plan.days} Days
                    </span>
                    <span className="text-[9px] font-semibold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded">
                      {plan.badge}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white">
                    {isPromoMode ? '0 FCFA' : `${plan.standardPrice.toLocaleString()} F`}
                  </div>
                </button>
              ))}
            </div>

            {/* Launch promo toggle */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Free Launch Promo (0 FCFA)
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Test-drive priority boost for free during our national rollout.
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPromoMode}
                onChange={(e) => setIsPromoMode(e.target.checked)}
                className="w-5 h-5 rounded border-emerald-500 text-emerald-500 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Payment provider options if not promo */}
            {!isPromoMode && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300">Select Mobile Money Provider:</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProvider('MOMO')}
                    className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-bold transition-all ${
                      provider === 'MOMO'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-[#FFCC00]" />
                    <span>MTN Mobile Money</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvider('ORANGE_MONEY')}
                    className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-bold transition-all ${
                      provider === 'ORANGE_MONEY'
                        ? 'border-[#FF6600] bg-[#FF6600]/10 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-[#FF6600]" />
                    <span>Orange Money</span>
                  </button>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Mobile Money Phone Number
                  </label>
                  <Input
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="e.g. 671234567"
                    className="bg-slate-900 border-slate-800 text-white text-xs h-10"
                  />
                </div>
              </div>
            )}

            {/* Summary bullet points */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              {selectedPlan.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Action button */}
            <div className="pt-3">
              <Button
                onClick={handleActivateBoost}
                disabled={submitting}
                className="w-full h-11 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activating Top Placement...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>
                      {isPromoMode
                        ? `Activate ${selectedDays}-Day Boost Free (0 FCFA)`
                        : `Pay ${payableAmount.toLocaleString()} FCFA & Boost`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
