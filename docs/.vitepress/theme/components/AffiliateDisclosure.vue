<script setup lang="ts">
import { SITE_CONFIG } from '../../config/site'

withDefaults(
  defineProps<{
    variant?: 'banner' | 'inline' | 'compact'
    text?: string
    showMethodologyLink?: boolean
  }>(),
  {
    variant: 'banner',
    text: '',
    showMethodologyLink: true
  }
)
</script>

<template>
  <aside
    class="aff-disclosure"
    :class="`is-${variant}`"
    role="note"
    aria-label="推广关系披露"
  >
    <span class="aff-disclosure-badge">推广披露</span>
    <span class="aff-disclosure-text">
      {{ text || SITE_CONFIG.disclosureText }}
    </span>
    <span v-if="showMethodologyLink" class="aff-disclosure-links">
      <a href="/methodology/">测评方法论</a>
      <span aria-hidden="true">·</span>
      <a href="/about/">编辑独立性声明</a>
    </span>
  </aside>
</template>

<style scoped>
.aff-disclosure {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.65rem;
  padding: 0.65rem 0.9rem;
  margin: 0.85rem 0;
  border-radius: 8px;
  background: #f4f7fb;
  border: 1px solid #dbe4f0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: #334155;
}

.aff-disclosure.is-inline {
  margin: 0.5rem 0;
  padding: 0.45rem 0.75rem;
  font-size: 0.78rem;
}

.aff-disclosure.is-compact {
  margin: 0.4rem 0 0;
  padding: 0.35rem 0.6rem;
  font-size: 0.75rem;
  background: transparent;
  border-style: dashed;
}

.aff-disclosure-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  background: #e0eef9;
  color: #0f4c81;
  white-space: nowrap;
}

.aff-disclosure-text {
  flex: 1 1 220px;
}

.aff-disclosure-links {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: #64748b;
}

.aff-disclosure-links a {
  color: #0f4c81;
  text-decoration: none;
  font-weight: 500;
}

.aff-disclosure-links a:hover {
  text-decoration: underline;
}
</style>
