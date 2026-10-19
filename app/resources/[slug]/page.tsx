import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock3, Tag, Sparkles, ChevronRight, Share2 } from 'lucide-react';
import { getEditorialResource, EDITORIAL_RESOURCES } from '@/lib/editorial-content';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = getEditorialResource(slug);
  if (!resource) return { title: 'Resource not found' };
  return {
    title: `${resource.title} | MANTECH Resource Hub`,
    description: resource.excerpt,
    openGraph: { title: resource.title, description: resource.excerpt, type: 'article' },
  };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const resource = getEditorialResource(slug);
  if (!resource) notFound();

  const related = EDITORIAL_RESOURCES.filter(
    (r) => r.slug !== resource.slug && (r.category === resource.category || r.type === resource.type),
  ).slice(0, 3);

  return (
    <div className="overflow-hidden bg-[#070d18] min-h-screen text-slate-100 py-12 sm:py-16">
      <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Knowledge Hub
        </Link>

        {/* Article Header */}
        <header className="mt-8 border-b border-slate-800 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <BookOpen className="h-3.5 w-3.5" />
              {resource.category}
            </span>
            <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-slate-300">
              {resource.type}
            </span>
            <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-cyan-400">
              {resource.difficulty}
            </span>
          </div>

          <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {resource.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
            {resource.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-200">{resource.author}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-cyan-400">
                <Clock3 className="w-3.5 h-3.5" /> {resource.readTime}
              </span>
              <span>·</span>
              <span>Published {new Date(resource.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="mt-10 rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          <div className="prose prose-invert prose-slate max-w-none text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
            {resource.content}
          </div>

          {/* Tags */}
          <div className="mt-10 border-t border-slate-800 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" /> Topic Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs text-slate-300 font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Related Guides Section */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-slate-800/80 pt-10">
            <h2 className="font-heading text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Related Knowledge Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/resources/${encodeURIComponent(r.slug)}`}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-500/40 hover:bg-slate-800/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                      {r.category}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-white mt-1 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {r.excerpt}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-400">
                    Read guide <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
