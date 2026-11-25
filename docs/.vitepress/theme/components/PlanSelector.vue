<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BrandRecord, PlanItem } from '../../../../data/types'
import brandsRaw from '../../../../data/brands.json'
import plansRaw from '../../../../data/plans.json'
import AffiliateButton from './AffiliateButton.vue'
import AffiliateDisclosure from './AffiliateDisclosure.vue'
import {
  filterPlansByBrand,
  findBrand,
  formatCostPerGb,
  formatPriceCny,
  getStatusMeta,
  trackCommercialEvent,
  unwrapList
} from './observatory'

const props = withDefaults(
  defineProps<{
    slug?: string
    brandSlug?: string
    showBillingFilter?: boolean
    showDisclosure?: boolean
  }>(),
  {
    slug: '',
    brandSlug: '',
    showBillingFilter: true,
    showDisclosure: true
  }
)

const targetSlug = computed(() => (props.brandSlug || props.slug || '').trim())
const brand = computed(() => findBrand(unwrapList<BrandRecord>(brandsRaw), targetSlug.value))
const rawPlans = computed(() => filterPlansByBrand(unwrapList<PlanItem>(plansRaw), targetSlug.value))

type CycleFilter = 'all' | 'monthly' | 'longterm' | 'one-time'
const selectedCycle = ref<CycleFilter>('all')

const filteredPlans = computed(() => {
  if (selectedCycle.value === 'all') return rawPlans.value
  if (selectedCycle.value === 'monthly') {
    return rawPlans.value.filter((p) => p.billingCycle === 'monthly' || p.billingCycle === 'quarterly')
  }
  if (selectedCycle.value === 'longterm') {
    return rawPlans.value.filter((p) =>
      ['semiannual', 'annual', 'biennial', 'triennial'].includes(p.billingCycle)
    )
  }
  return rawPlans.value.filter((p) => p.billingCycle === 'one-time')
})

function selectCycle(cycle: CycleFilter) {
  selectedCycle.value = cycle
  trackCommercialEvent('plan_select', {
    brand_slug: targetSlug.value,
    cycle
  })
}
</script>

<template>
  <section class="plan-selector" aria-label="套餐价格与计费周期选择">
    <div class="ps-header">
      <div>
        <h3 class="ps-title">{{ brand ? `${brand.name} 套餐与价格方案` : '套餐与价格方案' }}</h3>
        <p class="ps-sub">
          严格区分实际周期支付金额与年付折算月均成本；未明确披露的指标统一标记为“待核实”。
        </p>
      </div>

      <div v-if="showBillingFilter && rawPlans.length > 0" class="ps-tabs" role="tablist" aria-label="计费周期筛选">
        <button
          type="button"
          class="ps-tab"
          :class="{ 'is-active': selectedCycle === 'all' }"
          @click="selectCycle('all')"
        >
          全部 ({{ rawPlans.length }})
        </button>
        <button
          type="button"
          class="ps-tab"
          :class="{ 'is-active': selectedCycle === 'monthly' }"
          @click="selectCycle('monthly')"
        >
          月/季付
        </button>
        <button
          type="button"
          class="ps-tab"
          :class="{ 'is-active': selectedCycle === 'longterm' }"
          @click="selectCycle('longterm')"
        >
          半年/年付
        </button>
        <button
          type="button"
          class="ps-tab"
          :class="{ 'is-active': selectedCycle === 'one-time' }"
          @click="selectCycle('one-time')"
        >
          不限时/一次性
        </button>
      </div>
    </div>

    <div v-if="filteredPlans.length > 0" class="ps-grid">
      <article v-for="plan in filteredPlans" :key="plan.id" class="ps-card">
        <div class="ps-card-head">
          <div>
            <span class="ps-cycle-tag">{{ plan.billingCycleLabel || plan.billingCycle }}</span>
            <h4 class="ps-plan-name">{{ plan.name }}</h4>
          </div>
          <span
            class="ps-status-pill"
            :style="{
              color: getStatusMeta(plan.dataStatus).color,
              backgroundColor: '#0b1220',
              borderColor: getStatusMeta(plan.dataStatus).border
            }"
          >
            {{ getStatusMeta(plan.dataStatus).zhLabel }}
          </span>
        </div>

        <div class="ps-price-row">
          <span class="ps-price">{{ formatPriceCny(plan.priceCny) }}</span>
          <span class="ps-price-cycle">/ {{ plan.billingCycleLabel || '周期' }}</span>
        </div>

        <dl class="ps-meta-list">
          <div class="ps-meta-row">
            <dt>折合月均</dt>
            <dd class="ps-mono">
              {{ plan.effectiveMonthlyCny != null ? `${formatPriceCny(plan.effectiveMonthlyCny)}/月` : (plan.billingCycle === 'one-time' ? '不限时买断' : '待核实') }}
            </dd>
          </div>
          <div class="ps-meta-row">
            <dt>流量配额</dt>
            <dd class="ps-mono">{{ plan.trafficLabel || '待核实' }}</dd>
          </div>
          <div class="ps-meta-row">
            <dt>单 GB 成本</dt>
            <dd class="ps-mono">{{ formatCostPerGb(plan.costPerGb) }}</dd>
          </div>
          <div v-if="plan.deviceLimit" class="ps-meta-row">
            <dt>设备限制</dt>
            <dd>{{ plan.deviceLimit }}</dd>
          </div>
        </dl>

        <p v-if="plan.lineNote" class="ps-note">线路说明：{{ plan.lineNote }}</p>
        <p v-if="plan.discountNote" class="ps-discount">优惠规则：{{ plan.discountNote }}</p>

        <div class="ps-card-cta">
          <AffiliateButton
            :brand-slug="targetSlug"
            :brand-name="brand?.name"
            :label="`选择 ${plan.name}`"
            size="sm"
            :show-disclosure="false"
            source-section="plan_selector"
          />
        </div>
      </article>
    </div>

    <div v-else class="ps-empty">
      当前筛选条件下暂无已收录的套餐明细（待核实），可切换周期或直接前往品牌官方核实最新方案。
    </div>

    <AffiliateDisclosure v-if="showDisclosure" variant="inline" />
  </section>
</template>

<style scoped>
.plan-selector {
  margin: 1.5rem 0;
  padding: 1.15rem;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
}

.ps-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.ps-title {
  margin: 0 !important;
  font-size: 1.12rem;
  font-weight: 700;
  color: #0f172a;
}

.ps-sub {
  margin: 0.25rem 0 0;
  font-size: 0.82rem;
  color: #64748b;
}

.ps-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.ps-tab {
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.ps-tab.is-active {
  background: #0f4c81;
  border-color: #0f4c81;
  color: #ffffff;
}

.ps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 0.9rem;
}

.ps-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.ps-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.ps-cycle-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #0284c7;
}

.ps-plan-name {
  margin: 0.1rem 0 0 !important;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.ps-status-pill {
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}

.ps-price-row {
  margin: 0.7rem 0;
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}

.ps-price {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.45rem;
  font-weight: 700;
  color: #0f4c81;
}

.ps-price-cycle {
  font-size: 0.8rem;
  color: #64748b;
}

.ps-meta-list {
  margin: 0;
  padding: 0.6rem 0;
  border-top: 1px dashed #cbd5e1;
  border-bottom: 1px dashed #cbd5e1;
  display: grid;
  gap: 0.35rem;
}

.ps-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
}

.ps-meta-row dt {
  color: #64748b;
}

.ps-meta-row dd {
  margin: 0;
  font-weight: 600;
  color: #1e293b;
}

.ps-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.ps-note,
.ps-discount {
  margin: 0.5rem 0 0;
  font-size: 0.77rem;
  color: #475569;
  line-height: 1.45;
}

.ps-discount {
  color: #b45309;
}

.ps-card-cta {
  margin-top: auto;
  padding-top: 0.85rem;
}

.ps-empty {
  padding: 1.1rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  font-size: 0.86rem;
  text-align: center;
}

:global(.dark .plan-selector){
  background: #131d31;
  border-color: #1e2d4a;
}

:global(.dark .ps-title),
:global(.dark .ps-plan-name){
  color: #f1f5f9;
}

:global(.dark .ps-sub),
:global(.dark .ps-price-cycle),
:global(.dark .ps-meta-row dt){
  color: #94a3b8;
}

:global(.dark .ps-tab){
  background: #0b1220;
  border-color: #334155;
  color: #cbd5e1;
}

:global(.dark .ps-tab.is-active){
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
}

:global(.dark .ps-card){
  background: #0b1220;
  border-color: #1e2d4a;
}

:global(.dark .ps-cycle-tag),
:global(.dark .ps-price){
  color: #38bdf8;
}

:global(.dark .ps-meta-list){
  border-top-color: #1e2d4a;
  border-bottom-color: #1e2d4a;
}

:global(.dark .ps-meta-row dd){
  color: #f1f5f9;
}

:global(.dark .ps-note){
  color: #cbd5e1;
}

:global(.dark .ps-discount){
  color: #fbbf24;
}

:global(.dark .ps-empty){
  background: #0b1220;
  border-color: #334155;
  color: #94a3b8;
}
</style>
