<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BrandRecord } from '../../../../data/types'
import brandsRaw from '../../../../data/brands.json'
import * as affModule from '../../../../data/affiliate-links'
import AffiliateButton from './AffiliateButton.vue'
import AffiliateDisclosure from './AffiliateDisclosure.vue'
import {
  findBrand,
  resolveAffiliateFromModule,
  safeArray,
  trackCommercialEvent,
  unwrapList
} from './observatory'

const props = withDefaults(
  defineProps<{
    slug?: string
    brandSlug?: string
    showDisclosure?: boolean
  }>(),
  {
    slug: '',
    brandSlug: '',
    showDisclosure: true
  }
)

const targetSlug = computed(() => (props.brandSlug || props.slug || '').trim())
const brand = computed(() => findBrand(unwrapList<BrandRecord>(brandsRaw), targetSlug.value))
const aff = computed(() => resolveAffiliateFromModule(affModule, targetSlug.value, brand.value?.name))

const couponCode = computed(() => brand.value?.couponCode || aff.value.couponCode || null)
const alternateCouponCode = computed(() => aff.value.alternateCouponCode || null)
const couponDiscount = computed(() => brand.value?.couponDiscount || aff.value.couponDiscount || null)
const couponRestriction = computed(() => brand.value?.couponRestriction || aff.value.couponRestriction || null)

const couponConflicts = computed(() =>
  safeArray(brand.value?.conflicts).filter(
    (c) => c.field.toLowerCase().includes('coupon') || c.field.includes('优惠')
  )
)

const copied = ref(false)

async function copyCode() {
  if (!couponCode.value || typeof navigator === 'undefined') return
  try {
    await navigator.clipboard.writeText(couponCode.value)
    copied.value = true
    trackCommercialEvent('coupon_click', {
      brand_slug: targetSlug.value,
      coupon_code: couponCode.value
    })
    setTimeout(() => {
      copied.value = false
    }, 2200)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <section class="coupon-box" aria-label="优惠码与折扣信息">
    <div class="cb-head">
      <span class="cb-badge">优惠核实信息</span>
      <h4 class="cb-title">{{ brand ? `${brand.name} 优惠码与活动说明` : '优惠码信息' }}</h4>
    </div>

    <div v-if="couponCode" class="cb-body">
      <div class="cb-code-panel">
        <div>
          <div class="cb-label">当前收录优惠码</div>
          <code class="cb-code">{{ couponCode }}</code>
          <span v-if="alternateCouponCode" class="cb-alt-code">
            备用/冲突码：<code>{{ alternateCouponCode }}</code>
          </span>
        </div>
        <button type="button" class="cb-copy-btn" @click="copyCode">
          {{ copied ? '已复制' : '复制优惠码' }}
        </button>
      </div>

      <dl class="cb-details">
        <div>
          <dt>优惠力度</dt>
          <dd>{{ couponDiscount || '待核实（结账页自动显示）' }}</dd>
        </div>
        <div>
          <dt>适用条件</dt>
          <dd>{{ couponRestriction || '通常限指定套餐或新用户首单，请以结算页面为准' }}</dd>
        </div>
      </dl>

      <div v-if="couponConflicts.length > 0" class="cb-conflict">
        <strong>资料冲突提醒：</strong>
        <span v-for="(c, i) in couponConflicts" :key="i">
          不同来源存在差异（{{ c.primaryValue }} vs {{ c.conflictingValue }}）：{{ c.note }}
        </span>
      </div>

      <div class="cb-cta">
        <AffiliateButton
          :brand-slug="targetSlug"
          :brand-name="brand?.name"
          label="前往官网使用优惠码"
          size="sm"
          :show-disclosure="false"
          source-section="coupon_box"
        />
      </div>
    </div>

    <div v-else class="cb-empty">
      <p>当前资料库暂无该品牌的专属优惠码记录（部分年付/长周期套餐可能自带官网阶梯折扣，实际价格以官方结算页为准）。</p>
      <AffiliateButton
        v-if="targetSlug"
        :brand-slug="targetSlug"
        :brand-name="brand?.name"
        label="核实官网最新活动"
        variant="outline"
        size="sm"
        :show-disclosure="false"
        source-section="coupon_box_empty"
      />
    </div>

    <AffiliateDisclosure v-if="showDisclosure" variant="compact" />
  </section>
</template>

<style scoped>
.coupon-box {
  margin: 1.25rem 0;
  padding: 1rem 1.15rem;
  border-radius: 10px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #1e293b;
}

.cb-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.cb-badge {
  padding: 0.12rem 0.48rem;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.cb-title {
  margin: 0 !important;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.cb-code-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  background: #ffffff;
  border: 1px dashed #f59e0b;
}

.cb-label {
  font-size: 0.72rem;
  color: #64748b;
}

.cb-code {
  display: inline-block;
  margin-top: 0.15rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.15rem;
  font-weight: 700;
  color: #b45309;
  background: transparent;
  padding: 0;
}

.cb-alt-code {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #64748b;
}

.cb-copy-btn {
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  border: 1px solid #d97706;
  background: #f59e0b;
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.cb-copy-btn:hover {
  background: #d97706;
}

.cb-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.65rem;
  margin: 0.75rem 0;
  font-size: 0.84rem;
}

.cb-details dt {
  font-size: 0.74rem;
  color: #64748b;
}

.cb-details dd {
  margin: 0.12rem 0 0;
  font-weight: 600;
  color: #1e293b;
}

.cb-conflict {
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  color: #9f1239;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

.cb-cta {
  margin-top: 0.6rem;
}

.cb-empty p {
  margin: 0 0 0.65rem;
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.55;
}

:global(.dark .coupon-box){
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.35);
  color: #f1f5f9;
}

:global(.dark .cb-badge){
  background: rgba(245, 158, 11, 0.22);
  border-color: rgba(251, 191, 36, 0.45);
  color: #fde68a;
}

:global(.dark .cb-title){
  color: #f8fafc;
}

:global(.dark .cb-code-panel){
  background: #131d31;
  border-color: rgba(245, 158, 11, 0.55);
}

:global(.dark .cb-label),
:global(.dark .cb-alt-code),
:global(.dark .cb-details dt){
  color: #94a3b8;
}

:global(.dark .cb-code){
  color: #fbbf24;
}

:global(.dark .cb-details dd){
  color: #f1f5f9;
}

:global(.dark .cb-copy-btn){
  background: #d97706;
  border-color: #f59e0b;
  color: #ffffff;
}

:global(.dark .cb-copy-btn:hover){
  background: #b45309;
}

:global(.dark .cb-conflict){
  background: rgba(244, 63, 94, 0.14);
  border-color: rgba(244, 63, 94, 0.38);
  color: #fecdd3;
}

:global(.dark .cb-empty p){
  color: #cbd5e1;
}
</style>
