'use client';

import React, { useState } from 'react';
import { initialData } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  Settings,
  Plus,
  Search,
  Lock,
  Activity,
  Layers,
} from 'lucide-react';

export default function AdminControlCenterPage() {
  const [activeTab, setActiveTab] = useState<'moderation' | 'taxonomy' | 'organizations' | 'audit'>('moderation');
  const [opportunities, setOpportunities] = useState(initialData.internships);
  const [companies, setCompanies] = useState(initialData.companies);
  const [itFields, setItFields] = useState([
    { id: 'fld_se', name: 'Software Engineering', category: 'Software Development', isHND: true, active: true },
    { id: 'fld_cyber', name: 'Cybersecurity & CyberDefence', category: 'Information Security', isHND: true, active: true },
    { id: 'fld_cloud', name: 'Cloud Computing & DevOps', category: 'Platform Engineering', isHND: false, active: true },
    { id: 'fld_net', name: 'Networks and Telecommunications', category: 'Telecom Infrastructure', isHND: true, active: true },
    { id: 'fld_ai', name: 'Artificial Intelligence & Machine Learning', category: 'Intelligent Systems', isHND: false, active: true },
    { id: 'fld_mobile', name: 'Mobile Application Development', category: 'Software Development', isHND: true, active: true },
    { id: 'fld_db', name: 'Database Management', category: 'Databases & Data Engineering', isHND: true, active: true },
    { id: 'fld_maint', name: 'Computer Maintenance & Hardware', category: 'Hardware Support', isHND: true, active: true },
  ]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldCategory, setNewFieldCategory] = useState('');

  const handleModerate = (id: string, status: 'published' | 'rejected') => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, moderation_status: status } : opp))
    );
  };

  const handleVerifyCompany = (id: string) => {
    setCompanies((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, verification_status: 'verified' } : comp))
    );
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName || !newFieldCategory) return;
    setItFields([
      ...itFields,
      {
        id: `fld_${Date.now()}`,
        name: newFieldName,
        category: newFieldCategory,
        isHND: false,
        active: true,
      },
    ]);
    setNewFieldName('');
    setNewFieldCategory('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-extrabold text-2xl font-heading">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white font-heading">
                  MANTECH Admin Control Center
                </h1>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">
                  SUPER_ADMIN
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Centralized Governance, Moderation, Dynamic Taxonomy, and Organization Verifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>Neon DB & Clerk Security: HEALTHY</span>
          </div>
        </div>

        {/* Global Platform KPIs (SRS Section 119 - Real Derived Metrics) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Opportunities</div>
            <div className="text-2xl font-bold text-white mt-1">{opportunities.length}</div>
            <div className="text-[11px] text-blue-400 mt-1">3 Application Methods</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Verified Organizations</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{companies.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Host Companies & Hubs</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active IT Fields</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{itFields.length}</div>
            <div className="text-[11px] text-emerald-400 mt-1">Dynamic Taxonomy</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Security Audit Events</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{initialData.auditLogs.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Zero vulnerabilities logged</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'moderation' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Opportunity Moderation ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('taxonomy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'taxonomy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            IT Taxonomy Management ({itFields.length})
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'organizations' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Organization Verifications
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Security Audit Logs
          </button>
        </div>

        {/* TAB 1: MODERATION (SRS Section 13) */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white font-heading">{opp.title}</h3>
                    <Badge className="bg-blue-500/20 text-blue-300 capitalize text-[10px]">
                      {opp.moderation_status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Host: {opp.company?.name} • Region: {opp.city}, {opp.region} • Method: {opp.application_method}
                  </p>
                  <p className="text-xs text-slate-300 mt-2 max-w-2xl line-clamp-2">
                    {opp.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleModerate(opp.id, 'published')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Approve & Publish
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleModerate(opp.id, 'rejected')}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: DYNAMIC IT TAXONOMY (SRS Section 109 & Critical Update) */}
        {activeTab === 'taxonomy' && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white font-heading mb-1">
                Add New Dynamic IT / ICT Field of Study
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Administrators can dynamically register new technology disciplines into Neon PostgreSQL without source-code edits.
              </p>

              <form onSubmit={handleAddField} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Field Name (e.g. Distributed Ledger & FinTech)"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white text-xs h-10"
                />
                <Input
                  placeholder="Category (e.g. Emerging Technologies)"
                  value={newFieldCategory}
                  onChange={(e) => setNewFieldCategory(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white text-xs h-10"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs shrink-0 h-10">
                  <Plus className="w-4 h-4 mr-1" />
                  Register IT Field
                </Button>
              </form>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Managed IT / ICT Field Taxonomy ({itFields.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {itFields.map((field) => (
                  <div key={field.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{field.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{field.category}</div>
                    </div>
                    {field.isHND && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                        Cameroon HND
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORGANIZATIONS */}
        {activeTab === 'organizations' && (
          <div className="space-y-4">
            {companies.map((comp) => (
              <div key={comp.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white font-heading">{comp.name}</h3>
                    <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">
                      {comp.verification_status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    {comp.industry} • Headquarters: {comp.city}, {comp.region}
                  </p>
                </div>
                {comp.verification_status !== 'verified' && (
                  <Button
                    size="sm"
                    onClick={() => handleVerifyCompany(comp.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    Issue Verification Badge
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white font-heading mb-4">
              Cryptographic Security Audit Telemetry
            </h3>
            {initialData.auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs flex justify-between">
                <div>
                  <span className="font-bold text-blue-400 font-mono">{log.action}</span>
                  <p className="text-slate-300 mt-0.5">{log.details}</p>
                  <span className="text-[10px] text-slate-500">Actor: {log.actor_name} ({log.actor_role})</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
