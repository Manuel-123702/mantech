'use client';
import { Trans } from '@lingui/react/macro';


import { useState, useEffect } from 'react';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Share,
  PlusSquare,
  Zap,
  Bell,
  WifiOff,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallClient() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(standalone);

    // Detect OS for default tab
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setActiveTab('ios');
    } else if (/windows|macintosh|linux/.test(ua) && !/android/.test(ua)) {
      setActiveTab('desktop');
    } else {
      setActiveTab('android');
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalledSuccess(true);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'To install MANTECH Nexus, tap the 3 dots (⋮) in your Chrome browser menu and tap "Install App" or "Add to Home screen".'
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Graphic */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('/images/portal_dash_bg.svg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md mb-4">
            <Smartphone className="h-3.5 w-3.5 text-cyan-400" />
            <Trans comment="install page div visible text">Official Mobile & Desktop PWA
          </Trans></div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            <Trans comment="install page h1 visible text">Get MANTECH Nexus on Your Device
          </Trans></h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            <Trans comment="install page p visible text">Install the official application directly on your phone or computer. Zero storage waste,
            instant launch speeds, and real-time alerts across Cameroon.
          </Trans></p>

          {/* Main Action Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {isInstalled || installedSuccess ? (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/50 px-6 py-3.5 text-sm font-bold text-emerald-300 backdrop-blur-md">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <Trans comment="install page div visible text">MANTECH Nexus is already installed on your device!
              </Trans></div>
            ) : (
              <button
                onClick={triggerInstall}
                className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]"
              >
                <Download className="h-5 w-5" />
                <Trans comment="install page button visible text">Install App on This Device
              </Trans></button>
            )}

            <Link
              href="/internships"
              className="flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/60 px-6 py-4 text-sm font-semibold text-slate-200 backdrop-blur-md transition-colors hover:border-slate-500 hover:text-white"
            >
              <Trans comment="install page Link visible text">Browse on Web </Trans><ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/50 text-cyan-400 mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white"><Trans comment="install page h3 visible text">Instant Launch</Trans></h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              <Trans comment="install page p visible text">Opens in milliseconds with zero load friction and no heavy app store downloads.
            </Trans></p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/50 text-emerald-400 mb-3">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white"><Trans comment="install page h3 visible text">Instant Alerts</Trans></h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              <Trans comment="install page p visible text">Get notified immediately when verified companies in Douala & Yaoundé post matches.
            </Trans></p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-950/50 text-amber-400 mb-3">
              <WifiOff className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white"><Trans comment="install page h3 visible text">Offline Support</Trans></h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              <Trans comment="install page p visible text">Cached pages and fast offline screens keep your verified Intern Passport always handy.
            </Trans></p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-950/50 text-violet-400 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white"><Trans comment="install page h3 visible text">Zero Phone Storage</Trans></h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              <Trans comment="install page p visible text">Takes less than 3 MB of space — over 90% lighter than standard mobile apps.
            </Trans></p>
          </div>
        </div>

        {/* Device-Specific Instructions */}
        <div className="mt-12 rounded-3xl border border-slate-800/90 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white"><Trans comment="install page h2 visible text">Step-by-Step Installation Guide</Trans></h2>
              <p className="text-xs sm:text-sm text-slate-400">
                <Trans comment="install page p visible text">Choose your platform to view easy 2-step setup instructions.
              </Trans></p>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/70 p-1">
              <button
                onClick={() => setActiveTab('android')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  activeTab === 'android'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trans comment="install page button visible text">Android / Chrome
              </Trans></button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  activeTab === 'ios'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trans comment="install page button visible text">iPhone / iPad
              </Trans></button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  activeTab === 'desktop'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trans comment="install page button visible text">PC / Mac / Chrome
              </Trans></button>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'android' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold text-sm mb-3">
                    {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"1"}</div>
                  <h4 className="text-sm font-bold text-white"><Trans comment="install page h4 visible text">Tap the 3 Dots Menu</Trans></h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    <Trans comment="install page p visible text">Open Chrome on your Android phone and tap the three vertical dots (⋮) in the top-right corner.
                  </Trans></p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-sm mb-3">
                    {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"2"}</div>
                  <h4 className="text-sm font-bold text-white"><Trans comment="install page h4 visible text">Select &quot;Install App&quot;</Trans></h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    <Trans comment="install page p visible text">Tap </Trans><strong><Trans comment="install page strong visible text">&quot;Install app&quot;</Trans></strong> <Trans comment="install page p visible text">or </Trans><strong><Trans comment="install page strong visible text">&quot;Add to Home screen&quot;</Trans></strong> <Trans comment="install page p visible text">from the dropdown list.
                  </Trans></p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm mb-3">
                    {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"3"}</div>
                  <h4 className="text-sm font-bold text-white"><Trans comment="install page h4 visible text">Done! Tap to Open</Trans></h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    <Trans comment="install page p visible text">The MANTECH Nexus icon appears on your home screen and operates as a standalone native app.
                  </Trans></p>
                </div>
              </div>
            )}

            {activeTab === 'ios' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold text-sm mb-3">
                    {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"1"}</div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Trans comment="install page h4 visible text">Tap Share </Trans><Share className="h-4 w-4 text-cyan-400" />
                  </h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    <Trans comment="install page p visible text">Open Safari on your iPhone and tap the Share icon at the bottom of the screen.
                  </Trans></p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-sm mb-3">
                    {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"2"}</div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Trans comment="install page h4 visible text">Add to Home Screen </Trans><PlusSquare className="h-4 w-4 text-emerald-400" />
                  </h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    <Trans comment="install page p visible text">Scroll down through the options and tap </Trans><strong><Trans comment="install page strong visible text">&quot;Add to Home Screen&quot;</Trans></strong>{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"."}</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm mb-3">
                    {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"3"}</div>
                  <h4 className="text-sm font-bold text-white"><Trans comment="install page h4 visible text">Tap &quot;Add&quot; in Top-Right</Trans></h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    <Trans comment="install page p visible text">Confirm by tapping Add. The app icon will now appear on your iPhone screen without Safari bars!
                  </Trans></p>
                </div>
              </div>
            )}

            {activeTab === 'desktop' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold text-sm mb-3">
                    {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"1"}</div>
                  <h4 className="text-sm font-bold text-white"><Trans comment="install page h4 visible text">Look at Address Bar</Trans></h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    <Trans comment="install page p visible text">On Chrome or Edge on PC/Mac, look for the install icon (</Trans><Download className="inline h-3.5 w-3.5 text-cyan-400" /><Trans comment="install page p visible text">) on the right side of the URL bar.
                  </Trans></p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-sm mb-3">
                    {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"2"}</div>
                  <h4 className="text-sm font-bold text-white"><Trans comment="install page h4 visible text">Click &quot;Install&quot;</Trans></h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    <Trans comment="Instructions for installing the app from the browser menu">Click the install icon or click the 3-dots menu &gt; <strong _t="saveAndShare">&quot;Save and share&quot;</strong> &gt; <strong _t="installApp">&quot;Install MANTECH Nexus&quot;</strong>.</Trans>
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm mb-3">
                    {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"3"}</div>
                  <h4 className="text-sm font-bold text-white"><Trans comment="install page h4 visible text">Standalone Desktop App</Trans></h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    <Trans comment="install page p visible text">MANTECH Nexus opens in its own clean window, can be pinned to your Windows Taskbar or Mac Dock.
                  </Trans></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Google Play Store Card */}
        <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-950/60 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 px-3 py-0.5 text-xs font-semibold text-teal-300 mb-2">
                <Trans comment="install page span visible text">Google Play Store Bundle Ready
              </Trans></span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                <Trans comment="install page h3 visible text">Publishing to the Google Play Store
              </Trans></h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <Trans comment="install page p visible text">Because MANTECH Nexus complies with Google Trusted Web Activity (TWA) standards,
                the same web app can be generated into an Android APK / AAB package in minutes without writing separate native code.
              </Trans></p>
            </div>

            <Link
              href="/internships"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-colors"
            >
              <Trans comment="install page Link visible text">Start Exploring </Trans><ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
