'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Image as ImageIcon,
  ExternalLink,
  MessageCircle,
  Phone,
  Eye,
  X,
  Sparkles,
  Calendar,
  MapPin,
  Building2,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DownloadPostButton } from '@/components/shared/download-post-button';

export interface VisualFlyerItem {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  flyerUrl: string;
  city?: string;
  contactPhone?: string | null;
  expiryDate?: string | Date;
  isFeatured?: boolean;
  type?: string;
}

export interface CareerLinkItem {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  externalUrl: string;
  description?: string;
  city?: string;
  type?: string;
  isFeatured?: boolean;
}

interface FlyersNoticeBoardProps {
  flyers: VisualFlyerItem[];
  careerLinks: CareerLinkItem[];
}

export function FlyersNoticeBoard({ flyers, careerLinks }: FlyersNoticeBoardProps) {
  const [selectedFlyer, setSelectedFlyer] = useState<VisualFlyerItem | null>(null);

  return (
    <>
      {/* ── SECTION A: DIRECT OPPORTUNITY FLYERS & NOTICE BOARD ── */}
      <section className="py-20 bg-[#070c18] border-b border-slate-800/80 relative overflow-hidden text-white">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
                <ImageIcon className="w-3.5 h-3.5" />
                Direct Enterprise Flyers &amp; Notice Board
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                Recruitment Posters &amp; Visual Announcements
              </h2>
              <p className="mt-1 text-slate-400 text-xs sm:text-sm">
                Posted directly by Cameroon employers. Tap any flyer to zoom in and apply directly via WhatsApp.
              </p>
            </div>

            <Link href="/post?type=job">
              <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/20">
                <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                Post Your Flyer Free
              </Button>
            </Link>
          </div>

          {flyers && flyers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {flyers.map((flyer) => {
                const waLink = flyer.contactPhone
                  ? `https://wa.me/${flyer.contactPhone.replace(/[^0-9]/g, '')}?text=Hello,%20I%20am%20applying%20to%20your%20internship/job%20flyer%20on%20MANTECH%20Nexus.`
                  : null;

                return (
                  <div
                    key={flyer.id}
                    className="group relative rounded-3xl border-2 border-cyan-500/35 bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 overflow-hidden shadow-xl hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                  >
                    {/* Visual Flyer Image Container */}
                    <div
                      onClick={() => setSelectedFlyer(flyer)}
                      className="relative w-full aspect-[3/4] bg-slate-950 cursor-pointer overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={flyer.flyerUrl}
                        alt={flyer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Zoom Indicator Icon */}
                      <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-950/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Maximize2 className="w-4 h-4 text-cyan-400" />
                      </div>

                      {flyer.isFeatured && (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <Sparkles className="w-2.5 h-2.5" /> Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Flyer Quick Info & Direct Contact */}
                    <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex flex-col flex-1 justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                          {flyer.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {flyer.companyName} • {flyer.city || 'Cameroon'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/60">
                        <Button
                          size="sm"
                          onClick={() => setSelectedFlyer(flyer)}
                          variant="ghost"
                          className="h-7 px-2 text-[11px] text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 flex-1 font-semibold"
                        >
                          <Eye className="w-3 h-3 mr-1" /> View Flyer
                        </Button>

                        {waLink && (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0"
                          >
                            <MessageCircle className="w-3 h-3" /> Chat
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center bg-slate-900/40">
              <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No image flyers published today.</p>
              <p className="text-xs text-slate-500 mt-1">Be the first to publish your hiring poster free!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION B: DIRECT ENTERPRISE CAREER PORTALS & EXTERNAL LINKS ── */}
      {careerLinks && careerLinks.length > 0 && (
        <section className="py-16 bg-slate-950 border-b border-slate-800/80 text-white">
          <div className="container-mantech px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Official Enterprise Portals &amp; Direct Career Links
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Direct Apply via Official Corporate Portals
                </h3>
              </div>

              <Link href="/jobs" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Explore All Opportunities <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {careerLinks.map((linkItem) => (
                <div
                  key={linkItem.id}
                  className="rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/95 to-indigo-950/25 p-5 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/15 hover:-translate-y-1 transition-all flex flex-col justify-between gap-4 group shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded">
                        {linkItem.type || 'PORTAL'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{linkItem.city || 'Cameroon'}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                      {linkItem.title}
                    </h4>
                    <p className="text-xs font-semibold text-emerald-400">{linkItem.companyName}</p>

                    {linkItem.description && (
                      <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                        {linkItem.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2">
                    <a
                      href={linkItem.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                    >
                      <span>Postuler sur le Portail Officiel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LIGHTBOX MODAL FOR FULL-SIZE FLYER ── */}
      {selectedFlyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="min-w-0 pr-2">
                <h4 className="font-bold text-sm text-white truncate">{selectedFlyer.title}</h4>
                <p className="text-[11px] text-slate-400 truncate">
                  {selectedFlyer.companyName} • {selectedFlyer.city || 'Cameroon'}
                </p>
              </div>
              <button
                onClick={() => setSelectedFlyer(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Flyer Image Container (Scrollable) */}
            <div className="overflow-y-auto p-4 flex items-center justify-center bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedFlyer.flyerUrl}
                alt={selectedFlyer.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-lg border border-slate-800"
              />
            </div>

            {/* Modal Footer (Download with wave animation & Direct Contact) */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
              <DownloadPostButton
                url={selectedFlyer.flyerUrl}
                filename={`affiche-${selectedFlyer.slug}.jpg`}
                title="Télécharger l'Affiche HD"
              />

              <div className="flex items-center gap-2">
                {selectedFlyer.contactPhone ? (
                  <a
                    href={`https://wa.me/${selectedFlyer.contactPhone.replace(/[^0-9]/g, '')}?text=Hello,%20I%20am%20applying%20to%20your%20flyer%20on%20MANTECH%20Nexus.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp ({selectedFlyer.contactPhone})</span>
                  </a>
                ) : (
                  <Link
                    href={`/jobs/${selectedFlyer.slug}`}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                  >
                    Voir l&apos;Offre
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
