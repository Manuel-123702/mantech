'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ArrowRight,
  FileText,
  BadgeCheck,
  MessagesSquare,
  Building2,
  Sparkles,
  Clock3,
  type LucideIcon,
} from 'lucide-react';
import { EDITORIAL_RESOURCES } from '@/lib/editorial-content';

// Each category gets its own accent so the grid reads as an organised library
// rather than a wall of identical cards. Unknown categories fall back to blue.
const CATEGORY_STYLE: Record<string, { chip: string; tile: string; ring: string; icon: LucideIcon }> = {
  Applications: { chip: 'bg-blue-50 text-blue-700 ring-blue-600/20', tile: 'bg-blue-600', ring: 'group-hover:border-blue-400', icon: FileText },
  'Intern Passport': { chip: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20', tile: 'bg-indigo-600', ring: 'group-hover:border-indigo-400', icon: BadgeCheck },
  Interviews: { chip: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', tile: 'bg-emerald-600', ring: 'group-hover:border-emerald-400', icon: MessagesSquare },
  Employers: { chip: 'bg-orange-50 text-orange-700 ring-orange-600/20', tile: 'bg-orange-500', ring: 'group-hover:border-orange-400', icon: Building2 },
  'For Employers': { chip: 'bg-orange-50 text-orange-700 ring-orange-600/20', tile: 'bg-orange-500', ring: 'group-hover:border-orange-400', icon: Building2 },
};
const FALLBACK = { chip: 'bg-blue-50 text-blue-700 ring-blue-600/20', tile: 'bg-blue-600', ring: 'group-hover:border-blue-400', icon: BookOpen };
const styleFor = (category: string) => CATEGORY_STYLE[category] ?? FALLBACK;

export function ResourcesClient() {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(EDITORIAL_RESOURCES.map((r) => r.category)))],
    [],
  );
  const [active, setActive] = useState('All');

  const filtered = useMemo(
    () => (active === 'All' ? EDITORIAL_RESOURCES : EDITORIAL_RESOURCES.filter((r) => r.category === active)),
    [active],
  );

  const [featured, ...rest] = filtered;

  return (
    <div className="space-y-10">
      {/* Category filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((category) => {
          const isActive = active === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-all ${
                isActive
                  ? 'bg-blue-700 text-white ring-blue-700 shadow-sm'
                  : 'bg-white text-slate-600 ring-slate-200 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Featured article */}
      {featured && (
        <motion.div
          key={`featured-${featured.id}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href={`/resources/${encodeURIComponent(featured.slug)}`}
            className="group grid gap-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:grid-cols-2"
          >
            <div className={`relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl ${styleFor(featured.category).tile} p-7 text-white`}>
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" /> Featured guide
              </span>
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">{featured.category}</span>
                <h2 className="mt-2 font-heading text-2xl font-bold leading-snug">{featured.title}</h2>
              </div>
            </div>
            <div className="flex flex-col justify-center p-5 pr-7">
              <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" /> {featured.readTime}
                </span>
                {featured.author && <span>· {featured.author}</span>}
              </div>
              <p className="mt-3 text-base leading-relaxed text-slate-600">{featured.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                Read the full guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Grid of the rest */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((resource, i) => {
            const style = styleFor(resource.category);
            const Icon = style.icon;
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
              >
                <Link
                  href={`/resources/${encodeURIComponent(resource.slug)}`}
                  className={`group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style.ring}`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.tile} text-white shadow-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${style.chip}`}>{resource.category}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" /> {resource.readTime}
                    </span>
                  </div>
                  <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
                    {resource.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">{resource.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                    Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="py-12 text-center text-slate-500">No guides in this category yet.</p>
      )}
    </div>
  );
}
