'use client';

import React, { useState } from 'react';

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

  // Healthcare, Hospitals & Clinics
  'hopital': { bg: 'from-red-600 to-rose-700', text: 'text-white font-bold', short: 'HOPITAL' },
  'laquintinie': { bg: 'from-blue-600 to-cyan-600', text: 'text-white font-bold', short: 'LAQUINTINIE' },
  'clinique': { bg: 'from-teal-600 to-emerald-700', text: 'text-white font-bold', short: 'CLINIQUE' },
  'pharmacie': { bg: 'from-emerald-600 to-teal-700', text: 'text-white font-bold', short: 'PHARMA' },

  // Culinary, Restaurants & Hospitality
  'acropole': { bg: 'from-amber-600 to-yellow-600', text: 'text-slate-950 font-black', short: 'ACROPOLE' },
  'fourchette': { bg: 'from-rose-700 to-amber-700', text: 'text-white font-bold', short: 'FOURCHETTE' },
  'krystal': { bg: 'from-slate-900 to-amber-500', text: 'text-amber-200 font-extrabold', short: 'KRYSTAL' },

  // Retail, Supermarkets & Commerce
  'carrefour': { bg: 'from-blue-600 to-red-600', text: 'text-white font-black', short: 'CARREFOUR' },
  'santa lucia': { bg: 'from-emerald-600 to-amber-600', text: 'text-white font-bold', short: 'SANTA LUCIA' },
  'distributeurs': { bg: 'from-cyan-700 to-blue-800', text: 'text-white font-bold', short: 'DISTRIB' },

  // Schools, Colleges & Academies
  'libermann': { bg: 'from-blue-900 to-indigo-800', text: 'text-blue-200 font-bold', short: 'LIBERMANN' },
  'bilingual academy': { bg: 'from-indigo-900 to-cyan-800', text: 'text-cyan-200 font-bold', short: 'ACADEMY' },
  'tutors': { bg: 'from-violet-900 to-indigo-900', text: 'text-violet-200 font-bold', short: 'TUTORS' },

  // Property, Domestic & Logistics
  'bonapriso': { bg: 'from-purple-950 to-indigo-900', text: 'text-purple-200 font-bold', short: 'BONAPRISO' },
  'bastos': { bg: 'from-slate-900 to-blue-900', text: 'text-blue-300 font-bold', short: 'BASTOS' },
  'camsolar': { bg: 'from-amber-500 to-orange-600', text: 'text-slate-950 font-black', short: 'SOLAR' },
  'mecanique': { bg: 'from-slate-800 to-cyan-900', text: 'text-cyan-300 font-bold', short: 'MÉCANIQUE' },
  'express cargo': { bg: 'from-blue-700 to-cyan-600', text: 'text-white font-bold', short: 'EXPRESS' },
  'cdc': { bg: 'from-emerald-800 to-green-900', text: 'text-emerald-200 font-bold', short: 'CDC' },

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

  // Determine effective logo URL
  let effectiveUrl = logoUrl;
  if (effectiveUrl && (effectiveUrl.includes('unavatar.io') || effectiveUrl.includes('dicebear'))) {
    effectiveUrl = null;
  }

  // Automatic match with authentic local Cameroon brand SVG logos
  if (!effectiveUrl) {
    const lower = name.toLowerCase();
    // Enterprise & Companies
    if (lower.includes('mtn')) effectiveUrl = '/images/logos/mtn.svg';
    else if (lower.includes('orange')) effectiveUrl = '/images/logos/orange.svg';
    else if (lower.includes('sabc') || lower.includes('boissons')) effectiveUrl = '/images/logos/sabc.svg';
    else if (lower.includes('eneo')) effectiveUrl = '/images/logos/eneo.svg';
    else if (lower.includes('uba')) effectiveUrl = '/images/logos/uba.svg';
    else if (lower.includes('camtel')) effectiveUrl = '/images/logos/camtel.svg';
    else if (lower.includes('total')) effectiveUrl = '/images/logos/totalenergies.svg';
    else if (lower.includes('societe generale') || lower.includes('société générale')) effectiveUrl = '/images/logos/socgen.svg';
    else if (lower.includes('tradex')) effectiveUrl = '/images/logos/tradex.svg';
    else if (lower.includes('dangote')) effectiveUrl = '/images/logos/dangote.svg';
    else if (lower.includes('activa')) effectiveUrl = '/images/logos/activa.svg';
    else if (lower.includes('pwc')) effectiveUrl = '/images/logos/pwc.svg';
    else if (lower.includes('bicec')) effectiveUrl = '/images/logos/bicec.svg';
    else if (lower.includes('chococam')) effectiveUrl = '/images/logos/chococam.svg';
    else if (lower.includes('afriland')) effectiveUrl = '/images/logos/afriland.svg';
    else if (lower.includes('campost')) effectiveUrl = '/images/logos/campost.svg';
    else if (lower.includes('camair')) effectiveUrl = '/images/logos/camair.svg';
    else if (lower.includes('crtv')) effectiveUrl = '/images/logos/crtv.svg';
    else if (lower.includes('sonara')) effectiveUrl = '/images/logos/sonara.svg';
    else if (lower.includes('cdc') || lower.includes('cameroon development')) effectiveUrl = '/images/logos/cdc.svg';
    else if (lower.includes('kribi') || lower.includes('pak')) effectiveUrl = '/images/logos/pak.svg';
    else if (lower.includes('hevecam')) effectiveUrl = '/images/logos/hevecam.svg';
    else if (lower.includes('cca')) effectiveUrl = '/images/logos/cca.svg';
    else if (lower.includes('uccao')) effectiveUrl = '/images/logos/uccao.svg';
    else if (lower.includes('nwca')) effectiveUrl = '/images/logos/nwca.svg';
    else if (lower.includes('sodecoton')) effectiveUrl = '/images/logos/sodecoton.svg';
    else if (lower.includes('semry')) effectiveUrl = '/images/logos/semry.svg';
    else if (lower.includes('shs') || lower.includes('savonneries')) effectiveUrl = '/images/logos/shs.svg';
    else if (lower.includes('pallisco')) effectiveUrl = '/images/logos/pallisco.svg';
    else if (lower.includes('maviance') || lower.includes('smobilpay')) effectiveUrl = '/images/logos/maviance.svg';
    else if (lower.includes('guinness')) effectiveUrl = '/images/logos/guinness.svg';
    else if (lower.includes('bastos') && (lower.includes('clinique') || lower.includes('cmc'))) effectiveUrl = '/images/logos/bastos.svg';
    else if (lower.includes('hopital central') || lower.includes('hôpital central')) effectiveUrl = '/images/logos/hcy.svg';

    // Universities & Institutes
    else if (lower.includes('yaounde i') || lower.includes('yaoundé i') || lower.includes('uy1')) effectiveUrl = '/images/logos/uy1.svg';
    else if (lower.includes('yaounde ii') || lower.includes('yaoundé ii') || lower.includes('uy2') || lower.includes('soa')) effectiveUrl = '/images/logos/uy2.svg';
    else if (lower.includes('enspy') || lower.includes('polytechnique')) effectiveUrl = '/images/logos/enspy.svg';
    else if (lower.includes('ict university') || lower.includes('ictu')) effectiveUrl = '/images/logos/ictu.svg';
    else if (lower.includes('ucac') || lower.includes('catholique d\'afrique')) effectiveUrl = '/images/logos/ucac.svg';
    else if (lower.includes('siantou')) effectiveUrl = '/images/logos/siantou.svg';
    else if (lower.includes('universite de douala') || lower.includes('université de douala') || lower.includes('univ douala')) effectiveUrl = '/images/logos/udla.svg';
    else if (lower.includes('iuc')) effectiveUrl = '/images/logos/iuc.svg';
    else if (lower.includes('saint jerome') || lower.includes('saint jérôme') || lower.includes('st jérôme')) effectiveUrl = '/images/logos/stjerome.svg';
    else if (lower.includes('buea') || lower.includes('ub')) effectiveUrl = '/images/logos/ubuea.svg';
    else if (lower.includes('biaka') || lower.includes('buib')) effectiveUrl = '/images/logos/buib.svg';
    else if (lower.includes('dschang') || lower.includes('uds')) effectiveUrl = '/images/logos/udschang.svg';
    else if (lower.includes('pkfokam') || lower.includes('pkf')) effectiveUrl = '/images/logos/pkf.svg';
    else if (lower.includes('montagnes') || lower.includes('udm')) effectiveUrl = '/images/logos/udm.svg';
    else if (lower.includes('fotso victor') || lower.includes('iut-fv')) effectiveUrl = '/images/logos/iutfv.svg';
    else if (lower.includes('bamenda') || lower.includes('uba')) effectiveUrl = '/images/logos/uniba.svg';
    else if (lower.includes('catuc')) effectiveUrl = '/images/logos/catuc.svg';
    else if (lower.includes('garoua')) effectiveUrl = '/images/logos/ungaroua.svg';
    else if (lower.includes('maroua')) effectiveUrl = '/images/logos/umaroua.svg';
    else if (lower.includes('ngaoundere') || lower.includes('ngaoundéré')) effectiveUrl = '/images/logos/undere.svg';
    else if (lower.includes('bertoua')) effectiveUrl = '/images/logos/ubertoua.svg';
    else if (lower.includes('ebolowa')) effectiveUrl = '/images/logos/uebolowa.svg';
    else if (lower.includes('enstp') || lower.includes('travaux publics')) effectiveUrl = '/images/logos/enstp.svg';
    else if (lower.includes('supptic') || lower.includes('sup\'ptic')) effectiveUrl = '/images/logos/supptic.svg';
    else if (lower.includes('iric')) effectiveUrl = '/images/logos/iric.svg';
    else if (lower.includes('essec')) effectiveUrl = '/images/logos/essec.svg';
    else if (lower.includes('nahpi')) effectiveUrl = '/images/logos/nahpi.svg';
    else if (lower.includes('fomic')) effectiveUrl = '/images/logos/fomic.svg';
    else if (lower.includes('iugg') || lower.includes('grandes guinees') || lower.includes('grandes guinées')) effectiveUrl = '/images/logos/iugg.svg';
    else if (lower.includes('enam')) effectiveUrl = '/images/logos/enam.svg';
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

  // Generic styled Cameroon institution badge with first letter / initials (no generic icons)
  const firstLetter = (name.trim()[0] || 'M').toUpperCase();
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  const isUni = type === 'UNIVERSITY';

  return (
    <div
      className={`relative shrink-0 overflow-hidden flex items-center justify-center border shadow-md font-black ${
        isUni
          ? 'bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/30 text-emerald-300'
          : 'bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-950 border-blue-500/30 text-blue-300'
      } ${sizeCls} ${className}`}
      title={name}
    >
      <span className="tracking-wider uppercase">{initials || firstLetter}</span>
    </div>
  );
}

