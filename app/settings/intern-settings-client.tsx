"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, CheckCircle2, User as UserIcon } from "lucide-react";

export type InternSettingsMode = "profile" | "notifications";
export type InternSettingsUser = {
  id: string;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
};
export type InternSettingsProfile = {
  id: string;
  phone: string | null;
  bio: string | null;
  availability: string | null;
  workMode: string | null;
  isPhonePublic: boolean;
  isCvSearchable: boolean;
  city: string | null;
  regionId: string | null;
  regionName: string | null;
  fieldName: string | null;
  qualification: string | null;
  readinessScore: number;
} | null;

export function InternSettingsClient({
  mode,
  user,
  profile,
}: {
  mode: InternSettingsMode;
  user: InternSettingsUser;
  profile: InternSettingsProfile;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (mode === "profile") {
    return (
      <InternProfileForm
        user={user}
        profile={profile}
        saving={saving}
        setSaving={setSaving}
        saved={saved}
        setSaved={setSaved}
        error={error}
        setError={setError}
        refresh={() => router.refresh()}
      />
    );
  }

  return <InternNotificationsSection user={user} />;
}

function InternProfileForm({
  user,
  profile,
  saving,
  setSaving,
  saved,
  setSaved,
  error,
  setError,
  refresh,
}: {
  user: InternSettingsUser;
  profile: InternSettingsProfile;
  saving: boolean;
  setSaving: (v: boolean) => void;
  saved: boolean;
  setSaved: (v: boolean) => void;
  error: string | null;
  setError: (v: string | null) => void;
  refresh: () => void;
}) {
  const [form, setForm] = useState({
    phone: profile?.phone ?? "",
    bio: profile?.bio ?? "",
    availability: profile?.availability ?? "",
    workMode: profile?.workMode ?? "",
    city: profile?.city ?? "",
    isPhonePublic: profile?.isPhonePublic ?? true,
    isCvSearchable: profile?.isCvSearchable ?? true,
  });

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/interns/register", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Could not save profile");
      }
      setSaved(true);
      refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={saveProfile} className="space-y-5">
      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Profile saved successfully.
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="fullName">Full legal name</Label>
          <div className="mt-1.5 flex items-center gap-2">
            <Input
              id="fullName"
              value={user.fullName || ""}
              disabled
              className="flex-1 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700 border-emerald-200"
            >
              <UserIcon className="w-3 h-3 mr-1" />
              Managed by Clerk
            </Badge>
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="email">Email address</Label>
          <div className="mt-1.5 flex items-center gap-2">
            <Input
              id="email"
              value={user.email}
              type="email"
              disabled
              className="flex-1 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700 border-emerald-200"
            >
              Verified
            </Badge>
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone number *</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1.5"
            placeholder="+237 6XX XXX XXX"
            required
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Mandatory on MANTECH — organizations may call you directly.
          </p>
        </div>

        <div>
          <Label htmlFor="city">City / town</Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="mt-1.5"
            placeholder="Yaoundé, Douala, Buea…"
          />
        </div>

        <div>
          <Label htmlFor="availability">Availability</Label>
          <Input
            id="availability"
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value })}
            className="mt-1.5"
            placeholder="Immediately, From June 2026…"
          />
        </div>

        <div>
          <Label htmlFor="workMode">Preferred work mode</Label>
          <Input
            id="workMode"
            value={form.workMode}
            onChange={(e) => setForm({ ...form, workMode: e.target.value })}
            className="mt-1.5"
            placeholder="On-site, Hybrid, Remote…"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="bio">Professional summary / bio</Label>
          <Textarea
            id="bio"
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="mt-1.5 text-sm"
            placeholder="Short paragraph that recruiters will see on your Intern Passport: your goals, strengths, and what you're looking for."
          />
        </div>
      </div>

      <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Privacy controls
        </h4>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Phone visible to verified organizations
            </p>
            <p className="text-xs text-slate-500">
              When disabled, organizations must use the contact flow first.
            </p>
          </div>
          <Switch
            checked={!!form.isPhonePublic}
            onCheckedChange={(v) => setForm({ ...form, isPhonePublic: v })}
          />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Show my Passport in recruiter search
            </p>
            <p className="text-xs text-slate-500">
              When disabled, your profile won&apos;t appear in Intern Passport
              discovery.
            </p>
          </div>
          <Switch
            checked={!!form.isCvSearchable}
            onCheckedChange={(v) => setForm({ ...form, isCvSearchable: v })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500">
          {profile ? (
            <>
              Readiness score:{" "}
              <span className="font-semibold text-blue-700">
                {profile.readinessScore}%
              </span>
              {profile.fieldName && (
                <>
                  {" "}
                  · Field:{" "}
                  <span className="font-semibold text-slate-700">
                    {profile.fieldName}
                  </span>
                </>
              )}
              {profile.qualification && (
                <>
                  {" "}
                  · Qualification:{" "}
                  <span className="font-semibold text-slate-700">
                    {profile.qualification}
                  </span>
                </>
              )}
            </>
          ) : (
            "Complete your intern profile to unlock readiness scoring."
          )}
        </div>
        <Button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save changes
        </Button>
      </div>
    </form>
  );
}

function InternNotificationsSection({ user }: { user: InternSettingsUser }) {
  const items = [
    {
      id: "app_status",
      label: "Application status updates",
      defaultOn: true,
      desc: "When your application moves to shortlist, interview, selected, or rejected.",
    },
    {
      id: "interview",
      label: "Interview invitations & reminders",
      defaultOn: true,
      desc: "Day-before and 1-hour reminders for scheduled interviews.",
    },
    {
      id: "contact",
      label: "Organization contact requests",
      defaultOn: true,
      desc: "When a recruiter or placement officer reaches out via MANTECH.",
    },
    {
      id: "saved_alert",
      label: "Saved opportunity alerts",
      defaultOn: true,
      desc: "Deadline reminders and status changes on postings you saved.",
    },
    {
      id: "opportunity_match",
      label: "New matching opportunities",
      defaultOn: true,
      desc: "Weekly digest of internships matching your field, specialization, and location.",
    },
    {
      id: "onboarding",
      label: "Placement & onboarding",
      defaultOn: true,
      desc: "Once you are selected: confirmation, start-date reminder, and completion celebration.",
    },
    {
      id: "marketing",
      label: "Platform updates & MANTECH news",
      defaultOn: false,
      desc: "Occasional product news, internship fairs, and service announcements.",
    },
  ];

  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((i) => [i.id, i.defaultOn])),
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function savePrefs() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-4">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Preferences saved.
        </div>
      )}
      <ul className="divide-y rounded-xl border">
        {items.map((item) => (
          <li
            key={item.id}
            className="p-4 flex items-start justify-between gap-3"
          >
            <div>
              <p className="font-medium text-slate-900">{item.label}</p>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
            <Switch
              checked={!!states[item.id]}
              onCheckedChange={(v) =>
                setStates((s) => ({ ...s, [item.id]: v }))
              }
            />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Messages delivered via in-platform notification & email where
          applicable.
        </p>
        <Button
          onClick={savePrefs}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save preferences
        </Button>
      </div>
    </div>
  );
}
