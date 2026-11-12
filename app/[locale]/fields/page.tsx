'use client';
import { Trans, useLingui } from '@lingui/react/macro';


import { useState } from 'react';
import { motion } from 'framer-motion';
import { LocaleLink as Link } from '@/components/shared/locale-link';
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
  Search,
  Filter,
} from 'lucide-react';
import { useTaxonomy } from '@/lib/use-taxonomy';
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';
import { APP_CONFIG } from '@/lib/config';
import {
  MotionItem,
  AnimatedCard,
  FloatingBadge,
} from '@/components/shared/section-animations';

const FIELD_ICONS: Record<string, React.ElementType> = {
  'software-cloud-engineering': Cpu,
  'information-technology-and-software-engineering': Cpu,
  'cybersecurity-networks': Shield,
  'cybersecurity-and-information-assurance': Shield,
  'data-science-ai': BarChart2,
  'data-science-analytics-and-artificial-intelligence': BarChart2,
  'finance-accounting': DollarSign,
  'accounting-audit-and-corporate-taxation': DollarSign,
  'banking-and-commercial-credit': DollarSign,
  'marketing-communications': Megaphone,
  'marketing-strategy-brand-management-and-sales': Megaphone,
  'human-resources': Users,
  'human-resources-management-and-talent-acquisition': Users,
  'supply-chain-logistics': Package,
  'supply-chain-warehousing-and-inventory-control': Package,
  'engineering-industrial': Cog,
  'mechanical-engineering-and-heavy-equipment-maintenance': Cog,
  'healthcare-biotech': Heart,
  'general-medicine-and-hospital-clinical-care': Heart,
  'legal-compliance': Scale,
  'corporate-law-business-contracts-and-ohada': Scale,
};

function getCategoryGradient(category?: string) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('tech') || cat.includes('comput')) return 'from-blue-900 via-indigo-950 to-slate-900';
  if (cat.includes('finance') || cat.includes('bank')) return 'from-emerald-900 via-teal-950 to-slate-900';
  if (cat.includes('engineer') || cat.includes('construct')) return 'from-amber-900 via-orange-950 to-slate-900';
  if (cat.includes('energy') || cat.includes('mining') || cat.includes('extract')) return 'from-yellow-950 via-amber-950 to-slate-900';
  if (cat.includes('agri') || cat.includes('food')) return 'from-green-950 via-emerald-950 to-slate-900';
  if (cat.includes('health') || cat.includes('medic') || cat.includes('life')) return 'from-rose-950 via-red-950 to-slate-900';
  if (cat.includes('supply') || cat.includes('logist') || cat.includes('transport')) return 'from-cyan-950 via-blue-950 to-slate-900';
  if (cat.includes('market') || cat.includes('media') || cat.includes('comm')) return 'from-purple-950 via-fuchsia-950 to-slate-900';
  if (cat.includes('legal') || cat.includes('law') || cat.includes('policy')) return 'from-indigo-950 via-violet-950 to-slate-900';
  if (cat.includes('human') || cat.includes('hr')) return 'from-pink-950 via-rose-950 to-slate-900';
  if (cat.includes('arch') || cat.includes('environ')) return 'from-teal-950 via-emerald-950 to-slate-900';
  if (cat.includes('lang') || cat.includes('humanities')) return 'from-violet-950 via-purple-950 to-slate-900';
  if (cat.includes('hosp') || cat.includes('tour') || cat.includes('service')) return 'from-orange-950 via-amber-950 to-slate-900';
  return 'from-slate-900 via-indigo-950 to-slate-900';
}

export default function FieldsPage() {
  const { t } = useLingui();
  const { fields, loading, error } = useTaxonomy();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(fields.map((f) => f.category).filter(Boolean)))];

  const filteredFields = fields.filter((field) => {
    const matchesSearch =
      search.trim() === '' ||
      field.name.toLowerCase().includes(search.toLowerCase()) ||
      field.category?.toLowerCase().includes(search.toLowerCase()) ||
      field.specializations?.some((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || field.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-fixed text-white overflow-hidden"
      style={{ backgroundImage: "url('/images/fields_dash_bg.svg')" }}
    >
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[3px]" />

      {/* HERO SECTION */}
      <section className="relative z-10 py-20 lg:py-24 border-b border-slate-800/80">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 25 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloatingBadge className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <Trans comment="page span visible text">60 Professional Disciplines
              </Trans></span>
            </FloatingBadge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              <Trans comment="page h1 visible text">Explore Careers &amp; Internships by Discipline
            </Trans></h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              <Trans comment="page p visible text">MANTECH Nexus covers 60 professional fields across Cameroon — spanning technology, engineering, agriculture, healthcare, banking, law, logistics, media, and vocational sectors.
            </Trans></p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-slate-300"
          >
            <span className="bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-700/80 backdrop-blur-sm">
              {loading ? 'Loading...' : `${fields.length} Professional Disciplines`}
            </span>
            <span className="bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-700/80 backdrop-blur-sm">
              <Trans comment="page span visible text">10 Cameroon Regions
            </Trans></span>
            <span className="bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-700/80 backdrop-blur-sm">
              <Trans comment="page span visible text">Verified Host Opportunities
            </Trans></span>
          </motion.div>

          {/* Search bar & Category Filter */}
          <div className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t({ message: "Search disciplines or skills (e.g. Agronomy, Cloud, Surgery)...", comment: "page component placeholder attribute" })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
              />
            </div>
            {categories.length > 2 && (
              <div className="relative">
                <Filter className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-6 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl appearance-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c === 'all' ? 'All Sectors' : c}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FIELDS GRID */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          {error && <p role="alert" className="mb-6 text-center text-sm text-red-400">{error}</p>}
          
          <div className="mb-8 flex items-center justify-between text-xs text-slate-400">
            <span><Trans comment="page span visible text">Showing </Trans><strong className="text-white">{filteredFields.length}</strong> <Trans comment="page span visible text">disciplines</Trans></span>
            {search && (
              <button
                onClick={() => { setSearch(''); setSelectedCategory('all'); }}
                className="text-xs text-blue-400 hover:underline font-semibold"
              >
                <Trans comment="page button visible text">Clear search
              </Trans></button>
            )}
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.03 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFields.map((field) => {
              const Icon = FIELD_ICONS[field.slug] || Cpu;
              const gradient = getCategoryGradient(field.category);

              return (
                <MotionItem key={field.id} motion="flip3D">
                  <AnimatedCard className="h-full">
                    <Link
                      href={`/fields/${field.slug}`}
                      className="group block h-full rounded-3xl border border-slate-700/80 bg-slate-900/85 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-blue-400 hover:bg-slate-800/90 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1.5"
                    >
                      {/* Header */}
                      <div className={`p-6 relative overflow-hidden bg-slate-950 bg-gradient-to-br ${gradient} border-b border-slate-800`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-6 -mb-6" />
                        <div className="relative z-10">
                          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-3 backdrop-blur-sm border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h2 className="font-heading font-extrabold text-white text-lg leading-snug drop-shadow-sm">
                            {field.name}
                          </h2>
                          <p className="text-xs font-semibold text-blue-200 mt-1 uppercase tracking-wider">
                            {field.category}
                          </p>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {field.specializations.slice(0, 4).map((spec) => (
                            <span
                              key={spec.id}
                              className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60"
                            >
                              {spec.name}
                            </span>
                          ))}
                          {field.specializations.length > 4 && (
                            <span className="px-2 py-1 rounded-md bg-slate-800/60 text-slate-400 font-medium text-xs border border-dashed border-slate-700">
                              {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"+"}{field.specializations.length - 4} <Trans comment="page span visible text">more
                            </Trans></span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                          <span className="text-xs text-slate-400 font-medium">
                            {field.specializations.length} <Trans comment="page span visible text">tracks
                          </Trans></span>
                          <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                            <Trans comment="page span visible text">Browse Openings </Trans><ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedCard>
                </MotionItem>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-16 border-t border-slate-800/80 bg-slate-950/60">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
              <Trans comment="page h2 visible text">Don&apos;t see your specific discipline?
            </Trans></h2>
            <p className="text-slate-300 mb-8 text-sm leading-relaxed">
              <Trans comment="page p visible text">MANTECH Nexus is continuously expanding. Contact our advisory team directly on WhatsApp to request custom academic placement tracks or browse all open opportunities.
            </Trans></p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/internships">
                <span className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs shadow-md shadow-blue-600/20 hover:scale-105">
                  <Trans comment="page span visible text">All Internships </Trans><ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/jobs">
                <span className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs shadow-md shadow-indigo-600/20 hover:scale-105">
                  <Trans comment="page span visible text">All Jobs </Trans><ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <a
                href={APP_CONFIG.contacts.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-slate-700 hover:border-emerald-500/50 bg-slate-800/80 text-white hover:text-emerald-300 font-bold px-6 py-3 rounded-xl transition-all text-xs hover:scale-105 shadow-sm"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" title={t({ message: "WhatsApp", comment: "page component title attribute" })} />
                <Trans comment="page a visible text">Contact on WhatsApp
              </Trans></a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
