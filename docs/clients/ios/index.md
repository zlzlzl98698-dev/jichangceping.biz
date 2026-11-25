---
title: iOS（iPhone / iPad）代理客户端大全与商店付费防坑指南
seoTitle: iOS 苹果机场客户端指南：Shadowrocket、Stash、Surge 与免费方案
description: 2026 年 iOS (iPhone/iPad) 代理客户端全面对比，涵盖 Shadowrocket、Stash、Quantumult X、Surge 5 付费说明，Hiddify/Karing/Clash Mi/SFI 免费方案及共享 Apple ID 风险预警。
schemaType: CollectionPage
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 sources/brand-info/第三方代理客户端.txt 与 data/clients.json 核验整理。
faq:
  - q: iOS 端所有代理客户端都是付费的吗？
    a: 并非全部付费。Shadowrocket（小火箭）、Stash 和 Quantumult X 在美国等非国区 App Store 显示为付费应用，Surge 5 含应用内购买授权；而 Karing、Clash Mi、sing-box (SFI)、Hiddify 与 Streisand 在对应上架地区为免费应用（实际价格与上架状态以所属地区 App Store 为准）。
  - q: Potatso 和 OneClick 免费又简单，为什么不推荐作为主力？
    a: 依据 data/clients.json 核验记录，Potatso 仅支持 Shadowsocks/SSR/SOCKS/HTTP(S)，OneClick 仅支持 VMess/Shadowsocks/Trojan，两者均不支持 VLESS 与 Hysteria 2 等现代主流协议，在现代机场中的兼容性十分有限。
  - q: 如果我买的是飞猫云或隐形人这类专属客户端机场，iPhone 上怎么下载？
    a: exclusive-only 品牌不提供订阅链接，也无法用 Shadowrocket，需要按机场官网指引通过 TestFlight、企业签名或专属商店路径安装其官方 iOS 客户端（需注意各品牌官网实时指引）。
---
# iOS（iPhone / iPad）代理客户端大全与商店付费防坑指南

<strong>核心结论（Answer-First）：</strong>iOS 端机场通用性最高的是美国等非国区 App Store 付费买断应用 <strong>Shadowrocket（小火箭）</strong>，习惯 Clash 策略组与覆写可选付费应用 <strong>Stash</strong>，深度脚本重写选 <strong>Quantumult X</strong>，专业抓包调试选 <strong>Surge 5</strong>；若希望免费使用且所属地区商店可下载，可选 <strong>Karing</strong>、<strong>Clash Mi</strong>、<strong>sing-box (SFI)</strong>、<strong>Hiddify</strong> 或 <strong>Streisand</strong>。严禁登录他人共享 Apple ID 防止锁机，且 Potatso、OneClick 不支持 VLESS 与 Hysteria 2。

## 1. 客户端技术规格与安全注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 客户端名称 | 核心引擎 | 支持系统 | 支持协议 | 定价 / 开源状态 | 维护状态 | 官方渠道 | 注意事项 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| <a href="/clients/shadowrocket/">Shadowrocket（小火箭）</a> | <code>自研 iOS 网络扩展引擎</code> | iOS | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 付费应用（美国区等非国区 App Store 买断，以当地商店标价为准） | 持续活跃更新 | App Store | 中国区 App Store 未上架，且属于付费应用，需避免购买来源不明的共享账号 |
| <a href="/clients/stash/">Stash</a> | <code>Clash 兼容规则引擎</code> | iOS | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 付费应用（以所属地区 App Store 标价为准） | 持续更新 | App Store | 美国等 App Store 显示为付费应用 |
| <a href="/clients/quantumult-x/">Quantumult X（圈 X）</a> | <code>自研规则与脚本引擎</code> | iOS | Shadowsocks、VMess、Trojan、VLESS | 付费应用（以所属地区 App Store 标价为准） | 持续运营 | App Store | 付费应用且订阅格式与 Clash 不同，部分机场需开启 QX 转换参数 |
| <a href="/clients/surge/">Surge (Surge 5 / Surge Mac)</a> | <code>Surge 自研高性能网络引擎</code> | iOS / macOS | Shadowsocks、VMess、Trojan、Hysteria 2 | 付费授权 / 含应用内购买 | 商业软件持续维护 | App Store / 官网 | 授权价格较高且部分新兴协议支持节奏与开源客户端不同 |
| <a href="/clients/sing-box/">sing-box 官方客户端 (SFA / SFI / SFM / Desktop)</a> | <code>sing-box</code> | Android / iOS / macOS / Linux | VLESS、VMess、Trojan、Shadowsocks、Hysteria 2、AnyTLS | 免费开源 | 官方核心持续维护 | 官方文档 / App Store | 部分机场仅提供 Clash YAML 或 V2Ray 订阅，原生 sing-box JSON 可能需要转换 |
| <a href="/clients/karing/">Karing</a> | <code>sing-box</code> | Windows / Android / iOS / macOS / Linux | VLESS、VMess、Trojan、Shadowsocks、Hysteria 2 | 免费（App Store 上架情况以地区为准） | 持续活跃（有可核实跨平台项目资料） | GitHub / App Store | iOS 端获取需注意所属 App Store 地区可用性 |
| <a href="/clients/clash-mi/">Clash Mi</a> | <code>Mihomo</code> | Windows / Android / iOS / macOS / Linux | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 免费（iOS 端以 App Store 地区页面为准） | 持续活跃（有可核实跨平台项目资料） | GitHub / App Store | 使用 Mihomo 配置前建议确认机场订阅支持 Clash 格式 |
| <a href="/clients/hiddify/">Hiddify</a> | <code>sing-box</code> | Windows / Android / iOS / macOS / Linux | VLESS、VMess、Trojan、Shadowsocks、Hysteria 2 | 免费开源 | 持续活跃（有可核实跨平台项目资料） | GitHub | 不同订阅格式转换时建议核对分流规则默认策略 |
| <strong>Streisand</strong> | <code>多协议核心</code> | iOS | VLESS、VMess、Trojan、Hysteria、Shadowsocks | 免费（以所属地区 App Store 为准） | App Store 维护 | App Store | 高级分流策略功能不如 Shadowrocket / Stash 丰富 |
| <strong>OneClick</strong> | <code>轻量代理核心</code> | iOS | VMess、Shadowsocks、Trojan | 免费（以所属地区 App Store 为准） | App Store 上架 | App Store | 不支持 VLESS 与 Hysteria 2 等新协议 |
| <strong>Potatso</strong> | <code>轻量代理核心</code> | iOS | Shadowsocks、SSR、SOCKS、HTTP(S) | 免费 / 含地区商店差异 | 基础维护 | App Store | 不支持 VLESS 或 Hysteria 2 等新协议，现代机场兼容性较有限 |

## 2. iOS 沙盒机制、付费差异与安全配置步骤

### 1. App Store 地区差异与收费核验

由于苹果沙盒及合规要求，所有 iOS 代理软件均需通过 <code>NetworkExtension</code> 框架运行（系统对网络扩展进程存在约 50MB 内存上限），且中国大陆区 App Store 未上架上述代理工具。依据 <code>data/clients.json</code>：
- <strong>付费买断与商业授权类</strong>：<strong>Shadowrocket（小火箭）</strong>、<strong>Stash</strong>、<strong>Quantumult X</strong> 在美国等非国区 App Store 显示为付费应用，<strong>Surge 5</strong> 为付费授权 / 含应用内购买，实际标价与上架状态均以用户所属地区 App Store 页面为准。
- <strong>免费替代与协议局限</strong>：<strong>Karing</strong>、<strong>Clash Mi</strong>、<strong>sing-box (SFI)</strong>、<strong>Hiddify</strong>、<strong>Streisand</strong> 在对应上架地区为免费应用；而同样免费的 <strong>Potatso</strong>（仅支持 SS/SSR/SOCKS/HTTP(S)）与 <strong>OneClick</strong>（仅支持 VMess/SS/Trojan）均<strong>不支持 VLESS 与 Hysteria 2</strong> 等现代协议，不建议作为主力使用。

> [!WARNING]
> <strong>账号安全红线</strong>：切勿为了下载 Shadowrocket 或 Stash 而在 iPhone“设置 → Apple ID”中登录网上购买或免费的共享账号，极易触发账号锁定或被恶意开启丢失模式勒索。务必自行注册外区 Apple ID 并通过正规礼品卡充值购买。

### 2. iOS 客户端五步配置实操

1. <strong>仅在 App Store 媒体与购买项目切换外区账号</strong>：完成下载后即可切回主力国区账号，全程不要修改系统主 iCloud 登录状态。
2. <strong>按机场协议选定客户端</strong>：若机场提供 VLESS-Reality、Hysteria 2 或 AnyTLS 节点，优先使用 <a href="/clients/shadowrocket/">Shadowrocket</a>、<a href="/clients/stash/">Stash</a>、<a href="/clients/karing/">Karing</a> 或 <a href="/clients/sing-box/">sing-box (SFI)</a>；若使用 <a href="/clients/quantumult-x/">Quantumult X</a> 须在机场后台开启 QX 转换参数；若使用 <a href="/clients/surge/">Surge 5</a> 需提前核对协议支持情况。
3. <strong>控制规则集体积防内存溢出</strong>：避免导入动辄数万条复杂正则的超重规则集，优先采用轻量化分流规则或 <code>.srs</code> 二进制规则集，防止超出 NetworkExtension 内存限制导致自动断线。
4. <strong>开启连通性测速替代 ICMP Ping</strong>：在客户端内将延迟测试改为 TCP/HTTP <code>CONNECT</code> 连通性测试，避免虚假低延迟误导选点。
5. <strong>核对机场专属端限制</strong>：购买 <code>exclusive-only</code> 品牌前，确认其官方 iOS 安装渠道（TestFlight 或企业签名稳定性），因为它们无法导入任何第三方 iOS 客户端。

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
| <a href="/reviews/guangsuyun/">光速云</a> | 自研 + 第三方通用 | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks、AnyTLS | 提供自研客户端，同时支持 Clash、Shadowrocket 等第三方客户端订阅导入。（<code>Measured</code>） |
| <a href="/reviews/weifeng/">微风网络</a> | 未明确限定（待核实/实测） | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料未明确限定专属客户端，2026-07-19 实测截图通过 VLESS 订阅导入 MiaoKo 测试。（<code>Measured</code>） |
| <a href="/reviews/xingdaomeng/">星岛梦</a> | 未明确限定（待核实/实测） | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · Trojan、Shadowsocks | 品牌资料未明确限制专属客户端，2026-08-11 实测通过 Shadowsocks 订阅节点测速。（<code>Measured</code>） |
| <a href="/reviews/ermao/">二猫云</a> | 自研 + 第三方通用 | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 配备独家定制客户端；正文提及 VLESS 协议，且 2026-08-11 截图显示 Shadowsocks 节点可测速，具体第三方订阅权限以官网为准。（<code>Measured</code>） |
| <a href="/reviews/weitu/">唯兔云</a> | 未明确限定（待核实/实测） | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · Trojan、Shadowsocks | 品牌资料未强制限制专属客户端，2026-08-11 实测通过 Shadowsocks 节点测速。（<code>Measured</code>） |
| <a href="/reviews/jilian/">极连云</a> | 自研 + 第三方通用 | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料明确支持自研客户端 + 第三方客户端，2026-08-11 晚高峰通过 Shadowsocks 测速。（<code>Measured</code>） |
| <a href="/reviews/guangnian/">光年梯</a> | 自研 + 第三方通用 | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 支持自研客户端 + 第三方订阅导入。（<code>Measured</code>） |
| <a href="/reviews/yifan/">一翻云</a> | 纯第三方通用 | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · Hysteria 2、VLESS-Reality、Shadowsocks | 提供 Hysteria 2 / VLESS-Reality / Shadowsocks 三协议，支持 Clash Verge Rev / v2rayN / Shadowrocket 等主流第三方客户端。（<code>Measured</code>） |
| <a href="/reviews/kexin/">可信云</a> | 纯第三方通用 | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 品牌资料标注支持第三方客户端。（<code>Measured</code>） |
| <a href="/reviews/sujie/">速界</a> | 自研 + 第三方通用 | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 支持自研客户端 + 第三方订阅导入。（<code>Measured</code>） |
| <a href="/reviews/tiziyun/">梯子云</a> | 自研 + 第三方通用 | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料同时提供自研全平台一键登录客户端与通用订阅导入（兼顾新手与进阶用户）。（<code>Vendor Data</code>） |
| <a href="/reviews/dalaoyun/">大佬云</a> | 自研 + 第三方通用 | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料标注支持自研客户端 + 第三方订阅导入。（<code>Vendor Data</code>） |
| <a href="/reviews/u1s1/">U1S1</a> | 未明确限定（待核实/实测） | <strong>兼容 iOS 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料未明确限定专属客户端，2026-08-11 晚高峰测速通过 Shadowsocks 节点完成。（<code>Measured</code>） |
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
