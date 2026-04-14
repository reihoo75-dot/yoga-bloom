import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AvatarDisplay } from '../components/avatar/AvatarDisplay'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { DailyCard } from '../components/ui/DailyCard'
import { PageTransition, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'
import { useAppStore } from '../store/useAppStore'
import { useLogStore } from '../store/useLogStore'
import { getStageInfo, calculateStreak } from '../utils/xp'
import { getWeeklyStats, getMonthlyStats } from '../utils/insights'
import { getTimeOfDay, formatDuration } from '../utils/date'
import { GREETING_MESSAGES, DAILY_SUGGESTIONS } from '../data/messages'
import { STAGES } from '../data/avatars'
import type { SpecialStateType } from '../types'

const SPECIAL_STATE_LABELS: Record<SpecialStateType, { label: string; emoji: string; color: string }> = {
  menstrual: { label: '生理期', emoji: '🌸', color: 'bg-blush-50 text-blush-500 border-blush-200' },
  cold:      { label: '感冒中', emoji: '🤧', color: 'bg-beige-50 text-beige-600 border-beige-200' },
  fatigue:   { label: '疲勞',   emoji: '😴', color: 'bg-cream-100 text-warm-400 border-cream-300' },
  poor_sleep:{ label: '睡眠不足', emoji: '🌙', color: 'bg-cream-100 text-warm-400 border-cream-300' },
}

const ALL_SPECIAL_STATES: SpecialStateType[] = ['menstrual', 'cold', 'fatigue', 'poor_sleep']

function getGreeting(name: string): string {
  const tod = getTimeOfDay()
  const msgs = GREETING_MESSAGES[tod]
  const prefix = msgs[Math.floor(Math.random() * msgs.length)]
  return `${prefix}${name || '練習者'}`
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
  const { settings, avatarState, loadAvatarState, todaySpecialState, loadTodaySpecialState, setTodaySpecialState, clearTodaySpecialState } = useAppStore()
  const { logs, loadLogs } = useLogStore()
  const [showStatePanel, setShowStatePanel] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    loadAvatarState()
    loadLogs()
    loadTodaySpecialState(today)
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
      {/* Subtle background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-sage-50 opacity-50" />
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
        <Card animate className="mt-4 p-5" delay={0.1}>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <AvatarDisplay avatarId={settings.avatar} size={72} idle />
              <div className="absolute -bottom-1 -right-1 bg-sage-400 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                {stageDef.name}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-semibold text-warm-600">{settings.nickname || '練習者'}</span>
                <span className="text-xs text-warm-300">{avatarState.xp} XP</span>
              </div>
              <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-400"
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-warm-300">{stage.name}</span>
                {next && <span className="text-[10px] text-warm-300">下一階段 {next.minXp} XP</span>}
              </div>
            </div>
          </div>
        </Card>

        {/* Daily intention card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3"
        >
          <DailyCard />
        </motion.div>

        {/* Special state chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-3"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-warm-300">今日狀態</span>
            {ALL_SPECIAL_STATES.map(s => {
              const info = SPECIAL_STATE_LABELS[s]
              const active = todaySpecialState?.states.includes(s)
              return (
                <button
                  key={s}
                  onClick={async () => {
                    const currentStates = todaySpecialState?.states ?? []
                    const next = active
                      ? currentStates.filter(x => x !== s)
                      : [...currentStates, s]
                    if (next.length === 0) {
                      await clearTodaySpecialState(today)
                    } else {
                      await setTodaySpecialState({
                        date: today,
                        states: next,
                        note: todaySpecialState?.note ?? '',
                        updatedAt: new Date().toISOString(),
                      })
                    }
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs transition-all duration-200
                    ${active ? info.color : 'bg-white text-warm-300 border-cream-200'}`}
                >
                  <span>{info.emoji}</span>
                  <span>{info.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Daily suggestion */}
        <Card animate className="mt-3 p-4" delay={0.3}>
          <div className="flex gap-3 items-start">
            <div className="w-0.5 self-stretch bg-sage-200 rounded-full flex-shrink-0" />
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
              <p className="text-xs text-warm-300 mt-0.5">本月時間</p>
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
                    ${hasLog ? 'bg-sage-400' : isToday ? 'bg-cream-200 border border-sage-200' : 'bg-cream-200'}
                  `}>
                    {hasLog
                      ? <div className="w-2 h-2 rounded-full bg-white" />
                      : <span className="text-warm-200 text-xs">{d.getDate()}</span>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Dual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 flex gap-3"
        >
          <Button size="lg" fullWidth onClick={() => navigate('/log')} className="flex-1">
            開始記錄
          </Button>
          <button
            onClick={() => navigate('/breathing')}
            className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-5 py-3 rounded-3xl bg-white border border-cream-200 shadow-soft text-warm-500 text-xs font-medium active:scale-95 transition-transform"
          >
            <BreathIcon />
            <span>呼吸</span>
          </button>
        </motion.div>

        {/* Recent logs */}
        {logs.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-warm-500">最近練習</p>
              <button onClick={() => navigate('/timeline')} className="text-xs text-sage-500">查看全部</button>
            </div>
            <StaggerContainer className="space-y-2">
              {logs.slice(0, 3).map((log, idx) => (
                <StaggerItem key={log.id}>
                  <Card className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-sage-500">
                          {new Date(log.date + 'T00:00:00').getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-warm-600 truncate">
                          {log.yogaTypes.join(' · ') || '自由練習'}
                        </p>
                        <p className="text-xs text-warm-300 mt-0.5">{log.durationMin} 分鐘</p>
                      </div>
                      {log.isFavorite && (
                        <svg className="w-4 h-4 text-blush-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      )}
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {logs.length === 0 && (
          <Card animate className="mt-4 p-6 text-center" delay={0.5}>
            <div className="w-12 h-12 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-warm-500 font-medium mb-1">開始你的第一次記錄</p>
            <p className="text-warm-300 text-sm">每一次練習，都是給自己的禮物</p>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}

function BreathIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41" />
    </svg>
  )
}
