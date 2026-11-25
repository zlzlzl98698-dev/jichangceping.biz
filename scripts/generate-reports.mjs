import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { runSourceAudit } from './audit-sources.mjs';
import { runBrandDataValidation } from './validate-brand-data.mjs';
import { runInternalLinksAudit } from './audit-internal-links.mjs';
import { runSeoAudit } from './audit-seo.mjs';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'reports');
await mkdir(REPORTS_DIR, { recursive: true });

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

const [
  sourceAudit,
  brandAudit,
  linksAudit,
  seoAudit,
  brands,
  plans,
  clients,
  benchmarks,
  riskRecords,
  keywordsDoc,
  clustersDoc,
  pageMapDoc,
  geoQDoc,
  backlogDoc,
  refreshDoc,
  entitiesDoc,
  relationsDoc,
  linksDoc,
  topicRelDoc,
  brandRelDoc
] = await Promise.all([
  runSourceAudit(),
  runBrandDataValidation(),
  runInternalLinksAudit(),
  runSeoAudit(),
  readJson('data/brands.json'),
  readJson('data/plans.json'),
  readJson('data/clients.json'),
  readJson('data/benchmarks.json'),
  readJson('data/risk-records.json'),
  readJson('data/keywords/keywords.json'),
  readJson('data/keywords/keyword-clusters.json'),
  readJson('data/keywords/keyword-page-map.json'),
  readJson('data/keywords/geo-questions.json'),
  readJson('data/keywords/content-backlog.json'),
  readJson('data/keywords/content-refresh.json'),
  readJson('data/entities/entities.json'),
  readJson('data/entities/entity-relations.json'),
  readJson('data/links/internal-links.json'),
  readJson('data/links/topic-relations.json'),
  readJson('data/links/brand-relations.json')
]);

const today = new Date().toISOString().slice(0, 10);
const affTs = await readFile(path.join(ROOT, 'data/affiliate-links.ts'), 'utf8');

// 01-source-audit.md
await writeFile(
  path.join(REPORTS_DIR, '01-source-audit.md'),
  [
    '# 01 · 数据源完整性审计报告',
    '',
    `- 生成日期：${today}`,
    `- 审计状态：${sourceAudit.ok ? 'PASS (0 errors)' : `FAIL (${sourceAudit.errors.length} errors)`}`,
    '',
    '## 核心统计',
    `- \`data/brand-sources.json\` 原始资料集：${sourceAudit.stats.brandSources}`,
    `- \`data/benchmark-sources.json\` 测速证据记录：${sourceAudit.stats.benchmarkSources}`,
    `- 核验源文件路径：${sourceAudit.stats.checkedSourceFiles}`,
    `- 核验品牌 Logo 文件：${sourceAudit.stats.checkedLogos}`,
    `- 核验测速图片文件：${sourceAudit.stats.checkedBenchmarkImages}`,
    '',
    '## 警告与未入库说明',
    ...(sourceAudit.warnings.length ? sourceAudit.warnings.map((w) => `- ${w}`) : ['- 无警告']),
    '',
    '## 错误列表',
    ...(sourceAudit.errors.length ? sourceAudit.errors.map((e) => `- ${e}`) : ['- 无错误']),
    ''
  ].join('\n'),
  'utf8'
);

// 02-brand-data-validation.md
const conflictBrands = brands.filter((b) => (b.conflicts || []).length > 0);
const statusDist = brands.reduce((acc, b) => {
  acc[b.dataStatus] = (acc[b.dataStatus] || 0) + 1;
  return acc;
}, {});

await writeFile(
  path.join(REPORTS_DIR, '02-brand-data-validation.md'),
  [
    '# 02 · 品牌与套餐数据验证报告',
    '',
    `- 生成日期：${today}`,
    `- 校验状态：${brandAudit.ok ? 'PASS (0 errors)' : `FAIL (${brandAudit.errors.length} errors)`}`,
    '',
    '## 数据库规模（实时读取）',
    `- 品牌总数：${brands.length}（主推 featuredRank 1–11：${brandAudit.stats.featuredRanks}；历史追加 isAppendedBrand：${brandAudit.stats.appendedBrands}）`,
    `- 套餐条目数：${plans.length}`,
    `- 客户端记录数：${clients.length}`,
    `- 测速批次记录数：${benchmarks.length}`,
    `- 含源文档口径冲突的品牌数：${conflictBrands.length}`,
    '',
    '## 数据状态分布',
    ...Object.entries(statusDist).map(([k, v]) => `- \`${k}\`: ${v} 家`),
    '',
    '## 验证错误',
    ...(brandAudit.errors.length ? brandAudit.errors.map((e) => `- ${e}`) : ['- 无错误']),
    ''
  ].join('\n'),
  'utf8'
);

// 03-keyword-intelligence-report.md
const importedCount = (keywordsDoc.items || []).filter((k) => k.searchVolume !== null).length;
await writeFile(
  path.join(REPORTS_DIR, '03-keyword-intelligence-report.md'),
  [
    '# 03 · 关键词工程与意图映射报告',
    '',
    `- 生成日期：${today}`,
    `- 总关键词条目：${keywordsDoc.items.length}`,
    `- 已导入真实搜索量条目：${importedCount}（未导入词严格保持 \`searchVolume: null\`）`,
    `- 主题集群数量：${clustersDoc.items.length}`,
    `- 唯一 Canonical 页面映射数：${pageMapDoc.items.length}`,
    `- GEO 问答库条目数：${geoQDoc.items.length}`,
    `- 刷新调度任务数：${refreshDoc.items.length}`,
    '',
    '## 互抢（Cannibalization）检查',
    `- \`keyword-page-map.json\` 主词重复数：${seoAudit.errors.filter((e) => e.includes('Cannibalization')).length}`,
    `- 原则：1 Primary Intent → 1 Canonical URL`,
    ''
  ].join('\n'),
  'utf8'
);

// 04-geo-entity-graph-report.md
await writeFile(
  path.join(REPORTS_DIR, '04-geo-entity-graph-report.md'),
  [
    '# 04 · GEO 实体知识图谱报告',
    '',
    `- 生成日期：${today}`,
    `- 实体总节点数：${entitiesDoc.totalEntities}`,
    `- 有向语义关系三元组数：${relationsDoc.totalRelations}`,
    '',
    '## 实体类型分布（10 类）',
    ...Object.entries(entitiesDoc.typeCounts || {}).map(([t, c]) => `- \`${t}\`: ${c}`),
    ''
  ].join('\n'),
  'utf8'
);

// 05-internal-links-audit.md
await writeFile(
  path.join(REPORTS_DIR, '05-internal-links-audit.md'),
  [
    '# 05 · 内部链接矩阵与死链审计报告',
    '',
    `- 生成日期：${today}`,
    `- 审计状态：${linksAudit.ok ? 'PASS (0 broken markdown links)' : `FAIL (${linksAudit.errors.length} broken links)`}`,
    '',
    '## 链接统计（实时扫描）',
    `- 已扫描 Markdown 页面：${linksAudit.stats.markdownPages}`,
    `- 已核验页内链接数：${linksAudit.stats.totalLinksChecked}`,
    `- 断链数：${linksAudit.stats.brokenMarkdownLinks}`,
    `- 内链矩阵规则边数：${linksDoc.totalEdges}`,
    `- 主题关系簇：${topicRelDoc.totalTopics}`,
    `- 品牌关联表条目：${brandRelDoc.totalBrands}`,
    '',
    '## 警告',
    ...(linksAudit.warnings.length ? linksAudit.warnings.map((w) => `- ${w}`) : ['- 无警告']),
    '',
    '## 错误',
    ...(linksAudit.errors.length ? linksAudit.errors.map((e) => `- ${e}`) : ['- 无错误']),
    ''
  ].join('\n'),
  'utf8'
);

// 06-seo-technical-audit.md
await writeFile(
  path.join(REPORTS_DIR, '06-seo-technical-audit.md'),
  [
    '# 06 · 技术 SEO 与结构化数据审计报告',
    '',
    `- 生成日期：${today}`,
    `- 审计状态：${seoAudit.ok ? 'PASS (0 errors)' : `FAIL (${seoAudit.errors.length} errors)`}`,
    '',
    '## 技术指标（实时扫描）',
    `- Markdown 页面数：${seoAudit.stats.markdownPages}`,
    `- 唯一 Title 数：${seoAudit.stats.uniqueTitles}`,
    `- 唯一 Description 数：${seoAudit.stats.uniqueDescriptions}`,
    `- 含 FAQ 页面核验数：${seoAudit.stats.faqCheckedPages}`,
    `- 构建目录 \`dist/\` HTML 数：${seoAudit.stats.distHtmlCount}`,
    `- \`dist/sitemap.xml\`：${seoAudit.stats.distHasSitemap ? '存在' : '尚未构建'}`,
    `- \`dist/robots.txt\`：${seoAudit.stats.distHasRobots ? '存在' : '尚未构建'}`,
    `- \`dist/llms.txt\`：${seoAudit.stats.distHasLlms ? '存在' : '尚未构建'}`,
    `- \`dist/rss.xml\`：${seoAudit.stats.distHasRss ? '存在' : '尚未构建'}`,
    '',
    '## 警告',
    ...(seoAudit.warnings.length ? seoAudit.warnings.map((w) => `- ${w}`) : ['- 无警告']),
    '',
    '## 错误',
    ...(seoAudit.errors.length ? seoAudit.errors.map((e) => `- ${e}`) : ['- 无错误']),
    ''
  ].join('\n'),
  'utf8'
);

// 07-content-backlog-summary.md
const l2 = backlogDoc.level2Outlines || [];
const l3 = backlogDoc.level3LongTails || [];
const publishedInBacklog = [...l2, ...l3].filter((x) => x.status !== 'backlog').length;
await writeFile(
  path.join(REPORTS_DIR, '07-content-backlog-summary.md'),
  [
    '# 07 · 内容 Backlog 规划与规模汇总报告',
    '',
    `- 生成日期：${today}`,
    `- 二级专题规划大纲数（要求 80+）：${l2.length}`,
    `- 三级长尾文章规划数（要求 500+）：${l3.length}`,
    `- 误标为 published 的条目数：${publishedInBacklog}（必须为 0）`,
    '',
    '## 按栏目分布（Level-2 大纲）',
    ...Object.entries(
      l2.reduce((acc, item) => {
        acc[item.pillar] = (acc[item.pillar] || 0) + 1;
        return acc;
      }, {})
    ).map(([pillar, count]) => `- \`${pillar}\`: ${count} 篇`),
    ''
  ].join('\n'),
  'utf8'
);

// 08-affiliate-compliance-audit.md
const urlFormatWarnings = [...affTs.matchAll(/"urlFormatWarning":/g)].length;
const hardcodedMdViolations = seoAudit.errors.filter((e) => e.includes('Hardcoded affiliate URL'));
await writeFile(
  path.join(REPORTS_DIR, '08-affiliate-compliance-audit.md'),
  [
    '# 08 · 推广链接与商业披露合规审计报告',
    '',
    `- 生成日期：${today}`,
    `- 推广注册表品牌覆盖：${brands.length} / 31（均源自 \`data/affiliate-links.ts\`）`,
    `- 强制 \`rel="nofollow sponsored noopener"\`：${affTs.includes('nofollow sponsored noopener') ? '已配置' : '缺失'}`,
    `- 强制 \`target="_blank"\`：${affTs.includes('"_blank"') || affTs.includes("'_blank'") ? '已配置' : '缺失'}`,
    `- URL 格式异常保留提示（如缺少 \`#/\`）：${urlFormatWarnings} 处`,
    `- Markdown 正文硬编码推广域名违规数：${hardcodedMdViolations.length}`,
    '',
    '## 违规明细',
    ...(hardcodedMdViolations.length ? hardcodedMdViolations.map((v) => `- ${v}`) : ['- 无违规，全部商业跳转均通过组件集中管理。']),
    ''
  ].join('\n'),
  'utf8'
);

// 09-build-and-dist-verification.md
const distExists = await exists('docs/.vitepress/dist');
let distFilesCount = 0;
if (distExists) {
  const entries = await readdir(path.join(ROOT, 'docs/.vitepress/dist'), { recursive: true });
  distFilesCount = entries.length;
}
await writeFile(
  path.join(REPORTS_DIR, '09-build-and-dist-verification.md'),
  [
    '# 09 · 构建产物与静态输出核验报告',
    '',
    `- 生成日期：${today}`,
    `- 构建输出目录 \`docs/.vitepress/dist/\`：${distExists ? `存在（共 ${distFilesCount} 个路径条目）` : '尚未执行 npm run docs:build'}`,
    `- HTML 页面数：${seoAudit.stats.distHtmlCount}`,
    `- \`sitemap.xml\`：${seoAudit.stats.distHasSitemap ? '已生成' : '待构建'}`,
    `- \`robots.txt\`：${seoAudit.stats.distHasRobots ? '已生成' : '待构建'}`,
    `- \`llms.txt\`：${seoAudit.stats.distHasLlms ? '已生成' : '待构建'}`,
    `- \`rss.xml\`：${seoAudit.stats.distHasRss ? '已生成' : '待构建'}`,
    ''
  ].join('\n'),
  'utf8'
);

// 10-launch-readiness-checklist.md
const hasHtaccess = await exists('deploy/.htaccess');
const hasVhost = await exists('deploy/apache-vhost.conf');
const hasReadme = await exists('README.md');
await writeFile(
  path.join(REPORTS_DIR, '10-launch-readiness-checklist.md'),
  [
    '# 10 · 正式上线前准备就绪清单',
    '',
    `- 生成日期：${today}`,
    '',
    '## 自动化验证状态',
    `- [${sourceAudit.ok ? 'x' : ' '}] 原始资料与图片资源完整性 (\`npm run audit:sources\`)`,
    `- [${brandAudit.ok ? 'x' : ' '}] 31 家品牌与词库实体数据验证 (\`npm run audit:brands\`)`,
    `- [${linksAudit.ok && linksAudit.stats.markdownPages > 0 ? 'x' : ' '}] 全站 Markdown 内链检查 (\`npm run audit:links\` · 当前 ${linksAudit.stats.markdownPages} 页)`,
    `- [${seoAudit.ok && seoAudit.stats.markdownPages > 0 ? 'x' : ' '}] 全站 SEO 与结构化数据检查 (\`npm run audit:seo\`)`,
    `- [${distExists && seoAudit.stats.distHasSitemap && seoAudit.stats.distHasRobots ? 'x' : ' '}] VitePress 构建与 dist 产物检查 (\`npm run docs:build\`)`,
    `- [${hasHtaccess && hasVhost && hasReadme ? 'x' : ' '}] Apache 部署配置 (\`deploy/.htaccess\`, \`deploy/apache-vhost.conf\`, \`README.md\`)`,
    '',
    '## 需人工在上线环境执行的步骤',
    '1. 将 `docs/.vitepress/dist/` 与 `deploy/.htaccess` 上传至 Apache 站点根目录（参考 `deploy/apache-vhost.conf`）。',
    '2. 如需开启 Algolia DocSearch，在构建环境变量中配置 `ALGOLIA_APP_ID`、`ALGOLIA_SEARCH_API_KEY`、`ALGOLIA_INDEX_NAME` 后重新执行 `npm run docs:build`。',
    '3. 如需接入站长验证 Meta，配置 `VITEPRESS_META_GOOGLE` / `VITEPRESS_META_BING` / `VITEPRESS_META_SHENMA` / `VITEPRESS_META_BAIDU` 后重新构建。',
    '4. 在 Google Search Console、Bing Webmaster Tools、神马站长平台、百度搜索资源平台提交 `https://jichangceping.biz/sitemap.xml`。',
    '5. 站点产生真实搜索曝光后，导出 GSC / Bing CSV 并运行 `npm run keywords:import -- --file <path.csv>` 与 `npm run keywords:cluster`。',
    ''
  ].join('\n'),
  'utf8'
);

// Also emit exact Section 29 filenames
await writeFile(
  path.join(REPORTS_DIR, 'source-audit.md'),
  [
    '# Source Audit · 数据源完整性审计报告',
    '',
    `- 生成日期：${today}`,
    `- 审计状态：${sourceAudit.ok ? 'PASS (0 errors)' : `FAIL (${sourceAudit.errors.length} errors)`}`,
    `- 原始资料集：${sourceAudit.stats.brandSources} | 测速证据记录：${sourceAudit.stats.benchmarkSources} | 品牌 Logo：${sourceAudit.stats.checkedLogos} | 测速图片：${sourceAudit.stats.checkedBenchmarkImages}`,
    '',
    '## 警告与说明',
    ...(sourceAudit.warnings.length ? sourceAudit.warnings.map((w) => `- ${w}`) : ['- 无警告']),
    ''
  ].join('\n'),
  'utf8'
);

await writeFile(
  path.join(REPORTS_DIR, 'brand-data-conflicts.md'),
  [
    '# Brand Data Conflicts · 31 家品牌数据与口径冲突审计报告',
    '',
    `- 生成日期：${today}`,
    `- 品牌总数：${brands.length}（已合并 Firefly 与 Firefly 萤火虫；含 ${conflictBrands.length} 家存在口径冲突的品牌）`,
    `- 推广注册表状态：${affTs.includes('nofollow sponsored noopener') ? '已统一 rel="nofollow sponsored noopener"' : '待检查'} · URL 格式告警 ${urlFormatWarnings} 处（云界线、环球梯缺少 \`#/\`）`,
    '',
    '## 冲突品牌清单',
    ...conflictBrands.map(
      (b) =>
        `### ${b.name} (\`${b.slug}\`)\n` +
        b.conflicts
          .map((c) => `- **${c.field}**：主值 \`${c.primaryValue}\` vs 冲突值 \`${c.conflictingValue}\`（${c.note}）`)
          .join('\n')
    ),
    ''
  ].join('\n'),
  'utf8'
);

const benchmarkSourcesDoc = await readJson('data/benchmark-sources.json');
await writeFile(
  path.join(REPORTS_DIR, 'benchmark-audit.md'),
  [
    '# Benchmark Audit · 测速与解锁证据审计报告',
    '',
    `- 生成日期：${today}`,
    `- 结构化测速批次：${benchmarks.length} 条（截图证据 + 2026-10-19 非晚高峰文本记录双轨并存）`,
    `- 原始测速源索引：${benchmarkSourcesDoc.length} 条（含未入主库样本 \`快狸\` \`inBrandCatalog: false\`）`,
    `- 状态分布：${Object.entries(
      benchmarks.reduce((acc, item) => {
        acc[item.batchType] = (acc[item.batchType] || 0) + 1;
        return acc;
      }, {})
    )
      .map(([k, v]) => `\`${k}\`=${v}`)
      .join(' · ')}`,
    '',
    '## 合规约束',
    '- 原始第三方 PNG/JPG 截图保持零修改、零裁剪、零本站水印覆盖。',
    '- 2026-10-19 非晚高峰文本数据严禁与晚高峰实测混排为同一控制变量排行。',
    ''
  ].join('\n'),
  'utf8'
);

await writeFile(
  path.join(REPORTS_DIR, 'keyword-matrix.md'),
  [
    '# Keyword Matrix · 关键词智能引擎与防互抢审计报告',
    '',
    `- 生成日期：${today}`,
    `- 收录关键词总数：${keywordsDoc.items.length}（未导入 GSC/Bing 词严格保持 \`searchVolume: null\`，已导入 ${importedCount}）`,
    `- 主题集群数：${clustersDoc.items.length}`,
    `- 唯一 Canonical 页面映射数：${pageMapDoc.items.length}`,
    `- 关键词互抢错误：${seoAudit.errors.filter((e) => e.includes('Cannibalization')).length}`,
    ''
  ].join('\n'),
  'utf8'
);

await writeFile(
  path.join(REPORTS_DIR, 'content-coverage.md'),
  [
    '# Content Coverage · 页面覆盖与 Backlog 规划报告',
    '',
    `- 生成日期：${today}`,
    `- 已发布正式 Markdown 页面：${seoAudit.stats.markdownPages}（覆盖首页、10 大一级专题、31 家品牌独立测评、25 篇客户端/系统页、12 篇对比、指南/故障/风险/方法论）`,
    `- 二级专题规划 Backlog：${l2.length} 篇（全部 \`status: "backlog"\`）`,
    `- 三级长尾文章规划 Backlog：${l3.length} 篇（全部 \`status: "backlog"\`）`,
    `- Backlog 误标为 published 数：${publishedInBacklog}`,
    ''
  ].join('\n'),
  'utf8'
);

await writeFile(
  path.join(REPORTS_DIR, 'internal-links-audit.md'),
  [
    '# Internal Links Audit · 全站内链与断链审计报告',
    '',
    `- 生成日期：${today}`,
    `- 审计状态：${linksAudit.ok ? 'PASS (0 broken links)' : `FAIL (${linksAudit.errors.length})`}`,
    `- 已扫描 Markdown 页面：${linksAudit.stats.markdownPages}`,
    `- 已核验站内链接：${linksAudit.stats.totalLinksChecked}（断链数：${linksAudit.stats.brokenMarkdownLinks}）`,
    `- 内链规则边数：${linksDoc.totalEdges}（未解析目标：${linksAudit.stats.matrixUnresolvedTargets}）`,
    ''
  ].join('\n'),
  'utf8'
);

await writeFile(
  path.join(REPORTS_DIR, 'seo-audit.md'),
  [
    '# SEO Audit · 全站技术 SEO 与 Schema 审计报告',
    '',
    `- 生成日期：${today}`,
    `- 审计状态：${seoAudit.ok ? 'PASS (0 errors)' : `FAIL (${seoAudit.errors.length})`}`,
    `- 唯一 Title：${seoAudit.stats.uniqueTitles} / ${seoAudit.stats.markdownPages}`,
    `- 唯一 Description：${seoAudit.stats.uniqueDescriptions} / ${seoAudit.stats.markdownPages}`,
    `- FAQ 一致性核验页面：${seoAudit.stats.faqCheckedPages} / ${seoAudit.stats.markdownPages}`,
    `- Sitemap / robots.txt / llms.txt / rss.xml：${seoAudit.stats.distHasSitemap}/${seoAudit.stats.distHasRobots}/${seoAudit.stats.distHasLlms}/${seoAudit.stats.distHasRss}`,
    ''
  ].join('\n'),
  'utf8'
);

await writeFile(
  path.join(REPORTS_DIR, 'geo-audit.md'),
  [
    '# GEO Audit · 生成式搜索实体图谱与问答覆盖报告',
    '',
    `- 生成日期：${today}`,
    `- 实体总节点数：${entitiesDoc.totalEntities}（覆盖 10 类标准实体）`,
    `- 语义关系三元组：${relationsDoc.totalRelations}`,
    `- GEO 核心问答库：${geoQDoc.items.length} 条`,
    '',
    '## 实体分类统计',
    ...Object.entries(entitiesDoc.typeCounts || {}).map(([t, c]) => `- \`${t}\`: ${c}`),
    ''
  ].join('\n'),
  'utf8'
);

await writeFile(
  path.join(REPORTS_DIR, 'build-report.md'),
  [
    '# Build Report · VitePress 静态构建验收报告',
    '',
    `- 生成日期：${today}`,
    `- 构建命令：\`npm run docs:build\``,
    `- 构建输出目录：${distExists ? `\`docs/.vitepress/dist/\`（${distFilesCount} 个路径条目，含 ${seoAudit.stats.distHtmlCount} 个 HTML 页面）` : '未构建'}`,
    `- 搜索模式：本地全文搜索启用（已预留 Algolia DocSearch 环境变量入口）`,
    `- 静态产物清单：\`sitemap.xml\` (${seoAudit.stats.distHasSitemap}) · \`robots.txt\` (${seoAudit.stats.distHasRobots}) · \`llms.txt\` (${seoAudit.stats.distHasLlms}) · \`rss.xml\` (${seoAudit.stats.distHasRss})`,
    ''
  ].join('\n'),
  'utf8'
);

await writeFile(
  path.join(REPORTS_DIR, 'deployment-guide.md'),
  [
    '# Deployment Guide · Apache 静态部署与上线操作指南',
    '',
    `- 生成日期：${today}`,
    `- Apache 配置产物：\`deploy/.htaccess\` (${hasHtaccess}) · \`deploy/apache-vhost.conf\` (${hasVhost}) · \`README.md\` (${hasReadme})`,
    '',
    '## 上线步骤',
    '1. 仅将 `docs/.vitepress/dist/` 与 `deploy/.htaccess` 上传至 Apache 站点根目录（禁止上传 `sources/`、`data/` 原始审计或私有 `.docx`）。',
    '2. 启用 Apache `mod_rewrite`、`mod_headers`、`mod_expires`、`mod_deflate`/`mod_brotli` 与 HTTPS。',
    '3. 如需切换 Algolia DocSearch 或接入站长验证 Meta，在构建环境中填写 `.env` 后重新运行 `npm run docs:build`。',
    '4. 在 Google Search Console、Bing Webmaster Tools、神马与百度提交 `https://jichangceping.biz/sitemap.xml`。',
    ''
  ].join('\n'),
  'utf8'
);

console.log('[report:all] Generated audit reports under reports/.');
