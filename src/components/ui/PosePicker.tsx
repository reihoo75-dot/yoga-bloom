import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { YOGA_POSES, POSE_CATEGORIES, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../../data/poses'
import type { PoseDef } from '../../types'

interface PosePickerProps {
  selected: string[]
  onToggle: (poseId: string) => void
  onAddCustom: (poseName: string) => void
  customPoses?: string[]
}

export function PosePicker({ selected, onToggle, onAddCustom, customPoses = [] }: PosePickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [detailPose, setDetailPose] = useState<PoseDef | null>(null)
  const [customInput, setCustomInput] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const filteredPoses = useMemo(() => {
    return YOGA_POSES.filter(pose => {
      const matchCategory = activeCategory === 'all' || pose.category === activeCategory
      const matchSearch = !searchQuery ||
        pose.name.includes(searchQuery) ||
        pose.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
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

  function handlePoseClick(pose: PoseDef) {
    if (detailPose?.id === pose.id) {
      // Second tap on same pose: close detail
      setDetailPose(null)
    } else if (selected.includes(pose.id)) {
      // Already selected: show detail (allow deselect from there)
      setDetailPose(pose)
    } else {
      // Not selected: select it and show detail briefly
      onToggle(pose.id)
      setDetailPose(pose)
    }
  }

  const totalSelected = selected.length + customPoses.length

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="搜尋動作名稱..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 pl-9 rounded-2xl bg-white border border-cream-200 text-sm
            text-warm-500 placeholder-warm-300 focus:outline-none focus:border-sage-300"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-300 text-sm">🔍</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-300 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {POSE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
              ${activeCategory === cat.id
                ? 'bg-sage-400 text-white shadow-sm'
                : 'bg-white text-warm-400 border border-cream-200'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Selected count */}
      {totalSelected > 0 && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-sage-600 font-medium">已選 {totalSelected} 個動作</span>
          <div className="h-px flex-1 bg-sage-100" />
        </div>
      )}

      {/* 3-column pose grid */}
      <div className="grid grid-cols-3 gap-2">
        {filteredPoses.map(pose => {
          const isSelected = selected.includes(pose.id)
          const isDetail = detailPose?.id === pose.id
          return (
            <motion.button
              key={pose.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => handlePoseClick(pose)}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left
                ${isSelected
                  ? 'border-sage-400 shadow-sm'
                  : 'border-transparent'
                }
                ${isDetail ? 'ring-2 ring-sage-300 ring-offset-1' : ''}
              `}
            >
              {/* Image */}
              <div className="aspect-square w-full bg-cream-50 flex items-center justify-center overflow-hidden">
                <img
                  src={pose.image}
                  alt={pose.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>

              {/* Selected overlay */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-sage-400 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold leading-none">✓</span>
                </div>
              )}

              {/* Name + difficulty */}
              <div className={`px-1.5 py-1.5 ${isSelected ? 'bg-sage-50' : 'bg-white'}`}>
                <p className="text-xs font-medium text-warm-600 leading-tight text-center truncate">
                  {pose.name}
                </p>
                <p className={`text-center mt-0.5 text-[10px] px-1.5 py-0.5 rounded-full inline-block w-full
                  ${DIFFICULTY_COLORS[pose.difficulty]}`}>
                  {DIFFICULTY_LABELS[pose.difficulty]}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {filteredPoses.length === 0 && (
        <div className="text-center py-6 text-warm-300 text-sm">找不到「{searchQuery}」相關動作</div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {detailPose && (
          <motion.div
            key={detailPose.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-sage-100 overflow-hidden shadow-sm"
          >
            <div className="flex items-stretch">
              {/* Pose image */}
              <div className="w-20 flex-shrink-0 bg-cream-50 flex items-center justify-center p-2">
                <img
                  src={detailPose.image}
                  alt={detailPose.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Info */}
              <div className="flex-1 p-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-warm-600">{detailPose.name}</p>
                    <p className="text-xs text-warm-300">{detailPose.nameEn}</p>
                  </div>
                  <button
                    onClick={() => setDetailPose(null)}
                    className="text-warm-300 text-sm flex-shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full bg-cream-100"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-warm-400 leading-relaxed mt-1.5">{detailPose.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[detailPose.difficulty]}`}>
                    {DIFFICULTY_LABELS[detailPose.difficulty]}
                  </span>
                  {selected.includes(detailPose.id) ? (
                    <button
                      onClick={() => { onToggle(detailPose.id); setDetailPose(null) }}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-blush-50 text-blush-500 border border-blush-100"
                    >
                      取消選擇
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggle(detailPose.id)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-sage-100 text-sage-600 border border-sage-200"
                    >
                      + 加入
                    </button>
                  )}
                </div>
              </div>
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
              placeholder="輸入動作名稱..."
              className="flex-1 px-3 py-2.5 rounded-2xl text-sm border border-sage-200 bg-sage-50
                text-warm-600 placeholder-warm-300 focus:outline-none focus:border-sage-400"
            />
            <button
              onClick={handleAddCustom}
              className="px-4 py-2.5 bg-sage-400 text-white rounded-2xl text-sm font-medium"
            >
              新增
            </button>
            <button
              onClick={() => { setShowCustomInput(false); setCustomInput('') }}
              className="text-warm-300 text-sm px-2"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="flex items-center gap-2 text-xs text-warm-400 border border-dashed border-warm-200
              px-4 py-2.5 rounded-2xl w-full justify-center hover:text-sage-500 hover:border-sage-300 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            加入其他動作
          </button>
        )}
        {customPoses.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {customPoses.map(name => (
              <span key={name} className="px-2.5 py-1 rounded-full text-xs bg-beige-50 text-beige-600 border border-beige-100">
                ✏️ {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
