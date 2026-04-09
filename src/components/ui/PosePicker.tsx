import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { YOGA_POSES, POSE_CATEGORIES, DIFFICULTY_LABELS } from '../../data/poses'
import type { PoseDef } from '../../types'

interface PosePickerProps {
  selected: string[]
  onToggle: (poseId: string) => void
  onAddCustom: (poseName: string) => void
  customPoses?: string[]
}

// Simple SVG stick figure illustrations for each pose
function PoseIllustration({ poseId, size = 60 }: { poseId: string; size?: number }) {
  const illustrations: Record<string, React.ReactNode> = {
    mountain: (
      <svg viewBox="0 0 60 80" width={size} height={size * 1.33}>
        <circle cx="30" cy="8" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <line x1="30" y1="14" x2="30" y2="45" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="22" x2="16" y2="34" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="22" x2="44" y2="34" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="45" x2="20" y2="68" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="45" x2="40" y2="68" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    downdog: (
      <svg viewBox="0 0 80 60" width={size * 1.33} height={size}>
        <circle cx="20" cy="52" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <line x1="20" y1="46" x2="40" y2="24" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="24" x2="60" y2="46" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="14" y1="36" x2="4" y2="54" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="36" x2="16" y2="56" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="46" x2="54" y2="58" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="62" y1="46" x2="68" y2="58" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    warrior1: (
      <svg viewBox="0 0 70 80" width={size * 0.875} height={size * 1.33}>
        <circle cx="35" cy="8" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <line x1="35" y1="14" x2="35" y2="42" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="35" y1="22" x2="18" y2="18" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="35" y1="22" x2="52" y2="18" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="35" y1="42" x2="20" y2="58" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="35" y1="42" x2="50" y2="70" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="58" x2="12" y2="72" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    tree: (
      <svg viewBox="0 0 60 80" width={size} height={size * 1.33}>
        <circle cx="30" cy="8" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <line x1="30" y1="14" x2="30" y2="48" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="22" x2="12" y2="30" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="22" x2="48" y2="30" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="48" x2="30" y2="72" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="55" x2="18" y2="48" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="18" cy="48" r="3" fill="#8FAF8F" />
      </svg>
    ),
    child: (
      <svg viewBox="0 0 80 50" width={size * 1.33} height={size}>
        <circle cx="72" cy="18" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <path d="M72 24 Q60 30 40 30 Q20 30 8 28" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="40" y1="30" x2="44" y2="44" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="30" x2="54" y2="44" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="60" y1="28" x2="8" y2="28" stroke="#8FAF8F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    cobra: (
      <svg viewBox="0 0 80 55" width={size * 1.33} height={size}>
        <circle cx="68" cy="14" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <path d="M68 20 Q60 26 50 28 Q30 30 10 28" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="30" y1="28" x2="28" y2="44" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="28" x2="50" y2="44" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="55" y1="26" x2="65" y2="16" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    bridge: (
      <svg viewBox="0 0 80 55" width={size * 1.33} height={size}>
        <circle cx="12" cy="18" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <path d="M12 24 Q20 26 30 24 Q50 20 60 28 Q64 32 62 40" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="44" y1="22" x2="40" y2="44" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="56" y1="26" x2="56" y2="44" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    plank: (
      <svg viewBox="0 0 80 45" width={size * 1.33} height={size}>
        <circle cx="10" cy="16" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <path d="M10 22 L70 22" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="22" x2="18" y2="38" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="22" x2="26" y2="38" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="22" x2="60" y2="38" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="22" x2="70" y2="38" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    savasana: (
      <svg viewBox="0 0 80 40" width={size * 1.33} height={size}>
        <circle cx="10" cy="14" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <line x1="10" y1="20" x2="72" y2="22" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="25" y1="20" x2="20" y2="34" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="21" x2="50" y2="34" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="22" x2="52" y2="36" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="22" x2="74" y2="36" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    lotus: (
      <svg viewBox="0 0 60 65" width={size} height={size * 1.1}>
        <circle cx="30" cy="10" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <line x1="30" y1="16" x2="30" y2="40" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="22" x2="14" y2="30" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="22" x2="46" y2="30" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M30 40 Q10 44 8 56" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M30 40 Q50 44 52 56" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="8" y1="56" x2="52" y2="56" stroke="#8FAF8F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    twist: (
      <svg viewBox="0 0 65 70" width={size * 1.1} height={size * 1.17}>
        <circle cx="30" cy="10" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <path d="M30 16 Q32 28 28 38" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="30" y1="24" x2="12" y2="20" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="24" x2="48" y2="32" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 38 Q10 42 8 56" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M28 38 Q46 42 50 56" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="8" y1="56" x2="50" y2="56" stroke="#8FAF8F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    pigeon: (
      <svg viewBox="0 0 75 60" width={size * 1.25} height={size}>
        <circle cx="60" cy="14" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <path d="M60 20 Q50 26 38 28 Q22 28 12 20" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M38 28 Q34 40 30 54" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M38 28 Q50 36 62 44" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="50" y1="24" x2="46" y2="14" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    forward_fold: (
      <svg viewBox="0 0 65 75" width={size * 1.1} height={size * 1.25}>
        <circle cx="32" cy="8" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <path d="M32 14 Q30 24 28 34 Q26 40 22 46" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="30" y1="20" x2="12" y2="16" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="20" x2="14" y2="34" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="34" x2="20" y2="60" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="34" x2="40" y2="60" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    cat_cow: (
      <svg viewBox="0 0 75 55" width={size * 1.25} height={size}>
        <circle cx="66" cy="22" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
        <path d="M66 28 Q55 38 40 40 Q25 42 14 38" stroke="#8FAF8F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="52" y1="38" x2="50" y2="50" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="40" x2="28" y2="52" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="60" y1="32" x2="60" y2="16" stroke="#8FAF8F" strokeWidth="2" strokeLinecap="round" strokeDasharray="3,2" />
      </svg>
    ),
  }

  const defaultIllustration = (
    <svg viewBox="0 0 60 80" width={size} height={size * 1.33}>
      <circle cx="30" cy="8" r="6" fill="none" stroke="#8FAF8F" strokeWidth="2.5" />
      <line x1="30" y1="14" x2="30" y2="45" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="22" x2="16" y2="32" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="22" x2="44" y2="32" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="45" x2="20" y2="68" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="45" x2="40" y2="68" stroke="#8FAF8F" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )

  return illustrations[poseId] || defaultIllustration
}

export function PosePicker({ selected, onToggle, onAddCustom, customPoses = [] }: PosePickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedPoseDetail, setSelectedPoseDetail] = useState<PoseDef | null>(null)
  const [customInput, setCustomInput] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const filteredPoses = useMemo(() => {
    return YOGA_POSES.filter(pose => {
      const matchCategory = activeCategory === 'all' || pose.category === activeCategory
      const matchSearch = !searchQuery || pose.name.includes(searchQuery) || pose.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [activeCategory, searchQuery])

  function handleAddCustom() {
    const trimmed = customInput.trim()
    if (!trimmed) return
    onAddCustom(trimmed)
    setCustomInput('')
    setShowCustomInput(false)
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="搜尋動作名稱..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 pl-9 rounded-2xl bg-white/70 border border-sage-100 text-sm text-warm-500
            placeholder-warm-300 focus:outline-none focus:border-sage-300"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-300 text-sm">🔍</span>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {POSE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 min-h-[32px]
              ${activeCategory === cat.id
                ? 'bg-sage-400 text-white shadow-sm'
                : 'bg-white/60 text-warm-400 border border-sage-100'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Pose grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredPoses.map(pose => {
          const isSelected = selected.includes(pose.id) || customPoses.includes(pose.name)
          return (
            <motion.button
              key={pose.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                onToggle(pose.id)
                setSelectedPoseDetail(selectedPoseDetail?.id === pose.id ? null : pose)
              }}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 relative
                ${isSelected
                  ? 'bg-sage-50 border-sage-300 shadow-sm'
                  : 'bg-white/60 border-sage-100'
                }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 text-sage-500 text-xs font-bold">✓</span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 flex items-center justify-center bg-cream-50 rounded-xl flex-shrink-0">
                  <PoseIllustration poseId={pose.id} size={32} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-warm-600 leading-tight">{pose.name}</p>
                  <p className="text-[10px] text-warm-300 leading-tight">{pose.nameEn}</p>
                </div>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full
                ${pose.difficulty === 'beginner' ? 'bg-sage-50 text-sage-500' :
                  pose.difficulty === 'intermediate' ? 'bg-beige-50 text-beige-500' :
                  'bg-blush-50 text-blush-500'}`}>
                {DIFFICULTY_LABELS[pose.difficulty]}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Pose detail panel */}
      <AnimatePresence>
        {selectedPoseDetail && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="bg-sage-50/80 rounded-2xl p-4 border border-sage-100"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl flex-shrink-0">
                <PoseIllustration poseId={selectedPoseDetail.id} size={44} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-warm-600">{selectedPoseDetail.name}</h3>
                  <span className="text-xs text-warm-300">{selectedPoseDetail.nameEn}</span>
                </div>
                <p className="text-xs text-warm-500 leading-relaxed mb-2">
                  {selectedPoseDetail.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedPoseDetail.bodyParts.map(bp => (
                    <span key={bp} className="text-[10px] px-2 py-0.5 bg-white rounded-full text-sage-500 border border-sage-100">
                      {bp}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedPoseDetail(null)}
                className="text-warm-300 text-sm flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom pose input */}
      <div className="border-t border-cream-200 pt-3">
        {showCustomInput ? (
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
              placeholder="輸入動作名稱（如：半月式）"
              className="flex-1 px-3 py-2 rounded-2xl text-sm border border-sage-200 bg-sage-50 text-warm-600 placeholder-warm-300 focus:outline-none focus:border-sage-400"
            />
            <button onClick={handleAddCustom} className="px-3 py-2 bg-sage-400 text-white rounded-2xl text-sm">新增</button>
            <button onClick={() => { setShowCustomInput(false); setCustomInput('') }} className="text-warm-300 text-sm px-2">取消</button>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="flex items-center gap-1.5 text-xs text-warm-400 border border-dashed border-warm-200 px-3 py-2 rounded-2xl hover:text-sage-500 hover:border-sage-300 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            沒有想練的動作？自訂新增
          </button>
        )}
        {customPoses.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {customPoses.map(name => (
              <span key={name} className="px-2.5 py-1 rounded-full text-xs bg-beige-50 text-beige-500 border border-beige-100">
                ✏️ {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
