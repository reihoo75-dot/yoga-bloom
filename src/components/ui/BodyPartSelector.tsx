import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BODY_PARTS } from '../../data/bodyParts'
import { getPosesByBodyPart } from '../../data/poses'

interface BodyPartSelectorProps {
  selected: string[]
  onChange: (parts: string[]) => void
}

/* ── Clickable body regions ───────────────────────────────────── */
const REGIONS = [
  { id: 'neck',       label: '頸部',     type: 'circle' as const, cx: 60, cy: 34,  r: 9 },
  { id: 'shoulders',  label: '肩膀',     type: 'rect' as const, x: 28, y: 43, w: 64, h: 12, rx: 6 },
  { id: 'chest',      label: '胸腔',     type: 'rect' as const, x: 34, y: 55, w: 52, h: 22, rx: 6 },
  { id: 'core',       label: '核心',     type: 'rect' as const, x: 36, y: 77, w: 48, h: 18, rx: 5 },
  { id: 'lower_back', label: '下背',     type: 'rect' as const, x: 36, y: 95, w: 48, h: 14, rx: 5 },
  { id: 'hips',       label: '骨盆/髖',  type: 'rect' as const, x: 30, y: 109, w: 60, h: 16, rx: 8 },
  { id: 'hamstrings', label: '大腿後側', type: 'rect' as const, x: 30, y: 125, w: 22, h: 28, rx: 6 },
  { id: 'legs',       label: '腿部',     type: 'rect' as const, x: 68, y: 125, w: 22, h: 28, rx: 6 },
  { id: 'calves',     label: '小腿',     type: 'rect' as const, x: 32, y: 153, w: 16, h: 22, rx: 5 },
  { id: 'calves2',    label: '小腿',     type: 'rect' as const, x: 72, y: 153, w: 16, h: 22, rx: 5 },
]

const REGION_MAP: Record<string, string> = { calves2: 'calves' }
function partId(regionId: string) { return REGION_MAP[regionId] || regionId }

const ACCENT   = '#8FAF8F'
const ACCENT_H = '#8FAF8F30'
const ACCENT_S = '#8FAF8FB0'

export function BodyPartSelector({ selected, onChange }: BodyPartSelectorProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [focusPart, setFocusPart] = useState<string | null>(null)

  function toggleRegion(rid: string) {
    const pid = partId(rid)
    const isOn = selected.includes(pid)
    onChange(isOn ? selected.filter(s => s !== pid) : [...selected, pid])
    setFocusPart(isOn ? null : pid)
  }

  function togglePill(pid: string) {
    const isOn = selected.includes(pid)
    onChange(isOn ? selected.filter(s => s !== pid) : [...selected, pid])
    setFocusPart(isOn ? null : pid)
  }

  const focusDef = focusPart ? BODY_PARTS.find(b => b.id === focusPart) : null
  const poses    = focusPart ? getPosesByBodyPart(focusPart).slice(0, 4) : []

  return (
    <div className="space-y-4">

      {/* ── Layout: figure + labels ─────────────────────────── */}
      <div className="flex gap-3 items-start">

        {/* SVG figure ────────────────────────────────────────── */}
        <div className="flex-shrink-0 relative">
          {/* floating label on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key={hovered}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-7 left-0 right-0 flex justify-center pointer-events-none z-10"
              >
                <span className="bg-warm-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                  {REGIONS.find(r => r.id === hovered)?.label ?? BODY_PARTS.find(b => b.id === hovered)?.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <svg viewBox="0 0 120 185" width="120" height="185" className="overflow-visible">
            <defs>
              <linearGradient id="bodyBg" x1="60" y1="10" x2="60" y2="185" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#EDE8DF" />
                <stop offset="100%" stopColor="#E2DAD0" />
              </linearGradient>
              <linearGradient id="selGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#9FBF9F" />
                <stop offset="100%" stopColor="#7A9F7A" />
              </linearGradient>
            </defs>

            {/* ── Silhouette ── */}
            {/* Head */}
            <ellipse cx="60" cy="19" rx="16" ry="18" fill="url(#bodyBg)" stroke="#D4C9BE" strokeWidth="1" />
            {/* Neck */}
            <rect x="53" y="37" width="14" height="9" rx="3" fill="url(#bodyBg)" stroke="#D4C9BE" strokeWidth="1" />
            {/* Torso */}
            <path d="M30 44 Q36 41 60 41 Q84 41 90 44 L92 108 Q80 115 60 115 Q40 115 28 108 Z"
              fill="url(#bodyBg)" stroke="#D4C9BE" strokeWidth="1" />
            {/* Left arm */}
            <path d="M30 46 Q18 56 20 78 Q20 90 24 96"
              fill="none" stroke="url(#bodyBg)" strokeWidth="12" strokeLinecap="round" />
            <path d="M30 46 Q18 56 20 78 Q20 90 24 96"
              fill="none" stroke="#D4C9BE" strokeWidth="12" strokeLinecap="round" opacity="0.7" />
            {/* Right arm */}
            <path d="M90 46 Q102 56 100 78 Q100 90 96 96"
              fill="none" stroke="url(#bodyBg)" strokeWidth="12" strokeLinecap="round" />
            <path d="M90 46 Q102 56 100 78 Q100 90 96 96"
              fill="none" stroke="#D4C9BE" strokeWidth="12" strokeLinecap="round" opacity="0.7" />
            {/* Left leg */}
            <path d="M44 115 Q40 140 36 162 Q34 172 34 180"
              stroke="url(#bodyBg)" strokeWidth="17" strokeLinecap="round" fill="none" />
            <path d="M44 115 Q40 140 36 162 Q34 172 34 180"
              stroke="#D4C9BE" strokeWidth="17" strokeLinecap="round" fill="none" opacity="0.5" />
            {/* Right leg */}
            <path d="M76 115 Q80 140 84 162 Q86 172 86 180"
              stroke="url(#bodyBg)" strokeWidth="17" strokeLinecap="round" fill="none" />
            <path d="M76 115 Q80 140 84 162 Q86 172 86 180"
              stroke="#D4C9BE" strokeWidth="17" strokeLinecap="round" fill="none" opacity="0.5" />

            {/* ── Clickable regions ── */}
            {REGIONS.map(r => {
              const pid  = partId(r.id)
              const isSel  = selected.includes(pid)
              const isHov  = hovered === r.id
              const fill   = isSel ? 'url(#selGrad)' : isHov ? ACCENT_H : 'transparent'
              const stroke = isSel || isHov ? ACCENT : 'transparent'
              const common = {
                fill,
                stroke,
                strokeWidth: 1.5,
                opacity: isSel ? 0.82 : 0.7,
                className: 'cursor-pointer transition-all duration-150',
                onClick: () => toggleRegion(r.id),
                onMouseEnter: () => setHovered(r.id),
                onMouseLeave: () => setHovered(null),
              }
              if (r.type === 'circle') {
                return <circle key={r.id} cx={r.cx} cy={r.cy} r={r.r} {...common} />
              }
              return (
                <rect key={r.id}
                  x={r.x} y={r.y} width={r.w} height={r.h} rx={r.rx}
                  {...common}
                />
              )
            })}

            {/* Head click region */}
            <circle cx="60" cy="19" r="16"
              fill={selected.includes('neck') ? ACCENT_S : hovered === 'head' ? ACCENT_H : 'transparent'}
              stroke={selected.includes('neck') || hovered === 'head' ? ACCENT : 'transparent'}
              strokeWidth="1.5"
              opacity={0.7}
              className="cursor-pointer transition-all duration-150"
              onClick={() => toggleRegion('neck')}
              onMouseEnter={() => setHovered('head')}
              onMouseLeave={() => setHovered(null)}
            />
          </svg>
        </div>

        {/* ── Body part pills ─────────────────────────────────── */}
        <div className="flex-1 min-w-0 pt-2">
          <p className="text-[10px] text-warm-300 mb-2.5 leading-relaxed">
            點選身體部位，標記今天需要關注的區域
          </p>
          <div className="flex flex-wrap gap-1.5">
            {BODY_PARTS.map(part => {
              const isOn = selected.includes(part.id)
              return (
                <button
                  key={part.id}
                  onClick={() => togglePill(part.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-200
                    ${isOn
                      ? 'bg-sage-100 text-sage-600 border-sage-300 shadow-sm'
                      : 'bg-white/70 text-warm-400 border-cream-200 hover:border-sage-200 hover:text-warm-500'
                    }`}
                >
                  {isOn && <span className="mr-0.5 text-sage-500">✓</span>}
                  {part.label}
                </button>
              )
            })}
          </div>

          {selected.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-sage-500 mt-2.5 leading-relaxed"
            >
              已選：{selected.map(id => BODY_PARTS.find(b => b.id === id)?.label).filter(Boolean).join('・')}
            </motion.p>
          )}
        </div>
      </div>

      {/* ── Pose suggestions ──────────────────────────────────── */}
      <AnimatePresence>
        {focusPart && poses.length > 0 && focusDef && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl overflow-hidden border border-sage-100"
            style={{ background: 'linear-gradient(135deg, #F5F9F5 0%, #EDF5ED 100%)' }}
          >
            <div className="px-4 pt-3 pb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                <p className="text-[11px] font-semibold text-sage-600">
                  適合{focusDef.label}的動作
                </p>
              </div>
              <button
                onClick={() => setFocusPart(null)}
                className="w-5 h-5 rounded-full bg-white/60 flex items-center justify-center text-warm-300 hover:text-warm-500 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 pt-2">
              {poses.map(pose => (
                <div
                  key={pose.id}
                  className="bg-white/80 rounded-2xl p-3 border border-white/90 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-warm-700 leading-tight truncate">{pose.name}</p>
                      <p className="text-[9px] text-warm-300 leading-none mt-0.5">{pose.nameEn}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-warm-400 leading-relaxed line-clamp-2">
                    {pose.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
