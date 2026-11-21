'use client';

/**
 * High-fidelity WhatsApp-style notification chime & alert engine
 * Uses Web Audio API for zero-latency, zero-asset-download chime across web & PWA
 */

export function playWhatsAppChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // First Tone: Crisp modern marimba attack (880 Hz, A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(830, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Second Tone: Characteristic WhatsApp pop-bell chime (1760 Hz, A6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760, now + 0.09);
    osc2.frequency.exponentialRampToValueAtTime(1680, now + 0.28);

    gain2.gain.setValueAtTime(0, now + 0.09);
    gain2.gain.linearRampToValueAtTime(0.4, now + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.35);
  } catch (e) {
    console.debug('[Audio] Notification chime muted or not supported in this context', e);
  }
}

export interface NewOpportunityNotification {
  title: string;
  companyName: string;
  city: string;
  type: 'job' | 'internship';
  slug: string;
  timestamp: number;
}

const STORAGE_KEY = 'mantech_recent_post_broadcast';

export function broadcastNewOpportunity(opp: NewOpportunityNotification): void {
  if (typeof window === 'undefined') return;

  // 1. Play incoming chime immediately
  playWhatsAppChime();

  // 2. Broadcast to other open windows / tabs
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...opp, timestamp: Date.now() }));
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('mantech_notifications');
      channel.postMessage(opp);
      channel.close();
    }
  } catch {}

  // 3. Native system push notification for PWA & mobile
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`🟢 MANTECH Nexus: Nouvelle Opportunité !`, {
        body: `${opp.companyName} recrute : ${opp.title} (${opp.city})`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
      });
    } catch {}
  } else if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }

  // 4. Dispatch in-app custom event
  window.dispatchEvent(
    new CustomEvent('mantech:new-opportunity', {
      detail: opp,
    })
  );
}
