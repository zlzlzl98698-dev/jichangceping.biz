import type {
  BenchmarkBatchRecord,
  BrandRecord,
  ClientSoftwareRecord,
  DataStatus,
  PlanItem
} from '../../../../data/types'

export interface StatusMeta {
  code: DataStatus | 'Unknown'
  zhLabel: string
  enTag: string
  tone: 'measured' | 'vendor' | 'historical' | 'not-tested' | 'unverified' | 'conflicting'
  color: string
  bg: string
  border: string
}

const STATUS_MAP: Record<string, StatusMeta> = {
  Measured: {
    code: 'Measured',
    zhLabel: '独立实测',
    enTag: 'MEASURED',
    tone: 'measured',
    color: '#34d399',
    bg: 'rgba(16, 185, 129, 0.14)',
    border: 'rgba(52, 211, 153, 0.35)'
  },
  'Vendor Data': {
    code: 'Vendor Data',
    zhLabel: '品牌方资料',
    enTag: 'VENDOR DATA',
    tone: 'vendor',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.35)'
  },
  'Historical Data': {
    code: 'Historical Data',
    zhLabel: '历史记录',
    enTag: 'HISTORICAL',
    tone: 'historical',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.14)',
    border: 'rgba(251, 191, 36, 0.35)'
  },
  'Not Tested': {
    code: 'Not Tested',
    zhLabel: '暂未实测',
    enTag: 'NOT TESTED',
    tone: 'not-tested',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.14)',
    border: 'rgba(148, 163, 184, 0.32)'
  },
  Unverified: {
    code: 'Unverified',
    zhLabel: '待核实',
    enTag: 'UNVERIFIED',
    tone: 'unverified',
    color: '#cbd5e1',
    bg: 'rgba(148, 163, 184, 0.12)',
    border: 'rgba(148, 163, 184, 0.28)'
  },
  Conflicting: {
    code: 'Conflicting',
    zhLabel: '存在数据冲突',
    enTag: 'CONFLICTING',
    tone: 'conflicting',
    color: '#fb7185',
    bg: 'rgba(251, 113, 133, 0.14)',
    border: 'rgba(251, 113, 133, 0.35)'
  }
}

export function getStatusMeta(status?: string | null): StatusMeta {
  if (!status) return STATUS_MAP.Unverified
  if (STATUS_MAP[status]) return STATUS_MAP[status]
  const normalized = status.toLowerCase()
  if (normalized.includes('measur') || normalized.includes('实测') || normalized.includes('pass') || normalized.includes('operational')) {
    return STATUS_MAP.Measured
  }
  if (normalized.includes('vendor') || normalized.includes('官方') || normalized.includes('声称') || normalized.includes('品牌')) {
    return STATUS_MAP['Vendor Data']
  }
  if (normalized.includes('histor') || normalized.includes('历史')) {
    return STATUS_MAP['Historical Data']
  }
  if (normalized.includes('conflict') || normalized.includes('冲突')) {
    return STATUS_MAP.Conflicting
  }
  if (normalized.includes('not') || normalized.includes('未测') || normalized.includes('unavailable')) {
    return STATUS_MAP['Not Tested']
  }
  return STATUS_MAP.Unverified
}

/**
 * Unwraps JSON imports whether they are arrays, `{ items }`, `{ records }`,
 * `{ brands }`, `{ plans }`, `{ benchmarks }`, `{ clients }`, or plain maps.
 */
export function unwrapList<T = Record<string, unknown>>(raw: unknown): T[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as T[]
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    for (const key of ['items', 'records', 'brands', 'plans', 'benchmarks', 'clients', 'sources', 'batches', 'routes', 'entries', 'data']) {
      if (Array.isArray(obj[key])) {
        return obj[key] as T[]
      }
    }
    // Plain dictionary keyed by slug/id
    const vals = Object.values(obj).filter((v) => v && typeof v === 'object' && !Array.isArray(v))
    if (vals.length > 0) return vals as T[]
  }
  return []
}

export function formatPending(value: unknown, suffix = ''): string {
  if (value === null || value === undefined || value === '') return '待核实'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '待核实'
    return `${value}${suffix}`
  }
  return `${String(value)}${suffix}`
}

export function formatMetricNumber(value: number | null | undefined, suffix = '', decimals = 1): string {
  if (value === null || value === undefined || typeof value !== 'number' || !Number.isFinite(value)) {
    return '待核实'
  }
  const formatted = Number.isInteger(value) ? String(value) : value.toFixed(decimals).replace(/\.?0+$/, '')
  return `${formatted}${suffix}`
}

export function formatPriceCny(value: number | null | undefined): string {
  if (value === null || value === undefined || typeof value !== 'number' || !Number.isFinite(value)) {
    return '待核实'
  }
  const numStr = Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '')
  return `¥${numStr}`
}

export function formatCostPerGb(value: number | null | undefined): string {
  if (value === null || value === undefined || typeof value !== 'number' || !Number.isFinite(value)) {
    return '待核实'
  }
  return `¥${value.toFixed(3)}/GB`
}

export function safeArray<T>(val: T[] | null | undefined): T[] {
  return Array.isArray(val) ? val : []
}

export function sanitizeHexColor(color?: string | null, fallback = '#0ea5e9'): string {
  if (!color || typeof color !== 'string') return fallback
  const trimmed = color.trim()
  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return trimmed
  return fallback
}

export interface ResolvedAffiliateLink {
  slug: string
  brandName: string
  url: string | null
  note?: string
  couponCode?: string | null
  alternateCouponCode?: string | null
  couponDiscount?: string | null
  couponRestriction?: string | null
  urlFormatWarning?: string
  hasAffiliate: boolean
}

export function resolveAffiliateFromModule(
  affModule: unknown,
  brandSlug: string,
  brandName?: string
): ResolvedAffiliateLink {
  const empty: ResolvedAffiliateLink = {
    slug: brandSlug,
    brandName: brandName || brandSlug,
    url: null,
    hasAffiliate: false
  }
  if (!brandSlug || !affModule || typeof affModule !== 'object') return empty
  const mod = affModule as Record<string, unknown>

  const extractRecord = (rec: Record<string, unknown>): ResolvedAffiliateLink => {
    const u = (rec.primaryUrl || rec.affiliateUrl || rec.url || rec.link) as string | undefined
    return {
      slug: brandSlug,
      brandName: (rec.brandName || rec.name || brandName || brandSlug) as string,
      url: u && u.startsWith('http') ? u : null,
      note: (rec.note || rec.affiliateUrlNote) as string | undefined,
      couponCode: (rec.couponCode ?? null) as string | null,
      alternateCouponCode: (rec.alternateCouponCode ?? null) as string | null,
      couponDiscount: (rec.couponDiscount ?? null) as string | null,
      couponRestriction: (rec.couponRestriction ?? null) as string | null,
      urlFormatWarning: (rec.urlFormatWarning ?? undefined) as string | undefined,
      hasAffiliate: Boolean(u && u.startsWith('http'))
    }
  }

  // Support helper function export: getAffiliateLink(slug) / getAffiliateRecord(slug)
  for (const fnName of ['getAffiliateRecord', 'getAffiliateLink', 'getBrandAffiliate']) {
    const fn = mod[fnName]
    if (typeof fn === 'function') {
      try {
        const res = fn(brandSlug)
        if (typeof res === 'string' && res.startsWith('http')) {
          return { ...empty, url: res, hasAffiliate: true }
        }
        if (res && typeof res === 'object') {
          return extractRecord(res as Record<string, unknown>)
        }
      } catch {
        // Ignore lookup error and try object map
      }
    }
  }

  // Support map exports: AFFILIATE_LINKS, affiliateLinks, AFFILIATE_LINK_LIST
  for (const mapKey of ['AFFILIATE_LINKS', 'affiliateLinks', 'AFFILIATE_LINK_LIST', 'LINKS', 'default']) {
    const container = mod[mapKey]
    if (!container) continue
    if (Array.isArray(container)) {
      const hit = container.find(
        (item) => item && typeof item === 'object' && ((item as Record<string, unknown>).slug === brandSlug || (item as Record<string, unknown>).brandSlug === brandSlug)
      ) as Record<string, unknown> | undefined
      if (hit) return extractRecord(hit)
    } else if (typeof container === 'object') {
      const entry = (container as Record<string, unknown>)[brandSlug]
      if (typeof entry === 'string' && entry.startsWith('http')) {
        return { ...empty, url: entry, hasAffiliate: true }
      }
      if (entry && typeof entry === 'object') {
        return extractRecord(entry as Record<string, unknown>)
      }
    }
  }

  return empty
}

export function trackCommercialEvent(
  eventName: 'affiliate_click' | 'coupon_click' | 'compare_view' | 'plan_select',
  payload: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === 'undefined') return
  try {
    const win = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>
      gtag?: (...args: unknown[]) => void
    }
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({ event: eventName, ...payload })
    } else if (typeof win.gtag === 'function') {
      win.gtag('event', eventName, payload)
    }
  } catch {
    // Non-blocking analytics hook
  }
}

export function findBrand(brands: BrandRecord[], slug?: string): BrandRecord | undefined {
  if (!slug) return undefined
  return brands.find((b) => b.slug === slug || b.entityId === slug)
}

export function filterPlansByBrand(plans: PlanItem[], slug?: string): PlanItem[] {
  if (!slug) return []
  return plans.filter((p) => p.brandSlug === slug)
}

export function filterBenchmarksByBrand(batches: BenchmarkBatchRecord[], slug?: string): BenchmarkBatchRecord[] {
  if (!slug) return []
  return batches.filter((b) => b.brandSlug === slug)
}

export function filterClientsBySlugs(clients: ClientSoftwareRecord[], slugs?: string[]): ClientSoftwareRecord[] {
  if (!slugs || slugs.length === 0) return clients
  const set = new Set(slugs)
  return clients.filter((c) => set.has(c.slug))
}
