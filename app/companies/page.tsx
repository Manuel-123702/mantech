'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Globe, Mail, Loader2, Inbox, BadgeCheck } from 'lucide-react';
import { initialData } from '@/lib/data-store';
import type { Company } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(initialData.companies);
  const [loading, setLoading] = useState(false);

  return (
    <div className="overflow-hidden">
      <section className="pt-8 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Partner companies</h1>
            <p className="mt-4 text-lg text-muted-foreground">Verified companies hosting IT internships across Cameroon.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 font-heading text-lg font-semibold">No verified companies yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Companies register and get verified by MANTECH administrators before appearing here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company, idx) => (
                <motion.div key={company.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-mantech text-white"><Building2 className="h-7 w-7" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading text-lg font-semibold text-foreground">{company.name}</h3>
                          <BadgeCheck className="h-5 w-5 text-primary" />
                        </div>
                        {company.industry && <p className="text-sm text-muted-foreground">{company.industry}</p>}
                      </div>
                    </div>
                    {company.description && <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{company.description}</p>}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {company.city && <Badge variant="secondary"><MapPin className="mr-1 h-3 w-3" />{company.city}</Badge>}
                      {company.website && <Badge variant="secondary"><Globe className="mr-1 h-3 w-3" />Website</Badge>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
