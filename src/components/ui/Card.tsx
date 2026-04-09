import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  animate?: boolean
  delay?: number
}

export function Card({ children, className = '', onClick, animate = false, delay = 0 }: CardProps) {
  const base = `bg-white/70 backdrop-blur-sm rounded-3xl shadow-soft border border-white/80 ${className}`

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={onClick}
        className={base}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div onClick={onClick} className={base}>
      {children}
    </div>
  )
}

export function SoftCard({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-cream-100 rounded-3xl border border-cream-200 ${className}`}
    >
      {children}
    </div>
  )
}
