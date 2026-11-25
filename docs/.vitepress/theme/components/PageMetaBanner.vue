<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { SITE_CONFIG } from '../../config/site'
import { getStatusMeta } from './observatory'

const props = withDefaults(
  defineProps<{
    author?: string
    reviewer?: string
    pubDate?: string
    updatedDate?: string
    verifiedDate?: string
    dataStatus?: string
    sourceNote?: string
  }>(),
  {
    author: '',
    reviewer: '',
    pubDate: '',
    updatedDate: '',
    verifiedDate: '',
    dataStatus: '',
    sourceNote: ''
  }
)

const { frontmatter } = useData()

const isHidden = computed(
  () => frontmatter.value?.layout === 'home' || frontmatter.value?.hideMetaBanner === true
)

const resolvedAuthor = computed(
  () => props.author || frontmatter.value?.author || SITE_CONFIG.editorialAuthor
)
const resolvedReviewer = computed(
  () => props.reviewer || frontmatter.value?.reviewer || SITE_CONFIG.editorialReviewer
)
function formatDate(val: unknown): string {
  if (!val) return ''
  if (val instanceof Date && !Number.isNaN(val.getTime())) {
    return val.toISOString().slice(0, 10)
  }
  const str = String(val).trim()
  const isoMatch = str.match(/^(\d{4}-\d{2}-\d{2})T/)
  return isoMatch ? isoMatch[1] : str
}

const resolvedPubDate = computed(() =>
  formatDate(props.pubDate || frontmatter.value?.pubDate || frontmatter.value?.date)
)
const resolvedUpdatedDate = computed(() =>
  formatDate(props.updatedDate || frontmatter.value?.updatedDate)
)
const resolvedVerifiedDate = computed(() =>
  formatDate(props.verifiedDate || frontmatter.value?.verifiedDate)
)
const resolvedStatus = computed(
  () => props.dataStatus || frontmatter.value?.dataStatus || ''
)
const resolvedSourceNote = computed(
  () => props.sourceNote || frontmatter.value?.sourceNote || ''
)

const statusMeta = computed(() =>
  resolvedStatus.value ? getStatusMeta(String(resolvedStatus.value)) : null
)
</script>

<template>
  <div v-if="!isHidden" class="page-meta-banner" aria-label="页面编审与数据核实信息">
    <div class="pmb-grid">
      <div class="pmb-item">
        <img
          src="/images/avatar.webp"
          alt="机场测评实验室头像"
          class="pmb-avatar"
          width="22"
          height="22"
        />
        <span class="pmb-label">作者</span>
        <span class="pmb-val">{{ resolvedAuthor }}</span>
      </div>
      <div class="pmb-item">
        <span class="pmb-label">技术审核</span>
        <span class="pmb-val">{{ resolvedReviewer }}</span>
      </div>
      <div v-if="resolvedPubDate" class="pmb-item">
        <span class="pmb-label">发布日期</span>
        <time class="pmb-val pmb-mono" :datetime="String(resolvedPubDate)">{{ resolvedPubDate }}</time>
      </div>
      <div v-if="resolvedUpdatedDate" class="pmb-item">
        <span class="pmb-label">更新日期</span>
        <time class="pmb-val pmb-mono" :datetime="String(resolvedUpdatedDate)">{{ resolvedUpdatedDate }}</time>
      </div>
      <div v-if="resolvedVerifiedDate" class="pmb-item">
        <span class="pmb-label">资料核实</span>
        <time class="pmb-val pmb-mono" :datetime="String(resolvedVerifiedDate)">{{ resolvedVerifiedDate }}</time>
      </div>
      <div v-if="statusMeta" class="pmb-item pmb-status-item">
        <span class="pmb-label">数据状态</span>
        <span
          class="pmb-badge"
          :style="{
            color: statusMeta.color,
            backgroundColor: '#0b1220',
            borderColor: statusMeta.border
          }"
        >
          <span class="pmb-dot" :style="{ backgroundColor: statusMeta.color }" />
          {{ statusMeta.zhLabel }} ({{ statusMeta.enTag }})
        </span>
      </div>
    </div>
    <p v-if="resolvedSourceNote" class="pmb-note">
      资料说明：{{ resolvedSourceNote }}
    </p>
  </div>
</template>

<style scoped>
.page-meta-banner {
  margin: 0 0 1.4rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  background: #f4f7fb;
  border: 1px solid #dbe4f0;
  color: #1a2332;
  font-size: 0.82rem;
}

.pmb-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem 1.2rem;
}

.pmb-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.pmb-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #cbd5e1;
  flex-shrink: 0;
}

.pmb-label {
  color: #64748b;
  font-weight: 500;
}

.pmb-val {
  color: #1a2332;
  font-weight: 600;
}

.pmb-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.78rem;
}

.pmb-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.16rem 0.55rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.74rem;
  font-weight: 600;
}

.pmb-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.pmb-note {
  margin: 0.5rem 0 0;
  padding-top: 0.45rem;
  border-top: 1px dashed #cbd5e1;
  color: #475569;
  font-size: 0.78rem;
  line-height: 1.5;
}

:global(.dark .page-meta-banner){
  background: #131d31;
  border-color: #1e2d4a;
  color: #e2e8f0;
}

:global(.dark .pmb-label){
  color: #94a3b8;
}

:global(.dark .pmb-val){
  color: #f1f5f9;
}

:global(.dark .pmb-note){
  border-top-color: #334155;
  color: #cbd5e1;
}
</style>
