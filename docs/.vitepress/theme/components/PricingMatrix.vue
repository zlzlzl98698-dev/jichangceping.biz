<script setup lang="ts">
import { computed } from 'vue'
import type { BrandRecord, PlanItem } from '../../../../data/types'
import plansRaw from '../../../../data/plans.json'
import brandsRaw from '../../../../data/brands.json'
import WatermarkedChartFrame from './WatermarkedChartFrame.vue'
import {
  filterPlansByBrand,
  findBrand,
  formatCostPerGb,
  formatPriceCny,
  getStatusMeta,
  unwrapList
} from './observatory'

const props = withDefaults(
  defineProps<{
    slug?: string
    brandSlug?: string
    compareSlugs?: string[]
  }>(),
  {
    slug: '',
    brandSlug: '',
    compareSlugs: undefined
  }
)

const targetSlug = computed(() => (props.brandSlug || props.slug || '').trim())
const allBrands = computed(() => unwrapList<BrandRecord>(brandsRaw))
const allPlans = computed(() => unwrapList<PlanItem>(plansRaw))
const brand = computed(() => findBrand(allBrands.value, targetSlug.value))

const displayPlans = computed(() => {
  if (props.compareSlugs && props.compareSlugs.length > 0) {
    const set = new Set(props.compareSlugs)
    return allPlans.value.filter((p) => set.has(p.brandSlug))
  }
  if (targetSlug.value) {
    return filterPlansByBrand(allPlans.value, targetSlug.value)
  }
  return allPlans.value.filter((p) => p.isPrimaryDisplay).slice(0, 12)
})

const maxCostPerGb = computed(() => {
  const vals = displayPlans.value
    .map((p) => p.costPerGb)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0)
  return vals.length > 0 ? Math.max(...vals) : 1
})

function brandNameFor(slug: string): string {
  return findBrand(allBrands.value, slug)?.name || slug
}
</script>

<template>
  <WatermarkedChartFrame
    :title="brand ? `${brand.name} 套餐成本与单 GB 效率矩阵` : '套餐价格与流量成本对比矩阵'"
    subtitle="Pricing & Cost-per-GB Telemetry（区分实付总额与折算月均，不将年付均价冒充月付价）"
    :brand-name="brand?.name"
    :accent-color="brand?.accentColor"
    :data-status="brand?.dataStatus || 'Vendor Data'"
    :tested-at="brand?.verifiedDate || brand?.updatedDate"
    source-label="plans.json"
  >
    <div v-if="displayPlans.length > 0" class="pm-table-wrap">
      <table class="pm-table">
        <thead>
          <tr>
            <th v-if="!targetSlug">品牌</th>
            <th>套餐名称</th>
            <th>周期</th>
            <th>实付价格</th>
            <th>折合月均</th>
            <th>流量配额</th>
            <th>单 GB 成本</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in displayPlans" :key="plan.id">
            <td v-if="!targetSlug" class="pm-brand-cell">{{ brandNameFor(plan.brandSlug) }}</td>
            <td class="pm-plan-cell">
              <strong>{{ plan.name }}</strong>
              <span v-if="plan.deviceLimit" class="pm-sub">{{ plan.deviceLimit }}</span>
            </td>
            <td>{{ plan.billingCycleLabel || plan.billingCycle }}</td>
            <td class="pm-mono pm-price">{{ formatPriceCny(plan.priceCny) }}</td>
            <td class="pm-mono">
              {{ plan.effectiveMonthlyCny != null ? `${formatPriceCny(plan.effectiveMonthlyCny)}/月` : '—' }}
            </td>
            <td class="pm-mono">{{ plan.trafficLabel || '待核实' }}</td>
            <td>
              <div class="pm-gb-cell">
                <span class="pm-mono">{{ formatCostPerGb(plan.costPerGb) }}</span>
                <div v-if="plan.costPerGb != null" class="pm-gb-bar" aria-hidden="true">
                  <div
                    class="pm-gb-fill"
                    :style="{ width: `${Math.min(100, Math.max(8, (plan.costPerGb / maxCostPerGb) * 100))}%` }"
                  />
                </div>
              </div>
            </td>
            <td>
              <span
                class="pm-status"
                :style="{
                  color: getStatusMeta(plan.dataStatus).color,
                  borderColor: getStatusMeta(plan.dataStatus).border
                }"
              >
                {{ getStatusMeta(plan.dataStatus).zhLabel }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="pm-empty">
      暂无结构化套餐定价明细（待核实）。
    </div>
  </WatermarkedChartFrame>
</template>

<style scoped>
.pm-table-wrap {
  overflow-x: auto;
}

.pm-table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  font-size: 0.8rem;
  color: #e2e8f0;
}

.pm-table th,
.pm-table td {
  padding: 0.55rem 0.65rem;
  border-bottom: 1px solid #1e2d4a;
  text-align: left;
  vertical-align: middle;
}

.pm-table th {
  font-size: 0.74rem;
  color: #94a3b8;
  background: #131d31;
  font-weight: 600;
}

.pm-brand-cell {
  font-weight: 600;
  color: #7dd3fc;
}

.pm-plan-cell {
  display: flex;
  flex-direction: column;
}

.pm-sub {
  font-size: 0.7rem;
  color: #94a3b8;
}

.pm-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.pm-price {
  color: #34d399;
  font-weight: 700;
}

.pm-gb-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pm-gb-bar {
  width: 72px;
  height: 4px;
  border-radius: 999px;
  background: #1e293b;
  overflow: hidden;
}

.pm-gb-fill {
  height: 100%;
  background: #38bdf8;
}

.pm-status {
  display: inline-block;
  padding: 0.1rem 0.42rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.68rem;
  white-space: nowrap;
}

.pm-empty {
  font-size: 0.84rem;
  color: #94a3b8;
}
</style>
