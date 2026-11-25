export type DataStatus =
  | 'Measured'
  | 'Vendor Data'
  | 'Historical Data'
  | 'Not Tested'
  | 'Unverified'
  | 'Conflicting'

export interface PlanItem {
  id: string
  brandSlug: string
  name: string
  billingCycle: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'biennial' | 'triennial' | 'one-time'
  billingCycleLabel: string
  priceCny: number
  trafficGb: number | null
  trafficLabel: string
  trafficPeriod: 'monthly' | 'one-time'
  costPerGb: number | null
  effectiveMonthlyCny: number | null
  discountNote?: string
  lineNote?: string
  deviceLimit?: string
  dataStatus: DataStatus
  sourceId: string
  isPrimaryDisplay: boolean
}

export interface ConflictRecord {
  field: string
  primaryValue: string
  conflictingValue: string
  primarySource: string
  conflictingSource: string
  note: string
}

export interface BrandRecord {
  entityId: string
  slug: string
  name: string
  englishName?: string
  aliases: string[]
  featuredRank: number | null
  isLeadBrand: boolean
  isAppendedBrand: boolean
  logo: string
  accentColor: string
  foundedYear: number | null
  officialUrlStatus: string
  affiliateUrl: string
  affiliateUrlNote?: string
  couponCode: string | null
  couponDiscount: string | null
  couponRestriction: string | null
  paymentMethods: string[]
  protocols: string[]
  routeTypes: string[]
  nodeCountLabel: string
  regions: string[]
  deviceLimit: string
  clientMode: 'self-hosted-and-third-party' | 'exclusive-only' | 'third-party' | 'unverified'
  clientNotes: string
  entryMonthlyCny: number | null
  entryLabel: string
  aiSupportSummary: Record<string, { status: string; dataStatus: DataStatus; note?: string }>
  streamingSummary: Record<string, { status: string; dataStatus: DataStatus; note?: string }>
  refundPolicy: string
  supportChannels: string
  positioning: string
  summary: string
  pros: string[]
  limitations: string[]
  risks: string[]
  suitableFor: string[]
  notSuitableFor: string[]
  conflicts: ConflictRecord[]
  dataStatus: DataStatus
  evidenceCompleteness: 'high' | 'medium' | 'basic'
  verifiedDate: string
  updatedDate: string
  sourceIds: string[]
  reviewUrl: string
}

export interface BenchmarkMetricRow {
  region: string
  latencyMs: number | null
  downloadMbps: number | null
  uploadMbps?: number | null
  lossRate?: string | null
}

export interface BenchmarkBatchRecord {
  id: string
  brandSlug: string
  brandName: string
  batchType: 'screenshot-evidence' | 'text-historical-record' | 'unlock-evidence'
  testedAt: string
  isPeakHours: boolean | null
  toolName: string
  backendEnv: string
  protocolDisplayed: string
  imagePath?: string
  thumbnailPath?: string
  dateConfidence: string
  metrics: BenchmarkMetricRow[]
  notes: string[]
  limitations: string[]
  dataStatus: DataStatus
  sourceId: string
}

export interface ClientSoftwareRecord {
  slug: string
  name: string
  os: Array<'Windows' | 'macOS' | 'Android' | 'iOS' | 'Linux' | 'OpenWrt'>
  category: string
  coreEngine: string
  protocols: string[]
  officialRepoOrStore: string
  maintenanceStatus: string
  pricing: string
  highlights: string[]
  warnings: string[]
  docUrl: string
  dataStatus: DataStatus
}
