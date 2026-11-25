---
title: 灵猫网络（LingMao）深度测评：不限设备专属客户端转型与三项数据冲突审计
seoTitle: 灵猫网络机场测评 (2026) - ¥85 年付小包、专属客户端变化与优惠码冲突核查
description: 灵猫网络深度测评：2025 年运营中转优化机场，不限速不限设备，2026 年 10 月起改用专属客户端（停供订阅链接）。含 6 档套餐单 GB 与 ¥19/¥25 价格冲突精算、08-11 测速截图及排障指南。
canonical: /reviews/lingmao/
schemaType: Article
brandSlug: lingmao
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: 2026-11-24
updatedDate: 2026-11-25
verifiedDate: 2026-11-24
dataStatus: Conflicting
sourceNote: 拥有 2026-08-11 18:45 CST 实测图与 2026-10-19 文本数据，但源文档存在双优惠码（lingmao vs lmao888）、双域名（civetnet vs civetaff）及月付价格（¥19 vs ¥25）冲突，且 2026-10 起停供第三方订阅。
faq:
  - question: 灵猫网络支持 Clash 或 Shadowrocket 导入订阅链接吗？
    answer: 不支持。根据品牌基础信息与 2026 年 10 月政策说明，灵猫网络已改为“专属客户端下载登录即用，不提供订阅链接”。尽管 2026-08-11 历史截图曾以 Shadowsocks 测速，但目前购买后无法直接用于 Clash Verge Rev、Shadowrocket 或 OpenWrt 软路由订阅导入。
  - question: 灵猫网络的月付 Small 套餐到底是 19 元还是 25 元？
    answer: 源文档存在口径冲突：基础数据摘要行写“19元/月 150GB/月”（折 ¥0.1267/GB），而同节正式套餐明细表标明“灵猫·月付Small”为 ¥25/月（150GB/月，折 ¥0.1667/GB）。本站以正式套餐表 ¥25/月 为主值并在前端标注该冲突；若 8 折优惠码 lingmao 生效，¥25 折后为 ¥20/月（折 ¥0.1333/GB），实际结算请以官网面板为准。
  - question: 灵猫网络的优惠码应该填 lingmao 还是 lmao888？
    answer: 两份信息位置记录了不同代码：基础信息行给出优惠码 lingmao（明确标注 8 折，年付小包不适用），而顶部基础数据摘要与汇总表记录了 lmao888。建议下单时优先尝试 lingmao 核验是否有 8 折减免，若无效再测试 lmao888。
  - question: 灵猫网络使用的是 IEPL 专线吗？限制设备数量吗？
    answer: 品牌资料标注灵猫网络走“中转优化线路”，并未宣称使用 IEPL 或 IPLC 物理专线；但其核心卖点是“1 倍流量、不限速、不限设备数量”，适合多台设备同时在线使用。
  - question: 灵猫网络的测速数据是什么时候测的？
    answer: 目前留存两批样本：一是 2026-08-11 18:45:40 CST 的原始 PNG 测速截图（傍晚时段，尚未进入 20:00–23:00 核心晚高峰）；二是 2026-10-19 的非晚高峰五地区文本测速记录（香港 22ms/492Mbps、新加坡 46ms/409Mbps）。
---

# 灵猫网络（LingMao）深度测评：不限设备专属客户端转型与三项数据冲突审计

> <strong>核心结论（Answer-First）</strong>：灵猫网络（LingMao）是一家 <strong>2025 年上线的中转优化线路机场</strong>，核心卖点为 <strong>1 倍流量倍率、不限速、不限设备数量</strong>，入门门槛为 <strong>¥85/年年付小包（折合 ¥7.08/月，45GB/月）</strong>。但在选型之前，用户必须先了解它的两项关键变化与三处源文档冲突：第一，自 <strong>2026 年 10 月起，灵猫网络已切换为官方专属客户端登录即用，不再提供第三方订阅链接</strong>，这意味着 Clash / Shadowrocket / 软路由用户无法直接接入；第二，源文档内存在<strong>双优惠码（<code>lingmao</code> vs <code>lmao888</code>）、双主域名（<code>civetnet.com</code> vs <code>civetaff.com</code>）与月付价格差异（摘要 ¥19 vs 套餐表 ¥25）</strong>，因此本站将其数据状态诚实标记为 <code>Conflicting</code>（存在数据冲突）。<strong>它适合不依赖第三方客户端、家里多台设备共享且预算偏入门的家庭或轻中度用户（建议先购月付核实实时面板价）；不适合离不开 Clash 自定义分流或要求 IEPL 专线的技术向用户。</strong>

<BrandOverview slug="lingmao" />

<AffiliateButton slug="lingmao" source-section="hero" label="前往灵猫网络核验最新面板与客户端" />

---

## 一、为什么灵猫网络的数据状态是 `Conflicting`？

在 31 家收录品牌中，灵猫网络属于测试证据较丰富（既有 08-11 截图，又有 10-19 五地区数据），但同时<strong>文档内部自我冲突最集中的品牌之一</strong>。为了避免误导读者，我们在审校 `32家机场品牌清单.txt` 和 `24个站点的aff替换前缀.txt` 后，将全部三处冲突逐条公开：

1. <strong>月付 Small 套餐价格口径冲突（<code>entryMonthlyCny</code>）</strong>
   - 品牌基础数据摘要行（第 445 行）写为：`19元/月 150GB/月`。
   - 同一节下方的正式套餐表（第 462 行）则写明：`灵猫·月付Small | 月付 | ¥25 | 150GB | 每月`。
   - 介绍文本开头又提到“7.1 元/月起”，实际对应的是 `¥85/年 ÷ 12 ≈ ¥7.08/月` 的年付小包均价。
   - <strong>本站处理</strong>：以结构化套餐明细表 `¥25/月` 作为主价格入库（同时注意到如果适用 8 折优惠码 `lingmao`，¥25 的 8 折恰好为 ¥20/月，接近 19 元口径），但在图表与正文均保留冲突标注。
2. <strong>优惠码冲突（<code>couponCode</code>）</strong>
   - 第 449 行给出 `lingmao`，明确注明“8 折（年付小包不适用）”。
   - 第 445 行与文末第 933 行汇总表却列出 `lmao888`。
   - 两个优惠码可能是不同推广渠道或前后活动批次的残留记录，结账时建议实测对比。
3. <strong>主域名完全不同（<code>affiliateUrl</code>）</strong>
   - 主清单使用 `vip01.civetnet.com`，而 24 站点前缀替换表给出了完全不同的根域名 `vip02.civetaff.com`。这提示品牌方存在独立推广分流域或域名切换史，点击后请确认账户数据与官网公告一致性。

---

## 二、2026 年 10 月客户端政策转型：告别第三方订阅

灵猫网络产品形态上最重大的变化发生在 <strong>2026 年 10 月</strong>：根据品牌介绍与基础信息记录，自该月起灵猫开始<strong>全面改用官方专属客户端，下载登录即用，不再提供订阅链接</strong>。

<ClientCompatibility slug="lingmao" />

### 这项转型意味着什么？与常见排障提示
- <strong>对普通新手是降低门槛</strong>：不需要再理解什么是 YAML 配置文件、什么是 [Clash 分流规则](/guides/clash-rules/)，也不需要复制粘贴长达一串的订阅 URL 或反复处理[订阅拉取失败报错](/troubleshooting/subscription-failed/)。下载官方客户端、输入账号密码即可连接，在多台手机、电脑上登录同一账号也能享受“不限设备”的便利。
- <strong>对进阶用户与软路由用户是硬伤（[专属客户端锁定风险](/risks/exclusive-client-lockin/)）</strong>：
  - 无法导入 [Clash Verge Rev](/clients/clash-verge-rev/)、[Shadowrocket](/clients/shadowrocket/)、[v2rayN](/clients/v2rayn/)、[v2rayNG](/clients/v2rayng/) 或 [sing-box](/clients/sing-box/)（详见[客户端兼容性总表](/clients/compatibility/)）；
  - 无法在 [OpenWrt 软路由](/clients/openwrt/) 的 [OpenClash](/clients/openclash/) 或 [PassWall2](/clients/passwall2/) 上部署全屋透明代理；
  - 无法与你手头的其他备用机场合并在一个客户端里做故障自动切换（Failover）。
- <strong>专属客户端下的故障排查思路</strong>：虽然不用再管订阅导入失败，但若在官方客户端中遇到个别节点连不上或延迟突增，仍需参考[节点超时与不可用排查](/troubleshooting/node-timeout/)在客户端内手动切区测速；若电脑端开启官方客户端增强/TUN 接管模式后出现国内网站打不开或公司内网异常，可参照[TUN 模式与 DNS 污染排查](/troubleshooting/tun-dns-error/)检查网卡路由与本地 DNS 设置。
- <strong>关于 08-11 截图的历史背景</strong>：在 2026-08-11 的测速截图中，灵猫网络仍显示以 `Shadowsocks` 协议接受测速，说明其底层当时仍兼容标准协议拉取；10 月起停供订阅链接，本质上是客户端入口的封闭化管理（类似同期的 [SOGO 云](/reviews/sogo/)、[闪跃](/reviews/shanyue/) 与 [飞猫云](/reviews/feimao/)）。

---

## 三、全 6 档套餐精算、多周期与 ¥19/¥25 冲突精算

灵猫网络在 `data/plans.json` 中共提供 <strong>6 档周期套餐</strong>（3 档年付 + 1 档季付 + 2 档月付），<strong>不提供一次性不限时流量包</strong>。全部套餐均标注 <strong>1 倍流量计算、不限速、不限设备</strong>。

| 套餐名称 | 计费周期 | 套餐表标价 | 月流量 | 折合月均 | 单 GB 成本（原价） | 8 折码 <code>lingmao</code> / 冲突参考口径 |
| --- | --- | --- | --- | --- | --- | --- |
| <strong>灵猫·年付小包</strong> | 年付 | <strong>¥85 / 年</strong> | 45GB / 月 | <strong>¥7.08 / 月</strong> | <strong>¥0.1573 / GB</strong> | <strong>明确不适用 <code>lingmao</code> 8 折</strong>（月流量仅 45GB） |
| <strong>灵猫·月付Small</strong> | 月付 | <strong>¥25 / 月</strong> | 150GB / 月 | ¥25.00 / 月 | ¥0.1667 / GB | 8 折参考 <strong>¥20.00/月（¥0.1333/GB）</strong>；摘要曾写 ¥19/月（¥0.1267/GB） |
| <strong>灵猫·月付Big</strong> | 月付 | <strong>¥45 / 月</strong> | 300GB / 月 | ¥45.00 / 月 | ¥0.1500 / GB | 8 折参考 <strong>¥36.00/月（¥0.1200/GB）</strong>；边际升档 +¥20 换 +150GB（¥0.1333/GB） |
| <strong>灵猫·季付Big</strong> | 季付 | <strong>¥125 / 季</strong> | 300GB / 月 | ¥41.67 / 月 | ¥0.1389 / GB | 比月付 Big 原价仅省 7.41%，且若月付 Big 可打 8 折到 ¥36，季付反而更贵 |
| <strong>灵猫·年付Small</strong> | 年付 | <strong>¥195 / 年</strong> | 150GB / 月 | <strong>¥16.25 / 月</strong> | <strong>¥0.1083 / GB</strong> | 比月付 Small 原价回本需 <strong>7.80 个月</strong>（vs 8 折 ¥20 需 9.75 个月） |
| <strong>灵猫·年付Big</strong> | 年付 | <strong>¥295 / 年</strong> | 300GB / 月 | <strong>¥24.58 / 月</strong> | <strong>¥0.0819 / GB</strong> | 全系单 GB 最低；比月付 Big 原价回本需 <strong>6.56 个月</strong>（vs 季付需 7.08 个月） |

<PricingMatrix slug="lingmao" />

<CouponInfo slug="lingmao" />

### 多周期与价格冲突算账要点
1. <strong>年付小包的“低月均、高单价”陷阱</strong>：虽然 ¥85/年折合 ¥7.08/月把绝对现金门槛拉到全站入门档，但因月配额只有 45GB，其单 GB 成本高达 <strong>¥0.1573/GB</strong>，不仅比同档位 ¥96–¥98/年（60GB/月，单 GB ¥0.1333–¥0.1362）的 [U1S1](/reviews/u1s1/)、[一翻云](/reviews/yifan/)、[闪跃](/reviews/shanyue/) 每月少 15GB，单价还反贵约 16%–18%。
2. <strong>月付 Small 的三重算账口径（¥25 vs ¥20 vs ¥19）</strong>：按 `plans.json` 正式表价 ¥25/150GB，单 GB 为 `¥0.1667/GB`（与 [SOGO 云](/reviews/sogo/)、[可信云](/reviews/kexin/)、[速界](/reviews/sujie/) 持平）；若官网已按旧摘要调为 ¥19/150GB，单 GB 降至 `¥0.1267/GB`；若表价仍为 ¥25 但 `lingmao` 8 折码对月付生效，实付 `¥20.00/月`（`¥0.1333/GB`）。下单前务必在结算页核实最终实付。
3. <strong>季付 Big 性价比尴尬，年付需先试用再锁仓</strong>：季付 Big（¥125/季 · ¥41.67/月）相比月付 Big（¥45/月）仅打约 9.26 折（省 ¥3.33/月），万一 `lingmao` 8 折（¥36/月）适用于月付，季付 Big 反而会出现明显倒挂。至于年付 Big（¥295/年 · ¥0.0819/GB），虽然账面单价极具诱惑力，但考虑到灵猫网络仅在 2025 年上线且刚经历客户端形态转型，<strong>强烈反对新用户上来直接购买年付 Small/Big</strong>，务必先买 1 个月月付 Small 实测。

---

## 四、中转优化线路架构与节点分布

<NetworkTopology slug="lingmao" />

与前文评测的 U1S1、极连云、光年梯不同，灵猫网络在品牌资料中<strong>并未宣称自己是 IEPL 或 IPLC 物理专线</strong>，而是明确标注为 <strong>中转优化线路</strong>，落地覆盖 <strong>香港、台湾、新加坡、日本、美国</strong> 五大常规区域。

### 中转优化 vs 专线架构的客观区别
- <strong>成本优势</strong>：国内 BGP/CDN 入口中转海外落地服务器的运营成本低于纯 IEPL/IPLC 物理专线，这也是灵猫能够给出“不限设备数量 + 1 倍流量 + 较低年付价格（¥85–¥295/年）”的重要商业前提。
- <strong>晚高峰不确定性</strong>：中转线路跨境段往往依赖运营商优化路由或高防中转机房，在平时段速率可以很快，但一旦遇到跨境骨干网大规模波动或敏感时期，抗抖动能力通常不如冗余充足的高配 IEPL 专线（详见 [IEPL 与 IPLC 专线对比](/compare/iepl-vs-iplc/)）。目前灵猫网络<strong>尚缺 20:00–23:00 核心晚高峰时段的测速截图</strong>，这一点需要用户自行通过月付验证。

---

## 五、测速表现分析：18:45 傍晚截图与 10-19 文本样本

<SpeedReport slug="lingmao" />

灵猫网络的两批测速记录均需结合测试时刻来看待：

### 1. 2026-08-11 18:45 CST 原始 PNG 截图
- <strong>测试时间</strong>：`2026-08-11T18:45:40+08:00`（傍晚 18:45，早于传统 20:00–23:00 晚高峰，因此 `isPeakHours` 标记为未明示）。
- <strong>测试环境</strong>：`MAI-TEST-BOT 2.0.0-dev`，珠海联通 5Gbps 后端，32 线程并发，Ping 5 次，截图协议显示为 <strong>Shadowsocks</strong>。
- <strong>定位作用</strong>：证明在 2026 年 8 月中旬的傍晚节点集群正常在线且具备实测吞吐，原图留存于第七节证据面板供查验。

### 2. 2026-10-19 非晚高峰五地区文本数据
在 2026-10-19 的非晚高峰文本样本中，灵猫网络的五地参考表现如下：
- <strong>香港</strong>：`22ms` / `492Mbps`（延迟极低，接近 500Mbps 的下载速率在非晚高峰中转线路里属于第一梯队）。
- <strong>台湾</strong>：`40ms` / `109Mbps`（中规中矩，适合日常台湾流媒体或网站访问）。
- <strong>新加坡</strong>：`46ms` / `409Mbps`（与香港同为高带宽主力区域，409Mbps 表现优异）。
- <strong>日本</strong>：`57ms` / `147Mbps`（延迟与速度均衡）。
- <strong>美国</strong>：`164ms` / `19Mbps`（164ms 延迟与 19Mbps 速率均偏慢，只适合 AI 接口或低带宽网页访问，不适合高码率视频或下载）。

<strong>审慎解读</strong>：上述 10-19 文本数据没有标注运营商环境与并发线程，且明确是<strong>非晚高峰</strong>结果。对于中转线路而言，非晚高峰能跑出 400–490Mbps 很常见，真正考验品质的是晚上 21:00 左右电信/移动/联通各自的表现。

---

## 六、AI 工具与流媒体解锁评估

<AvailabilityMatrix slug="lingmao" />

品牌资料中，灵猫网络对主流生态的支持表态如下：
- <strong>厂商标注支持</strong>：ChatGPT、Claude、Netflix、Disney+、YouTube、HBO Max、TikTok、Spotify。
- <strong>厂商标注视节点而定</strong>：Gemini。

<strong>实测局限与使用提示</strong>：以上结论目前均属于 <strong>Vendor Data（品牌方自述）</strong>，并未通过 2026-08-11 测速图或其他独立流媒体检测脚本交叉验证。品牌介绍页也客观提醒“具体解锁效果和线路参数会因账号和时段有差异”。如果某节点遇到 ChatGPT 降智或 Netflix 仅显示自制剧，需要在官方专属客户端内切换同地区或邻近地区其他节点测试。

---

## 七、原始证据归档与数据源核查

<EvidencePanel slug="lingmao" />

通过证据面板可以清晰回溯灵猫网络的每条信息来源：
- `灵猫网络-节点测速实测.png`（2026-08-11 18:45:40 CST）保持原图展示，未添加水印或做人工读数插值。
- 2026 年 10 月转向专属客户端、双优惠码与双域名冲突均源于 `32家机场品牌清单.txt` 与 `24个站点的aff替换前缀.txt` 的交叉比对。
- 支付方式（是否支持支付宝/微信/USDT）、退款政策与精确节点数目前在源文档中留空，保持“待核实”。

---

## 八、适合与不适合人群

### 适合人群
- <strong>家庭或个人多终端共享需求</strong>：不限设备同时在线 + 1 倍流量计费，手机、平板、笔记本全登也不用担心踢下线。
- <strong>不喜欢折腾第三方订阅的入门用户</strong>：官方专属客户端登录即用，免去导入 YAML 规则和排查订阅更新失败的麻烦。
- <strong>预算在 ¥20–¥45/月（或 ¥85/年极简备用）</strong>、能接受中转优化线路的用户。

### 不适合人群
- <strong>第三方客户端与软路由重度用户</strong>：2026-10 起停供订阅链接，Clash Verge Rev、Shadowrocket、OpenWrt 玩家完全无法使用。
- <strong>需要严格晚高峰实测截图或纯 IEPL 专线保障</strong>的办公/生产环境用户（如远程会议、稳定高频代码终端拉取）。
- <strong>需要不限时一次性流量包</strong>的低频弹性用户（灵猫没有不限时包，可改看 [一翻云](/reviews/yifan/) 或 [SOGO 云](/reviews/sogo/)）。

---

## 九、与同类“专属客户端 / 多设备”品牌对比与直达入口

在同价位阵营里，灵猫网络最常被拿来和 [SOGO 云](/reviews/sogo/)、[闪跃](/reviews/shanyue/)、[飞猫云](/reviews/feimao/) 以及支持订阅的 [U1S1](/reviews/u1s1/) 对比：

- <strong>对比 [SOGO 云](/reviews/sogo/)</strong>：两者均走<strong>仅限专属客户端</strong>模式、均不限设备且月付基础版同为 ¥25/月 150GB。但 SOGO 云标注全线 IEPL 专线 + 15 个国家地区覆盖 + 提供 4 档不限时包；灵猫则是中转优化线路 + 5 大地区 + 无不限时包，优势在于年付小包名义价更低（¥85 vs ¥98，但月流量少 15GB）且可能有 8 折码 `lingmao`（对比 SOGO 9 折码）。
- <strong>对比 [闪跃](/reviews/shanyue/)</strong>：两者同样是<strong>仅限专属客户端</strong>且月付均提供 8 折优惠码（灵猫 ¥25 折后 ¥20 vs 闪跃 ¥24 折后 ¥19.2）。闪跃定位纯 IPLC 专线且月付同为 150GB 起，但缺乏 08-11 第三方实测 PNG 截图；灵猫拥有 08-11 截图但线路为中转优化。
- <strong>对比 [飞猫云](/reviews/feimao/)</strong>：飞猫云同样仅限专属客户端，学生版 ¥84/年（50GB/月，单 GB ¥0.1400）反而比灵猫 ¥85/年（45GB/月，单 GB ¥0.1573）多出 5GB 且便宜 ¥1。
- <strong>对比 [U1S1](/reviews/u1s1/)</strong>：若你必须用第三方订阅且要晚高峰截图，U1S1（22:33 晚高峰截图 + IPLC + ¥20 月付 120GB）更契合。

### 同档位横向对比直达

- <strong>[光速云 vs 飞猫云横向对比](/compare/guangsuyun-vs-feimao/)</strong>：同为面向纯新手的专属客户端入门阵营，看清专属客户端与支持第三方订阅的长期使用差异。
- <strong>[客户端兼容性横向对比](/compare/client-compatibility/)</strong>：一键比对灵猫、SOGO 云、闪跃、飞猫云等 `exclusive-only` 品牌与开放订阅品牌的设备生态边界。
- <strong>[平价与高性价比机场横向对比](/compare/budget-airports/)</strong>：对比灵猫 ¥85/年（45GB）与飞猫云 ¥84/年（50GB）、U1S1 ¥96/年（60GB）在入门档的真实性价比。
- <strong>[机场月付 vs 年付回本账期对比](/compare/monthly-vs-annual/)</strong>：对照灵猫年付 Small 7.80 个月与年付 Big 6.56 个月回本线，评估新站跨年锁仓风险。
- <strong>[IEPL 与 IPLC 专线横向对比](/compare/iepl-vs-iplc/)</strong>：厘清灵猫“中转优化线路”与同价位 IEPL/IPLC 专线品牌的架构差异。

---

## 十、风险提示与购前核查清单

1. <strong>三项冲突先自检</strong>：进入官网后第一时间确认三件事——月付 Small 实时定价（¥25 还是有活动 ¥19）、`lingmao` 与 `lmao888` 哪个优惠码生效、以及官网最新官方下载域名是否与当前入口一致。
2. <strong>确认设备平台全覆盖</strong>：因为没有通用订阅链接，购买前务必检查自己需要使用的 Windows / macOS / iOS / Android 是否均能顺利下载并登录灵猫官方客户端（尤其 iOS 国区与海外 Apple ID 获取问题）。
3. <strong>坚持先月付后年付</strong>：2025 年新品牌叠加中转优化架构与 2026-10 客户端调整，不要因为年付 Big（¥295/年 300GB）单价便宜而直接锁仓一年。

<AffiliateButton slug="lingmao" source-section="footer" label="前往灵猫网络官网核对客户端与最新价格" />

<RelatedBrand slug="lingmao" :related-slugs="['sogo', 'shanyue', 'u1s1', 'feimao']" />

---

## 常见问题（FAQ）

### Q1：灵猫网络支持 Clash 或 Shadowrocket 导入订阅链接吗？

不支持。根据品牌基础信息与 2026 年 10 月政策说明，灵猫网络已改为“专属客户端下载登录即用，不提供订阅链接”。尽管 2026-08-11 历史截图曾以 Shadowsocks 测速，但目前购买后无法直接用于 Clash Verge Rev、Shadowrocket 或 OpenWrt 软路由订阅导入。

### Q2：灵猫网络的月付 Small 套餐到底是 19 元还是 25 元？

源文档存在口径冲突：基础数据摘要行写“19元/月 150GB/月”（折 ¥0.1267/GB），而同节正式套餐明细表标明“灵猫·月付Small”为 ¥25/月（150GB/月，折 ¥0.1667/GB）。本站以正式套餐表 ¥25/月 为主值并在前端标注该冲突；若 8 折优惠码 lingmao 生效，¥25 折后为 ¥20/月（折 ¥0.1333/GB），实际结算请以官网面板为准。

### Q3：灵猫网络的优惠码应该填 lingmao 还是 lmao888？

两份信息位置记录了不同代码：基础信息行给出优惠码 lingmao（明确标注 8 折，年付小包不适用），而顶部基础数据摘要与汇总表记录了 lmao888。建议下单时优先尝试 lingmao 核验是否有 8 折减免，若无效再测试 lmao888。

### Q4：灵猫网络使用的是 IEPL 专线吗？限制设备数量吗？

品牌资料标注灵猫网络走“中转优化线路”，并未宣称使用 IEPL 或 IPLC 物理专线；但其核心卖点是“1 倍流量、不限速、不限设备数量”，适合多台设备同时在线使用。

### Q5：灵猫网络的测速数据是什么时候测的？

目前留存两批样本：一是 2026-08-11 18:45:40 CST 的原始 PNG 测速截图（傍晚时段，尚未进入 20:00–23:00 核心晚高峰）；二是 2026-10-19 的非晚高峰五地区文本测速记录（香港 22ms/492Mbps、新加坡 46ms/409Mbps）。
