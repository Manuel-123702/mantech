'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Eye,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export function HeroInternPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-lg mx-auto lg:max-w-none"
    >
      {/* Dynamic Ambient Aurora Breathing Glow behind card */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-cyan-500/30 via-blue-600/25 to-violet-600/30 blur-2xl -z-10 pointer-events-none"
      />

      {/* Main Glassmorphic Card Container with subtle 3D hover physics */}
      <motion.div
        whileHover={{
          y: -5,
          rotateY: 2,
          rotateX: -1,
          transition: { type: 'spring', stiffness: 350, damping: 20 },
        }}
        className="relative rounded-3xl border border-white/20 bg-slate-900/85 backdrop-blur-2xl p-2 sm:p-2.5 shadow-[0_20px_60px_-15px_rgba(2,6,23,0.9)] overflow-visible"
      >
        {/* Fake Browser OS Chrome Header with Live SSL Beacon */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 bg-slate-950/50 rounded-2xl mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90 shadow-xs" />
          </div>

          <div className="flex-1 max-w-[280px] sm:max-w-[320px] mx-3 h-6 rounded-lg bg-slate-900/90 border border-slate-700/60 text-[10px] text-slate-300 flex items-center justify-between px-2.5 font-mono shadow-inner">
            <div className="flex items-center gap-1.5 truncate">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate text-slate-200">
                app.mantech-nexus.cm/dashboard/intern
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-emerald-400 font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TLS 1.3
            </span>
          </div>

          <div className="w-6" />
        </div>

        {/* Dashboard Content Interior */}
        <div className="p-3 sm:p-5 space-y-4">
          {/* Header Row: Student Identity & Privacy Status */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 text-sm font-black shadow-lg shadow-cyan-500/25">
                  MN
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-white font-bold truncate flex items-center gap-1.5">
                  <span>Intern Profile Preview</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  BSc Software Engineering • UY1 (Yaoundé)
                </div>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1 shrink-0 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Privacy Controlled</span>
            </div>
          </div>

          {/* Placement Readiness Banner with Animated Progress */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-950/60 via-slate-900/90 to-cyan-950/40 border border-blue-500/30 p-4 space-y-2.5 relative overflow-hidden group/bar">
            {/* Shimmer sweep inside readiness card */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatDelay: 4,
                ease: 'easeInOut',
              }}
              className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent pointer-events-none"
            />

            <div className="flex justify-between items-center text-[10px]">
              <span className="text-cyan-300 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Professional Profile
              </span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Profile visibility: verified
              </span>
            </div>

            <div>
              <div className="text-xs sm:text-sm text-white font-extrabold">
                Qualification, Field & Validated Skills
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Littoral & Centre internship preferences
              </div>
            </div>

            {/* Kinetic Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-slate-800/90 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{
                    duration: 1.4,
                    delay: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 relative overflow-hidden"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  />
                </motion.div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                <span>CV access is separately authorized</span>
                <span className="font-mono text-cyan-300 font-extrabold text-xs">
                  85% Ready
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics 3-Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-center transition-all hover:border-cyan-500/40"
            >
              <div className="text-lg sm:text-xl font-extrabold text-white font-mono flex items-center justify-center gap-1">
                <span>32</span>
                <Eye className="w-3 h-3 text-cyan-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                Profile views
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-center transition-all hover:border-amber-500/40"
            >
              <div className="text-lg sm:text-xl font-extrabold text-amber-300 font-mono flex items-center justify-center gap-1">
                <span>18</span>
                <FileCheck className="w-3 h-3 text-amber-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                CV access
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-center transition-all hover:border-emerald-500/40"
            >
              <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono flex items-center justify-center gap-1">
                <span>12</span>
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                Shortlisted
              </div>
            </motion.div>
          </div>

          {/* Live Verified Recruiter Activity Ticker Row */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 px-3.5 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0 font-bold">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                  <span className="truncate">MTN Cameroon</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                    Inspected
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Reviewed Passport Skills & Experience
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 shrink-0 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>2m ago</span>
            </div>
          </div>

          {/* Intern Passport Verifiable Credential Action */}
          <Link
            href="/dashboard/intern/passport"
            className="block group/passport"
          >
            <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-yellow-500/20 border border-amber-500/40 hover:border-amber-400/80 p-3.5 sm:p-4 flex items-center justify-between transition-all hover:bg-amber-500/25 shadow-lg shadow-amber-500/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover/passport:scale-105 transition-transform">
                  <Award className="w-5 h-5 text-slate-950" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm text-white font-extrabold flex items-center gap-2 truncate">
                    <span>Intern Passport</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-400/20 text-[9px] font-mono font-bold text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                      MN-CM-2026
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 truncate">
                    Permanent verifiable academic & technical credential
                  </div>
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 shrink-0 group-hover/passport:translate-x-0.5 transition-all">
                <span>View Passport</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Floating Notification Badge 1: Top Right */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-6 -right-3 sm:-right-6 bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-emerald-500/40 px-3.5 py-2.5 flex items-center gap-3 z-20 backdrop-blur-xl"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <span>Verified Recruiter Access</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            MANTECH Direct Sync • Live
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
