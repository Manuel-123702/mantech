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
  GraduationCap,
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
  deadline?: string | Date;
  isFeatured?: boolean;
  type?: string;
  organization?: {
    name?: string;
  };
}

export default function InternshipLinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchLinks = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/internships?method=link&limit=100', { cache: 'no-store' });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setLinks(data.internships || []);
        }
      } catch (err) {
        console.error('Failed to fetch internship links:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLinks();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500/30 selection:text-teal-200">
      {/* Header Banner */}
      <div className="relative border-b border-slate-800 bg-gradient-to-b from-teal-950/40 via-slate-950 to-slate-950 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold mb-4"
          >
            <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
            <span>Official Stage Programs &bull; External Application Portals</span>
          </motion.div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Enterprise Internship Portals &amp; Direct Links
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mb-6">
            Official internship program links from multinationals, institutions, and verified enterprises in Cameroon.
          </p>

          {/* Method Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs mb-6">
            <Link
              href="/internships"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Standard Cards</span>
            </Link>
            <Link
              href="/internships/flyers"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Visual Posters</span>
            </Link>
            <Link
              href="/internships/links"
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-teal-600/25"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Official Portals ({links.length})</span>
            </Link>
            <Link
              href="/post?type=internship"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-teal-500/20 ml-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit a Stage Link</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Directory Tiles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {links.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/40 max-w-lg mx-auto">
            <LinkIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-white mb-1">No internship links listed yet</h3>
            <p className="text-xs text-slate-400 mb-6">
              Post an official corporate internship portal URL to feature here!
            </p>
            <Link href="/post?type=internship">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl">
                Add an Internship Link
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {links.map((item) => {
              const targetUrl = item.externalUrl || item.applicationUrl || '#';
              const company = item.companyName || item.organization?.name || 'Verified Enterprise';

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/10 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-800/60 px-2.5 py-1 rounded-md">
                        Official Stage Program
                      </span>
                      {item.isFeatured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{company} &bull; {item.city || 'Cameroon'}</span>
                    </p>
                  </div>

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-teal-600 text-white text-xs font-bold transition-all border border-slate-700 hover:border-teal-500 shadow-md group-hover:shadow-teal-600/20"
                  >
                    <span>Apply on Corporate Portal</span>
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
