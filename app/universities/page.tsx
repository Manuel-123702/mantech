'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  MapPin,
  Globe,
  Loader2,
  Inbox,
  BadgeCheck,
  School,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { University } from '@/lib/types';
import { regionNameOf } from '@/lib/catalog-shape';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  MotionSection,
  MotionItem,
  AnimatedCard,
  FloatingBadge,
} from '@/components/shared/section-animations';

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUniversities() {
      try {
        setLoading(true);
        const res = await fetch('/api/universities');
        if (res.ok) {
          const data = await res.json();
          setUniversities(data.universities || []);
        }
      } catch (err) {
        console.error('Failed fetching universities:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUniversities();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ───── HERO SECTION WITH BLUR-REVEAL ───── */}
      <section
        className="relative py-20 lg:py-28 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/about_tech_bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/80 backdrop-blur-[2px]" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 25 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloatingBadge className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Academic Accreditation Network
              </span>
            </FloatingBadge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Partner Universities & Grandes Écoles
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              State universities and prestigious engineering institutions collaborating with MANTECH Nexus to supervise, grade, and authenticate student IT placements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ───── UNIVERSITIES LISTING WITH SCALE-IN MOTION ───── */}
      <section className="py-24 relative overflow-hidden min-h-[500px]" style={{ background: 'linear-gradient(180deg, #060f19 0%, #0a1220 60%, #061713 100%)' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-luminosity" style={{ backgroundImage: "url('/images/about_tech_bg.jpg')" }} />
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/8 blur-[110px] rounded-full pointer-events-none" />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-700/60">
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Accredited Higher Education Institutions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {universities.length} partnered faculties and engineering polytechnics across Cameroon
              </p>
            </div>

            <Link href="/sign-up">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs shadow-sm">
                Partner with MANTECH
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            </div>
          ) : universities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Inbox className="h-12 w-12 text-slate-500 mb-3" />
              <h3 className="font-heading text-lg font-semibold text-white">No partner universities yet</h3>
              <p className="mt-1 text-sm text-slate-400">
                Universities are being verified by MANTECH administrators.
              </p>
            </motion.div>
          ) : (
            <MotionSection motion="scaleIn" stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {universities.map((uni) => {
                const uniShape = uni as unknown as Record<string, unknown>;

                const profile = uniShape.universityProfile as
                  | Record<string, unknown>
                  | null
                  | undefined;
                const uniMeta = [
                  typeof profile?.universityType === 'string'
                    ? profile.universityType
                    : typeof uni.type === 'string'
                      ? uni.type
                      : null,
                  (profile?.shortName ?? uni.short_name) as string | undefined,
                ]
                  .filter((v): v is string => typeof v === 'string' && v.length > 0)
                  .join(' • ');

                return (
                  <MotionItem key={uni.id} motion="scaleIn">
                    <AnimatedCard className="h-full rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md p-7 shadow-lg hover:shadow-2xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
                      <div>
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-900/60 text-emerald-400 border border-emerald-700/50 group-hover:scale-105 transition-transform">
                            <School className="h-7 w-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-heading text-lg font-bold text-white truncate">{uni.name}</h3>
                              <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                            </div>
                            {uniMeta && (
                              <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{uniMeta}</p>
                            )}
                          </div>
                        </div>

                        {uni.description && (
                          <p className="mt-4 text-xs text-slate-400 leading-relaxed line-clamp-3">
                            {uni.description}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2">
                          {(uni.city || regionNameOf(uniShape)) && (
                            <Badge variant="secondary" className="text-[10px] bg-slate-700/60 text-slate-300 border border-slate-600/40">
                              <MapPin className="mr-1 h-3 w-3" />
                              {[uni.city, regionNameOf(uniShape)].filter(Boolean).join(', ')}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-600/50">
                            Verified Accreditation
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                        {uni.website ? (
                          <a
                            href={uni.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Official Portal</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">Institutional Partner</span>
                        )}

                        <Link href="/services">
                          <Button size="sm" variant="ghost" className="text-xs text-slate-400 hover:text-emerald-400 hover:bg-emerald-900/30">
                            <span>University Services</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </AnimatedCard>
                  </MotionItem>
                );
              })}
            </MotionSection>
          )}
        </div>
      </section>
    </div>
  );
}
