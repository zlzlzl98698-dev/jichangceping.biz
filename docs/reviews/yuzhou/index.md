---
title: 宇宙云（YuZhou）深度测评：资料缺口核查与 08-11 晚高峰 VLESS 实测档案
seoTitle: 宇宙云测评 (2026) - 9Gbps 晚高峰 VLESS 截图核验与资料缺口说明
description: 宇宙云（YuZhou）客观深度测评：保留 2026-08-11 晚高峰 21:04 CST 珠海联通 9Gbps VLESS 实测截图，诚实披露 data/plans.json 尚无完整套餐行的现状，附客户端兼容性与排查清单。
canonical: /reviews/yuzhou/
schemaType: Article
brandSlug: yuzhou
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: 2026-11-24
updatedDate: 2026-11-25
verifiedDate: 2026-11-24
dataStatus: Unverified
sourceNote: 当前仅有 2026-08-11 晚高峰 VLESS 原始测速截图与历史 ¥96/年 起价记录，data/plans.json 目前为 0 条完整套餐行，完整月流量、地区与解锁数据待补充核实。
faq:
  - question: 宇宙云现在有哪些套餐？每月有多少流量？
    answer: 目前 data/plans.json 中仅收录 1 条不完整的历史起价条目（¥96/年，折合 ¥8.00/月，但月流量配额与单 GB 成本均为 null 待核实），完整套餐行的数量为 0。由于缺少当期官网完整套餐明细表与每月流量配额数据，相关字段当前均标记为待核实，不支持将历史起价直接视为现行全部套餐。
  - question: 宇宙云有没有真实的测速记录？表现如何？
    answer: 有。本站归档了 2026-08-11 21:04:24 CST（晚高峰时段）的原始 PNG 测速截图，使用 main 4.3.3 (696) / miaosu 4.7.0 (A11-32) 在珠海联通 9Gbps 32 线程环境下针对 VLESS 节点进行测试。由于未附带机器可读的原始 CSV 数据，本站不目测编造均值，读者可直接在下文原始证据面板查看原图。
  - question: 宇宙云支持 Clash 或 Shadowrocket 第三方客户端，还是必须用自研客户端？
    answer: 两份源资料之间存在口径差异：正文基础条目将使用方式标注为“待核实”，而汇总表格提及“IEPL+VLESS+自研客户端”；不过 2026-08-11 的测速记录实际是通过 VLESS 节点完成的。建议注册后先在用户面板确认是否提供标准订阅链接，避免遭遇纯专属客户端锁定限制。
  - question: 宇宙云是否支持 ChatGPT、Claude 或 Netflix、Disney+ 解锁？
    answer: 尚未测试且暂无可靠来源数据。2026-08-11 的截图批次仅涵盖节点延迟与吞吐测试，不包含 AI 工具或流媒体解锁检测，且品牌资料未提供分项解锁说明，当前状态全部为待核实。
  - question: 宇宙云的历史优惠码 YUZHOU553 还能打 8 折吗？
    answer: YUZHOU553 与“新用户 8 折”均来自较早期历史资料记录，现行是否有效、是否限特定周期套餐均待核实。下单结算时请以官网订单页实际折扣为准。
---

# 宇宙云（YuZhou）深度测评：资料缺口核查与 08-11 晚高峰 VLESS 实测档案

> <strong>核心结论（Answer-First）</strong>：宇宙云（YuZhou）在本站品牌库中属于<strong>“具备晚高峰实测截图证据、但当期商业资料存在明显缺口”</strong>的特殊观察对象。一方面，我们保存了 <strong>2026-08-11 21:04 CST 晚高峰时段</strong> 在珠海联通 9Gbps 后端环境下测得的 VLESS 协议原始 PNG 截图；另一方面，<code>data/plans.json</code> 目前仅有 <strong>0 条完整套餐行</strong>（仅保留 1 条缺失流量配额的 <code>¥96/年</code> 历史起价线索），且品牌主清单中的 <strong>现行完整套餐表、月流量配额、落地地区列表、支付方式、退款条款与 AI/流媒体解锁状态均处于待核实状态</strong>。在未补齐当期面板数据前，本站将宇宙云整体数据状态标记为 <code>Unverified</code>（待核实），建议有兴趣的用户仅在自行登录官网核验最新套餐与订阅模式后，以最低周期小额试水。

<BrandOverview slug="yuzhou" />

<AffiliateButton slug="yuzhou" source-section="hero" label="前往宇宙云核验最新套餐与面板" />

---

## 一、评测边界声明：为什么宇宙云的数据状态标为“待核实”

在机场测评实验室的内容规范中，不同品牌会根据实际掌握的公开资料与测试样本呈现完全不同的评估深度。对于宇宙云，读者在阅读任何判断前必须先理解一个核心事实：<strong>有实测测速图，并不等同于商业参数完整。</strong>

根据 `data/brands.json`、`data/plans.json` 与 `sources/brand-info/32家机场品牌清单.txt` 的交叉审计，宇宙云目前具备三条可溯源线索：

1. <strong>实测截图档案</strong>：`sources/speedtest-2026-08-11/宇宙云-节点测速实测.png`（1122×1402 PNG），记录了 2026 年 8 月 11 日晚间 21:04:24 CST 的 VLESS 节点测速结果。
2. <strong>早期品牌资料片段</strong>：包含“IEPL 专线、三网优化、智能负载均衡”、“60+ 节点（较早期历史资料）”、“¥96/年历史起价”和历史优惠码 `YUZHOU553`。
3. <strong>推广前缀一致记录</strong>：在主清单与《24个站点的aff替换前缀》中，其推广域名前缀一致指向 `wzjc.yuzoucloud.cc`。

然而，商业决策最关键的几项指标——包括<strong>各档月付/季付/年付价格、每月流量配额、具体覆盖国家与地区、同时在线设备上限、支持支付宝还是 USDT、是否支持工单退款</strong>——在现有源文档中均明确留空或标为“待补充/待核实”。基于“绝不编造缺失价格与流量”的实验室红线，本篇评测不会用模糊话术替宇宙云填补套餐表，而是将重点放在<strong>拆解已有 08-11 晚高峰 9Gbps 实测档案的技术含义</strong>与<strong>梳理用户购前必须亲自核查的盲区</strong>。

---

## 二、品牌背景与源文档口径冲突审计

在宇宙云的原始归档中，开业年份（`foundedYear`）尚未有明确记载，仅在品牌摘要中标注为“较早期历史资料”。同时，我们在审校 `32家机场品牌清单.txt` 时发现了一处直接影响客户端选型的内部口径冲突：

- <strong>冲突项：客户端形态与订阅模式（<code>clientMode</code>）</strong>
  - <strong>正文第 384 行</strong>：将使用方式标注为“待核实（不默认‘专属客户端’或‘提供订阅链接’）”。
  - <strong>汇总表第 931 行</strong>：却写入了“IEPL+VLESS+自研客户端”的组合标签。
  - <strong>技术佐证</strong>：2026-08-11 的第三方测速截图是通过 `main 4.3.3 (696) / miaosu 4.7.0 (A11-32)` 针对 VLESS 协议完成的，这意味着在测试当期，服务端至少存在可供测速后端拉取的 VLESS 节点配置。
- <strong>审校结论</strong>：目前最谨慎的理解是宇宙云可能同时提供自研客户端与 VLESS 订阅支持，但在官方最新公告确认前，不能排除其近期调整为仅限自研客户端、或仅向部分套餐开放第三方订阅的可能性。如果官网已收紧为仅自研客户端，请提前评估[专属客户端锁定风险](/risks/exclusive-client-lockin/)；对依赖 [Clash Verge Rev](/clients/clash-verge-rev/)、[Shadowrocket](/clients/shadowrocket/) 或 [OpenWrt 软路由](/clients/openwrt/) 的用户而言，注册后进入控制台的第一步就是确认是否存在“一键导入 / 复制订阅地址”按钮。

---

## 三、套餐价格、单 GB 成本与 <code>plans.json</code> 缺口核查

在定价数据层面，我们必须对 `data/plans.json` 的真实记录状态作极度严谨的说明：<strong>截至本次核档，<code>data/plans.json</code> 中关于宇宙云的完整套餐行数量为 0 条</strong>，仅收录了 1 条不完整的历史线索条目（`yuzhou-entry-historical`）：

- <strong>条目标注</strong>：`历史年付起价（待核实）`，计费周期 `annual`（年付），标称价格 `¥96`，折合月均 `¥8.00/月`，数据状态 `Historical Data`。
- <strong>缺失字段</strong>：`trafficGb: null`（月流量配额 `待核实`）、`costPerGb: null`（单 GB 成本 `待核实`），且无任何月付、季付或不限时套餐明细记录。

<PricingMatrix slug="yuzhou" />

<CouponInfo slug="yuzhou" />

### 已知价格线索与待核查缺口对照表

| 评估维度 | <code>data/plans.json</code> 现有记录 | 当前核实状态 | 购前核查与算账指引 |
| --- | --- | --- | --- |
| 历史起步参考价 | `¥96/年`（折合 `¥8.00/月`） | `Historical Data`（历史锚点） | 登录官网查看是否仍保留 ¥96/年入门档，以及是否提供常规月付试用档 |
| 月度流量配额 | `trafficGb: null`（未记录） | `待核实` | 确认入门年付档实际每月给多少 GB，避免按旧记忆盲下单 |
| 单 GB 成本（Cost/GB） | `costPerGb: null`（无法计算） | `待核实` | 登录面板看清价格与月流量后，用 `年费 ÷ (12 × 月流量GB)` 自行复算单价 |
| 更高阶月付 / 不限时包 | `0 条记录` | `待核实` | 对照官网在售多档位与[套餐价格数据库](/plans/database/)及[单 GB 成本计算方法](/plans/cost-per-gb-methodology/) |
| 优惠码与折扣 | `YUZHOU553`（历史称新用户 8 折） | `待核实` | 结算页测试该码是否仍生效，注意年付小包通常是否受限 |
| 支付方式与退款政策 | 资料未披露 | `待核实` | 下单前确认是否支持支付宝/微信/USDT 及“特殊商品不退款”条款边界 |

<strong>理性的单 GB 对比标尺</strong>：正因为 `plans.json` 当前有 0 条完整套餐行，我们绝不会替宇宙云编造一个“假定 60GB”的表格单价。不过在自行登录官网核价时，你可以直接用同为 `¥96/年`（折 `¥8/月`）价位线的已核实品牌作参考锚点：[U1S1](/reviews/u1s1/) 年付包为 `¥96/年 · 60GB/月`（`¥0.1333/GB`），[一翻云](/reviews/yifan/) 年付小包为 `¥98/年 · 60GB/月`（`¥0.1362/GB`），[光速云](/reviews/guangsuyun/) 轻量版为 `¥99/年 · 69GB/月`（`¥0.1196/GB`）。如果宇宙云官网当前年付实测单 GB 明显高于 `¥0.15/GB` 或缺乏低门槛月付试水档，性价比就会明显落后；这也是我们坚持<strong>“未见完整套餐表前保持待核实、不作性价比推荐”</strong>的原因。

---

## 四、线路架构与 VLESS 协议技术特征

尽管商业条目尚有欠缺，但宇宙云在技术架构上的两条线索非常明确：<strong>IEPL 专线 + 三网优化 + 智能负载均衡</strong>，以及 <strong>VLESS 协议</strong>。

<NetworkTopology slug="yuzhou" />

### 1. VLESS 协议在 08-11 批次中的独特位置
在 2026-08-11 的 16 家机场实测截图批次中，绝大多数机场（如 U1S1、灵猫网络、极连云、光年梯、一翻云、SOGO 云、可信云、速界等）在截图中显示的协议都是 <strong>Shadowsocks</strong>，唯独宇宙云等少数品牌明确以 <strong>VLESS</strong> 协议出现在测速面板中。
从协议工程特性来看：
- <strong>VLESS</strong> 本身属于轻量级无状态传输协议（通常配合 TLS 或 XTLS / Reality 承载），省去了传统加密协议的冗余封包开销，在配合现代客户端内核（如 Xray-core、sing-box 或 Mihomo）时，能够较好地支撑高并发吞吐。
- 它对客户端版本有一定要求：较老版本的传统 Clash（原版内核已停止维护）并不原生支持 VLESS，用户需要使用 [Clash Verge Rev](/clients/clash-verge-rev/)（Mihomo 内核）、[v2rayN](/clients/v2rayn/) / [v2rayNG](/clients/v2rayng/)、[Shadowrocket](/clients/shadowrocket/) 或基于 [sing-box](/clients/sing-box/) 的现代客户端（完整平台对照见[客户端兼容性总表](/clients/compatibility/)）。

### 2. IEPL 专线与三网优化、智能负载均衡
厂商资料标注宇宙云采用“IEPL 专线 + 三网优化 + 智能负载均衡”，以及历史上“60+ 节点”的规模。理论上，IEPL（国际以太网专线）绕开公网国际出口拥堵段，配合三网优化入口（电信/联通/移动独立或 BGP 智能调度）及负载分担，能够缓解单入口在晚高峰拥塞的概率。但需要提醒的是，<strong>线路宣传标签不等于节点实际质量</strong>：在缺乏最新节点清单（地区分布、倍率说明、住宅/机房 IP 区分）的情况下，用户仍需以登录后的实际节点表为准。

---

## 五、2026-08-11 晚高峰 9Gbps 实测截图与测试局限解析

宇宙云是目前 12–21 号评测批次中，唯一在 2026-08-11 截图里使用 <strong>9Gbps 测速后端</strong> 与 <strong>VLESS 协议</strong> 的品牌之一（另一批次均采用 MAI-TEST-BOT 2.0.0-dev + 珠海联通 5Gbps 后端 + Shadowsocks）。

<SpeedReport slug="yuzhou" />

### 实测档案核心参数解读
- <strong>测试时间</strong>：`2026-08-11T21:04:24+08:00`（北京时间晚上 21:04，处于标准晚高峰窗口 20:00–23:00 内）。
- <strong>测试环境</strong>：工具为 `main 4.3.3 (696) / miaosu 4.7.0 (A11-32)`，测试端位于 <strong>珠海联通 9Gbps · 32 线程</strong>。
- <strong>重要阅读提醒</strong>：
  1. <strong>9Gbps 后端与 5Gbps 后端不可直接横向排榜</strong>：由于宇宙云使用的后端（珠海联通 9Gbps）与同日多数使用 MAI-TEST-BOT（珠海联通 5Gbps）的机场并不在同一测试器配置下，本站拒绝将不同工具、不同时段、不同协议的截图拼接成“速度排行榜”。
  2. <strong>缺乏 2026-10-19 文本测速复核</strong>：U1S1、灵猫、一翻云、SOGO 云和闪跃在 2026-10-19 均有五地区（港/台/新/日/美）延迟与下载速率文本复核记录，而宇宙云在 2026-10-19 栏目中明确标注为“暂无可核实实测数据”。因此，08-11 这张晚高峰 PNG 截图只能证明<strong>在 2026 年 8 月 11 日晚 21:04 这一特定时刻，宇宙云 VLESS 节点在珠海联通 9Gbps 下可正常跑通测速</strong>，不能直接外推为全年或全运营商稳定。

---

## 六、AI 工具与流媒体解锁现状（未测试 / 待核实）

<AvailabilityMatrix slug="yuzhou" />

在 AI 工具（ChatGPT、Claude、Gemini）与流媒体（Netflix、Disney+、YouTube、HBO Max、TikTok、Spotify）维度上，宇宙云目前<strong>没有任何公开的解锁实测记录或厂商逐项声明</strong>。
- 2026-08-11 的 MiaoSu 测速图仅展示网络连通与下载速率，并未携带流媒体或 OpenAI 检测列。
- 品牌主资料中的“流媒体 & AI 解锁”两行均为空白待核实。

因此，如果你的核心购买目的是“稳定直连 Claude”或“全节点解锁台湾 Netflix / Disney+”，宇宙云现阶段<strong>无法提供事前确定性</strong>，建议先参考已有分项数据的同价位方案，或者在官网购买最低成本周期后自行用检测脚本实测。

---

## 七、客户端兼容性、分流配置与故障排查直达

<ClientCompatibility slug="yuzhou" />

基于宇宙云在汇总表中的“自研客户端”标签与 08-11 截图展现的 VLESS 协议支持，我们在 `client-compatibility.json` 中暂时列出了支持 VLESS 的现代主流客户端参考清单，但<strong>仍以 `Unverified` 标注</strong>：

- <strong>桌面端（[Windows](/clients/windows/) / [macOS](/clients/macos/) / [Linux](/clients/linux/)）</strong>：推荐优先准备支持 VLESS 的 [Clash Verge Rev](/clients/clash-verge-rev/)、[v2rayN](/clients/v2rayn/)、[FlClash](/clients/flclash/) 或 [Hiddify](/clients/hiddify/)（[sing-box](/clients/sing-box/) 内核）；切勿使用早已停止维护、无法解析 VLESS 的原版 Clash for Windows。
- <strong>移动端与软路由（[iOS](/clients/ios/) / [Android](/clients/android/) / [OpenWrt](/clients/openwrt/)）</strong>：iOS 端可用 [Shadowrocket](/clients/shadowrocket/) 或 [Stash](/clients/stash/)，Android 端可用 [v2rayNG](/clients/v2rayng/)，OpenWrt 软路由端可用 [OpenClash](/clients/openclash/) 或 [PassWall2](/clients/passwall2/)。若后台实际仅提供自研客户端安装包而无订阅 URL，请先阅读[专属客户端生态锁定风险](/risks/exclusive-client-lockin/)再决定是否付款。

### 上手配置与常见故障排查直达
1. <strong>订阅导入与拉取异常</strong>：标准导入步骤见[订阅导入与客户端配置指南](/guides/subscription/)；若后台提供了订阅链接但客户端报错拉取失败，请按[订阅失败与更新报错排查](/troubleshooting/subscription-failed/)排查本地代理残留、旧域名或 DNS 污染。
2. <strong>Clash 分流规则配置</strong>：获得 VLESS 节点后，不建议长期挂全局模式，可参考[Clash 分流规则编写与实战教程](/guides/clash-rules/)分离国内外流量与 AI/流媒体出口。
3. <strong>节点超时与 TUN/DNS 泄漏排查</strong>：遇到特定区域节点晚高峰超时或丢包，参阅[节点超时与不可用排查指南](/troubleshooting/node-timeout/)；桌面端开启虚拟网卡后若出现内网失联或 DNS 泄漏，对照[TUN 模式与 DNS 污染排查](/troubleshooting/tun-dns-error/)与[TUN 与 DNS 分流指南](/guides/tun-dns/)排查。

---

## 八、原始证据档案与数据源审计

<EvidencePanel slug="yuzhou" />

从证据面板可以看出，宇宙云的全部公开事实严格来自以下三份文件：
1. `32家机场品牌清单.txt`（第 377–403 行与第 931 行汇总表）：提供了历史 ¥96/年起价、YUZHOU553 与自研客户端冲突线索。
2. `24个站点的aff替换前缀.txt`：确认 `wzjc.yuzoucloud.cc` 域名一致性。
3. `speedtest-manifest.json`（`宇宙云-节点测速实测.png`）：提供了 2026-08-11 21:04 CST 晚高峰 VLESS 实测图像档案。

本站严格遵守“不目测截图编造机器表格”的规范，将原始图片原封不动展示于证据档案区，不对其二次叠加任何修改或水印。

---

## 九、适合与不适合人群判断

### 相对适合考虑的人群
- <strong>看重晚高峰 VLESS 实测截图线索、且愿意亲自登录官网核对实时套餐表</strong>的排查型用户。
- <strong>使用支持 VLESS 的现代客户端</strong>（Clash Verge Rev、v2rayN、Shadowrocket、sing-box），不介意花 5 分钟确认后台是否有订阅链接的技术用户。

### 明确不适合的人群
- <strong>下单前必须看到清晰全套价格表、月流量配额、不限时包与多平台退款承诺</strong>的谨慎型买家。
- <strong>重度依赖 ChatGPT / Claude / Gemini 或特定地区 Netflix / TikTok 解锁、不愿自行承担测试成本</strong>的用户（可优先转向资料更完整的品牌）。

---

## 十、与同价位、同证据层级品牌的横向差异及对比直达

由于宇宙云的历史起价锚定在 <strong>¥96/年（¥8/月）</strong>，且具备 <strong>08-11 晚高峰截图</strong>，将它放在同区间品牌中对比会非常清晰：

- <strong>对比 [U1S1](/reviews/u1s1/)（¥96/年 60GB · IPLC）</strong>：U1S1 同为 ¥96/年起点，但完整披露了 5 档月付套餐（最高 1500GB）、不限设备数、2026-08-11 22:33 晚高峰 SS 截图以及 2026-10-19 五地区文本测速；宇宙云仅在“08-11 使用 VLESS 9Gbps 后端”这一点上具有协议与测试环境差异，其余商业信息远不如 U1S1 完整。
- <strong>对比 [一翻云](/reviews/yifan/)（¥98/年 60GB · IEPL）</strong>：一翻云明确开放 Hysteria 2 / VLESS-Reality / Shadowsocks 三协议、覆盖台日港新美五地并给出 8 档套餐表；宇宙云尚缺少同等级别的多周期透明度。
- <strong>对比 [闪跃](/reviews/shanyue/)（¥96/年 60GB · 纯 IPLC）</strong>：闪跃同为 ¥96/年入门且有 4 档 8 折月付（闪动折后 ¥19.2/月），但仅限专属客户端且缺少 08-11 截图。
- <strong>对比 [光速云](/reviews/guangsuyun/)（¥99/年 69GB · 主推旗舰）</strong>：光速云不仅有完整套餐、支付与客服条款，还具备 2026-08-19 62 节点三网 SS + 70 节点 VLESS/AnyTLS 解锁全图，证据完整度远高于当前阶段的宇宙云。

### 同档位横向对比直达

- <strong>[平价与高性价比机场横向对比](/compare/budget-airports/)</strong>：查看宇宙云 `¥96/年` 历史起价在全站入门预算梯队中的真实对比坐标与信息缺口位置。
- <strong>[机场月付 vs 年付回本账期对比](/compare/monthly-vs-annual/)</strong>：资料缺口未补齐前切忌盲买年付，先了解月付试错与年付锁仓的风险边界。
- <strong>[IEPL 与 IPLC 专线横向对比](/compare/iepl-vs-iplc/)</strong>：拆解宇宙云标注的 IEPL 专线与 VLESS 协议在跨境稳定性上的真实工程差异。
- <strong>[客户端兼容性横向对比](/compare/client-compatibility/)</strong>：对照 `Unverified` 口径冲突品牌与已明确开放第三方订阅或强制专属客户端品牌的适配风险。
- <strong>[光速云 vs 暮光加速横向对比](/compare/guangsuyun-vs-muguang/)</strong>：如果对 ¥8–¥9/月入门年付及 VLESS/BGP 路线感兴趣，可先以证据齐全的老牌旗舰作参考标尺。

---

## 十一、风险提示与购前核查清单

1. <strong>勿把历史起价当完整菜单</strong>：`plans.json` 当前为 0 条完整套餐行，`¥96/年` 仅是早期摘要锚点，实际在售套餐的价格、流量与倍率可能已调整。
2. <strong>先核对客户端与付款方式</strong>：确认支持自己手中的设备（尤其 iOS / OpenWrt 软路由）和常用支付方式（支付宝/微信/USDT）后再下单。
3. <strong>坚持月付或最低档试水原则</strong>：鉴于运营年份、退款政策与客服渠道均未在公开文档明确，务必避免在未核实前直接购入多年付套餐；更多避坑标准可参阅 [年付/不限时/免费风险](/risks/billing-risks/)。

<AffiliateButton slug="yuzhou" source-section="footer" label="前往宇宙云官网核验最新套餐" />

<RelatedBrand slug="yuzhou" :related-slugs="['u1s1', 'yifan', 'shanyue', 'guangsuyun']" />

---

## 常见问题（FAQ）

### Q1：宇宙云现在有哪些套餐？每月有多少流量？

目前 data/plans.json 中仅收录 1 条不完整的历史起价条目（¥96/年，折合 ¥8.00/月，但月流量配额与单 GB 成本均为 null 待核实），完整套餐行的数量为 0。由于缺少当期官网完整套餐明细表与每月流量配额数据，相关字段当前均标记为待核实，不支持将历史起价直接视为现行全部套餐。

### Q2：宇宙云有没有真实的测速记录？表现如何？

有。本站归档了 2026-08-11 21:04:24 CST（晚高峰时段）的原始 PNG 测速截图，使用 main 4.3.3 (696) / miaosu 4.7.0 (A11-32) 在珠海联通 9Gbps 32 线程环境下针对 VLESS 节点进行测试。由于未附带机器可读的原始 CSV 数据，本站不目测编造均值，读者可直接在下文原始证据面板查看原图。

### Q3：宇宙云支持 Clash 或 Shadowrocket 第三方客户端，还是必须用自研客户端？

两份源资料之间存在口径差异：正文基础条目将使用方式标注为“待核实”，而汇总表格提及“IEPL+VLESS+自研客户端”；不过 2026-08-11 的测速记录实际是通过 VLESS 节点完成的。建议注册后先在用户面板确认是否提供标准订阅链接，避免遭遇纯专属客户端锁定限制。

### Q4：宇宙云是否支持 ChatGPT、Claude 或 Netflix、Disney+ 解锁？

尚未测试且暂无可靠来源数据。2026-08-11 的截图批次仅涵盖节点延迟与吞吐测试，不包含 AI 工具或流媒体解锁检测，且品牌资料未提供分项解锁说明，当前状态全部为待核实。

### Q5：宇宙云的历史优惠码 YUZHOU553 还能打 8 折吗？

YUZHOU553 与“新用户 8 折”均来自较早期历史资料记录，现行是否有效、是否限特定周期套餐均待核实。下单结算时请以官网订单页实际折扣为准。
