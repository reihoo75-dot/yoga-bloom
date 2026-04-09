import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CustomTagInputProps {
  onAdd: (value: string) => void
  placeholder?: string
  existingCustom?: string[]
  color?: 'sage' | 'blush' | 'beige'
}

export function CustomTagInput({
  onAdd,
  placeholder = '自訂新增...',
  existingCustom = [],
  color = 'sage',
}: CustomTagInputProps) {
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const colorMap = {
    sage: 'border-sage-200 bg-sage-50 text-sage-600 placeholder-sage-300 focus:border-sage-400',
    blush: 'border-blush-200 bg-blush-50 text-blush-600 placeholder-blush-300 focus:border-blush-400',
    beige: 'border-beige-200 bg-beige-50 text-beige-600 placeholder-beige-300 focus:border-beige-400',
  }

  const btnColorMap = {
    sage: 'bg-sage-400 text-white',
    blush: 'bg-blush-300 text-white',
    beige: 'bg-beige-400 text-white',
  }

  function handleAdd() {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
    setIsOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
    if (e.key === 'Escape') {
      setIsOpen(false)
      setValue('')
    }
  }

  return (
    <div>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex gap-2 items-center"
          >
            <input
              autoFocus
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={20}
              className={`flex-1 px-3 py-2 rounded-2xl text-sm border transition-colors outline-none ${colorMap[color]}`}
            />
            <button
              onClick={handleAdd}
              disabled={!value.trim()}
              className={`px-3 py-2 rounded-2xl text-sm font-medium transition-opacity ${btnColorMap[color]} ${!value.trim() ? 'opacity-40' : ''}`}
            >
              新增
            </button>
            <button
              onClick={() => { setIsOpen(false); setValue('') }}
              className="text-warm-300 text-sm px-2"
            >
              取消
            </button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs text-warm-400 border border-dashed border-warm-200 hover:border-sage-300 hover:text-sage-500 transition-colors min-h-[36px]"
          >
            <span className="text-base leading-none">+</span>
            自訂新增
          </motion.button>
        )}
      </AnimatePresence>

      {/* Show existing custom tags as chips (not interactive, just display) */}
      {existingCustom.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {existingCustom.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-warm-50 text-warm-400 border border-warm-100">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
