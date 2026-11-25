<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BenchmarkBatchRecord, BrandRecord } from '../../../../data/types'
import benchmarksRaw from '../../../../data/benchmarks.json'
import availabilityRaw from '../../../../data/availability.json'
import brandsRaw from '../../../../data/brands.json'
import WatermarkedChartFrame from './WatermarkedChartFrame.vue'
import { formatMetricNumber, getStatusMeta, safeArray, unwrapList } from './observatory'

const allBatches = computed(() => unwrapList<BenchmarkBatchRecord>(benchmarksRaw))
const allBrands = computed(() => unwrapList<BrandRecord>(brandsRaw))
const availabilityItems = computed(() => unwrapList<Record<string, unknown>>(availabilityRaw))

const activeTab = ref<'speed' | 'unlock'>('speed')
const searchBrand = ref('')
const batchTypeFilter = ref('all')
const peakFilter = ref('all')
const protocolFilter = ref('all')

const protocolOptions = computed(() => {
  const set = new Set<string>()
  allBatches.value.forEach((b) => {
    if (b.protocolDisplayed) set.add(b.protocolDisplayed)
  })
  return Array.from(set).sort()
})

const filteredBatches = computed(() => {
  const q = searchBrand.value.trim().toLowerCase()
  return allBatches.value.filter((b) => {
    if (q) {
      const hay = `${b.brandName} ${b.brandSlug} ${b.toolName} ${b.protocolDisplayed}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (batchTypeFilter.value !== 'all' && b.batchType !== batchTypeFilter.value) return false
    if (protocolFilter.value !== 'all' && b.protocolDisplayed !== protocolFilter.value) return false
    if (peakFilter.value === 'peak' && b.isPeakHours !== true) return false
    if (peakFilter.value === 'non-peak' && b.isPeakHours !== false) return false
    return true
  })
})

const unlockRows = computed(() => {
  const q = searchBrand.value.trim().toLowerCase()
  // Build unified rows per brand combining availability.json & brands.json
  return allBrands.value
    .filter((b) => !q || b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q))
    .map((b) => {
      const av = availabilityItems.value.find((a) => (a.brandSlug || a.slug) === b.slug)
      const services = Array.isArray(av?.services)
        ? (av.services as Array<Record<string, unknown>>)
        : []
      const findSvc = (name: string) =>
        services.find((s) => String(s.service || '').toLowerCase() === name.toLowerCase())
      const chatgpt =
        b.aiSupportSummary?.ChatGPT?.status ||
        (findSvc('ChatGPT')?.statusLabel as string) ||
        (av?.chatgpt as string) ||
        '暂无独立实测'
      const claude =
        b.aiSupportSummary?.Claude?.status ||
        (findSvc('Claude')?.statusLabel as string) ||
        (av?.claude as string) ||
        '暂无独立实测'
      const netflix =
        b.streamingSummary?.Netflix?.status ||
        (findSvc('Netflix')?.statusLabel as string) ||
        (av?.netflix as string) ||
        '暂无独立实测'
      const youtube =
        b.streamingSummary?.YouTube?.status ||
        (findSvc('YouTube')?.statusLabel as string) ||
        (av?.youtube as string) ||
        '暂无独立实测'
      return {
        slug: b.slug,
        name: b.name,
        dataStatus: b.dataStatus,
        chatgpt,
        claude,
        netflix,
        youtube
      }
    })
})

function peakTag(isPeak: boolean | null | undefined): string {
  if (isPeak === true) return '晚高峰'
  if (isPeak === false) return '非晚高峰'
  return '时段未标'
}
</script>

<template>
  <section class="benchmark-explorer" aria-label="测速证据与可用性浏览器">
    <div class="be-toolbar">
      <div class="be-mode-tabs" role="tablist">
        <button
          type="button"
          class="be-mode-btn"
          :class="{ 'is-active': activeTab === 'speed' }"
          @click="activeTab = 'speed'"
        >
          测速批次与截图库 ({{ allBatches.length }})
        </button>
        <button
          type="button"
          class="be-mode-btn"
          :class="{ 'is-active': activeTab === 'unlock' }"
          @click="activeTab = 'unlock'"
        >
          AI 与流媒体解锁矩阵 ({{ unlockRows.length }})
        </button>
      </div>

      <div class="be-filters">
        <input
          v-model="searchBrand"
          type="search"
          placeholder="筛选品牌或协议..."
          class="be-input"
        />
        <template v-if="activeTab === 'speed'">
          <select v-model="batchTypeFilter" class="be-select">
            <option value="all">全部记录类型</option>
            <option value="screenshot-evidence">原始实测截图</option>
            <option value="text-historical-record">文本历史记录</option>
            <option value="unlock-evidence">解锁测试</option>
          </select>
          <select v-model="peakFilter" class="be-select">
            <option value="all">全部测试时段</option>
            <option value="peak">仅晚高峰</option>
            <option value="non-peak">仅非晚高峰</option>
          </select>
          <select v-model="protocolFilter" class="be-select">
            <option value="all">全部协议</option>
            <option v-for="p in protocolOptions" :key="p" :value="p">{{ p }}</option>
          </select>
        </template>
      </div>
    </div>

    <div v-if="activeTab === 'speed'" class="be-batch-list">
      <WatermarkedChartFrame
        v-for="batch in filteredBatches"
        :key="batch.id"
        :title="`${batch.brandName} · ${batch.testedAt}`"
        :subtitle="`${batch.batchType} · ${peakTag(batch.isPeakHours)} · ${batch.toolName}`"
        :brand-name="batch.brandName"
        :data-status="batch.dataStatus"
        :tested-at="batch.testedAt"
        :source-label="batch.backendEnv || batch.sourceId"
        :show-watermark="!batch.imagePath"
        compact
      >
        <div class="be-batch-grid">
          <div class="be-batch-info">
            <div class="be-kv">
              <span>协议</span>
              <code>{{ batch.protocolDisplayed || '待核实' }}</code>
            </div>
            <div class="be-kv">
              <span>时段性质</span>
              <strong>{{ peakTag(batch.isPeakHours) }}</strong>
            </div>
            <div v-if="safeArray(batch.metrics).length > 0" class="be-mini-metrics">
              <div v-for="(m, i) in batch.metrics" :key="i" class="be-mini-row">
                <span>{{ m.region }}</span>
                <span class="be-mono">
                  {{ formatMetricNumber(m.latencyMs, 'ms', 0) }} / {{ formatMetricNumber(m.downloadMbps, 'Mbps', 1) }}
                </span>
              </div>
            </div>
            <p v-if="safeArray(batch.notes).length > 0" class="be-note">
              {{ batch.notes.join('；') }}
            </p>
            <p v-if="safeArray(batch.limitations).length > 0" class="be-limit">
              局限：{{ batch.limitations.join('；') }}
            </p>
            <a :href="`/reviews/${batch.brandSlug}/`" class="be-link">查看 {{ batch.brandName }} 档案 →</a>
          </div>

          <div v-if="batch.imagePath" class="be-thumb-wrap">
            <a
              :href="batch.imagePath"
              target="_blank"
              rel="noopener"
              title="点击查看未修改的原始高清测速截图"
              class="be-thumb-link"
            >
              <img
                :src="batch.thumbnailPath || batch.imagePath"
                :alt="`${batch.brandName} ${batch.testedAt} 实测截图`"
                class="be-thumb"
                loading="lazy"
              />
              <span class="be-thumb-badge">点击图片查看原始 PNG/JPG 原图（SHA-256 未修改）</span>
            </a>
          </div>
        </div>
      </WatermarkedChartFrame>

      <div v-if="filteredBatches.length === 0" class="be-empty">
        当前筛选条件下无匹配的测速批次记录。
      </div>
    </div>

    <div v-else class="be-unlock-wrap">
      <table class="be-unlock-table">
        <thead>
          <tr>
            <th>品牌</th>
            <th>ChatGPT</th>
            <th>Claude</th>
            <th>Netflix</th>
            <th>YouTube</th>
            <th>依据状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in unlockRows" :key="row.slug">
            <td><a :href="`/reviews/${row.slug}/`">{{ row.name }}</a></td>
            <td>{{ row.chatgpt }}</td>
            <td>{{ row.claude }}</td>
            <td>{{ row.netflix }}</td>
            <td>{{ row.youtube }}</td>
            <td>
              <span
                class="be-status"
                :style="{
                  color: getStatusMeta(row.dataStatus).color,
                  backgroundColor: '#0b1220',
                  borderColor: getStatusMeta(row.dataStatus).border
                }"
              >
                {{ getStatusMeta(row.dataStatus).zhLabel }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.benchmark-explorer {
  margin: 1.25rem 0 2rem;
}

.be-toolbar {
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: #f4f7fb;
  border: 1px solid #dbe4f0;
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.be-mode-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.be-mode-btn {
  padding: 0.42rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
}

.be-mode-btn.is-active {
  background: #0f4c81;
  border-color: #0f4c81;
  color: #ffffff;
}

.be-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.6rem;
}

.be-input,
.be-select {
  padding: 0.46rem 0.68rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.84rem;
}

.be-batch-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1rem;
  align-items: start;
}

.be-batch-info {
  display: grid;
  gap: 0.45rem;
  font-size: 0.8rem;
}

.be-kv {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
}

.be-kv code,
.be-kv strong {
  color: #f8fafc;
}

.be-mini-metrics {
  display: grid;
  gap: 0.3rem;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  background: rgba(19, 29, 49, 0.85);
  border: 1px solid #1e2d4a;
}

.be-mini-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.76rem;
  color: #cbd5e1;
}

.be-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #34d399;
}

.be-note {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.5;
}

.be-limit {
  margin: 0;
  color: #fcd34d;
  line-height: 1.45;
  font-size: 0.75rem;
}

.be-link {
  color: #38bdf8;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.8rem;
}

.be-link:hover {
  text-decoration: underline;
}

.be-thumb-wrap {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #1e2d4a;
  background: #070d18;
}

.be-thumb-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.be-thumb {
  display: block;
  width: 100%;
  height: auto;
}

.be-thumb-badge {
  display: block;
  padding: 0.35rem 0.6rem;
  border-top: 1px solid #1e2d4a;
  background: rgba(15, 23, 42, 0.9);
  font-size: 0.72rem;
  color: #7dd3fc;
  line-height: 1.4;
}

.be-thumb-link:hover .be-thumb-badge {
  color: #bae6fd;
}

.be-unlock-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #dbe4f0;
  background: #ffffff;
}

.be-unlock-table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.be-unlock-table th,
.be-unlock-table td {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.be-unlock-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
}

.be-unlock-table a {
  color: #0f4c81;
  font-weight: 600;
  text-decoration: none;
}

.be-status {
  display: inline-block;
  padding: 0.08rem 0.42rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.be-empty {
  padding: 1.5rem;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  text-align: center;
}

@media (max-width: 768px) {
  .be-batch-grid {
    grid-template-columns: 1fr;
  }
}

:global(.dark .be-toolbar){
  background: #0b1220;
  border-color: #1e2d4a;
}

:global(.dark .be-mode-btn){
  background: #131d31;
  border-color: #334155;
  color: #cbd5e1;
}

:global(.dark .be-mode-btn.is-active){
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
}

:global(.dark .be-input),
:global(.dark .be-select){
  background: #131d31;
  border-color: #334155;
  color: #f1f5f9;
}

:global(.dark .be-unlock-wrap){
  background: #131d31;
  border-color: #1e2d4a;
}

:global(.dark .be-unlock-table th),
:global(.dark .be-unlock-table td){
  border-bottom-color: #1e2d4a;
  color: #e2e8f0;
}

:global(.dark .be-unlock-table th){
  background: #0b1220;
  color: #cbd5e1;
}

:global(.dark .be-unlock-table a){
  color: #38bdf8;
}

:global(.dark .be-empty){
  background: #131d31;
  border-color: #334155;
  color: #94a3b8;
}
</style>
