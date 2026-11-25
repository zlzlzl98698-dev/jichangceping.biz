---
title: Stash iOS Clash 规则代理客户端指南
seoTitle: Stash iOS 下载与配置指南：完美兼容 Clash 策略组与覆写的苹果客户端
description: Stash 是面向 iOS 设备的付费 Clash 规则代理客户端，兼容 Clash YAML 配置、策略组与 Override 覆写功能，支持 Shadowsocks、VMess、VLESS、Trojan 与 Hysteria 2。
schemaType: SoftwareApplication
software:
  name: Stash
  applicationCategory: UtilitiesApplication
  operatingSystem:
    - iOS
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 data/clients.json、data/client-compatibility.json 与《2026 机场代理客户端大全》核验整理。
faq:
  - q: Stash 和 Shadowrocket（小火箭）在 iOS 上怎么选？
    a: 如果你在电脑端已经习惯使用 Clash Verge Rev 或 Mihomo 的 YAML 策略组、规则集与覆写逻辑，希望 iPhone/iPad 直接沿用同一份 Clash 订阅，Stash 会非常顺手；如果追求最广泛的单节点导入与极简上手，Shadowrocket 通用性更高。
  - q: Stash 是免费软件吗？
    a: 不是。Stash 在美国等非中国大陆地区 App Store 显示为付费买断应用，实际售价和上架状态以用户所属地区 App Store 为准。
  - q: 哪些机场无法导入 Stash？
    a: 飞猫云、隐形人、无忧链接、Firefly、灵猫网络、SOGO 云、闪跃、全球云 8 家 exclusive-only 品牌均不提供 Clash 订阅链接，无法导入 Stash。
---
# Stash iOS Clash 规则代理客户端指南

<strong>核心结论（Answer-First）：</strong><strong>Stash</strong> 是面向 <strong>iOS</strong> 的<strong>付费</strong> Clash 兼容规则客户端，支持 <code>Shadowsocks</code>、<code>VMess</code>、<code>VLESS</code>、<code>Trojan</code> 与 <code>Hysteria 2</code>，能够直接复用桌面端 Clash Verge Rev / OpenClash 的 YAML 策略组与 <strong>Override（覆写）</strong>配置。<strong>在美国等 App Store 显示为付费应用（以所属地区标价为准）</strong>，严禁使用陌生共享账号，且不兼容 8 家 <code>exclusive-only</code> 机场。

## 1. 技术规格、官方渠道与注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 技术参数维度 | 核验规格（data/clients.json） | 选型与合规说明 |
| :--- | :--- | :--- |
| 软件名称与分类 | <strong>Stash</strong> | iOS Clash 规则客户端 |
| 核心引擎 / 内核 | <code>Clash 兼容规则引擎</code> | 决定订阅格式解析能力与新兴协议上限 |
| 支持操作系统 | iOS | 共覆盖 1 个操作系统平台 |
| 支持代理协议 | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 实际可用节点协议以所购机场套餐下发为准 |
| 定价与开源状态 | <strong>付费应用（以所属地区 App Store 标价为准）</strong> | 付费商店版本受所属地区 App Store 政策影响 |
| 项目维护状态 | 持续更新 | 数据核验口径：Vendor Data |
| 官方获取渠道 | App Store | 仅限核验官方仓库或正版应用商店，拒用未知搬运包 |
| 官方与测评注意事项 | 美国等 App Store 显示为付费应用 | 完美兼容 Clash 风格规则配置、策略组与覆写(Override)功能 |

## 2. Stash 覆写能力、付费安全与五步配置实操

### 1. Clash 生态无缝延伸与付费提醒

对于电脑端已经习惯使用 <a href="/clients/clash-verge-rev/">Clash Verge Rev</a>、<a href="/clients/flclash/">FlClash</a> 或软路由 <a href="/clients/openclash/">OpenClash</a> 的苹果手机用户而言，<strong>Stash</strong> 是 iOS 上与桌面 Clash YAML 语义贴合度最高的客户端。它完整支持策略组、Rule-Providers 规则集以及强大的 Override（覆写）功能，可轻松实现多设备配置统一。

> [!NOTE]
> <strong>App Store 付费提示</strong>（依据 <code>data/clients.json</code>）：Stash 在<strong>美国等 App Store 显示为付费应用（以所属地区 App Store 标价为准）</strong>，未在中国大陆区上架。请勿购买或登录第三方共享 Apple ID；若偏好免费方案，iOS 端可考察同支持 Clash YAML 的 <a href="/clients/clash-mi/">Clash Mi</a> 或多格式聚合的 <a href="/clients/karing/">Karing</a>。

### 2. 五步配置与 Override 调优实操

1. <strong>使用自有外区 Apple ID 购买安装</strong>：仅在 App Store 应用商店内切换自有外区账户购买买断，切勿登录系统主 iCloud 设置。
2. <strong>导入机场 Clash 订阅链接</strong>：进入配置文件列表，粘贴机场 Clash YAML 订阅 URL 并开启定期自动更新（避免节点变更后失联）。
3. <strong>启用“规则模式”与延迟测试</strong>：在首页确保出站模式为“规则（Rule）”，点击策略组内的测速图标筛选低延迟节点。
4. <strong>利用覆写（Override）修正 AI / 流媒体分流</strong>：若机场下发规则未把 OpenAI / Claude 分流到美日新节点，可在 Stash 的覆写中仅追加几条精准 <code>DOMAIN-SUFFIX</code> 规则定向至目标策略组，无需修改原始订阅文件。
5. <strong>精简规则数量以适配 iOS 内存限制</strong>：iOS <code>NetworkExtension</code> 内存上限约 50MB，避免挂载数万条冗余正则规则，保持轻量化配置以确保长后台运行不闪退。

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
| <a href="/reviews/jilian/">极连云</a> | 自研 + 第三方通用 | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料明确支持自研客户端 + 第三方客户端，2026-08-11 晚高峰通过 Shadowsocks 测速。（<code>Measured</code>） |
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
