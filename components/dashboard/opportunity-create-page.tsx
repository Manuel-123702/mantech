'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTaxonomy } from '@/lib/use-taxonomy';

export default function OpportunityCreatePage({ backHref }: { backHref: string }) {
  const router = useRouter();
  const { fields, regions, error: taxonomyError } = useTaxonomy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    fieldId: '',
    specializationId: '',
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    educationLevel: '',
    regionId: '',
    city: '',
    location: '',
    workMode: 'ONSITE',
    durationMonths: 3,
    startDate: '',
    endDate: '',
    deadline: '',
    isPaid: false,
    allowanceXAF: 0,
    positions: 1,
    applicationMethod: 'MANTECH',
    applicationUrl: '',
    externalPlatform: '',
    instructions: '',
    contactEmail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create opportunity');
      }

      router.push(backHref);
    } catch (err: any) {
      setError(err.message || 'Failed to create opportunity');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdd = (skill: string, type: 'required' | 'preferred') => {
    if (skill && !formData[type === 'required' ? 'requiredSkills' : 'preferredSkills'].includes(skill)) {
      setFormData(prev => ({
        ...prev,
        [type === 'required' ? 'requiredSkills' : 'preferredSkills']: 
          [...prev[type === 'required' ? 'requiredSkills' : 'preferredSkills'], skill]
      }));
    }
  };

  const handleSkillRemove = (skill: string, type: 'required' | 'preferred') => {
    setFormData(prev => ({
      ...prev,
      [type === 'required' ? 'requiredSkills' : 'preferredSkills']: 
        prev[type === 'required' ? 'requiredSkills' : 'preferredSkills'].filter(s => s !== skill)
    }));
  };

  return (
    <div className="container-mantech px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={backHref}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Create Internship Opportunity</h1>
          <p className="text-slate-600 mt-2">
            Post a new internship opportunity to attract qualified candidates
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {taxonomyError && <p role="alert" className="text-sm text-red-700">{taxonomyError}</p>}
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div>
                  <Label htmlFor="title">Opportunity Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Full-Stack Software Engineer Intern"
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g. Engineering, Marketing, Finance"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
                    rows={6}
                  />
                </div>
              </div>

              {/* Field & Specialization */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Field & Specialization</h3>
                
                <div>
                  <Label htmlFor="fieldId">Professional Field *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, fieldId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select professional field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select
                    value={formData.specializationId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, specializationId: value }))}
                    disabled={!formData.fieldId}
                  >
                    <SelectTrigger id="specializationId">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.find((field) => field.id === formData.fieldId)?.specializations.map((specialization) => (
                        <SelectItem key={specialization.id} value={specialization.id}>
                          {specialization.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                
                <div>
                  <Label>Required Skills *</Label>
                  <p className="text-xs text-slate-500 mb-2">Press Enter to add a skill</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skill, 'required')}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Type a required skill and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSkillAdd(e.currentTarget.value, 'required');
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                <div>
                  <Label>Preferred Skills</Label>
                  <p className="text-xs text-slate-500 mb-2">Press Enter to add a skill</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.preferredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skill, 'preferred')}
                          className="hover:text-emerald-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Type a preferred skill and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSkillAdd(e.currentTarget.value, 'preferred');
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              {/* Location & Work Mode */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location & Work Mode</h3>
                
                <div>
                  <Label htmlFor="regionId">Region *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, regionId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">City/Town *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g. Douala, Yaoundé, Buea"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Specific Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Akwa, Bonanjo, Bali"
                  />
                </div>

                <div>
                  <Label htmlFor="workMode">Work Mode *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, workMode: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONSITE">On-site</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                      <SelectItem value="REMOTE">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration & Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Duration & Dates</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="durationMonths">Duration (Months) *</Label>
                    <Input
                      id="durationMonths"
                      type="number"
                      value={formData.durationMonths}
                      onChange={(e) => setFormData(prev => ({ ...prev, durationMonths: Number(e.target.value) }))}
                      min="1"
                      max="24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="positions">Number of Positions *</Label>
                    <Input
                      id="positions"
                      type="number"
                      value={formData.positions}
                      onChange={(e) => setFormData(prev => ({ ...prev, positions: Number(e.target.value) }))}
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">Application Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>

              {/* Compensation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compensation</h3>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPaid"
                    checked={formData.isPaid}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPaid: checked as boolean }))}
                  />
                  <Label htmlFor="isPaid" className="text-sm">
                    This is a paid internship
                  </Label>
                </div>

                {formData.isPaid && (
                  <div>
                    <Label htmlFor="allowanceXAF">Monthly Allowance (XAF) *</Label>
                    <Input
                      id="allowanceXAF"
                      type="number"
                      value={formData.allowanceXAF}
                      onChange={(e) => setFormData(prev => ({ ...prev, allowanceXAF: Number(e.target.value) }))}
                      placeholder="e.g. 75000"
                    />
                  </div>
                )}
              </div>

              {/* Application Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Application Method</h3>
                
                <div>
                  <Label htmlFor="applicationMethod">Application Method *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, applicationMethod: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select application method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANTECH">Apply on MANTECH</SelectItem>
                      <SelectItem value="COMPANY_WEBSITE">Apply on Company Website</SelectItem>
                      <SelectItem value="EXTERNAL">Apply Externally</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.applicationMethod === 'COMPANY_WEBSITE' || formData.applicationMethod === 'EXTERNAL') && (
                  <div>
                    <Label htmlFor="applicationUrl">Application URL *</Label>
                    <Input
                      id="applicationUrl"
                      value={formData.applicationUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, applicationUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {formData.applicationMethod === 'EXTERNAL' && (
                  <div>
                    <Label htmlFor="externalPlatform">Platform Name</Label>
                    <Input
                      id="externalPlatform"
                      value={formData.externalPlatform}
                      onChange={(e) => setFormData(prev => ({ ...prev, externalPlatform: e.target.value }))}
                      placeholder="e.g. LinkedIn, University Portal"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="instructions">Application Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Any specific instructions for applicants..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="recruitment@company.cm"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Link href={backHref}>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Opportunity'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
