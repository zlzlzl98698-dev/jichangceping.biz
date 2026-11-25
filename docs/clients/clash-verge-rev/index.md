---
title: Clash Verge Rev 下载、架构特性与机场兼容性指南
seoTitle: Clash Verge Rev 下载与配置：Win/macOS/Linux Mihomo 客户端
description: Clash Verge Rev 是基于 Mihomo (Clash Meta) 内核的跨平台桌面代理客户端，支持 Windows、macOS（Intel / Apple Silicon）与 Linux（DEB/RPM/AppImage），兼容 VLESS、AnyTLS、Hysteria 2 等主流协议。
schemaType: SoftwareApplication
software:
  name: Clash Verge Rev
  applicationCategory: UtilitiesApplication
  operatingSystem:
    - Windows
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
  - q: Clash Verge Rev 与旧版 Clash for Windows 有什么区别？
    a: Clash for Windows 已停止维护，而 Clash Verge Rev 基于 Tauri 框架重构并持续活跃维护，内置 Mihomo (Clash Meta) 内核，原生支持 VLESS、Hysteria 2、AnyTLS 等新协议与现代 TUN 模式。
  - q: macOS 下载 Clash Verge Rev 时需要注意什么？
    a: macOS 必须区分处理器架构：Apple Silicon（M1/M2/M3/M4 系列）应选择 aarch64 / arm64 安装包，旧款 Intel Mac 应选择 x64 / x86_64 安装包。
  - q: 哪些机场无法直接在 Clash Verge Rev 中导入订阅？
    a: 本站收录的 8 家 exclusive-only 品牌（飞猫云、隐形人、无忧链接、Firefly、灵猫网络、SOGO 云、闪跃、全球云）不提供第三方 Clash 订阅链接，因此无法导入 Clash Verge Rev。
---
# Clash Verge Rev 客户端技术档案与使用指南

<strong>核心结论（Answer-First）：</strong><strong>Clash Verge Rev</strong> 是目前 Windows、macOS 与 Linux 桌面端最均衡的首选免费开源客户端，内置 <strong>Mihomo (Clash Meta)</strong> 内核，原生支持 <code>Shadowsocks</code>、<code>VMess</code>、<code>VLESS</code>、<code>Trojan</code>、<code>Hysteria 2</code> 与 <code>AnyTLS</code>。macOS 下载需严格区分 Intel 与 Apple Silicon 架构，Linux 需按发行版匹配 DEB/RPM/AppImage，且无法导入 8 家 <code>exclusive-only</code> 专属客户端机场。

## 1. 技术规格、官方渠道与注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 技术参数维度 | 核验规格（data/clients.json） | 选型与合规说明 |
| :--- | :--- | :--- |
| 软件名称与分类 | <strong>Clash Verge Rev</strong> | 桌面规则代理客户端 |
| 核心引擎 / 内核 | <code>Mihomo (Clash Meta)</code> | 决定订阅格式解析能力与新兴协议上限 |
| 支持操作系统 | Windows / macOS / Linux | 共覆盖 3 个操作系统平台 |
| 支持代理协议 | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2、AnyTLS | 实际可用节点协议以所购机场套餐下发为准 |
| 定价与开源状态 | <strong>免费开源</strong> | 付费商店版本受所属地区 App Store 政策影响 |
| 项目维护状态 | 持续活跃（有可核实跨平台项目资料；macOS 区分 Intel / Apple Silicon，Linux 提供 DEB/RPM/AppImage） | 数据核验口径：Vendor Data |
| 官方获取渠道 | GitHub | 仅限核验官方仓库或正版应用商店，拒用未知搬运包 |
| 官方与测评注意事项 | macOS 下载需区分 Intel 与 Apple Silicon 架构；Linux 需按发行版选择 DEB/RPM/AppImage 格式 | Mihomo 内核与 Clash YAML 订阅管理；支持规则分流与 TUN 全局虚拟网卡模式；兼顾新手默认配置与进阶自定义覆写 |

## 2. Clash Verge Rev 架构特性与五步配置实操

### 1. 软件定位与版本渠道核验

<strong>Clash Verge Rev</strong> 基于现代桌面框架重构并保持持续活跃维护，彻底替代了已停更的旧版 Clash for Windows。它同时兼顾纯新手的“一键订阅导入 + 规则模式”和进阶用户的 Script / YAML Merge（配置覆写）需求，能够直接解析支持 <code>AnyTLS</code>（如光速云 2026-08-19 实测批次）与 <code>Hysteria 2</code>（如一翻云）的新架构机场订阅。

> [!IMPORTANT]
> <strong>跨平台安装包区分要点</strong>（依据 <code>data/clients.json</code>）：
> - <strong>macOS</strong>：必须区分 <strong>Intel (<code>x64 / x86_64</code>)</strong> 与 <strong>Apple Silicon (<code>aarch64 / arm64</code>)</strong> 安装包，否则将无法正常运行或性能受限。
> - <strong>Linux</strong>：按发行版分别选择 <code>DEB</code>（Debian/Ubuntu）、<code>RPM</code>（Fedora/RHEL）或便携 <code>AppImage</code> 格式，并核对 CPU 架构。
> - <strong>获取来源</strong>：仅限项目官方 GitHub Releases 页面下载，切勿轻信搜索引擎广告中的第三方搬运下载站。

### 2. 五步配置与 TUN 模式排障指南

1. <strong>安装与校验</strong>：从官方 GitHub Releases 获取对应系统架构包并安装，首次运行建议核对内置 Mihomo 内核版本（确保为最新稳定版以完整支持 VLESS-Reality 与 AnyTLS）。
2. <strong>导入机场 Clash 订阅</strong>：进入左侧“订阅（Profiles）”页，粘贴机场后台复制的 Clash YAML 订阅 URL 并点击导入；若遇拉取超时，可检查系统网络代理状态或参考订阅失败排查。
3. <strong>选择规则模式与自动测速</strong>：在“代理（Proxies）”页将模式切换为 <strong>Rule（规则）</strong>，点击测速按钮验证节点真实连通性，确认国内网站直连、海外服务走代理策略组。
4. <strong>按需启用 TUN 虚拟网卡模式</strong>：仅浏览器上网可开启“系统代理”；若需要终端（Git/npm/pip）、游戏或 UWP 应用走代理，先在“设置”中安装并开启 <strong>Service Mode（服务模式）</strong>，再启用 TUN 模式（macOS 需输入开机密码授权）。
5. <strong>避免路由冲突与脚本风险</strong>：运行期间务必关闭其他 VPN 或网游加速器防止路由表抢占；谨慎使用来源不明的在线覆写脚本，保持机场原生规则组更安全可靠。

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
