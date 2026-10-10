'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

  useEffect(() => { void load(); }, [load, userId]);

  const markAllRead = async () => {
    setBusy(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (!response.ok) throw new Error('Could not update notifications.');
      setItems(current => current.map(item => ({ ...item, isRead: true })));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update notifications.');
    } finally { setBusy(false); }
  };

  const markRead = async (id: string) => {
    const response = await fetch('/api/notifications', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    });
    if (response.ok) setItems(current => current.map(item => item.id === id ? { ...item, isRead: true } : item));
  };

  const unreadCount = items.filter(item => !item.isRead).length;
  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-600">{unreadCount} unread update{unreadCount === 1 ? '' : 's'}</p>
        </div>
        {unreadCount > 0 && <Button variant="outline" size="sm" disabled={busy} onClick={() => void markAllRead()}><CheckCheck className="mr-2 h-4 w-4" />Mark all read</Button>}
      </div>
      {error && <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-blue-700" aria-label="Loading notifications" /></div>
        : items.length === 0 ? <Card><CardContent className="flex flex-col items-center py-16 text-center"><Bell className="mb-3 h-9 w-9 text-slate-300" /><h2 className="font-semibold text-slate-900">You’re all caught up</h2><p className="mt-1 text-sm text-slate-600">New account and recruitment updates will appear here.</p></CardContent></Card>
          : <div className="space-y-3">{items.map(item => {
            const content = <Card className={item.isRead ? 'border-slate-200' : 'border-blue-200 bg-blue-50/40'}><CardContent className="flex items-start gap-3 p-4"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.isRead ? 'bg-slate-300' : 'bg-blue-600'}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold text-slate-900">{item.title}</h2><time className="text-xs text-slate-500" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time></div><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{item.message}</p><span className="mt-2 inline-block text-xs capitalize text-slate-500">{item.category}</span></div></CardContent></Card>;
            return item.link ? <Link key={item.id} href={item.link} onClick={() => { if (!item.isRead) void markRead(item.id); }} className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">{content}</Link> : <div key={item.id}>{content}{!item.isRead && <button type="button" onClick={() => void markRead(item.id)} className="sr-only">Mark {item.title} as read</button>}</div>;
          })}</div>}
    </main>
  );
}
