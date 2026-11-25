# Preventive_SEO_Audit_Report · 高级预防性 SEO 与 GEO 全站审计报告

- **审计对象**：机场测评 · Airport Review Lab（`https://jichangceping.biz`）
- **审计范围**：渲染后静态产物 `docs/.vitepress/dist/` 全量 **122 个 HTML 文件**（121 个规范内容页 + `404.html`）、`robots.txt`、`sitemap.xml`、`deploy/.htaccess` 及 `docs/.vitepress/config/seo.ts`
- **审计基准时间**：2026-11-25
- **执行纪律**：只审计、不修改任何业务源码；全部结论均基于实际构建产物与正则/DOM 实测证据。

---

## 1. 核心健康评分表（0–100 分）

| 审计维度 | 权重占比 | 得分 | 核心诊断说明 |
| :--- | :---: | :---: | :--- |
| **索引与抓取机制** | 25% | **94 / 100** | `robots.txt` 放行主流爬虫且不拦截静态资源；`sitemap.xml` 收录 121 条有效规范 URL（0 死链/0 noindex）；121 页 100% 自引用 HTTPS Canonical；所有异步组件均完成 SSR 静态预渲染；主要扣分项为 `.htaccess` 缺少 `/index.html` 至 `/` 的 301 去重，以及 10 个顶部一级导航触发器为 `<button>`（下拉菜单内 47 个 `<a href>` 可直接抓取）。 |
| **站群风控与合规** | 25% | **98 / 100** | 全部外部推广跳转均严格携带 `rel="nofollow sponsored noopener"`（0 条违规）；0 共用 GA4/百度统计/AdSense ID；0 内网 IP、本地物理路径或关联站点名泄露；31 篇品牌测评 H2 模板相似度 ≥80% 的配对数为 **0 / 465**（无站群/内容农场模板指纹）。 |
| **内容深度与 GEO** | 20% | **78 / 100** | 首页与 31 篇品牌测评厚度充足，但 34 个子页 `<main>` 可见字数 `< 2,000` 字（集中于 19 篇单款客户端页 `762–1,511` 字）；24 页缺少 `<table>`；55 个非测评页首屏 700 字内缺少显式 Answer-First 结论块；全站 121 个 FAQ 均未使用原生 `<details>/<summary>` 包裹。 |
| **E-E-A-T 与信任** | 15% | **96 / 100** | 具备作者/审核栏、方法论页、披露声明页、冲突档案页及双轨时间戳；全站 0 编造 `AggregateRating` 或虚假五星评分；品牌测评代词过度指代（>25 次）页面数为 0。 |
| **Schema 与 SERP** | 15% | **78 / 100** | 全站 JSON-LD 语法 0 报错且 121 个 `FAQPage` 与页面可见 DOM 100% 一致（0 隐藏 Schema）；主要扣分项为全站 121 页 `og:image`/`Article.image` 与 76 篇 `Article.publisher.logo` 仍指向 `.svg`（`og-default.svg`），48 页 `<title>` 超过 65 字符面临 SERP 截断，2 页 `description` 超 165 字符，19 个 `SoftwareApplication` 缺少 `offers` 字段。 |
| **综合总分** | **100%** | **90.2 / 100** | **整体健康度优良（无 P0 致命红线），具备正式上线条件；优先解决栅格化 OG 图、Title 截断与客户端薄内容即可进入高竞争力状态。** |

---

## 2. 分项审计明细（含 PASS 项与实证数据）

### 一、爬虫抓取与索引预算审计（Crawl & Index）
- **Robots 与 XML Sitemap：`PASS`**
  - `docs/.vitepress/dist/robots.txt` 显式允许 `*`、`Googlebot`、`bingbot`、`Baiduspider`、`yisouspider` 访问 `/`，未误屏蔽 `/assets/` CSS/JS，且正确声明 `Sitemap: https://jichangceping.biz/sitemap.xml`。
  - `docs/.vitepress/dist/sitemap.xml` 收录 **121** 条规范网址，`Missing sitemap targets: 0`，已排除 `404` 与 `draft` 页面。
- **规范化（Canonical）矩阵：`PASS（附 1 项服务器级优化建议）`**
  - 全量核查 122 个 HTML 文件：121 个正式页面均输出唯一、自引用、HTTPS 非 www 的 `<link rel="canonical" href="https://jichangceping.biz/...">`；`404.html` 正确输出 `<meta name="robots" content="noindex, nofollow">` 且无 Canonical。
  - `deploy/.htaccess` 已配置 HTTP→HTTPS 301、www→非 www 301 与目录尾斜杠 301，但**未显式配置直接访问 `/.../index.html` 到 `/.../` 的 301 重定向**（见 P2-2）。
- **JS 渲染与 DOM 结构：`PASS（附 1 项导航语义优化）`**
  - 抽查 `/index.html`（`.VPContent` 可见正文 **6,499** 字符）、`/brands/`、`/compare/`、`/benchmarks/`、`/recommend/`、`/plans/` 与 `/reviews/guangsuyun/`：所有异步组件（`BrandDirectory`、`BrandComparisonTool`、`BenchmarkExplorer`、`SelectionWizard`、`SpeedReport`、`EvidencePanel` 等）均已在构建期完成 SSR 静态渲染输出，不依赖 CSR 才展示正文。
  - 全站 122 个 HTML 文件中无Href或 `href="#"` 空 `<a>` 标签数：**0**。
  - 顶部导航 `<nav class="VPNavBarMenu">` 中 10 个一级下拉触发器使用 `<button>`（`btnCount: 10`），其下拉面板内部 **47 个子链接均为静态 `<a href="...">`**，爬虫可直接发现二级链接；若希望一级专题页自身获得最高导航权重，建议增加或保持可点击锚点直达（见 P2-3）。
- **Soft 404 与死链：`PASS`**
  - 全站 121 个正式页面无空内容页（最小正文页 `/clients/clash-nyanpasu/index.html` 亦有 762 字符 + 页脚 FAQ），全站 2,170 个内部链接断链数 **0**。

### 二、站群风控与架构隔离审计（Risk Control）
- **代码 / 模板指纹：`PASS`**
  - 31 篇 `/reviews/<slug>/index.html` 的 `<h2>` 结构经两两 Jaccard 相似度检测（共 465 组配对），**相似度 ≥ 80% 的配对数为 0**，无高度雷同或模板指纹风险。
- **统计与追踪代码隔离：`PASS`**
  - 全站扫描 `gtag(`、`googletagmanager`、`G-`、`UA-`、`hm.baidu.com`、`adsbygoogle`、`ca-pub-`、`clarity.ms`、`umami`、`matomo` 命中数：**0**。
- **外链连坐防范：`PASS`**
  - 扫描全站 122 个 HTML 中所有指向第三方推广域名的外部链接，漏加 `rel="nofollow"` 或 `sponsored` 的数量：**0**。
- **基础设施与无关信息泄露：`PASS`**
  - 扫描全站 HTML，未发现内网/测试服务器 IP（`8.163.123.45`、`120.24.47.71`）、本地物理路径（`C:\Users`、`Pro User`）或无关站点名称泄露（命中数：**0**）。

### 三、内容质量与语义权威审计（E-E-A-T & GEO）
- **内容厚度：`待优化（P1-2）`**
  - 全站共 **34** 个子页面 `<main>` 可见字符数低于 2,000（主要集中在 19 篇单款客户端页面 `762–1,511` 字、6 篇系统汇总页 `1,436–1,966` 字，以及 9 篇指南/排障/风险二级页 `1,324–1,978` 字）。
- **GEO/AEO 结构化布局：`待优化（P2-1 / P2-4）`**
  - **24** 个页面正文中缺少机器友好的 `<table>` 对比数据（全部 19 篇单款客户端页、首页、`/knowledge/`、`/troubleshooting/{node-timeout,tun-dns-error}/`、`/vpn/vpn-vs-airport/`）。
  - **55** 个非测评页面首屏前 700 字符内未放置显式 `核心结论 / Answer-First` 摘要标识。
  - 全站 **121** 个包含 FAQ 的页面均未使用原生 `<details>/<summary>` 标签包裹问答对。
  - 实体指代清晰度：**PASS**（31 篇测评均无 `它/这家/该机场` >25 次的高频模糊代词）。
- **数据溯源与可信度：`PASS`**
  - 价格、测速均明确标注测试时间（`2026-07-18/19`、`2026-08-11`、`2026-08-19`、`2026-10-19`）、测试工具与测试环境（如珠海联通 5Gbps/9Gbps、长沙电信 2Gbps），缺失项均标记 `待核实/尚未测试`，全站 0 虚假星级或虚假评论。

### 四、结构化数据与社交展现审计（Schema & SERP）
- **JSON-LD 真伪校验：`PASS（附 2 项增强建议）`**
  - 全站 JSON-LD 分布：`Organization` (1)、`WebSite` (1)、`BreadcrumbList` (120)、`CollectionPage` (25)、`Article` (76)、`SoftwareApplication` (19)、`FAQPage` (121)。
  - 语法错误：**0**；隐藏 `FAQPage` Schema（未在可见 `<body>` 中出现对应问答）：**0**（注：`/clients/*` 等未在 Markdown 写重复 FAQ 的页面由 `Layout.vue` 在 `#doc-footer-before` 渲染 `<FaqSection />`，位于 `<main>` 外侧但仍在页面可见正文容器内）。
  - `Article.publisher.logo.url`（76 篇）仍指向 `og-default.svg`（与首页 `Organization.logo` 使用 `/images/avatar.webp` 不一致），且 19 篇 `SoftwareApplication` 缺少 `offers` 字段（见 P1-1 / P2-5）。
- **Open Graph & Title/Description：`待优化（P1-1 / P1-3）`**
  - 全站 121 页 `title` 与 `description` 重复数均为 **0**；但有 **48** 页 `<title>` 超过 65 字符（因 `titleTemplate` 固定拼接 ` | 机场测评 Airport Review Lab` 共 27 字符），**2** 页 `description` 超过 165 字符；全站 `og:image` 与 `twitter:image` 均使用 `.svg` 格式。

---

## 3. 漏洞与降权风险清单

### 🚨 P0（致命红线 - 立即修复）
- **未发现 P0 级别致命违规**（`PASS`）。推广链接全量配置 `rel="nofollow sponsored noopener"`、0 共用追踪代码、0 Canonical 劫持、0 隐藏 Schema 欺骗、0 敏感基础设施泄露。

### ⚠️ P1（高危隐患 - 本周修复）
1. **[P1-1] 全站 `og:image`、`twitter:image` 与 `Article.publisher.logo` 使用 `.svg` 格式**
   - **具体位置**：全站 121 个 HTML 页面 `<meta property="og:image" content="https://jichangceping.biz/images/og-default.svg">`、`<meta name="twitter:image">` 及 76 篇 `Article` JSON-LD 的 `image` 与 `publisher.logo.url`（[docs/.vitepress/config/site.ts](file:///c:/Users/Pro%20User/Desktop/jichangceping.biz/docs/.vitepress/config/site.ts) 第 16 行、[docs/.vitepress/config/seo.ts](file:///c:/Users/Pro%20User/Desktop/jichangceping.biz/docs/.vitepress/config/seo.ts) 第 330–333 行）。
   - **影响机制**：Google `Article` 富媒体结果要求 `image` 与 `publisher.logo` 为栅格图片（PNG/JPG/WebP），Twitter/X、Facebook、Bing 社交卡片及主流预览爬虫通常直接忽略 `.svg` 分享图，导致社交传播与 Discover/SERP 缩略图缺失。
   - **修复建议**：使用 `sharp` 将 `og-default.svg` 渲染导出为 `1200×630` 的 `docs/public/images/og-default.png`（或 `.webp`），将 `SITE_CONFIG.defaultOgImage` 改为 `/images/og-default.png`，并将 `seo.ts` 第 332 行 `Article.publisher.logo.url` 与首页 `Organization` 统一为 `/images/avatar.webp`（或横向栅格 Logo）。

2. **[P1-2] 34 个子页面 `<main>` 正文低于 2,000 字且 19 篇单款客户端页缺少对比表格（Thin Content 风险）**
   - **具体位置**：19 篇单款客户端文档（如 `/clients/clash-nyanpasu/` 762 字、`/clients/karing/` 819 字、`/clients/hiddify/` 865 字、`/clients/homeproxy/` 865 字、`/clients/clash-mi/` 893 字等）、6 篇系统分类页（1,436–1,966 字）及 9 篇指南/排障/风险页（如 `/knowledge/` 1,324 字、`/risks/exit-scam-signals/` 1,397 字、`/troubleshooting/node-timeout/` 1,703 字）。
   - **影响机制**：在 Google Helpful Content / 核心质量评估中，大量 800–1,000 字的短文档容易被整体归类为“浅层索引页”，拖累整个 `/clients/` 目录的权重传递。
   - **修复建议**：为 19 篇单款客户端页补充**协议支持矩阵 `<table>`**、**核心功能与内核参数对比 `<table>`**、实操配置代码块及适配机场筛选表（引用 `data/client-compatibility.json`），将全部子页扩充至 2,200–3,000+ 字符。

3. **[P1-3] 48 个页面 `<title>` 长度超标（> 65 字符）与 2 个页面 `description` 过长**
   - **具体位置**：`site.ts` 全局 `titleTemplate: ':title | 机场测评 Airport Review Lab'` 为所有内页固定追加 27 字符，导致 `/ai-streaming/`（84 字符）、`/clients/flclash/`（79 字符）、`/clients/linux/`（78 字符）等 48 页超出 Google/Bing 桌面端约 60 字符展示上限；`/plans/under-100-cny-annual/`（215 字符）与 `/reviews/lingdong/`（177 字符）`description` 偏长。
   - **影响机制**：SERP 标题被强制截断，品牌核心词与长尾修饰词被挤出视野，直接拉低自然点击率（CTR）。
   - **修复建议**：将 `titleTemplate` 精简为 `':title | 机场测评'`（仅 7 字符），并把超长页面的 `seoTitle` 控制在 28–36 个汉字内、`description` 收敛至 120–155 字符。

### 🟡 P2（优化机会 - 规划修复）
1. **[P2-1] 全站 121 个 FAQ 尚未使用原生 `<details>/<summary>` 语义标签（且部分 FAQ 渲染在 `<main>` 外侧）**
   - **具体位置**：`docs/.vitepress/theme/components/FaqSection.vue` 使用 `<article>` + `<h3>`；Markdown 测评页 FAQ 使用 `###` 标题；`/clients/*` 等页面由 `Layout.vue` 在 `#doc-footer-before`（`<main>` 外部）注入 `<FaqSection />`。
   - **影响机制**：将常见问题移入 `<main>` 并采用原生 `<details>/<summary>`（默认展开或无障碍语义折叠）有助于 AI 提取器与 DOM 爬虫精准切分 Q&A 边界。
   - **修复建议**：在 `FaqSection.vue` 中采用 `<details open><summary>...</summary>...</details>`，并将自动 FAQ 插槽调整至文档正文容器底部内部。

2. **[P2-2] Apache `.htaccess` 缺少 `/index.html` 规范化 301 去重规则**
   - **具体位置**：`deploy/.htaccess` 第 28–31 行仅处理目录缺斜杠跳转，未拦截直接请求 `/reviews/guangsuyun/index.html`。
   - **影响机制**：若外部引用误带 `/index.html` 后缀，服务器会同时以 HTTP 200 响应 `/path/` 与 `/path/index.html`，轻微分散抓取预算。
   - **修复建议**：在 `deploy/.htaccess` 中增加 `RewriteCond %{THE_REQUEST} \s/+(.+?)/?index\.html[\s?]` 301 重定向至 `https://jichangceping.biz/%1/`。

3. **[P2-3] 顶部 10 个一级导航入口为 `<button>` 而非可直达 `<a href>`**
   - **具体位置**：`docs/.vitepress/dist/index.html` 中 `<nav class="VPNavBarMenu">` 存在 10 个 `<button type="button">`（因 `nav.ts` 中 10 个一级项均配置了 `items` 下拉而未配一级 `link`）。虽下拉面板内的 47 个 `<a href>` 均在静态 DOM 中，但一级栏目页缺少直接的顶栏 `<a>` 锚点。
   - **影响机制**：导航链接权重分配略弱于“顶栏一级直链 + 下拉展开”。
   - **修复建议**：如主题允许，定制 `VPNavBarMenuGroup` 或保留 Hero/Footer 中显式 10 栏目直链（当前首页 `HomePage.vue` 已有 10 大专题直链，作为补充建议）。

4. **[P2-4] 55 个非测评页首屏缺少显式 Answer-First 结论段落**
   - **具体位置**：主要为 `/clients/*`（首段直接写 `1. 软件定义与定位`）及部分指南/风险二级页。
   - **影响机制**：减弱 Perplexity、ChatGPT、Google AI Overviews 对“一句话直答”段落的抽取概率。
   - **修复建议**：在每篇客户端页和指南页 H1 下方增加 1 段 80–120 字的“核心结论（Answer-First）”直答摘要。

5. **[P2-5] `SoftwareApplication` Schema 缺少 `offers` 属性**
   - **具体位置**：19 篇单款客户端页（如 `/clients/clash-verge-rev/`、`docs/.vitepress/config/seo.ts` 第 289–308 行）。
   - **影响机制**：Google `SoftwareApplication` 富媒体检验通常要求提供 `offers`（含开源免费 `price: "0"` 或 App Store 付费状态说明）才具备完整展示资格。
   - **修复建议**：为开源免费客户端在 JSON-LD 中补充 `offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' }`（付费 iOS 客户端保持条件化或注明以 App Store 为准）。

---

## 4. 终极改造行动 SOP（按 ROI 排序 Top 5）

| 优先级 | 改造动作 | 涉及文件 / 范围 | 预期收益 |
| :---: | :--- | :--- | :--- |
| **1** | **将全站 `og:image` 与 `Article.publisher.logo` 替换为栅格 PNG/WebP** | `docs/public/images/og-default.png`、`site.ts`、`seo.ts` | 立即消除社交分享图与 Google `Article` 富媒体结果因 `.svg` 格式导致的失效隐患。 |
| **2** | **精简 `titleTemplate` 并缩短 48 个超长 `<title>` 与 2 个超长 `description`** | `docs/.vitepress/config/site.ts`、超长页面 frontmatter | 防止 Google/Bing SERP 截断标题核心关键词，直接提升自然搜索点击率（CTR）。 |
| **3** | **扩写 19 篇单款客户端薄内容页并补齐 `<table>` + Answer-First 摘要** | `docs/clients/*/index.md`（19 篇）及 9 篇短指南/排障页 | 消除全站“Thin Content”聚集区，显著提高客户端长尾词排名与 GEO 实体抽取率。 |
| **4** | **升级 `FaqSection.vue` 使用原生 `<details>/<summary>` 并对齐 `SoftwareApplication.offers`** | `FaqSection.vue`、`Layout.vue`、`seo.ts` | 满足机器友好问答结构化标准，并修复 `SoftwareApplication` Schema 推荐字段缺口。 |
| **5** | **在 `deploy/.htaccess` 中补全 `/index.html` 301 去重规则** | `deploy/.htaccess` | 彻底封堵 `/path/` 与 `/path/index.html` 双重 200 响应，集中抓取预算。 |
