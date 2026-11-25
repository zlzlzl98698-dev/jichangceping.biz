import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const KEYWORDS_PATH = path.join(ROOT, 'data/keywords/keywords.json');
const PAGE_MAP_PATH = path.join(ROOT, 'data/keywords/keyword-page-map.json');
const CLUSTERS_PATH = path.join(ROOT, 'data/keywords/keyword-clusters.json');

const kwDoc = JSON.parse(await readFile(KEYWORDS_PATH, 'utf8'));
const pageMapDoc = JSON.parse(await readFile(PAGE_MAP_PATH, 'utf8'));

const clusterMap = new Map();
const pageMapByUrl = new Map((pageMapDoc.items || []).map((p) => [p.canonicalUrl, p]));

for (const item of kwDoc.items || []) {
  const cid = item.clusterId || `cluster-${item.pillar || 'unclassified'}`;
  if (!clusterMap.has(cid)) {
    const mappedPage = item.targetUrl ? pageMapByUrl.get(item.targetUrl) : null;
    clusterMap.set(cid, {
      clusterId: cid,
      name: cid.replace(/^cluster-/, ''),
      pillar: item.pillar || 'unclassified',
      primaryIntent: mappedPage?.primaryIntent || item.intent || 'informational',
      canonicalHubUrl: item.targetUrl || null,
      coreKeywords: [],
      keywordCount: 0,
      totalImportedVolume: null
    });
  }
  const c = clusterMap.get(cid);
  c.keywordCount += 1;
  if (c.coreKeywords.length < 8 && !c.coreKeywords.includes(item.keyword)) {
    c.coreKeywords.push(item.keyword);
  }
  if (typeof item.searchVolume === 'number') {
    c.totalImportedVolume = (c.totalImportedVolume ?? 0) + item.searchVolume;
  }
}

const clusters = Array.from(clusterMap.values()).sort((a, b) => b.keywordCount - a.keywordCount);

const out = {
  schemaVersion: '1.0',
  generatedAt: new Date().toISOString().slice(0, 10),
  totalClusters: clusters.length,
  items: clusters
};

await writeFile(CLUSTERS_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`[keywords:cluster] Clustered ${kwDoc.items.length} keywords into ${clusters.length} clusters -> data/keywords/keyword-clusters.json`);
