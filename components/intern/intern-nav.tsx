"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Heart,
  Bell,
  Settings,
  User,
  Search,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard/intern", label: "Overview", icon: LayoutDashboard },
  { href: "/internships", label: "Browse Internships", icon: Search },
  { href: "/jobs", label: "Browse Jobs", icon: Briefcase },
  {
    href: "/dashboard/intern/applications",
    label: "My Applications",
    icon: FileText,
  },
  {
    href: "/dashboard/intern/saved",
    label: "Saved Opportunities",
    icon: Heart,
  },
  {
    href: "/dashboard/intern/passport",
    label: "My Passport",
    icon: User,
  },
  {
    href: "/dashboard/intern/history",
    label: "My Journey",
    icon: History,
  },
  {
    href: "/dashboard/intern/notifications",
    label: "Notifications",
    icon: Bell,
  },
  { href: "/dashboard/intern/settings", label: "Settings", icon: Settings },
];

export function InternNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard/intern") return pathname === href;
    if (href === "/internships") {
      return pathname === href || pathname.startsWith("/internships/");
    }
    if (href === "/jobs") {
      return pathname === href || pathname.startsWith("/jobs/");
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex flex-row lg:flex-col gap-1.5 lg:gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
      {links.map((link) => {
        const active = isActive(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 lg:gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0",
              active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold hover:bg-blue-500 hover:text-white"
                : "bg-slate-800/40 lg:bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50 lg:border-0",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
