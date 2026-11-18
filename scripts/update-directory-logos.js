const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'lib', 'cameroon-directory.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const companyLogoMap = {
  'bicec': '/images/logos/bicec.svg',
  'chococam-cameroon': '/images/logos/chococam.svg',
  'afriland-first-bank': '/images/logos/afriland.svg',
  'campost-cameroon': '/images/logos/campost.svg',
  'camair-co': '/images/logos/camair.svg',
  'crtv-cameroon': '/images/logos/crtv.svg',
  'sonara-cameroon': '/images/logos/sonara.svg',
  'cdc-cameroon': '/images/logos/cdc.svg',
  'port-autonome-de-kribi': '/images/logos/pak.svg',
  'hevecam-cameroon': '/images/logos/hevecam.svg',
  'cca-bank': '/images/logos/cca.svg',
  'uccao-cameroon': '/images/logos/uccao.svg',
  'nwca-bamenda': '/images/logos/nwca.svg',
  'sodecoton-cameroon': '/images/logos/sodecoton.svg',
  'semry-yagoua': '/images/logos/semry.svg',
  'shs-ngaoundere': '/images/logos/shs.svg',
  'pallisco-cameroon': '/images/logos/pallisco.svg',
  'maviance-cameroon': '/images/logos/maviance.svg',
  'activa-assurances': '/images/logos/activa.svg',
  'guinness-cameroun': '/images/logos/guinness.svg',
  'totalenergies-cameroon': '/images/logos/totalenergies.svg',
};

const uniLogoMap = {
  'universite-yaounde-i': '/images/logos/uy1.svg',
  'universite-yaounde-ii-soa': '/images/logos/uy2.svg',
  'enspy-polytechnique-yaounde': '/images/logos/enspy.svg',
  'the-ict-university': '/images/logos/ictu.svg',
  'universite-catholique-afrique-centrale': '/images/logos/ucac.svg',
  'institut-superieur-siantou': '/images/logos/siantou.svg',
  'universite-de-douala': '/images/logos/udla.svg',
  'institut-universitaire-de-la-cote': '/images/logos/iuc.svg',
  'institut-universitaire-saint-jerome-douala': '/images/logos/stjerome.svg',
  'university-of-buea': '/images/logos/ubuea.svg',
  'biaka-university-institute': '/images/logos/buib.svg',
  'universite-de-dschang': '/images/logos/udschang.svg',
  'pkfokam-institute-of-excellence': '/images/logos/pkf.svg',
  'universite-des-montagnes-bangangte': '/images/logos/udm.svg',
  'iut-fotso-victor-bandjoun': '/images/logos/iutfv.svg',
  'the-university-of-bamenda': '/images/logos/uniba.svg',
  'catuc-bamenda': '/images/logos/catuc.svg',
  'universite-de-garoua': '/images/logos/ungaroua.svg',
  'universite-de-maroua': '/images/logos/umaroua.svg',
  'universite-de-ngaoundere': '/images/logos/undere.svg',
  'universite-de-bertoua': '/images/logos/ubertoua.svg',
  'universite-debolowa': '/images/logos/uebolowa.svg',
  'enstp-yaounde': '/images/logos/enstp.svg',
  'supptic-yaounde': '/images/logos/supptic.svg',
  'iric-yaounde': '/images/logos/iric.svg',
  'essec-douala': '/images/logos/essec.svg',
  'nahpi-bamenda': '/images/logos/nahpi.svg',
  'fomic-polytechnic-buea': '/images/logos/fomic.svg',
  'iugg-douala': '/images/logos/iugg.svg',
  'enam-cameroun': '/images/logos/enam.svg',
};

// Replace logoUrls in content
for (const [slug, logoUrl] of Object.entries(companyLogoMap)) {
  const regex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?logoUrl:\\s*)"[^"]*"`, 'g');
  content = content.replace(regex, `$1"${logoUrl}"`);
}

for (const [slug, logoUrl] of Object.entries(uniLogoMap)) {
  const regex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?logoUrl:\\s*)"[^"]*"`, 'g');
  content = content.replace(regex, `$1"${logoUrl}"`);
}

fs.writeFileSync(filePath, content);
console.log('Successfully updated lib/cameroon-directory.ts with all logos.');
