<script setup lang="ts">
import { computed } from 'vue'
import type { BrandRecord } from '../../../../data/types'
import routesRaw from '../../../../data/network-routes.json'
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

const routeRecord = computed(() => {
  const list = unwrapList<Record<string, unknown>>(routesRaw)
  return list.find((r) => (r.brandSlug || r.slug) === targetSlug.value)
})

const protocolsLabel = computed(() => {
  const fromRoute = routeRecord.value?.protocols as string[] | undefined
  const list = fromRoute && fromRoute.length > 0 ? fromRoute : safeArray(brand.value?.protocols)
  return list.length > 0 ? list.slice(0, 3).join(' / ') : '加密协议待核实'
})

const transitLabel = computed(() => {
  if (routeRecord.value?.entryDescription) return String(routeRecord.value.entryDescription)
  const rt = safeArray(brand.value?.routeTypes)
  if (rt.some((x) => /IEPL|IPLC|专线/i.test(x))) return '境内 BGP 中转入口'
  if (rt.some((x) => /中转|隧道/i.test(x))) return '加密隧道中转入口'
  return '接入入口（待核实）'
})

const backboneLabel = computed(() => {
  if (routeRecord.value?.backboneType) return String(routeRecord.value.backboneType)
  const rt = safeArray(brand.value?.routeTypes)
  return rt.length > 0 ? rt.join(' / ') : '链路类型待核实'
})

const regionsLabel = computed(() => {
  const regs = safeArray(brand.value?.regions)
  return regs.length > 0 ? regs.slice(0, 4).join(' · ') : '落地地区待核实'
})

const isVerifiedTopology = computed(() => {
  const steps = routeRecord.value?.topologySteps as Array<Record<string, unknown>> | undefined
  if (Array.isArray(steps) && steps.some((s) => s.isDiagramOnly === true)) return false
  return Boolean(routeRecord.value?.verifiedTopology === true)
})

const topologySteps = computed(() => {
  const steps = routeRecord.value?.topologySteps
  return Array.isArray(steps) ? (steps as Array<Record<string, unknown>>) : []
})
</script>

<template>
  <WatermarkedChartFrame
    title="网络传输路径与线路架构图"
    :subtitle="isVerifiedTopology ? 'Network Path Observatory（已核实路径说明）' : 'Network Path Observatory（原理示意 · 依据公开资料整理，非内网抓包确认）'"
    :brand-name="brand?.name"
    :accent-color="brand?.accentColor"
    :data-status="String(routeRecord?.dataStatus || brand?.dataStatus || 'Vendor Data')"
    :tested-at="brand?.verifiedDate || brand?.updatedDate"
    source-label="network-routes.json + 品牌公开说明"
  >
    <div v-if="!isVerifiedTopology" class="nt-notice">
      <span class="nt-notice-badge">原理示意</span>
      <span>
        线路类型（如 IEPL / IPLC / 中转）源自服务商公开说明或历史文档，公网出口 IP 无法独立证明完整物理跨境路由。
      </span>
    </div>

    <div class="nt-svg-wrap">
      <svg
        class="nt-svg"
        viewBox="0 0 760 190"
        role="img"
        :aria-label="`${brand?.name || '代理'} 网络传输路径示意图`"
      >
        <defs>
          <marker id="obs-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
          </marker>
        </defs>

        <!-- Node 1: User Device -->
        <rect x="12" y="48" width="142" height="84" rx="10" fill="#131d31" stroke="#334155" stroke-width="1.5" />
        <text x="83" y="76" text-anchor="middle" fill="#7dd3fc" font-size="11" font-family="ui-monospace, monospace">CLIENT EDGE</text>
        <text x="83" y="96" text-anchor="middle" fill="#f8fafc" font-size="13.5" font-weight="600">用户终端设备</text>
        <text x="83" y="116" text-anchor="middle" fill="#94a3b8" font-size="11">Win / macOS / iOS / Android</text>

        <!-- Arrow 1 -->
        <line x1="154" y1="90" x2="214" y2="90" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#obs-arrow)" />
        <text x="184" y="78" text-anchor="middle" fill="#94a3b8" font-size="10.5">{{ protocolsLabel }}</text>

        <!-- Node 2: Transit / Entry -->
        <rect x="218" y="48" width="154" height="84" rx="10" fill="#131d31" stroke="#0284c7" stroke-width="1.5" />
        <text x="295" y="76" text-anchor="middle" fill="#7dd3fc" font-size="11" font-family="ui-monospace, monospace">INGRESS / TRANSIT</text>
        <text x="295" y="96" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="600">{{ transitLabel }}</text>
        <text x="295" y="116" text-anchor="middle" fill="#94a3b8" font-size="11">隐藏落地真实 IP · 流量加密</text>

        <!-- Arrow 2: Dedicated / Backbone -->
        <line x1="372" y1="90" x2="452" y2="90" stroke="#34d399" stroke-width="3.5" marker-end="url(#obs-arrow)" />
        <text x="412" y="76" text-anchor="middle" fill="#6ee7b7" font-size="11" font-weight="600">{{ backboneLabel }}</text>
        <text x="412" y="109" text-anchor="middle" fill="#94a3b8" font-size="10">跨境传输通道</text>

        <!-- Node 3: Overseas Landing -->
        <rect x="456" y="48" width="148" height="84" rx="10" fill="#131d31" stroke="#34d399" stroke-width="1.5" />
        <text x="530" y="76" text-anchor="middle" fill="#6ee7b7" font-size="11" font-family="ui-monospace, monospace">EXIT NODES</text>
        <text x="530" y="96" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="600">海外落地节点</text>
        <text x="530" y="116" text-anchor="middle" fill="#94a3b8" font-size="10.5">{{ regionsLabel }}</text>

        <!-- Arrow 3 -->
        <line x1="604" y1="90" x2="640" y2="90" stroke="#38bdf8" stroke-width="2" marker-end="url(#obs-arrow)" />

        <!-- Node 4: Target Services -->
        <rect x="644" y="48" width="104" height="84" rx="10" fill="#131d31" stroke="#475569" stroke-width="1.5" />
        <text x="696" y="76" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="ui-monospace, monospace">DEST</text>
        <text x="696" y="96" text-anchor="middle" fill="#f8fafc" font-size="12.5" font-weight="600">AI / 流媒体</text>
        <text x="696" y="116" text-anchor="middle" fill="#94a3b8" font-size="10.5">常规互联网</text>
      </svg>
    </div>

    <div class="nt-facts">
      <div class="nt-fact">
        <span class="nt-fk">声称线路</span>
        <span class="nt-fv">{{ routeRecord?.architectureType || backboneLabel }}</span>
      </div>
      <div class="nt-fact">
        <span class="nt-fk">传输协议</span>
        <span class="nt-fv nt-mono">{{ protocolsLabel }}</span>
      </div>
      <div class="nt-fact">
        <span class="nt-fk">带宽 / IP 声明</span>
        <span class="nt-fv">
          {{ [routeRecord?.bandwidthClaim, routeRecord?.ipTypeClaim].filter(Boolean).join(' · ') || '请以套餐及节点说明为准' }}
        </span>
      </div>
    </div>

    <ol v-if="topologySteps.length > 0" class="nt-steps">
      <li v-for="(step, idx) in topologySteps" :key="idx" class="nt-step">
        <span class="nt-step-stage">{{ step.stage || `STEP ${idx + 1}` }}</span>
        <strong>{{ step.label }}</strong>
        <span class="nt-step-detail">{{ step.detail }}</span>
      </li>
    </ol>
  </WatermarkedChartFrame>
</template>

<style scoped>
.nt-notice {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.65rem;
  padding: 0.55rem 0.75rem;
  margin-bottom: 0.85rem;
  border-radius: 8px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.32);
  font-size: 0.78rem;
  color: #fde68a;
}

.nt-notice-badge {
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  background: rgba(251, 191, 36, 0.22);
  color: #fef3c7;
  font-weight: 700;
  font-size: 0.72rem;
}

.nt-svg-wrap {
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.nt-svg {
  min-width: 620px;
  width: 100%;
  height: auto;
  display: block;
}

.nt-facts {
  margin-top: 0.85rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.65rem;
}

.nt-fact {
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: rgba(19, 29, 49, 0.85);
  border: 1px solid #1e2d4a;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.nt-fk {
  font-size: 0.72rem;
  color: #94a3b8;
}

.nt-fv {
  font-size: 0.82rem;
  color: #f8fafc;
  font-weight: 500;
}

.nt-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.nt-steps {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.55rem;
}

.nt-step {
  padding: 0.5rem 0.65rem;
  border-radius: 7px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid #1e2d4a;
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
  font-size: 0.76rem;
}

.nt-step-stage {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.66rem;
  color: #38bdf8;
}

.nt-step strong {
  color: #f8fafc;
}

.nt-step-detail {
  color: #94a3b8;
  line-height: 1.4;
}
</style>
