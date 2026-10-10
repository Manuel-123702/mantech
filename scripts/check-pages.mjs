/**
 * Runtime smoke check for the public pages.
 *
 * The pricing plan cards are fetched from /api/packages on the client, so the
 * server-rendered HTML never contains them. This walks the built JS chunks too,
 * which is where the card markup actually lives.
 *
 * Run with the production server already listening on PORT (default 3000):
 *   node scripts/check-pages.mjs
 */
import http from "node:http";

const PORT = Number(process.env.PORT || 3000);

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: "127.0.0.1", port: PORT, path }, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      })
      .on("error", reject);
  });
}

const failures = [];

function expect(label, condition) {
  console.log(`  ${condition ? "PASS" : "FAIL"}  ${label}`);
  if (!condition) failures.push(label);
}

for (const route of ["/", "/pricing", "/testimonials"]) {
  let response;
  try {
    response = await get(route);
  } catch (error) {
    console.log(`\n${route} -> UNREACHABLE (${error.message})`);
    failures.push(`${route} reachable`);
    continue;
  }
  console.log(`\n${route} -> ${response.status} (${response.body.length} bytes)`);
  expect("returns 200", response.status === 200);
  expect("no mojibake (a-circumflex euro)", !response.body.includes("\u00e2\u20ac"));
  expect("no U+FFFD replacement char", !response.body.includes("\ufffd"));
}

console.log("\n/pricing client bundle contents");
const pricing = await get("/pricing");
const chunkMatches = [
  ...new Set(pricing.body.match(/\/_next\/static\/chunks\/[^"]+\.js/g) ?? []),
];
expect("script chunks are referenced", chunkMatches.length > 0);
let combined = "";
for (const src of chunkMatches) {
  combined += (await get(src)).body;
}
for (const needle of [
  "Subscribe by email",
  "Subscribe on WhatsApp",
  "Most popular",
  "Institutional Partner",
  "Subscription enquiry",
  "bg-[#25D366]",
]) {
  expect(`bundles contain "${needle}"`, combined.includes(needle));
}

console.log("\n/api/packages payload");
const api = await get("/api/packages");
expect("returns 200", api.status === 200);
const parsed = JSON.parse(api.body);
expect("four plans", parsed.packages.length === 4);
const required = [
  "id",
  "name",
  "code",
  "priceXAF",
  "opportunityLimit",
  "candidateSearchLimit",
  "maxRecruiterAccounts",
  "featuredOpportunitiesLimit",
  "isFeaturedBadge",
  "prioritySupport",
  "description",
  "features",
];
for (const plan of parsed.packages) {
  const missing = required.filter((key) => plan[key] === undefined);
  expect(`${plan.code} has every field the card reads`, missing.length === 0);
}
const professional = parsed.packages.find((p) => p.code === "PROFESSIONAL");
expect("Professional Recruiter costs 75,000 XAF", professional?.priceXAF === 75000);
expect("Professional Recruiter is the featured plan", professional?.isFeaturedBadge === true);

console.log(
  failures.length === 0 ? "\nAll checks passed." : `\n${failures.length} check(s) failed.`,
);
process.exit(failures.length === 0 ? 0 : 1);