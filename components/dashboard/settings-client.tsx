'use client';
import { Trans, useLingui } from '@lingui/react/macro';


import { useState } from 'react';
import { useRouter } from '@/i18n/navigation.hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Plus, UserPlus, Save, X } from 'lucide-react';
import { useTaxonomy } from '@/lib/use-taxonomy';

export type SettingsOrgType = 'COMPANY' | 'UNIVERSITY';

type Props = {
  mode: 'profile' | 'members' | 'notifications';
  orgType: SettingsOrgType;
  organization: {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    email: string | null;
    phone: string | null;
    logoUrl: string | null;
    industryId: string | null;
    industryName?: string | null;
    regionId: string | null;
    regionName?: string | null;
    city: string | null;
    address: string | null;
    size: string | null;
    universityType?: string | null;
    verificationStatus: string;
    packageCode: string;
    techStack: string[];
    perks: string[];
    branches: string[];
    faculties?: string[];
    members: {
      id: string;
      userId: string;
      jobTitle: string | null;
      isOwner: boolean;
      role: string;
      joinedAt: string;
      user: { fullName: string; email: string; avatarUrl?: string | null; role: string };
    }[];
  };
  userId: string;
};

export default function SettingsClient({ mode, orgType, organization, userId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (mode === 'profile') {
    return (
      <ProfileForm
        organization={organization}
        orgType={orgType}
        saving={saving}
        setSaving={setSaving}
        error={error}
        setError={setError}
        refresh={() => router.refresh()}
      />
    );
  }
  if (mode === 'members') {
    return <MembersSection organization={organization} orgType={orgType} userId={userId} />;
  }
  if (mode === 'notifications') {
    return <NotificationsSection />;
  }
  return null;
}

function ProfileForm({
  organization,
  orgType,
  saving,
  setSaving,
  error,
  setError,
  refresh,
}: {
  organization: Props['organization'];
  orgType: SettingsOrgType;
  saving: boolean;
  setSaving: (v: boolean) => void;
  error: string | null;
  setError: (v: string | null) => void;
  refresh: () => void;
}) {
  const { t } = useLingui();
  const isUniversity = orgType === 'UNIVERSITY';
  const taxonomy = useTaxonomy();
  const [form, setForm] = useState({
    name: organization.name,
    description: organization.description || '',
    website: organization.website || '',
    email: organization.email || '',
    phone: organization.phone || '',
    logoUrl: organization.logoUrl || '',
    industryId: organization.industryId || '',
    regionId: organization.regionId || '',
    city: organization.city || '',
    address: organization.address || '',
    size: organization.size || '',
    universityType: organization.universityType || '',
  });
  const [techStack, setTechStack] = useState<string[]>(organization.techStack);
  const [techInput, setTechInput] = useState('');
  const [perks, setPerks] = useState<string[]>(organization.perks);
  const [perkInput, setPerkInput] = useState('');
  const [faculties, setFaculties] = useState<string[]>(organization.faculties || []);
  const [facultyInput, setFacultyInput] = useState('');

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/organization', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isUniversity
            ? { ...form, faculties }
            : { ...form, techStack, perks, branches: organization.branches }
        ),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Could not save profile');
      }
      refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={saveProfile} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>{isUniversity ? 'Institution name' : 'Company name'}</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label><Trans comment="settings page Label visible text">Description</Trans></Label>
          <Textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={
              isUniversity
                ? t({ message: "Short introduction that appears on your public institution profile", comment: "settings page component placeholder attribute" })
                : t({ message: "Short introduction that appears on your public company profile", comment: "settings page component placeholder attribute" })
            }
          />
        </div>
        {isUniversity ? (
          <div>
            <Label><Trans comment="settings page Label visible text">Institution type</Trans></Label>
            <Select
              value={form.universityType}
              onValueChange={(v) => setForm({ ...form, universityType: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t({ message: "Select institution type", comment: "settings page component placeholder attribute" })} />
              </SelectTrigger>
              <SelectContent>
                {[
                  'Public State University',
                  'Private University',
                  'Private Higher Institute',
                  'Polytechnic',
                  'Professional School',
                ].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <Label><Trans comment="settings page Label visible text">Industry</Trans></Label>
            <Select
              value={form.industryId}
              onValueChange={(v) => setForm({ ...form, industryId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t({ message: "Select industry", comment: "settings page component placeholder attribute" })} />
              </SelectTrigger>
              <SelectContent>
                {[
                  'Technology',
                  'Finance',
                  'Commerce',
                  'Healthcare',
                  'Education',
                  'Construction',
                  'Manufacturing',
                  'Telecom',
                  'Consulting',
                  'NGO / Non-profit',
                  'Public sector',
                ].map((n, i) => (
                  <SelectItem key={i} value={`ind_${i}_${n.toLowerCase().replace(/[^a-z]/g, '_')}`}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {!isUniversity && (
          <div>
            <Label><Trans comment="settings page Label visible text">Company size</Trans></Label>
            <Select value={form.size} onValueChange={(v) => setForm({ ...form, size: v })}>
              <SelectTrigger>
                <SelectValue placeholder={t({ message: "Select size", comment: "settings page component placeholder attribute" })} />
              </SelectTrigger>
              <SelectContent>
                {['1-10', '11-50', '51-200', '201-500', '500+'].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s} <Trans comment="settings page SelectItem visible text">employees
                  </Trans></SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label><Trans comment="settings page Label visible text">Region</Trans></Label>
          <Select
            value={form.regionId}
            onValueChange={(v) => setForm({ ...form, regionId: v })}
            disabled={taxonomy.loading}
          >
            <SelectTrigger>
              <SelectValue placeholder={taxonomy.loading
                ? t({ message: 'Loading regions...', comment: 'Placeholder while the organization region options load' })
                : t({ message: 'Select region', comment: 'Placeholder for choosing the organization region' })} />
            </SelectTrigger>
            <SelectContent>
              {taxonomy.regions.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {taxonomy.error && <p role="alert" className="mt-1 text-xs text-red-600">{taxonomy.error}</p>}
        </div>
        <div>
          <Label><Trans comment="settings page Label visible text">City / town</Trans></Label>
          <Input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder={t({ message: "Douala, Yaoundé, Buea…", comment: "settings page component placeholder attribute" })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label><Trans comment="settings page Label visible text">Address</Trans></Label>
          <Input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder={isUniversity
              ? t({ message: 'Campus address', comment: 'Address placeholder for a university profile' })
              : t({ message: 'Office address', comment: 'Address placeholder for a company profile' })}
          />
        </div>
        <div>
          <Label><Trans comment="settings page Label visible text">Website</Trans></Label>
          <Input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder={t({ message: "https://…", comment: "settings page component placeholder attribute" })}
          />
        </div>
        <div>
          <Label><Trans comment="settings page Label visible text">Contact email</Trans></Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <Label><Trans comment="settings page Label visible text">Phone</Trans></Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder={
              /* eslint-disable-next-line i18next/no-literal-string -- Cameroon phone-format sample is not translatable prose */
              '+237…'
            }
          />
        </div>
        <div>
          <Label><Trans comment="settings page Label visible text">Logo URL</Trans></Label>
          <Input
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            placeholder={t({ message: "https://…", comment: "settings page component placeholder attribute" })}
          />
        </div>
        {isUniversity ? (
          <div className="sm:col-span-2">
            <Label><Trans comment="settings page Label visible text">Faculties & schools</Trans></Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {faculties.map((s) => (
                <Badge key={s} variant="secondary" className="inline-flex items-center gap-1">
                  {s}
                  <button
                    type="button"
                    className="ml-1 text-slate-500 hover:text-red-600"
                    onClick={() => setFaculties((prev) => prev.filter((x) => x !== s))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              className="mt-2"
              placeholder={t({ message: "Add a faculty and press Enter", comment: "settings page component placeholder attribute" })}
              value={facultyInput}
              onChange={(e) => setFacultyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && facultyInput.trim()) {
                  e.preventDefault();
                  if (!faculties.includes(facultyInput.trim()))
                    setFaculties((prev) => [...prev, facultyInput.trim()]);
                  setFacultyInput('');
                }
              }}
            />
          </div>
        ) : (
          <>
            <div className="sm:col-span-2">
              <Label><Trans comment="settings page Label visible text">Tech stack</Trans></Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {techStack.map((s) => (
                  <Badge key={s} variant="secondary" className="inline-flex items-center gap-1">
                    {s}
                    <button
                      type="button"
                      className="ml-1 text-slate-500 hover:text-red-600"
                      onClick={() => setTechStack((prev) => prev.filter((x) => x !== s))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                className="mt-2"
                placeholder={t({ message: "Add a technology and press Enter", comment: "settings page component placeholder attribute" })}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && techInput.trim()) {
                    e.preventDefault();
                    if (!techStack.includes(techInput.trim()))
                      setTechStack((prev) => [...prev, techInput.trim()]);
                    setTechInput('');
                  }
                }}
              />
            </div>
            <div className="sm:col-span-2">
              <Label><Trans comment="settings page Label visible text">Perks & benefits</Trans></Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {perks.map((s) => (
                  <Badge key={s} variant="outline" className="inline-flex items-center gap-1">
                    {s}
                    <button
                      type="button"
                      className="ml-1 text-slate-500 hover:text-red-600"
                      onClick={() => setPerks((prev) => prev.filter((x) => x !== s))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                className="mt-2"
                placeholder={t({ message: "Add a perk and press Enter", comment: "settings page component placeholder attribute" })}
                value={perkInput}
                onChange={(e) => setPerkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && perkInput.trim()) {
                    e.preventDefault();
                    if (!perks.includes(perkInput.trim()))
                      setPerks((prev) => [...prev, perkInput.trim()]);
                    setPerkInput('');
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isUniversity ? 'Save institution' : 'Save organization'}
        </Button>
      </div>
    </form>
  );
}

function MembersSection({
  organization,
  orgType,
  userId,
}: {
  organization: Props['organization'];
  orgType: SettingsOrgType;
  userId: string;
}) {
  const isUniversity = orgType === 'UNIVERSITY';
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    jobTitle: '',
    role: 'recruiter',
  });

  async function invite() {
    if (!form.email) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/organization/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Could not invite member');
      }
      setOpen(false);
      setForm({ email: '', fullName: '', jobTitle: '', role: 'recruiter' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const currentUserMember = organization.members.find((m) => m.userId === userId);
  const canManage =
    currentUserMember?.isOwner ||
    currentUserMember?.role === 'admin' ||
    currentUserMember?.role === 'owner';

  return (
    <div className="space-y-4">
      {canManage ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              {isUniversity ? 'Invite staff' : 'Invite recruiter'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isUniversity ? 'Invite staff member' : 'Invite team member'}</DialogTitle>
              <DialogDescription>
                {isUniversity
                  ? 'Grant placement office access to a colleague. The invitee must already have a MANTECH account.'
                  : 'Send a recruiter or admin access invitation. The invitee must already have a MANTECH account.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label><Trans comment="settings page Label visible text">Email *</Trans></Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={isUniversity
                    ? t({ message: 'officer@university.cm', comment: 'Example email placeholder for inviting a university placement officer' })
                    : t({ message: 'recruiter@company.cm', comment: 'Example email placeholder for inviting a company recruiter' })}
                />
              </div>
              <div>
                <Label><Trans comment="settings page Label visible text">Job title</Trans></Label>
                <Input
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                  placeholder={isUniversity
                    ? t({ message: 'e.g. Placement Coordinator', comment: 'Role placeholder for inviting a university placement officer' })
                    : t({ message: 'e.g. HR Manager', comment: 'Role placeholder for inviting a company recruiter' })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label><Trans comment="settings page Label visible text">Role</Trans></Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recruiter">
                      {isUniversity ? 'Placement officer' : 'Recruiter'}
                    </SelectItem>
                    <SelectItem value="admin"><Trans comment="settings page SelectItem visible text">Admin</Trans></SelectItem>
                    <SelectItem value="member"><Trans comment="settings page SelectItem visible text">Member</Trans></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                <Trans comment="settings page Button visible text">Cancel
              </Trans></Button>
              <Button onClick={invite} disabled={saving || !form.email}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                <Trans comment="settings page Button visible text">Send invitation
              </Trans></Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <p className="text-xs text-slate-500">
          {isUniversity
            ? 'Only the institution owner or admins can invite new staff.'
            : 'Only the organization owner or admins can invite new recruiters.'}
        </p>
      )}
    </div>
  );
}

function NotificationsSection() {
  const items = [
    { id: 'app_new', label: 'New applications', defaultOn: true, desc: 'Receive a notification when an intern applies to your opportunity.' },
    { id: 'app_shortlist', label: 'Shortlist reminders', defaultOn: true, desc: 'Weekly digest of candidates to review.' },
    { id: 'interview', label: 'Interview reminders', defaultOn: true, desc: 'Day-before and 1-hour reminders for scheduled interviews.' },
    { id: 'placement', label: 'Placement & onboarding', defaultOn: true, desc: 'Confirmations, onboarding check-ins, and completion.' },
    { id: 'candidate_contact', label: 'Candidate contact replies', defaultOn: true, desc: 'When a candidate responds to your contact request.' },
    { id: 'billing', label: 'Billing & package updates', defaultOn: true, desc: 'Subscription requests, activations, and renewals.' },
    { id: 'marketing', label: 'Platform updates & featured opportunities', defaultOn: false, desc: 'Occasional product and promotional emails.' },
  ];

  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((i) => [i.id, i.defaultOn]))
  );
  const [saving, setSaving] = useState(false);

  async function savePrefs() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y rounded-xl border">
        {items.map((item) => (
          <li key={item.id} className="p-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-slate-900">{item.label}</p>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
            <Switch
              checked={!!states[item.id]}
              onCheckedChange={(v) => setStates((s) => ({ ...s, [item.id]: v }))}
            />
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button onClick={savePrefs} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          <Trans comment="settings page Button visible text">Save preferences
        </Trans></Button>
      </div>
    </div>
  );
}
