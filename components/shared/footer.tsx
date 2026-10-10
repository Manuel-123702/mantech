"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ArrowRight, Mail } from "lucide-react";
import { SubscriptionProcess } from "@/components/pricing/member-plan-section";
import { APP_CONFIG } from "@/lib/config";

/**
 * Four evenly weighted link columns. On the deep-navy footer they share one
 * muted treatment — blue-tinted headings, soft blue links that turn white on
 * hover — so the columns read as structure rather than decoration.
 */
const footerLinks = {
  Platform: {
    accent: 'group-hover:text-white',
    heading: 'text-blue-100',
    links: [
      { href: "/about", label: "About Us" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/services", label: "Services" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  Discover: {
    accent: 'group-hover:text-white',
    heading: 'text-blue-100',
    links: [
      { href: "/internships", label: "Find Internships" },
      { href: "/companies", label: "Companies" },
      { href: "/universities", label: "Universities" },
      { href: "/mantech-internship", label: "Internship Portal" },
    ],
  },
  Resources: {
    accent: 'group-hover:text-white',
    heading: 'text-blue-100',
    links: [
      { href: "/resources", label: "Resource Center" },
      { href: "/success-stories", label: "Success Stories" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  Legal: {
    accent: 'group-hover:text-white',
    heading: 'text-blue-100',
    links: [
      { href: "/security", label: "Security" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
};

const SOCIAL = APP_CONFIG.socials;
const SUPPORT = APP_CONFIG.support;

export function Footer() {
  return (
    <>
      {/*
        How an organization actually gets subscribed. It sits directly above the
        footer because it is the last thing to read before leaving the page, and
        it is the piece that was missing: prices alone do not tell a visitor what
        to do next.
      */}
      <section className="border-t border-blue-950/10 bg-gradient-to-b from-white to-blue-50/60">
        <div className="container-mantech px-4 py-14 sm:px-6 lg:px-8">
          <SubscriptionProcess />
        </div>
      </section>

      <footer className="border-t border-blue-950/10 bg-blue-950">
        <div className="container-mantech px-4 py-16 sm:px-6 lg:px-8">
          {/* The brand gets a full column of its own on wide screens, so the
              four link groups line up in an even row beside it. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-6 lg:gap-x-10">
            <div className="col-span-2 lg:col-span-2">
              <Link
                href="/"
                className="inline-flex items-center rounded-2xl bg-white p-2.5 shadow-sm"
                aria-label="ManTech Nexus Home"
              >
                <Logo size={220} />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-blue-100/75">
                The professional internship marketplace connecting interns,
                companies, and institutions across Cameroon.
              </p>
              {/* The one promise worth repeating. */}
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                Internships are free for members
              </p>
            <div className="mt-6 flex gap-3">
              {/* LinkedIn - Real Brand Icon (Blue: #0077B5) */}
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-100 transition-colors hover:bg-white/20"
                aria-label="LinkedIn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              {/* Facebook - Real Brand Icon (Blue: #1877F2) */}
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-100 transition-colors hover:bg-white/20"
                aria-label="Facebook"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram - Real Brand Icon (Gradient: #E4405F to #C13584) */}
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-100 transition-colors hover:bg-white/20"
                aria-label="Instagram"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube - Real Brand Icon (Red: #FF0000) */}
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-100 transition-colors hover:bg-white/20"
                aria-label="YouTube"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* GitHub - Real Brand Icon (Dark: #333) */}
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-100 transition-colors hover:bg-white/20"
                aria-label="GitHub"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              {/* Email */}
              <a
                href={`mailto:${SUPPORT.email}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-100 transition-colors hover:bg-white/20"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, group]) => (
            <div key={category}>
              <h3
                className={`mb-4 text-xs font-bold uppercase tracking-wider ${group.heading}`}
              >
                {category}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`group inline-flex items-center text-sm text-blue-200/80 transition-colors hover:text-white ${group.accent}`}
                    >
                      {/* A short rule grows on hover, so the link reads as
                          clickable without adding noise to the column. */}
                      <span
                        aria-hidden="true"
                        className="mr-0 h-px w-0 bg-current transition-all duration-200 group-hover:mr-2 group-hover:w-3"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-blue-200/60">
            &copy; {new Date().getFullYear()} MANTECH Nexus. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-blue-200/60">
            <a
              href={`mailto:${SUPPORT.email}`}
              className="transition-colors hover:text-white"
            >
              {SUPPORT.email}
            </a>
          </div>
        </div>
        </div>
      </footer>
    </>
  );
}
