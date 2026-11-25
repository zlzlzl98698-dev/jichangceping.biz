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
  return list.find((b) => safeArray(b.metrics).some((m) => m.downloadMbps !== null && m.downloadMbps !== undefined)) || list[0]
})

const rows = computed(() => safeArray(activeBatch.value?.metrics))

const maxThroughput = computed(() => {
  const nums = rows.value
    .flatMap((r) => [r.downloadMbps, r.uploadMbps])
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0)
  return nums.length > 0 ? Math.max(...nums, 100) : 500
})

const svgHeight = computed(() => Math.max(120, rows.value.length * 42 + 30))
</script>

<template>
  <WatermarkedChartFrame
    title="带宽吞吐对比图 (Throughput Telemetry)"
    :subtitle="activeBatch ? `${activeBatch.protocolDisplayed || '未知协议'} · 单位 Mbps（数值仅代表当次测试条件）` : '暂无吞吐量实测数据'"
    :brand-name="brand?.name || activeBatch?.brandName"
    :accent-color="brand?.accentColor"
    :data-status="activeBatch?.dataStatus || 'Not Tested'"
    :tested-at="activeBatch?.testedAt"
    :source-label="activeBatch?.backendEnv || activeBatch?.sourceId"
  >
    <div v-if="rows.length > 0" class="tc-wrap">
      <div class="tc-legend">
        <span><i class="tc-dot is-dl" /> 下行速度 (Download Mbps)</span>
        <span><i class="tc-dot is-ul" /> 上行速度 (Upload Mbps，若有记录)</span>
      </div>

      <svg
        class="tc-svg"
        :viewBox="`0 0 640 ${svgHeight}`"
        role="img"
        :aria-label="`${brand?.name || ''} 带宽吞吐图`"
      >
        <g v-for="(row, idx) in rows" :key="`${row.region}-${idx}`" :transform="`translate(0, ${idx * 42 + 12})`">
          <text x="4" y="18" fill="#e2e8f0" font-size="12.5" font-weight="600">
            {{ row.region }}
          </text>
          <rect x="130" y="4" width="380" height="12" rx="3" fill="#131d31" stroke="#1e2d4a" />
          <rect
            v-if="row.downloadMbps !== null && row.downloadMbps !== undefined"
            x="130"
            y="4"
            :width="Math.max(8, (row.downloadMbps / maxThroughput) * 380)"
            height="12"
            rx="3"
            fill="#0ea5e9"
          />
          <rect x="130" y="19" width="380" height="8" rx="3" fill="#0f172a" />
          <rect
            v-if="row.uploadMbps !== null && row.uploadMbps !== undefined"
            x="130"
            y="19"
            :width="Math.max(6, (row.uploadMbps / maxThroughput) * 380)"
            height="8"
            rx="3"
            fill="#34d399"
          />
          <text
            x="522"
            y="17"
            :fill="row.downloadMbps != null ? '#7dd3fc' : '#94a3b8'"
            font-size="12"
            font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            {{ formatMetricNumber(row.downloadMbps, ' Mbps', 1) }}
          </text>
        </g>
      </svg>

      <table class="tc-table">
        <thead>
          <tr>
            <th>区域/节点</th>
            <th>下行速度</th>
            <th>上行速度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in rows" :key="`t-${idx}`">
            <td>{{ row.region }}</td>
            <td class="tc-mono">{{ formatMetricNumber(row.downloadMbps, ' Mbps', 1) }}</td>
            <td class="tc-mono">{{ formatMetricNumber(row.uploadMbps, ' Mbps', 1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="tc-empty">
      暂无结构化带宽吞吐数据（待核实）。
    </div>
  </WatermarkedChartFrame>
</template>

<style scoped>
.tc-wrap {
  display: grid;
  gap: 0.75rem;
}

.tc-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.tc-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  margin-right: 0.3rem;
}

.tc-dot.is-dl {
  background: #0ea5e9;
}

.tc-dot.is-ul {
  background: #34d399;
}

.tc-svg {
  width: 100%;
  height: auto;
  display: block;
}

.tc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  color: #cbd5e1;
}

.tc-table th,
.tc-table td {
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid #1e2d4a;
  text-align: left;
}

.tc-table th {
  color: #94a3b8;
  background: rgba(19, 29, 49, 0.75);
}

.tc-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.tc-empty {
  font-size: 0.84rem;
  color: #94a3b8;
}
</style>
