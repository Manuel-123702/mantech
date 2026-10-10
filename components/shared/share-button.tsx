"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/clipboard";

type ShareButtonProps = {
  /** Site-relative path (e.g. "/intern-passports/abc") or absolute URL. */
  path: string;
  title: string;
  text?: string;
  label?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
};

/**
 * Live share button: opens the native share sheet where the browser has one
 * (mostly phones), otherwise copies the link to the clipboard. Both paths
 * give visible feedback and failures surface as a toast instead of doing
 * nothing.
 */
export function ShareButton({
  path,
  title,
  text,
  label = "Share",
  className,
  variant = "outline",
  size = "sm",
}: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const shareUrl = () =>
    /^https?:\/\//i.test(path) ? path : new URL(path, window.location.origin).toString();

  const handleShare = async () => {
    const url = shareUrl();
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        // User closing the share sheet is not an error.
        if (err instanceof DOMException && err.name === "AbortError") return;
        // No share target available — fall through to copying.
      }
    }

    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard.");
    } else {
      toast.error("Copying was blocked — long-press the address bar to copy the link.");
    }
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={handleShare}>
      <Share2 className="mr-2 h-4 w-4" />
      {copied ? "Copied!" : label}
    </Button>
  );
}
