---
title: 测速与性能数据中心：39个测速批次、原始截图档案与证据局限声明
seoTitle: 机场测速与性能数据中心：2026实测截图库与解锁矩阵 | 机场测评
description: 集中展示机场测评实验室收录的 39 个测速与解锁批次（含 2026-08-11 16+2 张截图、光速云 2026-08-19 5 张三网及 VLESS+AnyTLS 截图、灵动云 07-20 摘要与 2026-10-19 15 家文本记录），保持原图零篡改并完整披露测试时段局限。
slug: /benchmarks/
category: benchmarks
pillar: network
pageRole: directory
schemaType: CollectionPage
tags:
  - 机场测速
  - 测速截图
  - MiaoKo测速
  - MAI-TEST-BOT
  - 晚高峰测速
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: 2026-11-24
updatedDate: 2026-11-24
verifiedDate: 2026-11-24
primaryKeyword: 机场测速数据中心
secondaryKeywords:
  - 2026机场测速图
  - 机场真实测速对比
  - 晚高峰机场测速报告
searchIntent: informational-commercial
entities:
  - MAI-TEST-BOT
  - MiaoKo
  - 光速云
  - 无忧链接
  - 微风网络
  - U1S1
  - 极连云
  - 宇宙云
sources:
  - src-speedtest-2026-08-11
  - src-speedtest-guangsuyun-2026-08-19
  - src-speedtest-lingdong-2026-07-20
  - src-speedtest-text-2026-10-19
dataStatus: Measured
relatedSlugs:
  - /methodology/
  - /rankings/
  - /ai-streaming/matrix/
  - /guides/speedtest-guide/
faq:
  - question: 为什么本站对 2026-08-11 的 16 张 PNG 截图只展示原图和元数据，而不自己算出一个“平均下载速度排行榜”？
    answer: 因为 2026-08-11 压缩包中各家品牌的测试时间分布在凌晨 00:21（一翻云）、01:48（星岛梦）、上午 08:52（飞猫云）到晚高峰 22:33（U1S1）、22:46（极连云）等完全不同的时段，且未附带机器可读的 CSV/JSON 原始逐节点数据。通过肉眼或 OCR 强行估算均值并把凌晨测试的品牌排在晚高峰测试的品牌前面，严重违背科学测评规范。
    link: /methodology/
    linkText: 阅读非受控批次不可直接排名规则
  - question: "2026-08-11 测速包里有一张“快狸-节点测速实测.png”，为什么品牌数据库里没有快狸？"
    answer: "快狸（kuaili）出现在 2026-08-11 测速压缩包（16:37:56 CST）和 24 个站点 aff 前缀列表中，但并未在 32 家机场主清单中提供套餐、价格或运营说明。本站将其如实记录在 data/benchmark-sources.json（标记 inBrandCatalog 为 false），既保证原始证据链零遗漏，又不凭空编造第 32 家品牌资料。"
    link: /brands/
    linkText: 查看 31 家主库品牌与辅助来源说明
  - question: 第三方原始测速截图会被加上本站的水印吗？
    answer: 绝不会。根据实验室图表规范，只有本站使用结构化数据自主渲染的深色观测台图表框架才会标注“机场测评 · jichangceping.biz”来源水印；所有第三方原始 PNG/JPG 测速截图（如 MAI-TEST-BOT 与 MiaoKo 原图）均保持原始像素与 SHA-256 校验一致，不做任何裁剪、涂抹或叠加水印。
    link: /about/
    linkText: 查看原始证据完整性承诺
---

# 测速与性能数据中心：39 个实测批次与原始截图档案库

**核心说明（Answer-First）：** 本数据中心完整公开实验室收录的 **39 个品牌测速与解锁批次**（外加 `benchmark-sources.json` 中记录的未入主库样本“快狸”，合计 40 条源记录）。所有原始 PNG/JPG 截图均保持**零修改、零涂抹、不叠加本站水印**，并逐条标注**测试工具、后端网络环境、协议显示、精确时间戳及是否为晚高峰**。

---

## 一、交互式测速批次与解锁矩阵浏览器

<BenchmarkExplorer />

---

## 二、四大测速证据批次档案与审计局限总表（静态核查版）

| 批次代号 | 覆盖范围与样本数 | 测试工具与后端环境 | 时段分布与晚高峰样本 | 核心审计局限与阅读须知 |
| :--- | :--- | :--- | :--- | :--- |
| **批次 A：`2026-08-11` 16家截图包（含 07-18/07-19 归档）** | 16 家入库品牌 + 1 家未入库（快狸），共 18 张图片（无忧链接含测速+解锁 2 张） | 13 家为 `MAI-TEST-BOT 2.0.0-dev`（珠海联通 5Gbps · 32 线程 · Shadowsocks）；宇宙云、微风、无忧为 `MiaoKo 4.3.3 / 喵速 4.7.0`（珠海联通 9Gbps · VLESS） | **晚高峰（4 家）**：无忧链接（07-18 21:40）、宇宙云（21:04）、U1S1（22:33）、极连云（22:46）；**傍晚（3 家）**：微风（07-19 18:38）、灵猫（18:45）、SOGO（18:57）；**其余 9 家为凌晨或白天非高峰** | 各品牌测试时间不同步；可信云原图仅显示 `15:32:35` 时间而未显完整年份日期（由批次推断）；多家品牌文案写 VLESS/Trojan 但 08-11 截图显示 Shadowsocks |
| **批次 B：`2026-08-19` 光速云 5 张专项截图** | [光速云](/reviews/guangsuyun/) 单品牌 5 张高清 JPG 实测图 | ① 3 张 `MiaoKo 4.3.3 / 喵速 SC-2.3.1`（长沙电信 / 广西移动 / 河北联通 2Gbps · 6 线程 · **62 节点 Shadowsocks**）<br>② 2 张 `MiaoKo 4.3.3 / 喵速 4.7.0`（珠海联通 9Gbps · 单线程 · **70 节点：60 VLESS + 10 电信 AnyTLS**） | 2026-08-19 中午 **12:13 – 12:20 CST**（全部为日间非晚高峰） | 真实展示了三网接入差异与双协议订阅并存；保留了德国01（电信 4.32KB / 联通 10.98MB）、美国02（1.60KB）低速节点及新/台 VLESS 批次 YouTube 送中记录 |
| **批次 C：`2026-07-20/21` 灵动云历史实测摘要** | [灵动云](/reviews/lingdong/) 60 节点测速与解锁文字摘要 | 珠海联通 9Gbps · VLESS 协议（历史存档文字记录，无原图文件） | 未注明具体小时是否为晚高峰 | 速度 20–80MB/s、OpenAI 各地区基本全解锁；但 TikTok 多失败、新/台 YouTube 送中、台湾 NF/D+ 识别为西班牙（ES）、美国01 整节点失败；需近 30 日复测 |
| **批次 D：`2026-10-19` 15家非晚高峰文本记录** | 光速云、暮光、飞猫、微风、星岛梦、二猫、无忧、唯兔、Firefly、U1S1、灵猫、一翻、SOGO、闪跃、全球云（15 家） | 源自 `32家机场品牌清单.txt` 各品牌章节的港/台/新/日/美 5 地区延迟（ms）与下载（Mbps）表格 | 原文统一注明为**非晚高峰** | 缺少测试运营商、线程数、协议与原始截图；不可代表 20:00–23:00 晚高峰表现，仅作地区延迟梯度参考 |

---

## 三、2026-08-11（含 07-18/19）原始截图逐张时间戳核对表

| 品牌 | 档案 ID | 图片显示测试时间 (CST) | 时段判定 | 显示协议 | 测试后端 | 日期置信度 |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **[一翻云](/reviews/yifan/)** | `bench-0811-yifan` | `2026-08-11 00:21:30` | 非晚高峰（凌晨） | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[星岛梦](/reviews/xingdaomeng/)** | `bench-0811-xingdaomeng` | `2026-08-11 01:48:13` | 非晚高峰（凌晨） | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[飞猫云](/reviews/feimao/)** | `bench-0811-feimao` | `2026-08-11 08:52:30` | 非晚高峰（早晨） | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[二猫云](/reviews/ermao/)** | `bench-0811-ermao` | `2026-08-11 10:45:27` | 非晚高峰（上午） | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[唯兔云](/reviews/weitu/)** | `bench-0811-weitu` | `2026-08-11 13:55:08` | 非晚高峰（午后） | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[光速云](/reviews/guangsuyun/)** | `bench-0811-guangsuyun` | `2026-08-11 14:32:56` | 非晚高峰（下午） | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[光年梯](/reviews/guangnian/)** | `bench-0811-guangnian` | `2026-08-11 14:38:04` | 非晚高峰（下午） | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[可信云](/reviews/kexin/)** | `bench-0811-kexin` | `2026-08-11 15:32:35` | 非晚高峰（下午） | Shadowsocks | 珠海联通 5Gbps · 32线程 | **仅时间可见，日期由批次推断** |
| **[速界](/reviews/sujie/)** | `bench-0811-sujie` | `2026-08-11 15:39:36` | 非晚高峰（下午） | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[全球云](/reviews/quanqiu/)** | `bench-0811-quanqiu` | `2026-08-11 15:50:43` | 非晚高峰（下午） | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **快狸** *(未入31家主库)* | `src-0811-kuaili` | `2026-08-11 16:37:56` | 非晚高峰（下午） | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[微风网络](/reviews/weifeng/)** | `bench-0719-weifeng` | `2026-07-19 18:38:20` | 傍晚交界时段 | VLESS | 珠海联通 9Gbps · 32线程 | 图片可见 |
| **[灵猫网络](/reviews/lingmao/)** | `bench-0811-lingmao` | `2026-08-11 18:45:40` | 傍晚交界时段 | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[SOGO 云](/reviews/sogo/)** | `bench-0811-sogo` | `2026-08-11 18:57:59` | 傍晚交界时段 | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[宇宙云](/reviews/yuzhou/)** | `bench-0811-yuzhou` | `2026-08-11 21:04:24` | **晚高峰** | VLESS | 珠海联通 9Gbps · 32线程 | 图片可见 |
| **[无忧链接](/reviews/wuyou/)** | `bench-0718-wuyou-speed/unlock` | `2026-07-18 21:40:48 / 21:47:23` | **晚高峰** | VLESS | 珠海联通 9Gbps · 32线程 | 图片可见 |
| **[U1S1](/reviews/u1s1/)** | `bench-0811-u1s1` | `2026-08-11 22:33:29` | **晚高峰** | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |
| **[极连云](/reviews/jilian/)** | `bench-0811-jilian` | `2026-08-11 22:46:50` | **晚高峰** | Shadowsocks | 珠海联通 5Gbps · 32线程 | 图片可见 |

---

## 四、暂无独立测速截图的 13 家品牌名单（透明公示）

以下 13 家品牌目前在 `data/benchmarks.json` 中**没有原始 PNG/JPG 测速截图**（其中暮光加速、Firefly、闪跃仅有 2026-10-19 非晚高峰文本记录；其余 10 家无测速数据）：
- **仅含 2026-10-19 文本测速记录（3 家）**：[暮光加速](/reviews/muguang/)、[Firefly](/reviews/firefly/)、[闪跃](/reviews/shanyue/)。
- **完全无测速数据记录（10 家）**：[大佬云](/reviews/dalaoyun/)、[隐形人](/reviews/yinxingren/)、[闪电鼠](/reviews/shandianshu/)、[云界线](/reviews/yunjiexian/)、[榴莲云](/reviews/liulianyun/)、[神行加速](/reviews/shenxing/)、[环球梯](/reviews/huanqiuti/)、[梯子云](/reviews/tiziyun/)、[浪网](/reviews/langwang/)、[边缘节点 EdgeNova](/reviews/edgenova/)。

## 常见问题 FAQ

### Q1：为什么本站对 2026-08-11 的 16 张 PNG 截图只展示原图和元数据，而不自己算出一个“平均下载速度排行榜”？
因为 2026-08-11 压缩包中各家品牌的测试时间分布在凌晨 00:21（一翻云）、01:48（星岛梦）、上午 08:52（飞猫云）到晚高峰 22:33（U1S1）、22:46（极连云）等完全不同的时段，且未附带机器可读的 CSV/JSON 原始逐节点数据。通过肉眼或 OCR 强行估算均值并把凌晨测试的品牌排在晚高峰测试的品牌前面，严重违背科学测评规范。

### Q2：2026-08-11 测速包里有一张“快狸-节点测速实测.png”，为什么品牌数据库里没有快狸？
快狸（kuaili）出现在 2026-08-11 测速压缩包（16:37:56 CST）和 24 个站点 aff 前缀列表中，但并未在 32 家机场主清单中提供套餐、价格或运营说明。本站将其如实记录在 data/benchmark-sources.json（标记 inBrandCatalog: false），既保证原始证据链零遗漏，又不凭空编造第 32 家品牌资料。

### Q3：第三方原始测速截图会被加上本站的水印吗？
绝不会。根据实验室图表规范，只有本站使用结构化数据自主渲染的深色观测台图表框架才会标注“机场测评 · jichangceping.biz”来源水印；所有第三方原始 PNG/JPG 测速截图（如 MAI-TEST-BOT 与 MiaoKo 原图）均保持原始像素与 SHA-256 校验一致，不做任何裁剪、涂抹或叠加水印。
