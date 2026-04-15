import { useState } from 'react'
import { motion } from 'framer-motion'
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
  isPremium?: boolean
  isFree?: boolean
  accentColor: string
}

const PARTNERS: Partner[] = [
  {
    id: 'f1',
    name: '每日 10 分鐘晨間瑜伽指南',
    category: 'course',
    tag: '免費資源',
    discount: '完全免費',
    description: '專為忙碌生活設計的晨間流動序列，PDF 可下載，隨時開始。',
    isFree: true,
    accentColor: '#8FAF8F',
  },
  {
    id: 'f2',
    name: '瑜伽新手必讀：體位法圖解',
    category: 'course',
    tag: '免費指南',
    discount: '完全免費',
    description: '20 個基礎體位詳細圖解，附呼吸提示與常見錯誤說明，適合自學。',
    isFree: true,
    accentColor: '#C4A87C',
  },
  {
    id: 'f3',
    name: '覺知生活 Podcast',
    category: 'activity',
    tag: '免費收聽',
    discount: '完全免費',
    description: '每週一集，分享正念生活、身體覺察與瑜伽哲學，通勤也能聽。',
    isFree: true,
    accentColor: '#B8D0B8',
  },
  {
    id: '1',
    name: '純靜瑜伽教室',
    category: 'store',
    tag: '瑜伽教室',
    discount: '首次體驗 8 折',
    description: '位於台北信義區，提供多種瑜伽課程，環境舒適安靜。',
    accentColor: '#8FAF8F',
  },
  {
    id: '2',
    name: '覺知生活瑜伽課',
    category: 'course',
    tag: '線上課程',
    discount: '會員專屬 75 折',
    description: '12 週的系統性瑜伽課程，適合初學者到進階練習者。',
    accentColor: '#C4A87C',
  },
  {
    id: '3',
    name: '春日瑜伽戶外營',
    category: 'activity',
    tag: '戶外活動',
    discount: '早鳥優惠 9 折',
    description: '陽明山一日瑜伽健行，在大自然中深化你的練習。',
    accentColor: '#B8D0B8',
  },
  {
    id: '4',
    name: 'GreenMat 環保瑜伽墊',
    category: 'product',
    tag: '瑜伽器材',
    discount: '購物滿千折百',
    description: '天然橡膠材質，防滑耐用，附攜帶袋，多色可選。',
    accentColor: '#D4B896',
  },
  {
    id: '5',
    name: '身心整合工作坊',
    category: 'activity',
    tag: '工作坊',
    discount: 'Premium 獨家優惠',
    description: '結合瑜伽、冥想與身體工作，深度探索身心連結。',
    isPremium: true,
    accentColor: '#C4A87C',
  },
  {
    id: '6',
    name: '有機草本茶禮盒',
    category: 'product',
    tag: '養生食品',
    discount: 'Premium 獨家 7 折',
    description: '精選台灣有機草本植物，輔助放鬆與修復，練習後最適合。',
    isPremium: true,
    accentColor: '#8FAF8F',
  },
  {
    id: '7',
    name: '平衡瑜伽台中館',
    category: 'store',
    tag: '瑜伽教室',
    discount: '月費課程 9 折',
    description: '台中精誠路老字號瑜伽教室，師資豐富，班型多元。',
    accentColor: '#B8A090',
  },
  {
    id: '8',
    name: '陰瑜伽深化課程',
    category: 'course',
    tag: '進階課程',
    discount: 'Premium 獨家報名',
    description: '8 週陰瑜伽深化，搭配中醫經絡概念，深入筋膜放鬆。',
    isPremium: true,
    accentColor: '#D4B4C4',
  },
]

export function Partners() {
  const [activeTab, setActiveTab] = useState<Category>('all')

  const freeItems = PARTNERS.filter(p => p.isFree)
  const filtered = (activeTab === 'all'
    ? PARTNERS.filter(p => !p.isFree)
    : PARTNERS.filter(p => p.category === activeTab && !p.isFree))

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

        {/* Free perks section (shown on 全部 tab only) */}
        {activeTab === 'all' && freeItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] font-bold text-sage-500 uppercase tracking-wider">免費好康</span>
              <div className="flex-1 h-px bg-sage-100" />
            </div>
            <div className="space-y-2.5 mb-4">
              {freeItems.map(p => (
                <PartnerCard key={p.id} partner={p} />
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
              <PartnerCard partner={p} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filtered.length === 0 && (
          <Card animate className="py-12 text-center" delay={0.1}>
            <p className="text-[14px] font-medium text-warm-500">此分類暫無合作商家</p>
            <p className="text-[12px] text-warm-300 mt-1">持續更新中，敬請期待</p>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}

/* ─── PartnerCard ─────────────────────────────────────────────────── */

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="bg-white/85 rounded-3xl border border-cream-200/60 shadow-soft overflow-hidden">
      {/* Color accent bar */}
      <div className="h-1 w-full" style={{ background: partner.accentColor }} />

      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left: info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-warm-300 uppercase tracking-wider">{partner.tag}</span>
              {partner.isFree && (
                <span className="text-[9px] font-bold bg-sage-50 text-sage-600 border border-sage-200 rounded-full px-1.5 py-0.5 tracking-wide">
                  FREE
                </span>
              )}
              {partner.isPremium && (
                <span className="text-[9px] font-bold bg-sage-50 text-sage-500 border border-sage-200 rounded-full px-1.5 py-0.5 tracking-wide">
                  PREMIUM
                </span>
              )}
            </div>
            <p className="text-[14px] font-semibold text-warm-700 leading-tight">{partner.name}</p>
            <p className="text-[12px] text-warm-400 mt-1 leading-relaxed">{partner.description}</p>
          </div>

          {/* Right: discount badge */}
          <div className="flex-shrink-0 text-right">
            <div
              className="text-[11px] font-bold px-3 py-1.5 rounded-2xl whitespace-nowrap"
              style={{
                background: partner.isFree ? '#EDF5ED' : partner.isPremium ? '#F5F9F5' : '#F0F7F0',
                color: partner.isFree ? '#5A9F5A' : partner.isPremium ? '#8FAF8F' : '#6A9F6A',
                border: `1px solid ${partner.isFree ? '#8FAF8F50' : partner.isPremium ? '#C8DEC8' : '#B8D4B8'}`,
              }}
            >
              {partner.discount}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-3 flex items-center justify-between">
          <CategoryPill category={partner.category} />
          {partner.isPremium ? (
            <button className="flex items-center gap-1.5 text-[12px] text-warm-300 font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              需要 Premium
            </button>
          ) : partner.isFree ? (
            <button className="text-[12px] text-sage-500 font-semibold">立即取得 →</button>
          ) : (
            <button className="text-[12px] text-sage-500 font-semibold">查看詳情 →</button>
          )}
        </div>
      </div>
    </div>
  )
}

function CategoryPill({ category }: { category: Exclude<Category, 'all'> }) {
  const map = {
    store:    { label: '商店',  bg: 'bg-sage-50',  text: 'text-sage-500' },
    course:   { label: '課程',  bg: 'bg-beige-50', text: 'text-beige-500' },
    activity: { label: '活動',  bg: 'bg-warm-50',  text: 'text-warm-400' },
    product:  { label: '商品',  bg: 'bg-cream-200', text: 'text-warm-500' },
  }
  const { label, bg, text } = map[category]
  return (
    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${bg} ${text}`}>{label}</span>
  )
}
