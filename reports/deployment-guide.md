# Deployment Guide · Apache 静态部署与上线操作指南

- 生成日期：2026-11-25
- Apache 配置产物：`deploy/.htaccess` (true) · `deploy/apache-vhost.conf` (true) · `README.md` (true)

## 上线步骤
1. 仅将 `docs/.vitepress/dist/` 与 `deploy/.htaccess` 上传至 Apache 站点根目录（禁止上传 `sources/`、`data/` 原始审计或私有 `.docx`）。
2. 启用 Apache `mod_rewrite`、`mod_headers`、`mod_expires`、`mod_deflate`/`mod_brotli` 与 HTTPS。
3. 如需切换 Algolia DocSearch 或接入站长验证 Meta，在构建环境中填写 `.env` 后重新运行 `npm run docs:build`。
4. 在 Google Search Console、Bing Webmaster Tools、神马与百度提交 `https://jichangceping.biz/sitemap.xml`。
