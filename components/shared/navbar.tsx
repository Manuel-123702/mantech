'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Menu,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  LogIn,
  GraduationCap,
  Building2,
  Compass,
  CreditCard,
  BookOpen,
  ArrowRight,
  MapPin,
  Award,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Briefcase,
  Star,
  Smartphone,
  Zap,
  Plus,
} from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavMenuItem {
  href: string;
  label: string;
  description: string;
  icon: any;
  badge?: string;
  color?: string;
}

const JOB_MENU: NavMenuItem[] = [
  {
    href: '/jobs',
    label: 'All Cameroon Jobs',
    description: 'Explore live graduate, tech, culinary, healthcare & artisanal vacancies',
    icon: Briefcase,
    color: 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/20',
  },
  {
    href: '/fields',
    label: '60 Professional Disciplines',
    description: 'Healthcare, teaching, cooking, sales, software, telecom & engineering',
    icon: Compass,
    color: 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/20',
  },
  {
    href: '/locations',
    label: 'Jobs by Region & City',
    description: 'Douala, Yaoundé, Buea, Limbe, Bafoussam and all 10 national regions',
    icon: MapPin,
    color: 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/20',
  },
];

const INTERNSHIP_MENU: NavMenuItem[] = [
  {
    href: '/internships',
    label: 'All Internships',
    description: 'Explore live, verified student & graduate placements',
    icon: Briefcase,
    color: 'text-blue-400 bg-blue-950/60 border border-blue-500/20',
  },
  {
    href: '/fields',
    label: '60 Professional Fields',
    description: 'Healthcare, Education, Hospitality, Trade, IT, Engineering & Agriculture',
    icon: Compass,
    color: 'text-blue-400 bg-blue-950/60 border border-blue-500/20',
  },
  {
    href: '/locations',
    label: 'By Region & City',
    description: 'Douala, Yaoundé, Buea, Limbe, Bafoussam and all 10 national territories',
    icon: MapPin,
    color: 'text-blue-400 bg-blue-950/60 border border-blue-500/20',
  },
  {
    href: '/register/intern',
    label: 'Register Talent Profile',
    description: 'Fill credentials to get your verified digital passport',
    icon: Award,
    badge: 'Core Feature',
    color: 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/20',
  },
];

const ORGANIZATION_MENU: NavMenuItem[] = [
  {
    href: '/post',
    label: 'Post an Opportunity',
    description: 'Post via Flyer, WhatsApp text or Career link (No login needed)',
    icon: Plus,
    badge: 'Express',
    color: 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/20',
  },
  {
    href: '/jobs/flyers',
    label: 'Visual Notice Board',
    description: 'Recruitment posters & communiqués gallery',
    icon: Building2,
    color: 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/20',
  },
  {
    href: '/how-it-works',
    label: 'How Recruitment Works',
    description: 'End-to-end lifecycle from discovery to onboarding',
    icon: Compass,
    color: 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/20',
  },
];

const RESOURCE_MENU: NavMenuItem[] = [
  {
    href: '/pricing',
    label: 'Pricing & Launch Access',
    description: '100% Free National Launch Access for interns, companies & universities',
    icon: CreditCard,
    color: 'text-violet-400 bg-violet-950/60 border border-violet-500/20',
  },
  {
    href: '/resources',
    label: 'Editorial Career Guides',
    description: 'Articles and career advice from MANTECH editorial team',
    icon: BookOpen,
    color: 'text-violet-400 bg-violet-950/60 border border-violet-500/20',
  },
  {
    href: '/testimonials',
    label: 'Community Voice',
    description: 'Real feedback from placed candidates, employers & universities',
    icon: Star,
    color: 'text-violet-400 bg-violet-950/60 border border-violet-500/20',
  },
  {
    href: '/faq',
    label: 'Help & Knowledge Base',
    description: 'Frequently asked questions across all 16 core platform capabilities',
    icon: HelpCircle,
    color: 'text-violet-400 bg-violet-950/60 border border-violet-500/20',
  },
];

const ROLE_LABEL: Record<string, string> = {
  INTERN: 'Intern',
  COMPANY: 'Host Enterprise',
  UNIVERSITY: 'University Partner',
  ADMIN: 'Administrator',
};

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
    setActiveDropdown(null);
  }, [pathname, closeMobile]);

  const openNavMenu = (key: string) => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
      dropdownCloseTimeoutRef.current = null;
    }
    setActiveDropdown(key);
  };

  const scheduleNavClose = () => {
    dropdownCloseTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const userRole = (user?.publicMetadata?.role as string) || 'INTERN';
  const roleLabel = ROLE_LABEL[userRole] || 'Member';

  const dashboardLink =
    userRole === 'ADMIN'
      ? '/dashboard/admin'
      : userRole === 'COMPANY'
        ? '/dashboard/company'
        : userRole === 'UNIVERSITY'
          ? '/dashboard/university'
          : '/dashboard/intern';

  const canBrowsePassports = isLoaded && !!user && userRole !== 'INTERN';

  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'My Account';

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : displayName.slice(0, 2).toUpperCase();

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-slate-800/80 bg-slate-950/90 shadow-2xl backdrop-blur-2xl'
          : 'border-b border-slate-800/40 bg-slate-950/75 backdrop-blur-xl'
      )}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />

      <nav className="container-mantech mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-300',
            scrolled ? 'h-16' : 'h-20'
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 transition-transform bg-white hover:scale-[1.01]"
              aria-label="MANTECH Nexus Home"
            >
              <Logo size={scrolled ? 100 : 100} />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-x-1 lg:flex">
            {/* 0. Jobs Dropdown */}
            <DropdownMenu
              open={activeDropdown === 'jobs'}
              onOpenChange={(open) =>
                open ? openNavMenu('jobs') : setActiveDropdown(null)
              }
            >
              <DropdownMenuTrigger asChild>
                <button
                  onMouseEnter={() => openNavMenu('jobs')}
                  onMouseLeave={scheduleNavClose}
                  className={cn(
                    'group inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                    pathname.startsWith('/jobs')
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  )}
                >
                  <span>Jobs</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-300 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('jobs')}
                onMouseLeave={scheduleNavClose}
                className="w-84 rounded-2xl border border-slate-800 bg-slate-950/95 p-2.5 shadow-2xl backdrop-blur-2xl text-white ring-1 ring-cyan-500/10"
              >
                <div className="px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 mb-1.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                    Explore Cameroon Careers
                  </p>
                </div>
                {JOB_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-900/90 transition-colors group cursor-pointer"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {item.label}
                        </span>
                        <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 1. Internships Dropdown */}
            <DropdownMenu
              open={activeDropdown === 'internships'}
              onOpenChange={(open) =>
                open ? openNavMenu('internships') : setActiveDropdown(null)
              }
            >
              <DropdownMenuTrigger asChild>
                <button
                  onMouseEnter={() => openNavMenu('internships')}
                  onMouseLeave={scheduleNavClose}
                  className={cn(
                    'group inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                    pathname.startsWith('/internships') || pathname.startsWith('/fields') || pathname.startsWith('/locations')
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  )}
                >
                  <span>Internships</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-300 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('internships')}
                onMouseLeave={scheduleNavClose}
                className="w-84 rounded-2xl border border-slate-800 bg-slate-950/95 p-2.5 shadow-2xl backdrop-blur-2xl text-white ring-1 ring-cyan-500/10"
              >
                <div className="px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 mb-1.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                    Find Opportunities
                  </p>
                </div>
                {INTERNSHIP_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-900/90 transition-colors group cursor-pointer"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="bg-cyan-500/20 text-cyan-300 text-[9px] px-1.5 py-0 border-cyan-500/30 font-bold">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 2. Organizations Dropdown */}
            <DropdownMenu
              open={activeDropdown === 'organizations'}
              onOpenChange={(open) =>
                open ? openNavMenu('organizations') : setActiveDropdown(null)
              }
            >
              <DropdownMenuTrigger asChild>
                <button
                  onMouseEnter={() => openNavMenu('organizations')}
                  onMouseLeave={scheduleNavClose}
                  className={cn(
                    'group inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                    pathname.startsWith('/post') || pathname.startsWith('/how-it-works')
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  )}
                >
                  <span>Organizations</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-300 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('organizations')}
                onMouseLeave={scheduleNavClose}
                className="w-84 rounded-2xl border border-slate-800 bg-slate-950/95 p-2.5 shadow-2xl backdrop-blur-2xl text-white ring-1 ring-cyan-500/10"
              >
                <div className="px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 mb-1.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                    Host Enterprises & Academia
                  </p>
                </div>
                {ORGANIZATION_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-900/90 transition-colors group cursor-pointer"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0 border-emerald-500/30 font-bold">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 3. Resources Dropdown */}
            <DropdownMenu
              open={activeDropdown === 'resources'}
              onOpenChange={(open) =>
                open ? openNavMenu('resources') : setActiveDropdown(null)
              }
            >
              <DropdownMenuTrigger asChild>
                <button
                  onMouseEnter={() => openNavMenu('resources')}
                  onMouseLeave={scheduleNavClose}
                  className={cn(
                    'group inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                    pathname.startsWith('/pricing') || pathname.startsWith('/resources') || pathname.startsWith('/faq')
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  )}
                >
                  <span>Resources</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-300 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('resources')}
                onMouseLeave={scheduleNavClose}
                className="w-84 rounded-2xl border border-slate-800 bg-slate-950/95 p-2.5 shadow-2xl backdrop-blur-2xl text-white ring-1 ring-cyan-500/10"
              >
                <div className="px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 mb-1.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                    Platform Insights
                  </p>
                </div>
                {RESOURCE_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-900/90 transition-colors group cursor-pointer"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {item.label}
                        </span>
                        <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 4. Direct Link: About */}
            <Link
              href="/about"
              className={cn(
                'rounded-xl px-3.5 py-2 text-sm font-bold transition-colors',
                pathname === '/about'
                  ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              )}
            >
              About
            </Link>

            {/* 5. Direct Link: Contact */}
            <Link
              href="/contact"
              className={cn(
                'rounded-xl px-3.5 py-2 text-sm font-bold transition-colors',
                pathname === '/contact'
                  ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              )}
            >
              Contact
            </Link>
          </div>

          {/* Right-Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Registration directory — signed-in recruiters only */}
            {canBrowsePassports && (
              <Link
                href="/intern-passports"
                className="cursor-pointer text-cyan-300 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/50 transition-colors"
                title="Browse verified Passports"
              >
                Browse Passports
              </Link>
            )}

            {/* Quick Post CTA — 100% Free */}
            <Link
              href="/post"
              className="h-9 px-4 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:brightness-105 active:scale-[0.98] rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all inline-flex items-center justify-center gap-2 border border-cyan-300/40 cursor-pointer shrink-0"
              title="Post a job or internship free"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-slate-950/15">
                <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              </span>
              <span className="font-extrabold tracking-tight">Post Free</span>
            </Link>

            {user ? (
              /* Signed-In User Profile Menu */
              <div className="flex items-center gap-2">
                <Link
                  href="/register/intern"
                  className="hidden sm:inline-flex h-9 px-4 text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:opacity-95 text-white rounded-xl shadow-md shadow-cyan-500/20 transition-all items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Get Started</span>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-2 rounded-2xl p-1 pr-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                      aria-label="User Account Menu"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 text-xs font-extrabold text-slate-950 shadow-sm">
                        {initials}
                      </span>
                      <span className="hidden flex-col items-start text-left leading-tight md:flex">
                        <span className="text-xs font-bold text-white truncate max-w-[110px]">
                          {displayName}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {roleLabel}
                        </span>
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-64 rounded-2xl border border-slate-800 bg-slate-950/98 p-2 shadow-2xl backdrop-blur-2xl text-white ring-1 ring-cyan-500/10"
                  >
                    <div className="px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 mb-1.5">
                      <p className="text-xs font-bold text-white">{displayName}</p>
                      <p className="text-[11px] font-semibold text-cyan-400 mt-0.5">{roleLabel}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-800" />

                    <DropdownMenuItem asChild className="group cursor-pointer rounded-xl p-2.5 hover:bg-slate-900/90 focus:bg-slate-900/90">
                      <Link href={dashboardLink} className="flex items-center gap-2.5 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-cyan-400" />
                        <span>{roleLabel} Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    {userRole === 'INTERN' && (
                      <DropdownMenuItem asChild className="group cursor-pointer rounded-xl p-2.5 hover:bg-slate-900/90 focus:bg-slate-900/90">
                        <Link href="/dashboard/intern/passport" className="flex items-center gap-2.5 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-colors">
                          <Award className="h-4 w-4 text-amber-400" />
                          <span>My Passport</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild className="group cursor-pointer rounded-xl p-2.5 hover:bg-slate-900/90 focus:bg-slate-900/90">
                      <Link href="/settings" className="flex items-center gap-2.5 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-colors">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>Security & Privacy</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-slate-800" />

                    <DropdownMenuItem
                      onSelect={() => void signOut()}
                      className="cursor-pointer rounded-xl p-2.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/30 focus:bg-red-950/30 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-red-400" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="h-9 px-4 text-xs font-bold text-slate-200 hover:text-white rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/register/intern"
                  className="h-9 px-4 text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:opacity-95 text-white rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5 text-cyan-400" /> : <Menu className="h-5 w-5 text-slate-200" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />

            <motion.div
              className={`fixed inset-x-0 ${scrolled ? 'top-16' : 'top-20'} z-50 flex flex-col border-b border-slate-800 bg-slate-950/98 shadow-2xl backdrop-blur-2xl lg:hidden max-h-[85vh] overflow-y-auto text-white`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="p-4 space-y-4">
                {/* Section 0: Jobs (Direct) */}
                <div>
                  <Link
                    href="/jobs"
                    onClick={closeMobile}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-xs font-bold text-cyan-300 border border-slate-800/80 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/20">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <span>All Cameroon Jobs</span>
                  </Link>
                </div>

                {/* Section 1: Internships */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="px-2.5 py-1 bg-slate-900/80 rounded-lg border border-slate-800 mb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                      Internships & Fields
                    </p>
                  </div>
                  <div className="space-y-1">
                    {INTERNSHIP_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/70 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                      >
                        <div className={cn('p-1.5 rounded-lg shrink-0', item.color)}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 2: Organizations */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="px-2.5 py-1 bg-slate-900/80 rounded-lg border border-slate-800 mb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                      Organizations
                    </p>
                  </div>
                  <div className="space-y-1">
                    {ORGANIZATION_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/70 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                      >
                        <div className={cn('p-1.5 rounded-lg shrink-0', item.color)}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 3: Resources & Info */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="px-2.5 py-1 bg-slate-900/80 rounded-lg border border-slate-800 mb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-400">
                      Resources & Help
                    </p>
                  </div>
                  <div className="space-y-1">
                    {RESOURCE_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/70 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                      >
                        <div className={cn('p-1.5 rounded-lg shrink-0', item.color)}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <Link
                      href="/about"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/70 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-900 text-blue-400 border border-slate-800">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span>About MANTECH</span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/70 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <span>Contact Us</span>
                    </Link>
                    <Link
                      href="/install"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 shadow-sm">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <span className="flex-1">Download Mobile App</span>
                      <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-extrabold text-cyan-300">
                        PWA
                      </span>
                    </Link>
                  </div>
                </div>

                {canBrowsePassports && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="px-2.5 py-1 bg-slate-900/80 rounded-lg border border-slate-800 mb-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                        Talent Discovery
                      </p>
                    </div>
                    <Link
                      href="/intern-passports"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/70 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                        <Award className="h-4 w-4" />
                      </div>
                      <span>Intern Directory</span>
                    </Link>
                  </div>
                )}

                {/* Mobile Auth Actions */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <Link
                    href="/post"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20"
                  >
                    <Zap className="h-4 w-4 fill-slate-950" />
                    <span>Post a Job / Internship Free</span>
                  </Link>

                  {user ? (
                    <>
                      <Link
                        href={dashboardLink}
                        onClick={closeMobile}
                        className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Go to {roleLabel} Dashboard</span>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          closeMobile();
                          void signOut();
                        }}
                        className="w-full text-xs text-red-400 hover:bg-red-950/30 hover:text-red-300 border-red-500/30 bg-transparent font-bold"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Sign Out</span>
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/sign-in"
                        onClick={closeMobile}
                        className="w-full p-3 text-xs font-bold text-slate-200 hover:text-white rounded-xl border border-slate-700/80 bg-slate-900/70 hover:bg-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <LogIn className="w-4 h-4 text-cyan-400" />
                        <span>Sign In</span>
                      </Link>

                      <Link
                        href="/register/intern"
                        onClick={closeMobile}
                        className="w-full p-3 text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-white rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Get Started (Register)</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
