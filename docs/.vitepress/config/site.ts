export interface SiteVerificationMeta {
  google?: string
  bing?: string
  shenma?: string
  baidu?: string
}

export interface AlgoliaEnvConfig {
  appId: string
  apiKey: string
  indexName: string
  enabled: boolean
}

export const SITE_CONFIG = {
  domain: 'https://jichangceping.biz',
  host: 'jichangceping.biz',
  brandName: '机场测评',
  englishBrandName: 'Airport Review Lab',
  slogan: '用数据了解机场，用测评帮助选择。',
  coreValues: ['专业测评', '真实资料', '技术解析', '横向对比', '理性选择'],
  lang: 'zh-CN',
  titleTemplate: ':title | 机场测评',
  defaultTitle: '机场测评 (Airport Review Lab) - 专业机场评测、网络性能数据库与选型指南',
  defaultDescription:
    '机场测评（jichangceping.biz）是面向中文用户的专业网络服务测评实验室、机场品牌数据库、测速证据库、客户端技术文档及理性购买决策平台。',
  defaultOgImage: '/images/og-default.png',
  leadBrandSlug: 'guangsuyun',
  leadBrandName: '光速云',
  disclosureText: '含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。',
  editorialAuthor: '机场测评实验室',
  editorialReviewer: '网络基础设施测评组',
  lastFullAuditDate: '2026-11-24',
  verification: {
    google: process.env.VITEPRESS_META_GOOGLE || '',
    bing: process.env.VITEPRESS_META_BING || '',
    shenma: process.env.VITEPRESS_META_SHENMA || '',
    baidu: process.env.VITEPRESS_META_BAIDU || ''
  } satisfies SiteVerificationMeta,
  algolia: {
    appId: process.env.ALGOLIA_APP_ID || '',
    apiKey: process.env.ALGOLIA_SEARCH_API_KEY || '',
    indexName: process.env.ALGOLIA_INDEX_NAME || '',
    enabled: Boolean(
      process.env.ALGOLIA_APP_ID &&
        process.env.ALGOLIA_SEARCH_API_KEY &&
        process.env.ALGOLIA_INDEX_NAME
    )
  } satisfies AlgoliaEnvConfig
} as const
