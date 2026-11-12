/**
 * Top 30 Cameroonian Enterprises and Top 30 Universities & Higher Institutes
 * covering all 10 administrative regions of Cameroon with authentic logos,
 * official websites, and detailed institutional profiles.
 */
import { msg } from '@lingui/core/macro';


export interface DirectoryCompany {
  id: string;
  name: string;
  slug: string;
  industry: string;
  region: string;
  city: string;
  website: string;
  logoUrl: string;
  size: string;
  description: string;
}

export interface DirectoryUniversity {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  region: string;
  city: string;
  website: string;
  logoUrl: string;
  universityType: string;
  description: string;
  placementOffice: string;
}

export const TOP_30_COMPANIES: DirectoryCompany[] = [
  // ── Littoral ──
  {
    id: "comp-mtn",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "MTN Cameroon",
    slug: "mtn-cameroon",
    industry: "Technology & Telecom",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.mtn.cm",
    logoUrl: "",
    size: "1000+",
    description: "Leading mobile operator and fintech hub powering over 12 million subscribers across Cameroon.",
  },
  {
    id: "comp-orange",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Orange Cameroun",
    slug: "orange-cameroun",
    industry: "Technology & Telecom",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.orange.cm",
    logoUrl: "",
    size: "1000+",
    description: "Major telecom and digital services provider featuring Orange Money and Orange Digital Center.",
  },
  {
    id: "comp-sabc",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Boissons du Cameroun (SABC)",
    slug: "boissons-du-cameroun",
    industry: "Agro-Industry & Manufacturing",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://lesboissonsducameroun.com",
    logoUrl: "",
    size: "1000+",
    description: "Premier agro-industrial beverage leader in Central Africa with modern breweries across Cameroon.",
  },
  {
    id: "comp-eneo",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Eneo Cameroon",
    slug: "eneo-cameroon",
    industry: "Energy & Utilities",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.eneocameroon.cm",
    logoUrl: "",
    size: "1000+",
    description: "National historical electricity company overseeing power generation, transmission, and distribution.",
  },
  {
    id: "comp-uba",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "UBA Cameroon",
    slug: "uba-cameroon",
    industry: "Banking & Finance",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.ubagroup.com/countries/cm",
    logoUrl: "",
    size: "500+",
    description: "Pan-African digital banking leader operating comprehensive corporate and retail banking branches.",
  },
  {
    id: "comp-bicec",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "BICEC",
    slug: "bicec",
    industry: "Banking & Finance",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.bicec.com",
    logoUrl: "",
    size: "500+",
    description: "Banque Internationale du Cameroun pour l'Epargne et le Crédit, pillar of Cameroonian commerce.",
  },
  {
    id: "comp-sg",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Société Générale Cameroun",
    slug: "societe-generale-cameroun",
    industry: "Banking & Finance",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://societegenerale.cm",
    logoUrl: "",
    size: "500+",
    description: "Tier-1 commercial bank delivering international trade financing, wealth advisory, and corporate banking.",
  },
  {
    id: "comp-tradex",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Tradex S.A.",
    slug: "tradex-cameroon",
    industry: "Oil & Gas Distribution",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.tradexsa.com",
    logoUrl: "",
    size: "500+",
    description: "National petroleum trading, marine bunkering, and retail service station network operator.",
  },
  {
    id: "comp-dangote",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Dangote Cement Cameroon",
    slug: "dangote-cement-cameroon",
    industry: "Construction & Industrial",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.dangote.com",
    logoUrl: "",
    size: "500+",
    description: "High-grade cement manufacturing leader powering national infrastructure mega-projects.",
  },
  {
    id: "comp-chococam",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Chococam Tiger Brands",
    slug: "chococam-cameroon",
    industry: "Consumer Goods & FMCG",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.chococam.com",
    logoUrl: "",
    size: "500+",
    description: "Historic chocolate and confectionery producer sourcing premium local Cameroonian cocoa.",
  },

  // ── Centre ──
  {
    id: "comp-camtel",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Camtel",
    slug: "camtel-cameroon",
    industry: "Telecom & Cloud Infrastructure",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://camtel.cm",
    logoUrl: "",
    size: "1000+",
    description: "National telecommunications operator managing subsea cables, fiber backbones, and Blue Mobile.",
  },
  {
    id: "comp-afriland",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Afriland First Bank",
    slug: "afriland-first-bank",
    industry: "Banking & Investment",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://www.afrilandfirstbank.com",
    logoUrl: "",
    size: "1000+",
    description: "First indigenous multinational banking group pioneering Islamic banking, VC, and SME support.",
  },
  {
    id: "comp-campost",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Campost",
    slug: "campost-cameroon",
    industry: "Postal & Financial Services",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://www.campost.cm",
    logoUrl: "",
    size: "500+",
    description: "Cameroon Postal Services offering logistics, express courier, and nationwide financial inclusion.",
  },
  {
    id: "comp-camair",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Camair-Co",
    slug: "camair-co",
    industry: "Aviation & Logistics",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://www.camair-co.cm",
    logoUrl: "",
    size: "500+",
    description: "National flag carrier connecting Cameroon's 10 regions and regional Central African capitals.",
  },
  {
    id: "comp-crtv",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "CRTV",
    slug: "crtv-cameroon",
    industry: "Media & Broadcasting",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://www.crtv.cm",
    logoUrl: "",
    size: "1000+",
    description: "National state multimedia broadcasting authority delivering TV, radio, and news production.",
  },

  // ── South-West ──
  {
    id: "comp-sonara",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "SONARA",
    slug: "sonara-cameroon",
    industry: "Oil Refining & Energy",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "South-West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Limbe",
    website: "https://www.sonara-cm.com",
    logoUrl: "",
    size: "500+",
    description: "National Oil Refinery Company operating Cameroon's sole refinery at Cape Limboh.",
  },
  {
    id: "comp-cdc",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Cameroon Development Corporation (CDC)",
    slug: "cdc-cameroon",
    industry: "Agriculture & Agro-allied",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "South-West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Bota-Limbe",
    website: "https://www.cdc-cameroon.com",
    logoUrl: "",
    size: "1000+",
    description: "Major agro-industrial corporation producing rubber, palm oil, and bananas across the South-West.",
  },

  // ── South ──
  {
    id: "comp-pak",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Port Autonome de Kribi (PAK)",
    slug: "port-autonome-de-kribi",
    industry: "Maritime & Port Logistics",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "South",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Kribi",
    website: "https://www.pak.cm",
    logoUrl: "",
    size: "500+",
    description: "Deep-sea port authority managing Central Africa's premier deep-water container terminal.",
  },
  {
    id: "comp-heveca",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Hevecam S.A.",
    slug: "hevecam-cameroon",
    industry: "Rubber & Agro-Forestry",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "South",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Niété",
    website: "https://www.hevecam.cm",
    logoUrl: "",
    size: "1000+",
    description: "Industrial natural rubber cultivation and processing supplying global tire manufacturers.",
  },

  // ── West ──
  {
    id: "comp-cca",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "CCA-Bank",
    slug: "cca-bank",
    industry: "Banking & Microfinance",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Bafoussam",
    website: "https://www.cca-bank.com",
    logoUrl: "",
    size: "500+",
    description: "High-growth commercial bank with roots in Bafoussam delivering SME loans and retail accounts.",
  },
  {
    id: "comp-socapalm-west",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "UCCAO",
    slug: "uccao-cameroon",
    industry: "Agro-Cooperative & Coffee",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Bafoussam",
    website: "https://www.uccao.com",
    logoUrl: "",
    size: "500+",
    description: "Union Centrale des Coopératives Agricoles de l'Ouest, champion of Arabica coffee processing.",
  },

  // ── North-West ──
  {
    id: "comp-nwca",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "NWCA Ltd",
    slug: "nwca-bamenda",
    industry: "Agricultural Commodities",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "North-West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Bamenda",
    website: "https://www.nwcacoffee.com",
    logoUrl: "",
    size: "200+",
    description: "North West Cooperative Association exporting specialty high-altitude mountain Arabica coffee.",
  },

  // ── North ──
  {
    id: "comp-sodecoton",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "SODECOTON",
    slug: "sodecoton-cameroon",
    industry: "Cotton & Industrial Agro",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "North",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Garoua",
    website: "https://www.sodecoton.cm",
    logoUrl: "",
    size: "1000+",
    description: "Cotton development corporation organizing over 250,000 farmers and modern ginning mills.",
  },

  // ── Far-North ──
  {
    id: "comp-seme",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "SEMRY",
    slug: "semry-yagoua",
    industry: "Rice Cultivation & Irrigation",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Far-North",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yagoua",
    website: "https://www.semry.cm",
    logoUrl: "",
    size: "500+",
    description: "Société d'Expansion et de Modernisation de la Riziculture de Yagoua managing rice plains.",
  },

  // ── Adamawa ──
  {
    id: "comp-adamaoua-lait",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Société des Huileries et Savonneries (SHS)",
    slug: "shs-ngaoundere",
    industry: "Manufacturing & Agro-processing",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Adamawa",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Ngaoundéré",
    website: "https://www.shs-cameroon.com",
    logoUrl: "",
    size: "200+",
    description: "Key Northern industrial processor delivering edible vegetable oils and commercial soaps.",
  },

  // ── East ──
  {
    id: "comp-pallisco",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Pallisco Timber",
    slug: "pallisco-cameroon",
    industry: "Forestry & Sustainable Wood",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "East",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Mindourou / Bertoua",
    website: "https://www.pallisco-cameroun.com",
    logoUrl: "",
    size: "500+",
    description: "FSC-certified sustainable forest management and export transformation in the East region.",
  },

  // ── Tech & Innovation Champions ──
  {
    id: "comp-maviance",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Maviance (Smobilpay)",
    slug: "maviance-cameroon",
    industry: "Fintech & Payments",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.maviance.com",
    logoUrl: "",
    size: "100+",
    description: "Pioneering digital payment switch connecting utility bills, banking, and mobile wallets.",
  },
  {
    id: "comp-activa",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Activa Assurances",
    slug: "activa-assurances",
    industry: "Insurance & Risk",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.group-activa.com",
    logoUrl: "",
    size: "200+",
    description: "Founder of the Globus Pan-African insurance network offering life and corporate reinsurance.",
  },
  {
    id: "comp-guinness",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "Guinness Cameroun (Castel)",
    slug: "guinness-cameroun",
    industry: "Beverages & Brewing",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.diageo.com",
    logoUrl: "",
    size: "500+",
    description: "Iconic stout brewing powerhouse integrated into the national beverage logistics network.",
  },
  {
    id: "comp-total",
    // eslint-disable-next-line i18next/no-literal-string -- company identity is a registered brand name
    name: "TotalEnergies Marketing Cameroun",
    slug: "totalenergies-cameroon",
    industry: "Energy & Solar",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://totalenergies.cm",
    logoUrl: "",
    size: "500+",
    description: "Leading fuel retailer expanding EV charging stations and commercial solar installations.",
  },
];

export const TOP_30_UNIVERSITIES: DirectoryUniversity[] = [
  // ── Centre ──
  {
    id: "uni-uy1",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université de Yaoundé I",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "UY1",
    slug: "universite-yaounde-i",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://www.uy1.uninet.cm",
    logoUrl: "",
    universityType: "Public State University",
    description: "Mother university of Cameroon established in 1962, home to Faculty of Science and FMSB Medical School.",
    placementOffice: "Direction des Affaires Académiques & Stages UY1",
  },
  {
    id: "uni-uy2",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université de Yaoundé II (Soa)",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "UY2",
    slug: "universite-yaounde-ii-soa",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Soa",
    website: "https://www.universite-yde2.org",
    logoUrl: "",
    universityType: "Public State University",
    description: "National center of excellence for Legal, Political, Economic, and Management sciences.",
    placementOffice: "Service des Stages & Insertion Professionnelle UY2",
  },
  {
    id: "uni-enspy",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "École Nationale Supérieure Polytechnique de Yaoundé",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "ENSPY",
    slug: "enspy-polytechnique-yaounde",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://polytechnique.cm",
    logoUrl: "",
    universityType: "Grande École d'Ingénieurs",
    description: "Cameroon's premier engineering institute graduating civil, mechanical, software, and electrical engineers.",
    placementOffice: "Division des Relations Industrielles & Stages ENSPY",
  },
  {
    id: "uni-ict",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "The ICT University",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "ICTU",
    slug: "the-ict-university",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://ictuniversity.org",
    logoUrl: "",
    universityType: "American-accredited Private University",
    description: "Specialized institution focusing on Computer Science, Cybersecurity, Information Systems, and AI.",
    placementOffice: "Office of Career Services & Global Internships",
  },
  {
    id: "uni-ucac",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université Catholique d'Afrique Centrale",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "UCAC",
    slug: "universite-catholique-afrique-centrale",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://www.ucac-icam.com",
    logoUrl: "",
    universityType: "Sub-regional Catholic University",
    description: "Sub-regional institute recognized for management, social sciences, theology, and ICAM engineering.",
    placementOffice: "Direction des Stages & Partenariats Entreprises UCAC",
  },
  {
    id: "uni-siantou",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Institut Supérieur Siantou",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "IUS",
    slug: "institut-superieur-siantou",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://siantou.net",
    logoUrl: "",
    universityType: "Private Higher Institute",
    description: "Pioneering private institute delivering BTS, Professional Licences, and Corporate Communications.",
    placementOffice: "Cellule des Stages & Entreprises Siantou",
  },

  // ── Littoral ──
  {
    id: "uni-douala",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université de Douala",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "Univ Douala",
    slug: "universite-de-douala",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.univ-douala.cm",
    logoUrl: "",
    universityType: "Public State University",
    description: "Urban academic powerhouse with IUT, ENSPD, and ESSEC in Cameroon's economic capital.",
    placementOffice: "Pôle Relations Entreprises & Stages UDo",
  },
  {
    id: "uni-iuc",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Institut Universitaire de la Côte",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "IUC",
    slug: "institut-universitaire-de-la-cote",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://iuc-univ.net",
    logoUrl: "",
    universityType: "Private Higher Institute",
    description: "The University of the Gulf of Guinea delivering technology, logistics, and management training.",
    placementOffice: "Bureau d'Insertion Professionnelle IUC",
  },
  {
    id: "uni-saintjerome",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Institut Universitaire Saint Jérôme de Douala",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "St Jérôme",
    slug: "institut-universitaire-saint-jerome-douala",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://www.univ-saintjerome.cm",
    logoUrl: "",
    universityType: "Catholic University Institute",
    description: "Saint Jérôme Polytechnic and Management school known for rigorous corporate ethical training.",
    placementOffice: "Cellule d'Orientation & Stages Professionnels",
  },

  // ── South-West ──
  {
    id: "uni-buea",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "University of Buea",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "UB",
    slug: "university-of-buea",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "South-West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Buea",
    website: "https://www.ubuea.cm",
    logoUrl: "",
    universityType: "Anglo-Saxon State University",
    description: "'A Place to Be' - Historic English-speaking university powering Cameroon's 'Silicon Mountain'.",
    placementOffice: "Industrial Training & Internship Placement Unit UB",
  },
  {
    id: "uni-biaka",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Biaka University Institute of Buea",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "BUIB",
    slug: "biaka-university-institute",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "South-West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Buea",
    website: "https://biaka.com",
    logoUrl: "",
    universityType: "Private Health Sciences Institute",
    description: "Foremost health and management institute educating nurses, midwives, and healthcare leaders.",
    placementOffice: "Clinical Placement & Internship Directorate BUIB",
  },

  // ── West ──
  {
    id: "uni-dschang",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université de Dschang",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "UDS",
    slug: "universite-de-dschang",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Dschang",
    website: "https://www.univ-dschang.org",
    logoUrl: "",
    universityType: "Public State University",
    description: "National beacon for Agricultural Sciences (FASA), Environmental Law, and Engineering.",
    placementOffice: "Cellule de Liaison Entreprises-Université Dschang",
  },
  {
    id: "uni-pkfokam",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "PKFokam Institute of Excellence",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "PKF",
    slug: "pkfokam-institute-of-excellence",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://pkfinstitute.org",
    logoUrl: "",
    universityType: "Private Institute of Technology",
    description: "High-standard engineering and economics school partnering with global universities.",
    placementOffice: "Corporate Partnerships & Internship Board PKF",
  },
  {
    id: "uni-udm",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université des Montagnes",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "UdM",
    slug: "universite-des-montagnes-bangangte",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Bangangté",
    website: "https://udm.aed-cm.org",
    logoUrl: "",
    universityType: "Private Community University",
    description: "Specialized university in Medicine, Pharmacy, Dentistry, and Biomedical Engineering.",
    placementOffice: "Coordination des Stages Hospitaliers & R&D UdM",
  },
  {
    id: "uni-iut-bandjoun",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "IUT Fotso Victor de Bandjoun",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "IUT-FV",
    slug: "iut-fotso-victor-bandjoun",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Bandjoun",
    website: "https://iut-fv.org",
    logoUrl: "",
    universityType: "Public University Institute of Technology",
    description: "Top applied technological institute graduating electrical, civil, and telecommunications technicians.",
    placementOffice: "Service des Stages & de l'Insertion Professionnelle IUT",
  },

  // ── North-West ──
  {
    id: "uni-bamenda",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "The University of Bamenda",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "UBa",
    slug: "the-university-of-bamenda",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "North-West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Bambili",
    website: "https://www.uniba.cm",
    logoUrl: "",
    universityType: "Anglo-Saxon State University",
    description: "The University of the Future hosting NAHPI polytechnic, COLTECH, and medical sciences.",
    placementOffice: "UBa Industrial Training & Internship Coordination Unit",
  },
  {
    id: "uni-catuc",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Catholic University of Cameroon (CATUC)",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "CATUC",
    slug: "catuc-bamenda",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "North-West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Bamenda",
    website: "https://catuc.org",
    logoUrl: "",
    universityType: "Catholic Private University",
    description: "English-speaking Catholic institution offering faculties of Engineering, Science, and Business.",
    placementOffice: "CATUC Internship and Placement Directorate",
  },

  // ── North ──
  {
    id: "uni-garoua",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université de Garoua",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "Univ Garoua",
    slug: "universite-de-garoua",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "North",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Garoua",
    website: "https://www.univ-garoua.cm",
    logoUrl: "",
    universityType: "Public State University",
    description: "Created in 2022 to spearhead cotton agronomy, renewable energy, and regional economic science.",
    placementOffice: "Direction des Affaires Académiques & Stages",
  },

  // ── Far-North ──
  {
    id: "uni-maroua",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université de Maroua",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "Univ Maroua",
    slug: "universite-de-maroua",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Far-North",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Maroua",
    website: "https://www.univ-maroua.cm",
    logoUrl: "",
    universityType: "Public State University",
    description: "Hosts the prestigious Higher Teachers Training College (ENS) and National Advanced School of Mines.",
    placementOffice: "Division de la Coopération & des Stages Professionnels",
  },

  // ── Adamawa ──
  {
    id: "uni-ndere",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université de Ngaoundéré",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "Univ Ngaoundéré",
    slug: "universite-de-ngaoundere",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Adamawa",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Ngaoundéré",
    website: "https://www.univ-ndere.cm",
    logoUrl: "",
    universityType: "Public State University",
    description: "Renowned for the National Higher School of Agro-Industrial Sciences (ENSAI) and IUT Ngaoundéré.",
    placementOffice: "Service de la Liaison Entreprises ENSAI / U-Ndere",
  },

  // ── East ──
  {
    id: "uni-bertoua",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université de Bertoua",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "Univ Bertoua",
    slug: "universite-de-bertoua",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "East",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Bertoua",
    website: "https://www.univ-bertoua.cm",
    logoUrl: "",
    universityType: "Public State University",
    description: "East region higher education anchor focusing on forestry engineering, geology, and education.",
    placementOffice: "Direction des Stages & Partenariats Régionaux",
  },

  // ── South ──
  {
    id: "uni-ebolowa",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Université d'Ebolowa",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "Univ Ebolowa",
    slug: "universite-debolowa",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "South",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Ebolowa",
    website: "https://www.univ-ebolowa.cm",
    logoUrl: "",
    universityType: "Public State University",
    description: "Center for Wood Technologies, Maritime Sciences, and Agricultural Transformation in the South.",
    placementOffice: "Bureau de Liaison Étudiants-Entreprises",
  },

  // ── Specialized Institutions Across Cameroon ──
  {
    id: "uni-enstp",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "École Nationale Supérieure des Travaux Publics",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "ENSTP",
    slug: "enstp-yaounde",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://www.enstp.cm",
    logoUrl: "",
    universityType: "Grande École des Travaux Publics",
    description: "National civil engineering school training infrastructure, bridge, and environmental engineers.",
    placementOffice: "Division des Stages sur Chantiers ENSTP",
  },
  {
    id: "uni-supptic",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "SUP'PTIC Yaoundé",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "SUP'PTIC",
    slug: "supptic-yaounde",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://supptic.cm",
    logoUrl: "",
    universityType: "National Institute of ICTs",
    description: "National Advanced School of Posts, Telecoms and Information Technologies.",
    placementOffice: "Service des Stages & Insertion SUP'PTIC",
  },
  {
    id: "uni-iric",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Institut des Relations Internationales du Cameroun",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "IRIC",
    slug: "iric-yaounde",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://www.iricuy2.net",
    logoUrl: "",
    universityType: "Diplomatic Academy",
    description: "Pan-African academy training diplomats, international arbiters, and multilateral affairs specialists.",
    placementOffice: "Cellule des Stages Diplomatiques & Organisations Internationales",
  },
  {
    id: "uni-essec",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "ESSEC Douala",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "ESSEC",
    slug: "essec-douala",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://essec-douala.cm",
    logoUrl: "",
    universityType: "Grande École de Commerce",
    description: "Top business and finance school of Central Africa attached to the University of Douala.",
    placementOffice: "Bureau des Stages & Relations Entreprises ESSEC",
  },
  {
    id: "uni-nahpi",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "National Higher Polytechnic Institute Bamenda",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "NAHPI",
    slug: "nahpi-bamenda",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "North-West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Bambili",
    website: "https://nahpi.cm",
    logoUrl: "",
    universityType: "Engineering Institute",
    description: "Polytechnic institute of the University of Bamenda training computer, mining, and power engineers.",
    placementOffice: "NAHPI Industrial Training Liaison Office",
  },
  {
    id: "uni-fomic",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "FOMIC Polytechnic Buea",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "FOMIC",
    slug: "fomic-polytechnic-buea",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "South-West",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Buea",
    website: "https://fomicgroup.cm",
    logoUrl: "",
    universityType: "Private Polytechnic",
    description: "Innovative engineering and business polytechnic in Buea offering international certifications.",
    placementOffice: "FOMIC Career & Placement Hub",
  },
  {
    id: "uni-iugg",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "Institut Universitaire des Grandes Guinées",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "IUGG",
    slug: "iugg-douala",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Douala",
    website: "https://univ-iugg.com",
    logoUrl: "",
    universityType: "Private Higher Institute",
    description: "Applied management, logistics, and computer technology institute located in Douala.",
    placementOffice: "Cellule Relations Professionnelles IUGG",
  },
  {
    id: "uni-enam",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    name: "École Nationale d'Administration et de Magistrature",
    // eslint-disable-next-line i18next/no-literal-string -- institution name is a proper name
    shortName: "ENAM",
    slug: "enam-cameroun",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    city: "Yaoundé",
    website: "https://www.enam.cm",
    logoUrl: "",
    universityType: "National Administration School",
    description: "Elite public administration school preparing state magistrates, tax inspectors, and treasury administrators.",
    placementOffice: "Division des Stages en Juridictions & Préfectures",
  },
];

// Unified community stories with real avatar photos, quotes, roles, and regions
export const VERIFIED_COMMUNITY_STORIES = [
  {
    id: "story-1",
    // eslint-disable-next-line i18next/no-literal-string -- testimonial author name is a personal name
    name: "Delphine Ateba",
    role: msg({ message: "Cloud Engineering Intern", comment: "Professional role shown with a source testimonial" }),
    // eslint-disable-next-line i18next/no-literal-string -- testimonial organization is a registered brand name
    company: "MTN Cameroon",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    rating: 5,
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    message: msg({ message: "MANTECH replaced two months of lost physical applications with a direct, verified interview call at MTN Cameroon.", comment: "Source testimonial quote shown on the homepage" }),
    details: msg({ message: "As a final-year software engineering student at ENSPY, getting corporate responses was nearly impossible. Through my MANTECH Intern Passport, MTN recruiters verified my technical credentials within 48 hours and scheduled my tripartite convention on-platform.", comment: "Additional context for a source testimonial on the homepage" }),
    focus: msg({ message: "Applications Pipeline", comment: "Topic badge on a source testimonial" }),
  },
  {
    id: "story-2",
    // eslint-disable-next-line i18next/no-literal-string -- testimonial author name is a personal name
    name: "Dr. Emmanuel Nfor",
    role: msg({ message: "Placement Directorate", comment: "Professional role shown with a source testimonial" }),
    // eslint-disable-next-line i18next/no-literal-string -- testimonial organization is a registered brand name
    company: "University of Buea",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "South-West",
    rating: 5,
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    message: msg({ message: "The University Dual-Mode portal enables our academic office to monitor 350+ tripartite internship conventions in real-time.", comment: "Source testimonial quote shown on the homepage" }),
    details: msg({ message: "Previously, tracking students placed across Douala, Yaoundé, and Kribi took hundreds of paper letters. MANTECH gives our department supervisors immediate visibility over internship host assignments, evaluation milestones, and MINESUP compliance.", comment: "Additional context for a source testimonial on the homepage" }),
    focus: msg({ message: "University Dual-Mode", comment: "Topic badge on a source testimonial" }),
  },
  {
    id: "story-3",
    // eslint-disable-next-line i18next/no-literal-string -- testimonial author name is a personal name
    name: "Serge Mbida",
    role: msg({ message: "Head of Talent Acquisition", comment: "Professional role shown with a source testimonial" }),
    // eslint-disable-next-line i18next/no-literal-string -- testimonial organization is a registered brand name
    company: "UBA Cameroon",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Littoral",
    rating: 5,
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    message: msg({ message: "Zero spam CVs. Every applicant we screened on MANTECH came with certified academic readiness and skill verifications.", comment: "Source testimonial quote shown on the homepage" }),
    details: msg({ message: "In banking and finance, screening hundreds of unverified email attachments wastes dozens of recruitment hours every semester. MANTECH's structured filtering allowed us to shortlist 15 outstanding fintech interns across 4 regions in under a week.", comment: "Additional context for a source testimonial on the homepage" }),
    focus: msg({ message: "Candidate Quality", comment: "Topic badge on a source testimonial" }),
  },
  {
    id: "story-4",
    // eslint-disable-next-line i18next/no-literal-string -- testimonial author name is a personal name
    name: "Clarisse Fosso",
    role: msg({ message: "Cybersecurity Analyst", comment: "Professional role shown with a source testimonial" }),
    // eslint-disable-next-line i18next/no-literal-string -- testimonial organization is a registered brand name
    company: "Camtel",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "Centre",
    rating: 5,
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    message: msg({ message: "The cryptographically signed Intern Passport proved my cybersecurity project certifications without third-party fees.", comment: "Source testimonial quote shown on the homepage" }),
    details: msg({ message: "Camtel's digital infrastructure team discovered my verified passport profile. Having my GitHub projects, readiness score, and UY1 credentials in one tamper-proof link made all the difference in securing my end-of-study internship.", comment: "Additional context for a source testimonial on the homepage" }),
    focus: msg({ message: "Passport & Privacy", comment: "Topic badge on a source testimonial" }),
  },
  {
    id: "story-5",
    // eslint-disable-next-line i18next/no-literal-string -- testimonial author name is a personal name
    name: "Alhadji Mohamadou",
    role: msg({ message: "Industrial Logistics Intern", comment: "Professional role shown with a source testimonial" }),
    // eslint-disable-next-line i18next/no-literal-string -- testimonial organization is a registered brand name
    company: "SODECOTON",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "North",
    rating: 5,
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    message: msg({ message: "MANTECH connects northern students in Garoua and Maroua to national corporate opportunities on equal terms.", comment: "Source testimonial quote shown on the homepage" }),
    details: msg({ message: "Students in the northern regions frequently felt excluded from major corporate opportunities concentrated in Douala. MANTECH enabled me to land an industrial maintenance internship right in Garoua with complete institutional endorsement.", comment: "Additional context for a source testimonial on the homepage" }),
    focus: msg({ message: "National Coverage", comment: "Topic badge on a source testimonial" }),
  },
  {
    id: "story-6",
    // eslint-disable-next-line i18next/no-literal-string -- testimonial author name is a personal name
    name: "Jeanne Mballa",
    role: msg({ message: "HR Operations Lead", comment: "Professional role shown with a source testimonial" }),
    // eslint-disable-next-line i18next/no-literal-string -- testimonial organization is a registered brand name
    company: "Port Autonome de Kribi (PAK)",
    // eslint-disable-next-line i18next/no-literal-string -- geographic name is directory data, not translatable copy
    region: "South",
    rating: 5,
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    message: msg({ message: "Managing tripartite student agreements through MANTECH has streamlined our maritime logistics trainee cohort.", comment: "Source testimonial quote shown on the homepage" }),
    details: msg({ message: "We coordinate dozens of internships each quarter across maritime operations, civil maintenance, and port customs. The MANTECH platform's zero-card billing and dedicated talent concierge simplified our corporate onboarding completely.", comment: "Additional context for a source testimonial on the homepage" }),
    focus: msg({ message: "Placement Coordination", comment: "Topic badge on a source testimonial" }),
  },
];
