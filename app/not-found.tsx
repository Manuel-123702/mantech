import Link from "next/link";
import { Compass, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

/** App-level 404 boundary (SRS §25). */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="h-7 w-7" />
        </div>

        <p className="mt-5 font-mono text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The page you are looking for does not exist, or the listing has
          expired. Try searching the marketplace instead.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-gradient-mantech">
            <Link href="/internships">
              <Search className="mr-2 h-4 w-4" />
              Browse internships
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
