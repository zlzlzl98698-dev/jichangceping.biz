---
title: Clash / Mihomo 分流规则与 AI / 流媒体防误杀写法实战
seoTitle: Clash Verge Rev / Mihomo 分流规则教程：OpenAI、Claude、Gemini、Netflix 与 YouTube 防送中写法 | 机场测评
description: 基于真实实测解锁差异（如光速云 08-19 港节点 OpenAI 仅 APP、新/台 YouTube 送中 CN、Gemini 仅特定地区解锁及 TikTok ALISG 现象），手把手拆解 Clash / Mihomo（Clash Meta）精细化分流策略组、rule-providers 配置与防误杀直连/代理规则优先级。
slug: /guides/clash-rules/
category: guides
pillar: guides
tags:
  - Clash分流规则
  - Mihomo配置
  - ChatGPT分流
  - YouTube防送中
  - 流媒体策略组
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: 2026-11-25
updatedDate: 2026-11-25
verifiedDate: 2026-11-24
primaryKeyword: Clash分流规则写法
secondaryKeywords:
  - Mihomo AI流媒体分流
  - YouTube送中怎么分流解决
  - ChatGPT仅APP怎么解决
  - Clash Verge Rev 覆写规则
searchIntent: informational
entities:
  - Clash Verge Rev
  - Mihomo
  - OpenAI
  - Claude
  - Gemini
  - Netflix
  - YouTube
  - TikTok
  - 光速云
  - 无忧链接
sources:
  - src-speedtest-guangsuyun-2026-08-19
  - src-speedtest-2026-08-11
  - src-speedtest-lingdong-2026-07-20
dataStatus: Measured
relatedSlugs:
  - /guides/
  - /guides/subscription/
  - /guides/tun-dns/
  - /ai-streaming/matrix/
  - /clients/clash-verge-rev/
faq:
  - question: 为什么我用香港节点看网页很快，但打开 ChatGPT 网页版提示不可用或仅限 APP、打开 Gemini 直接报错？
    answer: 这是节点所在地区的服务限制与 IP 识别策略所致。在本站 2026-08-19 光速云实测中，62 节点 SS 批次的香港节点 OpenAI 多显示仅 APP(HK)，70 节点 VLESS 批次的香港节点多被识别为 US/JP 或 N/A，且港/日/美多数节点解锁 Gemini 失败，只有新加坡/土耳其/马来西亚等部分节点可解锁 Gemini。解决办法不是换整个订阅，而是在 Clash/Mihomo 中按域名把 OpenAI/Claude 与 Gemini 拆到独立策略组，分别指向日/美与新加坡/马来节点。
    link: /ai-streaming/matrix/
    linkText: 查看 AI 与流媒体地区解锁实测矩阵
  - question: 遇到新加坡或台湾节点看 YouTube 出现“送中（CN）”该怎么用分流规则彻底规避？
    answer: 当 YouTube 节点的出口 IP 被 Google 定位库识别为中国内地（CN）时，YouTube Premium 后台播放、无广告权益和部分视频会失效（例如 08-19 实测显示光速云 SG 10 节点与 TW 9 节点出现送中 CN，07-18 实测无忧链接 HKG-01 亦出现送中）。在 Clash 中只需新建一个“🎬 YouTube”策略组，利用正则过滤只保留确认未送中的香港（除异常号外）、日本或美国节点，就能彻底摆脱送中。
    link: /reviews/guangsuyun/
    linkText: 查看 08-19 实测 YouTube 送中明细
  - question: 自己加自定义 Clash 分流规则时，为什么有时写了规则却不生效，或者把微信/银行 App 误杀走代理？
    answer: 根本原因在于 Clash 规则匹配遵循“自上而下、首次命中即停止”的原则，且常与 Fake-IP DNS 解析配合。如果把范围过宽的关键词规则（如 DOMAIN-KEYWORD）或 MATCH 兜底放得太靠前，就会劫持国内流量；反之如果把自定义 AI 规则插在 GEOSITE,google 或 PROXY 通用规则之后，则会先被宽泛规则截胡而失效。正确做法是将自定义精细规则放在 rules 列表最顶部（或通过 Mihomo 覆写 prepend-rules 注入头部）。
    link: /guides/tun-dns/
    linkText: 查看 Fake-IP 与 DNS 防污染配置指南
---

# Clash / Mihomo 分流规则与 AI / 流媒体防误杀写法实战

<strong>核心结论（Answer-First）：</strong> 2026 年的跨境节点生态早已不是“选一个香港低延迟节点走全部流量”能搞定的时代。根据本站 `2026-08-19` 与 `2026-07-18/20` 多组实测截图，<strong>同一个机场的同一个订阅里，香港节点往往延迟最低却出现 OpenAI <code>仅APP(HK)</code> 或 TikTok <code>ALISG</code> 失败；新加坡/台湾节点可能支持 OpenAI 却出现 YouTube <code>送中(CN)</code>；而 Gemini 又常常只在新加坡/土耳其/马来西亚等少数落地解锁</strong>。要彻底告别频繁手动切节点和国内 App 误杀，最优解是在支持 <strong>Mihomo（Clash Meta）</strong> 内核的客户端（如 [Clash Verge Rev](/clients/clash-verge-rev/)、FlClash、OpenClash）中，通过<strong>独立业务策略组 + 正则地区筛选 + 顶部防误杀规则序列</strong>实现全自动分流。

---

## 一、实测真相驱动的分流原则：为什么要拆出 5 个独立策略组？

在动手写 YAML 之前，先看一组直接来自本站 `data/benchmarks.json` 与 `data/availability.json` 的实测事实（以证据最完整的 2026-08-19 光速云双批次与 07-18/07-20 历史实测为例）：

| 目标服务 | 实测暴露的典型故障现象 | 实测可用度较高的参考地区（需配合自测） | 对应分流策略组设计思路 |
| :--- | :--- | :--- | :--- |
| **ChatGPT / OpenAI** | 08-19 SS 批次香港多为 <strong><code>仅 APP(HK)</code></strong>；VLESS 批次香港多跳变识别 US/JP 或 N/A；电信 AnyTLS 组多为 N/A/失败 | **日本（JP）、美国（US）、新加坡（SG）、台湾（TW）VLESS 组** | 绝不让 OpenAI 走默认香港组；单设 `🤖 OpenAI / Claude` 组并正则筛选日/美/新节点 |
| **Gemini** | 08-19 SS 实测中 **港、日、美、台、英、法、德多数失败** | <strong>新加坡（SG）、马来西亚（MY）、土耳其（TR）</strong> 部分节点 | 单设 `✨ Gemini` 策略组（若全组不放宽，务必与通用 Google 服务拆分或优先锁定 SG/MY） |
| **YouTube** | 08-19 VLESS 批次 <strong>新加坡 10 节点 & 台湾 9 节点全部送中（<code>CN</code>）</strong>；07-18 无忧链接 `HKG-01` 送中 | <strong>日本（JP）、美国（US）、正常香港（HK）</strong> | 单设 `📺 YouTube` 策略组，剔除送中地区的 SG/TW（或精准排除特定编号节点） |
| **Netflix / Disney+** | 08-19 台湾节点在 SS 批次失败、VLESS 批次 Disney+ 识别为 <strong><code>GB</code></strong>（英国区）；07-20 灵动云台湾识别 <strong><code>ES</code></strong> | <strong>香港、日本、新加坡、美国</strong>（港台需核对片库归属） | 单设 `🎥 流媒体` 策略组，优先锁定需要特定片库的地区（如新/港/日/美） |
| **TikTok** | 08-19 实测香港多数识别为 <strong><code>ALISG</code></strong>（阿里云新加坡特征）或失败，日/台约半数解锁半数失败 | **美国（US）全解锁** | 单设 `🎵 TikTok` 策略组，强制锁死 <strong>美国节点</strong>（避开港节点与异常美 02） |

这就是“分流”的真正价值：**日常网页、GitHub、下载依然走 20–31ms 的香港极速专线；与此同时，ChatGPT 自动走日本/美国，Gemini 自动走新加坡，YouTube 避开送中的新台节点，TikTok 自动锁定美国**——全程后台无感完成，无需人工点切。

---

## 二、标准 Mihomo (Clash Meta) 防误杀规则集架构

在现代 Mihomo 内核中，<strong>强烈建议使用官方原生支持的 <code>rule-providers</code>（<code>mrs</code> 二进制规则集或 <code>yaml</code>/<code>text</code> 列表）</strong>，尽量不要把几万条静态域名直接硬编码塞进配置文件，否则会显著拖慢移动端和路由器加载速度。

### 规则自上而下匹配顺序（防误杀核心逻辑）

Clash / Mihomo 严格按照 `rules:` 数组**从第一行往下依次匹配**，一旦命中立即停止，不再看后面的规则。正确的防误杀黄金排序如下：

1. <strong>最高优先级：局域网私有 IP 与本机回环直连（<code>DIRECT</code>）</strong> — 防止路由器后台、NAS、打印机走代理断联；
2. <strong>国内热门易误杀白名单直连（<code>DIRECT</code>）</strong> — 例如国内网银 App、微信/支付宝核心支付域、公司内网域名、国内游戏登录校验域名、PT 下载站等；
3. <strong>精细化海外业务分流（AI / 流媒体 / TikTok 独立策略组）</strong> — <strong>必须放在通用代理规则和 <code>GEOSITE</code> 宽泛规则前面！</strong>（例如 `openai` 必须在 `geolocation-!cn` 之前，否则会被通用组截胡）；
4. <strong>海外通用代理规则集（如 <code>geosite:geolocation-!cn</code> -> <code>🚀 节点选择</code>）</strong>；
5. <strong>国内域名与国内 IP 直连规则（<code>geosite:cn</code>、<code>geoip:cn</code> -> <code>DIRECT</code>）</strong>；
6. <strong>最终兜底（<code>MATCH,🐟 漏网之鱼</code>）</strong> — 建议设为走主代理组，并注意配合 `no-resolve` 参数防止不必要地触发本地 DNS 解析。

### Fake-IP 过滤白名单与 DNS 泄漏兜底要点

光把 `rules:` 顺序排对还不够，如果客户端运行在 `Fake-IP` 模式下（Clash Verge Rev 与 Mihomo 的推荐默认模式），还必须注意三项 DNS 分流细节，才能真正杜绝“规则对了但应用依然卡死或识别错区”的问题：

1. <strong>配置 <code>fake-ip-filter</code> 放行本地与特殊验证域</strong>：将局域网域名（`+.lan`、`+.local`）、NTP 时间同步域名（`time.*.com`、`pool.ntp.org`）、游戏联机 STUN 服务器以及微信/企业内网的认证探测域加入 `fake-ip-filter`，避免这些底层组件拿到 `198.18.0.x` 虚拟地址后陷入连接死循环。
2. <strong>严格区分 <code>nameserver</code>（国内直连 DNS）与 <code>fallback</code>（海外安全 DNS）</strong>：在国内域名解析走 `223.5.5.5` 或运营商 DoH 的同时，海外或未命中的域名应由代理远端解析或经由代理隧道访问 `https://dns.google/dns-query` / `https://cloudflare-dns.com/dns-query`。一旦 OpenAI 或流媒体域名在本地被运营商 DNS 解析并回传国内 CDN IP，就算路由规则指向了美国节点，服务端也依然可能识别出异常地区访问。
3. **关闭浏览器“安全 DNS（DoH）”以免绕开 Clash 分流内核**：Chrome 与 Edge 默认开启自带的 `Secure DNS`。如果浏览器直接在应用层向海外 DoH 发起请求或使用本机 DoH，有时会导致 Mihomo 无法捕获原始域名而退化成纯 IP 匹配，使 `DOMAIN-SUFFIX` 精确规则失效。使用 Clash 分流时，建议关闭浏览器内置 DoH，统一交由代理客户端接管 DNS 解析。

---

## 三、可直接用于 Clash Verge Rev 覆写的实战配置模板

以下是一段标准、简洁且经过防误杀优化的 **Mihomo（Clash Meta）全局覆写（Script / Merge YAML）示例**。在 [Clash Verge Rev](/clients/clash-verge-rev/) 中，只需右键订阅 → 选择“编辑扩展配置（Merge）”或“扩展脚本”，即可在不破坏机场原有节点列表的前提下自动注入精细分流策略组：

```yaml
# 1. 定义自动过滤地区节点的策略组（以 Mihomo 正则 filter 语法为例）
proxy-groups:
  - name: "🚀 节点选择"
    type: select
    proxies:
      - "🇭🇰 香港优选"
      - "🇯🇵 日本优选"
      - "🇺🇸 美国优选"
      - "🇸🇬 新加坡优选"
      - DIRECT

  - name: "🤖 OpenAI / Claude"
    type: select
    include-all: true
    # 剔除香港节点（规避 仅APP(HK) 与 N/A）以及异常/说明节点
    filter: "(?i)^(?!.*(香港|HK|Hong|官网|剩余|到期|AnyTLS)).*(日本|JP|美国|US|狮城|新加坡|SG|台湾|TW)"

  - name: "✨ Gemini 专用"
    type: select
    include-all: true
    # 针对 08-19 实测优先匹配新加坡/马来西亚/土耳其等高概率解锁地区
    filter: "(?i)(新加坡|狮城|SG|马来|MY|土耳其|TR)"

  - name: "📺 YouTube"
    type: select
    include-all: true
    # 规避部分新/台节点送中(CN)，优先选择港/日/美主流节点
    filter: "(?i)(香港|HK|日本|JP|美国|US)"

  - name: "🎵 TikTok"
    type: select
    include-all: true
    # 避开香港 ALISG，优先美区全解锁（同时排除已记录的故障编号时可手动切换）
    filter: "(?i)(美国|US|美)"

  - name: "🇭🇰 香港优选"
    type: url-test
    include-all: true
    filter: "(?i)(香港|HK)"
    url: https://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50

  - name: "🇯🇵 日本优选"
    type: url-test
    include-all: true
    filter: "(?i)(日本|JP)"
    url: https://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50

  - name: "🇺🇸 美国优选"
    type: url-test
    include-all: true
    filter: "(?i)(美国|US)"
    url: https://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50

  - name: "🇸🇬 新加坡优选"
    type: url-test
    include-all: true
    filter: "(?i)(新加坡|狮城|SG)"
    url: https://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50

# 2. 引入 MetaCubeX 官方精简 MRS 规则集（加载极快、不卡路由器）
rule-providers:
  openai:
    type: http
    behavior: domain
    format: mrs
    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/openai.mrs"
    path: ./ruleset/openai.mrs
    interval: 86400
  anthropic:
    type: http
    behavior: domain
    format: mrs
    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/anthropic.mrs"
    path: ./ruleset/anthropic.mrs
    interval: 86400
  youtube:
    type: http
    behavior: domain
    format: mrs
    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/youtube.mrs"
    path: ./ruleset/youtube.mrs
    interval: 86400
  tiktok:
    type: http
    behavior: domain
    format: mrs
    url: "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/tiktok.mrs"
    path: ./ruleset/tiktok.mrs
    interval: 86400

# 3. 防误杀规则序列（越靠前优先级越高）
rules:
  # 第一层：防误杀内网与国内强制直连域名
  - IP-CIDR,127.0.0.0/8,DIRECT,no-resolve
  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
  - IP-CIDR,10.0.0.0/8,DIRECT,no-resolve
  - DOMAIN-SUFFIX,local,DIRECT
  - DOMAIN-SUFFIX,lan,DIRECT

  # 第二层：AI 专项精确匹配（防止被通用 Google/海外规则抢先命中）
  - RULE-SET,openai,🤖 OpenAI / Claude
  - RULE-SET,anthropic,🤖 OpenAI / Claude
  - DOMAIN-SUFFIX,claude.ai,🤖 OpenAI / Claude
  - DOMAIN-SUFFIX,chatgpt.com,🤖 OpenAI / Claude
  - DOMAIN-SUFFIX,oaistatic.com,🤖 OpenAI / Claude
  - DOMAIN-SUFFIX,oaiusercontent.com,🤖 OpenAI / Claude
  - DOMAIN-SUFFIX,gemini.google.com,✨ Gemini 专用
  - DOMAIN-SUFFIX,generativelanguage.googleapis.com,✨ Gemini 专用
  - DOMAIN-SUFFIX,aistudio.google.com,✨ Gemini 专用

  # 第三层：流媒体与短视频精准分流
  - RULE-SET,youtube,📺 YouTube
  - RULE-SET,tiktok,🎵 TikTok

  # 第四层：其余海外流量与国内兜底直连
  - GEOSITE,geolocation-!cn,🚀 节点选择
  - GEOSITE,cn,DIRECT
  - GEOIP,CN,DIRECT,no-resolve
  - MATCH,🚀 节点选择
```

---

## 四、5 个高频“规则写对了却依然失效/误杀”排查清单

1. <strong>为什么配了 <code>gemini.google.com</code> 走新加坡，打开 Gemini 还是提示地区不支持？</strong>
   - 因为 Gemini 登录校验不仅经过 `gemini.google.com`，还会调用 Google 账号认证域（`accounts.google.com`）、风控检测域（`alkalimakersuite-pa.clients6.google.com`）与 `aistudio.google.com`。如果 `accounts.google.com` 走香港而 `gemini.google.com` 走新加坡，两端出口地区不一致极易触发拒访！稳妥起见，可将 Google 登录与 Gemini 相关域名统一指向同组稳定支持的节点，或者在需要使用 Gemini 时把浏览器主通道切换为新加坡。
2. <strong>为什么微信、淘宝、拼多多或公司内网偶尔变慢？</strong>
   - 检查规则中是否把 `DOMAIN-KEYWORD` 写得过短（例如写了 `DOMAIN-KEYWORD,ali,PROXY` 会误伤 `alipay.com`、`alicdn.com` 等整个阿里系国内站点！），或者忘记在 `GEOIP,CN,DIRECT,no-resolve` 上加 `no-resolve` 导致每一次域名匹配都先触发一次耗时的本地 DNS 查询。
3. <strong>为什么买了 <code>exclusive-only</code> 机场后上述 YAML 完全用不了？</strong>
   - 因为自研专属客户端（如飞猫云、隐形人、2026-10 后的无忧链接/Firefly/灵猫等）封闭了通用订阅链接，无法导入 Mihomo YAML 配置，只能依赖官方客户端内置的粗粒度“规则/全局”切换。如果您高度依赖 AI 与流媒体的精细分流，请务必选用支持第三方订阅的品牌（如 [光速云](/reviews/guangsuyun/)、[一翻云](/reviews/yifan/)、[二猫云](/reviews/ermao/) 等）。
4. <strong>如何避免规则把单线程只有 <code>1.60KB</code> 的坏节点选进 <code>url-test</code>？</strong>
   - `url-test` 只测 `204` 握手延迟，有时一个带宽限速到 10KB/s 的半瘫痪节点（如 08-19 实测中的德国 01 或美国 02）依然能快速返回 204 响应！一旦发现某条区域节点极慢，应在筛选正则 `filter` 中显式排除，例如 `(?!.*(德国01|美国02))`，或在 `fallback` 组中切换至健康度更高的节点。
5. <strong>切换完规则后，为什么浏览器刷新页面还是旧地区提示？</strong>
   - 浏览器（尤其是 Chrome/Edge）有自身的 DNS 缓存与 QUIC（HTTP/3）连接复用；AI 与 YouTube 页面还会在 Cookie/LocalStorage 中缓存地区状态。更改规则后，请点击 Clash 客户端的“关闭所有活动连接（Close All Connections）”，并清理目标网站的 Cookie 或用无痕窗口验证新规则是否生效。
6. <strong>如何在移动端 Shadowrocket 或 Stash 中同步这套防误杀分流思路？</strong>
   - 如果你在 iOS 上使用 Shadowrocket（小火箭）或 Stash，同样应当遵循“海外 AI 规则置顶 → 流媒体规则居中 → 国内白名单直连与 GEOIP,CN,DIRECT,no-resolve 靠后”的原则。Stash 原生支持读取与 Mihomo 高度兼容的策略组及正则筛选规则；而在 Shadowrocket 中，建议直接创建对应香港、日本、美国、新加坡的策略分组，并将 `openai.com`、`chatgpt.com`、`claude.ai` 与 `gemini.google.com` 手动分配给对应的美/日/新分组，切忌图省事开启“全局代理（Proxy）”模式，否则微信、高德地图和国内网银都会绕远路变慢。

<BrandRecommendation
  slug="guangsuyun"
  badge="全面支持 Clash/Mihomo 精细覆写 · 商业主推"
  highlight-reason="光速云（LightSpeed）在提供自研客户端的同时完整开放第三方 Clash/Shadowrocket 订阅，且拥有 08-19 双批次逐节点解锁实测图作分流依据（美/日/新解锁 OpenAI，港/日/美看 YouTube，新加坡/土/马解锁 Gemini，美区全解锁 TikTok）。配合上文 Mihomo 覆写规则即可一键解决“仅 APP”与“送中”痛点。"
/>

<div style="margin: 1.5rem 0;">
  <AffiliateButton brand-slug="guangsuyun" source-section="clash_rules_bottom" />
</div>

---

## 常见问题 FAQ

### Q1：为什么我用香港节点看网页很快，但打开 ChatGPT 网页版提示不可用或仅限 APP、打开 Gemini 直接报错？
这是节点所在地区的服务限制与 IP 识别策略所致。在本站 2026-08-19 光速云实测中，62 节点 SS 批次的香港节点 OpenAI 多显示仅 APP(HK)，70 节点 VLESS 批次的香港节点多被识别为 US/JP 或 N/A，且港/日/美多数节点解锁 Gemini 失败，只有新加坡/土耳其/马来西亚等部分节点可解锁 Gemini。解决办法不是换整个订阅，而是在 Clash/Mihomo 中按域名把 OpenAI/Claude 与 Gemini 拆到独立策略组，分别指向日/美与新加坡/马来节点。

### Q2：遇到新加坡或台湾节点看 YouTube 出现“送中（CN）”该怎么用分流规则彻底规避？
当 YouTube 节点的出口 IP 被 Google 定位库识别为中国内地（CN）时，YouTube Premium 后台播放、无广告权益和部分视频会失效（例如 08-19 实测显示光速云 SG 10 节点与 TW 9 节点出现送中 CN，07-18 实测无忧链接 HKG-01 亦出现送中）。在 Clash 中只需新建一个“🎬 YouTube”策略组，利用正则过滤只保留确认未送中的香港（除异常号外）、日本或美国节点，就能彻底摆脱送中。

### Q3：自己加自定义 Clash 分流规则时，为什么有时写了规则却不生效，或者把微信/银行 App 误杀走代理？
根本原因在于 Clash 规则匹配遵循“自上而下、首次命中即停止”的原则，且常与 Fake-IP DNS 解析配合。如果把范围过宽的关键词规则（如 DOMAIN-KEYWORD）或 MATCH 兜底放得太靠前，就会劫持国内流量；反之如果把自定义 AI 规则插在 GEOSITE,google 或 PROXY 通用规则之后，则会先被宽泛规则截胡而失效。正确做法是将自定义精细规则放在 rules 列表最顶部（或通过 Mihomo 覆写 prepend-rules 注入头部）。
