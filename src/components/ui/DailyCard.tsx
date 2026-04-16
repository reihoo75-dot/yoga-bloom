import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BODY_STATES, MIND_STATES, getCard } from '../../data/cards'
import { BrandLogo } from './BrandLogo'

const STORAGE_KEY = 'yoga_bloom_daily_card'

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

interface StoredData {
  date: string
  bodyIndex?: number
  mindIndex?: number
  flipped?: boolean
  variant?: number
}

function loadToday(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredData
    if (parsed.date !== getTodayKey()) return null
    return parsed
  } catch {
    return null
  }
}

function saveToday(patch: Partial<StoredData>) {
  const base: StoredData = loadToday() ?? { date: getTodayKey() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...base, ...patch }))
}

const P = {
  cardBack:   'linear-gradient(150deg, #EDF5ED 0%, #E0EEE0 100%)',
  cardFront:  'linear-gradient(150deg, #F8F5F0 0%, #EEE8DF 100%)',
  accent:     '#8FAF8F',
  accentFaint:'#8FAF8F14',
  label:      '#9A8070',
  title:      '#3A2820',
  body:       '#5A4038',
  divider:    '#DDD5C8',
  pillActive:    '#8FAF8F',
  pillActiveBg:  '#F0F7F0',
  pillInactive:  '#BEB0A0',
  pillBorder:    '#E0D8CC',
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
  const navigate = useNavigate()
  const [bodyIndex, setBodyIndex] = useState<number | null>(null)
  const [mindIndex, setMindIndex] = useState<number | null>(null)
  const [flipped, setFlipped]     = useState(false)
  const [flipping, setFlipping]   = useState(false)
  const [variant, setVariant]     = useState(0)

  useEffect(() => {
    const s = loadToday()
    if (!s) return
    if (s.bodyIndex !== undefined) setBodyIndex(s.bodyIndex)
    if (s.mindIndex !== undefined) setMindIndex(s.mindIndex)
    if (s.flipped && s.variant !== undefined) {
      setVariant(s.variant)
      setFlipped(true)
    }
  }, [])

  function handleBodySelect(i: number) {
    if (flipped) return
    setBodyIndex(i)
    saveToday({ bodyIndex: i })
  }
  function handleMindSelect(i: number) {
    if (flipped) return
    setMindIndex(i)
    saveToday({ mindIndex: i })
  }

  function handleFlip() {
    if (bodyIndex === null || mindIndex === null || flipping || flipped) return
    setFlipping(true)
    const v = Math.floor(Math.random() * 3)
    saveToday({ variant: v, flipped: true })
    setTimeout(() => {
      setVariant(v)
      setFlipped(true)
      setFlipping(false)
    }, 380)
  }

  const card = (flipped && bodyIndex !== null && mindIndex !== null)
    ? getCard(bodyIndex as 0|1|2|3|4, mindIndex as 0|1|2|3|4, variant)
    : null

  const canFlip = bodyIndex !== null && mindIndex !== null
  const dateLabel = new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' })
  const CARD_H = flipped ? 240 : 172

  return (
    <div>
      {/* ── 3D flip card ─────────────────────────────── */}
      <div style={{ perspective: '1100px' }}>
        <div
          onClick={!flipped && canFlip ? handleFlip : undefined}
          style={{
            position: 'relative',
            height: CARD_H,
            transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)',
            transformStyle: 'preserve-3d',
            cursor: (!flipped && canFlip) ? 'pointer' : 'default',
          }}
        >
          {/* ── DECORATIVE BACK (before flip) ───────── */}
          <div style={{
            ...shell,
            background: P.cardBack,
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px 16px',
          }}>
            {/* Subtle glow */}
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: '#8FAF8F18', filter: 'blur(20px)', pointerEvents: 'none' }} />

            {/* Top label */}
            <div style={{ textAlign: 'center', width: '100%', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 1, background: P.accent + '30' }} />
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: P.accent, textTransform: 'uppercase' as const }}>今日意圖牌</p>
                <div style={{ flex: 1, height: 1, background: P.accent + '30' }} />
              </div>
              <p style={{ fontSize: 11, color: P.label, opacity: 0.55, marginTop: 3 }}>{dateLabel}</p>
            </div>

            {/* Brand logo */}
            <div>
              <BrandLogo size={72} />
            </div>

            {/* Bottom hint */}
            <div style={{ width: '100%', textAlign: 'center', zIndex: 1, minHeight: 24 }}>
              {canFlip ? (
                <motion.div
                  animate={{ opacity: [0.65, 1, 0.65], y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                >
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: P.accent, letterSpacing: '0.06em' }}>點擊翻開牌卡</span>
                  <span style={{ fontSize: 14, color: P.accent, lineHeight: 1 }}>↓</span>
                </motion.div>
              ) : (
                <p style={{ fontSize: 11, color: P.label, opacity: 0.38 }}>選擇狀態後翻開</p>
              )}
            </div>
          </div>

          {/* ── CONTENT FACE (after flip) ────────────── */}
          <div style={{
            ...shell,
            background: P.cardFront,
            transform: flipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
            transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 22px 18px',
          }}>
            {/* Glow */}
            <div style={{ position: 'absolute', bottom: -16, right: -16, width: 90, height: 90, borderRadius: '50%', background: P.accentFaint, filter: 'blur(18px)', pointerEvents: 'none' }} />

            {/* Card text */}
            <p style={{ fontSize: 14.5, fontWeight: 600, color: P.title, lineHeight: 1.75, marginBottom: 12, zIndex: 1, flex: 1 }}>
              {card?.text ?? ''}
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: P.divider, marginBottom: 10, zIndex: 1 }} />

            {/* Task */}
            <div style={{ zIndex: 1 }}>
              <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.15em', color: P.label, textTransform: 'uppercase' as const, marginBottom: 5 }}>今日行動</p>
              <p style={{ fontSize: 12.5, color: P.body, lineHeight: 1.7 }}>{card?.task ?? ''}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── State selectors (only before flip) ───────── */}
      {!flipped && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.3 }}
          style={{ marginTop: 14 }}
        >
          {/* Body state */}
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: P.label, marginBottom: 7, letterSpacing: '0.04em' }}>身體狀態</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              {BODY_STATES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleBodySelect(i)}
                  style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 12,
                    fontWeight: bodyIndex === i ? 600 : 400,
                    color: bodyIndex === i ? P.pillActive : P.pillInactive,
                    background: bodyIndex === i ? P.pillActiveBg : 'rgba(255,255,255,0.6)',
                    border: `1px solid ${bodyIndex === i ? P.pillActive + '60' : P.pillBorder}`,
                    cursor: 'pointer', transition: 'all 0.18s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Mind state */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: P.label, marginBottom: 7, letterSpacing: '0.04em' }}>心理狀態</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              {MIND_STATES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleMindSelect(i)}
                  style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 12,
                    fontWeight: mindIndex === i ? 600 : 400,
                    color: mindIndex === i ? P.pillActive : P.pillInactive,
                    background: mindIndex === i ? P.pillActiveBg : 'rgba(255,255,255,0.6)',
                    border: `1px solid ${mindIndex === i ? P.pillActive + '60' : P.pillBorder}`,
                    cursor: 'pointer', transition: 'all 0.18s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

