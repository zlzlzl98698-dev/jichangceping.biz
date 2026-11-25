---
title: 二猫云（2mao）2026 深度测评：全线 IEPL、不限设备与“单 GB 倒挂定价 + 新加坡矛盾”实证
description: 机场测评实验室对 2023 年运营机场二猫云（2mao）的深度测评：拆解全线 IEPL 专线与账号不限设备优势、6 档猫系套餐反直觉单 GB 倒挂结构、2026-08-11 实测截图，并核清“少新加坡”文案矛盾与协议差异。
slug: ermao
category: reviews
tags:
  - 二猫云
  - 2mao
  - 全线IEPL
  - 不限设备
  - Shadowsocks
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
primaryKeyword: 二猫云测评
secondaryKeywords:
  - 二猫云机场怎么样
  - 2mao 测速
  - 二猫云优惠码 ermao5555
  - 二猫云新加坡节点
searchIntent: 套餐性价比与节点核实：判断二猫云哪一档套餐最划算、核查其新加坡节点矛盾以及 Claude/Gemini 支持现状。
entities:
  - 二猫云
  - 2mao
  - IEPL专线
  - VLESS
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
  - xingdaomeng
  - weitu
  - weifeng
  - muguang
faq:
  - question: 二猫云到底有没有新加坡节点？为什么介绍说“少了新加坡”，测速表里却有新加坡？
    answer: 这是原始资料同一条目内的明确矛盾：2026-10-19 文本测速表列出了新加坡节点（延迟 46ms、下行 407Mbps），但下方介绍说明正文（第 254 行）却写着“节点覆盖香港、日本、美国，比不少同类机场少了新加坡这一站”。本站将此标注为地区口径冲突，如果强依赖新加坡线路，下单前务必在官网节点列表或通过 ¥20 白猫月付实测核验。
  - question: 为什么说二猫云的月付套餐存在“买得越贵、单 GB 越贵”的倒挂现象？
    answer: 按 data/plans.json 实算：白猫套餐（¥20/130GB）单 GB 为 ¥0.1538；橘猫畅玩版（¥40/230GB）涨到 ¥0.1739/GB；牛奶猫尊享版（¥80/430GB）涨到 ¥0.1860/GB；黑猫重度用户版（¥160/850GB）涨到 ¥0.1882/GB。因为每次价格翻倍，流量却未等比例翻倍，所以二猫云最具性价比的是 ¥89 年付小包（¥0.1237/GB）和 ¥20 白猫月付。
  - question: 二猫云 2026-08-11 的测速截图是什么时间测的？使用什么协议？
    answer: 原始 PNG 截图（MAI-TEST-BOT 2.0.0-dev，珠海联通 5Gbps 32 线程）的测试时间为 2026-08-11 10:45:27 CST（工作日非晚高峰上午），图中显示协议为 Shadowsocks，这与正文提及的 VLESS 协议存在口径差异。
  - question: 二猫云适合用来稳定使用 Claude 和 Google Gemini 吗？
    answer: 不建议作为刚性依赖主力。原始品牌资料专门注明二猫云仅明确支持 ChatGPT 及主流流媒体，对 Claude 和 Gemini 官方均未给出确定承诺（标为“视节点而定”），且本站尚无二猫云的独立 AI 解锁截图。
---

# 二猫云（2mao）深度测评：全线 IEPL 不限设备、反直觉单 GB 定价倒挂与新加坡节点矛盾核查

<strong>核心结论（Answer-First）：</strong> 二猫云（2mao）自 <strong>2023 年</strong>起运营，主打<strong>全线 IEPL 专线、海外技术团队主理、账号不限设备连接数</strong>，并拥有 `2026-08-11 10:45:27 CST` 实测 PNG 截图与 `2026-10-19` 文本记录。其入门档非常亲民——<strong>年付小包 ¥89/年（折 ¥7.42/月 · 60GB/月）</strong>与<strong>白猫月付 ¥20/月（130GB/月）</strong>均具备不错竞争力，另配有 <strong>¥99/100GB 不限时套餐</strong>。但深度审计发现三点关键实情：第一，二猫云的高阶月付套餐存在罕见的<strong>单 GB 成本倒挂</strong>（越贵的黑猫版单 GB 反而比白猫版贵 22%）；第二，同一份资料里出现<strong>“测速表含新加坡 407Mbps vs 正文称少了新加坡这一站”</strong>的硬冲突；第三，<strong>Claude 与 Gemini 均未获官方明确解锁承诺</strong>。

<BrandOverview slug="ermao" />

<AffiliateDisclosure />

---

## 一、反直觉发现：二猫云 6 档猫系套餐的单 GB 倒挂结构与回本精算

市面上绝大多数机场都是“月付越贵、单 GB 越便宜”，但二猫云在 `data/plans.json` 中的 4 档月付阶梯刚好反其道而行之——每次标称月费翻倍，赠送流量却按 `130 → 230 → 430 → 850GB` 递减增量：

| 套餐名称 | 计费周期 | 标称价格 | 流量额度 | 折合月均 | 单 GB 成本 | 升级边际成本与选型建议 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **二猫年付小包** | 年付 | **¥89 / 年** | 60GB / 月 | **¥7.42 / 月** | **¥0.1237 / GB** | **全系列单 GB 最低**，轻度日常与备用性价比最高 |
| **二猫云·白猫套餐** | 月付 | **¥20 / 月** | 130GB / 月 | ¥20.00 / 月 | **¥0.1538 / GB** | **月付梯队性价比冠军**：比常见 ¥20/120GB 档多给 10GB，最适合首月试用 |
| **二猫云·橘猫畅玩版** | 月付 | **¥40 / 月** | 230GB / 月 | ¥40.00 / 月 | ¥0.1739 / GB | +¥20 仅增 100GB（新增边际 **¥0.2000/GB**），单 GB 反比白猫贵 13.1% |
| **二猫云·牛奶猫尊享版** | 月付 | **¥80 / 月** | 430GB / 月 | ¥80.00 / 月 | ¥0.1860 / GB | +¥40 仅增 200GB（新增边际 **¥0.2000/GB**），明显贵于光速云量子版（¥68/568GB） |
| **二猫云·黑猫重度用户版** | 月付 | **¥160 / 月** | 850GB / 月 | ¥160.00 / 月 | ¥0.1882 / GB | +¥80 仅增 420GB（新增边际 **¥0.1905/GB**），**全月付档单 GB 最贵** |
| **二猫云·不限时套餐** | 一次性付费 | **¥99** | 100GB 一次性 | 不适用 | ¥0.9900 / GB | 小额不过期应急包，定价与星岛梦/Firefly（¥100/100GB）几乎持平 |

**单 GB 与预算回本点精算**：
1. **月付阶梯的“边际惩罚”**：以白猫套餐（¥20/130GB）为基准，橘猫、牛奶猫、黑猫每档新增流量的边际价格高达 **¥0.1905–¥0.2000/GB**。如果你的月用量恰好卡在 140–250GB 且不介意双账号或换用其他品牌，[微风网络](/reviews/weifeng/) 乘风版（¥27/200GB，单 GB ¥0.1350）或 [光速云](/reviews/guangsuyun/) 流光版（¥34/268GB，单 GB ¥0.1269）都比橘猫版便宜且流量更足；到 ¥80–¥160 档，[光速云](/reviews/guangsuyun/) 量子版（¥68/568GB，¥0.1197/GB）比牛奶猫少花 ¥12 还多 138GB/月。
2. **¥89 年付小包 vs ¥20 白猫月付回本线**：若你的月均流量不超过 60GB，购买 ¥89 年付小包只需连续使用 **4.45 个月**（第 5 个月起月付累计 ¥100 > ¥89）即可收回成本，全年等效节省 ¥151。
3. **¥99 不限时（100GB）vs ¥89 年付小包（720GB/年）盈亏平衡点**：¥99 不限时只比 ¥89 年付多花 ¥10，但总配额只有 100GB。只有当你的**月均实际消耗不超过 8.33GB/月**（使 100GB 跨度超过 12 个月才耗尽）时，不限时包在跨年度总支出上才占优；一旦月耗超过 10GB，¥89 年付小包（每月 60GB）在绝对流量供给上拥有 7.2 倍优势。优惠码 `ermao5555` 的具体折扣比例目前待核实，请在结算页实测。

<CouponInfo slug="ermao" />

<PricingMatrix slug="ermao" />

<PlanSelector slug="ermao" />

---

## 二、三项跨源口径冲突与实测数据核验

### 1. 资料冲突透明记录

1. **新加坡地区存在与否冲突**：`2026-10-19` 测速记录表中白纸黑字写有新加坡节点（`46ms / 407Mbps`），但同节正文介绍（第 254 行）却明确写道“节点覆盖香港、日本、美国，比不少同类机场少了新加坡这一站”。节点池可能经历过增删，对新加坡有刚需的用户务必先以官网实时节点列表核对。
2. **协议冲突（VLESS vs Shadowsocks）**：正文介绍标注为 `VLESS` 协议，但 `2026-08-11 10:45:27 CST` 的 `MAI-TEST-BOT` 原始测速 PNG 显示为 `Shadowsocks`。
3. **双推广前缀冲突**：主清单使用 `guangs.2maoyunaff.cc`，24 站点前缀表另列 `waaa.2maoyunaff.cc`。

### 2. 双批次测速证据（08-11 上午截图 + 10-19 文本）

- **2026-08-11 10:45:27 CST PNG 截图（Measured）**：`MAI-TEST-BOT 2.0.0-dev` · 珠海联通 5Gbps · 32 线程 · Ping 5 次 · `Shadowsocks`（工作日非晚高峰上午，不含解锁列）。
- **2026-10-19 非晚高峰文本（Historical Data）**：香港 `22ms / 481Mbps`、台湾 `41ms / 118Mbps`、新加坡 `46ms / 407Mbps`、日本 `53ms / 143Mbps`、美国 `134ms / 17Mbps`（注意美国延迟 134ms 是同批中较低值之一，但下行仍为 17Mbps）。

<SpeedReport slug="ermao" />

<LatencyChart slug="ermao" />

<ThroughputChart slug="ermao" />

---

## 三、解锁限制、客户端部署与排障指引

### 1. 解锁与客户端双生态适配建议

- **AI 工具解锁偏保守**：品牌资料支持 ChatGPT 与 Netflix/Disney+/YouTube/HBO Max/TikTok/Spotify（`Vendor Data`），但特意把 **Claude 与 Gemini 同时列为“视节点而定”**（原文称官方没给出确定说法）。如果重度依赖 Claude 写代码或高频使用 Gemini，建议优先排查其他测试反馈更明确的方案。
- **客户端兼容性与协议选择**：二猫云配备独家定制客户端，同时 `08-11` 已通过 `Shadowsocks` 节点完成第三方测速，归类为 `self-hosted-and-third-party`（但具体套餐是否全部开放第三方订阅导出仍以官网控制台为准），且**账号不限设备连接数**，非常适合多端家庭共享：
  - **桌面端（[Windows](/clients/windows/) / [macOS](/clients/macos/)）**：若官网提供通用订阅，优先使用 [Clash Verge Rev](/clients/clash-verge-rev/)（Mihomo 内核同时兼容 VLESS 与 Shadowsocks）或 [v2rayN](/clients/v2rayn/)；轻量化需求可选 [FlClash](/clients/flclash/) 或 [Stash](/clients/stash/)。
  - **移动端（[iOS](/clients/ios/) / [Android](/clients/android/)）**：iOS 推荐 [Shadowrocket](/clients/shadowrocket/) 或 [Karing](/clients/karing/)，Android 推荐 [v2rayNG](/clients/v2rayng/) 或 [Clash Meta for Android](/clients/clash-meta-for-android/)；纯新手也可直接使用官方定制客户端登录。
  - **软路由（[OpenWrt](/clients/openwrt/)）**：部署 [OpenClash](/clients/openclash/) 或 [PassWall2](/clients/passwall2/) 前务必先用 ¥20 白猫月付确认控制台确有通用订阅导出权限，详见[客户端兼容性总表](/clients/compatibility/)。

### 2. 常见故障排查直达

- **订阅无法更新或遇到双域名跳转报错**：二猫云存在 `guangs` 与 `waaa` 两组推广域名前缀记录，切勿手动拼接旧订阅域名；如遇 `Network Error` 或节点列表为空，按[订阅失败与更新报错排查指南](/troubleshooting/subscription-failed/)检查本地系统代理回环与 DoH 设置。
- **订阅内找不到新加坡节点或部分节点超时**：若实际下发节点池与介绍文案一致缺少新加坡，或遇到个别节点断连，参考[节点超时与不可用排查指南](/troubleshooting/node-timeout/)核对订阅组并配置自动测速切换。
- **开启 TUN 模式后国内直连异常**：参考[TUN 模式与 DNS 污染排查指南](/troubleshooting/tun-dns-error/)修正 Fake-IP 与国内域名分流规则。
- **适用人群**：预算在 **¥89/年** 或 **¥20/月（130GB）** 区间、看重全线 IEPL 稳定定位、多设备同时在线且不需要重度 Claude/Gemini 的用户；不建议在其高阶月付档（¥80/¥160）重仓投入。

<AvailabilityMatrix slug="ermao" />

<NetworkTopology slug="ermao" />

<ClientCompatibility slug="ermao" />

<StabilityHistory slug="ermao" />

<EvidencePanel slug="ermao" />

---

## 四、同档位横向对比直达

为了评估二猫云在不同预算区间和客户端需求下的真实竞争力，建议直接对照以下专题横向页：

- **[光速云 vs 二猫云横向对比](/compare/guangsuyun-vs-ermao/)**：同为“自研 + 第三方订阅”双模式与不限设备的 IEPL 专线品牌，直接拆解 ¥89/60GB vs ¥99/69GB、¥20 白猫 vs ¥25 极速版以及中高阶月付单 GB 差距。
- **[平价与高性价比机场横向对比](/compare/budget-airports/)**：查看二猫云 ¥7.42/月入门年付在全库 ≤¥12/月筛选阵营中的延迟、带宽与实测证据排名。
- **[一次性不限时（永久）流量包横向对比](/compare/non-expiring-plans/)**：对比二猫云 ¥99/100GB 不限时包与星岛梦、Firefly、唯兔云、光速云 147 永久包的单 GB 效率。
- **[IEPL 专线 vs IPLC 专线横向选购对比](/compare/iepl-vs-iplc/)**：理解二猫云“全线 IEPL”定位与唯兔云、Firefly 等 IPLC 阵营的技术差异。
- **[客户端兼容性横向对比](/compare/client-compatibility/)**：快速分辨双模式开放订阅品牌与仅限专属客户端阵营的使用自由度边界。

<RelatedBrand slug="ermao" />

<AffiliateButton slug="ermao" size="lg" />

---

## 常见问题（FAQ）

### Q1：二猫云到底有没有新加坡节点？为什么介绍说“少了新加坡”，测速表里却有新加坡？

这是原始资料同一条目内的明确矛盾：2026-10-19 文本测速表列出了新加坡节点（延迟 46ms、下行 407Mbps），但下方介绍说明正文（第 254 行）却写着“节点覆盖香港、日本、美国，比不少同类机场少了新加坡这一站”。本站将此标注为地区口径冲突，如果强依赖新加坡线路，下单前务必在官网节点列表或通过 ¥20 白猫月付实测核验。

### Q2：为什么说二猫云的月付套餐存在“买得越贵、单 GB 越贵”的倒挂现象？

按 data/plans.json 实算：白猫套餐（¥20/130GB）单 GB 为 ¥0.1538；橘猫畅玩版（¥40/230GB）涨到 ¥0.1739/GB；牛奶猫尊享版（¥80/430GB）涨到 ¥0.1860/GB；黑猫重度用户版（¥160/850GB）涨到 ¥0.1882/GB。因为每次价格翻倍，流量却未等比例翻倍，所以二猫云最具性价比的是 ¥89 年付小包（¥0.1237/GB）和 ¥20 白猫月付。

### Q3：二猫云 2026-08-11 的测速截图是什么时间测的？使用什么协议？

原始 PNG 截图（MAI-TEST-BOT 2.0.0-dev，珠海联通 5Gbps 32 线程）的测试时间为 2026-08-11 10:45:27 CST（工作日非晚高峰上午），图中显示协议为 Shadowsocks，这与正文提及的 VLESS 协议存在口径差异。

### Q4：二猫云适合用来稳定使用 Claude 和 Google Gemini 吗？

不建议作为刚性依赖主力。原始品牌资料专门注明二猫云仅明确支持 ChatGPT 及主流流媒体，对 Claude 和 Gemini 官方均未给出确定承诺（标为“视节点而定”），且本站尚无二猫云的独立 AI 解锁截图。
