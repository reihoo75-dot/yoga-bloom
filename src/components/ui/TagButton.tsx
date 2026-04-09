import { motion } from 'framer-motion'

interface TagButtonProps {
  label: string
  icon?: string
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
  color?: 'sage' | 'blush' | 'beige'
}

export function TagButton({ label, icon, selected, onClick, size = 'md', color = 'sage' }: TagButtonProps) {
  const colorMap = {
    sage: selected
      ? 'bg-sage-400 text-white border-sage-400 shadow-glow'
      : 'bg-white/60 text-warm-500 border-sage-200 hover:border-sage-300',
    blush: selected
      ? 'bg-blush-400 text-white border-blush-400 shadow-glow-pink'
      : 'bg-white/60 text-warm-500 border-blush-200 hover:border-blush-300',
    beige: selected
      ? 'bg-beige-300 text-warm-600 border-beige-300'
      : 'bg-white/60 text-warm-500 border-beige-200',
  }

  const sizeMap = {
    sm: 'px-3 py-1.5 text-xs rounded-xl',
    md: 'px-4 py-2 text-sm rounded-2xl',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 border font-medium transition-all duration-200
        min-h-[40px] select-none
        ${sizeMap[size]}
        ${colorMap[color]}
      `}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      <span>{label}</span>
    </motion.button>
  )
}
