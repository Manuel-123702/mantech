"use client";
import { Trans, useLingui } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import type { MessageDescriptor } from '@lingui/core';


import { motion } from "framer-motion";
import { LocaleLink as Link } from '@/components/shared/locale-link';
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
const footerLinks: Array<{ heading: MessageDescriptor; headingClass: string; accent: string; links: Array<{ href: string; label: MessageDescriptor }> }> = [
  {
    heading: msg({ message: 'Platform', comment: 'Heading above platform links in the site footer' }),
    accent: 'group-hover:text-blue-200',
    headingClass: 'text-blue-300',
    links: [
      { href: "/about", label: msg({ message: "About Us", comment: "Platform footer link to the about page" }) },
      { href: "/how-it-works", label: msg({ message: "How It Works", comment: "Platform footer link to the product guide" }) },
      { href: "/services", label: msg({ message: "Services", comment: "Platform footer link to the services page" }) },
      { href: "/pricing", label: msg({ message: "Pricing", comment: "Platform footer link to pricing" }) },
      { href: "/install", label: msg({ message: "Download Mobile App", comment: "Platform footer link to the app installation page" }) },
    ],
  },
  {
    heading: msg({ message: 'Discover', comment: 'Heading above marketplace links in the site footer' }),
    accent: 'group-hover:text-cyan-200',
    headingClass: 'text-cyan-300',
    links: [
      { href: "/internships", label: msg({ message: "Find Internships", comment: "Discovery footer link to internships" }) },
      { href: "/companies", label: msg({ message: "Companies", comment: "Discovery footer link to companies" }) },
      { href: "/universities", label: msg({ message: "Universities", comment: "Discovery footer link to universities" }) },
      { href: "/mantech-internship", label: msg({ message: "Internship Portal", comment: "Discovery footer link to the internship portal" }) },
    ],
  },
  {
    heading: msg({ message: 'Resources', comment: 'Heading above resource links in the site footer' }),
    accent: 'group-hover:text-emerald-200',
    headingClass: 'text-emerald-300',
    links: [
      { href: "/resources", label: msg({ message: "Resource Center", comment: "Resources footer link to career guides" }) },
      { href: "/success-stories", label: msg({ message: "Success Stories", comment: "Resources footer link to success stories" }) },
      { href: "/testimonials", label: msg({ message: "Testimonials", comment: "Resources footer link to testimonials" }) },
      { href: "/faq", label: msg({ message: "FAQ", comment: "Resources footer link to frequently asked questions" }) },
    ],
  },
  {
    heading: msg({ message: 'Legal', comment: 'Heading above legal links in the site footer' }),
    accent: 'group-hover:text-violet-200',
    headingClass: 'text-violet-300',
    links: [
      { href: "/security", label: msg({ message: "Security", comment: "Legal footer link to security information" }) },
      { href: "/privacy", label: msg({ message: "Privacy Policy", comment: "Legal footer link to the privacy policy" }) },
      { href: "/terms", label: msg({ message: "Terms of Service", comment: "Legal footer link to the terms" }) },
      { href: "/accessibility", label: msg({ message: "Accessibility", comment: "Legal footer link to accessibility information" }) },
    ],
  },
];

const SOCIAL = APP_CONFIG.socials;
const SUPPORT = APP_CONFIG.support;

const QUART_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Footer() {
  const { t } = useLingui();
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
        className="border-t border-slate-800/80 bg-[#070d18] relative overflow-hidden text-white"
      >
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="container-mantech px-4 py-16 sm:px-6 lg:px-8 relative z-10">
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
                aria-label={t({ message: "ManTech Nexus Home", comment: "footer component aria-label attribute" })}
              >
                <Logo size={210} />
              </Link>

              <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-slate-400">
                <Trans comment="footer p visible text">The national professional internship marketplace connecting interns, accredited companies, and higher education across all 10 regions of Cameroon.
              </Trans></p>

              {/* Free Promise Badge */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <Trans comment="footer span visible text">Internships are free for candidates
                </Trans></span>
              </div>

              {/* Social Channels with authentic Play Store official brand colors */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                {/* LinkedIn */}
                <motion.a
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A66C2] text-white shadow-md shadow-[#0A66C2]/30 hover:brightness-110 transition-all"
                  aria-label={t({ message: "LinkedIn", comment: "footer component aria-label attribute" })}
                  title={t({ message: "Follow MANTECH on LinkedIn", comment: "footer component title attribute" })}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>

                {/* Facebook */}
                <motion.a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-md shadow-[#1877F2]/30 hover:brightness-110 transition-all"
                  aria-label={t({ message: "Facebook", comment: "footer component aria-label attribute" })}
                  title={t({ message: "Follow MANTECH on Facebook", comment: "footer component title attribute" })}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </motion.a>

                {/* Instagram */}
                <motion.a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md shadow-[#dc2743]/30 hover:brightness-110 transition-all"
                  aria-label={t({ message: "Instagram", comment: "footer component aria-label attribute" })}
                  title={t({ message: "Follow MANTECH on Instagram", comment: "footer component title attribute" })}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </motion.a>

                {/* YouTube */}
                <motion.a
                  href={SOCIAL.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/30 hover:brightness-110 transition-all"
                  aria-label={t({ message: "YouTube", comment: "footer component aria-label attribute" })}
                  title={t({ message: "Watch MANTECH on YouTube", comment: "footer component title attribute" })}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </motion.a>

                {/* WhatsApp */}
                <motion.a
                  href={SOCIAL.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-md shadow-[#25D366]/30 hover:brightness-110 transition-all"
                  aria-label={t({ message: "WhatsApp", comment: "footer component aria-label attribute" })}
                  title={t({ message: "Contact MANTECH WhatsApp Concierge", comment: "footer component title attribute" })}
                >
                  <WhatsAppIcon className="h-4 w-4" title={t({ message: "WhatsApp", comment: "footer component title attribute" })} />
                </motion.a>
              </div>
            </motion.div>

            {/* Link columns — staggered entrance */}
            {footerLinks.map((group, colIdx) => (
              <motion.div
                key={group.heading.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: 0.05 + colIdx * 0.05, ease: QUART_OUT }}
              >
                <h3 className={`mb-4 text-xs font-bold uppercase tracking-wider ${group.headingClass}`}>
                  {t(group.heading)}
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
                        {t(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom Copyright & Legal Strip */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              {/* eslint-disable-next-line i18next/no-literal-string -- copyright symbol is a non-linguistic legal mark */}
              {'© '}{new Date().getFullYear()} <Trans comment="footer p visible text">MANTECH Nexus Cameroon. All rights reserved.
            </Trans></p>
            <div className="flex items-center gap-6 text-slate-300">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                <Trans comment="footer Link visible text">Privacy
              </Trans></Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">
                <Trans comment="footer Link visible text">Terms
              </Trans></Link>
              <Link href="/security" className="hover:text-blue-400 transition-colors">
                <Trans comment="footer Link visible text">Security
              </Trans></Link>
              <a
                href={SUPPORT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span><Trans comment="footer span visible text">Support Desk</Trans></span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
