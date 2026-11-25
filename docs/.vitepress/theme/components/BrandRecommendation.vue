<script setup lang="ts">
import { computed } from 'vue'
import type { BrandRecord, PlanItem } from '../../../../data/types'
import brandsRaw from '../../../../data/brands.json'
import plansRaw from '../../../../data/plans.json'
import AffiliateButton from './AffiliateButton.vue'
import AffiliateDisclosure from './AffiliateDisclosure.vue'
import {
  findBrand,
  filterPlansByBrand,
  formatPriceCny,
  getStatusMeta,
  safeArray,
  sanitizeHexColor,
  unwrapList
} from './observatory'

const props = withDefaults(
  defineProps<{
    slug?: string
    brandSlug?: string
    title?: string
    badge?: string
    highlightReason?: string
    showMetrics?: boolean
    showDisclosure?: boolean
  }>(),
  {
    slug: '',
    brandSlug: '',
    title: '',
    badge: '',
    highlightReason: '',
    showMetrics: true,
    showDisclosure: true
  }
)

const targetSlug = computed(() => (props.brandSlug || props.slug || '').trim())
const allBrands = computed(() => unwrapList<BrandRecord>(brandsRaw))
const allPlans = computed(() => unwrapList<PlanItem>(plansRaw))

const brand = computed(() => findBrand(allBrands.value, targetSlug.value))
const brandPlans = computed(() => filterPlansByBrand(allPlans.value, targetSlug.value))
const status = computed(() => getStatusMeta(brand.value?.dataStatus))
const accent = computed(() => sanitizeHexColor(brand.value?.accentColor, '#0f4c81'))

const badgeLabel = computed(() => {
  if (props.badge) return props.badge
  if (brand.value?.isLeadBrand) return '主推合作品牌 · 商业推广位'
  if (brand.value?.featuredRank && brand.value.featuredRank <= 11) {
    return `重点收录品牌 #${brand.value.featuredRank}`
  }
  return '收录品牌参考'
})

const lowestPlan = computed(() => {
  if (brandPlans.value.length === 0) return null
  return [...brandPlans.value].sort((a, b) => (a.priceCny ?? 99999) - (b.priceCny ?? 99999))[0]
})
</script>

<template>
  <section
    v-if="brand"
    class="brand-rec-card"
    :style="{ '--rec-accent': accent }"
    aria-label="品牌推荐与决策摘要"
  >
    <div class="brc-top-bar" aria-hidden="true" />
    <div class="brc-header">
      <div class="brc-identity">
        <img
          v-if="brand.logo"
          :src="brand.logo"
          :alt="`${brand.name} 品牌标志`"
          class="brc-logo"
          width="44"
          height="44"
          loading="lazy"
        />
        <div>
          <div class="brc-tags">
            <span class="brc-partner-badge">{{ badgeLabel }}</span>
            <span
              class="brc-status-badge"
              :style="{
                color: status.color,
                backgroundColor: '#0b1220',
                borderColor: status.border
              }"
            >
              {{ status.zhLabel }}
            </span>
          </div>
          <h3 class="brc-name">
            {{ title || brand.name }}
            <span v-if="brand.englishName" class="brc-en">{{ brand.englishName }}</span>
          </h3>
          <p v-if="brand.positioning" class="brc-pos">{{ brand.positioning }}</p>
        </div>
      </div>
      <div class="brc-price-box">
        <span class="brc-price-label">入门参考</span>
        <strong class="brc-price-val">
          {{ brand.entryLabel || (brand.entryMonthlyCny != null ? `${formatPriceCny(brand.entryMonthlyCny)}/月起` : '待核实') }}
        </strong>
        <span v-if="lowestPlan" class="brc-price-sub">
          最低实付 {{ formatPriceCny(lowestPlan.priceCny) }} / {{ lowestPlan.billingCycleLabel }}
        </span>
      </div>
    </div>

    <p v-if="highlightReason || brand.summary" class="brc-summary">
      {{ highlightReason || brand.summary }}
    </p>

    <div v-if="showMetrics" class="brc-specs">
      <div class="brc-spec">
        <span class="brc-spec-k">传输协议</span>
        <span class="brc-spec-v">{{ safeArray(brand.protocols).join(' / ') || '待核实' }}</span>
      </div>
      <div class="brc-spec">
        <span class="brc-spec-k">线路特征</span>
        <span class="brc-spec-v">{{ safeArray(brand.routeTypes).join(' · ') || '待核实' }}</span>
      </div>
      <div class="brc-spec">
        <span class="brc-spec-k">节点规模</span>
        <span class="brc-spec-v">{{ brand.nodeCountLabel || '待核实' }}</span>
      </div>
      <div class="brc-spec">
        <span class="brc-spec-k">设备限制</span>
        <span class="brc-spec-v">{{ brand.deviceLimit || '待核实' }}</span>
      </div>
    </div>

    <div v-if="safeArray(brand.pros).length > 0 || safeArray(brand.limitations).length > 0" class="brc-tradeoffs">
      <div v-if="safeArray(brand.pros).length > 0" class="brc-col">
        <div class="brc-col-title is-pro">核心优势</div>
        <ul>
          <li v-for="(item, idx) in safeArray(brand.pros).slice(0, 3)" :key="idx">{{ item }}</li>
        </ul>
      </div>
      <div v-if="safeArray(brand.limitations).length > 0" class="brc-col">
        <div class="brc-col-title is-limit">主要限制与注意</div>
        <ul>
          <li v-for="(item, idx) in safeArray(brand.limitations).slice(0, 3)" :key="idx">{{ item }}</li>
        </ul>
      </div>
    </div>

    <div class="brc-actions">
      <AffiliateButton
        :brand-slug="brand.slug"
        :brand-name="brand.name"
        :show-disclosure="false"
        source-section="brand_recommendation"
      />
      <div class="brc-nav-links">
        <a :href="`/reviews/${brand.slug}/`" class="brc-link">查看品牌档案</a>
        <a v-if="brand.reviewUrl" :href="brand.reviewUrl" class="brc-link">阅读深度测评</a>
        <a :href="`/compare/?brands=${brand.slug}`" class="brc-link">加入横向对比</a>
      </div>
    </div>

    <AffiliateDisclosure v-if="showDisclosure" variant="inline" />
  </section>

  <div v-else class="brc-missing">
    品牌 <code>{{ targetSlug || '未指定' }}</code> 资料待核实，请前往<a href="/brands/">机场品牌库</a>查看已收录品牌。
  </div>
</template>

<style scoped>
.brand-rec-card {
  position: relative;
  margin: 1.5rem 0;
  padding: 1.25rem;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  overflow: hidden;
}

.brc-top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--rec-accent, #0f4c81);
}

.brc-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 0.25rem;
}

.brc-identity {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.brc-logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: contain;
  background: #f4f7fb;
  border: 1px solid #e2e8f0;
  padding: 4px;
  flex-shrink: 0;
}

.brc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.35rem;
}

.brc-partner-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.14rem 0.5rem;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  background: #e0f2fe;
  color: #0369a1;
}

.brc-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.14rem 0.5rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.72rem;
  font-weight: 600;
}

.brc-name {
  margin: 0 !important;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
}

.brc-en {
  margin-left: 0.4rem;
  font-size: 0.86rem;
  font-weight: 500;
  color: #64748b;
}

.brc-pos {
  margin: 0.2rem 0 0;
  font-size: 0.84rem;
  color: #475569;
}

.brc-price-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0.55rem 0.85rem;
  border-radius: 8px;
  background: #f4f7fb;
  border: 1px solid #e2e8f0;
}

.brc-price-label {
  font-size: 0.72rem;
  color: #64748b;
}

.brc-price-val {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.08rem;
  color: #0f4c81;
}

.brc-price-sub {
  font-size: 0.74rem;
  color: #64748b;
}

.brc-summary {
  margin: 0.9rem 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: #334155;
}

.brc-specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.65rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.brc-spec {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.brc-spec-k {
  font-size: 0.74rem;
  color: #64748b;
}

.brc-spec-v {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
}

.brc-tradeoffs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.85rem;
  margin-top: 0.9rem;
}

.brc-col {
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.brc-col-title {
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.brc-col-title.is-pro {
  color: #047857;
}

.brc-col-title.is-limit {
  color: #b45309;
}

.brc-col ul {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.83rem;
  color: #334155;
  line-height: 1.55;
}

.brc-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.85rem;
  margin-top: 1rem;
  padding-top: 0.9rem;
  border-top: 1px solid #e2e8f0;
}

.brc-nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.brc-link {
  font-size: 0.86rem;
  font-weight: 600;
  color: #0f4c81;
  text-decoration: none;
}

.brc-link:hover {
  text-decoration: underline;
}

.brc-missing {
  padding: 0.9rem 1rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  font-size: 0.88rem;
  color: #475569;
}

@media (max-width: 640px) {
  .brc-price-box {
    align-items: flex-start;
    width: 100%;
  }
}

:global(.dark .brand-rec-card){
  background: #131d31;
  border-color: #1e2d4a;
  box-shadow: 0 6px 24px rgba(2, 6, 23, 0.45);
}

:global(.dark .brc-logo){
  background: #f1f5f9;
  border-color: #334155;
}

:global(.dark .brc-partner-badge){
  background: rgba(56, 189, 248, 0.18);
  color: #7dd3fc;
}

:global(.dark .brc-name){
  color: #f1f5f9;
}

:global(.dark .brc-en),
:global(.dark .brc-price-label),
:global(.dark .brc-price-sub),
:global(.dark .brc-spec-k){
  color: #94a3b8;
}

:global(.dark .brc-pos),
:global(.dark .brc-summary),
:global(.dark .brc-col ul){
  color: #cbd5e1;
}

:global(.dark .brc-price-box),
:global(.dark .brc-specs),
:global(.dark .brc-col){
  background: #0b1220;
  border-color: #1e2d4a;
}

:global(.dark .brc-price-val),
:global(.dark .brc-link){
  color: #38bdf8;
}

:global(.dark .brc-spec-v){
  color: #f1f5f9;
}

:global(.dark .brc-col-title.is-pro){
  color: #34d399;
}

:global(.dark .brc-col-title.is-limit){
  color: #fbbf24;
}

:global(.dark .brc-actions){
  border-top-color: #1e2d4a;
}

:global(.dark .brc-missing){
  background: #131d31;
  border-color: #334155;
  color: #cbd5e1;
}
</style>
