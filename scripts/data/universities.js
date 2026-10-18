/**
 * Top 30 Universities & Higher Education Institutions in Cameroon.
 */

const UNIVERSITIES = [
  // ── Public State Universities (11) ──
  {
    name: "Université de Yaoundé I",
    slug: "universite-yaounde-i",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.uy1.uninet.cm",
    logoUrl: "https://unavatar.io/uy1.uninet.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UY1",
    size: "500+",
    universityType: "Public State University",
    description: "Mother university of Cameroon established in 1962, hosting faculties of Science, Medicine & Biomedical Sciences (FMSB), and Arts, Letters & Social Sciences, leading national academic research.",
    faculties: ["Faculty of Science", "Faculty of Medicine and Biomedical Sciences (FMSB)", "Faculty of Arts, Letters and Social Sciences", "Centre de Biotechnologie"]
  },
  {
    name: "Université de Yaoundé II (Soa)",
    slug: "universite-yaounde-ii-soa",
    region: "Centre",
    city: "Soa",
    website: "https://www.universite-yde2.org",
    logoUrl: "https://unavatar.io/universite-yde2.org?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UY2",
    size: "500+",
    universityType: "Public State University",
    description: "National center of excellence for Legal, Political, Economic, and Management sciences, educating magistrates, senior diplomats, economists, and corporate executives.",
    faculties: ["Faculty of Law and Political Science (FSJP)", "Faculty of Economics and Management (FSEG)", "Institut des Relations Internationales du Cameroun (IRIC)", "ESSTIC Journalism School"]
  },
  {
    name: "Université de Douala",
    slug: "universite-de-douala",
    region: "Littoral",
    city: "Douala",
    website: "https://www.univ-douala.cm",
    logoUrl: "https://unavatar.io/univ-douala.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UDla",
    size: "500+",
    universityType: "Public State University",
    description: "Largest university in Cameroon's economic capital Douala, renowned for engineering polytechnics, applied corporate economics, pharmaceutical sciences, and maritime logistics.",
    faculties: ["Ecole Nationale Supérieure Polytechnique de Douala (ENSPD)", "Faculty of Industrial Engineering (FGI)", "Faculty of Medicine & Pharmaceutical Sciences", "IUT Douala", "ESSEC Douala"]
  },
  {
    name: "University of Buea",
    slug: "university-of-buea",
    region: "South-West",
    city: "Buea",
    website: "https://www.ubuea.cm",
    logoUrl: "https://unavatar.io/ubuea.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UB",
    size: "500+",
    description: "Cameroon’s premier Anglo-Saxon university located at the foot of Mount Cameroon, famous for software engineering, biotechnology, medicine, and driving the Silicon Mountain tech hub.",
    faculties: ["Faculty of Engineering and Technology (FET)", "Faculty of Health Sciences", "College of Technology (COT)", "Faculty of Science", "ASTI Translation Institute"]
  },
  {
    name: "Université de Dschang",
    slug: "universite-de-dschang",
    region: "West",
    city: "Dschang",
    website: "https://www.univ-dschang.org",
    logoUrl: "https://unavatar.io/univ-dschang.org?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UDs",
    size: "500+",
    description: "Premier academic institution for Agronomy, Agricultural Sciences (FASA), Veterinary Medicine, and Environmental Ecology, operating satellite campuses across the West and Littoral.",
    faculties: ["Faculté d'Agronomie et des Sciences Agricoles (FASA)", "Faculty of Medicine & Pharmaceutical Sciences", "IUT FV Bandjoun", "Faculty of Science", "Faculty of Letters"]
  },
  {
    name: "University of Bamenda",
    slug: "university-of-bamenda",
    region: "North-West",
    city: "Bamenda",
    website: "https://www.uniba.cm",
    logoUrl: "https://unavatar.io/uniba.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UBa",
    size: "500+",
    description: "Public Anglo-Saxon university in Bambili known for engineering, commerce, teacher training, and medical sciences, cultivating high-caliber graduates across Anglophone Cameroon.",
    faculties: ["National Higher Polytechnic Institute (NAHPI)", "Higher Institute of Commerce and Management (HICM)", "Faculty of Health Sciences", "Higher Teacher Training College (HTTC)"]
  },
  {
    name: "Université de Maroua",
    slug: "universite-de-maroua",
    region: "Far North",
    city: "Maroua",
    website: "https://www.univ-maroua.cm",
    logoUrl: "https://unavatar.io/univ-maroua.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UMa",
    size: "500+",
    description: "Northern academic powerhouse specializing in Sahelian renewable energy, desert ecology, mining engineering, and teacher development through ENS Maroua.",
    faculties: ["Institut Supérieur du Sahel (ISS)", "Ecole Normale Supérieure de Maroua (ENS)", "Faculty of Mines and Petroleum Industries", "Faculty of Science"]
  },
  {
    name: "Université de Ngaoundéré",
    slug: "universite-de-ngaoundere",
    region: "Adamawa",
    city: "Ngaoundéré",
    website: "https://www.univ-ndere.cm",
    logoUrl: "https://unavatar.io/univ-ndere.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UN",
    size: "500+",
    description: "Major regional university recognized across Africa for Food Processing Engineering (ENSAI), Chemical Engineering, Veterinary Medicine, and Geological Sciences.",
    faculties: ["Ecole Nationale Supérieure des Sciences Agro-Industrielles (ENSAI)", "Ecole de Médecine Vétérinaire (ESMV)", "IUT Ngaoundéré", "Faculty of Science"]
  },
  {
    name: "Université de Bertoua",
    slug: "universite-de-bertoua",
    region: "East",
    city: "Bertoua",
    website: "https://www.univ-bertoua.cm",
    logoUrl: "https://unavatar.io/univ-bertoua.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UBer",
    size: "201-500",
    description: "State university in Eastern Cameroon established to spearhead forestry research, timber transformation, mining geology, and teacher training.",
    faculties: ["Higher Teacher Training College (ENS Bertoua)", "Faculty of Legal and Political Sciences", "Faculty of Economics & Management", "School of Wood and Forest Sciences"]
  },
  {
    name: "Université d'Ebolowa",
    slug: "universite-d-ebolowa",
    region: "South",
    city: "Ebolowa",
    website: "https://www.univ-ebolowa.cm",
    logoUrl: "https://unavatar.io/univ-ebolowa.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UEbo",
    size: "201-500",
    description: "State university focused on modern agro-forestry engineering, maritime transport logistics at Kribi, and wood transformation technologies.",
    faculties: ["Faculté d'Agronomie et de Foresterie", "Ecole Supérieure de Transport et Logistique Maritime (Kribi)", "Faculty of Science"]
  },
  {
    name: "Université de Garoua",
    slug: "universite-de-garoua",
    region: "North",
    city: "Garoua",
    website: "https://www.univ-garoua.cm",
    logoUrl: "https://unavatar.io/univ-garoua.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UGar",
    size: "201-500",
    description: "Public university in the North region advancing medical training, cotton agro-technology, pastoral veterinary sciences, and renewable solar power systems.",
    faculties: ["Faculty of Medicine and Biomedical Sciences", "Ecole Supérieure des Sciences et Techniques du Coton", "Faculty of Science"]
  },

  // ── National Engineering & Specialized Grandes Écoles (8) ──
  {
    name: "École Nationale Supérieure Polytechnique de Yaoundé (ENSPY)",
    slug: "enspy-polytechnique-yaounde",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.polytechnique.cm",
    logoUrl: "https://unavatar.io/polytechnique.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=ENSPY",
    size: "201-500",
    description: "Cameroon’s most prestigious engineering grande école, producing elite engineers in Computer Science, Telecommunications, Civil Engineering, Electrical Power, and AI.",
    faculties: ["Department of Computer Engineering", "Department of Telecommunications", "Department of Electrical Engineering", "Department of Civil Engineering", "Mechanical Engineering"]
  },
  {
    name: "École Nationale Supérieure Polytechnique de Douala (ENSPD)",
    slug: "enspd-polytechnique-douala",
    region: "Littoral",
    city: "Douala",
    website: "https://www.enspd-udo.cm",
    logoUrl: "https://unavatar.io/enspd-udo.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=ENSPD",
    size: "201-500",
    description: "Top industrial engineering school in Cameroon’s industrial hub, training specialists in Maritime Engineering, Automobile Mechatronics, Cyber-physical systems, and Robotics.",
    faculties: ["Department of Maritime Engineering", "Mechatronics and Robotics", "Chemical and Environmental Engineering", "Software Engineering"]
  },
  {
    name: "SUP'PTIC (École Nationale des Postes, Télécoms et TIC)",
    slug: "supptic-yaounde",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.supptic.cm",
    logoUrl: "https://unavatar.io/supptic.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=SUP",
    size: "201-500",
    description: "Specialized higher institute of Posts, Telecommunications, and Information & Communication Technologies under MINPOSTEL, certifying telecom and network security engineers.",
    faculties: ["Department of Telecommunications Systems", "Department of Computer Networks & Cybersecurity", "Department of Postal Management"]
  },
  {
    name: "École Nationale Supérieure des Travaux Publics (ENSTP)",
    slug: "enstp-yaounde",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.enstp.cm",
    logoUrl: "https://unavatar.io/enstp.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=ENSTP",
    size: "201-500",
    description: "National engineering school under the Ministry of Public Works partnered with University of Padova, training top civil engineers, town planners, and environmental experts.",
    faculties: ["Department of Civil Engineering", "Department of Environmental Engineering", "Department of Cadastre and Topography", "Architecture and Urbanism"]
  },
  {
    name: "Institut des Relations Internationales du Cameroun (IRIC)",
    slug: "iric-yaounde",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.iricuy2.net",
    logoUrl: "https://unavatar.io/iricuy2.net?fallback=https://api.dicebear.com/7.x/initials/svg?seed=IRIC",
    size: "101-200",
    description: "Prestigious diplomatic academy training diplomats, international civil servants, trade negotiators, and global cooperation specialists across Africa.",
    faculties: ["Diplomacy & International Law", "International Finance & Trade", "Regional Integration", "International Communication"]
  },
  {
    name: "École Normale Supérieure de Yaoundé (ENS Yaoundé)",
    slug: "ens-yaounde",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.ens.cm",
    logoUrl: "https://unavatar.io/ens.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=ENS",
    size: "201-500",
    description: "Historic teacher training grande école preparing senior educators, pedagogical inspectors, and researchers in Exact Sciences, Humanities, and Modern Languages.",
    faculties: ["Department of Computer Science & Mathematics", "Department of Physics & Chemistry", "Department of Bilingual Letters", "Department of Life Sciences"]
  },
  {
    name: "École Nationale d'Administration et de Magistrature (ENAM)",
    slug: "enam-yaounde",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.enam.cm",
    logoUrl: "https://unavatar.io/enam.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=ENAM",
    size: "201-500",
    description: "Cameroon's elite public administration school producing magistrates, tax inspectors, customs controllers, and civil administrators driving the government apparatus.",
    faculties: ["Judiciary Section (Magistrates)", "Administrative Section (Civil Administrators)", "Financial Section (Tax, Customs, Treasury)"]
  },
  {
    name: "ISSEA (Institut Sous-régional de Statistique et d'Économie Appliquée)",
    slug: "issea-yaounde",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.issea-cemac.org",
    logoUrl: "https://unavatar.io/issea-cemac.org?fallback=https://api.dicebear.com/7.x/initials/svg?seed=ISSEA",
    size: "101-200",
    description: "CEMAC regional intergovernmental school training Statistician-Economists, quantitative financial analysts, and macroeconomic modelers for Central African institutions.",
    faculties: ["Ingénieurs Statisticiens Économistes (ISE)", "Ingénieurs des Travaux Statistiques (ITS)", "Applied Big Data & Analytics"]
  },

  // ── Top Accredited Private Universities & Institutes (11) ──
  {
    name: "Université Catholique d'Afrique Centrale (UCAC - ICAM)",
    slug: "ucac-icam-cameroon",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.ucac-icam.com",
    logoUrl: "https://unavatar.io/ucac-icam.com?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UCAC",
    size: "500+",
    description: "Leading sub-regional private Catholic university renowned for ethical leadership, general engineering (ICAM), corporate finance, and social sciences across Central Africa.",
    faculties: ["Institut Ucac-Icam Engineering", "Faculty of Social Sciences & Management (FSSG)", "Faculty of Philosophy", "School of Health Sciences"]
  },
  {
    name: "PKFokam Institute of Excellence",
    slug: "pkfokam-institute-excellence",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.pkfinstitute.org",
    logoUrl: "https://unavatar.io/pkfinstitute.org?fallback=https://api.dicebear.com/7.x/initials/svg?seed=PKF",
    size: "101-200",
    description: "Prestigious American-model university founded by Dr. Paul K. Fokam, training entrepreneurs and innovators in Computer Science, Mechanical Engineering, and Financial Economics.",
    faculties: ["School of Engineering", "School of Business & Economics", "Incubator & Prototype Laboratory"]
  },
  {
    name: "The ICT University Cameroon",
    slug: "ict-university-cameroon",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.ictuniversity.org",
    logoUrl: "https://unavatar.io/ictuniversity.org?fallback=https://api.dicebear.com/7.x/initials/svg?seed=ICTU",
    size: "201-500",
    description: "American-accredited institution in Bastos, Yaoundé, providing hands-on degree programs in Artificial Intelligence, Cybersecurity, Software Engineering, and Digital Health.",
    faculties: ["School of Information and Communication Technology", "School of Business & Sustainable Development", "School of Medicine & Health Sciences"]
  },
  {
    name: "Institut Universitaire de la Côte (IUC Douala)",
    slug: "iuc-douala",
    region: "Littoral",
    city: "Douala",
    website: "https://www.iuc-univ.net",
    logoUrl: "https://unavatar.io/iuc-univ.net?fallback=https://api.dicebear.com/7.x/initials/svg?seed=IUC",
    size: "500+",
    description: "Renowned polytechnic campus in Douala (Logbessou) offering dual European and Cameroonian diplomas in Software Engineering, Mechatronics, Telecoms, and Logistics.",
    faculties: ["Institut Supérieur de Technologies de Douala (ISTDI)", "3I (Ingénierie Industrielle & Informatique)", "School of Business (PIA)", "Health Sciences"]
  },
  {
    name: "Université des Montagnes (UdM Bangangté)",
    slug: "universite-des-montagnes",
    region: "West",
    city: "Bangangté",
    website: "https://www.udm.aed-cm.org",
    logoUrl: "https://unavatar.io/udm.aed-cm.org?fallback=https://api.dicebear.com/7.x/initials/svg?seed=UdM",
    size: "500+",
    description: "Cameroon’s premier private medical and health sciences university founded by the AED, operating the Teaching University Hospital of Bangangté.",
    faculties: ["Faculty of Health Sciences (Medicine, Pharmacy, Odontology)", "Higher Institute of Technology", "Faculty of Agronomy"]
  },
  {
    name: "Catholic University of Cameroon (CATUC Bamenda)",
    slug: "catuc-bamenda",
    region: "North-West",
    city: "Bamenda",
    website: "https://www.catuc.org",
    logoUrl: "https://unavatar.io/catuc.org?fallback=https://api.dicebear.com/7.x/initials/svg?seed=CATUC",
    size: "201-500",
    description: "Catholic university in Anglophone Cameroon providing high-standard degrees in Biomedical Sciences, Chemical Engineering, Computer Science, and Humanities.",
    faculties: ["Faculty of Science & Engineering", "Faculty of Health Sciences", "Faculty of Business and Management Sciences"]
  },
  {
    name: "Biaka University Institute of Buea (BUIB)",
    slug: "biaka-university-institute-buea",
    region: "South-West",
    city: "Buea",
    website: "https://www.biaka.com",
    logoUrl: "https://unavatar.io/biaka.com?fallback=https://api.dicebear.com/7.x/initials/svg?seed=BUIB",
    size: "201-500",
    description: "Renowned higher institute specializing in Nursing Sciences, Medical Laboratory Technology, Pharmacy Technology, and Management Sciences in Buea.",
    faculties: ["School of Health and Medical Sciences", "School of Management Sciences", "School of Education"]
  },
  {
    name: "Institut Universitaire Siantou (IUS Yaoundé)",
    slug: "institut-universitaire-siantou",
    region: "Centre",
    city: "Yaoundé",
    website: "https://www.siantou.net",
    logoUrl: "https://unavatar.io/siantou.net?fallback=https://api.dicebear.com/7.x/initials/svg?seed=IUS",
    size: "500+",
    description: "Pioneer private higher institute in Cameroon with over 30 years of training students in HND, Professional Bachelor’s, and Master's degrees across IT and Business.",
    faculties: ["Department of Computer Science & Telecommunications", "Department of Management and Banking", "Department of Journalism"]
  },
  {
    name: "Université Catholique Saint Jérôme de Douala",
    slug: "saint-jerome-catholic-university",
    region: "Littoral",
    city: "Douala",
    website: "https://www.univ-saintjerome.cm",
    logoUrl: "https://unavatar.io/univ-saintjerome.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=StJ",
    size: "201-500",
    description: "Modern Catholic university in Douala training ethical leaders through Saint Jérôme Polytechnic, School of Management, and Health Sciences.",
    faculties: ["Saint Jérôme Polytechnique", "Saint Jérôme Management Sciences", "Saint Jérôme Health Sciences"]
  },
  {
    name: "Fomic Polytechnic University",
    slug: "fomic-polytechnic-university",
    region: "South-West",
    city: "Buea",
    website: "https://www.fomicgroup.cm",
    logoUrl: "https://unavatar.io/fomicgroup.cm?fallback=https://api.dicebear.com/7.x/initials/svg?seed=FOMIC",
    size: "101-200",
    description: "Higher technical polytechnic university in Buea and Douala emphasizing hands-on vocational proficiency, software engineering, and microfinance accounting.",
    faculties: ["Department of Software Engineering & Networking", "Department of Accountancy & Finance", "Logistics & Transport Management"]
  },
  {
    name: "Institut Universitaire du Golfe de Guinée (IUGG Douala)",
    slug: "institut-universitaire-golfe-guinee",
    region: "Littoral",
    city: "Douala",
    website: "https://www.univ-iugg.com",
    logoUrl: "https://unavatar.io/univ-iugg.com?fallback=https://api.dicebear.com/7.x/initials/svg?seed=IUGG",
    size: "500+",
    description: "Expansive university institute in Douala housing ESG (Business School), ISA (Applied Sciences), and INCO (New Technologies) with deep industry ties.",
    faculties: ["Ecole Supérieure de Gestion (ESG)", "Institut Supérieur des Technologies Appliquées (ISTA)", "Institut des Technologies Avancées"]
  }
];

module.exports = { UNIVERSITIES };
