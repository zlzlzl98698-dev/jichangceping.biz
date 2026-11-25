import type { HeadConfig, PageData, TransformContext } from 'vitepress'
import brandsRaw from '../../../data/brands.json'
import clientsRaw from '../../../data/clients.json'
import { SITE_CONFIG } from './site'

interface BrandSchemaRecord {
  slug: string
  name: string
  featuredRank: number | null
  reviewUrl: string
}

const BRAND_SCHEMA_LIST = brandsRaw as BrandSchemaRecord[]

interface ClientPricingRecord {
  slug: string
  name: string
  pricing: string
}

const CLIENT_PRICING_LIST = clientsRaw as ClientPricingRecord[]
const PAID_APP_STORE_SLUGS = new Set(['shadowrocket', 'stash', 'quantumult-x', 'surge'])
const PAID_APP_STORE_NAMES = new Set(['shadowrocket', 'stash', 'quantumult x', 'surge'])

function resolveSoftwareOffer(
  swName: string,
  fmSlug: unknown,
  pagePath: string
): Record<string, unknown> | null {
  const swNameLower = swName.trim().toLowerCase()
  const pathSegments = stripLeadingTrailingSlash(pagePath).split('/').filter(Boolean)
  const pathSlug = pathSegments[pathSegments.length - 1] || ''
  const slugCandidate = (typeof fmSlug === 'string' && fmSlug.trim()) || pathSlug

  if (
    PAID_APP_STORE_SLUGS.has(slugCandidate.toLowerCase()) ||
    PAID_APP_STORE_NAMES.has(swNameLower)
  ) {
    return {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description: 'App Store 地区付费或内购应用，实际价格以官方商店为准'
    }
  }

  const matched = CLIENT_PRICING_LIST.find((client) => {
    const cSlug = client.slug.toLowerCase()
    const cName = client.name.toLowerCase()
    const sLower = slugCandidate.toLowerCase()
    return (
      (sLower && (cSlug === sLower || (sLower === 'mihomo' && cSlug === 'mihomo-party'))) ||
      (swNameLower &&
        (cName === swNameLower || cName.startsWith(swNameLower) || swNameLower.includes(cName)))
    )
  })

  if (matched && (matched.pricing.includes('免费') || matched.pricing.includes('开源'))) {
    return {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY'
    }
  }

  return null
}

export interface FaqEntry {
  q?: string
  a?: string
  question?: string
  answer?: string
}

const SECTION_LABELS: Record<string, string> = {
  recommend: '机场推荐',
  rankings: '机场排行',
  plans: '价格与套餐',
  deals: '优惠与折扣码',
  brands: '机场品牌库',
  reviews: '深度测评',
  compare: '品牌横向对比',
  vpn: 'VPN 与加速器',
  clients: '客户端软件',
  'ai-streaming': 'AI 与流媒体',
  network: '线路与节点',
  benchmarks: '测速与性能数据',
  methodology: '测评方法论',
  guides: '使用教程',
  knowledge: '网络科普',
  troubleshooting: '故障排查',
  risks: '风险与替代',
  about: '关于实验室'
}

function stripLeadingTrailingSlash(value: string): string {
  return value.replace(/^\/+|\/+$/g, '')
}

export function resolvePagePath(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, '/')
  if (!normalized || normalized === 'index.md') {
    return '/'
  }
  if (normalized.endsWith('/index.md')) {
    return `/${normalized.slice(0, -'index.md'.length)}`
  }
  return `/${normalized.replace(/\.md$/, '')}`
}

export function resolveAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }
  const base = SITE_CONFIG.domain.replace(/\/+$/, '')
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${base}${path}`
}

export function getVerificationHead(): HeadConfig[] {
  const tags: HeadConfig[] = []
  const { google, bing, shenma, baidu } = SITE_CONFIG.verification

  if (google && google.trim()) {
    tags.push(['meta', { name: 'google-site-verification', content: google.trim() }])
  }
  if (bing && bing.trim()) {
    tags.push(['meta', { name: 'msvalidate.01', content: bing.trim() }])
  }
  if (shenma && shenma.trim()) {
    tags.push(['meta', { name: 'shenma-site-verification', content: shenma.trim() }])
  }
  if (baidu && baidu.trim()) {
    tags.push(['meta', { name: 'baidu-site-verification', content: baidu.trim() }])
  }

  return tags
}

function safeJsonLd(payload: Record<string, unknown>): string {
  return JSON.stringify(payload).replace(/</g, '\\u003c')
}

function buildBreadcrumbList(pagePath: string, currentTitle: string): Record<string, unknown> | null {
  if (pagePath === '/') {
    return null
  }

  const segments = stripLeadingTrailingSlash(pagePath).split('/').filter(Boolean)
  if (segments.length === 0) {
    return null
  }

  const items: Array<Record<string, unknown>> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首页',
      item: resolveAbsoluteUrl('/')
    }
  ]

  let acc = ''
  segments.forEach((seg, index) => {
    acc += `/${seg}`
    const isLast = index === segments.length - 1
    const itemUrl = isLast ? resolveAbsoluteUrl(pagePath) : resolveAbsoluteUrl(`${acc}/`)
    const label = isLast ? currentTitle : SECTION_LABELS[seg] || seg
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: label,
      item: itemUrl
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  }
}

function normalizeFaqItems(rawFaq: unknown): Array<{ question: string; answer: string }> {
  if (!Array.isArray(rawFaq)) {
    return []
  }

  return rawFaq
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null
      }
      const entry = item as FaqEntry
      const question = (entry.question || entry.q || '').trim()
      const answer = (entry.answer || entry.a || '').trim()
      if (!question || !answer) {
        return null
      }
      return { question, answer }
    })
    .filter((item): item is { question: string; answer: string } => item !== null)
}

export function applySeoPageData(pageData: PageData): void {
  const fm = pageData.frontmatter ?? {}
  if (!pageData.title && typeof fm.title === 'string') {
    pageData.title = fm.title
  }
  if (!pageData.description && typeof fm.description === 'string') {
    pageData.description = fm.description
  }
  if (pageData.relativePath === 'index.md' && !fm.title) {
    pageData.title = SITE_CONFIG.defaultTitle
  }
}

export function buildPageHead(context: TransformContext): HeadConfig[] {
  const { pageData, title, description } = context
  const fm = pageData.frontmatter ?? {}
  const pagePath = resolvePagePath(pageData.relativePath)
  const isHome = pagePath === '/'
  const isNotFound = Boolean(pageData.isNotFound || pageData.relativePath === '404.md' || fm.layout === '404')
  const isNoIndex = isNotFound || fm.draft === true || fm.noindex === true

  const resolvedTitle = (typeof fm.seoTitle === 'string' && fm.seoTitle.trim()) || title || SITE_CONFIG.defaultTitle
  const resolvedDescription =
    (typeof fm.description === 'string' && fm.description.trim()) ||
    description ||
    SITE_CONFIG.defaultDescription

  const canonicalUrl =
    typeof fm.canonical === 'string' && fm.canonical.trim()
      ? resolveAbsoluteUrl(fm.canonical.trim())
      : resolveAbsoluteUrl(pagePath)

  const ogImage = resolveAbsoluteUrl(
    (typeof fm.cover === 'string' && fm.cover.trim()) ||
      (typeof fm.ogImage === 'string' && fm.ogImage.trim()) ||
      SITE_CONFIG.defaultOgImage
  )

  const head: HeadConfig[] = []

  head.push([
    'meta',
    {
      name: 'robots',
      content: isNoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    }
  ])

  if (!isNotFound && !fm.noindex) {
    head.push(['link', { rel: 'canonical', href: canonicalUrl }])
  }

  head.push(['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }])
  head.push(['meta', { property: 'og:site_name', content: SITE_CONFIG.brandName }])
  head.push(['meta', { property: 'og:locale', content: 'zh_CN' }])
  head.push(['meta', { property: 'og:title', content: resolvedTitle }])
  head.push(['meta', { property: 'og:description', content: resolvedDescription }])
  head.push(['meta', { property: 'og:url', content: canonicalUrl }])
  head.push(['meta', { property: 'og:image', content: ogImage }])

  head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
  head.push(['meta', { name: 'twitter:title', content: resolvedTitle }])
  head.push(['meta', { name: 'twitter:description', content: resolvedDescription }])
  head.push(['meta', { name: 'twitter:image', content: ogImage }])

  const pubDate = typeof fm.pubDate === 'string' ? fm.pubDate : typeof fm.date === 'string' ? fm.date : ''
  const updatedDate =
    typeof fm.updatedDate === 'string'
      ? fm.updatedDate
      : typeof fm.verifiedDate === 'string'
        ? fm.verifiedDate
        : ''

  if (pubDate) {
    head.push(['meta', { property: 'article:published_time', content: pubDate }])
  }
  if (updatedDate) {
    head.push(['meta', { property: 'article:modified_time', content: updatedDate }])
  }

  if (isNoIndex) {
    return head
  }

  const orgId = `${SITE_CONFIG.domain}/#organization`
  const websiteId = `${SITE_CONFIG.domain}/#website`

  const schemas: Array<Record<string, unknown>> = []

  if (isHome) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': orgId,
      name: SITE_CONFIG.brandName,
      alternateName: SITE_CONFIG.englishBrandName,
      url: resolveAbsoluteUrl('/'),
      description: SITE_CONFIG.defaultDescription,
      logo: {
        '@type': 'ImageObject',
        url: resolveAbsoluteUrl('/images/avatar.webp'),
        width: 192,
        height: 192
      }
    })

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': websiteId,
      name: SITE_CONFIG.brandName,
      alternateName: SITE_CONFIG.englishBrandName,
      url: resolveAbsoluteUrl('/'),
      inLanguage: SITE_CONFIG.lang,
      description: SITE_CONFIG.defaultDescription,
      publisher: { '@id': orgId }
    })
  } else {
    const breadcrumb = buildBreadcrumbList(pagePath, resolvedTitle)
    if (breadcrumb) {
      schemas.push(breadcrumb)
    }

    const schemaType = typeof fm.schemaType === 'string' ? fm.schemaType : ''
    const segments = stripLeadingTrailingSlash(pagePath).split('/').filter(Boolean)
    const isTopSectionIndex = segments.length === 1 && pageData.relativePath.endsWith('/index.md')
    const isCollection =
      schemaType === 'CollectionPage' ||
      fm.pageRole === 'pillar' ||
      fm.pageRole === 'directory' ||
      (isTopSectionIndex &&
        !pagePath.startsWith('/reviews/') &&
        !pagePath.startsWith('/about/') &&
        !pagePath.startsWith('/methodology/') &&
        schemaType !== 'Article' &&
        schemaType !== 'SoftwareApplication')

    if (isCollection) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: resolvedTitle,
        description: resolvedDescription,
        url: canonicalUrl,
        inLanguage: SITE_CONFIG.lang,
        isPartOf: { '@id': websiteId },
        ...(updatedDate ? { dateModified: updatedDate } : {})
      })

      if (pagePath === '/brands/' || pagePath === '/reviews/' || pagePath === '/rankings/') {
        const listBrands =
          pagePath === '/rankings/'
            ? BRAND_SCHEMA_LIST.filter((b) => b.featuredRank !== null && b.featuredRank <= 11).sort(
                (a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99)
              )
            : BRAND_SCHEMA_LIST

        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: resolvedTitle,
          url: canonicalUrl,
          numberOfItems: listBrands.length,
          itemListElement: listBrands.map((brand, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: brand.name,
            url: resolveAbsoluteUrl(brand.reviewUrl || `/reviews/${brand.slug}/`)
          }))
        })
      }
    } else if (schemaType === 'SoftwareApplication' && fm.software && typeof fm.software === 'object') {
      const sw = fm.software as Record<string, unknown>
      const appSchema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: typeof sw.name === 'string' ? sw.name : resolvedTitle,
        description: resolvedDescription,
        url: canonicalUrl,
        applicationCategory:
          typeof sw.applicationCategory === 'string' ? sw.applicationCategory : 'UtilitiesApplication',
        operatingSystem: Array.isArray(sw.operatingSystem)
          ? sw.operatingSystem.join(', ')
          : typeof sw.operatingSystem === 'string'
            ? sw.operatingSystem
            : 'Windows, macOS, Android, iOS, Linux'
      }
      if (typeof sw.softwareVersion === 'string' && sw.softwareVersion.trim()) {
        appSchema.softwareVersion = sw.softwareVersion.trim()
      }
      const softwareName = typeof sw.name === 'string' ? sw.name : resolvedTitle
      const softwareOffer = resolveSoftwareOffer(softwareName, fm.slug, pagePath)
      if (softwareOffer) {
        appSchema.offers = softwareOffer
      }
      schemas.push(appSchema)
    } else {
      const articleSchema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: resolvedTitle,
        description: resolvedDescription,
        inLanguage: SITE_CONFIG.lang,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        image: [ogImage],
        author: {
          '@type': 'Organization',
          name:
            (typeof fm.author === 'string' && fm.author.trim()) || SITE_CONFIG.editorialAuthor
        },
        publisher: {
          '@type': 'Organization',
          '@id': orgId,
          name: SITE_CONFIG.brandName,
          logo: {
            '@type': 'ImageObject',
            url: resolveAbsoluteUrl('/images/avatar.webp'),
            width: 192,
            height: 192
          }
        }
      }
      if (pubDate) {
        articleSchema.datePublished = pubDate
      }
      if (updatedDate) {
        articleSchema.dateModified = updatedDate
      }
      schemas.push(articleSchema)
    }
  }

  const faqItems = normalizeFaqItems(fm.faq)
  if (faqItems.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    })
  }

  for (const schema of schemas) {
    head.push(['script', { type: 'application/ld+json' }, safeJsonLd(schema)])
  }

  return head
}
