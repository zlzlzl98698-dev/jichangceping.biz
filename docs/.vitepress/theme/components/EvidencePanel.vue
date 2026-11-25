<script setup lang="ts">
import { computed } from 'vue'
import type { BenchmarkBatchRecord, BrandRecord } from '../../../../data/types'
import benchmarksRaw from '../../../../data/benchmarks.json'
import benchmarkSourcesRaw from '../../../../data/benchmark-sources.json'
import brandSourcesRaw from '../../../../data/brand-sources.json'
import brandsRaw from '../../../../data/brands.json'
import WatermarkedChartFrame from './WatermarkedChartFrame.vue'
import {
  filterBenchmarksByBrand,
  findBrand,
  getStatusMeta,
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

const batchesWithImages = computed(() =>
  filterBenchmarksByBrand(unwrapList<BenchmarkBatchRecord>(benchmarksRaw), targetSlug.value).filter(
    (b) => Boolean(b.imagePath)
  )
)

const allBenchBatches = computed(() =>
  filterBenchmarksByBrand(unwrapList<BenchmarkBatchRecord>(benchmarksRaw), targetSlug.value)
)

const relatedSources = computed(() => {
  const brandSrcIds = new Set(safeArray(brand.value?.sourceIds))
  const benchSrcIds = new Set(allBenchBatches.value.map((b) => b.sourceId))
  const bSources = unwrapList<Record<string, unknown>>(brandSourcesRaw).filter((s) => {
    const id = String(s.id || s.sourceId || '')
    const bSlug = String(s.brandSlug || '')
    return brandSrcIds.has(id) || (targetSlug.value && bSlug === targetSlug.value)
  })
  const mSources = unwrapList<Record<string, unknown>>(benchmarkSourcesRaw).filter((s) => {
    const id = String(s.id || s.sourceId || '')
    const bSlug = String(s.brandSlug || '')
    return benchSrcIds.has(id) || (targetSlug.value && bSlug === targetSlug.value)
  })
  return [...bSources, ...mSources]
})
</script>

<template>
  <section class="evidence-panel" aria-label="原始证据与资料来源审计">
    <!-- Original 3rd-party PNG/JPG screenshots: NEVER watermarked or altered -->
    <WatermarkedChartFrame
      v-if="batchesWithImages.length > 0"
      title="第三方原始测速截图档案"
      subtitle="Raw Screenshot Archive（保持原始图片文件未修改，不叠加本站水印）"
      :brand-name="brand?.name"
      :accent-color="brand?.accentColor"
      :data-status="batchesWithImages[0].dataStatus"
      :tested-at="batchesWithImages[0].testedAt"
      :source-label="batchesWithImages[0].toolName"
      :show-watermark="false"
    >
      <div class="ep-shots">
        <figure v-for="shot in batchesWithImages" :key="shot.id" class="ep-shot-card">
          <div class="ep-shot-meta">
            <span class="ep-mono">{{ shot.testedAt }}</span>
            <span>协议：<code>{{ shot.protocolDisplayed }}</code></span>
            <span>工具：<code>{{ shot.toolName }}</code></span>
            <span v-if="shot.dateConfidence">日期置信度：<code>{{ shot.dateConfidence }}</code></span>
          </div>
          <a
            :href="shot.imagePath"
            target="_blank"
            rel="noopener"
            title="点击查看未修改的原始高清测速截图"
            class="ep-shot-link"
          >
            <img
              :src="shot.thumbnailPath || shot.imagePath"
              :alt="`${shot.brandName} ${shot.testedAt} 原始测速截图`"
              class="ep-shot-img"
              loading="lazy"
            />
            <span class="ep-shot-badge">点击图片查看原始 PNG/JPG 原图（SHA-256 未修改）</span>
          </a>
          <figcaption v-if="safeArray(shot.limitations).length > 0" class="ep-shot-cap">
            局限声明：{{ shot.limitations.join('；') }}
          </figcaption>
        </figure>
      </div>
    </WatermarkedChartFrame>

    <WatermarkedChartFrame
      title="资料来源与核实状态清单"
      subtitle="Source & Conflict Audit Trail"
      :brand-name="brand?.name"
      :accent-color="brand?.accentColor"
      :data-status="brand?.dataStatus || 'Vendor Data'"
      :tested-at="brand?.verifiedDate || brand?.updatedDate"
      :show-watermark="true"
    >
      <div v-if="relatedSources.length > 0" class="ep-sources">
        <div v-for="(src, idx) in relatedSources" :key="idx" class="ep-src-row">
          <div class="ep-src-head">
            <code class="ep-src-id">{{ src.id || src.sourceId || src.batchId || `SRC-${idx + 1}` }}</code>
            <span class="ep-src-title">{{ src.title || src.name || src.fileName || src.file || '原始参考资料' }}</span>
            <span
              v-if="src.dataStatus"
              class="ep-src-status"
              :style="{ color: getStatusMeta(String(src.dataStatus)).color }"
            >
              {{ getStatusMeta(String(src.dataStatus)).zhLabel }}
            </span>
          </div>
          <p v-if="src.note || src.summary || src.reviewNote" class="ep-src-note">
            {{ src.note || src.summary || src.reviewNote }}
          </p>
        </div>
      </div>

      <div v-else class="ep-empty">
        来源索引 ID：{{ safeArray(brand?.sourceIds).join(', ') || '待补充' }}。
      </div>
    </WatermarkedChartFrame>
  </section>
</template>

<style scoped>
.evidence-panel {
  margin: 1.5rem 0;
}

.ep-shots {
  display: grid;
  gap: 1rem;
}

.ep-shot-card {
  margin: 0;
  padding: 0.75rem;
  border-radius: 8px;
  background: #070d18;
  border: 1px solid #1e2d4a;
}

.ep-shot-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1rem;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.6rem;
}

.ep-shot-meta code {
  color: #e2e8f0;
  background: transparent;
  padding: 0;
}

.ep-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #7dd3fc;
}

.ep-shot-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.ep-shot-img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

.ep-shot-badge {
  display: inline-block;
  margin-top: 0.45rem;
  padding: 0.18rem 0.52rem;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  font-size: 0.72rem;
  color: #7dd3fc;
  line-height: 1.4;
}

.ep-shot-link:hover .ep-shot-badge {
  background: rgba(56, 189, 248, 0.18);
  color: #bae6fd;
}

.ep-shot-cap {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #fcd34d;
  line-height: 1.5;
}

.ep-sources {
  display: grid;
  gap: 0.6rem;
}

.ep-src-row {
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background: rgba(19, 29, 49, 0.85);
  border: 1px solid #1e2d4a;
}

.ep-src-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.ep-src-id {
  font-size: 0.72rem;
  color: #7dd3fc;
  background: rgba(56, 189, 248, 0.12);
  padding: 0.08rem 0.4rem;
  border-radius: 4px;
}

.ep-src-title {
  font-size: 0.84rem;
  font-weight: 600;
  color: #f8fafc;
}

.ep-src-status {
  margin-left: auto;
  font-size: 0.72rem;
  font-weight: 600;
}

.ep-src-note {
  margin: 0.3rem 0 0;
  font-size: 0.76rem;
  color: #94a3b8;
  line-height: 1.5;
}

.ep-empty {
  font-size: 0.82rem;
  color: #94a3b8;
}
</style>
