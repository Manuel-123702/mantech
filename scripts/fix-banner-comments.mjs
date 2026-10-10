/**
 * Cleans up comment banner separators that the encoding repair mangled.
 *
 * The em-dash runs used as decoration inside block comments were not valid
 * text; this replaces any leftover run with a plain ASCII rule. Run with:
 *   node scripts/fix-banner-comments.mjs
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

/** Any leftover run of quote/em-dash/euro artifacts inside a comment banner. */
const BROKEN_BANNER = /[”œ“”—–¢€�]{3,}/g;

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
    // Only touch lines that are comments, so a stray symbol in real copy is
    // left for a human to decide on.
    const fixed = original
      .split(/\r?\n/)
      .map((line) => {
        if (!line.trimStart().startsWith("{/*") && !line.trimStart().startsWith("*")) return line;
        return line.replace(BROKEN_BANNER, "---");
      })
      .join("\n");
    if (fixed !== original) {
      await writeFile(file, fixed, "utf8");
      changedFiles += 1;
      console.log(`cleaned ${file}`);
    }
  }
}

console.log(changedFiles === 0 ? "No banner comments to clean." : `${changedFiles} file(s) cleaned.`);