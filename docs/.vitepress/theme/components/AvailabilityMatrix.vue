<script setup lang="ts">
import { computed } from 'vue'
import type { BrandRecord } from '../../../../data/types'
import availabilityRaw from '../../../../data/availability.json'
import brandsRaw from '../../../../data/brands.json'
import WatermarkedChartFrame from './WatermarkedChartFrame.vue'
import { findBrand, getStatusMeta, unwrapList } from './observatory'

interface ServiceCell {
  service: string
  category: 'ai' | 'streaming'
  statusText: string
  dataStatus: string
  note?: string
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

const DEFAULT_AI_SERVICES = ['ChatGPT', 'Claude', 'Gemini', 'Copilot']
const DEFAULT_STREAMING_SERVICES = ['Netflix', 'YouTube', 'Disney+', 'TikTok']

const cells = computed<ServiceCell[]>(() => {
  const slug = targetSlug.value
  const fromAvailability = unwrapList<Record<string, unknown>>(availabilityRaw).filter(
    (item) => (item.brandSlug || item.slug) === slug
  )

  const aiMap = new Map<string, ServiceCell>()
  const streamMap = new Map<string, ServiceCell>()

  // 1. Seed from brand summaries
  if (brand.value?.aiSupportSummary) {
    Object.entries(brand.value.aiSupportSummary).forEach(([name, info]) => {
      aiMap.set(name, {
        service: name,
        category: 'ai',
        statusText: info?.status || '待核实',
        dataStatus: info?.dataStatus || 'Not Tested',
        note: info?.note
      })
    })
  }
  if (brand.value?.streamingSummary) {
    Object.entries(brand.value.streamingSummary).forEach(([name, info]) => {
      streamMap.set(name, {
        service: name,
        category: 'streaming',
        statusText: info?.status || '待核实',
        dataStatus: info?.dataStatus || 'Not Tested',
        note: info?.note
      })
    })
  }

  // 2. Merge detailed availability.json records if available
  fromAvailability.forEach((rec) => {
    // Exact schema: { brandSlug, services: [{ service, category, status, statusLabel, dataStatus, note }] }
    if (Array.isArray(rec.services)) {
      ;(rec.services as Array<Record<string, unknown>>).forEach((s) => {
        const sName = String(s.service || '')
        if (!sName) return
        const isAi =
          s.category === 'ai' ||
          /chatgpt|claude|gemini|openai|copilot|perplexity/i.test(sName)
        const target = isAi ? aiMap : streamMap
        target.set(sName, {
          service: sName,
          category: isAi ? 'ai' : 'streaming',
          statusText: String(s.statusLabel || s.status || '待核实'),
          dataStatus: String(s.dataStatus || rec.dataStatus || 'Not Tested'),
          note: s.note ? String(s.note) : undefined
        })
      })
    }
    // Shape A: { brandSlug, ai: Record|Array, streaming: Record|Array }
    if (rec.ai && typeof rec.ai === 'object' && !Array.isArray(rec.ai)) {
      Object.entries(rec.ai as Record<string, Record<string, unknown>>).forEach(([name, info]) => {
        aiMap.set(name, {
          service: name,
          category: 'ai',
          statusText: String(info?.status || info?.result || '待核实'),
          dataStatus: String(info?.dataStatus || rec.dataStatus || 'Not Tested'),
          note: info?.note ? String(info.note) : undefined
        })
      })
    }
    if (rec.streaming && typeof rec.streaming === 'object' && !Array.isArray(rec.streaming)) {
      Object.entries(rec.streaming as Record<string, Record<string, unknown>>).forEach(([name, info]) => {
        streamMap.set(name, {
          service: name,
          category: 'streaming',
          statusText: String(info?.status || info?.result || '待核实'),
          dataStatus: String(info?.dataStatus || rec.dataStatus || 'Not Tested'),
          note: info?.note ? String(info.note) : undefined
        })
      })
    }
    // Shape B: flat row { brandSlug, service, category, status, dataStatus, note }
    if (rec.service) {
      const sName = String(rec.service)
      const isAi =
        rec.category === 'ai' ||
        /chatgpt|claude|gemini|openai|copilot|perplexity/i.test(sName)
      const target = isAi ? aiMap : streamMap
      target.set(sName, {
        service: sName,
        category: isAi ? 'ai' : 'streaming',
        statusText: String(rec.status || rec.result || '待核实'),
        dataStatus: String(rec.dataStatus || 'Not Tested'),
        note: rec.note ? String(rec.note) : undefined
      })
    }
  })

  // Ensure standard baseline keys appear even when Not Tested
  DEFAULT_AI_SERVICES.forEach((name) => {
    if (!aiMap.has(name)) {
      aiMap.set(name, {
        service: name,
        category: 'ai',
        statusText: '暂无独立实测',
        dataStatus: 'Not Tested'
      })
    }
  })
  DEFAULT_STREAMING_SERVICES.forEach((name) => {
    if (!streamMap.has(name)) {
      streamMap.set(name, {
        service: name,
        category: 'streaming',
        statusText: '暂无独立实测',
        dataStatus: 'Not Tested'
      })
    }
  })

  return [...aiMap.values(), ...streamMap.values()]
})

const aiCells = computed(() => cells.value.filter((c) => c.category === 'ai'))
const streamCells = computed(() => cells.value.filter((c) => c.category === 'streaming'))
</script>

<template>
  <WatermarkedChartFrame
    title="AI 工具与流媒体服务可用性矩阵"
    subtitle="Service Availability Matrix（严格区分独立实测结果与品牌方公开说明）"
    :brand-name="brand?.name"
    :accent-color="brand?.accentColor"
    :data-status="brand?.dataStatus || 'Not Tested'"
    :tested-at="brand?.verifiedDate || brand?.updatedDate"
    source-label="availability.json + brands.json"
  >
    <div class="am-sections">
      <div class="am-group">
        <div class="am-group-head">
          <span class="am-group-tag">AI SERVICES</span>
          <span class="am-group-title">AI 工具兼容性</span>
        </div>
        <div class="am-grid">
          <div v-for="cell in aiCells" :key="`ai-${cell.service}`" class="am-cell">
            <div class="am-cell-top">
              <strong class="am-service">{{ cell.service }}</strong>
              <span
                class="am-pill"
                :style="{
                  color: getStatusMeta(cell.dataStatus).color,
                  backgroundColor: getStatusMeta(cell.dataStatus).bg,
                  borderColor: getStatusMeta(cell.dataStatus).border
                }"
              >
                <i class="am-dot" :style="{ backgroundColor: getStatusMeta(cell.dataStatus).color }" />
                {{ getStatusMeta(cell.dataStatus).zhLabel }}
              </span>
            </div>
            <div class="am-status-text">{{ cell.statusText }}</div>
            <p v-if="cell.note" class="am-note">{{ cell.note }}</p>
          </div>
        </div>
      </div>

      <div class="am-group">
        <div class="am-group-head">
          <span class="am-group-tag">STREAMING MEDIA</span>
          <span class="am-group-title">海外流媒体解锁</span>
        </div>
        <div class="am-grid">
          <div v-for="cell in streamCells" :key="`st-${cell.service}`" class="am-cell">
            <div class="am-cell-top">
              <strong class="am-service">{{ cell.service }}</strong>
              <span
                class="am-pill"
                :style="{
                  color: getStatusMeta(cell.dataStatus).color,
                  backgroundColor: getStatusMeta(cell.dataStatus).bg,
                  borderColor: getStatusMeta(cell.dataStatus).border
                }"
              >
                <i class="am-dot" :style="{ backgroundColor: getStatusMeta(cell.dataStatus).color }" />
                {{ getStatusMeta(cell.dataStatus).zhLabel }}
              </span>
            </div>
            <div class="am-status-text">{{ cell.statusText }}</div>
            <p v-if="cell.note" class="am-note">{{ cell.note }}</p>
          </div>
        </div>
      </div>
    </div>
  </WatermarkedChartFrame>
</template>

<style scoped>
.am-sections {
  display: grid;
  gap: 1.1rem;
}

.am-group-head {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.6rem;
}

.am-group-tag {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: #38bdf8;
}

.am-group-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f8fafc;
}

.am-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(195px, 1fr));
  gap: 0.65rem;
}

.am-cell {
  padding: 0.72rem 0.85rem;
  border-radius: 8px;
  background: rgba(19, 29, 49, 0.88);
  border: 1px solid #1e2d4a;
}

.am-cell-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.38rem;
}

.am-service {
  font-size: 0.9rem;
  color: #f8fafc;
}

.am-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.1rem 0.44rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.am-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.am-status-text {
  font-size: 0.82rem;
  color: #cbd5e1;
  font-weight: 500;
}

.am-note {
  margin: 0.25rem 0 0;
  font-size: 0.74rem;
  color: #94a3b8;
  line-height: 1.45;
}
</style>
