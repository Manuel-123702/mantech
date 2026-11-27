'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  category: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export function NotificationsView({ userId }: { userId: string }) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/notifications?limit=100', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load notifications.');
      setItems(data.notifications || []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, userId]);

  const markAllRead = async () => {
    setBusy(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (!response.ok) throw new Error('Could not update notifications.');
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update notifications.');
    } finally {
      setBusy(false);
    }
  };

  const markRead = async (id: string) => {
    const response = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    });
    if (response.ok) {
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
      );
    }
  };

  const unreadCount = items.filter((item) => !item.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">Notifications</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            size="sm"
            disabled={busy}
            onClick={() => void markAllRead()}
            className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white font-semibold rounded-xl text-xs"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/50 p-3.5 text-xs sm:text-sm text-red-200">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" aria-label="Loading notifications" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 flex flex-col items-center py-16 px-4 text-center">
          <Bell className="mb-3 h-9 w-9 text-slate-500" />
          <h2 className="font-semibold text-white">You’re all caught up</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            New account and recruitment updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const card = (
              <div
                className={`rounded-2xl border p-4 transition-colors ${
                  item.isRead
                    ? 'border-slate-700/70 bg-slate-900/70 hover:bg-slate-800/70'
                    : 'border-blue-500/40 bg-blue-950/30 hover:bg-blue-950/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      item.isRead ? 'bg-slate-500' : 'bg-blue-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="font-semibold text-white text-sm sm:text-base break-words">
                        {item.title}
                      </h2>
                      <time className="text-[11px] text-slate-400 shrink-0" dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleString()}
                      </time>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-xs sm:text-sm text-slate-300 break-words leading-relaxed">
                      {item.message}
                    </p>
                    <span className="mt-2 inline-block text-[11px] font-medium capitalize text-blue-400">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            );

            return item.link ? (
              <Link
                key={item.id}
                href={item.link}
                onClick={() => {
                  if (!item.isRead) void markRead(item.id);
                }}
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {card}
              </Link>
            ) : (
              <div key={item.id}>
                {card}
                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => void markRead(item.id)}
                    className="sr-only"
                  >
                    Mark {item.title} as read
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
