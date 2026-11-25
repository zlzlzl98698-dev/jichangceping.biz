---
title: Nikki 软路由 Mihomo 代理插件指南（要求 OpenWrt 24.10+）
seoTitle: Nikki OpenWrt 插件指南：面向 OpenWrt 24.10+ 的轻量 Mihomo 透明代理
description: Nikki 是面向 OpenWrt 24.10 及以上版本的轻量级 Mihomo 透明代理与策略管理插件，原生适配新版固件 nftables 与包管理体系，旧版固件不兼容。
schemaType: SoftwareApplication
software:
  name: Nikki
  applicationCategory: UtilitiesApplication
  operatingSystem:
    - OpenWrt 24.10+
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 data/clients.json、data/client-compatibility.json 与《2026 机场代理客户端大全》核验整理。
faq:
  - q: 为什么我的路由器刷了 OpenWrt 23.05 却安装不了 Nikki？
    a: 依据《2026 机场代理客户端大全》与 data/clients.json 明确提示，Nikki 官方项目强制要求 OpenWrt 24.10 及以上版本，旧版 OpenWrt 固件（如 21.02 / 22.03 / 23.05）无法直接兼容。
  - q: Nikki 和 OpenClash 该如何选择？
    a: 如果你的设备运行的是最新的 OpenWrt 24.10+ 官方或新版衍生固件，希望获得更轻量、原生贴合新版防火墙与包管理的 Mihomo 透明代理体验，可以选择 Nikki；若固件版本较老或需要极丰富的图形化微调选项，选择 OpenClash。
  - q: Nikki 支持哪些代理协议？
    a: 底层基于 Mihomo 内核，支持 Shadowsocks、VMess、VLESS、Trojan 与 Hysteria 2 等全部主流现代机场协议。
---
# Nikki 软路由插件技术档案与部署须知

<strong>核心结论（Answer-First）：</strong><strong>Nikki</strong> 是开源社区维护的轻量级 <strong>OpenWrt</strong> <strong>Mihomo</strong> 透明代理与策略管理插件，免费开源，支持 <code>Shadowsocks</code>、<code>VMess</code>、<code>VLESS</code>、<code>Trojan</code> 与 <code>Hysteria 2</code>。<strong>官方项目明确要求 OpenWrt 24.10 及以上版本，旧版固件（如 21.02/22.03/23.05）不兼容</strong>；且仅支持导入通用 Clash/Mihomo 订阅，不兼容 8 家 <code>exclusive-only</code> 机场。

## 1. 技术规格、官方渠道与注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 技术参数维度 | 核验规格（data/clients.json） | 选型与合规说明 |
| :--- | :--- | :--- |
| 软件名称与分类 | <strong>Nikki</strong> | OpenWrt 24.10+ Mihomo 代理插件 |
| 核心引擎 / 内核 | <code>Mihomo</code> | 决定订阅格式解析能力与新兴协议上限 |
| 支持操作系统 | OpenWrt | 共覆盖 1 个操作系统平台 |
| 支持代理协议 | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 实际可用节点协议以所购机场套餐下发为准 |
| 定价与开源状态 | <strong>免费开源</strong> | 付费商店版本受所属地区 App Store 政策影响 |
| 项目维护状态 | 开源社区维护 | 数据核验口径：Vendor Data |
| 官方获取渠道 | GitHub | 仅限核验官方仓库或正版应用商店，拒用未知搬运包 |
| 官方与测评注意事项 | 官方项目明确要求 OpenWrt 24.10 及以上版本，旧版固件不兼容 | 轻量级 Mihomo 透明代理与策略管理 |

## 2. Nikki 24.10+ 版本硬性门槛与五步部署实操

### 1. 为什么 Nikki 强制要求 OpenWrt 24.10+

传统 OpenWrt 代理插件为了照顾老旧版本，往往需要维护大量兼容 <code>iptables (fw3)</code> 与 <code>opkg</code> 的历史脚本，体积庞大且依赖关系复杂。<strong>Nikki</strong> 选择全面拥抱现代 OpenWrt 架构，原生贴合 <code>firewall4 (nftables)</code>、新版内核 <code>tproxy/tun</code> 接口与包管理体系，因此实现了极轻量、高效率的 Mihomo 透明代理调度。

> [!WARNING]
> <strong>官方强制版本红线</strong>（依据 <code>data/clients.json</code>）：<strong>官方项目明确要求 OpenWrt 24.10 及以上版本，旧版固件不兼容</strong>。在安装前务必登录路由器后台或 SSH 执行 <code>cat /etc/openwrt_release</code> 核实版本号；如果设备仍停留在 22.03 或 23.05 且暂不打算升级固件，请改用 <a href="/clients/openclash/">OpenClash</a> 或 <a href="/clients/passwall2/">PassWall2</a>。

### 2. 五步部署与网关防回环实操

1. <strong>核实固件版本与包格式（apk vs opkg）</strong>：确认系统为 OpenWrt 24.10+ 后，留意当前固件采用传统 <code>opkg</code> 还是新版 <code>apk</code> 包管理格式，以及路由器的精准 CPU 架构（如 <code>x86_64</code>、<code>aarch64_generic</code>），从官方 GitHub Releases 下载匹配包与 Mihomo 内核。
2. <strong>检查 nftables 与内核模块依赖</strong>：若通过 Firmware Selector / ImageBuilder 自编译精简固件，提前核对插件文档要求的 <code>kmod-tun</code>、<code>kmod-nft-tproxy</code> 等底层模块是否完整。
3. <strong>保持单插件独占运行</strong>：确认未启用其他代理插件，避免端口与透明转发链冲突。
4. <strong>导入 Clash / Mihomo 订阅并测试规则</strong>：在 Nikki 后台填入开放机场提供的 Clash YAML 订阅 URL，开启规则分流并确认国内网站与局域网 IP 正常直连。
5. <strong>放行路由器本机订阅更新流量</strong>：确认 TUN / TProxy 模式下路由器自身的出站策略与订阅域名解析正常，防止重启服务后无法自动更新机场订阅。

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
