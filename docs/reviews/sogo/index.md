---
title: SOGO 云深度测评：15 国地区覆盖、专属客户端锁区与 SOGO10000 优惠码冲突核查
seoTitle: SOGO 云机场测评 (2026) - 15 国家地区 IEPL 专线、仅自研客户端与 9 折优惠分析
description: SOGO 云深度测评：2026 年海外团队运营新站，全线 IEPL + 三网 BGP 优化，节点覆盖 15 个国家和地区，提供 9 档套餐含不限时包；详析 9 档单 GB 倒挂精算、不提供订阅链接限制与排障指南。
canonical: /reviews/sogo/
schemaType: Article
brandSlug: sogo
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: 2026-11-24
updatedDate: 2026-11-25
verifiedDate: 2026-11-24
dataStatus: Measured
sourceNote: 综合品牌清单、24站点aff前缀表、2026-08-11 18:57:59 CST 实测截图与 2026-10-19 非晚高峰 5 地区文本记录；存在 SOGO10000 vs sss777、VLESS vs SS 及 guangs vs wzjc 三处冲突，且不提供第三方订阅。
faq:
  - question: SOGO 云支持 Clash 或 Shadowrocket（小火箭）导入订阅吗？
    answer: 不支持。SOGO 云正文信息明确说明“不提供订阅链接，只能通过自研客户端使用，Clash、Shadowrocket 这类第三方客户端用不了”。其自研客户端支持 Windows、macOS、iOS、Android 与主流软路由，购前请确认自己的设备环境符合要求。
  - question: SOGO 云的节点覆盖到底有多少个国家？有哪些冷门地区？
    answer: 品牌资料标注 SOGO 云节点覆盖 15 个国家和地区，在本站收录的 31 家品牌中属于覆盖面最广的一家，除了常规香港、台湾、日本、新加坡、美国外，还明确包含韩国及另外 10 余个国家与地区节点，但 15 国的逐一完整清单未在摘要中全部列出。
  - question: SOGO 云的优惠码是用 SOGO10000 还是 sss777？
    answer: 源文档存在两处不同记录：品牌基础信息与介绍正文明确写优惠码为 SOGO10000（可打 9 折，未标注套餐限制），而文末汇总表列出 sss777。若 9 折生效，月付基础版 ¥25 折后为 ¥22.50/月（¥0.1500/GB），优选版 ¥45 折后为 ¥40.50/月（¥0.1157/GB）。下单时建议先试 SOGO10000，若失效再测试 sss777。
  - question: SOGO 云是 2026 年的新品牌吗？有什么风险？
    answer: 是的，汇总表标注 SOGO 云为 2026 年运营的新品牌，由海外团队运营且官方不提供免费试用。由于运营年限较短、缺少跨年度口碑验证，且采用仅限自研客户端的生态锁定模式，建议先购 ¥25/月 基础版测试实际体验，避免初次即购高额年付或 ¥850 1TB 不限时包。
  - question: SOGO 云有测速数据吗？为什么资料写 VLESS 而截图显示 Shadowsocks？
    answer: 有两批测速记录：2026-08-11 18:57:59 CST 的原始 PNG 测速截图（珠海联通 5Gbps 后端，协议显示 Shadowsocks）和 2026-10-19 非晚高峰五地区文本测速（香港 26ms/488Mbps、台湾 39ms/118Mbps、新加坡 43ms/401Mbps）。协议冲突（资料写 VLESS vs 截图显示 SS）大概率来自底层技术栈迭代或专属客户端封装切换。
---

# SOGO 云深度测评：15 国地区覆盖、专属客户端锁区与 SOGO10000 优惠码冲突核查

> <strong>核心结论（Answer-First）</strong>：SOGO 云在 31 家收录机场中拥有两个极具辨识度的标签：<strong>“覆盖 15 个国家和地区（本站收录最广）”</strong> 与 <strong>“2026 年新晋海外团队全线 IEPL + 三网 BGP 优化”</strong>，不限速也不限设备数量，<code>data/plans.json</code> 收录从 <strong>¥98/年小包（60GB/月）</strong> 一直覆盖到 <strong>¥150/月（1.1TB/月）</strong> 和 <strong>¥850 1.0TB 不限时包</strong> 共 <strong>9 档完整套餐</strong>。但购买前必须跨过一道明确的使用门槛：<strong>SOGO 云不提供任何第三方订阅链接，必须下载使用其自研客户端（支持 Win/macOS/iOS/Android 与主流软路由），Clash、Shadowrocket 等第三方客户端均无法直接导入</strong>。同时，它是 2026 年新站、无免费试用，且源文档存在 <code>SOGO10000</code> vs <code>sss777</code> 优惠码冲突与 <code>VLESS</code> vs <code>Shadowsocks</code> 协议口径差异。<strong>总体只推荐给刚需韩国或冷门欧美等多国节点、且不介意使用官方自研客户端的用户以 ¥25 月付起步验证。</strong>

<BrandOverview slug="sogo" />

<AffiliateButton slug="sogo" source-section="hero" label="前往 SOGO 云核验 15 国节点与实时套餐" />

---

## 一、品牌背景与三处源文档冲突全景审计

SOGO 云在汇总表中标注为 <strong>2026 年上线的新品牌</strong>，由海外团队运营。在我们的资料库里，SOGO 云具备完整的 9 档套餐表、2026-08-11 实测截图与 2026-10-19 五地区文本测速，但同时也存在三项需要注意的冲突记录：

1. <strong>双优惠码冲突：`SOGO10000`（9 折）vs `sss777`</strong>
   - 基础信息行（第 571 行）与介绍正文（第 604 行）一致写明优惠码为 <strong>`SOGO10000`</strong>，享 <strong>9 折</strong>，且未标注套餐限制条件；
   - 文末对比汇总表（第 937 行）则写为 <strong>`sss777`</strong>。
   - <strong>实操建议</strong>：结账时优先输入 `SOGO10000` 验证是否可享 9 折（例如 ¥25 基础版折后 ¥22.50/月），若失效再尝试 `sss777`。
2. <strong>协议口径冲突：`VLESS`（文字资料）vs `Shadowsocks`（08-11 实测截图）</strong>
   - 品牌基础信息与核心特色均宣称采用 `VLESS` 协议；
   - 2026-08-11 18:57 CST 的 `MAI-TEST-BOT` 原始 PNG 截图中，测试协议栏显示的是 `Shadowsocks`。
   - 由于 SOGO 云目前不向普通用户开放第三方订阅链接，底层协议变更由官方自研客户端自动接管，用户无需手动适配内核，但仍反映出其后台在不同时期可能做过协议切换。
3. <strong>推广前缀差异</strong>：主清单为 `guangs.sogoyunaff.cc`，24 站点替换前缀表为 `wzjc.sogoyunaff.cc`。

---

## 二、全 9 档套餐精算、单 GB 倒挂陷阱与不限时账期分析

SOGO 云在 `data/plans.json` 共收录 <strong>9 档完整套餐</strong>（1 档年付 + 4 档月付 + 4 档不限时包），全部不限速、不限设备数量。但仔细核算每一档的 `costPerGb` 与边际成本，会发现月付和不限时序列均存在<strong>明显的“价格倒挂”</strong>：

| 套餐名称 | 计费周期 | 原价 | 流量额度 | 折合月均 | 原价单 GB | <code>SOGO10000</code> 9 折参考 / 边际成本解析 |
| --- | --- | --- | --- | --- | --- | --- |
| <strong>小包-年付版</strong> | 年付 | <strong>¥98 / 年</strong> | 60GB / 月 | <strong>¥8.17 / 月</strong> | ¥0.1362 / GB | 9 折参考 ¥88.20/年（¥0.1225/GB）；vs 基础月付回本需 <strong>3.92 个月</strong> |
| <strong>基础版</strong> | 月付 | <strong>¥25 / 月</strong> | 150GB / 月 | ¥25.00 / 月 | ¥0.1667 / GB | 9 折参考 <strong>¥22.50/月（¥0.1500/GB）</strong>；首月试水推荐档 |
| <strong>优选版</strong> | 月付 | <strong>¥45 / 月</strong> | 350GB / 月 | ¥45.00 / 月 | <strong>¥0.1286 / GB</strong> | <strong>月付四档单 GB 最低！</strong>边际 +¥20 换 +200GB（¥0.1000/GB）；9 折 ¥40.50/月 |
| <strong>强化版</strong> | 月付 | <strong>¥80 / 月</strong> | 550GB / 月 | ¥80.00 / 月 | ¥0.1455 / GB | <strong>注意边际倒挂</strong>：+¥35 换 +200GB（边际暴涨至 <strong>¥0.1750/GB</strong>）；9 折 ¥72.00/月 |
| <strong>顶配版</strong> | 月付 | <strong>¥150 / 月</strong> | 1100GB (1.1TB) / 月 | ¥150.00 / 月 | ¥0.1364 / GB | +¥70 换 +550GB（边际 ¥0.1273/GB），全盘单价仍贵于优选版；9 折 ¥135.00/月 |
| <strong>SOGO基础餐不限时版</strong> | 一次性付费 | <strong>¥120</strong> | 120GB 一次性 | 不适用 | ¥1.0000 / GB | 等价于 1.22 年年付小包（882GB），9 折参考 ¥108（¥0.9000/GB） |
| <strong>SOGO优选餐不限时版</strong> | 一次性付费 | <strong>¥220</strong> | 250GB 一次性 | 不适用 | ¥0.8800 / GB | 等价于 2.24 年年付小包（1,616GB），9 折参考 ¥198（¥0.7920/GB） |
| <strong>SOGO强化餐不限时版</strong> | 一次性付费 | <strong>¥450</strong> | 500GB 一次性 | 不适用 | ¥0.9000 / GB | <strong>再次单 GB 倒挂！</strong>比买两份优选餐（¥440/500GB）还贵 ¥10 |
| <strong>SOGO至尊餐不限时版</strong> | 一次性付费 | <strong>¥850</strong> | 1000GB (1.0TB) 一次性 | 不适用 | <strong>¥0.8500 / GB</strong> | 等价于 8.67 年年付小包（6,245GB），9 折参考 ¥765（¥0.7650/GB） |

<PricingMatrix slug="sogo" />

<CouponInfo slug="sogo" />

### 算账避坑三大发现
1. <strong>月付“优选版 ¥45”是甜点，“强化版 ¥80”性价比最差</strong>：基础版（¥25/150GB）升到优选版（¥45/350GB），只需加 ¥20 就能多拿 200GB，单 GB 成本直接压低到全月付最低的 <strong>¥0.1286/GB</strong>；但从优选版升到强化版（¥80/550GB），同样只加 200GB 却要多掏 ¥35（新增流量边际成本高达 `¥0.1750/GB`），导致强化版单价反升至 `¥0.1455/GB`——甚至连 `¥150/1.1TB` 顶配版（`¥0.1364/GB`）都跑不过 `¥45` 优选版！
2. <strong>不限时“强化餐 ¥450/500GB”比买两份“优选餐 ¥220/250GB”更贵</strong>：在 `data/plans.json` 中，`SOGO优选餐不限时版` 单价为 `¥0.8800/GB`，而 `SOGO强化餐不限时版` 单价反而涨到 `¥0.9000/GB`（¥450 vs ¥220×2=¥440）。且横向对比 [一翻云](/reviews/yifan/) 不限时包（250GB ¥200 / 500GB ¥400，均 `¥0.8000/GB`），SOGO 云四档不限时整体贵 6%–12.5%；对于 2026 年刚起步的新品牌，一次性投入 ¥450–¥850 购买跨年不限时包的资金沉淀风险偏高，详情见[年付/不限时/免费风险](/risks/billing-risks/)。
3. <strong>`SOGO10000` 9 折码 vs `sss777` 冲突</strong>：因为基础信息写 `SOGO10000` 9 折未标注套餐限制，结算时先试填 `SOGO10000`；若想验证其对不限时包是否同样减免 10%，需以订单结算页实时金额为准。

---

## 三、15 国多区域节点分布与 IEPL + BGP 架构

<NetworkTopology slug="sogo" />

1. <strong>核心差异化卖点：15 个国家和地区</strong>
   在大多数专线机场仅保留“港、台、日、新、美”五地节点的环境下，SOGO 云明确标注覆盖 <strong>15 个国家和地区</strong>（已知包括 <strong>香港、台湾、日本、新加坡、美国、韩国</strong> 以及其余 10 余个国家/地区，在本站 31 家品牌中地域广度排名最靠前）。对于跨境电商选品、多国账号登录（如韩区游戏/影音、欧区服务）或跨国远程办公人群，多国原生/本地落地比单纯在港日堆 50 个同名节点更刚需。
   - <strong>资料诚实标注</strong>：除已明确的港/台/日/新/美/韩六地外，其余 9+ 国家的精确名称与各地区具体节点数目前未在源清单展开，需登录后在自研客户端节点列表核对。
2. <strong>全线 IEPL 专线 + 三网 BGP 优化</strong>：入口端通过三网 BGP 优化承接国内电信/联通/移动访问，跨境段走 IEPL 专线。不过品牌资料未作“原生住宅 IP”专项承诺，也未注明单个节点的峰值带宽上限。

---

## 四、测速表现：18:57 傍晚截图与 10-19 五地区数据

<SpeedReport slug="sogo" />

### 1. 2026-08-11 18:57:59 CST 原始 PNG 截图
- <strong>测试时刻</strong>：`2026-08-11T18:57:59+08:00`（接近晚上 7 点的傍晚时段，严格来说早于 20:00–23:00 核心晚高峰，故 `isPeakHours` 标为未明示）。
- <strong>测试环境</strong>：`MAI-TEST-BOT 2.0.0-dev`，珠海联通 5Gbps 后端，32 线程并发，Ping 5 次，截图内协议列为 `Shadowsocks`。
- <strong>原图价值</strong>：证明了 SOGO 云节点池在 2026 年 8 月具备实际吞吐能力与多地区连通性（可在证据面板查验原图）。

### 2. 2026-10-19 非晚高峰五地区文本数据
- <strong>香港</strong>：`26ms` / `488Mbps`
- <strong>台湾</strong>：`39ms` / `118Mbps`
- <strong>新加坡</strong>：`43ms` / `401Mbps`
- <strong>日本</strong>：`57ms` / `137Mbps`
- <strong>美国</strong>：`140ms` / `17Mbps`

<strong>数据观察</strong>：港/台/新/日四地的延迟与非晚高峰吞吐都在同价位主力水平线内（港新 400–488Mbps、台日 118–137Mbps）；<strong>美国节点 17Mbps 偏慢</strong>，仅适合网页与文本类 AI 请求，高码率美区视频或大文件拉取不建议走美国节点。且需要注意，10-19 文本样本并未测及韩国或其余 9+ 冷门国家节点的速度，冷门国家线路通常带宽较小或需走欧亚绕行，使用前应有合理预期。

---

## 五、AI 工具与流媒体解锁能力

<AvailabilityMatrix slug="sogo" />

品牌资料对 SOGO 云的平台支持作了如下分级声明（均属 `Vendor Data`）：
- <strong>标注支持</strong>：ChatGPT、Netflix、Disney+、YouTube、TikTok。
- <strong>标注视节点而定</strong>：Claude、Gemini、HBO Max、Spotify。

<strong>关键细节</strong>：与宣称“全支持（仅 Gemini 视节点而定）”的一翻云、闪跃相比，SOGO 云在自家清单里把 <strong>Claude、HBO Max、Spotify</strong> 也诚实地放入了“视节点而定”阵营——尤其说明它在 <strong>15 个国家地区节点混布</strong> 的情况下，并非每一个冷门地区都能稳定过 Claude 或 HBO 的 IP 风控，用户需要按业务切换至对应支持的国家节点（如美/新/日）。

---

## 六、客户端锁定限制与自研端排障指南

<ClientCompatibility slug="sogo" />

这是购买 SOGO 云前最不能忽略的硬性条件（购买前强烈建议先阅读[专属客户端生态锁定风险](/risks/exclusive-client-lockin/)与[客户端兼容性总表](/clients/compatibility/)）：
- <strong>不提供第三方订阅链接</strong>：无法把订阅 URL 复制进 [Clash Verge Rev](/clients/clash-verge-rev/)、[Shadowrocket](/clients/shadowrocket/)、[v2rayN](/clients/v2rayn/)、[sing-box](/clients/sing-box/)，也无法按[Clash 分流规则教程](/guides/clash-rules/)自己编排多机场 Failover 或精细 YAML 规则（如果你在第三方客户端导入时遇到报错，原因就是服务端未开放通用订阅，可参考[订阅失败与更新报错排查](/troubleshooting/subscription-failed/)核对机制区别）。
- <strong>官方自研客户端覆盖范围</strong>：品牌资料注明其自研客户端支持 <strong>[Windows](/clients/windows/)、[macOS](/clients/macos/)、[iOS](/clients/ios/)、[Android](/clients/android/) 与主流 [OpenWrt 软路由](/clients/openwrt/)</strong>，下载登录即用，且<strong>不限设备数量</strong>。注意如果你的软路由需要运行通用 [OpenClash](/clients/openclash/) 或 [PassWall2](/clients/passwall2/) 并合并其他机场节点，则必须改选开放订阅的品牌。
- <strong>自研客户端常见故障应对</strong>：
  1. 若冷门国家节点或美国节点（10-19 测速仅 17Mbps）晚间出现超时、断流，对照[节点超时与不可用排查](/troubleshooting/node-timeout/)在自研客户端内手动切换至港/台/新/日节点测试；
  2. 若桌面端开启官方客户端增强/TUN 模式后出现本地内网或国内 App 访问异常，参照[TUN 模式与 DNS 污染排查](/troubleshooting/tun-dns-error/)及[TUN 与 DNS 分流教程](/guides/tun-dns/)排查虚拟网卡路由与本地 DNS 接管状态；
  3. 购买前应先确认官网对 iOS 客户端的下载方式说明（通常需外区 Apple ID 或 TestFlight）。

---

## 七、原始证据归档

<EvidencePanel slug="sogo" />

所有数据均严格对应 SOGO 云原始文件归档，08-11 截图保留无水印原图，三处源资料冲突（优惠码、协议、子域名）与不提供试用/缺失退款条款现状均如实记录。

---

## 八、适合与不适合人群

### 适合人群
- <strong>需要韩国及 15 国多区域节点</strong>（跨境业务、多区账号管理、海外地区测试）且希望不限设备共用的用户。
- <strong>不喜欢折腾 Clash 配置、愿意直接使用官方自研客户端</strong>（覆盖主流四端及主流软路由）的省心用户。
- <strong>需要 350GB 优选版月付（¥45/月，单 GB 仅 ¥0.1286）或小额不限时备用包</strong>的用户。

### 不适合人群
- <strong>依赖 Clash / Shadowrocket / Stash / sing-box 自定义规则分流或合并多机场</strong>的第三方客户端用户。
- <strong>对 2026 年全新品牌持高度谨慎态度、必须有免费试用或多年运营史才肯付费</strong>的保守型用户。

---

## 九、25 元档三强对比与同档位横向对比直达

在 ¥25/月 150GB IEPL 这个黄金价位段，SOGO 云与 [可信云](/reviews/kexin/)、[速界](/reviews/sujie/) 规格非常接近，但产品取向截然不同：

| 对比维度 | SOGO 云（sogo） | [可信云](/reviews/kexin/)（kexin） | [速界](/reviews/sujie/)（sujie） |
| --- | --- | --- | --- |
| 运营起步年份 | 2026 年 | <strong>2024 年</strong> | <strong>2024 年</strong> |
| 基础月付价/流量 | ¥25/月 150GB（¥0.1667/GB） | ¥25/月 150GB（¥0.1667/GB） | ¥25/月 150GB（¥0.1667/GB） |
| 年付 / 不限时包 | ¥98/年小包 + 4 档不限时 | 多周期表待核实 | 多周期表待核实 |
| 地区覆盖 | <strong>15 个国家/地区（含韩）</strong> | 地区明细待核实 | 地区明细待核实 |
| 客户端模式 | <strong>仅自研客户端（无订阅）</strong> | <strong>支持第三方客户端</strong> | <strong>自研 + 第三方订阅</strong> |
| 产品差异焦点 | 多国覆盖 + 全周期矩阵 | 如实披露缺乏 AI/流媒体实测 | 25 元档主打 AI 工具场景 |

<strong>一句话选型</strong>：要 <strong>15 国冷门地区 + 自研客户端省心</strong> 选 SOGO 云；要 <strong>第三方订阅 + 2024 年更久资历</strong>，在 [可信云](/reviews/kexin/) 与 [速界](/reviews/sujie/) 之间二选一；要 <strong>¥20 更低价 150GB + Hysteria 2/Reality 三协议</strong>，则直接看 [一翻云](/reviews/yifan/)；同样仅限专属客户端但看重 8 折后月付低至 ¥19.2–¥20，可对比 [闪跃](/reviews/shanyue/) 与 [灵猫网络](/reviews/lingmao/)。

### 同档位横向对比直达

- <strong>[一次性不限时（永久）流量包横向对比](/compare/non-expiring-plans/)</strong>：横向核对 SOGO 云四档不限时包（¥0.85–¥1.00/GB 及强化餐倒挂问题）与一翻云、星岛梦、光速云 147 永久包的真实差距。
- <strong>[客户端兼容性横向对比](/compare/client-compatibility/)</strong>：查看 SOGO 云“仅自研客户端（含官方软路由）”与全开放第三方客户端品牌的功能取舍。
- <strong>[光速云 vs 飞猫云横向对比](/compare/guangsuyun-vs-feimao/)</strong>：参照光速云双轨模式（同为 ¥25 档有 168GB）与飞猫云专属客户端模式在新手 vs 进阶场景上的分水岭。
- <strong>[机场月付 vs 年付回本账期对比](/compare/monthly-vs-annual/)</strong>：对照 SOGO 云 `3.92 个月`年付回本线与 2026 年新站低试错起步策略。
- <strong>[IEPL 与 IPLC 专线横向对比](/compare/iepl-vs-iplc/)</strong>：对比 SOGO 云全线 IEPL + 三网 BGP 架构与闪跃纯 IPLC 专线的技术区别。

---

## 十、购前风险提示与检查清单

1. <strong>先确认自研客户端下载可行性</strong>：注册后先看后台下载中心，确认自己的 Windows/macOS/iOS/Android 或软路由型号在官方客户端支持列表内，再决定付款。
2. <strong>用 ¥25 基础版试水一个月</strong>：由于 SOGO 云是 2026 年新品牌且无免费试用，千万不要首次就冲 ¥98 年付或 ¥850 的 1TB 不限时包。
3. <strong>测试 `SOGO10000` 与具体冷门国家连通率</strong>：结算时试填 `SOGO10000` 核实 9 折；进客户端后第一时间测试自己最刚需的国家节点（如韩国或欧美）与 Claude/Netflix 可用性。

<AffiliateButton slug="sogo" source-section="footer" label="前往 SOGO 云官网核验客户端与套餐" />

<RelatedBrand slug="sogo" :related-slugs="['yifan', 'kexin', 'sujie', 'lingmao']" />

---

## 常见问题（FAQ）

### Q1：SOGO 云支持 Clash 或 Shadowrocket（小火箭）导入订阅吗？

不支持。SOGO 云正文信息明确说明“不提供订阅链接，只能通过自研客户端使用，Clash、Shadowrocket 这类第三方客户端用不了”。其自研客户端支持 Windows、macOS、iOS、Android 与主流软路由，购前请确认自己的设备环境符合要求。

### Q2：SOGO 云的节点覆盖到底有多少个国家？有哪些冷门地区？

品牌资料标注 SOGO 云节点覆盖 15 个国家和地区，在本站收录的 31 家品牌中属于覆盖面最广的一家，除了常规香港、台湾、日本、新加坡、美国外，还明确包含韩国及另外 10 余个国家与地区节点，但 15 国的逐一完整清单未在摘要中全部列出。

### Q3：SOGO 云的优惠码是用 SOGO10000 还是 sss777？

源文档存在两处不同记录：品牌基础信息与介绍正文明确写优惠码为 SOGO10000（可打 9 折，未标注套餐限制），而文末汇总表列出 sss777。若 9 折生效，月付基础版 ¥25 折后为 ¥22.50/月（¥0.1500/GB），优选版 ¥45 折后为 ¥40.50/月（¥0.1157/GB）。下单时建议先试 SOGO10000，若失效再测试 sss777。

### Q4：SOGO 云是 2026 年的新品牌吗？有什么风险？

是的，汇总表标注 SOGO 云为 2026 年运营的新品牌，由海外团队运营且官方不提供免费试用。由于运营年限较短、缺少跨年度口碑验证，且采用仅限自研客户端的生态锁定模式，建议先购 ¥25/月 基础版测试实际体验，避免初次即购高额年付或 ¥850 1TB 不限时包。

### Q5：SOGO 云有测速数据吗？为什么资料写 VLESS 而截图显示 Shadowsocks？

有两批测速记录：2026-08-11 18:57:59 CST 的原始 PNG 测速截图（珠海联通 5Gbps 后端，协议显示 Shadowsocks）和 2026-10-19 非晚高峰五地区文本测速（香港 26ms/488Mbps、台湾 39ms/118Mbps、新加坡 43ms/401Mbps）。协议冲突（资料写 VLESS vs 截图显示 SS）大概率来自底层技术栈迭代或专属客户端封装切换。
