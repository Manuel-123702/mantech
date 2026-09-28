# MANTECH --- MASTER SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## Enterprise Internship Management System

**Status:** Master implementation specification\
**Product:** MANTECH\
**Core purpose:** Internship management\
**Architecture:** Next.js + TypeScript + Clerk + Payload CMS +
PostgreSQL + Prisma + UploadThing + EmailJS\
**Package manager:** npm\
**Payments:** No Stripe initially; business/payment discussions through
MANTECH WhatsApp\
**Design:** Bright, clear, premium, professional enterprise IT/SaaS\
------------------------------------------------------------------------

# 1. EXECUTIVE SUMMARY

MANTECH is a secure, enterprise-grade **Internship Management System**
initially focused on Cameroon.

It connects:

- Students / Interns
- Companies / Host Organizations
- Universities / Higher Education Institutions
- Internship Supervisors
- MANTECH Administrators

MANTECH is **not primarily a generic job board and not a generic career
platform**.

Its central purpose is to manage the complete internship lifecycle:

``` text
Opportunity Discovery
        ↓
Student Readiness
        ↓
Application
        ↓
Review
        ↓
Shortlisting
        ↓
Interview
        ↓
Selection
        ↓
Placement
        ↓
Onboarding
        ↓
Active Internship
        ↓
Monitoring
        ↓
Reports
        ↓
Evaluations
        ↓
Completion
        ↓
MANTECH internal verification/status
        ↓
Digital Internship History
```

The final product should feel like a serious enterprise technology
product, not a simple school project or static job-board website.

------------------------------------------------------------------------

# 2. PRODUCT VISION

> **MANTECH manages an internship from opportunity discovery to verified
> completion.**

The system must centralize the process that is normally scattered
between websites, emails, WhatsApp messages, documents and spreadsheets.

The platform should provide:

1. A premium public website.
2. A specialized `/mantech-internship` portal.
3. Secure authentication and authorization.
4. Role-specific dashboards.
5. Internship opportunity management.
6. Application management.
7. Interview and selection workflows.
8. Placement and onboarding.
9. Internship supervision.
10. Reports and evaluations.
11. Verification/status.
12. Analytics.
13. B2B services and monetization.
14. A scalable foundation for future company/university portals.

------------------------------------------------------------------------

# 3. THE MAIN DIFFERENTIATOR

Do not build only:

``` text
Internship Listing
      ↓
Apply
```

Build:

``` text
Internship Opportunity
        ↓
Discovery
        ↓
Readiness
        ↓
Application
        ↓
Review
        ↓
Shortlist
        ↓
Interview
        ↓
Selection
        ↓
Placement
        ↓
Onboarding
        ↓
Active Internship
        ↓
Progress Monitoring
        ↓
Reports
        ↓
Evaluations
        ↓
Completion
        ↓
Verification/status
```

The **complete internship lifecycle** is the core competitive advantage.

------------------------------------------------------------------------

# 4. PROBLEMS TO SOLVE

## Students

MANTECH should reduce:

- Difficulty finding legitimate internships.
- Scattered application processes.
- Unclear application status.
- Poor preparation before applying.
- Manual document handling.
- Poor visibility during an internship.
- Lost reports and evaluation records.
- Difficulty proving internship completion.

## Companies

MANTECH should reduce:

- Manual candidate collection.
- Spreadsheet-based applicant tracking.
- Unstructured shortlisting.
- Poor interview coordination.
- Difficult intern monitoring.
- Manual report collection.
- Difficult evaluation tracking.

## Universities

MANTECH should reduce:

- Manual placement tracking.
- Poor visibility of active internships.
- Manual report collection.
- Difficult supervisor coordination.
- Poor completion statistics.

------------------------------------------------------------------------

# 5. USER ROLES

## 5.1 Student / Intern

Features:

- Register/login
- Profile
- Education
- Skills
- CV
- Documents
- Internship search
- Filters
- Saved internships
- Company following
- Matching
- Readiness
- Applications
- Application timeline
- Interviews
- Placement
- Onboarding
- Reports
- Notifications
- Evaluations
- Completion
- Internship history
- Dashboard History / Activity
- Career Passport access (eligible authenticated students only)

------------------------------------------------------------------------

## 5.2 Company

Features:

- Company registration
- Company profile
- Company verification
- Staff management
- Internship creation
- Requirements
- Application method configuration
- Application review
- Candidate pipeline
- Shortlisting
- Interviews
- Selection
- Placement
- Supervisor assignment
- Intern monitoring
- Reports
- Evaluations
- Analytics
- Notifications
- Billing/subscription information
- Company History / Activity
- Career Passport access (eligible authenticated companies only)

Companies must only access their organization's records.

------------------------------------------------------------------------

## 5.3 University

Features:

- Institutional profile
- Verification/status
- Authorized staff
- Permitted student records
- Placement monitoring
- Active internships
- Reports
- Evaluations
- Supervisors
- Statistics
- Exports
- Notifications
- Institution History / Activity
- Career Passport access (eligible authenticated universities only)

A university must never access unrelated institutions' private records.

------------------------------------------------------------------------

## 5.4 Internship Supervisor

Features:

- Assigned interns
- Internship objectives
- Progress timeline
- Reports
- Feedback
- Evaluations
- Concern flags
- Milestones
- Notifications
- Supervisor History / Activity
- Account/security settings

Supervisors only see internships explicitly assigned to them.

------------------------------------------------------------------------

## 5.5 MANTECH Administrators

Possible roles:

``` text
SUPER_ADMIN
ADMIN
CONTENT_ADMIN
VERIFICATION_ADMIN
SUPPORT_ADMIN
```

Permissions must follow least privilege.

------------------------------------------------------------------------

# 6. AUTHENTICATION --- CLERK

Use **Clerk** as the primary authentication and identity provider.

Do not create a competing custom authentication system.

Support:

- Email verification
- Secure sign-in
- Secure sign-up
- Password recovery where configured
- MFA for sensitive roles
- Session management
- Device/session controls
- Account security

Clerk answers:

> Who is the user?

MANTECH authorization answers:

> What is this user allowed to access?

------------------------------------------------------------------------

# 7. AUTHORIZATION AND SECURITY

Security must be enforced on the server.

Never rely on hiding buttons.

Example:

``` text
Student
  ↓
Own profile
Own applications
Own internship records

Company
  ↓
Own organization
Own opportunities
Own applications
Own interns

University
  ↓
Authorized institutional records

Supervisor
  ↓
Assigned internships

Admin
  ↓
Administrative resources
```

If a student manually enters:

``` text
/dashboard/admin
```

the server must deny access.

If a user changes an API request manually, authorization must still deny
unauthorized access.

------------------------------------------------------------------------

# 8. ORGANIZATION/TENANT ISOLATION

Companies and universities should be treated as organizations.

Example:

``` text
Company A
 ├── Members
 ├── Opportunities
 ├── Applications
 └── Interns

Company B
 ├── Members
 ├── Opportunities
 ├── Applications
 └── Interns
```

Company A must never access Company B.

Enforce isolation at:

- Database query
- API
- Server action
- Dashboard
- File access
- Search
- Export
- Reporting

------------------------------------------------------------------------

# 9. SECURE DASHBOARD ARCHITECTURE

Recommended routes:

``` text
/dashboard/student
/dashboard/company
/dashboard/university
/dashboard/supervisor
/dashboard/admin
```

Access flow:

``` text
Authentication
      ↓
Role
      ↓
Organization
      ↓
Permission
      ↓
Resource ownership
      ↓
Data
```

Buttons are only UI.

The server is the final authority.

------------------------------------------------------------------------

# 10. CAREER PASSPORT --- SEPARATE COMPANION WEB APPLICATION

Career Passport replaces the previously proposed public
`/mantech-verify` concept.

There must be **no public `/mantech-verify` page and no QR-based public
verification portal** in the current product scope.

Career Passport is a separate companion website/application, distinct
from the main MANTECH operational application.

Conceptually:

``` text
MANTECH Main Platform
        ↓
Existing authenticated account
        ↓
Eligible role detected
(Student / Company / University)
        ↓
Career Passport button appears
        ↓
Open in a NEW browser tab
        ↓
Separate Career Passport application
```

Career Passport is not a second MANTECH dashboard. It is a curated
presentation of selected important information from the user's MANTECH
journey.

## 10.1 Eligible Users

Career Passport is available only to:

- Student
- Company
- University

It is not available to:

- Internship Supervisor
- MANTECH Administrator

## 10.2 Authentication and Access

The user must first authenticate through the normal MANTECH account
system.

The main MANTECH navbar must dynamically show:

``` text
Student signed in   → Career Passport
Company signed in   → Career Passport
University signed in → Career Passport
Supervisor signed in → no Career Passport button
Admin signed in      → no Career Passport button
Logged out           → no Career Passport button
```

Career Passport must not appear in the public navbar or public footer
initially.

When an eligible authenticated user clicks the button, Career Passport
opens in a **new browser tab**.

Do not expose user identity through insecure query strings such as:

``` text
/Career-Passport?userId=123
```

The separate application must securely validate the authenticated
identity/session and then load only the permitted account.

## 10.3 Additional Security

Because Career Passport is a separate application, access must be
strongly protected.

Implement where appropriate:

- Clerk authentication/session validation
- MFA / 2FA
- Re-authentication for sensitive actions
- Role validation
- Account status validation
- Organization validation
- Server-side authorization
- Resource ownership checks
- Rate limiting
- Anti-enumeration
- Secure headers
- Audit logging
- Secure cross-application authentication flow

Mandatory security expectations:

``` text
Student A → own Passport                  ALLOW
Company A → own Passport                  ALLOW
University A → own Passport               ALLOW

Student A → Student B Passport            DENY
Company A → Company B Passport            DENY
University A → University B Passport      DENY

Company A → University A Passport         DENY
University A → Company A Passport          DENY
Supervisor → Passport                      DENY
Unauthorized/expired session               DENY
```

Never trust a browser-supplied user ID, organization ID or role.

## 10.4 Career Passport Purpose

Career Passport should display the **most important and meaningful
information**, not every piece of live MANTECH data.

It is a professional reference/presentation experience that becomes more
valuable as the user's MANTECH journey develops.

It should communicate meaningful progress such as:

``` text
Journey
  ↓
Experience
  ↓
Skills
  ↓
Achievements
  ↓
Development
```

It must not become a copy of the dashboard.

## 10.5 Student Career Passport

The Student Passport should present selected information such as:

- Personal profile
- Education
- Skills
- Internship applications
- Application status/timeline
- Saved internships where useful
- Interviews
- Current placement
- Onboarding progress where appropriate
- Internship reports / completed work where appropriate
- Evaluations
- Completed internships
- Internship history
- MANTECH notifications where appropriate
- Career development
- Achievements

The career-focused presentation should emphasize:

``` text
🎓 Education
      ↓
💼 Internship Experience
      ↓
🏢 Companies Worked With
      ↓
📊 Experience Timeline
      ↓
🛠 Skills Gained
      ↓
⭐ Evaluations
      ↓
📄 Reports / Completed Projects
      ↓
🏆 Achievements
      ↓
📈 Career Development
```

The Student Passport is **not a CV builder**.

Do not build:

- CV editor
- Resume template builder
- CV PDF generator
- Resume-writing workflow

The student's CV/document can remain an uploaded document in MANTECH
where required; Career Passport should not recreate a CV authoring
system.

## 10.6 Company Passport --- Company Workspace

A company should not receive a CV-oriented passport.

Its Career Passport should present an organization-focused professional
profile and internship history.

Include selected information such as:

- Company profile
- Company verification/status
- Company members where appropriate
- Internship opportunities
- Internship activity
- Applications managed
- Candidate pipeline summary
- Shortlisted candidates where appropriate
- Interviews
- Selected candidates
- Placements
- Assigned supervisors
- Intern monitoring
- Internship reports
- Evaluations
- Analytics/summary statistics
- Company activity/history
- Organization development

Presentation concept:

``` text
🏢 Company Profile
      ↓
📋 Internship Opportunities
      ↓
👥 Candidates Managed
      ↓
🎯 Selections
      ↓
🤝 Placements
      ↓
👨‍🎓 Interns Hosted
      ↓
📊 Internship Activity
      ↓
⭐ Evaluations
      ↓
📈 Organization Development
```

Never expose confidential candidate information, private documents,
internal notes or unrelated company data.

## 10.7 University Passport --- Institution Workspace

A university should receive an institution-oriented Passport rather than
a student-style career profile.

Include selected information such as:

- University profile
- Institution verification/status
- Authorized staff where appropriate
- Students associated with the institution where permitted
- Internship placements
- Active internships
- Completed internships
- Partner companies
- Supervisors
- Student reports where authorized
- Evaluations
- Completion records
- Internship statistics
- Institution activity/history
- Institutional development

Presentation concept:

``` text
🎓 Institution
      ↓
👨‍🎓 Students
      ↓
💼 Internship Opportunities
      ↓
🤝 Placements
      ↓
🏢 Partner Companies
      ↓
👨‍💼 Supervisors
      ↓
📄 Reports
      ↓
⭐ Evaluations
      ↓
📊 Internship Statistics
      ↓
📈 Institutional Development
```

Never expose private student records beyond the information explicitly
authorized for the Passport.

## 10.8 Career Passport and Dashboard History

Each of the five MANTECH dashboards must already contain its own
History/Activity section:

``` text
Student Dashboard    → Student History
Company Dashboard    → Company History
University Dashboard → Institution History
Supervisor Dashboard → Supervisor History
Admin Dashboard      → Administrative Activity/History
```

Career Passport does not replace this History module.

History is the operational record inside MANTECH.

Career Passport is the selected professional/organizational presentation
of meaningful information.

## 10.9 Career Passport Data Principles

PostgreSQL + Prisma remains the transactional source of truth.

Career Passport should consume authorized information through a secure
service/data-access layer.

Conceptually:

``` text
MANTECH Transactional Data
        ↓
Authorization / Ownership Checks
        ↓
Selected Passport Data
        ↓
Career Passport Presentation
```

Do not create unnecessary duplicate transactional records.

If a projection/read model is needed for performance, it must remain
derived from the authoritative MANTECH data.

## 10.10 Privacy

Career Passport is private by default.

It must not expose:

- Private phone numbers unless explicitly designed and authorized
- Private emails unless explicitly designed and authorized
- Private CV files
- Confidential reports
- Private evaluation comments
- Internal company notes
- Sensitive university information
- Other users' information

A future controlled sharing feature may be considered separately, but it
is outside the current scope.

------------------------------------------------------------------------

# 11. DIGITAL INTERNSHIP RECORD

An internship is a complete digital record:

``` text
Student
Company
University
Internship
Supervisor
Start Date
End Date
Objectives
Reports
Evaluations
Completion
Internship History
```

This creates a persistent MANTECH internship history. Any internal
trust/status information remains permission-controlled and is not
exposed through a public verification portal.

------------------------------------------------------------------------

# 12. INTERNSHIP OPPORTUNITY MANAGEMENT

Internships must **never be hardcoded** in React/Next.js source code.

Authorized users create them through the dashboard.

Fields:

- Title
- Description
- Company
- Industry
- Department
- Field
- Required skills
- Preferred skills
- Education requirement
- Region
- City
- Location
- Work mode
- Duration
- Start date/period
- End date/period
- Application deadline
- Paid/unpaid
- Allowance
- Number of positions
- Requirements
- Required documents
- Application method
- Application URL
- Instructions
- Contact information
- Featured status
- Moderation status
- SEO data
- Created date
- Updated date

------------------------------------------------------------------------

# 13. OPPORTUNITY MODERATION

Statuses:

``` text
Draft
Pending Review
Approved
Published
Suspended
Expired
Archived
Rejected
```

MANTECH administrators can moderate opportunities.

Quality checks should include:

- Company identity
- Complete description
- Requirements
- Location
- Deadline
- Application method
- Application URL
- Appropriate content

------------------------------------------------------------------------

# 14. THREE APPLICATION METHODS

Every internship can use one of three methods.

## Method 1 --- Apply on MANTECH

Button:

> Apply on MANTECH

Student completes the MANTECH application.

Record:

- Student
- Internship
- Date
- Status
- Documents
- Timeline

## Method 2 --- Company Website

Button:

> Apply on Company Website

Open the configured official company application page.

## Method 3 --- External Platform

Button:

> Apply Externally

Examples:

- LinkedIn
- University portal
- Official application portal
- Other legitimate platform

Store:

- Platform name
- URL
- Instructions

All URLs must be validated.

Never use arbitrary JavaScript URLs or unsafe redirects.

Application method configuration must come from data/CMS/database, not
hardcoded frontend code.

------------------------------------------------------------------------

# 15. APPLICATION WORKFLOW

Internal MANTECH applications:

``` text
Draft
   ↓
Submitted
   ↓
Under Review
   ↓
Shortlisted
   ↓
Interview
   ↓
Selected
   ↓
Placement Pending
   ↓
Placed
   ↓
Internship Active
   ↓
Completed
```

Alternative states:

``` text
Rejected
Withdrawn
Expired
Cancelled
```

------------------------------------------------------------------------

# 16. APPLICATION TIMELINE

Student example:

``` text
12 Jan
Application submitted

14 Jan
Application reviewed

18 Jan
Shortlisted

20 Jan
Interview scheduled

25 Jan
Selected

27 Jan
Placement confirmed
```

Internal company notes must remain private.

------------------------------------------------------------------------

# 17. STUDENT READINESS SYSTEM

Provide a preparation checklist:

``` text
Profile              ✓
Education            ✓
CV                   ✓
Skills               ✓
Documents            ✗

Readiness             80%
```

Explain missing requirements.

The score must never be presented as a guarantee of selection.

------------------------------------------------------------------------

# 18. INTERNSHIP MATCHING

Create transparent recommendations based on:

- Field
- Skills
- Education
- Region
- City
- Duration
- Work mode
- Preferences
- Requirements

Example:

``` text
Why this matches you

✓ Software Engineering
✓ Douala
✓ 3 months
✓ TypeScript
✓ Education requirement met
```

Recommendations should be explainable.

Do not automatically reject candidates using AI.

------------------------------------------------------------------------

# 19. SAVED INTERNSHIPS AND ALERTS

Students can:

- Save internships
- Follow companies
- Save searches
- Create alerts

Example:

> Notify me when Software Engineering internships become available in
> Douala.

------------------------------------------------------------------------

# 20. INTERVIEW MANAGEMENT

Companies can create:

- Interview date
- Time
- Type
- Interviewer
- Meeting information
- Instructions
- Status

Sensitive meeting information is visible only to authorized
participants.

------------------------------------------------------------------------

# 21. PLACEMENT MANAGEMENT

Selection is separate from placement.

Placement contains:

- Student
- Company
- Internship
- University where applicable
- Supervisor
- Start date
- End date
- Objectives
- Documents
- Status

Statuses:

``` text
Pending
Confirmed
Active
Completed
Cancelled
```

------------------------------------------------------------------------

# 22. ONBOARDING

Pre-internship checklist:

``` text
Placement confirmed       ✓
Company confirmation      ✓
Documents                 ✓
Supervisor assigned       ✓
Objectives defined        ✓
Start date confirmed      ✓
```

------------------------------------------------------------------------

# 23. INTERNSHIP MONITORING

Create a timeline:

``` text
Week 1
Onboarding

Week 2
Progress update

Week 4
Report

Week 6
Supervisor review

Week 8
Progress review

Final period
Evaluation
```

Schedules must be configurable.

------------------------------------------------------------------------

# 24. INTERNSHIP HEALTH MONITOR

Operational indicators:

``` text
Healthy
Attention Needed
At Risk
```

Possible triggers:

- Overdue report
- Missing update
- Missing evaluation
- Unresolved concern
- Incomplete onboarding
- Internship deadline approaching

This is an operational alert, not a judgment of the student's value.

------------------------------------------------------------------------

# 25. REPORT MANAGEMENT

Support:

- Weekly reports
- Monthly reports
- Midterm reports
- Final reports

Each report can contain:

- File
- Submission date
- Status
- Review
- Feedback
- Version/history where needed

------------------------------------------------------------------------

# 26. EVALUATIONS

## Supervisor evaluation

Possible criteria:

- Attendance
- Technical development
- Communication
- Professional behavior
- Task completion
- Learning progress

## Company evaluation

Structured organizational feedback.

## Student reflection

- Skills learned
- Achievements
- Challenges
- Learning summary
- Suggestions

Visibility must be permission-controlled.

------------------------------------------------------------------------

# 27. COMPANY TRUST PROFILES

Public company profiles may include:

- Name
- Description
- Industry
- Location
- Website
- Public contact
- Verification/status status
- Internship opportunities
- Success stories

Verification/status badges must have real verification criteria.

------------------------------------------------------------------------

# 28. UNIVERSITY MANAGEMENT

University dashboard:

- Institution
- Staff
- Students where permitted
- Placements
- Active internships
- Reports
- Evaluations
- Supervisors
- Completion
- Statistics
- Exports

------------------------------------------------------------------------

# 29. COMPANY MANAGEMENT

Company dashboard:

- Company profile
- Verification/status
- Staff
- Internship management
- Applications
- Candidate pipeline
- Interviews
- Selection
- Placement
- Supervisors
- Interns
- Reports
- Evaluations
- Analytics

------------------------------------------------------------------------

# 30. ADMIN MANAGEMENT

Admin features:

- Users
- Organizations
- Internships
- Moderation
- Verification/status
- CMS
- Pricing
- Analytics
- Audit logs
- Security events
- System settings

Use least privilege.

------------------------------------------------------------------------

# 31. PUBLIC WEBSITE

Required pages:

``` text
/
 /about
 /how-it-works
 /services
 /pricing
 /internships
 /companies
 /universities
 /success-stories
 /testimonials
 /resources
 /faq
 /contact
  /security
 /privacy
 /terms
 /accessibility
```

------------------------------------------------------------------------

# 32. MANTECH INTERNSHIP PORTAL

Create:

``` text
/mantech-internship
```

The portal should feel like a dedicated product while sharing the same
backend and identity system.

Suggested routes:

``` text
/mantech-internship
/mantech-internship/opportunities
/mantech-internship/opportunities/[slug]
/mantech-internship/companies
/mantech-internship/saved
```

Main experience:

``` text
Discover
Search
Filter
Match
Prepare
Apply
Track
Manage
```

------------------------------------------------------------------------

# 33. WHY THE SECOND PORTAL EXISTS

Public website:

``` text
Brand
Trust
Services
Companies
Universities
Business
```

Internship portal:

``` text
Discovery
Applications
Tracking
Internship operations
```

It is connected, not a separate disconnected project.

------------------------------------------------------------------------

# 34. FUTURE PORTALS

Future:

``` text
/mantech-company
/mantech-university
```

These can become specialized B2B portals sharing the same secure core.

------------------------------------------------------------------------

# 35. CAMEROON-FIRST REQUIREMENTS

Support all 10 regions.

Include:

- Regions
- Cities/towns
- XAF / FCFA
- English
- French
- Local companies
- Local universities

Filters:

``` text
Region
City
Field
Industry
Duration
Paid / Unpaid
On-site / Hybrid / Remote
Deadline
```

------------------------------------------------------------------------

# 36. MULTILINGUAL ARCHITECTURE

Build English/French readiness from the beginning.

Do not scatter hardcoded UI strings through components.

Use a localization architecture that can support additional languages
later.

------------------------------------------------------------------------

# 37. PAYLOAD CMS

Use Payload CMS for editable content.

Administrators can manage:

- Homepage
- Hero sections
- Background images
- About
- Services
- Testimonials
- Success stories
- FAQs
- Resources
- Pricing display
- Marketing banners
- SEO
- Site settings
- Media

Normal content changes must not require source-code edits.

------------------------------------------------------------------------

# 38. POSTGRESQL + PRISMA

Use PostgreSQL + Prisma for transactional business data:

``` text
Users/profile references
Organizations
Students
Companies
Universities
Supervisors
Internships
Applications
Interviews
Placements
Onboarding
Reports
Evaluations
Notifications
Verification/status
Audit records
Saved internships
Alerts
```

Keep ownership clear between Payload and Prisma.

Do not create conflicting duplicate sources of truth.

------------------------------------------------------------------------

# 39. CLERK + DATABASE

Recommended relationship:

``` text
Clerk User
      ↓
MANTECH User/Profile
      ↓
Role
      ↓
Organization
      ↓
Permissions
```

Never trust role values supplied by the browser.

------------------------------------------------------------------------

# 40. FILE STORAGE

Use UploadThing for production object storage.

Potential files:

- CVs
- Reports
- Certificates
- Evaluation documents
- Company documents
- University documents
- Images

Protected documents must not be publicly accessible.

------------------------------------------------------------------------

# 41. FILE SECURITY

Access flow:

``` text
Request
   ↓
Authenticate
   ↓
Authorize
   ↓
Ownership check
   ↓
Organization check
   ↓
Resource permission
   ↓
Short-lived access
```

Changing a file ID must never expose another user's file.

------------------------------------------------------------------------

# 42. EMAILJS

Use EmailJS for required email communication.

Examples:

- Welcome
- Application confirmation
- Status update
- Interview
- Selection
- Placement
- Report reminder
- Evaluation reminder
- Completion
- Administrative messages

Do not expose secret credentials.

------------------------------------------------------------------------

# 43. NOTIFICATION CENTER

Notification categories:

``` text
Application
Interview
Placement
Report
Evaluation
Verification/status
System
Business
```

Users can mark notifications as read.

------------------------------------------------------------------------

# 44. REMINDERS

Support reminders for:

- Application deadlines
- Interviews
- Reports
- Evaluations
- Internship start
- Internship end
- Missing onboarding

------------------------------------------------------------------------

# 45. CALENDAR

Optional calendar:

- Interviews
- Internship start/end
- Report deadlines
- Evaluation deadlines
- Meetings

------------------------------------------------------------------------

# 46. AUDIT LOGS

Record important actions:

``` text
Role changed
Member added
Internship published
Application status changed
Report submitted
Evaluation submitted
Verification/status created
Verification/status revoked
Sensitive document accessed
```

Restrict audit log access.

------------------------------------------------------------------------

# 47. SECURITY REQUIREMENTS

Implement:

- Clerk authentication
- MFA for sensitive roles
- Server-side RBAC
- Organization isolation
- API authorization
- File authorization
- Signed temporary URLs
- Rate limiting
- Input validation
- Zod
- Secure headers
- Secret management
- Audit logging
- Security event monitoring
- Backups
- Recovery strategy
- Anti-enumeration
- Secure error handling

Never expose secrets or stack traces.

------------------------------------------------------------------------

# 48. RATE LIMITING

Protect:

- Authentication-related endpoints
- Public verification
- Applications
- Contact forms
- Search where necessary
- File operations
- Sensitive admin APIs

------------------------------------------------------------------------

# 49. ANTI-ENUMERATION

Do not use predictable private IDs.

Use high-entropy verification IDs.

Do not reveal whether arbitrary private IDs are valid.

------------------------------------------------------------------------

# 50. FRAUD AND ABUSE

Protect against:

- Fake companies
- Fake opportunities
- Spam applications
- Duplicate accounts
- Malicious links
- Document abuse
- Verification/status abuse

Use:

- Verification/status
- Moderation
- Rate limiting
- Audit logs
- URL validation
- Account controls

------------------------------------------------------------------------

# 51. PUBLIC SEARCH

Search by:

- Keyword
- Field
- Company
- Region
- City
- Duration
- Work mode
- Paid/unpaid
- Deadline

Private search must return only authorized records.

------------------------------------------------------------------------

# 52. ANALYTICS

## Student

- Applications
- Statuses
- Internship history
- Reports
- Completion

## Company

- Opportunities
- Applications
- Shortlists
- Interviews
- Selections
- Active interns
- Completed internships

## University

- Placements
- Active internships
- Completed internships
- Reports
- Evaluations
- Regional/field distribution

## Admin

- Users
- Companies
- Universities
- Opportunities
- Applications
- Placements
- Completion
- Verification/status
- Growth
- Operational metrics

------------------------------------------------------------------------

# 53. EXPORTS

Authorized users may export:

- CSV
- PDF where useful

Exports must obey normal authorization.

------------------------------------------------------------------------

# 54. RESOURCE CENTER

Create useful content:

- CV preparation
- Internship application
- Interview preparation
- Professional behavior
- Internship reports
- Technical preparation
- Student onboarding
- Supervisor guidance

------------------------------------------------------------------------

# 55. COMPANY RESOURCE CENTER

Include:

- Creating quality internships
- Supervising interns
- Evaluating interns
- Onboarding
- Internship best practices

------------------------------------------------------------------------

# 56. UNIVERSITY RESOURCE CENTER

Include:

- Internship coordination
- Monitoring
- Evaluation
- Student preparation
- Reporting
- Institutional internship management

------------------------------------------------------------------------

# 57. SUCCESS STORIES

CMS-managed success stories:

``` text
Student
   ↓
Internship
   ↓
Skills learned
   ↓
Experience
   ↓
Completion
```

Only publish with appropriate permission.

Never fabricate stories.

------------------------------------------------------------------------

# 58. TESTIMONIALS

Payload fields:

- Name
- Role
- Organization
- Testimonial
- Image
- Published status

Never fabricate testimonials.

------------------------------------------------------------------------

# 59. STUDENT FEEDBACK

Allow feedback about:

- Application
- Company onboarding
- Internship
- Supervision
- MANTECH support

Use privacy and moderation controls.

------------------------------------------------------------------------

# 60. COMPANY FEEDBACK

Allow structured feedback about:

- Student readiness
- Skills
- Internship workflow
- Support
- Experience

------------------------------------------------------------------------

# 61. INTERNSHIP QUALITY INSIGHTS

Aggregate data may show:

- Popular fields
- Regional opportunity gaps
- Common skills
- Duration patterns
- Application trends

Do not expose sensitive individual data.

------------------------------------------------------------------------

# 62. FUTURE AI

AI may later assist with:

- Internship description improvement
- CV guidance
- Matching
- Resource recommendations
- Preparation
- Report-writing guidance
- Opportunity summaries

AI must not automatically reject candidates or make unsupported
high-impact decisions.

------------------------------------------------------------------------

# 63. FUTURE AI ASSISTANT

Possible questions:

> Which internships match my skills?

> What documents do I need?

> What should I do before my internship?

> When is my next report due?

The assistant must only use information the authenticated user can
access.

------------------------------------------------------------------------

# 64. FUTURE MARKET INTELLIGENCE

With enough legitimate aggregate data, MANTECH may offer:

- Skill-demand insights
- Regional opportunity insights
- Internship demand
- Industry trends
- Common requirements

This can become a premium B2B analytics service.

------------------------------------------------------------------------

# 65. FUTURE ENTERPRISE API

Potential clients:

- Universities
- Large companies
- HR systems
- Student information systems

Use:

- API keys
- OAuth where appropriate
- Scopes
- Rate limits
- Authorization
- Audit logs

------------------------------------------------------------------------

# 66. BUSINESS MODEL

MANTECH should primarily monetize organizations.

## Companies

Potential plans:

``` text
Basic
Professional
Business
Enterprise
```

Premium services:

- Featured opportunities
- Premium profile
- Candidate management
- Multiple recruiters
- Supervisor management
- Internship monitoring
- Analytics
- Reports
- Verification/status
- Priority support

------------------------------------------------------------------------

# 67. UNIVERSITY REVENUE

Offer institutional contracts for:

- University dashboard
- Student monitoring
- Placement management
- Supervisor management
- Reports
- Analytics
- Support

------------------------------------------------------------------------

# 68. ENTERPRISE SERVICES

Target:

- Large companies
- Universities
- NGOs
- Institutions
- Training organizations

Offer:

- Custom workflows
- Enterprise support
- Integrations
- Administration
- Reporting
- Verification/status

------------------------------------------------------------------------

# 69. MANAGED MANTECH SERVICES

Potential services:

- Internship coordination
- Company verification
- Internship administration
- Training
- Onboarding
- Custom reporting
- Enterprise support

------------------------------------------------------------------------

# 70. PAYMENT STRATEGY

Do not implement Stripe initially.

Display pricing in:

``` text
XAF / FCFA
```

Example:

``` text
Professional
XAF XXX,XXX

University Package
XAF XXX,XXX

Enterprise
Custom
```

CTA:

> Contact MANTECH on WhatsApp

The actual commercial/payment process is discussed directly with
MANTECH.

WhatsApp is a communication channel, not the primary system database.

------------------------------------------------------------------------

# 71. WHATSAPP

Use WhatsApp for:

- Business inquiries
- Pricing
- Enterprise requests
- Support escalation
- Partnerships

Do not send private internship records through WhatsApp.

------------------------------------------------------------------------

# 72. SOCIAL LINKS

Include useful professional channels:

- GitHub
- LinkedIn
- WhatsApp
- Official email

Do not add social platforms simply to fill space.

------------------------------------------------------------------------

# 73. UI/UX DESIGN

The website must look like a premium enterprise IT/SaaS company.

Design characteristics:

- Bright
- Clear
- Premium
- Professional
- Modern
- Spacious
- Excellent typography
- High readability
- Light surfaces
- Professional cards
- Subtle gradients
- Strong hierarchy

Avoid a predominantly dark theme.

Recommended visual direction:

``` text
White / light surfaces
Blue technology/trust tones
Orange accent
Complementary light colors
Subtle gradients
Professional photography
```

Do not make every section multicolored.

------------------------------------------------------------------------

# 74. EXISTING LOGO

Use the existing MANTECH logo provided by the owner.

Do not generate a new generic logo.

The complete visual system should be designed around the existing logo.

------------------------------------------------------------------------

# 75. BACKGROUND IMAGERY

Use professional images as CSS `background-image` or an equivalent
background-image implementation where appropriate.

Use them in selected:

- Home hero
- About hero
- Internship portal hero
- Company sections
- University sections
- Services
- Success stories
- CTA sections

Use overlays where needed for readability.

Do not use giant images everywhere.

Optimize all images.

------------------------------------------------------------------------

# 76. PREMIUM ANIMATION

Use Framer Motion and CSS transitions for:

- Page transitions
- Hero entrances
- Section reveals
- Cards
- Hover states
- Dashboard transitions
- Modals
- Progress indicators
- Notifications
- Success states

Animation must feel premium and professional.

Do not animate everything at once.

Support:

``` text
prefers-reduced-motion
```

------------------------------------------------------------------------

# 77. PREMIUM LOADING EXPERIENCE

Create a premium initial loading screen using the real MANTECH logo.

It should:

- Be short
- Be smooth
- Avoid unnecessary blocking
- Transition into the application professionally

Use skeleton loaders for dashboard content instead of full-screen
loading every time.

------------------------------------------------------------------------

# 78. ACCESSIBILITY

Support:

- Keyboard navigation
- Semantic HTML
- Proper labels
- Focus states
- Screen-reader support
- Good contrast
- Reduced motion
- Accessible forms
- Clear validation

------------------------------------------------------------------------

# 79. RESPONSIVE DESIGN

Support:

- Desktop
- Laptop
- Tablet
- Mobile

Dashboards must remain usable on mobile.

Do not simply shrink desktop layouts.

------------------------------------------------------------------------

# 80. PERFORMANCE

Use:

- Optimized images
- Lazy loading
- Server components where appropriate
- Dynamic imports
- Pagination
- Efficient queries
- Caching
- CDN
- Background processing where appropriate

Premium visuals must not make the website slow.

------------------------------------------------------------------------

# 81. SEO

Public pages should include:

- Metadata
- Open Graph
- Structured data where appropriate
- Canonical URLs
- Sitemap
- Robots
- SEO-friendly opportunity pages

Never expose private dashboard information.

------------------------------------------------------------------------

# 82. TRUST PAGES

Include:

``` text
/security
/privacy
/terms
/accessibility
```

Security explanations should not expose exploitable implementation
details.

------------------------------------------------------------------------

# 83. TECHNICAL STACK

Required/recommended technologies:

``` text
Frontend:
Next.js
React
TypeScript
Tailwind CSS
Framer Motion

Authentication:
Clerk

CMS:
Payload CMS

Database:
PostgreSQL

ORM:
Prisma

Production file storage:
UploadThing

Email:
EmailJS

Validation:
Zod

Forms:
React Hook Form

Testing:
Vitest or Jest
Playwright

Version control:
Git + GitHub

Package manager:
npm
```

Do not add dependencies without a real requirement.

------------------------------------------------------------------------

# 84. STARTER PROJECT

The implementation must start from an existing Payload/Next.js starter.

Recommended starting point:

``` text
https://github.com/brijr/payload-starter
```

The repository should be inspected at implementation time because
versions may change.

The starter is a foundation, not the final MANTECH architecture.

------------------------------------------------------------------------

# 85. STARTER INSTALLATION WITH NPM

Recommended initial workflow:

``` powershell
git clone https://github.com/brijr/payload-starter.git mantech
cd mantech
del pnpm-lock.yaml
npm install
npm run dev
```

First verify that the unmodified starter works.

Then commit the clean base.

Do not immediately install every MANTECH dependency.

Inspect the starter first to avoid duplicate or conflicting packages.

------------------------------------------------------------------------

# 86. STARTER TRANSFORMATION

Workflow:

``` text
Payload Starter
      ↓
Inspect
      ↓
Preserve useful infrastructure
      ↓
Remove conflicting features
      ↓
Integrate Clerk
      ↓
Configure PostgreSQL/Prisma
      ↓
Configure R2
      ↓
Configure EmailJS
      ↓
Create MANTECH domain
      ↓
Build internship workflow
      ↓
Build dashboards
      ↓
Apply MANTECH design
```

Reuse:

- Existing UI primitives
- Layouts
- Payload setup
- Database setup where useful
- Media components
- Forms
- SEO utilities
- Error/loading infrastructure

------------------------------------------------------------------------

# 87. DATABASE ENTITIES

Core entities:

``` text
User
StudentProfile
Company
CompanyMember
University
UniversityMember
Supervisor
Internship
InternshipRequirement
Application
ApplicationDocument
Interview
Placement
OnboardingItem
InternshipReport
Evaluation
Notification
CareerPassportProfile
CareerPassportVisibility
CareerPassportSection
CareerPassportAchievement
CareerPassportExperience
AuditLog
SavedInternship
Alert
```

Add additional entities only when justified.

------------------------------------------------------------------------

# 88. PAYLOAD CONTENT COLLECTIONS

Possible collections/globals:

``` text
Pages
Media
Testimonials
SuccessStories
FAQs
Resources
Services
Pricing
SiteSettings
Navigation
SEO
MarketingBanners
```

------------------------------------------------------------------------

# 89. DATA OWNERSHIP

Recommended:

``` text
Clerk
→ Authentication identity

PostgreSQL + Prisma
→ Transactional internship data

Payload
→ CMS/content

UploadThing
→ Files

EmailJS
→ Email communication

Career Passport
→ Separate presentation application consuming selected authorized MANTECH information
```

Avoid two systems becoming competing sources of truth.

------------------------------------------------------------------------

# 90. ROUTE STRUCTURE

Suggested public routes:

``` text
/
/about
/how-it-works
/services
/pricing
/internships
/companies
/universities
/success-stories
/testimonials
/resources
/faq
/contact
/security
/privacy
/terms
/accessibility
```

Internship portal:

``` text
/mantech-internship
/mantech-internship/opportunities
/mantech-internship/opportunities/[slug]
/mantech-internship/companies
/mantech-internship/saved
```

Authentication:

``` text
/sign-in
/sign-up
```

Dashboards:

``` text
/dashboard/student
/dashboard/company
/dashboard/university
/dashboard/supervisor
/dashboard/admin
```

Career Passport:

``` text
Separate application / deployment
```

The Career Passport application must not be treated as another public
MANTECH route. The MANTECH navbar provides the authenticated entry point
for eligible roles and opens the Passport in a new browser tab.

Exact routing can adapt to the starter.

------------------------------------------------------------------------

# 91. REUSABLE COMPONENTS

Create reusable:

``` text
Navbar
Footer
Hero
SectionHeader
OpportunityCard
CompanyCard
UniversityCard
StatusBadge
ApplicationTimeline
ProgressBar
DashboardSidebar
DashboardHeader
DataTable
FilterBar
SearchBar
FileUploader
NotificationCenter
Modal
ConfirmDialog
EmptyState
ErrorState
Skeleton
```

Avoid duplicated UI.

------------------------------------------------------------------------

# 92. FORM ARCHITECTURE

Use:

``` text
React Hook Form
+
Zod
+
Server-side validation
```

All important forms require:

- Labels
- Validation
- Error messages
- Loading state
- Success state
- Accessible controls

------------------------------------------------------------------------

# 93. ERROR HANDLING

Create:

``` text
404
403
500
```

plus professional form/network/permission/upload error states.

Never expose internal stack traces.

------------------------------------------------------------------------

# 94. TESTING REQUIREMENTS

Use:

``` text
Unit testing
Integration testing
End-to-end testing
Security testing
Accessibility testing
```

Recommended:

``` text
Vitest/Jest
Playwright
```

Critical flow:

``` text
Student registers
       ↓
Creates profile
       ↓
Finds internship
       ↓
Applies
       ↓
Company receives
       ↓
Company reviews
       ↓
Shortlists
       ↓
Interview
       ↓
Selection
       ↓
Placement
       ↓
Supervisor assigned
       ↓
Reports
       ↓
Evaluation
       ↓
Completion
       ↓
Verification/status
```

------------------------------------------------------------------------

# 95. SECURITY TEST MATRIX

Illustrative authorization model:

  Resource                           Student   Company   University   Supervisor   Admin
  -------------------------------- --------- --------- ------------ ------------ -------
  Own profile                              ✓        \-           \-           \-       ✓
  Own applications                         ✓        \-           \-           \-       ✓
  Company applications                    \-         ✓           \-           \-       ✓
  University placements                   \-        \-            ✓           \-       ✓
  Assigned interns                        \-        \-           \-            ✓       ✓
  Admin settings                          \-        \-           \-           \-       ✓
  Verification/status management          \-        \-           \-           \-       ✓

The actual permission matrix should be implemented and tested centrally.

------------------------------------------------------------------------

# 96. BACKUP AND RECOVERY

Production requires:

- Database backups
- Recovery strategy
- File storage protection
- Secret management
- Disaster recovery procedure
- Restore testing

A backup is not sufficient unless restoration is tested.

------------------------------------------------------------------------

# 97. OBSERVABILITY

Monitor:

- Application errors
- API errors
- Database errors
- Authentication failures
- Authorization failures
- Storage errors
- Security events
- Performance

Do not log sensitive data unnecessarily.

------------------------------------------------------------------------

# 98. DEPLOYMENT

Use separate environments:

``` text
Development
Staging
Production
```

Environment variables should hold:

``` text
Clerk
Database
Payload
R2
EmailJS
Application URL
```

Never commit `.env` secrets to GitHub.

Never expose server secrets through `NEXT_PUBLIC_`.

------------------------------------------------------------------------

# 99. BUSINESS GROWTH LOOP

The growth loop:

``` text
Students
   ↓
More applications
   ↓
More value for companies
   ↓
More companies
   ↓
More internships
   ↓
More university interest
   ↓
University partnerships
   ↓
More students
```

The network becomes more valuable as legitimate participation increases.

------------------------------------------------------------------------

# 100. LONG-TERM PRODUCT EVOLUTION

``` text
Website
   ↓
Internship Portal
   ↓
Internship Management System
   ↓
B2B SaaS
   ↓
University / Company Infrastructure
   ↓
Trusted Internship Ecosystem
```

------------------------------------------------------------------------

# 101. FEATURES TO AVOID INITIALLY

Do not build unrelated complexity:

- Generic social network
- Public student-to-student chat
- Cryptocurrency
- Stripe
- Payroll
- Full HR system
- Generic recruitment platform
- AI auto-rejection
- Unnecessary hundreds of pages

Every feature must support internship management, security, trust,
operations, user experience or business value.

------------------------------------------------------------------------

# 102. SUCCESS METRICS

## Platform

- Registered students
- Active companies
- Partner universities
- Published internships
- Applications
- Placements
- Completed internships
- Verified internships

## Operations

- Application processing time
- Placement completion
- Report completion
- Evaluation completion
- Internship health

## Business

- Company conversion
- University conversion
- Paid organizations
- Revenue
- Retention
- Featured opportunity sales

------------------------------------------------------------------------

# 103. DEVELOPMENT RULES FOR CLAUDE

Claude must:

1. Inspect the existing starter before changing architecture.
2. Reuse useful components and infrastructure.
3. Avoid unnecessary dependencies.
4. Avoid duplicate authentication systems.
5. Avoid duplicate CMS systems.
6. Never hardcode internship records.
7. Never hardcode application URLs.
8. Never place secrets in client code.
9. Validate on the server.
10. Use strict TypeScript.
11. Centralize authorization.
12. Keep business logic maintainable.
13. Implement real functionality behind important buttons.
14. Avoid fake dashboard data in the final product.
15. Maintain type checking, linting and automated tests throughout
    development.
16. Test unauthorized access explicitly.
17. Preserve existing functionality unless it conflicts with MANTECH.
18. Optimize for production rather than only visual appearance.

------------------------------------------------------------------------

# 104. EXPECTED FINAL WEBSITE

The completed MANTECH system should contain:

``` text
✓ Premium public website
✓ MANTECH Internship portal
✓ Clerk authentication
✓ Secure role-based authorization
✓ Student dashboard
✓ Company dashboard
✓ University dashboard
✓ Supervisor dashboard
✓ Admin dashboard
✓ Payload CMS
✓ PostgreSQL
✓ Prisma
✓ UploadThing
✓ EmailJS
✓ Internship management
✓ Application management
✓ Three application methods
✓ Interview workflow
✓ Placement workflow
✓ Onboarding
✓ Internship monitoring
✓ Reports
✓ Evaluations
✓ Notifications
✓ Reminders
✓ Matching
✓ Student readiness
✓ Company verification
✓ Separate Career Passport companion application
✓ Role-specific Student / Company / University Passport experiences
✓ Career Passport
✓ Career Passport security
✓ Audit logs
✓ Analytics
✓ Pricing
✓ WhatsApp business contact
✓ GitHub / LinkedIn / WhatsApp links
✓ English/French-ready architecture
✓ Cameroon regions/cities
✓ XAF/FCFA
✓ Premium animation
✓ Premium loading
✓ Background imagery
✓ Responsive design
✓ Accessibility
✓ SEO
✓ Security controls
✓ Testing
✓ Backup/recovery strategy
✓ Scalable B2B architecture
```

------------------------------------------------------------------------

# 105. FINAL PRODUCT PRINCIPLE

MANTECH must remain centered on:

> **INTERNSHIP MANAGEMENT**

The public website attracts and explains.

The internship portal discovers and applies.

The dashboards manage.

The workflow monitors.

Career Passport establishes trust.

The B2B system creates revenue.

The security architecture protects everything.

------------------------------------------------------------------------

# 106. FINAL POSITIONING

> **MANTECH is a secure, Cameroon-focused, enterprise-grade digital
> platform that manages the complete internship lifecycle between
> students, companies and universities --- from opportunity discovery
> and application to placement, supervision, reporting, evaluation,
> completion and trusted internship management.**

The competitive advantage is:

``` text
Complete Workflow
        +
Strong Security
        +
Role-Based Management
        +
Organization Isolation
        +
Company & University B2B Tools
        +
Internship Monitoring
        +
Verification/status
        +
Analytics
        +
Professional UX
        +
Scalable Architecture
```

------------------------------------------------------------------------

# 107. DIRECT INSTRUCTION TO ANTIGRAVITY — START COMPLETELY FROM SCRATCH

Treat this document as the **master specification for the MANTECH implementation**.

## 107.1 No existing MANTECH codebase exists

All previous MANTECH development projects/prototypes have been deleted.
There is no existing MANTECH application, codebase, database, dashboard, component library, seed project, or partially completed implementation that should be continued.

**Start MANTECH from scratch.**

Do not search for, restore, reuse, copy, clone, or depend on any previous MANTECH project.

Do not use a website starter/template as the product foundation. Do not clone a prebuilt MANTECH-like website and modify it. Build the MANTECH application directly from the requirements in this SRS.

You may use official package/documentation scaffolding commands where necessary (for example, `create-next-app` for Next.js and the official Payload setup tooling), but these are only framework installation/scaffolding tools. They are **not product templates** and must not dictate MANTECH's product design, information architecture, data model, workflows, or visual identity.

Payload officially supports creating a blank project with `create-payload-app`, and Payload documents a blank-canvas approach for new enterprise tools. Use the blank approach rather than the Payload Website Template. citeturn0search0turn0search2

Next.js App Router should be used as the application foundation. citeturn0search3

## 107.2 Build the actual product described here

Antigravity must not interpret this SRS as a request for a collection of mockups or placeholder pages.

Build the actual connected MANTECH system described throughout this document, including the public website, internship portal, five secure dashboards, internship lifecycle, database, CMS, authentication, file storage, notifications, Career Passport, authorization, auditability, analytics and business functionality.

The visual result should be polished and production-quality, but visual quality must never be achieved by replacing real functionality with fake static content.

## 107.3 Zero hardcoded business/content data

This is a **mandatory architectural rule**.

MANTECH must not hardcode dynamic business data or editable website information into React components, route files, configuration files, static arrays, mock objects or frontend constants.

All operational data must be live and come from the appropriate backend/dashboard-managed source.

### Operational data

```text
Company Dashboard / University Dashboard / Student Dashboard / Admin Dashboard
                         ↓
                  Server validation
                         ↓
                   Prisma ORM
                         ↓
               PostgreSQL (Neon)
                         ↓
             MANTECH live application
```

Examples include:

- companies
- universities
- students/interns
- supervisors
- internship opportunities
- internship requirements
- fields of study
- specializations
- skills
- locations
- regions/cities
- applications
- interviews
- placements
- onboarding items
- reports
- evaluations
- notifications
- saved internships
- internship history
- analytics/metrics derived from records
- subscription records
- featured listings
- organization settings
- contact/business settings where operational

### CMS content

```text
Payload CMS Admin
        ↓
     Payload
        ↓
Public MANTECH website
```

Website content such as pages, hero content, announcements, FAQs, articles, testimonials, marketing sections, media, navigation, SEO content and other CMS-managed content must come from Payload.

### Absolutely do not do this

```ts
const internships = [
  { title: "Software Engineering Intern", company: "Example Company" }
]
```

Do not hide the same mistake in:

```text
/lib/data.ts
/config/data.ts
/constants.ts
/mock-data.ts
/seed-data.ts
```

Moving hardcoded production data into another file does not make it dynamic.

Seed scripts are permitted only to create initial development/demo records or initial taxonomy records. Production functionality must read from PostgreSQL/Payload, and administrators must be able to manage the appropriate records through the application/CMS without source-code edits.

### Dashboard-created data must immediately become application data

When an authorized administrator/company/university/student creates or edits a record through a dashboard:

```text
Dashboard form
→ validation
→ server action/API
→ Prisma/Payload
→ database/CMS
→ live query
→ updated UI
```

Do not create a separate static copy of that data for the frontend.

If a company creates an internship from its dashboard, that internship must appear in the public internship portal from the database after publication. If an administrator edits an IT field, future profile/opportunity forms and matching must use the updated database value. If a university adds an authorized staff member, the live university dashboard must reflect it.

## 107.4 No fake production data

Do not populate production dashboards with fake KPI numbers such as `125 students`, `42 applications`, `18 placements`, etc. unless those values are explicitly CMS-managed marketing content.

Dashboard statistics must be calculated from real database records.

During development, temporary seed/demo records may be used to demonstrate functionality, but the final architecture must not depend on hardcoded mock data.

## 107.5 Static code is still allowed

The requirement is **not** that every character of the application must come from a database.

The following may remain static in code where technically appropriate:

- UI labels
- static navigation structure
- route definitions
- permission identifiers
- immutable technical enums/constants
- validation rules
- system limits
- error codes
- design tokens
- animation definitions
- accessibility behavior
- framework configuration
- technical feature flags where appropriate

The rule is:

> **Dynamic business/content data must be data, not code.**

Antigravity must use engineering judgment to distinguish immutable application logic from dynamic MANTECH data.

## 107.6 Do not build around the template

There is no requirement to preserve another template's design, routes, collections, components, demo data, authentication system or database structure.

MANTECH's architecture and UX must come from this SRS.

If a framework's default generated UI is visually plain, replace it with the professional MANTECH design described in this document.

If a generated example contains fake content, remove it.

If a generated authentication system conflicts with Clerk, remove/replace it.

If a generated storage solution conflicts with UploadThing, remove/replace it.

If a generated CMS collection conflicts with the separation between Payload content and Prisma business data, redesign it.

The final result must look and behave like a purpose-built MANTECH product, not like a customized starter.

## 107.7 Build for the result, not merely the code

Antigravity should continuously evaluate the running application in the browser and ensure that the implemented result matches this SRS visually and functionally.

The target is:

```text
Purpose-built MANTECH product
        +
Premium professional visual design
        +
Real live database data
        +
Real dashboard management
        +
Real internship workflows
        +
Real authentication/authorization
        +
Real CMS content
        +
Real file uploads
        +
Real notifications
        +
Real analytics
        +
Secure organization isolation
```

Do not stop after creating the folder structure or a visually attractive homepage.

Do not claim a feature is complete when it is only a static button, placeholder modal, fake chart or non-functional page.

Do not implement the system as a collection of disconnected mock pages.

Build the actual connected system where:

``` text
CMS
  ↕
Public Website
  ↕
Internship Portal
  ↕
Authentication
  ↕
Authorization
  ↕
Database
  ↕
Company
  ↕
Student
  ↕
University
  ↕
Supervisor
  ↕
Internship Lifecycle
  ↕
Verification/status
```

Every important action must use real application logic and persistent
data.

------------------------------------------------------------------------

# 108. FINAL VISION

MANTECH should become the **trusted digital infrastructure for
internship management in Cameroon**, beginning with a premium public
website and specialized internship portal, then expanding into secure
company and university B2B systems.

The goal is not to have the most pages.

The goal is to have the **most complete, secure, measurable,
professional and commercially valuable internship lifecycle system
possible**.

------------------------------------------------------------------------

# 109. CRITICAL ARCHITECTURE RULE --- DYNAMIC DATA MUST NOT BE HARDCODED

> **IMPORTANT: This section applies to MANTECH, the Internship
> Management System. It is NOT a university-management-system
> requirement.**

The MANTECH implementation must **not hardcode dynamic
internship/business/operational data directly into the Next.js
application source code**.

The AI/development team must clearly distinguish between:

1. **Static technical/application values** that legitimately belong in
    source code.
2. **Dynamic business/operational data** that belongs in PostgreSQL +
    Prisma.
3. **Website/content-managed information** that belongs in Payload CMS.

### 109.1 Required architecture

``` text
                    MANTECH
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
   Next.js          PostgreSQL      Payload CMS
   Application      + Prisma        Content
   & Business       Operational     Management
   Logic            Source of Truth Source of Truth
        |              |              |
        +--------------+--------------+
                       |
                  UploadThing
                    File/Object
                     Storage
```

### 109.2 PostgreSQL (Neon) + Prisma --- operational source of truth

**PostgreSQL hosted on Neon and accessed through Prisma must own dynamic
MANTECH business data**, including where applicable:

- users and application profiles
- students/interns
- student education records
- student skills
- companies
- company members
- universities/institutions
- university members
- supervisors
- internship opportunities
- internship requirements
- skills and field relationships
- applications
- application documents/metadata
- application timelines
- interviews
- interview participants
- selections
- placements
- onboarding records
- internship objectives
- milestones
- internship reports
- report reviews
- evaluations
- completion records
- internship history
- saved internships
- followed companies
- internship alerts
- notifications
- messages/communication records where applicable
- concern flags
- moderation records
- verification/status records
- audit logs
- security events
- subscriptions and commercial records where applicable
- featured listing configuration
- analytics source records
- organization/tenant relationships
- permissions/role assignments where application data requires
    persistence
- Career Passport derived/profile data where appropriate

Do **not** create these as permanent hardcoded arrays or objects inside
React/Next.js source files.

### 109.3 Payload CMS --- website/content source of truth

Payload CMS must manage information that administrators/content editors
should be able to change without modifying application source code.

Examples include:

- homepage content
- hero headings/subheadings
- hero background media
- website sections
- about content
- services
- feature descriptions
- testimonials
- success stories
- FAQs
- resources/articles
- announcements
- marketing banners
- promotional content
- public navigation configuration where appropriate
- footer content
- contact-page content
- SEO metadata
- Open Graph content
- media
- videos
- public marketing statistics that are intentionally content-managed
- public pricing presentation where applicable
- campus/office marketing information if such locations are introduced
- legal/content pages
- calls-to-action
- public partner/brand content

### 109.4 What is legitimately allowed to remain hardcoded

This requirement does **NOT** mean that absolutely nothing may be
hardcoded.

The following can legitimately remain in source code when they are truly
static technical values:

- UI labels
- static navigation structure
- route definitions
- permission identifiers
- enum definitions
- TypeScript types
- constants that represent technical behavior
- validation rules
- schema definitions
- status identifiers
- fixed system configuration
- feature flags intended to be deployment configuration
- accessibility attributes
- component structure
- design tokens
- animation definitions
- error-code identifiers
- API route definitions
- security policy definitions
- fixed technical limits
- developer-facing configuration
- immutable system rules

However, a developer must not use these categories as an excuse to
hardcode real business records.

### 109.5 The most important distinction

The following is **wrong**:

``` ts
const internships = [
  {
    title: "Software Engineering Intern",
    company: "ABC Technologies",
    city: "Douala",
    duration: "3 months"
  },
  {
    title: "Cybersecurity Intern",
    company: "XYZ Cameroon",
    city: "Buea",
    duration: "6 months"
  }
]
```

Moving the same array into:

``` text
/lib/data.ts
/config/internships.ts
/data/mockInternships.ts
/constants/internships.ts
```

does **not** solve the problem.

That is still hardcoding.

The correct architecture is:

``` text
Company/Admin Dashboard
        ↓
Create/Edit Internship
        ↓
Server validation
        ↓
Prisma
        ↓
PostgreSQL / Neon
        ↓
Public Internship Portal
        ↓
Student Search / Filters / Applications
```

### 109.6 Administrator changeability requirement

A core production requirement is:

> **An authorized administrator or business user must be able to change
> operational data through the appropriate dashboard, and content
> administrators must be able to change managed website content through
> Payload CMS, without a developer editing source code.**

Examples:

``` text
Change internship title
→ Dashboard
→ Database

Change company profile
→ Company dashboard/admin
→ Database

Approve company
→ Admin dashboard
→ Database

Change internship deadline
→ Dashboard
→ Database

Add a new IT field
→ Managed taxonomy/database
→ Database

Change homepage hero
→ Payload CMS
→ CMS

Change FAQ
→ Payload CMS
→ CMS

Change homepage image/video
→ Payload CMS / media
→ CMS + storage
```

### 109.7 Dynamic taxonomy and reference data

Fields used for student profiles, internship discovery and matching must
not unnecessarily be hardcoded as long-term business records.

Where the business needs administrators to add, rename, deactivate or
reorganize a taxonomy, model it dynamically.

Examples:

- fields of study
- specializations
- industries
- skills
- cities
- regions
- work modes
- internship durations
- eligibility categories
- application method configuration

Technical enum values may remain coded when they represent immutable
application states. Business taxonomies that administrators may need to
manage should be database-backed.

### 109.8 Database source-of-truth principle

MANTECH must behave like a real production platform:

``` text
PostgreSQL + Prisma
        ↓
Operational source of truth

Payload CMS
        ↓
Website/content source of truth

Next.js
        ↓
Application + frontend + backend + business logic
```

Do not create competing sources of truth.

Do not maintain the same business record independently in:

``` text
Prisma
+
Payload
+
hardcoded React arrays
+
local JSON
```

unless there is a clearly documented synchronization/projection reason.

------------------------------------------------------------------------

# 110. MANTECH IS NOT THE MIE-UMIS UNIVERSITY PROJECT

The architecture note above is intentionally adapted from a
university-management architecture requirement, but **MANTECH is the
Internship Management System**.

Do not confuse MANTECH with MIE-UMIS.

MANTECH must remain centered on:

``` text
Students / Interns
        +
Companies
        +
Universities
        +
Supervisors
        +
MANTECH Administrators
        ↓
Complete Internship Lifecycle
```

MANTECH is not required to become a full university ERP.

Do not add unrelated university-management modules such as:

- faculties as a full academic administration system
- departments as a full university ERP
- course registration
- examination management
- GPA calculation
- transcript generation
- university fee management
- general university payroll
- unrelated campus administration

University-related information in MANTECH should exist only where it
supports internship management, student education context, placement,
supervision, reporting, institutional partnerships or related business
workflows.

------------------------------------------------------------------------

# 111. IT-FOCUSED MANTECH SCOPE

MANTECH is designed around **technology/IT students and
technology-oriented internships**.

This does not mean that MANTECH itself becomes a university.

The system should support a broad, administrator-manageable taxonomy of
IT/computing fields used for:

- student profiles
- education records
- internship requirements
- opportunity filtering
- matching
- readiness
- analytics
- reporting

The field taxonomy must be stored dynamically where administrators need
to manage it.

### 111.1 IT fields and specializations to support

The initial taxonomy should be broad enough to cover the major
computing/IT fields and specializations commonly represented in
Cameroon, including:

- Computer Science
- Software Engineering
- Computer Engineering
- Computer Science and Networks
- Networks and Telecommunications
- Network Engineering
- Network and Security
- Cybersecurity
- Information Security
- Information Technology
- Information and Communication Technology (ICT)
- Information Systems
- Management Information Systems
- Database Management
- Data Engineering
- Data Science
- Artificial Intelligence
- Machine Learning
- Computer Vision
- Robotics
- Embedded Systems
- Internet of Things (IoT)
- Industrial Computing and Automation
- Systems Administration
- Cloud Computing
- DevOps
- Site Reliability Engineering
- Web Development
- Full-Stack Development
- Front-End Development
- Back-End Development
- Mobile Application Development
- Software Testing / Quality Assurance
- Systems Analysis
- Computer Architecture
- Computer Maintenance
- Hardware Maintenance
- IT Support
- IT Infrastructure
- Telecommunications
- Data Communications
- Distributed Systems
- Network Administration
- Cloud and Network Security
- Cryptography
- Digital Forensics
- Ethical Hacking / Penetration Testing
- Computer Graphics
- Graphic Design
- Web Design
- UI/UX Design
- Multimedia and Digital Creation
- E-Commerce
- Digital Marketing
- Digital Product Development
- Information Management
- Business Information Technology
- Geographic Information Systems / Geospatial Technology
- Digital Transformation
- Technology Project Management
- IT Governance
- IT Audit
- Emerging Technologies

The taxonomy is intentionally **not a hardcoded final list**. It is an
initial scope/reference. The production application should allow
authorized administrators to add, rename, activate, deactivate or
reorganize appropriate fields/specializations without changing source
code.

Cameroon-specific official curriculum references show recognized
technology fields including networks and telecommunications, software
engineering, computer science and networks, database management,
computer maintenance, industrial computing and automation, computer
graphics/web design, e-commerce/digital marketing, and network/security;
current university programs also cover areas such as AI, cybersecurity,
data analytics and robotics. citeturn0search22turn0search18

------------------------------------------------------------------------

# 112. MANTECH CONTACT AND COMMERCIAL FLOW

The official MANTECH contact information for this specification is:

``` text
WhatsApp / Phone:
+237 650 921 917

Email:
tessohmanuel@gmail.com
```

### 112.1 No online payment processing

MANTECH must **not implement an online payment process** for the current
product.

Do not add:

- Stripe
- payment gateway
- card collection
- bank-card forms
- online checkout
- payment API
- stored card information
- payment buttons that imply an online transaction

The product should not request or collect payment credentials.

### 112.2 Commercial/contact flow

Where commercial services or pricing are presented:

``` text
Service / Pricing
       ↓
Contact MANTECH
       ↓
WhatsApp / Phone / Email
       ↓
Human commercial discussion
```

Use clear contact actions such as:

``` text
Contact MANTECH on WhatsApp
Contact MANTECH
Request Information
Talk to MANTECH
```

Do not display:

``` text
Pay Now
Checkout
Buy Now
Enter Card Details
Subscribe and Pay
```

unless a future version explicitly introduces a payment system and the
SRS is updated.

WhatsApp is a communication channel, not the transactional system of
record.

------------------------------------------------------------------------

# 113. EXPANDED PREMIUM PUBLIC WEBSITE INFORMATION ARCHITECTURE

The public website may be expanded beyond the original route list so
that MANTECH feels like a substantial professional technology company
rather than a thin landing page.

However, pages must remain meaningful and must support the MANTECH
business.

Suggested public structure:

``` text
/
├── /about
├── /about/mission
├── /about/vision
├── /about/how-mantech-works
├── /services
├── /services/students
├── /services/companies
├── /services/universities
├── /services/supervisors
├── /internships
├── /internships/opportunities
├── /internships/fields
├── /internships/companies
├── /how-it-works
├── /how-it-works/students
├── /how-it-works/companies
├── /how-it-works/universities
├── /how-it-works/supervisors
├── /success-stories
├── /testimonials
├── /resources
├── /resources/articles
├── /resources/guides
├── /faq
├── /security
├── /privacy
├── /terms
├── /accessibility
└── /contact
```

Additional pages can be added when they communicate real business value.

Examples:

- Company solutions
- University solutions
- Student resources
- Internship preparation
- Internship monitoring
- Employer resources
- Supervisor resources
- Technology fields
- Cameroon internship ecosystem
- MANTECH methodology
- Trust and safety
- Data privacy
- Platform capabilities
- Partner stories
- Help center

Do not create dozens of empty pages merely to increase page count.

Every page must have meaningful content, strong visual hierarchy, clear
purpose, SEO metadata and appropriate calls-to-action.

------------------------------------------------------------------------

# 114. CAMEROON-FIRST LOCALIZATION

MANTECH is Cameroon-first.

The application must support Cameroon-specific internship discovery and
business workflows.

Where relevant, dynamic data should support:

- Cameroon regions
- cities/towns
- company locations
- university locations
- internship locations
- remote/hybrid/on-site work modes
- XAF/FCFA
- Cameroon-focused organization profiles
- Cameroon student/university context

Examples of major location data may include:

``` text
Douala
Yaoundé
Buea
Bamenda
Bafoussam
Limbe
Kribi
Garoua
Maroua
Ngaoundéré
Ebolowa
Bertoua
Dschang
Kumba
and other administrator-managed locations
```

This list must not become an immutable hardcoded business database.
Location records should be manageable through the appropriate
database/admin interface.

------------------------------------------------------------------------

# 115. FOUR-CAMPUS / LOCATION REQUIREMENT --- IMPORTANT SCOPE INTERPRETATION

If the owner provides or later activates four MANTECH physical operating
locations/campuses:

``` text
Yassa
Bonamoussadi
Bafoussam
Buea
```

the platform must represent these as **dynamic organization/location
records**, not as hardcoded page content.

They may be used for:

- MANTECH office/center information
- contact/location pages
- internship support centers
- events
- student support
- service coverage
- local marketing sections

However, these locations must **not be interpreted as MANTECH becoming a
university**.

If these are intended to be university campuses in another project, they
belong to that university project, not to MANTECH.

For MANTECH, only include these locations if they are confirmed as
actual MANTECH operating/service locations.

------------------------------------------------------------------------

# 116. PREMIUM VISUAL DESIGN SYSTEM

The visual direction must remain:

- bright
- premium
- modern
- technology-focused
- enterprise-grade
- trustworthy
- clean
- professional
- responsive

Preferred visual family:

``` text
Primary:
Blue / deep professional blue

Secondary:
White / neutral surfaces

Accent:
Orange / warm technology accent

Supporting:
Professional complementary tones used sparingly
```

Do not turn every section into a different random color.

Instead, create a deliberate visual rhythm:

``` text
Hero
→ image/video-led

Section 2
→ bright white

Section 3
→ soft tinted background

Section 4
→ image background with overlay

Section 5
→ clean white/cards

Section 6
→ accent-colored visual block

Section 7
→ dark/strong contrast only where useful

Section 8
→ bright CTA/contact section
```

### 116.1 Background-image sections

Some major sections should use professional background imagery.

Examples:

- hero
- company solutions
- university solutions
- internship lifecycle
- success stories
- contact CTA
- technology/innovation sections

Use:

``` css
background-image
```

or an equivalent optimized image component/background implementation.

When text sits on an image, ensure readability with:

- gradient overlays
- contrast layers
- controlled opacity
- text shadow where appropriate
- readable font weights
- accessible contrast ratios

Never place white text directly on a bright photograph without
sufficient contrast.

### 116.2 Video loading experience

The MANTECH loading experience should feel premium.

The initial/loading screen may use a short optimized technology-themed
video as the visual background.

Requirements:

- video background
- strong overlay
- animated MANTECH branding
- readable loading/status text
- smooth entrance/exit
- no distracting audio
- muted autoplay
- responsive behavior
- mobile fallback image/poster
- reduced-motion fallback
- optimized file size
- do not block application usability unnecessarily

Concept:

``` text
Video Background
      +
Dark/gradient readability overlay
      +
MANTECH Logo animation
      +
Loading message/progress
      ↓
Smooth transition
      ↓
Application
```

The loading screen must not remain visible longer than necessary.

------------------------------------------------------------------------

# 117. PAGE-BY-PAGE MOTION DESIGN

Different page sections should have their own appropriate animation
language.

Do not apply one identical animation everywhere.

Examples:

### Homepage

- hero fade/scale entrance
- staggered text
- CTA reveal
- background parallax where appropriate
- card hover
- scroll-triggered section reveals

### About

- timeline reveal
- image movement
- staggered statistics
- mission/vision transitions

### Services

- service card stagger
- icon motion
- hover elevation
- progressive reveal

### Internship portal

- filter transitions
- result-list animation
- card hover
- saved-state animation
- application-state transitions

### Company pages

- business metrics reveal
- opportunity card transitions
- logo/image entrance
- subtle data visualization animation

### University pages

- institutional timeline
- partnership visual transitions
- placement statistics animation

### Dashboard

- route transitions
- sidebar transitions
- KPI number animation
- chart entrance
- notification transitions
- modal transitions
- table row transitions
- progress animation
- success/error feedback

### Career Passport

- professional timeline animation
- experience reveal
- skill progression
- achievement transitions
- restrained premium motion

### Loading and system states

- skeleton loaders
- progress indicators
- success states
- error states
- empty-state animations

All animation must respect:

``` text
prefers-reduced-motion
```

Avoid excessive animation that harms usability or performance.

------------------------------------------------------------------------

# 118. MEDIA MANAGEMENT MUST BE DYNAMIC

Images and videos used for managed public website sections must not be
buried inside React components as permanent business/content records.

Prefer:

``` text
Payload CMS
    ↓
Media collection
    ↓
Optimized storage
    ↓
Next.js presentation
```

Use UploadThing where appropriate for object storage.

Administrators should be able to replace:

- hero images
- section backgrounds
- logos/partner imagery
- testimonial images
- article images
- promotional banners
- background videos/posters

without editing source code.

Static technical fallback assets may remain in the repository when
appropriate.

------------------------------------------------------------------------

# 119. DASHBOARD DATA MUST ALSO BE REAL

Do not populate production dashboards with fake values such as:

``` text
1,248 applications
98 companies
76 placements
94% success rate
```

unless those values are actually calculated from persistent data or are
explicitly marked as CMS-managed marketing content.

Dashboard metrics must normally be derived from PostgreSQL.

Example:

``` text
Applications
    ↓
Prisma query
    ↓
Authorized aggregation
    ↓
Dashboard KPI
```

Every role must receive metrics appropriate to its permissions.

------------------------------------------------------------------------

# 120. ADMINISTRATOR CONTROL CENTER

The MANTECH Admin dashboard should provide enough management capability
that an authorized administrator can operate the platform without a
developer.

Potential modules include:

``` text
Dashboard
Users
Students
Companies
Universities
Supervisors
Organizations
Internships
Applications
Placements
Reports
Evaluations
Verification
Moderation
Skills
Fields of Study
Industries
Locations
Internship Types
Work Modes
Notifications
Analytics
Audit Logs
Security Events
Subscriptions
Featured Listings
Support
System Settings
CMS
Media
```

Each module must distinguish:

``` text
Read
Create
Update
Delete
Approve
Reject
Publish
Suspend
Export
```

according to permissions.

------------------------------------------------------------------------

# 121. DYNAMIC DATA AUDIT REQUIREMENT

Before considering the system production-ready, inspect the entire
existing codebase for hardcoded dynamic information.

Search for patterns such as:

``` text
const internships = [...]
const companies = [...]
const students = [...]
const universities = [...]
const opportunities = [...]
const testimonials = [...]
const locations = [...]
const fields = [...]
const skills = [...]
const statistics = [...]
```

Do not assume these are automatically acceptable.

For each discovered data source, classify it:

``` text
STATIC TECHNICAL
       ↓
Keep in code

OPERATIONAL BUSINESS DATA
       ↓
Prisma/PostgreSQL

WEBSITE / MARKETING CONTENT
       ↓
Payload CMS

MEDIA / OBJECT
       ↓
UploadThing / Payload media
```

If a hardcoded dataset is used only for development seed data, clearly
identify it as seed/demo data and ensure production reads from the
database.

Do not ship demo records as if they were real production records.

------------------------------------------------------------------------

# 122. DATA OWNERSHIP MATRIX

  Data                         Source of Truth
  ---------------------------- ---------------------
  Authentication identity      Clerk
  Sessions / MFA               Clerk
  Students / interns           PostgreSQL + Prisma
  Companies                    PostgreSQL + Prisma
  Universities                 PostgreSQL + Prisma
  Supervisors                  PostgreSQL + Prisma
  Internship opportunities     PostgreSQL + Prisma
  Applications                 PostgreSQL + Prisma
  Interviews                   PostgreSQL + Prisma
  Placements                   PostgreSQL + Prisma
  Reports                      PostgreSQL + Prisma
  Evaluations                  PostgreSQL + Prisma
  Internship history           PostgreSQL + Prisma
  Audit logs                   PostgreSQL + Prisma
  Security events              PostgreSQL + Prisma
  Dynamic fields/skills        PostgreSQL + Prisma
  Dynamic locations            PostgreSQL + Prisma
  Homepage content             Payload CMS
  Website pages                Payload CMS
  FAQ                          Payload CMS
  Testimonials                 Payload CMS
  Success stories              Payload CMS
  Marketing banners            Payload CMS
  SEO content                  Payload CMS
  Website media metadata       Payload CMS
  Large file/object storage    UploadThing
  Email delivery               EmailJS
  Application/business logic   Next.js

No two systems should casually compete to own the same critical
transactional record.

------------------------------------------------------------------------

# 123. NO PAYMENT BUTTON / NO PAYMENT PROCESS

The current MANTECH release has **no payment workflow**.

Therefore:

``` text
Pricing / Commercial Information
        ↓
Contact MANTECH
        ↓
WhatsApp / Phone / Email
```

and NOT:

``` text
Pricing
  ↓
Checkout
  ↓
Payment
```

There must be **no Pay Now button**, no checkout form and no online
payment integration.

This requirement overrides any generic starter/demo payment
functionality.

If the starter contains Stripe/payment code, remove or disable it from
the MANTECH product unless it is required for an unrelated non-payment
technical dependency.

------------------------------------------------------------------------

# 124. CONTENT QUALITY AND PROFESSIONAL UNIVERSITY-LIKE DEPTH --- WITHOUT BECOMING A UNIVERSITY ERP

The website should feel substantial, authoritative and professionally
established.

It may use a **university/technology-institution level of visual
depth**, but MANTECH remains an internship-management company/platform.

The goal is:

``` text
Physical institutional credibility
        +
Enterprise SaaS functionality
        +
Internship ecosystem
```

not:

``` text
MANTECH
=
University ERP
```

Use meaningful institutional-quality sections such as:

- leadership/about MANTECH
- mission and vision
- technology ecosystem
- internship methodology
- student support
- company solutions
- university partnerships
- supervisor support
- career development
- technology fields
- Cameroon ecosystem
- success stories
- statistics
- trust/security
- resources
- FAQ
- contact centers
- partner network
- innovation/labs-style visual storytelling where appropriate

These are presentation/business concepts, not permission to invent fake
organizations, fake statistics or fake academic programs.

------------------------------------------------------------------------

# 125. CONTACT INFORMATION

Use the following official contact information in appropriate managed
contact areas:

``` text
MANTECH
WhatsApp / Phone:
+237 650 921 917

Email:
tessohmanuel@gmail.com
```

Contact information should be centrally configurable where appropriate
rather than duplicated across many components.

The public website should provide clear:

- Contact MANTECH
- WhatsApp
- Email
- inquiry
- support

actions.

------------------------------------------------------------------------

# 126. FINAL CLARIFICATION FOR THE AI BUILDER

**Do not get confused by the architecture language in this document.**

The following rule is specifically for **MANTECH --- the Internship
Management System**:

``` text
PostgreSQL (Neon) + Prisma
→ dynamic internship/business/operational data

Payload CMS
→ website/content-managed information

Next.js
→ frontend + backend + business logic

Clerk
→ identity + authentication + MFA/session

UploadThing
→ files/object storage

EmailJS
→ email delivery
```

The requirement is **not**:

> "Never hardcode anything."

The requirement is:

> **Do not hardcode data that should behave like real business data.**

The AI builder must determine what is static and what is dynamic.

If an administrator should reasonably be able to change it from a
dashboard/CMS, it should not require a developer to edit source code.

The AI builder must therefore inspect the **entire existing MANTECH
codebase**, identify hardcoded dynamic information, and refactor it to
the correct source of truth.

Do not simply move hardcoded data into another file.

Do not hide hardcoded business records behind constants.

Do not replace one fake dataset with another fake dataset.

Build the system so that the database and CMS are genuinely responsible
for the data they are supposed to own.

------------------------------------------------------------------------

# 127. FINAL VISUAL AND PRODUCT QUALITY REQUIREMENT

MANTECH must look and feel like a serious professional technology
organization operating in Cameroon and designed for international
growth.

It must have:

``` text
Premium public website
        +
Professional internship portal
        +
Five secure operational dashboards
        +
Separate Career Passport application
        +
Real PostgreSQL business data
        +
Real Payload-managed content
        +
Secure Clerk authentication
        +
Organization isolation
        +
Professional imagery
        +
Background-image sections
        +
Premium video loading experience
        +
Distinct section/page animations
        +
Responsive design
        +
Accessibility
        +
SEO
        +
Performance
        +
Professional contact flow
        +
No online payment processing
```

The number of pages is not the objective.

**Professional depth, real functionality, trustworthy data, security,
usability and business value are the objective.**

------------------------------------------------------------------------

# CRITICAL UPDATE — UPLOADTHING AND COMPLETE IT/ICT FIELD TAXONOMY

## 1. UploadThing is the file-storage solution

MANTECH uses **UploadThing**, not UploadThing. All references to UploadThing in any previous version of this SRS are superseded by this requirement.

Final ownership:

```text
Clerk → authentication, identity, sessions, MFA
PostgreSQL (Neon) + Prisma → operational MANTECH business data
Payload CMS → website/content-managed information
UploadThing → application file uploads and storage
EmailJS → email delivery
Next.js → frontend, backend and business logic
```

UploadThing may store CVs, application documents, internship reports, attachments and appropriate profile/company media. PostgreSQL/Prisma remains the source of truth for ownership, purpose, authorization, status and relationships. Never authorize a file merely because a user knows or changes its URL/ID.

Do not add UploadThing. Do not retain R2-specific architecture or configuration.

## 2. MANTECH is specifically an IT/ICT internship system

MANTECH is for **students/interns whose fields of study are in IT, ICT, computing, software, networks, telecommunications, cybersecurity, data, digital technology and closely related technology disciplines**.

Do not turn MANTECH into a generic internship platform covering medicine, nursing, law, agriculture, civil engineering, accounting, hospitality or unrelated academic fields.

The field-of-study taxonomy must be database-driven so authorized administrators can add, rename, deactivate and organize fields without editing source code.

## 3. Complete IT/ICT field-of-study taxonomy

The initial taxonomy must cover, at minimum:

### Computer Science

- Computer Science
- Applied Computer Science
- Computer Science and Networks
- Computer Science and Digitalization
- Theoretical Computer Science
- Scientific Computing
- Computational Science
- Distributed Computing
- Parallel Computing
- Algorithms and Data Structures
- Programming Languages
- Compiler Technology
- Operating Systems
- Computer Architecture
- Human-Computer Interaction

### Software Engineering and Development

- Software Engineering
- Software Development
- Software Architecture
- Full-Stack Development
- Front-End Development
- Back-End Development
- Web Development
- Web Application Development
- API Development
- Enterprise Software Development
- Desktop Application Development
- Cross-Platform Application Development
- Mobile Application Development
- Android Development
- iOS Development
- Flutter Development
- React Native Development
- Software Testing / Quality Assurance
- Test Automation
- Software Maintenance
- Secure Software Development
- DevSecOps

### Networks and Telecommunications

- Networks and Telecommunications
- Telecommunications
- Computer Networks
- Network Engineering
- Network Administration
- Network Infrastructure
- Network Architecture
- Data Communications
- Wireless Networks
- Mobile Networks
- Optical/Fiber Networks
- Network Operations
- Network Support
- Network Monitoring
- Routing and Switching
- Network Design
- Network Services
- VoIP / Unified Communications

### Cybersecurity and Information Security

- Cybersecurity
- Computer Security
- Information Security
- Network Security
- Cyber Defence
- Security Engineering
- Application Security
- Web Application Security
- Cloud Security
- Endpoint Security
- Identity and Access Management
- Security Operations / SOC
- Vulnerability Management
- Penetration Testing
- Ethical Hacking
- Digital Forensics
- Incident Response
- Malware Analysis
- Threat Intelligence
- Security Auditing
- Governance, Risk and Compliance (GRC)
- Privacy and Data Protection
- Cryptography

### Information Technology and Systems

- Information Technology
- Information and Communication Technology (ICT)
- IT Support
- IT Operations
- IT Infrastructure
- Technical Support
- Help Desk / Service Desk
- IT Asset Management
- IT Service Management
- Systems Administration
- Linux Administration
- Windows Server Administration
- Server Administration
- Systems Integration
- Systems Monitoring
- Virtualization
- Backup and Recovery

### Information Systems and Business Technology

- Information Systems
- Management Information Systems
- Information Systems Management
- Business Information Technology
- Business Information Systems
- Systems Analysis
- Systems Design
- Enterprise Systems
- Enterprise Application Management
- Digital Business Systems
- Technology Project Management
- IT Project Management
- Digital Transformation
- Enterprise Architecture
- IT Governance
- IT Audit
- IT Risk Management
- Technology Management

### Databases and Data Engineering

- Database Management
- Database Administration
- Database Engineering
- Database Development
- Relational Databases
- NoSQL Databases
- Data Engineering
- Data Architecture
- Data Warehousing
- Data Integration
- Data Management
- Data Quality
- Data Governance
- Big Data Technologies
- Distributed Data Systems
- Database Security
- Data Processing

### Data Science and Analytics

- Data Science
- Data Analytics
- Business Analytics
- Statistical Computing
- Predictive Analytics
- Data Visualization
- Data Mining
- Business Intelligence
- Big Data Analytics
- Quantitative Computing
- Applied Statistics for Computing

### Artificial Intelligence and Machine Learning

- Artificial Intelligence
- Machine Learning
- Deep Learning
- Generative AI
- Natural Language Processing
- Computer Vision
- Speech and Language Technology
- Intelligent Systems
- Expert Systems
- Recommender Systems
- Knowledge Representation
- Knowledge Discovery
- AI Engineering
- Applied AI
- Machine Learning Engineering
- MLOps
- Responsible AI

### Cloud, DevOps and Platform Engineering

- Cloud Computing
- Cloud Engineering
- Cloud Architecture
- Cloud Infrastructure
- Cloud Administration
- Cloud Networking
- Cloud Security
- DevOps
- DevSecOps
- Site Reliability Engineering
- Platform Engineering
- Infrastructure as Code
- CI/CD Engineering
- Containerization
- Kubernetes / Container Orchestration
- Cloud Operations
- Cloud Monitoring
- Cloud Automation

### Hardware and Computer Maintenance

- Computer Engineering
- Computer Maintenance
- Hardware Maintenance
- Computer Hardware
- Hardware Support
- Computer Repair
- Preventive Computer Maintenance
- Diagnostic and Troubleshooting
- Hardware Installation
- Hardware Configuration
- IT Equipment Maintenance

### Embedded Systems, IoT and Automation

- Embedded Systems
- Embedded Software
- Firmware Engineering
- Microcontrollers
- Microprocessor Systems
- Internet of Things (IoT)
- Industrial IoT
- Edge Computing
- Real-Time Systems
- Sensor Systems
- Connected Devices
- Smart Systems
- Embedded Security
- Industrial Computing
- Industrial Computing and Automation
- Industrial Automation
- Process Automation
- Control Systems
- SCADA
- PLC Programming
- Operational Technology (OT)
- OT Security

### Computer Graphics, Web Design and Multimedia

- Computer Graphics
- Computer Graphics and Web Design
- Web Design
- UI Design
- UX Design
- UI/UX Design
- Interaction Design
- Digital Illustration
- 2D Graphics
- 3D Graphics
- 3D Modeling
- Animation
- Motion Graphics
- Multimedia Design
- Multimedia Production
- Digital Media
- Interactive Media
- Visual Computing

### E-Commerce and Digital Technology

- E-Commerce
- E-Commerce Technology
- Digital Marketing Technology
- E-Commerce and Digital Marketing
- Digital Commerce
- Marketing Technology / MarTech
- Digital Business
- E-Commerce Platforms
- Digital Customer Experience
- Digital Analytics

### GIS and Geospatial Computing

- Geographic Information Systems (GIS)
- Geospatial Technology
- Geospatial Information Systems
- Spatial Data
- Geographic Data Analysis
- Remote Sensing Technology
- Cartographic Computing
- Location Intelligence

### Robotics and Autonomous Systems

- Robotics
- Robotics Engineering
- Autonomous Systems
- Robot Programming
- Mobile Robotics
- Industrial Robotics
- Human-Robot Interaction
- Robot Vision
- Autonomous Navigation
- Intelligent Robotics

### Game Development and Immersive Technology

- Game Development
- Game Programming
- Game Design
- 2D Game Development
- 3D Game Development
- Virtual Reality (VR)
- Augmented Reality (AR)
- Extended Reality (XR)
- Mixed Reality (MR)
- Spatial Computing
- Immersive Technology

### Emerging and Specialized Technology

- Blockchain Technology
- Distributed Ledger Technology
- Web3 Technology
- FinTech Technology
- RegTech Technology
- HealthTech Technology
- EdTech Technology
- GovTech Technology
- PropTech Technology
- AgriTech Technology
- Smart City Technology
- Digital Twins
- Quantum Computing
- Quantum Information Technology
- Privacy Engineering
- Digital Identity
- Emerging Technologies

### 4. Cameroon-specific foundation

The taxonomy must include the established Cameroon ICT/HND specialties as first-class entries, including **Telecommunication, Network and Security, Software Engineering, Computer Science and Network, Database Management, Computer Maintenance, Hardware Maintenance, Industrial Computing and Automation, Computer Graphic and Web Design, and E-Commerce and Digital Marketing**. These appear in MINESUP's official ICT HND documentation. citeturn0search12turn0search0

The system may also accommodate newer technology areas such as data science, cybersecurity, AI, robotics and related fields, but these must not be falsely presented as a specific nationally accredited specialty unless the relevant institution/qualification actually confirms that status.

### 5. Taxonomy is data, not frontend code

Do not create a permanent production list such as:

```ts
const IT_FIELDS = [
  "Software Engineering",
  "Cybersecurity",
  "Computer Science",
  // ...
];
```

Instead:

```text
PostgreSQL / Prisma
        ↓
IT Field of Study
        ↓
Specialization
        ↓
Skills
        ↓
Student Profile
        ↓
Internship Requirements
        ↓
Matching / Search / Analytics
```

Seed data may initially populate the taxonomy, but production users must read it from the database. Authorized administrators must be able to manage it without editing source code. Deactivating a field must not destroy historical student or internship records that used that field.

### 6. Field of study vs skills vs internship category

These are different concepts and must not be collapsed into one field:

```text
Field of Study
    Software Engineering

Specialization
    Full-Stack Development

Skills
    TypeScript, React, Next.js, PostgreSQL, Prisma

Internship Category
    Software Engineering Internship
```

MANTECH matching should be able to use all four dimensions together with location, education, work mode, duration and opportunity requirements.

### 7. Source-based scope note

The official Cameroon Ministry of Higher Education ICT HND documentation identifies Networks and Telecommunication and Computer Engineering areas including Telecommunication, Network and Security, Software Engineering, Computer Science and Network, Database Management, Computer Maintenance, Hardware Maintenance, Industrial Computing and Automation, Computer Graphic and Web Design, and E-Commerce and Digital Marketing. citeturn0search12

Other current Cameroon higher-education computing programs demonstrate additional areas such as data science, cybersecurity, computer networking, information systems, cloud and robotics, which supports keeping MANTECH's taxonomy extensible rather than limiting it to one qualification framework. citeturn0search5turn0search11

# 128. FINAL SCOPE CHECK

Before treating the MANTECH system as complete, verify all of the
following:

``` text
✓ MANTECH remains an Internship Management System
✓ No accidental conversion into MIE-UMIS
✓ No public /mantech-verify
✓ No public QR verification portal
✓ Career Passport remains a separate companion application
✓ No Career Passport CV builder
✓ Five operational dashboards remain
✓ Every dashboard has appropriate History/Activity
✓ Dynamic business data is not hardcoded
✓ PostgreSQL/Prisma is the transactional source of truth
✓ Payload is the website/content source of truth
✓ Next.js owns application/business logic
✓ Clerk owns authentication/identity
✓ UploadThing handles appropriate object storage
✓ EmailJS handles email delivery
✓ No Stripe
✓ No online payment process
✓ No Pay Now / Checkout button
✓ Commercial contact uses WhatsApp/phone/email
✓ +237 650 921 917 is available as the official contact
✓ tessohmanuel@gmail.com is available as the official email
✓ IT-focused student/internship taxonomy is supported
✓ IT taxonomy is manageable rather than permanently hardcoded
✓ Cameroon-first locations are supported
✓ Four locations are only used if confirmed as MANTECH locations
✓ Public website has meaningful professional depth
✓ Background images are used strategically
✓ Text over images remains accessible and readable
✓ Loading experience can use optimized background video
✓ Loading has animation and readable text
✓ Pages/sections use varied, purposeful animations
✓ prefers-reduced-motion is respected
✓ No fake production dashboard statistics
✓ No fake companies/internships presented as real
✓ No cross-tenant access
✓ No secrets in client code
✓ Server-side authorization is mandatory
✓ Real data persists through the database
✓ CMS content is editable without source-code changes
```

------------------------------------------------------------------------

# END OF ADDITIONAL MANTECH REQUIREMENTS
