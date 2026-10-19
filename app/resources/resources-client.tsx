'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ArrowRight,
  FileText,
  BadgeCheck,
  MessagesSquare,
  Building2,
  Sparkles,
  Clock3,
  Search,
  Tag,
  X,
  Code,
  Terminal,
  ShieldAlert,
  GraduationCap,
  Download,
  Share2,
  CheckCircle2,
  ChevronRight,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { EDITORIAL_RESOURCES, type EditorialResource } from '@/lib/editorial-content';

const CATEGORY_STYLE: Record<
  string,
  { chip: string; tile: string; border: string; glow: string; icon: LucideIcon }
> = {
  'Applications & CV': {
    chip: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    tile: 'from-blue-950 via-slate-900 to-blue-900',
    border: 'hover:border-blue-500/50',
    glow: 'from-blue-500/10',
    icon: FileText,
  },
  'Engineering & Code': {
    chip: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    tile: 'from-emerald-950 via-slate-900 to-teal-900',
    border: 'hover:border-emerald-500/50',
    glow: 'from-emerald-500/10',
    icon: Code,
  },
  'Interviews & Prep': {
    chip: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    tile: 'from-amber-950 via-slate-900 to-yellow-900',
    border: 'hover:border-amber-500/50',
    glow: 'from-amber-500/10',
    icon: MessagesSquare,
  },
  'Conventions & Law': {
    chip: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    tile: 'from-purple-950 via-slate-900 to-indigo-900',
    border: 'hover:border-purple-500/50',
    glow: 'from-purple-500/10',
    icon: GraduationCap,
  },
  'Cloud & DevOps': {
    chip: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    tile: 'from-cyan-950 via-slate-900 to-sky-900',
    border: 'hover:border-cyan-500/50',
    glow: 'from-cyan-500/10',
    icon: Terminal,
  },
  'For Organizations': {
    chip: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    tile: 'from-rose-950 via-slate-900 to-pink-900',
    border: 'hover:border-rose-500/50',
    glow: 'from-rose-500/10',
    icon: Building2,
  },
  'Career Growth': {
    chip: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    tile: 'from-orange-950 via-slate-900 to-amber-900',
    border: 'hover:border-orange-500/50',
    glow: 'from-orange-500/10',
    icon: Sparkles,
  },
  'Data & AI': {
    chip: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    tile: 'from-violet-950 via-slate-900 to-purple-900',
    border: 'hover:border-violet-500/50',
    glow: 'from-violet-500/10',
    icon: Layers,
  },
};

const FALLBACK_STYLE = {
  chip: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  tile: 'from-blue-950 via-slate-900 to-slate-900',
  border: 'hover:border-blue-500/50',
  glow: 'from-blue-500/10',
  icon: BookOpen,
};

const styleFor = (category: string) => CATEGORY_STYLE[category] ?? FALLBACK_STYLE;

export function ResourcesClient() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalResource, setActiveModalResource] = useState<EditorialResource | null>(null);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(EDITORIAL_RESOURCES.map((r) => r.category)))],
    [],
  );

  const filtered = useMemo(() => {
    return EDITORIAL_RESOURCES.filter((r) => {
      const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.excerpt.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.category.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const [featured, ...rest] = filtered;

  return (
    <div className="space-y-12 text-slate-100">
      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800/80 pb-8">
        {/* Search bar */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, code snippets, laws or topics (e.g. MoMo, Docker)..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-900/90 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                    : 'border border-slate-700/70 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result count & reset */}
      <div className="flex items-center justify-between text-xs text-slate-400 -mt-6">
        <span>
          Showing <strong className="text-white">{filtered.length}</strong> of{' '}
          <strong className="text-white">{EDITORIAL_RESOURCES.length}</strong> real technical guides
        </span>
        {(activeCategory !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="text-cyan-400 hover:underline"
          >
            Reset filter & search
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center max-w-md mx-auto my-12">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold text-white">No resources matched your query</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try searching for broader keywords like &quot;API&quot;, &quot;CV&quot;, &quot;Interview&quot;, or &quot;Docker&quot;.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            View all guides
          </button>
        </div>
      ) : (
        <>
          {/* ── FEATURED HERO GUIDE (DARK GLASS) ── */}
          {featured && (
            <motion.div
              key={`featured-${featured.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                onClick={() => setActiveModalResource(featured)}
                className="group relative cursor-pointer grid gap-6 overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/80 p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/10 md:grid-cols-12"
              >
                {/* Left Visual Tile */}
                <div
                  className={`relative md:col-span-5 flex min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${
                    styleFor(featured.category).tile
                  } p-8 border border-white/10`}
                >
                  <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-300" /> Featured Tech Guide
                    </span>
                    <span className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-cyan-300">
                      {featured.type}
                    </span>
                  </div>

                  <div className="relative mt-8">
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                      {featured.category}
                    </span>
                    <h2 className="mt-2 font-heading text-2xl font-bold leading-tight text-white group-hover:text-cyan-200 transition-colors">
                      {featured.title}
                    </h2>
                  </div>

                  <div className="relative mt-4 flex items-center gap-3 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-cyan-400" /> {featured.readTime}
                    </span>
                    <span>·</span>
                    <span className="text-slate-300">{featured.difficulty}</span>
                  </div>
                </div>

                {/* Right Content */}
                <div className="md:col-span-7 flex flex-col justify-between p-4 pr-6 sm:p-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <span className="font-semibold text-slate-300">{featured.author}</span>
                      <span>·</span>
                      <span>Updated {new Date(featured.publishedAt).toLocaleDateString()}</span>
                    </div>

                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
                      {featured.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {featured.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                    <span className="text-xs text-cyan-400 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open interactive reader <ArrowRight className="h-4 w-4" />
                    </span>
                    <Link
                      href={`/resources/${encodeURIComponent(featured.slug)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-xl border border-slate-700 bg-slate-800/70 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition-all"
                    >
                      Permalink Page
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── GRID OF REMAINING GUIDES (DARK GLASS) ── */}
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
                    transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                  >
                    <div
                      onClick={() => setActiveModalResource(resource)}
                      className={`group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-md p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 ${style.border} cursor-pointer`}
                    >
                      <div>
                        {/* Header badge & icon */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.chip}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {resource.category}
                          </span>
                          <span className="rounded-md border border-slate-700/60 bg-slate-800/50 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                            {resource.type}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="mt-4 font-heading text-lg font-bold leading-snug text-white group-hover:text-cyan-300 transition-colors">
                          {resource.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
                          {resource.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {resource.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-slate-700/50 bg-slate-800/40 px-2 py-0.5 text-[10px] text-slate-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 border-t border-slate-800/70 pt-3 flex items-center justify-between text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5 text-cyan-400" /> {resource.readTime}
                        </span>
                        <span className="font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Read <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── MODAL: INTERACTIVE GUIDE READER (DARK NEXUS) ── */}
      <AnimatePresence>
        {activeModalResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalResource(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl z-10 my-8 text-slate-100 max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalResource(null)}
                className="absolute top-4 right-4 z-20 rounded-full bg-slate-800/80 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="border-b border-slate-800 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 p-6 sm:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  <BookOpen className="h-3.5 w-3.5" />
                  {activeModalResource.category} · {activeModalResource.type}
                </span>

                <h2 className="mt-3 font-heading text-xl sm:text-2xl font-bold text-white">
                  {activeModalResource.title}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeModalResource.excerpt}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>Author: {activeModalResource.author}</span>
                  <span>·</span>
                  <span>{activeModalResource.readTime}</span>
                  <span>·</span>
                  <span className="text-cyan-300 font-semibold">{activeModalResource.difficulty}</span>
                </div>
              </div>

              {/* Modal Scrollable Content */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-200">
                <div className="prose prose-invert prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {activeModalResource.content}
                </div>

                {/* Tags in modal */}
                <div className="border-t border-slate-800 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Indexed Topics
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalResource.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-800 bg-slate-950/70 p-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Published by MANTECH Editorial Desk
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/resources/${encodeURIComponent(activeModalResource.slug)}`}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    Dedicated Page <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => setActiveModalResource(null)}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
