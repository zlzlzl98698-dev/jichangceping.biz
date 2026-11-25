import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const KEYWORDS_PATH = path.join(ROOT, 'data/keywords/keywords.json');
const PAGE_MAP_PATH = path.join(ROOT, 'data/keywords/keyword-page-map.json');

function parseArgs(argv) {
  const opts = { file: null, source: 'csv', dryRun: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--file' || a === '-f') opts.file = argv[++i] || null;
    else if (a === '--source' || a === '-s') opts.source = argv[++i] || 'csv';
    else if (!a.startsWith('-') && !opts.file) opts.file = a;
  }
  return opts;
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

function parseCsv(text) {
  const clean = text.replace(/^\uFEFF/, '');
  const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const vals = parseCsvLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = vals[idx] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

function toNullableNumber(val) {
  if (val === null || val === undefined || val === '') return null;
  const cleaned = String(val).replace(/[%$,\s]/g, '');
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function extractFields(row) {
  const kw =
    row.keyword ||
    row.query ||
    row['top queries'] ||
    row['热门查询'] ||
    row['查询'] ||
    row['关键词'] ||
    '';
  const searchVolume = toNullableNumber(
    row.searchvolume ?? row['search volume'] ?? row['avg. monthly searches'] ?? row['搜索量']
  );
  const impressions = toNullableNumber(row.impressions ?? row['展示次数'] ?? row['曝光']);
  const clicks = toNullableNumber(row.clicks ?? row['点击次数']);
  const ctr = toNullableNumber(row.ctr ?? row['点击率']);
  const position = toNullableNumber(row.position ?? row['avg. position'] ?? row['排名']);
  const competition = row.competition ?? row['竞争度'] ?? null;
  return {
    keyword: String(kw).trim(),
    searchVolume,
    impressions,
    clicks,
    ctr,
    position,
    competition: competition === '' ? null : competition
  };
}

const opts = parseArgs(process.argv.slice(2));
const kwDoc = JSON.parse(await readFile(KEYWORDS_PATH, 'utf8'));
const pageMapDoc = JSON.parse(await readFile(PAGE_MAP_PATH, 'utf8'));

if (opts.help || !opts.file) {
  console.log('[keywords:import] Usage: npm run keywords:import -- --file <path.csv|path.json> [--source gsc|bing] [--dry-run]');
  console.log(`[keywords:import] Current catalog: ${kwDoc.items.length} keywords ready for GSC/Bing enrichment (seed searchVolume=null policy intact).`);
  process.exit(0);
}

const targetPath = path.isAbsolute(opts.file) ? opts.file : path.join(ROOT, opts.file);
const rawInput = await readFile(targetPath, 'utf8');
let incomingRows = [];

if (targetPath.toLowerCase().endsWith('.json')) {
  const parsed = JSON.parse(rawInput);
  incomingRows = Array.isArray(parsed) ? parsed : parsed.items || parsed.rows || [];
} else {
  incomingRows = parseCsv(rawInput);
}

const byNormalized = new Map(kwDoc.items.map((k) => [k.normalizedKeyword, k]));
const pageByKw = new Map();
for (const pm of pageMapDoc.items || []) {
  pageByKw.set(pm.primaryKeyword.trim().toLowerCase(), pm);
  for (const s of pm.secondaryKeywords || []) {
    pageByKw.set(s.trim().toLowerCase(), pm);
  }
}

const nowIso = new Date().toISOString().slice(0, 10);
let updated = 0;
let added = 0;
let skippedEmpty = 0;
let nextId = kwDoc.items.length + 1;

for (const rawRow of incomingRows) {
  const item = extractFields(rawRow);
  if (!item.keyword) {
    skippedEmpty += 1;
    continue;
  }
  const norm = item.keyword.toLowerCase();
  const existing = byNormalized.get(norm);
  if (existing) {
    if (item.searchVolume !== null) existing.searchVolume = item.searchVolume;
    if (item.impressions !== null) existing.impressions = item.impressions;
    if (item.clicks !== null) existing.clicks = item.clicks;
    if (item.ctr !== null) existing.ctr = item.ctr;
    if (item.position !== null) existing.position = item.position;
    if (item.competition !== null) existing.competition = item.competition;
    existing.source = opts.source;
    existing.lastImportedAt = nowIso;
    updated += 1;
  } else {
    const matchedPage = pageByKw.get(norm);
    const newEntry = {
      id: `kw-${String(nextId++).padStart(4, '0')}`,
      keyword: item.keyword,
      normalizedKeyword: norm,
      pillar: matchedPage ? matchedPage.pillar : 'unclassified',
      clusterId: matchedPage ? `cluster-${matchedPage.pillar}` : 'cluster-imported-unassigned',
      intent: 'informational',
      stage: 'consideration',
      targetUrl: matchedPage ? matchedPage.canonicalUrl : null,
      brandSlug: matchedPage ? matchedPage.brandSlug : null,
      clientSlug: matchedPage ? matchedPage.clientSlug : null,
      priority: 'P2',
      searchVolume: item.searchVolume,
      competition: item.competition,
      cpc: null,
      impressions: item.impressions,
      clicks: item.clicks,
      ctr: item.ctr,
      position: item.position,
      source: opts.source,
      status: matchedPage ? 'mapped' : 'backlog',
      lastImportedAt: nowIso
    };
    kwDoc.items.push(newEntry);
    byNormalized.set(norm, newEntry);
    added += 1;
  }
}

kwDoc.totalKeywords = kwDoc.items.length;
kwDoc.lastImportDate = nowIso;

if (!opts.dryRun) {
  await writeFile(KEYWORDS_PATH, JSON.stringify(kwDoc, null, 2) + '\n', 'utf8');
}

console.log('[keywords:import] Summary:', JSON.stringify({ file: opts.file, source: opts.source, dryRun: opts.dryRun, updated, added, skippedEmpty, totalKeywords: kwDoc.items.length }));
