---
title: PassWall2 软路由多核心代理插件指南（OpenWrt）
seoTitle: PassWall2 安装与特性：支持 Xray 与 sing-box 的 OpenWrt 透明代理插件
description: PassWall2 是基于 Xray 与 sing-box 多核心的 OpenWrt 透明代理插件，支持节点管理、分流规则、VLESS/Hysteria 2 协议与局域网设备访问控制。
schemaType: SoftwareApplication
software:
  name: PassWall2
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
  - q: PassWall2 和 OpenClash 的核心差异是什么？
    a: OpenClash 围绕 Mihomo/Clash YAML 规则生态构建，适合直接套用机场下发的 Clash 订阅与策略组；PassWall2 底层调用 Xray 与 sing-box 核心，擅长原生单节点管理、多核心协议（如 VLESS-Reality、Hysteria 2）调度与精细的局域网设备分流控制。
  - q: 机场只给 Clash 订阅，PassWall2 能用吗？
    a: 许多机场后台同时提供 V2Ray/通用节点订阅链接（Base64），可直接导入 PassWall2；若机场仅输出 Clash YAML，需使用支持 Clash YAML 转节点或改用 OpenClash / Nikki。
  - q: 安装 PassWall2 时最容易踩的坑是什么？
    a: 最常见的问题是下载了不匹配当前路由器 CPU 架构或 OpenWrt 内核版本的 ipk/apk 依赖包，以及与设备上残留的另一套透明代理插件发生防火墙端口冲突。
---
# PassWall2 软路由多核心代理插件指南（OpenWrt）

<strong>核心结论（Answer-First）：</strong><strong>PassWall2</strong> 是开源社区维护的 <strong>OpenWrt</strong> 多核心透明代理插件，可同时调用 <strong>Xray</strong> 与 <strong>sing-box</strong> 核心，支持 <code>VLESS</code>、<code>VMess</code>、<code>Trojan</code>、<code>Shadowsocks</code> 与 <code>Hysteria 2</code>，擅长原生节点管理、精细分流与局域网设备访问控制（ACL）。<strong>安装前须匹配路由器 CPU 架构与固件内核依赖</strong>，切勿与其他插件并行启动，且不兼容 8 家专属端机场。

## 1. 技术规格、官方渠道与注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 技术参数维度 | 核验规格（data/clients.json） | 选型与合规说明 |
| :--- | :--- | :--- |
| 软件名称与分类 | <strong>PassWall2</strong> | OpenWrt 多核心透明代理插件 |
| 核心引擎 / 内核 | <code>Xray / sing-box</code> | 决定订阅格式解析能力与新兴协议上限 |
| 支持操作系统 | OpenWrt | 共覆盖 1 个操作系统平台 |
| 支持代理协议 | VLESS、VMess、Trojan、Shadowsocks、Hysteria 2 | 实际可用节点协议以所购机场套餐下发为准 |
| 定价与开源状态 | <strong>免费开源</strong> | 付费商店版本受所属地区 App Store 政策影响 |
| 项目维护状态 | 开源社区维护 | 数据核验口径：Vendor Data |
| 官方获取渠道 | GitHub | 仅限核验官方仓库或正版应用商店，拒用未知搬运包 |
| 官方与测评注意事项 | 须匹配路由器架构与固件内核依赖 | 支持节点管理、多核心分流透明代理与局域网设备访问控制 |

## 2. PassWall2 多核心调度、硬件负载与五步配置实操

### 1. Xray / sing-box 多核心与单节点精准控制

相较于围绕 Clash YAML 策略组运作的 OpenClash，<strong>PassWall2</strong> 原生面向 <code>Xray</code> 与 <code>sing-box</code> 节点与分流规则架构设计，界面更贴合“节点列表 + 独立分流规则 + 局域网设备 ACL 控制”。例如你可以指定客厅 Apple TV 固定走台湾节点、书房电脑走日本节点，而卧室手机走自动切换节点。

> [!IMPORTANT]
> <strong>固件依赖与硬件算力提示</strong>（依据 <code>data/clients.json</code>）：安装前<strong>须匹配路由器架构与固件内核依赖</strong>（<code>xray-core</code>、<code>sing-box</code> 及 <code>kmod-nft-tproxy</code> / <code>iptables</code> 模块）。同时注意，Xray/sing-box 运行加密隧道（特别是 Hysteria 2 高吞吐或 TLS 握手）对路由器 CPU 算力有一定要求，百兆以上大带宽家庭建议采用 x86 或高性能 ARM64 软路由。

### 2. 五步部署与分流控制实操

1. <strong>匹配架构源安装插件与核心</strong>：确认路由器架构与 OpenWrt 固件版本号后，通过 GitHub Releases 或固件配套源安装 PassWall2 及其依赖的 <code>xray-core</code> / <code>sing-box</code>。
2. <strong>关闭冲突代理插件</strong>：确保固件中未开启 OpenClash、Nikki 或 HomeProxy 的自启动开关，防止透明转发链打架。
3. <strong>导入通用节点订阅（Base64 / 通用节点）</strong>：PassWall2 直接解析标准 V2Ray / Xray / Hysteria 2 / SS 节点订阅链接；若机场后台仅提供 Clash YAML，须寻找机场的通用节点订阅入口或改用 OpenClash。
4. <strong>配置分流规则与负载均衡</strong>：在“分流节点”配置中国大陆直连、常见海外 AI 与流媒体分组，并可借助 sing-box 核心实现 Hysteria 2 或 VLESS-Reality 节点的高效调度。
5. <strong>按设备设置访问控制（ACL）</strong>：在“访问控制”页为局域网内不需要走代理的智能家居设备、电视盒子或下载机设定“不走代理”，节省主节点流量并保障稳定。

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
