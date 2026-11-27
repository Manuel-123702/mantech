import { requireUser } from '@/lib/authz';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { EditPassportForm } from '@/components/intern/edit-passport-form';

export const metadata = {
  title: 'Edit Profile | My Passport | MANTECH Nexus',
  robots: { index: false, follow: false },
};

export default async function EditPassportPage() {
  const user = await requireUser();

  const profile = await prisma.internProfile.findUnique({
    where: { userId: user.id },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
      passport: true,
      fieldOfStudy: true,
      specialization: true,
      region: true,
      skills: {
        include: { skill: true },
      },
    },
  });

  if (!profile) {
    redirect('/register/intern');
  }

  return (
    <EditPassportForm
      initialData={{
        fullName: profile.user.fullName || '',
        email: profile.user.email || '',
        avatarUrl: profile.user.avatarUrl ?? null,
        phone: profile.phone || '',
        isPhonePublic: profile.isPhonePublic,
        qualification: profile.qualification || '',
        academicLevel: profile.academicLevel || '',
        institution: profile.institution || '',
        fieldOfStudyId: profile.fieldOfStudyId || '',
        fieldOfStudyName: profile.fieldOfStudy?.name || '',
        specializationId: profile.specializationId || '',
        specializationName: profile.specialization?.name || '',
        regionId: profile.regionId || '',
        city: profile.city || '',
        preferredWorkMode: String(profile.preferredWorkMode || 'ONSITE'),
        availability: profile.availability || 'IMMEDIATELY',
        skills: profile.skills.map((s) => s.skill.name),
        headline: profile.passport?.headline || '',
        bio: profile.passport?.summary || '',
        targetRole: profile.targetRole || '',
        targetIndustries: profile.targetIndustries || '',
        careerGoals: profile.careerGoals || '',
        skillsToImprove: profile.skillsToImprove || '',
        isCvSearchable: profile.isCvSearchable,
        cvUrl: profile.cvUrl ?? null,
        cvFileName: profile.cvFileName ?? null,
        cvFileSize: profile.cvFileSize ?? null,
      }}
    />
  );
}
