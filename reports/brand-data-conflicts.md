# Brand Data Conflicts · 31 家品牌数据与口径冲突审计报告

- 生成日期：2026-11-25
- 品牌总数：31（已合并 Firefly 与 Firefly 萤火虫；含 24 家存在口径冲突的品牌）
- 推广注册表状态：已统一 rel="nofollow sponsored noopener" · URL 格式告警 3 处（云界线、环球梯缺少 `#/`）

## 冲突品牌清单
### 光速云 (`guangsuyun`)
- **entryTrafficGb**：主值 `69GB/月（轻量版 99元/年）` vs 冲突值 `59GB/月`（同一份品牌资料摘要行写 59GB，下方轻量版明细与总清单写 69GB/月；本站以套餐明细 69GB/月为主值并保留冲突说明。）
- **affiliateUrl**：主值 `https://sahude.gsyvipaff.com/#/?code=keqgvT5Y` vs 冲突值 `https://mdlky.gsyaff.com`（两个文档分别记录了 gsyvipaff.com 与 gsyaff.com 推广前缀，后者无 invite code 参数。）
- **benchmarkBatchProtocol**：主值 `62节点 Shadowsocks (2026-08-19 三网 normalspeed)` vs 冲突值 `70节点 VLESS + 10 电信 AnyTLS (2026-08-19 珠海联通)`（同一天两组测试采用不同节点订阅架构（62节点 SS vs 60 VLESS + 10 AnyTLS），且 08-11 截图显示 Shadowsocks，品牌资料写 VLESS。）
### 暮光加速 (`muguang`)
- **couponCode**：主值 `muguang5555` vs 冲突值 `目前没有查到公开的优惠码信息`（同一节内基础数据给出优惠码 muguang5555，正文介绍却称未查到公开优惠码。）
- **entryMonthlyCny**：主值 `¥109/年 (¥9.08/月 · 70GB)` vs 冲突值 `20元/月 120GB/月（基础数据） / 9元/月起（正文）`（年付轻量版折算约 9.08 元/月，月付门槛为 20 元/月。）
### 飞猫云 (`feimao`)
- **affiliateUrl**：主值 `https://guangs.flycataff.com/#/?code=6uq0Xe9y` vs 冲突值 `https://flycat1.flycatvipaff.cc`（两个资料文件中的推广域名不同（flycataff.com vs flycatvipaff.cc）。）
### 微风网络 (`weifeng`)
- **entryMonthlyCny**：主值 `¥137/年（¥11.42/月 · 100GB/月）` vs 冲突值 `年付约7元/月 50GB/月`（摘要写了已下线或旧档位“7元/50GB”，而实际套餐表最低年付为清风 ¥137/年（100GB/月，折合 11.42 元/月）。）
### 星岛梦 (`xingdaomeng`)
- **protocols**：主值 `Shadowsocks（2026-08-11 测速截图实测显示）` vs 冲突值 `Trojan（32家清单介绍说明）`（实际节点协议可能同时支持或已从 Trojan 调整为 Shadowsocks。）
- **affiliateUrl**：主值 `https://guangs.xingdaomeng.com/#/?code=1TynBYnR` vs 冲突值 `https://kfccbb.xingdaomeng.com`（推广子域名前缀不同（guangs vs kfccbb）。）
### 隐形人 (`yinxingren`)
- **couponCode**：主值 `moon80（8折）` vs 冲突值 `yxr888`（同一品牌同时存在 yxr888 与 moon80 两个优惠码记录。）
- **entryPlanTraffic**：主值 `白银纪元 ¥24/月 144GB/月` vs 冲突值 `24元/月 100GB/月`（基础数据写 100GB/月，套餐明细写 144GB/月。）
- **affiliateUrl**：主值 `https://yinxingren1.invisibleaff.com/#/?code=kcyEeoJT` vs 冲突值 `https://varnexa.invisibleaff.com`（推广子域名前缀不同（yinxingren1 vs varnexa）。）
### 二猫云 (`ermao`)
- **regions**：主值 `香港、台湾、新加坡、日本、美国（2026-10-19 测速表含新加坡 46ms/407Mbps）` vs 冲突值 `正文第254行称“比不少同类机场少了新加坡这一站”`（同一品牌条目内测速表列有新加坡节点，而下方介绍说明却称缺少新加坡。）
- **protocols**：主值 `Shadowsocks（2026-08-11 测速截图实测显示）` vs 冲突值 `VLESS（32家清单介绍说明第254行）`（实测图显示 Shadowsocks，品牌说明写 VLESS。）
- **affiliateUrl**：主值 `https://guangs.2maoyunaff.cc/#/?code=7mjvgGbW` vs 冲突值 `https://waaa.2maoyunaff.cc`（推广子域名前缀不同（guangs vs waaa）。）
### 无忧链接 (`wuyou`)
- **clientMode**：主值 `2026 年 10 月起官方专属客户端（登录即用）` vs 冲突值 `订阅无需转换（汇总表第926行）及 2026-07-18 VLESS 订阅实测`（该品牌在 2026 年 10 月调整为专属客户端形态，历史订阅兼容性与现行政策存在差异。）
### 唯兔云 (`weitu`)
- **protocols**：主值 `Shadowsocks（2026-08-11 测速截图实测显示）` vs 冲突值 `Trojan（32家清单介绍说明第333行）`（实测图显示 Shadowsocks，品牌说明写 Trojan。）
- **affiliateUrl**：主值 `https://guangs.v2yunvipaff.com/#/?code=xIutqOBA` vs 冲突值 `https://fast.v2yunvipaff.com`（推广子域名前缀不同（guangs vs fast）。）
### Firefly (`firefly`)
- **affiliateUrl**：主值 `https://vip02.fireflyaff.com/#/?code=2n7VURre` vs 冲突值 `https://vip02.fireflyaff.com/#/?code=jTp9wSgZ`（同一域名 vip02.fireflyaff.com 存在两套 invite code，合并为同一实体 firefly 后一并记录。）
- **clientMode**：主值 `exclusive-only（2026 年 10 月起专属客户端，不提供订阅链接）` vs 冲突值 `2026-08-09 历史记录未限定专属客户端，仅写 IPLC + VLESS`（2026 年 10 月起收紧为仅官方专属客户端登录使用。）
### 宇宙云 (`yuzhou`)
- **clientMode**：主值 `待核实（正文第384行）` vs 冲突值 `IEPL+VLESS+自研客户端（汇总表第931行）`（正文与汇总表在自研客户端及最新套餐完整性上存在缺口。）
### U1S1 (`u1s1`)
- **plans**：主值 `套餐表含 5 档周期套餐（60GB 年付至 1500GB 月付）` vs 冲突值 `正文第438行提及“还有 1000GB 的一次性大流量包”`（正文提到 1000GB 一次性大流量包，但套餐表未给出价格，本站不编造其售价。）
- **affiliateUrl**：主值 `https://guangs.vipaff.cc/#/?code=xhX5X22f` vs 冲突值 `https://pkdj7.vipaff.cc`（推广子域名前缀不同（guangs vs pkdj7）。）
### 灵猫网络 (`lingmao`)
- **couponCode**：主值 `lingmao（8折，年付小包不适用）` vs 冲突值 `lmao888`（同时记录了 lmao888 与 lingmao 两个优惠码。）
- **affiliateUrl**：主值 `https://vip01.civetnet.com/#/?code=8MIAyxak` vs 冲突值 `https://vip02.civetaff.com`（主域名完全不同（vip01.civetnet.com vs vip02.civetaff.com）。）
- **entryMonthlyCny**：主值 `¥85/年（¥7.08/月 · 45GB）；月付Small ¥25（150GB）` vs 冲突值 `19元/月 150GB/月（第445行）/ 7.1元/月起（第448行）`（月付 150GB 摘要写 ¥19，套餐表写 ¥25。）
### 极连云 (`jilian`)
- **affiliateUrl**：主值 `https://guangs.jlyvipaff.com/#/?code=VM1rKGUu` vs 冲突值 `https://kdjhao.jlyvipaff.com`（推广子域名前缀不同（guangs vs kdjhao）。）
### 光年梯 (`guangnian`)
- **protocols**：主值 `Shadowsocks（2026-08-11 测速截图实测显示）` vs 冲突值 `VLESS（32家清单第511行）`（品牌资料写 VLESS，实测截图显示 Shadowsocks。）
- **affiliateUrl**：主值 `https://guangs.gntaff.com/#/?code=X1FoxjGE` vs 冲突值 `https://ggmq.gntaff.com`（推广子域名前缀不同（guangs vs ggmq）。）
### 一翻云 (`yifan`)
- **couponCode**：主值 `1FLYYUN（9折）` vs 冲突值 `yfy6666`（同一条目存在 yfy6666 与 1FLYYUN 两个优惠码。）
- **affiliateUrl**：主值 `https://guangs.1flyunaff.cc/#/register?code=Yr7FhB7r` vs 冲突值 `https://wzjc.1flyunaff.cc`（推广子域名前缀不同（guangs vs wzjc）。）
### SOGO 云 (`sogo`)
- **couponCode**：主值 `SOGO10000（9折）` vs 冲突值 `sss777`（基础信息写 SOGO10000，汇总表写 sss777。）
- **protocols**：主值 `Shadowsocks（2026-08-11 测速截图实测显示）` vs 冲突值 `VLESS（32家清单第569、577行）`（品牌资料写 VLESS，2026-08-11 实测图显示 Shadowsocks。）
- **affiliateUrl**：主值 `https://guangs.sogoyunaff.cc/#/?code=327Vs0w7` vs 冲突值 `https://wzjc.sogoyunaff.cc`（推广子域名前缀不同（guangs vs wzjc）。）
### 可信云 (`kexin`)
- **protocols**：主值 `Shadowsocks（2026-08-11 测速截图实测显示）` vs 冲突值 `VLESS（32家清单第616行）`（品牌资料写 VLESS，实测截图显示 Shadowsocks。）
- **affiliateUrl**：主值 `https://guangs.kosingaff.com/#/register?code=UYDtNlCY` vs 冲突值 `https://work.kosingaff.com`（推广子域名前缀不同（guangs vs work）。）
### 速界 (`sujie`)
- **protocols**：主值 `Shadowsocks（2026-08-11 测速截图实测显示）` vs 冲突值 `VLESS（32家清单第638行）`（品牌资料写 VLESS，实测图显示 Shadowsocks。）
- **affiliateUrl**：主值 `https://guangs.speedworldaff.cc/#/register?code=xgXzEfZB` vs 冲突值 `https://work.speedworldaff.cc`（推广子域名前缀不同（guangs vs work）。）
### 全球云 (`quanqiu`)
- **couponCode**：主值 `qq88（8折）` vs 冲突值 `qqy7777`（基础信息列 qq88，汇总表列 qqy7777。）
- **affiliateUrl**：主值 `https://guangs.gcvipaff.com/#/?code=Ov2nvU9C` vs 冲突值 `https://sswdh.gcvipaff.com`（推广子域名前缀不同（guangs vs sswdh）。）
### 云界线 (`yunjiexian`)
- **affiliateUrl**：主值 `https://qwerty.yunjiexianaff.com/?code=aycnwNUi` vs 冲突值 `https://qwerty.yunjiexianaff.com/?code=HBaZ91c6`（同一文件内出现两组不同的 code 参数，且 URL 均缺少 #/（与其它品牌格式不同）。）
### 梯子云 (`tiziyun`)
- **affiliateUrl**：主值 `https://tiziyun3.ladderaff.com/#/?code=7EmnpHs0` vs 冲突值 `https://varnexa.ladderaff.com`（推广子域名前缀不同（tiziyun3 vs varnexa）。）
### 灵动云 (`lingdong`)
- **protocols**：主值 `VLESS（2026-07-20/21 实测）` vs 冲突值 `站点页面文案 VLESS / Trojan 混提`（站点页面文案同时出现 VLESS 与 Trojan，实测为 VLESS。）
### 浪网 (`langwang`)
- **planTraffic**：主值 `入门档记录“截150G”（截图部分遮挡）` vs 冲突值 `正文第1083行明确提示“套餐流量与设备限制被遮挡”`（入门档 150G 字段存在截图遮挡，本站将入门档 trafficGb 保持 null 并在 trafficLabel 注明遮挡。）
