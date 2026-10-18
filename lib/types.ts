/**
 * MANTECH Nexus — Unified TypeScript Types
 * Grounded in SRS Specifications:
 * - Interns, Companies, Universities (Dual-Mode), Admin
 * - Intern Passport & Server-Authorized CV access
 * - 3 Application Methods (Direct, Company Website, External)
 * - Placement, Onboarding & Analytics
 * - Monetization Packages & WhatsApp Manual Activation
 */

export type UserRole = 'intern' | 'student' | 'company' | 'university' | 'supervisor' | 'admin';

export type OrganizationType = 'COMPANY' | 'UNIVERSITY';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export type ModerationStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'published'
  | 'suspended'
  | 'expired'
  | 'archived'
  | 'rejected';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'placement_pending'
  | 'placed'
  | 'internship_active'
  | 'completed'
  | 'rejected'
  | 'withdrawn'
  | 'archived'
  | 'cancelled';

export type PlacementStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export type WorkMode = 'onsite' | 'on-site' | 'hybrid' | 'remote';

export type ApplicationMethod = 'mantech' | 'company_website' | 'external';

export type HealthStatus = 'healthy' | 'attention_needed' | 'at_risk';

export type NotificationCategory =
  | 'application'
  | 'interview'
  | 'placement'
  | 'shortlist'
  | 'contact'
  | 'verification'
  | 'package'
  | 'system'
  | 'report'
  | 'evaluation'
  | 'business';

// ------------------------------------------------------------------------
// USER & IDENTITY
// ------------------------------------------------------------------------

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  sub_role: string | null;
  phone: string | null;
  bio: string | null;
  status: 'active' | 'suspended' | 'pending' | 'deactivated';
  organization_id?: string | null;
  university_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  clerkId?: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  role: UserRole;
  subRole?: string | null;
  phone?: string | null;
  bio?: string | null;
  status: 'active' | 'suspended' | 'pending';
  organizationId?: string | null;
  universityId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------
// INTERN PROFILE & INTERN PASSPORT (SRS Section 6 & 7)
// ------------------------------------------------------------------------

export interface Education {
  id: string;
  internProfileId?: string;
  institution: string;
  qualification: string; // e.g. HND, BSc, Master, Engineering Diploma
  field: string;
  startYear: number;
  endYear?: number | null;
  isCurrent?: boolean;
  grade?: string | null;
}

export interface InternSkill {
  id: string;
  name: string;
  category?: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface InternPassportExperience {
  id: string;
  companyName?: string;
  company_name?: string;
  roleTitle?: string;
  role_title?: string;
  durationMonths?: number;
  duration_months?: number;
  location?: string;
  skillsVerified?: string[];
  skills_verified?: string[];
  endorsementComment?: string | null;
  endorsement_comment?: string | null;
  supervisorName?: string | null;
  supervisor_name?: string | null;
  verifiedAt?: string;
  verified_at?: string;
}

export interface InternPassportAchievement {
  id: string;
  title: string;
  category: string;
  issuer: string;
  issueDate?: string;
  issue_date?: string;
  description?: string | null;
  badgeColor?: string;
  badge_color?: string;
}

export interface InternPassport {
  id: string;
  internProfileId?: string;
  student_id?: string;
  student_name?: string;
  user_id?: string;
  passportNumber?: string; // e.g. MTN-CM-2026-9481
  passport_number?: string;
  matricule?: string | null;
  university_name?: string | null;
  faculty?: string | null;
  degree_program?: string | null;
  internship_title?: string | null;
  company_name?: string | null;
  company_location?: string | null;
  supervisor_name?: string | null;
  industry_mentor?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  total_hours?: number | null;
  academic_credits_earned?: number | null;
  final_grade?: string | null;
  qr_verification_url?: string | null;
  verification_hash?: string | null;
  skills_verified?: string[];
  headline?: string | null;
  summary?: string | null;
  bio?: string | null;
  totalHoursCompleted?: number;
  total_hours_completed?: number;
  completionBadgeIssued?: boolean;
  completion_badge_issued?: boolean;
  isVerified?: boolean;
  issuedAt?: string | null;
  issued_at?: string | null;
  status?: string | null;
  updatedAt?: string;
  updated_at?: string;
  achievements?: InternPassportAchievement[];
  experiences?: InternPassportExperience[];
}

export interface InternProfile {
  id: string;
  userId: string;
  user?: Profile | User;
  fullName: string;
  photoUrl: string | null;
  email: string;
  phone: string; // Mandatory (Section 6)
  isPhonePublic: boolean; // Privacy control (Section 7)
  qualification: string; // Mandatory (Section 6)
  educationLevel: string;
  institution: string;
  fieldOfStudy: string;
  specialization?: string | null;
  skills: string[];
  region: string;
  city: string;
  workModePreference: WorkMode;
  availability: string;
  cvUrl: string; // Mandatory during registration (Section 6)
  cvFileName?: string;
  cvFileSize?: number;
  cvUploadedAt?: string;
  isCvSearchable: boolean;
  readinessScore?: number;
  profileCompleted: boolean;
  passport?: InternPassport;
  educationRecords?: Education[];
  createdAt: string;
  updatedAt: string;
}

// Backward-compatibility aliases
export type StudentProfile = InternProfile;
export type CareerPassportProfile = InternPassport;
export type CareerPassport = InternPassport;
export type CareerPassportAchievement = InternPassportAchievement;
export type CareerPassportExperience = InternPassportExperience;

// ------------------------------------------------------------------------
// ORGANIZATIONS: COMPANY & UNIVERSITY (Dual-Mode)
// ------------------------------------------------------------------------

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  user?: Profile | User;
  jobTitle?: string | null;
  isOwner?: boolean;
  role: 'owner' | 'admin' | 'recruiter' | 'member';
  joinedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  legal_name?: string;
  slug: string;
  type?: any;
  industry?: string | null;
  description?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  logo_url?: string | null;
  region?: string | null;
  city?: string | null;
  address?: string | null;
  size?: string | null;
  tax_id?: string;
  verificationStatus?: VerificationStatus;
  verification_status?: VerificationStatus;
  verifiedAt?: string | null;
  packageId?: string;
  packageCode?: 'FREE' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE';
  members?: OrganizationMember[];
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface Company extends Organization {
  tax_id?: string;
  size_bracket?: string;
}

export interface University extends Organization {
  short_name?: string;
  contact_email?: string;
  contact_phone?: string | null;
  universityType?: string | null;
  canRecruitInterns?: boolean; // Dual Mode B
  supportsPlacementCoordination?: boolean; // Dual Mode A
}

// ------------------------------------------------------------------------
// INTERNSHIP OPPORTUNITIES (3 Application Methods)
// ------------------------------------------------------------------------

export interface InternshipOpportunity {
  id: string;
  companyId?: string;
  company_id?: string;
  companyName?: string;
  companyLogoUrl?: string | null;
  company?: Company | Organization;
  title: string;
  slug: string;
  description: string;
  department?: string | null;
  field?: string | null;
  field_of_study_id?: string | null;
  industry?: string | null;
  specialization?: string | null;
  requiredSkills?: string[];
  required_skills?: string[];
  preferredSkills?: string[];
  preferred_skills?: string[];
  skills?: string[];
  educationRequirement?: string | null;
  education_requirement?: string | null;
  educationLevel?: string | null;
  education_level?: string | null;
  region: string;
  city: string;
  location?: string | null;
  workMode?: WorkMode;
  work_mode?: WorkMode;
  duration?: string | null;
  durationMonths?: number;
  duration_months?: number;
  startDate?: string | null;
  start_date?: string | null;
  endDate?: string | null;
  end_date?: string | null;
  deadline?: string;
  application_deadline?: string | null;
  isPaid?: boolean;
  is_paid?: boolean;
  allowance?: string | null;
  allowanceXAF?: number | null;
  allowance_xaf?: number | null;
  stipend_min?: number;
  stipend_max?: number;
  positions?: number;
  num_positions?: number;
  positions_available?: number;
  requirements?: any;
  responsibilities?: string[];
  requiredDocuments?: string[];
  required_documents?: string[];
  applicationMethod?: ApplicationMethod;
  application_method?: ApplicationMethod;
  applicationUrl?: string | null;
  application_url?: string | null;
  externalPlatform?: string;
  external_platform?: string;
  instructions?: string | null;
  application_instructions?: string | null;
  contactEmail?: string | null;
  contact_email?: string | null;
  contact_info?: string | null;
  isFeatured?: boolean;
  is_featured?: boolean;
  summary?: string;
  skills_required?: string[];
  stipend_currency?: string;
  duration_weeks?: number;
  address?: string | null;
  openings?: number;
  transport_covered?: boolean;
  lunch_covered?: boolean;
  featured?: boolean;
  published_at?: string | null;
  expires_at?: string | null;
  external_url?: string | null;
  moderationStatus?: ModerationStatus;
  moderation_status?: ModerationStatus;
  rejectionReason?: string | null;
  viewCount?: number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export type Internship = InternshipOpportunity;

// ------------------------------------------------------------------------
// APPLICATIONS & RECRUITMENT PIPELINE
// ------------------------------------------------------------------------

export interface ApplicationTimelineEvent {
  id?: string;
  date?: string;
  title?: string;
  label?: string;
  desc?: string;
  description?: string;
  status?: ApplicationStatus;
  actorName?: string;
  actor_name?: string;
  created_at?: string;
}

export interface Application {
  id: string;
  internship_id?: string;
  internshipId?: string;
  opportunity_id?: string;
  student_id?: string;
  internProfileId?: string;
  internProfile?: InternProfile;
  coverLetter?: string | null;
  cover_letter?: string | null;
  cover_note?: string | null;
  resumeUrl?: string | null;
  cv_url?: string | null;
  documents?: any[];
  applicationMethod?: ApplicationMethod;
  application_method?: ApplicationMethod;
  status: ApplicationStatus;
  notes?: string | null;
  internalNotes?: string | null;
  readiness_score?: number;
  readinessScore?: number;
  match_score?: number;
  timelines?: ApplicationTimelineEvent[];
  timeline?: ApplicationTimelineEvent[];
  candidateRating?: number;
  rejectionReason?: string | null;
  submitted_at?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  internship?: InternshipOpportunity;
}

// ------------------------------------------------------------------------
// INTERVIEWS
// ------------------------------------------------------------------------

export interface Interview {
  id: string;
  application_id?: string;
  applicationId?: string;
  interview_date?: string;
  interview_time?: string;
  scheduledAt?: string;
  durationMinutes?: number;
  type?: 'video' | 'phone' | 'in_person' | 'panel' | 'online' | string;
  interviewer?: string | null;
  interviewerName?: string | null;
  meetingLink?: string | null;
  meeting_link?: string | null;
  meetingLocation?: string | null;
  meeting_location?: string | null;
  locationAddress?: string | null;
  instructions?: string | null;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show' | string;
  notes?: string | null;
  feedbackNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ------------------------------------------------------------------------
// PLACEMENTS & ONBOARDING
// ------------------------------------------------------------------------

export interface OnboardingItem {
  id: string;
  placementId?: string;
  title: string;
  description?: string | null;
  isRequired?: boolean;
  completed?: boolean;
  isCompleted?: boolean;
  completedAt?: string | null;
}

export interface Placement {
  id: string;
  application_id?: string;
  applicationId?: string;
  student_id?: string;
  internProfileId?: string;
  intern_name?: string;
  company_id?: string;
  companyId?: string;
  organizationId?: string;
  opportunity_id?: string;
  internship_id?: string;
  internshipId?: string;
  company_name?: string;
  internship_title?: string;
  department?: string | null;
  university_id?: string | null;
  universityId?: string | null;
  university_name?: string | null;
  supervisor_id?: string | null;
  supervisorId?: string | null;
  supervisor_name?: string | null;
  academic_supervisor_id?: string;
  industry_mentor_name?: string | null;
  industry_mentor_email?: string | null;
  industry_mentor_title?: string | null;
  stipend_currency?: string | null;
  health_notes?: string | null;
  start_date?: string;
  startDate?: string;
  end_date?: string | null;
  endDate?: string | null;
  duration_weeks?: number;
  total_weeks?: number;
  current_week?: number;
  progress_percentage?: number;
  stipend_amount?: string | number | null;
  work_mode?: WorkMode;
  objectives?: string | null;
  documents?: any[];
  onboarding_checklist?: OnboardingItem[];
  onboardingItems?: OnboardingItem[];
  status: PlacementStatus;
  health_status?: HealthStatus;
  healthStatus?: HealthStatus;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

// ------------------------------------------------------------------------
// NOTIFICATIONS, AUDIT & TELEMETRY
// ------------------------------------------------------------------------

export interface Notification {
  id: string;
  user_id?: string;
  userId?: string;
  category?: NotificationCategory;
  type?: string;
  title: string;
  message: string;
  link?: string | null;
  is_read?: boolean;
  isRead?: boolean;
  created_at?: string;
  createdAt?: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string | null;
  actorId?: string | null;
  actor_role?: string | null;
  actorRole?: string | null;
  actor_email?: string | null;
  action: string;
  entity_type?: string | null;
  entityType?: string | null;
  entity_id?: string | null;
  entityId?: string | null;
  resource?: string;
  details?: any;
  status?: string;
  ip_address?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  timestamp?: string;
  created_at?: string;
  createdAt?: string;
}

// ------------------------------------------------------------------------
// TAXONOMY & SEARCH
// ------------------------------------------------------------------------

export interface FieldOfStudy {
  id: string;
  name: string;
  slug?: string;
  category: string;
  description: string | null;
  is_active: boolean;
  isActive?: boolean;
  display_order?: number;
}

export interface Skill {
  id: string;
  name: string;
  slug?: string;
  category: string | null;
  is_active: boolean;
  isActive?: boolean;
}

export interface Location {
  id: string;
  region: string;
  city: string;
  is_active: boolean;
  isActive?: boolean;
}

export interface SavedOpportunityRef {
  id: string;
  userId: string;
  opportunityId: string;
  savedAt: string;
}

export interface SavedCandidate {
  id: string;
  organizationId: string;
  internProfileId: string;
  notes?: string;
  savedAt: string;
}
export interface CandidateSavedItem {
  id: string;
  internshipId: string;
  internshipTitle: string;
  internshipSlug: string;
  companyName: string;
  companyLogoUrl?: string;
  region: string;
  city: string;
  workMode: string;
  isPaid: boolean;
  isFeatured: boolean;
  savedAt: string;
}

// ------------------------------------------------------------------------
// JOBS (public marketplace)
// ------------------------------------------------------------------------

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'VOLUNTEER' | 'FREELANCE';

export interface Job {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  summary?: string | null;
  department?: string | null;
  type: JobType | string;
  workMode: string;
  city: string;
  location?: string | null;
  region?: string | null;
  requiredSkills?: string[] | null;
  preferredSkills?: string[] | null;
  educationLevel?: string | null;
  salaryMinXAF?: number | null;
  salaryMaxXAF?: number | null;
  postingDate?: string | null;
  expiryDate?: string | null;
  isRemote?: boolean;
  isFeatured?: boolean;
  moderationStatus?: string | null;
  field?: { id: string; name: string; slug: string } | null;
  specialization?: { id: string; name: string; slug: string } | null;
  organization?: {
    id: string;
    name: string;
    slug?: string;
    type?: string;
    logoUrl?: string | null;
    website?: string | null;
    city?: string | null;
    address?: string | null;
    description?: string | null;
    size?: string | null;
    verificationStatus?: string | null;
    companyProfile?: {
      techStack?: string[];
      perks?: string[];
      branches?: string[];
    } | null;
    universityProfile?: {
      universityType?: string | null;
      canRecruitInterns?: boolean;
      supportsPlacementCoordination?: boolean;
      faculties?: string[];
    } | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}
