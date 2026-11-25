---
title: 光年梯（GuangNian）深度测评：¥18/月 110GB IEPL 定位与午后测速、协议差异解析
seoTitle: 光年梯机场测评 (2026) - ¥18/月 110GB IEPL 套餐、VLESS/SS 口径与极连云对比
description: 光年梯深度测评：2025 年运营的 ¥18/月 110GB IEPL 专线机场，比同价极连云多 10GB，支持自研与第三方订阅；详析 18 元档单 GB 成本、VLESS vs 08-11 14:38 CST Shadowsocks 截图冲突与排障指南。
canonical: /reviews/guangnian/
schemaType: Article
brandSlug: guangnian
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: 2026-11-24
updatedDate: 2026-11-25
verifiedDate: 2026-11-24
dataStatus: Measured
sourceNote: 综合品牌清单、24站点aff前缀表与 2026-08-11 14:38:04 CST 实测截图；存在 VLESS vs SS 协议冲突与 guangs vs ggmq 域冲突，且 08-11 为午后非晚高峰采样。
faq:
  - question: 光年梯 18 元套餐有多少流量？比极连云划算吗？
    answer: 根据 data/plans.json，光年梯基础月付档为 ¥18/月 110GB/月（单 GB 约 ¥0.1636/GB），比同为 18 元 IEPL 档的极连云（100GB/月，¥0.1800/GB）多出 10GB 流量、单 GB 便宜 9.09%。但光年梯为 2025 年新品牌且 08-11 测速时间为午后 14:38，而极连云为 2024 年运营且有 22:46 晚高峰测速图，性价比需结合流量与时段偏好权衡。
  - question: 光年梯支持什么协议？为什么资料写 VLESS 而截图显示 Shadowsocks？
    answer: 品牌清单第 511 行标注光年梯采用 VLESS 协议，但 2026-08-11 实测截图（MAI-TEST-BOT）显示测试节点使用的是 Shadowsocks。这可能意味着光年梯服务端同时部署了双协议，或在不同时期调整了订阅下发协议；两者均可被 Clash Verge Rev、v2rayN、Shadowrocket 等现代第三方客户端兼容。
  - question: 光年梯支持第三方客户端吗？需要下载专属软件吗？
    answer: 不强制专属软件。品牌资料明确标注光年梯支持“自研客户端 + 第三方订阅导入”，用户既可以使用官方客户端，也可以把订阅链接导入第三方客户端。
  - question: 光年梯的 2026-08-11 测速截图能代表晚高峰表现吗？
    answer: 不能直接代表。该张原始截图测试时间为 2026-08-11 14:38:04 CST，处于下午非晚高峰时段，网络负载通常低于晚上 20:00–23:00。因此该截图只能证明节点连通与午后吞吐基准，晚高峰表现仍建议购入首月后亲自验证。
  - question: 光年梯优惠码 gnt6666 的折扣是多少？是否支持 ChatGPT 和 Netflix？
    answer: 现有资料记录优惠码为 gnt6666，具体折扣比例待核实。品牌资料声明“支持常见 AI 工具使用场景”和“支持主流流媒体使用场景”（ChatGPT、Claude、Netflix、Disney+、YouTube 列为品牌方资料支持，Gemini、HBO Max、TikTok、Spotify 为未分项实测）。
---

# 光年梯（GuangNian）深度测评：¥18/月 110GB IEPL 定位与午后测速、协议差异解析

> <strong>核心结论（Answer-First）</strong>：光年梯（GuangNian）是 <strong>2025 年上线的中档入门型 IEPL 专线机场</strong>，定位“介于低价中转套餐与综合型旗舰专线之间”，<code>data/plans.json</code> 收录基准方案为 <strong>¥18/月 110GB 流量（¥0.1636/GB）</strong>，支持<strong>自研客户端与第三方订阅双导入</strong>。在 ¥18/月档位中，它比同价竞品 [极连云](/reviews/jilian/) 多出 <strong>10GB/月流量</strong>，且品牌资料同时覆盖了常见 AI 工具与主流流媒体使用场景。但审校也发现两处必须明示的限制：一是 2026-08-11 的 `MAI-TEST-BOT` 原始截图采样于 <strong>14:38 CST 午后非晚高峰</strong>，无法直接替代晚高峰稳定性验证；二是品牌资料写 `VLESS` 协议，而 08-11 实测截图显示 `Shadowsocks`。<strong>总体适合预算在 ¥18/月、流量刚需卡在 100–110GB 且希望兼顾第三方客户端的用户月付试水；对 2025 年新站稳定性有较高要求的保守用户，购前建议重点测试晚高峰表现。</strong>

<BrandOverview slug="guangnian" />

<AffiliateButton slug="guangnian" source-section="hero" label="前往光年梯核验最新套餐与协议列表" />

---

## 一、产品定位：“中间态”18 元 IEPL 方案的逻辑

在机场市场中，¥5–¥10/月往往是公网中转小包的主战场，而 ¥25–¥45/月则是主流综合专线机场的起步区间。光年梯将自己的产品明确定义在<strong>“介于低价套餐和综合型专线套餐之间”</strong>——以 <strong>¥18/月、110GB/月</strong> 的价格切入市场：

- 相比月付仅 50–60GB 或单纯公网中转的低价方案，它保留了 <strong>IEPL 专线</strong> 与 <strong>110GB</strong> 的实用配额；
- 相比 ¥25/月 150GB 档位（如 [可信云](/reviews/kexin/)、[速界](/reviews/sujie/)、[SOGO 云](/reviews/sogo/)），每月省下 ¥7 元，同时避免中低频用户买完 150GB 用不完的浪费。

需要坦诚指出的是，光年梯于 <strong>2025 年成立</strong>，目前尚无多年跨度运维史；同时其多周期完整价目表（如是否存在季付/年付小包或更大流量月付）、节点覆盖国家明细、设备数量上限、支付渠道及退款规则在现有源文档中均尚未披露（标记为 `待核实`）。

---

## 二、套餐单 GB 成本精算与竞品横坐标

<PricingMatrix slug="guangnian" />

<CouponInfo slug="guangnian" />

### 成本账目与 18–25 元梯队精确对照
在 `data/plans.json` 中，光年梯目前收录 <strong>1 档已核实方案</strong>：`光年梯·基础月付档`，<strong>¥18/月 · 110GB/月</strong>，单 GB 成本精确为 <strong>¥0.1636/GB</strong>（多周期年付或不限时套餐表待核实；优惠码 `gnt6666` 折扣比例待结账实测）。

把 `¥0.1636/GB` 放在相邻价格梯队中对比，能看出光年梯定价策略的精准之处：

| 品牌与套餐 | 标称月价 | 月流量 | 单 GB 成本 | 相对光年梯效率差 |
| --- | --- | --- | --- | --- |
| <strong>光年梯·基础月付档</strong> | <strong>¥18 / 月</strong> | <strong>110GB / 月</strong> | <strong>¥0.1636 / GB</strong> | 基准参考（2025 年新站 · 午后 14:38 图） |
| [极连云](/reviews/jilian/)·基础月付档 | ¥18 / 月 | 100GB / 月 | ¥0.1800 / GB | 贵 ¥0.0164/GB（光年梯单价低 9.09%） |
| [U1S1](/reviews/u1s1/)·普通人真够了包 | ¥20 / 月 | 120GB / 月 | ¥0.1667 / GB | 多花 ¥2 仅多 10GB（边际 ¥0.20/GB），但获 22:33 晚高峰图 |
| [可信云](/reviews/kexin/) / [速界](/reviews/sujie/) / [SOGO 云](/reviews/sogo/) | ¥25 / 月 | 150GB / 月 | ¥0.1667 / GB | 贵 ¥7 多 40GB（边际 ¥0.175/GB），单位流量反而略贵于光年梯 |
| [一翻云](/reviews/yifan/)·轻享版 | ¥20 / 月 | 150GB / 月 | <strong>¥0.1333 / GB</strong> | 只贵 ¥2 多 40GB（边际仅 <strong>¥0.05/GB</strong>），并附带三协议 |

<strong>核心算账结论</strong>：在所有已核实月付基准档中，光年梯把 18 元档的单 GB 成本压到了甚至略低于主流 25 元 150GB 档的水平（¥0.1636 vs ¥0.1667）；唯一比它单 GB 更便宜的同段月付竞品，是向上加 ¥2 的 [一翻云](/reviews/yifan/)（¥20/150GB，¥0.1333/GB）。

---

## 三、VLESS 与 Shadowsocks 协议冲突及客户端排查配置

<NetworkTopology slug="guangnian" />

<ClientCompatibility slug="guangnian" />

在审校光年梯的技术参数时，我们重点记录了<strong>协议口径冲突</strong>与<strong>双推广域名记录</strong>：

1. <strong>协议冲突：VLESS（文本资料） vs Shadowsocks（08-11 实测截图）</strong>
   - 《32家机场品牌清单》第 511 行明确标明光年梯支持 <strong>VLESS</strong> 协议；
   - 然而 2026-08-11 的 `MAI-TEST-BOT` 测速截图面板上，光年梯节点实际跑的是 <strong>Shadowsocks</strong>。
   - <strong>技术层面影响</strong>：这种差异在真实运营中通常有两种原因——要么机场后台同时提供了 VLESS 与 Shadowsocks 两套节点组，测速时拉取了 SS 组；要么品牌初期主打 SS 后续新增/调整了 VLESS。对用户而言，好消息是无论是 Shadowsocks 还是 VLESS，只要避开早已停止维护、不支持 VLESS 的原版 Clash for Windows，主流现代客户端均可同时兼容。
2. <strong>全平台兼容与双模式自由度</strong>：光年梯支持<strong>自研客户端 + 第三方订阅导入</strong>（规避了[专属客户端生态锁定](/risks/exclusive-client-lockin/)），支持 [Clash Verge Rev](/clients/clash-verge-rev/)、[v2rayN](/clients/v2rayn/)、[FlClash](/clients/flclash/)、[Hiddify](/clients/hiddify/)（[Windows](/clients/windows/) / [macOS](/clients/macos/) / [Linux](/clients/linux/)），以及移动端 [Shadowrocket](/clients/shadowrocket/)、[Stash](/clients/stash/)（[iOS](/clients/ios/)）、[v2rayNG](/clients/v2rayng/)（[Android](/clients/android/)）和 [OpenWrt](/clients/openwrt/) 软路由上的 [OpenClash](/clients/openclash/) / [PassWall2](/clients/passwall2/) / [sing-box](/clients/sing-box/)（完整对照见[客户端兼容性总表](/clients/compatibility/)）。
3. <strong>推广域名前缀差异</strong>：主清单使用 `guangs.gntaff.com`，而 24 站点前缀表记录 `ggmq.gntaff.com`，均为 `gntaff.com` 下的不同子域入口。

### 客户端配置与常见故障排查直达
- <strong>导入与分流实战</strong>：先按[订阅导入与客户端配置指南](/guides/subscription/)拉取节点；若列表同时出现 VLESS 与 SS 两组节点，可通过[Clash 分流规则教程](/guides/clash-rules/)分别测试稳定性，并将 OpenAI/Netflix 分流至延迟稳定的海外地区。
- <strong>常见报错自救</strong>：
  - 若遇到旧内核无法解析 VLESS 导致节点列表残缺或报错，参照[订阅失败与更新报错排查](/troubleshooting/subscription-failed/)确认客户端内核是否为 Mihomo / Xray / sing-box；
  - 若午后正常但晚高峰出现个别节点断流，对照[节点超时与不可用排查](/troubleshooting/node-timeout/)设置延迟测速组自动切换；
  - 若开启桌面全局代理后内网或国内站点异常，参阅[TUN 模式与 DNS 污染排查](/troubleshooting/tun-dns-error/)与[TUN 与 DNS 分流指南](/guides/tun-dns/)。

---

## 四、2026-08-11 14:38 CST 午后测速样本解析

<SpeedReport slug="guangnian" />

光年梯目前的实测性能数据完全依赖 `sources/speedtest-2026-08-11/光年梯-节点测速实测.png`（1122×1402 PNG），尚无 2026-10-19 五地区文本测速数据补充。

### 关键时段限定（14:38 CST 非晚高峰）
- <strong>测试时间</strong>：`2026-08-11T14:38:04+08:00`（北京时间下午 14:38）。
- <strong>测试环境</strong>：`MAI-TEST-BOT 2.0.0-dev`，珠海联通 5Gbps 后端，32 线程，Ping 5 次。
- <strong>客观解读</strong>：下午 14:38 处于全天国际带宽负载较低的时段（`isPeakHours: false`），该截图能够验证光年梯在 2026 年 8 月中旬具备完整的节点集群可用性与基础测速表现，但<strong>绝对不能用来推论晚上 20:00–23:00 晚高峰不拥堵</strong>。对于 2025 年刚上线的新品牌，晚高峰抗压能力只能在购入首月后自行用 [测速方法与避坑指南](/guides/speedtest-guide/) 在本地宽带下验证。

---

## 五、AI 工具与流媒体使用场景评估

<AvailabilityMatrix slug="guangnian" />

与“只提 AI 不提流媒体”的极连云相比，光年梯在品牌资料中明确给出了更宽的应用覆盖声明：
- <strong>品牌方声明支持</strong>：常见 AI 工具（ChatGPT、Claude）与主流流媒体（Netflix、Disney+、YouTube）。
- <strong>未分项实测项目</strong>：Gemini、HBO Max、TikTok、Spotify 均尚未进行独立分项测试或缺少明确说明。

<strong>真实性提醒</strong>：目前光年梯的所有解锁条目均属于 `Vendor Data`（厂商资料描述），2026-08-11 截图批次未包含流媒体或 OpenAI 探测列。由于平台风控（尤其是 Gemini 与跨区流媒体）随 IP 池动态变化，建议购后先逐一验证自己常用的地区节点（如新加坡/日本/美国）。

---

## 六、原始证据与资料透明度核查

<EvidencePanel slug="guangnian" />

证据面板完整呈现了光年梯的原始归档图片与两项冲突记录（协议 VLESS vs SS、子域 `guangs` vs `ggmq`）。目前仍缺失的关键字段包括：完整多档套餐（年付/不限时）、节点地区列表与数量、设备连接数限制、支付方式及售后退款条款。

---

## 七、适合与不适合人群

### 适合人群
- <strong>预算严格控制在 ¥18/月、月流量需要 100–110GB 的用户</strong>：在同价位单 GB 成本（¥0.1636/GB）表现优秀，能覆盖日常 AI 工具、轻量流媒体与海外网页需求。
- <strong>既想要官方客户端便利、又保留第三方订阅灵活性的用户</strong>。

### 不适合人群
- <strong>非老牌不选的保守型买家</strong>：2025 年新品牌叠加仅有下午 14:38 测速截图，缺乏晚高峰独立验证与跨年口碑积累。
- <strong>要求购买前确认所有地区节点清单、设备数量及明确退款承诺</strong>的用户。

---

## 八、与同区间品牌的差异化对比及直达入口

在 ¥18–¥20/月这一核心带中，建议把光年梯与以下品牌放在一起看：

1. <strong>对比 [极连云](/reviews/jilian/)（¥18/月 · 100GB）</strong>：两者定价、IEPL 架构和双客户端模式完全一致。光年梯胜在<strong>多 10GB 流量</strong>和<strong>同时声明支持流媒体</strong>；极连云胜在<strong>2024 年更早运营</strong>、<strong>协议文字与实测一致</strong>以及拥有 <strong>22:46 CST 晚高峰实测图</strong>。
2. <strong>对比 [一翻云](/reviews/yifan/)（¥20/月 · 150GB）</strong>：多花 ¥2/月，可获得 150GB 流量（+40GB）、Hysteria 2 / VLESS-Reality / SS 三协议开放、明确不限设备及 10-19 五地区文本测速，但测试图也处于凌晨非晚高峰。
3. <strong>对比 [U1S1](/reviews/u1s1/)（¥20/月 · 120GB）</strong>：同样只比光年梯贵 ¥2/月，流量多 10GB（120GB），明确不限设备且拥有 22:33 CST 晚高峰实测图。

### 同档位横向对比直达

- <strong>[IEPL 与 IPLC 专线横向对比](/compare/iepl-vs-iplc/)</strong>：对比光年梯 18 元 IEPL 专线与更高价位 IPLC 专线在协议开销及跨境抖动上的实际表现差异。
- <strong>[客户端兼容性横向对比](/compare/client-compatibility/)</strong>：查看光年梯“自研 + 第三方订阅双模式”以及 VLESS/SS 双协议兼容在现代客户端中的具体适配情况。
- <strong>[平价与高性价比机场横向对比](/compare/budget-airports/)</strong>：将光年梯 `¥18/110GB` 放进全站平价与高性价比梯队，对比 ¥8–¥25/月各档的单位流量效率。
- <strong>[机场月付 vs 年付回本账期对比](/compare/monthly-vs-annual/)</strong>：在新品牌缺乏年付明码与晚高峰截图的阶段，理解坚持月付试水的成本控制原则。

---

## 九、购前注意事项

1. <strong>按月起购验证晚高峰</strong>：由于 08-11 截图测于午后 14:38，首次下单务必只买 1 个月（¥18），重点在晚上 20:30–22:30 检验本地电信/移动/联通下的油管 4K 与 ChatGPT 响应速度。
2. <strong>面板核对协议与节点</strong>：登录后确认订阅内是否真的包含 VLESS 节点及所需地区，并测试优惠码 `gnt6666` 是否生效。
3. <strong>更新客户端内核</strong>：若打算接入 VLESS 节点，请确保使用的客户端内核支持 VLESS（如 Clash Verge Rev、v2rayN、Shadowrocket）。

<AffiliateButton slug="guangnian" source-section="footer" label="前往光年梯官网核验最新套餐" />

<RelatedBrand slug="guangnian" :related-slugs="['jilian', 'yifan', 'u1s1', 'sujie']" />

---

## 常见问题（FAQ）

### Q1：光年梯 18 元套餐有多少流量？比极连云划算吗？

根据 data/plans.json，光年梯基础月付档为 ¥18/月 110GB/月（单 GB 约 ¥0.1636/GB），比同为 18 元 IEPL 档的极连云（100GB/月，¥0.1800/GB）多出 10GB 流量、单 GB 便宜 9.09%。但光年梯为 2025 年新品牌且 08-11 测速时间为午后 14:38，而极连云为 2024 年运营且有 22:46 晚高峰测速图，性价比需结合流量与时段偏好权衡。

### Q2：光年梯支持什么协议？为什么资料写 VLESS 而截图显示 Shadowsocks？

品牌清单第 511 行标注光年梯采用 VLESS 协议，但 2026-08-11 实测截图（MAI-TEST-BOT）显示测试节点使用的是 Shadowsocks。这可能意味着光年梯服务端同时部署了双协议，或在不同时期调整了订阅下发协议；两者均可被 Clash Verge Rev、v2rayN、Shadowrocket 等现代第三方客户端兼容。

### Q3：光年梯支持第三方客户端吗？需要下载专属软件吗？

不强制专属软件。品牌资料明确标注光年梯支持“自研客户端 + 第三方订阅导入”，用户既可以使用官方客户端，也可以把订阅链接导入第三方客户端。

### Q4：光年梯的 2026-08-11 测速截图能代表晚高峰表现吗？

不能直接代表。该张原始截图测试时间为 2026-08-11 14:38:04 CST，处于下午非晚高峰时段，网络负载通常低于晚上 20:00–23:00。因此该截图只能证明节点连通与午后吞吐基准，晚高峰表现仍建议购入首月后亲自验证。

### Q5：光年梯优惠码 gnt6666 的折扣是多少？是否支持 ChatGPT 和 Netflix？

现有资料记录优惠码为 gnt6666，具体折扣比例待核实。品牌资料声明“支持常见 AI 工具使用场景”和“支持主流流媒体使用场景”（ChatGPT、Claude、Netflix、Disney+、YouTube 列为品牌方资料支持，Gemini、HBO Max、TikTok、Spotify 为未分项实测）。
