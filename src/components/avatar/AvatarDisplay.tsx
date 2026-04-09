import { motion } from 'framer-motion'
import { AvatarSVG } from './AvatarSVG'
import type { AvatarId } from '../../types'
import { AVATARS } from '../../data/avatars'

interface AvatarDisplayProps {
  avatarId: AvatarId
  size?: number
  idle?: boolean
  celebrate?: boolean
  showName?: boolean
  className?: string
}

export function AvatarDisplay({
  avatarId,
  size = 120,
  idle = true,
  celebrate = false,
  showName = false,
  className = '',
}: AvatarDisplayProps) {
  const def = AVATARS.find(a => a.id === avatarId)!

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.div
        animate={
          celebrate
            ? { rotate: [0, -10, 10, -8, 8, -5, 5, 0], y: [0, -10, 0] }
            : idle
            ? { y: [0, -6, 0] }
            : {}
        }
        transition={
          celebrate
            ? { duration: 0.8, ease: 'easeInOut' }
            : idle
            ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
        style={{ filter: `drop-shadow(0 8px 16px ${def.color}40)` }}
      >
        <AvatarSVG id={avatarId} size={size} />
      </motion.div>
      {showName && (
        <p className="mt-2 text-sm font-medium text-warm-500">{def.name} · {def.subtitle}</p>
      )}
    </div>
  )
}
