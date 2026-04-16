import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { PageTransition, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'

type Category = 'all' | 'store' | 'course' | 'activity' | 'product'

const TABS: { id: Category; label: string }[] = [
  { id: 'all',      label: '全部' },
  { id: 'store',    label: '商店' },
  { id: 'course',   label: '課程' },
  { id: 'activity', label: '活動' },
  { id: 'product',  label: '商品' },
]

interface Partner {
  id: string
  name: string
  category: Exclude<Category, 'all'>
  tag: string
  discount: string
  description: string
  fullDescription: string
  isPremium?: boolean
  isFree?: boolean
  accentColor: string
  // Detail page content
  detail: {
    location?: string
    hours?: string
    website?: string
    highlights: string[]
    howToRedeem: string
    badge?: string       // e.g. "限定 30 名"
  }
}

const PARTNERS: Partner[] = [
  {
    id: 'f1',
    name: '每日 10 分鐘晨間瑜伽指南',
    category: 'course',
    tag: '免費資源',
    discount: '完全免費',
    description: '專為忙碌生活設計的晨間流動序列，PDF 可下載，隨時開始。',
    fullDescription: '不需要任何瑜伽基礎，10 分鐘喚醒你的身體。包含呼吸引導、熱身序列、三個核心動作與放鬆收尾。每週一套新序列，讓你的晨間練習保持新鮮。',
    isFree: true,
    accentColor: '#8FAF8F',
    detail: {
      highlights: ['附完整動作說明圖解', '呼吸節奏提示', '可依據體力調整強度', '每週更新新序列'],
      howToRedeem: '點擊「立即取得」後，PDF 將直接下載至您的裝置。',
    },
  },
  {
    id: 'f2',
    name: '瑜伽新手必讀：體位法圖解',
    category: 'course',
    tag: '免費指南',
    discount: '完全免費',
    description: '20 個基礎體位詳細圖解，附呼吸提示與常見錯誤說明，適合自學。',
    fullDescription: '精心整理 20 個初學者必學體位，每個動作都有正面/側面圖解、呼吸節奏、身體對位提示，以及最常見的錯誤姿勢說明，讓你在家也能安全學習。',
    isFree: true,
    accentColor: '#C4A87C',
    detail: {
      highlights: ['20 個基礎體位完整圖解', '中英文動作名稱對照', '初學者安全提示', '常見錯誤提醒'],
      howToRedeem: '免費下載 PDF，不需要帳號或個人資料。',
    },
  },
  {
    id: 'f3',
    name: '覺知生活 Podcast',
    category: 'activity',
    tag: '免費收聽',
    discount: '完全免費',
    description: '每週一集，分享正念生活、身體覺察與瑜伽哲學，通勤也能聽。',
    fullDescription: '由資深瑜伽老師主持，每集 20-30 分鐘，探討如何將瑜伽哲學融入日常生活。主題涵蓋身體覺察、呼吸練習、情緒管理與季節養生。',
    isFree: true,
    accentColor: '#B8D0B8',
    detail: {
      highlights: ['每週一集更新', '20–30 分鐘適合通勤', '可在 Spotify / Apple Podcast 收聽', '超過 80 集精選節目'],
      howToRedeem: '搜尋「覺知生活」即可在各大 Podcast 平台收聽，完全免費。',
    },
  },
  {
    id: '1',
    name: '純靜瑜伽教室',
    category: 'store',
    tag: '瑜伽教室',
    discount: '首次體驗 8 折',
    description: '位於台北信義區，提供多種瑜伽課程，環境舒適安靜。',
    fullDescription: '純靜瑜伽教室坐落於台北信義區，2015 年創立，擁有 8 位認證師資。提供哈達、陰瑜伽、流動瑜伽、孕婦瑜伽等多元班型，教室採用天然材質打造，空間寬敞舒適。',
    accentColor: '#8FAF8F',
    detail: {
      location: '台北市信義區忠孝東路五段 168 號 4F',
      hours: '週一至週五 07:00–21:00，週末 08:00–18:00',
      website: 'purejoga.com.tw',
      highlights: ['首次體驗課 8 折優惠', '多元班型適合各程度', '認證師資教學', '每班限 12 人小班制'],
      howToRedeem: '出示 Yoga Flow Journal App 畫面，於前台報名時即享首次 8 折。',
      badge: '限首次體驗',
    },
  },
  {
    id: '2',
    name: '覺知生活瑜伽課',
    category: 'course',
    tag: '線上課程',
    discount: '會員專屬 75 折',
    description: '12 週的系統性瑜伽課程，適合初學者到進階練習者。',
    fullDescription: '12 週線上課程，從基礎對位到進階序列，每週 3 節課（每節 45 分鐘）＋1 節冥想引導。課程永久保存可重複觀看，包含每週作業與社群支持。',
    accentColor: '#C4A87C',
    detail: {
      website: 'mindful-yoga.tw',
      highlights: ['12 週完整課程系統', '每週 3 節課 + 冥想引導', '課程影片永久保存', '含私人社群互動'],
      howToRedeem: '使用專屬優惠碼「YOGAFLOW25」，報名時輸入即享 75 折。',
      badge: '線上課程',
    },
  },
  {
    id: '3',
    name: '春日瑜伽戶外營',
    category: 'activity',
    tag: '戶外活動',
    discount: '早鳥優惠 9 折',
    description: '陽明山一日瑜伽健行，在大自然中深化你的練習。',
    fullDescription: '在陽明山的林間空地，從清晨的日出瑜伽開始，沿著古道健行，中午享用有機便當，下午進行陰瑜伽與大自然冥想。全程由兩位資深老師帶領，限額 20 人。',
    accentColor: '#B8D0B8',
    detail: {
      location: '台北市北投區（陽明山國家公園）',
      hours: '活動時間：06:30–17:00',
      highlights: ['日出瑜伽 × 森林冥想', '有機午餐提供', '全程小班 20 人', '附贈紀念手環'],
      howToRedeem: '早鳥優惠限前 10 名報名，使用 App 專屬連結報名即自動享 9 折。',
      badge: '限額 20 名',
    },
  },
  {
    id: '4',
    name: 'GreenMat 環保瑜伽墊',
    category: 'product',
    tag: '瑜伽器材',
    discount: '購物滿千折百',
    description: '天然橡膠材質，防滑耐用，附攜帶袋，多色可選。',
    fullDescription: 'GreenMat 採用斯里蘭卡天然橡膠，不含 PVC，表面微紋設計提供極佳防滑力。厚度 5mm，適合各類型練習。提供 12 色選擇，每張墊子都附有機棉收納袋。',
    accentColor: '#D4B896',
    detail: {
      website: 'greenmat.tw',
      highlights: ['天然橡膠環保材質', '5mm 厚度支撐', '12 色可選', '附有機棉收納袋'],
      howToRedeem: '在 GreenMat 官網結帳時，輸入折扣碼「YOGAFLOW」，單筆滿 NT$1,000 折 NT$100。',
    },
  },
  {
    id: '5',
    name: '身心整合工作坊',
    category: 'activity',
    tag: '工作坊',
    discount: 'Premium 獨家優惠',
    description: '結合瑜伽、冥想與身體工作，深度探索身心連結。',
    fullDescription: '一日工作坊，整合瑜伽體位、索馬提克身體工作與靜心冥想。適合有一定練習基礎、想深入探索身心關係的練習者。工作坊採全程中文授課，限額 15 人。',
    isPremium: true,
    accentColor: '#C4A87C',
    detail: {
      location: '台北市大安區（報名後通知詳細地址）',
      hours: '09:00–18:00（含午餐）',
      highlights: ['索馬提克 × 瑜伽整合', '全天沉浸式體驗', '午餐與茶點提供', '限額 15 人深度小班'],
      howToRedeem: 'Premium 會員升級後，於 App 內直接取得專屬報名連結與折扣碼。',
      badge: 'Premium 限定',
    },
  },
  {
    id: '6',
    name: '有機草本茶禮盒',
    category: 'product',
    tag: '養生食品',
    discount: 'Premium 獨家 7 折',
    description: '精選台灣有機草本植物，輔助放鬆與修復，練習後最適合。',
    fullDescription: '禮盒內含 5 款台灣原生有機草本茶：玫瑰洛神、桑葉薑黃、薰衣草甘菊、南薑香茅、羅勒薄荷。各有助於放鬆、消炎、助眠等功效，均通過有機認證。',
    isPremium: true,
    accentColor: '#8FAF8F',
    detail: {
      website: 'organicherb.tw',
      highlights: ['5 款有機草本茶組合', '台灣在地種植認證', '附英文說明卡', '精裝禮盒可作伴手禮'],
      howToRedeem: 'Premium 會員專屬 7 折，升級後於 App 取得折扣碼，前往官網結帳輸入即可。',
      badge: 'Premium 7 折',
    },
  },
  {
    id: '7',
    name: '平衡瑜伽台中館',
    category: 'store',
    tag: '瑜伽教室',
    discount: '月費課程 9 折',
    description: '台中精誠路老字號瑜伽教室，師資豐富，班型多元。',
    fullDescription: '創立於 2010 年，台中資歷最深的瑜伽教室之一。擁有 12 位師資，提供超過 30 種班型，包含親子瑜伽、銀髮族瑜伽、企業課程等。教室寬敞，設有更衣淋浴間。',
    accentColor: '#B8A090',
    detail: {
      location: '台中市西區精誠路 88 號（近精誠商圈）',
      hours: '週一至週日 07:00–22:00',
      website: 'balanceyoga-tc.com',
      highlights: ['創立 14 年老字號', '12 位認證師資', '超過 30 種班型', '設有淋浴間'],
      howToRedeem: '攜帶 App 會員畫面至前台，辦理月費課程時直接享 9 折。',
    },
  },
  {
    id: '8',
    name: '陰瑜伽深化課程',
    category: 'course',
    tag: '進階課程',
    discount: 'Premium 獨家報名',
    description: '8 週陰瑜伽深化，搭配中醫經絡概念，深入筋膜放鬆。',
    fullDescription: '8 週線上直播課程，結合中醫五行經絡概念，深化陰瑜伽練習。每週一次 90 分鐘直播課＋課後錄影，包含詳細的解剖學說明、經絡圖解與個人練習建議。',
    isPremium: true,
    accentColor: '#D4B4C4',
    detail: {
      website: 'yinyoga-pro.tw',
      highlights: ['中醫經絡 × 陰瑜伽整合', '每週 90 分鐘直播', '含課後錄影永久觀看', '附個人練習建議'],
      howToRedeem: 'Premium 會員獨家課程，升級後系統自動發送報名邀請至您的電子郵件。',
      badge: 'Premium 限定',
    },
  },
]

/* ── Partners Page ────────────────────────────────────────────── */

export function Partners() {
  const [activeTab, setActiveTab] = useState<Category>('all')
  const [detail, setDetail] = useState<Partner | null>(null)

  const freeItems = PARTNERS.filter(p => p.isFree)
  const filtered  = activeTab === 'all'
    ? PARTNERS.filter(p => !p.isFree)
    : PARTNERS.filter(p => p.category === activeTab && !p.isFree)

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-28">

      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-cream-100/95 backdrop-blur-sm border-b border-cream-200 px-5 pt-safe pb-0">
        <div className="pt-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-display font-semibold text-warm-700 text-lg">合作商家</h1>
              <p className="text-[11px] text-warm-300 mt-0.5">專屬優惠・精選夥伴</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-sage-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 bg-cream-200/80 rounded-2xl p-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all duration-200
                  ${activeTab === t.id ? 'bg-white text-warm-600 shadow-soft' : 'text-warm-400'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Premium banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #F0F7F0 0%, #E8F3E8 100%)', border: '1px solid #C8DEC8' }}
        >
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full bg-sage-400 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-sage-600 tracking-wide uppercase">Premium 會員</span>
              </div>
              <p className="text-[13px] font-semibold text-warm-700 leading-snug">解鎖專屬合作優惠</p>
              <p className="text-[11px] text-warm-400 mt-0.5">課程折扣・限定商品・優先報名</p>
            </div>
            <button className="bg-sage-400 text-white text-[12px] font-semibold px-4 py-2 rounded-2xl shadow-soft whitespace-nowrap">
              升級方案
            </button>
          </div>
        </motion.div>

        {/* Free perks section */}
        {activeTab === 'all' && freeItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] font-bold text-sage-500 uppercase tracking-wider">免費好康</span>
              <div className="flex-1 h-px bg-sage-100" />
            </div>
            <div className="space-y-2.5 mb-4">
              {freeItems.map(p => (
                <PartnerCard key={p.id} partner={p} onTap={() => setDetail(p)} />
              ))}
            </div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] font-bold text-warm-400 uppercase tracking-wider">合作優惠</span>
              <div className="flex-1 h-px bg-cream-200" />
            </div>
          </motion.div>
        )}

        {/* Partner list */}
        <StaggerContainer className="space-y-2.5">
          {filtered.map((p) => (
            <StaggerItem key={p.id}>
              <PartnerCard partner={p} onTap={() => setDetail(p)} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filtered.length === 0 && !freeItems.length && (
          <Card animate className="py-12 text-center" delay={0.1}>
            <p className="text-[14px] font-medium text-warm-500">此分類暫無合作商家</p>
            <p className="text-[12px] text-warm-300 mt-1">持續更新中，敬請期待</p>
          </Card>
        )}
      </div>

      {/* Detail bottom-sheet */}
      <PartnerDetailSheet partner={detail} onClose={() => setDetail(null)} />
    </PageTransition>
  )
}

/* ── PartnerCard ──────────────────────────────────────────────── */

function PartnerCard({ partner, onTap }: { partner: Partner; onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      className="w-full text-left bg-white/85 rounded-3xl border border-cream-200/60 shadow-soft overflow-hidden active:scale-[0.98] transition-transform"
    >
      {/* Color accent bar */}
      <div className="h-1 w-full" style={{ background: partner.accentColor }} />

      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left: info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-warm-300 uppercase tracking-wider">{partner.tag}</span>
              {partner.isFree && (
                <span className="text-[9px] font-bold bg-sage-50 text-sage-600 border border-sage-200 rounded-full px-1.5 py-0.5 tracking-wide">FREE</span>
              )}
              {partner.isPremium && (
                <span className="text-[9px] font-bold bg-sage-50 text-sage-500 border border-sage-200 rounded-full px-1.5 py-0.5 tracking-wide">PREMIUM</span>
              )}
              {partner.detail.badge && !partner.isFree && !partner.isPremium && (
                <span className="text-[9px] font-semibold bg-beige-50 text-beige-600 border border-beige-200 rounded-full px-1.5 py-0.5">{partner.detail.badge}</span>
              )}
            </div>
            <p className="text-[14px] font-semibold text-warm-700 leading-tight">{partner.name}</p>
            <p className="text-[12px] text-warm-400 mt-1 leading-relaxed">{partner.description}</p>
          </div>

          {/* Right: discount */}
          <div className="flex-shrink-0 text-right">
            <div
              className="text-[11px] font-bold px-3 py-1.5 rounded-2xl whitespace-nowrap"
              style={{
                background: partner.isFree ? '#EDF5ED' : partner.isPremium ? '#F5F9F5' : '#F0F7F0',
                color:      partner.isFree ? '#5A9F5A' : partner.isPremium ? '#8FAF8F' : '#6A9F6A',
                border:     `1px solid ${partner.isFree ? '#8FAF8F50' : partner.isPremium ? '#C8DEC8' : '#B8D4B8'}`,
              }}
            >
              {partner.discount}
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-3 flex items-center justify-between">
          <CategoryPill category={partner.category} />
          {partner.isPremium ? (
            <span className="flex items-center gap-1.5 text-[12px] text-warm-300 font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              需要 Premium
            </span>
          ) : (
            <span className="text-[12px] text-sage-500 font-semibold">
              {partner.isFree ? '立即取得 →' : '查看詳情 →'}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

/* ── Partner Detail Bottom-Sheet ──────────────────────────────── */

function PartnerDetailSheet({ partner, onClose }: { partner: Partner | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {partner && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-cream-100 rounded-t-[28px] shadow-xl"
            style={{ maxHeight: '88vh' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-cream-300" />
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(88vh - 24px)' }}>
              {/* Accent bar */}
              <div className="h-1 mx-5 rounded-full mb-5" style={{ background: partner.accentColor }} />

              <div className="px-5 pb-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-semibold text-warm-300 uppercase tracking-wider">{partner.tag}</span>
                      {partner.isFree && (
                        <span className="text-[9px] font-bold bg-sage-50 text-sage-600 border border-sage-200 rounded-full px-1.5 py-0.5">FREE</span>
                      )}
                      {partner.isPremium && (
                        <span className="text-[9px] font-bold bg-sage-50 text-sage-500 border border-sage-200 rounded-full px-1.5 py-0.5">PREMIUM</span>
                      )}
                      {partner.detail.badge && (
                        <span className="text-[9px] font-semibold bg-beige-50 text-beige-600 border border-beige-200 rounded-full px-1.5 py-0.5">{partner.detail.badge}</span>
                      )}
                    </div>
                    <h2 className="text-[18px] font-display font-semibold text-warm-700 leading-snug">{partner.name}</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/80 border border-cream-200 flex items-center justify-center flex-shrink-0 mt-1 active:scale-95 transition-transform"
                  >
                    <svg className="w-4 h-4 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Full description */}
                <p className="text-[13px] text-warm-500 leading-relaxed mb-5">{partner.fullDescription}</p>

                {/* Info rows */}
                {(partner.detail.location || partner.detail.hours || partner.detail.website) && (
                  <div className="bg-white/70 rounded-2xl border border-cream-200 p-4 mb-4 space-y-2.5">
                    {partner.detail.location && (
                      <InfoRow icon={<LocationIcon />} text={partner.detail.location} />
                    )}
                    {partner.detail.hours && (
                      <InfoRow icon={<ClockIcon />} text={partner.detail.hours} />
                    )}
                    {partner.detail.website && (
                      <InfoRow icon={<GlobeIcon />} text={partner.detail.website} />
                    )}
                  </div>
                )}

                {/* Highlights */}
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-warm-300 uppercase tracking-wider mb-2.5">特色亮點</p>
                  <div className="space-y-1.5">
                    {partner.detail.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: partner.accentColor }} />
                        <p className="text-[13px] text-warm-600 leading-snug">{h}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to redeem */}
                <div
                  className="rounded-2xl p-4 mb-6"
                  style={{ background: `${partner.accentColor}14`, border: `1px solid ${partner.accentColor}30` }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: partner.accentColor }}>
                    如何兌換
                  </p>
                  <p className="text-[13px] text-warm-600 leading-relaxed">{partner.detail.howToRedeem}</p>
                </div>

                {/* CTA */}
                {partner.isPremium ? (
                  <button className="w-full py-4 rounded-3xl bg-sage-100 text-sage-500 text-[14px] font-semibold border border-sage-200">
                    升級 Premium 解鎖
                  </button>
                ) : (
                  <button
                    className="w-full py-4 rounded-3xl text-white text-[14px] font-semibold shadow-soft active:scale-[0.98] transition-transform"
                    style={{ background: `linear-gradient(135deg, ${partner.accentColor}DD, ${partner.accentColor})` }}
                  >
                    {partner.isFree ? '立即取得' : '前往兌換'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Small helpers ────────────────────────────────────────────── */

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-warm-300 flex-shrink-0 mt-0.5">{icon}</span>
      <p className="text-[12px] text-warm-500 leading-snug">{text}</p>
    </div>
  )
}

function LocationIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  )
}
function GlobeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  )
}

function CategoryPill({ category }: { category: Exclude<Category, 'all'> }) {
  const map = {
    store:    { label: '商店',  bg: 'bg-sage-50',   text: 'text-sage-500' },
    course:   { label: '課程',  bg: 'bg-beige-50',  text: 'text-beige-500' },
    activity: { label: '活動',  bg: 'bg-warm-50',   text: 'text-warm-400' },
    product:  { label: '商品',  bg: 'bg-cream-200', text: 'text-warm-500' },
  }
  const { label, bg, text } = map[category]
  return (
    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${bg} ${text}`}>{label}</span>
  )
}
