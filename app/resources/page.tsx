import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/shared/section-animations';
import { EDITORIAL_RESOURCES } from '@/lib/editorial-content';

export default function ResourcesPage() {
  return (
    <div className="overflow-hidden">
      <section className="surface-page border-b border-border/70">
        <div className="container-mantech px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <span className="mb-5 inline-flex rounded-full border border-primary/15 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">Resource Center</span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Resources for your next step</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Guides and articles published by the MANTECH editorial team.</p>
        </div>
      </section>
      <section className="py-20 relative overflow-hidden border-b border-slate-800/60" style={{ background: 'linear-gradient(180deg, #080d1a 0%, #0a1220 50%, #070d18 100%)' }}>
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {EDITORIAL_RESOURCES.map(resource => <StaggerItem key={resource.id}>
                <Link href={`/resources/${encodeURIComponent(resource.slug)}`} className="group block h-full rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-6 w-6" /></div>
                  <div className="mt-4 flex items-center justify-between gap-3"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{resource.category}</span><span className="text-xs text-muted-foreground">{resource.readTime}</span></div>
                  <h2 className="mt-3 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">{resource.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{resource.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">Read article <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </StaggerItem>)}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
