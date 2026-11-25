<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { BenchmarkBatchRecord, BrandRecord, PlanItem } from '../../../../data/types'
import brandsRaw from '../../../../data/brands.json'
import plansRaw from '../../../../data/plans.json'
import benchmarksRaw from '../../../../data/benchmarks.json'
import AffiliateButton from './AffiliateButton.vue'
import AffiliateDisclosure from './AffiliateDisclosure.vue'
import {
  filterBenchmarksByBrand,
  filterPlansByBrand,
  findBrand,
  formatMetricNumber,
  formatPending,
  formatPriceCny,
  getStatusMeta,
  safeArray,
  trackCommercialEvent,
  unwrapList
} from './observatory'

const props = withDefaults(
  defineProps<{
    initialSlugs?: string[]
  }>(),
  {
    initialSlugs: undefined
  }
)

const allBrands = computed(() => unwrapList<BrandRecord>(brandsRaw))
const allPlans = computed(() => unwrapList<PlanItem>(plansRaw))
const allBenchmarks = computed(() => unwrapList<BenchmarkBatchRecord>(benchmarksRaw))

const selectedSlugs = ref<string[]>([])

function initDefaultSelection() {
  if (props.initialSlugs && props.initialSlugs.length >= 2) {
    selectedSlugs.value = props.initialSlugs.slice(0, 4)
    return
  }
  const featured = allBrands.value
    .filter((b) => b.featuredRank !== null)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99))
  const defaults = (featured.length >= 3 ? featured : allBrands.value).slice(0, 3).map((b) => b.slug)
  selectedSlugs.value = defaults
}

initDefaultSelection()

onMounted(() => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('brands')
  if (raw) {
    const valid = new Set(allBrands.value.map((b) => b.slug))
    const picked = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => valid.has(s))
      .slice(0, 4)
    if (picked.length > 0) {
      if (picked.length === 1) {
        const second = allBrands.value.find((b) => b.slug !== picked[0])?.slug
        selectedSlugs.value = second ? [picked[0], second] : picked
      } else {
        selectedSlugs.value = picked
      }
      trackCommercialEvent('compare_view', { brands: selectedSlugs.value.join(',') })
    }
  }
})

const selectedBrands = computed(() =>
  selectedSlugs.value
    .map((s) => findBrand(allBrands.value, s))
    .filter((b): b is BrandRecord => Boolean(b))
)

function toggleBrand(slug: string) {
  const idx = selectedSlugs.value.indexOf(slug)
  if (idx >= 0) {
    if (selectedSlugs.value.length <= 2) return
    selectedSlugs.value.splice(idx, 1)
  } else {
    if (selectedSlugs.value.length >= 4) {
      selectedSlugs.value.shift()
    }
    selectedSlugs.value.push(slug)
  }
  trackCommercialEvent('compare_view', { brands: selectedSlugs.value.join(',') })
}

function getLowestPlanSummary(slug: string): string {
  const plans = filterPlansByBrand(allPlans.value, slug)
  if (plans.length === 0) return '待核实'
  const sorted = [...plans].sort((a, b) => (a.priceCny ?? 99999) - (b.priceCny ?? 99999))
  const p = sorted[0]
  return `${formatPriceCny(p.priceCny)} / ${p.billingCycleLabel} (${p.trafficLabel || '待核实'})`
}

function getLatestBenchmarkSummary(slug: string): { latency: string; download: string; note: string } {
  const batches = filterBenchmarksByBrand(allBenchmarks.value, slug)
  if (batches.length === 0) {
    return { latency: '待核实', download: '待核实', note: '暂无独立实测记录' }
  }
  const latest = batches[0]
  const rows = safeArray(latest.metrics)
  const validLat = rows
    .map((m) => m.latencyMs)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v))
  const validDl = rows
    .map((m) => m.downloadMbps)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v))

  const avgLat =
    validLat.length > 0
      ? Math.round(validLat.reduce((a, b) => a + b, 0) / validLat.length)
      : null
  const maxDl = validDl.length > 0 ? Math.max(...validDl) : null

  return {
    latency: formatMetricNumber(avgLat, ' ms', 0),
    download: formatMetricNumber(maxDl, ' Mbps', 1),
    note: `${latest.testedAt.slice(0, 10)} · ${latest.protocolDisplayed || '未知协议'}${latest.imagePath ? '（含原始截图）' : ''}`
  }
}

function summarizeAi(brand: BrandRecord): string {
  const entries = Object.entries(brand.aiSupportSummary || {})
  if (entries.length === 0) return '待核实'
  return entries
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${v?.status || '待核实'}`)
    .join('；')
}
</script>

<template>
  <section class="compare-tool" aria-label="机场品牌横向参数对比工具">
    <div class="ct-picker">
      <div class="ct-picker-head">
        <div>
          <h3 class="ct-title">选择 2–4 家品牌进行横向参数对照</h3>
          <p class="ct-sub">
            缺失字段统一显示“待核实”，绝不将缺失测速或未核实价格折算为 0。
          </p>
        </div>
        <span class="ct-count">已选 {{ selectedBrands.length }} / 4</span>
      </div>

      <div class="ct-chip-pool">
        <button
          v-for="brand in allBrands"
          :key="brand.slug"
          type="button"
          class="ct-chip"
          :class="{ 'is-selected': selectedSlugs.includes(brand.slug) }"
          @click="toggleBrand(brand.slug)"
        >
          <span>{{ brand.name }}</span>
          <span v-if="brand.featuredRank && brand.featuredRank <= 11" class="ct-chip-rank">#{{ brand.featuredRank }}</span>
        </button>
      </div>
    </div>

    <div v-if="selectedBrands.length >= 2" class="ct-table-wrap">
      <table class="ct-table">
        <thead>
          <tr>
            <th>对比维度</th>
            <th v-for="b in selectedBrands" :key="b.slug">
              <div class="ct-th-brand">
                <a :href="`/reviews/${b.slug}/`">{{ b.name }}</a>
                <span
                  class="ct-status"
                  :style="{
                    color: getStatusMeta(b.dataStatus).color,
                    backgroundColor: '#0b1220',
                    borderColor: getStatusMeta(b.dataStatus).border
                  }"
                >
                  {{ getStatusMeta(b.dataStatus).zhLabel }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>品牌定位</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-pos`">{{ b.positioning || '待核实' }}</td>
          </tr>
          <tr>
            <th>开业年份</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-yr`" class="ct-mono">
              {{ formatPending(b.foundedYear, ' 年') }}
            </td>
          </tr>
          <tr>
            <th>入门参考</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-ent`" class="ct-mono">
              {{ b.entryLabel || (b.entryMonthlyCny != null ? `${formatPriceCny(b.entryMonthlyCny)}/月` : '待核实') }}
            </td>
          </tr>
          <tr>
            <th>最低实付套餐</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-low`">
              {{ getLowestPlanSummary(b.slug) }}
            </td>
          </tr>
          <tr>
            <th>优惠码</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-cpn`" class="ct-mono">
              {{ b.couponCode ? `${b.couponCode} (${b.couponDiscount || '见结算页'})` : '暂无记录' }}
            </td>
          </tr>
          <tr>
            <th>线路类型</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-rt`">
              {{ safeArray(b.routeTypes).join(' · ') || '待核实' }}
            </td>
          </tr>
          <tr>
            <th>传输协议</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-pr`" class="ct-mono">
              {{ safeArray(b.protocols).join(' / ') || '待核实' }}
            </td>
          </tr>
          <tr>
            <th>节点规模</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-nd`">{{ b.nodeCountLabel || '待核实' }}</td>
          </tr>
          <tr>
            <th>设备数限制</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-dv`">{{ b.deviceLimit || '待核实' }}</td>
          </tr>
          <tr>
            <th>客户端方式</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-cm`">
              {{ b.clientNotes || b.clientMode || '待核实' }}
            </td>
          </tr>
          <tr>
            <th>最近测速延迟均值</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-lat`" class="ct-mono">
              {{ getLatestBenchmarkSummary(b.slug).latency }}
            </td>
          </tr>
          <tr>
            <th>最近测速峰值下行</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-dl`" class="ct-mono">
              {{ getLatestBenchmarkSummary(b.slug).download }}
            </td>
          </tr>
          <tr>
            <th>测速样本依据</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-bn`">
              {{ getLatestBenchmarkSummary(b.slug).note }}
            </td>
          </tr>
          <tr>
            <th>AI 工具支持</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-ai`">{{ summarizeAi(b) }}</td>
          </tr>
          <tr>
            <th>退款与支付</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-pay`">
              {{ safeArray(b.paymentMethods).join('/') || '待核实' }} · {{ b.refundPolicy || '待核实' }}
            </td>
          </tr>
          <tr>
            <th>操作入口</th>
            <td v-for="b in selectedBrands" :key="`${b.slug}-cta`">
              <div class="ct-cell-cta">
                <AffiliateButton
                  :brand-slug="b.slug"
                  :brand-name="b.name"
                  label="官网入口"
                  size="sm"
                  :show-disclosure="false"
                  source-section="comparison_tool"
                />
                <a v-if="b.reviewUrl" :href="b.reviewUrl" class="ct-rev-link">查看深度测评 →</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AffiliateDisclosure variant="inline" />
  </section>
</template>

<style scoped>
.compare-tool {
  margin: 1.5rem 0 2rem;
}

.ct-picker {
  padding: 1rem 1.1rem;
  border-radius: 12px;
  background: #f4f7fb;
  border: 1px solid #dbe4f0;
  margin-bottom: 1rem;
}

.ct-picker-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
}

.ct-title {
  margin: 0 !important;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.ct-sub {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: #64748b;
}

.ct-count {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: #0f4c81;
  color: #ffffff;
  font-size: 0.76rem;
  font-weight: 600;
}

.ct-chip-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.ct-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.62rem;
  border-radius: 7px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
}

.ct-chip.is-selected {
  background: #0f4c81;
  border-color: #0f4c81;
  color: #ffffff;
  font-weight: 600;
}

.ct-chip-rank {
  font-size: 0.68rem;
  opacity: 0.82;
}

.ct-table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #dbe4f0;
  background: #ffffff;
}

.ct-table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  font-size: 0.83rem;
  color: #1e293b;
}

.ct-table th,
.ct-table td {
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #f1f5f9;
  text-align: left;
  vertical-align: top;
}

.ct-table thead th {
  background: #f8fafc;
  font-weight: 700;
}

.ct-table tbody th {
  width: 135px;
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
}

.ct-th-brand {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.ct-th-brand a {
  color: #0f4c81;
  font-size: 0.96rem;
  text-decoration: none;
}

.ct-th-brand a:hover {
  text-decoration: underline;
}

.ct-status {
  align-self: flex-start;
  padding: 0.08rem 0.42rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.68rem;
  font-weight: 600;
}

.ct-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
}

.ct-cell-cta {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.ct-rev-link {
  font-size: 0.78rem;
  font-weight: 600;
  color: #0284c7;
  text-decoration: none;
}

.ct-rev-link:hover {
  text-decoration: underline;
}

:global(.dark .ct-picker){
  background: #0b1220;
  border-color: #1e2d4a;
}

:global(.dark .ct-title){
  color: #f1f5f9;
}

:global(.dark .ct-sub){
  color: #94a3b8;
}

:global(.dark .ct-count){
  background: #0284c7;
}

:global(.dark .ct-chip){
  background: #131d31;
  border-color: #334155;
  color: #cbd5e1;
}

:global(.dark .ct-chip.is-selected){
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
}

:global(.dark .ct-table-wrap){
  background: #131d31;
  border-color: #1e2d4a;
}

:global(.dark .ct-table) {
  color: #e2e8f0;
  background: #131d31;
}

:global(.dark .ct-table tr),
:global(.dark .ct-table tr:nth-child(2n)) {
  background: transparent !important;
}

:global(.dark .ct-table th),
:global(.dark .ct-table td) {
  border-bottom-color: #1e2d4a;
  border-right-color: #1e2d4a;
}

:global(.dark .ct-table td) {
  background: #131d31 !important;
  color: #e2e8f0 !important;
}

:global(.dark .ct-table thead th),
:global(.dark .ct-table tbody th) {
  background: #0b1220 !important;
  color: #cbd5e1 !important;
}

:global(.dark .ct-th-brand a),
:global(.dark .ct-rev-link){
  color: #38bdf8;
}
</style>
