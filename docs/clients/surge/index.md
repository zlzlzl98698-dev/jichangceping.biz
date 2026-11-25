---
title: Surge (Surge 5 / Surge Mac) 高级网络调试与代理套件指南
seoTitle: Surge 5 / Surge Mac 客户端指南：iOS 与 macOS 专业网络代理与抓包分析
description: Surge 是面向 iOS 与 macOS 的商业高级网络调试与代理套件，提供顶级流量抓包分析、精细策略组与系统级网络控制，需付费授权。
schemaType: SoftwareApplication
software:
  name: Surge
  applicationCategory: DeveloperApplication
  operatingSystem:
    - iOS
    - macOS
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 data/clients.json、data/client-compatibility.json 与《2026 机场代理客户端大全》核验整理。
faq:
  - q: 普通机场用户有必要购买 Surge 吗？
    a: 若只是日常科学上网、流媒体解锁与 AI 工具访问，Shadowrocket、Stash 或免费的 Clash Verge Rev、FlClash 已完全足够；Surge 授权价格较高，主要面向需要 HTTP/HTTPS 解密抓包、Ponte 异地组网与深度网络开发调试的工程师与重度用户。
  - q: Surge 支持哪些机场协议？是否支持 VLESS 或 AnyTLS？
    a: 依据 data/clients.json 记录，Surge 核心支持 Shadowsocks、VMess、Trojan 与 Hysteria 2，其商业协议跟进节奏与开源客户端（Mihomo / sing-box）不同，对 VLESS 或 AnyTLS 等部分新兴协议支持存在局限，购买机场前需核对机场下发的协议类型。
  - q: Surge 在哪里下载与激活？
    a: iOS 版（Surge 5）通过外区 App Store 下载并含应用内购买授权；macOS 版（Surge Mac）通过官方网站下载并购买软件授权许可。
---
# Surge (Surge 5 / Surge Mac) 高级网络调试与代理套件指南

<strong>核心结论（Answer-First）：</strong><strong>Surge（Surge 5 / Surge Mac）</strong>是面向 <strong>iOS 与 macOS</strong> 的商业高级网络调试与代理套件，提供顶级 HTTP/HTTPS 抓包、精细策略组与系统调试能力，支持 <code>Shadowsocks</code>、<code>VMess</code>、<code>Trojan</code> 与 <code>Hysteria 2</code>。其<strong>授权价格较高（付费授权 / 含应用内购买）且对 VLESS、AnyTLS 等部分新兴协议支持节奏与开源端不同</strong>，普通用户建议优先对比 Shadowrocket 或 Clash Verge Rev。

## 1. 技术规格、官方渠道与注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 技术参数维度 | 核验规格（data/clients.json） | 选型与合规说明 |
| :--- | :--- | :--- |
| 软件名称与分类 | <strong>Surge (Surge 5 / Surge Mac)</strong> | iOS / macOS 高级网络调试与代理套件 |
| 核心引擎 / 内核 | <code>Surge 自研高性能网络引擎</code> | 决定订阅格式解析能力与新兴协议上限 |
| 支持操作系统 | iOS / macOS | 共覆盖 2 个操作系统平台 |
| 支持代理协议 | Shadowsocks、VMess、Trojan、Hysteria 2 | 实际可用节点协议以所购机场套餐下发为准 |
| 定价与开源状态 | <strong>付费授权 / 含应用内购买</strong> | 付费商店版本受所属地区 App Store 政策影响 |
| 项目维护状态 | 商业软件持续维护 | 数据核验口径：Vendor Data |
| 官方获取渠道 | App Store / 官网 | 仅限核验官方仓库或正版应用商店，拒用未知搬运包 |
| 官方与测评注意事项 | 授权价格较高且部分新兴协议支持节奏与开源客户端不同 | 顶级的网络流量抓包分析、策略组与系统级调试能力 |

## 2. Surge 商业授权定位、协议边界与五步配置实操

### 1. 专业网络工具定位与协议边界

<strong>Surge</strong> 并非面向纯翻墙新手的廉价工具，而是一套面向开发者、安全工程师与 Apple 重度用户的系统级网络调试套件（含 Ponte 异地组网、HTTP/HTTPS MITM 解密抓包、Mock 与脚本重写）。依据 <code>data/clients.json</code> 核验提示：
- <strong>收费模式</strong>：<strong>付费授权 / 含应用内购买</strong>（Surge 5 通过外区 App Store 下载并内购授权；Surge Mac 通过官方网站购买商业软件授权），整体购置成本明显高于一次性买断的小火箭或开源免费客户端。
- <strong>协议支持差异</strong>：当前核验列表包含 <code>Shadowsocks</code>、<code>VMess</code>、<code>Trojan</code> 与 <code>Hysteria 2</code>，<strong>部分新兴协议（如 VLESS-Reality、AnyTLS）支持节奏与开源客户端不同</strong>。购买单协议 VLESS 机场前务必先核实是否能转出 Surge 可识别协议。

### 2. 五步配置与安全调试实操

1. <strong>核实机场是否提供 Surge 托管配置</strong>：Surge 采用独有的 INI 风格 <code>.conf</code> 配置格式，购买开放订阅机场后优先在用户面板查找“Surge 专用订阅/托管配置”入口，或确认节点包含 SS / Trojan / Hysteria 2 协议。
2. <strong>导入托管配置并检查策略组</strong>：在 Surge 中通过 URL 导入托管配置文件，避免混用过时版本的旧语法模板，确保 <code>FINAL</code> 兜底策略与大陆直连规则生效。
3. <strong>macOS 增强模式（Enhanced Mode）控制</strong>：在 Surge Mac 中需要接管终端或非代理感知应用流量时开启增强模式（虚拟网卡），并注意避免与其他 VPN 冲突。
4. <strong>谨慎管理 MITM 根证书</strong>：仅在开发者本机确需抓包调试时安装并信任 Surge 本地 CA 证书，且务必在配置中把银行、支付与密码管理域名放入排除列表。
5. <strong>避开 8 家专属端限制</strong>：飞猫云、隐形人等 <code>exclusive-only</code> 品牌无法导出任何配置至 Surge。

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
| <a href="/reviews/guangsuyun/">光速云</a> | 自研 + 第三方通用 | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks、AnyTLS | 提供自研客户端，同时支持 Clash、Shadowrocket 等第三方客户端订阅导入。（<code>Measured</code>） |
| <a href="/reviews/weifeng/">微风网络</a> | 未明确限定（待核实/实测） | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料未明确限定专属客户端，2026-07-19 实测截图通过 VLESS 订阅导入 MiaoKo 测试。（<code>Measured</code>） |
| <a href="/reviews/xingdaomeng/">星岛梦</a> | 未明确限定（待核实/实测） | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · Trojan、Shadowsocks | 品牌资料未明确限制专属客户端，2026-08-11 实测通过 Shadowsocks 订阅节点测速。（<code>Measured</code>） |
| <a href="/reviews/ermao/">二猫云</a> | 自研 + 第三方通用 | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 配备独家定制客户端；正文提及 VLESS 协议，且 2026-08-11 截图显示 Shadowsocks 节点可测速，具体第三方订阅权限以官网为准。（<code>Measured</code>） |
| <a href="/reviews/weitu/">唯兔云</a> | 未明确限定（待核实/实测） | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · Trojan、Shadowsocks | 品牌资料未强制限制专属客户端，2026-08-11 实测通过 Shadowsocks 节点测速。（<code>Measured</code>） |
| <a href="/reviews/jilian/">极连云</a> | 自研 + 第三方通用 | <strong>明确兼容</strong>（支持通用订阅直接导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料明确支持自研客户端 + 第三方客户端，2026-08-11 晚高峰通过 Shadowsocks 测速。（<code>Measured</code>） |
| <a href="/reviews/guangnian/">光年梯</a> | 自研 + 第三方通用 | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 支持自研客户端 + 第三方订阅导入。（<code>Measured</code>） |
| <a href="/reviews/yifan/">一翻云</a> | 纯第三方通用 | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · Hysteria 2、VLESS-Reality、Shadowsocks | 提供 Hysteria 2 / VLESS-Reality / Shadowsocks 三协议，支持 Clash Verge Rev / v2rayN / Shadowrocket 等主流第三方客户端。（<code>Measured</code>） |
| <a href="/reviews/kexin/">可信云</a> | 纯第三方通用 | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 品牌资料标注支持第三方客户端。（<code>Measured</code>） |
| <a href="/reviews/sujie/">速界</a> | 自研 + 第三方通用 | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 支持自研客户端 + 第三方订阅导入。（<code>Measured</code>） |
| <a href="/reviews/tiziyun/">梯子云</a> | 自研 + 第三方通用 | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料同时提供自研全平台一键登录客户端与通用订阅导入（兼顾新手与进阶用户）。（<code>Vendor Data</code>） |
| <a href="/reviews/dalaoyun/">大佬云</a> | 自研 + 第三方通用 | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料标注支持自研客户端 + 第三方订阅导入。（<code>Vendor Data</code>） |
| <a href="/reviews/u1s1/">U1S1</a> | 未明确限定（待核实/实测） | <strong>需核对转换与协议</strong>（支持通用订阅，建议开启订阅转换并确认节点协议） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料未明确限定专属客户端，2026-08-11 晚高峰测速通过 Shadowsocks 节点完成。（<code>Measured</code>） |
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
