import type { DataStatus } from './types'

export const AFFILIATE_DISCLOSURE = '含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。'
export const AFFILIATE_REL = 'nofollow sponsored noopener' as const
export const AFFILIATE_TARGET = '_blank' as const

export interface AffiliateAlternateUrl {
  url: string
  source: string
  note?: string
}

export interface AffiliateLinkItem {
  brandSlug: string
  brandName: string
  primaryUrl: string
  alternateUrls: AffiliateAlternateUrl[]
  couponCode: string | null
  alternateCouponCode?: string | null
  couponDiscount: string | null
  couponRestriction: string | null
  urlFormatWarning?: string
  rel: typeof AFFILIATE_REL
  target: typeof AFFILIATE_TARGET
  disclosureText: string
  verifiedDate: string
  dataStatus: DataStatus
}

export interface ExtraAffiliatePrefix {
  name: string
  slug: string
  url: string
  sourceId: string
  note: string
}

export const AFFILIATE_LINK_LIST: AffiliateLinkItem[] = [
  {
    "brandSlug": "guangsuyun",
    "brandName": "光速云",
    "primaryUrl": "https://sahude.gsyvipaff.com/#/?code=keqgvT5Y",
    "alternateUrls": [
      {
        "url": "https://mdlky.gsyaff.com",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "AMM",
    "couponDiscount": "新人优惠券（具体折扣比例以官网结算页为准；轻量版/147永久版标注不打折）",
    "couponRestriction": "致敬斯诺克147永久套餐与轻量版标注不打折；极速版及定制版标注半年9折/年付8折/两年75折/三年7折",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "muguang",
    "brandName": "暮光加速",
    "primaryUrl": "https://varnexa.twilightaff.com/#/?code=D1LHglg3",
    "alternateUrls": [],
    "couponCode": "muguang5555",
    "couponDiscount": "品牌资料未明确折扣比例（且正文存在无公开优惠码冲突表述）",
    "couponRestriction": "存在文档内冲突，下单前请实测核验是否可用",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Vendor Data"
  },
  {
    "brandSlug": "feimao",
    "brandName": "飞猫云",
    "primaryUrl": "https://guangs.flycataff.com/#/?code=6uq0Xe9y",
    "alternateUrls": [
      {
        "url": "https://flycat1.flycatvipaff.cc",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "flycat888",
    "couponDiscount": "8 折（汇总表标注“7元档 + 8折”，适用条件以结账页为准）",
    "couponRestriction": "具体适用套餐范围待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "weifeng",
    "brandName": "微风网络",
    "primaryUrl": "https://edp01.breezenetaff.com/#/?code=t3huofyI",
    "alternateUrls": [],
    "couponCode": "flat888",
    "couponDiscount": "9 折（汇总表标注“7元档 + 9折”）",
    "couponRestriction": "具体适用周期以官网结算页为准",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "dalaoyun",
    "brandName": "大佬云",
    "primaryUrl": "https://qwerty.dalaoyunaff.com/#/?code=jCPLmoWN",
    "alternateUrls": [],
    "couponCode": "dly888",
    "couponDiscount": "季付及以上 7 折（来源品牌资料）",
    "couponRestriction": "季付及以上适用（以官网结算为准）",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Vendor Data"
  },
  {
    "brandSlug": "xingdaomeng",
    "brandName": "星岛梦",
    "primaryUrl": "https://guangs.xingdaomeng.com/#/?code=1TynBYnR",
    "alternateUrls": [
      {
        "url": "https://kfccbb.xingdaomeng.com",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "nmw888",
    "couponDiscount": "待核实（品牌资料未标注具体折扣率）",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "yinxingren",
    "brandName": "隐形人",
    "primaryUrl": "https://yinxingren1.invisibleaff.com/#/?code=kcyEeoJT",
    "alternateUrls": [
      {
        "url": "https://varnexa.invisibleaff.com",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "moon80",
    "alternateCouponCode": "yxr888",
    "couponDiscount": "8 折（正文与基础信息标注）；汇总表另列优惠码 yxr888",
    "couponRestriction": "未标注限制条件",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Conflicting"
  },
  {
    "brandSlug": "ermao",
    "brandName": "二猫云",
    "primaryUrl": "https://guangs.2maoyunaff.cc/#/?code=7mjvgGbW",
    "alternateUrls": [
      {
        "url": "https://waaa.2maoyunaff.cc",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "ermao5555",
    "couponDiscount": "待核实",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "wuyou",
    "brandName": "无忧链接",
    "primaryUrl": "https://wep01.worryfreeaff.com/#/?code=4ZoSbLdL",
    "alternateUrls": [],
    "couponCode": "wuyou666",
    "couponDiscount": "待核实",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "weitu",
    "brandName": "唯兔云",
    "primaryUrl": "https://guangs.v2yunvipaff.com/#/?code=xIutqOBA",
    "alternateUrls": [
      {
        "url": "https://fast.v2yunvipaff.com",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "weitu666",
    "couponDiscount": "待核实",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "firefly",
    "brandName": "Firefly",
    "primaryUrl": "https://vip02.fireflyaff.com/#/?code=2n7VURre",
    "alternateUrls": [
      {
        "url": "https://vip02.fireflyaff.com/#/?code=jTp9wSgZ",
        "source": "sources/brand-info/32家机场品牌清单.txt (Firefly 萤火虫 2026-08-09 历史记录)",
        "note": "合并后保留的同域名第二邀请码"
      }
    ],
    "couponCode": "firefly",
    "couponDiscount": "8 折（新用户 8 折；年付版不适用；追加历史资料另注季9/半85/年8折，最高约64折）",
    "couponRestriction": "年付版不适用新用户 8 折",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Conflicting"
  },
  {
    "brandSlug": "yuzhou",
    "brandName": "宇宙云",
    "primaryUrl": "https://wzjc.yuzoucloud.cc/#/?code=yrThwMP1",
    "alternateUrls": [],
    "couponCode": "YUZHOU553",
    "couponDiscount": "历史资料称新用户 8 折",
    "couponRestriction": "早期历史资料记录，现行有效性待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Unverified"
  },
  {
    "brandSlug": "u1s1",
    "brandName": "U1S1",
    "primaryUrl": "https://guangs.vipaff.cc/#/?code=xhX5X22f",
    "alternateUrls": [
      {
        "url": "https://pkdj7.vipaff.cc",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "akaka",
    "couponDiscount": "待核实",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "lingmao",
    "brandName": "灵猫网络",
    "primaryUrl": "https://vip01.civetnet.com/#/?code=8MIAyxak",
    "alternateUrls": [
      {
        "url": "https://vip02.civetaff.com",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "lingmao",
    "alternateCouponCode": "lmao888",
    "couponDiscount": "8 折（基础信息标注；另在基础数据及汇总表记录优惠码 lmao888）",
    "couponRestriction": "年付小包不适用",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Conflicting"
  },
  {
    "brandSlug": "jilian",
    "brandName": "极连云",
    "primaryUrl": "https://guangs.jlyvipaff.com/#/?code=VM1rKGUu",
    "alternateUrls": [
      {
        "url": "https://kdjhao.jlyvipaff.com",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "ji8888",
    "couponDiscount": "待核实",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "guangnian",
    "brandName": "光年梯",
    "primaryUrl": "https://guangs.gntaff.com/#/?code=X1FoxjGE",
    "alternateUrls": [
      {
        "url": "https://ggmq.gntaff.com",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "gnt6666",
    "couponDiscount": "待核实",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "yifan",
    "brandName": "一翻云",
    "primaryUrl": "https://guangs.1flyunaff.cc/#/register?code=Yr7FhB7r",
    "alternateUrls": [
      {
        "url": "https://wzjc.1flyunaff.cc",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "1FLYYUN",
    "alternateCouponCode": "yfy6666",
    "couponDiscount": "9 折（正文标注 1FLYYUN；基础数据及汇总表另列优惠码 yfy6666）",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "sogo",
    "brandName": "SOGO 云",
    "primaryUrl": "https://guangs.sogoyunaff.cc/#/?code=327Vs0w7",
    "alternateUrls": [
      {
        "url": "https://wzjc.sogoyunaff.cc",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "SOGO10000",
    "alternateCouponCode": "sss777",
    "couponDiscount": "9 折（基础信息与正文标注 SOGO10000；汇总表另列 sss777）",
    "couponRestriction": "未标注限制条件",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "kexin",
    "brandName": "可信云",
    "primaryUrl": "https://guangs.kosingaff.com/#/register?code=UYDtNlCY",
    "alternateUrls": [
      {
        "url": "https://work.kosingaff.com",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "kkk333",
    "couponDiscount": "待核实",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "sujie",
    "brandName": "速界",
    "primaryUrl": "https://guangs.speedworldaff.cc/#/register?code=xgXzEfZB",
    "alternateUrls": [
      {
        "url": "https://work.speedworldaff.cc",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "sss1111",
    "couponDiscount": "待核实",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "shanyue",
    "brandName": "闪跃",
    "primaryUrl": "https://vip02.flashleapaff.com/#/?code=3lgzm9mm",
    "alternateUrls": [],
    "couponCode": "shanyue",
    "couponDiscount": "8 折",
    "couponRestriction": "仅限闪动 / 飞跃 / 瞬移 / 跃迁四档月付套餐，年付版不适用",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Vendor Data"
  },
  {
    "brandSlug": "quanqiu",
    "brandName": "全球云",
    "primaryUrl": "https://guangs.gcvipaff.com/#/?code=Ov2nvU9C",
    "alternateUrls": [
      {
        "url": "https://sswdh.gcvipaff.com",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "qq88",
    "alternateCouponCode": "qqy7777",
    "couponDiscount": "8 折（基础信息标注 qq88；汇总表另列 qqy7777）",
    "couponRestriction": "未标注限制条件",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Measured"
  },
  {
    "brandSlug": "shandianshu",
    "brandName": "闪电鼠",
    "primaryUrl": "https://qwerty.shandianshuaff.com/#/?code=rUE75iYh",
    "alternateUrls": [],
    "couponCode": "sd88",
    "couponDiscount": "季付及以上 7 折（品牌资料）",
    "couponRestriction": "季付及以上适用",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Vendor Data"
  },
  {
    "brandSlug": "yunjiexian",
    "brandName": "云界线",
    "primaryUrl": "https://qwerty.yunjiexianaff.com/?code=aycnwNUi",
    "alternateUrls": [
      {
        "url": "https://qwerty.yunjiexianaff.com/?code=HBaZ91c6",
        "source": "sources/brand-info/32家机场品牌清单.txt (汇总表第944行)",
        "note": "同文件汇总表中的另一邀请码"
      }
    ],
    "couponCode": "yjx888",
    "couponDiscount": "季付及以上 7 折",
    "couponRestriction": "季付及以上适用",
    "urlFormatWarning": "该链接缺少标准 Hash 路由前缀 #/，注册前请核实页面是否正常跳转。",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Conflicting"
  },
  {
    "brandSlug": "liulianyun",
    "brandName": "榴莲云",
    "primaryUrl": "https://qwerty.liulianyunaff.com#/?code=hS5pvbfE",
    "alternateUrls": [],
    "couponCode": "ll88",
    "couponDiscount": "季付及以上 7 折",
    "couponRestriction": "季付及以上适用",
    "urlFormatWarning": "域名与 #/?code= 之间缺少斜杠分隔，已严格按原文保留。",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Unverified"
  },
  {
    "brandSlug": "shenxing",
    "brandName": "神行加速",
    "primaryUrl": "https://qwerty.shenxingaff.com/#/?code=gawDQqVE",
    "alternateUrls": [],
    "couponCode": "xs0077",
    "couponDiscount": "新用户 7 折（品牌资料）",
    "couponRestriction": "仅限新用户",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Vendor Data"
  },
  {
    "brandSlug": "huanqiuti",
    "brandName": "环球梯",
    "primaryUrl": "https://qwerty.huanqiutiaff.com/?code=9I4KRNPH",
    "alternateUrls": [],
    "couponCode": "HQ66",
    "couponDiscount": "季付及以上 7 折",
    "couponRestriction": "季付及以上适用",
    "urlFormatWarning": "该链接缺少标准 Hash 路由前缀 #/，注册前请核实页面是否正常跳转。",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Vendor Data"
  },
  {
    "brandSlug": "tiziyun",
    "brandName": "梯子云",
    "primaryUrl": "https://tiziyun3.ladderaff.com/#/?code=7EmnpHs0",
    "alternateUrls": [
      {
        "url": "https://varnexa.ladderaff.com",
        "source": "sources/brand-info/24个站点的aff替换前缀.txt",
        "note": "替换域名前缀表记录（无 invite code 参数）"
      }
    ],
    "couponCode": "tiziyun",
    "couponDiscount": "待核实",
    "couponRestriction": "待核实",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Vendor Data"
  },
  {
    "brandSlug": "lingdong",
    "brandName": "灵动云",
    "primaryUrl": "https://varnexa.lingdongaff.com/#/?code=wZvEhEoI",
    "alternateUrls": [],
    "couponCode": null,
    "couponDiscount": "优惠码尚未核实",
    "couponRestriction": null,
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Historical Data"
  },
  {
    "brandSlug": "langwang",
    "brandName": "浪网",
    "primaryUrl": "https://varnexa.wavenetaff.com/#/?code=xwAM4tTd",
    "alternateUrls": [],
    "couponCode": null,
    "couponDiscount": "优惠码尚未核实",
    "couponRestriction": null,
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Historical Data"
  },
  {
    "brandSlug": "edgenova",
    "brandName": "边缘节点 EdgeNova",
    "primaryUrl": "https://work.edgenovaaff.cc/#/register?code=cl3iB5YG",
    "alternateUrls": [],
    "couponCode": "TH888",
    "couponDiscount": "8 折（历史资料记录）",
    "couponRestriction": "待核实现行有效性",
    "rel": "nofollow sponsored noopener",
    "target": "_blank",
    "disclosureText": "含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。",
    "verifiedDate": "2026-11-24",
    "dataStatus": "Historical Data"
  }
]

export const AFFILIATE_LINKS: Record<string, AffiliateLinkItem> = Object.fromEntries(
  AFFILIATE_LINK_LIST.map((item) => [item.brandSlug, item])
)

export const EXTRA_AFFILIATE_PREFIXES: ExtraAffiliatePrefix[] = [
  {
    "name": "快狸 KuaiLi",
    "slug": "kuaili",
    "url": "https://work.kuailicloud.cc",
    "sourceId": "src-aff-prefixes-24",
    "note": "仅出现在 24 个站点的 aff 前缀表及 2026-08-11 测速截图清单中，未纳入 31 家品牌核心库。"
  },
  {
    "name": "跨界",
    "slug": "kuajie",
    "url": "https://vip02.kuajieaff.com",
    "sourceId": "src-aff-prefixes-24",
    "note": "仅出现在 24 个站点的 aff 前缀表中，未纳入 31 家品牌核心库。"
  },
  {
    "name": "飞V",
    "slug": "feiv",
    "url": "https://varnexa.flyvaff.com",
    "sourceId": "src-aff-prefixes-24",
    "note": "仅出现在 24 个站点的 aff 前缀表中，未纳入 31 家品牌核心库。"
  }
]

export function getAffiliateLink(brandSlug: string): AffiliateLinkItem | undefined {
  return AFFILIATE_LINKS[brandSlug]
}
