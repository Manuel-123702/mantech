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
      className="min-h-screen relative bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: "url('/images/intern_dash_bg.svg')" }}
    >
      {/* Dark overlay with backdrop blur for maximum text readability */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px]" />

      <div className="relative z-10 container-mantech px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Intern Career Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {user.fullName || "Your Intern Dashboard"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Live application status, interview schedules & credential readiness.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
              MANTECH Verified Intern
            </Badge>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-3xl border border-slate-700/80 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
            <InternNav />
          </aside>
          <div className="min-w-0 bg-slate-900/80 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl text-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
