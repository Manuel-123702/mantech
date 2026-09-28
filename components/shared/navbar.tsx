'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, GraduationCap, Building2 } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/internships', label: 'Internships' },
];

const dropdownLinks = [
  {
    label: 'Organizations',
    items: [
      { href: '/companies', label: 'Companies', icon: Building2 },
      { href: '/universities', label: 'Universities', icon: GraduationCap },
    ],
  },
  {
    label: 'Resources',
    items: [
      { href: '/pricing', label: 'Pricing', icon: null },
      { href: '/resources', label: 'Resources', icon: null },
      { href: '/contact', label: 'Contact', icon: null },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const dashboardLink = profile ? `/dashboard/${profile.role}` : null;
  const isCareerPassportEligible = profile && ['student', 'company', 'university'].includes(profile.role);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl transition-all duration-300',
        scrolled && 'bg-white shadow-md'
      )}
    >
      <nav className="container-mantech mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center space-x-3" aria-label="ManTech Nexus Home">
            <Logo size={150} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
                  pathname === link.href && 'bg-blue-50 text-blue-700'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown Menus */}
            {dropdownLinks.map((dropdown) => (
              <DropdownMenu key={dropdown.label}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                    <span>{dropdown.label}</span>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 border-slate-200 bg-white p-1.5 shadow-lg">
                  {dropdown.items.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm',
                          pathname === item.href ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-800 hover:text-blue-600 hover:bg-blue-50'
                        )}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            {/* Divider */}
            <div className="mx-2 h-6 w-px bg-slate-200" />

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/mantech-internship">
                  <Button variant="ghost" size="sm" className="text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950">
                    Portal
                  </Button>
                </Link>
                {isCareerPassportEligible && (
                  <Link href="/career-passport" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                      Career Passport
                    </Button>
                  </Link>
                )}
                {dashboardLink && (
                  <Link href={dashboardLink}>
                    <Button size="sm" className="bg-blue-700 text-sm font-semibold text-white shadow-sm hover:bg-blue-800">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0 hover:bg-slate-100">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800 ring-1 ring-blue-200">
                        {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{profile?.full_name}</p>
                      <p className="text-xs text-slate-600 capitalize">{profile?.role}</p>
                    </div>
                    {dashboardLink && (
                      <DropdownMenuItem asChild>
                        <Link href={dashboardLink} className="cursor-pointer text-slate-800 hover:text-blue-600 hover:bg-blue-50">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer text-slate-800 hover:text-blue-600 hover:bg-blue-50">
                        <User className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 hover:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-blue-700 text-sm font-semibold text-white shadow-sm hover:bg-blue-800">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            id="mobile-navigation"
            className="border-t border-slate-200 bg-white shadow-lg lg:hidden"
          >
            <div className="mx-auto max-h-[calc(100vh-6rem)] max-w-7xl space-y-6 overflow-y-auto px-4 py-6 sm:px-6">
              {/* Main Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'block rounded-lg px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
                      pathname === link.href
                        ? 'bg-blue-50 text-blue-800'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-blue-700'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Dropdown Sections */}
              {dropdownLinks.map((dropdown) => (
                <div key={dropdown.label} className="space-y-1">
                  <p className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {dropdown.label}
                  </p>
                  {dropdown.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
                        pathname === item.href
                          ? 'bg-blue-50 text-blue-800'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-blue-700'
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}

              {/* Auth Section */}
              <div className="border-t border-slate-200 pt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-slate-50 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{profile?.full_name}</p>
                      <p className="text-xs capitalize text-slate-600">{profile?.role}</p>
                    </div>
                    {dashboardLink && (
                      <Link href={dashboardLink}>
                        <Button variant="outline" size="sm" className="w-full">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="sm" className="w-full text-red-700 hover:bg-red-50 hover:text-red-800" onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/sign-in" className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" className="block">
                      <Button size="sm" className="w-full bg-gradient-mantech">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
