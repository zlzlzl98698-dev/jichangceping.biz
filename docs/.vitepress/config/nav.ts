import type { DefaultTheme } from 'vitepress'

export const NAV_ITEMS: DefaultTheme.NavItem[] = [
  {
    text: '机场推荐',
    activeMatch: '^/(recommend|rankings)/',
    items: [
      { text: '机场推荐总览', link: '/recommend/' },
      { text: '2026 机场排行', link: '/rankings/' },
      { text: '靠谱与稳定机场', link: '/recommend/stable/' },
      { text: '老牌与新手机场', link: '/recommend/beginner/' },
      { text: '高速与多设备机场', link: '/recommend/multi-device/' }
    ]
  },
  {
    text: '价格与套餐',
    activeMatch: '^/(plans|deals)/',
    items: [
      { text: '价格与套餐总览', link: '/plans/' },
      { text: '套餐价格数据库', link: '/plans/database/' },
      { text: '便宜与高性价比机场', link: '/plans/budget/' },
      { text: '不限时与年付套餐', link: '/plans/non-expiring/' },
      { text: '机场优惠与折扣码', link: '/deals/' }
    ]
  },
  {
    text: '机场品牌',
    activeMatch: '^/(brands|reviews|compare)/',
    items: [
      { text: '机场品牌数据库 (31家)', link: '/brands/' },
      { text: '光速云旗舰深度测评', link: '/reviews/guangsuyun/' },
      { text: '全部品牌深度测评', link: '/reviews/' },
      { text: '品牌横向对比中心', link: '/compare/' },
      { text: '品牌运营档案与风险', link: '/risks/archives/' }
    ]
  },
  {
    text: 'VPN与加速器',
    activeMatch: '^/vpn/',
    items: [
      { text: 'VPN 与加速器专题', link: '/vpn/' },
      { text: 'VPN 与机场的本质区别', link: '/vpn/vpn-vs-airport/' },
      { text: '多平台 VPN 选型分析', link: '/vpn/platforms/' },
      { text: '游戏加速器与路由代理', link: '/vpn/game-booster/' }
    ]
  },
  {
    text: '客户端软件',
    activeMatch: '^/clients/',
    items: [
      { text: '客户端软件总览', link: '/clients/' },
      { text: 'Clash Verge Rev', link: '/clients/clash-verge-rev/' },
      { text: 'v2rayN / v2rayNG', link: '/clients/v2rayn/' },
      { text: 'Shadowrocket (小火箭)', link: '/clients/shadowrocket/' },
      { text: 'Mihomo / sing-box / FlClash', link: '/clients/sing-box/' },
      { text: '客户端兼容性矩阵', link: '/clients/compatibility/' }
    ]
  },
  {
    text: 'AI与流媒体',
    activeMatch: '^/ai-streaming/',
    items: [
      { text: 'AI 与流媒体解锁中心', link: '/ai-streaming/' },
      { text: 'ChatGPT / Claude / Gemini', link: '/ai-streaming/ai-tools/' },
      { text: 'Netflix / Disney+ / YouTube', link: '/ai-streaming/streaming/' },
      { text: '可用性对比矩阵', link: '/ai-streaming/matrix/' }
    ]
  },
  {
    text: '线路与节点',
    activeMatch: '^/(network|benchmarks)/',
    items: [
      { text: '线路与节点技术总览', link: '/network/' },
      { text: 'IEPL 与 IPLC 专线解析', link: '/network/iepl-vs-iplc/' },
      { text: '测速与性能数据中心', link: '/benchmarks/' },
      { text: '港/日/台/新/美节点分析', link: '/network/regions/' },
      { text: '测评方法论与指标规范', link: '/methodology/' }
    ]
  },
  {
    text: '使用教程',
    activeMatch: '^/(guides|knowledge)/',
    items: [
      { text: '使用教程中心', link: '/guides/' },
      { text: '订阅导入与客户端配置', link: '/guides/subscription/' },
      { text: 'TUN 模式与 DNS 分流', link: '/guides/tun-dns/' },
      { text: '网络协议与基础科普', link: '/knowledge/' },
      { text: '测速方法与避坑指南', link: '/guides/speedtest-guide/' }
    ]
  },
  {
    text: '故障排查',
    activeMatch: '^/troubleshooting/',
    items: [
      { text: '故障诊断中心', link: '/troubleshooting/' },
      { text: '订阅失败与更新报错', link: '/troubleshooting/subscription-failed/' },
      { text: '节点超时与全部不可用', link: '/troubleshooting/node-timeout/' },
      { text: 'TUN 异常与 DNS 污染', link: '/troubleshooting/tun-dns-error/' }
    ]
  },
  {
    text: '风险与替代',
    activeMatch: '^/risks/',
    items: [
      { text: '风险控制与避坑中心', link: '/risks/' },
      { text: '机场跑路与异常特征', link: '/risks/exit-scam-signals/' },
      { text: '年付/不限时/免费风险', link: '/risks/billing-risks/' },
      { text: '品牌运营档案与替代', link: '/risks/alternatives/' }
    ]
  }
]
