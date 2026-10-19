/**
 * MANTECH Nexus — WhatsApp-first utilities
 * WhatsApp is the PRIMARY channel (Cameroon reality).
 * Email is secondary / fallback only.
 * All links use wa.me with prefilled English messages.
 */

import { APP_CONFIG } from '@/lib/config';

const digits = () =>
  (APP_CONFIG.contacts.whatsapp || '+237650921917').replace(/\D/g, '');

export function waBase(): string {
  return `https://wa.me/${digits()}`;
}

/** Generic WhatsApp deep link with prefilled text. */
export function waLink(message: string, phone?: string): string {
  const to = (phone || '').replace(/\D/g, '') || digits();
  return `https://wa.me/${to}?text=${encodeURIComponent(message)}`;
}

export function waSupportLink(context?: string): string {
  const msg = `Hello MANTECH Nexus 👋${context ? ` — ${context}` : ''}. I need help.`;
  return waLink(msg);
}

/** Intern shares an internship to a friend / group via WhatsApp. */
export function waShareInternshipLink(opts: {
  title: string;
  slug: string;
  company?: string;
  city?: string;
}): string {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'https://mantech.nexus';
  const url = `${base}/internships/${opts.slug}`;
  const msg = `🎓 Internship found on MANTECH Nexus\n\n📌 ${opts.title}\n🏢 ${opts.company || 'Verified company'}\n📍 ${opts.city || 'Cameroon'}\n\n👉 Apply here: ${url}\n\n— via MANTECH Nexus`;
  // share to any contact: use api.whatsapp.com send flow
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

/** Intern applies / asks about an internship via WhatsApp (fallback when company uses WhatsApp). */
export function waApplyLink(opts: {
  title: string;
  company?: string;
}): string {
  const msg = `Hello MANTECH Nexus 👋\nI want to apply for: ${opts.title}\nCompany: ${opts.company || '—'}\nMy Passport: (paste your passport link here)\nThank you!`;
  return waLink(msg);
}

/** Company → sales concierge. */
export function waCompanySalesLink(plan?: string): string {
  const msg = `Hello MANTECH Nexus 👋\nWe are a company and want to post internships.${plan ? `\nPlan: ${plan}` : ''}\nCompany name: \nCity: \nPlease activate us.`;
  return waLink(msg);
}

/** University → partnership. */
export function waUniversityLink(): string {
  const msg = `Hello MANTECH Nexus 🎓\nOur university wants a partnership for internship coordination.\nUniversity: \nCity: \nContact: `;
  return waLink(msg);
}

/** Job alert subscription via WhatsApp — primary CTA for interns. */
export function waAlertSubscribeLink(opts: {
  field?: string;
  city?: string;
  level?: string;
}): string {
  const msg = `Hello MANTECH Nexus 🔔\nActivate my WhatsApp job alerts:\n🎯 Field: ${opts.field || '—'}\n📍 City: ${opts.city || '—'}\n🎓 Level: ${opts.level || '—'}\nMy name: `;
  return waLink(msg);
}

/** Referral share via WhatsApp. */
export function waReferralLink(code: string): string {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'https://mantech.nexus';
  const url = `${base}/sign-up?ref=${encodeURIComponent(code)}`;
  const msg = `Join me on MANTECH Nexus 🎓 — verified internships in Cameroon, free Intern Passport: ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

/** Intern shares THEIR OWN passport to a recruiter / group via WhatsApp (viral loop). */
export function waSharePassportLink(opts: {
  name: string;
  headline?: string | null;
  fieldName?: string | null;
  profileId?: string;
}): string {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'https://mantech.nexus';
  const url = opts.profileId ? `${base}/intern-passports/${opts.profileId}` : base;
  const msg = `🎓 Meet ${opts.name} on MANTECH Nexus\n\n📌 ${opts.headline || opts.fieldName || 'Verified intern'}\n\n👉 View passport: ${url}\n\n— via MANTECH Nexus`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

/** Phone display, e.g. +237 650 921 917 */
export function waDisplayPhone(): string {
  return APP_CONFIG.contacts.whatsappFormatted || APP_CONFIG.contacts.whatsapp;
}

/** Recruiter → candidate on WhatsApp (uses the intern's own phone number). */
export function waCandidateLink(phone: string | null | undefined, context?: string): string | null {
  const raw = (phone || '').replace(/\D/g, '');
  if (!raw) return null;
  // Normalise local Cameroon numbers (6XXXXXXXX) to international form.
  const to = raw.length === 9 ? `237${raw}` : raw;
  const msg = `Hello${context ? ` — ${context}` : ''}. I am a recruiter on MANTECH Nexus and would like to discuss an opportunity with you.`;
  return `https://wa.me/${to}?text=${encodeURIComponent(msg)}`;
}
