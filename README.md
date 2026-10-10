MANTECH Nexus — Essential SRS & Antigravity Build Specification

1. Product Definition
MANTECH Nexus is a Cameroon-focused internship marketplace and recruitment platform that connects internship seekers with companies and institutions, helping both sides discover, evaluate, contact and recruit the right internship candidates.
MANTECH is a two-sided marketplace:
Intern → Organization: search opportunities, discover companies/universities, apply or contact.
Organization → Intern: search internship seekers, discover Intern Passports, review authorized CVs, shortlist, contact, interview and recruit.
A university/institution has two functions: help associated people find opportunities, and recruit interns to work for the institution.
MANTECH starts in Cameroon and supports all professional fields.
2. Critical Scope
Use Intern, Internship Seeker, Company, University/Institution, and MANTECH Admin.
MANTECH is not a university ERP, school management system, academic report system, supervisor/report workflow, GPA/transcript system, course/exam system, payroll system, generic social network, generic job board, CV builder, or university itself.
Remove academic internship reports, supervisor/report workflows, academic grading and university-controlled assessment. MANTECH focuses on discovery, professional profiles, opportunities, applications, contact, interviews, selection, placement, onboarding, permitted follow-up, recruitment history and marketplace analytics.
3. Existing Project — DO NOT RESTART
The website has already been started. Do not delete the existing project and rebuild from scratch.
Before changing anything Antigravity must:
Inspect the entire existing project.
Identify the current stack and architecture.
Inspect existing pages, components, routes, assets, authentication, database and styling.
Preserve useful existing work.
Reuse existing components/functionality where possible.
Refactor or migrate only what conflicts with this specification.
Never replace working functionality with mock/demo functionality.
Make a change plan before destructive architectural changes.
Keep the project buildable throughout development.
Upgrade and complete the existing MANTECH project; do not restart from zero.
4. Target Architecture
Use compatible existing technology where possible:
Next.js + React + TypeScript
Tailwind CSS + shadcn/ui
Framer Motion
Lucide / real brand icon libraries
Clerk for authentication, sessions and MFA
PostgreSQL on Neon + Prisma for operational data
Version-controlled application content for public/marketing pages
UploadThing for CVs, photos, logos and permitted documents
EmailJS for email notifications
WhatsApp for business/payment communication
Vercel where compatible
Do not introduce duplicate authentication or database systems without a strong reason. Do not use Payload CMS or Sanity; public editorial content is maintained in reviewed application source.
5. No Hardcoded Business Data
Operational business data must come from PostgreSQL/Prisma. This includes interns, companies, universities, opportunities, applications, CV metadata, profiles, fields, specializations, skills, industries, locations, regions/cities, work modes, durations, eligibility, application methods, packages, organization members, interviews, placements, notifications and analytics.
Public editorial/marketing copy and resource articles are maintained in reviewed application source and released with the application.
Static code may contain only technical/UI constants such as navigation, permissions, validation rules, technical limits, design tokens and route definitions.
Do not solve hardcoding by moving arrays into another source file.
6. Intern Registration
Registration must require:
authentication/account;
full name;
professional photo;
email;
phone number — mandatory;
diploma/qualification already obtained;
education information;
professional field;
specialization where applicable;
skills;
location;
internship preferences;
CV — mandatory during registration.
Intern access is free at launch. Architecture must allow future paid intern services.
7. Intern Passport
The profile feature is called Intern Passport.
It is the professional discovery profile inside MANTECH, not a separate application and not a CV builder.
It may contain professional photo, name, headline, summary, diploma/qualification, education, field, specialization, skills, certifications, experience, internship preferences, location, work mode, availability and authorized CV access.
Recommended privacy model
Logged-out visitors cannot browse the Intern Passport directory.
Only authenticated and verified companies/universities can discover/search Intern Passports.
Verified organizations can open permitted profile information.
CV and phone number have stricter privacy controls.
CV access must be server-authorized and auditable.
Never expose predictable public CV URLs.
Use secure storage and short-lived/signed access where appropriate.
Allow appropriate intern privacy settings.
Important
Do not implement: `Intern uploads CV → CV automatically appears in every company/university dashboard.`
Correct flow:
`Intern registers → secure storage → Intern Passport → verified organization searches → opens Passport → authorized CV access.`
8. Contact and Application Methods
Phone number is mandatory because an organization may decide to call an intern directly.
MANTECH supports three internship application methods:
Method 1 — Apply on MANTECH
The intern applies directly through MANTECH.
Method 2 — Apply on Company Website
MANTECH redirects the intern to the company's official recruitment/application page.
Method 3 — Apply Externally
The organization provides an official external application URL, such as LinkedIn, a university portal, recruitment platform or official company recruitment system.
An authorized organization may also call an intern directly when phone visibility permits it. MANTECH should facilitate connections without forcing every recruitment conversation to remain inside the platform.
9. Marketplace Pages
Build a substantial professional marketplace, not a single-page demo.
Suggested public routes:

```text
/
/about
/how-it-works
/internships
/internships/[slug]
/companies
/companies/[slug]
/universities
/universities/[slug]
/fields
/fields/[slug]
/locations
/locations/[slug]
/resources
/pricing
/faq
/contact
/auth
```

Authenticated routes:

```text
/dashboard/intern
/dashboard/company
/dashboard/university
/dashboard/admin
/intern-passports
/intern-passports/[id]
/applications
/saved
/notifications
/settings
```

Expand routes when real functionality requires it.
10. Internship Search
Search/filter by live database values:
professional field;
specialization;
industry;
skills;
region;
city/town;
location;
work mode;
duration;
paid/unpaid;
availability/start period;
eligibility;
organization;
application method;
deadline;
keywords.
Support all professional fields, not only technology.
11. Organization Candidate Search
Companies and universities must search internship seekers by field, specialization, diploma/qualification, education level, skills, certifications, experience, location, availability, work mode, internship preference and keywords.
Features: search, advanced filters, Intern Passport discovery, authorized CV viewing, shortlist/save, candidate notes, contact and recruitment request.
12. Intern Dashboard
The AI builder must implement these modules, not invent a minimal dashboard.
Overview
Live counts: applications, saved opportunities, passport views and profile readiness. A short welcome line, and a "next actions" panel listing upcoming interviews, applications awaiting action, missing profile items and unread notifications. Render only when there is something to act on.
Profile readiness
A checklist derived from real profile state covering the mandatory §6 fields (CV, professional photo, phone, diploma, professional field) plus skills, education, location, availability and professional summary. Each item deep-links to the page where it can be fixed. The readiness percentage is computed from the checklist, never stored as a separate number that can drift.
Intern Passport
Photo, name, headline, summary, passport number, verification state, view count, contact information subject to privacy settings, qualification, specialization, skills, education, verified experience, achievements/certifications, work mode, availability, authorized CV access and privacy controls. There must be exactly one canonical Passport; duplicate implementations of the same Passport are not allowed.
Applications
Submitted, under review, shortlisted, interview, selected, placed, rejected, withdrawn and archived, with the organization, opportunity and latest status.
Saved Opportunities
Saved internships with removal and a direct path back to the listing.
Journey / Intern History
See section 13. A chronological record of everything the intern has done on MANTECH.
Notifications
Application updates, status changes, shortlists, interviews, selection, placement, opportunity alerts and account events, with read/unread state.
Settings
Profile details, privacy controls (phone visibility, Passport discoverability), CV management, security and account.
13. Intern History / Journey
MANTECH must keep the intern's professional journey so progress stays visible and verifiable over time.
Definition
Intern History is the intern's complete, chronological record of activity on MANTECH. It answers "what has this person actually done here?"
Derived, never fabricated
Every history entry must be projected from records the intern genuinely owns: registration, CV upload, Passport creation, Application, ApplicationStatusHistory, Interview, Placement and PassportAchievement. Never display an event that has no backing database row. Never seed fake milestones.
Content
Profile created, CV uploaded, Passport issued, applications submitted, every status transition (under review, shortlisted, interview, selected, placed, completed), interviews scheduled or cancelled, placements confirmed, and verified achievements.
Presentation
Newest-first timeline with tone-coded entries (milestone, progress, neutral, closed). Terminal negative outcomes such as rejected or withdrawn read as closed, never as progress.
Visibility
An intern always sees their own full history. Verified organizations may see the professional milestones relevant to recruitment (interviews, selections, placements, achievements). Private data such as phone number, CV URL and storage keys must never appear in a history entry.
Empty state
A newly registered intern still has a valid journey (profile created); the timeline must never be empty or broken.
14. Company Dashboard
The AI builder must implement these modules, not invent a minimal dashboard.
Overview
Active opportunities, applications, new candidates, shortlisted, interviews, selected interns, active placements, expiring opportunities, recent activity and notifications.
Organization
Company profile, logo, description, industry, locations, website, verification status, members, recruiters and permissions.
Internship Opportunities
Create/edit/publish, draft, archive/close, requirements, responsibilities, field/specialization, skills, location, work mode, duration, start date, deadline, number required, compensation, benefits and application method.
Intern Discovery
Candidate search, advanced filters, Intern Passport, authorized CV access, shortlist, save, contact and notes.
Applications
Received, under review, shortlisted, contacted, interview, selected, rejected, withdrawn and archived.
Interviews
Schedule, date/time, location, meeting link, confirmation, rescheduling, status, notes and outcome.
Recruitment / Placement
Selected interns, placement, department, start/end dates, onboarding, placement status, active placements and completed placements.
Analytics
Opportunity views, applications, candidate discovery, shortlist activity, recruitment, placements and usage.
Billing
Current package, limits, usage, upgrade request, billing history and payment status.
Settings
Organization settings, recruiter accounts, roles, security, MFA, notifications, privacy and activity/audit.
15. University Dashboard — Dual Mode
Mode A — Help Find Internship Opportunities
Institution profile, authorized staff, associated people where permitted, opportunity discovery, partner companies, placement coordination, authorized application/placement monitoring, statistics and notifications.
Mode B — Recruit Interns
Publish opportunities, search Intern Passports, candidate filters, authorized CV access, shortlist, contact, applications, interviews, selection, placements, onboarding and recruitment analytics.
A university must never access unrelated organizations' private data.
16. Admin Dashboard
Manage platform overview, interns, companies, universities, verification, opportunity moderation, applications, user moderation, Intern Passport moderation, packages, featured opportunities, support, analytics, audit logs, security and platform configuration. Static public editorial copy is reviewed and changed in application source.
Admin manages operational data through the application, not source-code edits. Editorial content is maintained in application source.
17. Organization Verification

```text
Organization contacts MANTECH
        ↓
MANTECH verification
        ↓
Admin approves organization
        ↓
Organization account/staff access
        ↓
Organization manages its dashboard
```

Admin should not permanently act as the organization's recruiter.
18. Monetization
Interns are free at launch. Revenue primarily comes from companies and institutions.
Free
Organization profile, limited opportunities, basic applications and basic candidate discovery.
Professional
More opportunities, advanced candidate search/filters, larger candidate access, shortlisting, recruitment pipeline, interview management, analytics and branded organization profile.
Business
High/unlimited opportunity limits, advanced Intern Passport discovery, multiple recruiters, advanced analytics, bulk candidate management, featured opportunities, priority visibility, employer branding and priority support.
Enterprise / Institution
Custom contract, multiple departments/branches, multiple recruiter accounts, advanced permissions, institutional analytics, custom workflows, managed recruitment assistance, custom reports and dedicated support.
Additional revenue services
Featured internships, featured organizations, priority visibility, recruitment assistance, managed candidate sourcing, employer branding, institutional packages and premium analytics.
Payment rule
Do not implement Stripe or an online payment gateway.
When an organization wants to purchase/upgrade a package:
`Package → Contact MANTECH on WhatsApp → MANTECH handles payment/activation manually.`
WhatsApp is a communication channel, not the financial database. Keep the official MANTECH WhatsApp contact centralized in configuration.
19. UI/UX Direction
The website must feel like a serious professional company/product: premium, modern, bright/light-first, energetic, clean, polished, responsive and accessible.
Background images
Use high-quality relevant images as CSS `background-image` on major pages/sections where appropriate: hero, discovery, about, CTA and selected marketing sections. Use overlays/gradients for readable text. Do not make every section an image background.
Loading page
Use a premium loading experience with a video background and MANTECH branding. Optimize the video, provide graceful fallback and avoid unnecessary blocking.
Animation
Each major page/section should have appropriate, varied animation: hero reveal, staggered cards, scroll reveal, parallax, subtle scale, slide/fade, hover micro-interactions and polished transitions. Avoid repeating one animation everywhere. Keep animations performant.
UI components
Use shadcn/ui, Tailwind and carefully selected Uiverse components where useful. Adapt them to the MANTECH design system rather than copying random components.
Social icons
Use real recognizable brand icons and appropriate brand colors for WhatsApp, LinkedIn, Facebook, Instagram, YouTube, GitHub and other actual MANTECH social accounts. Do not use text substitutes.
Floating WhatsApp
Add a polished floating WhatsApp button at the bottom-left of the public website. It must use the real icon, open the configured MANTECH WhatsApp contact, work on desktop/mobile and avoid covering important UI.
20. Homepage Creative Direction
Make the homepage feel like a mini digital product/experience, not a basic landing page.
Recommended sections:
Premium animated hero.
Internship search inside hero.
Interactive “How MANTECH works”.
Two-sided marketplace: Find an Internship / Find an Intern.
Featured opportunities from database.
Featured organizations from database.
Intern Passport preview.
Professional fields explorer.
Cameroon locations explorer.
Why interns use MANTECH.
Why organizations use MANTECH.
University dual-purpose section.
Recruitment workflow.
Live platform statistics.
Featured/paid opportunities.
Editorial testimonials.
FAQ.
Strong CTA.
Footer with social icons/contact.
Creative ideas may include interactive cards, animated counters, profile previews, hover states, marketplace visualizations and scroll storytelling.
Production business statistics and marketplace records must be live and database-backed, not fake hardcoded data. Editorial copy is version-controlled application content.
21. Rich but Optimized Product
The project should be substantial, with many useful pages/subpages and high-quality assets. Do not interpret “7GB+” as a requirement to ship 7GB of unnecessary assets to every visitor.
Use image optimization, responsive images, lazy loading, optimized video, code splitting, caching, pagination, compressed assets and CDN-friendly files.
22. Security
Mandatory:
Clerk authentication;
MFA for sensitive roles/actions where appropriate;
server-side authorization;
RBAC;
organization isolation;
secure CV/file access;
signed/short-lived URLs where appropriate;
Zod validation;
rate limiting;
anti-enumeration;
secure headers;
safe error messages;
no client-side secrets;
audit logs;
sensitive-document access logging;
protected organization/member permissions;
database constraints.
Never trust client-side role information.
23. Notifications
Support notifications for applications, application status, shortlist, contact requests, interviews, selection, placement, onboarding, opportunity alerts, organization verification and account/package events.
Use database notification records and EmailJS where email is appropriate.
24. Core Database Entities
Minimum appropriate Prisma/Neon models:
User
InternProfile
InternPassport
Education
Qualification/Diploma
Skill
Field
Specialization
Industry
Location
Region
Organization
OrganizationType
OrganizationMember
CompanyProfile
UniversityProfile
Verification
InternshipOpportunity
Application
ApplicationStatusHistory
SavedOpportunity
SavedCandidate
CandidateContact/RecruitmentRequest
Interview
Placement
Onboarding
Notification
CV/FileMetadata
Package
OrganizationSubscription/PlanRequest
FeaturedOpportunity
AuditLog
Refine the exact schema after auditing the existing project.
25. Public Editorial Content
Keep public marketing copy and resource articles as reviewed, version-controlled application content. Deploy the application to publish editorial updates; no external CMS is used.
Do not hardcode operational business records such as interns, organizations, opportunities, applications, locations, packages, placements, notifications or analytics. Keep these in PostgreSQL/Prisma.
26. Cameroon
Support Cameroon regions, cities/towns, organization locations, internship locations, remote/hybrid/on-site and XAF/FCFA.
Locations must be database-managed. Keep architecture expandable to other countries later.
27. SEO / Accessibility
Implement server-rendered/indexable public pages where appropriate, metadata, Open Graph, structured SEO content, semantic HTML, accessible forms, keyboard navigation, focus states, alt text, responsive design and proper loading/error/empty states.
Public opportunity and organization pages should be SEO-friendly. Private Intern Passport information must not be indexed.
28. Antigravity Development Rules
Inspect the existing project before coding.
Preserve important existing work.
Do not restart from scratch.
Create a migration/change plan.
Reuse good existing components.
Use real database-backed functionality.
Never use fake dashboard data in production.
Never hardcode business records.
Never hardcode application URLs.
Centralize configuration.
Validate server-side.
Use strict TypeScript.
Centralize authorization.
Isolate organization data.
Implement real functionality behind important buttons.
Provide loading, empty and error states.
Do not expose CVs publicly.
Do not automatically distribute uploaded CVs to organization dashboards.
Do not reintroduce academic report/supervisor workflows.
Support all professional fields.
Keep intern access free at launch.
Payment requests go through WhatsApp.
Test unauthorized access explicitly.
Run typecheck, lint, build and tests after major phases.
Fix errors instead of hiding them.
Optimize for production, not screenshots only.
29. Implementation Order
Phase 1 — Existing Project Audit
Inspect package.json, routes, components, styles, assets, auth, database, Prisma and environment variables. Produce a preservation/change plan.
Phase 2 — Foundation
Finalize Prisma/Neon schema, Clerk, UploadThing, centralized configuration and authorization.
Phase 3 — Public Marketplace
Homepage, internship discovery, opportunity pages, company/university discovery, fields, locations, filtering and SEO.
Phase 4 — Intern
Registration, mandatory CV, phone, professional profile, Intern Passport, saved opportunities, applications, notifications and privacy.
Phase 5 — Company
Onboarding/verification, dashboard, opportunity management, candidate search, Intern Passport, CV access, applications, interviews, recruitment, placement and analytics.
Phase 6 — University
Dual-mode dashboard, opportunity support, recruiter mode, candidate discovery, opportunities, applications, placements and institutional analytics.
Phase 7 — Admin
Verification, user management, moderation, packages, featured content, analytics, support and audit/security. Public editorial content is reviewed and changed in application source.
Phase 8 — Monetization
Organization packages, usage limits, upgrade requests, WhatsApp payment contact and manual activation.
Phase 9 — Premium UI/UX
Background imagery, loading video, varied animations, responsive polish, Uiverse/shadcn components, social icons, floating WhatsApp and creative homepage interactions.
Phase 10 — Production Quality
Security tests, authorization tests, file-access tests, typecheck, lint, build, performance, accessibility, SEO, responsive testing and deployment readiness.
30. Final Product Principle

```text
                    MANTECH NEXUS

        ┌────────────────┴────────────────┐
        │                                 │
     INTERNS                         ORGANIZATIONS
        │                                 │
 Find opportunities                 Find interns
 Create profile                     Search candidates
 Upload CV                          View Intern Passports
 Apply                              Review CVs
 Contact                            Shortlist
                                    Interview
                                    Recruit
        │                                 │
        └──────────────┬──────────────────┘
                       │
                   CONNECTION
                       │
              INTERNSHIP PLACEMENT
```

MANTECH Nexus should feel like a real professional marketplace and recruitment company, not a basic academic project.
Build on the existing project. Preserve important work. Upgrade and complete it. Do not start from zero.
