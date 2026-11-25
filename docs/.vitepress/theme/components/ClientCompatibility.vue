<script setup lang="ts">
import { computed } from 'vue'
import type { BrandRecord, ClientSoftwareRecord } from '../../../../data/types'
import compatRaw from '../../../../data/client-compatibility.json'
import clientsRaw from '../../../../data/clients.json'
import brandsRaw from '../../../../data/brands.json'
import WatermarkedChartFrame from './WatermarkedChartFrame.vue'
import { findBrand, safeArray, unwrapList } from './observatory'

const props = withDefaults(
  defineProps<{
    slug?: string
    brandSlug?: string
  }>(),
  {
    slug: '',
    brandSlug: ''
  }
)

const targetSlug = computed(() => (props.brandSlug || props.slug || '').trim())
const brand = computed(() => findBrand(unwrapList<BrandRecord>(brandsRaw), targetSlug.value))
const allClients = computed(() => unwrapList<ClientSoftwareRecord>(clientsRaw))

const compatRecord = computed(() => {
  const list = unwrapList<Record<string, unknown>>(compatRaw)
  return list.find((r) => (r.brandSlug || r.slug) === targetSlug.value)
})

const compatibleClients = computed(() => {
  const mode = compatRecord.value?.clientMode || brand.value?.clientMode
  if (mode === 'exclusive-only' && compatRecord.value?.supportsThirdPartySubscription === false) return []

  const explicitSlugs = (compatRecord.value?.compatibleClientSlugs ||
    compatRecord.value?.clients ||
    compatRecord.value?.supportedClients ||
    compatRecord.value?.clientSlugs) as string[] | undefined

  if (Array.isArray(explicitSlugs) && explicitSlugs.length > 0) {
    const set = new Set(explicitSlugs.map((s) => s.toLowerCase()))
    const matched = allClients.value.filter(
      (c) => set.has(c.slug.toLowerCase()) || set.has(c.name.toLowerCase())
    )
    if (matched.length > 0) return matched
  }

  // Match by protocol intersection if third-party subscription is supported
  const brandProtos = safeArray(brand.value?.protocols).map((p) => p.toLowerCase())
  if (brandProtos.length === 0) return allClients.value.slice(0, 8)
  return allClients.value
    .filter((c) => {
      const cProtos = safeArray(c.protocols).map((p) => p.toLowerCase())
      return brandProtos.some((bp) => cProtos.some((cp) => cp.includes(bp) || bp.includes(cp)))
    })
    .slice(0, 10)
})

const modeSummary = computed(() => {
  switch (brand.value?.clientMode) {
    case 'self-hosted-and-third-party':
      return '同时提供官方自研客户端与第三方通用订阅导入（如 Clash Verge Rev / v2rayN / Shadowrocket）。'
    case 'exclusive-only':
      return '仅支持官方专属/自研客户端登录使用，不支持直接导出 Clash/Shadowrocket 等第三方通用订阅。'
    case 'third-party':
      return '主要通过第三方通用客户端订阅链接接入（Clash / Mihomo / sing-box / Shadowrocket 等）。'
    default:
      return '客户端接入形态待进一步核实。'
  }
})
</script>

<template>
  <WatermarkedChartFrame
    title="代理客户端与操作系统兼容性矩阵"
    subtitle="Client & Platform Compatibility（区分自研客户端与第三方订阅支持）"
    :brand-name="brand?.name"
    :accent-color="brand?.accentColor"
    :data-status="String(compatRecord?.dataStatus || brand?.dataStatus || 'Vendor Data')"
    :tested-at="brand?.verifiedDate || brand?.updatedDate"
    source-label="client-compatibility.json + clients.json"
  >
    <div class="cc-mode-banner">
      <div class="cc-mode-title">接入方式判定</div>
      <p class="cc-mode-text">{{ modeSummary }}</p>
      <p v-if="brand?.clientNotes" class="cc-mode-note">备注：{{ brand.clientNotes }}</p>
    </div>

    <div v-if="brand?.clientMode === 'exclusive-only'" class="cc-exclusive-warn">
      注意：该品牌资料显示为专属客户端模式，无法直接导入 Clash / Shadowrocket / v2rayNG 等第三方软件，多平台需求或软路由用户购买前请务必确认官方支持的系统版本。
    </div>

    <div v-else-if="compatibleClients.length > 0" class="cc-grid">
      <article v-for="client in compatibleClients" :key="client.slug" class="cc-card">
        <div class="cc-card-head">
          <a v-if="client.docUrl" :href="client.docUrl" class="cc-name-link">{{ client.name }}</a>
          <strong v-else class="cc-name">{{ client.name }}</strong>
          <span class="cc-engine">{{ client.coreEngine }}</span>
        </div>
        <div class="cc-os-list">
          <span v-for="os in safeArray(client.os)" :key="os" class="cc-os-tag">{{ os }}</span>
        </div>
        <div class="cc-meta">
          <span>定位：{{ client.category }}</span>
          <span>状态：{{ client.maintenanceStatus }}</span>
        </div>
        <p v-if="safeArray(client.warnings).length > 0" class="cc-warn">
          {{ client.warnings[0] }}
        </p>
      </article>
    </div>

    <div v-else class="cc-empty">
      暂无匹配的第三方客户端兼容性记录（待核实）。
    </div>
  </WatermarkedChartFrame>
</template>

<style scoped>
.cc-mode-banner {
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  background: rgba(19, 29, 49, 0.9);
  border: 1px solid #1e2d4a;
  margin-bottom: 0.9rem;
}

.cc-mode-title {
  font-size: 0.76rem;
  font-weight: 700;
  color: #7dd3fc;
  margin-bottom: 0.25rem;
}

.cc-mode-text {
  margin: 0;
  font-size: 0.85rem;
  color: #f8fafc;
  line-height: 1.5;
}

.cc-mode-note {
  margin: 0.35rem 0 0;
  font-size: 0.78rem;
  color: #94a3b8;
}

.cc-exclusive-warn {
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.35);
  color: #fde68a;
  font-size: 0.82rem;
  line-height: 1.55;
}

.cc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.65rem;
}

.cc-card {
  padding: 0.72rem 0.85rem;
  border-radius: 8px;
  background: rgba(19, 29, 49, 0.85);
  border: 1px solid #1e2d4a;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cc-card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.4rem;
}

.cc-name-link,
.cc-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f8fafc;
  text-decoration: none;
}

.cc-name-link:hover {
  color: #38bdf8;
  text-decoration: underline;
}

.cc-engine {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  color: #7dd3fc;
}

.cc-os-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.cc-os-tag {
  padding: 0.08rem 0.4rem;
  border-radius: 4px;
  font-size: 0.69rem;
  background: #17253e;
  color: #cbd5e1;
}

.cc-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.cc-warn {
  margin: 0.2rem 0 0;
  font-size: 0.72rem;
  color: #fcd34d;
  line-height: 1.45;
}

.cc-empty {
  font-size: 0.84rem;
  color: #94a3b8;
}
</style>
