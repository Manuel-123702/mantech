'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Bell, Share2, LifeBuoy } from 'lucide-react';
import { waSupportLink, waAlertSubscribeLink, waReferralLink } from '@/lib/whatsapp';

/**
 * WhatsApp-first concierge float — PRIMARY contact channel.
 * Email is secondary. Expands to 3 one-tap actions:
 * Support, Job alerts, Invite friend.
 */
export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      icon: LifeBuoy,
      label: 'Chat with support',
      desc: 'Fast reply 8am–6pm',
      href: waSupportLink(),
    },
    {
      icon: Bell,
      label: 'WhatsApp job alerts',
      desc: 'Internships matching you',
      href: waAlertSubscribeLink({}),
    },
    {
      icon: Share2,
      label: 'Invite a friend',
      desc: 'Share via WhatsApp',
      href: waReferralLink('invite'),
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="bg-[#075E54] px-4 py-3 text-white">
              <p className="text-sm font-bold">
                WhatsApp Concierge 👋
              </p>
              <p className="text-xs text-white/80">
                The fastest way to reach us
              </p>
            </div>
            <div className="p-2">
              {actions.map((a) => (
                <a
                  key={a.label}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-green-50"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#128C7E]">
                    <a.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{a.label}</span>
                    <span className="block text-xs text-slate-500">{a.desc}</span>
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full z-10"
          style={{ backgroundColor: '#25D366', boxShadow: '0 10px 25px -5px rgba(37, 211, 102, 0.4)' }}
          aria-label={open ? 'Close WhatsApp menu' : 'Contact us on WhatsApp'}
        >
          {open ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
          {!open && (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: '#25D366' }}
              animate={{ scale: [1, 1.5, 2], opacity: [0.6, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </button>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg border border-slate-200 hover:border-green-300 sm:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
            Questions? WhatsApp us
          </button>
        )}
      </div>
    </div>
  );
}
