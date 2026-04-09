import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AvatarDisplay } from '../components/avatar/AvatarDisplay'
import { Button } from '../components/ui/Button'
import { useAppStore } from '../store/useAppStore'
import { getStageInfo } from '../utils/xp'
import { COMPLETION_MESSAGES } from '../data/messages'
import { STAGES } from '../data/avatars'
import type { YogaLog } from '../types'

interface Particle {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  emoji: string
  size: number
  delay: number
}

const PARTICLE_EMOJIS = ['🌸', '✨', '🌿', '⭐', '🌱', '💫', '🍃', '🌺']

function createParticles(count = 16): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 40,
    y: 40 + (Math.random() - 0.5) * 30,
    tx: (Math.random() - 0.5) * 200,
    ty: -(Math.random() * 180 + 60),
    emoji: PARTICLE_EMOJIS[i % PARTICLE_EMOJIS.length],
    size: Math.random() * 10 + 16,
    delay: Math.random() * 0.6,
  }))
}

export function CompletionScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { settings, avatarState, pendingXP, clearPendingXP } = useAppStore()

  const state = location.state as { log: YogaLog; xp: number } | null
  const xpGained = state?.xp ?? pendingXP ?? 10
  const [particles] = useState(createParticles)
  const [showXP, setShowXP] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [message] = useState(() =>
    COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)]
  )
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    setTimeout(() => setCelebrate(true), 300)
    setTimeout(() => setShowXP(true), 600)
    setTimeout(() => setShowMessage(true), 1000)

    return () => { clearPendingXP() }
  }, [])

  const { stage, progress } = getStageInfo(avatarState.xp)
  const prevProgress = getStageInfo(Math.max(0, avatarState.xp - xpGained)).progress

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 via-cream-100 to-blush-50 flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0, x: `${p.x}vw`, y: `${p.y}vh` }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5], x: `calc(${p.x}vw + ${p.tx}px)`, y: `calc(${p.y}vh + ${p.ty}px)` }}
              transition={{ duration: 2 + Math.random(), delay: p.delay + 0.3, ease: 'easeOut' }}
              style={{ position: 'fixed', fontSize: p.size }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-4xl shadow-soft-xl border border-white/90 p-7 text-center"
      >
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <motion.div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{ background: `radial-gradient(circle, ${getAvatarBg(settings.avatar)}, transparent)` }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <AvatarDisplay
                avatarId={settings.avatar}
                size={100}
                celebrate={celebrate}
                idle={false}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-display font-semibold text-warm-600 mb-1">
            練習完成 🌸
          </h2>
          <p className="text-warm-400 text-sm">{STAGES.find(s => s.id === stage.id)?.description}</p>
        </motion.div>

        {/* XP gained */}
        <AnimatePresence>
          {showXP && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              className="my-4"
            >
              <div className="inline-flex items-center gap-2 bg-sage-50 border border-sage-200 rounded-2xl px-4 py-2">
                <span className="text-2xl">✨</span>
                <span className="font-display font-semibold text-sage-500 text-xl">+{xpGained} XP</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* XP bar */}
        {showXP && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <div className="flex justify-between text-xs text-warm-400 mb-1">
              <span>{stage.name}</span>
              <span>{avatarState.xp} XP</span>
            </div>
            <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: `${prevProgress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-500"
              />
            </div>
          </motion.div>
        )}

        {/* Message */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-cream-50 rounded-2xl p-4 mb-5"
            >
              <p className="text-sm text-warm-500 leading-relaxed">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats summary */}
        {state?.log && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-3 gap-2 mb-5"
          >
            <div className="bg-cream-50 rounded-2xl p-2">
              <p className="text-xs text-warm-300">時長</p>
              <p className="text-sm font-medium text-warm-500">{state.log.durationMin}分</p>
            </div>
            <div className="bg-cream-50 rounded-2xl p-2">
              <p className="text-xs text-warm-300">完成度</p>
              <p className="text-sm font-medium text-warm-500">{state.log.completionLevel}%</p>
            </div>
            <div className="bg-cream-50 rounded-2xl p-2">
              <p className="text-xs text-warm-300">能量變化</p>
              <p className="text-sm font-medium text-warm-500">
                {state.log.energyBefore}→{state.log.energyAfter}
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <Button fullWidth size="lg" onClick={() => navigate('/')}>
            回到首頁 🏡
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

function getAvatarBg(avatarId: string): string {
  const map: Record<string, string> = {
    capybara: '#F5EDE0',
    deer: '#FDF0E4',
    fox: '#FFF0E4',
    cat: '#F5EDE8',
    seal: '#E8F2F5',
    bunny: '#F8F0F4',
  }
  return map[avatarId] ?? '#F5EDE0'
}
