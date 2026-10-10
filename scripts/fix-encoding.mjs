/**
 * Repairs UTF-8 text that was previously read as Windows-1252 and re-saved.
 *
 * PowerShell round-trips turn multi-byte characters into sequences such as
 * "â€”" (em dash) and "Ã©" (e-acute). This maps those back. Run with:
 *   node scripts/fix-encoding.mjs
 *
 * Scoped to app/ and components/ so generated or vendored files are untouched.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

/** Longest first: "â€”" must be replaced before the shorter "â€" prefix. */
const REPLACEMENTS = [
  ["â€”", "—"], // â€” em dash
  ["â€“", "–"], // â€“ en dash
  ["â€¢", "•"], // â€¢ bullet
  ["â€¢", "•"],
  ["â€¦", "…"], // â€¦ ellipsis
  ["â€™", "’"], // â€™ right single quote
  ["â€œ", "“"], // â€œ left double quote
  ["â€\x9d", "”"], // â€ right double quote
  ["â€˜", "‘"], // â€˜ left single quote
  ["Ã©", "é"], // Ã© e-acute
  ["Ã¨", "è"], // Ã¨ e-grave
  ["Ã ", "à"], // Ã  a-grave
  ["Ã´", "ô"], // Ã´ o-circumflex
  ["Ã¼", "ü"], // Ã¼ u-umlaut
  ["Ã§", "ç"], // Ã§ c-cedilla
  ["Ã¯", "ï"], // Ã¯ i-umlaut
  ["Ã", "a"], // Ã stray
  ["â", ""], // â stray
  ["\uFFFD", ""], // replacement char
];

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      yield full;
    }
  }
}

let changedFiles = 0;
for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const original = await readFile(file, "utf8");
    let fixed = original;
    for (const [broken, correct] of REPLACEMENTS) {
      if (fixed.includes(broken)) fixed = fixed.split(broken).join(correct);
    }
    if (fixed !== original) {
      await writeFile(file, fixed, "utf8");
      changedFiles += 1;
      console.log(`fixed ${file}`);
    }
  }
}

console.log(changedFiles === 0 ? "No encoding issues found." : `${changedFiles} file(s) repaired.`);