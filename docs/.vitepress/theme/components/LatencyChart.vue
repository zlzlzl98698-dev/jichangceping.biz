<script setup lang="ts">
import { computed } from 'vue'
import type { BenchmarkBatchRecord, BrandRecord } from '../../../../data/types'
import benchmarksRaw from '../../../../data/benchmarks.json'
import brandsRaw from '../../../../data/brands.json'
import WatermarkedChartFrame from './WatermarkedChartFrame.vue'
import {
  filterBenchmarksByBrand,
  findBrand,
  formatMetricNumber,
  safeArray,
  unwrapList
} from './observatory'

const props = withDefaults(
  defineProps<{
    slug?: string
    brandSlug?: string
    batchId?: string
  }>(),
  {
    slug: '',
    brandSlug: '',
    batchId: ''
  }
)

const targetSlug = computed(() => (props.brandSlug || props.slug || '').trim())
const brand = computed(() => findBrand(unwrapList<BrandRecord>(brandsRaw), targetSlug.value))

const activeBatch = computed(() => {
  const list = filterBenchmarksByBrand(unwrapList<BenchmarkBatchRecord>(benchmarksRaw), targetSlug.value)
  if (props.batchId) {
    const hit = list.find((b) => b.id === props.batchId)
    if (hit) return hit
  }
  return list.find((b) => safeArray(b.metrics).some((m) => m.latencyMs !== null && m.latencyMs !== undefined)) || list[0]
})

const rows = computed(() => safeArray(activeBatch.value?.metrics))

const maxLatency = computed(() => {
  const nums = rows.value
    .map((r) => r.latencyMs)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0)
  return nums.length > 0 ? Math.max(...nums, 100) : 200
})

function barColor(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return '#475569'
  if (ms <= 80) return '#34d399'
  if (ms <= 160) return '#38bdf8'
  return '#fbbf24'
}

const svgHeight = computed(() => Math.max(120, rows.value.length * 36 + 34))
</script>

<template>
  <WatermarkedChartFrame
    title="区域节点延迟分布图 (Latency Telemetry)"
    :subtitle="activeBatch ? `${activeBatch.protocolDisplayed || '未知协议'} · 单位 ms（越低越好）` : '暂无节点延迟样本'"
    :brand-name="brand?.name || activeBatch?.brandName"
    :accent-color="brand?.accentColor"
    :data-status="activeBatch?.dataStatus || 'Not Tested'"
    :tested-at="activeBatch?.testedAt"
    :source-label="activeBatch?.sourceId"
  >
    <div v-if="rows.length > 0" class="lc-wrap">
      <svg
        class="lc-svg"
        :viewBox="`0 0 640 ${svgHeight}`"
        role="img"
        :aria-label="`${brand?.name || ''} 节点延迟柱状图`"
      >
        <g v-for="(row, idx) in rows" :key="`${row.region}-${idx}`" :transform="`translate(0, ${idx * 36 + 14})`">
          <text x="4" y="16" fill="#cbd5e1" font-size="12.5" font-weight="600">
            {{ row.region }}
          </text>
          <rect x="130" y="5" width="390" height="14" rx="4" fill="#131d31" stroke="#1e2d4a" />
          <rect
            v-if="row.latencyMs !== null && row.latencyMs !== undefined"
            x="130"
            y="5"
            :width="Math.max(10, (row.latencyMs / maxLatency) * 390)"
            height="14"
            rx="4"
            :fill="barColor(row.latencyMs)"
          />
          <text
            x="534"
            y="16"
            :fill="row.latencyMs != null ? '#f8fafc' : '#94a3b8'"
            font-size="12"
            font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            {{ formatMetricNumber(row.latencyMs, ' ms', 0) }}
          </text>
        </g>
      </svg>

      <table class="lc-sr-table">
        <thead>
          <tr>
            <th>区域/节点</th>
            <th>延迟</th>
            <th>丢包率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in rows" :key="`tbl-${idx}`">
            <td>{{ row.region }}</td>
            <td class="lc-mono">{{ formatMetricNumber(row.latencyMs, ' ms', 0) }}</td>
            <td class="lc-mono">{{ row.lossRate || '待核实' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="lc-empty">
      暂无区域延迟结构化样本（待核实）。
    </div>
  </WatermarkedChartFrame>
</template>

<style scoped>
.lc-wrap {
  display: grid;
  gap: 0.85rem;
}

.lc-svg {
  width: 100%;
  height: auto;
  display: block;
}

.lc-sr-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  color: #cbd5e1;
}

.lc-sr-table th,
.lc-sr-table td {
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid #1e2d4a;
  text-align: left;
}

.lc-sr-table th {
  color: #94a3b8;
  font-weight: 600;
  background: rgba(19, 29, 49, 0.75);
}

.lc-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.lc-empty {
  font-size: 0.84rem;
  color: #94a3b8;
  padding: 0.4rem 0;
}
</style>
