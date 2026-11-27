import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InternNav } from "@/components/intern/intern-nav";
import { Badge } from "@/components/ui/badge";
import { FileText, Database } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logDatabaseUnavailable } from "@/lib/db-health";

export default async function InternDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = session.userId;
  if (!userId) {
    redirect("/sign-in");
  }

  let user: Awaited<ReturnType<typeof prisma.user.findUnique>> = null;
  try {
    user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        internProfile: {
          select: {
            id: true,
            profileCompleted: true,
          },
        },
      },
    });
  } catch (error) {
    logDatabaseUnavailable("dashboard/intern/layout", error);
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container-mantech px-4 py-8">
          <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <Database className="mx-auto h-10 w-10 text-amber-600" />
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Dashboard temporarily unavailable
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              We could not reach your account data right now. This is usually
              temporary — please try again in a moment.
            </p>
            <Link href="/internships" className="mt-6 inline-block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Browse internships instead
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect("/sign-in");
  }

  const userAny = user as any;
  if (userAny.status === "suspended") {
    redirect("/suspended");
  }
  const needsRegistration =
    !userAny.internProfile || !userAny.internProfile.profileCompleted;

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-fixed text-white overflow-x-hidden"
      style={{ backgroundImage: "url('/images/intern_dash_bg.svg')" }}
    >
      {/* Dark overlay with backdrop blur for maximum text readability */}
      <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-[3px]" />

      <div className="relative z-10 container-mantech px-3 sm:px-6 py-4 sm:py-8">
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
              <span>Candidate Career Workspace</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white font-heading break-words">
              {user.fullName || "Your Candidate Dashboard"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 break-words">
              Live application status, interview schedules &amp; credential readiness.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {needsRegistration ? (
              <Badge
                variant="secondary"
                className="bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold"
              >
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Profile Setup Required
              </Badge>
            ) : (
              <Badge variant="default" className="bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/30">
                Profile Complete
              </Badge>
            )}
            <Badge variant="outline" className="border-blue-400/40 text-blue-300 font-semibold bg-blue-950/40">
              MANTECH Verified Candidate
            </Badge>
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl sm:rounded-3xl border border-slate-700/80 bg-slate-900/90 p-2.5 sm:p-4 shadow-2xl backdrop-blur-xl min-w-0">
            <InternNav />
          </aside>
          <div className="min-w-0 bg-slate-900/85 border border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl text-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
