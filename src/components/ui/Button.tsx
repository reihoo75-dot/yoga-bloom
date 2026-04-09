import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const variants = {
    primary: 'bg-sage-400 text-white hover:bg-sage-500 shadow-soft active:shadow-none',
    secondary: 'bg-white/80 text-warm-600 border border-sage-200 hover:bg-sage-50',
    ghost: 'bg-transparent text-warm-500 hover:bg-warm-50',
    danger: 'bg-red-400 text-white hover:bg-red-500',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-2xl min-h-[36px]',
    md: 'px-6 py-3 text-base rounded-2xl min-h-[48px]',
    lg: 'px-8 py-4 text-lg rounded-3xl min-h-[56px]',
  }

  return (
    <motion.button
      type={type}
      whileTap={disabled ? {} : { scale: 0.96 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200 select-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}
