# 10 · 正式上线前准备就绪清单

- 生成日期：2026-11-25

## 自动化验证状态
- [x] 原始资料与图片资源完整性 (`npm run audit:sources`)
- [x] 31 家品牌与词库实体数据验证 (`npm run audit:brands`)
- [x] 全站 Markdown 内链检查 (`npm run audit:links` · 当前 121 页)
- [x] 全站 SEO 与结构化数据检查 (`npm run audit:seo`)
- [x] VitePress 构建与 dist 产物检查 (`npm run docs:build`)
- [x] Apache 部署配置 (`deploy/.htaccess`, `deploy/apache-vhost.conf`, `README.md`)

## 需人工在上线环境执行的步骤
1. 将 `docs/.vitepress/dist/` 与 `deploy/.htaccess` 上传至 Apache 站点根目录（参考 `deploy/apache-vhost.conf`）。
2. 如需开启 Algolia DocSearch，在构建环境变量中配置 `ALGOLIA_APP_ID`、`ALGOLIA_SEARCH_API_KEY`、`ALGOLIA_INDEX_NAME` 后重新执行 `npm run docs:build`。
3. 如需接入站长验证 Meta，配置 `VITEPRESS_META_GOOGLE` / `VITEPRESS_META_BING` / `VITEPRESS_META_SHENMA` / `VITEPRESS_META_BAIDU` 后重新构建。
4. 在 Google Search Console、Bing Webmaster Tools、神马站长平台、百度搜索资源平台提交 `https://jichangceping.biz/sitemap.xml`。
5. 站点产生真实搜索曝光后，导出 GSC / Bing CSV 并运行 `npm run keywords:import -- --file <path.csv>` 与 `npm run keywords:cluster`。
