import type { DefaultTheme } from 'vitepress'

const recommendSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '机场推荐与榜单',
    collapsed: false,
    items: [
      { text: '机场推荐总览', link: '/recommend/' },
      { text: '2026 机场排行与分级', link: '/rankings/' },
      { text: '靠谱与稳定机场', link: '/recommend/stable/' },
      { text: '老牌与新手机场', link: '/recommend/beginner/' },
      { text: '高速与多设备机场', link: '/recommend/multi-device/' }
    ]
  },
  {
    text: '场景与线路专项指南',
    collapsed: false,
    items: [
      { text: '电信宽带线路筛选', link: '/recommend/isp-telecom/' },
      { text: '远程办公与跨国会议', link: '/recommend/remote-work/' },
      { text: '跨境电商纯净出口', link: '/recommend/cross-border-ecom/' },
      { text: '主备双机场容灾方案', link: '/recommend/backup-strategy/' }
    ]
  },
  {
    text: '横向决策入口',
    collapsed: false,
    items: [
      { text: '机场品牌数据库 (31家)', link: '/brands/' },
      { text: '品牌横向对比工具', link: '/compare/' },
      { text: '测速与性能证据库', link: '/benchmarks/' },
      { text: '测评方法论与指标规范', link: '/methodology/' }
    ]
  }
]

const plansSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '价格与套餐中心',
    collapsed: false,
    items: [
      { text: '价格与套餐总览', link: '/plans/' },
      { text: '套餐价格数据库', link: '/plans/database/' },
      { text: '便宜与高性价比机场', link: '/plans/budget/' },
      { text: '百元以内年付入门拆解', link: '/plans/under-100-cny-annual/' },
      { text: '不限时与年付套餐', link: '/plans/non-expiring/' },
      { text: '每 GB 单价与倍率陷阱', link: '/plans/cost-per-gb-methodology/' },
      { text: '机场优惠与折扣码', link: '/deals/' }
    ]
  },
  {
    text: '理性购前核查',
    collapsed: false,
    items: [
      { text: '年付/不限时/免费风险', link: '/risks/billing-risks/' },
      { text: '机场品牌数据库', link: '/brands/' },
      { text: '品牌横向对比中心', link: '/compare/' }
    ]
  }
]

const brandsAndReviewsSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '品牌库与对比中心',
    collapsed: false,
    items: [
      { text: '机场品牌数据库 (31家)', link: '/brands/' },
      { text: '全部品牌深度测评', link: '/reviews/' },
      { text: '品牌横向对比工具', link: '/compare/' },
      { text: '品牌运营档案与风险', link: '/risks/archives/' }
    ]
  },
  {
    text: '主推与重点评测品牌',
    collapsed: false,
    items: [
      { text: '光速云旗舰深度测评', link: '/reviews/guangsuyun/' },
      { text: '暮光加速深度测评', link: '/reviews/muguang/' },
      { text: '飞猫云深度测评', link: '/reviews/feimao/' },
      { text: '微风网络深度测评', link: '/reviews/weifeng/' },
      { text: '大佬云深度测评', link: '/reviews/dalaoyun/' },
      { text: '星岛梦深度测评', link: '/reviews/xingdaomeng/' },
      { text: '隐形人深度测评', link: '/reviews/yinxingren/' },
      { text: '二猫云深度测评', link: '/reviews/ermao/' },
      { text: '无忧链接深度测评', link: '/reviews/wuyou/' },
      { text: '唯兔云深度测评', link: '/reviews/weitu/' },
      { text: 'Firefly 深度测评', link: '/reviews/firefly/' }
    ]
  },
  {
    text: '其余收录品牌测评 (20家)',
    collapsed: true,
    items: [
      { text: '宇宙云', link: '/reviews/yuzhou/' },
      { text: 'U1S1', link: '/reviews/u1s1/' },
      { text: '灵猫网络', link: '/reviews/lingmao/' },
      { text: '极连云', link: '/reviews/jilian/' },
      { text: '光年梯', link: '/reviews/guangnian/' },
      { text: '一翻云', link: '/reviews/yifan/' },
      { text: 'SOGO 云', link: '/reviews/sogo/' },
      { text: '可信云', link: '/reviews/kexin/' },
      { text: '速界', link: '/reviews/sujie/' },
      { text: '闪跃', link: '/reviews/shanyue/' },
      { text: '全球云', link: '/reviews/quanqiu/' },
      { text: '闪电鼠', link: '/reviews/shandianshu/' },
      { text: '云界线', link: '/reviews/yunjiexian/' },
      { text: '榴莲云', link: '/reviews/liulianyun/' },
      { text: '神行加速', link: '/reviews/shenxing/' },
      { text: '环球梯', link: '/reviews/huanqiuti/' },
      { text: '梯子云', link: '/reviews/tiziyun/' },
      { text: '灵动云', link: '/reviews/lingdong/' },
      { text: '浪网', link: '/reviews/langwang/' },
      { text: '边缘节点 EdgeNova', link: '/reviews/edgenova/' }
    ]
  },
  {
    text: '测速与风险参考',
    collapsed: true,
    items: [
      { text: '测速与性能数据中心', link: '/benchmarks/' },
      { text: '测评方法论与指标规范', link: '/methodology/' },
      { text: '品牌替代方案指南', link: '/risks/alternatives/' }
    ]
  }
]

const vpnSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'VPN 与加速器专题',
    collapsed: false,
    items: [
      { text: 'VPN 与加速器总览', link: '/vpn/' },
      { text: 'VPN 与机场的本质区别', link: '/vpn/vpn-vs-airport/' },
      { text: '多平台 VPN 选型分析', link: '/vpn/platforms/' },
      { text: '游戏加速器与路由代理', link: '/vpn/game-booster/' }
    ]
  },
  {
    text: '关联指南与工具',
    collapsed: false,
    items: [
      { text: '客户端软件中心', link: '/clients/' },
      { text: '客户端兼容性矩阵', link: '/clients/compatibility/' },
      { text: '机场品牌数据库', link: '/brands/' }
    ]
  }
]

const clientsSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '代理客户端总览',
    collapsed: false,
    items: [
      { text: '客户端软件总览', link: '/clients/' },
      { text: '客户端兼容性矩阵', link: '/clients/compatibility/' }
    ]
  },
  {
    text: '核心客户端深度指南',
    collapsed: false,
    items: [
      { text: 'Clash Verge Rev', link: '/clients/clash-verge-rev/' },
      { text: 'v2rayN / v2rayNG', link: '/clients/v2rayn/' },
      { text: 'Shadowrocket (小火箭)', link: '/clients/shadowrocket/' },
      { text: 'Mihomo / sing-box / FlClash', link: '/clients/sing-box/' }
    ]
  },
  {
    text: '配置与排障延伸',
    collapsed: false,
    items: [
      { text: '订阅导入与客户端配置', link: '/guides/subscription/' },
      { text: 'TUN 模式与 DNS 分流', link: '/guides/tun-dns/' },
      { text: '订阅失败与更新报错', link: '/troubleshooting/subscription-failed/' }
    ]
  }
]

const aiStreamingSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'AI 与流媒体解锁中心',
    collapsed: false,
    items: [
      { text: 'AI 与流媒体总览', link: '/ai-streaming/' },
      { text: 'ChatGPT / Claude / Gemini', link: '/ai-streaming/ai-tools/' },
      { text: 'Netflix / Disney+ / YouTube', link: '/ai-streaming/streaming/' },
      { text: '可用性对比矩阵', link: '/ai-streaming/matrix/' }
    ]
  },
  {
    text: '实测与排障参考',
    collapsed: false,
    items: [
      { text: '测速与性能数据中心', link: '/benchmarks/' },
      { text: '节点超时与全部不可用', link: '/troubleshooting/node-timeout/' },
      { text: '机场品牌数据库', link: '/brands/' }
    ]
  }
]

const networkAndBenchmarksSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '线路、节点与测速实验室',
    collapsed: false,
    items: [
      { text: '线路与节点技术总览', link: '/network/' },
      { text: 'IEPL 与 IPLC 专线解析', link: '/network/iepl-vs-iplc/' },
      { text: '港/日/台/新/美节点分析', link: '/network/regions/' },
      { text: '测速与性能数据中心', link: '/benchmarks/' },
      { text: '测评方法论与指标规范', link: '/methodology/' }
    ]
  },
  {
    text: '延伸技术参考',
    collapsed: false,
    items: [
      { text: '网络协议与基础科普', link: '/knowledge/' },
      { text: '测速方法与避坑指南', link: '/guides/speedtest-guide/' },
      { text: '品牌横向对比工具', link: '/compare/' }
    ]
  }
]

const guidesAndKnowledgeSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '使用教程与实操',
    collapsed: false,
    items: [
      { text: '使用教程中心', link: '/guides/' },
      { text: '订阅导入与客户端配置', link: '/guides/subscription/' },
      { text: 'TUN 模式与 DNS 分流', link: '/guides/tun-dns/' },
      { text: 'Clash/Mihomo 分流规则', link: '/guides/clash-rules/' },
      { text: '测速方法与避坑指南', link: '/guides/speedtest-guide/' }
    ]
  },
  {
    text: '网络协议与科普知识',
    collapsed: false,
    items: [
      { text: '网络协议与基础科普', link: '/knowledge/' },
      { text: 'IEPL 与 IPLC 专线解析', link: '/network/iepl-vs-iplc/' },
      { text: '客户端软件总览', link: '/clients/' },
      { text: '故障诊断中心', link: '/troubleshooting/' }
    ]
  }
]

const troubleshootingSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '连接故障诊断中心',
    collapsed: false,
    items: [
      { text: '故障诊断总览', link: '/troubleshooting/' },
      { text: '订阅失败与更新报错', link: '/troubleshooting/subscription-failed/' },
      { text: '节点超时与全部不可用', link: '/troubleshooting/node-timeout/' },
      { text: 'TUN 异常与 DNS 污染', link: '/troubleshooting/tun-dns-error/' }
    ]
  },
  {
    text: '配置与替代检查',
    collapsed: false,
    items: [
      { text: '订阅导入与客户端配置', link: '/guides/subscription/' },
      { text: 'TUN 模式与 DNS 分流', link: '/guides/tun-dns/' },
      { text: '风险控制与替代方案', link: '/risks/alternatives/' }
    ]
  }
]

const risksSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '风险控制与避坑中心',
    collapsed: false,
    items: [
      { text: '风险控制与避坑总览', link: '/risks/' },
      { text: '机场跑路与异常特征', link: '/risks/exit-scam-signals/' },
      { text: '年付/不限时/免费风险', link: '/risks/billing-risks/' },
      { text: '专属客户端锁定风险', link: '/risks/exclusive-client-lockin/' },
      { text: '品牌运营档案与风险', link: '/risks/archives/' },
      { text: '品牌替代方案指南', link: '/risks/alternatives/' }
    ]
  },
  {
    text: '客观核验参考',
    collapsed: false,
    items: [
      { text: '测评方法论与指标规范', link: '/methodology/' },
      { text: '关于机场测评实验室', link: '/about/' },
      { text: '机场品牌数据库', link: '/brands/' }
    ]
  }
]

const aboutSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '实验室与编辑规范',
    collapsed: false,
    items: [
      { text: '关于机场测评实验室', link: '/about/' },
      { text: '测评方法论与指标规范', link: '/methodology/' },
      { text: '测速与性能数据中心', link: '/benchmarks/' },
      { text: '风险控制与披露原则', link: '/risks/' }
    ]
  }
]

export const SIDEBAR_CONFIG: DefaultTheme.Sidebar = {
  '/recommend/': recommendSidebar,
  '/rankings/': recommendSidebar,
  '/plans/': plansSidebar,
  '/deals/': plansSidebar,
  '/brands/': brandsAndReviewsSidebar,
  '/reviews/': brandsAndReviewsSidebar,
  '/compare/': brandsAndReviewsSidebar,
  '/vpn/': vpnSidebar,
  '/clients/': clientsSidebar,
  '/ai-streaming/': aiStreamingSidebar,
  '/network/': networkAndBenchmarksSidebar,
  '/benchmarks/': networkAndBenchmarksSidebar,
  '/methodology/': networkAndBenchmarksSidebar,
  '/guides/': guidesAndKnowledgeSidebar,
  '/knowledge/': guidesAndKnowledgeSidebar,
  '/troubleshooting/': troubleshootingSidebar,
  '/risks/': risksSidebar,
  '/about/': aboutSidebar
}
