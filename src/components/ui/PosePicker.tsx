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

function PoseIllustration({ pose, size = 60 }: { pose: PoseDef; size?: number }) {
  if (pose.image) {
    return (
      <img
        src={pose.image}
        alt={pose.name}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    )
  }
  // Fallback: emoji icon for poses without images
  return (
    <span style={{ fontSize: size * 0.6, lineHeight: 1 }}>{pose.icon}</span>
  )
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
                  <PoseIllustration pose={pose} size={32} />
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
                <PoseIllustration pose={selectedPoseDetail} size={44} />
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
