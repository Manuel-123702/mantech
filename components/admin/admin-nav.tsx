'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  ClipboardList,
  Star,
  Users,
  GraduationCap,
  FileText,
  CreditCard,
  ScrollText,
  Settings2,
  BarChart3,
  Headphones,
  Quote,
  Flag,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/admin/verification', label: 'Verification', icon: ShieldCheck },
  { href: '/dashboard/admin/organizations', label: 'Organizations', icon: Building2 },
  { href: '/dashboard/admin/moderation', label: 'Moderation', icon: ClipboardList },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: Flag },
  { href: '/dashboard/admin/testimonials', label: 'Testimonials', icon: Quote },
  { href: '/dashboard/admin/featured', label: 'Featured', icon: Star },
  { href: '/dashboard/admin/boosts', label: 'Boosts', icon: Rocket },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/interns', label: 'Interns & Passports', icon: GraduationCap },
  { href: '/dashboard/admin/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/admin/packages', label: 'Packages', icon: CreditCard },
  { href: '/dashboard/admin/support', label: 'Support', icon: Headphones },
  { href: '/dashboard/admin/audit', label: 'Audit trail', icon: ScrollText },
  { href: '/dashboard/admin/configuration', label: 'Configuration', icon: Settings2 },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const active =
          link.href === '/dashboard/admin' ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all',
              active
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 font-bold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
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
