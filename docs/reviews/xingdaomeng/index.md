---
title: 星岛梦（StarDream）2026 深度测评：2020 年老牌 IEPL、1TB 不限时与协议差异实证
description: 机场测评实验室对 2020 年老牌机场星岛梦（StarDream）的深度测评：解析港台日美新及韩国/东南亚多地区覆盖、不限设备政策、9 档套餐（含 ¥96/年小包及 100G/300G/1TB 永久包）、2026-08-11 实测与 Trojan/Shadowsocks 协议差异。
slug: xingdaomeng
category: reviews
tags:
  - 星岛梦
  - StarDream
  - 2020老牌机场
  - IEPL专线
  - 不限时流量包
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
primaryKeyword: 星岛梦测评
secondaryKeywords:
  - 星岛梦机场怎么样
  - StarDream 机场测速
  - 星岛梦不限时套餐 1TB
  - 星岛梦优惠码 nmw888
searchIntent: 老牌机场评估：对比星岛梦与光速云同为 2020 年运营老牌的定价、1TB 不限时流量包、韩国/东南亚节点以及凌晨测速截图细节。
entities:
  - 星岛梦
  - StarDream
  - IEPL专线
  - Trojan
  - Shadowsocks
  - MAI-TEST-BOT
sources:
  - sources/brand-info/32家机场品牌清单.txt
  - sources/brand-info/24个站点的aff替换前缀.txt
  - sources/speedtest-2026-08-11/speedtest-manifest.json
  - data/brands.json
  - data/plans.json
  - data/benchmarks.json
  - data/benchmark-sources.json
  - data/availability.json
  - data/network-routes.json
  - data/client-compatibility.json
  - data/risk-records.json
dataStatus: Measured
schemaType: Article
pillar: /reviews/
relatedSlugs:
  - guangsuyun
  - weifeng
  - weitu
  - ermao
  - firefly
faq:
  - question: 星岛梦（StarDream）和光速云同为 2020 年运营的老牌机场，核心差异在哪里？
    answer: 两者均具备 2020 年起始运营背景、1 倍流量 IEPL 专线定位以及不限设备同时在线特性，但侧重点明显不同：星岛梦拥有 100GB（¥100）、300GB（¥300）和 1TB（¥600）三档阶梯式永久不限时流量包，且区域明确延伸至韩国与东南亚；而光速云则在 2026-08-19 留存了五张跨三网与单线程的 MiaoKo 专项实测图，实测证据密度更高，且月付 ¥34/268GB 与 ¥68/568GB 档位单 GB 更低。
  - question: 为什么星岛梦的介绍写 Trojan 协议，2026-08-11 测速图却显示 Shadowsocks？
    answer: 这属于典型的文档与实测协议差异：品牌介绍文本标注“Trojan 协议”，但 2026-08-11 01:48:13 CST 的 MAI-TEST-BOT 实测截图显示节点为 Shadowsocks。实际订阅中可能同时下发双协议节点，或服务端已从 Trojan 调整为 Shadowsocks，使用主流现代客户端（如 Clash Verge Rev / Shadowrocket）均可同时兼容这两类协议。
  - question: 星岛梦 2026-08-11 的测速截图能代表晚高峰表现吗？
    answer: 不能直接代表。星岛梦 2026-08-11 原始测速 PNG（MAI-TEST-BOT，珠海联通 5Gbps 32 线程）的测试时间为凌晨 01:48:13 CST，属于深夜非高峰时段；而 2026-10-19 的 5 地区文本记录同样标注“非晚高峰”。购买前仍建议先购 ¥25 月付实测晚高峰 20:00-23:00 的表现。
  - question: 星岛梦限制设备登录数量吗？优惠码 nmw888 折扣是多少？
    answer: 不限设备数量。品牌资料明确写明“1 倍流量且不限设备使用”，适合多设备家庭或小型团队共享。优惠码为 nmw888，但当前品牌资料未明确标注具体折扣百分点与适用套餐限制，请以官网结账页输入后的实时显示为准。
---

# 星岛梦（StarDream）深度测评：2020 年老牌 IEPL、三档永久不限时与韩/东南亚覆盖解析

**核心结论（Answer-First）：** 星岛梦（StarDream）与光速云同为本站少数可追溯至 **2020 年运营**的老牌品牌，主打 **IEPL 专线、全节点 1 倍流量与不限设备数量**。它最突出的两大差异化看点是：**第一，节点覆盖在常见的港/台/日/美/新之外，明确延伸到韩国与东南亚地区**，适合有日韩游戏、东南亚跨境电商或海外多区办公需求的用户；**第二，提供 100GB（¥100）、300GB（¥300）与 1TB（¥600）三档阶梯式永久不限时流量包**，且 1TB 包单 GB 仅 ¥0.60，是全库一次性不过期套餐里最划算的方案之一。需要留意的客观局限在于：2026-08-11 测速截图测试时间为**凌晨 01:48:13 CST**（非晚高峰），且文案写的 `Trojan` 与截图显示的 `Shadowsocks` 存在协议不一致。

<BrandOverview slug="xingdaomeng" />

<AffiliateDisclosure />

---

## 一、运营年限、地域版图与跨源协议冲突

1. **6 年+运营背景与服务定位**：星岛梦自 2020 年运营，强调“海外技术团队与多人客服”，在重点评测序列中属于资历最深的老牌阵营之一。
2. **7 大区域延伸（含韩国与东南亚）**：除港、台、日、美、新五大标准区域外，星岛梦是少数明确将 **韩国** 与 **东南亚** 写入主力覆盖清单的 IEPL 品牌，对于需要韩国 IP 追韩剧/游戏加速、或操作 Shopee/Lazada 等东南亚电商店铺的用户更具针对性。
3. **两项文档冲突如实记录**：
   - **协议冲突**：介绍说明正文（第 218 行）标注 `Trojan 协议`，但 `2026-08-11` 实测截图显示协议为 `Shadowsocks`。对于使用 `Clash Verge Rev`、`Shadowrocket` 等现代客户端的用户，两种协议均无缝支持，不影响正常导入；但对仅配置了单一协议内核的老设备需提前确认。
   - **双推广前缀冲突**：主清单使用 `guangs.xingdaomeng.com` 子域名，而《24个站点的aff替换前缀.txt》另列 `kfccbb.xingdaomeng.com`。

<CouponInfo slug="xingdaomeng" />

<NetworkTopology slug="xingdaomeng" />

<StabilityHistory slug="xingdaomeng" />

---

## 二、9 档完整套餐矩阵、边际成本与不限时包回本测算

星岛梦在 `data/plans.json` 中的套餐总数达 **9 个**，最适合重点横向对比的是其**三档永久不限时包**与**月付大流量梯度**：

| 套餐名称 | 计费周期 | 标称价格 | 流量额度 | 折合月均 | 单 GB 成本 | 升级边际成本与适用分析 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **星岛梦·贴心小包** | 年付 | **¥96 / 年** | 60GB / 月 | **¥8.00 / 月** | **¥0.1333 / GB** | 年付轻度入门，比光速云轻量版（¥99/69GB）总价少 ¥3 但月流量少 9GB |
| **星岛梦·超量150G** | 月付 | **¥25 / 月** | 150GB / 月 | ¥25.00 / 月 | ¥0.1667 / GB | **新用户首月试水档**：验证韩国/东南亚节点与晚高峰表现 |
| **星岛梦·进阶300G** | 月付 | **¥50 / 月** | 300GB / 月 | ¥50.00 / 月 | ¥0.1667 / GB | +¥25 多 150GB（边际 **¥0.1667/GB**），完全线性无折扣，性价比低于光速云流光版（¥34/268GB） |
| **星岛梦·闪光500G** | 月付 | **¥70 / 月** | 500GB / 月 | ¥70.00 / 月 | ¥0.1400 / GB | 较进阶 300G +¥20 多 200GB（边际 **¥0.1000/GB**），从这一档才开始显现大流量让利 |
| **星岛梦·旗舰1T版** | 月付 | **¥130 / 月** | 1000GB / 月 | ¥130.00 / 月 | **¥0.1300 / GB** | 较闪光 500G +¥60 多 500GB（边际 **¥0.1200/GB**），配合不限设备适合家庭/小团队合用 |
| **星岛梦·永久不限时100** | 一次性付费 | **¥100** | 100GB 一次性 | 不适用 | ¥1.0000 / GB | 小额应急不过期，与二猫云（¥99/100GB）、Firefly（¥100/100GB）同价位 |
| **星岛梦·永久不限时300** | 一次性付费 | **¥300** | 300GB 一次性 | 不适用 | ¥1.0000 / GB | 较 100G +¥200 多 200GB（边际 **¥1.0000/GB**），与买 3 个 100G 完全同价，无规模优惠 |
| **星岛梦·永久不限时1TB** | 一次性付费 | **¥600** | 1000GB 一次性 | 不适用 | **¥0.6000 / GB** | 较 300G +¥300 多 700GB（边际低至 **¥0.4286/GB**），**全站 1TB 不限时最低价之一** |
| **星岛梦·定制套餐** | 月付 | **¥680 / 月** | 500GB / 月 | ¥680.00 / 月 | ¥1.3600 / GB | 高预算独立定制档（具体专属 IP 细节需咨询客服） |

**单 GB 与预算盈亏平衡点测算**：
1. **月付避免停在“进阶 300G（¥50）”**：如果每月需要 250–350GB，进阶 300G 单 GB 仍为 ¥0.1667；多加 ¥20 直接上 **闪光 500G（¥70）**，多出来的 200GB 边际成本仅 ¥0.10/GB，性价比高出许多。
2. **贴心小包（¥96/年）vs 超量 150G 月付（¥25/月）回本线**：若每月流量不超过 60GB，年付小包只需连续使用 **3.84 个月**（第 4 个月月付累计 ¥100 > ¥96）即可回本。
3. **永久不限时 1TB（¥600）vs 贴心小包（¥96/年 · 720GB/年）盈亏平衡点**：¥600 预算等价于连续购买 **6.25 年**的贴心小包（合计可用 4,500GB 周期流量）。因此：
   - 如果你是常规日常用户，月均流量在 **20–60GB** 之间，买 ¥96/年 贴心小包远比买 ¥600 1TB 永久包更合算；
   - 只有在**跨多年极低频应急备用（月均消耗低于 13.3GB/月）**，或者**需要多台设备长期共享、不想每年记挂续费且看重 1TB/¥600 的全库底价**（比飞猫云 ¥680/1TB 省 ¥80、比隐形人 ¥1199/1TB 省 ¥599）时，永久不限时 1TB 才是真正的高性价比选择。此外，永久不限时 300G（¥300）单 GB 与 100G 完全持平（¥1.00/GB），预算足够时直接跳档 1TB 边际成本仅 ¥0.4286/GB。

<PricingMatrix slug="xingdaomeng" />

<PlanSelector slug="xingdaomeng" />

---

## 三、双批次测速证据解析与局限提示

### 1. 2026-08-11 01:48 CST 截图实测（Measured）

- **测试时间**：`2026-08-11 01:48:13 CST`（周二凌晨，完全非晚高峰）
- **工具与后端**：`MAI-TEST-BOT 2.0.0-dev` · 珠海联通 5Gbps · 32 线程 · Ping 5 次
- **显示协议**：`Shadowsocks`
- **证据文件**：`星岛梦-节点测速实测.png`（1122 × 1402 px）

### 2. 2026-10-19 非晚高峰文本测速（Historical Data）

- **香港**：`27ms` / `504Mbps`
- **台湾**：`41ms` / `103Mbps`
- **新加坡**：`44ms` / `411Mbps`
- **日本**：`57ms` / `136Mbps`
- **美国**：`177ms` / `18Mbps`

<SpeedReport slug="xingdaomeng" />

<LatencyChart slug="xingdaomeng" />

<ThroughputChart slug="xingdaomeng" />

**解读注意**：由于 `08-11` 截图是在凌晨 1:48 完成的，国内骨干国际出口处于全天最空闲窗口，而 `10-19` 文本同样标注为非晚高峰，因此两者都**不能证明晚高峰 20:00–23:00 的拥塞表现**。但它们结合 2020 年的运营资历，证明了其节点服务与第三方订阅的真实可测性。

---

## 四、解锁声明、客户端配置指南与排障直达

### 1. 解锁现状与多端客户端分流部署

- **AI 与流媒体**：品牌资料声明支持 ChatGPT、Claude、Netflix、Disney+、YouTube、HBO Max、TikTok、Spotify，Gemini 视节点而定（均属 `Vendor Data`，尚未有独立解锁截图逐项验证）。
- **多平台客户端实战部署**：星岛梦未限定专属客户端，且 `08-11` 通过 `Shadowsocks` 节点完成第三方测速，加上**全节点 1 倍流量与不限设备数量**，非常适合全屋多设备与跨境运营分流（详情核对[客户端兼容性总表](/clients/compatibility/)）：
  - **桌面端（[Windows](/clients/windows/) / [macOS](/clients/macos/)）**：推荐使用 [Clash Verge Rev](/clients/clash-verge-rev/)（Mihomo 内核同时原生支持 Trojan 与 Shadowsocks，无需担心协议文档差异）或 [v2rayN](/clients/v2rayn/)；macOS 亦可选 [Stash](/clients/stash/) 或 [FlClash](/clients/flclash/)。建议针对韩国和东南亚节点单独建立手动筛选策略组（`select`），方便韩区流媒体/游戏或 Shopee/Lazada 跨境店铺稳定锁定出口。
  - **移动端（[iOS](/clients/ios/) / [Android](/clients/android/)）**：iOS 推荐 [Shadowrocket](/clients/shadowrocket/) 或 [Karing](/clients/karing/)，Android 推荐 [v2rayNG](/clients/v2rayng/) 或 [Clash Meta for Android](/clients/clash-meta-for-android/)。
  - **家庭软路由（[OpenWrt](/clients/openwrt/)）**：配合不限设备政策，在主路由或旁路由部署 [OpenClash](/clients/openclash/) 或 [PassWall2](/clients/passwall2/) 可让电视盒子、主机与手机共享订阅，且 1 倍流量不会因软路由后台自动更新产生额外倍率扣费。
- **风险与缺口**：缺少支付方式（支付宝/微信/USDT）及退款政策说明，优惠码 `nmw888` 具体折扣比例未披露，且缺乏晚高峰截图。建议先购买 **¥25 超量 150G 月付**实测 1 个月晚高峰及韩国/东南亚目标站点可用性后，再决定是否购入 ¥96 年付或 ¥600 1TB 永久包。

### 2. 常见故障排查直达

- **订阅链接更新报错或 `guangs`/`kfccbb` 双域名前缀混淆**：始终在当前可访问的官网控制面板复制最新订阅链接；若遇到更新失败或 YAML 解析错误，按[订阅失败与更新报错排查指南](/troubleshooting/subscription-failed/)排查系统代理回环及 DoH 设置。
- **Trojan/SS 个别节点超时或韩国/东南亚节点延迟突变**：使用 `url-test` 组自动剔除高延迟节点，具体排查步骤见[节点超时与不可用排查指南](/troubleshooting/node-timeout/)。
- **软路由或桌面端开启 TUN 后内网/国内网站异常**：按[TUN 模式与 DNS 污染排查指南](/troubleshooting/tun-dns-error/)修正 DNS 分流与 Fake-IP 规则。

<AvailabilityMatrix slug="xingdaomeng" />

<ClientCompatibility slug="xingdaomeng" />

<EvidencePanel slug="xingdaomeng" />

---

## 五、同档位横向对比直达

- **[光速云 vs 星岛梦横向对比](/compare/guangsuyun-vs-xingdaomeng/)**：同为 2020 年起运营的两大老牌 IEPL 机场全面对决——对比 3 批次实测截图完整度、韩国/东南亚节点差异以及 ¥99 vs ¥96 年付选型。
- **[一次性不限时（永久）流量包横向对比](/compare/non-expiring-plans/)**：查看星岛梦 1TB 永久包（¥600 · ¥0.60/GB）如何在 15 家永久流量包对比中稳居大流量低单价梯队。
- **[平价与高性价比机场横向对比](/compare/budget-airports/)**：对照 ¥96/年贴心小包（¥8.00/月）在入门低价梯队中的竞争力。
- **[IEPL 专线 vs IPLC 专线横向选购对比](/compare/iepl-vs-iplc/)**：对比星岛梦 IEPL 专线与唯兔云、Firefly 等 IPLC 专线的跨境特征。
- **[机场月付 vs 年付回本账期对比](/compare/monthly-vs-annual/)**：科学评估何种月耗场景选 ¥96 年付、何种场景选 ¥600 1TB 永久包。

<RelatedBrand slug="xingdaomeng" />

<AffiliateButton slug="xingdaomeng" size="lg" />

---

## 常见问题（FAQ）

### Q1：星岛梦（StarDream）和光速云同为 2020 年运营的老牌机场，核心差异在哪里？

两者均具备 2020 年起始运营背景、1 倍流量 IEPL 专线定位以及不限设备同时在线特性，但侧重点明显不同：星岛梦拥有 100GB（¥100）、300GB（¥300）和 1TB（¥600）三档阶梯式永久不限时流量包，且区域明确延伸至韩国与东南亚；而光速云则在 2026-08-19 留存了五张跨三网与单线程的 MiaoKo 专项实测图，实测证据密度更高，且月付 ¥34/268GB 与 ¥68/568GB 档位单 GB 更低。

### Q2：为什么星岛梦的介绍写 Trojan 协议，2026-08-11 测速图却显示 Shadowsocks？

这属于典型的文档与实测协议差异：品牌介绍文本标注“Trojan 协议”，但 2026-08-11 01:48:13 CST 的 MAI-TEST-BOT 实测截图显示节点为 Shadowsocks。实际订阅中可能同时下发双协议节点，或服务端已从 Trojan 调整为 Shadowsocks，使用主流现代客户端（如 Clash Verge Rev / Shadowrocket）均可同时兼容这两类协议。

### Q3：星岛梦 2026-08-11 的测速截图能代表晚高峰表现吗？

不能直接代表。星岛梦 2026-08-11 原始测速 PNG（MAI-TEST-BOT，珠海联通 5Gbps 32 线程）的测试时间为凌晨 01:48:13 CST，属于深夜非高峰时段；而 2026-10-19 的 5 地区文本记录同样标注“非晚高峰”。购买前仍建议先购 ¥25 月付实测晚高峰 20:00-23:00 的表现。

### Q4：星岛梦限制设备登录数量吗？优惠码 nmw888 折扣是多少？

不限设备数量。品牌资料明确写明“1 倍流量且不限设备使用”，适合多设备家庭或小型团队共享。优惠码为 nmw888，但当前品牌资料未明确标注具体折扣百分点与适用套餐限制，请以官网结账页输入后的实时显示为准。
