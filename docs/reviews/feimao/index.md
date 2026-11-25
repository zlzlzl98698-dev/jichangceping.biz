---
title: 飞猫云（FlyCat）2026 深度测评：零配置专属客户端体验、¥84 学生版定价与 08-11 实测解析
description: 机场测评实验室对 2023 年运营机场飞猫云（FlyCat）的深度实证测评：剖析“专属客户端登录即用、无第三方订阅”的利弊边界、¥84/年学生版至 ¥680/1TB 不限时套餐、2026-08-11 早间 PNG 实测及双推广域名冲突。
slug: feimao
category: reviews
tags:
  - 飞猫云
  - FlyCat
  - 专属客户端
  - 新手机场
  - Shadowsocks
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
primaryKeyword: 飞猫云测评
secondaryKeywords:
  - 飞猫云机场怎么样
  - FlyCat 客户端
  - 飞猫云学生版 84元
  - 飞猫云优惠码 flycat888
searchIntent: 产品形态与适配决策：判断飞猫云是否适合新手零配置上手，了解其不提供 Clash/Shadowrocket 订阅的限制及真实测速背景。
entities:
  - 飞猫云
  - FlyCat
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
  - wuyou
  - yinxingren
  - firefly
  - guangsuyun
  - weifeng
faq:
  - question: 飞猫云可以把订阅链接导入 Clash Verge Rev、Shadowrocket 或 OpenWrt 软路由吗？
    answer: 不可以。飞猫云明确采用“专属客户端下载登录即用”的封闭模式，不提供第三方通用订阅链接，因此无法直接导入 Clash、Shadowrocket、v2rayN 或 OpenWrt 软路由（OpenClash/PassWall2）。如果必须使用第三方客户端或软路由全局代理，请选择光速云、星岛梦或微风网络等支持订阅导出的品牌。
  - question: 飞猫云 2026-08-11 的实测 PNG 截图代表晚高峰速度吗？
    answer: 不代表。飞猫云 2026-08-11 原始测速截图（MAI-TEST-BOT 2.0.0-dev，珠海联通 5Gbps 32 线程，Shadowsocks）的测试时间戳为 08:52:30 CST（周二早晨非晚高峰）；而 2026-10-19 的 5 地区文本记录同样标注为“非晚高峰”。这两份数据均不能替代 20:00-23:00 晚高峰的拥塞表现。
  - question: 飞猫云学生版 ¥84/年（50GB/月）与优惠码 flycat888 怎么用最划算？
    answer: 学生版年付 ¥84 折合 ¥7.00/月（单 GB 约 ¥0.14），门槛较低，但月流量仅 50GB。优惠码 flycat888 在汇总表中标注为“8 折”，但具体是否适用于学生版及不限时包需以官网结算页实时核验为准；初次使用建议先购 ¥25 星耀版月付验证本地网络后再决定是否年付。
  - question: 飞猫云用的是顶级 IEPL/IPLC 专线吗？
    answer: 不是主打顶级专线定位。品牌资料原文明确指出飞猫云“重点不是极致速度或专线，而是省事”，属于专线/中转混合的轻量日常定位；其优势在于免配置上手门槛极低，而非与企业级全专线机场拼极端晚高峰表现。
---

# 飞猫云（FlyCat）深度测评：零配置专属客户端、¥84 学生版定价与早间实测边界

**核心结论（Answer-First）：** 飞猫云（FlyCat）自 **2023 年**起运营，在 31 家收录品牌中定位非常鲜明——**放弃第三方订阅生态，专注“下载官方专属客户端、登录账号即用”的极简新手路径**。其学生版年付低至 **¥84/年（折 ¥7.00/月 · 50GB/月）**，另有一档 **¥680 的 1TB 一次性不限时包**，且在本站留存有 **`2026-08-11 08:52:30 CST` 原始实测 PNG 截图（Shadowsocks）** 与 `2026-10-19` 文本记录。购买前必须认清两点客观限制：第一，**不提供订阅链接**，Clash / Shadowrocket / 软路由用户完全无法接入；第二，定位偏轻量日用（专线/中转混合，非顶级全专线主打），且 08-11 截图测试时间为早晨 8:52 非晚高峰。

<BrandOverview slug="feimao" />

<AffiliateDisclosure />

---

## 一、产品定位、“专属客户端”生态锁定与排障指引

很多首次接触代理服务的用户，往往卡在寻找 Clash/Shadowrocket 安装包、导入订阅链接失败、规则分流配置报错等步骤上。飞猫云针对这一痛点做出了彻底的产品取舍：**仅支持自研专属客户端（`exclusive-only`），支持 [Windows](/clients/windows/)、[macOS](/clients/macos/)、[iOS](/clients/ios/) 与 [Android](/clients/android/) 四大消费端系统，不提供第三方订阅链接**。

| 维度 | 飞猫云（专属客户端模式） | 通用订阅品牌（如光速云 / 微风网络） |
| :--- | :--- | :--- |
| **上手门槛** | 极低：下载官网 App、账号密码登录即可选节点连接 | 中等：需自行下载第三方客户端并复制粘贴订阅地址 |
| **Clash / Shadowrocket 兼容** | **不支持**（[Clash Verge Rev](/clients/clash-verge-rev/) / [Shadowrocket](/clients/shadowrocket/) 无订阅导入） | 完整支持（含 [Surge](/clients/surge/) / [Stash](/clients/stash/) / [sing-box](/clients/sing-box/)） |
| **OpenWrt 软路由 / Linux CLI** | **不支持**（无法部署 [OpenClash](/clients/openclash/) 或 [PassWall2](/clients/passwall2/)） | 完整支持 [OpenWrt](/clients/openwrt/) / [Linux](/clients/linux/) |
| **规则自定义自由度** | 受限于官方客户端内置逻辑 | 可精细分流 ChatGPT / Gemini / YouTube / TikTok |
| **Apple ID 依赖度** | 需按官网指引获取 iOS 端安装方式 | 需外区 Apple ID 下载 Shadowrocket 等付费/免费客户端 |

**客户端使用与排障指针**：
- **纯新手 vs 进阶用户边界**：如果你只是想在手机或电脑上打开网页、使用 ChatGPT、看 YouTube，且明确不想折腾任何配置文件，飞猫云的专属客户端是一大加分项；但只要你是技术开发者、游戏主机/电视盒子用户或 [OpenWrt](/clients/openwrt/) 软路由玩家，请先核对[客户端兼容性总表](/clients/compatibility/)后直接转向开放订阅阵营。
- **专属客户端常见故障自救**：
  - **登录后节点无法刷新或官网域名前缀打不开**：飞猫云存在 `flycataff.com` 与 `flycatvipaff.cc` 两套历史推广域名前缀记录，且本地网络 DNS 污染或残留旧代理端口可能阻塞客户端 API 拉取；排查方式参考[订阅失败与更新报错排查指南](/troubleshooting/subscription-failed/)中的系统代理清理与 DoH 步骤。
  - **桌面端开启系统代理/TUN 后网页断网或冲突**：参考[TUN 模式与 DNS 污染排查指南](/troubleshooting/tun-dns-error/)检查与其他杀毒软件或公司 VPN 的网卡冲突。
  - **晚高峰局部节点卡顿超时**：因飞猫云非顶级全专线定位且 08-11 截图仅测于早 8:52，若晚间单个地区延迟飙升，参考[节点超时与不可用排查指南](/troubleshooting/node-timeout/)在客户端切换至其他亚太区域节点。

<ClientCompatibility slug="feimao" />

---

## 二、7 档套餐明细、边际成本拐点与回本精算

飞猫云在 `data/plans.json` 中记录了 7 个价格档位，涵盖年付学生包、四档月付、1TB 不限时包及定制版：

| 套餐名称 | 计费周期 | 标称价格 | 流量额度 | 折合月均 | 单 GB 成本 | 升级边际成本与评估 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **飞猫·学生版** | 年付 | **¥84 / 年** | 50GB / 月 | **¥7.00 / 月** | **¥0.1400 / GB** | **全库低门槛年付代表之一**，适合只查资料与文字 AI 的轻量用户 |
| **飞猫·星耀版** | 月付 | **¥25 / 月** | 150GB / 月 | ¥25.00 / 月 | ¥0.1667 / GB | **首单试水推荐**：先用一个月验证专属客户端在你常用设备上的连接稳定性 |
| **飞猫·星环版** | 月付 | **¥45 / 月** | 300GB / 月 | ¥45.00 / 月 | ¥0.1500 / GB | 较星耀 +¥20 多 150GB（边际 **¥0.1333/GB**），常规日常追剧与办公中度用户 |
| **飞猫·银河版** | 月付 | **¥85 / 月** | 600GB / 月 | ¥85.00 / 月 | **¥0.1417 / GB** | 较星环 +¥40 多 300GB（边际 **¥0.1333/GB**），**月付性价比拐点** |
| **飞猫·宇宙版** | 月付 | **¥150 / 月** | 1000GB / 月 | ¥150.00 / 月 | ¥0.1500 / GB | 较银河 +¥65 多 400GB（边际跳涨至 **¥0.1625/GB**），单 GB 反比银河版贵 |
| **飞猫·不限时套餐** | 一次性付费 | **¥680** | 1000GB 一次性 | 不适用 | **¥0.6800 / GB** | 1TB 不过期总量，单 GB 比星岛梦 ¥600/1TB 略贵 ¥80 |
| **飞猫·定制套餐** | 月付 | **¥550 / 月** | 500GB / 月 | ¥550.00 / 月 | ¥1.1000 / GB | 高预算定制方案（但定制细节在品牌资料中未作展开） |

**单 GB 与预算盈亏平衡点分析**：
1. **银河版（¥85/600GB）vs 宇宙版（¥150/1000GB）边际拐点**：飞猫云月付从 150GB 到 600GB 的增量边际成本稳定在 **¥0.1333/GB**，但从银河版升到宇宙版时，多付 ¥65 只换来 400GB，新增流量单价反而涨至 **¥0.1625/GB**。除非月消耗稳定突破 600GB，否则停在银河版最划算（若真需 1TB/月，[星岛梦](/reviews/xingdaomeng/) 旗舰 1T 版 ¥130/月、 [无忧链接](/reviews/wuyou/) 忘忧版 ¥117/月、[唯兔云](/reviews/weitu/) 至尊版 ¥119.9/月都更便宜）。
2. **学生版（¥84/年 · 50GB/月）vs 星耀版月付（¥25/月）回本线**：若每月流量不超过 50GB，年付学生版仅需连续使用 **3.36 个月**（第 4 个月月付累计 ¥100 > ¥84）即可回本，但因设备上限与退款政策待核实，仍建议先试星耀版 1 个月或确认官网适用规则后再年付。
3. **1TB 不限时套餐（¥680）vs 学生版年付（¥84/年 · 600GB/年）盈亏平衡点**：¥680 等价于连续购买 **8.10 年**学生版（累计 4,857GB 周期配额）。只有当你的月均流量长期低于 **10.3GB/月**（让 1TB 跨度超过 8 年消耗）时，买 ¥680 不限时才比续费年付省钱；若确定要囤 1TB 永久包，[星岛梦](/reviews/xingdaomeng/) 同等 1TB 永久包仅 ¥600（立省 ¥80）且不限设备、支持第三方订阅。

**优惠码与多域名审计记录**：
- **优惠码 `flycat888`**：在汇总表中标注为 **“7 元档 + 8 折”**，但未写明学生版或 1TB 不限时包是否同样适用 8 折，请以官网结账页输入后的实时折后价为准（若星耀版 ¥25 可享 8 折，折后试水门槛将降至 ¥20）。
- **双推广域名冲突**：主清单使用 `flycataff.com` 域名前缀，而《24个站点的aff替换前缀.txt》另列 `flycatvipaff.cc` 前缀。本站 CTA 按钮由 `data/affiliate-links.ts` 集中管理，读者无需自行拼接域名。
- **待核实交易字段**：支付方式（微信/支付宝/USDT）、设备同时在线精确上限与退款政策在当前资料中均未明示。

<CouponInfo slug="feimao" />

<PricingMatrix slug="feimao" />

<PlanSelector slug="feimao" />

---

## 三、2026-08-11 实测截图与 2026-10-19 文本记录核验

### 1. 2026-08-11 原始 PNG 截图（Measured）

- **测试时间**：`2026-08-11 08:52:30 CST`（工作日早晨非晚高峰）
- **工具与后端**：`MAI-TEST-BOT 2.0.0-dev` · 珠海联通 5Gbps · 32 线程 · Ping 5 次
- **显示协议**：`Shadowsocks`
- **原始证据**：`飞猫云-节点测速实测.png`（1122 × 1402 px）

按本站规范，该 PNG 证实了飞猫云在 `2026-08-11 08:52` 确实具备可测速节点（尽管对外宣传专属客户端，内部节点实测当时仍通过 Shadowsocks 协议跑通），但**不能直接推导为晚高峰 20:00–23:00 的速度承诺**，也不包含 AI/流媒体解锁列。

### 2. 2026-10-19 非晚高峰文本测速（Historical Data）

- **香港**：`21ms` / `526Mbps`
- **台湾**：`41ms` / `116Mbps`
- **新加坡**：`45ms` / `413Mbps`
- **日本**：`54ms` / `138Mbps`
- **美国**：`178ms` / `14Mbps`

<SpeedReport slug="feimao" />

<LatencyChart slug="feimao" />

<ThroughputChart slug="feimao" />

从这组文本快照可见，飞猫云在非晚高峰时段香港（526Mbps）和新加坡（413Mbps）下行速率较快，而美国地区（178ms / 14Mbps）属于常规跨洋中转表现，若重度依赖美线大带宽传输建议先用月付验证。

---

## 四、AI/流媒体声明、线路拓扑与风险总结

品牌资料将 ChatGPT、Claude、Netflix、Disney+、YouTube、HBO Max、TikTok、Spotify 标为支持，Gemini 标为视节点而定——均属 `Vendor Data`（尚未有独立解锁截图逐一复核）。由于原资料未强调顶级全专线，本站将其网络架构定性为**专线/中转混合**，涵盖香港、台湾、新加坡、日本、美国五大常用地区。

<AvailabilityMatrix slug="feimao" />

<NetworkTopology slug="feimao" />

<StabilityHistory slug="feimao" />

<EvidencePanel slug="feimao" />

### 选型总结与同档位横向对比直达

- **推荐选择飞猫云的人群**：完全不想接触 Clash/Shadowrocket 配置的纯新手；学生党或寻找 ¥84/年轻量备用客户端的移动/桌面轻度用户。
- **建议换看其他品牌的人群**：依赖 OpenWrt 软路由、Surge/Clash 自定义分流规则的进阶玩家（推荐看 [光速云](/reviews/guangsuyun/) 或 [星岛梦](/reviews/xingdaomeng/)）；对晚高峰极速专线要求极高且看重 50 节点完整晚高峰截图的用户（可对比 [无忧链接](/reviews/wuyou/)，但注意无忧链接 2026-10 起同样切向专属客户端）。

#### 同档位横向对比直达

- **[光速云 vs 飞猫云横向对比](/compare/guangsuyun-vs-feimao/)**：直接对比飞猫云“零配置专属客户端（¥84/年）”与光速云“开放双模式订阅 + 3 批次实测（¥99/年）”在易用性、自由度与晚高峰稳定性上的取舍。
- **[客户端兼容性横向对比](/compare/client-compatibility/)**：搞清楚飞猫云、隐形人、Firefly 这类 `exclusive-only` 专属客户端与通用订阅客户端的真实限制边界。
- **[平价与高性价比机场横向对比](/compare/budget-airports/)**：对比飞猫云学生版（¥7.00/月）与无忧链接、二猫云、唯兔云等 ≤¥12/月阵营的实测与价格表现。
- **[一次性不限时（永久）流量包横向对比](/compare/non-expiring-plans/)**：对比飞猫云 ¥680/1TB 不限时包与星岛梦 ¥600/1TB 等 15 款永久流量包。
- **[机场月付 vs 年付回本账期对比](/compare/monthly-vs-annual/)**：查看为什么不建议未先用 ¥25 星耀月付实测就直接入手 ¥84 年付或 ¥680 1TB 包。

<RelatedBrand slug="feimao" />

<AffiliateButton slug="feimao" size="lg" />

---

## 常见问题（FAQ）

### Q1：飞猫云可以把订阅链接导入 Clash Verge Rev、Shadowrocket 或 OpenWrt 软路由吗？

不可以。飞猫云明确采用“专属客户端下载登录即用”的封闭模式，不提供第三方通用订阅链接，因此无法直接导入 Clash、Shadowrocket、v2rayN 或 OpenWrt 软路由（OpenClash/PassWall2）。如果必须使用第三方客户端或软路由全局代理，请选择光速云、星岛梦或微风网络等支持订阅导出的品牌。

### Q2：飞猫云 2026-08-11 的实测 PNG 截图代表晚高峰速度吗？

不代表。飞猫云 2026-08-11 原始测速截图（MAI-TEST-BOT 2.0.0-dev，珠海联通 5Gbps 32 线程，Shadowsocks）的测试时间戳为 08:52:30 CST（周二早晨非晚高峰）；而 2026-10-19 的 5 地区文本记录同样标注为“非晚高峰”。这两份数据均不能替代 20:00-23:00 晚高峰的拥塞表现。

### Q3：飞猫云学生版 ¥84/年（50GB/月）与优惠码 flycat888 怎么用最划算？

学生版年付 ¥84 折合 ¥7.00/月（单 GB 约 ¥0.14），门槛较低，但月流量仅 50GB。优惠码 flycat888 在汇总表中标注为“8 折”，但具体是否适用于学生版及不限时包需以官网结算页实时核验为准；初次使用建议先购 ¥25 星耀版月付验证本地网络后再决定是否年付。

### Q4：飞猫云用的是顶级 IEPL/IPLC 专线吗？

不是主打顶级专线定位。品牌资料原文明确指出飞猫云“重点不是极致速度或专线，而是省事”，属于专线/中转混合的轻量日常定位；其优势在于免配置上手门槛极低，而非与企业级全专线机场拼极端晚高峰表现。
