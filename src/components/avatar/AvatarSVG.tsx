import type { AvatarId, StageId } from '../../types'

interface AvatarSVGProps {
  id: AvatarId
  size?: number
  stage?: StageId
  className?: string
}

export function AvatarSVG({ id, size = 120, stage = 1, className = '' }: AvatarSVGProps) {
  const src = `/images/avatars/avatar_${id}_${stage}.png`

  return (
    <div className={className} style={{ width: size, height: size }}>
      <img
        src={src}
        alt={id}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    </div>
  )
}
