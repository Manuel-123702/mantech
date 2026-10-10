'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Search,
  FileText,
  Calendar,
  UserCheck,
  BarChart3,
  CreditCard,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard/company', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/company/organization', label: 'Organization', icon: Building2 },
  { href: '/dashboard/company/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/dashboard/company/candidates', label: 'Intern Discovery', icon: Search },
  { href: '/dashboard/company/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/company/interviews', label: 'Interviews', icon: Calendar },
  { href: '/dashboard/company/recruitment', label: 'Recruitment', icon: UserCheck },
  { href: '/dashboard/company/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/company/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/company/settings', label: 'Settings', icon: Settings },
];

export function CompanyNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const active =
          link.href === '/dashboard/company'
            ? pathname === link.href
            : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
