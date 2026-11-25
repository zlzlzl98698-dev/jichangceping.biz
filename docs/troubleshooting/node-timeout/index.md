---
title: 节点超时（Timeout）与全部不可用深度排查指南
seoTitle: 机场节点全部超时 Timeout 怎么解决？系统时间、套餐状态与协议排查
description: 当代理客户端节点列表已导入但测速全部显示 Timeout、Error 或有延迟却打不开网页时，按本机时钟、账号额度、测速方式、ISP UDP 限速与服务端状态五层快速定位。
schemaType: Article
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Vendor Data
sourceNote: 基于 TLS/XTLS/QUIC 握手规范与跨网运营商常见故障场景整理。
faq:
  - q: 为什么重装系统或软路由断电重启后，所有节点一瞬间全变成 Timeout？
    a: 90% 以上是因为系统时间不准！VLESS、VMess、Trojan、Hysteria 2 与 AnyTLS 都依赖 TLS 证书或时间窗口校验，本机时间哪怕快慢超过 60 秒，服务端就会当作重放攻击或无效握手直接断开。同步系统时间后立刻恢复。
  - q: 节点测速有绿色延迟数字（比如 45ms），但浏览器就是打不开海外网站，为什么？
    a: 常见于三种情况：1）客户端测的是纯 TCP/ICMP 握手延迟而非真 HTTP 连接，实际账户流量已用尽或节点出口断网；2）客户端处于 Direct（直连模式）而非 Rule/Global 模式，或者根本没打开“系统代理”开关；3）浏览器装了冲突的代理插件（如旧版 SwitchyOmega 指错了本地端口）。
  - q: 只有 Hysteria 2 节点每隔几分钟就断流 Timeout，换别的节点又好了？
    a: Hysteria 2 基于 UDP (QUIC) 协议，部分地区宽带或校园网对大流量海外 UDP 实施严格的 QoS 丢包与限速。遇到此类情况直接切换该机场下的 VLESS、Trojan 或 Shadowsocks (TCP) 节点即可。
---

# 节点超时（Timeout）与全部不可用深度排查指南

<strong>核心结论（Answer-First）：</strong> 全列表节点同时显示 <code>Timeout</code> 的前三大元凶依次为：<strong>本机系统时间偏差超过 30–60 秒（导致 TLS/VMess 鉴权直接拒连）</strong>、<strong>长期未更新订阅（入口 IP 已变更）或当月流量/并发设备超限</strong>、以及 <strong>校园网/宽带对 UDP 协议（Hysteria 2/TUIC）或高位端口实施阻断</strong>；若测速有绿色延迟却打不开网页，几乎 100% 是客户端处于 <code>Direct</code> 直连模式、未开系统代理或浏览器扩展端口不匹配。

当订阅列表中已经有几十个节点，但点击测速后一片鲜红的 <code>Timeout</code> / <code>-1 ms</code>，或者虽然测出了延迟却无法加载任何网页时，请按以下诊断表与<strong>从高概率到低概率</strong>的顺序逐项核查。

## 一、五层 Timeout 故障现象速查诊断表

| 故障现象特征 | 最可能根因（按概率排序） | 30 秒验证方法 | 对应修复方案 |
| :--- | :--- | :--- | :--- |
| <strong>全节点瞬间 100% Timeout</strong>（尤其重启/双系统切换后） | 1）本机系统时间/时区偏差；2）套餐到期/流量归零；3）订阅太久没更新 | 核对任务栏时间与北京时间（<code>UTC+8</code>）；登录面板看剩余流量 | 同步 NTP 网络时间；更新一次订阅或确认套餐状态 |
| <strong>有绿色延迟（30–80ms），但网页打不开</strong> | 1）模式误选 <code>Direct</code>；2）未开启系统代理；3）浏览器代理插件端口冲突；4）仅测了 <code>Tcping</code> | 将客户端切换为全局模式，或用 <code>URL-Test</code> 重测节点 | 改回 <code>Rule</code> 模式并开启系统代理；将浏览器扩展设为跟随系统代理 |
| <strong>仅 Hysteria 2 / TUIC 频繁断流或超时</strong> | 本地宽带/移动网络/校园网对 UDP (QUIC) 实施 QoS 丢包或阻断 | 同机场下切换 <code>VLESS</code> / <code>Trojan</code> / <code>Shadowsocks</code> 节点对比 | 在策略组中改用 TCP/TLS 类节点，避开 QUIC/UDP 限速 |
| <strong>仅少数冷门地区节点 Timeout（如德国01/个别节点）</strong> | 单节点上游维护或特定运营商跨网异常（非全站挂掉） | 测试同机场香港、日本或新加坡主力节点是否正常 | 属正常节点波动（如实测中也存在个别 KB 级异常节点），切换同地区其他编号节点即可 |
| <strong>家里正常，一到公司/学校内网就全部 Timeout</strong> | 企业防火墙或校园网仅放行 <code>80/443</code> 标准端口 | 电脑临时连手机 5G 热点，立即复测同一批节点 | 优先选择 <code>443</code> 端口的 Trojan / VLESS 节点，避开高位端口 |

## 二、主流客户端本地端口与真连接测试基准表

排查“有延迟但浏览器上不了网”或“日志报端口占用”时，先对照各客户端的默认监听端口与真连接测试设置：

| 客户端 | 底层内核 | 常见默认本地代理端口 | 真连接测试名称与建议地址 | 端口/插件排错要点 |
| :--- | :--- | :--- | :--- | :--- |
| <strong>Clash Verge Rev / FlClash</strong> | Mihomo | 混合端口 <code>7897</code>（部分配置为 <code>7890</code>） | <code>URL-Test</code> / 延迟测试（默认 <code>gstatic.com/generate_204</code>） | 若装了 SwitchyOmega/ZeroOmega，HTTP/SOCKS 端口必须与混合端口一致 |
| <strong>v2rayN</strong> | Xray / sing-box | HTTP <code>10809</code> / SOCKS <code>10808</code>（或混合端口） | <code>真连接延迟</code>（不要只看 <code>Tcping</code>） | 底栏确认已选“自动配置系统代理”，且路由模式非“直连” |
| <strong>Shadowrocket（小火箭）</strong> | 自研 iOS 引擎 | 仅系统 VPN 接管 | 设置 → 延迟测试方法选 <code>CONNECT</code> 或 <code>URL</code> | 不要只选 <code>ICMP</code> 或纯 <code>TCP</code> Ping，否则容易出现假绿色延迟 |
| <strong>Hiddify / Karing</strong> | sing-box | 混合端口因配置而异（如 <code>2334</code> / <code>12334</code> 等） | 内置 <code>URL-Test</code> 自动测速 | 避免同时在后台运行另一个 Clash/v2ray 客户端抢占虚拟网卡 |

## 三、第一优先级：检查本机时间与账户可用状态

1. <strong>校准系统时钟与时区（头号隐形原因）</strong>：
   - 检查电脑、手机或 OpenWrt 软路由的系统时间是否与标准北京时间（<code>UTC+8</code>）一致，<strong>误差必须控制在 30 秒以内</strong>。
   - 双系统用户（Windows + Ubuntu）切换系统后极易出现整整 8 小时的硬件时钟偏移；软路由没有 CMOS 电池断电重启后时间会回到出厂年份，都会导致全部 TLS/VLESS/AnyTLS 节点瞬间 <code>Timeout</code>。
2. <strong>检查套餐流量、到期时间与设备上限</strong>：
   - 登录机场面板查看当月流量是否归零（注意部分专线机场的高倍率节点，或者后台开启了 OneDrive/iCloud 云盘备份、Steam 游戏更新瞬间跑空了轻量年付包的月度 40–70GB 额度）。
   - 若套餐有同时在线设备数限制（或你正在用不限设备外的受限套餐），断开多余设备等待 3–5 分钟会话释放后再试。
3. <strong>立即更新一次订阅</strong>：
   - 机场为应对中转入口攻击或运营商路由调整，常会动态更换国内入口 IP。本地保存半个月没更新的旧节点自然会全部连接超时（更新前若当前节点全挂，请先关掉系统代理直连更新）。

## 四、第二优先级：排查“有延迟但上不了网”的配置误区

如果节点测速显示 <code>35ms</code>、<code>60ms</code> 正常，唯独浏览器上不了网，问题几乎 100% 出在<strong>本地转发开关</strong>：

- <strong>检查代理模式</strong>：确认客户端选中的是 <strong>Rule（规则）</strong> 或 <strong>Global（全局）</strong>，而不是误点到了 <strong>Direct（直连）</strong>。
- <strong>检查系统代理开关与端口</strong>：确认客户端的 <code>System Proxy（系统代理）</code> 已开启。若浏览器安装了 <code>ZeroOmega / SwitchyOmega</code> 等代理扩展，请检查扩展配置的本地端口是否与客户端监听端口完全一致；不确定时先将浏览器扩展切回 <code>[系统代理]</code>。
- <strong>把测速方式改为 URL-Test（真连接）</strong>：在 v2rayN / Shadowrocket 中，若使用 <code>Tcping</code> 测速，只要国内中转机房端口开着就会显示几十毫秒绿色延迟，即使海外落地机房已经断线或账户欠费也看不出来。切换为 <code>Real Delay / URL-Test</code>（请求 <code>https://www.gstatic.com/generate_204</code>）才能看到真实连通性。

## 五、第三优先级：排查本地宽带 DNS、防病毒拦截与服务端故障

1. <strong>本地运营商 DNS 无法解析节点入口域名</strong>：
   - 机场节点地址通常填写的是中转域名而非写死 IP。如果本地宽带默认 DNS 抽风，无法解析该入口域名，节点就会报 <code>lookup xxx: no such host</code> 或超时。
   - <strong>修复</strong>：将电脑网卡或路由器的主 DNS 改为公共可靠 DNS（如 <code>223.5.5.5</code>、<code>119.29.29.29</code>），刷新 DNS 缓存（Windows 执行 <code>ipconfig /flushdns</code>）后再试。
2. <strong>安全软件或旧版客户端内核冲突</strong>：
   - 360、火绒或企业终端安全软件偶尔会拦截 Clash 内核二进制（<code>mihomo.exe</code> / <code>xray.exe</code>）的出站请求；同时过旧的 Clash for Windows 无法识别 <code>VLESS-Reality</code> 或 <code>AnyTLS</code> 节点，也会直接表现为连接失败。
3. <strong>确认服务端故障与应急切换</strong>：
   - 若用手机 5G 流量 + 已校准时间的两台不同设备更新最新订阅后，全地区节点依然 100% <code>Timeout</code>，查看机场官网公告频道确认是否遭遇机房光缆割接或上游清退。高频远程办公用户平时可备一个低成本按量不限时流量包作为断网灾备，相关选型与避坑见 [不限时流量包对比](/compare/non-expiring-plans/) 与 [品牌替代方案指南](/risks/alternatives/)。
