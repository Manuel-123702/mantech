import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyUser, writeAudit } from "@/lib/audit";
import { jsonError, requireRecruiterContext, requireUser } from "@/lib/authz";
import { redactPrivateInternData } from "@/lib/privacy";

const internApplySchema = z.object({
  opportunityId: z.string().optional(),
  opportunity_id: z.string().optional(),
  coverLetter: z.string().optional(),
  cover_note: z.string().optional(),
  applicationMethod: z
    .enum(["MANTECH", "COMPANY_WEBSITE", "EXTERNAL"])
    .optional(),
  application_method: z
    .enum(["MANTECH", "COMPANY_WEBSITE", "EXTERNAL"])
    .optional(),
});

export async function GET() {
  try {
    const user = await requireUser();

    if (user.role === "INTERN") {
      if (!user.internProfile) {
        return NextResponse.json({ applications: [] });
      }
      const applications = await prisma.application.findMany({
        where: { internProfileId: user.internProfile.id },
        include: {
          opportunity: { include: { organization: true } },
          job: { include: { organization: true } },
          statusHistory: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ applications: redactPrivateInternData(applications) });
    }

    const { organization } = await requireRecruiterContext({
      requireOrg: true,
    });
    if (!organization) return NextResponse.json({ applications: [] });

    const applications = await prisma.application.findMany({
      where: {
        OR: [
          { opportunity: { organizationId: organization.id } },
          { job: { organizationId: organization.id } },
        ],
      },
      include: {
        internProfile: {
          include: {
            user: { select: { fullName: true, email: true, avatarUrl: true } },
            passport: true,
            fieldOfStudy: true,
          },
        },
        opportunity: true,
        job: true,
        interviews: { orderBy: { scheduledAt: "desc" } },
        placement: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ applications: redactPrivateInternData(applications) });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (user.role !== "INTERN" || !user.internProfile) {
      return NextResponse.json(
        { error: "Only registered interns can apply" },
        { status: 403 },
      );
    }

    const parsed = internApplySchema.parse(await request.json());
    const opportunityId = parsed.opportunityId || parsed.opportunity_id;
    const applicationMethod = (parsed.applicationMethod ||
      parsed.application_method ||
      "MANTECH") as "MANTECH" | "COMPANY_WEBSITE" | "EXTERNAL";
    if (!opportunityId) {
      return NextResponse.json(
        { error: "Opportunity ID is required" },
        { status: 400 },
      );
    }

    const opportunity = await prisma.internshipOpportunity.findUnique({
      where: { id: opportunityId },
      include: { organization: { include: { members: true } } },
    });
    if (!opportunity || opportunity.moderationStatus !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Opportunity is not open for applications" },
        { status: 400 },
      );
    }
    if (opportunity.applicationMethod !== applicationMethod) {
      return NextResponse.json(
        {
          error: `Application method mismatch. This posting uses: ${opportunity.applicationMethod}`,
        },
        { status: 400 },
      );
    }

    const existing = await prisma.application.findUnique({
      where: {
        internProfileId_opportunityId: {
          internProfileId: user.internProfile.id,
          opportunityId,
        },
      },
    });
    if (existing) {
      if (applicationMethod !== "MANTECH") {
        await writeAudit({
          actorId: user.id,
          actorRole: user.role,
          action: "EXTERNAL_APPLICATION_REDIRECT",
          entityType: "Application",
          entityId: existing.id,
          details: {
            opportunityId,
            applicationMethod,
            externalUrl: opportunity.applicationUrl,
          },
          request,
        });
        return NextResponse.json({ application: existing, alreadyTracked: true });
      }
      return NextResponse.json(
        { error: "You have already applied for this opportunity" },
        { status: 400 },
      );
    }

    const intern = await prisma.internProfile.findUnique({
      where: { id: user.internProfile.id },
    });
    const submissionNote =
      applicationMethod === "MANTECH"
        ? "Application submitted through MANTECH"
        : applicationMethod === "COMPANY_WEBSITE"
          ? "Candidate redirected to apply on the company website"
          : "Candidate redirected to an external hiring platform";
    const application = await prisma.application.create({
      data: {
        internProfileId: user.internProfile.id,
        opportunityId,
        applicationMethod,
        status: "SUBMITTED",
        coverLetter: parsed.coverLetter || parsed.cover_note,
        readinessScore: intern?.readinessScore || 0,
        statusHistory: {
          create: {
            status: "SUBMITTED",
            note: submissionNote,
            actorName: user.fullName,
          },
        },
      },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: "SUBMIT_APPLICATION",
      entityType: "Application",
      entityId: application.id,
      details: {
        opportunityId,
        applicationMethod,
        externalUrl:
          applicationMethod !== "MANTECH"
            ? opportunity.applicationUrl
            : undefined,
      },
      request,
    });

    for (const member of opportunity.organization.members) {
      const msgSuffix =
        applicationMethod === "MANTECH"
          ? ` applied for ${opportunity.title}`
          : applicationMethod === "COMPANY_WEBSITE"
            ? ` was redirected to apply for ${opportunity.title} via your company website`
            : ` was redirected to apply for ${opportunity.title} via the external hiring platform`;
      await notifyUser({
        userId: member.userId,
        title:
          applicationMethod === "MANTECH"
            ? "New internship application"
            : "New external application redirection",
        message: `${user.fullName}${msgSuffix}`,
        category: "application",
        link: `/dashboard/company/applications/${application.id}`,
      });
    }

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 },
      );
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
