'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type AdminActionButtonProps = {
  endpoint: string;
  payload: Record<string, unknown>;
  label: string;
  method?: 'POST' | 'PATCH';
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
  disabled?: boolean;
  confirmText?: string;
  reasonLabel?: string;
  reasonField?: string;
  reasonPlaceholder?: string;
};

export function AdminActionButton({
  endpoint,
  payload,
  label,
  method = 'POST',
  variant = 'default',
  size = 'sm',
  className,
  disabled,
  confirmText,
  reasonLabel,
  reasonField = 'note',
  reasonPlaceholder,
}: AdminActionButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(withReason: boolean) {
    if (confirmText && !withReason && !window.confirm(confirmText)) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withReason ? { ...payload, [reasonField]: reason } : payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error || 'Action failed');
        return;
      }
      setOpen(false);
      setReason('');
      router.refresh();
    } catch {
      setError('Action failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={variant}
          size={size}
          className={className}
          disabled={disabled || pending}
          onClick={() => (reasonLabel ? setOpen((value) => !value) : run(false))}
        >
          {pending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          {label}
        </Button>
        {open && (
          <>
            <Button
              type="button"
              variant="destructive"
              size={size}
              disabled={pending || !reason.trim()}
              onClick={() => run(true)}
            >
              Confirm
            </Button>
            <Button
              type="button"
              variant="ghost"
              size={size}
              disabled={pending}
              onClick={() => {
                setOpen(false);
                setReason('');
                setError(null);
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
      {open && reasonLabel && (
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={reasonPlaceholder || reasonLabel}
          rows={2}
          className="w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      )}
      {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}

export function AdminRoleForm({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const roles = ['INTERN', 'COMPANY', 'UNIVERSITY'];
  const [role, setRole] = useState(currentRole);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function apply() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error || 'Role update failed');
        return;
      }
      router.refresh();
    } catch {
      setError('Role update failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
        >
          {roles.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Button type="button" size="sm" variant="outline" disabled={pending || role === currentRole} onClick={apply}>
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Update role'}
        </Button>
      </div>
      {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}
