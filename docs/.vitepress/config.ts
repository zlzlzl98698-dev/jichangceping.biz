import { defineConfig } from 'vitepress'
import { NAV_ITEMS } from './config/nav'
import { SEARCH_CONFIG } from './config/search'
import { applySeoPageData, buildPageHead, getVerificationHead } from './config/seo'
import { SIDEBAR_CONFIG } from './config/sidebar'
import { SITE_CONFIG } from './config/site'

export default defineConfig({
  lang: SITE_CONFIG.lang,
  title: SITE_CONFIG.brandName,
  titleTemplate: SITE_CONFIG.titleTemplate,
  description: SITE_CONFIG.defaultDescription,
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,

  head: [
    ['link', { rel: 'icon', type: 'image/webp', href: '/images/avatar.webp' }],
    ['link', { rel: 'apple-touch-icon', href: '/images/avatar.jpg' }],
    ['meta', { name: 'theme-color', content: '#0f4c81' }],
    ['meta', { name: 'applicable-device', content: 'pc,mobile' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
    ...getVerificationHead()
  ],

  sitemap: {
    hostname: SITE_CONFIG.domain,
    transformItems: (items) =>
      items.filter((item) => !item.url.includes('404') && !item.url.includes('draft'))
  },

  markdown: {
    lineNumbers: true,
    headers: {
      level: [2, 3]
    }
  },

  themeConfig: {
    siteTitle: SITE_CONFIG.brandName,
    logo: { src: '/images/avatar.webp', alt: '机场测评头像' },
    nav: NAV_ITEMS,
    sidebar: SIDEBAR_CONFIG,
    search: SEARCH_CONFIG,

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新'
    },

    sidebarMenuLabel: '栏目导航',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观模式',
    lightModeSwitchTitle: '切换浅色模式',
    darkModeSwitchTitle: '切换深色模式',

    notFound: {
      code: '404',
      title: '页面未找到',
      quote: '您访问的页面可能已迁移或尚未收录，请通过顶部栏目或站内搜索继续浏览。',
      linkLabel: '返回机场测评首页',
      linkText: '返回首页'
    },

    footer: {
      message: `${SITE_CONFIG.brandName} (${SITE_CONFIG.englishBrandName}) · ${SITE_CONFIG.disclosureText}`,
      copyright: `Copyright © 2026 ${SITE_CONFIG.brandName} (${SITE_CONFIG.host})`
    }
  },

  transformPageData(pageData) {
    applySeoPageData(pageData)
  },

  transformHead(context) {
    return buildPageHead(context)
  },

  vite: {
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id, meta) {
            const normalized = id.replace(/\\/g, '/')
            // Avoid merging VitePress SSR entry or lazy local-search modules into vitepress-vendor
            const modInfo = meta?.getModuleInfo?.(id)
            if (modInfo?.isEntry || normalized.includes('vitepress/dist/client/app/ssr')) {
              return
            }
            if (
              normalized.includes('VPLocalSearchBox') ||
              normalized.includes('/mark.js/') ||
              normalized.includes('/minisearch/')
            ) {
              return
            }
            if (normalized.includes('/node_modules/')) {
              if (
                normalized.includes('/node_modules/vue/') ||
                normalized.includes('/node_modules/@vue/')
              ) {
                return 'vue'
              }
              return 'vitepress-vendor'
            }
            const dataMatch = normalized.match(/\/data\/([^/]+)\.json$/)
            if (dataMatch) {
              return `data-${dataMatch[1]}`
            }
          }
        }
      }
    }
  }
})
