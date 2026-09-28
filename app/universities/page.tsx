'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Globe, Loader2, Inbox, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface University {
  id: string;
  name: string;
  type?: string;
  description?: string;
  city?: string;
  website?: string;
  verificationStatus: string;
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading - in production, this would fetch from API
    async function load() {
      // Placeholder data until API is connected
      const mockUniversities: University[] = [
        {
          id: '1',
          name: 'University of Yaoundé I',
          type: 'Public State University',
          description: 'Leading university in Cameroon with strong engineering and computer science programs.',
          city: 'Yaoundé',
          website: 'https://www.uy1.uninet.cm',
          verificationStatus: 'VERIFIED',
        },
        {
          id: '2',
          name: 'ENSPY',
          type: 'Polytechnic School',
          description: 'National Advanced School of Engineering specializing in telecommunications and networks.',
          city: 'Yaoundé',
          website: 'https://www.enspy.cm',
          verificationStatus: 'VERIFIED',
        },
        {
          id: '3',
          name: 'University of Buea',
          type: 'Public State University',
          description: 'Premier university in the Southwest region with excellent ICT programs.',
          city: 'Buea',
          website: 'https://www.ubuea.cm',
          verificationStatus: 'VERIFIED',
        },
      ];
      
      setUniversities(mockUniversities);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="overflow-hidden">
      <section className="pt-8 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Partner universities</h1>
            <p className="mt-4 text-lg text-muted-foreground">Verified higher education institutions partnered with MANTECH.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : universities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 font-heading text-lg font-semibold">No verified universities yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Universities register and get verified by MANTECH administrators before appearing here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {universities.map((uni, idx) => (
                <motion.div key={uni.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white"><GraduationCap className="h-7 w-7" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading text-lg font-semibold text-foreground">{uni.name}</h3>
                          <BadgeCheck className="h-5 w-5 text-green-600" />
                        </div>
                        {uni.type && <p className="text-sm text-muted-foreground">{uni.type}</p>}
                      </div>
                    </div>
                    {uni.description && <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{uni.description}</p>}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {uni.city && <Badge variant="secondary"><MapPin className="mr-1 h-3 w-3" />{uni.city}</Badge>}
                      {uni.website && <Badge variant="secondary"><Globe className="mr-1 h-3 w-3" />Website</Badge>}
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
