---
title: Firefly（萤火虫）2026 深度测评：IPLC+VLESS 定价与专属客户端解析
seoTitle: Firefly（萤火虫）2026 深度测评：IPLC+VLESS 定价与专属客户端解析
description: 机场测评实验室对 Firefly（合并原 Firefly 与 2026-08-09 Firefly 萤火虫两份来源）的统一深度测评：拆解 26 个周期套餐（月付至三年付）、双邀请码与无微信支付记录、2026-10 收紧专属客户端变更及 10-19 文本测速。
slug: firefly
category: reviews
tags:
  - Firefly
  - 萤火虫机场
  - IPLC专线
  - VLESS
  - 专属客户端
  - 多源合并档案
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
primaryKeyword: Firefly 机场测评
secondaryKeywords:
  - Firefly 萤火虫机场怎么样
  - Firefly 优惠码 firefly
  - Firefly 不提供订阅链接
  - IPLC VLESS 专线机场
searchIntent: 品牌合并核查与多周期决策：弄清 Firefly 与 Firefly 萤火虫的同源关系、双邀请码由来、无微信支付约束以及 2026-10 专属客户端切换影响。
entities:
  - Firefly
  - Firefly 萤火虫
  - 飞为
  - IPLC专线
  - VLESS
sources:
  - sources/brand-info/32家机场品牌清单.txt
  - sources/brand-info/24个站点的aff替换前缀.txt
  - data/brands.json
  - data/plans.json
  - data/benchmarks.json
  - data/benchmark-sources.json
  - data/availability.json
  - data/network-routes.json
  - data/client-compatibility.json
  - data/risk-records.json
dataStatus: Conflicting
schemaType: Article
pillar: /reviews/
relatedSlugs:
  - weifeng
  - guangsuyun
  - wuyou
  - feimao
  - xingdaomeng
faq:
  - question: 为什么本站将“Firefly”和“Firefly 萤火虫”合并为同一个评测档案？
    answer: 经数据实体审计，原始清单中第 8 项“Firefly”与末尾 2026-08-09 追加的“Firefly 萤火虫”指向同一主域名（vip02.fireflyaff.com），共享完全相同的核心套餐体系（¥96 年付版、Lite/Plus/Blaze/Nova 月付及 ¥100 不限时）与优惠码 firefly，仅在邀请码参数（2n7VURre vs jTp9wSgZ）及客户端政策更新时间上存在历史演变差异，因此合并为统一实体 firefly 以防重复建档。
  - question: Firefly 现在还可以导出订阅链接导入 Clash 或 Shadowrocket 吗？
    answer: 存在政策收紧冲突。2026-08-09 历史追加记录仅标注 IPLC + VLESS 而未限定专属客户端；但 2026 年 10 月主体资料明确注明“2026 年 10 月起改用官方专属客户端，下载登录即用，不提供订阅链接”。本站现行按 exclusive-only 提示风险，依赖 Clash 或软路由的用户请谨慎选择。
  - question: Firefly 支持微信支付吗？新人优惠码 firefly 适用于 ¥96 年付版吗？
    answer: 2026-08-09 历史档案明确注明 Firefly 支付方式为“支付宝 / USDT（无微信）”。优惠码 firefly 为新用户 8 折，但明确标注“年付版（¥96/年）不适用”；历史资料另载季付 9 折、半年 85 折、年付 8 折（叠加最高约 64 折），具体叠加规则以官网结账页为准。
  - question: Firefly 有 2026-08-11 的独立 PNG 测速截图吗？
    answer: 没有。Firefly 未纳入 2026-08-11 的 16 家截图批次，本站仅收录其 2026-10-19 非晚高峰 5 地区文本记录（香港 27ms/547Mbps、新加坡 42ms/445Mbps、美国 143ms/30Mbps）。在缺少独立晚高峰截图的情况下，不建议直接预付两年付或三年付大额套餐。
---

# Firefly（萤火虫 / 飞为）深度测评：双源实体合并审计、全周期定价梯队与专属客户端政策变迁

**核心结论（Answer-First）：** 本档案经实体核验，将原始资料中的 **“#8 Firefly”**（2026 年 10 月主体）与 **“Firefly 萤火虫”**（`2026-08-09` 历史品牌库追加条目）合并为唯一实体 **`firefly`**。Firefly 主打 **IPLC 专线 + VLESS 协议 + 原生 IP、全节点不限速不限设备、免翻墙访问官网**，并据历史资料记录与 [微风网络](/reviews/weifeng/)、飞鸟、一云梯存在同系关系。在定价上，Firefly 展开了极其完整的 **26 档多周期价格表**（覆盖 ¥96/年入门、¥100 不限时及 Lite/Plus/Blaze/Nova 从月付到三年付的全部折算价）。然而，购买前必须警惕四大事实：第一，**2026 年 10 月起改用官方专属客户端、不提供第三方订阅链接**；第二，**缺少独立 PNG 测速截图**，仅有 `2026-10-19` 非晚高峰文本记录；第三，历史档案注明**仅支持支付宝 / USDT（不支持微信支付）**；第四，同一域名下存在**两套历史邀请码记录**。

<BrandOverview slug="firefly" />

<AffiliateDisclosure />

---

## 一、双源合并审计：Firefly 与 Firefly 萤火虫的口径演变对比

许多站外列表把“Firefly”和“萤火虫”拆成两家独立机场，导致用户误以为是不同服务商。通过交叉核验两份记录，本站完整还原了它们的时间演进与两项核心冲突：

| 比对字段 | 2026 年 10 月主体记录（`#8 Firefly`） | 2026-08-09 历史追加记录（`Firefly 萤火虫`） | 本站合并审计结论 |
| :--- | :--- | :--- | :--- |
| **核心域名与双邀请码** | 主域名 `vip02.fireflyaff.com`，邀请码 `2n7VURre` | 同一域名 `vip02.fireflyaff.com`，邀请码 `jTp9wSgZ` | 确认同一商业实体，合并建档；推广出口由本站统一组件管理 |
| **客户端政策（核心冲突）** | 明确标注 **2026 年 10 月起专属客户端登录即用（不提供订阅链接）** | 仅写 `IPLC + VLESS`，未限定专属客户端 | 反映出 2026 年 10 月起收紧订阅导出的政策变更，按 `exclusive-only` 警示 |
| **周期定价展示深度** | 列出 6 档核心价（¥96 年付、Lite/Plus/Blaze/Nova 月付、¥100 不限时） | 完整展开 4 大系列 **季付 / 半年付 / 年付 / 两年付 / 三年付** 全部价格 | 合并入 `data/plans.json` 共 26 条记录，分别标记 `Vendor Data` 与 `Historical Data` |
| **优惠码与叠加规则** | `firefly`（新用户 8 折，**年付版不适用**） | 另注周期折扣“季 9 / 半 85 / 年 8 折，叠加最高约 64 折” | 结算页实测为主，明确告知 ¥96 年付版不吃 8 折码 |
| **支付方式与团队背书** | 7×24 在线客服（夜间 AI 值守）、免翻墙访问官网 | 注明 **支付宝 / USDT（无微信）**、8 年海外团队、与微风/飞鸟/一云梯同系 | 运营年限仍标 `待核实`（8 年团队属厂商自述） |

<CouponInfo slug="firefly" />

<StabilityHistory slug="firefly" />

---

## 二、全周期套餐矩阵精算（月付至三年付 + 不限时包）

下表浓缩呈现 Firefly 合并后的完整 4 大主力系列全周期折合月均价与单 GB 成本，方便直观对比长短期预付的真实差价：

| 套餐系列 | 月流量 | 月付（单 GB） | 季付（折合月均） | 半年付（折合月均） | 年付（折合月均 / 单 GB） | 两年付（折合月均） | 三年付（折合月均 / 单 GB） |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Firefly 年付版** | 60GB/月 | — | — | — | **¥96（¥8.00 / ¥0.1333）** | — | — |
| **Firefly Lite** | 150GB/月 | **¥25**（¥0.1667） | ¥67（¥22.33） | ¥127（¥21.17） | ¥240（¥20.00 / ¥0.1333） | ¥420（¥17.50） | ¥540（¥15.00 / ¥0.1000） |
| **Firefly Plus** | 300GB/月 | **¥45**（¥0.1500） | ¥121（¥40.33） | ¥229（¥38.17） | ¥432（¥36.00 / ¥0.1200） | ¥756（¥31.50） | ¥972（¥27.00 / ¥0.0900） |
| **Firefly Blaze** | 600GB/月 | **¥85**（¥0.1417） | ¥229（¥76.33） | ¥433（¥72.17） | ¥816（¥68.00 / ¥0.1133） | ¥1428（¥59.50） | ¥1836（¥51.00 / ¥0.0850） |
| **Firefly Nova** | 1000GB/月 | **¥150**（¥0.1500） | ¥400（¥133.33） | ¥750（¥125.00） | ¥1360（¥113.33 / ¥0.1133） | ¥2399（¥99.96） | ¥3119（¥86.64 / ¥0.0866） |
| **Firefly 不限时** | 100GB 一次性 | **¥100 一次性**（单 GB ¥1.0000，不过期） | — | — | — | — | — |

**长期预付理性警示与单 GB / 盈亏平衡测算**：
1. **各档位单 GB 断层与周期折扣率**：以月付为基准，**Firefly Lite（¥25/150GB）** 年付省 20%（¥240，单 GB ¥0.1333），三年付省 40%（¥540，单 GB 降至 ¥0.1000）；**Blaze（600GB）与 Nova（1000GB）**在年付时单 GB 完全持平（均 **¥0.1133/GB**），到了三年付时 Blaze（¥1836，**¥0.0850/GB**）甚至比 Nova（¥3119，¥0.0866/GB）更便宜。注意在月付层面，Blaze（¥85/600GB，边际比 Plus +¥40 多 300GB 即 **¥0.1333/GB**）明显优于 Nova（¥150/1000GB，较 Blaze +¥65 多 400GB 即边际跳涨至 **¥0.1625/GB**）。
2. **¥96 年付版（60GB/月）vs Lite 月付（¥25/150GB）与 ¥100 不限时（100GB）回本点**：
   - 若月流量不超过 60GB，¥96 年付版连续用 **3.84 个月**即跑赢 ¥25 月付（即便叠加 `firefly` 新用户 8 折按 ¥20/月测算，年付版也是 **4.80 个月**回本；且注意规则注明 **¥96 年付版不适用优惠码 `firefly`**）；
   - ¥96 年付版全年总配额达 `720GB`，仅比 <strong>¥100 一次性不限时（100GB）</strong>便宜 ¥4。除非你的月均消费低于 **8.33GB/月**（100GB 跨 12 个月以上用不完），否则买 ¥96 年付版在流量充裕度上远超不限时包；
   - 从 ¥96 年付版（60GB/月）升级到 Lite 年付（¥240/150GB/月），多花 ¥144/年换取全年多出 `1080GB`，新增边际成本恰好为 **¥0.1333/GB**。
3. **长周期预付风险提示**：虽然 Blaze 三年付理论单 GB 低至 ¥0.0850，Nova 三年付总价高达 **¥3,119**，但鉴于 Firefly 缺少公开独立测速截图、无明确退款政策且刚刚在 2026 年 10 月收紧了客户端订阅形态，**严禁首单直接购买两年付或三年付**。建议先准备支付宝或 USDT 购买 **Lite 月付 ¥25**（实测 `firefly` 新人 8 折码能否折至 ¥20），验证专属客户端在常用设备上的晚高峰稳定性后再考虑季度以上周期。

<PricingMatrix slug="firefly" />

<PlanSelector slug="firefly" />

---

## 三、2026-10-19 非晚高峰文本记录、客户端限制与排障指引

Firefly **没有 `2026-08-11` 实测 PNG 截图**，仅具备 `2026-10-19` 非晚高峰 5 地区文本记录（`Historical Data`）：

- **香港**：`27ms` / `547Mbps`
- **台湾**：`39ms` / `135Mbps`
- **新加坡**：`42ms` / `445Mbps`
- **日本**：`57ms` / `147Mbps`
- **美国**：`143ms` / **`30Mbps`**（在 10-19 同批全部文本记录中，30Mbps 是美国下行最高值，但同样缺乏原始单线程截图佐证）

<SpeedReport slug="firefly" />

<LatencyChart slug="firefly" />

<ThroughputChart slug="firefly" />

### 1. 解锁、客户端收紧与支付约束

- **AI 与流媒体**：主清单与 08-09 历史记录综合声明支持 ChatGPT、Claude、Netflix、Disney+、YouTube、HBO Max、TikTok、Spotify，历史资料另提 Gemini 与 Meta AI（均标为 `Vendor Data`，Gemini 视节点而定）。
- **客户端与支付硬约束**：1) **2026 年 10 月起收紧为仅限官方专属客户端**（支持 [Windows](/clients/windows/)、[macOS](/clients/macos/)、[iOS](/clients/ios/)、[Android](/clients/android/)），不提供第三方通用订阅链接，因此 [Clash Verge Rev](/clients/clash-verge-rev/)、[Shadowrocket](/clients/shadowrocket/)、[v2rayN](/clients/v2rayn/) 及 [OpenWrt](/clients/openwrt/)（[OpenClash](/clients/openclash/) / [PassWall2](/clients/passwall2/)）无法直接导入（购买前先对比[客户端兼容性总表](/clients/compatibility/)）；2) **不支持微信支付**（历史档案注明仅支持支付宝与 USDT）；3) 虽然官网支持免翻墙直连与不限设备数量，仍建议只将官方客户端装在常用终端上。

### 2. 专属客户端常见排障指引

- **账号登录后节点列表为空或新旧客户端冲突**：参考[订阅失败与更新报错排查指南](/troubleshooting/subscription-failed/)排查本地 DNS 污染或残留代理端口阻塞；若是 2026-10 政策变更前的老用户续费，确认是否必须卸载旧第三方订阅改用新版官方客户端。
- **内置 TUN/虚拟网卡与本机软件冲突断网**：参照[TUN 模式与 DNS 污染排查指南](/troubleshooting/tun-dns-error/)排查企业 VPN 或系统防火墙拦截。
- **部分原生 IP 节点连接超时**：在官方客户端内切换港/新/日备选节点，排查步骤见[节点超时与不可用排查指南](/troubleshooting/node-timeout/)。
- **选型建议**：适合具备支付宝或 USDT 支付条件、不依赖 Clash 软路由、偏好 IPLC + VLESS 原生 IP 且希望体验“免翻墙直连官网 + 专属一键客户端”的用户；若需要第三方客户端支持与微信支付，建议直接对比 [光速云](/reviews/guangsuyun/) 或同系但有 50 节点 VLESS 实测图的 [微风网络](/reviews/weifeng/)。

<AvailabilityMatrix slug="firefly" />

<NetworkTopology slug="firefly" />

<ClientCompatibility slug="firefly" />

<EvidencePanel slug="firefly" />

---

## 四、同档位横向对比直达

- **[光速云 vs Firefly 横向对比](/compare/guangsuyun-vs-firefly/)**：深度对比“全平台开放订阅 + 3 批次实测（光速云）”与“2026-10 起专属客户端 + 全周期 IPLC 原生 IP（Firefly）”的核心差异。
- **[客户端兼容性横向对比](/compare/client-compatibility/)**：看清 Firefly 改用专属客户端后对 Clash/Shadowrocket 与软路由用户的真实生态限制。
- **[IEPL 专线 vs IPLC 专线横向选购对比](/compare/iepl-vs-iplc/)**：比较 Firefly 主打的 IPLC 专线与光速云、微风、星岛梦等 IEPL 阵营的路线特点。
- **[一次性不限时（永久）流量包横向对比](/compare/non-expiring-plans/)**：评估 Firefly ¥100/100GB 不限时包与 15 家竞品的性价比排名。
- **[机场月付 vs 年付回本账期对比](/compare/monthly-vs-annual/)**：面对 Firefly 从月付到三年付 26 档价格表时的理性风险控制法则。

<RelatedBrand slug="firefly" />

<AffiliateButton slug="firefly" size="lg" />

---

## 常见问题（FAQ）

### Q1：为什么本站将“Firefly”和“Firefly 萤火虫”合并为同一个评测档案？

经数据实体审计，原始清单中第 8 项“Firefly”与末尾 2026-08-09 追加的“Firefly 萤火虫”指向同一主域名（vip02.fireflyaff.com），共享完全相同的核心套餐体系（¥96 年付版、Lite/Plus/Blaze/Nova 月付及 ¥100 不限时）与优惠码 firefly，仅在邀请码参数（2n7VURre vs jTp9wSgZ）及客户端政策更新时间上存在历史演变差异，因此合并为统一实体 firefly 以防重复建档。

### Q2：Firefly 现在还可以导出订阅链接导入 Clash 或 Shadowrocket 吗？

存在政策收紧冲突。2026-08-09 历史追加记录仅标注 IPLC + VLESS 而未限定专属客户端；但 2026 年 10 月主体资料明确注明“2026 年 10 月起改用官方专属客户端，下载登录即用，不提供订阅链接”。本站现行按 exclusive-only 提示风险，依赖 Clash 或软路由的用户请谨慎选择。

### Q3：Firefly 支持微信支付吗？新人优惠码 firefly 适用于 ¥96 年付版吗？

2026-08-09 历史档案明确注明 Firefly 支付方式为“支付宝 / USDT（无微信）”。优惠码 firefly 为新用户 8 折，但明确标注“年付版（¥96/年）不适用”；历史资料另载季付 9 折、半年 85 折、年付 8 折（叠加最高约 64 折），具体叠加规则以官网结账页为准。

### Q4：Firefly 有 2026-08-11 的独立 PNG 测速截图吗？

没有。Firefly 未纳入 2026-08-11 的 16 家截图批次，本站仅收录其 2026-10-19 非晚高峰 5 地区文本记录（香港 27ms/547Mbps、新加坡 42ms/445Mbps、美国 143ms/30Mbps）。在缺少独立晚高峰截图的情况下，不建议直接预付两年付或三年付大额套餐。
