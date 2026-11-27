'use client';

import React, { useState } from 'react';
import { Eye, X, Shield, Lock, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CvViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string;
  candidateName?: string;
  fileName?: string;
}

export function CvViewerModal({
  isOpen,
  onClose,
  cvUrl,
  candidateName = 'Candidate',
  fileName = 'Curriculum Vitae',
}: CvViewerModalProps) {
  const [iframeError, setIframeError] = useState(false);

  if (!isOpen || !cvUrl) return null;

  // Determine the best viewing method
  const isAbsolute = cvUrl.startsWith('http://') || cvUrl.startsWith('https://');
  
  // Google Docs Viewer works with absolute public URLs (like UploadThing)
  const previewUrl = isAbsolute
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(cvUrl)}&embedded=true`
    : `${cvUrl}#toolbar=0&navpanes=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 md:p-6 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-4xl h-[92vh] sm:h-[88vh] bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white truncate font-heading">
                {candidateName} â€” Verified CV
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">{fileName}</span>
                <span className="hidden sm:inline text-slate-500">Â· Read-Only Secure View</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
              <Lock className="w-3 h-3" />
              <span>Protected Document</span>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close CV Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Protection Notice Banner */}
        <div className="px-4 py-2 bg-blue-950/40 border-b border-blue-900/40 flex items-center justify-between text-[11px] sm:text-xs text-blue-200">
          <div className="flex items-center gap-2 truncate">
            <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">
              Recruitment Privacy Protection Active: CV content is for evaluation only.
            </span>
          </div>
          {isAbsolute && (
            <span className="hidden sm:inline text-blue-400 font-mono text-[10px] shrink-0">
              Google Docs Secured Stream
            </span>
          )}
        </div>

        {/* Viewer Container */}
        <div className="relative flex-1 bg-slate-950 w-full overflow-hidden">
          {!iframeError ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title={`${candidateName} CV Document`}
              sandbox="allow-scripts allow-same-origin allow-popups"
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
              <p className="text-base font-bold text-white mb-1">
                Preview could not be streamed automatically
              </p>
              <p className="text-xs text-slate-400 max-w-md mb-4">
                The document is securely stored. You can inspect it directly using the protected link.
              </p>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open In Secure Tab
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400">
          <span>MANTECH Verified Candidate Document System</span>
          <Button
            onClick={onClose}
            size="sm"
            className="h-8 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold"
          >
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}

export function CvViewButton({
  cvUrl,
  candidateName,
  fileName,
  className = '',
  label = 'View CV',
}: {
  cvUrl: string | null | undefined;
  candidateName?: string;
  fileName?: string;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!cvUrl) return null;

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 font-bold shadow-md transition-all ${
          className || 'bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-xl'
        }`}
      >
        <Eye className="w-3.5 h-3.5 shrink-0" />
        <span>{label}</span>
      </Button>

      <CvViewerModal
        isOpen={open}
        onClose={() => setOpen(false)}
        cvUrl={cvUrl}
        candidateName={candidateName}
        fileName={fileName}
      />
    </>
  );
}
