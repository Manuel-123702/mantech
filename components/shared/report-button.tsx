'use client';

/**
 * ReportButton — "Report this content" dialog for opportunities and intern
 * passports. Files a moderation report through POST /api/moderation-reports;
 * national admins review the queue at /dashboard/admin/reports. Design follows
 * the existing dialog patterns (shadcn Dialog + Select), no layout changes.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Flag, Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  REPORT_REASONS,
  REPORT_REASON_HINTS,
  REPORT_REASON_LABELS,
  reportNeedsDetails,
  type ReportReason,
  type ReportTargetType,
} from '@/lib/report-reasons';

type ReportButtonProps = {
  targetType: ReportTargetType;
  targetId: string;
  /** Optional label override — defaults to "Report". */
  label?: string;
  className?: string;
};

export function ReportButton({ targetType, targetId, label = 'Report', className }: ReportButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [details, setDetails] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!reason) {
      setError('Please choose a reason.');
      return;
    }
    if (reportNeedsDetails(reason, details)) {
      setError('Please describe the issue.');
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/moderation-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, reason, details }),
      });
      if (response.status === 401) {
        router.push('/sign-in?redirect_url=' + encodeURIComponent(window.location.pathname));
        return;
      }
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 409) {
          // Already reported — treat as a calm success, not an error.
          setOpen(false);
          toast.info('You already reported this content — our team is on it.');
          return;
        }
        setError(data?.error || 'Could not send the report.');
        return;
      }
      setOpen(false);
      toast.success('Report sent. Thank you for helping keep MANTECH Nexus safe.');
    } catch {
      setError('Network issue — please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={className || 'text-slate-500 hover:text-red-600'}
        >
          <Flag className="mr-1.5 h-3.5 w-3.5" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            Report this content
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Our national admins review every report. False reports may lead to restrictions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Reason</label>
            <Select
              value={reason}
              onValueChange={(value) => {
                setReason(value as ReportReason);
                setError(null);
              }}
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Choose a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {REPORT_REASON_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {reason && <p className="text-[11px] text-slate-500">{REPORT_REASON_HINTS[reason]}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Details <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <Textarea
              value={details}
              onChange={(event) => {
                setDetails(event.target.value);
                setError(null);
              }}
              placeholder="Anything admins should know…"
              className="min-h-[90px] resize-none text-sm"
              maxLength={1000}
            />
          </div>

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={submit}
            disabled={pending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {pending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            Send report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}