import Link from 'next/link';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import {
  Headphones,
  MessageCircle,
  BookOpen,
  ShieldAlert,
  FileQuestion,
  ArrowRight,
  Clock,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/lib/config';
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';

export default async function AdminSupportPage() {
  await requireAdminDashboard();

  const supportChannels = [
    {
      title: 'WhatsApp concierge',
      description:
        'Primary operational hotline for organizations seeking verification, package upgrades, or recruitment assistance. Response time SLA: 2 hours during business hours.',
      value: APP_CONFIG.contacts.whatsappFormatted,
      href: APP_CONFIG.contacts.whatsappLink,
      icon: WhatsAppIcon,
      tone: 'bg-emerald-950/40 border-emerald-500/30',
      iconTone: 'text-[#25D366]',
      badge: 'Primary channel',
    },
    {
      title: 'WhatsApp support',
      description:
        'Instant channel for quick questions, urgent issues, and real-time escalation. Organizations can share screenshots and documents directly via WhatsApp.',
      value: APP_CONFIG.contacts.whatsapp,
      href: APP_CONFIG.support.whatsapp,
      icon: WhatsAppIcon,
      tone: 'bg-emerald-950/40 border-emerald-500/30',
      iconTone: 'text-emerald-400',
      badge: 'Instant · 15min SLA',
    },
    {
      title: 'Operational HQ',
      description:
        'Field operations, institutional partnerships, and in-person meetings across Cameroon. University placement officers and enterprise HR teams should coordinate visits via WhatsApp first.',
      value: APP_CONFIG.contacts.location,
      href: null,
      icon: Globe,
      tone: 'bg-amber-950/40 border-amber-500/30',
      iconTone: 'text-amber-400',
      badge: APP_CONFIG.contacts.workingHours,
    },
  ];

  const helpTopics = [
    {
      title: 'Organization verification flow',
      body: 'Review §15 of the SRS: Organization contacts MANTECH → MANTECH performs verification → Admin approves → Organization staff get dashboard access.',
      link: '/dashboard/admin/verification',
      linkLabel: 'Open verification queue',
      icon: ShieldAlert,
    },
    {
      title: 'Package activation & billing',
      body: 'Per §16, payments are handled manually on WhatsApp. Once a transfer is confirmed, an Admin activates the subscription record on the Packages dashboard.',
      link: '/dashboard/admin/packages',
      linkLabel: 'Manage subscriptions',
      icon: FileQuestion,
    },
    {
      title: 'Platform usage guides',
      body: 'Public-facing help content, editorial resources, and onboarding flows for candidates, recruiters, and placement officers.',
      link: '/resources',
      linkLabel: 'Browse resource hub',
      icon: BookOpen,
    },
    {
      title: 'Security & audit support',
      body: 'Unauthorized access attempts, CV leaks, or permission issues are handled via audit trails and Admin role review. Escalate to configuration page to adjust permissions.',
      link: '/dashboard/admin/audit',
      linkLabel: 'Open audit trail',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white inline-flex items-center gap-2 break-words">
            <Headphones className="h-4 w-4 text-amber-400 shrink-0" />
            Admin support &amp; operations
          </h2>
          <p className="mt-1 text-xs text-slate-300 break-words">
            Centralized playbook for MANTECH operators. Official channels, help topics, and partner escalation paths.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 shrink-0">
          <CheckCircle2 className="h-3 w-3" />
          Operators online
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {supportChannels.map((c) => {
          const Icon = c.icon;
          const Content = (
            <div className={`rounded-2xl border p-4 sm:p-5 shadow-lg ${c.tone} h-full`}>
              <div className="flex items-start gap-3 min-w-0">
                <div className="shrink-0 rounded-xl bg-slate-900 border border-slate-700 p-2.5 shadow-sm">
                  <Icon className={`h-5 w-5 ${c.iconTone}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white break-words">{c.title}</h3>
                    <Badge className="bg-slate-900 text-slate-200 border border-slate-700 text-[10px]">{c.badge}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 break-words">{c.description}</p>
                  <p className="mt-3 font-mono text-sm font-semibold text-white break-all">{c.value}</p>
                </div>
              </div>
            </div>
          );
          return c.href ? (
            <a key={c.title} href={c.href} target="_blank" rel="noreferrer" className="block hover:opacity-95 transition-opacity">
              {Content}
            </a>
          ) : (
            <div key={c.title}>{Content}</div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400 shrink-0" />
            Business hours &amp; SLA
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Service windows for Cameroon (WAT / UTC+1)</p>
          <div className="space-y-3">
            {[
              ['Mon — Fri', '8:00 AM — 6:00 PM', 'All channels staffed'],
              ['Saturday', '9:00 AM — 1:00 PM', 'WhatsApp + email only'],
              ['Sunday', 'Closed', 'Emergency → WhatsApp on-call'],
            ].map(([day, hours, note]) => (
              <div key={day} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 w-24">{day}</span>
                  <span className="text-xs font-semibold text-white">{hours}</span>
                </div>
                <span className="text-[11px] text-slate-300">{note}</span>
              </div>
            ))}
            <div className="mt-2 rounded-xl border border-amber-500/30 bg-amber-950/40 p-3 text-[11px] text-amber-200 break-words">
              Outside hours: WhatsApp on-call responds to verified enterprise emergencies only.
              All other requests receive first-response on the next business day.
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-amber-400 shrink-0" />
            Escalation levels
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Triage tiers before escalating to executive ops</p>
          <div className="space-y-2.5">
            {[
              { t: 'L1 · Self-service', d: 'User reads FAQ, resources, or completes the onboarding wizard inside their dashboard.', color: 'bg-slate-800 text-slate-200 border-slate-700' },
              { t: 'L2 · WhatsApp concierge', d: 'Most common: verification, package quotes, interview coordination, bulk CSV imports.', color: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30' },
              { t: 'L3 · Admin dashboard action', d: 'Subscription activation, moderation overrides, password resets, permission changes.', color: 'bg-blue-950/70 text-blue-300 border-blue-500/30' },
              { t: 'L4 · Executive ops', d: 'Contract disputes, legal requests, payment investigations, institutional partnership sign-off.', color: 'bg-amber-950/70 text-amber-300 border-amber-500/30' },
            ].map((lvl) => (
              <div key={lvl.t} className="flex flex-col sm:flex-row sm:items-start gap-2.5 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5">
                <Badge className={`shrink-0 text-[10px] border w-fit ${lvl.color}`}>{lvl.t}</Badge>
                <p className="text-xs text-slate-300 break-words">{lvl.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400 shrink-0" />
            Operator help topics
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Quick jump to the Admin module that handles each request type</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {helpTopics.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.title}
                href={t.link}
                className="block rounded-2xl border border-slate-700/80 bg-slate-800/50 p-4 hover:border-amber-500/50 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="shrink-0 rounded-xl bg-slate-900 border border-slate-700 p-2">
                      <Icon className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white break-words">{t.title}</h4>
                      <p className="mt-1 text-[11px] text-slate-300 leading-relaxed break-words">{t.body}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 mt-1" />
                </div>
                <div className="mt-3 pl-11">
                  <span className="inline-flex items-center rounded-lg bg-amber-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-500">
                    {t.linkLabel}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
