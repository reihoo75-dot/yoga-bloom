import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AvatarDisplay } from '../components/avatar/AvatarDisplay'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageTransition, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'
import { useAppStore } from '../store/useAppStore'
import { useLogStore } from '../store/useLogStore'
import { getStageInfo, calculateStreak } from '../utils/xp'
import { getWeeklyStats, getMonthlyStats } from '../utils/insights'
import { getTimeOfDay, formatDuration } from '../utils/date'
import { GREETING_MESSAGES, DAILY_SUGGESTIONS } from '../data/messages'
import { STAGES } from '../data/avatars'

function getGreeting(name: string): string {
  const tod = getTimeOfDay()
  const msgs = GREETING_MESSAGES[tod]
  const prefix = msgs[Math.floor(Math.random() * msgs.length)]
  return `${prefix}${name || '練習者'} 🌿`
}

function getDailySuggestion(streak: number, daysSinceLastLog: number): string {
  let category = 'afternoon'
  const tod = getTimeOfDay()
  if (tod === 'morning') category = 'morning'
  else if (tod === 'evening' || tod === 'night') category = 'evening'

  if (daysSinceLastLog >= 7) category = 'return'
  else if (streak >= 3) category = 'streak'

  const set = DAILY_SUGGESTIONS.find(s => s.condition === category)
    ?? DAILY_SUGGESTIONS[1]
  return set.messages[Math.floor(Math.random() * set.messages.length)]
}

export function Home() {
  const navigate = useNavigate()
  const { settings, avatarState, loadAvatarState } = useAppStore()
  const { logs, loadLogs } = useLogStore()

  useEffect(() => {
    loadAvatarState()
    loadLogs()
  }, [])

  const { stage, next, progress } = getStageInfo(avatarState.xp)
  const stageDef = STAGES.find(s => s.id === stage.id)!
  const streak = calculateStreak(logs)
  const weekly = getWeeklyStats(logs)
  const monthly = getMonthlyStats(logs)

  const lastLogDate = logs[0]?.date
  const daysSinceLast = lastLogDate
    ? Math.round((Date.now() - new Date(lastLogDate + 'T00:00:00').getTime()) / 86400000)
    : 999

  const greeting = getGreeting(settings.nickname)
  const suggestion = getDailySuggestion(streak, daysSinceLast)

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-24">
      {/* Layered background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-sage-50 opacity-70" />
        <div className="absolute top-40 -left-16 w-48 h-48 rounded-full bg-blush-50 opacity-60" />
        <div className="absolute bottom-40 right-4 w-36 h-36 rounded-full bg-beige-50 opacity-50" />
      </div>

      <div className="relative px-5 pt-safe">
        {/* Header */}
        <div className="pt-8 pb-2">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-warm-400 text-sm"
          >
            {new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-display font-semibold text-warm-600 mt-1"
          >
            {greeting}
          </motion.h1>
        </div>

        {/* Avatar + XP card */}
        <Card animate className="mt-4 p-5 overflow-hidden relative" delay={0.1}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
            style={{ background: `radial-gradient(circle, ${STAGES.find(s => s.id === avatarState.stage)?.name === '種子' ? '#8FAF8F' : '#EDB0B8'}, transparent)`, transform: 'translate(30%, -30%)' }}
          />
          <div className="flex items-center gap-4">
            <div className="relative">
              <AvatarDisplay avatarId={settings.avatar} size={80} idle />
              <div className="absolute -bottom-1 -right-1 bg-sage-400 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-soft">
                {stageDef.name}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-warm-600">{stageDef.name}</span>
                <span className="text-xs text-warm-400">{avatarState.xp} XP</span>
              </div>
              <div className="h-2.5 bg-cream-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-400"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-warm-300">{stage.name}</span>
                {next && <span className="text-xs text-warm-300">{next.name} {next.minXp} XP</span>}
              </div>
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-warm-400">🍃 {avatarState.resources.leaves}</span>
                <span className="text-xs text-warm-400">⭐ {avatarState.resources.stars}</span>
                <span className="text-xs text-warm-400">🌸 {avatarState.resources.petals}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Daily suggestion */}
        <Card animate className="mt-3 p-4" delay={0.2}>
          <div className="flex gap-3 items-start">
            <span className="text-2xl mt-0.5">💬</span>
            <div>
              <p className="text-xs text-warm-300 mb-1">今日提示</p>
              <p className="text-sm text-warm-500 leading-relaxed">{suggestion}</p>
            </div>
          </div>
        </Card>

        {/* Stats row */}
        <StaggerContainer className="grid grid-cols-3 gap-3 mt-3">
          <StaggerItem>
            <Card className="p-3 text-center">
              <p className="text-2xl font-display font-semibold text-sage-500">{streak}</p>
              <p className="text-xs text-warm-300 mt-0.5">連續天數</p>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="p-3 text-center">
              <p className="text-2xl font-display font-semibold text-blush-400">{weekly.count}</p>
              <p className="text-xs text-warm-300 mt-0.5">本週練習</p>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="p-3 text-center">
              <p className="text-lg font-display font-semibold text-beige-400">{formatDuration(monthly.minutes)}</p>
              <p className="text-xs text-warm-300 mt-0.5">本月分鐘</p>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        {/* Weekly mini calendar */}
        <Card animate className="mt-3 p-4" delay={0.35}>
          <p className="text-xs text-warm-400 mb-3">本週練習</p>
          <div className="flex justify-between">
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date(Date.now() - (6 - i) * 86400000)
              const dateStr = d.toISOString().split('T')[0]
              const hasLog = logs.some(l => l.date === dateStr)
              const isToday = i === 6
              const weekdays = ['日', '一', '二', '三', '四', '五', '六']
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className={`text-xs ${isToday ? 'text-sage-500 font-medium' : 'text-warm-300'}`}>
                    {weekdays[d.getDay()]}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all
                    ${hasLog ? 'bg-sage-400 shadow-glow' : isToday ? 'bg-cream-200 border border-sage-200' : 'bg-cream-200'}
                  `}>
                    {hasLog ? <span className="text-white text-sm">🌸</span>
                      : <span className="text-warm-200 text-xs">{d.getDate()}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5"
        >
          <Button size="lg" fullWidth onClick={() => navigate('/log')} className="shadow-soft-lg">
            <span className="text-lg">🧘</span>
            開始記錄
          </Button>
        </motion.div>

        {/* Recent logs */}
        {logs.length > 0 && (
          <div className="mt-5">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-warm-500">最近練習</p>
              <button onClick={() => navigate('/timeline')} className="text-xs text-sage-500">查看全部</button>
            </div>
            <StaggerContainer className="space-y-2">
              {logs.slice(0, 3).map((log, idx) => (
                <StaggerItem key={log.id}>
                  <Card className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sage-50 flex items-center justify-center text-lg">
                        {log.yogaTypes[0] === 'yin' ? '🌙' : log.yogaTypes[0] === 'restorative' ? '🛋️' : '🧘'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-warm-600 truncate">
                          {log.yogaTypes.join('・') || '練習'}
                        </p>
                        <p className="text-xs text-warm-300">{log.date} · {log.durationMin} 分鐘</p>
                      </div>
                      {log.isFavorite && <span className="text-blush-400">♥</span>}
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {logs.length === 0 && (
          <Card animate className="mt-4 p-6 text-center" delay={0.5}>
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-warm-500 font-medium mb-1">開始你的第一次記錄</p>
            <p className="text-warm-300 text-sm">每一次練習，都是給自己的禮物</p>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
