---
title: 机场品牌数据库（31家去重品牌档案、协议、线路与核实状态）
seoTitle: 机场品牌数据库：31家机场档案检索、对比与测评总览 | 机场测评
description: 机场测评实验室 31 家去重机场品牌数据库，支持按线路架构、传输协议、月均价位与数据核实状态实时筛选，并附带全部 31 家品牌静态结构化摘要表与去重审计说明。
slug: /brands/
category: brands
pillar: brands
pageRole: directory
schemaType: CollectionPage
tags:
  - 机场品牌数据库
  - 31家机场
  - 机场大全
  - 机场品牌对比
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: 2026-11-24
updatedDate: 2026-11-24
verifiedDate: 2026-11-24
primaryKeyword: 机场品牌数据库
secondaryKeywords:
  - 31家机场清单
  - 机场品牌大全
  - 机场品牌去重对比
searchIntent: commercial-investigation
entities:
  - 光速云
  - 暮光加速
  - 飞猫云
  - 微风网络
  - 大佬云
  - 星岛梦
  - 隐形人
  - 二猫云
  - 无忧链接
  - 唯兔云
  - Firefly
sources:
  - src-brand-list-32
  - src-guangsuyun-info
  - src-aff-prefixes-24
  - src-speedtest-2026-08-11
dataStatus: Measured
relatedSlugs:
  - /reviews/
  - /compare/
  - /plans/database/
  - /benchmarks/
  - /risks/archives/
faq:
  - question: 为什么原始清单文件叫“32家机场品牌清单”，但数据库收录的是 31 家品牌？
    answer: 在对清单正文与文末追加附录进行实体去重时，我们发现“Firefly”与“Firefly 萤火虫”指向同一品牌实体（同一域名 vip02.fireflyaff.com），合并后全部收录为 slug "firefly"；此外 24 个推广前缀表与测速包中的未入库样本（如快狸、跨界、飞V）在来源档案中单列说明，不虚增已核实品牌数。因此实际唯一品牌数为 31 家。
    link: /methodology/
    linkText: 查看品牌去重与实体归并规则
  - question: 数据库中“独立实测”“品牌方资料”“历史记录”“存在数据冲突”“待核实”各代表什么？
    answer: “独立实测”表示具备带时间戳的第三方测速或解锁截图；“品牌方资料”表示目前仅有厂商/清单宣传文本而缺独立截图；“历史记录”表示来自 2026-08-09 等旧批次且近 30 日未复测（如灵动云、浪网、边缘节点 EdgeNova）；“存在数据冲突”表示不同源文件在优惠码、流量或客户端模式上存在矛盾；“待核实”表示关键价格或协议仍存在明显缺口。
    link: /about/
    linkText: 阅读数据状态标签定义
  - question: 怎么判断一家品牌支不支持我手头的 Clash、Shadowrocket 或 OpenWrt 软路由？
    answer: 请关注下表中的“客户端生态”列。标记为“自研+第三方”或“第三方通用”或有第三方协议实测的品牌通常可导入通用订阅；标记为“仅限专属端”的品牌（如飞猫云、隐形人、SOGO云、闪跃、全球云，以及 2026 年 10 月后调整的无忧链接、Firefly、灵猫网络）则无法导入 Clash/Shadowrocket/软路由。
    link: /clients/compatibility/
    linkText: 打开客户端兼容性完整矩阵
---

# 机场品牌数据库（31 家去重品牌全库检索）

**核心说明（Answer-First）：** 本页面汇总了机场测评实验室完成去重、冲突审计与来源标注的 **31 家唯一机场品牌**（合并了原清单中重复的 Firefly 与 Firefly 萤火虫，并标注了灵动云、浪网、边缘节点 EdgeNova 三家历史追加条目）。您可以先使用下方的交互式检索面板按**线路、协议、价位与数据状态**筛选，或直接查阅下方全库 31 家静态摘要表并进入独立深度测评。

---

## 一、交互式品牌筛选与对比入口

<BrandDirectory />

---

## 二、31 家唯一机场品牌完整静态摘要表（SSR 可检索档案）

| # | 品牌名称 | 起始年份 | 线路架构 | 传输协议 | 客户端生态 | 入门参考 | 数据状态 | 深度测评 |
| :---: | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **光速云** *(LightSpeed)* | 2020 | IEPL / 企业内网 / IPLC | VLESS / SS / AnyTLS | 自研 + 第三方订阅 | ¥99/年 (¥8.25/月 · 69GB) | 独立实测 | [光速云测评](/reviews/guangsuyun/) |
| 2 | **暮光加速** *(Twilight)* | 2023 | BGP智能调度 / 专线出口 | 待核实 | 待核实 | ¥109/年 (¥9.08/月 · 70GB) | 品牌方资料 | [暮光加速测评](/reviews/muguang/) |
| 3 | **飞猫云** *(FlyCat)* | 2023 | 专线/中转混合 | Shadowsocks | 仅限专属客户端 | ¥84/年 (¥7.00/月 · 50GB) | 独立实测 | [飞猫云测评](/reviews/feimao/) |
| 4 | **微风网络** *(Breezenet)* | 2023 | IEPL 专线 | VLESS | VLESS 实测 | ¥137/年 (¥11.42/月 · 100GB) | 独立实测 | [微风网络测评](/reviews/weifeng/) |
| 5 | **大佬云** | 2024 | IEPL 专线 | VLESS | 自研 + 第三方订阅 | 年付约 ¥5.6/月 (60GB) | 品牌方资料 | [大佬云测评](/reviews/dalaoyun/) |
| 6 | **星岛梦** *(StarDream)* | 2020 | IEPL 专线 | Trojan / Shadowsocks | SS 实测未限专属端 | ¥96/年 (¥8.00/月 · 60GB) | 独立实测 | [星岛梦测评](/reviews/xingdaomeng/) |
| 7 | **隐形人** *(Invisible)* | 2024 | 企业级 IPLC 专线 | 待核实 | 仅限专属客户端 | ¥109/年 (¥9.08/月 · 80GB) | 存在数据冲突 | [隐形人测评](/reviews/yinxingren/) |
| 8 | **二猫云** *(2mao)* | 2023 | 全线 IEPL 专线 | VLESS / Shadowsocks | 自研 + 第三方兼容 | ¥89/年 (¥7.42/月 · 60GB) | 独立实测 | [二猫云测评](/reviews/ermao/) |
| 9 | **无忧链接** | 2025 | 待核实 | VLESS | 仅限专属端 *(10月改)* | ¥79/年 (¥6.58/月 · 40GB) | 独立实测 | [无忧链接测评](/reviews/wuyou/) |
| 10 | **唯兔云** *(V2云)* | 2023 | IPLC / 三网优化 / 均衡 | Trojan / Shadowsocks | SS 实测未限专属端 | ¥79.9/年 (¥6.66/月 · 45GB) | 独立实测 | [唯兔云测评](/reviews/weitu/) |
| 11 | **Firefly** *(萤火虫)* | 待核实 | IPLC 专线 | VLESS | 仅限专属端 *(10月改)* | ¥96/年 (¥8.00/月 · 60GB) | 存在数据冲突 | [Firefly 测评](/reviews/firefly/) |
| 12 | **宇宙云** *(YuZhou)* | 待核实 | IEPL / 三网优化 / 均衡 | VLESS | 自研 + 第三方订阅 | 历史 ¥96/年 (¥8.00/月) | 待核实 | [宇宙云测评](/reviews/yuzhou/) |
| 13 | **U1S1** | 2025 | IPLC 专线 | Shadowsocks | 待核实 | ¥96/年 (¥8.00/月 · 60GB) | 独立实测 | [U1S1 测评](/reviews/u1s1/) |
| 14 | **灵猫网络** | 2025 | 中转优化线路 | Shadowsocks | 仅限专属端 *(10月改)* | ¥85/年 (¥7.08/月 · 45GB) | 存在数据冲突 | [灵猫网络测评](/reviews/lingmao/) |
| 15 | **极连云** | 2024 | IEPL 专线 | Shadowsocks | 自研 + 第三方订阅 | ¥18/月 (100GB) | 独立实测 | [极连云测评](/reviews/jilian/) |
| 16 | **光年梯** | 2025 | IEPL 专线 | VLESS / Shadowsocks | 自研 + 第三方订阅 | ¥18/月 (110GB) | 独立实测 | [光年梯测评](/reviews/guangnian/) |
| 17 | **一翻云** *(1fly)* | 2025 | 全节点 IEPL + 原生住宅 | Hysteria 2 / Reality / SS | 第三方通用客户端 | ¥98/年 (¥8.17/月 · 60GB) | 独立实测 | [一翻云测评](/reviews/yifan/) |
| 18 | **SOGO 云** | 2026 | 全线 IEPL + 三网 BGP | VLESS / Shadowsocks | 仅限专属客户端 | ¥98/年 (¥8.17/月 · 60GB) | 独立实测 | [SOGO 云测评](/reviews/sogo/) |
| 19 | **可信云** *(Kosing)* | 2024 | IEPL 专线 | VLESS / Shadowsocks | 第三方通用客户端 | ¥25/月 (150GB) | 独立实测 | [可信云测评](/reviews/kexin/) |
| 20 | **速界** *(SuJie)* | 2024 | IEPL 专线 | VLESS / Shadowsocks | 自研 + 第三方订阅 | ¥25/月 (150GB) | 独立实测 | [速界测评](/reviews/sujie/) |
| 21 | **闪跃** *(FlashLeap)* | 待核实 | 纯 IPLC + 骨干网接入 | 待核实 | 仅限专属客户端 | ¥96/年 (¥8.00/月 · 60GB) | 品牌方资料 | [闪跃测评](/reviews/shanyue/) |
| 22 | **全球云** | 2026 | IPLC/IEPL + BGP优化 | Trojan / Shadowsocks | 仅限专属客户端 | ¥99/年 (¥8.25/月 · 59GB) | 独立实测 | [全球云测评](/reviews/quanqiu/) |
| 23 | **闪电鼠** | 2024 | IEPL 专线 | VLESS | 自研 + 第三方订阅 | 年付约 ¥5.6/月 (60GB) | 品牌方资料 | [闪电鼠测评](/reviews/shandianshu/) |
| 24 | **云界线** | 2024 | IEPL 专线 | VLESS | 自研 + 第三方订阅 | 年付约 ¥5.6/月 (60GB) | 存在数据冲突 | [云界线测评](/reviews/yunjiexian/) |
| 25 | **榴莲云** | 2024 | IEPL 专线 | 待核实 | 自研 + 第三方订阅 | 年付约 ¥5.6/月 (60GB) | 待核实 | [榴莲云测评](/reviews/liulianyun/) |
| 26 | **神行加速** | 2024 | IEPL 专线 | VLESS | 自研 + 第三方订阅 | 年付约 ¥14/月 (120GB) | 品牌方资料 | [神行加速测评](/reviews/shenxing/) |
| 27 | **环球梯** | 2024 | IEPL 专线 | VLESS | 自研 + 第三方订阅 | 年付约 ¥5.6/月 (60GB) | 品牌方资料 | [环球梯测评](/reviews/huanqiuti/) |
| 28 | **梯子云** *(LadderCloud)* | 2025 | IEPL 专线 | VLESS | 自研 + 通用订阅 | 年付约 ¥7.4/月 (60GB) | 品牌方资料 | [梯子云测评](/reviews/tiziyun/) |
| 29 | **灵动云** *(历史追加)* | 2025 | IEPL 专线 | VLESS / Trojan | 07-20 以 VLESS 实测 | ¥99/年 (¥8.25/月 · 70GB) | 历史记录 | [灵动云测评](/reviews/lingdong/) |
| 30 | **浪网** *(历史追加)* | 待核实 | IEPL 专线 | 待核实 | 待核实 | ¥119/年 (¥9.92/月 · 80GB) | 历史记录 | [浪网测评](/reviews/langwang/) |
| 31 | **边缘节点 EdgeNova** *(追加)* | 待核实 | 高速直连 / IPLC / 多线 | 待核实 | 待核实 | ¥108/年 (¥9.00/月 · 45GB) | 历史记录 | [边缘节点测评](/reviews/edgenova/) |

---

## 三、未纳入 31 家主库但见于辅助来源的实体说明

为确保数据审计完全透明，实验室在此列明三项未计入 31 家主库的实体记录（详见 `data/benchmark-sources.json` 与 `data/affiliate-links.ts`）：
- **快狸 (KuaiLi)**：出现在 `2026-08-11` 测速压缩包及 24 个推广前缀列表中（留存原始测速图 `快狸-节点测速实测.png`），但未在 32 家品牌主清单正文展开套餐与介绍。
- **跨界 / 飞V**：仅出现在 `24个站点的aff替换前缀.txt` 域名表中，缺少完整品牌档案与测速资料，不虚构为完整收录品牌。

## 常见问题 FAQ

### Q1：为什么原始清单文件叫“32家机场品牌清单”，但数据库收录的是 31 家品牌？
在对清单正文与文末追加附录进行实体去重时，我们发现“Firefly”与“Firefly 萤火虫”指向同一品牌实体（同一域名 vip02.fireflyaff.com），合并后全部收录为 slug "firefly"；此外 24 个推广前缀表与测速包中的未入库样本（如快狸、跨界、飞V）在来源档案中单列说明，不虚增已核实品牌数。因此实际唯一品牌数为 31 家。

### Q2：数据库中“独立实测”“品牌方资料”“历史记录”“存在数据冲突”“待核实”各代表什么？
“独立实测”表示具备带时间戳的第三方测速或解锁截图；“品牌方资料”表示目前仅有厂商/清单宣传文本而缺独立截图；“历史记录”表示来自 2026-08-09 等旧批次且近 30 日未复测（如灵动云、浪网、边缘节点 EdgeNova）；“存在数据冲突”表示不同源文件在优惠码、流量或客户端模式上存在矛盾；“待核实”表示关键价格或协议仍存在明显缺口。

### Q3：怎么判断一家品牌支不支持我手头的 Clash、Shadowrocket 或 OpenWrt 软路由？
请关注下表中的“客户端生态”列。标记为“自研+第三方”或“第三方通用”或有第三方协议实测的品牌通常可导入通用订阅；标记为“仅限专属端”的品牌（如飞猫云、隐形人、SOGO云、闪跃、全球云，以及 2026 年 10 月后调整的无忧链接、Firefly、灵猫网络）则无法导入 Clash/Shadowrocket/软路由。
