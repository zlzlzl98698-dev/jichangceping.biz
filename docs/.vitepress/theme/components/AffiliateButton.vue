<script setup lang="ts">
import { computed } from 'vue'
import * as affModule from '../../../../data/affiliate-links'
import AffiliateDisclosure from './AffiliateDisclosure.vue'
import { resolveAffiliateFromModule, trackCommercialEvent } from './observatory'

const props = withDefaults(
  defineProps<{
    slug?: string
    brandSlug?: string
    brandName?: string
    label?: string
    variant?: 'primary' | 'secondary' | 'outline' | 'dark'
    size?: 'sm' | 'md' | 'lg'
    showDisclosure?: boolean
    sourceSection?: string
  }>(),
  {
    slug: '',
    brandSlug: '',
    brandName: '',
    label: '',
    variant: 'primary',
    size: 'md',
    showDisclosure: true,
    sourceSection: 'article'
  }
)

const targetSlug = computed(() => (props.brandSlug || props.slug || '').trim())

const resolved = computed(() =>
  resolveAffiliateFromModule(affModule, targetSlug.value, props.brandName)
)

const buttonText = computed(() => {
  if (props.label) return props.label
  const name = props.brandName || resolved.value.brandName
  return name ? `前往 ${name} 官网注册` : '前往官网注册'
})

function onAffClick() {
  trackCommercialEvent('affiliate_click', {
    brand_slug: targetSlug.value,
    brand_name: props.brandName || resolved.value.brandName,
    source_section: props.sourceSection,
    target_url: resolved.value.url || ''
  })
}
</script>

<template>
  <div class="aff-btn-wrapper">
    <div class="aff-btn-row">
      <a
        v-if="resolved.url"
        :href="resolved.url"
        target="_blank"
        rel="nofollow sponsored noopener"
        class="aff-btn"
        :class="[`is-${variant}`, `is-${size}`]"
        @click="onAffClick"
      >
        <span>{{ buttonText }}</span>
        <span class="aff-btn-arrow" aria-hidden="true">↗</span>
      </a>
      <a
        v-else-if="targetSlug"
        :href="`/reviews/${targetSlug}/`"
        class="aff-btn is-outline"
        :class="`is-${size}`"
      >
        <span>查看 {{ brandName || targetSlug }} 资料（推广入口待核实）</span>
      </a>
      <span v-else class="aff-btn is-disabled" :class="`is-${size}`">
        官方注册入口待核实
      </span>

      <span v-if="resolved.couponCode" class="aff-btn-coupon" title="可用优惠码">
        优惠码：<code>{{ resolved.couponCode }}</code>
      </span>
    </div>

    <p v-if="resolved.urlFormatWarning" class="aff-btn-note is-warn">
      链接提示：{{ resolved.urlFormatWarning }}
    </p>
    <p v-else-if="resolved.note" class="aff-btn-note">
      {{ resolved.note }}
    </p>

    <AffiliateDisclosure v-if="showDisclosure" variant="compact" :show-methodology-link="false" />
  </div>
</template>

<style scoped>
.aff-btn-wrapper {
  display: inline-flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 100%;
}

.aff-btn-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.aff-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none !important;
  cursor: pointer;
  transition: transform 0.14s ease, box-shadow 0.14s ease, background-color 0.14s ease;
  border: 1px solid transparent;
  line-height: 1.25;
}

.aff-btn.is-sm {
  padding: 0.42rem 0.85rem;
  font-size: 0.82rem;
}

.aff-btn.is-md {
  padding: 0.6rem 1.15rem;
  font-size: 0.92rem;
}

.aff-btn.is-lg {
  padding: 0.78rem 1.45rem;
  font-size: 1rem;
}

.aff-btn.is-primary {
  background: #0f4c81;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(15, 76, 129, 0.22);
}

.aff-btn.is-primary:hover {
  background: #0b3a63;
  transform: translateY(-1px);
}

.aff-btn.is-secondary {
  background: #0284c7;
  color: #ffffff !important;
}

.aff-btn.is-secondary:hover {
  background: #0369a1;
}

.aff-btn.is-outline {
  background: #ffffff;
  color: #0f4c81 !important;
  border-color: #0f4c81;
}

.aff-btn.is-outline:hover {
  background: #f0f7ff;
}

.aff-btn.is-dark {
  background: #131d31;
  color: #38bdf8 !important;
  border-color: #1e3a5f;
}

.aff-btn.is-dark:hover {
  background: #1a2944;
  border-color: #38bdf8;
}

.aff-btn.is-disabled {
  background: #e2e8f0;
  color: #64748b;
  cursor: not-allowed;
}

.aff-btn-arrow {
  font-size: 0.9em;
}

.aff-btn-coupon {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.28rem 0.6rem;
  border-radius: 6px;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  color: #92400e;
  font-size: 0.8rem;
  font-weight: 500;
}

.aff-btn-coupon code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 700;
  color: #78350f;
  background: transparent;
  padding: 0;
}

.aff-btn-note {
  margin: 0;
  font-size: 0.76rem;
  color: #64748b;
}

.aff-btn-note.is-warn {
  color: #b45309;
}
</style>
