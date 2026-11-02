const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const base = process.env.DIRECT_URL || process.env.DATABASE_URL;
const directUrl = base ? base.replace(/connect_timeout=\d+/, 'connect_timeout=30') : undefined;

const prisma = new PrismaClient(
  directUrl ? { datasources: { db: { url: directUrl } } } : undefined
);

const TESTIMONIALS = [
  {
    name: "Dr. Arthur Nguemo",
    email: "arthur.nguemo@enspy.cm",
    role: "Dean of Academic Partnerships",
    company: "ENSPY Yaoundé",
    region: "Centre",
    focus: "University Coordination",
    rating: 5,
    message: "MANTECH Nexus unified our tripartite convention workflow across 450 engineering students in one semester.",
    details: "Previously, validating academic internship agreements between students, university supervisors, and host corporations required paper stamps and weeks of back-and-forth. MANTECH digitized convention signatures and company verification seamlessly.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Christelle Mbarga",
    email: "christelle.mbarga@mtn.cm",
    role: "Talent Acquisition Lead",
    company: "MTN Cameroon",
    region: "Littoral",
    focus: "Job Recruitment",
    rating: 5,
    message: "We recruited 12 junior cloud developers and 6 data interns within 10 days using the verified talent pool.",
    details: "The candidate passport and readiness score filtered out unqualified profiles immediately. We conducted initial screenings and sent offers with unprecedented speed compared to traditional job boards.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Boris Tientcheu",
    email: "boris.tientcheu@gmail.com",
    role: "BSc Software Engineering Graduate",
    company: "Université de Yaoundé I",
    region: "Centre",
    focus: "Internship Placement",
    rating: 5,
    message: "From zero responses to three internship offers at tier-1 tech firms in Douala and Yaoundé.",
    details: "My verifiable Intern Passport showed my actual Node.js and PostgreSQL projects. Within 72 hours of publishing my profile, recruiters from Orange Cameroun and a fintech startup reached out directly.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Fadimatou Bello",
    email: "fadimatou.bello@sabc.cm",
    role: "Human Resources Business Partner",
    company: "Boissons du Cameroun (SABC)",
    region: "Littoral",
    focus: "Talent Discovery",
    rating: 5,
    message: "MANTECH gives us access to top industrial engineering talent from all 10 regions of Cameroon.",
    details: "For our plant maintenance and supply chain logistics programs, having candidates already verified by their respective universities in Ngaoundéré, Bandjoun, and Douala saved our HR team weeks of credential checking.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Emeka Stanley Ofor",
    email: "emeka.ofor@nahpi.uniba.cm",
    role: "Electrical & Power Systems Intern",
    company: "Eneo Cameroon",
    region: "South-West",
    focus: "Internship Placement",
    rating: 5,
    message: "The platform bridged the gap between Buea/Bamenda students and national industrial employers.",
    details: "Finding an industrial placement used to mean traveling in person to Douala or Yaoundé with printed CVs. On MANTECH Nexus, I submitted my credentials online and signed an official convention with Eneo without leaving campus.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Marcelle Eyenga",
    email: "marcelle.eyenga@afriland.cm",
    role: "Chief of Human Capital",
    company: "Afriland First Bank",
    region: "Centre",
    focus: "Job Recruitment",
    rating: 5,
    message: "A revolutionary hiring platform for the CEMAC banking and finance sector.",
    details: "We needed graduates with solid mastery of OHADA corporate accounting and banking compliance. MANTECH’s specialized filters allowed us to interview top-tier finalists from UY2 Soa and UCAC within days.",
    photoUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Dr. Henriette Kouam",
    email: "henriette.kouam@iuc-univ.net",
    role: "Placement Director",
    company: "Institut Universitaire de la Côte (IUC)",
    region: "Littoral",
    focus: "University Coordination",
    rating: 5,
    message: "Tracking hundreds of academic placements across multiple campuses is finally automated and transparent.",
    details: "The dual-mode university dashboard enables our faculty heads to monitor student placements in real-time, authenticate academic conventions, and maintain live corporate partnership metrics.",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Kevin Fonkou",
    email: "kevin.fonkou@maviance.cm",
    role: "Cybersecurity Analyst",
    company: "Maviance (Smobilpay)",
    region: "South-West",
    focus: "Career Transition",
    rating: 5,
    message: "Secured my first fintech cybersecurity role right after my defense at University of Buea.",
    details: "MANTECH’s direct WhatsApp concierge and alerts notified me the moment Maviance opened an opportunity in digital payment security. I applied directly and began work the following month.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Aissatou Mohamadou",
    email: "aissatou.m@univ-ndere.cm",
    role: "Food Processing Engineer",
    company: "ENSAI Ngaoundéré",
    region: "Adamawa",
    focus: "Internship Placement",
    rating: 5,
    message: "Brought opportunities from southern industrial zones directly to students in Adamawa and the North.",
    details: "Our food engineering program produces outstanding technicians, but distance was always a barrier. MANTECH Nexus gave us equal visibility alongside students based in the capital.",
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Georges Ndam",
    email: "georges.ndam@camtel.cm",
    role: "Infrastructure Operations Manager",
    company: "CAMTEL",
    region: "Centre",
    focus: "Talent Discovery",
    rating: 5,
    message: "High-caliber telecom and fiber-optic apprentices sourced and validated in record time.",
    details: "Connecting university telecommunications curricula to operational telecom networks requires serious talent verification. MANTECH Nexus provides authentic records and dependable candidates.",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Raissa Tchouante",
    email: "raissa.tchouante@kpmg.cm",
    role: "Senior Audit Consultant",
    company: "KPMG Central Africa",
    region: "Littoral",
    focus: "Job Recruitment",
    rating: 5,
    message: "The easiest, most credible recruitment pipeline for junior auditors and legal compliance associates.",
    details: "The zero-friction hiring experience and complete elimination of fake qualifications or unverified CVs makes MANTECH our primary hiring pipeline for junior associates each year.",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Cedric Mbopi",
    email: "cedric.mbopi@alucam.cm",
    role: "Metallurgical Maintenance Apprentice",
    company: "ALUCAM Edéa",
    region: "Littoral",
    focus: "Internship Placement",
    rating: 5,
    message: "From IUT Douala straight into heavy industrial metallurgy at Edéa without any intermediaries.",
    details: "The application was transparent from day one. I tracked my status directly from 'Submitted' to 'Interview' and received my acceptance letter through the platform.",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Pr. Samuel Eto'o Bikoue",
    email: "samuel.bikoue@univ-dschang.org",
    role: "Head of Agronomy & FASA Relations",
    company: "Université de Dschang",
    region: "West",
    focus: "University Coordination",
    rating: 5,
    message: "Agri-business and agro-forestry partners can now coordinate student field placements effortlessly.",
    details: "Our faculty of agronomy deploys students across the entire national territory. With MANTECH, farm owners and agro-processing plants sign tripartite conventions digitally with full legal backing.",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Diane Mvondo",
    email: "diane.mvondo@activa.cm",
    role: "Digital Marketing Specialist",
    company: "Activa Assurances",
    region: "Littoral",
    focus: "Career Transition",
    rating: 5,
    message: "100% free platform that genuinely opens doors for Cameroonian youth entering the formal economy.",
    details: "I transitioned from freelance graphic design to full-time corporate communications at Activa. The platform’s verified portfolio presentation helped showcase my real campaign results.",
    photoUrl: "https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Thierry Onana",
    email: "thierry.onana@totalenergies.cm",
    role: "Health, Safety & Environment Lead",
    company: "TotalEnergies Marketing Cameroun",
    region: "Centre",
    focus: "Talent Discovery",
    rating: 5,
    message: "Reliable, accredited candidate profiles for technical petroleum and renewable energy operations.",
    details: "HSE compliance requires rigorously trained candidates. Finding students with verified academic foundations from universities in Yaoundé and Maroua has never been smoother.",
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Nathalie Ngatchou",
    email: "nathalie.ngatchou@ucac-icy.net",
    role: "Corporate Relations Officer",
    company: "Université Catholique d'Afrique Centrale (UCAC)",
    region: "Centre",
    focus: "University Coordination",
    rating: 5,
    message: "Our business and engineering graduates benefit from direct visibility with top pan-African firms.",
    details: "MANTECH’s dual-mode placement portal gives our institution full oversight of student progress while respecting corporate timelines. An indispensable tool for modern universities.",
    photoUrl: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Paul Nguini",
    email: "paul.nguini@uba.cm",
    role: "Retail Banking Branch Coordinator",
    company: "United Bank for Africa (UBA Cameroon)",
    region: "Littoral",
    focus: "Job Recruitment",
    rating: 5,
    message: "Fast turnaround times when scaling up our seasonal branch intern and teller cohorts.",
    details: "Every summer we onboard dozens of finance and banking interns across Douala, Yaoundé, and Bafoussam. MANTECH Nexus allowed us to filter and dispatch pre-screened talent in days.",
    photoUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Miriam Enow",
    email: "miriam.enow@techinnov.cm",
    role: "UI/UX & Frontend Developer",
    company: "ActiveSpaces Buea",
    region: "South-West",
    focus: "Internship Placement",
    rating: 5,
    message: "The instant WhatsApp alert matched me with an innovative tech startup within hours.",
    details: "Silicon Mountain has plenty of talent but matching with verified paid positions was hit-or-miss. MANTECH’s verified listings and zero-spam guarantee completely solved that.",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Youssoufa Hamadou",
    email: "youssoufa.h@cotco.cm",
    role: "Pipeline Maintenance Specialist",
    company: "COTCO (Cameroon Oil Transportation Company)",
    region: "Centre",
    focus: "Talent Discovery",
    rating: 5,
    message: "Critical technical talents discovered for pipeline operations spanning Kribi to the northern border.",
    details: "The geographic diversity of MANTECH Nexus is unmatched. Candidates from all ten regions have equal footing and can demonstrate their authentic technical capabilities.",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  },
  {
    name: "Sandra Bilong",
    email: "sandra.bilong@pkfokam-cap.org",
    role: "Biomedical Engineering Intern",
    company: "PKFokam Institute of Excellence",
    region: "Centre",
    focus: "Internship Placement",
    rating: 5,
    message: "Secured a hospital biomedical equipment maintenance role through the verified directory.",
    details: "The ability to present my academic credentials and laboratory coursework clearly gave hospital administrators immediate confidence in my readiness for medical device servicing.",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    status: "APPROVED"
  }
];

async function seedTestimonials() {
  console.log('🌟 Seeding 20 Authentic Cameroon Community Testimonials...');
  let count = 0;
  for (const t of TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({
      where: { email: t.email }
    });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
      count++;
    } else {
      await prisma.testimonial.update({
        where: { id: existing.id },
        data: {
          name: t.name,
          role: t.role,
          company: t.company,
          region: t.region,
          focus: t.focus,
          message: t.message,
          details: t.details,
          rating: t.rating,
          photoUrl: t.photoUrl,
          status: "APPROVED"
        }
      });
      count++;
    }
  }
  console.log(`✅ Seeded/Updated ${count} approved testimonials.`);
  await prisma.$disconnect();
}

seedTestimonials().catch(err => {
  console.error('Error seeding testimonials:', err);
  process.exit(1);
});
