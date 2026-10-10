'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTaxonomy } from '@/lib/use-taxonomy';
import { useScrollToTopOnChange } from '@/lib/use-scroll-to-top';

export default function InternRegistrationPage() {
  const router = useRouter();
  const { user } = useUser();
  const { fields, regions, error: taxonomyError } = useTaxonomy();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: user?.firstName + ' ' + user?.lastName || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: '',

    // Education
    qualification: '',
    academicLevel: '',
    institution: '',
    fieldOfStudy: '',
    specialization: '',
    educationStartYear: '',
    educationEndYear: '',
    isCurrentEducation: false,

    // Location & Preferences
    region: '',
    city: '',
    preferredWorkMode: 'ONSITE',
    availability: '',

    // Skills
    skills: [] as string[],

    // Profile
    headline: '',
    summary: '',

    // Privacy
    isPhonePublic: false,
    isCvSearchable: true,
  });

  const totalSteps = 4;

  // Moving to the next question brings the visitor back to the top, so the new
  // question is never left hidden above the screen.
  useScrollToTopOnChange(step);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  // Cameroon numbers are commonly typed locally ("671 234 567"), so only
  // require a sensible digit count here; the API normalizes to +237.
  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.fullName && !!formData.email && !!formData.phone && isValidPhone(formData.phone);
      case 2:
        return !!formData.qualification && !!formData.academicLevel && !!formData.fieldOfStudy;
      case 3:
        return !!formData.region && !!formData.city && formData.skills.length > 0;
      case 4:
        return cvFile !== null && photoFile !== null;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      if (step === 1 && formData.phone && !isValidPhone(formData.phone)) {
        setError('Please enter a valid phone number (e.g. +237 671 234 567 or 671 234 567)');
      } else {
        setError('Please fill in all required fields');
      }
      return;
    }
    setError(null);
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      setError('Please upload your CV and professional photo to complete registration');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload CV
      const cvFormData = new FormData();
      if (cvFile) {
        cvFormData.append('file', cvFile);
      }
      cvFormData.append('type', 'cv');

      const cvResponse = await fetch('/api/upload', {
        method: 'POST',
        body: cvFormData,
      });

      if (!cvResponse.ok) {
        throw new Error('Failed to upload CV');
      }

      const cvData = await cvResponse.json();

      const photoFormData = new FormData();
      if (!photoFile) {
        throw new Error('A professional photo is required.');
      }
      photoFormData.append('file', photoFile);
      photoFormData.append('type', 'photo');

      const photoResponse = await fetch('/api/upload', {
        method: 'POST',
        body: photoFormData,
      });
      if (!photoResponse.ok) {
        const photoError = await photoResponse.json().catch(() => ({}));
        throw new Error(photoError.error || 'Failed to upload professional photo.');
      }
      const photoData = await photoResponse.json();
      const photoUrl = photoData.url;

      // Create intern profile
      const response = await fetch('/api/interns/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cvUrl: cvData.url,
          cvFileKey: cvData.fileKey,
          cvFileName: cvData.fileName,
          cvFileSize: cvData.fileSize,
          photoUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      // Update Clerk metadata
      await user?.update({
        unsafeMetadata: {
          role: 'INTERN',
          hasCompletedRegistration: true,
        },
      });

      router.push('/dashboard/intern');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Logo size={110} />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Complete Your Intern Profile</h1>
          <p className="text-slate-600 mt-2">
            Create your professional Intern Passport to discover opportunities across Cameroon
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${step >= stepNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                  }`}
              >
                {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
              </div>
              {stepNum < totalSteps && (
                <div
                  className={`w-16 h-1 mx-2 ${step > stepNum ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {taxonomyError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{taxonomyError}</AlertDescription>
          </Alert>
        )}

        {/* Form Card */}
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  <p className="text-sm text-slate-600 mb-6">
                    Please provide your contact details. Phone number is mandatory for recruiters to reach you.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="e.g. David Kamga"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      disabled
                      className="bg-slate-50"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email from your Clerk account</p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+237 671 234 567"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Cameroon local numbers are fine (e.g. 671 234 567) — we&apos;ll add the country code for you
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education & Qualification */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Education & Qualification</h2>
                  <p className="text-sm text-slate-600 mb-6">
                    Tell us about your academic background and qualifications.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qualification">Diploma/Qualification *</Label>
                    <Select onValueChange={(value) => handleInputChange('qualification', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HND">HND (Higher National Diploma)</SelectItem>
                        <SelectItem value="BSc">Bachelor&apos;s Degree (BSc)</SelectItem>
                        <SelectItem value="BEng">Bachelor of Engineering (BEng)</SelectItem>
                        <SelectItem value="MSc">Master&apos;s Degree (MSc)</SelectItem>
                        <SelectItem value="MBA">MBA</SelectItem>
                        <SelectItem value="PhD">PhD/Doctorate</SelectItem>
                        <SelectItem value="Professional Certificate">Professional Certificate</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="academicLevel">Academic Level *</Label>
                    <Select onValueChange={(value) => handleInputChange('academicLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Secondary">Secondary School</SelectItem>
                        <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="institution">Institution *</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      placeholder="e.g. University of Yaoundé I"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fieldOfStudy">Professional Field *</Label>
                    <Select onValueChange={(value) => handleInputChange('fieldOfStudy', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your field" />
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
                    <Select onValueChange={(value) => handleInputChange('specialization', value)}>
                      <SelectTrigger id="specialization">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.find((field) => field.id === formData.fieldOfStudy)?.specializations.map((specialization) => (
                          <SelectItem key={specialization.id} value={specialization.name}>
                            {specialization.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="educationStartYear">Start Year *</Label>
                      <Input
                        id="educationStartYear"
                        type="number"
                        value={formData.educationStartYear}
                        onChange={(e) => handleInputChange('educationStartYear', e.target.value)}
                        placeholder="2020"
                        min="2000"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="educationEndYear">End Year</Label>
                      <Input
                        id="educationEndYear"
                        type="number"
                        value={formData.educationEndYear}
                        onChange={(e) => handleInputChange('educationEndYear', e.target.value)}
                        placeholder="2024"
                        min="2000"
                        max={new Date().getFullYear() + 5}
                        disabled={formData.isCurrentEducation}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isCurrentEducation"
                      checked={formData.isCurrentEducation}
                      onCheckedChange={(checked) => handleInputChange('isCurrentEducation', checked)}
                    />
                    <Label htmlFor="isCurrentEducation" className="text-sm">
                      I am currently studying here
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location, Skills & Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Location, Skills & Preferences</h2>
                  <p className="text-sm text-slate-600 mb-6">
                    Help us match you with the right opportunities.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="region">Region *</Label>
                    <Select onValueChange={(value) => handleInputChange('region', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.id} value={region.id}>
                            {region.name} ({region.capital})
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
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g. Douala, Yaoundé, Buea"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredWorkMode">Preferred Work Mode</Label>
                    <Select onValueChange={(value) => handleInputChange('preferredWorkMode', value)}>
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

                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select onValueChange={(value) => handleInputChange('availability', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="When can you start?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediate">Immediate</SelectItem>
                        <SelectItem value="1 Month">Within 1 month</SelectItem>
                        <SelectItem value="2 Months">Within 2 months</SelectItem>
                        <SelectItem value="3 Months">Within 3 months</SelectItem>
                        <SelectItem value="Flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Skills *</Label>
                    <p className="text-xs text-slate-500 mb-2">
                      Add at least one skill (press Enter to add)
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillRemove(skill)}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <Input
                      placeholder="Type a skill and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSkillAdd(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: CV Upload & Profile */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">CV Upload & Profile</h2>
                  <p className="text-sm text-slate-600 mb-6">
                    Upload your CV and complete your professional profile.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* CV Upload - Mandatory */}
                  <div>
                    <Label htmlFor="cv">CV (Resume) *</Label>
                    <p className="text-xs text-slate-500 mb-2">
                      PDF only. Max 8MB. This is mandatory for registration.
                    </p>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        id="cv"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="cv" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-600">
                          {cvFile ? cvFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          PDF up to 8MB
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Photo Upload - Mandatory */}
                  <div>
                    <Label htmlFor="photo">Professional Photo *</Label>
                    <p className="text-xs text-slate-500 mb-2">
                      JPG, PNG, or WebP. Max 4MB. Required for your Intern Passport.
                    </p>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        id="photo"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="photo" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-600">
                          {photoFile ? photoFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          JPG, PNG, WebP up to 4MB
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Profile Summary */}
                  <div>
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input
                      id="headline"
                      value={formData.headline}
                      onChange={(e) => handleInputChange('headline', e.target.value)}
                      placeholder="e.g. Aspiring Software Engineer with React expertise"
                    />
                  </div>

                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      placeholder="Brief description of your professional background and career goals..."
                      rows={4}
                    />
                  </div>

                  {/* Privacy Settings */}
                  <div className="space-y-3 pt-4 border-t">
                    <h3 className="font-semibold text-sm">Privacy Settings</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPhonePublic"
                        checked={formData.isPhonePublic}
                        onCheckedChange={(checked) => handleInputChange('isPhonePublic', checked)}
                      />
                      <Label htmlFor="isPhonePublic" className="text-sm">
                        Make my phone number visible to verified organizations
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isCvSearchable"
                        checked={formData.isCvSearchable}
                        onCheckedChange={(checked) => handleInputChange('isCvSearchable', checked)}
                      />
                      <Label htmlFor="isCvSearchable" className="text-sm">
                        Allow my profile to be discoverable in Intern Passport search
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <Button type="button" onClick={handleNext} disabled={loading}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
