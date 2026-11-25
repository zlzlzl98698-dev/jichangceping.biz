---
title: HomeProxy 软路由代理插件指南（OpenWrt sing-box 原生生态）
seoTitle: HomeProxy OpenWrt 插件指南：基于 sing-box 与 LuCI 的现代路由代理
description: HomeProxy 是基于 sing-box 内核与原生 LuCI 框架的 OpenWrt 路由代理管理插件，支持 VLESS、VMess、Trojan、Shadowsocks 与 Hysteria 2。
schemaType: SoftwareApplication
software:
  name: HomeProxy
  applicationCategory: UtilitiesApplication
  operatingSystem:
    - OpenWrt
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 data/clients.json、data/client-compatibility.json 与《2026 机场代理客户端大全》核验整理。
faq:
  - q: HomeProxy 与 PassWall2、OpenClash 相比有什么优势？
    a: HomeProxy 原生围绕 sing-box 单一核心和 OpenWrt 原生 firewall4 (nftables) 架构编写，代码整洁、无多核心冗余，非常适合已在固件中预置或希望纯正运行 sing-box 的现代 OpenWrt 用户。
  - q: 安装 HomeProxy 时需要检查什么依赖？
    a: 须确认固件版本与设备上安装的 sing-box 内核版本相互匹配，否则 sing-box 配置字段变动会导致服务无法启动。
  - q: 机场只提供 Clash 订阅能直接填进 HomeProxy 吗？
    a: 不能直接作为原样节点订阅加载（HomeProxy 解析节点订阅或 sing-box 配置），使用前需要机场提供标准节点/V2Ray 订阅链接或 sing-box 格式。
---
# HomeProxy 软路由插件指南（OpenWrt sing-box 原生生态）

<strong>核心结论（Answer-First）：</strong><strong>HomeProxy</strong> 是开源社区维护的 <strong>OpenWrt</strong> 现代路由代理插件，原生基于 <strong>sing-box</strong> 内核与 LuCI 框架构建，免费开源，支持 <code>VLESS</code>、<code>VMess</code>、<code>Trojan</code>、<code>Shadowsocks</code> 与 <code>Hysteria 2</code>。<strong>部署前须确认固件版本与 sing-box 内核依赖版本严格匹配</strong>，且需机场提供通用节点订阅或 sing-box 格式，无法导入 8 家 <code>exclusive-only</code> 机场。

## 1. 技术规格、官方渠道与注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 技术参数维度 | 核验规格（data/clients.json） | 选型与合规说明 |
| :--- | :--- | :--- |
| 软件名称与分类 | <strong>HomeProxy</strong> | OpenWrt sing-box 路由代理插件 |
| 核心引擎 / 内核 | <code>sing-box</code> | 决定订阅格式解析能力与新兴协议上限 |
| 支持操作系统 | OpenWrt | 共覆盖 1 个操作系统平台 |
| 支持代理协议 | VLESS、VMess、Trojan、Shadowsocks、Hysteria 2 | 实际可用节点协议以所购机场套餐下发为准 |
| 定价与开源状态 | <strong>免费开源</strong> | 付费商店版本受所属地区 App Store 政策影响 |
| 项目维护状态 | 开源社区维护 | 数据核验口径：Vendor Data |
| 官方获取渠道 | GitHub | 仅限核验官方仓库或正版应用商店，拒用未知搬运包 |
| 官方与测评注意事项 | 须确认固件版本与 sing-box 内核依赖版本匹配 | 原生基于 sing-box 与 LuCI 的现代 OpenWrt 路由代理管理 |

## 2. HomeProxy sing-box 依赖匹配与五步部署实操

### 1. 原生 LuCI + sing-box 单核设计定位

<strong>HomeProxy</strong> 常见于较新版本的 OpenWrt 与 ImmortalWrt 生态中。它不堆砌多余的历史兼容层，而是完全围绕单一高效的 <code>sing-box</code> 核心及现代 OpenWrt <code>firewall4 (nftables)</code> 架构编写，UI 简洁原生、内存与 CPU 调度开销较低，非常适合追求纯净 sing-box 软路由体验的用户。

> [!IMPORTANT]
> <strong>内核版本同步关键提醒</strong>（依据 <code>data/clients.json</code>）：<strong>须确认固件版本与 sing-box 内核依赖版本匹配</strong>。由于 sing-box 核心迭代很快，不同大版本间常出现配置字段变更或废弃，单独升级 HomeProxy 插件或单独替换 <code>sing-box</code> 主程序却不同步版本，极易导致配置校验失败无法启动。

### 2. 五步部署与订阅适配实操

1. <strong>核对固件与内核版本一致性</strong>：优先使用官方固件源或固件编译时已同步打包好的 HomeProxy 与 <code>sing-box</code> 组合；若手动更新 GitHub Releases，需按仓库说明同步更新 <code>sing-box</code> 二进制包及防火墙模块。
2. <strong>确认单透明代理插件运行</strong>：关闭同一台路由器中可能残留的其他透明代理插件，确保 <code>nftables</code> 与 DNS 转发端口不被占用。
3. <strong>准备节点订阅或 sing-box 配置</strong>：HomeProxy 直接导入标准 V2Ray/通用节点订阅链接（或原生 sing-box 配置）；如果所购机场只提供 Clash YAML 订阅，需先完成格式转换，或者直接使用 Mihomo 系软路由插件（OpenClash / Nikki）。
4. <strong>配置大陆直连与规则集</strong>：启用内置或更新配套的 <code>.srs</code> 规则集，确保大陆流量及局域网私网段直连，海外 AI 与流媒体流量按组转发。
5. <strong>查看系统日志排查启动报错</strong>：若启动后无代理效果或服务立刻停止，打开 HomeProxy 日志面板核对 sing-box 核心返回的 JSON 字段提示，按需修正冲突配置。

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
