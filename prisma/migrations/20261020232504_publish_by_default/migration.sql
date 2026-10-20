-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INTERN', 'COMPANY', 'UNIVERSITY', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('COMPANY', 'UNIVERSITY');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'SUSPENDED', 'EXPIRED', 'ARCHIVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'PLACEMENT_PENDING', 'PLACED', 'INTERNSHIP_ACTIVE', 'COMPLETED', 'REJECTED', 'WITHDRAWN', 'ARCHIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('ONSITE', 'HYBRID', 'REMOTE');

-- CreateEnum
CREATE TYPE "ApplicationMethod" AS ENUM ('MANTECH', 'COMPANY_WEBSITE', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "PackageCode" AS ENUM ('FREE', 'PROFESSIONAL', 'BUSINESS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING_PAYMENT', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('OPPORTUNITY', 'PASSPORT');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SCAM', 'MISLEADING', 'SPAM', 'INAPPROPRIATE', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'REVIEWING', 'ACTIONED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "BoostStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'INTERN',
    "subRole" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "referralCode" TEXT,
    "referredById" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isPhonePublic" BOOLEAN NOT NULL DEFAULT false,
    "qualification" TEXT NOT NULL,
    "academicLevel" TEXT,
    "institution" TEXT,
    "fieldOfStudyId" TEXT,
    "specializationId" TEXT,
    "regionId" TEXT,
    "city" TEXT,
    "preferredWorkMode" "WorkMode" NOT NULL DEFAULT 'ONSITE',
    "availability" TEXT,
    "cvUrl" TEXT NOT NULL,
    "cvFileName" TEXT,
    "cvFileSize" INTEGER,
    "cvUploadedAt" TIMESTAMP(3),
    "isCvSearchable" BOOLEAN NOT NULL DEFAULT true,
    "readinessScore" INTEGER NOT NULL DEFAULT 40,
    "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
    "targetRole" TEXT,
    "targetIndustries" TEXT,
    "careerGoals" TEXT,
    "skillsToImprove" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternPassport" (
    "id" TEXT NOT NULL,
    "internProfileId" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "headline" TEXT,
    "summary" TEXT,
    "totalHoursCompleted" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "qrCodeData" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternPassport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassportAchievement" (
    "id" TEXT NOT NULL,
    "passportId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "badgeColor" TEXT,

    CONSTRAINT "PassportAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassportExperience" (
    "id" TEXT NOT NULL,
    "passportId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "skillsVerified" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "endorsementComment" TEXT,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PassportExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "internProfileId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "grade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternProfileSkill" (
    "id" TEXT NOT NULL,
    "internProfileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiency" TEXT NOT NULL DEFAULT 'intermediate',

    CONSTRAINT "InternProfileSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "isCameroonHND" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialization" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Cameroon',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL DEFAULT 'COMPANY',
    "industryId" TEXT,
    "description" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "logoUrl" TEXT,
    "regionId" TEXT,
    "city" TEXT,
    "address" TEXT,
    "size" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "packageCode" "PackageCode" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'recruiter',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "perks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "branches" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityProfile" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "universityType" TEXT,
    "canRecruitInterns" BOOLEAN NOT NULL DEFAULT true,
    "supportsPlacementCoordination" BOOLEAN NOT NULL DEFAULT true,
    "faculties" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "UniversityProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "documentUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "taxIdNumber" TEXT,
    "reviewerNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternshipOpportunity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department" TEXT,
    "fieldId" TEXT,
    "specializationId" TEXT,
    "requiredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "educationLevel" TEXT,
    "regionId" TEXT,
    "city" TEXT NOT NULL,
    "location" TEXT,
    "workMode" "WorkMode" NOT NULL DEFAULT 'ONSITE',
    "durationMonths" INTEGER NOT NULL DEFAULT 3,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "allowanceXAF" INTEGER DEFAULT 0,
    "positions" INTEGER NOT NULL DEFAULT 1,
    "applicationMethod" "ApplicationMethod" NOT NULL DEFAULT 'MANTECH',
    "applicationUrl" TEXT,
    "externalPlatform" TEXT,
    "instructions" TEXT,
    "contactEmail" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PUBLISHED',
    "rejectionReason" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "internProfileId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "jobId" TEXT,
    "applicationMethod" "ApplicationMethod" NOT NULL DEFAULT 'MANTECH',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "coverLetter" TEXT,
    "resumeUrl" TEXT,
    "readinessScore" INTEGER NOT NULL DEFAULT 0,
    "internalNotes" TEXT,
    "candidateRating" INTEGER,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationStatusHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "note" TEXT,
    "actorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 45,
    "type" TEXT NOT NULL DEFAULT 'online',
    "meetingLink" TEXT,
    "locationAddress" TEXT,
    "interviewerName" TEXT,
    "instructions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "feedbackNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Placement" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "internProfileId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "department" TEXT,
    "status" "PlacementStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "objectives" TEXT,
    "agreementDocUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Onboarding" (
    "id" TEXT NOT NULL,
    "placementId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedOpportunity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCandidate" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "internProfileId" TEXT NOT NULL,
    "notes" TEXT,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateContact" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "internProfileId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "requestedPhoneAccess" BOOLEAN NOT NULL DEFAULT false,
    "requestedCvAccess" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidateContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateApplication" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "internshipId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "regions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "workModes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "whatsappOptIn" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CVFileMetadata" (
    "id" TEXT NOT NULL,
    "internProfileId" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "isSecure" BOOLEAN NOT NULL DEFAULT true,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CVFileMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" "PackageCode" NOT NULL,
    "priceXAF" INTEGER NOT NULL,
    "opportunityLimit" INTEGER NOT NULL,
    "candidateSearchLimit" INTEGER NOT NULL,
    "maxRecruiterAccounts" INTEGER NOT NULL,
    "featuredOpportunitiesLimit" INTEGER NOT NULL,
    "isFeaturedBadge" BOOLEAN NOT NULL DEFAULT false,
    "prioritySupport" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationSubscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "paymentMethod" TEXT NOT NULL DEFAULT 'WHATSAPP_MANUAL',
    "transactionRef" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "OrganizationSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedOpportunity" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "priorityOrder" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FeaturedOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "photoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorRole" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminOtp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminOtp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetTitle" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "details" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "department" TEXT,
    "fieldId" TEXT,
    "specializationId" TEXT,
    "requiredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "educationLevel" TEXT,
    "regionId" TEXT,
    "city" TEXT NOT NULL,
    "location" TEXT,
    "workMode" "WorkMode" NOT NULL DEFAULT 'ONSITE',
    "applicationMethod" "ApplicationMethod" NOT NULL DEFAULT 'MANTECH',
    "applicationUrl" TEXT,
    "externalPlatform" TEXT,
    "instructions" TEXT,
    "contactEmail" TEXT,
    "salaryMinXAF" INTEGER,
    "salaryMaxXAF" INTEGER,
    "type" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "postingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boost" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "status" "BoostStatus" NOT NULL DEFAULT 'REQUESTED',
    "days" INTEGER NOT NULL,
    "note" TEXT,
    "resolution" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_referredById_idx" ON "User"("referredById");

-- CreateIndex
CREATE UNIQUE INDEX "InternProfile_userId_key" ON "InternProfile"("userId");

-- CreateIndex
CREATE INDEX "InternProfile_fieldOfStudyId_idx" ON "InternProfile"("fieldOfStudyId");

-- CreateIndex
CREATE INDEX "InternProfile_regionId_idx" ON "InternProfile"("regionId");

-- CreateIndex
CREATE INDEX "InternProfile_city_idx" ON "InternProfile"("city");

-- CreateIndex
CREATE INDEX "InternProfile_isCvSearchable_idx" ON "InternProfile"("isCvSearchable");

-- CreateIndex
CREATE UNIQUE INDEX "InternPassport_internProfileId_key" ON "InternPassport"("internProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "InternPassport_passportNumber_key" ON "InternPassport"("passportNumber");

-- CreateIndex
CREATE INDEX "InternPassport_passportNumber_idx" ON "InternPassport"("passportNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InternProfileSkill_internProfileId_skillId_key" ON "InternProfileSkill"("internProfileId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Qualification_name_key" ON "Qualification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Qualification_code_key" ON "Qualification"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Field_name_key" ON "Field"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Field_slug_key" ON "Field"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_fieldId_name_key" ON "Specialization"("fieldId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_slug_key" ON "Industry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Location_regionId_city_key" ON "Location"("regionId", "city");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_type_idx" ON "Organization"("type");

-- CreateIndex
CREATE INDEX "Organization_verificationStatus_idx" ON "Organization"("verificationStatus");

-- CreateIndex
CREATE INDEX "Organization_regionId_idx" ON "Organization"("regionId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_organizationId_key" ON "CompanyProfile"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityProfile_organizationId_key" ON "UniversityProfile"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "InternshipOpportunity_slug_key" ON "InternshipOpportunity"("slug");

-- CreateIndex
CREATE INDEX "InternshipOpportunity_slug_idx" ON "InternshipOpportunity"("slug");

-- CreateIndex
CREATE INDEX "InternshipOpportunity_organizationId_idx" ON "InternshipOpportunity"("organizationId");

-- CreateIndex
CREATE INDEX "InternshipOpportunity_moderationStatus_idx" ON "InternshipOpportunity"("moderationStatus");

-- CreateIndex
CREATE INDEX "InternshipOpportunity_workMode_idx" ON "InternshipOpportunity"("workMode");

-- CreateIndex
CREATE INDEX "Application_opportunityId_idx" ON "Application"("opportunityId");

-- CreateIndex
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");

-- CreateIndex
CREATE INDEX "Application_internProfileId_idx" ON "Application"("internProfileId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Application_internProfileId_opportunityId_key" ON "Application"("internProfileId", "opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "Placement_applicationId_key" ON "Placement"("applicationId");

-- CreateIndex
CREATE INDEX "Placement_organizationId_idx" ON "Placement"("organizationId");

-- CreateIndex
CREATE INDEX "Placement_internProfileId_idx" ON "Placement"("internProfileId");

-- CreateIndex
CREATE INDEX "Placement_status_idx" ON "Placement"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SavedOpportunity_userId_opportunityId_key" ON "SavedOpportunity"("userId", "opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCandidate_organizationId_internProfileId_key" ON "SavedCandidate"("organizationId", "internProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateContact_organizationId_internProfileId_key" ON "CandidateContact"("organizationId", "internProfileId");

-- CreateIndex
CREATE INDEX "CandidateApplication_internshipId_idx" ON "CandidateApplication"("internshipId");

-- CreateIndex
CREATE INDEX "CandidateApplication_status_idx" ON "CandidateApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateApplication_applicantId_internshipId_key" ON "CandidateApplication"("applicantId", "internshipId");

-- CreateIndex
CREATE INDEX "CandidateAlert_userId_idx" ON "CandidateAlert"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateAlert_userId_key" ON "CandidateAlert"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Package_code_key" ON "Package"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedOpportunity_opportunityId_key" ON "FeaturedOpportunity"("opportunityId");

-- CreateIndex
CREATE INDEX "Testimonial_status_createdAt_idx" ON "Testimonial"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Testimonial_role_idx" ON "Testimonial"("role");

-- CreateIndex
CREATE INDEX "Testimonial_focus_idx" ON "Testimonial"("focus");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AdminOtp_email_createdAt_idx" ON "AdminOtp"("email", "createdAt");

-- CreateIndex
CREATE INDEX "AdminOtp_expiresAt_idx" ON "AdminOtp"("expiresAt");

-- CreateIndex
CREATE INDEX "Report_status_createdAt_idx" ON "Report"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Report_targetType_targetId_idx" ON "Report"("targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reporterId_targetType_targetId_key" ON "Report"("reporterId", "targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");

-- CreateIndex
CREATE INDEX "Job_slug_idx" ON "Job"("slug");

-- CreateIndex
CREATE INDEX "Job_organizationId_idx" ON "Job"("organizationId");

-- CreateIndex
CREATE INDEX "Job_moderationStatus_idx" ON "Job"("moderationStatus");

-- CreateIndex
CREATE INDEX "Job_workMode_idx" ON "Job"("workMode");

-- CreateIndex
CREATE INDEX "Job_type_idx" ON "Job"("type");

-- CreateIndex
CREATE INDEX "Job_salaryMinXAF_idx" ON "Job"("salaryMinXAF");

-- CreateIndex
CREATE INDEX "Job_city_idx" ON "Job"("city");

-- CreateIndex
CREATE INDEX "Boost_status_createdAt_idx" ON "Boost"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Boost_organizationId_idx" ON "Boost"("organizationId");

-- CreateIndex
CREATE INDEX "Boost_opportunityId_idx" ON "Boost"("opportunityId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternProfile" ADD CONSTRAINT "InternProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternProfile" ADD CONSTRAINT "InternProfile_fieldOfStudyId_fkey" FOREIGN KEY ("fieldOfStudyId") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternProfile" ADD CONSTRAINT "InternProfile_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternProfile" ADD CONSTRAINT "InternProfile_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternPassport" ADD CONSTRAINT "InternPassport_internProfileId_fkey" FOREIGN KEY ("internProfileId") REFERENCES "InternProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassportAchievement" ADD CONSTRAINT "PassportAchievement_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "InternPassport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassportExperience" ADD CONSTRAINT "PassportExperience_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "InternPassport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_internProfileId_fkey" FOREIGN KEY ("internProfileId") REFERENCES "InternProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternProfileSkill" ADD CONSTRAINT "InternProfileSkill_internProfileId_fkey" FOREIGN KEY ("internProfileId") REFERENCES "InternProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternProfileSkill" ADD CONSTRAINT "InternProfileSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specialization" ADD CONSTRAINT "Specialization_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityProfile" ADD CONSTRAINT "UniversityProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipOpportunity" ADD CONSTRAINT "InternshipOpportunity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipOpportunity" ADD CONSTRAINT "InternshipOpportunity_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipOpportunity" ADD CONSTRAINT "InternshipOpportunity_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipOpportunity" ADD CONSTRAINT "InternshipOpportunity_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_internProfileId_fkey" FOREIGN KEY ("internProfileId") REFERENCES "InternProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "InternshipOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_internProfileId_fkey" FOREIGN KEY ("internProfileId") REFERENCES "InternProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Onboarding" ADD CONSTRAINT "Onboarding_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedOpportunity" ADD CONSTRAINT "SavedOpportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedOpportunity" ADD CONSTRAINT "SavedOpportunity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "InternshipOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCandidate" ADD CONSTRAINT "SavedCandidate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCandidate" ADD CONSTRAINT "SavedCandidate_internProfileId_fkey" FOREIGN KEY ("internProfileId") REFERENCES "InternProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateContact" ADD CONSTRAINT "CandidateContact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateContact" ADD CONSTRAINT "CandidateContact_internProfileId_fkey" FOREIGN KEY ("internProfileId") REFERENCES "InternProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateApplication" ADD CONSTRAINT "CandidateApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateApplication" ADD CONSTRAINT "CandidateApplication_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "InternshipOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAlert" ADD CONSTRAINT "CandidateAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CVFileMetadata" ADD CONSTRAINT "CVFileMetadata_internProfileId_fkey" FOREIGN KEY ("internProfileId") REFERENCES "InternProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSubscription" ADD CONSTRAINT "OrganizationSubscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSubscription" ADD CONSTRAINT "OrganizationSubscription_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedOpportunity" ADD CONSTRAINT "FeaturedOpportunity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "InternshipOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boost" ADD CONSTRAINT "Boost_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "InternshipOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boost" ADD CONSTRAINT "Boost_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boost" ADD CONSTRAINT "Boost_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
