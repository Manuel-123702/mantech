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
    label: "My Intern Passport",
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
    return pathname.startsWith(href);
  };

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const active = isActive(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
