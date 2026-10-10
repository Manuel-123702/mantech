'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
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
    color: 'text-blue-800 bg-blue-50/70',
  },
  {
    href: '/fields',
    label: 'Browse by Field',
    description: 'IT, Engineering, Finance, Law, Marketing & Healthcare',
    icon: Compass,
    color: 'text-blue-800 bg-blue-50/70',
  },
  {
    href: '/locations',
    label: 'By Region & City',
    description: 'Douala, Yaoundé, Buea and all 10 national territories',
    icon: MapPin,
    color: 'text-blue-800 bg-blue-50/70',
  },
  {
    href: '/dashboard/intern/passport',
    label: 'Intern Passport',
    description: 'Verifiable digital credential for candidates',
    icon: Award,
    badge: 'Core Feature',
    color: 'text-blue-800 bg-blue-50/70',
  },
];

const ORGANIZATION_MENU: NavMenuItem[] = [
  {
    href: '/companies',
    label: 'Host Enterprises',
    description: 'Recruit, evaluate, and interview matched interns',
    icon: Building2,
    color: 'text-blue-800 bg-blue-50/70',
  },
  {
    href: '/universities',
    label: 'Universities & Faculties',
    description: 'Placement coordination & institutional recruiter mode',
    icon: GraduationCap,
    badge: 'Dual-Mode',
    color: 'text-blue-800 bg-blue-50/70',
  },
  {
    href: '/how-it-works',
    label: 'How Recruitment Works',
    description: 'End-to-end lifecycle from discovery to onboarding',
    icon: Compass,
    color: 'text-blue-800 bg-blue-50/70',
  },
];

const RESOURCE_MENU: NavMenuItem[] = [
  {
    href: '/pricing',
    label: 'Pricing & Subscriptions',
    description: 'Transparent plans for organizations, 100% free for interns',
    icon: CreditCard,
    color: 'text-blue-800 bg-blue-50/70',
  },
  {
    href: '/resources',
    label: 'Editorial Career Guides',
    description: 'Articles and advice from MANTECH editorial team',
    icon: BookOpen,
    color: 'text-blue-800 bg-blue-50/70',
  },
  {
    href: '/testimonials',
    label: 'Community Stories',
    description: 'Real feedback from placed interns and partner employers',
    icon: Star,
    color: 'text-blue-800 bg-blue-50/70',
  },
  {
    href: '/faq',
    label: 'Help & Knowledge Base',
    description: 'Frequently asked questions and support answers',
    icon: HelpCircle,
    color: 'text-blue-800 bg-blue-50/70',
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

  // The Intern Passport directory is open to every signed-in member;
  // signed-out visitors never see its entry points.
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

  /**
   * Desktop menus open on hover (not click): pointing at a link reveals its
   * panel immediately, with a short grace period so the cursor can travel
   * across the gap into the panel without it closing. Click and keyboard
   * users still work because Radix fires onOpenChange too.
   */
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
          ? 'border-b border-blue-950/10 bg-white/1 shadow-[0_4px_30px_-8px_rgba(11,23,44,0.10)] backdrop-blur-xl'
          : 'border-b border-blue-950/[0.06] bg-white/1 backdrop-blur-md'
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

          </div>

          {/* Desktop Navigation Links with Animated Mega Dropdowns */}
          <div className="hidden items-center gap-x-1 lg:flex">
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
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150',
                    'hover:bg-orange-300 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
                    pathname.startsWith('/internships') || pathname.startsWith('/fields') || pathname.startsWith('/locations')
                      ? 'text-orange-500'
                      : 'text-orange-500'
                  )}
                >
                  <span>Internships</span>
                  <ChevronDown className="h-3.5 w-3.5 text-orange-500 group-hover:text-orange-300 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('internships')}
                onMouseLeave={scheduleNavClose}
                className="w-80 rounded-2xl border border-blue-950/10 bg-white/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-blue-950/[0.07] mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-950/45">
                    Find Opportunities
                  </p>
                </div>
                {INTERNSHIP_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-blue-50/60 transition-colors group"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-950 group-hover:text-blue-700 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="bg-blue-50/80 text-blue-700 text-[9px] px-1.5 py-0 border-blue-100 font-semibold">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-blue-950/55 line-clamp-1 mt-0.5">
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
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150',
                    'hover:bg-orange-300 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
                    pathname.startsWith('/companies') || pathname.startsWith('/universities')
                      ? 'text-orange-500'
                      : 'text-orange-500'
                  )}
                >
                  <span>Organizations</span>
                  <ChevronDown className="h-3.5 w-3.5 text-orange-500 group-hover:text-orange-300 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('organizations')}
                onMouseLeave={scheduleNavClose}
                className="w-80 rounded-2xl border border-blue-950/10 bg-white/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-blue-950/[0.07] mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-950/45">
                    Host Enterprises & Academia
                  </p>
                </div>
                {ORGANIZATION_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-blue-50/60 transition-colors group"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-950 group-hover:text-blue-700 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="bg-blue-50/80 text-blue-700 text-[9px] px-1.5 py-0 border-blue-100 font-semibold">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-blue-950/55 line-clamp-1 mt-0.5">
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
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150',
                    'hover:bg-orange-300 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
                    pathname.startsWith('/pricing') || pathname.startsWith('/resources') || pathname.startsWith('/faq')
                      ? 'text-orange-500'
                      : 'text-orange-500'
                  )}
                >
                  <span>Resources</span>
                  <ChevronDown className="h-3.5 w-3.5 text-orange-500 group-hover:text-orange-300 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                onMouseEnter={() => openNavMenu('resources')}
                onMouseLeave={scheduleNavClose}
                className="w-80 rounded-2xl border border-blue-950/10 bg-white/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-blue-950/[0.07] mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-950/45">
                    Platform Insights
                  </p>
                </div>
                {RESOURCE_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-blue-50/60 transition-colors group"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-blue-950 group-hover:text-blue-700 transition-colors">
                          {item.label}
                        </span>
                        <p className="text-[11px] text-blue-950/55 line-clamp-1 mt-0.5">
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
                  ? 'text-orange-500'
                  : 'text-orange-500 hover:bg-orange-300 hover:text-blue-800'
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
                  ? 'text-orange-500'
                  : 'text-orange-500 hover:bg-orange-300 hover:text-blue-800'
              )}
            >
              Contact
            </Link>
          </div>

          {/* Right-Side Actions: WhatsApp Concierge + User Auth Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Intern Passports directory — signed-in recruiters only */}
            {canBrowsePassports && (
              <Link
                href="/intern-passports"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-blue-950/15 bg-blue-50/60 px-5 py-4 text-xs font-bold text-blue-700 shadow-sm transition-all hover:border-blue-800/25 hover:bg-blue-100/70"
                title="Browse verified Intern Passports"
              >
                <Award className="h-3.5 w-3.5" />
                <span>Passports</span>
              </Link>
            )}


            {user ? (
              /* Signed-In User Profile Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2.5 rounded-2xl p-1.5 pr-3 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-950/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="User Account Menu"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-800 text-xs font-extrabold text-white shadow-sm">
                      {initials}
                    </span>
                    <span className="hidden flex-col items-start text-left leading-tight md:flex">
                      <span className="text-xs font-bold text-blue-950 truncate max-w-[120px]">
                        {displayName}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-700">
                        {roleLabel}
                      </span>
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-blue-950/40" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-64 rounded-2xl border border-blue-950/10 bg-white p-1.5 shadow-2xl"
                >
                  <DropdownMenuLabel className="px-3 py-2.5 bg-blue-50/70 rounded-xl mb-1">
                    <p className="text-xs font-bold text-blue-950">{displayName}</p>
                    <p className="text-[11px] font-semibold text-blue-700 mt-0.5">{roleLabel}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 focus:bg-blue-50">
                    <Link href={dashboardLink} className="flex items-center gap-2.5 text-xs font-semibold text-blue-950">
                      <LayoutDashboard className="h-4 w-4 text-blue-700" />
                      <span>{roleLabel} Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  {canBrowsePassports && (
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 focus:bg-blue-50">
                      <Link href="/intern-passports" className="flex items-center gap-2.5 text-xs font-semibold text-blue-950">
                        <Award className="h-4 w-4 text-blue-700" />
                        <span>Intern Passports</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {userRole === 'INTERN' && (
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 focus:bg-amber-50">
                      <Link href="/dashboard/intern/passport" className="flex items-center gap-2.5 text-xs font-semibold text-blue-950">
                        <Award className="h-4 w-4 text-amber-700" />
                        <span>My Intern Passport</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 focus:bg-blue-50">
                    <Link href="/settings" className="flex items-center gap-2.5 text-xs font-semibold text-blue-950">
                      <ShieldCheck className="h-4 w-4 text-blue-950/55" />
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
                      className="h-10 px-3 text-xs font-bold text-blue-950/85 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-blue-950/50" />
                      <span>Dashboards</span>
                      <ChevronDown className="w-3.5 h-3.5 ml-1 text-blue-950/40" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 rounded-2xl border border-blue-950/10 bg-white p-2 shadow-xl backdrop-blur-xl"
                  >
                    <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-blue-950/45">
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
                        className="cursor-pointer rounded-xl p-2.5 focus:bg-blue-50/60"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2.5 text-xs font-semibold text-blue-950"
                        >
                          <item.icon className="h-4 w-4 text-blue-950/55" />
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
                    className="h-10 px-4 text-xs font-bold text-blue-950/85 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl"
                  >
                    <LogIn className="w-3.5 h-3.5 mr-1.5 text-blue-950/50" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-blue-950 hover:bg-blue-50/70 lg:hidden"
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
              className="fixed inset-0 z-40 bg-blue-950/30 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />

            <motion.div
              className={`fixed inset-x-0 ${scrolled ? 'top-16' : 'top-20'} z-50 flex flex-col border-b border-blue-950/10 bg-white/95 shadow-2xl backdrop-blur-xl lg:hidden max-h-[85vh] overflow-y-auto`}
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
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-50/70 border border-emerald-800/20 p-2.5 text-xs font-bold text-emerald-900"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>

                {/* Section 1: Internships */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-950/45 px-2 mb-1.5">
                    Internships & Fields
                  </p>
                  <div className="space-y-1">
                    {INTERNSHIP_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 text-xs font-semibold text-blue-950"
                      >
                        <item.icon className="h-4 w-4 text-blue-700" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge className="ml-auto text-[9px] bg-blue-50/80 text-blue-700">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 2: Organizations */}
                <div className="pt-2 border-t border-blue-950/[0.07]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-950/45 px-2 mb-1.5">
                    Organizations
                  </p>
                  <div className="space-y-1">
                    {ORGANIZATION_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 text-xs font-semibold text-blue-950"
                      >
                        <item.icon className="h-4 w-4 text-blue-700" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 3: Resources & Info */}
                <div className="pt-2 border-t border-blue-950/[0.07]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-950/45 px-2 mb-1.5">
                    Resources & Help
                  </p>
                  <div className="space-y-1">
                    {RESOURCE_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 text-xs font-semibold text-blue-950"
                      >
                        <item.icon className="h-4 w-4 text-blue-700" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <Link
                      href="/about"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 text-xs font-semibold text-blue-950"
                    >
                      <Building2 className="h-4 w-4 text-blue-950/55" />
                      <span>About MANTECH</span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 text-xs font-semibold text-blue-950"
                    >
                      <MessageCircle className="h-4 w-4 text-blue-950/55" />
                      <span>Contact Us</span>
                    </Link>
                  </div>
                </div>

                {canBrowsePassports && (
                  <div className="pt-2 border-t border-blue-950/[0.07]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-950/45 px-2 mb-1.5">
                      Talent Discovery
                    </p>
                    <Link
                      href="/intern-passports"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 text-xs font-semibold text-blue-950"
                    >
                      <Award className="h-4 w-4 text-blue-700" />
                      <span>Intern Passports</span>
                    </Link>
                  </div>
                )}

                {/* Mobile Auth Actions */}
                <div className="pt-3 border-t border-blue-950/10 space-y-2">
                  {user ? (
                    <>
                      <Link
                        href={dashboardLink}
                        onClick={closeMobile}
                        className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
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
                        <Button className="w-full text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white">
                          <LogIn className="w-3.5 h-3.5 mr-1.5" />
                          Sign In
                        </Button>
                      </Link>
                      <p className="pt-2 text-[11px] font-bold uppercase tracking-wider text-blue-950/45">
                        Dashboards
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href="/dashboard/intern" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-blue-950/55" />
                            Intern
                          </Button>
                        </Link>
                        <Link href="/dashboard/company" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <Building2 className="w-3.5 h-3.5 mr-1.5 text-blue-950/55" />
                            Company
                          </Button>
                        </Link>
                        <Link href="/dashboard/university" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-950/55" />
                            University
                          </Button>
                        </Link>
                        <Link href="/dashboard/admin" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-blue-950/55" />
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
