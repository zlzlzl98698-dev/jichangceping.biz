<div align="center">

<img src="docs/public/images/avatar.webp" alt="机场测评 Airport Review Lab" width="88" height="88" style="border-radius: 50%;" />

# 机场测评 · Airport Review Lab

**用数据了解机场，用测评帮助选择。**

[![Site](https://img.shields.io/badge/Live%20Domain-jichangceping.biz-0f4c81?style=flat-square)](https://jichangceping.biz)
[![VitePress](https://img.shields.io/badge/VitePress-1.6.4-646cff?style=flat-square&logo=vitepress&logoColor=white)](https://vitepress.dev/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x%20%2B%20TypeScript-42b883?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Pages](https://img.shields.io/badge/Static%20Pages-121%20Indexed%20%2B%20404-059669?style=flat-square)](#-核心数据与规模)
[![Brands](https://img.shields.io/badge/Brand%20Database-31%20Deduplicated-0284c7?style=flat-square)](#-核心数据与规模)
[![Audit](https://img.shields.io/badge/QA%20%26%20E2E-0%20Errors%20Passed-10b981?style=flat-square)](#-qa-审计与构建验收)

专业网络服务测评实验室 · 31 家机场品牌数据库 · MiaoKo / MAI-TEST-BOT 测速证据库 · 24 款客户端技术文档 · SEO / GEO / AEO 内容工程矩阵

[访问主站](https://jichangceping.biz) · [架构概览](#-系统架构与三大内容体系) · [快速开始](#-快速开始) · [QA 与审计](#-qa-审计与构建验收) · [Apache 部署](#-apache-静态部署)

</div>

---

## 核心定位与数据真实性原则

**机场测评（`https://jichangceping.biz`）** 是一个面向中文用户的技术文档型网络服务测评与决策平台，围绕 **专业测评、真实资料、技术解析、横向对比、理性选择** 五大原则建设，坚持商业展示排序与客观实测证据完全分离：

- **六级数据状态分级**：严格区分 `Measured`（截图实测）、`Vendor Data`（厂商资料）、`Historical Data`（历史记录）、`Not Tested`（尚未测试）、`Unverified`（待核实）、`Conflicting`（口径冲突）。
- **零虚构红线**：缺失价格、节点或测速字段统一显示 **「待核实」**，不补写 `0` 或假评分；非同条件/非晚高峰测速批次严禁混排为同一控制变量排行。
- **原始证据保全**：第三方原始 PNG/JPG 测速截图保持 SHA-256 未修改、不叠加水印；站内前端默认加载 `680px` 轻量 WebP 缩略图并支持一键查看原始高清图。
- **推广合规透明**：全站推广链接统一托管于 [data/affiliate-links.ts](data/affiliate-links.ts)，强制携带 `target="_blank" rel="nofollow sponsored noopener"` 并在紧邻位置披露佣金说明。

---

## 核心数据与规模

| 资产维度 | 已落地规模 | 核心说明 |
| :--- | :---: | :--- |
| **可索引静态页面** | **121 页** (+ `404.html`) | 定制首页、10 大一级专题、31 篇品牌测评、25 篇客户端专题、12 篇横评、教程/排障/风险矩阵 |
| **去重机场品牌库** | **31 家** | 已合并 `Firefly` 与 `Firefly 萤火虫`；前 11 家设商业展示排序，第 1 主推为**光速云（LightSpeed）** |
| **结构化套餐数据库** | **219 档** | 自动计算折算月均价与每 GB 单价，保留全部历史周期与冲突记录（如 59GB vs 69GB） |
| **测速与解锁批次** | **39 批**（40 源记录） | 含 `2026-08-11`、`2026-08-19`（光速云 5 张 MiaoKo 图）、`2026-07-18/19/20` 原图及 `10-19` 文本快照 |
| **代理客户端词条** | **24 款** | 覆盖 Windows、macOS、Android、iOS、Linux、OpenWrt 六大平台（含维护与安全告警） |
| **Vue 3 可视化/交互组件** | **25 个** | 10 个 Dark Observatory 图表 + 6 个商业转化组件 + 9 个交互/导购/文档 Chrome 组件 |
| **关键词引擎 & Backlog** | **551 词** | 69 个主题集群、121 个 1:1 Canonical 映射（0 互抢）；另含 93 个 L2 + 532 个 L3 待扩展 Backlog |
| **GEO 实体知识图谱** | **431 实体** | 覆盖 10 类标准实体及 `1,027` 条语义三元组 |

---

## 系统架构与三大内容体系

```mermaid
flowchart LR
    U["搜索引擎 / AI 搜索用户"] --> A["A. 教程知识体系<br/>/guides/ · /clients/ · /knowledge/ · /troubleshooting/"]
    A --> B["B. 测评决策体系<br/>/reviews/ · /brands/ · /compare/ · /benchmarks/ · /network/ · /risks/"]
    B --> C["C. 商业转化体系<br/>/recommend/ · /rankings/ · /plans/ · /deals/"]
    C --> D["统一推广注册表<br/>data/affiliate-links.ts"]
```

### 十大一级栏目路由

| 序号 | 导航栏目 | 路由入口 | 核心定位 |
| :---: | :--- | :--- | :--- |
| 01 | **机场推荐** | `/recommend/` · `/rankings/` | 综合推荐、30 秒交互选型向导、电信/远程办公/跨境电商/容灾方案 |
| 02 | **价格与套餐** | `/plans/` · `/deals/` | 全库单 GB 价格计算、百元以内年付对比、不限时流量包与优惠码核查 |
| 03 | **机场品牌** | `/brands/` · `/reviews/` · `/compare/` | 31 家品牌实时筛选库、光速云万字旗舰测评、2–4 品牌横向对比工具 |
| 04 | **VPN 与加速器** | `/vpn/` | VPN 与订阅制机场架构差异、游戏加速器与多平台选型 |
| 05 | **客户端软件** | `/clients/` | 6 大系统选型 + 19 款主流客户端参数矩阵与 31 家机场兼容性矩阵 |
| 06 | **AI 与流媒体** | `/ai-streaming/` | ChatGPT / Claude / Gemini / Netflix / Disney+ / YouTube 解锁边界 |
| 07 | **线路与节点** | `/network/` · `/benchmarks/` · `/methodology/` | IEPL/IPLC 解析、区域节点对比、测速数据中心与 6 维测评方法论 |
| 08 | **使用教程** | `/guides/` · `/knowledge/` | 订阅导入、Clash/Mihomo 分流规则、TUN/DNS 与六大传输协议解析 |
| 09 | **故障排查** | `/troubleshooting/` | 订阅失败、节点超时、全节点不可用与 TUN/DNS 污染速查 |
| 10 | **风险与替代** | `/risks/` | 跑路前兆识别、账单周期风险、专属客户端锁定与 31 家运营档案 |

---

## 工程目录结构

```text
jichangceping.biz/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts                 # VitePress 主配置、manualChunks 分包与 Sitemap
│   │   ├── config/                   # site.ts / nav.ts / sidebar.ts / search.ts / seo.ts
│   │   └── theme/
│   │       ├── Layout.vue            # 面包屑、PageMetaBanner 与 <details> FAQ 插槽
│   │       ├── index.ts              # 16 个同步组件 + 9 个 defineAsyncComponent 异步组件
│   │       ├── styles/               # vars.css（简白/深色双主题）+ observatory.css
│   │       └── components/           # 25 个 Vue 3 <script setup lang="ts"> 组件
│   ├── public/images/
│   │   ├── avatar.webp / .jpg        # 站点头像与 Favicon
│   │   ├── og-default.png            # 1200×630 栅格化社交分享图
│   │   ├── logos/                    # 17 枚原徽标 + 14 枚 SVG 徽标 + opt/ 轻量 WebP
│   │   └── benchmarks/               # 2026-08-11 & 08-19 原始截图 + thumbs/ WebP 缩略图
│   ├── reviews/                      # 光速云旗舰篇 + 全量 31 家品牌独立测评
│   └── ...                           # 十大一级专题、客户端文档、对比与指南正文
├── data/
│   ├── types.ts                      # 全库 TypeScript 强类型契约
│   ├── brands.json / plans.json      # 31 品牌与 219 套餐结构化数据
│   ├── benchmarks.json / availability.json / clients.json / risk-records.json
│   ├── affiliate-links.ts            # 唯一商业推广链接与优惠码注册表
│   ├── keywords/                     # 8 份关键词智能引擎与 Backlog JSON
│   ├── entities/                     # 5 份 GEO 实体知识图谱 JSON
│   └── links/                        # 4 份全站内链与主题关联矩阵 JSON
├── scripts/                          # 12 个 Node 24 ESM 自动化优化、审计与构建脚本
├── reports/                          # 审计报告、上线检查与 Preventive_SEO_Audit_Report.md
├── deploy/                           # Apache .htaccess 与 apache-vhost.conf
├── sources/                          # 只读原始公开素材索引
├── .env.example                      # Algolia 与四大搜索引擎站长验证变量模板
└── package.json
```

---

## 快速开始

环境要求：**Node.js >= 24**（当前验证版本 `v24.19.0`）。

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发热更新服务器
npm run docs:dev

# 3. 执行生产级静态构建（prebuild -> vitepress build -> postbuild）
npm run docs:build

# 4. 本地预览静态构建产物（默认 http://localhost:4173/）
npm run docs:preview
```

### 全部可用 NPM 脚本

| 命令 | 作用说明 |
| :--- | :--- |
| `npm run docs:dev` | 启动 VitePress 本地开发服务器 |
| `npm run docs:build` | 执行 `prebuild.mjs` → `vitepress build docs` → `postbuild.mjs`（生成 `robots.txt`、`llms.txt`、`rss.xml`、`search-index.json`） |
| `npm run docs:preview` | 启动静态构建产物本地预览服务 |
| `npm run audit:sources` | 校验 `sources/`、31 枚品牌 Logo 与 24 张测速原图引用完整性 |
| `npm run audit:brands` | 校验 31 品牌、219 套餐、24 客户端、551 关键词与 431 实体图谱一致性 |
| `npm run audit:links` | 扫描全站 121 篇 Markdown 内链（`2,988` 条链，0 断链） |
| `npm run audit:seo` | 校验唯一 Title/Description、H1、FAQ 一致性、无硬编码推广链接与 `dist/` 产物 |
| `npm run audit:all` | 一键串联运行以上全部 4 项审计 |
| `npm run test:e2e` | 运行 `verify-e2e.mjs` 12 项生产产物端到端校验（含 CSS 选择器、资源与包体上限 `< 700 KB`） |
| `npm run search:index` | 生成 `docs/.vitepress/dist/search-index.json` 与 `reports/algolia-index.json`（加 `-- --push` 可推送至 Algolia） |
| `npm run logos:optimize` | 使用 `sharp` 将展示 Logo 批量压缩为 `256×256` 透明 WebP |
| `npm run benchmarks:optimize` | 为原始测速截图生成 `680px` WebP 缩略图（不修改原图） |
| `npm run keywords:import` | 从 GSC / Bing 导出的 CSV/JSON 导入真实关键词指标（支持 `-- --dry-run`） |
| `npm run keywords:cluster` | 重新聚合并刷新关键词集群 |
| `npm run report:all` | 基于当前实时代码与数据生成 `reports/` 全套验收报告 |

---

## 搜索切换与站长验证配置

默认启用本地离线全文搜索（已配置 `_render` 索引裁剪，使 `@localSearchIndexroot` 保持在 `~634 KB`，0 构建体积警告）。接入正式站点凭证前请先复制 `.env.example` 为 `.env`（切勿提交 `.env` 至公开仓库）：

- **Algolia DocSearch**：设置 `ALGOLIA_APP_ID`、`ALGOLIA_SEARCH_API_KEY`、`ALGOLIA_INDEX_NAME` 后重新构建即可自动切换；推送索引需在服务端/本地注入 `ALGOLIA_ADMIN_API_KEY` 后运行 `npm run search:index -- --push`。
- **站长验证 Meta**：设置 `VITEPRESS_META_GOOGLE`、`VITEPRESS_META_BING`、`VITEPRESS_META_SHENMA`、`VITEPRESS_META_BAIDU` 后重新执行 `npm run docs:build` 即可直接输出到静态 HTML `<head>`。

---

## QA 审计与构建验收

最近一次全量构建与验收结果（均基于实际命令执行输出）：

- `npm run docs:build`：`13.34s` 构建完成，**0 warnings / 0 errors**，产出 `122` 个 HTML 文件、`121` 条 Sitemap URL、`121` 条 `search-index.json`、`robots.txt`、`llms.txt`、`rss.xml`。
- `npm run audit:all`：**4 项全部 PASSED（0 errors）**，核验 `2,988` 条站内链接 `0` 断链、`0` 关键词互抢、`0` 硬编码推广链接。
- `npm run test:e2e`：**12 / 12 项全部 PASSED**（包含 `<main>` 正文厚度、0 未解析 `**`、`<details>/<summary>` FAQ、`1200×630` 栅格化 `og-default.png`、`ItemList`/`SoftwareApplication.offers` Schema 覆盖及暗色模式/移动端 CSS 检查）。
- 详细预防性审计见 [reports/Preventive_SEO_Audit_Report.md](reports/Preventive_SEO_Audit_Report.md)。

---

## Apache 静态部署

1. 执行 `npm run docs:build`，确认 `docs/.vitepress/dist/` 生成完整静态资源。
2. **仅将 `docs/.vitepress/dist/` 与 [deploy/.htaccess](deploy/.htaccess) 上传至 Apache 站点根目录**（请勿上传 `sources/`、`data/`、`reports/` 或任何 `.env` 文件）。
3. 参考 [deploy/apache-vhost.conf](deploy/apache-vhost.conf) 启用 `mod_rewrite`、`mod_ssl`、`mod_headers`、`mod_brotli`/`mod_deflate`：
   - 强制 HTTPS 及 `www.jichangceping.biz` → `jichangceping.biz` 301 跳转
   - 强制 `/index.html` → `/` 301 去重及 `cleanUrls` 目录映射
   - 配置自定义 `/404.html` 真正返回 HTTP 404（禁止 Soft 404）
4. 部署后在 Google Search Console、Bing Webmaster Tools、神马站长平台与百度搜索资源平台提交 `https://jichangceping.biz/sitemap.xml`。
