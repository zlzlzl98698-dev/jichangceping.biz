---
title: 机场使用教程与网络配置实战中心
seoTitle: 机场使用教程中心：订阅导入、TUN 模式、DNS 分流与科学测速指南
description: 从零开始的机场配置实战教程，系统讲解订阅链接解析与导入、System Proxy 与 TUN 虚拟网卡、Fake-IP/Redir-Host DNS 防泄漏，以及避免单点假象的科学测速评估方法。
pageRole: pillar
schemaType: CollectionPage
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于跨平台代理内核（Mihomo / Xray / sing-box）通用工程实践与本实验室测速规范整理。
faq:
  - q: 刚买好机场，第一步应该做什么？
    a: 第一步应先确认该机场属于“第三方通用订阅”还是“专属客户端”。如果是专属客户端（如飞猫云、隐形人、SOGO 云等 8 家 exclusive-only 品牌），直接下载官方 App 登录；如果支持通用订阅，先根据设备选择 Clash Verge Rev、v2rayN、Shadowrocket 或 FlClash 等客户端，再进入官网后台复制对应的订阅 URL 导入。
  - q: 浏览器能打开 Google，为什么终端命令行（Git/npm/Python）或者某款桌面软件还是超时？
    a: 这是因为仅开启了“系统代理（System Proxy）”，它只拦截遵循系统 HTTP/SOCKS 环境变量的浏览器和应用；命令行、部分 UWP 应用与游戏默认无视系统代理。解决方式是在客户端开启 TUN 虚拟网卡模式，或在终端显式配置代理环境变量。
  - q: 客户端测出来的延迟数字很低（如 30ms），为什么看 4K 视频还是卡顿？
    a: 客户端默认节点列表中显示的通常只是 TCP 握手延迟或单一连接往返时间（RTT），不代表实际吞吐带宽或晚高峰丢包率。判断真实体验需要结合单线程/多线程下载速率、晚高峰（20:00–23:00）丢包表现和流媒体解锁检测一起看。
  - q: 开启代理后打开国内淘宝、微信网页反而变慢了怎么办？
    a: 说明分流规则或 DNS 解析未正确命中大陆直连（DIRECT）。请确认已启用规则模式（Rule）而非全局模式（Global），并检查客户端是否配置了基于国内外域名分流的 DNS 与 Fake-IP 过滤规则。
---

# 机场使用教程与网络配置实战中心

很多用户在选购机场后感到体验不佳，问题往往不完全出在节点线路本身，而是**订阅格式选错、分流模式误设成全局、DNS 发生泄漏或解析走偏，或者用错误的测速方式误判了节点质量**。

本教程中心不推销套餐、不堆砌营销按钮，只围绕工程化落地步骤，帮助不同系统的新手与进阶用户把手里已有的机场配置到稳定、高速、低风险的可用状态。

---

## 一、四步完成高质量代理部署（完整路线图）

无论你使用的是 Windows、macOS、Android、iOS、Linux 还是 OpenWrt 软路由，科学且可复现的部署顺序都应当遵循以下四步：

### 第一步：核对接入形态与选择客户端
1. 查看服务商的接入方式：确认其开放了 Clash / V2Ray / sing-box 通用订阅链接，还是属于**仅限官方专属客户端**（如飞猫云、隐形人、无忧链接、Firefly、灵猫网络、SOGO 云、闪跃、全球云）。
2. 按设备平台从官方 GitHub Releases 或外区 App Store 安装经过维护验证的软件（切勿安装第三方修改版 APK/EXE，例如 NekoBox 严禁从 Google Play 下载同名控制版本）。详细选型请看 [2026 客户端软件中心](/clients/) 与 [31 家机场兼容性矩阵](/clients/compatibility/)。

### 第二步：正确导入订阅与配置更新策略
不同客户端识别的订阅载荷截然不同：
- **Mihomo / Clash 系**（Clash Verge Rev、FlClash、Stash、OpenClash、Nikki）：需要返回标准 **Clash YAML** 的订阅地址。
- **Xray / v2ray 系**（v2rayN、v2rayNG、v2rayA）：通常读取 Base64 编码的节点列表 URI。
- **sing-box 系**：官方原生 SFA/SFI/SFM 读取 **sing-box JSON**；Hiddify 与 Karing 则内置了对 Clash/V2Ray/sing-box 多格式的自动识别转换。
- **Shadowrocket / Quantumult X**：Shadowrocket 兼容性极广，几乎通用；Quantumult X 往往需要专门的 QX 格式转换参数。

详见实战专题：[订阅导入与客户端配置完整指南](/guides/subscription/)。

### 第三步：理解系统代理、TUN 模式与 DNS 分流
- **日常浏览器冲浪**：使用默认“规则模式（Rule）+ 系统代理（System Proxy）”即可，资源消耗最低、对本地网游和局域网打印影响最小。
- **命令行 / Docker / 终端工具 / 游戏 / 无法设置代理的应用**：开启 **TUN 虚拟网卡模式**（需要服务模式或管理员权限），在 IP 层统一接管流量。
- **防止 DNS 污染与跨区定位偏移**：合理区分 `Fake-IP` 与 `Redir-Host`，配置国内直连 DNS（DoH/UDP）与海外安全解析，防止国内网站走冤枉路或海外站点识别地区错误。

详见实战专题：[TUN 模式与 DNS 分流原理及配置](/guides/tun-dns/)。

### 第四步：科学测速与晚高峰真实评估
不要把“界面上显示绿色的 25ms 延迟”等价于“好节点”，也不要用浏览器随便点开某一个海外网页测速就给全线路下结论：
- 区分 **Ping/ICMP 延迟** 与 **TCP/HTTP 真连接延迟（URL-Test）**；
- 区分 **非晚高峰闲时跑分** 与 **晚高峰（20:00–23:00）单线程流媒体缓冲速率**；
- 识别 **节点本地缓存、多线程虚高与 CDN 就近调度** 导致的假象。

详见实战专题：[测速方法与避坑指南](/guides/speedtest-guide/)。

---

## 二、核心专题教程导航

| 专题名称 | 解决的核心痛点 | 适用读者 |
| :--- | :--- | :--- |
| [订阅导入与客户端配置](/guides/subscription/) | 订阅链接格式差异、Clash/V2Ray/sing-box 识别报错、User-Agent 与自动更新设置、订阅泄露防护 | 全部首次使用第三方客户端的用户 |
| [TUN 模式与 DNS 分流](/guides/tun-dns/) | 浏览器通但终端不通、国内网站变慢、DNS 泄漏与污染、Fake-IP 198.18 网段影响局域网工具 | 开发者、多应用桌面用户、软路由玩家 |
| [测速方法与避坑指南](/guides/speedtest-guide/) | 看懂 MiaoKo 测速图、延迟 vs 吞吐量、晚高峰与闲时差异、单线程与多线程测速区别 | 购前评估或排查节点变慢的用户 |
| [网络协议与基础科普](/knowledge/) | 弄懂 VLESS、Trojan、Shadowsocks、Hysteria 2、AnyTLS、TUIC 以及 BGP/IEPL/IPLC 底层差异 | 希望透彻理解技术原理的进阶用户 |

---

## 三、常见“配置正确但仍无法使用”的场景分流

如果你严格按照上述教程操作后仍然遇到报错，请不要盲目重装系统或反复购买新套餐，建议直接进入对应的故障排障文档按步骤定位：

1. **导入订阅时提示连接超时、SSL 握手错误或内容解析失败**
   → 跳转至 [订阅失败与更新报错排查](/troubleshooting/subscription-failed/)（排查订阅域名被污染、User-Agent 不匹配、代理循环或专属客户端限制）。
2. **订阅导入成功且节点列表完整，但全部节点测试超时或有延迟无网速**
   → 跳转至 [节点超时与全部不可用排查](/troubleshooting/node-timeout/)（优先检查系统时间偏差超过 30 秒、套餐过期/流量用尽、协议不兼容或本地 ISP QoS）。
3. **打开 TUN 后全网断连、微信/淘宝打不开、或者浏览器出现 DNS 错误**
   → 跳转至 [TUN 异常与 DNS 污染排查](/troubleshooting/tun-dns-error/)（排查多代理/网游加速器冲突、Service Mode 权限与 Fake-IP 缓存残留）。

---

## 四、进阶开发与家庭多设备组网架构指南

除单机浏览器科学上网外，现代用户最常遇到的两类高阶场景是 **“开发者终端/容器代理”** 与 **“家庭局域网旁路由/软路由共享”**。选对流量接管层级，能够大幅减少日常反复开关代理的摩擦：

### 1. 终端命令行、Git、包管理器与容器环境配置对照

许多开发工具默认完全忽略桌面系统的图形化“系统代理”开关。针对不同工具栈，推荐按以下矩阵选择接管方式：

| 工具与运行环境 | 仅开系统代理是否生效 | 推荐工程解法 | 避坑注意点 |
| :--- | :---: | :--- | :--- |
| **Chrome / Edge / Firefox** | 生效 | 直接使用客户端 `Rule + System Proxy` | 勿同时启用指向错误端口的旧版 SwitchyOmega 插件 |
| **PowerShell / Bash `curl`、`npm`、`pip`** | 默认不生效 | 开启客户端 **TUN 模式**，或在终端临时导出 `HTTP_PROXY` / `HTTPS_PROXY` 指向本地混合端口（如 `127.0.0.1:7897`） | 临时环境变量在关闭客户端后须清空，否则直连也会报错 |
| **Git (HTTPS vs SSH 克隆)** | 默认不生效 | HTTPS 协议可配 `git config --global http.https://github.com.proxy`；SSH (`22` 端口) 则建议走 **TUN 模式** 或 `ProxyCommand` | 切勿对公司内网 GitLab 域名设置全局代理，应限定仅 `github.com` 生效 |
| **WSL2 / 虚拟机 / Docker 构建** | 默认隔离不互通 | 开启客户端 **允许局域网连接 (Allow LAN)** + 宿主机 **TUN 模式**（或将容器代理指向宿主机网卡 IP） | WSL2 NAT 模式下不能填 `127.0.0.1`，需读取宿主机真实虚拟网卡网关 IP |

### 2. 家庭多设备组网的三种拓扑模式

当你同时拥有手机、电脑、iPad、Apple TV 或游戏主机（PS5 / Switch）时，可根据动手能力在以下三种拓扑中抉择：

1. **各终端独立安装客户端（最稳妥、故障隔离最好）**：
   - 电脑装 [Clash Verge Rev](/clients/clash-verge-rev/)、安卓装 [FlClash](/clients/flclash/) 或 [v2rayNG](/clients/v2rayng/)、iOS 装 [Shadowrocket](/clients/shadowrocket/) 或 [Stash](/clients/stash/)。
   - **优势**：某一台设备调测出错不会导致全屋家人断网；需留意机场是否有同时在线设备数限制（如光速云、星岛梦、二猫云、唯兔云均标注不限设备数）。
2. **桌面客户端开启“允许局域网连接（Allow LAN）”临时共享**：
   - 适合没有软路由，但需要给同一 Wi-Fi 下的 Apple TV 或 Switch 下载游戏更新。打开电脑端客户端的 `Allow LAN`，在主机网络设置中手动将 HTTP 代理指向电脑的局域网 IP（如 `192.168.1.x:7897`）即可。
3. **OpenWrt 主路由 / 旁路由透明代理（全屋无感分流）**：
   - 在软路由部署 [OpenClash](/clients/openclash/)、[PassWall2](/clients/passwall2/)、[Nikki](/clients/nikki/)（限 OpenWrt 24.10+）或 [HomeProxy](/clients/homeproxy/)。
   - **硬性前提**：所购机场**必须支持导出通用第三方订阅**（避开飞猫云、隐形人、无忧链接、Firefly、灵猫网络、闪跃、全球云等 `exclusive-only` 品牌），且建议为旁路由模式保留一键切回主路由网关的逃生机制，防止折腾插件时影响家人正常访问国内网络。

---

## 五、实用安全与隐私习惯

- **保护订阅链接等同于保护账号密码**：机场订阅 URL 通常包含你的账户鉴权 Token。任何人拿到你的订阅链接都能消耗你的流量。切勿在公开截图、GitHub 仓库、论坛求助贴中直接贴出完整订阅地址，也**谨慎将订阅粘贴进不可信的第三方在线订阅转换网站**（如果必须转换，优先选择本地转换或客户端内置兼容，如 Hiddify / Karing）。
- **警惕“一键脚本/第三方规则覆写”投毒**：无论在 Clash Verge Rev、Stash 还是 Quantumult X 中，从网络上复制陌生人分享的覆写脚本或规则文件时，检查其是否包含可疑的 `MITM` 解密域名、隐藏代理转发或劫持特定域名流量。
- **定期更新客户端内核，而非盲目追逐实验版**：保持 Mihomo / Xray / sing-box 处于受官方支持且修复已知漏洞的稳定发行版即可。若正在使用旧版 Clash for Windows 或维护状态存疑的分支，应尽快规划平滑迁移至活跃项目。
