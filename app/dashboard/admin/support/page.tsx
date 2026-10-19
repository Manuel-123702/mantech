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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      tone: 'bg-emerald-50 border-emerald-200',
      iconTone: 'text-[#25D366]',
      badge: 'Primary channel',
    },
    {
      title: 'WhatsApp support',
      description:
        'Instant channel for quick questions, urgent issues, and real-time escalation. Organizations can share screenshots and documents directly via WhatsApp.',
      value: APP_CONFIG.contacts.whatsapp,
      href: APP_CONFIG.support.whatsapp,
      target: '_blank',
      icon: WhatsAppIcon,
      tone: 'bg-emerald-50 border-emerald-200',
      iconTone: 'text-emerald-600',
      badge: 'Instant · 15min SLA',
    },
    {
      title: 'Operational HQ',
      description:
        'Field operations, institutional partnerships, and in-person meetings across Cameroon. University placement officers and enterprise HR teams should coordinate visits via WhatsApp first.',
      value: APP_CONFIG.contacts.location,
      href: null,
      icon: Globe,
      tone: 'bg-amber-50 border-amber-200',
      iconTone: 'text-amber-700',
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
      body: 'Public-facing help content, editorial resources, and onboarding flows for interns, recruiters, and placement officers.',
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
        <div>
          <h2 className="text-lg font-bold text-slate-900 inline-flex items-center gap-2">
            <Headphones className="h-4 w-4 text-slate-500" />
            Admin support & operations
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Centralized playbook for MANTECH operators. Official channels, help topics, and partner escalation paths.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Operators online
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {supportChannels.map((c) => {
          const Icon = c.icon;
          const Content = (
            <div className={`rounded-2xl border p-5 shadow-sm ${c.tone} h-full`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`shrink-0 rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-black/5`}>
                    <Icon className={`h-5 w-5 ${c.iconTone}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                      <Badge variant="outline" className="text-[10px] border-black/10">{c.badge}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{c.description}</p>
                    <p className="mt-3 font-mono text-sm font-semibold text-slate-900 break-all">{c.value}</p>
                  </div>
                </div>
              </div>
            </div>
          );
          return c.href ? (
            <a key={c.title} href={c.href} target="_blank" rel="noreferrer" className="block">
              {Content}
            </a>
          ) : (
            <div key={c.title}>{Content}</div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              Business hours & SLA
            </CardTitle>
            <CardDescription>Service windows for Cameroon (WAT / UTC+1)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ['Mon — Fri', '8:00 AM — 6:00 PM', 'All channels staffed'],
              ['Saturday', '9:00 AM — 1:00 PM', 'WhatsApp + email only'],
              ['Sunday', 'Closed', 'Emergency → WhatsApp on-call'],
            ].map(([day, hours, note]) => (
              <div key={day} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 w-24">{day}</span>
                  <span className="text-xs font-semibold text-slate-900">{hours}</span>
                </div>
                <span className="text-[11px] text-slate-500">{note}</span>
              </div>
            ))}
            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800">
              Outside hours: WhatsApp on-call responds to verified enterprise emergencies only.
              All other requests receive first-response on the next business day.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-slate-500" />
              Escalation levels
            </CardTitle>
            <CardDescription>Triage tiers before escalating to executive ops</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { t: 'L1 · Self-service', d: 'User reads FAQ, resources, or completes the onboarding wizard inside their dashboard.', color: 'bg-slate-100 text-slate-700' },
              { t: 'L2 · WhatsApp concierge', d: 'Most common: verification, package quotes, interview coordination, bulk CSV imports.', color: 'bg-emerald-100 text-emerald-700' },
              { t: 'L3 · Admin dashboard action', d: 'Subscription activation, moderation overrides, password resets, permission changes.', color: 'bg-blue-100 text-blue-700' },
              { t: 'L4 · Executive ops', d: 'Contract disputes, legal requests, payment investigations, institutional partnership sign-off.', color: 'bg-amber-100 text-amber-700' },
            ].map((lvl) => (
              <div key={lvl.t} className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-2">
                <Badge className={`shrink-0 text-[10px] ${lvl.color} border-transparent`}>{lvl.t}</Badge>
                <p className="text-xs text-slate-600">{lvl.d}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-slate-500" />
              Operator help topics
            </CardTitle>
            <CardDescription>Quick jump to the Admin module that handles each request type</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {helpTopics.map((t) => {
              const Icon = t.icon;
              return (
                <Link key={t.title} href={t.link} className="block rounded-2xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="shrink-0 rounded-xl bg-slate-50 p-2 ring-1 ring-slate-100">
                        <Icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                        <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{t.body}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 mt-1" />
                  </div>
                  <div className="mt-3 pl-11">
                    <Button size="sm" variant="outline" className="text-[11px] border-slate-200">
                      {t.linkLabel}
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
