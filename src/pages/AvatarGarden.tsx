import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AvatarDisplay } from '../components/avatar/AvatarDisplay'
import { Card } from '../components/ui/Card'
import { PageTransition, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'
import { useAppStore } from '../store/useAppStore'
import { useLogStore } from '../store/useLogStore'
import { getStageInfo } from '../utils/xp'
import { calculateStreak } from '../utils/xp'
import { AVATARS, STAGES, BADGES } from '../data/avatars'
import { formatDuration } from '../utils/date'
import type { BadgeId } from '../types'

export function AvatarGarden() {
  const { settings, avatarState, loadAvatarState } = useAppStore()
  const { logs, loadLogs } = useLogStore()

  useEffect(() => {
    loadAvatarState()
    loadLogs()
  }, [])

  const avatarDef = AVATARS.find(a => a.id === settings.avatar)!
  const { stage, next, progress } = getStageInfo(avatarState.xp)
  const stageDef = STAGES.find(s => s.id === stage.id)!
  const streak = calculateStreak(logs)

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-24">
      {/* Layered bg */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${avatarDef.bgColor}, transparent)` }}
        />
      </div>

      <div className="px-5 pt-safe relative">
        {/* Header */}
        <div className="pt-8 pb-4 text-center">
          <h1 className="font-display font-semibold text-warm-600 text-lg">我的花園</h1>
          <p className="text-warm-300 text-sm mt-1">與{avatarDef.name}一起成長的空間</p>
        </div>

        {/* Main avatar card */}
        <Card animate className="p-6 text-center overflow-hidden relative" delay={0.05}>
          {/* Background ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-dashed opacity-10"
            style={{ borderColor: avatarDef.color }}
          />

          <div className="relative">
            <AvatarDisplay
              avatarId={settings.avatar}
              size={130}
              idle
              showName={false}
            />
          </div>

          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <h2 className="text-2xl font-display font-bold mt-3" style={{ color: avatarDef.color }}>
              {avatarDef.name}
            </h2>
            <p className="text-warm-400 text-sm mt-0.5">{avatarDef.subtitle}</p>
            <p className="text-warm-300 text-xs mt-2 max-w-[240px] mx-auto leading-relaxed">
              {avatarDef.emotionalTone}
            </p>
          </motion.div>

          {/* Stage badge */}
          <div className="inline-flex items-center gap-2 mt-4 bg-sage-50 rounded-full px-4 py-1.5">
            <span className="text-sm font-medium text-sage-600">{stageDef.name}</span>
            <span className="text-warm-300">·</span>
            <span className="text-xs text-warm-400">{avatarState.xp} XP</span>
          </div>

          {/* XP progress */}
          <div className="mt-4 px-4">
            <div className="flex justify-between text-xs text-warm-400 mb-1.5">
              <span>{stage.name}</span>
              {next && <span>{next.name} · {next.minXp} XP</span>}
            </div>
            <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-500 relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: ['0%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
            <p className="text-xs text-center text-warm-300 mt-1">{stageDef.description}</p>
          </div>
        </Card>

        {/* Resources */}
        <StaggerContainer className="grid grid-cols-3 gap-3 mt-3">
          <StaggerItem>
            <ResourceCard icon="🍃" label="葉子" value={avatarState.resources.leaves} desc="穩定" />
          </StaggerItem>
          <StaggerItem>
            <ResourceCard icon="⭐" label="星星" value={avatarState.resources.stars} desc="覺察" />
          </StaggerItem>
          <StaggerItem>
            <ResourceCard icon="🌸" label="花瓣" value={avatarState.resources.petals} desc="品質" />
          </StaggerItem>
        </StaggerContainer>

        {/* Stats */}
        <Card animate className="mt-3 p-4" delay={0.2}>
          <p className="text-xs font-medium text-warm-400 mb-3">練習統計</p>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <StatRow icon="🧘" label="總練習次數" value={`${avatarState.totalLogs} 次`} />
            <StatRow icon="⏱️" label="總練習時間" value={formatDuration(avatarState.totalMinutes)} />
            <StatRow icon="🔥" label="當前連續" value={`${streak} 天`} />
            <StatRow icon="✨" label="累積 XP" value={`${avatarState.xp} 點`} />
          </div>
        </Card>

        {/* Stages roadmap */}
        <Card animate className="mt-3 p-4" delay={0.25}>
          <p className="text-xs font-medium text-warm-400 mb-3">成長路徑</p>
          <div className="space-y-2">
            {STAGES.map((s, i) => {
              const isReached = avatarState.stage >= s.id
              const isCurrent = avatarState.stage === s.id
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all
                    ${isCurrent ? 'bg-sage-50 border border-sage-200' : isReached ? 'bg-cream-50' : 'opacity-50'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold
                    ${isReached ? 'bg-sage-400 text-white' : 'bg-cream-200 text-warm-300'}`}>
                    {s.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-warm-600">{s.name}</span>
                      {isCurrent && <span className="text-xs bg-sage-100 text-sage-600 px-1.5 py-0.5 rounded">目前</span>}
                    </div>
                    <p className="text-xs text-warm-300">{s.description}</p>
                  </div>
                  <span className="text-xs text-warm-300">{s.minXp} XP</span>
                </motion.div>
              )
            })}
          </div>
        </Card>

        {/* Badges */}
        <Card animate className="mt-3 p-4 mb-4" delay={0.3}>
          <p className="text-xs font-medium text-warm-400 mb-3">成就徽章</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(BADGES) as [BadgeId, typeof BADGES[BadgeId]][]).map(([id, badge]) => {
              const unlocked = avatarState.badges.includes(id)
              return (
                <motion.div
                  key={id}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-2xl text-center transition-all
                    ${unlocked ? 'bg-sage-50 border border-sage-200' : 'bg-cream-100 opacity-40'}`}
                >
                  <div className={`text-2xl mb-1 ${!unlocked && 'grayscale'}`}>{badge.icon}</div>
                  <p className="text-xs font-medium text-warm-600 leading-tight">{badge.name}</p>
                  <p className="text-[10px] text-warm-300 mt-0.5 leading-tight">{badge.description}</p>
                </motion.div>
              )
            })}
          </div>
        </Card>
      </div>
    </PageTransition>
  )
}

function ResourceCard({ icon, label, value, desc }: { icon: string; label: string; value: number; desc: string }) {
  return (
    <Card className="p-3 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xl font-display font-semibold text-warm-600">{value}</p>
      <p className="text-xs text-warm-400">{label}</p>
      <p className="text-[10px] text-warm-300">{desc}</p>
    </Card>
  )
}

function StatRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <div>
        <p className="text-xs text-warm-300">{label}</p>
        <p className="text-sm font-medium text-warm-600">{value}</p>
      </div>
    </div>
  )
}
