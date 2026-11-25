---
title: 微风网络（Breezenet）2026 测评：50节点实测与137元入门价核查
seoTitle: 微风网络（Breezenet）2026 测评：50节点实测与137元入门价核查
description: 机场测评实验室对微风网络（Breezenet）的实证测评：完整解析 2026-07-19 MiaoKo 50 节点 VLESS 实测数据（香港均值 469-546MB/s 与台湾02/日本05异常节点）、6 档清风至御风及信风/长风不限时套餐，并核清“7元/50GB”旧摘要冲突。
slug: weifeng
category: reviews
tags:
  - 微风网络
  - Breezenet
  - IEPL专线
  - VLESS
  - 不限时套餐
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
primaryKeyword: 微风网络测评
secondaryKeywords:
  - 微风网络机场怎么样
  - Breezenet 测速
  - 微风网络优惠码 flat888
  - 微风清风套餐 137元
searchIntent: 性价比与实测核查：验证微风网络真实入门年付价格（¥137/100GB vs 7元旧摘要）、50 节点 VLESS 测速细节与夜间接诊客服。
entities:
  - 微风网络
  - Breezenet
  - IEPL专线
  - VLESS
  - MiaoKo
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
dataStatus: Measured
schemaType: Article
pillar: /reviews/
relatedSlugs:
  - guangsuyun
  - firefly
  - xingdaomeng
  - weitu
  - wuyou
faq:
  - question: 微风网络的入门年付到底是“约 7 元/月（50GB）”还是“137 元/年（约 11.42 元/月 · 100GB）”？
    answer: 以现行套餐明细为准，最低年付为【清风 (Breeze)】¥137/年（每月 100GB，折合 ¥11.42/月，单 GB ¥0.1142）。原始清单的基础数据与汇总表中残留的“年付约 7 元/月 50GB/月”属于旧档位或下线摘要，而同节正文也写明“11 元/月起”，故本站以 ¥137/年（100GB/月）作为主口径并披露该冲突。
  - question: 微风网络 2026-07-19 的 50 节点实测图表现如何？有没有暴露问题节点？
    answer: 2026-07-19 18:38:20 CST 在珠海联通 9Gbps 32 线程下使用 MiaoKo 测得的 50/50 VLESS 节点中，香港 01-15 平均速度达到 468.91MB-546.20MB/s（峰值 619.64MB/s，TLS RTT 97-211ms，FullCone），新加坡约 135.34MB-401.25MB/s，表现很强；但同时暴露出台湾 02 节点为 0.00B、日本 05 节点仅 8.00KB 的异常故障节点。
  - question: 微风网络支持 Clash Verge Rev 和 Shadowrocket 第三方客户端吗？
    answer: 品牌资料虽未单独明写客户端模式，但 2026-07-19 的 MiaoKo 实测截图正是直接通过 VLESS 通用订阅导入完成测试的，因此本站兼容矩阵将其适配为支持 Clash Verge Rev、v2rayN、Shadowrocket、Stash、OpenClash 等主流 VLESS 第三方客户端。具体限制仍建议下单前与 7×24 客服确认。
  - question: 微风网络的优惠码 flat888 折扣力度是多少？支持退款吗？
    answer: 优惠码为 flat888，汇总表标注为“9 折”，具体适用周期与是否支持清风年付或信风/长风不限时包以官网结账页为准。支付方式与退款政策在当前档案中尚待核实，建议先购 ¥27 乘风月付验证后再升级年付。
---

# 微风网络（Breezenet）深度测评：IEPL + VLESS 50 节点实测档案与入门价口径纠偏

**核心结论（Answer-First）：** 微风网络（Breezenet）自 **2023 年**起运营，主打 **IEPL 专线 + VLESS 协议** 与 **7×24 小时在线客服（夜间 AI 值守）**。它最核心的硬核凭据是一份 **`2026-07-19 18:38:20 CST` 的 50 节点 VLESS MiaoKo 实测截图**——在珠海联通 9Gbps 32 线程下，香港 15 节点跑出 `468.91–546.20MB/s` 的高均值（FullCone NAT），且 **100GB/月起的流量单 GB 成本仅 ¥0.1058–¥0.1350/GB**。但读者下单前必须看清两点事实：第一，总清单汇总表流传的“年付 7 元/50GB”与现行套餐明细矛盾，**现行真实年付门槛是清风 ¥137/年（¥11.42/月 · 100GB/月）**；第二，07-19 实测中存在 `台湾 02`（0.00B）与 `日本 05`（8.00KB）两颗异常节点，且**未出现在 2026-08-11 批次中**，需注意时间窗口差异。

<BrandOverview slug="weifeng" />

<AffiliateDisclosure />

---

## 一、运营定位与“7 元 vs 11.42 元”历史冲突审计

在原始资料《32家机场品牌清单.txt》中，微风网络是少数同时保留了详细风系命名套餐表（清风/乘风/破风/御风/信风/长风）与 50 节点实测图证的品牌，其历史文档中存在一项明确的**价格入口冲突**，以及同系品牌关联背景（Firefly 萤火虫记录中曾提及微风、飞鸟、一云梯与 Firefly 存在同系关系）：

| 对比出处 | 标称入门档位 | 折合月均 | 月流量 | 审计采信结论 |
| :--- | :--- | :--- | :--- | :--- |
| **清单基础数据（第 127 行）与汇总表（第 924 行）** | 年付约 7 元/月 | ~¥7.00/月 | 50GB/月 | **已过时或下线口径**（套餐明细表内无此 50GB 产品） |
| **清单套餐明细表（第 136 行）与正文说明（第 156 行）** | **清风 (Breeze) ¥137/年** | **¥11.42/月** | **100GB/月** | **本站采信为主值**：正文明确称“11 元/月起”，与 137÷12=11.42 完全吻合 |

如果您的年付预算严格卡在 ¥100 以内且每月只需 50–69GB 流量，[光速云轻量版](/reviews/guangsuyun/)（¥99/年 · 69GB）或 [星岛梦贴心小包](/reviews/xingdaomeng/)（¥96/年 · 60GB）门槛更低；而如果你本来就需要 **每月 100GB 起步**的轻量年付，微风网络的清风版折合 **¥0.1142/GB**，单位流量效率非常扎实。

<CouponInfo slug="weifeng" />

---

## 二、6 档风系套餐、恒定边际成本与不限时包回本精算

微风网络在 `data/plans.json` 中共有 4 档常规周期套餐与 2 档一次性不限时包，全系列不搞繁琐的微额分级，且定价梯度的数学规律极其干净：

| 套餐名称 | 计费周期 | 标称价格 | 流量额度 | 折合月均 | 单 GB 成本 | 升级边际成本与性价比评价 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **清风 (Breeze)** | 年付 | **¥137 / 年** | 100GB / 月 | **¥11.42 / 月** | **¥0.1142 / GB** | 100GB 年付入门，性价比高于多数 ¥96/60GB 档（单 GB 低约 14%） |
| **乘风 (Riding)** | 月付 | **¥27 / 月** | 200GB / 月 | ¥27.00 / 月 | ¥0.1350 / GB | **月付试用首选**：200GB 容量比常见的 ¥25/150GB 档多出 50GB |
| **破风 (Breaking)** | 月付 | **¥57 / 月** | 500GB / 月 | ¥57.00 / 月 | **¥0.1140 / GB** | 较乘风 +¥30 多 300GB（新增边际 **¥0.1000/GB**），单 GB 持平年付清风 |
| **御风 (Mastery)** | 月付 | **¥127 / 月** | 1200GB / 月 | ¥127.00 / 月 | **¥0.1058 / GB** | 较破风 +¥70 多 700GB（新增边际 **¥0.1000/GB**），比光速云无界版（¥138/900GB）更划算 |
| **信风·不限时** | 一次性付费 | **¥200** | 270GB 一次性 | 不适用 | ¥0.7407 / GB | 跨年低频备用，但单 GB 高于光速云 147 永久包（¥0.5951/GB） |
| **长风·不限时** | 一次性付费 | **¥370** | 570GB 一次性 | 不适用 | **¥0.6491 / GB** | 较信风 +¥170 多 300GB（新增边际 **¥0.5667/GB**），在 500GB 级不限时档极具竞争力 |

**单 GB 与预算回本点洞察**：
1. **全库罕见的“恒定 ¥0.10/GB”无倒挂月付阶梯**：与二猫云、飞猫云高阶档边际成本反弹不同，微风网络从乘风（¥27）→ 破风（¥57）→ 御风（¥127），每向上升级一档，新增流量的边际价格始终严格锁定在 **¥0.1000/GB**，大流量用户升级没有任何隐藏溢价陷阱。
2. **清风年付（¥137）vs 乘风月付（¥27）回本账期**：如果你的实际月消耗控制在 100GB 以内，清风年付只需连续使用 **5.07 个月**（第 6 个月月付累计 ¥162 > ¥137）就收回成本，全年比一直买乘风月付省下 **¥187**；若能叠加汇总表标注的 `flat888`（9 折，具体是否适用于清风需结账页核实），回本线还会缩短至约 **4.57 个月**。
3. **长风不限时（¥370/570GB）vs 清风年付（¥137/年 · 1200GB/年）盈亏平衡点**：¥370 等价于 **2.70 年**的清风年付费用（累计周期配额 `3,241GB`）。因此只有当你每月实际用量长期低于 **17.6GB/月**（让 570GB 跨度 32.4 个月以上慢慢消耗）时，购买长风不限时包才比清风年付划算；一旦月均消耗稳定超过 30GB，年付清风在预算与流量双维度都更具优势。

<PricingMatrix slug="weifeng" />

<PlanSelector slug="weifeng" />

---

## 三、2026-07-19 50 节点 VLESS 实测拆解与 10-19 文本对照

### 1. 2026-07-19 18:38 CST MiaoKo 50 节点实测图（Measured）

这张保留于 `docs/public/images/benchmarks/2026-08-11/微风-节点测速实测.png` 的截图虽未纳入 08-11 压缩包清单，却是微风网络最具参考价值的原始证据：
- **测试工具**：`MiaoKo 主端 4.3.3 (696) / 喵速 4.7.0 ([A11-32])`
- **测速后端**：`珠海联通 9Gbps · 32 线程` · 协议：`VLESS`
- **节点分布（共 50/50 节点）**：香港 15 / 台湾 5 / 新加坡 10 / 日本 10 / 美国 10
- **各区域真实速率（原图单位为 MB，即 MB/s 字节速率）**：
  - **香港 01–15（15 节点）**：平均速度 **`468.91MB – 546.20MB/s`**，峰值最高达 **`619.64MB/s`**，TLS RTT 位于 **`97–211ms`**，NAT 类型显示为 **FullCone**。
  - **新加坡（10 节点）**：平均速度 **`135.34MB – 401.25MB/s`**，高低节点间存在约 3 倍离散度。
  - **日本 01–10（10 节点）**：绝大多数节点跑出 **`79.73MB – 257.97MB/s`**，但 **日本 05 节点仅有 `8.00KB/s`**（单点故障）。
  - **台湾（5 节点）**：正常节点约 **`73.28MB – 103.00MB/s`**，但 **台湾 02 节点为 `0.00B/s`**（完全超时/断连）。
  - **美国（10 节点）**：平均速度 **`9.90MB – 21.03MB/s`**（在 9Gbps 32 线程下美线仅跑出 10–21MB/s，明显弱于其亚太线，也远低于光速云 08-19 珠海联通单线程的 313–370MB/s）。

### 2. 2026-10-19 非晚高峰文本测速对照（Historical Data）

- **香港**：`25ms` / `546Mbps`
- **台湾**：`40ms` / `115Mbps`
- **新加坡**：`43ms` / `384Mbps`
- **日本**：`54ms` / `131Mbps`
- **美国**：`167ms` / `17Mbps`

<SpeedReport slug="weifeng" />

<LatencyChart slug="weifeng" />

<ThroughputChart slug="weifeng" />

**交叉读图结论**：微风网络的香港与新加坡 IEPL+VLESS 线路在高并发下吞吐非常饱满，适合亚太高频使用；但**美国节点无论在 07-19 32 线程截图（9.9–21MB/s）还是 10-19 文本（17Mbps）中都处于偏慢水平**，如果你日常大量下载美区大文件或高频连接美西服务器，需要对此有明确预期。

---

## 四、解锁声明、客户端配置、排障指引与风险提示

### 1. 解锁声明与 VLESS 第三方客户端实战配置

- **流媒体与 AI 解锁**：品牌资料声明支持 ChatGPT、Claude、Netflix、Disney+、YouTube、HBO Max、TikTok、Spotify，Gemini 视节点而定；`07-19` 截图未附带解锁测试列，故均标为 `Vendor Data`。
- **多端客户端部署与 `exclude-filter` 过滤建议**：由于 `07-19` 已实测通过 VLESS 订阅导入 MiaoKo，且品牌未强制专属客户端，兼容 [Clash Verge Rev](/clients/clash-verge-rev/)、[v2rayN](/clients/v2rayn/)、[Shadowrocket](/clients/shadowrocket/)、[Stash](/clients/stash/)、[OpenClash](/clients/openclash/) 等主流第三方客户端（完整支持状态见[客户端兼容性总表](/clients/compatibility/)；具体设备上限与最新订阅规则建议购买前向 7×24 客服二次确认）：
  - **桌面端（[Windows](/clients/windows/) / [macOS](/clients/macos/)）**：推荐 [Clash Verge Rev](/clients/clash-verge-rev/)（Mihomo 内核原生兼容 VLESS）、[v2rayN](/clients/v2rayn/) 或 [FlClash](/clients/flclash/)；鉴于 `07-19` 实测中 `台湾 02`（0.00B）与 `日本 05`（8.00KB）曾出现故障，强烈建议在策略组中配置 `url-test` 自动测速或对异常节点做 `exclude-filter` 剔除，并将美国节点从自动高速组移至独立分组。
  - **移动端（[iOS](/clients/ios/) / [Android](/clients/android/)）**：iOS 推荐 [Shadowrocket](/clients/shadowrocket/) 或 [Karing](/clients/karing/)，Android 推荐 [v2rayNG](/clients/v2rayng/) 或 [Clash Meta for Android](/clients/clash-meta-for-android/)。
  - **家庭软路由（[OpenWrt](/clients/openwrt/)）**：适合部署 [OpenClash](/clients/openclash/) 或 [PassWall2](/clients/passwall2/)，但因为**同时在线设备数上限待核实**，建议以旁路由统一出口形式接入，并确认官网是否对高并发连接数有风控阈值。

### 2. 常见故障排查与自救指南

- **遇到 `台湾 02` / `日本 05` 类单点断连或美国线偏慢**：参照[节点超时与不可用排查指南](/troubleshooting/node-timeout/)核查系统时间同步并启用多地区备选切换，优先使用表现更稳的香港 01–15 或日本正常节点。
- **VLESS 订阅拉取失败或节点列表为空**：按[订阅失败与更新报错排查指南](/troubleshooting/subscription-failed/)排查系统代理回环与 DoH 设置。
- **开启 TUN 后部分国内服务或游戏异常**：参照[TUN 模式与 DNS 污染排查指南](/troubleshooting/tun-dns-error/)修正 Fake-IP 与国内直连绕过规则。
- **核心风险**：1) 存在 `台湾 02`（0.00B）与 `日本 05`（8.00KB）故障节点历史记录，必须启用测速剔除；2) 测试截图时间为 `2026-07-19 18:38`（傍晚时段，早于典型 20:00–23:00 晚高峰），且缺乏支付方式与退款条款说明。

<AvailabilityMatrix slug="weifeng" />

<NetworkTopology slug="weifeng" />

<ClientCompatibility slug="weifeng" />

<StabilityHistory slug="weifeng" />

<EvidencePanel slug="weifeng" />

---

## 五、同档位横向对比直达

- **[光速云 vs 微风网络横向对比](/compare/guangsuyun-vs-weifeng/)**：对比微风网络（¥137/100GB、乘风 ¥27/200GB、07-19 50 节点 VLESS 图）与光速云（¥99/69GB、08-19 五张 MiaoKo 图）的单 GB 成本与美线带宽差距。
- **[IEPL 专线 vs IPLC 专线横向选购对比](/compare/iepl-vs-iplc/)**：比较微风网络 IEPL+VLESS 架构与同系品牌 Firefly（IPLC+VLESS）及其他 IPLC 阵营的差异。
- **[一次性不限时（永久）流量包横向对比](/compare/non-expiring-plans/)**：评估微风长风（¥370/570GB，¥0.6491/GB）在 500GB 级不限时档位中的排位。
- **[机场月付 vs 年付回本账期对比](/compare/monthly-vs-annual/)**：围绕清风 ¥137 年付（5.07 个月回本）与乘风 ¥27 月付制定低风险试水策略。
- **[客户端兼容性横向对比](/compare/client-compatibility/)**：确认微风网络与同系但收紧至专属客户端的 Firefly 之间的生态自由度差异。

<RelatedBrand slug="weifeng" />

<AffiliateButton slug="weifeng" size="lg" />

---

## 常见问题（FAQ）

### Q1：微风网络的入门年付到底是“约 7 元/月（50GB）”还是“137 元/年（约 11.42 元/月 · 100GB）”？

以现行套餐明细为准，最低年付为【清风 (Breeze)】¥137/年（每月 100GB，折合 ¥11.42/月，单 GB ¥0.1142）。原始清单的基础数据与汇总表中残留的“年付约 7 元/月 50GB/月”属于旧档位或下线摘要，而同节正文也写明“11 元/月起”，故本站以 ¥137/年（100GB/月）作为主口径并披露该冲突。

### Q2：微风网络 2026-07-19 的 50 节点实测图表现如何？有没有暴露问题节点？

2026-07-19 18:38:20 CST 在珠海联通 9Gbps 32 线程下使用 MiaoKo 测得的 50/50 VLESS 节点中，香港 01-15 平均速度达到 468.91MB-546.20MB/s（峰值 619.64MB/s，TLS RTT 97-211ms，FullCone），新加坡约 135.34MB-401.25MB/s，表现很强；但同时暴露出台湾 02 节点为 0.00B、日本 05 节点仅 8.00KB 的异常故障节点。

### Q3：微风网络支持 Clash Verge Rev 和 Shadowrocket 第三方客户端吗？

品牌资料虽未单独明写客户端模式，但 2026-07-19 的 MiaoKo 实测截图正是直接通过 VLESS 通用订阅导入完成测试的，因此本站兼容矩阵将其适配为支持 Clash Verge Rev、v2rayN、Shadowrocket、Stash、OpenClash 等主流 VLESS 第三方客户端。具体限制仍建议下单前与 7×24 客服确认。

### Q4：微风网络的优惠码 flat888 折扣力度是多少？支持退款吗？

优惠码为 flat888，汇总表标注为“9 折”，具体适用周期与是否支持清风年付或信风/长风不限时包以官网结账页为准。支付方式与退款政策在当前档案中尚待核实，建议先购 ¥27 乘风月付验证后再升级年付。
