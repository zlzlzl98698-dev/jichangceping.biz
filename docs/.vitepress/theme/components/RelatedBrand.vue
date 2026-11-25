<script setup lang="ts">
import { computed } from 'vue'
import type { BrandRecord } from '../../../../data/types'
import brandsRaw from '../../../../data/brands.json'
import AffiliateDisclosure from './AffiliateDisclosure.vue'
import { formatPriceCny, getStatusMeta, safeArray, unwrapList } from './observatory'

const props = withDefaults(
  defineProps<{
    slug?: string
    brandSlug?: string
    relatedSlugs?: string[]
    limit?: number
    title?: string
    showDisclosure?: boolean
  }>(),
  {
    slug: '',
    brandSlug: '',
    relatedSlugs: undefined,
    limit: 4,
    title: '同类与可替代品牌参考',
    showDisclosure: true
  }
)

const currentSlug = computed(() => (props.brandSlug || props.slug || '').trim())
const allBrands = computed(() => unwrapList<BrandRecord>(brandsRaw))

const currentBrand = computed(() =>
  allBrands.value.find((b) => b.slug === currentSlug.value)
)

const relatedBrands = computed(() => {
  const pool = allBrands.value.filter((b) => b.slug !== currentSlug.value)
  if (props.relatedSlugs && props.relatedSlugs.length > 0) {
    const order = new Map(props.relatedSlugs.map((s, i) => [s, i]))
    return pool
      .filter((b) => order.has(b.slug))
      .sort((a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99))
      .slice(0, props.limit)
  }

  const base = currentBrand.value
  if (!base) {
    return pool.slice(0, props.limit)
  }

  const baseRoutes = new Set(safeArray(base.routeTypes))
  const baseProtocols = new Set(safeArray(base.protocols))

  return [...pool]
    .map((candidate) => {
      let score = 0
      safeArray(candidate.routeTypes).forEach((r) => {
        if (baseRoutes.has(r)) score += 3
      })
      safeArray(candidate.protocols).forEach((p) => {
        if (baseProtocols.has(p)) score += 2
      })
      if (
        base.entryMonthlyCny != null &&
        candidate.entryMonthlyCny != null &&
        Math.abs(base.entryMonthlyCny - candidate.entryMonthlyCny) <= 15
      ) {
        score += 2
      }
      if (candidate.evidenceCompleteness === 'high') score += 1
      return { candidate, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, props.limit)
    .map((item) => item.candidate)
})
</script>

<template>
  <section v-if="relatedBrands.length > 0" class="related-brands" aria-label="同类与可替代品牌">
    <div class="rb-header">
      <h3 class="rb-title">{{ title }}</h3>
      <a href="/compare/" class="rb-all-link">进入多品牌对比工具 →</a>
    </div>

    <div class="rb-grid">
      <article v-for="item in relatedBrands" :key="item.slug" class="rb-card">
        <div class="rb-card-top">
          <div class="rb-name-wrap">
            <img
              v-if="item.logo"
              :src="item.logo"
              :alt="`${item.name} 图标`"
              class="rb-logo"
              width="32"
              height="32"
              loading="lazy"
            />
            <div>
              <h4 class="rb-name">{{ item.name }}</h4>
              <span class="rb-pos">{{ item.positioning || '机场服务品牌' }}</span>
            </div>
          </div>
          <span
            class="rb-status"
            :style="{
              color: getStatusMeta(item.dataStatus).color,
              backgroundColor: '#0b1220',
              borderColor: getStatusMeta(item.dataStatus).border
            }"
          >
            {{ getStatusMeta(item.dataStatus).zhLabel }}
          </span>
        </div>

        <div class="rb-meta">
          <span>入门：{{ item.entryLabel || (item.entryMonthlyCny != null ? `${formatPriceCny(item.entryMonthlyCny)}/月` : '待核实') }}</span>
          <span>协议：{{ safeArray(item.protocols).slice(0, 2).join('/') || '待核实' }}</span>
        </div>

        <div class="rb-links">
          <a :href="`/reviews/${item.slug}/`" class="rb-link">品牌详情</a>
          <a v-if="item.reviewUrl" :href="item.reviewUrl" class="rb-link">深度测评</a>
          <a
            v-if="currentSlug"
            :href="`/compare/?brands=${currentSlug},${item.slug}`"
            class="rb-link is-compare"
          >
            对比参数
          </a>
        </div>
      </article>
    </div>

    <AffiliateDisclosure v-if="showDisclosure" variant="compact" />
  </section>
</template>

<style scoped>
.related-brands {
  margin: 1.75rem 0;
  padding: 1.1rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.rb-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
}

.rb-title {
  margin: 0 !important;
  font-size: 1.08rem;
  font-weight: 700;
  color: #0f172a;
}

.rb-all-link {
  font-size: 0.84rem;
  font-weight: 600;
  color: #0f4c81;
  text-decoration: none;
}

.rb-all-link:hover {
  text-decoration: underline;
}

.rb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.rb-card {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.85rem;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
}

.rb-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.rb-name-wrap {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.rb-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: contain;
  background: #f4f7fb;
  border: 1px solid #e2e8f0;
  padding: 2px;
}

.rb-name {
  margin: 0 !important;
  font-size: 0.96rem;
  font-weight: 700;
  color: #0f172a;
}

.rb-pos {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
}

.rb-status {
  padding: 0.1rem 0.42rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.rb-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.8rem;
  color: #334155;
}

.rb-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: auto;
  padding-top: 0.4rem;
  border-top: 1px dashed #e2e8f0;
}

.rb-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f4c81;
  text-decoration: none;
}

.rb-link:hover {
  text-decoration: underline;
}

.rb-link.is-compare {
  color: #0284c7;
}

:global(.dark .related-brands){
  background: #0b1220;
  border-color: #1e2d4a;
}

:global(.dark .rb-title),
:global(.dark .rb-name){
  color: #f1f5f9;
}

:global(.dark .rb-all-link),
:global(.dark .rb-link){
  color: #38bdf8;
}

:global(.dark .rb-link.is-compare){
  color: #7dd3fc;
}

:global(.dark .rb-card){
  background: #131d31;
  border-color: #1e2d4a;
}

:global(.dark .rb-logo){
  background: #f1f5f9;
  border-color: #334155;
}

:global(.dark .rb-pos){
  color: #94a3b8;
}

:global(.dark .rb-meta){
  color: #cbd5e1;
}

:global(.dark .rb-links){
  border-top-color: #1e2d4a;
}
</style>
