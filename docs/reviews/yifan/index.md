---
title: 一翻云（1fly）深度测评：三协议 IEPL 物理专线、不限时包与双优惠码核查
seoTitle: 一翻云机场测评 (2026) - Hysteria2/VLESS-Reality/SS 三协议与 1FLYYUN 优惠核验
description: 一翻云（1fly）深度测评：2025 年运营全节点 IEPL 物理专线 + 原生住宅 IP，开放 Hysteria 2 / VLESS-Reality / Shadowsocks 三协议，8 档套餐含不限时包；详析 8 档单 GB 精算、1FLYYUN vs yfy6666 优惠码冲突与客户端排障指南。
canonical: /reviews/yifan/
schemaType: Article
brandSlug: yifan
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: 2026-11-24
updatedDate: 2026-11-25
verifiedDate: 2026-11-24
dataStatus: Measured
sourceNote: 综合品牌清单、24站点aff前缀表、2026-08-11 00:21:30 CST 实测截图与 2026-10-19 非晚高峰 5 地区文本记录；存在 1FLYYUN vs yfy6666 优惠码冲突与 guangs vs wzjc 域冲突。
faq:
  - question: 一翻云支持哪些代理协议？适合用什么客户端？
    answer: 一翻云同时提供 Hysteria 2、VLESS-Reality 与 Shadowsocks 三种主流协议，不强制使用专属客户端，对第三方客户端极其友好。推荐使用 Clash Verge Rev（Mihomo 内核）、v2rayN / v2rayNG、Shadowrocket、Stash 或 sing-box / FlClash 等支持 Hysteria 2 与 Reality 的现代客户端。
  - question: 一翻云的优惠码是 1FLYYUN 还是 yfy6666？
    answer: 源文档存在两处不同记录：品牌正文介绍明确写出“优惠码 1FLYYUN 可以再打 9 折”，而基础数据摘要行与文末汇总表列出 yfy6666。若 9 折码 1FLYYUN 在月付轻享版（¥20）生效，折后为 ¥18.00/月（150GB，折 ¥0.1200/GB）。建议下单结账页优先测试 1FLYYUN，若无效再试 yfy6666。
  - question: 一翻云有不限时流量包吗？和月付哪个更划算？
    answer: 有。一翻云在 data/plans.json 收录三档永久不过期的不限时包：轻享版 ¥100（100GB，¥1.0000/GB）、舒享版 ¥200（250GB，¥0.8000/GB）和尊享版 ¥400（500GB，¥0.8000/GB）。按单 GB 价格看，月付轻享版（¥20/150GB，¥0.1333/GB）和年付小包（¥98/年 每月 60GB，¥0.1362/GB）便宜得多；其中 250GB 与 500GB 两档不限时单价均停在 ¥0.8000/GB（无进一步规模降价），仅适合月均消耗低于 10.2GB 的超低频应急备用需求。
  - question: 一翻云宣传“晚高峰 0 丢包”，现有测速截图能证明吗？
    answer: 需要客观区分：一翻云虽保有 2026-08-11 的原始 PNG 测速截图，但该图实际测试时间为凌晨 00:21:30 CST（非晚高峰），而 2026-10-19 的五地区文本数据也明确标注为非晚高峰。因此“晚高峰 0 丢包”目前仅属于品牌方单方面声明，尚未在本站归档到 20:00–23:00 晚高峰独立截图背书，且官方无免费试用，建议先购 ¥20 轻享月付自行实测。
  - question: 一翻云限制设备数量吗？包含台湾节点吗？
    answer: 不限速也不限设备同时在线数量。地区覆盖包括香港、台湾、新加坡、日本、美国五地，其中台湾节点在 2026-10-19 非晚高峰记录中测得 40ms 延迟与 117Mbps 下载速率。
---

# 一翻云（1fly）深度测评：三协议 IEPL 物理专线、不限时包与双优惠码核查

> <strong>核心结论（Answer-First）</strong>：一翻云（1fly）是一家于 <strong>2025 年上线</strong>、技术开放度在同价位中非常突出的机场：它主打 <strong>全节点 IEPL 物理专线 + 原生住宅 IP</strong>，罕见地同时开放 <strong>Hysteria 2、VLESS-Reality 与 Shadowsocks 三大协议</strong>，不限设备数量、不限速，节点覆盖港/台/新/日/美五地，<code>data/plans.json</code> 共收录从 <strong>¥98/年小包（¥8.17/月 · 60GB/月）</strong>、<strong>¥20/月 轻享版（150GB/月）</strong> 到 <strong>¥100–¥400 不限时流量包</strong> 共 <strong>8 档完整套餐</strong>。但在冷静评估数据时，也有两点关键边界必须说明：第一，官方宣称“晚高峰 0 丢包”，但本站归档的 2026-08-11 截图测于 <strong>凌晨 00:21 CST</strong>、2026-10-19 文本测速也为 <strong>非晚高峰</strong>，尚未有晚高峰时段截图直接背书；第二，源文档存在 <strong><code>1FLYYUN</code>（9 折）vs <code>yfy6666</code></strong> 的双优惠码冲突与双推广域名记录，且官方<strong>不提供免费试用</strong>。<strong>最适合偏好第三方客户端多协议折腾（尤其需要 Hysteria 2 / Reality）、有台湾节点或低频不限时包需求的进阶/常规用户以 ¥20 月付起步验证。</strong>

<BrandOverview slug="yifan" />

<AffiliateButton slug="yifan" source-section="hero" label="前往一翻云查看三协议与 8 档套餐" />

---

## 一、品牌背景与核心差异化亮点

在 2025 年同期涌现的新机场里，不少品牌选择“专属客户端封闭生态”来降低新手客服压力（例如灵猫网络在 2026-10 停供订阅，SOGO 云与闪跃仅限官方客户端）。<strong>一翻云（1fly）反其道而行之，选择纯第三方客户端友好的开放协议路线</strong>，在 20 元档月付市场形成了非常鲜明的产品组合：

1. <strong>三协议并行（Hysteria 2 + VLESS-Reality + Shadowsocks）</strong>：兼顾传统兼容与抗干扰/高丢包环境加速能力。
2. <strong>包含台湾节点</strong>：在不少入门与中端机场收缩至“港新日美”四地的当下，一翻云明确在主力节点中保留台湾节点。
3. <strong>周期齐全（年付小包 + 4 档月付 + 3 档永久不限时包）</strong>：总计 8 档清晰标价套餐，能覆盖从低频备用到 1.2TB/月重度下载的全谱系用户。
4. <strong>文档冲突与数据缺口如实披露</strong>：品牌上线时间为 2025 年（运营历史尚短），无免费试用，支付方式、退款条款与精确节点总数未在资料中写明，且存在 `1FLYYUN` vs `yfy6666` 与 `guangs` vs `wzjc` 两项源文档冲突。

---

## 二、全 8 档套餐精算、不限时盈亏账期与双优惠码（1FLYYUN vs yfy6666）核查

一翻云在 `data/plans.json` 中收录了完整的 <strong>8 档定价方案</strong>（1 档年付小包 + 4 档常规月付 + 3 档一次性不限时包）。下表把原价单 GB、升档边际成本与 `1FLYYUN` 9 折参考价一次性算清：

| 套餐名称 | 计费周期 | 标价 | 流量额度 | 折合月均 | 原价单 GB | 边际增量 / <code>1FLYYUN</code> 9 折参考 |
| --- | --- | --- | --- | --- | --- | --- |
| <strong>98¥·年付小包</strong> | 年付 | <strong>¥98 / 年</strong> | 60GB / 月 | <strong>¥8.17 / 月</strong> | ¥0.1362 / GB | 对比 ¥20 轻享版需 <strong>4.90 个月</strong>回本；若适用 9 折参考 ¥88.20/年（¥0.1225/GB） |
| <strong>轻享版</strong> | 月付 | <strong>¥20 / 月</strong> | 150GB / 月 | ¥20.00 / 月 | <strong>¥0.1333 / GB</strong> | 单 GB 竟然比年付小包更便宜！9 折参考 <strong>¥18.00/月（¥0.1200/GB）</strong> |
| <strong>舒享版</strong> | 月付 | <strong>¥35 / 月</strong> | 350GB / 月 | ¥35.00 / 月 | <strong>¥0.1000 / GB</strong> | +¥15 换 +200GB，边际低至 <strong>¥0.0750/GB</strong>；9 折参考 ¥31.50/月（¥0.0900/GB） |
| <strong>尊享版</strong> | 月付 | <strong>¥55 / 月</strong> | 600GB / 月 | ¥55.00 / 月 | <strong>¥0.0917 / GB</strong> | +¥20 换 +250GB，边际仅 <strong>¥0.0800/GB</strong>；9 折参考 ¥49.50/月（¥0.0825/GB） |
| <strong>极致版</strong> | 月付 | <strong>¥95 / 月</strong> | 1200GB (1.2TB) / 月 | ¥95.00 / 月 | <strong>¥0.0792 / GB</strong> | +¥40 换 +600GB，边际低至 <strong>¥0.0667/GB</strong>；9 折参考 ¥85.50/月（¥0.0713/GB） |
| <strong>轻享版·不限时包</strong> | 一次性付费 | <strong>¥100</strong> | 100GB 一次性 | 不适用 | ¥1.0000 / GB | 等价于 5 个月 ¥20 轻享版（750GB）或 1.02 年年付小包（735GB） |
| <strong>舒享版·不限时包</strong> | 一次性付费 | <strong>¥200</strong> | 250GB 一次性 | 不适用 | <strong>¥0.8000 / GB</strong> | 等价于 10 个月 ¥20 轻享版（1,500GB）或 2.04 年年付小包（1,469GB） |
| <strong>尊享版·不限时包</strong> | 一次性付费 | <strong>¥400</strong> | 500GB 一次性 | 不适用 | <strong>¥0.8000 / GB</strong> | <strong>无规模降价</strong>：单价停在 ¥0.8000/GB，等价 4.08 年年付小包（2,939GB） |

<PricingMatrix slug="yifan" />

<CouponInfo slug="yifan" />

### 1. 三类计费周期如何算账最划算？
- <strong>月付四档的平滑阶梯（罕见的高效率曲线）</strong>：不同于 U1S1（700GB 倒挂）与 SOGO 云（550GB 倒挂），一翻云的四档月付呈现出极度平滑的规模递减曲线——轻享版 `¥0.1333/GB`（已经低于自家年付小包 `¥0.1362/GB`）→ 舒享版 `¥0.1000/GB` → 尊享版 `¥0.0917/GB` → 极致版 `¥0.0792/GB`，每一档升档的边际流量单价都稳定在 `¥0.0667–¥0.0800/GB` 之间。在 20 元入门档，它也是目前同级唯一在 ¥20 给出 150GB 的开放三协议方案。
- <strong>永久不限时包的真实盈亏平衡点</strong>：
  - `轻享版·不限时包（¥100/100GB · ¥1.0000/GB）` 与 `98¥·年付小包（¥98/年 · 720GB/年）` 价格几乎一模一样，但年付一年给 720GB，不限时总计只有 100GB——只有当你<strong>全年总用量远低于 100GB（约每月 <8.3GB）</strong>且不想每年续费时，100GB 才成立。
  - `舒享版·不限时包（¥200/250GB）` 与 `尊享版·不限时包（¥400/500GB）` 的单 GB 成本完全相同，均为 <strong>¥0.8000/GB</strong>，不存在“买 500GB 更便宜”的批量优惠！按年付小包 `¥98/年` 折算，¥400 足够购买 4.08 年年付小包；因此 500GB 只有当你的月均消耗稳定在 <strong>10.2GB 以下（用足 4 年以上）</strong>才算回本，还要额外承担 2025 年新站跨多年度持续运营的资金沉淀风险（参见[年付/不限时/免费风险](/risks/billing-risks/)）。除非确有超低频双机备用刚需，否则优先买 `¥200/250GB` 即可，没必要一次性压 ¥400 在 `500GB`。

### 2. 双优惠码冲突（`1FLYYUN` vs `yfy6666`）与双域名说明
我们在 `32家机场品牌清单.txt` 中检测到两处优惠码记录：
- 正文介绍第 560 行明确写：<strong>“优惠码 <code>1FLYYUN</code> 可以再打 9 折”</strong>；
- 顶部基础数据第 529 行与文末第 936 行汇总表则写：<strong>`yfy6666`</strong>（未标注折扣比例）。
- <strong>算账影响</strong>：如果 `1FLYYUN` 9 折在轻享版（¥20）上生效，折后仅 <strong>¥18.00/月（150GB · ¥0.1200/GB）</strong>，直接在价格上追平 ¥18 档的极连云/光年梯且多出 40–50GB 流量；若用于舒享版（¥35）则折后 <strong>¥31.50/月（¥0.0900/GB）</strong>。结账时建议先填 `1FLYYUN`，若提示失效或限首单再试 `yfy6666`。此外，其推广域名在两份清单中分别出现 `guangs.1flyunaff.cc` 与 `wzjc.1flyunaff.cc` 两个子域前缀。

---

## 三、Hysteria 2 / VLESS-Reality / Shadowsocks 三协议与 IEPL 架构

<NetworkTopology slug="yifan" />

一翻云在网络层声明了 <strong>“全节点 IEPL 物理专线 + 原生住宅 IP + 单节点 2Gbps 大带宽”</strong>，并在传输协议上同时配置了三种特性迥异的协议：

1. <strong>Shadowsocks</strong>：经典轻量加密协议，几乎兼容所有老旧与现代软件，但在部分极端网络丢包环境下依赖底层专线质量；2026-08-11 截图测速正是基于 SS 完成。
2. <strong>VLESS-Reality</strong>：无需服务端配置传统域名前端证书的现代化抗探测协议，TLS 指纹伪装能力强，在复杂网络环境下抗干扰表现较好。
3. <strong>Hysteria 2</strong>：基于 QUIC/UDP 拥塞控制的现代高速协议，在运营商存在轻微跨境丢包或较高 RTT（如美区 180ms 链路）时，通过自研拥塞控制算法能显著提升单线程下载吞吐表现（前提是本地宽带未对 UDP 进行剧烈限速/QoS）。

<strong>工程实践建议</strong>：日常使用优先在 <strong>VLESS-Reality</strong> 与 <strong>Shadowsocks</strong> 之间切换；当本地宽带（如部分高校校园网或高延迟跨境时段）出现 TCP 单线程跑不动时，再尝试切换至 <strong>Hysteria 2</strong> 节点对比效果；若发现校园网/企业网封锁 UDP，则切回 VLESS-Reality 或 SS。

---

## 四、测速档案审视：为什么“08-11 凌晨截图”不能证明“晚高峰 0 丢包”？

<SpeedReport slug="yifan" />

一翻云同时持有 <strong>2026-08-11 PNG 截图</strong> 与 <strong>2026-10-19 文本测速</strong> 两份实测样本，但实验时间均需要仔细辨识：

### 1. 2026-08-11 00:21:30 CST 截图档案
- <strong>测试时刻</strong>：`2026-08-11T00:21:30+08:00`（北京时间凌晨 00:21）。
- <strong>测试环境</strong>：`MAI-TEST-BOT 2.0.0-dev`，珠海联通 5Gbps 后端，32 线程，Ping 5 次，协议显示为 <strong>Shadowsocks</strong>。
- <strong>关键区分</strong>：凌晨 00:21 已经过了 20:00–23:00 晚高峰主周期（`isPeakHours: false`），全网骨干负载大幅下降。因此，尽管原图可查且证明了节点群在深夜的可用性，但它<strong>不能用来直接背书官方“晚高峰 0 丢包”的宣称</strong>。

### 2. 2026-10-19 非晚高峰五地区文本记录
- <strong>香港</strong>：延迟 `23ms`，下载 `477Mbps`（低延迟高吞吐）。
- <strong>台湾</strong>：延迟 `40ms`，下载 `117Mbps`（相比港新略低，但台湾节点在同价位本就稀缺，117Mbps 足以应付 4K 流媒体）。
- <strong>新加坡</strong>：延迟 `42ms`，下载 `390Mbps`（带宽充足，延迟比香港仅高 19ms）。
- <strong>日本</strong>：延迟 `53ms`，下载 `136Mbps`（中规中矩）。
- <strong>美国</strong>：延迟 `180ms`，下载 `20Mbps`（美区延迟偏高且仅 20Mbps，适合账号登录与 AI 文本交互，不适合用美区节点挂大型下载）。

---

## 五、AI 工具与流媒体解锁评估

<AvailabilityMatrix slug="yifan" />

根据品牌方提供的解锁清单与原生住宅 IP 定位：
- <strong>标注支持</strong>：ChatGPT、Claude、Netflix、Disney+、YouTube、HBO Max、TikTok、Spotify。
- <strong>标注视节点而定</strong>：Gemini。

同样需要明确：<strong>当前解锁列表属于 `Vendor Data`（厂商自述），08-11 测速截图并未覆盖解锁探测，10-19 也仅记录了延迟与下载速度</strong>。由于一翻云提供原生住宅 IP 宣称且拥有台湾、日本、新加坡、美国节点，理论上对跨区流媒体与 TikTok 的覆盖面更宽，但实际是否每个地区都保持干净住宅 IP，仍需购入月付后在 [可用性对比矩阵](/ai-streaming/matrix/) 的思路下实测确认。

---

## 六、第三方客户端完全兼容与配置排障实战

<ClientCompatibility slug="yifan" />

一翻云属于纯正的 <strong>第三方订阅生态友好型（<code>third-party</code>）</strong> 机场，完全规避了[专属客户端生态锁定风险](/risks/exclusive-client-lockin/)。针对其 <strong>Hysteria 2 + VLESS-Reality + Shadowsocks</strong> 三协议特性，选对现代内核客户端非常关键（全列表可参阅[客户端兼容性总表](/clients/compatibility/)）：
- <strong>[Windows](/clients/windows/) / [macOS](/clients/macos/) / [Linux](/clients/linux/) 桌面端</strong>：强烈建议安装 [Clash Verge Rev](/clients/clash-verge-rev/)（基于 Mihomo 内核）或 [v2rayN](/clients/v2rayn/) / [FlClash](/clients/flclash/) / [Hiddify](/clients/hiddify/)（基于 [sing-box](/clients/sing-box/)），千万不要使用已停止维护的原版 Clash for Windows，否则无法识别 Hysteria 2 和 VLESS-Reality 节点导致节点列表残缺。
- <strong>[iOS](/clients/ios/) / iPadOS</strong>：推荐 [Shadowrocket (小火箭)](/clients/shadowrocket/) 或 [Stash](/clients/stash/)（请确保 App 更新至支持 Hysteria 2 与 Reality 的近期版本）。
- <strong>[Android](/clients/android/) / [OpenWrt 软路由](/clients/openwrt/)</strong>：移动端推荐 [v2rayNG](/clients/v2rayng/) / [FlClash](/clients/flclash/)，软路由端推荐 [OpenClash](/clients/openclash/)（Meta 内核）或 [PassWall2](/clients/passwall2/)。

### 分流规则与常见故障排查直达
1. <strong>导入订阅与分流设置</strong>：具体导入操作参照[订阅导入与客户端配置](/guides/subscription/)；三协议节点混合时，建议按[Clash 分流规则教程](/guides/clash-rules/)建立“Hysteria 2 备用组（高丢包/跨洋用）”与“VLESS-Reality 日常组（低能耗稳定）”，并将 ChatGPT / Claude 指向新加坡、日本或美国节点。
2. <strong>三大高频故障自救入口</strong>：
   - <strong>订阅拉取空白或报错</strong>：对照[订阅失败与更新报错排查](/troubleshooting/subscription-failed/)检查旧版客户端不兼容 Hy2/Reality 语法或 `guangs` / `wzjc` 域名解析异常；
   - <strong>Hysteria 2 在校园网/公司网断流</strong>：因部分网络 QoS 限速或阻断 UDP，请按[节点超时与不可用排查](/troubleshooting/node-timeout/)切换回 VLESS-Reality 或 Shadowsocks 节点；
   - <strong>桌面 AI App 或本地内网异常</strong>：参考[TUN 模式与 DNS 污染排查](/troubleshooting/tun-dns-error/)及[TUN 与 DNS 分流教程](/guides/tun-dns/)排查 Fake-IP 与内网路由冲突。

---

## 七、原始证据归档

<EvidencePanel slug="yifan" />

证据面板完整留存了 `一翻云-节点测速实测.png` 原图、2026-10-19 文本测速记录及优惠码/域名冲突轨迹。未披露字段（支付方式、退款细则、精确节点总数）均保留 `待核实`。

---

## 八、适合与不适合人群

### 适合人群
- <strong>需要 Hysteria 2 / VLESS-Reality 多协议、习惯自己掌控第三方客户端规则的技术或进阶用户</strong>。
- <strong>需要台湾节点</strong>（台区 Netflix / 动画疯 / 繁中业务）且预算在 ¥20–¥35/月 的用户。
- <strong>不限设备多端共用、或希望以 ¥100–¥200 购买永久不限时包作长期应急备用</strong>的用户。

### 不适合人群
- <strong>必须先有免费试用（哪怕几百 MB 或 1 天体验）才愿意付款的用户</strong>（一翻云官方明确无免费试用）。
- <strong>不愿安装第三方客户端、只想要官方一键安装包的纯小白</strong>（更适合看提供自研客户端的 [极连云](/reviews/jilian/)、[光速云](/reviews/guangsuyun/) 或 [飞猫云](/reviews/feimao/)）。
- <strong>需要晚高峰截图明确背书后才下单的极度谨慎型用户</strong>。

---

## 九、同价位竞品横向比较与对比直达

把一翻云放到 ¥8–¥25/月 和 2025 年新站群体中对比，位置非常清晰：

1. <strong>对比 [U1S1](/reviews/u1s1/)</strong>：两者均走 IPLC/IEPL、均不限设备、年付门槛几乎相同（¥98 vs ¥96）。一翻云胜在 <strong>¥20 月付多 30GB 流量（150GB vs 120GB）</strong>、<strong>三协议开放</strong>以及<strong>明确提供 3 档不限时包</strong>；U1S1 胜在拥有 <strong>22:33 晚高峰实测截图</strong>（一翻云仅凌晨 00:21 截图）和最高 1500GB 月付上限。
2. <strong>对比 [SOGO 云](/reviews/sogo/)</strong>：SOGO 云年付同样 ¥98/60GB 且提供不限时包（¥0.85–¥1.00/GB，整体略贵于一翻云 ¥0.80/GB），但月付基础版贵 ¥5（¥25/150GB）且<strong>强制仅限自研专属客户端</strong>，SOGO 云的优势是覆盖 15 个国家地区；一翻云优势在于开放第三方客户端与 Hysteria 2 / Reality。
3. <strong>对比 [极连云](/reviews/jilian/) / [光年梯](/reviews/guangnian/)</strong>：只加 ¥2/月（¥18 升至 ¥20），流量从 100–110GB 跳升至 150GB，且拿到台湾节点与三协议支持（若 `1FLYYUN` 9 折生效更是同价 ¥18）。

### 同档位横向对比直达

- <strong>[一次性不限时（永久）流量包横向对比](/compare/non-expiring-plans/)</strong>：横向对比一翻云 `¥200/250GB`（`¥0.80/GB`）与 SOGO 云、光速云 147 永久包、星岛梦、唯兔云的单位成本与跑路风险。
- <strong>[客户端兼容性横向对比](/compare/client-compatibility/)</strong>：查看一翻云 Hy2 + VLESS-Reality + SS 三协议全开放生态 vs 仅限专属客户端品牌的自由度差距。
- <strong>[机场月付 vs 年付回本账期对比](/compare/monthly-vs-annual/)</strong>：用一翻云“轻享月付 ¥0.1333/GB 竟然比年付小包 ¥0.1362/GB 更划算”的反直觉案例理解周期选型。
- <strong>[IEPL 与 IPLC 专线横向对比](/compare/iepl-vs-iplc/)</strong>：对比一翻云全节点 IEPL 物理专线与 U1S1、闪跃 IPLC 专线在晚高峰丢包下的抗压逻辑。
- <strong>[平价与高性价比机场横向对比](/compare/budget-airports/)</strong>：核对一翻云 ¥98 年付（¥8.17/月）与 ¥20/150GB 轻享版在平价高性价比榜单中的位置。
- <strong>[光速云 vs 暮光加速横向对比](/compare/guangsuyun-vs-muguang/)</strong>：对比老牌旗舰与中端主流品牌在实测证据完整度上的标尺。

---

## 十、购前避坑与实用检查清单

1. <strong>由于无免费试用，务必从 ¥20 轻享版起步</strong>：哪怕目标是 ¥98 年付或 ¥200 不限时包，2025 年新品牌且缺少晚高峰实测图，一定要先付一个月 ¥20（尝试 `1FLYYUN` 9 折）自测本地晚高峰与常用平台解锁。
2. <strong>注意 UDP 限速网络下的协议选择</strong>：若在公司内网或校园网下发现 Hysteria 2 断流或无法连接，请在客户端内手动切换至 VLESS-Reality 或 Shadowsocks 节点组。
3. <strong>保存官方防失联页</strong>：因为记录过 `guangs` 和 `wzjc` 两个推广前缀，请保存面板内的官方发布页域名。

<AffiliateButton slug="yifan" source-section="footer" label="前往一翻云官网注册（建议轻享月付试水）" />

<RelatedBrand slug="yifan" :related-slugs="['u1s1', 'sogo', 'jilian', 'guangnian']" />

---

## 常见问题（FAQ）

### Q1：一翻云支持哪些代理协议？适合用什么客户端？

一翻云同时提供 Hysteria 2、VLESS-Reality 与 Shadowsocks 三种主流协议，不强制使用专属客户端，对第三方客户端极其友好。推荐使用 Clash Verge Rev（Mihomo 内核）、v2rayN / v2rayNG、Shadowrocket、Stash 或 sing-box / FlClash 等支持 Hysteria 2 与 Reality 的现代客户端。

### Q2：一翻云的优惠码是 1FLYYUN 还是 yfy6666？

源文档存在两处不同记录：品牌正文介绍明确写出“优惠码 1FLYYUN 可以再打 9 折”，而基础数据摘要行与文末汇总表列出 yfy6666。若 9 折码 1FLYYUN 在月付轻享版（¥20）生效，折后为 ¥18.00/月（150GB，折 ¥0.1200/GB）。建议下单结账页优先测试 1FLYYUN，若无效再试 yfy6666。

### Q3：一翻云有不限时流量包吗？和月付哪个更划算？

有。一翻云在 data/plans.json 收录三档永久不过期的不限时包：轻享版 ¥100（100GB，¥1.0000/GB）、舒享版 ¥200（250GB，¥0.8000/GB）和尊享版 ¥400（500GB，¥0.8000/GB）。按单 GB 价格看，月付轻享版（¥20/150GB，¥0.1333/GB）和年付小包（¥98/年 每月 60GB，¥0.1362/GB）便宜得多；其中 250GB 与 500GB 两档不限时单价均停在 ¥0.8000/GB（无进一步规模降价），仅适合月均消耗低于 10.2GB 的超低频应急备用需求。

### Q4：一翻云宣传“晚高峰 0 丢包”，现有测速截图能证明吗？

需要客观区分：一翻云虽保有 2026-08-11 的原始 PNG 测速截图，但该图实际测试时间为凌晨 00:21:30 CST（非晚高峰），而 2026-10-19 的五地区文本数据也明确标注为非晚高峰。因此“晚高峰 0 丢包”目前仅属于品牌方单方面声明，尚未在本站归档到 20:00–23:00 晚高峰独立截图背书，且官方无免费试用，建议先购 ¥20 轻享月付自行实测。

### Q5：一翻云限制设备数量吗？包含台湾节点吗？

不限速也不限设备同时在线数量。地区覆盖包括香港、台湾、新加坡、日本、美国五地，其中台湾节点在 2026-10-19 非晚高峰记录中测得 40ms 延迟与 117Mbps 下载速率。
