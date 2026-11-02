// Seeds 60 professional fields with specializations into Prisma with retry logic for Neon PostgreSQL.
// Run: node scripts/seed-fields.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SLUGIFY = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function loadFields() {
  const allPath = path.join(__dirname, 'data', 'fields-all.json');
  if (fs.existsSync(allPath)) {
    return JSON.parse(fs.readFileSync(allPath, 'utf8'));
  }
  const files = [1, 2, 3, 4, 5, 6].map((i) => path.join(__dirname, 'data', `fields-${i}.json`));
  const fields = [];
  for (const file of files) {
    if (!fs.existsSync(file)) {
      throw new Error(`Missing data file: ${file}`);
    }
    fields.push(...JSON.parse(fs.readFileSync(file, 'utf8')));
  }
  return fields;
}

async function withRetry(fn, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries - 1) throw e;
      console.warn(`[Retry ${i + 1}/${retries}] Retrying after error: ${e.message}`);
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
}

async function main() {
  const fields = loadFields();
  const keep = new Set(fields.map((field) => field.name));

  const hidden = await withRetry(() =>
    p.field.updateMany({
      where: { name: { notIn: Array.from(keep) } },
      data: { isActive: false },
    })
  );
  console.log(`Hidden ${hidden.count} fields outside the ${fields.length} selected domains.`);

  let count = 0;
  for (const input of fields) {
    const field = await withRetry(() =>
      p.field.upsert({
        where: { name: input.name },
        update: {
          category: input.category,
          slug: SLUGIFY(input.name),
          isActive: true,
        },
        create: {
          name: input.name,
          category: input.category,
          slug: SLUGIFY(input.name),
        },
      })
    );

    for (const spec of input.specs) {
      await withRetry(() =>
        p.specialization.upsert({
          where: { fieldId_name: { fieldId: field.id, name: spec } },
          update: { slug: SLUGIFY(spec), isActive: true },
          create: {
            name: spec,
            slug: SLUGIFY(spec),
            fieldId: field.id,
          },
        })
      );
    }
    count++;
    if (count % 10 === 0) {
      console.log(`Progress: ${count}/${fields.length} fields seeded...`);
    }
  }

  console.log(`Successfully seeded all ${fields.length} fields with specializations.`);
  await p.$disconnect();
}

main().catch((error) => {
  console.error('ERR', error.message);
  process.exit(1);
});
