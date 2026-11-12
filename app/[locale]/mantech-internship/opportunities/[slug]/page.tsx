import { redirect } from '@/i18n/redirect';

export default async function LegacyOpportunityRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/internships/${encodeURIComponent(slug)}`);
}
