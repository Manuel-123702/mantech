const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(process.cwd(), 'data', 'verified-candidates.json');
  if (!fs.existsSync(filePath)) {
    console.log('No verified-candidates.json found.');
    return;
  }
  const candidates = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Seeding ${candidates.length} candidates into database...`);

  for (const c of candidates) {
    try {
      const existing = await prisma.user.findFirst({
        where: { email: c.email },
      });

      if (!existing) {
        const user = await prisma.user.create({
          data: {
            email: c.email,
            fullName: c.fullName,
            role: 'INTERN',
            avatarUrl: c.avatarUrl,
            status: 'active',
            clerkId: `clerk_seed_${c.id}`,
          },
        });

        if (c.internProfile) {
          const profile = await prisma.internProfile.create({
            data: {
              userId: user.id,
              qualification: c.internProfile.qualification,
              academicLevel: c.internProfile.academicLevel,
              institution: c.internProfile.institution,
              targetRole: c.internProfile.targetRole,
              readinessScore: c.internProfile.readinessScore,
              city: c.internProfile.city,
              profileCompleted: true,
            },
          });

          if (c.internProfile.passport) {
            await prisma.internPassport.create({
              data: {
                internProfileId: profile.id,
                passportNumber: c.internProfile.passport.passportNumber,
                headline: c.internProfile.passport.headline,
                isVerified: true,
                verificationDate: new Date(),
              },
            }).catch(() => {});
          }
        }
        console.log(`✓ Seeded user: ${c.fullName} (${c.email})`);
      } else {
        console.log(`- User already exists: ${c.email}`);
      }
    } catch (e) {
      console.warn(`! Note for ${c.email}:`, e.message);
    }
  }
}

main()
  .then(() => {
    console.log('Database candidate seed finished.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Database candidate seed error:', e.message);
    process.exit(0);
  });
