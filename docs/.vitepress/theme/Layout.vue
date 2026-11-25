<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BreadcrumbBar from './components/BreadcrumbBar.vue'
import FaqSection from './components/FaqSection.vue'
import PageMetaBanner from './components/PageMetaBanner.vue'

const { Layout } = DefaultTheme
const { frontmatter, page } = useData()

const shouldRenderAutoFaq = computed(() => {
  if (frontmatter.value?.hideAutoFaq === true) {
    return false
  }
  const hasFaqData = Array.isArray(frontmatter.value?.faq) && frontmatter.value.faq.length > 0
  if (!hasFaqData) {
    return false
  }
  const headers = Array.isArray(page.value?.headers) ? page.value.headers : []
  const hasMarkdownFaqHeading = headers.some((h) =>
    /faq|常见问题/i.test(String(h?.title || ''))
  )
  return !hasMarkdownFaqHeading
})
</script>

<template>
  <Layout>
    <template #doc-before>
      <BreadcrumbBar />
      <PageMetaBanner />
    </template>

    <template #doc-footer-before>
      <FaqSection v-if="shouldRenderAutoFaq" />
    </template>
  </Layout>
</template>
