---
title: OpenClash 软路由插件指南（OpenWrt Clash / Mihomo 透明代理）
seoTitle: OpenClash 安装前核验指南：OpenWrt 软路由架构、防火墙与内核兼容说明
description: OpenClash 是 OpenWrt 软路由端生态最成熟的 Mihomo/Clash 规则代理插件，支持订阅转换、规则分流与全网透明代理，安装前须核对固件版本、CPU 架构与防火墙依赖。
schemaType: SoftwareApplication
software:
  name: OpenClash
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
  - q: 安装 OpenClash 前必须检查哪些固件环境条件？
    a: 路由器环境与 PC/手机不同，安装前必须依次确认 OpenWrt 版本、路由器 CPU 架构（x86_64 / aarch64 / mipsel 等）、包管理器（opkg 或新版的 apk），以及内核与防火墙后端（firewall3 iptables 还是 firewall4 nftables）依赖是否匹配。
  - q: 为什么 OpenClash 不能导入飞猫云或隐形人的服务？
    a: OpenClash 必须依赖机场下发通用 Clash/Mihomo 订阅链接。飞猫云、隐形人、无忧链接、Firefly、灵猫网络、SOGO 云、闪跃、全球云属于 exclusive-only 仅限专属客户端模式（SOGO 云除外其注明自研客户端含部分软路由），无法直接导入 OpenClash。
  - q: OpenClash 和 Nikki 都是 Mihomo 核心，区别在哪里？
    a: OpenClash 历史悠久、插件配置项极丰富、支持广泛版本的 OpenWrt 固件；Nikki 设计更轻量，但官方明确要求 OpenWrt 24.10 及以上版本。
---
# OpenClash 软路由插件指南（OpenWrt Clash / Mihomo 透明代理）

<strong>核心结论（Answer-First）：</strong><strong>OpenClash</strong> 是 <strong>OpenWrt</strong> 软路由端生态最成熟的开源规则代理插件，基于 <strong>Mihomo / Clash</strong> 内核，支持 <code>Shadowsocks</code>、<code>VMess</code>、<code>VLESS</code>、<code>Trojan</code> 与 <code>Hysteria 2</code>，可实现全屋设备无感透明代理。<strong>安装前必须确认 OpenWrt 版本、CPU 架构、包管理器（opkg/apk）及防火墙依赖</strong>，严禁与其他透明代理插件同时启用，且不兼容 8 家专属端机场。

## 1. 技术规格、官方渠道与注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 技术参数维度 | 核验规格（data/clients.json） | 选型与合规说明 |
| :--- | :--- | :--- |
| 软件名称与分类 | <strong>OpenClash</strong> | OpenWrt 软路由规则代理插件 |
| 核心引擎 / 内核 | <code>Mihomo / Clash</code> | 决定订阅格式解析能力与新兴协议上限 |
| 支持操作系统 | OpenWrt | 共覆盖 1 个操作系统平台 |
| 支持代理协议 | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 实际可用节点协议以所购机场套餐下发为准 |
| 定价与开源状态 | <strong>免费开源</strong> | 付费商店版本受所属地区 App Store 政策影响 |
| 项目维护状态 | 开源社区维护 | 数据核验口径：Vendor Data |
| 官方获取渠道 | GitHub | 仅限核验官方仓库或正版应用商店，拒用未知搬运包 |
| 官方与测评注意事项 | 安装前须确认 OpenWrt 版本、CPU 架构、包管理器及防火墙依赖 | 软路由端生态最成熟，支持订阅转换、规则分流与全网透明代理 |

## 2. OpenClash 部署五项前置核验与排障实操

### 1. 软路由部署五项前置核验（必查）

依据 <code>data/clients.json</code> 警告，OpenClash 安装前不能直接照搬他人教程命令，<strong>必须依次核实以下五项环境条件</strong>：
1. <strong>OpenWrt 固件版本</strong>：确认属于 21.02、22.03、23.05 还是 24.10+（或对应 ImmortalWrt 版本）。
2. <strong>路由器 CPU 架构</strong>：通过 <code>uname -m</code> 与包管理器架构查询确认是 <code>x86_64</code>、<code>aarch64_generic</code>、<code>aarch64_cortex-a53</code> 还是其他嵌入式架构，插件包与 Mihomo 内核二进制必须严丝合缝。
3. <strong>包管理器类型</strong>：OpenWrt 24.10 及之后逐步使用 <code>apk</code>，旧版使用 <code>opkg</code>，二者包后缀与安装指令完全不同。
4. <strong>防火墙与内核依赖</strong>：22.03+ 默认采用 <code>firewall4 (nftables)</code>，须确保系统已备齐 <code>kmod-tun</code>、<code>kmod-nft-tproxy</code>（旧版 fw3 为 iptables 对应模块）及 <code>dnsmasq-full</code>。
5. <strong>闪存空间余量</strong>：确保 <code>/overlay</code> 具备足够空间存放 LuCI 插件、Mihomo 内核以及 GeoIP/GeoSite 规则文件。

### 2. 五步部署与网关稳定运行实操

1. <strong>清理并禁用其他透明代理插件</strong>：安装启动 OpenClash 前，确保路由器内未启用 PassWall2、Nikki 或 HomeProxy，严防 <code>dnsmasq</code> 与 <code>nftables</code> 端口劫持冲突导致全屋断网。
2. <strong>配置并更新 Mihomo Meta 内核</strong>：在“插件设置 → 版本更新”中确保使用的是持续维护的 <code>Mihomo (Clash Meta)</code> 内核，以完整支持 VLESS-Reality 与 Hysteria 2。
3. <strong>导入开放机场 Clash 订阅</strong>：在“配置订阅”添加机场 Clash YAML URL（推荐搭配不限设备数开放机场如光速云、星岛梦、二猫云、唯兔云），避免使用 <code>exclusive-only</code> 专属端品牌。
4. <strong>选择合适运行模式（Fake-IP vs Redir-Host）</strong>：普通家庭上网采用 Fake-IP（增强）响应更快；若局域网内有 NAS PT 下载、部分国内银行 App 或游戏主机对 Fake-IP 敏感，可切换为 Redir-Host 模式或完善 Fake-IP 过滤名单。
5. <strong>验证 DNS 劫持与局域网直连</strong>：测试国内网站延迟与微信图片加载速度，确保“绕过中国大陆 IP”开关正常生效。

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
