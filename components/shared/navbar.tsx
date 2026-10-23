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
  label: string;
  description: string;
  icon: any;
  badge?: string;
  color?: string;
}

const INTERNSHIP_MENU: NavMenuItem[] = [
  {
    href: '/internships',
    label: 'All Opportunities',
    description: 'Explore live, verified postings across Cameroon',
    icon: Briefcase,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/fields',
    label: 'Browse by Field',
    description: 'IT, Engineering, Finance, Law, Marketing & Healthcare',
    icon: Compass,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/locations',
    label: 'By Region & City',
    description: 'Douala, Yaoundé, Buea and all 10 national territories',
    icon: MapPin,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/register/intern',
    label: 'Register & Intern Passport',
    description: 'Fill credentials to get your verified digital passport',
    icon: Award,
    badge: 'Core Feature',
    color: 'text-orange-600 bg-orange-100/90',
  },
];

const ORGANIZATION_MENU: NavMenuItem[] = [
  {
    href: '/companies',
    label: 'Host Enterprises',
    description: 'Recruit, evaluate, and interview matched interns',
    icon: Building2,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/universities',
    label: 'Universities & Faculties',
    description: 'Placement coordination & institutional recruiter mode',
    icon: GraduationCap,
    badge: 'Dual-Mode',
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/how-it-works',
    label: 'How Recruitment Works',
    description: 'End-to-end lifecycle from discovery to onboarding',
    icon: Compass,
    color: 'text-orange-600 bg-orange-100/90',
  },
];

const RESOURCE_MENU: NavMenuItem[] = [
  {
    href: '/pricing',
    label: 'Pricing & Subscriptions',
    description: 'Transparent plans for organizations, 100% free for interns',
    icon: CreditCard,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/resources',
    label: 'Editorial Career Guides',
    description: 'Articles and advice from MANTECH editorial team',
    icon: BookOpen,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/testimonials',
    label: 'Community Stories',
    description: 'Real feedback from placed interns and partner employers',
    icon: Star,
    color: 'text-orange-600 bg-orange-100/90',
  },
  {
    href: '/faq',
    label: 'Help & Knowledge Base',
    description: 'Frequently asked questions and support answers',
    icon: HelpCircle,
    color: 'text-orange-600 bg-orange-100/90',
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

  const roleLabel = userRole ? (ROLE_LABEL[userRole] ?? userRole) : 'Member';

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
              aria-label="MANTECH Nexus Home"
            >
              <Logo size={scrolled ? 135 : 150} />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-x-1 lg:flex">
            {/* 0. Direct Link: Jobs (No hardcoded badge) */}
            <Link
              href="/jobs"
              className={cn(
                'group inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                pathname.startsWith('/jobs')
                  ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                  : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
              )}
            >
              <Briefcase className="h-4 w-4 text-orange-500 group-hover:text-orange-600 transition-colors" />
              <span>Jobs</span>
            </Link>

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
                  <span>Internships</span>
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
                    Find Opportunities
                  </p>
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
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="bg-orange-100 text-orange-700 text-[9px] px-1.5 py-0 border-orange-200 font-bold">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium line-clamp-1 mt-0.5">
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
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                    pathname.startsWith('/companies') || pathname.startsWith('/universities') || pathname.startsWith('/how-it-works')
                      ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                      : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
                  )}
                >
                  <span>Organizations</span>
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
                    Host Enterprises & Academia
                  </p>
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
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="bg-orange-100 text-orange-700 text-[9px] px-1.5 py-0 border-orange-200 font-bold">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium line-clamp-1 mt-0.5">
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
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150',
                    pathname.startsWith('/pricing') || pathname.startsWith('/resources') || pathname.startsWith('/faq')
                      ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                      : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
                  )}
                >
                  <span>Resources</span>
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
                    Platform Insights
                  </p>
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
                          {item.label}
                        </span>
                        <p className="text-[11px] text-slate-700 font-medium line-clamp-1 mt-0.5">
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
                  ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                  : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
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
                  ? 'text-orange-600 bg-orange-100/90 shadow-sm'
                  : 'text-orange-500 hover:bg-orange-50/80 hover:text-orange-600'
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
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-600 shadow-sm transition-all hover:bg-orange-100"
                title="Browse verified Passports"
              >
                <Award className="h-3.5 w-3.5 text-orange-500" />
                <span>Intern Directory</span>
              </Link>
            )}

            {user ? (
              /* Signed-In User Profile Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2.5 rounded-2xl p-1.5 pr-3 bg-orange-50/80 hover:bg-orange-100/90 border border-orange-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    aria-label="User Account Menu"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-xs font-extrabold text-white shadow-sm">
                      {initials}
                    </span>
                    <span className="hidden flex-col items-start text-left leading-tight md:flex">
                      <span className="text-xs font-bold text-orange-600 truncate max-w-[120px]">
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
                  <div className="px-3 py-2.5 bg-orange-50/90 rounded-xl border border-orange-200/70 mb-1.5">
                    <p className="text-xs font-bold text-orange-600">{displayName}</p>
                    <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{roleLabel}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-orange-100" />

                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 hover:bg-orange-50/80 focus:bg-orange-50/80">
                    <Link href={dashboardLink} className="flex items-center gap-2.5 text-xs font-bold text-orange-500 hover:text-orange-600">
                      <LayoutDashboard className="h-4 w-4 text-orange-500" />
                      <span>{roleLabel} Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  {canBrowsePassports && (
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 hover:bg-orange-50/80 focus:bg-orange-50/80">
                      <Link href="/intern-passports" className="flex items-center gap-2.5 text-xs font-bold text-orange-500 hover:text-orange-600">
                        <Award className="h-4 w-4 text-orange-500" />
                        <span>Intern Directory</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {userRole === 'INTERN' && (
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 hover:bg-orange-50/80 focus:bg-orange-50/80">
                      <Link href="/dashboard/intern/passport" className="flex items-center gap-2.5 text-xs font-bold text-orange-500 hover:text-orange-600">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span>My Passport</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 hover:bg-orange-50/80 focus:bg-orange-50/80">
                    <Link href="/settings" className="flex items-center gap-2.5 text-xs font-bold text-orange-500 hover:text-orange-600">
                      <ShieldCheck className="h-4 w-4 text-slate-600" />
                      <span>Security & Privacy</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-orange-100" />

                  <DropdownMenuItem
                    onSelect={() => void signOut()}
                    className="cursor-pointer rounded-xl p-2.5 text-xs font-bold text-red-600 hover:bg-red-50 focus:bg-red-50 flex items-center gap-2.5"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    <span className="relative z-10">Sign In</span>
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
                    <span className="relative z-10">Get Started</span>
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
              aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
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
                    <span>All Cameroon Jobs</span>
                  </Link>
                </div>

                {/* Section 1: Internships */}
                <div className="pt-2 border-t border-orange-100">
                  <div className="px-2.5 py-1 bg-orange-50/90 rounded-lg border border-orange-200/60 mb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                      Internships & Fields
                    </p>
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
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 2: Organizations */}
                <div className="pt-2 border-t border-orange-100">
                  <div className="px-2.5 py-1 bg-orange-50/90 rounded-lg border border-orange-200/60 mb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                      Organizations
                    </p>
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
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 3: Resources & Info */}
                <div className="pt-2 border-t border-orange-100">
                  <div className="px-2.5 py-1 bg-orange-50/90 rounded-lg border border-orange-200/60 mb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                      Resources & Help
                    </p>
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
                        <span>{item.label}</span>
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
                      <span>About MANTECH</span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 text-xs font-bold text-orange-500 hover:text-orange-600"
                    >
                      <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <span>Contact Us</span>
                    </Link>
                  </div>
                </div>

                {canBrowsePassports && (
                  <div className="pt-2 border-t border-orange-100">
                    <div className="px-2.5 py-1 bg-orange-50/90 rounded-lg border border-orange-200/60 mb-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                        Talent Discovery
                      </p>
                    </div>
                    <Link
                      href="/intern-passports"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 text-xs font-bold text-orange-500 hover:text-orange-600"
                    >
                      <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                        <Award className="h-4 w-4" />
                      </div>
                      <span>Intern Directory</span>
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
                        <span>Go to {roleLabel} Dashboard</span>
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
                        <span>Sign Out</span>
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
                          <span className="relative z-10">Sign In</span>
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
                          <span className="relative z-10">Get Started</span>
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

