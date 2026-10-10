/**
 * Copy text to the clipboard with a fallback chain.
 *
 * `navigator.clipboard` only exists on secure origins (https/localhost) and
 * can reject when the document is not focused (embedded previews, some
 * in-app browsers). Falling back to the legacy `execCommand` path keeps the
 * Save/Share/Copy buttons working there instead of failing silently.
 *
 * Returns true only when something actually landed on the clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Blocked or unavailable — try the legacy path below.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
