'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Building2,
  GraduationCap,
  ShieldCheck,
  IdCard,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';

/**
 * The list of dashboards.
 *
 * Everyone who has signed in can use the Intern Dashboard and the Intern
 * Passport. The Company, University and Admin dashboards are limited to people
 * whose email is listed in the .env settings file.
 *
 * Showing a card here does not open anything. Each dashboard still checks
 * permission when it is opened, so nobody can reach a page they are not
 * allowed to use by typing its address.
 */
const WORKSPACES = [
  {
    href: '/dashboard/intern',
    title: 'Intern Dashboard',
    description:
      'Your applications, saved internships, profile checklist and your journey so far.',
    icon: Briefcase,
    roles: ['intern', 'company', 'university', 'admin'],
  },
  {
    href: '/dashboard/intern/passport',
    title: 'My Passport',
    description:
      'Your professional profile, your experience, your certificates and your privacy settings.',
    icon: IdCard,
    roles: ['intern', 'company', 'university', 'admin'],
  },
  {
    href: '/dashboard/company',
    title: 'Company Dashboard',
    description:
      'Post internships and jobs, search candidates, review CVs, arrange interviews and recruit talent across Cameroon.',
    icon: Building2,
    roles: ['intern', 'company', 'university', 'admin'],
    openToAll: true,
  },
  {
    href: '/dashboard/university',
    title: 'University Dashboard',
    description:
      'Coordinate tripartite conventions, monitor student placements, and connect departments with accredited host enterprises.',
    icon: GraduationCap,
    roles: ['intern', 'company', 'university', 'admin'],
    openToAll: true,
  },
  {
    href: '/dashboard/admin',
    title: 'Admin Dashboard',
    description:
      'Approve organizations, review listings, manage people, packages and site settings.',
    icon: ShieldCheck,
    roles: ['admin'],
  },
] as const;

export default function DashboardRootPage() {
  const { role, user, isLoaded, dashboards } = useAuth();
  const allowed = dashboards.length > 0 ? dashboards : null;

  if (!isLoaded) {
    return (
      <div
        className="min-h-screen relative bg-cover bg-center bg-fixed flex items-center justify-center px-4"
        style={{ backgroundImage: "url('/images/portal_tech_bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px]" />
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-700/80 bg-slate-900/90 p-8 text-center text-white backdrop-blur-xl shadow-2xl">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-5 text-sm font-semibold text-slate-200">
            Getting your dashboards ready...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-fixed text-white px-4 py-10 sm:px-6"
      style={{ backgroundImage: "url('/images/portal_tech_bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mb-8 p-6 rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            MANTECH Nexus Multi-Stakeholder Portal
          </div>
          <h1 className="mt-1 flex items-center gap-3 text-3xl sm:text-4xl font-extrabold text-white font-heading">
            <LayoutDashboard className="h-8 w-8 text-blue-400" aria-hidden="true" />
            Select Your Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {user?.fullName ? `Welcome back, ${user.fullName}. ` : ''}
            Choose your specialized portal below. Every workspace is authenticated and isolated with role-based security.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {WORKSPACES.map((workspace) => {
            const Icon = workspace.icon;
            const isOpenToAll = (workspace as { openToAll?: boolean }).openToAll === true;
            const permitted =
              isOpenToAll ||
              (allowed
                ? allowed.includes(workspace.href)
                : (workspace.roles as readonly string[]).includes(role));

            return (
              <Link key={workspace.href} href={workspace.href} className="group">
                <div
                  className={`h-full rounded-3xl border bg-slate-900/85 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 flex flex-col justify-between ${
                    permitted
                      ? 'border-slate-700/80 hover:border-blue-400 hover:bg-slate-800/90 hover:-translate-y-1 hover:shadow-2xl'
                      : 'border-slate-800/80 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-950/80 border border-blue-500/30 text-blue-400 group-hover:scale-105 transition-transform">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      {permitted ? (
                        <Badge className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1 shadow-md shadow-blue-900/30">
                          {isOpenToAll ? 'Ready for you' : 'Access Granted'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                          Needs permission
                        </Badge>
                      )}
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-white font-heading">
                      {workspace.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {workspace.description}
                    </p>
                  </div>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors pt-4 border-t border-slate-800">
                    {permitted ? 'Enter Dashboard' : 'Restricted Access'}
                    {permitted && (
                      <ChevronRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Every dashboard verifies permission on access. Direct URL entries without credentials redirect to your authorized home.
        </p>
      </div>
    </div>
  );
}
