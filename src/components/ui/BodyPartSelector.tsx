import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BODY_PARTS } from '../../data/bodyParts'
import { getPosesByBodyPart } from '../../data/poses'

interface BodyPartSelectorProps {
  selected: string[]
  onChange: (parts: string[]) => void
}

// Simple human body SVG regions (front view, viewBox 0 0 100 220)
const BODY_SVG_REGIONS = [
  // Head
  { id: 'head', label: '頭部', d: 'M50,8 a14,14 0 1,0 0.001,0', type: 'circle' as const, cx: 50, cy: 18, r: 13 },
  // Neck
  { id: 'neck', label: '頸部', type: 'rect' as const, x: 43, y: 31, width: 14, height: 9 },
  // Shoulders + upper arms
  { id: 'shoulders', label: '肩膀', type: 'rect' as const, x: 18, y: 38, width: 64, height: 12 },
  // Chest
  { id: 'chest', label: '胸腔', type: 'rect' as const, x: 28, y: 50, width: 44, height: 20 },
  // Core/abdomen
  { id: 'core', label: '核心', type: 'rect' as const, x: 30, y: 70, width: 40, height: 18 },
  // Lower back / hips (pelvis)
  { id: 'hips', label: '骨盆/髖', type: 'rect' as const, x: 24, y: 88, width: 52, height: 16 },
  // Thighs (upper legs)
  { id: 'hamstrings', label: '大腿後側', type: 'rect' as const, x: 24, y: 104, width: 22, height: 28 },
  { id: 'legs', label: '腿部', type: 'rect' as const, x: 54, y: 104, width: 22, height: 28 },
  // Lower legs
  { id: 'lower_back', label: '下背', type: 'rect' as const, x: 28, y: 132, width: 18, height: 24 },
  { id: 'calves', label: '小腿/腳踝', type: 'rect' as const, x: 54, y: 132, width: 18, height: 24 },
  // Feet
  { id: 'feet_l', label: '腳', type: 'rect' as const, x: 24, y: 156, width: 24, height: 10 },
  { id: 'feet_r', label: '腳', type: 'rect' as const, x: 52, y: 156, width: 24, height: 10 },
]

// Simplified regions that map to our body part IDs
const CLICKABLE_REGIONS = [
  { id: 'neck', label: '頸部', type: 'rect' as const, x: 43, y: 31, width: 14, height: 9, rx: 4 },
  { id: 'shoulders', label: '肩膀', type: 'rect' as const, x: 18, y: 38, width: 64, height: 12, rx: 6 },
  { id: 'chest', label: '胸腔', type: 'rect' as const, x: 28, y: 50, width: 44, height: 20, rx: 6 },
  { id: 'core', label: '核心', type: 'rect' as const, x: 30, y: 70, width: 40, height: 18, rx: 5 },
  { id: 'lower_back', label: '下背', type: 'rect' as const, x: 30, y: 88, width: 40, height: 16, rx: 5 },
  { id: 'hips', label: '骨盆/髖', type: 'rect' as const, x: 22, y: 100, width: 56, height: 16, rx: 8 },
  { id: 'hamstrings', label: '大腿後側', type: 'rect' as const, x: 22, y: 116, width: 24, height: 26, rx: 5 },
  { id: 'legs', label: '腿部', type: 'rect' as const, x: 54, y: 116, width: 24, height: 26, rx: 5 },
  { id: 'calves', label: '小腿', type: 'rect' as const, x: 26, y: 142, width: 18, height: 22, rx: 4 },
  { id: 'calves2', label: '小腿', type: 'rect' as const, x: 56, y: 142, width: 18, height: 22, rx: 4 },
]

const REGION_ID_MAP: Record<string, string> = {
  calves: 'calves',
  calves2: 'calves',
  legs: 'legs',
  hamstrings: 'hamstrings',
}

function getBodyPartId(regionId: string): string {
  return REGION_ID_MAP[regionId] || regionId
}

export function BodyPartSelector({ selected, onChange }: BodyPartSelectorProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [showPosesSuggestion, setShowPosesSuggestion] = useState<string | null>(null)

  function togglePart(regionId: string) {
    const partId = getBodyPartId(regionId)
    const next = selected.includes(partId)
      ? selected.filter(s => s !== partId)
      : [...selected, partId]
    onChange(next)
    if (!selected.includes(partId)) {
      setShowPosesSuggestion(partId)
    } else {
      setShowPosesSuggestion(null)
    }
  }

  const selectedBodyPart = showPosesSuggestion
    ? BODY_PARTS.find(b => b.id === showPosesSuggestion)
    : null
  const suggestedPoses = showPosesSuggestion ? getPosesByBodyPart(showPosesSuggestion).slice(0, 4) : []

  return (
    <div className="space-y-4">
      <p className="text-xs text-warm-400 leading-relaxed">
        點選身體部位，標記今天需要關注的區域
      </p>

      <div className="flex gap-4 items-start">
        {/* SVG Body Figure */}
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 100 175"
            width="110"
            height="193"
            className="overflow-visible"
          >
            {/* Body silhouette (background) */}
            {/* Head */}
            <circle cx="50" cy="18" r="13" fill="#EDE8E0" stroke="#D4C9BE" strokeWidth="1" />
            {/* Neck */}
            <rect x="44" y="31" width="12" height="8" rx="3" fill="#EDE8E0" stroke="#D4C9BE" strokeWidth="1" />
            {/* Torso */}
            <path d="M22 38 Q28 35 50 35 Q72 35 78 38 L80 90 Q70 96 50 96 Q30 96 20 90 Z"
              fill="#EDE8E0" stroke="#D4C9BE" strokeWidth="1" />
            {/* Left arm */}
            <path d="M22 40 Q12 48 14 70 Q14 80 18 84" fill="#EDE8E0" stroke="#D4C9BE" strokeWidth="8" strokeLinecap="round" />
            {/* Right arm */}
            <path d="M78 40 Q88 48 86 70 Q86 80 82 84" fill="#EDE8E0" stroke="#D4C9BE" strokeWidth="8" strokeLinecap="round" />
            {/* Left leg */}
            <path d="M36 96 Q33 120 30 142 Q28 155 28 165" stroke="#EDE8E0" strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M36 96 Q33 120 30 142 Q28 155 28 165" stroke="#D4C9BE" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.5" />
            {/* Right leg */}
            <path d="M64 96 Q67 120 70 142 Q72 155 72 165" stroke="#EDE8E0" strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M64 96 Q67 120 70 142 Q72 155 72 165" stroke="#D4C9BE" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.5" />

            {/* Clickable regions */}
            {CLICKABLE_REGIONS.map(region => {
              const partId = getBodyPartId(region.id)
              const isSelected = selected.includes(partId)
              const isHovered = hoveredPart === region.id
              return (
                <rect
                  key={region.id}
                  x={region.x}
                  y={region.y}
                  width={region.width}
                  height={region.height}
                  rx={region.rx}
                  fill={isSelected ? '#8FAF8F' : isHovered ? '#8FAF8F40' : 'transparent'}
                  stroke={isSelected ? '#8FAF8F' : isHovered ? '#8FAF8F' : 'transparent'}
                  strokeWidth="1.5"
                  opacity={isSelected ? 0.7 : 0.5}
                  className="cursor-pointer transition-all duration-150"
                  onClick={() => togglePart(region.id)}
                  onMouseEnter={() => setHoveredPart(region.id)}
                  onMouseLeave={() => setHoveredPart(null)}
                />
              )
            })}

            {/* Head click region */}
            <circle
              cx="50" cy="18" r="13"
              fill={selected.includes('head') ? '#8FAF8F70' : hoveredPart === 'head' ? '#8FAF8F30' : 'transparent'}
              stroke={selected.includes('head') || hoveredPart === 'head' ? '#8FAF8F' : 'transparent'}
              strokeWidth="1.5"
              className="cursor-pointer transition-all duration-150"
              onClick={() => togglePart('neck')}
              onMouseEnter={() => setHoveredPart('head')}
              onMouseLeave={() => setHoveredPart(null)}
            />
          </svg>
        </div>

        {/* Selected body parts list */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-3">
            {BODY_PARTS.map(part => (
              <button
                key={part.id}
                onClick={() => {
                  const next = selected.includes(part.id)
                    ? selected.filter(s => s !== part.id)
                    : [...selected, part.id]
                  onChange(next)
                  if (!selected.includes(part.id)) setShowPosesSuggestion(part.id)
                  else setShowPosesSuggestion(null)
                }}
                className={`px-3 py-1.5 rounded-2xl text-xs font-medium border transition-all duration-200 min-h-[36px]
                  ${selected.includes(part.id)
                    ? 'bg-sage-100 text-sage-600 border-sage-300'
                    : 'bg-white/60 text-warm-400 border-sage-100'
                  }`}
              >
                {selected.includes(part.id) ? '✓ ' : ''}{part.label}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <p className="text-xs text-sage-500">
              已選：{selected.map(id => BODY_PARTS.find(b => b.id === id)?.label).filter(Boolean).join('、')}
            </p>
          )}
        </div>
      </div>

      {/* Pose suggestions based on selected body part */}
      <AnimatePresence>
        {showPosesSuggestion && suggestedPoses.length > 0 && selectedBodyPart && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="bg-sage-50/80 rounded-2xl p-3 border border-sage-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-sage-600">
                💚 適合{selectedBodyPart.label}的動作
              </p>
              <button
                onClick={() => setShowPosesSuggestion(null)}
                className="text-warm-300 text-xs"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {suggestedPoses.map(pose => (
                <div key={pose.id} className="bg-white/70 rounded-xl p-2.5 border border-white/80">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{pose.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-warm-600">{pose.name}</p>
                      <p className="text-[10px] text-warm-300">{pose.nameEn}</p>
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
