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
    title: 'Intern Passport',
    description:
      'Your professional profile, your experience, your certificates and your privacy settings.',
    icon: IdCard,
    roles: ['intern', 'company', 'university', 'admin'],
  },
  {
    href: '/dashboard/company',
    title: 'Company Dashboard',
    description:
      'Post internships, search for candidates, review CVs, arrange interviews and recruit.',
    icon: Building2,
    roles: ['company', 'admin'],
  },
  {
    href: '/dashboard/university',
    title: 'University Dashboard',
    description:
      'Help students find internships, and recruit interns to work at the institution.',
    icon: GraduationCap,
    roles: ['university', 'admin'],
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-5 text-sm font-semibold text-slate-700">
            Getting your dashboards ready...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            MANTECH Nexus
          </p>
          <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold text-slate-900">
            <LayoutDashboard className="h-7 w-7 text-blue-600" aria-hidden="true" />
            Your dashboards
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {user?.fullName ? `Welcome back, ${user.fullName}. ` : ''}
            Choose the area you want to work in. The Intern Dashboard and your Intern
            Passport are open to every member. The others need permission.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {WORKSPACES.map((workspace) => {
            const Icon = workspace.icon;
            // The server decides access. While /api/me is still loading we fall
            // back to the role list so the UI never lies about permissions.
            const permitted = allowed
              ? allowed.includes(workspace.href)
              : (workspace.roles as readonly string[]).includes(role);

            return (
              <Link key={workspace.href} href={workspace.href} className="group">
                <Card
                  className={`h-full shadow-sm transition-shadow ${
                    permitted ? 'group-hover:shadow-md' : 'opacity-60'
                  } ${
                    permitted ? 'border-blue-300 ring-1 ring-blue-200' : ''
                  }`}
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                        <Icon className="h-5 w-5 text-blue-700" aria-hidden="true" />
                      </span>
                      {permitted ? (
                        <Badge className="bg-blue-600">You can open this</Badge>
                      ) : (
                        <Badge variant="outline">Needs permission</Badge>
                      )}
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                      {workspace.title}
                    </h2>
                    <p className="mt-1 flex-1 text-sm text-slate-600">
                      {workspace.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700">
                      {permitted ? 'Open' : 'Ask an administrator for access'}
                      {permitted && (
                        <ChevronRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Every dashboard checks your permission again when it opens, so typing an address
          you are not allowed to use will simply take you back to your own dashboard.
        </p>
      </div>
    </div>
  );
}
