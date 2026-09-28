'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function DashboardRootPage() {
  const router = useRouter();
  const { role } = useAuth();

  useEffect(() => {
    router.replace(`/dashboard/${role}`);
  }, [role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-600">Redirecting to your authorized dashboard...</p>
      </div>
    </div>
  );
}
