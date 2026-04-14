import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTodayCard } from '../../data/cards'

const FLIP_KEY = 'yoga_bloom_card_flipped'

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function wasFlippedToday(): boolean {
  try {
    const raw = localStorage.getItem(FLIP_KEY)
    if (!raw) return false
    const { date } = JSON.parse(raw)
    return date === getTodayKey()
  } catch {
    return false
  }
}

function markFlippedToday() {
  localStorage.setItem(FLIP_KEY, JSON.stringify({ date: getTodayKey() }))
}

// ── colour palette per card colour ──────────────────────────────────────────
const PALETTE = {
  sage: {
    frontGrad: 'linear-gradient(145deg, #EEF5EE 0%, #D8EAD8 60%, #C5DFC5 100%)',
    backGrad:  'linear-gradient(145deg, #F4F9F4 0%, #E3EFE3 100%)',
    orb1: '#8FAF8F22',
    orb2: '#B5CFB522',
    label: '#6B9A6B',
    quote: '#3D6B3D',
    body:  '#5A7A5A',
    btn:   'linear-gradient(135deg, #8FAF8F, #6B9A6B)',
    btnShadow: '#8FAF8F55',
    divider: '#C5DFC5',
    shimmer: '#FFFFFF33',
  },
  blush: {
    frontGrad: 'linear-gradient(145deg, #FDF0F2 0%, #F5D5DA 60%, #EDB0B8 100%)',
    backGrad:  'linear-gradient(145deg, #FEF5F6 0%, #F9E4E7 100%)',
    orb1: '#EDB0B822',
    orb2: '#F5D5DA22',
    label: '#C07080',
    quote: '#8B3D4D',
    body:  '#A05060',
    btn:   'linear-gradient(135deg, #EDB0B8, #C07080)',
    btnShadow: '#EDB0B855',
    divider: '#F5D5DA',
    shimmer: '#FFFFFF33',
  },
  beige: {
    frontGrad: 'linear-gradient(145deg, #FAF5EE 0%, #EDD5B8 60%, #D4B896 100%)',
    backGrad:  'linear-gradient(145deg, #FCF8F2 0%, #F2E6D2 100%)',
    orb1: '#D4B89622',
    orb2: '#EDD5B822',
    label: '#A07040',
    quote: '#6B4820',
    body:  '#8B6035',
    btn:   'linear-gradient(135deg, #D4B896, #A07040)',
    btnShadow: '#D4B89655',
    divider: '#EDD5B8',
    shimmer: '#FFFFFF33',
  },
} as const

const THEME_LABELS: Record<string, string> = {
  grounding: '扎根',
  openness:  '開放',
  strength:  '力量',
  rest:      '休息',
  awareness: '覺察',
  joy:       '喜悅',
  release:   '釋放',
  flow:      '流動',
  gratitude: '感恩',
  presence:  '當下',
}

export function DailyCard() {
  const card = getTodayCard()
  const p = PALETTE[card.color]
  const navigate = useNavigate()

  const [flipped, setFlipped] = useState(wasFlippedToday)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    // Sync flip state if card changes at midnight
    setFlipped(wasFlippedToday())
  }, [card.id])

  function handleFlip() {
    if (flipped || animating) return
    setAnimating(true)
    setTimeout(() => {
      setFlipped(true)
      markFlippedToday()
      setAnimating(false)
    }, 350) // halfway through the flip
  }

  function handleCta(e: React.MouseEvent) {
    e.stopPropagation()
    const routes: Record<string, string> = {
      breathing: '/breathing',
      log: '/log',
      insights: '/insights',
    }
    navigate(routes[card.ctaTarget] ?? '/log')
  }

  const today = new Date()
  const dateLabel = today.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' })

  return (
    <div style={{ perspective: '1200px' }}>
      <div
        onClick={!flipped ? handleFlip : undefined}
        style={{
          position: 'relative',
          height: '420px',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: flipped ? 'default' : 'pointer',
        }}
      >
        {/* ── FRONT ─────────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '24px',
            background: p.frontGrad,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '28px 24px 24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Decorative orbs */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: p.orb1, filter: 'blur(20px)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -30, width: 120, height: 120, borderRadius: '50%', background: p.orb2, filter: 'blur(16px)' }} />
          {/* Shimmer line */}
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px', background: p.shimmer }} />

          {/* Top label */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: p.label, textTransform: 'uppercase', opacity: 0.8 }}>
              今日意圖
            </span>
            <span style={{ fontSize: 11, color: p.label, opacity: 0.5, letterSpacing: '0.06em' }}>
              {dateLabel}
            </span>
          </div>

          {/* Centre emoji */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 1 }}>
            <div style={{
              fontSize: 72,
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.10))',
              animation: 'cardFloat 3s ease-in-out infinite',
            }}>
              {card.emoji}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: p.label, fontWeight: 500, marginBottom: 6 }}>
                {THEME_LABELS[card.theme] ?? card.theme}
              </p>
            </div>
          </div>

          {/* Bottom tap hint */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1 }}>
            <div style={{ width: 32, height: 1, background: p.divider }} />
            <p style={{ fontSize: 12, color: p.label, opacity: 0.6, letterSpacing: '0.08em' }}>
              點擊翻開
            </p>
            <span style={{ fontSize: 16, color: p.label, opacity: 0.5, animation: 'cardBob 1.5s ease-in-out infinite' }}>
              ↓
            </span>
          </div>
        </div>

        {/* ── BACK ──────────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '24px',
            background: p.backGrad,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: '28px 24px 24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Decorative orbs */}
          <div style={{ position: 'absolute', top: -40, left: -40, width: 140, height: 140, borderRadius: '50%', background: p.orb1, filter: 'blur(20px)' }} />
          <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: p.orb2, filter: 'blur(14px)' }} />
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px', background: p.shimmer }} />

          {/* Theme badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, zIndex: 1 }}>
            <span style={{ fontSize: 20 }}>{card.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: p.label, textTransform: 'uppercase', opacity: 0.7 }}>
              {THEME_LABELS[card.theme] ?? card.theme}
            </span>
          </div>

          {/* Short quote — hero text */}
          <p style={{
            fontSize: 22,
            fontWeight: 700,
            color: p.quote,
            lineHeight: 1.45,
            marginBottom: 16,
            zIndex: 1,
            letterSpacing: '-0.01em',
          }}>
            {card.shortQuote}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: p.divider, marginBottom: 16, zIndex: 1 }} />

          {/* Title + Guidance */}
          <div style={{ flex: 1, zIndex: 1, overflow: 'hidden' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: p.quote, marginBottom: 10, opacity: 0.85 }}>
              {card.title}
            </p>
            <p style={{
              fontSize: 13.5,
              color: p.body,
              lineHeight: 1.75,
              opacity: 0.9,
            }}>
              {card.longGuidance}
            </p>
          </div>

          {/* CTA button */}
          <button
            onClick={handleCta}
            style={{
              marginTop: 20,
              width: '100%',
              padding: '14px 0',
              borderRadius: '16px',
              border: 'none',
              background: p.btn,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${p.btnShadow}`,
              zIndex: 1,
              position: 'relative',
              transition: 'opacity 0.15s, transform 0.15s',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {card.ctaLabel} →
          </button>
        </div>
      </div>

      {/* CSS keyframes injected once */}
      <style>{`
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes cardBob {
          0%, 100% { transform: translateY(0px); opacity: 0.5; }
          50%       { transform: translateY(4px); opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}
