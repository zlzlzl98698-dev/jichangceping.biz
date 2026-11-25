---
title: sing-box 官方客户端 (SFA / SFI / SFM / Desktop) 指南
seoTitle: sing-box 官方客户端下载与配置指南：Android/iOS/macOS/Linux 原生核心
description: sing-box 官方客户端家族（SFA / SFI / SFM / Desktop）由 sing-box 核心官方维护，性能开销低、支持 VLESS、Hysteria 2、AnyTLS 等前沿协议，并解析原生 JSON 配置与转换注意点。
schemaType: SoftwareApplication
software:
  name: sing-box
  applicationCategory: UtilitiesApplication
  operatingSystem:
    - Android
    - iOS
    - macOS
    - Linux
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 data/clients.json、data/client-compatibility.json 与《2026 机场代理客户端大全》核验整理。
faq:
  - q: SFA、SFI、SFM 分别代表什么？
    a: 它们是 sing-box 官方提供的原生图形客户端家族缩写：SFA = sing-box for Android，SFI = sing-box for iOS，SFM = sing-box for macOS，另有 sing-box for Desktop 桌面端方向。
  - q: 机场只给 Clash YAML 或 V2Ray 订阅链接，能直接导入 sing-box 官方客户端吗？
    a: 通常不能直接识别裸 Clash YAML，原生 sing-box 客户端需要 sing-box JSON 格式配置（需机场后台提供 sing-box 订阅链接或借助订阅转换）。如果机场未提供 sing-box 订阅，新手改用内置转换层的 Karing 或 Hiddify 会更方便。
  - q: sing-box 相比 Mihomo 的核心优势是什么？
    a: sing-box 采用统一的模块化架构，内存与 CPU 占用通常更低，对移动端（特别是 iOS NetworkExtension 严苛内存限制）和新兴协议（Hysteria 2、AnyTLS、TUIC）的响应极为敏捷。
---
# sing-box 官方客户端家族技术档案与使用指南

<strong>核心结论（Answer-First）：</strong><strong>sing-box 官方客户端家族</strong>（<code>SFA</code> 安卓 / <code>SFI</code> iOS / <code>SFM</code> macOS / Desktop）由 sing-box 官方核心团队持续维护，免费开源、内存开销极低，全面支持 <code>VLESS</code>、<code>VMess</code>、<code>Trojan</code>、<code>Shadowsocks</code>、<code>Hysteria 2</code> 与 <code>AnyTLS</code>。需特别注意<strong>部分机场仅提供 Clash YAML 或 V2Ray 订阅，原生 sing-box JSON 可能需要转换</strong>；不愿手动转换的新手可选内置转换层的 Hiddify 或 Karing。

## 1. 技术规格、官方渠道与注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 技术参数维度 | 核验规格（data/clients.json） | 选型与合规说明 |
| :--- | :--- | :--- |
| 软件名称与分类 | <strong>sing-box 官方客户端 (SFA / SFI / SFM / Desktop)</strong> | 官方原生 sing-box 客户端家族 |
| 核心引擎 / 内核 | <code>sing-box</code> | 决定订阅格式解析能力与新兴协议上限 |
| 支持操作系统 | Android / iOS / macOS / Linux | 共覆盖 4 个操作系统平台 |
| 支持代理协议 | VLESS、VMess、Trojan、Shadowsocks、Hysteria 2、AnyTLS | 实际可用节点协议以所购机场套餐下发为准 |
| 定价与开源状态 | <strong>免费开源</strong> | 付费商店版本受所属地区 App Store 政策影响 |
| 项目维护状态 | 官方核心持续维护 | 数据核验口径：Vendor Data |
| 官方获取渠道 | 官方文档 / App Store | 仅限核验官方仓库或正版应用商店，拒用未知搬运包 |
| 官方与测评注意事项 | 部分机场仅提供 Clash YAML 或 V2Ray 订阅，原生 sing-box JSON 可能需要转换 | 原生 sing-box 配置支持，性能开销低，协议前沿兼容性强 |

## 2. sing-box 原生家族定位与五步配置实操

### 1. 官方原生客户端家族与 JSON 订阅门槛

<strong>sing-box</strong> 是新一代模块化通用代理核心平台。除了作为后端引擎被 <a href="/clients/hiddify/">Hiddify</a>、<a href="/clients/karing/">Karing</a>、<a href="/clients/v2rayn/">v2rayN</a>、<a href="/clients/passwall2/">PassWall2</a> 与 <a href="/clients/homeproxy/">HomeProxy</a> 调用外，官方团队直接发布并维护面向各系统的图形端：<strong>SFA（Android）</strong>、<strong>SFI（iOS）</strong>、<strong>SFM（macOS）</strong> 以及桌面端方向。

> [!IMPORTANT]
> <strong>配置格式核心提醒</strong>（依据 <code>data/clients.json</code>）：<strong>部分机场仅提供 Clash YAML 或 V2Ray 订阅，原生 sing-box JSON 可能需要转换</strong>。直接把 Clash 链接粘贴进 SFA/SFI 会因语法不匹配导致导入失败；若机场后台未提供专门的 sing-box 订阅链接，建议改用同样基于 sing-box 但支持多格式自动导入的 <a href="/clients/hiddify/">Hiddify</a> 或 <a href="/clients/karing/">Karing</a>。

### 2. 五步部署与新协议优化指南

1. <strong>按平台从官方渠道获取</strong>：Android（SFA）与 Linux 从官方 GitHub Releases / 文档获取，iOS（SFI）与 macOS（SFM）通过非国区 App Store 或官方发布渠道获取（完全免费开源）。
2. <strong>确认机场 sing-box 订阅或转换模板</strong>：在机场用户面板查看是否提供“sing-box 订阅”入口；若无，可使用安全可控的自部署转换模板生成符合当前 sing-box 内核大版本的 JSON 配置。
3. <strong>优先使用二进制 <code>.srs</code> 规则集</strong>：在移动端（特别是内存受限的 iOS SFI）配置分流时，使用轻量化二进制 <code>.srs</code> 规则集代替庞大文本规则，可大幅降低内存峰值并防止系统杀后台。
4. <strong>核对内核大版本字段变更</strong>：sing-box 迭代节奏较快，不同版本间部分 DNS 与 outbound 字段会废弃调整，升级客户端后需同步更新配置模板。
5. <strong>多终端核验</strong>：连接 VLESS-Reality、Hysteria 2 或 AnyTLS 节点后，利用客户端内置日志确认出站匹配规则正常，未出现 DNS 泄漏或回环错误。

## 3. 规则配置、TUN 模式与高频故障排查索引

在完成基础订阅导入后，若遇到分流不准、命令行直连、DNS 污染或节点全部超时等常见现象，可按以下官方排障路径逐项核查：

- <strong>订阅导入与转换标准流程</strong>：参见 <a href="/guides/subscription/">订阅导入与客户端配置指南</a>，确认 Clash YAML、Base64 与 sing-box JSON 格式边界。
- <strong>规则分流与策略组调优</strong>：参见 <a href="/guides/clash-rules/">Clash 分流规则配置指南</a>，避免国内常用网站走代理消耗流量或导致支付异常。
- <strong>TUN 虚拟网卡与 DNS 防泄漏</strong>：参见 <a href="/guides/tun-dns/">TUN 模式与 DNS 分流指南</a>，解决终端命令行、游戏与系统组件代理接管问题。
- <strong>高频故障快速定位</strong>：遇到拉取报错查看 <a href="/troubleshooting/subscription-failed/">订阅失败与更新报错排查</a>；遇到全节点超时查看 <a href="/troubleshooting/node-timeout/">节点超时与全部不可用排查</a>；遇到国内网站打不开或 DNS 异常查看 <a href="/troubleshooting/tun-dns-error/">TUN 异常与 DNS 污染排查</a>。
- <strong>封闭生态风险评估</strong>：选购仅限自研客户端品牌前，务必阅读 <a href="/risks/exclusive-client-lockin/">专属客户端锁定风险解析</a> 与 <a href="/clients/compatibility/">31 家机场客户端兼容性矩阵</a>。

## 4. 31 家机场品牌兼容性对照矩阵

以下对照表严格基于 <code>data/client-compatibility.json</code> 与 <code>data/brands.json</code> 生成，展示支持第三方通用订阅的开放品牌与明确不提供订阅链接的 8 家 <code>exclusive-only</code> 专属客户端品牌（含待核实品牌提示）：

| 机场品牌 | 接入模式 | 第三方订阅与本页适配性 | 支持系统与节点协议 | 实测核验备注与数据状态 |
| :--- | :--- | :--- | :--- | :--- |
| <a href="/reviews/guangsuyun/">光速云</a> | 自研 + 第三方通用 | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks、AnyTLS | 提供自研客户端，同时支持 Clash、Shadowrocket 等第三方客户端订阅导入。（<code>Measured</code>） |
| <a href="/reviews/weifeng/">微风网络</a> | 未明确限定（待核实/实测） | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料未明确限定专属客户端，2026-07-19 实测截图通过 VLESS 订阅导入 MiaoKo 测试。（<code>Measured</code>） |
| <a href="/reviews/xingdaomeng/">星岛梦</a> | 未明确限定（待核实/实测） | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Trojan、Shadowsocks | 品牌资料未明确限制专属客户端，2026-08-11 实测通过 Shadowsocks 订阅节点测速。（<code>Measured</code>） |
| <a href="/reviews/ermao/">二猫云</a> | 自研 + 第三方通用 | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 配备独家定制客户端；正文提及 VLESS 协议，且 2026-08-11 截图显示 Shadowsocks 节点可测速，具体第三方订阅权限以官网为准。（<code>Measured</code>） |
| <a href="/reviews/weitu/">唯兔云</a> | 未明确限定（待核实/实测） | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Trojan、Shadowsocks | 品牌资料未强制限制专属客户端，2026-08-11 实测通过 Shadowsocks 节点测速。（<code>Measured</code>） |
| <a href="/reviews/jilian/">极连云</a> | 自研 + 第三方通用 | 支持通用订阅（按客户端对应协议与格式导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料明确支持自研客户端 + 第三方客户端，2026-08-11 晚高峰通过 Shadowsocks 测速。（<code>Measured</code>） |
| <a href="/reviews/guangnian/">光年梯</a> | 自研 + 第三方通用 | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 支持自研客户端 + 第三方订阅导入。（<code>Measured</code>） |
| <a href="/reviews/yifan/">一翻云</a> | 纯第三方通用 | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Hysteria 2、VLESS-Reality、Shadowsocks | 提供 Hysteria 2 / VLESS-Reality / Shadowsocks 三协议，支持 Clash Verge Rev / v2rayN / Shadowrocket 等主流第三方客户端。（<code>Measured</code>） |
| <a href="/reviews/kexin/">可信云</a> | 纯第三方通用 | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 品牌资料标注支持第三方客户端。（<code>Measured</code>） |
| <a href="/reviews/sujie/">速界</a> | 自研 + 第三方通用 | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 支持自研客户端 + 第三方订阅导入。（<code>Measured</code>） |
| <a href="/reviews/tiziyun/">梯子云</a> | 自研 + 第三方通用 | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料同时提供自研全平台一键登录客户端与通用订阅导入（兼顾新手与进阶用户）。（<code>Vendor Data</code>） |
| <a href="/reviews/dalaoyun/">大佬云</a> | 自研 + 第三方通用 | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料标注支持自研客户端 + 第三方订阅导入。（<code>Vendor Data</code>） |
| <a href="/reviews/u1s1/">U1S1</a> | 未明确限定（待核实/实测） | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料未明确限定专属客户端，2026-08-11 晚高峰测速通过 Shadowsocks 节点完成。（<code>Measured</code>） |
| <a href="/reviews/muguang/">暮光加速</a> | 未明确限定（待核实/实测） | <strong>待核实</strong>（是否开放第三方订阅尚未明确） | Windows / macOS / iOS / Android / Linux · 待核实 | 品牌资料宣称覆盖 Windows、macOS、iOS、Android、Linux 全平台，但是否强制自研客户端或提供订阅链接尚未明确。（<code>Vendor Data</code>） |
| <a href="/reviews/feimao/">飞猫云</a> | 仅限专属客户端 | <strong>不兼容</strong>（不提供第三方订阅链接） | Windows / macOS / iOS / Android · Shadowsocks | 专属客户端下载登录即用，不提供第三方订阅链接（无法直接导入 Clash / Shadowrocket）。（<code>Measured</code>） |
| <a href="/reviews/yinxingren/">隐形人</a> | 仅限专属客户端 | <strong>不兼容</strong>（不提供第三方订阅链接） | Windows / macOS / iOS / Android · 待核实 | 仅限自带专属客户端，不提供订阅链接，Clash / Shadowrocket 等第三方客户端无法使用。（<code>Conflicting</code>） |
| <a href="/reviews/wuyou/">无忧链接</a> | 仅限专属客户端 | <strong>不兼容</strong>（不提供第三方订阅链接） | Windows / macOS / iOS / Android · VLESS | 正文标注 2026 年 10 月起改用官方专属客户端下载登录即用（但汇总表曾提及“订阅无需转换”，2026-07-18 曾以 VLESS 订阅实测，存在新旧切换期冲突）。（<code>Measured</code>） |
| <a href="/reviews/firefly/">Firefly</a> | 仅限专属客户端 | <strong>不兼容</strong>（不提供第三方订阅链接） | Windows / macOS / iOS / Android · VLESS | 10 月主体资料注明“2026 年 10 月起专属客户端下载登录即用，不提供订阅链接”；2026-08-09 历史资料仅提及 IPLC + VLESS 规格。（<code>Conflicting</code>） |
| <a href="/reviews/lingmao/">灵猫网络</a> | 仅限专属客户端 | <strong>不兼容</strong>（不提供第三方订阅链接） | Windows / macOS / iOS / Android · Shadowsocks | 2026 年 10 月起改用专属客户端下载登录即用，不提供订阅链接（但 08-11 曾以 Shadowsocks 测速）。（<code>Conflicting</code>） |
| <a href="/reviews/sogo/">SOGO 云</a> | 仅限专属客户端 | <strong>不兼容第三方订阅</strong>（自研客户端含部分软路由，无法导入第三方端） | Windows / macOS / iOS / Android / OpenWrt · VLESS、Shadowsocks | 正文注明不提供订阅链接，只能通过自研客户端（支持 Win/macOS/iOS/Android 与主流软路由）使用，Clash/Shadowrocket 无法直接导入。（<code>Measured</code>） |
| <a href="/reviews/shanyue/">闪跃</a> | 仅限专属客户端 | <strong>不兼容</strong>（不提供第三方订阅链接） | Windows / macOS / iOS / Android · 待核实 | 专属客户端下载登录即用，不提供订阅链接。（<code>Vendor Data</code>） |
| <a href="/reviews/quanqiu/">全球云</a> | 仅限专属客户端 | <strong>不兼容</strong>（不提供第三方订阅链接） | Windows / macOS / iOS / Android · Trojan、Shadowsocks | 正文注明专属客户端下载登录即用、不提供订阅链接（但 2026-08-11 测速截图显示以 Shadowsocks 节点完成测速）。（<code>Measured</code>） |

> [!TIP]
> <strong>选型与避坑总结</strong>：购买机场前先对照上方兼容性矩阵确认其是否开放第三方通用订阅（避开 <code>exclusive-only</code> 锁死风险），并核实你当前设备对应客户端的协议支持与安全下载渠道。完整 31 家品牌全量对照请访问 <a href="/clients/compatibility/">客户端兼容性矩阵</a> 或返回 <a href="/clients/">客户端总览中心</a>。
