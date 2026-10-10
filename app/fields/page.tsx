'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Cpu,
  Shield,
  BarChart2,
  DollarSign,
  Megaphone,
  Users,
  Package,
  Cog,
  Heart,
  Scale,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useTaxonomy } from '@/lib/use-taxonomy';
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';
import { APP_CONFIG } from '@/lib/config';
import {
  MotionSection,
  MotionItem,
  AnimatedCard,
  FloatingBadge,
  SectionHeader,
} from '@/components/shared/section-animations';

const FIELD_ICONS: Record<string, React.ElementType> = {
  'software-cloud-engineering': Cpu,
  'cybersecurity-networks': Shield,
  'data-science-ai': BarChart2,
  'finance-accounting': DollarSign,
  'marketing-communications': Megaphone,
  'human-resources': Users,
  'supply-chain-logistics': Package,
  'engineering-industrial': Cog,
  'healthcare-biotech': Heart,
  'legal-compliance': Scale,
};

const FIELD_COLORS: Record<string, string> = {
  'software-cloud-engineering': 'from-blue-600 to-cyan-600',
  'cybersecurity-networks': 'from-red-600 to-rose-600',
  'data-science-ai': 'from-violet-600 to-purple-600',
  'finance-accounting': 'from-emerald-600 to-teal-600',
  'marketing-communications': 'from-orange-500 to-amber-500',
  'human-resources': 'from-pink-600 to-rose-500',
  'supply-chain-logistics': 'from-slate-600 to-slate-700',
  'engineering-industrial': 'from-yellow-600 to-orange-600',
  'healthcare-biotech': 'from-green-600 to-emerald-600',
  'legal-compliance': 'from-indigo-600 to-blue-700',
};

export default function FieldsPage() {
  const { fields, loading, error } = useTaxonomy();

  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden">
      {/* ── HERO WITH BLUR REVEAL ── */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10" />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 25 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloatingBadge className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                All Professional Disciplines
              </span>
            </FloatingBadge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Explore Internships by Discipline
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              MANTECH Nexus covers all professional fields across Cameroon — from software engineering and cybersecurity to finance, law, healthcare, and logistics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-slate-300"
          >
            <span className="bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/80 backdrop-blur-sm">
              {loading ? 'Loading' : fields.length} Professional Disciplines
            </span>
            <span className="bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/80 backdrop-blur-sm">
              10 Cameroon Regions
            </span>
            <span className="bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/80 backdrop-blur-sm">
              Verified Host Opportunities
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── FIELDS GRID WITH 3D PERSPECTIVE FLIP ── */}
      <section className="py-20">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          {error && <p role="alert" className="mb-6 text-center text-sm text-red-700">{error}</p>}
          
          <MotionSection motion="flip3D" stagger={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => {
              const Icon = FIELD_ICONS[field.slug] || Cpu;
              const gradient = FIELD_COLORS[field.slug] || 'from-slate-600 to-slate-700';

              return (
                <MotionItem key={field.id} motion="flip3D">
                  <AnimatedCard className="h-full">
                    <Link
                      href={`/fields/${field.slug}`}
                      className="group block h-full bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    >
                      {/* Header */}
                      <div className={`bg-gradient-to-br ${gradient} p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-6 -mb-6" />
                        <div className="relative z-10">
                          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h2 className="font-heading font-bold text-white text-lg leading-snug">{field.name}</h2>
                          <p className="text-xs text-white/80 mt-1 font-medium">{field.category}</p>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {field.specializations.slice(0, 3).map((spec) => (
                            <span key={spec.id} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                              {spec.name}
                            </span>
                          ))}
                          {field.specializations.length > 3 && (
                            <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-400 text-xs">
                              +{field.specializations.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-xs text-slate-400 font-medium">{field.specializations.length} specializations</span>
                          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Browse Openings <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedCard>
                </MotionItem>
              );
            })}
          </MotionSection>
        </div>
      </section>

      {/* ── CTA WITH SCALE-IN ── */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Don&apos;t see your specific field?
            </h2>
            <p className="text-slate-600 mb-8 text-sm leading-relaxed">
              MANTECH Nexus is continuously expanding. Contact our team on WhatsApp to request specialized tracks or browse all open opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/internships">
                <span className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all text-xs shadow-md shadow-blue-600/20 hover:scale-105">
                  All Internships <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <a
                href={APP_CONFIG.contacts.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-slate-300 hover:border-emerald-400 bg-white text-slate-700 hover:text-emerald-600 font-semibold px-6 py-3 rounded-xl transition-all text-xs hover:scale-105 shadow-sm"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" title="WhatsApp" />
                Contact on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
