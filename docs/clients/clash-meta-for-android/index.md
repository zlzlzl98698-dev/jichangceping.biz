---
title: Clash Meta for Android 安卓规则代理客户端指南
seoTitle: Clash Meta for Android (CMFA) 下载与配置：安卓 Mihomo 客户端
description: Clash Meta for Android 是基于 Mihomo (Clash Meta) 内核的开源安卓客户端，完整支持 Clash YAML 规则分流配置与 VLESS、Hysteria 2 等现代协议。
schemaType: SoftwareApplication
software:
  name: Clash Meta for Android
  applicationCategory: UtilitiesApplication
  operatingSystem:
    - Android
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 data/clients.json、data/client-compatibility.json 与《2026 机场代理客户端大全》核验整理。
faq:
  - q: Clash Meta for Android 和旧版 Clash for Android 有什么区别？
    a: 原 Clash for Android 已停止维护且不支持 VLESS/Hysteria 2 等新协议；Clash Meta for Android 基于 Mihomo (Clash Meta) 内核延续维护，兼容现代机场下发的新协议 Clash 订阅。
  - q: 安卓上 Clash Meta for Android 和 FlClash 选哪个？
    a: 两者都使用 Mihomo 内核。Clash Meta for Android 贴合传统安卓原生 Material 交互，分应用代理等细节完善；FlClash 界面更现代简洁且与 Windows/macOS 端保持一致。
  - q: 从哪里下载 Clash Meta for Android 才安全？
    a: 务必仅从官方 GitHub Releases 页面下载 APK 安装包，切勿轻信任何第三方渠道、网盘或应用商店内的修改版/山寨同名应用。
---
# Clash Meta for Android 安卓规则代理客户端指南

<strong>核心结论（Answer-First）：</strong><strong>Clash Meta for Android（CMFA）</strong>是基于 <strong>Mihomo (Clash Meta)</strong> 内核的免费开源安卓规则客户端，完整支持 Clash YAML 策略组配置与 <code>Shadowsocks</code>、<code>VMess</code>、<code>VLESS</code>、<code>Trojan</code>、<code>Hysteria 2</code> 等现代协议。<strong>务必仅从官方 GitHub Release 获取安装包，勿轻信第三方渠道修改版</strong>；不兼容 8 家 <code>exclusive-only</code> 专属端机场。

## 1. 技术规格、官方渠道与注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 技术参数维度 | 核验规格（data/clients.json） | 选型与合规说明 |
| :--- | :--- | :--- |
| 软件名称与分类 | <strong>Clash Meta for Android</strong> | 安卓 Mihomo 规则客户端 |
| 核心引擎 / 内核 | <code>Mihomo (Clash Meta)</code> | 决定订阅格式解析能力与新兴协议上限 |
| 支持操作系统 | Android | 共覆盖 1 个操作系统平台 |
| 支持代理协议 | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 实际可用节点协议以所购机场套餐下发为准 |
| 定价与开源状态 | <strong>免费开源</strong> | 付费商店版本受所属地区 App Store 政策影响 |
| 项目维护状态 | 开源社区发布（GitHub） | 数据核验口径：Vendor Data |
| 官方获取渠道 | GitHub | 仅限核验官方仓库或正版应用商店，拒用未知搬运包 |
| 官方与测评注意事项 | 请从官方 GitHub Release 获取安装包，勿轻信第三方渠道修改版 | 支持完整 Clash YAML 规则分流配置 |

## 2. CMFA 官方渠道核验、访问控制与五步配置实操

### 1. 延续原生安卓 Clash 逻辑的现代 Mihomo 客户端

原版 Clash for Android 停止维护并下架后，不支持 VLESS 与 Hysteria 2 等新协议。<strong>Clash Meta for Android（CMFA）</strong>接棒引入完整的 <strong>Mihomo (Clash Meta)</strong> 内核，保留了经典安卓 Clash 原生 Material 交互逻辑与高度可控的“覆写/访问控制”设置，在需要精细化 Clash YAML 分流策略的安卓用户群中依然保有稳定口碑。

> [!CAUTION]
> <strong>安装包来源高危警示</strong>（依据 <code>data/clients.json</code>）：<strong>请从官方 GitHub Release 获取安装包，勿轻信第三方渠道修改版</strong>。由于 Clash 名称在中文搜索与网盘流传广泛，部分第三方站点打包的所谓“中文加速版/破解版”极易植入广告 SDK 甚至劫持流量，下载后务必核对仓库地址与包签名。

### 2. 安卓五步配置与后台保活实操

1. <strong>核对官方 Release 架构包</strong>：在官方 GitHub Releases 选择匹配设备架构的 APK（现代手机选 <code>arm64-v8a</code>，通用选 <code>universal</code>）完成安装。
2. <strong>导入 Clash YAML 订阅配置</strong>：点击“配置 → 新配置 → 从 URL 导入”，粘贴机场后台的 Clash 订阅链接，建议设置“自动更新间隔”为 1440 分钟（24 小时）以自动同步节点变更。
3. <strong>启用配置文件并切换规则模式</strong>：勾选刚刚导入的配置后返回首页启动代理服务，并在“代理”页确认出站模式为 <strong>规则（Rule）</strong>。
4. <strong>设置分应用代理访问控制</strong>：进入“设置 → 覆写 → 访问控制模式”，选择“不允许已选择的应用”并勾选手机银行、微信、支付宝及本地生活软件，实现更纯净的国内直连体验。
5. <strong>开启“绕过私有网络地址”与电池白名单</strong>：在“设置 → 网络”保持开启绕过私有地址与系统 DNS 优化，并在手机系统电池管理中允许应用无限制后台运行。

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
| <a href="/reviews/guangsuyun/">光速云</a> | 自研 + 第三方通用 | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks、AnyTLS | 提供自研客户端，同时支持 Clash、Shadowrocket 等第三方客户端订阅导入。（<code>Measured</code>） |
| <a href="/reviews/weifeng/">微风网络</a> | 未明确限定（待核实/实测） | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料未明确限定专属客户端，2026-07-19 实测截图通过 VLESS 订阅导入 MiaoKo 测试。（<code>Measured</code>） |
| <a href="/reviews/xingdaomeng/">星岛梦</a> | 未明确限定（待核实/实测） | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Trojan、Shadowsocks | 品牌资料未明确限制专属客户端，2026-08-11 实测通过 Shadowsocks 订阅节点测速。（<code>Measured</code>） |
| <a href="/reviews/ermao/">二猫云</a> | 自研 + 第三方通用 | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 配备独家定制客户端；正文提及 VLESS 协议，且 2026-08-11 截图显示 Shadowsocks 节点可测速，具体第三方订阅权限以官网为准。（<code>Measured</code>） |
| <a href="/reviews/weitu/">唯兔云</a> | 未明确限定（待核实/实测） | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Trojan、Shadowsocks | 品牌资料未强制限制专属客户端，2026-08-11 实测通过 Shadowsocks 节点测速。（<code>Measured</code>） |
| <a href="/reviews/jilian/">极连云</a> | 自研 + 第三方通用 | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料明确支持自研客户端 + 第三方客户端，2026-08-11 晚高峰通过 Shadowsocks 测速。（<code>Measured</code>） |
| <a href="/reviews/guangnian/">光年梯</a> | 自研 + 第三方通用 | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 支持自研客户端 + 第三方订阅导入。（<code>Measured</code>） |
| <a href="/reviews/yifan/">一翻云</a> | 纯第三方通用 | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Hysteria 2、VLESS-Reality、Shadowsocks | 提供 Hysteria 2 / VLESS-Reality / Shadowsocks 三协议，支持 Clash Verge Rev / v2rayN / Shadowrocket 等主流第三方客户端。（<code>Measured</code>） |
| <a href="/reviews/kexin/">可信云</a> | 纯第三方通用 | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 品牌资料标注支持第三方客户端。（<code>Measured</code>） |
| <a href="/reviews/sujie/">速界</a> | 自研 + 第三方通用 | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 支持自研客户端 + 第三方订阅导入。（<code>Measured</code>） |
| <a href="/reviews/tiziyun/">梯子云</a> | 自研 + 第三方通用 | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料同时提供自研全平台一键登录客户端与通用订阅导入（兼顾新手与进阶用户）。（<code>Vendor Data</code>） |
| <a href="/reviews/dalaoyun/">大佬云</a> | 自研 + 第三方通用 | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料标注支持自研客户端 + 第三方订阅导入。（<code>Vendor Data</code>） |
| <a href="/reviews/u1s1/">U1S1</a> | 未明确限定（待核实/实测） | <strong>兼容通用订阅</strong>（按 Clash/V2Ray/sing-box 格式适配导入） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料未明确限定专属客户端，2026-08-11 晚高峰测速通过 Shadowsocks 节点完成。（<code>Measured</code>） |
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
