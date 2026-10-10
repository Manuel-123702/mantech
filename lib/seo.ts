/**
 * MANTECH Nexus — Central SEO + i18n helpers
 * Single source of truth for site URL, metadata builders, JobPosting JSON-LD.
 */

export const SITE_URL =
  (process.env.NEXT_PUBLIC_APP_URL || 'https://mantech.nexus').replace(/\/$/, '');

export const SITE_NAME = 'MANTECH Nexus';
export const SITE_TAGLINE =
  'Cameroon Premier Professional Internship Marketplace & Recruitment Platform';

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export type JobPostingInput = {
  title: string;
  description: string;
  slug: string;
  city?: string | null;
  regionName?: string | null;
  companyName?: string | null;
  companyWebsite?: string | null;
  workMode?: string | null;
  isPaid?: boolean | null;
  stipendXAF?: number | null;
  postedAt?: string | Date | null;
  deadline?: string | Date | null;
  durationMonths?: number | null;
};

export function jobPostingJsonLd(job: JobPostingInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: (job.description || '').slice(0, 5000),
    identifier: { '@type': 'PropertyValue', name: 'MANTECH Nexus', value: job.slug },
    url: absoluteUrl(`/internships/${job.slug}`),
    datePosted: job.postedAt ? new Date(job.postedAt).toISOString() : new Date().toISOString(),
    validThrough: job.deadline ? new Date(job.deadline).toISOString() : undefined,
    employmentType: job.durationMonths && job.durationMonths >= 6 ? 'INTERN' : 'INTERN',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.companyName || 'Verified Enterprise',
      sameAs: job.companyWebsite || absoluteUrl('/companies'),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city || 'Douala',
        addressRegion: job.regionName || undefined,
        addressCountry: 'CM',
      },
    },
    jobLocationType: job.workMode === 'REMOTE' ? 'TELECOMMUTE' : undefined,
    baseSalary: job.isPaid && job.stipendXAF ? {
      '@type': 'MonetaryAmount',
      currency: 'XAF',
      value: { '@type': 'QuantitativeValue', value: job.stipendXAF, unitText: 'MONTH' },
    } : undefined,
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    slogan: SITE_TAGLINE,
    areaServed: 'CM',
    sameAs: [
      'https://linkedin.com/company/mantech-nexus',
      'https://facebook.com/mantechnexus',
    ],
  };
}
