'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Check, Sparkles } from 'lucide-react';

interface DownloadPostButtonProps {
  url: string;
  filename?: string;
  title?: string;
  className?: string;
}

export function DownloadPostButton({
  url,
  filename,
  title = "Télécharger l'Affiche HD",
  className = '',
}: DownloadPostButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloading(true);

      // Fetch blob to guarantee download triggers reliably across mobile & desktop
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || url.split('/').pop() || 'mantech-recruitment-poster.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloading(false);
      setCompleted(true);
      setTimeout(() => setCompleted(false), 3500);
    } catch {
      // Fallback direct anchor download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'mantech-recruitment-poster.jpg';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Animated Motion Wave Rings radiating outward */}
      <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 opacity-60 blur-md animate-pulse pointer-events-none" />
      <span className="absolute -inset-2 rounded-2xl bg-cyan-500/20 animate-ping opacity-30 pointer-events-none" />

      {/* Primary Interactive Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleDownload}
        disabled={downloading}
        className="relative z-10 flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-cyan-600/30 border border-cyan-300/40 hover:from-cyan-500 hover:to-emerald-500 transition-all cursor-pointer overflow-hidden group"
      >
        {/* Shimmer sweep animation over button face */}
        <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-700 pointer-events-none" />

        {completed ? (
          <>
            <Check className="w-4 h-4 text-emerald-200 animate-bounce" />
            <span className="text-emerald-100">Affiche Téléchargée !</span>
          </>
        ) : downloading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Téléchargement en cours…</span>
          </>
        ) : (
          <>
            <motion.div
              animate={{ y: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <Download className="w-4 h-4 text-cyan-100" />
            </motion.div>
            <span>{title}</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          </>
        )}
      </motion.button>
    </div>
  );
}
