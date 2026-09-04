// Ordered by the source PDF, excluding cover, contents and chapter divider pages.
const entries = [
  ['捌方隅', 'JADE MYTH', '01 / 品牌设计', 'P05—21', 'jade-myth-cover.webp', '围绕“情绪的专属角落”，构建品牌视觉、玉人 IP、香薰产品与周边延展。', 'jade-myth'],
  ['一布千面', 'YI BU QIAN MIAN', '01 / 品牌与数字文创', 'PPT · 28P', 'yibumian/slide-01.webp', 'AI 驱动襄阳粗布纺织非遗引领者，覆盖品牌、产品创新、数字体验与市场实践。', 'yibumian'],
  ['菲文 Felven', 'FELVEN PET FOOD', '01 / 品牌设计', 'P22—38', 22, '以猫的天性为灵感，完成宠物食品品牌标志、包装及周边视觉设计。', 'felven'],
  ['希野咖啡', 'FIELD OF HOPE', '01 / 品牌设计', 'P39—48', 42, '自然治愈系咖啡品牌：从标志、视觉识别到空间物料和周边延展。', 'hope-coffee'],
  ['捌方隅 · 四季香薰', 'FOUR SEASONS', '02 / 包装设计', 'P49', 49, '以网格分割与区块排列关系，进行品牌包装的创新与延展。'],
  ['粤博四季凉茶', 'HERBAL TEA PACKAGING', '02 / 包装设计', 'P50', 50, '运用 Midjourney 生成插画并通过 Photoshop 调整，构建 AIGC 插画素材库与包装效果。'],
  ['白鸭单枚皮蛋小卡盒', 'PRESERVED EGG PACKAGING', '02 / 包装设计', 'P51', 51, '插画、视觉识别与包装商业落地，该产品上市后增销量 20 万余枚。'],
  ['桃安', 'TAO AN · UI DESIGN', '03 / UI 界面设计', 'P54—60', 57, '聚焦女性全生命周期，以情感陪伴、成长型认知美育和分场景功能构建产品体验。', 'tao-an'],
  ['海报与版式探索', 'LAYOUT DESIGN', '04 / 版式设计', 'P61—62', 61, '文化主题海报与信息版式设计，探索字体、图形和内容层级。'],
  ['四季海报设计', 'FOUR SEASONS POSTERS', '04 / 版式设计', 'P63', 63, '以季节意象构建插画海报，并延伸至手提袋应用。'],
  ['主题海报合集', 'POSTER COLLECTION', '04 / 版式设计', 'P64', 'project-64-optimized.webp', '花卉、餐饮与活动主题的多风格海报设计。'],
  ['AI 辅助设计海报', 'AI-ASSISTED POSTERS', '04 / 版式设计', 'P65', 65, '世界海洋日、世界船艇日与世界地球日主题视觉。'],
  ['公众号推送与推文排版', 'EDITORIAL & SOCIAL', '04 / 版式设计', 'P66—70', 66, '妇女节主题推送及公众号长图排版，兼顾移动阅读与品牌传播。'],
  ['不同行业的标志设计', 'LOGO DESIGN', '05 / 标志设计', 'P72—73', 72, '图形标志与中文字体标志的跨行业设计合集。'],
]

const detailPageCounts = {
  'jade-myth': 38,
  yibumian: 28,
  felven: 17,
  'hope-coffee': 9,
  'tao-an': 6,
}

export const projects = entries.map(([title, en, type, pages, source, note, detail], index) => ({
  id: String(index + 1).padStart(2, '0'), title, en, type, pages, note, detail,
  image: typeof source === 'number'
    ? `/assets/portfolio/project-${String(source).padStart(2, '0')}.webp`
    : `/assets/portfolio/${source}`,
  slides: detail
    ? Array.from({ length: detailPageCounts[detail] }, (_, slideIndex) => `/assets/portfolio/${detail}/${detail === 'yibumian' ? 'slide' : 'page'}-${String(slideIndex + 1).padStart(2, '0')}.webp`)
    : undefined,
}))
