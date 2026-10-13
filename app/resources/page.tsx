import { ResourcesClient } from './resources-client';

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
      <section className="py-20">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <ResourcesClient />
        </div>
      </section>
    </div>
  );
}
