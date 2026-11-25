import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');
const DIST_DIR = path.join(ROOT, 'docs/.vitepress/dist');
const REPORTS_DIR = path.join(ROOT, 'reports');
const MAX_CONTENT_LENGTH = 4000;
const ALGOLIA_BATCH_SIZE = 100;

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
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
  return `/${rel.replace(/\.md$/, '')}/`;
}

function routeToObjectId(route) {
  if (route === '/') return 'home';
  return route.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-');
}

function stripQuotes(str) {
  return str.trim().replace(/^['"]|['"]$/g, '');
}

function parseFrontmatter(raw) {
  const normalized = raw.replace(/^\uFEFF/, '');
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { data: {}, body: normalized };

  const fmText = match[1];
  const body = normalized.slice(match[0].length);
  const data = {};
  const lines = fmText.split(/\r?\n/);

  let currentKey = null;
  let currentIndent = 0;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const topMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (topMatch && !line.startsWith(' ')) {
      currentKey = topMatch[1];
      currentIndent = 0;
      const val = topMatch[2].trim();

      if (val.startsWith('[') && val.endsWith(']')) {
        data[currentKey] = val
          .slice(1, -1)
          .split(',')
          .map(stripQuotes)
          .filter(Boolean);
      } else if (val === 'true' || val === 'false') {
        data[currentKey] = val === 'true';
      } else if (val) {
        data[currentKey] = stripQuotes(val);
      } else {
        data[currentKey] = [];
      }
      continue;
    }

    if (currentKey && Array.isArray(data[currentKey])) {
      const listMatch = line.match(/^(\s*)-\s+(.+)$/);
      if (listMatch && (currentIndent === 0 || listMatch[1].length <= currentIndent)) {
        currentIndent = listMatch[1].length;
        const itemVal = listMatch[2].trim();
        if (!itemVal.includes(': ')) {
          data[currentKey].push(stripQuotes(itemVal));
        }
      }
    }
  }

  return { data, body };
}

function cleanInlineMarkdown(text) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__|\*|_|~~)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHeadings(body) {
  const withoutCode = body.replace(/```[\s\S]*?```/g, '');
  const headings = [];
  for (const line of withoutCode.split(/\r?\n/)) {
    const m = line.match(/^(#{1,3})\s+(.+?)\s*#*$/);
    if (!m) continue;
    const text = cleanInlineMarkdown(m[2]);
    if (text) headings.push(text);
  }
  return headings;
}

function extractPlainTextExcerpt(body, maxLength = MAX_CONTENT_LENGTH) {
  let text = body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/```[^\n]*\n([\s\S]*?)```/g, ' $1 ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*\|?(?:\s*:?-+:?\s*\|)+\s*$/gm, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*([-*_])\1{2,}\s*$/gm, ' ')
    .replace(/\|/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__|\*|_|~~)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length > maxLength) {
    text = text.slice(0, maxLength).trimEnd();
  }
  return text;
}

function uniqueStrings(values) {
  const seen = new Set();
  const result = [];
  for (const v of values) {
    if (typeof v !== 'string') continue;
    const trimmed = v.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

async function pushToAlgolia(records) {
  const appId = (process.env.ALGOLIA_APP_ID || '').trim();
  const adminKey = (process.env.ALGOLIA_ADMIN_API_KEY || '').trim();
  const indexName = (process.env.ALGOLIA_INDEX_NAME || '').trim();

  if (!appId || !adminKey || !indexName) {
    console.log(
      '[search:index] Algolia push skipped: ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY, and ALGOLIA_INDEX_NAME are not all set in environment. Local index files were generated cleanly.'
    );
    return { pushed: false, batches: 0, recordsPushed: 0 };
  }

  const endpoint = `https://${appId}.algolia.net/1/indexes/${encodeURIComponent(indexName)}/batch`;
  let batches = 0;

  for (let i = 0; i < records.length; i += ALGOLIA_BATCH_SIZE) {
    const chunk = records.slice(i, i + ALGOLIA_BATCH_SIZE);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Algolia-Application-Id': appId,
        'X-Algolia-API-Key': adminKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: chunk.map((record) => ({
          action: 'updateObject',
          body: record
        }))
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Algolia batch upload failed (${res.status}): ${errText}`);
    }
    batches += 1;
  }

  console.log(
    `[search:index] Pushed ${records.length} records to Algolia index "${indexName}" in ${batches} batch(es).`
  );
  return { pushed: true, batches, recordsPushed: records.length };
}

export async function buildSearchIndex(options = {}) {
  const { push = false, quiet = false } = options;

  const [brandsRaw, clientsRaw, mdFiles] = await Promise.all([
    readFile(path.join(ROOT, 'data/brands.json'), 'utf8'),
    readFile(path.join(ROOT, 'data/clients.json'), 'utf8'),
    walkMarkdownFiles(DOCS_DIR)
  ]);

  const brands = JSON.parse(brandsRaw);
  const clients = JSON.parse(clientsRaw);

  const brandBySlug = new Map(brands.map((b) => [b.slug, b]));
  const brandByReviewUrl = new Map(brands.filter((b) => b.reviewUrl).map((b) => [b.reviewUrl, b]));
  const clientBySlug = new Map(clients.map((c) => [c.slug, c]));

  const records = [];

  for (const filePath of mdFiles) {
    const rel = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/');
    if (rel === '404.md' || rel.endsWith('/404.md')) continue;

    const raw = await readFile(filePath, 'utf8');
    const { data: fm, body } = parseFrontmatter(raw);
    if (fm.draft === true) continue;

    const url = mdFileToRoute(filePath);
    const headings = extractHeadings(body);
    const title =
      (typeof fm.title === 'string' && fm.title.trim()) ||
      headings[0] ||
      url;
    const description =
      typeof fm.description === 'string' ? fm.description.trim() : '';

    let matchedBrand = brandByReviewUrl.get(url) || null;
    if (!matchedBrand && url.startsWith('/reviews/') && typeof fm.slug === 'string') {
      matchedBrand = brandBySlug.get(fm.slug) || null;
    }

    let matchedClient = null;
    if (url.startsWith('/clients/') && url !== '/clients/' && url !== '/clients/compatibility/') {
      const clientSlug = url.replace(/^\/clients\/|\/$/g, '');
      matchedClient = clientBySlug.get(clientSlug) || null;
    }

    const brand = matchedBrand
      ? matchedBrand.name
      : typeof fm.brand === 'string' && fm.brand.trim()
        ? fm.brand.trim()
        : null;

    const category =
      (typeof fm.category === 'string' && fm.category.trim()) ||
      (typeof fm.pillar === 'string' && fm.pillar.trim()) ||
      (url === '/' ? 'home' : url.split('/').filter(Boolean)[0] || 'general');

    const extraBrandTags = matchedBrand
      ? [
          matchedBrand.name,
          matchedBrand.englishName,
          ...(matchedBrand.aliases || [])
        ]
      : [];

    const extraClientTags = matchedClient
      ? [
          matchedClient.name,
          matchedClient.coreEngine,
          ...(matchedClient.os || [])
        ]
      : [];

    const fmTags = Array.isArray(fm.tags) ? fm.tags : [];
    const tags = uniqueStrings([...fmTags, ...extraBrandTags, ...extraClientTags]);

    const updatedDate =
      (typeof fm.updatedDate === 'string' && fm.updatedDate.trim()) ||
      (typeof fm.verifiedDate === 'string' && fm.verifiedDate.trim()) ||
      (typeof fm.pubDate === 'string' && fm.pubDate.trim()) ||
      null;

    const content = extractPlainTextExcerpt(body, MAX_CONTENT_LENGTH) || description || title;

    records.push({
      objectID: routeToObjectId(url),
      url,
      title,
      description,
      headings,
      content,
      brand,
      category,
      tags,
      updatedDate
    });
  }

  records.sort((a, b) => a.url.localeCompare(b.url));

  const payload = JSON.stringify(records, null, 2) + '\n';

  await mkdir(REPORTS_DIR, { recursive: true });
  const reportsOutputPath = path.join(REPORTS_DIR, 'algolia-index.json');
  await writeFile(reportsOutputPath, payload, 'utf8');

  let distWritten = false;
  const distOutputPath = path.join(DIST_DIR, 'search-index.json');
  if (await exists(DIST_DIR)) {
    await writeFile(distOutputPath, payload, 'utf8');
    distWritten = true;
  }

  let pushResult = { pushed: false, batches: 0, recordsPushed: 0 };
  if (push) {
    pushResult = await pushToAlgolia(records);
  }

  if (!quiet) {
    console.log(
      '[search:index] Summary:',
      JSON.stringify({
        records: records.length,
        reportsIndex: 'reports/algolia-index.json',
        distIndex: distWritten ? 'docs/.vitepress/dist/search-index.json' : 'skipped (dist/ missing)',
        pushed: pushResult.pushed
      })
    );
  }

  return {
    count: records.length,
    reportsOutputPath,
    distWritten,
    distOutputPath: distWritten ? distOutputPath : null,
    pushResult
  };
}

const isDirectRun =
  process.argv[1] &&
  (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` ||
    process.argv[1].endsWith('build-search-index.mjs'));

if (isDirectRun) {
  const pushFlag = process.argv.includes('--push');
  await buildSearchIndex({ push: pushFlag });
}
