import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyUser, writeAudit } from "@/lib/audit";
import { jsonError, requireUser } from "@/lib/authz";

const jobApplySchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z.string().optional(),
  applicationMethod: z
    .enum(["MANTECH", "COMPANY_WEBSITE", "EXTERNAL"])
    .optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (user.role !== "INTERN" || !user.internProfile) {
      return NextResponse.json(
        { error: "Only registered interns can apply" },
        { status: 403 },
      );
    }

    const parsed = jobApplySchema.parse(await request.json());
    const applicationMethod = parsed.applicationMethod || "MANTECH";

    const job = await prisma.job.findUnique({
      where: { id: parsed.jobId },
      include: { organization: { include: { members: true } } },
    });
    if (!job || job.moderationStatus !== "PUBLISHED") {
      return NextResponse.json(
        { error: "This job is not open for applications" },
        { status: 400 },
      );
    }
    if (job.expiryDate < new Date()) {
      return NextResponse.json(
        { error: "This job posting has expired" },
        { status: 400 },
      );
    }

    const existing = await prisma.application.findFirst({
      where: { internProfileId: user.internProfile.id, jobId: job.id },
    });
    if (existing) {
      if (applicationMethod !== "MANTECH") {
        await writeAudit({
          actorId: user.id,
          actorRole: user.role,
          action: "EXTERNAL_APPLICATION_REDIRECT",
          entityType: "Application",
          entityId: existing.id,
          details: { jobId: job.id, slug: job.slug, applicationMethod },
          request,
        });
        return NextResponse.json({ application: existing, alreadyTracked: true });
      }
      return NextResponse.json(
        { error: "You have already applied for this job" },
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
        jobId: job.id,
        applicationMethod,
        status: "SUBMITTED",
        coverLetter: parsed.coverLetter,
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
      details: { jobId: job.id, slug: job.slug, applicationMethod },
      request,
    });

    for (const member of job.organization.members) {
      const msgSuffix =
        applicationMethod === "MANTECH"
          ? ` applied for the job ${job.title}`
          : applicationMethod === "COMPANY_WEBSITE"
            ? ` was redirected to apply for the job ${job.title} via your company website`
            : ` was redirected to apply for the job ${job.title} via the external hiring platform`;
      await notifyUser({
        userId: member.userId,
        title:
          applicationMethod === "MANTECH"
            ? "New job application"
            : "New external job application redirection",
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
