import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * The Intern Passport page people should use.
 *
 * This address used to build a second, almost identical copy of the Passport,
 * and the two copies drifted apart. To avoid having two different versions, it
 * now simply sends people to the one real Passport page.
 *
 * It stays in place because the menu, email messages and admin links all point
 * here, and a link inside the site must never lead to "page not found".
 *
 * We also ask search engines not to list it, because the Passport holds
 * private information.
 */
export const metadata = {
  title: "My Intern Passport | MANTECH Nexus",
  robots: { index: false, follow: false },
};

export default async function MyInternPassportPage() {
  // Check the session first so signed-out visitors go to sign-in instead of
  // being bounced into the dashboard and immediately bounced straight back.
  const session = await auth();
  if (!session.userId) {
    redirect("/sign-in");
  }

  redirect("/dashboard/intern/passport");
}
