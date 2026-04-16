import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCard } from '../../data/cards'
import { BrandLogo } from './BrandLogo'

const STORAGE_KEY = 'yoga_bloom_daily_card'

interface StoredData {
  date: string
  bodyIndex?: number
  mindIndex?: number
  variant?: number
  flipped?: boolean
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function loadToday(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredData
    if (parsed.date !== getTodayKey()) return null
    return parsed
  } catch { return null }
}

function saveToday(patch: Partial<StoredData>) {
  const base: StoredData = loadToday() ?? { date: getTodayKey() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...base, ...patch }))
}

const P = {
  cardBack:  'linear-gradient(150deg, #EDF5ED 0%, #E0EEE0 100%)',
  cardFront: 'linear-gradient(150deg, #F8F5F0 0%, #EEE8DF 100%)',
  accent:    '#8FAF8F',
  label:     '#9A8070',
  title:     '#3A2820',
  body:      '#5A4038',
  divider:   '#DDD5C8',
}

const shell: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  borderRadius: 22,
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.03)',
  border: '1px solid rgba(255,255,255,0.75)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden' as React.CSSProperties['backfaceVisibility'],
}

export function DailyCard() {
  const [flipped, setFlipped]   = useState(false)
  const [flipping, setFlipping] = useState(false)
  const [cardData, setCardData] = useState<{ b: number; m: number; v: number } | null>(null)

  useEffect(() => {
    const s = loadToday()
    if (s?.flipped && s.bodyIndex !== undefined && s.mindIndex !== undefined && s.variant !== undefined) {
      setCardData({ b: s.bodyIndex, m: s.mindIndex, v: s.variant })
      setFlipped(true)
    }
  }, [])

  function handleCardClick() {
    if (flipping) return
    setFlipping(true)
    if (flipped) {
      // flip back — same card persists
      setTimeout(() => { setFlipped(false); saveToday({ flipped: false }); setFlipping(false) }, 380)
    } else if (cardData) {
      // already drawn today — show the same card
      setTimeout(() => { setFlipped(true); saveToday({ flipped: true }); setFlipping(false) }, 380)
    } else {
      // first draw of the day — pick random from 75
      const b = Math.floor(Math.random() * 5)
      const m = Math.floor(Math.random() * 5)
      const v = Math.floor(Math.random() * 3)
      saveToday({ bodyIndex: b, mindIndex: m, variant: v, flipped: true })
      setTimeout(() => { setCardData({ b, m, v }); setFlipped(true); setFlipping(false) }, 380)
    }
  }

  const card = cardData ? getCard(cardData.b as 0|1|2|3|4, cardData.m as 0|1|2|3|4, cardData.v) : null
  const CARD_H = flipped ? 240 : 172

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -4, scale: 1.012 }}
      whileTap={{ scale: 0.975 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ cursor: 'pointer', perspective: '1100px' }}
    >
      <div style={{
        position: 'relative',
        height: CARD_H,
        transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)',
        transformStyle: 'preserve-3d',
      }}>

        {/* ── BACK FACE ─────────────────────────────── */}
        <div style={{
          ...shell,
          background: P.cardBack,
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          padding: '20px',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: '#8FAF8F18', filter: 'blur(20px)', pointerEvents: 'none' }} />
          <BrandLogo size={72} />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            style={{ fontSize: 12, fontWeight: 700, color: P.accent, letterSpacing: '0.12em', margin: 0 }}
          >
            請翻牌
          </motion.p>
        </div>

        {/* ── FRONT FACE ────────────────────────────── */}
        <div style={{
          ...shell,
          background: P.cardFront,
          transform: flipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
          transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 22px 18px',
        }}>
          <div style={{ position: 'absolute', bottom: -16, right: -16, width: 90, height: 90, borderRadius: '50%', background: '#8FAF8F14', filter: 'blur(18px)', pointerEvents: 'none' }} />
          <p style={{ fontSize: 14.5, fontWeight: 600, color: P.title, lineHeight: 1.75, marginBottom: 12, zIndex: 1, flex: 1 }}>
            {card?.text ?? ''}
          </p>
          <div style={{ height: 1, background: P.divider, marginBottom: 10, zIndex: 1 }} />
          <div style={{ zIndex: 1 }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.15em', color: P.label, textTransform: 'uppercase' as const, marginBottom: 5 }}>今日行動</p>
            <p style={{ fontSize: 12.5, color: P.body, lineHeight: 1.7 }}>{card?.task ?? ''}</p>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
