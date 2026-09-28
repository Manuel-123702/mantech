'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — in production this would send via EmailJS or edge function
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="overflow-hidden">
      <section className="relative pt-8 pb-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">Contact MANTECH</h1>
            <p className="mt-4 text-lg text-white/80">We&apos;re here to help with any questions about internships, partnerships, or services.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="font-heading text-2xl font-bold text-foreground">Get in touch</h2>
              <p className="mt-3 text-muted-foreground">Use the form or reach us directly through any of these channels.</p>

              <div className="mt-8 space-y-4">
                <a href="https://wa.me/237650921917" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600"><MessageCircle className="h-6 w-6" /></div>
                  <div><div className="font-semibold text-foreground">WhatsApp / Phone</div><div className="text-sm text-muted-foreground">+237 650 921 917</div></div>
                </a>
                <a href="mailto:tessohmanuel@gmail.com" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Mail className="h-6 w-6" /></div>
                  <div><div className="font-semibold text-foreground">Email</div><div className="text-sm text-muted-foreground">tessohmanuel@gmail.com</div></div>
                </a>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"><MapPin className="h-6 w-6" /></div>
                  <div><div className="font-semibold text-foreground">Location</div><div className="text-sm text-muted-foreground">Cameroon — serving all 10 regions</div></div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-gradient-mantech-light p-12 text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                  <h3 className="mt-4 font-heading text-xl font-bold">Message sent!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">We&apos;ll get back to you as soon as possible.</p>
                  <Button variant="outline" className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>Send another message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div><Label htmlFor="name">Name</Label><Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /></div>
                  <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" /></div>
                  <div><Label htmlFor="subject">Subject</Label><Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?" /></div>
                  <div><Label htmlFor="message">Message</Label><Textarea id="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." rows={5} /></div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-mantech">{loading ? 'Sending...' : 'Send message'}{!loading && <Send className="ml-2 h-4 w-4" />}</Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
