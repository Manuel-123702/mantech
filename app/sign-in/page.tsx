'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/types';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your corporate or student email address.');
      return;
    }
    setLoading(true);
    setError(null);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push('/dashboard');
    }
  };

  const handleQuickRoleAccess = (role: UserRole) => {
    switchRole(role);
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex justify-center mb-6">
          <Logo size={56} />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
          Enterprise Portal Sign In
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Secure, authenticated access to Cameroon&apos;s National IT Internship Ecosystem
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200 flex items-center gap-2">
              <span className="font-semibold">Notice:</span> {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email Address
              </Label>
              <div className="mt-1.5 relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.cm or name@company.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </Label>
                <a href="#forgot" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1.5 relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5">
              {loading ? 'Authenticating...' : 'Sign In with Clerk'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Quick Persona Demo Switcher for Evaluation */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Instant Persona Preview (5 Dashboards)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRoleAccess('student')}
                className="p-2 text-left rounded-lg bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 border border-blue-200/50 transition-colors"
              >
                <div className="font-bold">Student</div>
                <div className="text-[10px] text-blue-600">David Kamga (UY1)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleAccess('company')}
                className="p-2 text-left rounded-lg bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 border border-amber-200/50 transition-colors"
              >
                <div className="font-bold">Company</div>
                <div className="text-[10px] text-amber-700">MTN Cameroon HR</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleAccess('university')}
                className="p-2 text-left rounded-lg bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 border border-emerald-200/50 transition-colors"
              >
                <div className="font-bold">University</div>
                <div className="text-[10px] text-emerald-700">ENSPY Faculty</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleAccess('supervisor')}
                className="p-2 text-left rounded-lg bg-purple-50/70 hover:bg-purple-100/70 text-purple-900 border border-purple-200/50 transition-colors"
              >
                <div className="font-bold">Supervisor</div>
                <div className="text-[10px] text-purple-700">Eng. Martin Fon</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleAccess('admin')}
                className="col-span-2 p-2 text-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold border border-slate-300/60 transition-colors"
              >
                Admin Control Center (Moderation & Analytics)
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with Clerk & Neon PostgreSQL</span>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account yet?{' '}
            <Link href="/sign-up" className="font-semibold text-blue-600 hover:text-blue-700">
              Register Organization or Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
