"""
seg1.py: Imports and shared constants
"""
SEG1 = """'use client';

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

"""
