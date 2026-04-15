import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AvatarDisplay } from '../components/avatar/AvatarDisplay'
import { Card } from '../components/ui/Card'
import { DailyCard } from '../components/ui/DailyCard'
import { PageTransition, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'
import { useAppStore } from '../store/useAppStore'
import { useLogStore } from '../store/useLogStore'
import { getStageInfo, calculateStreak } from '../utils/xp'
import { getWeeklyStats, getMonthlyStats } from '../utils/insights'
import { getTimeOfDay } from '../utils/date'
import { GREETING_MESSAGES, DAILY_SUGGESTIONS } from '../data/messages'
import { STAGES } from '../data/avatars'
import type { SpecialStateType } from '../types'

const SPECIAL_STATE_LABELS: Record<SpecialStateType, { label: string; emoji: string; active: string }> = {
  menstrual:  { label: '生理期',   emoji: '🌸', active: 'bg-blush-50 text-blush-500 border-blush-200' },
  cold:       { label: '感冒中',   emoji: '🤧', active: 'bg-beige-50 text-beige-600 border-beige-200' },
  fatigue:    { label: '疲勞',     emoji: '😴', active: 'bg-warm-50 text-warm-500 border-warm-200' },
  poor_sleep: { label: '睡眠不足', emoji: '🌙', active: 'bg-warm-50 text-warm-500 border-warm-200' },
}
const ALL_STATES: SpecialStateType[] = ['menstrual', 'cold', 'fatigue', 'poor_sleep']

function getGreeting(name: string): string {
  const msgs = GREETING_MESSAGES[getTimeOfDay()]
  return msgs[Math.floor(Math.random() * msgs.length)] + (name || '練習者')
}

function getSuggestion(streak: number, daysSince: number): string {
  let cat = getTimeOfDay() === 'morning' ? 'morning' : (getTimeOfDay() === 'evening' || getTimeOfDay() === 'night') ? 'evening' : 'afternoon'
  if (daysSince >= 7) cat = 'return'
  else if (streak >= 3) cat = 'streak'
  const set = DAILY_SUGGESTIONS.find(s => s.condition === cat) ?? DAILY_SUGGESTIONS[1]
  return set.messages[Math.floor(Math.random() * set.messages.length)]
}

export function Home() {
  const navigate = useNavigate()
  const { settings, avatarState, loadAvatarState, todaySpecialState, loadTodaySpecialState, setTodaySpecialState, clearTodaySpecialState } = useAppStore()
  const { logs, loadLogs } = useLogStore()
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => { loadAvatarState(); loadLogs(); loadTodaySpecialState(today) }, [])

  const { stage, next, progress } = getStageInfo(avatarState.xp)
  const stageDef = STAGES.find(s => s.id === stage.id)!
  const streak    = calculateStreak(logs)
  // Estimate days to next stage (~12 XP per practice day)
  const daysToNext = next ? Math.ceil((next.minXp - avatarState.xp) / 12) : 0
  const weekly    = getWeeklyStats(logs)
  const monthly   = getMonthlyStats(logs)
  const daysSince = logs[0]?.date
    ? Math.round((Date.now() - new Date(logs[0].date + 'T00:00:00').getTime()) / 86400000)
    : 999

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-28">
      {/* Very subtle background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-sage-50 opacity-40" />
      </div>

      <div className="relative px-4 pt-safe">

        {/* ── PAGE HEADER ─────────────────────────────────────── */}
        <div className="pt-8 pb-4 flex items-start justify-between">
          <div>
            <p className="text-xs text-warm-300 mb-1 tracking-wide">
              {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </p>
            <motion.h1
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-[19px] font-display font-semibold text-warm-700 leading-snug"
            >
              {getGreeting(settings.nickname)}
            </motion.h1>
          </div>
          {/* Avatar badge */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/settings')}
            className="relative flex-shrink-0 mt-1"
          >
            <AvatarDisplay avatarId={settings.avatar} size={48} idle />
            <div className="absolute -bottom-0.5 -right-0.5 bg-sage-400 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none">
              {stageDef.name}
            </div>
          </motion.button>
        </div>

        {/* ── XP BAR ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-4"
        >
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] text-warm-400">{stage.name}</span>
            <span className="text-[11px] text-warm-300">
              {avatarState.xp} XP
              {next ? ` · 還需 ${daysToNext} 天升階` : ' · 已達最高段位'}
            </span>
          </div>
          <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-400"
            />
          </div>
        </motion.div>

        {/* ── DAILY CARD ──────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <DailyCard />
        </motion.div>

        {/* ── SPECIAL STATES ──────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }} className="mt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-warm-300 mr-0.5">今日狀態</span>
            {ALL_STATES.map(s => {
              const info = SPECIAL_STATE_LABELS[s]
              const isActive = todaySpecialState?.states.includes(s)
              return (
                <button
                  key={s}
                  onClick={async () => {
                    const cur = todaySpecialState?.states ?? []
                    const next = isActive ? cur.filter(x => x !== s) : [...cur, s]
                    if (next.length === 0) await clearTodaySpecialState(today)
                    else await setTodaySpecialState({ date: today, states: next, note: todaySpecialState?.note ?? '', updatedAt: new Date().toISOString() })
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium transition-all duration-200
                    ${isActive ? info.active : 'bg-white/70 text-warm-300 border-cream-200'}`}
                >
                  <span className="text-[13px]">{info.emoji}</span>
                  <span>{info.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ── STATS ROW ───────────────────────────────────────── */}
        <StaggerContainer className="grid grid-cols-3 gap-2.5 mt-4">
          {([
            { value: String(streak),          unit: '天',  label: '連續天數', color: 'text-sage-500' },
            { value: String(weekly.count),    unit: '次',  label: '本週練習', color: 'text-blush-400' },
            { value: String(monthly.minutes), unit: '分',  label: '本月時間', color: 'text-beige-500' },
          ] as const).map(({ value, unit, label, color }) => (
            <StaggerItem key={label}>
              <Card className="p-3 text-center">
                <p className={`text-xl font-display font-bold leading-none ${color}`}>
                  {value}<span className="text-sm font-medium ml-0.5">{unit}</span>
                </p>
                <p className="text-[10px] text-warm-300 mt-1.5">{label}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* ── WEEKLY CALENDAR ─────────────────────────────────── */}
        <Card animate className="mt-2.5 p-4" delay={0.28}>
          <p className="text-[11px] font-medium text-warm-400 mb-3">本週記錄</p>
          <div className="flex justify-between">
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date(Date.now() - (6 - i) * 86400000)
              const hasLog = logs.some(l => l.date === d.toISOString().split('T')[0])
              const isToday = i === 6
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className={`text-[10px] font-medium ${isToday ? 'text-sage-500' : 'text-warm-300'}`}>
                    {['日','一','二','三','四','五','六'][d.getDay()]}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all
                    ${hasLog ? 'bg-sage-400' : isToday ? 'border-2 border-sage-200 bg-transparent' : 'bg-cream-200'}`}>
                    {hasLog
                      ? <div className="w-2 h-2 rounded-full bg-white" />
                      : <span className={`text-[11px] ${isToday ? 'text-sage-400 font-semibold' : 'text-warm-300'}`}>{d.getDate()}</span>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* ── DAILY SUGGESTION ────────────────────────────────── */}
        <Card animate className="mt-2.5 px-4 py-3.5" delay={0.32}>
          <div className="flex gap-3 items-start">
            <div className="w-0.5 self-stretch rounded-full bg-sage-200 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-warm-300 uppercase tracking-wider mb-1.5">今日提示</p>
              <p className="text-[13px] text-warm-500 leading-relaxed">{getSuggestion(streak, daysSince)}</p>
            </div>
          </div>
        </Card>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="mt-4 flex gap-3"
        >
          {/* Primary: start log */}
          <button
            onClick={() => navigate('/log')}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-3xl bg-sage-400 text-white text-[15px] font-semibold shadow-soft active:scale-[0.97] transition-transform"
          >
            <PlusIcon />
            開始記錄
          </button>
          {/* Secondary: breathing */}
          <button
            onClick={() => navigate('/breathing')}
            className="w-[72px] flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-3xl bg-white border border-cream-200 shadow-soft text-warm-400 active:scale-[0.97] transition-transform"
          >
            <WindIcon />
            <span className="text-[11px] font-medium">呼吸</span>
          </button>
        </motion.div>

        {/* ── RECENT LOGS ─────────────────────────────────────── */}
        {logs.length > 0 ? (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-warm-600">最近練習</p>
              <button onClick={() => navigate('/timeline')} className="text-xs text-sage-500 font-medium">全部查看</button>
            </div>
            <StaggerContainer className="space-y-2">
              {logs.slice(0, 3).map(log => (
                <StaggerItem key={log.id}>
                  <Card className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Date badge */}
                      <div className="w-10 flex-shrink-0 text-center">
                        <p className="text-base font-bold text-warm-600 leading-none">
                          {new Date(log.date + 'T00:00:00').getDate()}
                        </p>
                        <p className="text-[10px] text-warm-300 mt-0.5 leading-none">
                          {new Date(log.date + 'T00:00:00').toLocaleDateString('zh-TW', { month: 'short' })}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-cream-200 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-warm-600 truncate">
                          {log.yogaTypes.join(' · ') || '自由練習'}
                        </p>
                        <p className="text-[11px] text-warm-300 mt-0.5">{log.durationMin} 分鐘</p>
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
        ) : (
          <Card animate className="mt-5 p-6 text-center" delay={0.4}>
            <div className="w-10 h-10 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-3">
              <PlusIcon className="text-sage-400" />
            </div>
            <p className="text-[14px] font-medium text-warm-600 mb-1">開始你的第一次記錄</p>
            <p className="text-[12px] text-warm-300">每一次練習，都是給自己的禮物</p>
          </Card>
        )}

      </div>
    </PageTransition>
  )
}

/* ─── Local icons ────────────────────────────────────────────────── */

function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function WindIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeLinecap="round">
      <path d="M3 10 C6 6, 16 6, 20 10" stroke="currentColor" strokeWidth={1.8} />
      <path d="M3 14 C6 10, 16 10, 20 14" stroke="currentColor" strokeWidth={1.5} opacity="0.65" />
      <path d="M3 18 C6 14, 16 14, 20 18" stroke="currentColor" strokeWidth={1.2} opacity="0.35" />
    </svg>
  )
}
