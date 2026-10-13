"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, CheckCircle2, User as UserIcon, Download } from "lucide-react";

export type InternSettingsMode = "profile" | "notifications";
export type InternSettingsUser = {
  id: string;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
};
export type InternSettingsProfile = {
  id: string;
  avatarUrl: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  cvFileSize: number | null;
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
  targetRole: string | null;
  targetIndustries: string | null;
  careerGoals: string | null;
  skillsToImprove: string | null;
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
    avatarUrl: profile?.avatarUrl ?? "",
    cvUrl: profile?.cvUrl ?? "",
    cvFileKey: "",
    cvFileName: profile?.cvFileName ?? "",
    cvFileSize: profile?.cvFileSize ?? 0,
    targetRole: profile?.targetRole ?? "",
    targetIndustries: profile?.targetIndustries ?? "",
    careerGoals: profile?.careerGoals ?? "",
    skillsToImprove: profile?.skillsToImprove ?? "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  async function uploadFile(file: File, type: "cv" | "photo") {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || "Upload failed");
    }
    return res.json();
  }

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

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="photo">Profile photo</Label>
          <div className="mt-1.5 flex items-center gap-4">
            {form.avatarUrl ? (
              <Image
                src={form.avatarUrl}
                alt="Profile"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                <UserIcon className="h-5 w-5" />
              </div>
            )}
            <Input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setError(null);
                setAvatarFile(f);
                try {
                  const u = await uploadFile(f, 'photo');
                  // Persist the photo on the user record so the Intern
                  // Passport directory shows it (replaces the initial letter).
                  const saved = await fetch('/api/me/avatar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ avatarUrl: u.url }),
                  });
                  if (!saved.ok) throw new Error('Could not save your photo');
                  setForm((prev) => ({ ...prev, avatarUrl: u.url }));
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Could not upload your photo');
                } finally {
                  setAvatarFile(null);
                }
              }}
              className="flex-1"
            />
          </div>
          {form.avatarUrl && (
            <p className="mt-1 text-xs text-slate-500">
              Photo saved. Remove the file above to select a new one.
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="cv">Resume / CV (PDF)</Label>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            {form.cvUrl ? (
              <a
                href={form.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
              >
                <Download className="h-4 w-4" />
                {form.cvFileName || form.cvUrl.split("/").pop()}
              </a>
            ) : (
              <span className="text-sm text-slate-500">No CV uploaded yet.</span>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!!cvFile}
              onClick={() => document.getElementById("cv")?.click()}
            >
              <Download className="h-4 w-4 mr-1" />
              {cvFile ? "Uploading…" : form.cvUrl ? "Replace CV" : "Upload CV"}
            </Button>
            <Input
              id="cv"
              type="file"
              accept="application/pdf"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setError(null);
                setCvFile(f);
                try {
                  const u = await uploadFile(f, "cv");
                  setForm((prev) => ({
                    ...prev,
                    cvUrl: u.url,
                    cvFileKey: u.fileKey ?? "",
                    cvFileName: u.fileName ?? prev.cvFileName,
                    cvFileSize: u.fileSize ?? prev.cvFileSize,
                  }));
                } catch (err) {
                  setError(
                    err instanceof Error ? err.message : "Could not upload your CV",
                  );
                } finally {
                  setCvFile(null);
                  // Reset the input so selecting the same file again still fires.
                  e.target.value = "";
                }
              }}
              className="hidden"
            />
            {cvFile && (
              <span className="text-xs text-slate-500">Uploading {cvFile.name}…</span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Your CV is only shared through verified organizations. Set
            &ldquo;Show my Passport in recruiter search&rdquo; below to control
            discoverability.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
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

      {/* Career acquisition signals — improve readiness over time. */}
      <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Career signals
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="targetRole">Target role</Label>
            <Input
              id="targetRole"
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
              placeholder="e.g. Software Engineer, Data Analyst"
            />
          </div>
          <div>
            <Label htmlFor="targetIndustries">Target industries</Label>
            <Input
              id="targetIndustries"
              value={form.targetIndustries}
              onChange={(e) =>
                setForm({ ...form, targetIndustries: e.target.value })
              }
              placeholder="e.g. Fintech, HealthTech, E-commerce"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="careerGoals">Career goals</Label>
            <Textarea
              id="careerGoals"
              rows={2}
              value={form.careerGoals}
              onChange={(e) =>
                setForm({ ...form, careerGoals: e.target.value })
              }
              placeholder="Where you want to be in 2-3 years"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="skillsToImprove">Skills to improve</Label>
            <Textarea
              id="skillsToImprove"
              rows={2}
              value={form.skillsToImprove}
              onChange={(e) =>
                setForm({ ...form, skillsToImprove: e.target.value })
              }
              placeholder="What to work on next"
            />
          </div>
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
