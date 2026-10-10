'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap, MapPin, Globe, BadgeCheck, Loader2, ChevronLeft,
  BookOpen, Users, Mail, Phone, ExternalLink, Building2, ArrowRight,
} from 'lucide-react';
import type { University } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { regionNameOf } from "@/lib/catalog-shape";

export default function UniversityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetch_() {
      try {
        const res = await fetch(`/api/universities/${slug}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        setUniversity(data.university);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !university) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
        <GraduationCap className="w-16 h-16 text-slate-600" />
        <h1 className="text-2xl font-bold">Institution Not Found</h1>
        <p className="text-slate-400">This university profile doesn&apos;t exist or isn&apos;t published yet.</p>
        <Link href="/universities">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Universities
          </Button>
        </Link>
      </div>
    );
  }

  const isVerified = university.verification_status === 'verified' || university.verificationStatus === 'verified';

  // Dual-mode feature tags
  const modes: { icon: typeof BookOpen; label: string; desc: string }[] = [
    {
      icon: BookOpen,
      label: 'Student Support (Mode A)',
      desc: 'This institution monitors placements and partner companies to help students find internships.',
    },
    {
      icon: Building2,
      label: 'Institutional Recruiter (Mode B)',
      desc: 'This institution also recruits interns to work within its departments and administrative units.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2334d399' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/universities" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> All Universities
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row gap-8 items-start"
          >
            {/* Icon */}
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center shrink-0">
              <GraduationCap className="w-12 h-12 lg:w-16 lg:h-16 text-emerald-600" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="font-heading text-3xl lg:text-4xl font-extrabold text-white">
                  {university.name}
                </h1>
                {university.short_name && (
                  <span className="text-base text-emerald-400 font-mono font-semibold">({university.short_name})</span>
                )}
                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <BadgeCheck className="w-3.5 h-3.5" /> Accredited Partner
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-5">
                {(university as any).type && (
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> {(university as any).type}
                  </span>
                )}
                {(university.city || regionNameOf(university as unknown as Record<string, unknown>)) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {university.city}{regionNameOf(university as unknown as Record<string, unknown>) ? `, ${regionNameOf(university as unknown as Record<string, unknown>)}` : ''}
                  </span>
                )}
                {university.website && (
                  <a href={university.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors">
                    <Globe className="w-4 h-4" /> {university.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>

              {university.description && (
                <p className="text-slate-300 leading-relaxed max-w-3xl">{university.description}</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: Dual Mode & Mission */}
          <div className="lg:col-span-2 space-y-8">

            {/* Dual-Mode cards */}
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-5">
                Role on MANTECH Nexus
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modes.map((mode, i) => (
                  <motion.div
                    key={mode.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                      <mode.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{mode.label}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{mode.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* About section */}
            {university.description && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-heading text-base font-bold text-slate-900 mb-3">About This Institution</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{university.description}</p>
              </div>
            )}

            {/* Internship opportunities CTA */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-7 text-white">
              <h3 className="font-heading text-lg font-bold mb-2">Browse Internships for {university.short_name ?? university.name} Students</h3>
              <p className="text-sm text-emerald-100 mb-5 leading-relaxed">
                Discover verified internship opportunities at Cameroon&apos;s top tech companies, banks, and public institutions — curated for your discipline.
              </p>
              <Link href="/internships">
                <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl gap-1.5">
                  Explore Opportunities <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">

            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Internship Office Contact</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {(university.contact_email || university.email) && (
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <a href={`mailto:${university.contact_email || university.email}`}
                      className="hover:text-emerald-600 transition-colors break-all">
                      {university.contact_email || university.email}
                    </a>
                  </li>
                )}
                {university.contact_phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{university.contact_phone}</span>
                  </li>
                )}
                {university.city && (
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{university.city}, {university.region}</span>
                  </li>
                )}
                {university.website && (
                  <li className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={university.website} target="_blank" rel="noopener noreferrer"
                      className="hover:text-emerald-600 transition-colors break-all">
                      Official Website
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Students CTA */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
              <Users className="w-9 h-9 mx-auto mb-3 text-emerald-500" />
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Student at {university.short_name ?? 'this institution'}?</h3>
              <p className="text-xs text-slate-500 mb-4">Register your Intern Passport and get discovered by top employers.</p>
              <Link href="/sign-up?role=intern">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl w-full gap-1.5">
                  Create Intern Passport <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <Link href="/universities" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
              <ChevronLeft className="w-4 h-4" /> View All Universities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
