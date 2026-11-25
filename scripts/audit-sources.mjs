import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

async function exists(relPath) {
  try {
    await access(path.join(ROOT, relPath));
    return true;
  } catch {
    return false;
  }
}

async function readJson(relPath) {
  return JSON.parse(await readFile(path.join(ROOT, relPath), 'utf8'));
}

export async function runSourceAudit() {
  const errors = [];
  const warnings = [];

  const [brandSources, benchmarkSources, brands, plans, benchmarks, routes, history] = await Promise.all([
    readJson('data/brand-sources.json'),
    readJson('data/benchmark-sources.json'),
    readJson('data/brands.json'),
    readJson('data/plans.json'),
    readJson('data/benchmarks.json'),
    readJson('data/network-routes.json'),
    readJson('data/brand-history.json')
  ]);

  const validSourceIds = new Set(brandSources.map((s) => s.id));
  for (const bs of benchmarkSources) {
    validSourceIds.add(bs.id);
  }

  let checkedSourceFiles = 0;
  for (const src of brandSources) {
    checkedSourceFiles += 1;
    if (!src.path || !(await exists(src.path))) {
      errors.push(`Missing brand source path for ${src.id}: ${src.path}`);
    }
  }

  let checkedBenchmarkImages = 0;
  for (const bs of benchmarkSources) {
    if (bs.imagePath) {
      checkedBenchmarkImages += 1;
      const diskPath = path.join('docs/public', bs.imagePath.replace(/^\/+/, ''));
      if (!(await exists(diskPath))) {
        errors.push(`Missing benchmark image asset for ${bs.id}: ${diskPath}`);
      }
    }
  }

  let checkedLogos = 0;
  for (const brand of brands) {
    if (brand.logo) {
      checkedLogos += 1;
      const diskPath = path.join('docs/public', brand.logo.replace(/^\/+/, ''));
      if (!(await exists(diskPath))) {
        errors.push(`Missing logo asset for brand "${brand.slug}": ${diskPath}`);
      }
    }
    for (const sid of brand.sourceIds || []) {
      if (!validSourceIds.has(sid)) {
        errors.push(`Unknown sourceId "${sid}" referenced in brands.json (${brand.slug})`);
      }
    }
  }

  for (const plan of plans) {
    if (plan.sourceId && !validSourceIds.has(plan.sourceId)) {
      errors.push(`Unknown sourceId "${plan.sourceId}" in plans.json (${plan.id})`);
    }
  }

  for (const bm of benchmarks) {
    if (bm.sourceId && !validSourceIds.has(bm.sourceId)) {
      errors.push(`Unknown sourceId "${bm.sourceId}" in benchmarks.json (${bm.id})`);
    }
    if (bm.imagePath) {
      const diskPath = path.join('docs/public', bm.imagePath.replace(/^\/+/, ''));
      if (!(await exists(diskPath))) {
        errors.push(`Missing benchmark image for ${bm.id}: ${diskPath}`);
      }
    }
  }

  for (const r of routes) {
    for (const sid of r.sourceIds || []) {
      if (!validSourceIds.has(sid)) {
        errors.push(`Unknown sourceId "${sid}" in network-routes.json (${r.brandSlug})`);
      }
    }
  }

  for (const h of history) {
    for (const ev of h.timeline || []) {
      if (ev.sourceId && !validSourceIds.has(ev.sourceId)) {
        errors.push(`Unknown sourceId "${ev.sourceId}" in brand-history.json (${h.brandSlug})`);
      }
    }
  }

  const outOfCatalogBenchmarks = benchmarkSources.filter((b) => b.inBrandCatalog === false);
  if (outOfCatalogBenchmarks.length > 0) {
    warnings.push(
      `${outOfCatalogBenchmarks.length} benchmark source(s) marked inBrandCatalog=false (${outOfCatalogBenchmarks
        .map((b) => b.brandName)
        .join(', ')}) — kept outside 31-brand catalog.`
    );
  }

  return {
    ok: errors.length === 0,
    stats: {
      brandSources: brandSources.length,
      benchmarkSources: benchmarkSources.length,
      checkedSourceFiles,
      checkedBenchmarkImages,
      checkedLogos,
      brands: brands.length,
      plans: plans.length,
      benchmarks: benchmarks.length
    },
    errors,
    warnings
  };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('audit-sources.mjs')) {
  const result = await runSourceAudit();
  console.log('[audit:sources] Stats:', JSON.stringify(result.stats));
  for (const w of result.warnings) console.warn('[audit:sources] WARN:', w);
  for (const e of result.errors) console.error('[audit:sources] ERROR:', e);
  if (!result.ok) {
    process.exitCode = 1;
  } else {
    console.log('[audit:sources] PASSED (0 errors)');
  }
}
