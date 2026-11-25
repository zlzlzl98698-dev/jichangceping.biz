import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { runSourceAudit } from './audit-sources.mjs';
import { runBrandDataValidation } from './validate-brand-data.mjs';

const ROOT = process.cwd();

async function exists(relPath) {
  try {
    await access(path.join(ROOT, relPath));
    return true;
  } catch {
    return false;
  }
}

async function countMarkdown(dir) {
  let count = 0;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const e of entries) {
    if (e.name === '.vitepress' || e.name === 'public' || e.name === 'node_modules') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) count += await countMarkdown(full);
    else if (e.isFile() && e.name.endsWith('.md')) count += 1;
  }
  return count;
}

const requiredFiles = [
  'docs/.vitepress/config.ts',
  'docs/.vitepress/config/site.ts',
  'docs/.vitepress/config/nav.ts',
  'docs/.vitepress/config/sidebar.ts',
  'docs/.vitepress/config/seo.ts',
  'docs/.vitepress/config/search.ts',
  'docs/.vitepress/theme/index.ts',
  'docs/.vitepress/theme/Layout.vue',
  'data/brands.json',
  'data/plans.json',
  'data/clients.json',
  'data/benchmarks.json',
  'data/affiliate-links.ts'
];

const missingFiles = [];
for (const rf of requiredFiles) {
  if (!(await exists(rf))) missingFiles.push(rf);
}
if (missingFiles.length > 0) {
  console.error('[prebuild] Missing required files:', missingFiles.join(', '));
  process.exit(1);
}

const sourceRes = await runSourceAudit();
const brandRes = await runBrandDataValidation();
const mdCount = await countMarkdown(path.join(ROOT, 'docs'));

if (!sourceRes.ok || !brandRes.ok) {
  for (const e of [...sourceRes.errors, ...brandRes.errors]) {
    console.error('[prebuild] ERROR:', e);
  }
  process.exit(1);
}

const siteTs = await readFile(path.join(ROOT, 'docs/.vitepress/config/site.ts'), 'utf8');
const algoliaConfigured = Boolean(
  process.env.ALGOLIA_APP_ID &&
  process.env.ALGOLIA_SEARCH_API_KEY &&
  process.env.ALGOLIA_INDEX_NAME
);

console.log('[prebuild] Ready:', JSON.stringify({
  markdownPages: mdCount,
  brands: brandRes.stats.brands,
  plans: brandRes.stats.plans,
  clients: brandRes.stats.clients,
  benchmarks: brandRes.stats.benchmarks,
  algoliaMode: algoliaConfigured ? 'algolia' : 'local-fallback',
  domain: siteTs.includes('https://jichangceping.biz') ? 'https://jichangceping.biz' : 'unknown'
}));
