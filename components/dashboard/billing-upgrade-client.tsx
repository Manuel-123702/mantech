'use client';
import { Trans, useLingui } from '@lingui/react/macro';


import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { PackageCode } from '@prisma/client';

export default function BillingUpgradeClient({
  packageCode,
  packageName,
  whatsappLink,
  currentCode,
  buttonChildren,
  disabled,
}: {
  packageCode: PackageCode;
  packageName: string;
  whatsappLink: string;
  currentCode: string;
  buttonChildren: React.ReactNode;
  disabled?: boolean;
}) {
  const { t } = useLingui();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState<{ url: string } | null>(null);

  async function requestUpgrade() {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageCode, notes }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Could not request upgrade');
      }
      const data = await res.json();
      setDone({ url: data.whatsappUrl || whatsappLink });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          variant={disabled ? 'outline' : 'default'}
          disabled={disabled}
        >
          {buttonChildren}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {done ? (
          <>
            <DialogHeader>
              <DialogTitle className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <Trans comment="billing-upgrade page DialogTitle visible text">Request created
              </Trans></DialogTitle>
              <DialogDescription>
                <Trans comment="billing-upgrade page DialogDescription visible text">Finish the activation by sending a quick message to MANTECH billing on WhatsApp.
              </Trans></DialogDescription>
            </DialogHeader>
            <div className="space-y-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
              <Badge variant="secondary" className="bg-white">
                <Trans comment="billing-upgrade page Badge visible text">Upgrade: </Trans>{packageName}
              </Badge>
              <p>
                <Trans comment="billing-upgrade page p visible text">MANTECH will manually review your request and activate your plan after receiving
                your payment confirmation.
              </Trans></p>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="ghost" onClick={() => { setOpen(false); setDone(null); setNotes(''); }}>
                <Trans comment="billing-upgrade page Button visible text">Close
              </Trans></Button>
              <Button asChild>
                <a href={done.url} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <Trans comment="billing-upgrade page a visible text">Open WhatsApp to finish
                  </Trans><ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle><Trans comment="billing-upgrade page DialogTitle visible text">Upgrade to </Trans>{packageName}</DialogTitle>
              <DialogDescription>
                <Trans comment="billing-upgrade page DialogDescription visible text">Submit your upgrade request. MANTECH will contact you via WhatsApp to confirm
                activation and payment details.
              </Trans></DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label><Trans comment="billing-upgrade page Label visible text">Notes for billing team (optional)</Trans></Label>
                <Textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t({ message: "Additional information, preferred activation date, PO reference, etc.", comment: "billing-upgrade page component placeholder attribute" })}
                />
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                <Trans comment="billing-upgrade page Button visible text">Cancel
              </Trans></Button>
              <Button onClick={requestUpgrade} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <Trans comment="billing-upgrade page component visible text">Requesting…
                  </Trans></>
                ) : (
                  <>
                    <Trans comment="billing-upgrade page component visible text">Submit upgrade request
                    </Trans><ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
