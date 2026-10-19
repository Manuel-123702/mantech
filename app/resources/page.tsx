import { ResourcesClient } from './resources-client';
import { BookOpen, Sparkles, Terminal, FileCode2, ShieldCheck, Compass } from 'lucide-react';

export const metadata = {
  title: 'Engineering & Career Resource Center | MANTECH Nexus',
  description:
    'Comprehensive technical guides, ATS-compliant CV templates, Cameroon FinTech API blueprints, MINESUP convention guides, and Linux server playbooks for Cameroon interns and engineers.',
};

export default function ResourcesPage() {
  return (
    <div className="overflow-hidden bg-[#070d18] min-h-screen text-slate-100">
      {/* ── HERO BANNER (DARK NEXUS AESTHETIC) ── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-br from-[#04060f] via-[#06091a] to-[#080c22] py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-35 pointer-events-none"
          style={{
            backgroundImage: "url('/images/resources_hero_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />
        {/* Crisp overlay so headline stays white and readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#04060f]/88 via-[#06091a]/80 to-[#080c22]/85" />
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/18 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/18 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Curated Technical Knowledge Base · Cameroon & Central Africa
          </span>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-2">
            Engineering & Career{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Knowledge Hub
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-300">
            Real, actionable technical guides and career roadmaps written for Cameroonian students, engineering interns, and tech leads. From Cameroon MoMo API webhooks and Linux server management to ATS resume formatting and MINESUP legal conventions.
          </p>

          {/* Highlights ribbon */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md p-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <FileCode2 className="w-4 h-4" /> Code Ready
              </div>
              <div className="text-sm font-semibold text-white mt-1">Real API Blueprints</div>
              <p className="text-[11px] text-slate-400 mt-0.5">MoMo, OM, Next.js & Docker</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md p-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Cameroon Law
              </div>
              <div className="text-sm font-semibold text-white mt-1">MINESUP Conventions</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Tripartite internship rights</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md p-4">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4" /> Terminal Skills
              </div>
              <div className="text-sm font-semibold text-white mt-1">Linux & Cloud Playbooks</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Docker, AWS, GCP Free Tiers</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md p-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-4 h-4" /> Career Sprint
              </div>
              <div className="text-sm font-semibold text-white mt-1">Interview Master Kits</div>
              <p className="text-[11px] text-slate-400 mt-0.5">STAR method & bank schemas</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENT INTERACTIVE EXPLORER (DARK NEXUS) ── */}
      <section className="py-16 relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <ResourcesClient />
        </div>
      </section>
    </div>
  );
}
