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
  const needsRegistration =
    !userAny.internProfile || !userAny.internProfile.profileCompleted;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-mantech px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Intern workspace
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              {user.fullName || "Your Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {needsRegistration ? (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 border-amber-200"
              >
                <FileText className="mr-1 h-3 w-3" />
                Profile setup required
              </Badge>
            ) : (
              <Badge variant="default" className="bg-emerald-600">
                Profile complete
              </Badge>
            )}
            <Badge variant="outline">MANTECH Intern</Badge>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-2xl border bg-white p-3 shadow-sm">
            <InternNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
