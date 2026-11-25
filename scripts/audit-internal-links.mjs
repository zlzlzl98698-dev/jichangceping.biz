import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');

async function walkMarkdownFiles(dir) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (entry.name === '.vitepress' || entry.name === 'public' || entry.name === 'node_modules') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkMarkdownFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

function mdFileToRoute(absPath) {
  const rel = path.relative(DOCS_DIR, absPath).replace(/\\/g, '/');
  if (rel === 'index.md') return '/';
  if (rel.endsWith('/index.md')) return `/${rel.slice(0, -'index.md'.length)}`;
  return `/${rel.replace(/\.md$/, '')}`;
}

async function fileExists(absPath) {
  try {
    await access(absPath);
    return true;
  } catch {
    return false;
  }
}

function extractInternalLinks(content) {
  const links = [];
  // Strip fenced code blocks before scanning links
  const cleaned = content.replace(/```[\s\S]*?```/g, '');

  // Markdown links: [text](url) excluding image syntax ![alt](url)
  const mdRegex = /(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (const m of cleaned.matchAll(mdRegex)) {
    links.push({ text: m[1], target: m[2], kind: 'markdown' });
  }

  // HTML anchor links: <a href="...">
  const htmlRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  for (const m of cleaned.matchAll(htmlRegex)) {
    links.push({ text: 'html-anchor', target: m[1], kind: 'html' });
  }

  return links;
}

function normalizeRouteTarget(rawTarget, currentRoute) {
  const withoutHash = rawTarget.split('#')[0].split('?')[0].trim();
  if (!withoutHash) return null; // same-page anchor
  if (/^(https?:|mailto:|tel:|javascript:)/i.test(withoutHash)) return null;

  if (withoutHash.startsWith('/')) {
    return withoutHash;
  }
  const baseDir = currentRoute.endsWith('/') ? currentRoute : path.posix.dirname(currentRoute) + '/';
  return path.posix.resolve(baseDir, withoutHash);
}

export async function runInternalLinksAudit() {
  const errors = [];
  const warnings = [];
  const mdFiles = await walkMarkdownFiles(DOCS_DIR);
  const routeSet = new Set();

  for (const f of mdFiles) {
    const r = mdFileToRoute(f);
    routeSet.add(r);
    if (r !== '/' && r.endsWith('/')) {
      routeSet.add(r.slice(0, -1));
    } else if (r !== '/') {
      routeSet.add(`${r}/`);
    }
  }

  let totalLinksChecked = 0;
  let brokenMarkdownLinks = 0;

  for (const f of mdFiles) {
    const relPath = path.relative(ROOT, f).replace(/\\/g, '/');
    const route = mdFileToRoute(f);
    const content = await readFile(f, 'utf8');
    const extracted = extractInternalLinks(content);

    for (const link of extracted) {
      const resolved = normalizeRouteTarget(link.target, route);
      if (!resolved) continue;
      totalLinksChecked += 1;

      if (routeSet.has(resolved)) continue;

      // Check static asset under docs/public
      const publicAsset = path.join(DOCS_DIR, 'public', resolved.replace(/^\/+/, ''));
      if (await fileExists(publicAsset)) continue;

      brokenMarkdownLinks += 1;
      errors.push(`Broken internal link in ${relPath}: "${link.target}" (resolved to "${resolved}")`);
    }
  }

  // Also check data/links/internal-links.json coverage against docs routes
  let matrixEdges = 0;
  let matrixUnresolvedTargets = 0;
  try {
    const matrix = JSON.parse(await readFile(path.join(ROOT, 'data/links/internal-links.json'), 'utf8'));
    const items = matrix.items || [];
    matrixEdges = items.length;
    if (mdFiles.length > 0) {
      for (const edge of items) {
        if (!routeSet.has(edge.to)) {
          matrixUnresolvedTargets += 1;
        }
      }
      if (matrixUnresolvedTargets > 0) {
        warnings.push(`${matrixUnresolvedTargets}/${matrixEdges} edges in data/links/internal-links.json point to routes not yet created in docs/.`);
      }
    }
  } catch (err) {
    errors.push(`Failed to read data/links/internal-links.json: ${err.message}`);
  }

  if (mdFiles.length === 0) {
    warnings.push('No Markdown pages found under docs/ yet; markdown link scan skipped until pages are created.');
  }

  return {
    ok: errors.length === 0,
    stats: {
      markdownPages: mdFiles.length,
      totalLinksChecked,
      brokenMarkdownLinks,
      matrixEdges,
      matrixUnresolvedTargets
    },
    errors,
    warnings
  };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('audit-internal-links.mjs')) {
  const result = await runInternalLinksAudit();
  console.log('[audit:links] Stats:', JSON.stringify(result.stats));
  for (const w of result.warnings) console.warn('[audit:links] WARN:', w);
  for (const e of result.errors) console.error('[audit:links] ERROR:', e);
  if (!result.ok) {
    process.exitCode = 1;
  } else {
    console.log('[audit:links] PASSED (0 errors)');
  }
}
