'use client';

import Link from 'next/link';
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  CalendarDays,
  BarChart3,
  CreditCard,
  Settings,
  UserSearch,
  Handshake,
  GraduationCap,
  MapPin,
  Building2,
  Eye,
  BookOpen,
  ArrowLeftRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/lib/config';
import type { UniversityDashboardMode } from '@/lib/university-dashboard';

type Props = {
  orgName?: string;
  verificationStatus?: string;
  canRecruit?: boolean;
  canCoordinate?: boolean;
};

function classNames(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(' ');
}

const placementItems = [
  { href: '/dashboard/university', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/university/students', label: 'Associated Students', icon: Users },
  { href: '/dashboard/university/opportunities', label: 'Opportunity Discovery', icon: Eye },
  { href: '/dashboard/university/partners', label: 'Partner Companies', icon: Handshake },
  { href: '/dashboard/university/placements', label: 'Placement Monitoring', icon: BookOpen },
  { href: '/dashboard/university/analytics', label: 'Placement Analytics', icon: BarChart3 },
  { href: '/dashboard/university/settings', label: 'Institution Settings', icon: Settings },
];

const recruiterItems = [
  { href: '/dashboard/university?mode=recruiter', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/university/opportunities-recruiter', label: 'Opportunities', icon: Briefcase },
  { href: '/dashboard/university/candidates', label: 'Candidate Discovery', icon: UserSearch },
  { href: '/dashboard/university/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/university/interviews', label: 'Interviews', icon: CalendarDays },
  { href: '/dashboard/university/recruitment', label: 'Recruitment', icon: Users },
  { href: '/dashboard/university/analytics-recruiter', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/university/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/university/settings-recruiter', label: 'Settings', icon: Settings },
];

const RECRUITER_PREFIXES = [
  '/dashboard/university/opportunities-recruiter',
  '/dashboard/university/candidates',
  '/dashboard/university/applications',
  '/dashboard/university/interviews',
  '/dashboard/university/recruitment',
  '/dashboard/university/analytics-recruiter',
  '/dashboard/university/billing',
  '/dashboard/university/settings-recruiter',
];

const PLACEMENT_PREFIXES = [
  '/dashboard/university/students',
  '/dashboard/university/opportunities',
  '/dashboard/university/partners',
  '/dashboard/university/placements',
  '/dashboard/university/analytics',
  '/dashboard/university/settings',
];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function deriveUniversityMode(
  pathname: string,
  modeParam: string | null,
  available: { canRecruit: boolean; canCoordinate: boolean }
): UniversityDashboardMode {
  if (!available.canCoordinate && available.canRecruit) return 'recruiter';
  if (!available.canRecruit && available.canCoordinate) return 'placement';

  if (RECRUITER_PREFIXES.some((p) => matchesPrefix(pathname, p))) return 'recruiter';
  if (PLACEMENT_PREFIXES.some((p) => matchesPrefix(pathname, p))) return 'placement';
  return modeParam === 'recruiter' ? 'recruiter' : 'placement';
}

export function UniversityNav({
  orgName = 'Your University',
  verificationStatus = 'PENDING_REVIEW',
  canRecruit = true,
  canCoordinate = true,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParam = searchParams.get('mode');

  const mode = deriveUniversityMode(pathname, currentParam, { canRecruit, canCoordinate });
  const activeItems = mode === 'recruiter' ? recruiterItems : placementItems;

  function switchMode(next: UniversityDashboardMode) {
    if (next === 'placement' && !canCoordinate) return;
    if (next === 'recruiter' && !canRecruit) return;
    if (next === 'recruiter') router.push('/dashboard/university?mode=recruiter');
    else router.push('/dashboard/university');
  }

  const isActive = (href: string) => {
    const purePath = href.split('?')[0];
    if (purePath === '/dashboard/university') {
      return pathname === '/dashboard/university' && mode === 'placement';
    }
    if (href.includes('mode=recruiter')) {
      return pathname === '/dashboard/university' && mode === 'recruiter';
    }
    return pathname === purePath;
  };

  const initials =
    orgName
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 3)
      .join('')
      .toUpperCase() || 'U';

  return (
    <aside className="hidden lg:flex h-[calc(100vh-0px)] w-72 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 sticky top-0">
      <Link href="/dashboard/university" className="flex items-center gap-2.5 px-2 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-sm">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 leading-tight">MANTECH Nexus</p>
          <p className="text-[11px] text-slate-500 leading-tight">University Portal</p>
        </div>
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-inner">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 truncate">{orgName}</p>
            <Badge
              variant="secondary"
              className={classNames(
                'mt-1 text-[10px] px-2 py-0',
                verificationStatus === 'VERIFIED' && 'bg-emerald-100 text-emerald-700 border-emerald-200',
                verificationStatus === 'PENDING_REVIEW' && 'bg-amber-100 text-amber-700 border-amber-200',
                verificationStatus === 'REJECTED' && 'bg-rose-100 text-rose-700 border-rose-200'
              )}
            >
              {verificationStatus === 'VERIFIED'
                ? 'Accredited Partner'
                : verificationStatus === 'REJECTED'
                ? 'Verification Rejected'
                : 'Pending Verification'}
            </Badge>
          </div>
        </div>
      </div>

      {canRecruit && canCoordinate && (
        <div className="rounded-xl border border-slate-200 p-1 mb-5 flex bg-slate-50">
          <button
            type="button"
            onClick={() => switchMode('placement')}
            className={classNames(
              'flex-1 text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5',
              mode === 'placement'
                ? 'bg-white shadow-sm text-emerald-700 ring-1 ring-emerald-200'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <MapPin className="w-3.5 h-3.5" />
            Placement Office
          </button>
          <button
            type="button"
            onClick={() => switchMode('recruiter')}
            className={classNames(
              'flex-1 text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5',
              mode === 'recruiter'
                ? 'bg-white shadow-sm text-blue-700 ring-1 ring-blue-200'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            Recruiter
          </button>
        </div>
      )}

      <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
        {mode === 'placement' ? 'Placement Coordination' : 'Institution Recruitment'}
      </p>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {activeItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
          MANTECH Support
        </p>
        <p className="text-[11px] text-slate-500 mb-3">
          Institutional partnership, roster imports, and package upgrades.
        </p>
        <a href={APP_CONFIG.contacts.whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="w-full text-xs font-semibold border-slate-300">
            <WhatsAppIcon className="mr-1.5 h-4 w-4 text-[#25D366]" title="WhatsApp" />
            Contact on WhatsApp
          </Button>
        </a>
      </div>
    </aside>
  );
}
