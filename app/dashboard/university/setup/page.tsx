'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Taxonomy = {
  industries: { id: string; name: string }[];
  regions: { id: string; name: string }[];
};

const UNIVERSITY_TYPES = [
  'State University',
  'Private University',
  'Polytechnic',
  'Higher Institute',
  'Professional School',
  'Training Centre',
];

export default function UniversitySetupPage() {
  const router = useRouter();
  const [taxonomy, setTaxonomy] = useState<Taxonomy>({ industries: [], regions: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    regionId: '',
    city: '',
    address: '',
    universityType: '',
    faculties: '',
  });

  useEffect(() => {
    fetch('/api/taxonomy')
      .then((res) => res.json())
      .then(setTaxonomy)
      .catch(() => undefined);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const faculties = form.faculties
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const res = await fetch('/api/organization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        type: 'university',
        universityType: form.universityType || undefined,
        faculties,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Could not create institution profile');
      return;
    }
    router.push('/dashboard/university');
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Institution onboarding</p>
          <CardTitle>Create your institution profile</CardTitle>
          <CardDescription>
            This profile powers both dashboard modes: the Placement Office (tracking student placements) and Recruiter
            mode (publishing internship opportunities for your institution).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
            )}
            <div>
              <Label htmlFor="name">Institution name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. University of Buea"
                required
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Use the exact name your students use in their intern profiles so they can be linked to your dashboard.
              </p>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                placeholder="Brief description of the institution and its placement programmes"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Institution type</Label>
                <Select onValueChange={(universityType) => setForm({ ...form, universityType })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIVERSITY_TYPES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Region</Label>
                <Select onValueChange={(regionId) => setForm({ ...form, regionId })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {taxonomy.regions.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="faculties">Faculties / departments</Label>
              <Input
                id="faculties"
                value={form.faculties}
                onChange={(e) => setForm({ ...form, faculties: e.target.value })}
                placeholder="e.g. Faculty of Science, Faculty of Engineering"
              />
              <p className="mt-1 text-[11px] text-slate-500">Separate multiple entries with commas.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create institution profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
