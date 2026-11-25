---
title: Clash Mi 全平台 Mihomo 图形代理客户端指南
seoTitle: Clash Mi 下载与配置：覆盖桌面与移动五端的 Mihomo 代理客户端
description: Clash Mi 是一款持续活跃的全平台 Mihomo 图形代理客户端，覆盖 Windows、Android、iOS、macOS 与 Linux，统一支持 Clash YAML 配置导入。
schemaType: SoftwareApplication
software:
  name: Clash Mi
  applicationCategory: UtilitiesApplication
  operatingSystem:
    - Windows
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
  - q: Clash Mi 和 FlClash、Karing 在跨平台上的定位有何不同？
    a: Clash Mi 与 FlClash 同属 Mihomo 内核生态，特点是连同 iOS 端一并覆盖（全五大平台统一 Clash YAML 配置）；Karing 同样覆盖五大平台但底层采用 sing-box 内核且侧重多格式订阅兼容。
  - q: iOS 端使用 Clash Mi 需要付费吗？
    a: 在 App Store 分发时以免费为主，但具体上架状态与地区可见性以用户所属地区 App Store 页面为准（中国大陆区通常不可见）。
  - q: 导入 Clash Mi 前需要向机场确认什么？
    a: 需确认机场支持标准 Clash YAML 订阅输出（避开 exclusive-only 仅限专属客户端品牌）。
---
# Clash Mi 全平台 Mihomo 图形代理客户端指南

<strong>核心结论（Answer-First）：</strong><strong>Clash Mi</strong> 是持续活跃的免费全平台 <strong>Mihomo</strong> 图形代理客户端，覆盖 <strong>Windows</strong>、<strong>Android</strong>、<strong>iOS</strong>、<strong>macOS</strong> 与 <strong>Linux</strong> 五大系统，支持 <code>Shadowsocks</code>、<code>VMess</code>、<code>VLESS</code>、<code>Trojan</code> 与 <code>Hysteria 2</code>。它是少数在 iOS 端也免费提供纯正 Mihomo / Clash 配置体验的方案，<strong>使用前建议确认机场订阅支持 Clash 格式</strong>（iOS 端以 App Store 地区页面为准）。

## 1. 技术规格、官方渠道与注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 技术参数维度 | 核验规格（data/clients.json） | 选型与合规说明 |
| :--- | :--- | :--- |
| 软件名称与分类 | <strong>Clash Mi</strong> | 全平台 Mihomo 图形客户端 |
| 核心引擎 / 内核 | <code>Mihomo</code> | 决定订阅格式解析能力与新兴协议上限 |
| 支持操作系统 | Windows / Android / iOS / macOS / Linux | 共覆盖 5 个操作系统平台 |
| 支持代理协议 | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 实际可用节点协议以所购机场套餐下发为准 |
| 定价与开源状态 | <strong>免费（iOS 端以 App Store 地区页面为准）</strong> | 付费商店版本受所属地区 App Store 政策影响 |
| 项目维护状态 | 持续活跃（有可核实跨平台项目资料） | 数据核验口径：Vendor Data |
| 官方获取渠道 | GitHub / App Store | 仅限核验官方仓库或正版应用商店，拒用未知搬运包 |
| 官方与测评注意事项 | 使用 Mihomo 配置前建议确认机场订阅支持 Clash 格式 | 全平台支持 Clash YAML 配置与 Mihomo 内核 |

## 2. Clash Mi 五端统一体验与五步配置实操

### 1. 五大平台统一 Mihomo 生态

在全平台客户端中，Hiddify 与 Karing 底层采用 <code>sing-box</code>，而 <strong>Clash Mi</strong> 则把 <strong>Mihomo</strong> 内核完整带到了 Windows、Android、iOS、macOS 与 Linux 全部五个主流系统上。对于希望在 iPhone 上免费使用 Clash YAML 配置、同时与电脑保持一致规则认知的用户来说，Clash Mi 是极具性价比的开源/免费选择（<code>data/clients.json</code> 标注为免费，iOS 端获取以所属地区 App Store 页面为准）。

> [!IMPORTANT]
> <strong>配置前格式核对</strong>（依据 <code>data/clients.json</code>）：<strong>使用 Mihomo 配置前建议确认机场订阅支持 Clash 格式</strong>。不要将纯 V2Ray Base64 单节点文本直接当作 Clash 订阅 URL 填入；遇到此类订阅时，先在机场面板选择“Clash 订阅”入口或改用支持多格式的 <a href="/clients/karing/">Karing</a>。

### 2. 五步跨设备配置与使用实操

1. <strong>按设备渠道安装正版应用</strong>：桌面端与 Android 从官方 GitHub Releases 按芯片架构（macOS 区分 Intel/Apple Silicon，Android 选 <code>arm64-v8a</code>）下载；iOS 端通过自有外区 Apple ID 在 App Store 下载安装。
2. <strong>导入机场 Clash YAML 订阅</strong>：粘贴标准 Clash 订阅 URL 完成解析，并设置合理的后台自动刷新周期。
3. <strong>保持“规则（Rule）”模式与自动选点</strong>：核对国内直连与海外分流策略组已激活，点击测速验证可用节点延迟。
4. <strong>按设备开启对应流量接管方式</strong>：桌面端可按需开启系统代理或 TUN 模式接管终端流量；移动端开启系统 VPN 接口后，建议在安卓开启后台保活、在 iOS 避免挂载过度庞大的规则集。
5. <strong>核查多端同时在线数上限</strong>：当手机、平板与电脑同时使用同一机场订阅时，留意机场账号的同时在线设备数限制，或优先搭配不限设备数的开放订阅机场使用。

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
