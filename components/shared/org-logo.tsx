'use client';

import React, { useState } from 'react';
import { Building2, GraduationCap } from 'lucide-react';

interface OrgLogoProps {
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  type?: 'COMPANY' | 'UNIVERSITY';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Curated brand color accents and known logo domains for top Cameroonian organizations
const KNOWN_BRANDS: Record<string, { bg: string; text: string; domain?: string; short: string }> = {
  // Companies
  'mtn': { bg: 'from-amber-400 to-yellow-500', text: 'text-slate-950 font-black', domain: 'mtn.cm', short: 'MTN' },
  'orange': { bg: 'from-orange-500 to-amber-600', text: 'text-white font-black', domain: 'orange.cm', short: 'ORANGE' },
  'camtel': { bg: 'from-blue-700 to-indigo-800', text: 'text-white font-extrabold', domain: 'camtel.cm', short: 'CAMTEL' },
  'uba': { bg: 'from-red-600 to-rose-700', text: 'text-white font-black', domain: 'ubagroup.com', short: 'UBA' },
  'afriland': { bg: 'from-blue-800 to-amber-600', text: 'text-white font-bold', domain: 'afrilandfirstbank.com', short: 'AFRILAND' },
  'sabc': { bg: 'from-red-700 to-amber-600', text: 'text-white font-black', domain: 'lesboissonsducameroun.com', short: 'SABC' },
  'boissons': { bg: 'from-red-700 to-amber-600', text: 'text-white font-black', domain: 'lesboissonsducameroun.com', short: 'SABC' },
  'eneo': { bg: 'from-blue-600 to-cyan-600', text: 'text-white font-black', domain: 'eneocameroon.cm', short: 'ENEO' },
  'sonara': { bg: 'from-amber-600 to-red-600', text: 'text-white font-bold', domain: 'sonara-cm.com', short: 'SONARA' },
  'total': { bg: 'from-red-600 to-blue-600', text: 'text-white font-extrabold', domain: 'totalenergies.cm', short: 'TOTAL' },
  'nestle': { bg: 'from-sky-700 to-blue-800', text: 'text-white font-extrabold', domain: 'nestle.com', short: 'NESTLE' },
  'bicec': { bg: 'from-emerald-700 to-teal-800', text: 'text-white font-extrabold', domain: 'bicec.com', short: 'BICEC' },
  'societe generale': { bg: 'from-red-600 to-slate-900', text: 'text-white font-black', domain: 'societegenerale.cm', short: 'SG' },
  'camair': { bg: 'from-emerald-600 to-yellow-500', text: 'text-white font-black', domain: 'camair-co.cm', short: 'CAMAIR' },
  'tradex': { bg: 'from-blue-800 to-red-600', text: 'text-white font-black', domain: 'tradexsa.com', short: 'TRADEX' },
  'dangote': { bg: 'from-red-700 to-blue-900', text: 'text-white font-black', domain: 'dangote.com', short: 'DANGOTE' },
  'chococam': { bg: 'from-amber-800 to-yellow-700', text: 'text-white font-bold', domain: 'chococam.com', short: 'CHOCO' },
  'cca': { bg: 'from-blue-800 to-amber-500', text: 'text-white font-bold', domain: 'cca-bank.com', short: 'CCA' },
  'ecobank': { bg: 'from-teal-700 to-blue-900', text: 'text-white font-bold', domain: 'ecobank.com', short: 'ECOBANK' },
  'nexttel': { bg: 'from-red-600 to-orange-500', text: 'text-white font-bold', domain: 'nexttel.cm', short: 'NEXTTEL' },

  // Universities
  'yaounde i': { bg: 'from-blue-900 to-indigo-950', text: 'text-blue-300 font-bold', domain: 'uy1.uninet.cm', short: 'UY1' },
  'yaoundé i': { bg: 'from-blue-900 to-indigo-950', text: 'text-blue-300 font-bold', domain: 'uy1.uninet.cm', short: 'UY1' },
  'yaounde ii': { bg: 'from-indigo-900 to-purple-950', text: 'text-indigo-300 font-bold', domain: 'universite-yde2.org', short: 'UY2' },
  'yaoundé ii': { bg: 'from-indigo-900 to-purple-950', text: 'text-indigo-300 font-bold', domain: 'universite-yde2.org', short: 'UY2' },
  'douala': { bg: 'from-cyan-900 to-blue-950', text: 'text-cyan-300 font-bold', domain: 'univ-douala.cm', short: 'UDLA' },
  'buea': { bg: 'from-emerald-900 to-teal-950', text: 'text-emerald-300 font-bold', domain: 'ubuea.cm', short: 'UB' },
  'dschang': { bg: 'from-amber-900 to-orange-950', text: 'text-amber-300 font-bold', domain: 'univ-dschang.org', short: 'UDS' },
  'bamenda': { bg: 'from-teal-900 to-emerald-950', text: 'text-teal-300 font-bold', domain: 'uniba.cm', short: 'UBa' },
  'maroua': { bg: 'from-yellow-900 to-amber-950', text: 'text-yellow-300 font-bold', domain: 'univ-maroua.cm', short: 'UMA' },
  'ngaoundere': { bg: 'from-violet-900 to-purple-950', text: 'text-violet-300 font-bold', domain: 'univ-ndere.cm', short: 'UN' },
  'ngaoundéré': { bg: 'from-violet-900 to-purple-950', text: 'text-violet-300 font-bold', domain: 'univ-ndere.cm', short: 'UN' },
  'bertoua': { bg: 'from-emerald-950 to-green-900', text: 'text-emerald-300 font-bold', domain: 'univ-bertoua.cm', short: 'UBER' },
  'ebolowa': { bg: 'from-blue-950 to-sky-900', text: 'text-sky-300 font-bold', domain: 'univ-ebolowa.cm', short: 'UEBO' },
  'polytechnique': { bg: 'from-red-950 to-rose-900', text: 'text-rose-300 font-bold', domain: 'polytechnique.cm', short: 'ENSPY' },
  'enspy': { bg: 'from-red-950 to-rose-900', text: 'text-rose-300 font-bold', domain: 'polytechnique.cm', short: 'ENSPY' },
  'ict university': { bg: 'from-blue-900 to-indigo-900', text: 'text-blue-200 font-bold', domain: 'ictuniversity.org', short: 'ICTU' },
  'ucac': { bg: 'from-amber-900 to-yellow-950', text: 'text-amber-300 font-bold', domain: 'ucac-icam.com', short: 'UCAC' },
  'pkfokam': { bg: 'from-purple-950 to-indigo-900', text: 'text-purple-300 font-bold', domain: 'pkfinstitute.org', short: 'PKF' },
  'saint jerome': { bg: 'from-sky-950 to-blue-900', text: 'text-sky-300 font-bold', domain: 'univ-saintjerome.cm', short: 'STJ' },
  'saint jérôme': { bg: 'from-sky-950 to-blue-900', text: 'text-sky-300 font-bold', domain: 'univ-saintjerome.cm', short: 'STJ' },
};

function getBrandInfo(name: string) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(KNOWN_BRANDS)) {
    if (lower.includes(key)) {
      return val;
    }
  }
  return null;
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs rounded-xl',
  md: 'w-11 h-11 text-sm rounded-xl',
  lg: 'w-14 h-14 text-base rounded-2xl',
  xl: 'w-16 h-16 text-lg rounded-2xl',
};

export function OrgLogo({
  name,
  logoUrl,
  website,
  type = 'COMPANY',
  size = 'md',
  className = '',
}: OrgLogoProps) {
  const [imageError, setImageError] = useState(false);
  const brand = getBrandInfo(name);

  // Determine effective logo URL — strictly forbid third-party avatar scrapers (e.g. unavatar.io)
  // that can inadvertently return human face photos or personal profiles.
  let effectiveUrl = logoUrl;
  if (effectiveUrl && (effectiveUrl.includes('unavatar.io') || effectiveUrl.includes('dicebear'))) {
    effectiveUrl = null;
  }

  const sizeCls = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (effectiveUrl && !imageError) {
    return (
      <div className={`relative shrink-0 overflow-hidden bg-slate-900 border border-slate-700/60 flex items-center justify-center p-1.5 shadow-md ${sizeCls} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={effectiveUrl}
          alt={name}
          className="w-full h-full object-contain rounded-lg"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // High quality brand badge fallback with authentic brand styling
  if (brand) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden bg-gradient-to-tr ${brand.bg} ${brand.text} flex items-center justify-center border border-white/10 shadow-md tracking-wider ${sizeCls} ${className}`}
        title={name}
      >
        <span className="truncate px-1 uppercase">{brand.short}</span>
      </div>
    );
  }

  // Generic styled Cameroon institution badge with icon & initials
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  const isUni = type === 'UNIVERSITY';

  return (
    <div
      className={`relative shrink-0 overflow-hidden flex items-center justify-center border shadow-md font-bold ${
        isUni
          ? 'bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/30 text-emerald-300'
          : 'bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-950 border-blue-500/30 text-blue-300'
      } ${sizeCls} ${className}`}
      title={name}
    >
      <span className="tracking-wider">{initials || (isUni ? <GraduationCap className="w-5 h-5" /> : <Building2 className="w-5 h-5" />)}</span>
    </div>
  );
}

