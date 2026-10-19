"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { SubscriptionProcess } from "@/components/pricing/member-plan-section";
import { APP_CONFIG } from "@/lib/config";

/**
 * Four evenly weighted link columns. On the deep-navy footer they share one
 * muted treatment — blue-tinted headings, soft blue links that turn white on
 * hover — so the columns read as structure rather than decoration.
 */
const footerLinks = {
  Platform: {
    accent: 'group-hover:text-blue-200',
    heading: 'text-blue-300',
    links: [
      { href: "/about", label: "About Us" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/services", label: "Services" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  Discover: {
    accent: 'group-hover:text-cyan-200',
    heading: 'text-cyan-300',
    links: [
      { href: "/internships", label: "Find Internships" },
      { href: "/companies", label: "Companies" },
      { href: "/universities", label: "Universities" },
      { href: "/mantech-internship", label: "Internship Portal" },
    ],
  },
  Resources: {
    accent: 'group-hover:text-emerald-200',
    heading: 'text-emerald-300',
    links: [
      { href: "/resources", label: "Resource Center" },
      { href: "/success-stories", label: "Success Stories" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  Legal: {
    accent: 'group-hover:text-violet-200',
    heading: 'text-violet-300',
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

const QUART_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Footer() {
  return (
    <>
      {/*
        How an organization actually gets subscribed. Sits above the footer
        so visitors understand subscription and manual XAF invoicing before leaving.
      */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: QUART_OUT }}
        className="border-t border-slate-200 bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50"
      >
        <div className="container-mantech px-4 py-16 sm:px-6 lg:px-8">
          <SubscriptionProcess />
        </div>
      </motion.section>

      {/* Main Footer Container */}
      <footer className="relative border-t border-blue-900/40 bg-slate-950 text-white overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="container-mantech px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          {/* Top row: Brand & Link Columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6 lg:gap-x-10">
            {/* Brand column */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: QUART_OUT }}
              className="col-span-2 lg:col-span-2 space-y-4"
            >
              <Link
                href="/"
                className="inline-flex items-center rounded-2xl bg-white p-2.5 shadow-md hover:shadow-lg transition-all"
                aria-label="ManTech Nexus Home"
              >
                <Logo size={210} />
              </Link>

              <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-slate-400">
                The national professional internship marketplace connecting interns, accredited companies, and higher education across all 10 regions of Cameroon.
              </p>

              {/* Free Promise Badge */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Internships are free for candidates
                </span>
              </div>

              {/* Social Channels */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                {/* LinkedIn */}
                <motion.a
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 transition-colors hover:bg-blue-600/30 hover:border-blue-500/40 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>

                {/* Facebook */}
                <motion.a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 transition-colors hover:bg-blue-600/30 hover:border-blue-500/40 hover:text-white"
                  aria-label="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </motion.a>

                {/* Instagram */}
                <motion.a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 transition-colors hover:bg-pink-600/30 hover:border-pink-500/40 hover:text-white"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </motion.a>

                {/* YouTube */}
                <motion.a
                  href={SOCIAL.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 transition-colors hover:bg-red-600/30 hover:border-red-500/40 hover:text-white"
                  aria-label="YouTube"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </motion.a>

                {/* WhatsApp */}
                <motion.a
                  href={SOCIAL.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 transition-colors hover:bg-emerald-600/30 hover:border-emerald-500/40 hover:text-white"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon className="h-4 w-4" title="WhatsApp" />
                </motion.a>
              </div>
            </motion.div>

            {/* Link columns — staggered entrance */}
            {Object.entries(footerLinks).map(([category, group], colIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: 0.05 + colIdx * 0.05, ease: QUART_OUT }}
              >
                <h3 className={`mb-4 text-xs font-bold uppercase tracking-wider ${group.heading}`}>
                  {category}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`group inline-flex items-center text-xs sm:text-sm text-orange-200 transition-colors ${group.accent}`}
                      >
                        <span
                          aria-hidden="true"
                          className="mr-0 h-px w-0 bg-current opacity-60 transition-all duration-200 group-hover:mr-2 group-hover:w-2.5"
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Regional Network Telemetry Banner */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-slate-300">
                Cameroon Systems Active
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Littoral • Centre • West • North-West • South-West • North • Far North • Adamawa • South • East</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>Bilingual: Français & English</span>
              <span className="text-slate-600">•</span>
              <span>Currency: XAF (FCFA)</span>
            </div>
          </div>

          {/* Bottom Copyright & Legal Strip */}
          <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-orange-300">
            <p>
              &copy; {new Date().getFullYear()} MANTECH Nexus Cameroon. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">
                Terms
              </Link>
              <Link href="/security" className="hover:text-slate-300 transition-colors">
                Security
              </Link>
              <a
                href={SUPPORT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                {SUPPORT.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

