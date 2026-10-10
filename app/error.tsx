"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary (SRS §25: proper loading/error/empty states).
 *
 * Without this, any thrown error — most often a `PrismaClientInitializationError`
 * when the database is unreachable — bubbles to Next's default error page and
 * returns a bare 500 with no recovery path.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for the server console; safe errors only, never leak internals to UI.
    console.error("[app/error]", error);
  }, [error]);

  const isDatabaseError =
    /PrismaClientInitializationError|Can't reach database server|database server/i.test(
      error.message,
    );

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          {isDatabaseError ? (
            <Database className="h-7 w-7" />
          ) : (
            <AlertTriangle className="h-7 w-7" />
          )}
        </div>

        <h1 className="mt-5 font-heading text-2xl font-bold text-foreground">
          {isDatabaseError ? "We could not reach the database" : "Something went wrong"}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {isDatabaseError
            ? "MANTECH could not connect to its data service. This is usually temporary. Public listings still work from the offline catalog — please try again in a moment."
            : "An unexpected error occurred while loading this page. Please try again."}
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-muted-foreground/70">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="bg-gradient-mantech">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
