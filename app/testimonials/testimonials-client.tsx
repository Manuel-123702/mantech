'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MessageSquareQuote,
  Star,
  ImagePlus,
  CheckCircle2,
  Loader2,
  Users,
  Sparkles,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TESTIMONIAL_FOCUSES,
  TESTIMONIAL_LIMITS,
  TESTIMONIAL_REGIONS,
  TESTIMONIAL_ROLES,
  OTHER_OPTION,
} from '@/lib/testimonial-fields';
import { MotionSection, MotionItem } from '@/components/shared/section-animations';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  region: string;
  focus: string;
  message: string;
  details: string;
  rating: number;
  photoUrl: string | null;
  createdAt: string;
  /** True only for the one a visitor has just sent, still waiting for review. */
  pending?: boolean;
};

/** A field on the form, before it has been filled in. */
type Draft = {
  name: string;
  email: string;
  role: string;
  company: string;
  region: string;
  focus: string;
  message: string;
  details: string;
};

const EMPTY_DRAFT: Draft = {
  name: '',
  email: '',
  role: '',
  company: '',
  region: '',
  focus: '',
  message: '',
  details: '',
};

/**
 * Decides what the Send button should do.
 *
 * A visitor should be able to press it and be told what is missing, rather than
 * staring at a disabled button with no explanation.
 */
function canSend(draft: Draft): boolean {
  return (
    draft.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email.trim()) &&
    draft.role.trim().length >= 2 &&
    draft.company.trim().length >= 2 &&
    draft.region.length > 0 &&
    draft.focus.trim().length >= 2 &&
    draft.message.trim().length >= 20 &&
    draft.details.trim().length >= 40
  );
}

/** Turns initials into a dark-tinted coloured circle when there is no photo. */
const AVATAR_TINTS = [
  'bg-blue-900/60 text-blue-300',
  'bg-emerald-900/60 text-emerald-300',
  'bg-amber-900/60 text-amber-300',
  'bg-violet-900/60 text-violet-300',
  'bg-rose-900/60 text-rose-300',
];

function tintFor(seed: string): string {
  let total = 0;
  for (let i = 0; i < seed.length; i += 1) total += seed.charCodeAt(i);
  return AVATAR_TINTS[total % AVATAR_TINTS.length] ?? AVATAR_TINTS[0]!;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialsClient() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Every field except the photo is required. The photo is optional, and the
  // rating is a simple choice, so neither lives in the draft.
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [rating, setRating] = useState(5);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [photoBusy, setPhotoBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  // Which field the server complained about, so we can point at it.
  const [badField, setBadField] = useState('');
  const [sent, setSent] = useState(false);

  /** Updates one field, keeping the rest as the visitor typed them. */
  function setField<K extends keyof Draft>(field: K, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    // Clear the old complaint as soon as the visitor starts fixing it.
    if (badField === field) setBadField('');
    if (error) setError('');
  }

  useEffect(() => {
    let cancelled = false;
    fetch('/api/testimonials', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.testimonials) setItems(data.testimonials);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handlePhoto(file: File) {
    setPhotoBusy(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/testimonials/photo', { method: 'POST', body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'We could not add that photo.');
      setPhotoUrl(data.url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not add that photo.');
    } finally {
      setPhotoBusy(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setError('');
    setBadField('');
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, rating, photoUrl: photoUrl ?? '' }),
      });
      const data = await response.json();
      if (!response.ok) {
        // Remember which box was wrong so the form can point at it.
        if (data?.field) setBadField(data.field);
        throw new Error(data.error || 'We could not send that. Please try again.');
      }
      setSent(true);
      // Show the person their own experience straight away, marked as waiting
      // for review. Otherwise they press Send, see a thank-you, and no sign
      // their message actually arrived anywhere.
      setItems((current) => [
        {
          id: data.id,
          name: draft.name.trim(),
          role: draft.role.trim(),
          company: draft.company.trim(),
          region: draft.region,
          focus: draft.focus.trim(),
          message: draft.message.trim(),
          details: draft.details.trim(),
          rating,
          photoUrl: photoUrl ?? null,
          createdAt: new Date().toISOString(),
          pending: true,
        },
        ...current,
      ]);
      setDraft(EMPTY_DRAFT);
      setPhotoUrl(null);
      setRating(5);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not send that.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <SharePanel
        sent={sent}
        setSent={setSent}
        draft={draft}
        setField={setField}
        badField={badField}
        rating={rating}
        setRating={setRating}
        photoUrl={photoUrl}
        photoBusy={photoBusy}
        onPhoto={handlePhoto}
        sending={sending}
        error={error}
        onSubmit={handleSubmit}
      />
      <Grid items={items} loading={loading} />
    </>
  );
}

type SharePanelProps = {
  sent: boolean;
  setSent: (value: boolean) => void;
  draft: Draft;
  setField: <K extends keyof Draft>(field: K, value: string) => void;
  /** Set when the server rejected one specific field, so we can highlight it. */
  badField: string;
  rating: number;
  setRating: (value: number) => void;
  photoUrl: string | null;
  photoBusy: boolean;
  onPhoto: (file: File) => void;
  sending: boolean;
  error: string;
  onSubmit: (event: React.FormEvent) => void;
};

const LABEL = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-300';
const OPTIONAL = 'font-normal normal-case tracking-normal text-slate-500';
const FIELD =
  'mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-500 shadow-sm transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20';
const BAD_FIELD = 'border-red-500 focus:border-red-500 focus:ring-red-500/20';

/** The red outline shown on whichever box needs fixing. */
function fieldClass(field: string, badField: string): string {
  return `${FIELD} ${badField === field ? BAD_FIELD : ''}`;
}

/**
 * A box the visitor chooses from — and can still type over, because our list
 * will never cover everyone.
 *
 * Choosing "Something else" swaps the list for a free-text box, so a visitor
 * who does not fit any of the options is never stuck.
 */
function ChooseOrType({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  maxLength,
  bad,
}: {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
  bad: boolean;
}) {
  // Whether the visitor has asked to type their own answer.
  //
  // This has to be remembered separately from the value. When "Something else"
  // is chosen there is no real answer yet, so the value is empty — and an empty
  // value is also what an untouched field looks like. Deriving the text box from
  // the value alone therefore never showed it.
  const [wantsToType, setWantsToType] = useState(false);
  const [typed, setTyped] = useState('');

  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label} <span className="text-red-400">*</span>
      </label>
      <Select
        value={wantsToType ? OTHER_OPTION : value}
        onValueChange={(next) => {
          if (next === OTHER_OPTION) {
            // Open the box, but do not overwrite anything already typed.
            setWantsToType(true);
            return;
          }
          setWantsToType(false);
          setTyped('');
          onChange(next);
        }}
      >
        <SelectTrigger
          id={id}
          className={`h-11 bg-slate-800/60 border-slate-700 text-white focus:border-amber-400 focus:ring-amber-400/20 ${bad ? 'border-red-500 focus:ring-red-500/20' : ''}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700 text-white">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="focus:bg-slate-800 focus:text-white">
              {option}
            </SelectItem>
          ))}
          <SelectItem value={OTHER_OPTION} className="focus:bg-slate-800 focus:text-white">
            {OTHER_OPTION} — I&apos;ll type it
          </SelectItem>
        </SelectContent>
      </Select>

      {wantsToType && (
        <div className="mt-2">
          <Input
            autoFocus
            value={typed}
            onChange={(e) => {
              setTyped(e.target.value);
              onChange(e.target.value);
            }}
            maxLength={maxLength}
            placeholder={`Type your own ${label.toLowerCase()}`}
            className={fieldClass(id, bad ? id : '')}
          />
          <button
            type="button"
            onClick={() => {
              // Let them go back to the list without losing their place.
              setWantsToType(false);
              setTyped('');
              onChange('');
            }}
            className="mt-1 text-[11px] font-medium text-slate-500 underline underline-offset-2 hover:text-amber-400"
          >
            Choose from the list instead
          </button>
        </div>
      )}
    </div>
  );
}

function SharePanel(props: SharePanelProps) {
  const {
    sent,
    setSent,
    draft,
    setField,
    badField,
    rating,
    setRating,
    photoUrl,
    photoBusy,
    onPhoto,
    sending,
    error,
    onSubmit,
  } = props;

  // Lets the "Choose a photo" button open the file picker.
  const pickerRef = useRef<HTMLInputElement | null>(null);

  return (
    <section id="share" className="scroll-mt-24">
      <div className="overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="grid lg:grid-cols-[1fr_1.15fr]">
          {/* Left: why we ask */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800/80 to-indigo-950/60 p-8 text-white sm:p-10 border-r border-slate-700/40">
            {/* Decorative blobs */}
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-2xl"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Open to everyone
              </span>

              <h2 className="mt-5 text-2xl font-extrabold leading-tight sm:text-3xl">
                <span className="text-white">Tell us</span>{' '}
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  what you think
                </span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Found an internship through MANTECH? Hired someone from here? Just had an
                experience worth sharing? We want to hear it.
              </p>

              <ul className="mt-7 space-y-3.5 text-sm">
                {[
                  'You do not need an account to send this.',
                  'Only the photo is optional — everything else helps us tell your story.',
                  'We read every message before it appears on this page.',
                  'Your email is only used to reply. It is never published.',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                      aria-hidden="true"
                    />
                    <span className="text-slate-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: the form */}
          <div className="p-8 sm:p-10">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900/50 border border-emerald-500/30">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-white">Thank you</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  Your experience has been sent to us. We read every message, and it will
                  appear on this page once we have checked it.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-slate-600 bg-slate-800/60 text-slate-200 hover:bg-slate-700/60 hover:text-white"
                  onClick={() => setSent(false)}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                {/* ── About you ────────────────────────────────────── */}
                <fieldset className="space-y-4">
                  <legend className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    About you
                  </legend>

                  {/* Name + Email side by side */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="t-name" className={LABEL}>
                        Full name <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="t-name"
                        value={draft.name}
                        onChange={(e) => setField('name', e.target.value)}
                        maxLength={TESTIMONIAL_LIMITS.name}
                        placeholder="e.g. Delphine Ateba"
                        className={fieldClass('name', badField)}
                      />
                    </div>

                    <div>
                      <label htmlFor="t-email" className={LABEL}>
                        Email address <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="t-email"
                        type="email"
                        value={draft.email}
                        onChange={(e) => setField('email', e.target.value)}
                        maxLength={TESTIMONIAL_LIMITS.email}
                        placeholder="you@example.com"
                        className={fieldClass('email', badField)}
                      />
                      <p className="mt-1 text-[11px] text-slate-500">
                        Only used to reply to you. Never published.
                      </p>
                    </div>
                  </div>

                  {/* Role + Company side by side */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ChooseOrType
                      id="role"
                      label="You are a…"
                      options={TESTIMONIAL_ROLES}
                      value={draft.role}
                      onChange={(v) => setField('role', v)}
                      placeholder="Pick your role"
                      maxLength={TESTIMONIAL_LIMITS.role}
                      bad={badField === 'role'}
                    />

                    {/* There are far more schools and companies than we could
                        ever list, so this one is typed. */}
                    <div>
                      <label htmlFor="t-company" className={LABEL}>
                        Company or school <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="t-company"
                        value={draft.company}
                        onChange={(e) => setField('company', e.target.value)}
                        maxLength={TESTIMONIAL_LIMITS.company}
                        placeholder="e.g. Yango Cameroun"
                        className={fieldClass('company', badField)}
                      />
                    </div>
                  </div>

                  {/* Region full-width */}
                  <div>
                    <label htmlFor="t-region" className={LABEL}>
                      Region <span className="text-red-400">*</span>
                    </label>
                    <Select value={draft.region} onValueChange={(v) => setField('region', v)}>
                      <SelectTrigger
                        id="t-region"
                        className={`h-11 bg-slate-800/60 border-slate-700 text-white focus:border-amber-400 focus:ring-amber-400/20 ${badField === 'region' ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                      >
                        <SelectValue placeholder="Where are you based?" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {TESTIMONIAL_REGIONS.map((region) => (
                          <SelectItem key={region} value={region} className="focus:bg-slate-800 focus:text-white">
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </fieldset>

                {/* ── Your experience ────────────────────────────────── */}
                <fieldset className="space-y-4 border-t border-slate-700/50 pt-5">
                  <legend className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    Your experience
                  </legend>

                  <ChooseOrType
                    id="focus"
                    label="What did you use MANTECH for?"
                    options={TESTIMONIAL_FOCUSES}
                    value={draft.focus}
                    onChange={(v) => setField('focus', v)}
                    placeholder="Pick the closest one"
                    maxLength={TESTIMONIAL_LIMITS.focus}
                    bad={badField === 'focus'}
                  />

                  {/* Star rating selector */}
                  <div>
                    <span className={LABEL}>
                      Overall rating <span className="text-red-400">*</span>
                    </span>
                    <div className="mt-1.5 flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRating(n)}
                          aria-label={`${n} star${n === 1 ? '' : 's'}`}
                          aria-pressed={rating === n}
                          className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                          <Star
                            className={`h-7 w-7 transition-colors ${
                              n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Short quote - full width */}
                  <div>
                    <label htmlFor="t-message" className={LABEL}>
                      Short quote <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      id="t-message"
                      value={draft.message}
                      onChange={(e) => setField('message', e.target.value)}
                      rows={3}
                      maxLength={TESTIMONIAL_LIMITS.message}
                      placeholder="The one or two sentences we would show on your card."
                      className={fieldClass('message', badField)}
                    />
                    <p className="mt-1 text-right text-[11px] text-slate-500">
                      {draft.message.length}/{TESTIMONIAL_LIMITS.message}
                    </p>
                  </div>

                  {/* Full story - full width */}
                  <div>
                    <label htmlFor="t-details" className={LABEL}>
                      Tell us the full story <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      id="t-details"
                      value={draft.details}
                      onChange={(e) => setField('details', e.target.value)}
                      rows={6}
                      maxLength={TESTIMONIAL_LIMITS.details}
                      placeholder="What changed for you? How did it work out? Anything we should fix?"
                      className={fieldClass('details', badField)}
                    />
                    <p className="mt-1 text-right text-[11px] text-slate-500">
                      {draft.details.length}/{TESTIMONIAL_LIMITS.details}
                    </p>
                  </div>
                </fieldset>

                {/* ── The one optional field ─────────────────────────── */}
                <fieldset className="space-y-4 border-t border-slate-700/50 pt-5">
                  <legend className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Optional
                  </legend>

                  <div>
                    <span className={LABEL}>
                      Photo <span className={OPTIONAL}>(optional)</span>
                    </span>
                    <p className="-mt-0.5 mb-2 text-[11px] text-slate-500">
                      A photo helps people recognise you, but it is never required.
                    </p>
                  </div>

                  <input
                    ref={pickerRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onPhoto(file);
                      // Reset so choosing the same photo twice still fires.
                      e.target.value = '';
                    }}
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => pickerRef.current?.click()}
                      disabled={photoBusy}
                      className="flex items-center gap-2 rounded-xl border border-dashed border-slate-600 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-amber-500/50 hover:bg-slate-800/70 hover:text-amber-300 disabled:opacity-60"
                    >
                      {photoBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <ImagePlus className="h-4 w-4" aria-hidden="true" />
                      )}
                      {photoBusy ? 'Adding photo…' : 'Choose a photo'}
                    </button>
                    {photoUrl && (
                      <span className="flex items-center gap-2 text-xs text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Photo added
                      </span>
                    )}
                  </div>
                </fieldset>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-500/30 bg-red-900/30 p-3 text-sm text-red-300"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white shadow-lg shadow-amber-900/30 transition-all hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-900/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
                      Send Story
                    </>
                  )}
                </button>

                {/* The button stays clickable, so a half-filled form explains
                    itself instead of leaving the visitor guessing. */}
                {!canSend(draft) && !sending && (
                  <p className="text-center text-[11px] text-slate-500">
                    Please complete every field above. Only the photo is optional.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


/**
 * The submitted experiences. Everything on this page comes from real messages
 * that people sent us — there is no sample content.
 */
function Grid({ items, loading }: { items: Testimonial[]; loading: boolean }) {
  return (
    <section className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-white">
            What people have{' '}
            <span className="text-orange-500">said</span>
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Real messages from interns, universities and organizations using MANTECH.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur">
          <Users className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
          {items.length} shared {items.length === 1 ? 'experience' : 'experiences'}
        </span>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((n) => (
            <div
              key={n}
              className="h-52 animate-pulse rounded-2xl border border-slate-700/60 bg-slate-800/50"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-700/60 bg-slate-900/60 px-6 py-14 text-center backdrop-blur">
          <Quote className="mx-auto h-9 w-9 text-slate-600" aria-hidden="true" />
          <h3 className="mt-4 font-semibold text-white">No experiences shared yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">
            Be the first to share yours using the form above. It takes a moment, and you do
            not need an account.
          </p>
        </div>
      ) : (
        <MotionSection
          stagger={0.08}
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <MotionItem key={item.id} className="min-w-0">
              <figure
                className={`group relative flex h-full min-w-0 flex-col rounded-2xl border backdrop-blur-xl p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl ${
                  item.pending
                    ? 'border-amber-500/30 bg-amber-900/10 hover:border-amber-500/50'
                    : 'border-slate-700/60 bg-slate-900/80 hover:border-slate-600/60'
                }`}
              >
                <Quote
                  className={`absolute right-5 top-5 h-8 w-8 transition-colors ${
                    item.pending ? 'text-amber-500/20' : 'text-slate-700/60 group-hover:text-slate-600/60'
                  }`}
                  aria-hidden="true"
                />

                {item.pending ? (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-900/30 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                    Waiting for review
                  </span>
                ) : (
                  <Stars rating={item.rating} />
                )}

                <blockquote className="mt-4 flex-1 break-words whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-200">
                  {item.message}
                </blockquote>

                {/* The longer answer, folded away until the reader wants it. */}
                <details className="group/story mt-3">
                  <summary className="cursor-pointer list-none text-xs font-semibold text-amber-400 hover:text-amber-300">
                    Read the full story
                  </summary>
                  <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
                    {item.details}
                  </p>
                </details>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-indigo-500/30 bg-indigo-900/30 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                    {item.focus}
                  </span>
                  <span className="rounded-full border border-slate-700/50 bg-slate-800/50 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
                    {item.region}
                  </span>
                </div>

                <figcaption className="mt-4 flex items-center gap-3 border-t border-slate-700/40 pt-4">
                  {item.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photoUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-slate-700/60"
                    />
                  ) : (
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${tintFor(item.name)}`}
                      aria-hidden="true"
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                    <p className="truncate text-xs text-slate-400">
                      {item.role} · {item.company}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </MotionItem>
          ))}
        </MotionSection>
      )}
    </section>
  );
}
