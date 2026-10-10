'use client';

import { useEffect, useState } from 'react';

export type TaxonomyField = {
  id: string;
  name: string;
  slug: string;
  category: string;
  specializations: { id: string; name: string; slug: string }[];
};

export type TaxonomyRegion = {
  id: string;
  name: string;
  code: string;
  capital: string;
  locations: { id: string; city: string }[];
};

export type TaxonomyIndustry = {
  id: string;
  name: string;
  slug: string;
};

export type TaxonomySkill = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
};

type Taxonomy = {
  fields: TaxonomyField[];
  regions: TaxonomyRegion[];
  industries: TaxonomyIndustry[];
  skills: TaxonomySkill[];
};

const EMPTY: Taxonomy = { fields: [], regions: [], industries: [], skills: [] };

export function useTaxonomy() {
  const [taxonomy, setTaxonomy] = useState<Taxonomy>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTaxonomy() {
      try {
        const response = await fetch('/api/taxonomy');
        if (!response.ok) {
          throw new Error('Could not load professional fields and locations.');
        }
        const data = (await response.json()) as Partial<Taxonomy>;
        if (!cancelled) {
          setTaxonomy({
            fields: data.fields ?? [],
            regions: data.regions ?? [],
            // Consumed by the SRS §10 advanced search filters.
            industries: data.industries ?? [],
            skills: data.skills ?? [],
          });
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load taxonomy.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadTaxonomy();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...taxonomy, loading, error };
}
