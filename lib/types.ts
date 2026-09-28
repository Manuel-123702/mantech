export type UserRole = 'student' | 'company' | 'university' | 'supervisor' | 'admin';

export type AdminSubRole = 'super_admin' | 'admin' | 'content_admin' | 'verification_admin' | 'support_admin';

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
  | 'expired'
  | 'cancelled';

export type PlacementStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export type WorkMode = 'on-site' | 'hybrid' | 'remote';

export type ApplicationMethod = 'mantech' | 'company_website' | 'external';

export type ReportType = 'weekly' | 'monthly' | 'midterm' | 'final';

export type EvaluationType = 'supervisor' | 'company' | 'student_reflection';

export type NotificationCategory =
  | 'application'
  | 'interview'
  | 'placement'
  | 'report'
  | 'evaluation'
  | 'verification'
  | 'system'
  | 'business';

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
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  logo_url: string | null;
  region: string | null;
  city: string | null;
  address: string | null;
  size: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  type: string | null;
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  logo_url: string | null;
  region: string | null;
  city: string | null;
  address: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Internship {
  id: string;
  company_id: string;
  title: string;
  slug: string;
  description: string;
  field?: string | null;
  field_of_study_id?: string | null;
  department?: string | null;
  industry?: string | null;
  specialization?: string | null;
  required_skills?: string[];
  preferred_skills?: string[];
  skills?: string[];
  education_requirement?: string | null;
  education_level?: string | null;
  region: string | null;
  city: string | null;
  location?: string | null;
  work_mode: WorkMode;
  duration?: string | null;
  duration_months?: number;
  start_date: string | null;
  end_date: string | null;
  application_deadline?: string | null;
  deadline?: string;
  is_paid: boolean;
  allowance?: string | null;
  allowance_xaf?: number | null;
  num_positions?: number;
  positions_available?: number;
  requirements?: any;
  required_documents?: string[];
  application_method: ApplicationMethod;
  application_url?: string | null;
  application_instructions?: string | null;
  instructions?: string | null;
  contact_info?: string | null;
  contact_email?: string | null;
  is_featured: boolean;
  moderation_status: ModerationStatus;
  created_at: string;
  updated_at: string;
  company?: any;
}

export interface Application {
  id: string;
  internship_id: string;
  student_id: string;
  cover_letter: string | null;
  documents?: any[];
  status: ApplicationStatus;
  notes?: string | null;
  readiness_score?: number;
  timelines?: { date: string; title: string; desc: string }[];
  created_at: string;
  updated_at: string;
  internship?: Internship;
}

export interface Placement {
  id: string;
  application_id: string;
  student_id: string;
  company_id: string;
  internship_id?: string;
  company_name?: string;
  internship_title?: string;
  university_id: string | null;
  university_name?: string | null;
  supervisor_id: string | null;
  supervisor_name?: string | null;
  start_date: string;
  end_date: string | null;
  objectives: string | null;
  documents?: any[];
  onboarding_checklist?: { id: string; title: string; completed: boolean }[];
  status: PlacementStatus;
  health_status?: 'healthy' | 'attention_needed' | 'at_risk';
  created_at?: string;
  updated_at?: string;
}

export interface Interview {
  id: string;
  application_id: string;
  interview_date?: string;
  interview_time?: string;
  type?: 'video' | 'phone' | 'in_person' | 'panel' | string;
  interviewer?: string | null;
  meeting_link?: string | null;
  meeting_location?: string | null;
  instructions?: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show' | string;
  notes?: string | null;
  created_at?: string;
}

export interface InternshipReport {
  id: string;
  placement_id: string;
  student_id?: string;
  report_type?: ReportType;
  type?: ReportType;
  title?: string;
  summary?: string;
  activities?: string;
  challenges?: string;
  skills_applied?: string[];
  content?: string | null;
  file_url?: string | null;
  week_number?: number | null;
  period_start?: string;
  period_end?: string;
  status: string;
  feedback?: string | null;
  reviewer_feedback?: string | null;
  supervisor_signature?: string | null;
  submitted_at: string;
  reviewed_at?: string | null;
  created_at?: string;
}

export interface Evaluation {
  id: string;
  placement_id: string;
  evaluator_id: string;
  type: EvaluationType;
  attendance_score: number | null;
  technical_score: number | null;
  communication_score: number | null;
  professionalism_score: number | null;
  task_completion_score: number | null;
  learning_progress_score: number | null;
  overall_score: number | null;
  comments: string | null;
  recommendations: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface FieldOfStudy {
  id: string;
  name: string;
  category: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  is_active: boolean;
}

export interface Location {
  id: string;
  region: string;
  city: string;
  is_active: boolean;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  field_of_study_id: string | null;
  specialization: string | null;
  education_level: string | null;
  institution: string | null;
  graduation_year: number | null;
  cv_url: string | null;
  bio: string | null;
  skills: string[];
  documents: any[];
  readiness_score: number;
  created_at: string;
  updated_at: string;
}

export interface SavedInternship {
  id: string;
  user_id: string;
  internship_id: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: any;
  ip_address: string | null;
  created_at: string;
}

export interface CareerPassportProfile {
  id: string;
  user_id: string;
  passport_number: string;
  headline: string | null;
  bio: string | null;
  total_hours_completed: number;
  completion_badge_issued: boolean;
  issued_at: string | null;
  achievements: CareerPassportAchievement[];
  experiences: CareerPassportExperience[];
}

export interface CareerPassportAchievement {
  id: string;
  passport_id: string;
  title: string;
  category: string;
  issuer: string;
  issue_date: string;
  description: string | null;
  badge_color?: string;
}

export interface CareerPassportExperience {
  id: string;
  passport_id: string;
  company_name: string;
  role_title: string;
  duration_months: number;
  location: string;
  skills_verified: string[];
  endorsement_comment?: string | null;
  supervisor_name?: string | null;
  verified_at: string;
}
