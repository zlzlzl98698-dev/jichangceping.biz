<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

export interface FaqEntry {
  q?: string
  question?: string
  a?: string
  answer?: string
  link?: string
  linkText?: string
}

const props = withDefaults(
  defineProps<{
    items?: FaqEntry[]
    title?: string
  }>(),
  {
    items: undefined,
    title: '常见问题 FAQ'
  }
)

const { frontmatter } = useData()

const normalizedItems = computed(() => {
  const raw = props.items ?? frontmatter.value?.faq
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const obj = item as FaqEntry
      const question = (obj.question || obj.q || '').trim()
      const answer = (obj.answer || obj.a || '').trim()
      if (!question || !answer) return null
      return {
        question,
        answer,
        link: obj.link || '',
        linkText: obj.linkText || '查看延伸说明'
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
})
</script>

<template>
  <section v-if="normalizedItems.length > 0" class="faq-section" aria-labelledby="faq-section-heading">
    <div class="faq-header">
      <span class="faq-kicker">Q&amp;A / GEO VERIFIED</span>
      <h2 id="faq-section-heading" class="faq-title">{{ title }}</h2>
    </div>
    <div class="faq-list">
      <details v-for="(item, idx) in normalizedItems" :key="`${idx}-${item.question}`" class="faq-card" open>
        <summary class="faq-question">
          <span class="faq-q-badge">Q{{ idx + 1 }}</span>
          <span>{{ item.question }}</span>
        </summary>
        <div class="faq-answer-wrap">
          <p class="faq-answer">{{ item.answer }}</p>
          <p v-if="item.link" class="faq-link-row">
            <a :href="item.link" class="faq-link">{{ item.linkText }} →</a>
          </p>
        </div>
      </details>
    </div>
  </section>
</template>

<style scoped>
.faq-section {
  margin: 2rem 0 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.faq-header {
  margin-bottom: 1rem;
}

.faq-kicker {
  display: inline-block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: #0284c7;
  font-weight: 600;
}

.faq-title {
  margin: 0.2rem 0 0 !important;
  padding: 0 !important;
  border: 0 !important;
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a2332;
}

.faq-list {
  display: grid;
  gap: 0.85rem;
}

.faq-card {
  padding: 1rem 1.15rem;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.faq-question {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  margin: 0 !important;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.45;
  list-style: none;
  cursor: pointer;
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question::marker {
  display: none;
  content: '';
}

.faq-answer-wrap {
  margin-top: 0.45rem;
}

.faq-q-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.42rem;
  border-radius: 5px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  font-weight: 700;
  background: #0f4c81;
  color: #ffffff;
  flex-shrink: 0;
  margin-top: 0.12rem;
}

.faq-answer {
  margin: 0;
  color: #334155;
  font-size: 0.92rem;
  line-height: 1.65;
}

.faq-link-row {
  margin: 0.5rem 0 0;
}

.faq-link {
  font-size: 0.84rem;
  font-weight: 600;
  color: #0f4c81;
  text-decoration: none;
}

.faq-link:hover {
  text-decoration: underline;
}

:global(.dark .faq-section){
  border-top-color: #1e2d4a;
}

:global(.dark .faq-kicker){
  color: #38bdf8;
}

:global(.dark .faq-title){
  color: #f1f5f9;
}

:global(.dark .faq-card){
  background: #131d31;
  border-color: #1e2d4a;
}

:global(.dark .faq-question){
  color: #f1f5f9;
}

:global(.dark .faq-q-badge){
  background: #0284c7;
  color: #ffffff;
}

:global(.dark .faq-answer){
  color: #cbd5e1;
}

:global(.dark .faq-link){
  color: #38bdf8;
}
</style>
