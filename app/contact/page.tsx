"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { APP_CONFIG } from "@/lib/config";
import { waSupportLink, waDisplayPhone } from "@/lib/whatsapp";
import {
  FloatingBadge,
  AnimatedCard,
} from "@/components/shared/section-animations";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const EMAIL = APP_CONFIG.support.email;

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
      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!res.ok) {
        throw new Error(data?.error || 'We could not send your message.');
      }
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'We could not send your message. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* ── HERO WITH BLUR REVEAL ── */}
      <section className="surface-page relative overflow-hidden border-b border-border/70 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="container-mantech relative px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloatingBadge className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Support Concierge & Inquiries
              </span>
            </FloatingBadge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Contact MANTECH Nexus
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              We&apos;re here to assist candidate interns, host organizations, and university coordinators across Cameroon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SPLIT INTERACTIVE SECTION ── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
            {/* Left Column: Direct channels (Slide Left) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                Get in touch with our team
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
                Connect directly through our official channels. For the fastest response, reach out on WhatsApp concierge.
              </p>

              <div className="mt-8 space-y-4">
                {/* PRIMARY channel — WhatsApp */}
                <AnimatedCard>
                  <a
                    href={waSupportLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center gap-4 rounded-3xl border-2 border-[#25D366] bg-[#25D366]/5 p-6 shadow-sm hover:shadow-xl transition-all block group"
                  >
                    <span className="absolute -top-3 right-6 rounded-full bg-[#128C7E] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                      Priority · Instant Chat
                    </span>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#128C7E] group-hover:scale-110 transition-transform">
                      <WhatsAppIcon className="h-7 w-7" title="WhatsApp" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-foreground">WhatsApp Concierge</div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {waDisplayPhone()} — Direct assistance 8am–6pm (WAT)
                      </div>
                    </div>
                  </a>
                </AnimatedCard>

                {/* SECONDARY channel — Email */}
                <AnimatedCard>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all group"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                      <Mail className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-foreground">
                        Official Inquiries Email
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">{EMAIL}</div>
                    </div>
                  </a>
                </AnimatedCard>

                {/* Office & Regional Network */}
                <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-foreground">
                      National Headquarters
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Douala (Littoral) & Yaoundé (Centre) — Serving all 10 regions of Cameroon
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Contact Form (Slide Right) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              {submitted ? (
                <div className="flex h-full min-h-[460px] flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50/40 p-12 text-center shadow-md">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-900">
                    Message Dispatched Successfully!
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-sm leading-relaxed">
                    Thank you for reaching out. A MANTECH team member will review your request and reply shortly.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 rounded-xl border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="relative space-y-5 rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 shadow-lg"
                >
                  {/* Honeypot — hidden from humans */}
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

                  <div>
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. Jean-Paul Mbarga"
                      className="mt-1.5 h-11 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="e.g. j.mbarga@example.cm"
                      className="mt-1.5 h-11 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      required
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      placeholder="What is this regarding?"
                      className="mt-1.5 h-11 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Please include details about your university, company, or internship inquiry..."
                      rows={5}
                      className="mt-1.5 rounded-xl resize-none"
                    />
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-mantech hover:opacity-95 text-white font-semibold rounded-xl shadow-md transition-all"
                  >
                    {loading ? "Transmitting message..." : "Send Message"}
                    {!loading && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
