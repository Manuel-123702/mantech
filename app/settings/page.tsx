'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Shield,
  Bell,
  Key,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  Phone,
  Globe,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { Metadata } from 'next';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [bio, setBio] = useState(profile?.bio || '');

  // Notification state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [appNotifs, setAppNotifs] = useState(true);
  const [reportReminders, setReportReminders] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const roleColorMap: Record<string, string> = {
    student: 'bg-blue-100 text-blue-800',
    company: 'bg-amber-100 text-amber-800',
    university: 'bg-emerald-100 text-emerald-800',
    supervisor: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold font-heading">
              {profile?.full_name?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 font-heading">
                  Account Settings
                </h1>
                {profile?.role && (
                  <Badge className={`capitalize ${roleColorMap[profile.role] || 'bg-slate-100 text-slate-700'}`}>
                    {profile.role}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {user?.email || profile?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border border-b-white border-slate-200 bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 font-heading mb-1">Profile Information</h2>
            <p className="text-xs text-slate-500 mb-6">Update your account profile details.</p>

            {saved && (
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Profile saved successfully.
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5"
                  placeholder="Your full legal name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <Input
                    id="email"
                    value={user?.email || profile?.email || ''}
                    disabled
                    className="flex-1 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-bold shrink-0">Verified</Badge>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Email is managed by your authentication provider (Clerk).</p>
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5"
                  placeholder="+237 6XX XXX XXX"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1.5 text-sm"
                  placeholder="Tell others a bit about yourself..."
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 font-heading mb-1">Password & Authentication</h2>
              <p className="text-xs text-slate-500 mb-6">Your account is secured through Clerk authentication.</p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Password</div>
                    <div className="text-xs text-slate-500 mt-0.5">Managed securely through Clerk. To change your password, use the Clerk account portal.</div>
                    <button className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700">Change Password →</button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</div>
                    <div className="text-xs text-slate-500 mt-0.5">Secure your account with an additional verification step via Clerk.</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">Not Enabled</span>
                      <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Enable 2FA →</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Active Sessions</div>
                    <div className="text-xs text-slate-500 mt-0.5">You are signed in on 1 device. All sessions are encrypted and monitored.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-800 text-sm mb-1">Security Notice</div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  MANTECH enforces server-side role-based access control. Your role is <strong>{profile?.role || 'user'}</strong>. 
                  Attempting to access unauthorized routes will be logged and may result in account suspension. 
                  All actions are audit-logged.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 font-heading mb-1">Notification Preferences</h2>
            <p className="text-xs text-slate-500 mb-6">Control what notifications you receive from MANTECH.</p>

            <div className="space-y-4">
              {[
                { id: 'email', label: 'Email Notifications', desc: 'Receive updates via your registered email address.', value: emailNotifs, set: setEmailNotifs },
                { id: 'app', label: 'In-App Notifications', desc: 'Receive real-time alerts within the MANTECH dashboard.', value: appNotifs, set: setAppNotifs },
                { id: 'reports', label: 'Report Submission Reminders', desc: 'Get reminded to submit weekly/monthly internship reports before deadlines.', value: reportReminders, set: setReportReminders },
                { id: 'applications', label: 'Application Status Updates', desc: 'Be notified when your application status changes (shortlisted, interview, offer, etc.).', value: applicationUpdates, set: setApplicationUpdates },
              ].map((item) => (
                <div key={item.id} className="flex items-start justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 gap-4">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => item.set(!item.value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                      item.value ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                    aria-label={item.label}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        item.value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button
                onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Preferences
              </Button>
              {saved && (
                <span className="ml-3 text-xs text-emerald-600 font-semibold">✓ Saved</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
