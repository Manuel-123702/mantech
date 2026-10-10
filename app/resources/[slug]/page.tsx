import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getEditorialResource } from '@/lib/editorial-content';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = getEditorialResource(slug);
  if (!resource) return { title: 'Resource not found' };
  return {
    title: resource.title,
    description: resource.excerpt,
    openGraph: { title: resource.title, description: resource.excerpt, type: 'article' },
  };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const resource = getEditorialResource(slug);
  if (!resource) notFound();
  return (
    <article className="mx-auto min-h-[65vh] max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"><ArrowLeft className="h-4 w-4" />All resources</Link>
      <header className="mt-8 border-b border-slate-200 pb-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800"><BookOpen className="h-3.5 w-3.5" />{resource.category}</span>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{resource.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{resource.excerpt}</p>
        <p className="mt-4 text-sm text-slate-500">{resource.author} · {resource.readTime}{resource.publishedAt ? ` · ${new Date(resource.publishedAt).toLocaleDateString()}` : ''}</p>
      </header>
      <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap leading-8">{resource.content || resource.excerpt}</div>
    </article>
  );
}
