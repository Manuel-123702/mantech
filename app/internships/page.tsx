'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, Building2, Loader2, Inbox } from 'lucide-react';
import { initialData } from '@/lib/data-store';
import type { Internship, Company } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type InternshipWithCompany = Internship & { company?: Company };

const regions = ['All', 'Littoral', 'Centre', 'South-West', 'North-West', 'West', 'South', 'East', 'Far North', 'North', 'Adamawa'];
const workModes = ['All', 'on-site', 'hybrid', 'remote'];
const paidOptions = ['All', 'Paid', 'Unpaid'];

export default function InternshipsPage() {
  const [internships, setInternships] = useState<InternshipWithCompany[]>(initialData.internships as unknown as InternshipWithCompany[]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [paid, setPaid] = useState('All');

  const filtered = internships.filter((i) => {
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.description?.toLowerCase().includes(search.toLowerCase())) return false;
    if (region !== 'All' && i.region !== region) return false;
    if (workMode !== 'All' && i.work_mode !== workMode) return false;
    if (paid === 'Paid' && !i.is_paid) return false;
    if (paid === 'Unpaid' && i.is_paid) return false;
    return true;
  });

  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Find your internship</h1>
            <p className="mt-4 text-lg text-muted-foreground">Discover IT internships across Cameroon&apos;s 10 regions.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-card md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search internships..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="Region" /></SelectTrigger>
              <SelectContent>{regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={workMode} onValueChange={setWorkMode}>
              <SelectTrigger className="w-full md:w-36"><SelectValue placeholder="Work mode" /></SelectTrigger>
              <SelectContent>{workModes.map((w) => <SelectItem key={w} value={w}>{w === 'All' ? 'All modes' : w}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={paid} onValueChange={setPaid}>
              <SelectTrigger className="w-full md:w-36"><SelectValue placeholder="Paid/Unpaid" /></SelectTrigger>
              <SelectContent>{paidOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 font-heading text-lg font-semibold">No internships found</h3>
              <p className="mt-1 text-sm text-muted-foreground">No published internships match your filters yet. Companies can create internships from their dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((internship, idx) => (
                <motion.div key={internship.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                  <Link href={`/mantech-internship/opportunities/${internship.slug}`} className="block h-full">
                    <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{internship.title}</h3>
                          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" /> {internship.company?.name || 'Company'}
                          </div>
                        </div>
                        {internship.is_featured && <Badge className="bg-accent text-white">Featured</Badge>}
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{internship.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {internship.field && <Badge variant="secondary">{internship.field}</Badge>}
                        {internship.city && <Badge variant="secondary"><MapPin className="mr-1 h-3 w-3" />{internship.city}</Badge>}
                        <Badge variant="secondary"><Briefcase className="mr-1 h-3 w-3" />{internship.work_mode}</Badge>
                        {internship.duration && <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />{internship.duration}</Badge>}
                        {internship.is_paid && <Badge className="bg-green-100 text-green-700">Paid</Badge>}
                      </div>
                      {internship.application_deadline && (
                        <div className="mt-4 text-xs text-muted-foreground">Deadline: {new Date(internship.application_deadline).toLocaleDateString('en-GB')}</div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
