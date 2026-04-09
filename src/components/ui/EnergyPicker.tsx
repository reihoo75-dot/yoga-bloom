import { motion } from 'framer-motion'

const LEVELS = [
  { v: 1, label: '很低', color: 'bg-red-200 text-red-600', selectedColor: 'bg-red-400 text-white' },
  { v: 2, label: '偏低', color: 'bg-orange-200 text-orange-600', selectedColor: 'bg-orange-400 text-white' },
  { v: 3, label: '普通', color: 'bg-beige-200 text-warm-600', selectedColor: 'bg-beige-400 text-warm-700' },
  { v: 4, label: '不錯', color: 'bg-sage-100 text-sage-600', selectedColor: 'bg-sage-400 text-white' },
  { v: 5, label: '超棒', color: 'bg-sage-200 text-sage-700', selectedColor: 'bg-sage-500 text-white' },
]

interface EnergyPickerProps {
  value: number
  onChange: (v: number) => void
  label: string
}

export function EnergyPicker({ value, onChange, label }: EnergyPickerProps) {
  return (
    <div>
      <p className="text-sm text-warm-400 mb-2">{label}</p>
      <div className="flex gap-2">
        {LEVELS.map((l) => (
          <motion.button
            key={l.v}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(l.v)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200
              ${value === l.v ? l.selectedColor + ' shadow-soft scale-105' : l.color}
            `}
          >
            <div className="text-lg leading-none mb-0.5">
              {['', '😩', '😕', '😐', '😊', '🤩'][l.v]}
            </div>
            {l.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
