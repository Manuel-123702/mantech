'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Menu,
  ChevronDown,
  LogIn,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Building2,
  Compass,
  CreditCard,
  BookOpen,
  MapPin,
  Award,
  HelpCircle,
  MessageCircle,
  FileText,
  User,
  ShieldCheck,
  Briefcase,
  Star,
  ExternalLink,
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
import { FloatingBadge } from '@/components/shared/section-animations';

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
    color: 'text-blue-600 bg-blue-50',
  },
  {
    href: '/fields',
    label: 'Browse by Field',
    description: 'IT, Engineering, Finance, Law, Marketing & Healthcare',
    icon: Compass,
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    href: '/locations',
    label: 'By Region & City',
    description: 'Douala, Yaoundé, Buea and all 10 national territories',
    icon: MapPin,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    href: '/dashboard/intern/passport',
    label: 'Intern Passport',
    description: 'Verifiable digital credential for candidates',
    icon: Award,
    badge: 'Core Feature',
    color: 'text-amber-600 bg-amber-50',
  },
];

const ORGANIZATION_MENU: NavMenuItem[] = [
  {
    href: '/companies',
    label: 'Host Enterprises',
    description: 'Recruit, evaluate, and interview matched interns',
    icon: Building2,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    href: '/universities',
    label: 'Universities & Faculties',
    description: 'Placement coordination & institutional recruiter mode',
    icon: GraduationCap,
    badge: 'Dual-Mode',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    href: '/how-it-works',
    label: 'How Recruitment Works',
    description: 'End-to-end lifecycle from discovery to onboarding',
    icon: Compass,
    color: 'text-purple-600 bg-purple-50',
  },
];

const RESOURCE_MENU: NavMenuItem[] = [
  {
    href: '/pricing',
    label: 'Pricing & Subscriptions',
    description: 'Transparent plans for organizations, 100% free for interns',
    icon: CreditCard,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    href: '/resources',
    label: 'Editorial Career Guides',
    description: 'Articles and advice from MANTECH editorial team',
    icon: BookOpen,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    href: '/testimonials',
    label: 'Community Stories',
    description: 'Real feedback from placed interns and partner employers',
    icon: Star,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    href: '/faq',
    label: 'Help & Knowledge Base',
    description: 'Frequently asked questions and support answers',
    icon: HelpCircle,
    color: 'text-slate-600 bg-slate-100',
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

  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'My Account';

  const initials =
    `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() ||
    displayName.charAt(0).toUpperCase();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-slate-200/80 bg-white/90 shadow-[0_4px_30px_-5px_rgba(15,23,42,0.08)] backdrop-blur-xl'
          : 'border-b border-slate-200/40 bg-white/70 backdrop-blur-md'
      )}
    >
      <nav className="container-mantech mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-300',
            scrolled ? 'h-16' : 'h-20'
          )}
        >
          {/* Logo & Cameroon Identity Tag */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-transform hover:scale-[1.01]"
              aria-label="MANTECH Nexus Home"
            >
              <Logo size={scrolled ? 135 : 150} />
            </Link>

            <FloatingBadge className="hidden xl:inline-flex">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 shadow-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CAMEROON #1
              </span>
            </FloatingBadge>
          </div>

          {/* Desktop Navigation Links with Animated Mega Dropdowns */}
          <div className="hidden items-center gap-x-1 lg:flex">
            {/* 1. Internships Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150',
                    'hover:bg-slate-100/80 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                    pathname.startsWith('/internships') || pathname.startsWith('/fields') || pathname.startsWith('/locations')
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-700'
                  )}
                >
                  <span>Internships</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                className="w-80 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Find Opportunities
                  </p>
                </div>
                {INTERNSHIP_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0 border-amber-200 font-semibold">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 2. Organizations Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150',
                    'hover:bg-slate-100/80 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                    pathname.startsWith('/companies') || pathname.startsWith('/universities')
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-700'
                  )}
                >
                  <span>Organizations</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                className="w-80 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Host Enterprises & Academia
                  </p>
                </div>
                {ORGANIZATION_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0 border-emerald-200 font-semibold">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 3. Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150',
                    'hover:bg-slate-100/80 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                    pathname.startsWith('/pricing') || pathname.startsWith('/resources') || pathname.startsWith('/faq')
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-700'
                  )}
                >
                  <span>Resources</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                className="w-80 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Platform Insights
                  </p>
                </div>
                {RESOURCE_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
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
                'rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors',
                pathname === '/about'
                  ? 'text-blue-700 bg-blue-50/60'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-blue-700'
              )}
            >
              About
            </Link>

            {/* 5. Direct Link: Contact */}
            <Link
              href="/contact"
              className={cn(
                'rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors',
                pathname === '/contact'
                  ? 'text-blue-700 bg-blue-50/60'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-blue-700'
              )}
            >
              Contact
            </Link>
          </div>

          {/* Right-Side Actions: WhatsApp Concierge + User Auth Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick WhatsApp Support Pill */}
            <a
              href={waSupportLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-300/80 bg-emerald-50/80 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-sm"
              title="Chat with MANTECH Support on WhatsApp"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {user ? (
              /* Signed-In User Profile Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2.5 rounded-2xl p-1.5 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="User Account Menu"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-extrabold text-white shadow-sm">
                      {initials}
                    </span>
                    <span className="hidden flex-col items-start text-left leading-tight md:flex">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                        {displayName}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-600">
                        {roleLabel}
                      </span>
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-64 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl"
                >
                  <DropdownMenuLabel className="px-3 py-2.5 bg-slate-50 rounded-xl mb-1">
                    <p className="text-xs font-bold text-slate-900">{displayName}</p>
                    <p className="text-[11px] font-semibold text-blue-600 mt-0.5">{roleLabel}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 focus:bg-blue-50">
                    <Link href={dashboardLink} className="flex items-center gap-2.5 text-xs font-semibold text-slate-900">
                      <LayoutDashboard className="h-4 w-4 text-blue-600" />
                      <span>{roleLabel} Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  {userRole === 'INTERN' && (
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 focus:bg-amber-50">
                      <Link href="/dashboard/intern/passport" className="flex items-center gap-2.5 text-xs font-semibold text-slate-900">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span>My Intern Passport</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 focus:bg-slate-50">
                    <Link href="/settings" className="flex items-center gap-2.5 text-xs font-semibold text-slate-900">
                      <ShieldCheck className="h-4 w-4 text-slate-500" />
                      <span>Security & Privacy</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={() => void signOut()}
                    className="cursor-pointer rounded-xl p-2.5 text-xs font-semibold text-red-600 focus:bg-red-50 flex items-center gap-2.5"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Signed-Out Call-to-Actions */
              <div className="flex items-center gap-2">
                {/* Quick access to the four role dashboards */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 px-3 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      <span>Dashboards</span>
                      <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 rounded-2xl border-slate-200 p-2 shadow-xl"
                  >
                    <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Choose your workspace
                    </DropdownMenuLabel>
                    {[
                      {
                        href: '/dashboard/intern',
                        label: 'Intern Dashboard',
                        icon: GraduationCap,
                      },
                      {
                        href: '/dashboard/company',
                        label: 'Company Dashboard',
                        icon: Building2,
                      },
                      {
                        href: '/dashboard/university',
                        label: 'University Dashboard',
                        icon: BookOpen,
                      },
                      {
                        href: '/dashboard/admin',
                        label: 'Admin Control Center',
                        icon: ShieldCheck,
                      },
                    ].map((item) => (
                      <DropdownMenuItem
                        key={item.href}
                        asChild
                        className="cursor-pointer rounded-xl p-2.5 focus:bg-slate-50"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2.5 text-xs font-semibold text-slate-900"
                        >
                          <item.icon className="h-4 w-4 text-slate-500" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 px-4 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl"
                  >
                    <LogIn className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation with Smooth Backdrop Blur */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />

            <motion.div
              className="fixed inset-x-0 top-16 z-50 flex flex-col bg-white border-b border-slate-200 shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="p-4 space-y-4">
                {/* Mobile Quick Action Link */}
                <div className="flex items-center gap-2">
                  <a
                    href={waSupportLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-bold text-emerald-800"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>

                {/* Section 1: Internships */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    Internships & Fields
                  </p>
                  <div className="space-y-1">
                    {INTERNSHIP_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800"
                      >
                        <item.icon className="h-4 w-4 text-blue-600" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge className="ml-auto text-[9px] bg-amber-100 text-amber-800">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 2: Organizations */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    Organizations
                  </p>
                  <div className="space-y-1">
                    {ORGANIZATION_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800"
                      >
                        <item.icon className="h-4 w-4 text-emerald-600" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 3: Resources & Info */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    Resources & Help
                  </p>
                  <div className="space-y-1">
                    {RESOURCE_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800"
                      >
                        <item.icon className="h-4 w-4 text-purple-600" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <Link
                      href="/about"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800"
                    >
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <span>About MANTECH</span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800"
                    >
                      <MessageCircle className="h-4 w-4 text-slate-500" />
                      <span>Contact Us</span>
                    </Link>
                  </div>
                </div>

                {/* Mobile Auth Actions */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  {user ? (
                    <>
                      <Link
                        href={dashboardLink}
                        onClick={closeMobile}
                        className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-blue-600 text-white font-bold text-xs"
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
                        className="w-full text-xs text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Sign Out</span>
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/sign-in" onClick={closeMobile}>
                        <Button className="w-full text-xs font-bold bg-blue-600 text-white">
                          <LogIn className="w-3.5 h-3.5 mr-1.5" />
                          Sign In
                        </Button>
                      </Link>
                      <p className="pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Dashboards
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href="/dashboard/intern" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            Intern
                          </Button>
                        </Link>
                        <Link href="/dashboard/company" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            Company
                          </Button>
                        </Link>
                        <Link href="/dashboard/university" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            University
                          </Button>
                        </Link>
                        <Link href="/dashboard/admin" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            Admin
                          </Button>
                        </Link>
                      </div>
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
