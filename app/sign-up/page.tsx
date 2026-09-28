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
import { ShieldCheck, Mail, Lock, User, Building2, GraduationCap, ArrowRight } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [role, setRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [region, setRegion] = useState('Littoral');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all required registration fields.');
      return;
    }
    setLoading(true);
    setError(null);

    const res = await signUp(email, password, fullName, role);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push(`/dashboard/${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex justify-center mb-6">
          <Logo size={56} />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
          Join ManTech Nexus
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Create an enterprise account to manage, discover, or supervise IT internships
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Role selector tabs */}
          <div className="mb-6">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 block">
              Select Your Role / Account Type
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  role === 'student'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-5 h-5 mb-1.5 text-blue-600" />
                <span>Student / Intern</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('company')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  role === 'company'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-5 h-5 mb-1.5 text-amber-600" />
                <span>Company / Host</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('university')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  role === 'university'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-5 h-5 mb-1.5 text-emerald-600" />
                <span>University Dean</span>
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
                {role === 'company' ? 'Contact Representative Name' : 'Full Name'}
              </Label>
              <Input
                id="fullName"
                placeholder={role === 'company' ? 'Brenda Ngu (Talent Lead)' : 'David Kamga'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1"
              />
            </div>

            {role !== 'student' && (
              <div>
                <Label htmlFor="orgName" className="text-xs font-semibold text-slate-700">
                  {role === 'company' ? 'Company Name' : 'University / Higher Institute'}
                </Label>
                <Input
                  id="orgName"
                  placeholder={role === 'company' ? 'MTN Cameroon / ActiveSpaces' : 'University of Yaoundé I / ENSPY'}
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Official Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@enterprise.cm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="region" className="text-xs font-semibold text-slate-700">
                Cameroon Region / Headquarters
              </Label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="Littoral">Littoral (Douala, Edéa)</option>
                <option value="Centre">Centre (Yaoundé, Mbalmayo)</option>
                <option value="South-West">South-West (Buea, Limbe, Kumba)</option>
                <option value="West">West (Bafoussam, Dschang)</option>
                <option value="North-West">North-West (Bamenda)</option>
                <option value="Adamawa">Adamawa (Ngaoundéré)</option>
                <option value="North">North (Garoua)</option>
                <option value="Far North">Far North (Maroua)</option>
                <option value="South">South (Ebolowa, Kribi)</option>
                <option value="East">East (Bertoua)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 mt-2">
              {loading ? 'Creating Account...' : 'Complete Registration with Clerk'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict data isolation & verification standards</span>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already registered?{' '}
            <Link href="/sign-in" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
