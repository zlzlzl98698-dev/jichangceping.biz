<script setup lang="ts">
import { computed } from 'vue'
import type { BrandRecord, PlanItem } from '../../../../data/types'
import brandsRaw from '../../../../data/brands.json'
import plansRaw from '../../../../data/plans.json'
import WatermarkedChartFrame from './WatermarkedChartFrame.vue'
import {
  filterPlansByBrand,
  findBrand,
  formatPending,
  formatPriceCny,
  safeArray,
  unwrapList
} from './observatory'

const props = withDefaults(
  defineProps<{
    slug?: string
    brandSlug?: string
  }>(),
  {
    slug: '',
    brandSlug: ''
  }
)

const targetSlug = computed(() => (props.brandSlug || props.slug || '').trim())
const brand = computed(() => findBrand(unwrapList<BrandRecord>(brandsRaw), targetSlug.value))
const plans = computed(() => filterPlansByBrand(unwrapList<PlanItem>(plansRaw), targetSlug.value))

const clientModeLabel = computed(() => {
  switch (brand.value?.clientMode) {
    case 'self-hosted-and-third-party':
      return '自研客户端 + 第三方订阅'
    case 'exclusive-only':
      return '仅限自研/专属客户端'
    case 'third-party':
      return '第三方通用客户端'
    default:
      return '待核实'
  }
})

const completenessPct = computed(() => {
  if (!brand.value) return 0
  if (brand.value.evidenceCompleteness === 'high') return 90
  if (brand.value.evidenceCompleteness === 'medium') return 62
  return 34
})
</script>

<template>
  <WatermarkedChartFrame
    v-if="brand"
    title="品牌基础设施与能力快照"
    :subtitle="brand.positioning || 'Infrastructure Service Snapshot'"
    :brand-name="brand.name"
    :accent-color="brand.accentColor"
    :data-status="brand.dataStatus"
    :tested-at="brand.verifiedDate || brand.updatedDate"
    :source-label="`收录音源 ${safeArray(brand.sourceIds).length} 项`"
  >
    <div class="bo-grid">
      <div class="bo-kpi">
        <span class="bo-k">开业/运营年份</span>
        <strong class="bo-v bo-mono">{{ formatPending(brand.foundedYear, ' 年') }}</strong>
      </div>
      <div class="bo-kpi">
        <span class="bo-k">入门参考成本</span>
        <strong class="bo-v bo-mono">
          {{ brand.entryLabel || (brand.entryMonthlyCny != null ? `${formatPriceCny(brand.entryMonthlyCny)}/月` : '待核实') }}
        </strong>
      </div>
      <div class="bo-kpi">
        <span class="bo-k">节点规模</span>
        <strong class="bo-v">{{ brand.nodeCountLabel || '待核实' }}</strong>
      </div>
      <div class="bo-kpi">
        <span class="bo-k">设备限制</span>
        <strong class="bo-v">{{ brand.deviceLimit || '待核实' }}</strong>
      </div>
      <div class="bo-kpi">
        <span class="bo-k">已收录套餐</span>
        <strong class="bo-v bo-mono">{{ plans.length > 0 ? `${plans.length} 档` : '待核实' }}</strong>
      </div>
      <div class="bo-kpi">
        <span class="bo-k">客户端形态</span>
        <strong class="bo-v">{{ clientModeLabel }}</strong>
      </div>
    </div>

    <div class="bo-rows">
      <div class="bo-row">
        <span class="bo-row-k">线路与传输</span>
        <div class="bo-tags">
          <span v-for="r in safeArray(brand.routeTypes)" :key="r" class="bo-tag is-route">{{ r }}</span>
          <span v-for="p in safeArray(brand.protocols)" :key="p" class="bo-tag is-proto">{{ p }}</span>
          <span v-if="safeArray(brand.routeTypes).length === 0 && safeArray(brand.protocols).length === 0" class="bo-muted">待核实</span>
        </div>
      </div>

      <div class="bo-row">
        <span class="bo-row-k">覆盖地区</span>
        <div class="bo-tags">
          <span v-for="reg in safeArray(brand.regions)" :key="reg" class="bo-tag">{{ reg }}</span>
          <span v-if="safeArray(brand.regions).length === 0" class="bo-muted">待核实</span>
        </div>
      </div>

      <div class="bo-row">
        <span class="bo-row-k">支付与售后</span>
        <div class="bo-inline-meta">
          <span>支付：{{ safeArray(brand.paymentMethods).join(' / ') || '待核实' }}</span>
          <span>·</span>
          <span>退款：{{ brand.refundPolicy || '待核实' }}</span>
          <span>·</span>
          <span>客服：{{ brand.supportChannels || '待核实' }}</span>
        </div>
      </div>

      <div class="bo-row">
        <span class="bo-row-k">证据完整度</span>
        <div class="bo-meter-wrap">
          <div class="bo-meter-track">
            <div class="bo-meter-fill" :style="{ width: `${completenessPct}%` }" />
          </div>
          <span class="bo-mono bo-meter-label">{{ brand.evidenceCompleteness.toUpperCase() }}</span>
        </div>
      </div>
    </div>

    <div v-if="safeArray(brand.conflicts).length > 0" class="bo-conflict-box">
      <div class="bo-conflict-title">资料冲突记录 ({{ brand.conflicts.length }})</div>
      <ul>
        <li v-for="(c, i) in brand.conflicts" :key="i">
          <code>{{ c.field }}</code>：{{ c.primaryValue }}（{{ c.primarySource }}） vs {{ c.conflictingValue }}（{{ c.conflictingSource }}）— {{ c.note }}
        </li>
      </ul>
    </div>
  </WatermarkedChartFrame>

  <WatermarkedChartFrame
    v-else
    title="品牌基础设施与能力快照"
    data-status="Unverified"
  >
    <p class="bo-muted">未找到品牌 <code>{{ targetSlug }}</code> 的结构化记录，当前信息待核实。</p>
  </WatermarkedChartFrame>
</template>

<style scoped>
.bo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.7rem;
  margin-bottom: 1rem;
}

.bo-kpi {
  padding: 0.7rem 0.8rem;
  border-radius: 8px;
  background: rgba(19, 29, 49, 0.9);
  border: 1px solid #1e2d4a;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bo-k {
  font-size: 0.72rem;
  color: #94a3b8;
}

.bo-v {
  font-size: 0.94rem;
  font-weight: 600;
  color: #f8fafc;
}

.bo-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.bo-rows {
  display: grid;
  gap: 0.65rem;
}

.bo-row {
  display: grid;
  grid-template-columns: 92px 1fr;
  align-items: start;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid #1e2d4a;
}

.bo-row-k {
  font-size: 0.76rem;
  color: #94a3b8;
  padding-top: 0.12rem;
}

.bo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.bo-tag {
  padding: 0.14rem 0.5rem;
  border-radius: 5px;
  font-size: 0.74rem;
  background: #17253e;
  color: #cbd5e1;
  border: 1px solid #263b5e;
}

.bo-tag.is-route {
  background: rgba(14, 165, 233, 0.15);
  border-color: rgba(56, 189, 248, 0.35);
  color: #7dd3fc;
}

.bo-tag.is-proto {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(52, 211, 153, 0.32);
  color: #6ee7b7;
}

.bo-inline-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #cbd5e1;
}

.bo-meter-wrap {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.bo-meter-track {
  flex: 1;
  height: 7px;
  border-radius: 999px;
  background: #1e293b;
  overflow: hidden;
}

.bo-meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #0284c7, #34d399);
}

.bo-meter-label {
  font-size: 0.72rem;
  color: #7dd3fc;
}

.bo-conflict-box {
  margin-top: 0.9rem;
  padding: 0.7rem 0.85rem;
  border-radius: 8px;
  background: rgba(251, 113, 133, 0.1);
  border: 1px solid rgba(251, 113, 133, 0.35);
  font-size: 0.78rem;
  color: #fecdd3;
}

.bo-conflict-title {
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.bo-conflict-box ul {
  margin: 0;
  padding-left: 1.1rem;
  line-height: 1.55;
}

.bo-muted {
  font-size: 0.8rem;
  color: #94a3b8;
}

@media (max-width: 640px) {
  .bo-row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}
</style>
