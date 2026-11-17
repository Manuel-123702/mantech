'use client';

import React, { useState } from 'react';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Send,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface UrgentAcademicMatchCardProps {
  currentAvailability?: string | null;
}

export function UrgentAcademicMatchCard({ currentAvailability }: UrgentAcademicMatchCardProps) {
  const isUrgentActive = Boolean(currentAvailability && currentAvailability.includes('URGENT_ACADEMIC_DEADLINE:'));
  const existingDeadline = (isUrgentActive && currentAvailability)
    ? currentAvailability.replace('URGENT_ACADEMIC_DEADLINE:', '').trim()
    : null;

  const [isOpen, setIsOpen] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [university, setUniversity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeDeadline, setActiveDeadline] = useState<string | null>(existingDeadline);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadlineDate) {
      toast.error('Please specify your academic internship deadline date');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/interns/urgent-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deadlineDate,
          institutionName: university,
        }),
      });

      if (!res.ok) throw new Error('Could not register deadline');

      const data = await res.json();
      setActiveDeadline(`${deadlineDate} ${university ? `· ${university}` : ''}`);
      setIsOpen(false);
      toast.success('🎓 Priority Academic Dispatch Activated! Profile forwarded to recruiters.');
    } catch (err) {
      toast.error('Error activating priority academic match');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 text-white rounded-3xl overflow-hidden shadow-xl">
      <CardHeader className="pb-3 border-b border-amber-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-white">
                Stage Académique Express · Strict University Deadline?
              </CardTitle>
              <p className="text-xs text-slate-400">
                Priority matching for students with mandatory faculty internship completion deadlines.
              </p>
            </div>
          </div>

          {activeDeadline ? (
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Priority Active: {activeDeadline}
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs"
            >
              Set Academic Deadline
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 text-xs text-slate-300 space-y-3">
        {activeDeadline ? (
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-white text-sm">
                Priority Academic Matching Engine Active
              </p>
              <p className="text-slate-300">
                Your profile is flagged for immediate review by active HR teams in Douala, Yaoundé, and Buea. We prioritize your application for placement before your academic deadline.
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="text-amber-400 p-0 h-auto font-semibold hover:underline"
              >
                Change or update deadline date
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">
            Does your academic program (UY1, UY2, Univ Douala, UBa, ENSPY, IUT) require you to submit an internship certificate or defense before a specific date? Register your deadline to receive expedited employer matching.
          </p>
        )}

        {isOpen && (
          <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-slate-800 space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Required Internship Deadline (Date limite obligatoire) *
                </label>
                <Input
                  type="date"
                  required
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white text-xs h-9"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  University / Faculty (e.g. UY1, ENSPY, Douala)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Université de Yaoundé I"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white text-xs h-9"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-xs"
              >
                {submitting ? 'Registering...' : 'Dispatch Priority Academic Match'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
