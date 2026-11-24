const https = require('https');
const fs = require('fs');
const path = require('path');

// 20 high-quality, professional portraits of African students & young professionals
// Curated direct Unsplash portrait image IDs
const CANDIDATE_PHOTOS = [
  { id: 'intern_1.jpg', photoId: 'photo-1534528741775-53994a69daeb' }, // Young woman professional
  { id: 'intern_2.jpg', photoId: 'photo-1507003211169-0a1dd7228f2d' }, // Young man smiling professional
  { id: 'intern_3.jpg', photoId: 'photo-1573496359142-b8d87734a5a2' }, // Young African professional woman
  { id: 'intern_4.jpg', photoId: 'photo-1539571696357-5a69c17a67c6' }, // Young man student
  { id: 'intern_5.jpg', photoId: 'photo-1567532939604-b6b5b0db2604' }, // Young African woman in office/tech
  { id: 'intern_6.jpg', photoId: 'photo-1522075469751-3a6694fb2f61' }, // Young African engineer / tech guy
  { id: 'intern_7.jpg', photoId: 'photo-1573497019940-1c28c88b4f3e' }, // Professional African HR woman
  { id: 'intern_8.jpg', photoId: 'photo-1500648767791-00dcc994a43e' }, // Young male engineer
  { id: 'intern_9.jpg', photoId: 'photo-1589156280159-27698a70f29e' }, // Professional young African woman logistics
  { id: 'intern_10.jpg', photoId: 'photo-1506794778202-cad84cf45f1d' }, // Young male developer
  { id: 'intern_11.jpg', photoId: 'photo-1594744803329-e58b31de8bf5' }, // Young African pharmacist/health woman
  { id: 'intern_12.jpg', photoId: 'photo-1519085360753-af0119f7cbe7' }, // Tech & field specialist man
  { id: 'intern_13.jpg', photoId: 'photo-1580489944761-15a19d654956' }, // Professional young woman marketer
  { id: 'intern_14.jpg', photoId: 'photo-1492562080023-ab3db95bfbce' }, // Young industrial apprentice guy
  { id: 'intern_15.jpg', photoId: 'photo-1573496799652-408c2ac9fe98' }, // Young African legal/finance consultant
  { id: 'intern_16.jpg', photoId: 'photo-1534308983496-4fabb1a015ee' }, // Civil engineer man
  { id: 'intern_17.jpg', photoId: 'photo-1573497491208-6b1acb260507' }, // Quality assurance woman
  { id: 'intern_18.jpg', photoId: 'photo-1501196354995-cbb51c65aaea' }, // Agro-business young man
  { id: 'intern_19.jpg', photoId: 'photo-1573497019236-17f8177b81e8' }, // Corporate comms woman
  { id: 'intern_20.jpg', photoId: 'photo-1472099645785-5658abf4ff4e' }, // RF / satellite engineer man
];

const targetDir = path.join(__dirname, 'public', 'images', 'candidates');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadImage(filename, photoId) {
  return new Promise((resolve, reject) => {
    // Unsplash direct crop URL for lightweight, crisp 400x400 avatars
    const url = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=400&h=400&q=80`;
    const dest = path.join(targetDir, filename);
    const file = fs.createWriteStream(dest);

    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close(() => resolve(filename));
          });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(filename));
        });
      } else {
        reject(new Error(`Failed with status ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading real human candidate portrait photos...');
  for (const item of CANDIDATE_PHOTOS) {
    try {
      await downloadImage(item.id, item.photoId);
      console.log(`Saved: ${item.id}`);
    } catch (err) {
      console.error(`Error downloading ${item.id}:`, err.message);
    }
  }
  console.log('All downloads completed!');
}

run();
