<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BrandRecord, DataStatus, PlanItem } from '../../../../data/types'
import brandsRaw from '../../../../data/brands.json'
import plansRaw from '../../../../data/plans.json'
import availabilityRaw from '../../../../data/availability.json'
import compatibilityRaw from '../../../../data/client-compatibility.json'
import AffiliateButton from './AffiliateButton.vue'
import AffiliateDisclosure from './AffiliateDisclosure.vue'
import { formatPriceCny, getStatusMeta, safeArray, unwrapList } from './observatory'

type BudgetOption = 'low' | 'mid' | 'high' | 'onetime'
type TrafficOption = 'light' | 'main' | 'heavy'
type ClientOption = 'universal' | 'exclusive'
type GoalOption = 'ai' | 'streaming' | 'stability'

interface AvailabilityService {
  service?: string
  category?: string
  status?: string
  statusLabel?: string
  dataStatus?: DataStatus
}

interface AvailabilityRecord {
  brandSlug?: string
  slug?: string
  dataStatus?: DataStatus
  services?: AvailabilityService[]
}

interface CompatibilityRecord {
  brandSlug?: string
  clientMode?: string
  hasExclusiveClient?: boolean | null
  supportsThirdPartySubscription?: boolean | null
  supportedOs?: string[]
  notes?: string
}

const BUDGET_OPTIONS: Array<{ value: BudgetOption; label: string; hint: string; queryParam: string }> = [
  { value: 'low', label: '≤ 10 元/月', hint: '年付折算或轻量入门', queryParam: 'budget' },
  { value: 'mid', label: '15–25 元/月', hint: '常规月付主力档', queryParam: 'mid' },
  { value: 'high', label: '30–70 元/月', hint: '中大流量进阶档', queryParam: 'premium' },
  { value: 'onetime', label: '不限时按量', hint: '一次性买断不过期', queryParam: 'all' }
]

const TRAFFIC_OPTIONS: Array<{ value: TrafficOption; label: string; hint: string }> = [
  { value: 'light', label: '轻度 ≤70GB', hint: '文本/AI/网页检索' },
  { value: 'main', label: '主力 120–300GB', hint: '日常视频与多端办公' },
  { value: 'heavy', label: '重度 ≥500GB', hint: '4K 流媒体/大文件/合用' }
]

const CLIENT_OPTIONS: Array<{ value: ClientOption; label: string; hint: string }> = [
  { value: 'universal', label: '不限 / 多端通用订阅', hint: '支持 Clash / Shadowrocket / 软路由' },
  { value: 'exclusive', label: '小白专属客户端一键用', hint: '下载登录即用，免导入配置' }
]

const GOAL_OPTIONS: Array<{ value: GoalOption; label: string; hint: string }> = [
  { value: 'ai', label: 'AI 工具 ChatGPT / Claude', hint: '看重模型访问与实测标记' },
  { value: 'streaming', label: '流媒体 Netflix / Disney+', hint: '看重剧集解锁与地区覆盖' },
  { value: 'stability', label: '综合稳定与老牌证据', hint: '看重运营年限、专线与实测截图' }
]

const selectedBudget = ref<BudgetOption>('mid')
const selectedTraffic = ref<TrafficOption>('main')
const selectedClient = ref<ClientOption>('universal')
const selectedGoal = ref<GoalOption>('stability')

const allBrands = computed(() => unwrapList<BrandRecord>(brandsRaw))
const allPlans = computed(() => unwrapList<PlanItem>(plansRaw))
const allAvailability = computed(() => unwrapList<AvailabilityRecord>(availabilityRaw))
const allCompatibility = computed(() => unwrapList<CompatibilityRecord>(compatibilityRaw))

function getMonthlyEquivalent(plan: PlanItem): number | null {
  if (plan.billingCycle === 'one-time') return null
  if (typeof plan.effectiveMonthlyCny === 'number' && Number.isFinite(plan.effectiveMonthlyCny)) {
    return plan.effectiveMonthlyCny
  }
  if (plan.billingCycle === 'monthly' && typeof plan.priceCny === 'number') {
    return plan.priceCny
  }
  return null
}

function matchesTrafficScore(trafficGb: number | null | undefined, need: TrafficOption, isOneTime: boolean): number {
  if (typeof trafficGb !== 'number' || !Number.isFinite(trafficGb)) return 0
  if (isOneTime) {
    if (need === 'light') return trafficGb <= 160 ? 12 : 7
    if (need === 'main') return trafficGb >= 150 && trafficGb <= 350 ? 14 : trafficGb >= 100 ? 8 : 3
    return trafficGb >= 500 ? 14 : trafficGb >= 240 ? 9 : 3
  }
  if (need === 'light') {
    if (trafficGb <= 80) return 14
    if (trafficGb <= 150) return 10
    return 6
  }
  if (need === 'main') {
    if (trafficGb >= 120 && trafficGb <= 320) return 16
    if (trafficGb >= 80 && trafficGb < 120) return 7
    if (trafficGb > 320) return 10
    return 2
  }
  // heavy >= 500GB
  if (trafficGb >= 500) return 16
  if (trafficGb >= 300) return 8
  return 1
}

function evaluateServiceList(
  brand: BrandRecord,
  avRecord: AvailabilityRecord | undefined,
  names: string[]
): { score: number; summary: string } {
  const services = safeArray(avRecord?.services)
  const parts: string[] = []
  let score = 0
  let hasMeasured = false

  for (const name of names) {
    const avHit = services.find((s) => (s.service || '').toLowerCase() === name.toLowerCase())
    const fallbackAi = brand.aiSupportSummary?.[name]
    const fallbackStream = brand.streamingSummary?.[name]
    const dataStatus = avHit?.dataStatus || fallbackAi?.dataStatus || fallbackStream?.dataStatus
    const rawLabel = avHit?.statusLabel || fallbackAi?.status || fallbackStream?.status || ''
    const statusCode = avHit?.status || ''

    if (!rawLabel || dataStatus === 'Not Tested' || dataStatus === 'Unverified') {
      parts.push(`${name}: 待核实`)
      continue
    }

    if (dataStatus === 'Measured') hasMeasured = true
    const isConditional =
      statusCode === 'conditional' || rawLabel.includes('视节点') || rawLabel.includes('部分')

    if (isConditional) {
      score += 7
      parts.push(`${name}: 视节点而定`)
    } else {
      score += 12
      parts.push(`${name}: ${dataStatus === 'Measured' ? '实测支持' : '资料标注支持'}`)
    }
  }

  if (hasMeasured) score += 6
  return { score, summary: parts.join(' · ') || '待核实' }
}

interface WizardMatch {
  brand: BrandRecord
  score: number
  matchedPlan: PlanItem | null
  planLabel: string
  clientLabel: string
  goalSummary: string
  reasons: string[]
  caution: string
}

const rankedMatches = computed<WizardMatch[]>(() => {
  const budget = selectedBudget.value
  const traffic = selectedTraffic.value
  const clientPref = selectedClient.value
  const goal = selectedGoal.value

  const results: WizardMatch[] = allBrands.value.map((brand) => {
    const brandPlans = allPlans.value.filter((p) => p.brandSlug === brand.slug)
    const av = allAvailability.value.find((a) => (a.brandSlug || a.slug) === brand.slug)
    const compat = allCompatibility.value.find((c) => c.brandSlug === brand.slug)

    let score = 0
    const reasons: string[] = []
    let caution = ''

    // 1. Budget & Plan matching
    let matchedPlan: PlanItem | null = null
    let planScore = 0

    if (budget === 'onetime') {
      const oneTimePlans = brandPlans.filter((p) => p.billingCycle === 'one-time')
      if (oneTimePlans.length > 0) {
        const scoredPlans = oneTimePlans
          .map((p) => {
            const tScore = matchesTrafficScore(p.trafficGb, traffic, true)
            const effScore =
              typeof p.costPerGb === 'number' ? Math.max(0, 8 - p.costPerGb * 4) : 0
            return { plan: p, s: 24 + tScore + effScore }
          })
          .sort((a, b) => b.s - a.s)
        matchedPlan = scoredPlans[0].plan
        planScore = Math.round(scoredPlans[0].s)
        reasons.push('提供不限时按量包')
      } else {
        planScore = -15
        caution = '当前未收录不限时流量包'
      }
    } else {
      const targetRange =
        budget === 'low'
          ? { min: 0, max: 10.5 }
          : budget === 'mid'
            ? { min: 14, max: 27 }
            : { min: 28, max: 75 }

      const recurringPlans = brandPlans.filter((p) => p.billingCycle !== 'one-time')
      const scoredPlans = recurringPlans
        .map((p) => {
          const monthly = getMonthlyEquivalent(p)
          if (monthly === null) return { plan: p, s: 0, inBudget: false }
          const inBudget = monthly >= targetRange.min && monthly <= targetRange.max
          let bScore = 0
          if (inBudget) {
            bScore = 24
          } else {
            const dist =
              monthly < targetRange.min
                ? targetRange.min - monthly
                : monthly - targetRange.max
            bScore = Math.max(-8, 12 - dist * 0.8)
          }
          const tScore = matchesTrafficScore(p.trafficGb, traffic, false)
          return { plan: p, s: bScore + tScore, inBudget }
        })
        .sort((a, b) => b.s - a.s)

      if (scoredPlans.length > 0 && scoredPlans[0].s > 0) {
        matchedPlan = scoredPlans[0].plan
        planScore = Math.round(scoredPlans[0].s)
        if (scoredPlans[0].inBudget) {
          reasons.push('预算区间匹配')
        }
      } else if (typeof brand.entryMonthlyCny === 'number') {
        const inEntry =
          brand.entryMonthlyCny >= targetRange.min && brand.entryMonthlyCny <= targetRange.max
        planScore = inEntry ? 18 : 4
        if (inEntry) reasons.push('入门均价匹配')
      } else {
        planScore = 0
        caution = '套餐价格待核实'
      }
    }
    score += planScore

    // 2. Client & Devices preference
    const mode = compat?.clientMode || brand.clientMode || 'unverified'
    const supportsUniversal =
      compat?.supportsThirdPartySubscription === true ||
      mode === 'self-hosted-and-third-party' ||
      mode === 'third-party'
    const hasExclusive =
      compat?.hasExclusiveClient === true ||
      mode === 'exclusive-only' ||
      mode === 'self-hosted-and-third-party'
    const isUnlimitedDevices = (brand.deviceLimit || '').includes('不限')

    let clientLabel = '待核实'
    if (mode === 'self-hosted-and-third-party') {
      clientLabel = '自研客户端 + 通用订阅双支持'
    } else if (mode === 'third-party') {
      clientLabel = '第三方通用订阅（Clash/小火箭等）'
    } else if (mode === 'exclusive-only') {
      clientLabel = '仅限官方专属客户端（不支持第三方订阅）'
    }

    if (clientPref === 'universal') {
      if (supportsUniversal) {
        score += 26
        reasons.push('支持通用订阅')
        if (isUnlimitedDevices) {
          score += 5
          reasons.push('标注不限设备')
        }
      } else if (mode === 'exclusive-only') {
        score -= 28
        caution = caution || '仅限专属客户端，无法导入 Clash/软路由'
      } else {
        score += 2
      }
    } else {
      if (hasExclusive) {
        score += 26
        reasons.push('提供一键专属客户端')
      } else if (mode === 'third-party') {
        score -= 8
        caution = caution || '需自备 Clash/Shadowrocket 等第三方客户端'
      } else {
        score += 2
      }
    }

    // 3. Primary Goal
    let goalSummary = '待核实'
    if (goal === 'ai') {
      const aiEval = evaluateServiceList(brand, av, ['ChatGPT', 'Claude'])
      score += aiEval.score
      goalSummary = aiEval.summary
      if (aiEval.score >= 20) reasons.push('AI 访问记录清晰')
    } else if (goal === 'streaming') {
      const streamEval = evaluateServiceList(brand, av, ['Netflix', 'Disney+'])
      score += streamEval.score
      goalSummary = streamEval.summary
      if (streamEval.score >= 20) reasons.push('流媒体解锁记录完整')
    } else {
      let stabScore = 0
      if (typeof brand.foundedYear === 'number') {
        if (brand.foundedYear <= 2021) {
          stabScore += 12
          reasons.push(`${brand.foundedYear} 年老牌运营`)
        } else if (brand.foundedYear <= 2023) {
          stabScore += 7
        } else {
          stabScore += 3
        }
      }
      if (brand.dataStatus === 'Measured') {
        stabScore += 12
        reasons.push('具备独立实测截图')
      } else if (brand.dataStatus === 'Vendor Data') {
        stabScore += 4
      }
      if (brand.evidenceCompleteness === 'high') stabScore += 8
      if (safeArray(brand.routeTypes).some((r) => /IEPL|IPLC/i.test(r))) stabScore += 5
      score += stabScore
      const yearStr = brand.foundedYear ? `${brand.foundedYear}年起` : '年份待核实'
      const routeStr = safeArray(brand.routeTypes).slice(0, 2).join(' · ') || '线路待核实'
      goalSummary = `${yearStr} · ${routeStr}`
    }

    // Fair priority for lead brand when core criteria match
    if (brand.isLeadBrand && planScore >= 16 && (clientPref === 'universal' ? supportsUniversal : hasExclusive)) {
      score += 5
    }

    if (!caution && safeArray(brand.limitations).length > 0) {
      caution = brand.limitations[0]
    }

    const planLabel = matchedPlan
      ? `${matchedPlan.name}：${formatPriceCny(matchedPlan.priceCny)}/${matchedPlan.billingCycleLabel}（${matchedPlan.trafficLabel || '待核实'}）`
      : brand.entryLabel || (brand.entryMonthlyCny != null ? `${formatPriceCny(brand.entryMonthlyCny)}/月起` : '待核实')

    return {
      brand,
      score,
      matchedPlan,
      planLabel,
      clientLabel,
      goalSummary,
      reasons: reasons.slice(0, 4),
      caution
    }
  })

  return results
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (a.brand.isLeadBrand !== b.brand.isLeadBrand) return a.brand.isLeadBrand ? -1 : 1
      return (a.brand.featuredRank ?? 99) - (b.brand.featuredRank ?? 99)
    })
    .slice(0, 4)
})

const hasBudgetTrafficEdgeCase = computed(
  () => selectedBudget.value === 'low' && selectedTraffic.value === 'heavy'
)

const budgetQueryParam = computed(
  () => BUDGET_OPTIONS.find((o) => o.value === selectedBudget.value)?.queryParam || 'all'
)

const compareTopThreeHref = computed(() => {
  const slugs = rankedMatches.value
    .slice(0, 3)
    .map((m) => m.brand.slug)
    .join(',')
  return slugs ? `/compare/?brands=${slugs}` : '/compare/'
})

function resetWizard() {
  selectedBudget.value = 'mid'
  selectedTraffic.value = 'main'
  selectedClient.value = 'universal'
  selectedGoal.value = 'stability'
}
</script>

<template>
  <section class="selection-wizard" aria-label="30 秒机场选型向导">
    <div class="sw-header">
      <div>
        <span class="sw-kicker">30-SECOND SELECTION WIZARD · 交互式选型引擎</span>
        <h3 class="sw-title">30 秒机场选型向导</h3>
        <p class="sw-subtitle">
          基于本地 31 家品牌档案、219 份套餐记录、解锁与客户端兼容库实时匹配；缺失指标统一标为“待核实”，绝不虚构测速或价格。
        </p>
      </div>
      <div class="sw-header-actions">
        <button type="button" class="sw-reset-btn" @click="resetWizard">重置条件</button>
        <a :href="compareTopThreeHref" class="sw-compare-top-link">并排对比前 3 名 →</a>
      </div>
    </div>

    <div class="sw-steps">
      <div class="sw-group">
        <div class="sw-group-label">1. 每月预算区间</div>
        <div class="sw-options">
          <button
            v-for="opt in BUDGET_OPTIONS"
            :key="opt.value"
            type="button"
            class="sw-pill"
            :class="{ 'is-active': selectedBudget === opt.value }"
            @click="selectedBudget = opt.value"
          >
            <strong>{{ opt.label }}</strong>
            <span>{{ opt.hint }}</span>
          </button>
        </div>
      </div>

      <div class="sw-group">
        <div class="sw-group-label">2. 月流量需求</div>
        <div class="sw-options">
          <button
            v-for="opt in TRAFFIC_OPTIONS"
            :key="opt.value"
            type="button"
            class="sw-pill"
            :class="{ 'is-active': selectedTraffic === opt.value }"
            @click="selectedTraffic = opt.value"
          >
            <strong>{{ opt.label }}</strong>
            <span>{{ opt.hint }}</span>
          </button>
        </div>
      </div>

      <div class="sw-group">
        <div class="sw-group-label">3. 设备与客户端偏好</div>
        <div class="sw-options">
          <button
            v-for="opt in CLIENT_OPTIONS"
            :key="opt.value"
            type="button"
            class="sw-pill"
            :class="{ 'is-active': selectedClient === opt.value }"
            @click="selectedClient = opt.value"
          >
            <strong>{{ opt.label }}</strong>
            <span>{{ opt.hint }}</span>
          </button>
        </div>
      </div>

      <div class="sw-group">
        <div class="sw-group-label">4. 核心使用目标</div>
        <div class="sw-options">
          <button
            v-for="opt in GOAL_OPTIONS"
            :key="opt.value"
            type="button"
            class="sw-pill"
            :class="{ 'is-active': selectedGoal === opt.value }"
            @click="selectedGoal = opt.value"
          >
            <strong>{{ opt.label }}</strong>
            <span>{{ opt.hint }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="hasBudgetTrafficEdgeCase" class="sw-notice">
      提示：全库 219 份结构化套餐中，<strong>≤10 元/月</strong> 价位段通常对应 40–100GB/月轻量年付包，尚无覆盖 ≥500GB 月流量的真实套餐；系统已为您保留同价位或高性价比替代参考。
    </div>

    <div class="sw-results-head">
      <h4 class="sw-results-title">匹配推荐结果（Top {{ rankedMatches.length }}）</h4>
      <a :href="`/brands/?budget=${budgetQueryParam}`" class="sw-all-link">
        按此预算在品牌库中查看全部 →
      </a>
    </div>

    <div class="sw-results-grid">
      <article v-for="(item, idx) in rankedMatches" :key="item.brand.slug" class="sw-card">
        <div class="sw-card-top">
          <div class="sw-brand-id">
            <img
              v-if="item.brand.logo"
              :src="item.brand.logo"
              :alt="`${item.brand.name} Logo`"
              class="sw-logo"
              width="40"
              height="40"
              loading="lazy"
            />
            <div>
              <div class="sw-badges">
                <span class="sw-rank-badge">匹配 #{{ idx + 1 }}</span>
                <span v-if="item.brand.isLeadBrand" class="sw-lead-badge">主推合作</span>
                <span
                  class="sw-status-badge"
                  :style="{
                    color: getStatusMeta(item.brand.dataStatus).color,
                    backgroundColor: '#0b1220',
                    borderColor: getStatusMeta(item.brand.dataStatus).border
                  }"
                >
                  {{ getStatusMeta(item.brand.dataStatus).zhLabel }}
                </span>
              </div>
              <h5 class="sw-brand-name">
                <a :href="item.brand.reviewUrl || `/reviews/${item.brand.slug}/`">{{ item.brand.name }}</a>
                <span v-if="item.brand.englishName" class="sw-brand-en">{{ item.brand.englishName }}</span>
              </h5>
            </div>
          </div>
          <div class="sw-score-pill" title="综合条件匹配度参考分">
            <span>匹配指数</span>
            <strong>{{ Math.max(0, Math.min(99, item.score)) }}</strong>
          </div>
        </div>

        <div v-if="item.reasons.length > 0" class="sw-reason-tags">
          <span v-for="r in item.reasons" :key="r" class="sw-reason-tag">{{ r }}</span>
        </div>

        <dl class="sw-specs">
          <div>
            <dt>匹配参考套餐</dt>
            <dd class="sw-mono">{{ item.planLabel }}</dd>
          </div>
          <div>
            <dt>客户端与设备限制</dt>
            <dd>{{ item.clientLabel }} · {{ item.brand.deviceLimit || '待核实' }}</dd>
          </div>
          <div>
            <dt>目标能力核验</dt>
            <dd>{{ item.goalSummary }}</dd>
          </div>
          <div>
            <dt>协议 / 节点</dt>
            <dd class="sw-mono">
              {{ safeArray(item.brand.protocols).join(' / ') || '待核实' }} · {{ item.brand.nodeCountLabel || '待核实' }}
            </dd>
          </div>
        </dl>

        <p v-if="item.caution" class="sw-caution">
          注意：{{ item.caution }}
        </p>

        <div class="sw-card-actions">
          <AffiliateButton
            :brand-slug="item.brand.slug"
            :brand-name="item.brand.name"
            label="前往官网"
            size="sm"
            :show-disclosure="false"
            source-section="selection_wizard"
          />
          <div class="sw-card-links">
            <a :href="item.brand.reviewUrl || `/reviews/${item.brand.slug}/`">深度测评</a>
            <a :href="`/brands/?q=${encodeURIComponent(item.brand.name)}`">品牌库定位</a>
            <a :href="`/compare/?brands=${item.brand.slug}`">加入对比</a>
          </div>
        </div>
      </article>
    </div>

    <AffiliateDisclosure variant="inline" />
  </section>
</template>

<style scoped>
.selection-wizard {
  margin: 1.5rem 0 2rem;
  padding: 1.25rem;
  border-radius: 14px;
  background: var(--lab-bg-soft, #f4f7fb);
  border: 1px solid var(--lab-border, #dbe4f0);
  color: var(--lab-text-1, #0f172a);
}

.sw-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.sw-kicker {
  display: inline-block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--vp-c-brand-2, #0284c7);
}

.sw-title {
  margin: 0.15rem 0 0 !important;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--lab-text-1, #0f172a);
}

.sw-subtitle {
  margin: 0.3rem 0 0;
  font-size: 0.83rem;
  color: var(--lab-text-3, #475569);
  line-height: 1.5;
}

.sw-header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
}

.sw-reset-btn {
  padding: 0.36rem 0.75rem;
  border-radius: 7px;
  border: 1px solid var(--lab-border-strong, #cbd5e1);
  background: var(--lab-bg-card, #ffffff);
  color: var(--lab-text-2, #334155);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.sw-reset-btn:hover {
  border-color: var(--vp-c-brand-2, #0284c7);
  color: var(--lab-link, #0f4c81);
}

.sw-compare-top-link,
.sw-all-link {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--lab-link, #0f4c81);
  text-decoration: none;
}

.sw-compare-top-link:hover,
.sw-all-link:hover {
  text-decoration: underline;
}

.sw-steps {
  display: grid;
  gap: 0.85rem;
  margin-bottom: 1rem;
}

.sw-group {
  padding: 0.8rem 0.9rem;
  border-radius: 10px;
  background: var(--lab-bg-card, #ffffff);
  border: 1px solid var(--lab-border, #dbe4f0);
}

.sw-group-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--lab-text-2, #334155);
  margin-bottom: 0.55rem;
}

.sw-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  gap: 0.5rem;
}

.sw-pill {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.14rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--lab-border-strong, #cbd5e1);
  background: var(--lab-bg-subtle, #f8fafc);
  color: var(--lab-text-1, #0f172a);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease, transform 0.1s ease;
}

.sw-pill strong {
  font-size: 0.84rem;
  font-weight: 700;
}

.sw-pill span {
  font-size: 0.72rem;
  color: var(--lab-text-muted, #64748b);
}

.sw-pill:hover {
  border-color: var(--vp-c-brand-2, #0284c7);
}

.sw-pill.is-active {
  background: #0f4c81;
  border-color: #0f4c81;
  color: #ffffff;
}

.sw-pill.is-active span {
  color: #dbeafe;
}

.sw-notice {
  margin: 0.75rem 0;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  font-size: 0.8rem;
  line-height: 1.5;
}

.sw-results-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0 0.7rem;
}

.sw-results-title {
  margin: 0 !important;
  font-size: 1rem;
  font-weight: 700;
  color: var(--lab-text-1, #0f172a);
}

.sw-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 0.9rem;
}

.sw-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1rem;
  border-radius: 12px;
  background: var(--lab-bg-card, #ffffff);
  border: 1px solid var(--lab-border, #dbe4f0);
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}

.sw-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.6rem;
}

.sw-brand-id {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
}

.sw-logo {
  width: 40px;
  height: 40px;
  border-radius: 9px;
  object-fit: contain;
  background: #f4f7fb;
  border: 1px solid var(--lab-border, #e2e8f0);
  padding: 3px;
  flex-shrink: 0;
}

.sw-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.25rem;
}

.sw-rank-badge,
.sw-lead-badge,
.sw-status-badge {
  padding: 0.08rem 0.44rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.sw-rank-badge {
  background: #0f4c81;
  color: #ffffff;
}

.sw-lead-badge {
  background: var(--lab-accent-bg, #e0f2fe);
  color: var(--lab-accent-text, #0369a1);
}

.sw-status-badge {
  border: 1px solid;
}

.sw-brand-name {
  margin: 0 !important;
  font-size: 1.04rem;
  font-weight: 700;
  line-height: 1.3;
}

.sw-brand-name a {
  color: var(--lab-text-1, #0f172a);
  text-decoration: none;
}

.sw-brand-name a:hover {
  color: var(--lab-link, #0f4c81);
  text-decoration: underline;
}

.sw-brand-en {
  margin-left: 0.35rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--lab-text-muted, #64748b);
}

.sw-score-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.3rem 0.55rem;
  border-radius: 8px;
  background: var(--lab-bg-subtle, #f8fafc);
  border: 1px solid var(--lab-border, #e2e8f0);
  flex-shrink: 0;
}

.sw-score-pill span {
  font-size: 0.64rem;
  color: var(--lab-text-muted, #64748b);
}

.sw-score-pill strong {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.95rem;
  color: var(--lab-link, #0f4c81);
}

.sw-reason-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.sw-reason-tag {
  padding: 0.12rem 0.48rem;
  border-radius: 5px;
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
  font-size: 0.72rem;
  font-weight: 600;
}

.sw-specs {
  margin: 0;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background: var(--lab-bg-subtle, #f8fafc);
  border: 1px solid var(--lab-border, #e2e8f0);
  display: grid;
  gap: 0.42rem;
  font-size: 0.78rem;
}

.sw-specs dt {
  font-size: 0.69rem;
  color: var(--lab-text-muted, #64748b);
}

.sw-specs dd {
  margin: 0.05rem 0 0;
  color: var(--lab-text-1, #1e293b);
  font-weight: 600;
  word-break: break-word;
}

.sw-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.sw-caution {
  margin: 0;
  padding: 0.45rem 0.65rem;
  border-radius: 6px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.28);
  color: #92400e;
  font-size: 0.76rem;
  line-height: 1.45;
}

.sw-card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
  margin-top: auto;
  padding-top: 0.6rem;
  border-top: 1px solid var(--lab-border, #e2e8f0);
}

.sw-card-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.sw-card-links a {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--lab-link, #0f4c81);
  text-decoration: none;
}

.sw-card-links a:hover {
  text-decoration: underline;
}

:global(.dark .sw-pill.is-active){
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
}

:global(.dark .sw-rank-badge){
  background: #0284c7;
  color: #ffffff;
}

:global(.dark .sw-reason-tag){
  background: rgba(16, 185, 129, 0.18);
  color: #34d399;
}

:global(.dark .sw-notice){
  background: rgba(245, 158, 11, 0.14);
  border-color: rgba(245, 158, 11, 0.35);
  color: #fde68a;
}

:global(.dark .sw-caution){
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.32);
  color: #fcd34d;
}
</style>
