'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Package } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function PackageEditButton({ pkg }: { pkg: Package }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: pkg.name,
    priceXAF: String(pkg.priceXAF),
    opportunityLimit: String(pkg.opportunityLimit),
    candidateSearchLimit: String(pkg.candidateSearchLimit),
    maxRecruiterAccounts: String(pkg.maxRecruiterAccounts),
    featuredOpportunitiesLimit: String(pkg.featuredOpportunitiesLimit),
    description: pkg.description,
    features: pkg.features.join('\n'),
    isFeaturedBadge: pkg.isFeaturedBadge,
    prioritySupport: pkg.prioritySupport,
  });

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/packages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: pkg.id,
          ...form,
          priceXAF: Number(form.priceXAF),
          opportunityLimit: Number(form.opportunityLimit),
          candidateSearchLimit: Number(form.candidateSearchLimit),
          maxRecruiterAccounts: Number(form.maxRecruiterAccounts),
          featuredOpportunitiesLimit: Number(form.featuredOpportunitiesLimit),
          features: form.features.split('\n').map((feature) => feature.trim()).filter(Boolean),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || 'Could not update package.');
      setOpen(false);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update package.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">Edit package</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {pkg.name}</DialogTitle>
          <DialogDescription>Package pricing and limits are saved to the operational database.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">Package name
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="space-y-1 text-sm font-medium">Price (XAF)
            <Input type="number" min="0" value={form.priceXAF} onChange={(event) => setForm({ ...form, priceXAF: event.target.value })} />
          </label>
          <label className="space-y-1 text-sm font-medium">Active opportunity limit
            <Input type="number" min="0" value={form.opportunityLimit} onChange={(event) => setForm({ ...form, opportunityLimit: event.target.value })} />
          </label>
          <label className="space-y-1 text-sm font-medium">Monthly candidate views
            <Input type="number" min="0" value={form.candidateSearchLimit} onChange={(event) => setForm({ ...form, candidateSearchLimit: event.target.value })} />
          </label>
          <label className="space-y-1 text-sm font-medium">Recruiter seats
            <Input type="number" min="0" value={form.maxRecruiterAccounts} onChange={(event) => setForm({ ...form, maxRecruiterAccounts: event.target.value })} />
          </label>
          <label className="space-y-1 text-sm font-medium">Featured opportunities
            <Input type="number" min="0" value={form.featuredOpportunitiesLimit} onChange={(event) => setForm({ ...form, featuredOpportunitiesLimit: event.target.value })} />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.isFeaturedBadge} onChange={(event) => setForm({ ...form, isFeaturedBadge: event.target.checked })} />
            Recommended package
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.prioritySupport} onChange={(event) => setForm({ ...form, prioritySupport: event.target.checked })} />
            Priority support
          </label>
          <div className="space-y-1 sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Features (one per line)</Label>
            <Textarea value={form.features} onChange={(event) => setForm({ ...form, features: event.target.value })} rows={6} />
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
          <Button type="button" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save package'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
