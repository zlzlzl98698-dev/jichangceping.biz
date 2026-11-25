import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');
const DIST_DIR = path.join(ROOT, 'docs/.vitepress/dist');

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(dir, ext, skipDirs = new Set()) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (skipDirs.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkFiles(full, ext, skipDirs)));
    } else if (e.isFile() && e.name.endsWith(ext)) {
      out.push(full);
    }
  }
  return out;
}

// Lightweight deterministic YAML frontmatter parser for our markdown audit
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, body: raw, hasFrontmatter: false };
  const fmText = match[1];
  const body = raw.slice(match[0].length);
  const data = {};
  const lines = fmText.split(/\r?\n/);

  let currentKey = null;
  let inFaq = false;
  const faqItems = [];
  let currentFaq = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // Top-level key: value
    const topMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (topMatch && !line.startsWith(' ')) {
      currentKey = topMatch[1];
      const val = topMatch[2].trim();
      inFaq = currentKey === 'faq';
      if (inFaq) {
        if (val === '[]') inFaq = false;
        data.faq = faqItems;
      } else if (val.startsWith('[') && val.endsWith(']')) {
        data[currentKey] = val
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
      } else if (val === 'true' || val === 'false') {
        data[currentKey] = val === 'true';
      } else if (val) {
        data[currentKey] = val.replace(/^['"]|['"]$/g, '');
      } else {
        data[currentKey] = [];
      }
      continue;
    }

    if (inFaq) {
      const qStart = line.match(/^\s*-\s+(q|question):\s*(.+)$/);
      if (qStart) {
        currentFaq = { question: qStart[2].trim().replace(/^['"]|['"]$/g, '') };
        faqItems.push(currentFaq);
        continue;
      }
      const qProp = line.match(/^\s+(q|question|a|answer):\s*(.+)$/);
      if (qProp && currentFaq) {
        const k = qProp[1] === 'q' || qProp[1] === 'question' ? 'question' : 'answer';
        currentFaq[k] = qProp[2].trim().replace(/^['"]|['"]$/g, '');
        continue;
      }
    } else if (currentKey && Array.isArray(data[currentKey])) {
      const itemMatch = line.match(/^\s*-\s+(.+)$/);
      if (itemMatch) {
        data[currentKey].push(itemMatch[1].trim().replace(/^['"]|['"]$/g, ''));
      }
    }
  }

  return { data, body, hasFrontmatter: true };
}

export async function runSeoAudit() {
  const errors = [];
  const warnings = [];

  // 1. Check site.ts & seo.ts domain hygiene
  const siteTs = await readFile(path.join(ROOT, 'docs/.vitepress/config/site.ts'), 'utf8');
  const seoTs = await readFile(path.join(ROOT, 'docs/.vitepress/config/seo.ts'), 'utf8');
  if (!siteTs.includes("https://jichangceping.biz")) {
    errors.push('docs/.vitepress/config/site.ts does not define https://jichangceping.biz');
  }
  if (/localhost|127\.0\.0\.1|pages\.dev|vercel\.app/i.test(seoTs)) {
    errors.push('docs/.vitepress/config/seo.ts contains forbidden local/staging domain references');
  }

  // 2. Check affiliate domains not hardcoded in markdown
  const affTs = await readFile(path.join(ROOT, 'data/affiliate-links.ts'), 'utf8');
  const affDomains = new Set();
  for (const m of affTs.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
    affDomains.add(m[1].toLowerCase());
  }

  // 3. Check keyword cannibalization in keyword-page-map.json
  const pageMap = JSON.parse(await readFile(path.join(ROOT, 'data/keywords/keyword-page-map.json'), 'utf8'));
  const kwMapSeen = new Set();
  for (const item of pageMap.items || []) {
    const k = item.primaryKeyword.trim().toLowerCase();
    if (kwMapSeen.has(k)) {
      errors.push(`Keyword cannibalization in keyword-page-map.json: "${item.primaryKeyword}"`);
    }
    kwMapSeen.add(k);
  }

  // 4. Scan Markdown pages
  const mdFiles = await walkFiles(DOCS_DIR, '.md', new Set(['.vitepress', 'public', 'node_modules']));
  const titles = new Map();
  const descriptions = new Map();
  let faqCheckedPages = 0;

  for (const f of mdFiles) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    const raw = await readFile(f, 'utf8');
    const { data, body, hasFrontmatter } = parseFrontmatter(raw);

    if (rel === 'docs/404.md') continue;

    if (!hasFrontmatter) {
      errors.push(`Missing YAML frontmatter in ${rel}`);
      continue;
    }

    if (!data.title || typeof data.title !== 'string') {
      errors.push(`Missing frontmatter.title in ${rel}`);
    } else {
      const tNorm = data.title.trim();
      if (titles.has(tNorm)) {
        errors.push(`Duplicate title "${tNorm}" in ${rel} and ${titles.get(tNorm)}`);
      }
      titles.set(tNorm, rel);
    }

    if (!data.description || typeof data.description !== 'string') {
      errors.push(`Missing frontmatter.description in ${rel}`);
    } else {
      const dNorm = data.description.trim();
      if (descriptions.has(dNorm)) {
        warnings.push(`Duplicate description in ${rel} and ${descriptions.get(dNorm)}`);
      }
      descriptions.set(dNorm, rel);
    }

    if (!data.pubDate && !data.updatedDate && !data.verifiedDate) {
      warnings.push(`Missing pubDate/updatedDate/verifiedDate in ${rel}`);
    }

    // Single H1 check (allow <HomePage /> to render its own H1 on docs/index.md)
    const strippedBody = body.replace(/```[\s\S]*?```/g, '');
    const h1Matches = strippedBody.match(/^#\s+.+$/gm) || [];
    if (rel !== 'docs/index.md' && h1Matches.length === 0) {
      warnings.push(`No Markdown H1 (# Title) found in ${rel}`);
    } else if (h1Matches.length > 1) {
      errors.push(`Multiple H1 headings (${h1Matches.length}) found in ${rel}`);
    }

    // Hardcoded clickable affiliate URL check (allow plain-text domain mentions in conflict docs, forbid clickable https:// links or hrefs)
    for (const dom of affDomains) {
      const escapedDom = dom.replace(/\./g, '\\.');
      const clickableUrlRe = new RegExp(`https?:\\/\\/${escapedDom}|href=["'][^"']*${escapedDom}|\\]\\([^)]*${escapedDom}`, 'i');
      if (clickableUrlRe.test(raw)) {
        errors.push(`Hardcoded affiliate URL for "${dom}" found in ${rel}; use <AffiliateButton /> instead.`);
      }
    }

    // FAQ consistency check: if page has manual FAQ heading, verify frontmatter.faq questions appear in body
    if (Array.isArray(data.faq) && data.faq.length > 0) {
      faqCheckedPages += 1;
      const hasManualFaqHeading = /^##+\s*(faq|常见问题)/im.test(strippedBody);
      if (hasManualFaqHeading) {
        for (const qItem of data.faq) {
          if (qItem.question && !strippedBody.includes(qItem.question.slice(0, Math.min(12, qItem.question.length)))) {
            warnings.push(`FAQ question "${qItem.question}" in ${rel} frontmatter not found verbatim under manual FAQ heading.`);
          }
        }
      }
    }
  }

  if (mdFiles.length === 0) {
    warnings.push('No Markdown pages under docs/ yet; page-level SEO audit skipped until pages are created.');
  }

  // 5. Inspect built dist/ if present
  let distHtmlCount = 0;
  let distHasSitemap = false;
  let distHasRobots = false;
  let distHasLlms = false;
  let distHasRss = false;

  if (await exists(DIST_DIR)) {
    distHasSitemap = await exists(path.join(DIST_DIR, 'sitemap.xml'));
    distHasRobots = await exists(path.join(DIST_DIR, 'robots.txt'));
    distHasLlms = await exists(path.join(DIST_DIR, 'llms.txt'));
    distHasRss = await exists(path.join(DIST_DIR, 'rss.xml'));

    const htmlFiles = await walkFiles(DIST_DIR, '.html');
    distHtmlCount = htmlFiles.length;
    for (const hf of htmlFiles) {
      const hRel = path.relative(DIST_DIR, hf).replace(/\\/g, '/');
      const html = await readFile(hf, 'utf8');
      if (hRel === '404.html') continue;
      if (!/<link\s+rel=["']canonical["']\s+href=["']https:\/\/jichangceping\.biz/i.test(html)) {
        errors.push(`Missing canonical tag pointing to https://jichangceping.biz in dist/${hRel}`);
      }
      if (/<meta\s+name=["']robots["']\s+content=["']noindex/i.test(html)) {
        errors.push(`Unexpected noindex meta tag in indexable page dist/${hRel}`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    stats: {
      markdownPages: mdFiles.length,
      uniqueTitles: titles.size,
      uniqueDescriptions: descriptions.size,
      faqCheckedPages,
      mappedPrimaryKeywords: kwMapSeen.size,
      distHtmlCount,
      distHasSitemap,
      distHasRobots,
      distHasLlms,
      distHasRss
    },
    errors,
    warnings
  };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('audit-seo.mjs')) {
  const result = await runSeoAudit();
  console.log('[audit:seo] Stats:', JSON.stringify(result.stats));
  for (const w of result.warnings) console.warn('[audit:seo] WARN:', w);
  for (const e of result.errors) console.error('[audit:seo] ERROR:', e);
  if (!result.ok) {
    process.exitCode = 1;
  } else {
    console.log('[audit:seo] PASSED (0 errors)');
  }
}
