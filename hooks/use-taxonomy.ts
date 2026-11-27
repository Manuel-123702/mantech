'use client';

import { useEffect, useState } from 'react';

export interface TaxonomySpecialization {
  id: string;
  name: string;
  slug: string;
}

export interface TaxonomyField {
  id: string;
  name: string;
  slug: string;
  specializations: TaxonomySpecialization[];
}

export interface TaxonomyRegion {
  id: string;
  code: string;
  name: string;
}

export function useTaxonomy() {
  const [fields, setFields] = useState<TaxonomyField[]>([]);
  const [regions, setRegions] = useState<TaxonomyRegion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/taxonomy')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          if (Array.isArray(data.fields)) setFields(data.fields);
          if (Array.isArray(data.regions)) setRegions(data.regions);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { fields, regions, loading };
}
