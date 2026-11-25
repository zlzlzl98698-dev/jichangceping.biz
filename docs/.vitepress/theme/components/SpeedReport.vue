<script setup lang="ts">
import { computed, ref } from 'vue'
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
const batches = computed(() => filterBenchmarksByBrand(unwrapList<BenchmarkBatchRecord>(benchmarksRaw), targetSlug.value))

const selectedIdx = ref(0)

const activeBatch = computed<BenchmarkBatchRecord | undefined>(() => {
  if (batches.value.length === 0) return undefined
  if (props.batchId) {
    const matched = batches.value.find((b) => b.id === props.batchId)
    if (matched) return matched
  }
  return batches.value[selectedIdx.value] || batches.value[0]
})

const maxDownload = computed(() => {
  if (!activeBatch.value) return 100
  const vals = safeArray(activeBatch.value.metrics)
    .map((m) => m.downloadMbps)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0)
  return vals.length > 0 ? Math.max(...vals) : 100
})

function peakLabel(val: boolean | null | undefined): string {
  if (val === true) return '晚高峰时段'
  if (val === false) return '非晚高峰时段'
  return '测试时段未标注'
}

function batchTypeLabel(type?: string): string {
  if (type === 'screenshot-evidence') return '实测截图批次'
  if (type === 'text-historical-record') return '文本历史测速记录'
  if (type === 'unlock-evidence') return '流媒体/AI 解锁测试'
  return '测试记录'
}
</script>

<template>
  <WatermarkedChartFrame
    v-if="activeBatch"
    :title="`${brand?.name || activeBatch.brandName} 节点测速性能报告`"
    :subtitle="`${batchTypeLabel(activeBatch.batchType)} · ${peakLabel(activeBatch.isPeakHours)} · ${activeBatch.toolName || '测速工具待核实'}`"
    :brand-name="brand?.name || activeBatch.brandName"
    :accent-color="brand?.accentColor"
    :data-status="activeBatch.dataStatus"
    :tested-at="activeBatch.testedAt"
    :source-label="activeBatch.backendEnv || activeBatch.sourceId"
    :show-watermark="true"
  >
    <div v-if="batches.length > 1" class="sr-batch-tabs" role="tablist" aria-label="切换测速批次">
      <button
        v-for="(batch, i) in batches"
        :key="batch.id"
        type="button"
        class="sr-batch-btn"
        :class="{ 'is-active': activeBatch.id === batch.id }"
        @click="selectedIdx = i"
      >
        <span>{{ batch.testedAt.slice(0, 10) }}</span>
        <span class="sr-batch-proto">{{ batch.protocolDisplayed || '未知协议' }}</span>
      </button>
    </div>

    <div class="sr-env-bar">
      <span>工具：<code>{{ activeBatch.toolName || '待核实' }}</code></span>
      <span>协议：<code>{{ activeBatch.protocolDisplayed || '待核实' }}</code></span>
      <span>后端：<code>{{ activeBatch.backendEnv || '待核实' }}</code></span>
      <span>时段：<strong>{{ peakLabel(activeBatch.isPeakHours) }}</strong></span>
    </div>

    <div v-if="safeArray(activeBatch.metrics).length > 0" class="sr-metrics">
      <div v-for="(row, idx) in activeBatch.metrics" :key="`${row.region}-${idx}`" class="sr-metric-row">
        <div class="sr-row-top">
          <span class="sr-region">{{ row.region }}</span>
          <div class="sr-nums">
            <span class="sr-num">
              延迟 <strong>{{ formatMetricNumber(row.latencyMs, ' ms', 0) }}</strong>
            </span>
            <span class="sr-num is-dl">
              下行 <strong>{{ formatMetricNumber(row.downloadMbps, ' Mbps', 1) }}</strong>
            </span>
            <span v-if="row.uploadMbps !== undefined" class="sr-num">
              上行 <strong>{{ formatMetricNumber(row.uploadMbps, ' Mbps', 1) }}</strong>
            </span>
            <span v-if="row.lossRate" class="sr-num">
              丢包 <strong>{{ row.lossRate }}</strong>
            </span>
          </div>
        </div>
        <div class="sr-bar-track" aria-hidden="true">
          <div
            v-if="row.downloadMbps !== null && row.downloadMbps !== undefined"
            class="sr-bar-fill"
            :style="{ width: `${Math.min(100, Math.max(4, (row.downloadMbps / maxDownload) * 100))}%` }"
          />
          <div v-else class="sr-bar-pending" />
        </div>
      </div>
    </div>

    <div v-else class="sr-no-rows">
      该批次主要以原始截图留证保存，暂无结构化单地区数值提取（请查看下方原始截图档案，不编造数值）。
    </div>

    <div v-if="safeArray(activeBatch.notes).length > 0 || safeArray(activeBatch.limitations).length > 0" class="sr-footnotes">
      <div v-if="safeArray(activeBatch.notes).length > 0" class="sr-fn-block">
        <span class="sr-fn-k">测试备注：</span>
        <span>{{ activeBatch.notes.join('；') }}</span>
      </div>
      <div v-if="safeArray(activeBatch.limitations).length > 0" class="sr-fn-block is-warn">
        <span class="sr-fn-k">范围与局限：</span>
        <span>{{ activeBatch.limitations.join('；') }}</span>
      </div>
    </div>
  </WatermarkedChartFrame>

  <figure v-if="activeBatch && activeBatch.imagePath" class="sr-shot-box">
    <figcaption class="sr-shot-label">
      原始实测截图留证（保留原始像素，未叠加本站水印或修改数值）
    </figcaption>
    <img
      :src="activeBatch.imagePath"
      :alt="`${brand?.name || activeBatch.brandName} ${activeBatch.testedAt} 测速实测截图`"
      class="sr-shot-img"
      loading="lazy"
    />
  </figure>

  <WatermarkedChartFrame
    v-else
    :title="`${brand?.name || targetSlug || '该品牌'} 节点测速报告`"
    subtitle="Performance Monitoring Report"
    :brand-name="brand?.name"
    :accent-color="brand?.accentColor"
    data-status="Not Tested"
  >
    <div class="sr-empty">
      <strong>暂无独立实测数据</strong>
      <p>
        当前资料库尚未收录该品牌的独立测速截图或结构化吞吐样本。本站不生成虚构测速结果；如需核实，建议先查看品牌线路说明或以短期小额套餐实际测试为准。
      </p>
    </div>
  </WatermarkedChartFrame>
</template>

<style scoped>
.sr-batch-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.85rem;
}

.sr-batch-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  border: 1px solid #263b5e;
  background: #131d31;
  color: #cbd5e1;
  font-size: 0.76rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  cursor: pointer;
}

.sr-batch-btn.is-active {
  background: rgba(2, 132, 199, 0.24);
  border-color: #38bdf8;
  color: #f8fafc;
}

.sr-batch-proto {
  color: #7dd3fc;
}

.sr-env-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.1rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: #131d31;
  border: 1px solid #1e2d4a;
  font-size: 0.77rem;
  color: #94a3b8;
  margin-bottom: 0.9rem;
}

.sr-env-bar code {
  color: #e2e8f0;
  background: transparent;
  padding: 0;
}

.sr-env-bar strong {
  color: #fbbf24;
}

.sr-metrics {
  display: grid;
  gap: 0.75rem;
}

.sr-metric-row {
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: rgba(19, 29, 49, 0.82);
  border: 1px solid #1e2d4a;
}

.sr-row-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem 0.75rem;
  margin-bottom: 0.45rem;
}

.sr-region {
  font-weight: 600;
  color: #f8fafc;
  font-size: 0.88rem;
}

.sr-nums {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.9rem;
  font-size: 0.78rem;
  color: #94a3b8;
}

.sr-num strong {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #e2e8f0;
}

.sr-num.is-dl strong {
  color: #34d399;
}

.sr-bar-track {
  height: 7px;
  border-radius: 999px;
  background: #0f172a;
  overflow: hidden;
}

.sr-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #0284c7, #34d399);
}

.sr-bar-pending {
  height: 100%;
  width: 100%;
  background: repeating-linear-gradient(
    45deg,
    rgba(148, 163, 184, 0.14),
    rgba(148, 163, 184, 0.14) 6px,
    transparent 6px,
    transparent 12px
  );
}

.sr-no-rows {
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(19, 29, 49, 0.7);
  border: 1px dashed #334155;
  color: #cbd5e1;
  font-size: 0.82rem;
}

.sr-shot-box {
  margin: -0.75rem 0 1.5rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: #070d18;
  border: 1px solid #1e2d4a;
}

.sr-shot-label {
  font-size: 0.74rem;
  color: #94a3b8;
  margin-bottom: 0.55rem;
}

.sr-shot-img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

.sr-footnotes {
  margin-top: 0.9rem;
  display: grid;
  gap: 0.4rem;
  font-size: 0.77rem;
  color: #94a3b8;
  line-height: 1.5;
}

.sr-fn-block.is-warn {
  color: #fcd34d;
}

.sr-fn-k {
  font-weight: 600;
}

.sr-empty {
  padding: 0.65rem 0.4rem;
  color: #cbd5e1;
  font-size: 0.86rem;
}

.sr-empty strong {
  display: block;
  color: #f8fafc;
  margin-bottom: 0.35rem;
}

.sr-empty p {
  margin: 0;
  color: #94a3b8;
  line-height: 1.55;
}
</style>
