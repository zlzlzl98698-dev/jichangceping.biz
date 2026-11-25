import { access, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildSearchIndex } from './build-search-index.mjs';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'docs/.vitepress/dist');
const SITE_DOMAIN = 'https://jichangceping.biz';

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function walkHtml(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walkHtml(full)));
    else if (e.isFile() && e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extractTag(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : '';
}

if (!(await exists(DIST_DIR))) {
  console.error('[postbuild] ERROR: docs/.vitepress/dist does not exist. Run vitepress build docs first.');
  process.exit(1);
}

const [brands, clients, benchmarks] = await Promise.all([
  JSON.parse(await readFile(path.join(ROOT, 'data/brands.json'), 'utf8')),
  JSON.parse(await readFile(path.join(ROOT, 'data/clients.json'), 'utf8')),
  JSON.parse(await readFile(path.join(ROOT, 'data/benchmarks.json'), 'utf8'))
]);

// 1. Generate robots.txt
const robotsTxt = [
  '# robots.txt for 机场测评 (jichangceping.biz)',
  'User-agent: *',
  'Allow: /',
  '',
  'User-agent: Googlebot',
  'Allow: /',
  '',
  'User-agent: bingbot',
  'Allow: /',
  '',
  'User-agent: Baiduspider',
  'Allow: /',
  '',
  'User-agent: yisouspider',
  'Allow: /',
  '',
  `Sitemap: ${SITE_DOMAIN}/sitemap.xml`,
  ''
].join('\n');
await writeFile(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');

// 2. Generate llms.txt
const featuredBrands = brands.filter((b) => b.featuredRank).sort((a, b) => a.featuredRank - b.featuredRank);
const otherBrands = brands.filter((b) => !b.featuredRank);
const llmsLines = [
  '# 机场测评 (Airport Review Lab)',
  '',
  '> 面向中文用户的专业网络服务测评实验室、31 家机场品牌数据库、MiaoKo 测速证据库、24 款客户端技术文档与理性购前风险分析平台。',
  '',
  `- Canonical Domain: ${SITE_DOMAIN}`,
  '- Language: zh-CN',
  '- Commercial Disclosure: 含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。',
  '- Data Integrity Policy: 所有测速与可用性结论区分 Measured / Vendor Data / Historical Data / Not Tested / Unverified / Conflicting；缺失指标统一标记为「待核实」，禁止编造数据或强行对比非同条件批次。',
  '',
  '## Core Navigation Hubs',
  `- [首页](${SITE_DOMAIN}/)`,
  `- [机场推荐总览](${SITE_DOMAIN}/recommend/)`,
  `- [2026 机场分级排行](${SITE_DOMAIN}/rankings/)`,
  `- [价格与套餐数据库](${SITE_DOMAIN}/plans/database/)`,
  `- [31 家机场品牌数据库](${SITE_DOMAIN}/brands/)`,
  `- [品牌横向对比中心](${SITE_DOMAIN}/compare/)`,
  `- [测速与性能证据库](${SITE_DOMAIN}/benchmarks/)`,
  `- [测评方法论与指标权重](${SITE_DOMAIN}/methodology/)`,
  `- [代理客户端软件库](${SITE_DOMAIN}/clients/)`,
  `- [AI 与流媒体解锁中心](${SITE_DOMAIN}/ai-streaming/)`,
  `- [线路与节点技术总览](${SITE_DOMAIN}/network/)`,
  `- [使用教程中心](${SITE_DOMAIN}/guides/)`,
  `- [故障诊断中心](${SITE_DOMAIN}/troubleshooting/)`,
  `- [风险控制与避坑中心](${SITE_DOMAIN}/risks/)`,
  '',
  `## Featured Brands (${featuredBrands.length})`,
  ...featuredBrands.map(
    (b) => `- [${b.name}${b.englishName ? ` (${b.englishName})` : ''}](${SITE_DOMAIN}${b.reviewUrl}): ${b.positioning} | 入门: ${b.entryLabel} | 数据状态: ${b.dataStatus}`
  ),
  '',
  `## Catalog Brands (${otherBrands.length})`,
  ...otherBrands.map(
    (b) => `- [${b.name}](${SITE_DOMAIN}${b.reviewUrl}): 入门: ${b.entryLabel} | 数据状态: ${b.dataStatus}`
  ),
  '',
  `## Client Software Guides (${clients.length} documented in data/clients.json)`,
  `- [客户端总览与兼容性矩阵](${SITE_DOMAIN}/clients/compatibility/)`,
  `- [Clash Verge Rev](${SITE_DOMAIN}/clients/clash-verge-rev/)`,
  `- [v2rayN / v2rayNG](${SITE_DOMAIN}/clients/v2rayn/)`,
  `- [Shadowrocket (小火箭)](${SITE_DOMAIN}/clients/shadowrocket/)`,
  `- [sing-box / FlClash](${SITE_DOMAIN}/clients/sing-box/)`,
  '',
  `## Evidence Batches (${benchmarks.length} records)`,
  `- [测速与截图证据浏览器](${SITE_DOMAIN}/benchmarks/)`,
  ''
];
await writeFile(path.join(DIST_DIR, 'llms.txt'), llmsLines.join('\n'), 'utf8');

// 3. Scan built HTML files & check canonicals + collect RSS entries
const htmlFiles = await walkHtml(DIST_DIR);
const canonicalIssues = [];
const noindexIssues = [];
const rssCandidates = [];

for (const hf of htmlFiles) {
  const rel = path.relative(DIST_DIR, hf).replace(/\\/g, '/');
  const html = await readFile(hf, 'utf8');
  if (rel === '404.html') {
    if (!/<meta\s+name=["']robots["']\s+content=["']noindex/i.test(html)) {
      noindexIssues.push('404.html is missing noindex robots meta');
    }
    continue;
  }

  const canonical = extractTag(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (!canonical || !canonical.startsWith(`${SITE_DOMAIN}/`)) {
    canonicalIssues.push(`${rel} -> canonical="${canonical || 'MISSING'}"`);
  }

  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) {
    noindexIssues.push(`Indexable page ${rel} has unexpected noindex`);
  }

  const title = extractTag(html, /<title>([^<]+)<\/title>/i);
  const desc = extractTag(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const modified = extractTag(html, /<meta\s+property=["']article:modified_time["']\s+content=["']([^"']+)["']/i);

  if (canonical && title) {
    rssCandidates.push({
      title: title.replace(/\s*\|\s*机场测评.*$/, ''),
      url: canonical,
      description: desc || title,
      pubDate: modified ? new Date(`${modified}T00:00:00Z`).toUTCString() : new Date('2026-11-24T00:00:00Z').toUTCString()
    });
  }
}

// Prioritize flagship, featured reviews, and pillars in rss.xml (up to 50 items)
rssCandidates.sort((a, b) => {
  const score = (u) =>
    u.includes('/reviews/guangsuyun/') ? 3 : u.includes('/reviews/') ? 2 : 1;
  return score(b.url) - score(a.url);
});
const rssItems = rssCandidates.slice(0, 50);

const rssXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  '  <channel>',
  '    <title>机场测评 (Airport Review Lab)</title>',
  `    <link>${SITE_DOMAIN}/</link>`,
  '    <description>专业机场测评、31家品牌数据库、MiaoKo实测证据与代理客户端技术文档。</description>',
  '    <language>zh-CN</language>',
  `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
  `    <atom:link href="${SITE_DOMAIN}/rss.xml" rel="self" type="application/rss+xml" />`,
  ...rssItems.map((item) => [
    '    <item>',
    `      <title>${escapeXml(item.title)}</title>`,
    `      <link>${escapeXml(item.url)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(item.url)}</guid>`,
    `      <description>${escapeXml(item.description)}</description>`,
    `      <pubDate>${item.pubDate}</pubDate>`,
    '    </item>'
  ].join('\n')),
  '  </channel>',
  '</rss>',
  ''
].join('\n');
await writeFile(path.join(DIST_DIR, 'rss.xml'), rssXml, 'utf8');

// 4. Verify sitemap.xml
const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
const errors = [...canonicalIssues.map((c) => `Canonical issue: ${c}`), ...noindexIssues];
let sitemapUrlCount = 0;

if (!(await exists(sitemapPath))) {
  errors.push('docs/.vitepress/dist/sitemap.xml was not generated by VitePress.');
} else {
  const smXml = await readFile(sitemapPath, 'utf8');
  const locs = [...smXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  sitemapUrlCount = locs.length;
  if (sitemapUrlCount === 0) {
    errors.push('sitemap.xml contains 0 <loc> URLs.');
  }
  for (const loc of locs) {
    if (!loc.startsWith(`${SITE_DOMAIN}/`)) {
      errors.push(`Sitemap URL has wrong domain: ${loc}`);
    }
    if (loc.includes('404') || loc.includes('draft')) {
      errors.push(`Sitemap URL should have been excluded: ${loc}`);
    }
  }
}

// 5. Generate search-index.json and reports/algolia-index.json
const searchIndexResult = await buildSearchIndex({ quiet: true });

console.log('[postbuild] Summary:', JSON.stringify({
  htmlFiles: htmlFiles.length,
  sitemapUrls: sitemapUrlCount,
  rssItems: rssItems.length,
  searchRecords: searchIndexResult.count,
  generated: ['robots.txt', 'llms.txt', 'rss.xml', 'search-index.json'],
  errors: errors.length
}));

if (errors.length > 0) {
  for (const err of errors) console.error('[postbuild] ERROR:', err);
  process.exit(1);
}
