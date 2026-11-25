<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

export interface BreadcrumbItem {
  label: string
  link?: string
}

const props = withDefaults(
  defineProps<{
    items?: BreadcrumbItem[]
    currentTitle?: string
  }>(),
  {
    items: undefined,
    currentTitle: ''
  }
)

const route = useRoute()
const { page, frontmatter } = useData()

const SEGMENT_LABELS: Record<string, string> = {
  recommend: '机场推荐',
  rankings: '机场排行',
  plans: '价格与套餐',
  deals: '优惠与折扣码',
  brands: '机场品牌库',
  reviews: '品牌深度测评',
  compare: '品牌横向对比',
  vpn: 'VPN 与加速器',
  clients: '客户端软件',
  'ai-streaming': 'AI 与流媒体',
  network: '线路与节点',
  benchmarks: '测速与性能数据',
  guides: '使用教程',
  knowledge: '网络基础科普',
  troubleshooting: '故障排查',
  risks: '风险与替代',
  methodology: '测评方法论',
  about: '关于实验室',
  stable: '靠谱与稳定机场',
  beginner: '老牌与新手机场',
  'multi-device': '高速与多设备机场',
  database: '套餐价格数据库',
  budget: '便宜与高性价比机场',
  'non-expiring': '不限时与年付套餐',
  archives: '品牌运营档案与风险',
  'vpn-vs-airport': 'VPN 与机场对比',
  platforms: '多平台 VPN 选型',
  'game-booster': '游戏加速器与路由代理',
  compatibility: '客户端兼容性矩阵',
  'ai-tools': 'ChatGPT / Claude / Gemini',
  streaming: 'Netflix / Disney+ / YouTube',
  matrix: '可用性对比矩阵',
  'iepl-vs-iplc': 'IEPL 与 IPLC 专线解析',
  regions: '港/日/台/新/美节点分析',
  subscription: '订阅导入与客户端配置',
  'tun-dns': 'TUN 模式与 DNS 分流',
  'speedtest-guide': '测速方法与避坑指南',
  'subscription-failed': '订阅失败与更新报错',
  'node-timeout': '节点超时与全部不可用',
  'tun-dns-error': 'TUN 异常与 DNS 污染',
  'exit-scam-signals': '机场跑路与异常特征',
  'billing-risks': '年付/不限时/免费风险',
  alternatives: '品牌替代方案'
}

const isHome = computed(() => {
  const path = route.path || '/'
  return path === '/' || path === '/index.html' || frontmatter.value?.layout === 'home'
})

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  if (props.items && props.items.length > 0) return props.items
  if (Array.isArray(frontmatter.value?.breadcrumbs) && frontmatter.value.breadcrumbs.length > 0) {
    return frontmatter.value.breadcrumbs as BreadcrumbItem[]
  }

  const rawPath = (route.path || '/').replace(/\.html$/, '')
  const segments = rawPath.split('/').filter(Boolean)
  const trail: BreadcrumbItem[] = [{ label: '首页', link: '/' }]

  let acc = ''
  segments.forEach((seg, index) => {
    acc += `/${seg}`
    const isLast = index === segments.length - 1
    const fallbackTitle = props.currentTitle || frontmatter.value?.h1 || page.value?.title || seg
    const label = isLast
      ? SEGMENT_LABELS[seg] || String(fallbackTitle)
      : SEGMENT_LABELS[seg] || seg
    trail.push({
      label,
      link: isLast ? undefined : `${acc}/`
    })
  })

  return trail
})
</script>

<template>
  <nav v-if="!isHome && breadcrumbs.length > 1" class="breadcrumb-bar" aria-label="面包屑导航">
    <ol class="bc-list">
      <li v-for="(item, idx) in breadcrumbs" :key="`${idx}-${item.label}`" class="bc-item">
        <a v-if="item.link && idx < breadcrumbs.length - 1" :href="item.link" class="bc-link">
          {{ item.label }}
        </a>
        <span v-else class="bc-current" aria-current="page">{{ item.label }}</span>
        <span v-if="idx < breadcrumbs.length - 1" class="bc-sep" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb-bar {
  margin: 0 0 0.85rem;
  font-size: 0.8rem;
  color: #64748b;
}

.bc-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.bc-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.bc-link {
  color: #475569;
  text-decoration: none;
}

.bc-link:hover {
  color: #0f4c81;
  text-decoration: underline;
}

.bc-current {
  color: #0f172a;
  font-weight: 600;
}

.bc-sep {
  color: #cbd5e1;
}

:global(.dark .breadcrumb-bar){
  color: #94a3b8;
}

:global(.dark .bc-link){
  color: #94a3b8;
}

:global(.dark .bc-link:hover){
  color: #38bdf8;
}

:global(.dark .bc-current){
  color: #f1f5f9;
}

:global(.dark .bc-sep){
  color: #475569;
}
</style>
