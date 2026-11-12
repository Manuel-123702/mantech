"use client";
import { Trans, useLingui } from '@lingui/react/macro';


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  TESTIMONIAL_ROLES,
  TESTIMONIAL_REGIONS,
  TESTIMONIAL_FOCUSES,
} from "@/lib/testimonial-fields";

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TestimonialSubmissionModal({
  isOpen,
  onClose,
  onSuccess,
}: TestimonialModalProps) {
  const { t } = useLingui();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Intern",
    company: "",
    region: "Centre",
    focus: "Discovery",
    rating: 5,
    message: "",
    details: "",
    photoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit testimonial.");
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          name: "",
          email: "",
          role: "Intern",
          company: "",
          region: "Centre",
          focus: "Discovery",
          rating: 5,
          message: "",
          details: "",
          photoUrl: "",
        });
      }, 2500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 text-white shadow-2xl shadow-blue-950/60"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-xs font-bold text-blue-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span><Trans comment="testimonial-submission-modal span visible text">Community Voice</Trans></span>
            </div>
            <h3 className="text-2xl font-bold font-heading text-white">
              <Trans comment="testimonial-submission-modal h3 visible text">Share Your Experience with MANTECH Nexus
            </Trans></h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              <Trans comment="testimonial-submission-modal p visible text">Your feedback inspires future candidates, university students, and recruiting companies across Cameroon.
            </Trans></p>
          </div>

          {success ? (
            <div className="p-8 text-center space-y-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white"><Trans comment="testimonial-submission-modal h4 visible text">Experience Submitted!</Trans></h4>
              <p className="text-xs sm:text-sm text-emerald-200">
                <Trans comment="testimonial-submission-modal p visible text">Thank you for contributing! Your feedback has been received and will appear on the website once approved by our moderation team.
              </Trans></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 flex items-start gap-2 text-xs text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    <Trans comment="testimonial-submission-modal label visible text">Your Full Name *
                  </Trans></label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t({ message: "e.g. Boris Tientcheu", comment: "testimonial-submission-modal component placeholder attribute" })}
                    className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    <Trans comment="testimonial-submission-modal label visible text">Email Address * (never published)
                  </Trans></label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t({ message: "e.g. boris@gmail.com", comment: "testimonial-submission-modal component placeholder attribute" })}
                    className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    <Trans comment="testimonial-submission-modal label visible text">Your Role *
                  </Trans></label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-slate-950/80 border border-slate-800 text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {TESTIMONIAL_ROLES.map((r) => (
                      <option key={r} value={r} className="bg-slate-900 text-white">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    <Trans comment="testimonial-submission-modal label visible text">Company or University *
                  </Trans></label>
                  <Input
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t({ message: "e.g. UY1 / MTN / Orange", comment: "testimonial-submission-modal component placeholder attribute" })}
                    className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    <Trans comment="testimonial-submission-modal label visible text">Region *
                  </Trans></label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-slate-950/80 border border-slate-800 text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {TESTIMONIAL_REGIONS.map((reg) => (
                      <option key={reg} value={reg} className="bg-slate-900 text-white">
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    <Trans comment="testimonial-submission-modal label visible text">What did you use MANTECH for? *
                  </Trans></label>
                  <select
                    value={formData.focus}
                    onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-slate-950/80 border border-slate-800 text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {TESTIMONIAL_FOCUSES.map((f) => (
                      <option key={f} value={f} className="bg-slate-900 text-white">
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    <Trans comment="testimonial-submission-modal label visible text">Rating *
                  </Trans></label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-slate-950/80 border border-slate-800">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= formData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 ml-2 font-mono">
                      {formData.rating} <Trans comment="testimonial-submission-modal span visible text">of 5 Stars
                    </Trans></span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  <Trans comment="testimonial-submission-modal label visible text">Short Quote / Headline * (max 200 chars)
                </Trans></label>
                <Input
                  required
                  maxLength={200}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t({ message: "e.g. Connected our engineering cohort to 15 top host companies in 2 weeks.", comment: "testimonial-submission-modal component placeholder attribute" })}
                  className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  <Trans comment="testimonial-submission-modal label visible text">Tell us the full story *
                </Trans></label>
                <Textarea
                  required
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder={t({ message: "Describe how MANTECH Nexus helped you find an internship, recruit talent, or manage university placements...", comment: "testimonial-submission-modal component placeholder attribute" })}
                  className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <Trans comment="testimonial-submission-modal Button visible text">Cancel
                </Trans></Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2 shadow-lg shadow-blue-600/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Submitting..." : "Submit Experience"}</span>
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
