---
title: 31 家机场品牌客户端兼容性矩阵（通用订阅 vs 专属客户端）
seoTitle: 31 家机场客户端兼容性矩阵：哪些支持 Clash/Shadowrocket，哪些仅限专属客户端？
description: 基于 data/client-compatibility.json 逐一核对 31 家收录机场的客户端接入模式（self-hosted-and-third-party、third-party、exclusive-only、unverified），标注支持系统、第三方订阅权限及 2026 年 10 月政策切换冲突。
schemaType: Article
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Measured
sourceNote: 数据完全同步自 data/client-compatibility.json 与 data/brands.json（共 31 家实体）。
faq:
  - q: 哪些机场明确不支持第三方订阅链接（不能导入 Clash 或 Shadowrocket）？
    a: 根据截至 2026-11-24 的数据审计，共 8 家品牌处于 exclusive-only 模式：飞猫云、隐形人、无忧链接（2026 年 10 月起调整）、Firefly（2026 年 10 月起调整）、灵猫网络（2026 年 10 月起调整）、SOGO 云、闪跃、全球云。这些品牌均要求使用官方专属客户端登录，无法直接导入第三方软件。
  - q: 哪些品牌既提供自研客户端，又允许导出第三方通用订阅？
    a: 共 13 家品牌记录为 self-hosted-and-third-party：光速云、大佬云、二猫云、宇宙云（正文存在待核实标记）、极连云、光年梯、速界、闪电鼠、云界线、榴莲云、神行加速、环球梯、梯子云。这类品牌同时兼顾新手一键登录和进阶用户的 Clash/sing-box/OpenWrt 需求。
  - q: 为什么部分标注“unverified”的品牌列表里仍然能看到 Clash/v2rayN 等兼容客户端？
    a: 例如微风网络、星岛梦、唯兔云、U1S1 与灵动云，虽然品牌文案未明确强调是否同时提供自研客户端，但实验室在 2026-07 至 2026-08 的独立测速中已直接通过其 VLESS 或 Shadowsocks 订阅链接完成实测，因此已确认具备第三方订阅兼容性；而暮光加速、浪网、边缘节点 EdgeNova 暂无公开订阅实测或自研限制说明，故保持待核实。
---

# 31 家机场品牌客户端兼容性矩阵（通用订阅 vs 专属客户端）

许多用户在购买机场后才发现“官网只有专属客户端下载，找不到 Clash 或小火箭订阅链接”，从而导致软路由（OpenWrt）或 Linux 服务器无法接入。本页面根据 `data/client-compatibility.json` 的逐条审计结果，将全库 **31 家收录品牌** 按照客户端接入模式划分为四大类别，并明确标注近期发生政策变更与资料冲突的品牌。

---

## 一、四种接入模式定义与分布统计

| 接入模式 (`clientMode`) | 数量 | 含义说明 | 是否支持 Clash / Shadowrocket / 软路由 |
| :--- | :---: | :--- | :--- |
| `self-hosted-and-third-party`（双模式支持） | **13 家** | 既提供官方自研一键客户端，又开放第三方通用订阅导入 | **是**（兼顾新手与软路由/自定义规则） |
| `third-party`（纯第三方通用） | **2 家** | 不强制使用专属壳，直接下发通用订阅链接 | **是**（原生面向通用客户端） |
| `exclusive-only`（仅限专属客户端） | **8 家** | 仅限下载官方客户端账号登录，不提供第三方订阅 URL | **否**（除 SOGO 云注明自研客户端含主流软路由外，无法导入 Clash/小火箭） |
| `unverified`（尚未明确 / 部分已实测） | **8 家** | 资料未明确是否强制专属客户端；其中 5 家已在测速中验证可通过订阅接入 | **5 家已测通订阅，3 家待核实** |

> [!IMPORTANT]
> **2026 年 10 月政策收紧提示**：**无忧链接、Firefly、灵猫网络** 在 2026 年 7–8 月的历史测速期间曾通过 VLESS 或 Shadowsocks 订阅链接进行测试，但 2026 年 10 月的主体资料已明确调整为“专属客户端下载登录即用，不提供订阅链接”。在没有重新核实官网后台前，本站统一按最新口径将其列为 `exclusive-only` 并提示跨端风险。

---

## 二、31 家机场客户端兼容性完整对照表

### A. 支持第三方通用订阅（双模式 & 纯通用，共 15 家）

| 品牌 | 接入模式 | 支持系统 | 典型兼容客户端 | 核实备注与数据状态 |
| :--- | :--- | :--- | :--- | :--- |
| [光速云](/reviews/guangsuyun/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | Clash Verge Rev, v2rayN, FlClash, Hiddify, Karing, Clash Mi, v2rayNG, Shadowrocket, Stash, sing-box, OpenClash, PassWall2 | 提供自研客户端，同时支持 Clash、Shadowrocket 等导入（`Measured`） |
| [大佬云](/reviews/dalaoyun/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | Clash Verge Rev, v2rayN, FlClash, Hiddify, Karing, Clash Mi, v2rayNG, Shadowrocket, Stash, sing-box, OpenClash, PassWall2 | 品牌资料标注支持自研客户端 + 第三方订阅导入（`Vendor Data`） |
| [二猫云](/reviews/ermao/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | Clash Verge Rev, v2rayN, FlClash, Hiddify, Karing, Clash Mi, v2rayNG, Shadowrocket, Stash, sing-box, OpenClash, PassWall2 | 配备独家定制客户端；08-11 截图通过 SS 节点测速，具体第三方权限以官网为准（`Measured`） |
| [极连云](/reviews/jilian/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | Clash Verge Rev, v2rayN, FlClash, Hiddify, Karing, v2rayNG, Shadowrocket, Stash, Quantumult X, Surge, OneClick, OpenClash | 明确支持自研 + 第三方客户端，08-11 通过 SS 测速（`Measured`） |
| [光年梯](/reviews/guangnian/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | Clash Verge Rev, v2rayN, FlClash, Hiddify, Karing, Clash Mi, v2rayNG, Shadowrocket, Stash, sing-box, OpenClash, PassWall2 | 支持自研客户端 + 第三方订阅导入（`Measured`） |
| [一翻云](/reviews/yifan/) | 仅第三方通用 | Win / macOS / iOS / Android / Linux / OpenWrt | Clash Verge Rev, v2rayN, FlClash, Hiddify, Karing, Clash Mi, Shadowrocket, Stash, sing-box, OpenClash, PassWall2 | 提供 Hysteria 2 / VLESS-Reality / SS 三协议（`Measured`） |
| [可信云](/reviews/kexin/) | 仅第三方通用 | Win / macOS / iOS / Android / Linux / OpenWrt | Clash Verge Rev, v2rayN, FlClash, Hiddify, Karing, Clash Mi, v2rayNG, Shadowrocket, Stash, sing-box, OpenClash, PassWall2 | 品牌资料标注支持第三方客户端（`Measured`） |
| [速界](/reviews/sujie/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | Clash Verge Rev, v2rayN, FlClash, Hiddify, Karing, Clash Mi, v2rayNG, Shadowrocket, Stash, sing-box, OpenClash, PassWall2 | 支持自研客户端 + 第三方订阅导入（`Measured`） |
| [闪电鼠](/reviews/shandianshu/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | 同上主流第三方桌面/移动/软路由客户端 | 支持自研客户端 + 第三方订阅导入（`Vendor Data`） |
| [云界线](/reviews/yunjiexian/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | 同上主流第三方桌面/移动/软路由客户端 | 支持自研客户端 + 第三方订阅导入；存在注册 URL 格式冲突（`Conflicting`） |
| [榴莲云](/reviews/liulianyun/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | Clash Verge Rev, v2rayN, FlClash, Hiddify, Karing, v2rayNG, Shadowrocket, Stash, Quantumult X, Surge, OneClick, OpenClash | 支持自研 + 第三方订阅导入，但核心测试与协议仍待补充（`Unverified`） |
| [神行加速](/reviews/shenxing/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | 同上主流第三方桌面/移动/软路由客户端 | 支持自研客户端 + 第三方订阅导入（`Vendor Data`） |
| [环球梯](/reviews/huanqiuti/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | 同上主流第三方桌面/移动/软路由客户端 | 支持自研 + 第三方订阅导入；URL 缺少 `#/` 片段提示核验（`Vendor Data`） |
| [梯子云](/reviews/tiziyun/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | 同上主流第三方桌面/移动/软路由客户端 | 提供自研一键登录客户端与通用订阅导入（`Vendor Data`） |
| [宇宙云](/reviews/yuzhou/) | 自研 + 第三方 | Win / macOS / iOS / Android / Linux / OpenWrt | 同上主流第三方桌面/移动/软路由客户端 | 汇总表提及自研客户端，08-11 通过 VLESS 订阅测速，正文仍有待核实项（`Unverified`） |

### B. 仅限官方专属客户端（不支持第三方订阅，共 8 家）

| 品牌 | 接入模式 | 官方声明覆盖系统 | 第三方订阅 | 风险与切换期备注 |
| :--- | :--- | :--- | :---: | :--- |
| [飞猫云](/reviews/feimao/) | `exclusive-only` | Windows / macOS / iOS / Android | 不支持 | 登录即用，无法直接导入 Clash / Shadowrocket（`Measured`） |
| [隐形人](/reviews/yinxingren/) | `exclusive-only` | Windows / macOS / iOS / Android | 不支持 | 仅限自带专属客户端，不提供订阅链接（`Conflicting`） |
| [无忧链接](/reviews/wuyou/) | `exclusive-only` | Windows / macOS / iOS / Android | 不支持（2026-10起） | 2026 年 10 月起改用官方专属客户端；汇总表曾有“订阅无需转换”冲突，07-18 曾用 VLESS 实测（`Measured`） |
| [Firefly](/reviews/firefly/) | `exclusive-only` | Windows / macOS / iOS / Android | 不支持（2026-10起） | 2026 年 10 月主体资料注明不提供订阅链接；08-09 历史记录未限定专属客户端（`Conflicting`） |
| [灵猫网络](/reviews/lingmao/) | `exclusive-only` | Windows / macOS / iOS / Android | 不支持（2026-10起） | 2026 年 10 月起改用专属客户端（08-11 曾以 SS 测速）（`Conflicting`） |
| [SOGO 云](/reviews/sogo/) | `exclusive-only` | Windows / macOS / iOS / Android / OpenWrt | 不支持 | 只能通过自研客户端（含主流软路由），Clash/Shadowrocket 无法直接导入（`Measured`） |
| [闪跃](/reviews/shanyue/) | `exclusive-only` | Windows / macOS / iOS / Android | 不支持 | 专属客户端下载登录即用，不提供订阅链接（`Vendor Data`） |
| [全球云](/reviews/quanqiu/) | `exclusive-only` | Windows / macOS / iOS / Android | 不支持 | 正文注明不提供订阅链接（08-11 曾以 SS 节点完成测速）（`Measured`） |

### C. 未明确限定模式 / 部分已实测订阅可用（共 8 家）

| 品牌 | 接入模式 | 实测验证情况 | 建议动作 |
| :--- | :--- | :--- | :--- |
| [微风网络](/reviews/weifeng/) | `unverified` | 2026-07-19 已通过 VLESS 订阅导入 MiaoKo 完成 50 节点实测 | 实际支持第三方订阅，适用 Clash Verge Rev / v2rayN / Shadowrocket 等（`Measured`） |
| [星岛梦](/reviews/xingdaomeng/) | `unverified` | 2026-08-11 已通过 Shadowsocks 订阅节点完成测速 | 实际支持第三方订阅（`Measured`） |
| [唯兔云](/reviews/weitu/) | `unverified` | 2026-08-11 已通过 Shadowsocks 订阅节点完成测速 | 实际支持第三方订阅（`Measured`） |
| [U1S1](/reviews/u1s1/) | `unverified` | 2026-08-11 已通过 Shadowsocks 节点完成晚高峰测速 | 实际支持第三方订阅（`Measured`） |
| [灵动云](/reviews/lingdong/) | `unverified` | 2026-07-20/21 历史资料曾以 VLESS 订阅完成 60 节点实测 | 历史档案（2026-08-09），近期可用性待复测（`Historical Data`） |
| [暮光加速](/reviews/muguang/) | `unverified` | 资料覆盖 Win/macOS/iOS/Android/Linux，但未明确是否强制自研客户端 | 购买前建议先向官网客服或通过月付确认订阅形态（`Vendor Data`） |
| [浪网](/reviews/langwang/) | `unverified` | 历史档案资料未明确客户端方式 | 待核实（`Historical Data`） |
| [边缘节点 EdgeNova](/reviews/edgenova/) | `unverified` | 历史档案资料未明确客户端方式 | 待核实（`Historical Data`） |

---

## 三、按需求快速筛选建议

- **需要 OpenWrt 软路由透明代理**：优先在 **A 组（15 家）** 或 **已测通订阅的微风网络、星岛梦、唯兔云、U1S1** 中选择，配合 [OpenClash](/clients/openclash/)、[PassWall2](/clients/passwall2/)、[Nikki](/clients/nikki/) 或 [HomeProxy](/clients/homeproxy/) 部署。若对 **SOGO 云** 感兴趣，务必提前在后台确认你的路由器芯片架构是否在官方自研软路由支持列表中。
- **使用 Hysteria 2 或 AnyTLS 等新协议**：注意不同客户端的支持差异。例如 **光速云** 在 2026-08-19 批次出现 VLESS + 10 电信 AnyTLS 节点，**一翻云** 提供 Hysteria 2 / VLESS-Reality / SS 三协议；此时桌面端建议使用 [Clash Verge Rev](/clients/clash-verge-rev/) 或 [sing-box 官方客户端](/clients/sing-box/)，避免使用不支持新协议的旧版软件（如 Potatso、OneClick）。
- **纯小白单设备（不折腾订阅）**：双模式品牌（如光速云、二猫云、梯子云等）与专属客户端品牌都提供官方桌面/移动端客户端，但双模式品牌在日后你想升级到软路由或使用 Shadowrocket 时保留了**迁移自由度**，风险更低。进一步对比可查看 [客户端兼容性横向对比专题](/compare/client-compatibility/)。
