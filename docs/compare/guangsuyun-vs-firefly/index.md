---
title: 光速云 vs Firefly 横向对比：全平台开放订阅与 IPLC 专属客户端之争
seoTitle: 光速云 vs Firefly 萤火虫哪个好？2026 客户端政策变更、IPLC 线路与价格对比
description: 深度对比光速云（guangsuyun）与 Firefly（萤火虫），重点剖析 Firefly 2026 年 10 月收紧为仅限专属客户端的影响、两家 IPLC/IEPL 性能数据及多周期套餐差异。
schemaType: Article
author: 机场测评实验室
reviewer: 网络基础设施测评组
pubDate: '2026-11-24'
updatedDate: '2026-11-24'
verifiedDate: '2026-11-24'
dataStatus: Conflicting
sourceNote: 数据源自 data/brands.json（已合并 Firefly 与 Firefly 萤火虫实体）、data/plans.json、data/benchmarks.json 与 data/risk-records.json。
faq:
  - q: Firefly 还能导入 Clash Verge Rev 或小火箭（Shadowrocket）吗？
    a: 需高度注意政策变化！虽然 2026-08-09 的早期历史资料曾记录其为 IPLC + VLESS 且未限制客户端，但 2026 年 10 月的主体资料已明确注明“专属客户端下载登录即用，不提供订阅链接（exclusive-only）”。如果你需要第三方客户端或软路由，应选择明确开放订阅的光速云。
  - q: Firefly 为什么在数据状态上标为 Conflicting（存在冲突）？
    a: 一是上述 2026 年 10 月客户端权限收紧与 8 月历史记录的差异；二是同一推广域名 vip02.fireflyaff.com 在两份原始清单中存在两套不同的邀请码参数（本站合并为唯一品牌实体 firefly 后如实记录），且目前缺少独立的 MiaoKo 测速截图证据。
  - q: Firefly 的两年付、三年付单价只有 ¥0.085/GB，值得直接冲三年吗？
    a: 尽管 Firefly 为 Lite/Plus/Blaze/Nova 提供了季付至三年付共 26 个细分档位，折算单价很诱人，但鉴于其开业年份未公开、缺少独立测速截图且近期刚收紧客户端策略，按本实验室风控原则不建议直接锁定两年或三年长周期，务必先从 ¥25 Lite 月付实测。
---

# 光速云 vs Firefly 深度横向对比

**光速云（#1）** 与 **Firefly（萤火虫，#11）** 在纸面速率（`2026-10-19` 五地文本记录）和入门年付定价（¥99 vs ¥96）上颇为相似，但深挖底层运营档案后会发现两家在 **客户端自由度、证据完整度与支付通道** 上存在决定性差异。

<BrandComparisonTool :initial-slugs="['guangsuyun', 'firefly']" />

---

## 一、核心硬指标统一口径对照表

| 对比维度 | 光速云 (guangsuyun) | Firefly (firefly / 萤火虫) |
| :--- | :--- | :--- |
| **开业年份** | **2020 年** | 待核实（公开资料未标注） |
| **线路架构** | IEPL专线 · 企业级内网专线 · IPLC专线 | IPLC专线（资料称原生 IP） |
| **传输协议** | VLESS / Shadowsocks / AnyTLS | VLESS（历史资料记录） |
| **覆盖地区** | 港/台/日/新/美 + 马/英/法/德/土/泰/巴（12 地区，62–70 节点） | 港/台/新/日/美（5 地区，节点总数待核实） |
| **客户端接入方式** | **自研客户端 + 第三方通用订阅双支持** | **仅限专属客户端 (`exclusive-only`)**（2026-10 起不提供订阅链接） |
| **同时在线设备数** | 不限设备数量 | 不限设备数量 |
| **入门年付小包** | ¥99/年（69GB/月 · **¥0.1196/GB**） | **¥96/年**（60GB/月 · ¥0.1333/GB） |
| **主力月付起步** | ¥25/月（**168GB/月** · ¥0.1488/GB） | ¥25/月 Lite（150GB/月 · ¥0.1667/GB；支持季/半/年/2年/3年阶梯） |
| **不限时流量包** | **¥147 / 247GB（¥0.5951/GB）** | ¥100 / 100GB（¥1.0000/GB） |
| **公开优惠码** | `AMM`（轻量/永久不打折） | `firefly`（新用户 8 折，年付小包不适用） |
| **支付方式** | **支付宝 / 微信 / USDT** | 支付宝 / USDT（历史资料注明**无微信支付**） |
| **证据完整度** | `Measured`（含 6 张原始测速/解锁截图 + 文本记录） | `Conflicting`（仅 10-19 文本记录，缺独立截图） |

---

## 二、2026-10-19 非晚高峰速率对照

仅从 `2026-10-19` 的单次非晚高峰文本记录看，Firefly 的五地纸面数字非常亮眼（尤其是新加坡 445Mbps、美国 30Mbps）：

| 测试地区（2026-10-19 非晚高峰） | 光速云（延迟 / 峰值下行） | Firefly（延迟 / 峰值下行） |
| :--- | :---: | :---: |
| **香港** | 22 ms / 529 Mbps | 27 ms / **547 Mbps** |
| **台湾** | 41 ms / 114 Mbps | 39 ms / **135 Mbps** |
| **新加坡** | 46 ms / 387 Mbps | 42 ms / **445 Mbps** |
| **日本** | 57 ms / 135 Mbps | 57 ms / **147 Mbps** |
| **美国** | 143 ms / 18 Mbps | 143 ms / **30 Mbps** |

> [!WARNING]
> **客观审慎提示**：Firefly 目前缺少像光速云那样带时间戳和节点拓扑的原始 MiaoKo 截图证据，且在 2026 年 10 月将客户端收紧为仅限专属客户端登录（不支持导出订阅到 Clash、小火箭或软路由）。不能仅凭一组非晚高峰文本数字直接下大额长单。

---

## 三、选购结论

- **绝大多数用户优先选 [光速云](/reviews/guangsuyun/)**：运营满 5 年（2020 起）、拥有 6 张独立实测截图验证、支持微信/支付宝/USDT 全支付方式、同为 ¥25 月付多给 18GB、永久包每 GB 便宜 40%，最重要的是**保留了完整的 Clash / Shadowrocket / OpenWrt 第三方订阅权限**。
- **何时考虑体验 [Firefly](/reviews/firefly/)？**：你习惯使用官方一键登录客户端、不使用软路由、常用支付宝或 USDT，且希望用 `firefly` 新用户 8 折码买一个月 Lite（折后约 ¥20/150GB）亲自验证其 IPLC 美日新速率。

<div style="display: flex; flex-wrap: wrap; gap: 1rem; margin: 1.25rem 0;">
  <AffiliateButton brand-slug="guangsuyun" brand-name="光速云" label="前往光速云官网查看套餐" :show-disclosure="false" source-section="compare_guangsuyun_firefly" />
  <AffiliateButton brand-slug="firefly" brand-name="Firefly" variant="secondary" label="前往 Firefly 官网查看套餐" :show-disclosure="false" source-section="compare_guangsuyun_firefly" />
</div>

<AffiliateDisclosure />
