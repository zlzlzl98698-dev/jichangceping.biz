<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vitepress'
import type { BenchmarkBatchRecord, BrandRecord, ClientSoftwareRecord, PlanItem } from '../../../../data/types'
import { SITE_CONFIG } from '../../config/site'
import brandsRaw from '../../../../data/brands.json'
import plansRaw from '../../../../data/plans.json'
import benchmarksRaw from '../../../../data/benchmarks.json'
import clientsRaw from '../../../../data/clients.json'
import AffiliateButton from './AffiliateButton.vue'
import AffiliateDisclosure from './AffiliateDisclosure.vue'
import { formatPriceCny, getStatusMeta, safeArray, unwrapList } from './observatory'

const router = useRouter()

const brands = computed(() => unwrapList<BrandRecord>(brandsRaw))
const plans = computed(() => unwrapList<PlanItem>(plansRaw))
const benchmarks = computed(() => unwrapList<BenchmarkBatchRecord>(benchmarksRaw))
const clients = computed(() => unwrapList<ClientSoftwareRecord>(clientsRaw))

const quickQuery = ref('')

function submitQuickSearch() {
  const q = quickQuery.value.trim()
  const target = q ? `/brands/?q=${encodeURIComponent(q)}` : '/brands/'
  router.go(target)
}

const leadBrand = computed(
  () =>
    brands.value.find((b) => b.isLeadBrand || b.slug === SITE_CONFIG.leadBrandSlug) ||
    brands.value[0]
)

const leadPlans = computed(() =>
  leadBrand.value ? plans.value.filter((p) => p.brandSlug === leadBrand.value?.slug).slice(0, 4) : []
)

const featuredBrands = computed(() =>
  brands.value
    .filter((b) => b.featuredRank !== null && b.featuredRank !== undefined)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99))
    .slice(0, 11)
)

const screenshotBatchCount = computed(
  () => benchmarks.value.filter((b) => b.batchType === 'screenshot-evidence').length
)

const budgetPlans = computed(() =>
  [...plans.value]
    .filter((p) => p.priceCny > 0)
    .sort((a, b) => (a.effectiveMonthlyCny ?? a.priceCny) - (b.effectiveMonthlyCny ?? b.priceCny))
    .slice(0, 6)
)

const topClients = computed(() => clients.value.slice(0, 6))

const TOP_CATEGORIES = [
  {
    title: '机场推荐',
    link: '/recommend/',
    desc: '按稳定性、新手友好、多设备与性价比分类推荐，分离商业合作与客观维度。',
    sub: [
      { text: '2026 机场排行', link: '/rankings/' },
      { text: '稳定机场指南', link: '/recommend/stable/' }
    ]
  },
  {
    title: '价格与套餐',
    link: '/plans/',
    desc: '区分月付、年付总额与折算月均，计算真实单 GB 流量成本。',
    sub: [
      { text: '套餐价格库', link: '/plans/database/' },
      { text: '优惠与折扣码', link: '/deals/' }
    ]
  },
  {
    title: '机场品牌库',
    link: '/brands/',
    desc: '覆盖 31 家去重品牌的协议、线路、支付、冲突记录与核实日期。',
    sub: [
      { text: '品牌深度测评', link: '/reviews/' },
      { text: '多品牌对比', link: '/compare/' }
    ]
  },
  {
    title: 'VPN 与加速器',
    link: '/vpn/',
    desc: '对比传统商业 VPN、游戏加速器与机场代理架构的本质差异。',
    sub: [
      { text: 'VPN 与机场对比', link: '/vpn/vpn-vs-airport/' },
      { text: '游戏加速器', link: '/vpn/game-booster/' }
    ]
  },
  {
    title: '客户端软件',
    link: '/clients/',
    desc: 'Clash Verge Rev、v2rayN、Shadowrocket、FlClash、sing-box 全平台指南。',
    sub: [
      { text: '兼容性矩阵', link: '/clients/compatibility/' },
      { text: 'Clash Verge Rev', link: '/clients/clash-verge-rev/' }
    ]
  },
  {
    title: 'AI 与流媒体',
    link: '/ai-streaming/',
    desc: '核实 ChatGPT、Claude、Gemini、Netflix、Disney+ 与 YouTube 节点兼容性。',
    sub: [
      { text: 'AI 工具访问', link: '/ai-streaming/ai-tools/' },
      { text: '可用性矩阵', link: '/ai-streaming/matrix/' }
    ]
  },
  {
    title: '线路与节点',
    link: '/network/',
    desc: '解析 IEPL/IPLC 专线、BGP 中转、倍率规则及港/日/台/新/美节点表现。',
    sub: [
      { text: 'IEPL vs IPLC', link: '/network/iepl-vs-iplc/' },
      { text: '测速证据中心', link: '/benchmarks/' }
    ]
  },
  {
    title: '使用教程',
    link: '/guides/',
    desc: '从订阅导入、TUN 模式、DNS 分流到正确测速方法的分步指引。',
    sub: [
      { text: '订阅导入教程', link: '/guides/subscription/' },
      { text: 'TUN 与 DNS', link: '/guides/tun-dns/' }
    ]
  },
  {
    title: '故障排查',
    link: '/troubleshooting/',
    desc: '订阅拉取失败、节点超时、全部不可用与 DNS 污染快速定位。',
    sub: [
      { text: '订阅报错排查', link: '/troubleshooting/subscription-failed/' },
      { text: '节点超时修复', link: '/troubleshooting/node-timeout/' }
    ]
  },
  {
    title: '风险与替代',
    link: '/risks/',
    desc: '识别跑路前兆、年付/不限时/免费风险与品牌停运替代方案。',
    sub: [
      { text: '跑路异常特征', link: '/risks/exit-scam-signals/' },
      { text: '运营档案', link: '/risks/archives/' }
    ]
  }
]

function brandNameBySlug(slug: string): string {
  return brands.value.find((b) => b.slug === slug)?.name || slug
}
</script>

<template>
  <div class="hp-root">
    <!-- Section 1: Branded Hero & Quick Search -->
    <section class="hp-hero">
      <div class="hp-hero-inner">
        <div class="hp-hero-copy">
          <span class="hp-kicker">AIRPORT REVIEW LAB · {{ SITE_CONFIG.host.toUpperCase() }}</span>
          <h1 class="hp-h1">{{ SITE_CONFIG.brandName }}：{{ SITE_CONFIG.slogan }}</h1>
          <p class="hp-lead">
            面向中文用户的独立网络服务测评实验室、31 家机场品牌数据库、测速截图档案库、客户端配置文档及理性购买参考平台。
          </p>

          <form class="hp-search-form" @submit.prevent="submitQuickSearch">
            <input
              v-model="quickQuery"
              type="search"
              placeholder="输入品牌名、协议 (VLESS/SS)、专线 (IEPL) 或地区..."
              aria-label="检索机场品牌数据库"
              class="hp-search-input"
            />
            <button type="submit" class="hp-search-btn">检索品牌库</button>
          </form>

          <div class="hp-hero-actions">
            <a href="/brands/" class="hp-btn-primary">浏览 {{ brands.length || 31 }} 家品牌库</a>
            <a href="/compare/" class="hp-btn-secondary">进入品牌对比工具</a>
            <a href="/benchmarks/" class="hp-btn-ghost">查看实测证据库</a>
          </div>
        </div>

        <aside class="hp-observatory-summary" aria-label="实验室收录统计">
          <div class="hp-obs-head">
            <span>DATA ARCHIVE TELEMETRY</span>
            <span class="hp-obs-date">审计更新 {{ SITE_CONFIG.lastFullAuditDate }}</span>
          </div>
          <div class="hp-kpi-grid">
            <div class="hp-kpi">
              <span class="hp-kpi-num">{{ brands.length }}</span>
              <span class="hp-kpi-label">去重品牌档案</span>
            </div>
            <div class="hp-kpi">
              <span class="hp-kpi-num">{{ plans.length }}</span>
              <span class="hp-kpi-label">结构化套餐记录</span>
            </div>
            <div class="hp-kpi">
              <span class="hp-kpi-num">{{ screenshotBatchCount }}</span>
              <span class="hp-kpi-label">实测截图批次</span>
            </div>
            <div class="hp-kpi">
              <span class="hp-kpi-num">{{ clients.length }}</span>
              <span class="hp-kpi-label">代理客户端词条</span>
            </div>
          </div>
          <p class="hp-obs-note">
            所有指标均来自本地结构化数据库统计，不展示虚构在线人数或实时转化计数器。
          </p>
        </aside>
      </div>
    </section>

    <!-- Section 2: 5 Core Values Strip -->
    <section class="hp-section hp-values-strip" aria-label="实验室核心准则">
      <div class="hp-container hp-values-grid">
        <div v-for="val in SITE_CONFIG.coreValues" :key="val" class="hp-value-pill">
          <span class="hp-value-dot" aria-hidden="true" />
          <span>{{ val }}</span>
        </div>
      </div>
    </section>

    <!-- Section 3: #1 Partner Spotlight (光速云) -->
    <section v-if="leadBrand" class="hp-section" aria-label="商业合作主推品牌">
      <div class="hp-container">
        <div class="hp-section-head">
          <div>
            <span class="hp-eyebrow">FEATURED PARTNER · 商业合作主推位</span>
            <h2 class="hp-h2">{{ leadBrand.name }} 旗舰档案与实测入口</h2>
          </div>
          <span class="hp-transparency-note">商业主推排序与客观评测标准分离</span>
        </div>

        <div class="hp-lead-card">
          <div class="hp-lead-main">
            <div class="hp-lead-top">
              <img
                v-if="leadBrand.logo"
                :src="leadBrand.logo"
                :alt="`${leadBrand.name} 图标`"
                class="hp-lead-logo"
                width="48"
                height="48"
              />
              <div>
                <h3 class="hp-lead-name">
                  {{ leadBrand.name }}
                  <span v-if="leadBrand.englishName">{{ leadBrand.englishName }}</span>
                </h3>
                <p class="hp-lead-pos">{{ leadBrand.positioning }}</p>
              </div>
            </div>
            <p class="hp-lead-summary">{{ leadBrand.summary }}</p>
            <div class="hp-lead-tags">
              <span v-for="r in safeArray(leadBrand.routeTypes)" :key="r" class="hp-chip">{{ r }}</span>
              <span v-for="p in safeArray(leadBrand.protocols)" :key="p" class="hp-chip is-mono">{{ p }}</span>
              <span class="hp-chip">{{ leadBrand.nodeCountLabel }}</span>
            </div>
            <div class="hp-lead-actions">
              <AffiliateButton
                :brand-slug="leadBrand.slug"
                :brand-name="leadBrand.name"
                :show-disclosure="false"
                source-section="homepage_partner_spotlight"
              />
              <a :href="`/reviews/${leadBrand.slug}/`" class="hp-link-outline">品牌详情</a>
              <a :href="leadBrand.reviewUrl || `/reviews/${leadBrand.slug}/`" class="hp-link-outline">深度测评</a>
            </div>
          </div>

          <div class="hp-lead-plans">
            <div class="hp-lead-plans-head">主要收录套餐（含折算月均与冲突说明）</div>
            <div v-for="p in leadPlans" :key="p.id" class="hp-mini-plan">
              <div>
                <strong>{{ p.name }}</strong>
                <span class="hp-mini-sub">{{ p.trafficLabel }} · {{ p.billingCycleLabel }}</span>
              </div>
              <div class="hp-mini-price">
                <strong>{{ formatPriceCny(p.priceCny) }}</strong>
                <span v-if="p.effectiveMonthlyCny != null">约 {{ formatPriceCny(p.effectiveMonthlyCny) }}/月</span>
              </div>
            </div>
          </div>
        </div>

        <AffiliateDisclosure variant="banner" />
      </div>
    </section>

    <!-- Section 4: 10 Top-Level SEO Category Matrix -->
    <section class="hp-section hp-bg-alt" aria-label="十大核心内容专题">
      <div class="hp-container">
        <div class="hp-section-head">
          <div>
            <span class="hp-eyebrow">10 CORE PILLARS</span>
            <h2 class="hp-h2">十大核心内容体系</h2>
          </div>
          <a href="/methodology/" class="hp-more-link">查看内容与评测规范 →</a>
        </div>
        <div class="hp-cat-grid">
          <article v-for="(cat, idx) in TOP_CATEGORIES" :key="cat.link" class="hp-cat-card">
            <span class="hp-cat-num">{{ String(idx + 1).padStart(2, '0') }}</span>
            <h3 class="hp-cat-title"><a :href="cat.link">{{ cat.title }}</a></h3>
            <p class="hp-cat-desc">{{ cat.desc }}</p>
            <div class="hp-cat-sub">
              <a v-for="s in cat.sub" :key="s.link" :href="s.link">{{ s.text }}</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Section 5: 11 Featured Brands Showcase -->
    <section class="hp-section" aria-label="重点收录机场品牌">
      <div class="hp-container">
        <div class="hp-section-head">
          <div>
            <span class="hp-eyebrow">FEATURED BRANDS (1–11)</span>
            <h2 class="hp-h2">重点品牌数据库速览</h2>
          </div>
          <a href="/brands/" class="hp-more-link">检索全部 {{ brands.length }} 家品牌 →</a>
        </div>
        <div class="hp-brand-grid">
          <article v-for="b in featuredBrands" :key="b.slug" class="hp-brand-card">
            <div class="hp-bc-top">
              <div class="hp-bc-id">
                <img v-if="b.logo" :src="b.logo" :alt="`${b.name} 图标`" width="32" height="32" loading="lazy" />
                <div>
                  <h3 class="hp-bc-name"><a :href="`/reviews/${b.slug}/`">{{ b.name }}</a></h3>
                  <span class="hp-bc-pos">{{ b.positioning }}</span>
                </div>
              </div>
              <span
                class="hp-status"
                :style="{
                  color: getStatusMeta(b.dataStatus).color,
                  backgroundColor: '#0b1220',
                  borderColor: getStatusMeta(b.dataStatus).border
                }"
              >
                {{ getStatusMeta(b.dataStatus).zhLabel }}
              </span>
            </div>
            <div class="hp-bc-meta">
              <span>{{ b.entryLabel || (b.entryMonthlyCny != null ? `${formatPriceCny(b.entryMonthlyCny)}/月` : '价格待核实') }}</span>
              <span>{{ safeArray(b.protocols).slice(0, 2).join(' / ') || '协议待核实' }}</span>
            </div>
            <div class="hp-bc-links">
              <a :href="`/reviews/${b.slug}/`">档案</a>
              <a v-if="b.reviewUrl" :href="b.reviewUrl">评测</a>
              <a :href="`/compare/?brands=${b.slug}`">对比</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Section 6: Observatory Benchmark Snapshot -->
    <section class="hp-section hp-obs-band" aria-label="实测与测速证据摘要">
      <div class="hp-container">
        <div class="hp-section-head">
          <div>
            <span class="hp-eyebrow">SPEEDTEST OBSERVATORY</span>
            <h2 class="hp-h2 is-light">节点测速截图档案与批次规范</h2>
          </div>
          <a href="/benchmarks/" class="hp-more-link is-light">进入测速数据中心 →</a>
        </div>
        <div class="hp-obs-cards">
          <div class="hp-obs-card">
            <span class="hp-obs-tag">2026-08-11 实测批次</span>
            <h3>16 张 MAI-TEST-BOT / 喵速原始截图</h3>
            <p>保留原始 PNG 像素与测试时间戳，记录不同时段节点速度、RTT 与 UDP 状态，不删除异常或低速样本。</p>
            <a href="/benchmarks/">浏览截图档案 →</a>
          </div>
          <div class="hp-obs-card">
            <span class="hp-obs-tag">2026-08-19 专项留证</span>
            <h3>光速云 5 组多协议测速对比</h3>
            <p>包含 MiaoKo 62 节点 Shadowsocks 与 70 节点 VLESS + AnyTLS 实测截图，明确区分批次差异。</p>
            <a href="/reviews/guangsuyun/">查看光速云实测分析 →</a>
          </div>
          <div class="hp-obs-card">
            <span class="hp-obs-tag">非晚高峰文本记录</span>
            <h3>2026-10-19 历史样本隔离标识</h3>
            <p>所有非晚高峰文本记录均明确标记为 Historical Data / 非晚高峰，绝不混充晚高峰连续监测结果。</p>
            <a href="/methodology/">查看测评方法论 →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 7: Pricing & Cost-per-GB Picks -->
    <section class="hp-section" aria-label="套餐成本与计费筛选">
      <div class="hp-container">
        <div class="hp-section-head">
          <div>
            <span class="hp-eyebrow">PRICING &amp; COST PER GB</span>
            <h2 class="hp-h2">真实套餐价格与折算月均参考</h2>
          </div>
          <a href="/plans/" class="hp-more-link">查看完整价格数据库 →</a>
        </div>
        <div class="hp-plan-grid">
          <article v-for="plan in budgetPlans" :key="plan.id" class="hp-plan-card">
            <span class="hp-plan-brand">{{ brandNameBySlug(plan.brandSlug) }}</span>
            <h3 class="hp-plan-name">{{ plan.name }}</h3>
            <div class="hp-plan-price">
              <strong>{{ formatPriceCny(plan.priceCny) }}</strong>
              <span>/ {{ plan.billingCycleLabel }}</span>
            </div>
            <div class="hp-plan-meta">
              <span>流量：{{ plan.trafficLabel }}</span>
              <span>折合：{{ plan.effectiveMonthlyCny != null ? `${formatPriceCny(plan.effectiveMonthlyCny)}/月` : '买断' }}</span>
            </div>
            <a :href="`/reviews/${plan.brandSlug}/`" class="hp-plan-link">查看套餐详情 →</a>
          </article>
        </div>
      </div>
    </section>

    <!-- Section 8: AI & Streaming Unlock Overview -->
    <section class="hp-section hp-bg-alt" aria-label="AI 与流媒体解锁中心">
      <div class="hp-container hp-split-grid">
        <div class="hp-info-box">
          <span class="hp-eyebrow">AI SERVICES</span>
          <h2 class="hp-h2">ChatGPT / Claude / Gemini 兼容分析</h2>
          <p>区分官方区域支持规则、品牌方声称支持与实际节点验证状态，避免把“宣传支持”当作全节点稳定直连。</p>
          <a href="/ai-streaming/ai-tools/" class="hp-more-link">查看 AI 工具连接专题 →</a>
        </div>
        <div class="hp-info-box">
          <span class="hp-eyebrow">STREAMING MEDIA</span>
          <h2 class="hp-h2">Netflix / Disney+ / YouTube 解锁矩阵</h2>
          <p>按香港、日本、新加坡、台湾、美国节点划分原生 IP 与中转落地解锁差异，附带可用性矩阵检索。</p>
          <a href="/ai-streaming/matrix/" class="hp-more-link">进入可用性矩阵 →</a>
        </div>
      </div>
    </section>

    <!-- Section 9: Multi-Brand Comparison Launcher -->
    <section class="hp-section" aria-label="品牌横向对比入口">
      <div class="hp-container hp-banner-box">
        <div>
          <span class="hp-eyebrow">SIDE-BY-SIDE COMPARISON</span>
          <h2 class="hp-h2">多品牌参数横向对比工作台</h2>
          <p>支持同时对比 2–4 家品牌的入门价、优惠码、协议、专线类型、测速样本及 AI 支持情况，缺失字段一律标为“待核实”。</p>
        </div>
        <div class="hp-banner-links">
          <a href="/compare/?brands=guangsuyun,feimao,weifeng" class="hp-btn-primary">对比 光速云 vs 飞猫云 vs 微风网络</a>
          <a href="/compare/" class="hp-btn-secondary">自选品牌对比</a>
        </div>
      </div>
    </section>

    <!-- Section 10: Client Software Ecosystem -->
    <section class="hp-section hp-bg-alt" aria-label="客户端软件生态">
      <div class="hp-container">
        <div class="hp-section-head">
          <div>
            <span class="hp-eyebrow">PROXY CLIENTS</span>
            <h2 class="hp-h2">主流第三方代理客户端与内核指南</h2>
          </div>
          <a href="/clients/" class="hp-more-link">查看全部客户端与维护状态 →</a>
        </div>
        <div class="hp-client-grid">
          <article v-for="client in topClients" :key="client.slug" class="hp-client-card">
            <div class="hp-cc-top">
              <h3><a :href="client.docUrl || '/clients/'">{{ client.name }}</a></h3>
              <span class="hp-cc-engine">{{ client.coreEngine }}</span>
            </div>
            <div class="hp-cc-os">{{ safeArray(client.os).join(' · ') }}</div>
            <p class="hp-cc-status">维护状态：{{ client.maintenanceStatus }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Sections 11 & 12: Network Routes + Step-by-Step Guides -->
    <section class="hp-section" aria-label="线路技术与使用教程">
      <div class="hp-container hp-split-grid">
        <div class="hp-info-box">
          <span class="hp-eyebrow">SECTION 11 · NETWORK ARCHITECTURE</span>
          <h2 class="hp-h2">IEPL / IPLC 专线与节点倍率解析</h2>
          <p>拆解中转加密隧道与企业内网专线的延迟差异、倍率计费陷阱以及港/日/台/新/美节点选区原则。</p>
          <div class="hp-inline-links">
            <a href="/network/iepl-vs-iplc/">IEPL vs IPLC</a>
            <a href="/network/regions/">地区节点分析</a>
            <a href="/knowledge/">协议科普</a>
          </div>
        </div>
        <div class="hp-info-box">
          <span class="hp-eyebrow">SECTION 12 · SETUP GUIDES</span>
          <h2 class="hp-h2">订阅导入、TUN 模式与 DNS 分流教程</h2>
          <p>覆盖 Windows、macOS、Android、iOS 与软路由的订阅导入步骤、TUN 虚拟网卡配置及规范测速流程。</p>
          <div class="hp-inline-links">
            <a href="/guides/subscription/">订阅导入</a>
            <a href="/guides/tun-dns/">TUN 与 DNS</a>
            <a href="/guides/speedtest-guide/">测速指南</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Sections 13, 14 & 15: Troubleshooting + Risks + VPN vs Airport -->
    <section class="hp-section hp-bg-alt" aria-label="故障排查与风险控制">
      <div class="hp-container hp-three-grid">
        <article class="hp-info-box">
          <span class="hp-eyebrow">SECTION 13 · TROUBLESHOOTING</span>
          <h3 class="hp-h3">连接故障快速诊断</h3>
          <p>排查订阅更新报错、节点全超时、系统代理冲突及 DNS 污染问题。</p>
          <a href="/troubleshooting/" class="hp-more-link">进入故障中心 →</a>
        </article>
        <article class="hp-info-box">
          <span class="hp-eyebrow">SECTION 14 · RISK AUDIT</span>
          <h3 class="hp-h3">跑路前兆与年付风险控制</h3>
          <p>梳理异常停服特征、不限时/免费风险提示以及品牌停运替代查询。</p>
          <a href="/risks/" class="hp-more-link">查看风险专题 →</a>
        </article>
        <article class="hp-info-box">
          <span class="hp-eyebrow">SECTION 15 · VPN VS AIRPORT</span>
          <h3 class="hp-h3">传统 VPN 与游戏加速器对比</h3>
          <p>厘清海外商业 VPN、规则代理机场与游戏加速器在协议、路由与隐私上的本质差异。</p>
          <a href="/vpn/vpn-vs-airport/" class="hp-more-link">查看选型对比 →</a>
        </article>
      </div>
    </section>

    <!-- Sections 16 & 17: Methodology + Editorial Disclosure -->
    <section class="hp-section" aria-label="测评方法论与编辑声明">
      <div class="hp-container hp-split-grid">
        <div class="hp-info-box">
          <span class="hp-eyebrow">SECTION 16 · METHODOLOGY</span>
          <h2 class="hp-h2">证据分级与数据真实性标准</h2>
          <p>本站严格标注「独立实测」「品牌方资料」「历史记录」「存在冲突」「暂未实测」，不将单日测速包装为全年稳定保证，不将缺失数据记为 0。</p>
          <a href="/methodology/" class="hp-more-link">阅读完整方法论 →</a>
        </div>
        <div class="hp-info-box">
          <span class="hp-eyebrow">SECTION 17 · EDITORIAL DISCLOSURE</span>
          <h2 class="hp-h2">编辑独立性与推广链接披露</h2>
          <p>{{ SITE_CONFIG.disclosureText }} 由 {{ SITE_CONFIG.editorialAuthor }} 维护，最近全库审计日期：{{ SITE_CONFIG.lastFullAuditDate }}。</p>
          <a href="/about/" class="hp-more-link">关于实验室与披露声明 →</a>
        </div>
      </div>
    </section>

    <!-- Section 18: Structured Footer Directory -->
    <footer class="hp-footer" aria-label="全站栏目导航页脚">
      <div class="hp-container hp-footer-grid">
        <div>
          <div class="hp-footer-brand-row">
            <img
              src="/images/avatar.webp"
              alt="机场测评站点头像"
              class="hp-footer-avatar"
              width="36"
              height="36"
              loading="lazy"
            />
            <strong class="hp-footer-brand">{{ SITE_CONFIG.brandName }} · {{ SITE_CONFIG.englishBrandName }}</strong>
          </div>
          <p class="hp-footer-desc">{{ SITE_CONFIG.defaultDescription }}</p>
        </div>
        <div>
          <div class="hp-footer-col-title">测评与选型</div>
          <ul>
            <li><a href="/recommend/">机场推荐</a></li>
            <li><a href="/rankings/">2026 机场排行</a></li>
            <li><a href="/brands/">31 家品牌库</a></li>
            <li><a href="/reviews/">品牌深度测评</a></li>
            <li><a href="/compare/">横向对比工具</a></li>
          </ul>
        </div>
        <div>
          <div class="hp-footer-col-title">技术与排障</div>
          <ul>
            <li><a href="/clients/">客户端软件</a></li>
            <li><a href="/network/">线路与节点</a></li>
            <li><a href="/benchmarks/">测速与解锁库</a></li>
            <li><a href="/guides/">使用教程</a></li>
            <li><a href="/troubleshooting/">故障排查</a></li>
          </ul>
        </div>
        <div>
          <div class="hp-footer-col-title">价格与规范</div>
          <ul>
            <li><a href="/plans/">价格与套餐</a></li>
            <li><a href="/deals/">优惠与折扣码</a></li>
            <li><a href="/risks/">风险与替代</a></li>
            <li><a href="/methodology/">测评方法论</a></li>
            <li><a href="/about/">关于与推广披露</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hp-root {
  color: #1a2332;
  background: #ffffff;
}

.hp-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.hp-section {
  padding: 2.5rem 0;
}

.hp-bg-alt {
  background: #f4f7fb;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.hp-hero {
  padding: 3rem 0 2.5rem;
  background: linear-gradient(180deg, #f4f7fb 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
}

.hp-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: grid;
  grid-template-columns: 1.35fr 0.95fr;
  gap: 2rem;
  align-items: center;
}

.hp-kicker,
.hp-eyebrow {
  display: inline-block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #0284c7;
  margin-bottom: 0.35rem;
}

.hp-h1 {
  margin: 0 0 0.75rem !important;
  font-size: clamp(1.65rem, 3vw, 2.35rem);
  font-weight: 800;
  line-height: 1.25;
  color: #0f172a;
}

.hp-lead {
  margin: 0 0 1.2rem;
  font-size: 1rem;
  line-height: 1.65;
  color: #475569;
}

.hp-search-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.hp-search-input {
  flex: 1;
  padding: 0.65rem 0.9rem;
  border-radius: 9px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.92rem;
}

.hp-search-btn,
.hp-btn-primary {
  padding: 0.62rem 1.15rem;
  border-radius: 9px;
  border: 1px solid #0f4c81;
  background: #0f4c81;
  color: #ffffff !important;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none !important;
  cursor: pointer;
}

.hp-btn-secondary {
  padding: 0.62rem 1.15rem;
  border-radius: 9px;
  border: 1px solid #0284c7;
  background: #ffffff;
  color: #0284c7 !important;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none !important;
}

.hp-btn-ghost {
  padding: 0.62rem 1rem;
  border-radius: 9px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155 !important;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none !important;
}

.hp-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.hp-observatory-summary {
  padding: 1.15rem;
  border-radius: 14px;
  background: #0b1220;
  border: 1px solid #1e2d4a;
  color: #e2e8f0;
}

.hp-obs-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  color: #38bdf8;
  margin-bottom: 0.85rem;
}

.hp-obs-date {
  color: #94a3b8;
}

.hp-kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}

.hp-kpi {
  padding: 0.75rem;
  border-radius: 8px;
  background: #131d31;
  border: 1px solid #1e2d4a;
  display: flex;
  flex-direction: column;
}

.hp-kpi-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.45rem;
  font-weight: 700;
  color: #34d399;
}

.hp-kpi-label {
  font-size: 0.76rem;
  color: #cbd5e1;
}

.hp-obs-note {
  margin: 0.75rem 0 0;
  font-size: 0.74rem;
  color: #94a3b8;
  line-height: 1.45;
}

.hp-values-strip {
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.hp-values-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.65rem;
}

.hp-value-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #0f172a;
}

.hp-value-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0284c7;
}

.hp-section-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}

.hp-h2 {
  margin: 0 !important;
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
}

.hp-h2.is-light {
  color: #f8fafc;
}

.hp-h3 {
  margin: 0 0 0.45rem !important;
  font-size: 1.08rem;
  font-weight: 700;
  color: #0f172a;
}

.hp-transparency-note {
  font-size: 0.78rem;
  color: #64748b;
  background: #f4f7fb;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.hp-more-link {
  font-size: 0.86rem;
  font-weight: 600;
  color: #0f4c81;
  text-decoration: none;
}

.hp-more-link.is-light {
  color: #38bdf8;
}

.hp-lead-card {
  display: grid;
  grid-template-columns: 1.25fr 0.95fr;
  gap: 1.25rem;
  padding: 1.25rem;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.05);
}

.hp-lead-top {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.75rem;
}

.hp-lead-logo {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #f4f7fb;
  border: 1px solid #e2e8f0;
  padding: 4px;
}

.hp-lead-name {
  margin: 0 !important;
  font-size: 1.22rem;
  font-weight: 700;
}

.hp-lead-name span {
  font-size: 0.85rem;
  color: #64748b;
  margin-left: 0.4rem;
}

.hp-lead-pos {
  margin: 0.15rem 0 0;
  font-size: 0.84rem;
  color: #475569;
}

.hp-lead-summary {
  margin: 0 0 0.85rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #334155;
}

.hp-lead-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.hp-chip {
  padding: 0.16rem 0.55rem;
  border-radius: 5px;
  background: #f1f5f9;
  color: #1e293b;
  font-size: 0.76rem;
  font-weight: 600;
}

.hp-chip.is-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.hp-lead-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
}

.hp-link-outline {
  padding: 0.52rem 0.95rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  color: #0f4c81;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.hp-lead-plans {
  padding: 0.9rem;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: grid;
  gap: 0.55rem;
}

.hp-lead-plans-head {
  font-size: 0.78rem;
  font-weight: 700;
  color: #475569;
}

.hp-mini-plan {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  font-size: 0.82rem;
}

.hp-mini-sub {
  display: block;
  font-size: 0.72rem;
  color: #64748b;
}

.hp-mini-price {
  text-align: right;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #0f4c81;
}

.hp-mini-price span {
  display: block;
  font-size: 0.7rem;
  color: #64748b;
}

.hp-cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.9rem;
}

.hp-cat-card {
  padding: 1rem;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.hp-cat-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.74rem;
  color: #0284c7;
  font-weight: 700;
}

.hp-cat-title {
  margin: 0 !important;
  font-size: 1.02rem;
  font-weight: 700;
}

.hp-cat-title a {
  color: #0f172a;
  text-decoration: none;
}

.hp-cat-title a:hover {
  color: #0f4c81;
}

.hp-cat-desc {
  margin: 0;
  font-size: 0.82rem;
  color: #475569;
  line-height: 1.5;
}

.hp-cat-sub {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  padding-top: 0.45rem;
  border-top: 1px dashed #e2e8f0;
  font-size: 0.76rem;
}

.hp-cat-sub a {
  color: #0f4c81;
  font-weight: 600;
  text-decoration: none;
}

.hp-brand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.85rem;
}

.hp-brand-card {
  padding: 0.9rem;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.hp-bc-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.hp-bc-id {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.hp-bc-id img {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  background: #f4f7fb;
  padding: 2px;
}

.hp-bc-name {
  margin: 0 !important;
  font-size: 0.96rem;
  font-weight: 700;
}

.hp-bc-name a {
  color: #0f172a;
  text-decoration: none;
}

.hp-bc-pos {
  display: block;
  font-size: 0.74rem;
  color: #64748b;
}

.hp-status {
  padding: 0.08rem 0.42rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.hp-bc-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #334155;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.hp-bc-links {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.4rem;
  border-top: 1px dashed #e2e8f0;
  font-size: 0.78rem;
}

.hp-bc-links a {
  color: #0f4c81;
  font-weight: 600;
  text-decoration: none;
}

.hp-obs-band {
  background: #0b1220;
  color: #e2e8f0;
}

.hp-obs-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.hp-obs-card {
  padding: 1.05rem;
  border-radius: 10px;
  background: #131d31;
  border: 1px solid #1e2d4a;
}

.hp-obs-tag {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  color: #34d399;
}

.hp-obs-card h3 {
  margin: 0.35rem 0 0.4rem !important;
  font-size: 1rem;
  color: #f8fafc;
}

.hp-obs-card p {
  margin: 0 0 0.65rem;
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.55;
}

.hp-obs-card a {
  font-size: 0.82rem;
  font-weight: 600;
  color: #38bdf8;
  text-decoration: none;
}

.hp-plan-grid,
.hp-client-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.85rem;
}

.hp-plan-card,
.hp-client-card {
  padding: 0.9rem;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
}

.hp-plan-brand {
  font-size: 0.74rem;
  color: #0284c7;
  font-weight: 600;
}

.hp-plan-name {
  margin: 0.15rem 0 0.4rem !important;
  font-size: 0.94rem;
  font-weight: 700;
}

.hp-plan-price strong {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.25rem;
  color: #0f4c81;
}

.hp-plan-price span {
  font-size: 0.76rem;
  color: #64748b;
}

.hp-plan-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin: 0.45rem 0;
  font-size: 0.76rem;
  color: #475569;
}

.hp-plan-link {
  font-size: 0.78rem;
  font-weight: 600;
  color: #0f4c81;
  text-decoration: none;
}

.hp-split-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.15rem;
}

.hp-three-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.hp-info-box {
  padding: 1.15rem;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
}

.hp-info-box p {
  margin: 0.5rem 0 0.75rem;
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.6;
}

.hp-inline-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.84rem;
  font-weight: 600;
}

.hp-inline-links a {
  color: #0f4c81;
  text-decoration: none;
}

.hp-banner-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.35rem;
  border-radius: 14px;
  background: #f4f7fb;
  border: 1px solid #cbd5e1;
}

.hp-banner-box p {
  margin: 0.35rem 0 0;
  font-size: 0.88rem;
  color: #475569;
}

.hp-banner-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.hp-cc-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.4rem;
}

.hp-cc-top h3 {
  margin: 0 !important;
  font-size: 0.94rem;
}

.hp-cc-top a {
  color: #0f172a;
  text-decoration: none;
}

.hp-cc-engine {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  color: #0284c7;
}

.hp-cc-os {
  margin: 0.35rem 0 0.25rem;
  font-size: 0.76rem;
  color: #334155;
}

.hp-cc-status {
  margin: 0;
  font-size: 0.74rem;
  color: #64748b;
}

.hp-footer {
  padding: 2.5rem 0;
  background: #0f172a;
  color: #cbd5e1;
}

.hp-footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 1.5rem;
}

.hp-footer-brand-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.55rem;
}

.hp-footer-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #334155;
  flex-shrink: 0;
}

.hp-footer-brand {
  display: block;
  font-size: 1rem;
  color: #f8fafc;
}

.hp-footer-desc {
  margin: 0;
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.6;
}

.hp-footer-col-title {
  font-size: 0.84rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.6rem;
}

.hp-footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.35rem;
  font-size: 0.8rem;
}

.hp-footer a {
  color: #94a3b8;
  text-decoration: none;
}

.hp-footer a:hover {
  color: #38bdf8;
}

@media (max-width: 900px) {
  .hp-hero-inner,
  .hp-lead-card,
  .hp-footer-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hp-search-form {
    flex-direction: column;
  }
}

:global(.dark .hp-root){
  color: #f1f5f9;
  background: #0f172a;
}

:global(.dark .hp-bg-alt){
  background: #0b1220;
  border-top-color: #1e2d4a;
  border-bottom-color: #1e2d4a;
}

:global(.dark .hp-hero){
  background: linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
  border-bottom-color: #1e2d4a;
}

:global(.dark .hp-kicker),
:global(.dark .hp-eyebrow),
:global(.dark .hp-cat-num),
:global(.dark .hp-plan-brand),
:global(.dark .hp-cc-engine){
  color: #38bdf8;
}

:global(.dark .hp-h1),
:global(.dark .hp-h2),
:global(.dark .hp-h3),
:global(.dark .hp-value-pill),
:global(.dark .hp-lead-name),
:global(.dark .hp-cat-title a),
:global(.dark .hp-bc-name a),
:global(.dark .hp-plan-name),
:global(.dark .hp-cc-top a){
  color: #f1f5f9;
}

:global(.dark .hp-lead),
:global(.dark .hp-lead-pos),
:global(.dark .hp-lead-summary),
:global(.dark .hp-cat-desc),
:global(.dark .hp-bc-meta),
:global(.dark .hp-plan-meta),
:global(.dark .hp-info-box p),
:global(.dark .hp-banner-box p),
:global(.dark .hp-cc-os){
  color: #cbd5e1;
}

:global(.dark .hp-lead-name span),
:global(.dark .hp-mini-sub),
:global(.dark .hp-mini-price span),
:global(.dark .hp-bc-pos),
:global(.dark .hp-plan-price span),
:global(.dark .hp-cc-status){
  color: #94a3b8;
}

:global(.dark .hp-search-input){
  background: #0b1220;
  border-color: #334155;
  color: #f1f5f9;
}

:global(.dark .hp-search-btn),
:global(.dark .hp-btn-primary){
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff !important;
}

:global(.dark .hp-btn-secondary){
  background: #131d31;
  border-color: #38bdf8;
  color: #7dd3fc !important;
}

:global(.dark .hp-btn-ghost),
:global(.dark .hp-link-outline){
  background: #131d31;
  border-color: #334155;
  color: #e2e8f0 !important;
}

:global(.dark .hp-values-strip){
  border-bottom-color: #1e2d4a;
}

:global(.dark .hp-transparency-note){
  background: #131d31;
  border: 1px solid #1e2d4a;
  color: #94a3b8;
}

:global(.dark .hp-more-link),
:global(.dark .hp-cat-sub a),
:global(.dark .hp-bc-links a),
:global(.dark .hp-plan-link),
:global(.dark .hp-inline-links a),
:global(.dark .hp-mini-price),
:global(.dark .hp-plan-price strong){
  color: #38bdf8;
}

:global(.dark .hp-lead-card),
:global(.dark .hp-cat-card),
:global(.dark .hp-brand-card),
:global(.dark .hp-plan-card),
:global(.dark .hp-client-card),
:global(.dark .hp-info-box){
  background: #131d31;
  border-color: #1e2d4a;
  box-shadow: 0 6px 24px rgba(2, 6, 23, 0.45);
}

:global(.dark .hp-lead-logo),
:global(.dark .hp-bc-id img){
  background: #f1f5f9;
  border-color: #334155;
}

:global(.dark .hp-chip){
  background: #18253d;
  color: #e2e8f0;
  border: 1px solid #1e2d4a;
}

:global(.dark .hp-lead-plans),
:global(.dark .hp-banner-box){
  background: #0b1220;
  border-color: #1e2d4a;
}

:global(.dark .hp-lead-plans-head){
  color: #cbd5e1;
}

:global(.dark .hp-mini-plan){
  background: #131d31;
  border-color: #1e2d4a;
  color: #f1f5f9;
}

:global(.dark .hp-cat-sub),
:global(.dark .hp-bc-links){
  border-top-color: #1e2d4a;
}

:global(.dark .hp-footer){
  background: #070d18;
  border-top: 1px solid #1e2d4a;
}
</style>
