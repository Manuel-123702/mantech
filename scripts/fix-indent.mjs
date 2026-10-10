/**
 * Normalizes the indentation of a block comment that a prior edit left ragged.
 *
 * Usage: node scripts/fix-indent.mjs <file> <firstLine> <lastLine> <indent>
 * Line numbers are 1-based and inclusive.
 */
import { readFile, writeFile } from "node:fs/promises";

const [file, firstRaw, lastRaw, indentRaw] = process.argv.slice(2);
if (!file || !firstRaw || !lastRaw || indentRaw === undefined) {
  console.error("usage: node scripts/fix-indent.mjs <file> <firstLine> <lastLine> <indent>");
  process.exit(1);
}
const first = Number(firstRaw);
const last = Number(lastRaw);
const indent = indentRaw;

const original = await readFile(file, "utf8");
const lines = original.split(/\r?\n/);
for (let i = first; i <= last; i += 1) {
  const line = lines[i - 1];
  if (line === undefined) continue;
  // Strip whatever leading whitespace is there, then re-apply the target indent.
  lines[i - 1] = line.trim() === "" ? line : indent + line.trim();
}
const fixed = lines.join("\n");
if (fixed !== original) {
  await writeFile(file, fixed, "utf8");
  console.log(`reindented ${file} lines ${first}-${last}`);
} else {
  console.log("no change needed");
}