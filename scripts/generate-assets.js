const fs = require('fs');
const path = require('path');

const flyersDir = path.join(process.cwd(), 'public', 'uploads', 'flyers');
const logosDir = path.join(process.cwd(), 'public', 'images', 'logos');
const avatarsDir = path.join(process.cwd(), 'public', 'images', 'avatars');

[flyersDir, logosDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── 1. GENERATE AUTHENTIC COMPANY LOGOS ──────────────────────────────────────
const companyLogos = [
  { file: 'mtn.svg', bg: '#FFCC00', fg: '#000000', text: 'MTN', sub: 'CAMEROON' },
  { file: 'orange.svg', bg: '#FF6600', fg: '#FFFFFF', text: 'orange', sub: 'CAMEROUN' },
  { file: 'sabc.svg', bg: '#B81D24', fg: '#FFD700', text: 'SABC', sub: 'BOISSONS DU CAMEROUN' },
  { file: 'eneo.svg', bg: '#0055A5', fg: '#FF7900', text: 'eneo', sub: 'CAMEROON' },
  { file: 'uba.svg', bg: '#D32027', fg: '#FFFFFF', text: 'UBA', sub: 'AFRICA' },
  { file: 'camtel.svg', bg: '#002B7F', fg: '#00A859', text: 'CAMTEL', sub: 'MADE IN CAMEROON' },
  { file: 'totalenergies.svg', bg: '#ED1C24', fg: '#FFFFFF', text: 'Total', sub: 'ENERGIES' },
  { file: 'socgen.svg', bg: '#000000', fg: '#E4002B', text: 'SG', sub: 'CAMEROUN' },
  { file: 'tradex.svg', bg: '#0A3B7E', fg: '#E31B23', text: 'TRADEX', sub: 'PETROLEUM' },
  { file: 'dangote.svg', bg: '#0A1172', fg: '#FFFFFF', text: 'DANGOTE', sub: 'CEMENT' },
  { file: 'activa.svg', bg: '#00833E', fg: '#F8B133', text: 'ACTIVA', sub: 'ASSURANCES' },
  { file: 'iuc.svg', bg: '#0F2027', fg: '#2C5364', text: 'IUC', sub: 'UNIVERSITÉ' },
  { file: 'pwc.svg', bg: '#2D2D2D', fg: '#EB8C00', text: 'pwc', sub: 'CAMEROON' },
  { file: 'bastos.svg', bg: '#10707F', fg: '#FFFFFF', text: 'CMC', sub: 'BASTOS' },
  { file: 'hcy.svg', bg: '#1E3A8A', fg: '#10B981', text: 'HCY', sub: 'CENTRAL YAOUNDÉ' },
];

companyLogos.forEach(logo => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" rx="40" fill="${logo.bg}"/>
    <circle cx="100" cy="90" r="55" fill="rgba(255,255,255,0.1)"/>
    <text x="100" y="102" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" fill="${logo.fg}" text-anchor="middle" letter-spacing="1">${logo.text}</text>
    <text x="100" y="138" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="${logo.fg}" text-anchor="middle" opacity="0.85" letter-spacing="2">${logo.sub}</text>
  </svg>`;
  fs.writeFileSync(path.join(logosDir, logo.file), svg, 'utf-8');
});

// ── 2. GENERATE 15 AUTHENTIC CAMEROON RECRUITMENT FLYERS (SVG ARTWORK) ───────
const flyers = [
  {
    file: 'flyer_mtn_graduate_2026.svg',
    title: 'GRADUATE SOFTWARE & CLOUD COHORT 2026',
    company: 'MTN CAMEROON',
    category: 'STAGE PROFESSIONNEL & PRÉ-EMPLOI',
    type: 'INTERNSHIP',
    city: 'DOUALA (SIÈGE BONANJO)',
    deadline: '15 DÉCEMBRE 2026',
    stipend: '150,000 FCFA / MOIS',
    bg: '#000000',
    primary: '#FFCC00',
    accent: '#10B981',
    skills: 'TypeScript • React • Node.js • AWS/GCP Cloud • Microservices',
    contact: '+237 671 23 45 67',
    summary: 'Programme d’excellence technologique pour jeunes diplômés en génie logiciel et cloud architecture.',
    level: 'Bac+4 / Bac+5 (Master ou Ingénieur informatique)',
  },
  {
    file: 'flyer_orange_digital_center.svg',
    title: 'DEVELOPPEURS FULLSTACK & MOBILE BOOTCAMP',
    company: 'ORANGE DIGITAL CENTER CAMEROUN',
    category: 'ACADÉMIE NUMÉRIQUE TECH 2026',
    type: 'INTERNSHIP',
    city: 'YAOUNDÉ (MVOY-MADA)',
    deadline: '30 NOVEMBRE 2026',
    stipend: '120,000 FCFA + CERTIFICATION',
    bg: '#1A1A1A',
    primary: '#FF6600',
    accent: '#06B6D4',
    skills: 'Flutter • Next.js • Python • API REST • Agile Scrum',
    contact: '+237 691 23 45 67',
    summary: 'Immersion intensive de 6 mois avec encadrement par les experts logiciels d’Orange Cameroun.',
    level: 'Bac+2 à Bac+5 en Informatique ou Télécoms',
  },
  {
    file: 'flyer_sabc_commercial.svg',
    title: 'STAGIAIRE CHEF DE SECTEUR COMMERCIAL & MARKETING',
    company: 'BOISSONS DU CAMEROUN (SABC)',
    category: 'STAGE PRÉ-EMPLOI COMMERCIAL',
    type: 'JOB',
    city: 'DOUALA & BAFOUSSAM',
    deadline: '20 DÉCEMBRE 2026',
    stipend: '180,000 FCFA + PRIMES',
    bg: '#3B0A0D',
    primary: '#F59E0B',
    accent: '#EF4444',
    skills: 'Négociation B2B • Prospection Terrain • Merchandising • Reporting',
    contact: '+237 670 11 22 33',
    summary: 'Développez la distribution et le suivi des points de vente régionaux pour le leader brassicole.',
    level: 'Licence ou Master en Commerce, Marketing ou Vente',
  },
  {
    file: 'flyer_eneo_grid_maintenance.svg',
    title: 'STAGIAIRE INGÉNIEUR POSTES & RÉSEAUX HT/MT',
    company: 'ENEO CAMEROON S.A.',
    category: 'STAGE TECHNIQUE ÉLECTROTECHNIQUE',
    type: 'INTERNSHIP',
    city: 'EDÉA & DOUALA',
    deadline: '10 JANVIER 2027',
    stipend: '140,000 FCFA / MOIS',
    bg: '#031B4E',
    primary: '#38BDF8',
    accent: '#F97316',
    skills: 'Schémas Électriques • Protection Réseaux • Transformateurs • Maintenance HT',
    contact: '+237 677 88 99 00',
    summary: 'Accompagnement des équipes de transport et maintenance sur les postes électriques nationaux.',
    level: 'Ingénieur ou Master Électrotechnique / Génie Électrique',
  },
  {
    file: 'flyer_uba_banking_ops.svg',
    title: 'CHARGE D’ACCUEIL & ASSISTANT AUDIT D’AGENCE',
    company: 'UBA CAMEROON (UNITED BANK FOR AFRICA)',
    category: 'RECRUTEMENT JEUNE DIPLÔMÉ',
    type: 'JOB',
    city: 'DOUALA & YAOUNDÉ',
    deadline: '28 DÉCEMBRE 2026',
    stipend: '250,000 FCFA / MOIS',
    bg: '#450A0A',
    primary: '#EF4444',
    accent: '#FBBF24',
    skills: 'Gestion de Caisse • Conformité AML/KYC • Accueil Clientèle • Excel Avancé',
    contact: '+237 678 99 00 11',
    summary: 'Opportunité d’insertion rapide au sein des agences bancaires de référence UBA Cameroun.',
    level: 'Bac+3 / Bac+5 en Banque, Finance, Comptabilité',
  },
  {
    file: 'flyer_totalenergies_hse.svg',
    title: 'YOUNG GRADUATE QUALITÉ, HYGIÈNE, SÉCURITÉ & ENVIRONNEMENT',
    company: 'TOTALENERGIES CAMEROUN',
    category: 'PROGRAMME YOUNG TALENTS HSE',
    type: 'INTERNSHIP',
    city: 'DOUALA (PORT DE BONABÉRI)',
    deadline: '05 JANVIER 2027',
    stipend: '175,000 FCFA / MOIS',
    bg: '#0F172A',
    primary: '#EF4444',
    accent: '#10B981',
    skills: 'Audit Sécurité • Réglementation ICPE • Risques Industriels • ISO 14001',
    contact: '+237 699 00 11 22',
    summary: 'Supervision des protocoles de sécurité industrielle sur les dépôts de stockage de carburant.',
    level: 'Master / Diplôme d’Ingénieur HSE ou Génie Industriel',
  },
  {
    file: 'flyer_hopital_central_pharm.svg',
    title: 'STAGE CLINIQUES, SOINS INFIRMIERS & GESTION PHARMACIE',
    company: 'HÔPITAL CENTRAL DE YAOUNDÉ',
    category: 'STAGE ACADÉMIQUE SANTÉ & MÉDICAL',
    type: 'INTERNSHIP',
    city: 'YAOUNDÉ (CENTRE VILLE)',
    deadline: '15 JANVIER 2027',
    stipend: 'INDEMNITÉ + REPAS',
    bg: '#064E3B',
    primary: '#34D399',
    accent: '#60A5FA',
    skills: 'Dispensation Médicaments • Prise Constantes • Traçabilité Soins • Triage',
    contact: '+237 675 44 33 22',
    summary: 'Immersion en milieu hospitalier de référence pour futurs professionnels de la santé.',
    level: 'Étudiants Médecine, Pharmacie, Soins Infirmiers (IDE)',
  },
  {
    file: 'flyer_camtel_fiber_optics.svg',
    title: 'TECHNICIEN FIBRE OPTIQUE & TRANSMISSION IP',
    company: 'CAMTEL (CAMEROON TELECOMMUNICATIONS)',
    category: 'STAGE TECHNIQUE & INSERTION',
    type: 'JOB',
    city: 'YAOUNDÉ & BUEA',
    deadline: '12 JANVIER 2027',
    stipend: '200,000 FCFA / MOIS',
    bg: '#0A2540',
    primary: '#38BDF8',
    accent: '#10B981',
    skills: 'Raccordement FO • Réflectométrie (OTDR) • Réseaux IP/MPLS • Baies Télécom',
    contact: '+237 690 12 34 56',
    summary: 'Déploiement et dépannage du backbone national de fibre optique de Camtel.',
    level: 'BTS, DUT ou Licence Professionnelle Réseaux & Télécoms',
  },
  {
    file: 'flyer_socgen_audit.svg',
    title: 'ASSISTANT AUDIT INTERNE & GESTION DES RISQUES',
    company: 'SOCIÉTÉ GÉNÉRALE CAMEROUN',
    category: 'STAGE D’EXCELLENCE FINANCIÈRE',
    type: 'INTERNSHIP',
    city: 'DOUALA (BONANJO)',
    deadline: '22 DÉCEMBRE 2026',
    stipend: '160,000 FCFA / MOIS',
    bg: '#18181B',
    primary: '#F43F5E',
    accent: '#E4E4E7',
    skills: 'Contrôle Interne • Cartographie Risques • Audit Financier • Modélisation Excel',
    contact: '+237 671 00 22 44',
    summary: 'Rejoignez la direction de l’audit de l’une des premières banques d’affaires du Cameroun.',
    level: 'Master 1 ou Master 2 Audit & Contrôle de Gestion / CCA',
  },
  {
    file: 'flyer_tradex_supply_chain.svg',
    title: 'STAGE LOGISTIQUE PÉTROLIÈRE & APPROVISIONNEMENT',
    company: 'TRADEX S.A. CAMEROUN',
    category: 'STAGE LOGISTIQUE INDUSTRIELLE',
    type: 'INTERNSHIP',
    city: 'DOUALA & KRIBI',
    deadline: '08 JANVIER 2027',
    stipend: '150,000 FCFA / MOIS',
    bg: '#0F284E',
    primary: '#FBBF24',
    accent: '#EF4444',
    skills: 'Gestion Stocks • Suivi Flotte Camions • Douanes Portuaires • ERP SAP',
    contact: '+237 698 77 66 55',
    summary: 'Optimisation de la chaîne logistique pétrolière terrestre et maritime.',
    level: 'Licence ou Master en Transport & Logistique / Supply Chain',
  },
  {
    file: 'flyer_dangote_cement_mech.svg',
    title: 'APPRENTI MAINTENANCE MÉCANIQUE & INDUSTRIELLE',
    company: 'DANGOTE CEMENT CAMEROON',
    category: 'CONTRAT APPRENTISSAGE USINE',
    type: 'JOB',
    city: 'DOUALA (QUAI DU WOURI)',
    deadline: '30 DÉCEMBRE 2026',
    stipend: '220,000 FCFA / MOIS',
    bg: '#1E1B4B',
    primary: '#818CF8',
    accent: '#34D399',
    skills: 'Tournage-Fraisage • Pneumatique & Hydraulique • Soudure Industrielle • Sécurité',
    contact: '+237 674 11 22 99',
    summary: 'Maintenance préventive des broyeurs et lignes d’ensachage de ciment.',
    level: 'BTS / DUT Maintenance Industrielle ou Génie Mécanique',
  },
  {
    file: 'flyer_activa_actuarial.svg',
    title: 'STAGIAIRE ACTUARIAT & TRAITEMENT DES SINISTRES',
    company: 'ACTIVA ASSURANCES CAMEROUN',
    category: 'STAGE ANALYSE STATISTIQUE & RISQUES',
    type: 'INTERNSHIP',
    city: 'DOUALA (AKWA)',
    deadline: '18 DÉCEMBRE 2026',
    stipend: '135,000 FCFA / MOIS',
    bg: '#064E3B',
    primary: '#F59E0B',
    accent: '#10B981',
    skills: 'Mathématiques Financières • Statistiques R/Python • Tarification • Assurance Auto/Vie',
    contact: '+237 673 88 11 00',
    summary: 'Calcul des réserves mathématiques et analyse actuarielle des portefeuilles clients.',
    level: 'Étudiant Bac+4 / Bac+5 en Statistiques, Actuariat ou Math-Éco',
  },
  {
    file: 'flyer_iuc_it_apprenticeship.svg',
    title: 'STAGE ACADÉMIQUE ADMINISTRATEUR SYSTÈMES & LABS',
    company: 'INSTITUT UNIVERSITAIRE DE LA CÔTE (IUC)',
    category: 'STAGE ACADÉMIQUE DE FIN D’ÉTUDES',
    type: 'INTERNSHIP',
    city: 'DOUALA (CAMPUS LOGBESSOU)',
    deadline: '25 DÉCEMBRE 2026',
    stipend: 'INDEMNITÉ DE CONVENTION',
    bg: '#1E293B',
    primary: '#38BDF8',
    accent: '#A855F7',
    skills: 'Windows Server • Linux Debian/Ubuntu • Virtualisation VMware • Câblage RJ45',
    contact: '+237 696 55 44 33',
    summary: 'Support technique et maintenance de l’infrastructure réseau des campus universitaires.',
    level: 'Étudiants BTS, HND, DSEP ou Licence Informatique',
  },
  {
    file: 'flyer_pwc_audit_advisory.svg',
    title: 'JUNIOR ADVISORY & FINANCIAL AUDIT ASSOCIATE',
    company: 'PwC CAMEROUN (PRICEWATERHOUSECOOPERS)',
    category: 'PROGRAMME RECRUTEMENT DIPLÔMÉS 2026',
    type: 'JOB',
    city: 'DOUALA (IMMEUBLE KASSAP)',
    deadline: '15 JANVIER 2027',
    stipend: '380,000 FCFA + AVANTAGES',
    bg: '#1C1917',
    primary: '#EA580C',
    accent: '#EAB308',
    skills: 'Normes IFRS / OHADA • Audit Légal • Modélisation Financière • Anglais Professionnel',
    contact: '+237 672 33 44 55',
    summary: 'Intégrez le premier cabinet mondial d’audit et de conseil au sein du bureau de Douala.',
    level: 'Diplômé Bac+5 (Grande École de Commerce, Ingénieur, Master CCA)',
  },
  {
    file: 'flyer_bastos_biomedical.svg',
    title: 'STAGIAIRE TECHNICIEN BIOMÉDICAL & ACCUEIL PATIENTS',
    company: 'CLINIQUE MÉDICO-CHIRURGICALE DE BASTOS',
    category: 'STAGE CLINIQUE PROFESSIONNEL',
    type: 'INTERNSHIP',
    city: 'YAOUNDÉ (QUARTIER BASTOS)',
    deadline: '14 JANVIER 2027',
    stipend: '130,000 FCFA / MOIS',
    bg: '#0F766E',
    primary: '#5EEAD4',
    accent: '#FDE047',
    skills: 'Maintenance Équipements Médicaux • Stérilisation • Triage Électronique • Échographes',
    contact: '+237 697 22 11 00',
    summary: 'Calibration et maintenance préventive du matériel chirurgical et d’imagerie médicale.',
    level: 'BTS / Licence en Génie Biomédical ou Électronique Médicale',
  },
];

flyers.forEach((f, idx) => {
  const isInternship = f.type === 'INTERNSHIP';
  const typeBadge = isInternship ? 'STAGE ACADÉMIQUE / PRO' : 'OFFRE D’EMPLOI / CDD-CDI';
  const typeColor = isInternship ? '#10B981' : '#3B82F6';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
    <defs>
      <linearGradient id="bgGrad${idx}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${f.bg}"/>
        <stop offset="50%" stop-color="#090D1A"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <linearGradient id="headerGrad${idx}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${f.primary}"/>
        <stop offset="100%" stop-color="${f.accent}"/>
      </linearGradient>
    </defs>

    <!-- Background card with high-tech pattern -->
    <rect width="600" height="800" fill="url(#bgGrad${idx})"/>
    <rect x="15" y="15" width="570" height="770" rx="24" fill="none" stroke="${f.primary}" stroke-width="2" stroke-opacity="0.35"/>
    <rect x="22" y="22" width="556" height="756" rx="18" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

    <!-- Geometric background accents -->
    <circle cx="520" cy="80" r="140" fill="${f.primary}" fill-opacity="0.06"/>
    <circle cx="60" cy="720" r="180" fill="${f.accent}" fill-opacity="0.05"/>

    <!-- Top Brand Header Bar -->
    <rect x="30" y="32" width="540" height="64" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    
    <!-- Top Cameroon Flag Accent -->
    <rect x="42" y="48" width="8" height="32" fill="#007A5E" rx="2"/>
    <rect x="52" y="48" width="8" height="32" fill="#CE1126" rx="2"/>
    <rect x="62" y="48" width="8" height="32" fill="#FCD116" rx="2"/>

    <text x="82" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="${f.primary}" letter-spacing="2">AVIS OFFICIEL DE RECRUTEMENT</text>
    <text x="82" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" letter-spacing="1">${f.company}</text>

    <!-- National Certified Seal -->
    <rect x="430" y="44" width="128" height="40" rx="8" fill="${typeColor}" fill-opacity="0.18" stroke="${typeColor}" stroke-width="1.5"/>
    <text x="494" y="68" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="900" fill="${typeColor}" text-anchor="middle" letter-spacing="0.5">${typeBadge}</text>

    <!-- Main Title Box -->
    <rect x="30" y="112" width="540" height="130" rx="16" fill="rgba(0,0,0,0.6)" stroke="${f.primary}" stroke-width="1.5" stroke-opacity="0.6"/>
    <text x="48" y="136" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="${f.accent}" letter-spacing="1.5">${f.category}</text>
    
    <!-- Multi-line title -->
    <text x="48" y="168" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="900" fill="#FFFFFF" width="500">
      ${f.title.slice(0, 38)}
    </text>
    <text x="48" y="196" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="900" fill="${f.primary}">
      ${f.title.slice(38) || 'CAMEROON REGIONS COHORT'}
    </text>
    <text x="48" y="226" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#94A3B8">
      📍 ${f.city}  •  ⏳ Date Limite : ${f.deadline}
    </text>

    <!-- Summary Box -->
    <rect x="30" y="258" width="540" height="74" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
    <text x="48" y="284" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="${f.primary}">MISSIONS &amp; OBJECTIFS DU POSTE :</text>
    <text x="48" y="306" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="#E2E8F0">${f.summary.slice(0, 75)}</text>
    <text x="48" y="322" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="#CBD5E1">${f.summary.slice(75, 150)}</text>

    <!-- Key Details Grid -->
    <rect x="30" y="348" width="260" height="88" rx="12" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)"/>
    <text x="45" y="372" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="800" fill="#94A3B8">RÉMUNÉRATION / INDEMNITÉ :</text>
    <text x="45" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="900" fill="#10B981">${f.stipend}</text>
    <text x="45" y="422" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="600" fill="#64748B">Convention tripartite assurée</text>

    <rect x="310" y="348" width="260" height="88" rx="12" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)"/>
    <text x="325" y="372" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="800" fill="#94A3B8">NIVEAU ACADÉMIQUE REQUIS :</text>
    <text x="325" y="396" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF">${f.level.slice(0, 32)}</text>
    <text x="325" y="416" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" fill="${f.accent}">${f.level.slice(32) || 'Établissements accrédités'}</text>

    <!-- Required Skills Strip -->
    <rect x="30" y="450" width="540" height="84" rx="14" fill="rgba(255,255,255,0.04)" stroke="${f.primary}" stroke-width="1" stroke-opacity="0.3"/>
    <text x="48" y="476" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="800" fill="${f.primary}" letter-spacing="1">COMPÉTENCES &amp; OUTILS CLÉS :</text>
    <text x="48" y="504" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF">${f.skills}</text>

    <!-- How to apply & WhatsApp Contact -->
    <rect x="30" y="550" width="540" height="124" rx="16" fill="rgba(16,185,129,0.12)" stroke="#10B981" stroke-width="2"/>
    <circle cx="68" cy="612" r="24" fill="#10B981"/>
    <!-- Phone / WhatsApp icon -->
    <path d="M60 604 C 60 620, 76 620, 76 604" stroke="#FFFFFF" stroke-width="3" fill="none"/>
    <circle cx="68" cy="612" r="10" fill="#FFFFFF"/>
    
    <text x="108" y="582" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="900" fill="#10B981" letter-spacing="0.5">POSTULER DIRECTEMENT SUR WHATSAPP :</text>
    <text x="108" y="608" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF">${f.contact}</text>
    <text x="108" y="630" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" fill="#A7F3D0">Envoyez votre CV + Référence : ${f.company.slice(0, 4)}-2026</text>
    <text x="108" y="648" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="500" fill="#6EE7B7">Validation immédiate via la plateforme MANTECH Nexus</text>

    <!-- Bottom Footer Certification -->
    <rect x="30" y="690" width="540" height="66" rx="12" fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.08)"/>
    <text x="48" y="718" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="#94A3B8">PLATEFORME NATIONALE D’INSERTION &amp; DE STAGES AU CAMEROUN</text>
    <text x="48" y="738" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="900" fill="#38BDF8">MANTECH NEXUS // VÉRIFIÉ &amp; ENREGISTRÉ CONFORME</text>
    <text x="548" y="728" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="900" fill="${f.primary}" text-anchor="end">RÉGION ${f.city.split(' ')[0]}</text>
  </svg>`;

  fs.writeFileSync(path.join(flyersDir, f.file), svg, 'utf-8');
});

// ── 3. GENERATE 20 AUTHENTIC CAMEROONIAN CANDIDATE AVATARS (SVG PROFILES) ────
const candidateAvatars = [
  { name: 'Brenda Mengue', role: 'Software Engineer', school: 'ENSPY Yaoundé', tint: '#3B82F6', gender: 'F' },
  { name: 'Cyrille Fotso', role: 'Cloud & DevOps Trainee', school: 'IUC Douala', tint: '#10B981', gender: 'M' },
  { name: 'Angèle Nguena', role: 'Data Analyst & BI', school: 'UY1 Ngoa-Ekellé', tint: '#8B5CF6', gender: 'F' },
  { name: 'Yannick Mbarga', role: 'Cybersecurity Analyst', school: 'NAHPI Bamenda', tint: '#EF4444', gender: 'M' },
  { name: 'Diane Tchuente', role: 'Financial Auditor', school: 'Univ. Douala', tint: '#F59E0B', gender: 'F' },
  { name: 'Kevin Fonkou', role: 'Mobile Developer', school: 'Univ. Buea', tint: '#06B6D4', gender: 'M' },
  { name: 'Sandra Bih', role: 'HR & Talent Coordinator', school: 'Catholic Univ. (CATUC)', tint: '#EC4899', gender: 'F' },
  { name: 'Christian Abena', role: 'Electrical Engineer', school: 'ENSPY Yaoundé', tint: '#14B8A6', gender: 'M' },
  { name: 'Vanessa Kamga', role: 'Supply Chain Assistant', school: 'ESSEC Douala', tint: '#6366F1', gender: 'F' },
  { name: 'Arnaud Djomo', role: 'Backend Developer', school: 'IUT Douala', tint: '#F97316', gender: 'M' },
  { name: 'Esther Ndongo', role: 'Hospital Pharmacy Intern', school: 'FMSB Yaoundé', tint: '#84CC16', gender: 'F' },
  { name: 'Boris Talla', role: 'Network Administrator', school: 'Siantou Supérieur', tint: '#0EA5E9', gender: 'M' },
  { name: 'Christelle Eyenga', role: 'B2B Sales Specialist', school: 'Univ. Yaoundé II Soa', tint: '#D946EF', gender: 'F' },
  { name: 'Franck Nana', role: 'Mechanical Engineer', school: 'IUT Bandjoun', tint: '#E11D48', gender: 'M' },
  { name: 'Nadine Mvondo', role: 'Legal & Compliance', school: 'UY2 Soa Droit', tint: '#4F46E5', gender: 'F' },
  { name: 'Patrick Ebongue', role: 'Civil Engineering Intern', school: 'ENSPT Yaoundé', tint: '#0D9488', gender: 'M' },
  { name: 'Carine Zang', role: 'Microbiology & Lab Trainee', school: 'Univ. Dschang', tint: '#7C3AED', gender: 'F' },
  { name: 'Alain Manga', role: 'Agricultural Logistics', school: 'FASA Dschang', tint: '#15803D', gender: 'M' },
  { name: 'Solange Bisseck', role: 'Digital Marketing Intern', school: 'Univ. Douala FLSH', tint: '#EA580C', gender: 'F' },
  { name: 'Emmanuel Tabi', role: 'Telecommunications Trainee', school: 'Univ. Buea College of Tech', tint: '#0284C7', gender: 'M' },
];

candidateAvatars.forEach((c, idx) => {
  const initials = c.name.split(' ').map(n => n[0]).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <defs>
      <linearGradient id="avatarGrad${idx}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c.tint}"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
    </defs>
    <rect width="160" height="160" rx="36" fill="url(#avatarGrad${idx})"/>
    <circle cx="80" cy="80" r="64" fill="none" stroke="${c.tint}" stroke-width="2" stroke-opacity="0.4"/>
    
    <!-- Stylized Person Avatar Silhouette -->
    <circle cx="80" cy="62" r="28" fill="${c.tint}" fill-opacity="0.25" stroke="#FFFFFF" stroke-width="2.5"/>
    <path d="M 36 132 C 36 102, 124 102, 124 132" fill="${c.tint}" fill-opacity="0.5" stroke="#FFFFFF" stroke-width="2.5"/>
    
    <!-- Initials Badge -->
    <rect x="52" y="50" width="56" height="26" rx="8" fill="rgba(0,0,0,0.65)"/>
    <text x="80" y="68" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${initials}</text>
    
    <!-- Verified Green Checkmark Badge -->
    <circle cx="126" cy="34" r="14" fill="#10B981" stroke="#020617" stroke-width="3"/>
    <path d="M 121 34 L 125 38 L 132 29" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;

  fs.writeFileSync(path.join(avatarsDir, `intern_${idx + 1}.svg`), svg, 'utf-8');
});

console.log('✅ Generated 15 recruitment flyers, 15 company logos, and 20 candidate avatars successfully!');
