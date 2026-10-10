import { NextResponse } from "next/server";
import { prisma, withDatabaseRetry } from "@/lib/prisma";
import { logDatabaseUnavailable } from "@/lib/db-health";

export async function GET() {
  try {
    const [
      activeInternships,
      partnerCompanies,
      partnerUniversities,
      studentsPlaced,
    ] = await withDatabaseRetry(() =>
      Promise.all([
        prisma.internshipOpportunity.count({
          where: {
            moderationStatus: "PUBLISHED",
            deadline: { gte: new Date() },
          },
        }),
        prisma.organization.count({
          where: {
            type: "COMPANY",
            verificationStatus: "VERIFIED",
          },
        }),
        prisma.organization.count({
          where: {
            type: "UNIVERSITY",
            verificationStatus: "VERIFIED",
          },
        }),
        prisma.placement.count({
          where: {
            status: { in: ["CONFIRMED", "ACTIVE", "COMPLETED"] },
          },
        }),
      ]),
    );

    const stats = {
      activeInternships,
      partnerCompanies,
      partnerUniversities,
      studentsPlaced,
    };

    return NextResponse.json(stats);
  } catch (error) {
    logDatabaseUnavailable("stats", error);
    // Option A: real counts only — an unreachable DB reports zeroes, not invented numbers.
    return NextResponse.json(
      { activeInternships: 0, partnerCompanies: 0, partnerUniversities: 0, studentsPlaced: 0 },
      { status: 200, headers: { "X-Data-Source": "db-unavailable" } },
    );
  }
}
