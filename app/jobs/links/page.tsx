'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Link as LinkIcon,
  ExternalLink,
  Sparkles,
  Plus,
  FileText,
  Image as ImageIcon,
  Building2,
  MapPin,
  Calendar,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Loading from '@/app/loading';

interface LinkItem {
  id: string;
  slug: string;
  title: string;
  companyName?: string;
  externalUrl?: string;
  applicationUrl?: string;
  city?: string;
  expiryDate?: string | Date;
  isFeatured?: boolean;
  type?: string;
  organization?: {
    name?: string;
  };
}

export default function JobLinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchLinks = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/jobs?method=link&limit=100', { cache: 'no-store' });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setLinks(data.jobs || []);
        }
      } catch (err) {
        console.error('Failed to fetch job links:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLinks();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 selection:text-blue-200">
      {/* Header Banner */}
      <div className="relative border-b border-slate-800 bg-gradient-to-b from-blue-950/40 via-slate-950 to-slate-950 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold mb-4"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Corporate Portals &bull; External Application Links</span>
          </motion.div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Official Enterprise Career Portals (Jobs)
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mb-6">
            Direct application links to official corporate career desks across Cameroon and multinational portals.
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
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Visual Posters</span>
            </Link>
            <Link
              href="/jobs/links"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/25"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Official Career Links ({links.length})</span>
            </Link>
            <Link
              href="/post?type=job"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20 ml-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit a Career Link</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Directory Tiles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {links.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/40 max-w-lg mx-auto">
            <LinkIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-white mb-1">No portal links listed yet</h3>
            <p className="text-xs text-slate-400 mb-6">
              Post an official recruitment link or career portal URL to feature here!
            </p>
            <Link href="/post?type=job">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl">
                Add an Enterprise Link
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {links.map((item) => {
              const targetUrl = item.externalUrl || item.applicationUrl || '#';
              const company = item.companyName || item.organization?.name || 'Verified Portal';

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-md">
                        Corporate Career Desk
                      </span>
                      {item.isFeatured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{company} &bull; {item.city || 'Cameroon / Web'}</span>
                    </p>
                  </div>

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold transition-all border border-slate-700 hover:border-blue-500 shadow-md group-hover:shadow-blue-600/20"
                  >
                    <span>Apply via Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
