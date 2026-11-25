---
title: OpenWrt 软路由代理插件大全与固件依赖核查指南
seoTitle: OpenWrt 代理指南：OpenClash、PassWall2、Nikki 与 HomeProxy
description: 2026 年 OpenWrt 软路由透明代理插件完全对比，涵盖 OpenClash、PassWall2、Nikki（明确要求 OpenWrt 24.10+）、HomeProxy 与 v2rayA，以及版本、CPU 架构、包管理器和防火墙依赖核查。
schemaType: CollectionPage
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 sources/brand-info/第三方代理客户端.txt、data/clients.json 与 data/client-compatibility.json 核验整理。
faq:
  - q: 软路由上安装代理插件前必须先查清楚哪 5 项系统信息？
    a: 路由器环境与 Windows/Android 完全不同，安装前必须依次核实：1）OpenWrt 固件版本号；2）路由器 CPU 架构；3）包管理器类型（opkg 还是 apk）；4）内核与防火墙依赖（iptables 还是 firewall4 nftables）；5）设备剩余存储与内存空间。
  - q: 为什么 Nikki 在我的老版 OpenWrt 上装不上或报错？
    a: 依据《2026 机场代理客户端大全》与 data/clients.json 明确提醒，Nikki 官方项目要求 OpenWrt 24.10 及以上版本，旧版固件（如 22.03 / 23.05）不兼容，请改用 OpenClash 或升级固件。
  - q: 软路由家庭共享最应该选哪类机场？
    a: 一是必须支持第三方通用订阅（避开不支持订阅导出的 exclusive-only 品牌）；二是优先考虑不限同时在线设备数或明确支持软路由的品牌（例如光速云、星岛梦、二猫云、唯兔云均在品牌资料中标注不限设备连接数）。
---
# OpenWrt 软路由代理插件大全与固件依赖核查指南

<strong>核心结论（Answer-First）：</strong>OpenWrt 软路由端生态最成熟的是 <strong>OpenClash</strong>（Mihomo/Clash YAML 规则生态）；喜欢 Xray / sing-box 多核心与精细设备访问控制选 <strong>PassWall2</strong>；固件为 <strong>OpenWrt 24.10 及以上版本</strong>可选轻量级的 <strong>Nikki</strong>（旧版固件不兼容）或原生 LuCI 的 <strong>HomeProxy</strong>。安装前必查固件版本、CPU 架构、包管理器（<code>opkg/apk</code>）与防火墙依赖，且必须选择支持第三方订阅的开放机场。

## 1. 客户端技术规格与安全注意事项矩阵

以下规格严格同步自站点结构化数据 <code>data/clients.json</code>，包含内核架构、支持系统、协议覆盖、授权定价、维护状态及官方核验警示：

| 客户端名称 | 核心引擎 | 支持系统 | 支持协议 | 定价 / 开源状态 | 维护状态 | 官方渠道 | 注意事项 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| <a href="/clients/openclash/">OpenClash</a> | <code>Mihomo / Clash</code> | OpenWrt | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 免费开源 | 开源社区维护 | GitHub | 安装前须确认 OpenWrt 版本、CPU 架构、包管理器及防火墙依赖 |
| <a href="/clients/passwall2/">PassWall2</a> | <code>Xray / sing-box</code> | OpenWrt | VLESS、VMess、Trojan、Shadowsocks、Hysteria 2 | 免费开源 | 开源社区维护 | GitHub | 须匹配路由器架构与固件内核依赖 |
| <a href="/clients/nikki/">Nikki</a> | <code>Mihomo</code> | OpenWrt | Shadowsocks、VMess、VLESS、Trojan、Hysteria 2 | 免费开源 | 开源社区维护 | GitHub | 官方项目明确要求 OpenWrt 24.10 及以上版本，旧版固件不兼容 |
| <a href="/clients/homeproxy/">HomeProxy</a> | <code>sing-box</code> | OpenWrt | VLESS、VMess、Trojan、Shadowsocks、Hysteria 2 | 免费开源 | 开源社区维护 | GitHub | 须确认固件版本与 sing-box 内核依赖版本匹配 |
| <strong>v2rayA</strong> | <code>Xray / v2ray-core</code> | Linux / OpenWrt | VLESS、VMess、Trojan、Shadowsocks | 免费开源 | 开源社区维护 | GitHub | 透明代理部署需注意防火墙 nftables/iptables 与端口冲突 |

## 2. OpenWrt 固件前置五项核查与透明代理避坑

### 1. 安装前必须核查的五项固件依赖

路由器固件与通用桌面操作系统不同，盲目安装网盘流传的一键包极易造成依赖缺失或 LAN 口失联。依据 <code>data/clients.json</code>，部署任何软路由插件前务必通过 SSH 检查以下五项：
1. <strong>OpenWrt 版本号</strong>：执行 <code>cat /etc/openwrt_release</code> 确认固件版本。<strong><a href="/clients/nikki/">Nikki</a> 官方项目明确要求 OpenWrt 24.10 及以上版本，旧版固件（21.02 / 22.03 / 23.05）不兼容</strong>；旧版固件请选用 <a href="/clients/openclash/">OpenClash</a> 或 <a href="/clients/passwall2/">PassWall2</a>。
2. <strong>CPU 架构</strong>：执行 <code>uname -m</code> 确认 <code>x86_64</code>、<code>aarch64_cortex-a53</code>、<code>aarch64_generic</code> 或 <code>mipsel</code>，插件与内核二进制文件必须完全一致。
3. <strong>包管理器差异</strong>：OpenWrt 24.10 起逐步转向 <code>apk</code> 包管理（<code>.apk</code>），传统版本使用 <code>opkg</code>（<code>.ipk</code>），安装命令不可混用。
4. <strong>防火墙与内核依赖</strong>：确认固件内置 <code>firewall4 (nftables)</code> 还是传统 <code>firewall3 (iptables)</code>，并核验 <code>kmod-tun</code>、<code>kmod-nft-tproxy</code>（或 <code>iptables-mod-tproxy</code>）与 <code>dnsmasq-full</code>。
5. <strong>闪存剩余空间</strong>：确认 <code>/overlay</code> 至少有数十 MB 空闲空间以容纳插件、内核与 GeoIP/GeoSite 规则数据库。

### 2. 软路由配置四步规范与单插件铁律

1. <strong>严禁多插件同时启用</strong>：同一台路由器内绝对不可同时打开 OpenClash、PassWall2、Nikki 或 HomeProxy 的运行开关，否则会抢占 <code>dnsmasq</code> 与透明转发链导致全网断联。
2. <strong>优先选择不限设备数开放订阅品牌</strong>：家庭或小型办公室软路由会汇聚多台终端设备，<code>光速云</code>、<code>星岛梦</code>、<code>二猫云</code>、<code>唯兔云</code> 等支持第三方订阅且对设备数更友好的开放品牌适配度最高。
3. <strong>核对 SOGO 云专属软路由特殊性</strong>：在 8 家 <code>exclusive-only</code> 品牌中，<code>飞猫云</code>、<code>隐形人</code>、<code>无忧链接</code>、<code>Firefly</code>、<code>灵猫网络</code>、<code>闪跃</code>、<code>全球云</code> 均无法在 OpenWrt 上导入订阅；仅 <code>SOGO 云</code> 标注其自研客户端支持主流软路由，但依然不支持导入 OpenClash，购买前须核实自身路由器架构。
4. <strong>分离本机更新流量防止回环</strong>：开启透明代理后，确保路由器的订阅拉取域名与内核更新流量放行规则正确，防止配置重载后无法再次拉取机场订阅。

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
| <a href="/reviews/guangsuyun/">光速云</a> | 自研 + 第三方通用 | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks、AnyTLS | 提供自研客户端，同时支持 Clash、Shadowrocket 等第三方客户端订阅导入。（<code>Measured</code>） |
| <a href="/reviews/weifeng/">微风网络</a> | 未明确限定（待核实/实测） | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料未明确限定专属客户端，2026-07-19 实测截图通过 VLESS 订阅导入 MiaoKo 测试。（<code>Measured</code>） |
| <a href="/reviews/xingdaomeng/">星岛梦</a> | 未明确限定（待核实/实测） | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · Trojan、Shadowsocks | 品牌资料未明确限制专属客户端，2026-08-11 实测通过 Shadowsocks 订阅节点测速。（<code>Measured</code>） |
| <a href="/reviews/ermao/">二猫云</a> | 自研 + 第三方通用 | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 配备独家定制客户端；正文提及 VLESS 协议，且 2026-08-11 截图显示 Shadowsocks 节点可测速，具体第三方订阅权限以官网为准。（<code>Measured</code>） |
| <a href="/reviews/weitu/">唯兔云</a> | 未明确限定（待核实/实测） | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · Trojan、Shadowsocks | 品牌资料未强制限制专属客户端，2026-08-11 实测通过 Shadowsocks 节点测速。（<code>Measured</code>） |
| <a href="/reviews/jilian/">极连云</a> | 自研 + 第三方通用 | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料明确支持自研客户端 + 第三方客户端，2026-08-11 晚高峰通过 Shadowsocks 测速。（<code>Measured</code>） |
| <a href="/reviews/guangnian/">光年梯</a> | 自研 + 第三方通用 | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 支持自研客户端 + 第三方订阅导入。（<code>Measured</code>） |
| <a href="/reviews/yifan/">一翻云</a> | 纯第三方通用 | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · Hysteria 2、VLESS-Reality、Shadowsocks | 提供 Hysteria 2 / VLESS-Reality / Shadowsocks 三协议，支持 Clash Verge Rev / v2rayN / Shadowrocket 等主流第三方客户端。（<code>Measured</code>） |
| <a href="/reviews/kexin/">可信云</a> | 纯第三方通用 | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 品牌资料标注支持第三方客户端。（<code>Measured</code>） |
| <a href="/reviews/sujie/">速界</a> | 自研 + 第三方通用 | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS、Shadowsocks | 支持自研客户端 + 第三方订阅导入。（<code>Measured</code>） |
| <a href="/reviews/tiziyun/">梯子云</a> | 自研 + 第三方通用 | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料同时提供自研全平台一键登录客户端与通用订阅导入（兼顾新手与进阶用户）。（<code>Vendor Data</code>） |
| <a href="/reviews/dalaoyun/">大佬云</a> | 自研 + 第三方通用 | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · VLESS | 品牌资料标注支持自研客户端 + 第三方订阅导入。（<code>Vendor Data</code>） |
| <a href="/reviews/u1s1/">U1S1</a> | 未明确限定（待核实/实测） | <strong>兼容 OpenWrt 第三方客户端</strong>（可导出通用订阅） | Windows / macOS / iOS / Android / Linux / OpenWrt · Shadowsocks | 品牌资料未明确限定专属客户端，2026-08-11 晚高峰测速通过 Shadowsocks 节点完成。（<code>Measured</code>） |
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
