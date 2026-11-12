'use client';
import { Trans, useLingui } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import type { MessageDescriptor } from '@lingui/core';


import { LocaleLink as Link } from '@/components/shared/locale-link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from '@/i18n/navigation.hooks';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';
import { waSupportLink } from '@/lib/whatsapp';

interface NavMenuItem {
  href: string;
  label: MessageDescriptor;
  description: MessageDescriptor;
  icon: any;
  badge?: MessageDescriptor;
  color?: string;
}

const JOB_MENU: NavMenuItem[] = [
  {
    href: '/jobs',
    label: msg({ message: 'All Cameroon Jobs', comment: 'Jobs dropdown link label' }),
    description: msg({ message: 'Explore live graduate, tech & executive vacancies', comment: 'Description below the jobs dropdown link' }),
    icon: Briefcase,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/fields',
    label: msg({ message: '60 Professional Disciplines', comment: 'Jobs dropdown link label for professional fields' }),
    description: msg({ message: 'Target software, telecom, finance & engineering roles', comment: 'Description below the professional disciplines link' }),
    icon: Compass,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/locations',
    label: msg({ message: 'Jobs by Region & City', comment: 'Jobs dropdown link label for locations' }),
    description: msg({ message: 'Douala, Yaoundé, Buea and all 10 national territories', comment: 'Description below the jobs by location link' }),
    icon: MapPin,
    color: 'text-orange-600 bg-orange-100/90',
  },
];

const INTERNSHIP_MENU: NavMenuItem[] = [
  {
    href: '/internships',
    label: msg({ message: 'All Internships', comment: 'Internships dropdown link label' }),
    description: msg({ message: 'Explore live, verified student & graduate placements', comment: 'Description below the internships dropdown link' }),
    icon: Briefcase,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/fields',
    label: msg({ message: '60 Professional Fields', comment: 'Internships dropdown link label for professional fields' }),
    description: msg({ message: 'IT, Engineering, Agriculture, Finance, Law & Health', comment: 'Description listing example professional fields' }),
    icon: Compass,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/locations',
    label: msg({ message: 'By Region & City', comment: 'Internships dropdown link label for locations' }),
    description: msg({ message: 'Douala, Yaoundé, Buea and all 10 national territories', comment: 'Description below the internships by location link' }),
    icon: MapPin,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/register/intern',
    label: msg({ message: 'Register Talent Profile', comment: 'Internships dropdown link label for registration' }),
    description: msg({ message: 'Fill credentials to get your verified digital passport', comment: 'Description below the registration link' }),
    icon: Award,
    badge: msg({ message: 'Core Feature', comment: 'Badge identifying the talent profile feature' }),
    color: 'text-orange-600 bg-orange-100/90',
  },
];

const ORGANIZATION_MENU: NavMenuItem[] = [
  {
    href: '/companies',
    label: msg({ message: 'Host Enterprises', comment: 'Organizations dropdown link label for companies' }),
    description: msg({ message: 'Recruit, evaluate, and interview matched interns', comment: 'Description below the host enterprises link' }),
    icon: Building2,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/universities',
    label: msg({ message: 'Universities & Faculties', comment: 'Organizations dropdown link label for universities' }),
    description: msg({ message: 'Placement coordination & institutional recruiter mode', comment: 'Description below the universities link' }),
    icon: GraduationCap,
    badge: msg({ message: 'Dual-Mode', comment: 'Badge describing the two university operating modes' }),
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/how-it-works',
    label: msg({ message: 'How Recruitment Works', comment: 'Organizations dropdown link label for the recruitment guide' }),
    description: msg({ message: 'End-to-end lifecycle from discovery to onboarding', comment: 'Description below the recruitment guide link' }),
    icon: Compass,
    color: 'text-orange-600 bg-orange-100/90',
  },
];

const RESOURCE_MENU: NavMenuItem[] = [
  {
    href: '/pricing',
    label: msg({ message: 'Pricing & Subscriptions', comment: 'Resources dropdown link label for pricing' }),
    description: msg({ message: 'Transparent plans for organizations, 100% free for interns', comment: 'Description below the pricing link' }),
    icon: CreditCard,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/resources',
    label: msg({ message: 'Editorial Career Guides', comment: 'Resources dropdown link label for career guides' }),
    description: msg({ message: 'Articles and advice from MANTECH editorial team', comment: 'Description below the career guides link' }),
    icon: BookOpen,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/testimonials',
    label: msg({ message: 'Community Stories', comment: 'Resources dropdown link label for testimonials' }),
    description: msg({ message: 'Real feedback from placed interns and partner employers', comment: 'Description below the community stories link' }),
    icon: Star,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/faq',
    label: msg({ message: 'Help & Knowledge Base', comment: 'Resources dropdown link label for help' }),
    description: msg({ message: 'Frequently asked questions and support answers', comment: 'Description below the help link' }),
    icon: HelpCircle,
    color: 'text-orange-600 bg-orange-100/90',
  },
];

const ROLE_LABEL: Record<string, MessageDescriptor> = {
  INTERN: msg({ message: 'Intern', comment: 'Account role shown in the profile menu' }),
  COMPANY: msg({ message: 'Host Enterprise', comment: 'Account role shown in the profile menu' }),
  UNIVERSITY: msg({ message: 'University Partner', comment: 'Account role shown in the profile menu' }),
  ADMIN: msg({ message: 'Administrator', comment: 'Account role shown in the profile menu' }),
  MEMBER: msg({ message: 'Member', comment: 'Fallback account role shown in the profile menu' }),
};

export function Navbar() {
  const { t } = useLingui();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { user } = useUser();
  const { signOut } = useClerk();

  const userRole =
    ((user?.publicMetadata as Record<string, unknown> | undefined)?.role as string | undefined) ??
    ((user?.unsafeMetadata as Record<string, unknown> | undefined)?.role as string | undefined);

  const dashboardLink =
    userRole === 'COMPANY'
      ? '/dashboard/company'
      : userRole === 'UNIVERSITY'
        ? '/dashboard/university'
        : userRole === 'ADMIN'
          ? '/dashboard/admin'
          : '/dashboard/intern';

  const roleLabel = t(userRole ? (ROLE_LABEL[userRole] ?? ROLE_LABEL.MEMBER) : ROLE_LABEL.MEMBER);

  // The Intern Passport directory is open to every signed-in member
  const canBrowsePassports = !!user;

  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'My Account';

  const initials =
    `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() ||
    displayName.charAt(0).toUpperCase();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNavMenu = useCallback((id: string) => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setActiveDropdown(id);
  }, []);

  const scheduleNavClose = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActiveDropdown(null), 130);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-blue-200/30 bg-gradient-to-r from-blue-200/30 via-blue-100/20 to-blue-200/30 shadow-md backdrop-blur-2xl'
          : 'border-b border-blue-200/20 bg-gradient-to-r from-blue-200/20 via-blue-100/10 to-blue-200/20 backdrop-blur-xl'
      )}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-200/40 to-transparent pointer-events-none" />

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
              className="flex shrink-0 items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-transform hover:scale-[1.01]"
              aria-label={t({ message: "MANTECH Nexus Home", comment: "navbar component aria-label attribute" })}
            >
              <Logo size={scrolled ? 135 : 150} />
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
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                    pathname.startsWith('/jobs')
                      ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                      : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
                  )}
                >
                  <span><Trans comment="navbar span visible text">Jobs</Trans></span>
                  <ChevronDown className="h-3.5 w-3.5 text-orange-500 group-hover:text-orange-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('jobs')}
                onMouseLeave={scheduleNavClose}
                className="w-80 rounded-2xl border-2 border-orange-200/90 bg-white p-2.5 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 text-slate-900 ring-1 ring-orange-500/10"
              >
                <div className="px-3 py-2 bg-orange-50/90 rounded-xl border border-orange-200/70 mb-1.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                    <Trans comment="navbar p visible text">Explore Cameroon Careers
                  </Trans></p>
                </div>
                {JOB_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-orange-50/80 transition-colors group cursor-pointer"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                          {t(item.label)}
                        </span>
                        <p className="text-[11px] text-slate-700 font-medium line-clamp-1 mt-0.5">
                          {t(item.description)}
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
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                    pathname.startsWith('/internships') || pathname.startsWith('/fields') || pathname.startsWith('/locations')
                      ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                      : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
                  )}
                >
                  <span><Trans comment="navbar span visible text">Internships</Trans></span>
                  <ChevronDown className="h-3.5 w-3.5 text-orange-500 group-hover:text-orange-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('internships')}
                onMouseLeave={scheduleNavClose}
                className="w-80 rounded-2xl border-2 border-orange-200/90 bg-white p-2.5 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 text-slate-900 ring-1 ring-orange-500/10"
              >
                <div className="px-3 py-2 bg-orange-50/90 rounded-xl border border-orange-200/70 mb-1.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                    <Trans comment="navbar p visible text">Find Opportunities
                  </Trans></p>
                </div>
                {INTERNSHIP_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-orange-50/80 transition-colors group cursor-pointer"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                            {t(item.label)}
                          </span>
                          {item.badge && (
                            <Badge className="bg-orange-100 text-orange-700 text-[9px] px-1.5 py-0 border-orange-200 font-bold">
                              {item.badge ? t(item.badge) : null}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium line-clamp-1 mt-0.5">
                          {t(item.description)}
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
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                    pathname.startsWith('/companies') || pathname.startsWith('/universities') || pathname.startsWith('/how-it-works')
                      ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                      : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
                  )}
                >
                  <span><Trans comment="navbar span visible text">Organizations</Trans></span>
                  <ChevronDown className="h-3.5 w-3.5 text-orange-500 group-hover:text-orange-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('organizations')}
                onMouseLeave={scheduleNavClose}
                className="w-80 rounded-2xl border-2 border-orange-200/90 bg-white p-2.5 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 text-slate-900 ring-1 ring-orange-500/10"
              >
                <div className="px-3 py-2 bg-orange-50/90 rounded-xl border border-orange-200/70 mb-1.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                    <Trans comment="navbar p visible text">Host Enterprises & Academia
                  </Trans></p>
                </div>
                {ORGANIZATION_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-orange-50/80 transition-colors group cursor-pointer"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                            {t(item.label)}
                          </span>
                          {item.badge && (
                            <Badge className="bg-orange-100 text-orange-700 text-[9px] px-1.5 py-0 border-orange-200 font-bold">
                              {item.badge ? t(item.badge) : null}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium line-clamp-1 mt-0.5">
                          {t(item.description)}
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
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                    pathname.startsWith('/pricing') || pathname.startsWith('/resources') || pathname.startsWith('/faq')
                      ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                      : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
                  )}
                >
                  <span><Trans comment="navbar span visible text">Resources</Trans></span>
                  <ChevronDown className="h-3.5 w-3.5 text-orange-500 group-hover:text-orange-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('resources')}
                onMouseLeave={scheduleNavClose}
                className="w-80 rounded-2xl border-2 border-orange-200/90 bg-white p-2.5 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 text-slate-900 ring-1 ring-orange-500/10"
              >
                <div className="px-3 py-2 bg-orange-50/90 rounded-xl border border-orange-200/70 mb-1.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                    <Trans comment="navbar p visible text">Platform Insights
                  </Trans></p>
                </div>
                {RESOURCE_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-orange-50/80 transition-colors group cursor-pointer"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                          {t(item.label)}
                        </span>
                        <p className="text-[11px] text-slate-700 font-medium line-clamp-1 mt-0.5">
                          {t(item.description)}
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
                  ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                  : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
              )}
            >
              <Trans comment="navbar Link visible text">About
            </Trans></Link>

            {/* 5. Direct Link: Contact */}
            <Link
              href="/contact"
              className={cn(
                'rounded-xl px-3.5 py-2 text-sm font-bold transition-colors',
                pathname === '/contact'
                  ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                  : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
              )}
            >
              <Trans comment="navbar Link visible text">Contact
            </Trans></Link>
          </div>

          {/* Right-Side Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Registration directory — signed-in recruiters only */}
            {canBrowsePassports && (
              <Link
                href="/intern-passports"
                className="cursor-pointer text-orange-500 font-extrabold relative text-xs px-3 py-1.5 inline-flex items-center justify-center text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-full z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[2px] before:-bottom-[2px] before:-left-[2px] before:-right-[2px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-full before:hover:blur-md before:transition-all before:ease-in-out before:duration-1000 before:hover:bg-[length:10%] active:bg-violet-700"
                title={t({ message: "Browse verified Passports", comment: "navbar component title attribute" })}
              >
                <span className="text-white font-extrabold"><Trans comment="navbar span visible text">Browse Passports</Trans></span>
              </Link>
            )}

            {user ? (
              /* Signed-In User Profile Menu & Get Started button */
              <div className="flex items-center gap-2">
                <Link href="/register/intern" className="hidden sm:inline-flex">
                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-600/25 transition-all"
                  >
                    <Trans comment="navbar Button visible text">Get Started
                  </Trans></Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-2 rounded-2xl p-1 pr-2.5 bg-orange-50/80 hover:bg-orange-100/90 border border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                      aria-label={t({ message: "User Account Menu", comment: "navbar component aria-label attribute" })}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-xs font-extrabold text-white shadow-sm">
                        {initials}
                      </span>
                      <span className="hidden flex-col items-start text-left leading-tight md:flex">
                        <span className="text-xs font-bold text-orange-600 truncate max-w-[110px]">
                          {displayName}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-700">
                          {roleLabel}
                        </span>
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-orange-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-64 rounded-2xl border-2 border-orange-200/90 bg-white p-2 shadow-2xl text-slate-900 ring-1 ring-orange-500/10"
                  >
                    <div className="px-3 py-2 bg-orange-50/90 rounded-xl border border-orange-200/70 mb-1.5">
                      <p className="text-xs font-bold text-orange-600">{displayName}</p>
                      <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{roleLabel}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-orange-100" />

                    <DropdownMenuItem asChild className="group cursor-pointer rounded-xl p-2.5 hover:bg-orange-50/80 focus:bg-orange-50/80">
                      <Link href={dashboardLink} className="flex items-center gap-2.5 text-xs font-bold text-orange-500 hover:text-blue-400 group-hover:text-blue-400 transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-orange-500 group-hover:text-blue-400 transition-colors" />
                        <span>{t({ message: '{role} Dashboard', values: { role: roleLabel }, comment: 'Dashboard link for the signed-in account role' })}</span>
                      </Link>
                    </DropdownMenuItem>

                    {userRole === 'INTERN' && (
                      <DropdownMenuItem asChild className="group cursor-pointer rounded-xl p-2.5 hover:bg-orange-50/80 focus:bg-orange-50/80">
                        <Link href="/dashboard/intern/passport" className="flex items-center gap-2.5 text-xs font-bold text-orange-500 hover:text-blue-400 group-hover:text-blue-400 transition-colors">
                          <Award className="h-4 w-4 text-amber-600 group-hover:text-blue-400 transition-colors" />
                          <span><Trans comment="navbar span visible text">My Passport</Trans></span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild className="group cursor-pointer rounded-xl p-2.5 hover:bg-orange-50/80 focus:bg-orange-50/80">
                      <Link href="/settings" className="flex items-center gap-2.5 text-xs font-bold text-orange-500 hover:text-blue-400 group-hover:text-blue-400 transition-colors">
                        <ShieldCheck className="h-4 w-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                        <span><Trans comment="navbar span visible text">Security & Privacy</Trans></span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-orange-100" />

                    <DropdownMenuItem
                      onSelect={() => void signOut()}
                      className="cursor-pointer rounded-xl p-2.5 text-xs font-bold text-red-600 hover:text-red-600 hover:bg-red-50 focus:bg-red-50 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-red-600" />
                      <span><Trans comment="navbar span visible text">Sign Out</Trans></span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/sign-in">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0.6)',
                        '0 0 0 14px rgba(59, 130, 246, 0)',
                        '0 0 0 0 rgba(59, 130, 246, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="relative overflow-hidden h-10 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <motion.div
                      animate={{ x: ['-120%', '120%'] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-none"
                    />
                    <LogIn className="w-3.5 h-3.5 mr-1.5" />
                    <span className="relative z-10"><Trans comment="navbar span visible text">Sign In</Trans></span>
                    <ArrowRight className="relative z-10 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>

                <Link href="/register/intern">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0.6)',
                        '0 0 0 14px rgba(59, 130, 246, 0)',
                        '0 0 0 0 rgba(59, 130, 246, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="relative overflow-hidden h-10 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <motion.div
                      animate={{ x: ['-120%', '120%'] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-none"
                    />
                    <span className="relative z-10"><Trans comment="navbar span visible text">Get Started</Trans></span>
                    <ArrowRight className="relative z-10 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-orange-500 hover:text-orange-600 hover:bg-orange-50/80 lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen
                ? t({ message: 'Close Menu', comment: 'Accessible label for the mobile navigation close button' })
                : t({ message: 'Open Menu', comment: 'Accessible label for the mobile navigation open button' })}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5 text-orange-500" /> : <Menu className="h-5 w-5 text-orange-500" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />

            <motion.div
              className={`fixed inset-x-0 ${scrolled ? 'top-16' : 'top-20'} z-50 flex flex-col border-b-2 border-orange-200/90 bg-white shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto text-slate-900`}
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
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 text-xs font-bold text-orange-500 hover:text-orange-600"
                  >
                    <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <span><Trans comment="navbar span visible text">All Cameroon Jobs</Trans></span>
                  </Link>
                </div>

                {/* Section 1: Internships */}
                <div className="pt-2 border-t border-orange-100">
                  <div className="px-2.5 py-1 bg-orange-50/90 rounded-lg border border-orange-200/60 mb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                      <Trans comment="navbar p visible text">Internships & Fields
                    </Trans></p>
                  </div>
                  <div className="space-y-1">
                    {INTERNSHIP_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 text-xs font-bold text-orange-500 hover:text-orange-600"
                      >
                        <div className={cn('p-1.5 rounded-lg shrink-0', item.color)}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span>{t(item.label)}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 2: Organizations */}
                <div className="pt-2 border-t border-orange-100">
                  <div className="px-2.5 py-1 bg-orange-50/90 rounded-lg border border-orange-200/60 mb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                      <Trans comment="navbar p visible text">Organizations
                    </Trans></p>
                  </div>
                  <div className="space-y-1">
                    {ORGANIZATION_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 text-xs font-bold text-orange-500 hover:text-orange-600"
                      >
                        <div className={cn('p-1.5 rounded-lg shrink-0', item.color)}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span>{t(item.label)}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 3: Resources & Info */}
                <div className="pt-2 border-t border-orange-100">
                  <div className="px-2.5 py-1 bg-orange-50/90 rounded-lg border border-orange-200/60 mb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                      <Trans comment="navbar p visible text">Resources & Help
                    </Trans></p>
                  </div>
                  <div className="space-y-1">
                    {RESOURCE_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 text-xs font-bold text-orange-500 hover:text-orange-600"
                      >
                        <div className={cn('p-1.5 rounded-lg shrink-0', item.color)}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span>{t(item.label)}</span>
                      </Link>
                    ))}
                    <Link
                      href="/about"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 text-xs font-bold text-orange-500 hover:text-orange-600"
                    >
                      <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span><Trans comment="navbar span visible text">About MANTECH</Trans></span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 text-xs font-bold text-orange-500 hover:text-orange-600"
                    >
                      <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <span><Trans comment="navbar span visible text">Contact Us</Trans></span>
                    </Link>
                    <Link
                      href="/install"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-cyan-50/90 hover:bg-cyan-100/90 text-xs font-bold text-cyan-700 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-cyan-500 text-white shadow-sm">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <span className="flex-1"><Trans comment="navbar span visible text">Download Mobile App</Trans></span>
                      <span className="rounded-full bg-cyan-200/80 px-2 py-0.5 text-[10px] font-extrabold text-cyan-900">
                        <Trans comment="navbar span visible text">PWA
                      </Trans></span>
                    </Link>
                  </div>
                </div>

                {canBrowsePassports && (
                  <div className="pt-2 border-t border-orange-100">
                    <div className="px-2.5 py-1 bg-orange-50/90 rounded-lg border border-orange-200/60 mb-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                        <Trans comment="navbar p visible text">Talent Discovery
                      </Trans></p>
                    </div>
                    <Link
                      href="/intern-passports"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 text-xs font-bold text-orange-500 hover:text-orange-600"
                    >
                      <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                        <Award className="h-4 w-4" />
                      </div>
                      <span><Trans comment="navbar span visible text">Intern Directory</Trans></span>
                    </Link>
                  </div>
                )}

                {/* Mobile Auth Actions */}
                <div className="pt-3 border-t border-orange-200 space-y-2">
                  {user ? (
                    <>
                      <Link
                        href={dashboardLink}
                        onClick={closeMobile}
                        className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>{t({ message: 'Go to {role} Dashboard', values: { role: roleLabel }, comment: 'Mobile dashboard link for the signed-in account role' })}</span>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          closeMobile();
                          void signOut();
                        }}
                        className="w-full text-xs text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 font-bold"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span><Trans comment="navbar span visible text">Sign Out</Trans></span>
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      {/* Animated wave "Sign In" CTA */}
                      <Link href="/sign-in" onClick={closeMobile}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          animate={{
                            boxShadow: [
                              '0 0 0 0 rgba(59, 130, 246, 0.5)',
                              '0 0 0 12px rgba(59, 130, 246, 0)',
                              '0 0 0 0 rgba(59, 130, 246, 0)',
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="relative overflow-hidden w-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 group"
                        >
                          <motion.div
                            animate={{ x: ['-120%', '120%'] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-none"
                          />
                          <LogIn className="w-3.5 h-3.5 mr-1.5" />
                          <span className="relative z-10"><Trans comment="navbar span visible text">Sign In</Trans></span>
                          <ArrowRight className="relative z-10 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </Link>

                      {/* Animated wave "Get Started" CTA */}
                      <Link href="/register/intern" onClick={closeMobile}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          animate={{
                            boxShadow: [
                              '0 0 0 0 rgba(59, 130, 246, 0.5)',
                              '0 0 0 12px rgba(59, 130, 246, 0)',
                              '0 0 0 0 rgba(59, 130, 246, 0)',
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="relative overflow-hidden w-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 group"
                        >
                          <motion.div
                            animate={{ x: ['-120%', '120%'] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-none"
                          />
                          <span className="relative z-10"><Trans comment="navbar span visible text">Get Started</Trans></span>
                          <ArrowRight className="relative z-10 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
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
