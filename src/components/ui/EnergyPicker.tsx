import { motion } from 'framer-motion'

const LEVELS = [
  { v: 1, label: '很低', base: 'bg-warm-50 text-warm-400 border-warm-100',   active: 'bg-warm-200 text-warm-600 border-warm-200' },
  { v: 2, label: '偏低', base: 'bg-beige-50 text-beige-400 border-beige-100', active: 'bg-beige-200 text-beige-600 border-beige-200' },
  { v: 3, label: '普通', base: 'bg-cream-100 text-warm-400 border-cream-200',  active: 'bg-cream-300 text-warm-600 border-cream-300' },
  { v: 4, label: '不錯', base: 'bg-sage-50 text-sage-400 border-sage-100',    active: 'bg-sage-200 text-sage-600 border-sage-200' },
  { v: 5, label: '很好', base: 'bg-sage-50 text-sage-500 border-sage-100',    active: 'bg-sage-300 text-sage-700 border-sage-300' },
]

interface EnergyPickerProps {
  value: number
  onChange: (v: number) => void
  label: string
}

export function EnergyPicker({ value, onChange, label }: EnergyPickerProps) {
  return (
    <div>
      <p className="text-[12px] text-warm-400 mb-2.5 font-medium">{label}</p>
      <div className="flex gap-1.5">
        {LEVELS.map((l) => (
          <motion.button
            key={l.v}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(l.v)}
            className={`flex-1 py-2.5 rounded-xl text-[11px] font-medium border transition-all duration-200
              ${value === l.v ? l.active + ' shadow-soft' : l.base}
            `}
          >
            <div className="text-[15px] leading-none mb-1 font-mono text-center opacity-60">
              {['', '1', '2', '3', '4', '5'][l.v]}
            </div>
            {l.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
