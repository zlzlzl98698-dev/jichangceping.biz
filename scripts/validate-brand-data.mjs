import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');
const VALID_DATA_STATUS = new Set([
  'Measured',
  'Vendor Data',
  'Historical Data',
  'Not Tested',
  'Unverified',
  'Conflicting'
]);
const VALID_CLIENT_MODES = new Set([
  'self-hosted-and-third-party',
  'exclusive-only',
  'third-party',
  'unverified'
]);
const REQUIRED_ENTITY_TYPES = [
  'Brand',
  'SubscriptionPlan',
  'ClientSoftware',
  'NetworkProtocol',
  'NetworkRoute',
  'Region',
  'Benchmark',
  'ServiceAvailability',
  'Review',
  'RiskEvent'
];

async function readJson(relPath) {
  return JSON.parse(await readFile(path.join(ROOT, relPath), 'utf8'));
}

async function walkMarkdownFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name === '.vitepress' || entry.name === 'public' || entry.name === 'node_modules') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkMarkdownFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function mdFileToRoute(absPath) {
  const rel = path.relative(DOCS_DIR, absPath).replace(/\\/g, '/');
  if (rel === 'index.md') return '/';
  if (rel.endsWith('/index.md')) return `/${rel.slice(0, -'index.md'.length)}`;
  return `/${rel.replace(/\.md$/, '')}`;
}

function isDraftMarkdown(raw) {
  const match = raw.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return false;
  return /^draft:\s*true\s*(?:#.*)?$/m.test(match[1]);
}

export async function runBrandDataValidation() {
  const errors = [];
  const warnings = [];

  const [
    brands,
    plans,
    clients,
    benchmarks,
    availability,
    routes,
    compat,
    history,
    risks,
    keywordsDoc,
    pageMapDoc,
    backlogDoc,
    entitiesDoc
  ] = await Promise.all([
    readJson('data/brands.json'),
    readJson('data/plans.json'),
    readJson('data/clients.json'),
    readJson('data/benchmarks.json'),
    readJson('data/availability.json'),
    readJson('data/network-routes.json'),
    readJson('data/client-compatibility.json'),
    readJson('data/brand-history.json'),
    readJson('data/risk-records.json'),
    readJson('data/keywords/keywords.json'),
    readJson('data/keywords/keyword-page-map.json'),
    readJson('data/keywords/content-backlog.json'),
    readJson('data/entities/entities.json')
  ]);

  const affiliateTs = await readFile(path.join(ROOT, 'data/affiliate-links.ts'), 'utf8');

  // 1. Brands count & uniqueness
  if (brands.length !== 31) {
    errors.push(`Expected exactly 31 brands in data/brands.json, found ${brands.length}`);
  }
  const brandSlugs = new Set();
  const featuredRanks = [];
  const appendedBrands = [];

  for (const b of brands) {
    if (!b.slug || !b.name || !b.entityId) {
      errors.push(`Brand missing slug/name/entityId: ${JSON.stringify(b)}`);
    }
    if (brandSlugs.has(b.slug)) {
      errors.push(`Duplicate brand slug: ${b.slug}`);
    }
    brandSlugs.add(b.slug);

    if (!VALID_DATA_STATUS.has(b.dataStatus)) {
      errors.push(`Invalid dataStatus "${b.dataStatus}" on brand ${b.slug}`);
    }
    if (!VALID_CLIENT_MODES.has(b.clientMode)) {
      errors.push(`Invalid clientMode "${b.clientMode}" on brand ${b.slug}`);
    }
    if (b.featuredRank !== null && b.featuredRank !== undefined) {
      featuredRanks.push(b.featuredRank);
    }
    if (b.isAppendedBrand) {
      appendedBrands.push(b.slug);
    }
    if (!affiliateTs.includes(`"brandSlug": "${b.slug}"`) && !affiliateTs.includes(`brandSlug: '${b.slug}'`)) {
      errors.push(`Missing brandSlug "${b.slug}" in data/affiliate-links.ts`);
    }
  }

  featuredRanks.sort((a, b) => a - b);
  const expectedRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  if (JSON.stringify(featuredRanks) !== JSON.stringify(expectedRanks)) {
    errors.push(`featuredRank must be 1..11, got [${featuredRanks.join(', ')}]`);
  }
  if (appendedBrands.length !== 3) {
    errors.push(`Expected 3 appended brands, got ${appendedBrands.length} (${appendedBrands.join(', ')})`);
  }

  // Affiliate security attributes check
  if (!affiliateTs.includes('nofollow sponsored noopener')) {
    errors.push('data/affiliate-links.ts missing rel="nofollow sponsored noopener"');
  }

  // 2. Plans validation
  for (const p of plans) {
    if (!brandSlugs.has(p.brandSlug)) {
      errors.push(`Plan ${p.id} references unknown brandSlug "${p.brandSlug}"`);
    }
    if (typeof p.priceCny !== 'number' || p.priceCny <= 0) {
      errors.push(`Plan ${p.id} has invalid priceCny: ${p.priceCny}`);
    }
    if (p.billingCycle === 'annual' && typeof p.effectiveMonthlyCny === 'number') {
      const expected = Number((p.priceCny / 12).toFixed(2));
      if (Math.abs(p.effectiveMonthlyCny - expected) > 0.05) {
        errors.push(`Plan ${p.id} effectiveMonthlyCny mismatch: got ${p.effectiveMonthlyCny}, expected ~${expected}`);
      }
    }
  }

  // 3. Clients validation
  if (clients.length < 20) {
    errors.push(`Expected 20+ clients in data/clients.json, found ${clients.length}`);
  }
  const clientSlugs = new Set();
  for (const c of clients) {
    if (clientSlugs.has(c.slug)) errors.push(`Duplicate client slug: ${c.slug}`);
    clientSlugs.add(c.slug);
  }

  // 4. Auxiliary 31-brand datasets
  for (const [label, arr] of [
    ['availability.json', availability],
    ['network-routes.json', routes],
    ['client-compatibility.json', compat],
    ['brand-history.json', history],
    ['risk-records.json', risks]
  ]) {
    if (arr.length !== 31) {
      errors.push(`${label} has ${arr.length} records, expected 31`);
    }
    for (const item of arr) {
      if (!brandSlugs.has(item.brandSlug)) {
        errors.push(`${label} has unknown brandSlug: ${item.brandSlug}`);
      }
    }
  }

  for (const cc of compat) {
    for (const cs of cc.compatibleClientSlugs || []) {
      if (!clientSlugs.has(cs)) {
        errors.push(`client-compatibility.json (${cc.brandSlug}) references unknown clientSlug "${cs}"`);
      }
    }
  }

  // 5. Keywords & Backlog & Entities integrity
  const fakeSeedVolumes = (keywordsDoc.items || []).filter(
    (k) => k.source === 'seed-taxonomy' && k.searchVolume !== null
  );
  if (fakeSeedVolumes.length > 0) {
    errors.push(`Found ${fakeSeedVolumes.length} seed keywords with non-null searchVolume (must remain null until GSC/Bing import)`);
  }

  const seenUrls = new Set();
  const seenPrimaryKws = new Set();
  for (const pm of pageMapDoc.items || []) {
    if (seenUrls.has(pm.canonicalUrl)) errors.push(`Duplicate canonicalUrl in keyword-page-map: ${pm.canonicalUrl}`);
    seenUrls.add(pm.canonicalUrl);
    const normKw = pm.primaryKeyword.trim().toLowerCase();
    if (seenPrimaryKws.has(normKw)) errors.push(`Cannibalization: duplicate primaryKeyword "${pm.primaryKeyword}"`);
    seenPrimaryKws.add(normKw);
  }

  const l2 = backlogDoc.level2Outlines || [];
  const l3 = backlogDoc.level3LongTails || [];
  if (l2.length < 80) errors.push(`Expected 80+ Level-2 outlines in content-backlog.json, found ${l2.length}`);
  if (l3.length < 500) errors.push(`Expected 500+ Level-3 long-tails in content-backlog.json, found ${l3.length}`);

  const allBacklogItems = [...l2, ...l3];
  const invalidStatusItems = allBacklogItems.filter(
    (x) => x.status !== 'backlog' && x.status !== 'published'
  );
  if (invalidStatusItems.length > 0) {
    errors.push(
      `Found ${invalidStatusItems.length} items in content-backlog.json with invalid status (must be "backlog" or "published")`
    );
  }

  const publishedItems = allBacklogItems.filter((x) => x.status === 'published');
  const declaredPublishedCount = backlogDoc.summary?.publishedCount;
  if (typeof declaredPublishedCount !== 'number' || declaredPublishedCount !== publishedItems.length) {
    errors.push(
      `content-backlog.json summary.publishedCount (${declaredPublishedCount}) does not match actual status: "published" count (${publishedItems.length})`
    );
  }

  if (publishedItems.length > 0) {
    const mdFiles = await walkMarkdownFiles(DOCS_DIR);
    const builtDocRoutes = new Set();
    for (const f of mdFiles) {
      const rel = path.relative(DOCS_DIR, f).replace(/\\/g, '/');
      if (rel === '404.md' || rel.endsWith('/404.md')) continue;
      const raw = await readFile(f, 'utf8');
      if (isDraftMarkdown(raw)) continue;
      const route = mdFileToRoute(f);
      builtDocRoutes.add(route);
      if (route !== '/' && route.endsWith('/')) {
        builtDocRoutes.add(route.slice(0, -1));
      } else if (route !== '/') {
        builtDocRoutes.add(`${route}/`);
      }
    }

    for (const item of publishedItems) {
      const targetUrl = (item.suggestedUrl || '').trim();
      if (!targetUrl || !builtDocRoutes.has(targetUrl)) {
        errors.push(
          `content-backlog.json item "${item.id || item.title}" is marked status: "published" but no published Markdown page exists under docs/ for "${targetUrl || '(missing suggestedUrl)'}"`
        );
      }
    }
  }

  const entityTypesPresent = new Set((entitiesDoc.items || []).map((e) => e.entityType));
  for (const reqType of REQUIRED_ENTITY_TYPES) {
    if (!entityTypesPresent.has(reqType)) {
      errors.push(`Missing required entityType "${reqType}" in data/entities/entities.json`);
    }
  }

  return {
    ok: errors.length === 0,
    stats: {
      brands: brands.length,
      featuredRanks: featuredRanks.length,
      appendedBrands: appendedBrands.length,
      plans: plans.length,
      clients: clients.length,
      benchmarks: benchmarks.length,
      keywords: (keywordsDoc.items || []).length,
      mappedUrls: (pageMapDoc.items || []).length,
      backlogLevel2: l2.length,
      backlogLevel3: l3.length,
      backlogPublished: publishedItems.length,
      entities: (entitiesDoc.items || []).length
    },
    errors,
    warnings
  };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('validate-brand-data.mjs')) {
  const result = await runBrandDataValidation();
  console.log('[audit:brands] Stats:', JSON.stringify(result.stats));
  for (const w of result.warnings) console.warn('[audit:brands] WARN:', w);
  for (const e of result.errors) console.error('[audit:brands] ERROR:', e);
  if (!result.ok) {
    process.exitCode = 1;
  } else {
    console.log('[audit:brands] PASSED (0 errors)');
  }
}
