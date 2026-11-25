<script setup lang="ts">
import { computed } from 'vue'
import type { BenchmarkBatchRecord, BrandRecord } from '../../../../data/types'
import historyRaw from '../../../../data/brand-history.json'
import risksRaw from '../../../../data/risk-records.json'
import brandsRaw from '../../../../data/brands.json'
import benchmarksRaw from '../../../../data/benchmarks.json'
import WatermarkedChartFrame from './WatermarkedChartFrame.vue'
import {
  filterBenchmarksByBrand,
  findBrand,
  getStatusMeta,
  unwrapList
} from './observatory'

interface TimelineEvent {
  date: string
  title: string
  detail: string
  category: string
  dataStatus: string
  source?: string
}

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

const timeline = computed<TimelineEvent[]>(() => {
  const events: TimelineEvent[] = []
  const slug = targetSlug.value

  // 1. From brand-history.json
  const rawHist = unwrapList<Record<string, unknown>>(historyRaw)
  rawHist.forEach((item) => {
    const itemSlug = (item.brandSlug || item.slug || '') as string
    if (slug && itemSlug && itemSlug !== slug) return
    const list = Array.isArray(item.timeline)
      ? (item.timeline as Array<Record<string, unknown>>)
      : Array.isArray(item.events)
        ? (item.events as Array<Record<string, unknown>>)
        : null
    if (list && itemSlug === slug) {
      list.forEach((ev) => {
        events.push({
          date: String(ev.date || ev.recordedAt || '日期未知'),
          title: String(ev.title || ev.event || ev.summary || '历史记录'),
          detail: String(ev.detail || ev.description || ev.note || ''),
          category: String(ev.category || ev.type || '运营档案'),
          dataStatus: String(ev.dataStatus || 'Historical Data'),
          source: ev.sourceId ? String(ev.sourceId) : ev.source ? String(ev.source) : undefined
        })
      })
      if (item.conflictsSummary) {
        events.push({
          date: brand.value?.verifiedDate || '核实记录',
          title: '资料冲突摘要',
          detail: String(item.conflictsSummary),
          category: '冲突审计',
          dataStatus: 'Conflicting'
        })
      }
    } else if (itemSlug === slug) {
      events.push({
        date: String(item.date || item.recordedAt || item.year || '日期未知'),
        title: String(item.title || item.event || item.summary || '运营档案'),
        detail: String(item.detail || item.description || item.note || ''),
        category: String(item.category || item.type || '运营档案'),
        dataStatus: String(item.dataStatus || 'Historical Data'),
        source: item.source ? String(item.source) : undefined
      })
    }
  })

  // 2. From risk-records.json
  const rawRisks = unwrapList<Record<string, unknown>>(risksRaw)
  rawRisks.forEach((r) => {
    const rSlug = (r.brandSlug || r.slug || '') as string
    if (slug && rSlug !== slug) return
    if (Array.isArray(r.riskItems)) {
      ;(r.riskItems as Array<Record<string, unknown>>).forEach((ri) => {
        events.push({
          date: brand.value?.verifiedDate || '风险审计',
          title: `[${String(ri.severity || r.overallRiskLevel || '提示')}] ${String(ri.title || ri.code || '风险记录')}`,
          detail: [ri.detail, ri.mitigation ? `建议：${ri.mitigation}` : ''].filter(Boolean).join(' '),
          category: '风险审计',
          dataStatus: 'Vendor Data'
        })
      })
    } else {
      events.push({
        date: String(r.date || r.recordedAt || brand.value?.verifiedDate || '待核实'),
        title: String(r.title || r.riskType || '风险与运营提示'),
        detail: String(r.detail || r.summary || r.description || ''),
        category: '风险审计',
        dataStatus: String(r.dataStatus || 'Vendor Data'),
        source: r.source ? String(r.source) : undefined
      })
    }
  })

  // 3. From benchmarks.json
  filterBenchmarksByBrand(unwrapList<BenchmarkBatchRecord>(benchmarksRaw), slug).forEach((b) => {
    events.push({
      date: b.testedAt.slice(0, 10),
      title: `${b.toolName || '测速批次'} (${b.protocolDisplayed || '未知协议'})`,
      detail: `${b.isPeakHours === true ? '晚高峰测试' : b.isPeakHours === false ? '非晚高峰测试' : '时段待核实'} · ${b.backendEnv || ''}`,
      category: '测速留证',
      dataStatus: b.dataStatus,
      source: b.sourceId
    })
  })

  return events.sort((a, b) => b.date.localeCompare(a.date))
})
</script>

<template>
  <WatermarkedChartFrame
    title="历史演进、测速批次与风险追踪"
    subtitle="Stability & Operational Timeline（区分实测批次、历史记录与风险提醒）"
    :brand-name="brand?.name"
    :accent-color="brand?.accentColor"
    :data-status="brand?.dataStatus || 'Historical Data'"
    :tested-at="brand?.updatedDate"
    source-label="brand-history + risk-records + benchmarks"
  >
    <ol v-if="timeline.length > 0" class="sh-list">
      <li v-for="(ev, idx) in timeline" :key="`${ev.date}-${idx}`" class="sh-item">
        <div class="sh-rail" aria-hidden="true">
          <span class="sh-dot" :style="{ backgroundColor: getStatusMeta(ev.dataStatus).color }" />
        </div>
        <div class="sh-card">
          <div class="sh-top">
            <time class="sh-date">{{ ev.date }}</time>
            <span class="sh-cat">{{ ev.category }}</span>
            <span
              class="sh-badge"
              :style="{
                color: getStatusMeta(ev.dataStatus).color,
                borderColor: getStatusMeta(ev.dataStatus).border
              }"
            >
              {{ getStatusMeta(ev.dataStatus).zhLabel }}
            </span>
          </div>
          <div class="sh-title">{{ ev.title }}</div>
          <p v-if="ev.detail" class="sh-detail">{{ ev.detail }}</p>
          <span v-if="ev.source" class="sh-source">来源：{{ ev.source }}</span>
        </div>
      </li>
    </ol>

    <div v-else class="sh-empty">
      暂无公开历史变更或长期稳定性连续监测记录；单一时间点测速不能推导出全年稳定性，建议优先选择月付或低门槛周期验证。
    </div>
  </WatermarkedChartFrame>
</template>

<style scoped>
.sh-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.sh-item {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 0.65rem;
}

.sh-rail {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 0.45rem;
}

.sh-rail::after {
  content: '';
  position: absolute;
  top: 1.15rem;
  bottom: -0.9rem;
  width: 1px;
  background: #1e2d4a;
}

.sh-item:last-child .sh-rail::after {
  display: none;
}

.sh-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sh-card {
  padding: 0.7rem 0.85rem;
  border-radius: 8px;
  background: rgba(19, 29, 49, 0.85);
  border: 1px solid #1e2d4a;
}

.sh-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.3rem;
}

.sh-date {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.76rem;
  color: #7dd3fc;
}

.sh-cat {
  padding: 0.08rem 0.42rem;
  border-radius: 4px;
  font-size: 0.7rem;
  background: #17253e;
  color: #cbd5e1;
}

.sh-badge {
  padding: 0.08rem 0.42rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.68rem;
}

.sh-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #f8fafc;
}

.sh-detail {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.5;
}

.sh-source {
  display: inline-block;
  margin-top: 0.3rem;
  font-size: 0.72rem;
  color: #64748b;
}

.sh-empty {
  font-size: 0.84rem;
  color: #94a3b8;
  line-height: 1.55;
}
</style>
