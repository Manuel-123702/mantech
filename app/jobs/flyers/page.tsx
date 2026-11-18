'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Sparkles,
  Plus,
  Maximize2,
  MessageCircle,
  X,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Loading from '@/app/loading';

interface FlyerItem {
  id: string;
  slug: string;
  title: string;
  companyName?: string;
  flyerUrl: string;
  city?: string;
  contactPhone?: string | null;
  expiryDate?: string | Date;
  isFeatured?: boolean;
  type?: string;
  organization?: {
    name?: string;
  };
}

export default function JobFlyersPage() {
  const [flyers, setFlyers] = useState<FlyerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlyer, setSelectedFlyer] = useState<FlyerItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchFlyers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/jobs?method=flyer&limit=100', { cache: 'no-store' });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setFlyers(data.jobs || []);
        }
      } catch (err) {
        console.error('Failed to fetch job flyers:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchFlyers();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header Banner */}
      <div className="relative border-b border-slate-800 bg-gradient-to-b from-cyan-950/40 via-slate-950 to-slate-950 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-4"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Visual Notice Board &bull; Communiqués &amp; Flyers</span>
          </motion.div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Recruitment Posters &amp; Image Flyers (Jobs)
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mb-6">
            Visual vacancy communiqués uploaded directly by Cameroonian employers and hiring desks. Tap any flyer to expand, zoom, or apply via WhatsApp.
          </p>

          {/* Method Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs mb-6">
            <Link
              href="/jobs"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Standard Cards</span>
            </Link>
            <Link
              href="/jobs/flyers"
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/25"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Visual Posters ({flyers.length})</span>
            </Link>
            <Link
              href="/jobs/links"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Official Career Links</span>
            </Link>
            <Link
              href="/post?type=job"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20 ml-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post a Flyer Free</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main E-commerce Style Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {flyers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/40 max-w-lg mx-auto">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-white mb-1">No visual posters published yet</h3>
            <p className="text-xs text-slate-400 mb-6">
              Be the first enterprise or recruiter in Cameroon to pin an image flyer here!
            </p>
            <Link href="/post?type=job">
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl">
                Upload a Job Flyer Free
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {flyers.map((flyer) => {
              const waLink = flyer.contactPhone
                ? `https://wa.me/${flyer.contactPhone.replace(/[^0-9]/g, '')}?text=Hello,%20I%20am%20applying%20to%20your%20job%20flyer%20on%20MANTECH%20Nexus.`
                : null;
              const company = flyer.companyName || flyer.organization?.name || 'Enterprise Announcement';

              return (
                <div
                  key={flyer.id}
                  className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl hover:border-cyan-500/60 hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col"
                >
                  {/* The Image (Product Showcase style) */}
                  <div
                    onClick={() => setSelectedFlyer(flyer)}
                    className="relative w-full aspect-[3/4] bg-black cursor-pointer overflow-hidden flex items-center justify-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={flyer.flyerUrl}
                      alt={flyer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                    {/* Zoom Icon Button */}
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

                  {/* Actions & Summary */}
                  <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex flex-col flex-1 justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                        {flyer.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {company} &bull; {flyer.city || 'Cameroon'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/60">
                      <Button
                        size="sm"
                        onClick={() => setSelectedFlyer(flyer)}
                        variant="ghost"
                        className="h-8 px-2 text-[11px] text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 flex-1 font-semibold"
                      >
                        <Maximize2 className="w-3 h-3 mr-1" /> View Poster
                      </Button>

                      {waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0 shadow-md shadow-emerald-600/20"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedFlyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
              <div className="min-w-0 pr-2">
                <h4 className="font-bold text-sm text-white truncate">{selectedFlyer.title}</h4>
                <p className="text-[11px] text-slate-400 truncate">
                  {selectedFlyer.companyName || selectedFlyer.organization?.name || 'Enterprise'} &bull; {selectedFlyer.city || 'Cameroon'}
                </p>
              </div>
              <button
                onClick={() => setSelectedFlyer(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex items-center justify-center bg-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedFlyer.flyerUrl}
                alt={selectedFlyer.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-lg border border-slate-800"
              />
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
              <a
                href={selectedFlyer.flyerUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-white"
              >
                Download Poster &darr;
              </a>

              {selectedFlyer.contactPhone ? (
                <a
                  href={`https://wa.me/${selectedFlyer.contactPhone.replace(/[^0-9]/g, '')}?text=Hello,%20I%20am%20applying%20to%20your%20job%20flyer%20on%20MANTECH%20Nexus.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  Apply via WhatsApp ({selectedFlyer.contactPhone})
                </a>
              ) : (
                <Link
                  href={`/jobs/${selectedFlyer.slug}`}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                >
                  View Page
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
