<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { BrandRecord } from '../../../../data/types'
import brandsRaw from '../../../../data/brands.json'
import AffiliateButton from './AffiliateButton.vue'
import AffiliateDisclosure from './AffiliateDisclosure.vue'
import { formatPriceCny, getStatusMeta, safeArray, unwrapList } from './observatory'

const allBrands = computed(() => unwrapList<BrandRecord>(brandsRaw))

const searchQuery = ref('')
const selectedRoute = ref('all')
const selectedProtocol = ref('all')
const selectedPriceTier = ref('all')
const selectedStatus = ref('all')
const sortBy = ref<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured')

const BUDGET_PARAM_MAP: Record<string, string> = {
  budget: 'budget',
  low: 'budget',
  mid: 'mid',
  premium: 'premium',
  high: 'premium',
  unknown: 'unknown',
  all: 'all'
}

onMounted(() => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const q = params.get('q')
  const route = params.get('route')
  const protocol = params.get('protocol')
  const budget = params.get('budget')
  if (q) searchQuery.value = q
  if (route) selectedRoute.value = route
  if (protocol) selectedProtocol.value = protocol
  if (budget) {
    const mapped = BUDGET_PARAM_MAP[budget.trim().toLowerCase()]
    if (mapped) selectedPriceTier.value = mapped
  }
})

const routeOptions = computed(() => {
  const set = new Set<string>()
  allBrands.value.forEach((b) => safeArray(b.routeTypes).forEach((r) => set.add(r)))
  return Array.from(set).sort()
})

const protocolOptions = computed(() => {
  const set = new Set<string>()
  allBrands.value.forEach((b) => safeArray(b.protocols).forEach((p) => set.add(p)))
  return Array.from(set).sort()
})

const filteredBrands = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const list = allBrands.value.filter((b) => {
    if (q) {
      const hay = [
        b.name,
        b.englishName || '',
        b.slug,
        ...safeArray(b.aliases),
        b.positioning || '',
        b.summary || '',
        ...safeArray(b.regions),
        ...safeArray(b.protocols),
        ...safeArray(b.routeTypes)
      ]
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }

    if (selectedRoute.value !== 'all' && !safeArray(b.routeTypes).includes(selectedRoute.value)) {
      return false
    }

    if (selectedProtocol.value !== 'all' && !safeArray(b.protocols).includes(selectedProtocol.value)) {
      return false
    }

    if (selectedStatus.value !== 'all' && b.dataStatus !== selectedStatus.value) {
      return false
    }

    if (selectedPriceTier.value !== 'all') {
      const p = b.entryMonthlyCny
      if (selectedPriceTier.value === 'unknown') {
        if (p !== null && p !== undefined) return false
      } else if (p === null || p === undefined) {
        return false
      } else if (selectedPriceTier.value === 'budget' && p > 10) {
        return false
      } else if (selectedPriceTier.value === 'mid' && (p <= 10 || p > 25)) {
        return false
      } else if (selectedPriceTier.value === 'premium' && p <= 25) {
        return false
      }
    }

    return true
  })

  return [...list].sort((a, b) => {
    if (sortBy.value === 'price-asc') {
      return (a.entryMonthlyCny ?? 99999) - (b.entryMonthlyCny ?? 99999)
    }
    if (sortBy.value === 'price-desc') {
      return (b.entryMonthlyCny ?? -1) - (a.entryMonthlyCny ?? -1)
    }
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name, 'zh-CN')
    }
    // featured: featuredRank first (1..11), then completeness
    const ra = a.featuredRank ?? 999
    const rb = b.featuredRank ?? 999
    if (ra !== rb) return ra - rb
    return a.name.localeCompare(b.name, 'zh-CN')
  })
})

function resetFilters() {
  searchQuery.value = ''
  selectedRoute.value = 'all'
  selectedProtocol.value = 'all'
  selectedPriceTier.value = 'all'
  selectedStatus.value = 'all'
  sortBy.value = 'featured'
}
</script>

<template>
  <section class="brand-directory" aria-label="机场品牌数据库检索">
    <div class="bd-controls">
      <div class="bd-search-row">
        <label class="bd-field bd-search-field">
          <span class="bd-label">搜索品牌 / 别名 / 地区 / 协议</span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="例如：光速云、IEPL、VLESS、香港、不限时..."
            class="bd-input"
          />
        </label>

        <label class="bd-field">
          <span class="bd-label">排序方式</span>
          <select v-model="sortBy" class="bd-select">
            <option value="featured">收录重点优先</option>
            <option value="price-asc">入门月均从低到高</option>
            <option value="price-desc">入门月均从高到低</option>
            <option value="name">品牌名称排序</option>
          </select>
        </label>
      </div>

      <div class="bd-filters-row">
        <label class="bd-field">
          <span class="bd-label">线路特征</span>
          <select v-model="selectedRoute" class="bd-select">
            <option value="all">全部线路</option>
            <option v-for="r in routeOptions" :key="r" :value="r">{{ r }}</option>
          </select>
        </label>

        <label class="bd-field">
          <span class="bd-label">支持协议</span>
          <select v-model="selectedProtocol" class="bd-select">
            <option value="all">全部协议</option>
            <option v-for="p in protocolOptions" :key="p" :value="p">{{ p }}</option>
          </select>
        </label>

        <label class="bd-field">
          <span class="bd-label">入门月均区间</span>
          <select v-model="selectedPriceTier" class="bd-select">
            <option value="all">不限价位</option>
            <option value="budget">10 元/月及以下</option>
            <option value="mid">10–25 元/月</option>
            <option value="premium">25 元/月以上</option>
            <option value="unknown">价格待核实</option>
          </select>
        </label>

        <label class="bd-field">
          <span class="bd-label">数据状态</span>
          <select v-model="selectedStatus" class="bd-select">
            <option value="all">全部状态</option>
            <option value="Measured">独立实测</option>
            <option value="Vendor Data">品牌方资料</option>
            <option value="Historical Data">历史记录</option>
            <option value="Conflicting">存在数据冲突</option>
            <option value="Not Tested">暂未实测</option>
            <option value="Unverified">待核实</option>
          </select>
        </label>
      </div>

      <div class="bd-summary-bar">
        <span>
          已收录 <strong>{{ allBrands.length }}</strong> 家唯一去重品牌 · 当前匹配
          <strong>{{ filteredBrands.length }}</strong> 家
        </span>
        <button
          v-if="searchQuery || selectedRoute !== 'all' || selectedProtocol !== 'all' || selectedPriceTier !== 'all' || selectedStatus !== 'all'"
          type="button"
          class="bd-reset-btn"
          @click="resetFilters"
        >
          重置筛选条件
        </button>
      </div>
    </div>

    <AffiliateDisclosure variant="inline" />

    <div v-if="filteredBrands.length > 0" class="bd-grid">
      <article v-for="brand in filteredBrands" :key="brand.slug" class="bd-card">
        <div class="bd-card-top">
          <div class="bd-id-wrap">
            <img
              v-if="brand.logo"
              :src="brand.logo"
              :alt="`${brand.name} Logo`"
              class="bd-logo"
              width="40"
              height="40"
              loading="lazy"
            />
            <div>
              <div class="bd-badges">
                <span v-if="brand.isLeadBrand" class="bd-tag is-lead">主推合作</span>
                <span v-else-if="brand.featuredRank" class="bd-tag is-feat">重点 #{{ brand.featuredRank }}</span>
                <span v-if="brand.isAppendedBrand" class="bd-tag is-appended">附录增补</span>
                <span
                  class="bd-status"
                  :style="{
                    color: getStatusMeta(brand.dataStatus).color,
                    backgroundColor: '#0b1220',
                    borderColor: getStatusMeta(brand.dataStatus).border
                  }"
                >
                  {{ getStatusMeta(brand.dataStatus).zhLabel }}
                </span>
              </div>
              <h3 class="bd-name">
                <a :href="`/reviews/${brand.slug}/`">{{ brand.name }}</a>
                <span v-if="brand.englishName" class="bd-en">{{ brand.englishName }}</span>
              </h3>
            </div>
          </div>

          <div class="bd-entry">
            <span class="bd-entry-k">入门参考</span>
            <strong class="bd-entry-v">
              {{ brand.entryLabel || (brand.entryMonthlyCny != null ? `${formatPriceCny(brand.entryMonthlyCny)}/月` : '待核实') }}
            </strong>
          </div>
        </div>

        <p class="bd-pos">{{ brand.positioning || brand.summary || '品牌定位与简介待核实。' }}</p>

        <dl class="bd-specs">
          <div>
            <dt>线路</dt>
            <dd>{{ safeArray(brand.routeTypes).join(' · ') || '待核实' }}</dd>
          </div>
          <div>
            <dt>协议</dt>
            <dd class="bd-mono">{{ safeArray(brand.protocols).join(' / ') || '待核实' }}</dd>
          </div>
          <div>
            <dt>节点</dt>
            <dd>{{ brand.nodeCountLabel || '待核实' }}</dd>
          </div>
          <div>
            <dt>核实日期</dt>
            <dd class="bd-mono">{{ brand.verifiedDate || brand.updatedDate || '待核实' }}</dd>
          </div>
        </dl>

        <div class="bd-card-actions">
          <div class="bd-links">
            <a :href="`/reviews/${brand.slug}/`" class="bd-link-btn">品牌档案</a>
            <a v-if="brand.reviewUrl" :href="brand.reviewUrl" class="bd-link-btn">深度测评</a>
            <a :href="`/compare/?brands=${brand.slug}`" class="bd-link-btn">横向对比</a>
          </div>
          <AffiliateButton
            :brand-slug="brand.slug"
            :brand-name="brand.name"
            label="官网入口"
            size="sm"
            variant="outline"
            :show-disclosure="false"
            source-section="brand_directory"
          />
        </div>
      </article>
    </div>

    <div v-else class="bd-empty">
      <h3>未找到匹配的机场品牌</h3>
      <p>当前搜索关键词或筛选条件组合下没有匹配记录。您可以放宽价格区间、重置协议筛选或前往横向对比工具查看。</p>
      <button type="button" class="bd-reset-btn is-primary" @click="resetFilters">
        查看全部 {{ allBrands.length }} 家品牌
      </button>
    </div>
  </section>
</template>

<style scoped>
.brand-directory {
  margin: 1.25rem 0 2rem;
}

.bd-controls {
  padding: 1rem 1.1rem;
  border-radius: 12px;
  background: #f4f7fb;
  border: 1px solid #dbe4f0;
  display: grid;
  gap: 0.85rem;
}

.bd-search-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.75rem;
}

.bd-filters-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}

.bd-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.bd-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
}

.bd-input,
.bd-select {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.86rem;
}

.bd-summary-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #475569;
  padding-top: 0.35rem;
  border-top: 1px dashed #cbd5e1;
}

.bd-reset-btn {
  padding: 0.32rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f4c81;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.bd-reset-btn.is-primary {
  background: #0f4c81;
  border-color: #0f4c81;
  color: #ffffff;
  padding: 0.5rem 1rem;
}

.bd-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.bd-card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1rem 1.05rem;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}

.bd-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.65rem;
}

.bd-id-wrap {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
}

.bd-logo {
  width: 40px;
  height: 40px;
  border-radius: 9px;
  object-fit: contain;
  background: #f4f7fb;
  border: 1px solid #e2e8f0;
  padding: 3px;
  flex-shrink: 0;
}

.bd-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.25rem;
}

.bd-tag {
  padding: 0.08rem 0.42rem;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 600;
}

.bd-tag.is-lead {
  background: #e0f2fe;
  color: #0369a1;
}

.bd-tag.is-feat {
  background: #f1f5f9;
  color: #334155;
}

.bd-tag.is-appended {
  background: #fef3c7;
  color: #92400e;
}

.bd-status {
  padding: 0.08rem 0.44rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.68rem;
  font-weight: 600;
}

.bd-name {
  margin: 0 !important;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.3;
}

.bd-name a {
  color: #0f172a;
  text-decoration: none;
}

.bd-name a:hover {
  color: #0f4c81;
  text-decoration: underline;
}

.bd-en {
  margin-left: 0.35rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
}

.bd-entry {
  text-align: right;
  flex-shrink: 0;
}

.bd-entry-k {
  display: block;
  font-size: 0.68rem;
  color: #64748b;
}

.bd-entry-v {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.88rem;
  color: #0f4c81;
}

.bd-pos {
  margin: 0;
  font-size: 0.84rem;
  color: #475569;
  line-height: 1.5;
}

.bd-specs {
  margin: 0;
  padding: 0.6rem 0.7rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem 0.6rem;
  font-size: 0.78rem;
}

.bd-specs dt {
  color: #64748b;
  font-size: 0.7rem;
}

.bd-specs dd {
  margin: 0.05rem 0 0;
  color: #1e293b;
  font-weight: 600;
  word-break: break-word;
}

.bd-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.bd-card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
  margin-top: auto;
  padding-top: 0.6rem;
  border-top: 1px solid #e2e8f0;
}

.bd-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.bd-link-btn {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f4c81;
  text-decoration: none;
}

.bd-link-btn:hover {
  text-decoration: underline;
}

.bd-empty {
  margin-top: 1.5rem;
  padding: 2rem 1.25rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  text-align: center;
}

.bd-empty h3 {
  margin: 0 0 0.4rem !important;
  font-size: 1.05rem;
  color: #0f172a;
}

.bd-empty p {
  margin: 0 0 1rem;
  font-size: 0.86rem;
  color: #64748b;
}

@media (max-width: 640px) {
  .bd-search-row {
    grid-template-columns: 1fr;
  }
}

:global(.dark .bd-controls){
  background: #0b1220;
  border-color: #1e2d4a;
}

:global(.dark .bd-label),
:global(.dark .bd-summary-bar),
:global(.dark .bd-en),
:global(.dark .bd-entry-k),
:global(.dark .bd-specs dt){
  color: #94a3b8;
}

:global(.dark .bd-input),
:global(.dark .bd-select){
  background: #131d31;
  border-color: #334155;
  color: #f1f5f9;
}

:global(.dark .bd-summary-bar){
  border-top-color: #1e2d4a;
}

:global(.dark .bd-reset-btn){
  background: #131d31;
  border-color: #334155;
  color: #38bdf8;
}

:global(.dark .bd-reset-btn.is-primary){
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
}

:global(.dark .bd-card){
  background: #131d31;
  border-color: #1e2d4a;
  box-shadow: 0 4px 16px rgba(2, 6, 23, 0.45);
}

:global(.dark .bd-logo){
  background: #f1f5f9;
  border-color: #334155;
}

:global(.dark .bd-tag.is-lead){
  background: rgba(56, 189, 248, 0.18);
  color: #7dd3fc;
}

:global(.dark .bd-tag.is-feat){
  background: #1e293b;
  color: #cbd5e1;
}

:global(.dark .bd-tag.is-appended){
  background: rgba(245, 158, 11, 0.2);
  color: #fde68a;
}

:global(.dark .bd-name a),
:global(.dark .bd-specs dd),
:global(.dark .bd-empty h3){
  color: #f1f5f9;
}

:global(.dark .bd-name a:hover),
:global(.dark .bd-entry-v),
:global(.dark .bd-link-btn){
  color: #38bdf8;
}

:global(.dark .bd-pos),
:global(.dark .bd-empty p){
  color: #cbd5e1;
}

:global(.dark .bd-specs){
  background: #0b1220;
  border-color: #1e2d4a;
}

:global(.dark .bd-card-actions){
  border-top-color: #1e2d4a;
}

:global(.dark .bd-empty){
  background: #131d31;
  border-color: #334155;
}
</style>
