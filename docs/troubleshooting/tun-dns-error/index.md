---
title: TUN 模式异常、断网与 DNS 污染排查指南
seoTitle: Clash/sing-box 开启 TUN 模式断网、虚拟网卡启动失败与 DNS 污染修复
description: 解决 Windows/macOS/Linux/OpenWrt 开启 TUN 模式无网络、Service Mode 启动失败、198.18 Fake-IP 缓存导致国内断网、IPv6 泄漏与游戏加速器冲突等疑难问题。
schemaType: Article
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 Wintun / sing-tun / Mihomo DNS 栈与操作系统路由表排障实践整理。
faq:
  - q: Windows 打开 Clash Verge Rev 的 TUN 开关没反应，或者虚拟网卡不出现怎么办？
    a: Windows 创建 TUN 虚拟网卡需要管理员级权限。进入客户端“设置 -> 服务模式（Service Mode）”，点击安装并启动服务（或退出软件后右键“以管理员身份运行”），同时检查安全软件是否拦截了驱动或核心进程。
  - q: 开了 TUN 模式后，关闭客户端会导致微信和国内网页短时间打不开，过一会儿又自己好了？
    a: 这是典型的 Fake-IP DNS 缓存残留现象：开启 TUN + Fake-IP 期间，系统缓存了某国内或双栈域名对应的 198.18.x.x 虚拟地址；关闭客户端后虚拟网卡消失，在缓存过期前请求 198.18.x.x 就会失败。在终端运行 ipconfig /flushdns（Windows）即可立即恢复。
  - q: 为什么开了代理甚至开了 TUN，查 IP 网站或流媒体还是识别出我本地的真实地区？
    a: 高概率发生了 IPv6 泄漏或 WebRTC 泄漏。如果家庭宽带分配了公网 IPv6 地址，而代理客户端或机场节点未开启/不支持 IPv6 接管，支持双栈的网站就会绕过 IPv4 代理直接走本地 IPv6 直连出去。
---

# TUN 模式异常、断网与 DNS 污染排查指南

<strong>核心结论（Answer-First）：</strong> 开启 TUN 模式后无反应或全网瘫痪，85% 源自 <strong>未启用服务模式（Service Mode）提权、与其他虚拟网卡（游戏加速器/企业 VPN）抢占 <code>0.0.0.0/0</code> 路由</strong>、或 <strong><code>System</code> 栈与当前系统不兼容（切换为 <code>Mixed</code> 或 <code>gVisor</code> 即可）</strong>；而“关闭代理后微信/国内网页短时打不开”则是 <code>198.18.x.x</code> Fake-IP 缓存未过期所致，刷新系统 DNS 缓存即可秒恢复。

相比只作用于浏览器的“系统代理”，<strong>TUN 虚拟网卡模式</strong>与系统底层路由表和 DNS 栈深度耦合，一旦配置不当或与其他网络软件冲突，很容易出现“一开全断”或“关了也断”的现象。

## 一、TUN 模式三类网络栈与全平台权限要求

在 Mihomo (Clash Meta) 与 sing-box 中，TUN 栈类型和系统权限直接决定了虚拟网卡能否拉起以及吞吐性能：

| TUN 网络栈 / 平台 | 技术机制与适用场景 | 常见异常症状 | 推荐配置与提权方式 |
| :--- | :--- | :--- | :--- |
| <strong>Mixed 栈（默认推荐）</strong> | TCP 走内核级 <code>System</code> 高吞吐，UDP 走用户态 <code>gVisor</code> 高兼容 | 极少数企业防病毒驱动下可能拦截包注入 | 日常桌面与游戏、流媒体场景<strong>优先使用 Mixed</strong> |
| <strong>gVisor 栈</strong> | 完全在用户态模拟 TCP/IP 协议栈，不依赖系统复杂驱动兼容 | CPU 占用略高于 System 栈，极端千兆跑分略低 | 当 Windows 开启 TUN 出现无流量或蓝屏风险时<strong>首选切换为 gVisor</strong> |
| <strong>System 栈</strong> | 直接走操作系统原生内核协议栈（性能最高） | 部分 Windows 精简版系统或特定网卡驱动下容易断流 | 仅在系统环境干净、追求极限内网转发速率时测试启用 |
| <strong>Windows / macOS / Linux</strong> | Win 依赖 <code>Wintun</code> + 服务；macOS 依赖网络助手；Linux 依赖 <code>tun</code> 模块 | 开关灰掉、点开即自动弹回关闭状态 | Win 安装 <strong>Service Mode</strong>；macOS 授权辅助进程；Linux 赋予 <code>cap_net_admin</code> |

## 二、DNS 模式（Fake-IP vs Redir-Host）与常见冲突对照表

很多用户以为“断网”是节点挂了，其实是 DNS 解析结果（例如 <code>198.18.0.0/15</code>）与当前物理网络状态脱节，或同时运行了第二套全局路由接管程序：

| 现象 / 冲突对象 | 底层冲突机制 | 典型受影响应用 | 标准排查与修复方法 |
| :--- | :--- | :--- | :--- |
| <strong>Fake-IP 模式残留</strong> | 客户端退出后系统仍缓存 <code>198.18.x.x</code> 虚拟映射 | 微信、国内网页、网银客户端 | 执行 <code>ipconfig /flushdns</code> (Win) 或重启网卡；高频开关建议加 <code>fake-ip-filter</code> |
| <strong>Redir-Host 模式延迟</strong> | 每次请求需真实查询国内外 DNS 再按 IP 规则匹配 | 首屏打开略慢，但无虚拟 IP 残留 | 若经常开/关客户端或有复杂局域网 NAS，可改用 <code>Redir-Host</code> 避免 <code>198.18</code> 残留 |
| <strong>国内网游加速器</strong> | UU/雷神/奇游等驱动级路由与 TUN 抢占默认网关 | 一开 TUN 游戏和网页同时断网 | 二者<strong>不要同时开路由级加速</strong>，玩国服/外服游戏时先退出 Clash TUN |
| <strong>企业办公 VPN</strong> | EasyConnect / aTrust / AnyConnect / Tailscale 注入冲突路由 | 公司内网失联或公网死循环 | 用企业 VPN 时关闭机场 TUN，改回仅开“系统代理”，或配 <code>route-exclude-address</code> |
| <strong>本地 IPv6 双栈绕行</strong> | 本地网卡有公网 IPv6，但机场节点仅出口 IPv4 | 查 IP 或流媒体仍显示国内真实地区 | TUN 开启 IPv6 接管并按规则阻断未代理 IPv6，或关闭浏览器第三方 DoH |

## 三、TUN 虚拟网卡无法启动（开关无效 / 终端仍直连）

1. <strong>检查服务模式（Service Mode）与提权状态</strong>：
   - <strong>Windows</strong>：在 Clash Verge Rev / FlClash / Nyanpasu 中，找到 <code>服务模式 (Service Mode)</code> 图标（小盾牌），确认状态为 <code>Active / 已安装并运行</code>；若显示未安装，点击安装并在弹出的 UAC 窗口点“是”。仍失败时，完全退出软件后右键快捷方式选择 <strong>“以管理员身份运行”</strong>，并检查安全软件是否误杀了 <code>wintun.dll</code>。
   - <strong>macOS</strong>：首次开启 TUN 会弹窗要求输入开机密码以授权网络助手进程；若系统大版本更新后失效，在设置中点击“重新授权 / 重装服务”。
   - <strong>Linux</strong>：确认核心二进制已通过系统服务运行或具备 <code>cap_net_admin</code> 权限，且内核已加载 <code>tun</code> 模块（<code>lsmod | grep tun</code>）。
2. <strong>切换 TUN 网络栈（Stack）类型</strong>：
   - 若确认服务模式已激活但流量完全不通，直接在客户端 TUN 设置中将 Stack 从 <code>System</code> 或 <code>Mixed</code> 手动切换为 <code>gVisor</code> 并重启内核，往往能立即解决驱动兼容性问题。

## 四、Fake-IP 残留与局域网/国内应用异常

### 1. 关闭代理后国内网站打不开
- <strong>根因</strong>：<code>Fake-IP</code> 模式将域名解析为 <code>198.18.0.0/15</code> 测试保留段 IP。客户端退出后，操作系统或浏览器的 DNS 缓存尚未到期，请求仍发往已销毁的虚拟网卡。
- <strong>一键清理缓存命令</strong>：
  - <strong>Windows</strong>：打开 PowerShell 或 CMD 运行 <code>ipconfig /flushdns</code>
  - <strong>macOS</strong>：终端运行 <code>sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder</code>
  - <strong>Chrome / Edge 浏览器</strong>：地址栏访问 <code>chrome://net-internals/#dns</code> 点击 <code>Clear host cache</code>

### 2. 局域网 NAS、打印机、游戏联机大厅失效
- 确保客户端开启了 <strong>绕过私有网络（Bypass Private Network）</strong>（涵盖 <code>10.0.0.0/8</code>、<code>172.16.0.0/12</code>、<code>192.168.0.0/16</code>）。
- 将出问题的局域网后缀（<code>+.lan</code>、<code>+.local</code>、<code>+.home.arpa</code>）以及游戏联机状态检测域名加入 <code>fake-ip-filter</code> 列表，让它们走真实 IP 解析。

## 五、DNS 泄漏与 IPv6 双栈绕行排查

如果开启代理后访问海外站点依然触发地区封锁或 DNS 污染：
1. <strong>排查 IPv6 直连泄漏</strong>：由于目前绝大多数商业机场节点仅提供 IPv4 出口，若在客户端关闭了 IPv6 接管但电脑网卡本身拥有公网 IPv6，浏览器就会优先走本地 IPv6 直连目标网站从而暴露国内 IP（或直接连接重置）。<strong>稳妥做法</strong>：在客户端 TUN 设置中让虚拟网卡一并接管并按规则拒绝/黑洞代理侧不支持的纯 IPv6 请求，或在本地网卡属性中临时取消勾选 IPv6 协议栈进行验证。
2. <strong>关闭浏览器内置冲突的第三方安全 DNS（DoH）</strong>：若浏览器自行配置了无法直连的海外 DoH 服务器且未走代理，会导致首次域名解析卡死；使用 TUN 模式时建议将浏览器安全 DNS 保持为“使用当前服务提供商（系统默认）”，交由客户端内核统一分流处理。详见原理说明：[TUN 模式与 DNS 分流指南](/guides/tun-dns/)。
