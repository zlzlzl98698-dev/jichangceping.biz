---
title: Mihomo 内核与 Mihomo Party 生态及维护状态说明
seoTitle: Mihomo (Clash Meta) 内核生态解析与 Mihomo Party 维护状态提示
description: 解析 Mihomo (Clash Meta) 开源代理内核在 Clash Verge Rev、FlClash、OpenClash、Nikki 中的核心作用，并按官方资料说明 Mihomo Party 的维护状态核实警示。
schemaType: SoftwareApplication
software:
  name: Mihomo & Mihomo Party
  applicationCategory: UtilitiesApplication
  operatingSystem:
    - Windows
    - macOS
    - Linux
    - Android
    - OpenWrt
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 data/clients.json 与 sources/brand-info/第三方代理客户端.txt 核验整理。
faq:
  - q: Mihomo 和 Clash Meta 是同一个东西吗？
    a: 是的。原 Clash 内核停更后，Clash Meta 接棒演进并更名为 Mihomo。它是一个无图形界面的核心引擎，被 Clash Verge Rev、FlClash、Clash Mi、Clash Nyanpasu、OpenClash 和 Nikki 等众多图形客户端调用。
  - q: 为什么本站不建议直接把 Mihomo Party 当作首选客户端？
    a: 根据《2026 机场代理客户端大全》与 data/clients.json 核验记录，Mihomo Party 需单独关注项目维护状态，不宜未经核实即标为持续更新首选。对于新装机用户，建议优先选择持续活跃的 Clash Verge Rev 或 FlClash。
  - q: Mihomo 内核支持哪些最新协议？
    a: 较新版本的 Mihomo 内核支持 Shadowsocks、VMess、VLESS（含 Reality）、Trojan、Hysteria 2 以及 AnyTLS 等协议。
---
# Mihomo 内核生态与 Mihomo Party 技术档案

<strong>核心结论（Answer-First）：</strong><strong>Mihomo（原 Clash Meta）</strong>是现代 Clash 生态的底层开源核心引擎，支持 <code>Shadowsocks</code>、<code>VMess</code>、<code>VLESS</code>、<code>Trojan</code>、<code>Hysteria 2</code> 与 <code>AnyTLS</code>，驱动着 Clash Verge Rev、FlClash、OpenClash 与 Nikki 等主流图形端；而同名桌面配置端 <strong>Mihomo Party 在资料中被特别提示“需单独核实维护状态，不宜未经核实即标为持续更新首选”</strong>，建议新装机优先选择 Clash Verge Rev 或 FlClash。

## 1. Mihomo 内核客户端家族与 Mihomo Party 规格矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 客户端 / 项目 | 核心引擎 | 支持系统 | 支持协议 | 定价 / 开源状态 | 维护状态 | 官方渠道 | 注意事项 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| <a href="/clients/clash-verge-rev/">Clash Verge Rev</a> | <code>Mihomo (Clash Meta)</code> | Windows / macOS / Linux | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2、AnyTLS | 免费开源 | 持续活跃（有可核实跨平台项目资料；macOS 区分 Intel / Apple Silicon，Linux 提供 DEB/RPM/AppImage） | GitHub | macOS 下载需区分 Intel 与 Apple Silicon 架构；Linux 需按发行版选择 DEB/RPM/AppImage 格式 |
| <a href="/clients/flclash/">FlClash</a> | <code>Mihomo</code> | Windows / Android / macOS / Linux | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 免费开源 | 持续活跃（有可核实跨平台项目资料，提供 macOS 双芯片架构及多种 Linux 包） | GitHub | 仅支持标准 Clash / Mihomo 订阅导入，不兼容仅限官方客户端登录的机场 |
| <a href="/clients/clash-nyanpasu/">Clash Nyanpasu</a> | <code>Mihomo / 多内核</code> | Windows / macOS / Linux | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 免费开源 | 开源社区维护（GitHub） | GitHub | 适合熟悉 Clash 生态配置的用户 |
| <a href="/clients/clash-mi/">Clash Mi</a> | <code>Mihomo</code> | Windows / Android / iOS / macOS / Linux | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 免费（iOS 端以 App Store 地区页面为准） | 持续活跃（有可核实跨平台项目资料） | GitHub / App Store | 使用 Mihomo 配置前建议确认机场订阅支持 Clash 格式 |
| <strong>Mihomo Party</strong> | <code>Mihomo</code> | Windows | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 免费开源 | 需单独核实维护状态（不宜未经核实即标为持续更新首选） | GitHub | 资料特别提示应单独关注项目维护状态，建议优先考虑 Clash Verge Rev 或 FlClash |
| <a href="/clients/clash-meta-for-android/">Clash Meta for Android</a> | <code>Mihomo (Clash Meta)</code> | Android | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 免费开源 | 开源社区发布（GitHub） | GitHub | 请从官方 GitHub Release 获取安装包，勿轻信第三方渠道修改版 |
| <a href="/clients/openclash/">OpenClash</a> | <code>Mihomo / Clash</code> | OpenWrt | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 免费开源 | 开源社区维护 | GitHub | 安装前须确认 OpenWrt 版本、CPU 架构、包管理器及防火墙依赖 |
| <a href="/clients/nikki/">Nikki</a> | <code>Mihomo</code> | OpenWrt | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 免费开源 | 开源社区维护 | GitHub | 官方项目明确要求 OpenWrt 24.10 及以上版本，旧版固件不兼容 |

<strong>Mihomo Party 专项核验提示</strong>：据 <code>data/clients.json</code> 记录，Mihomo Party 仅列为 Windows 桌面配置端，维护状态标注为「需单独核实维护状态（不宜未经核实即标为持续更新首选）」，注意事项明确提示「资料特别提示应单独关注项目维护状态，建议优先考虑 Clash Verge Rev 或 FlClash」。

## 2. Mihomo 内核与 Mihomo Party 区分及迁移步骤

### 1. 核心引擎 vs 图形外壳：为什么必须区分 Mihomo 与 Mihomo Party

在中文教程与机场客服文档中，“Mihomo”常同时指代两个完全不同的对象，新手极易混淆：
- <strong>Mihomo 核心引擎（原 Clash Meta）</strong>：它是无界面的命令行代理核心，在原 Clash 内核停更后接棒演进，负责 Clash YAML 解析、规则引擎（<code>GEOIP/GEOSITE/PROCESS-NAME</code>）、Fake-IP / Redir-Host DNS 调度以及 VLESS-Reality、Hysteria 2、AnyTLS 协议转发。目前主流活跃客户端 <a href="/clients/clash-verge-rev/">Clash Verge Rev</a>、<a href="/clients/flclash/">FlClash</a>、<a href="/clients/clash-nyanpasu/">Clash Nyanpasu</a>、<a href="/clients/clash-mi/">Clash Mi</a>、<a href="/clients/clash-meta-for-android/">Clash Meta for Android</a>、<a href="/clients/openclash/">OpenClash</a> 与 <a href="/clients/nikki/">Nikki</a> 均在底层调用 Mihomo 内核。
- <strong>Mihomo Party</strong>：它是基于 Mihomo 内核开发的众多 Windows 桌面图形外壳之一。依据 <code>data/clients.json</code> 与《2026 机场代理客户端大全》核验记录，<strong>Mihomo Party 应单独关注项目维护状态，不宜未经核实即标为持续更新的首选客户端</strong>，当前主要用于历史教程参考与配置迁移场景。

> [!WARNING]
> <strong>选型避坑建议</strong>：如果你是首次配置电脑代理或追求长期稳定的安全补丁与 AnyTLS 等新协议更新，请优先选择拥有可核实持续活跃项目资料的 <a href="/clients/clash-verge-rev/">Clash Verge Rev</a>（桌面三端）或 <a href="/clients/flclash/">FlClash</a>（桌面三端 + 安卓）。

### 2. 从旧版 Clash / Mihomo Party 迁移五步实操

1. <strong>保留原始机场订阅链接</strong>：旧版 Clash for Windows 或 Mihomo Party 使用的均为标准 Clash YAML 订阅 URL，无需重新购买套餐即可直接迁移至 Clash Verge Rev 或 FlClash。
2. <strong>确认目标客户端内置内核版本</strong>：新装 Clash Verge Rev 后在设置页查看 Mihomo 内核版本，如机场采用 <code>AnyTLS</code>（如光速云 2026-08-19 批次），确保内核处于最新稳定分支。
3. <strong>审查并清理高风险覆写脚本</strong>：Mihomo 支持 JavaScript / YAML Merge 覆写功能，迁移配置时切勿盲目导入来历不明的远端 JS 脚本，仅保留机场官方下发规则或透明公开的规则集。
4. <strong>重新授权 TUN 虚拟网卡服务</strong>：卸载旧客户端时一并清理残留的虚拟网卡服务，在新客户端中重新安装 Service Mode 并授权防火墙放行。
5. <strong>核对机场订阅权限</strong>：凡支持 Clash 订阅的开放品牌均可无缝接入 Mihomo 生态；8 家 <code>exclusive-only</code> 专属客户端品牌无法导出 YAML 配置。

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
