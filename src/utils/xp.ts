import type { YogaLog, AvatarState } from '../types'
import { STAGES } from '../data/avatars'

export function calculateXP(log: Partial<YogaLog>): {
  base: number
  duration: number
  note: number
  total: number
} {
  const base = 10
  const duration = (log.durationMin ?? 0) >= 45 ? 5 : 0
  const note = (log.note ?? '').trim().length > 0 ? 3 : 0
  return { base, duration, note, total: base + duration + note }
}

export function calculateResources(log: Partial<YogaLog>): {
  leaves: number
  stars: number
  petals: number
} {
  // 葉子：穩定（連續練習）
  const leaves = 1
  // 星星：覺察（filled body signals or emotions)
  const stars = (log.bodySignals?.length ?? 0) + (log.emotions?.length ?? 0) > 3 ? 2 : 1
  // 花瓣：品質（completion level >= 80）
  const petals = (log.completionLevel ?? 0) >= 80 ? 2 : 1
  return { leaves, stars, petals }
}

export function getStageInfo(xp: number) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (xp >= STAGES[i].minXp) {
      const stage = STAGES[i]
      const next = STAGES[i + 1]
      const progress = next
        ? ((xp - stage.minXp) / (next.minXp - stage.minXp)) * 100
        : 100
      return { stage, next, progress: Math.min(100, progress) }
    }
  }
  return { stage: STAGES[0], next: STAGES[1], progress: 0 }
}

export function checkNewBadges(
  state: AvatarState,
  logs: YogaLog[]
): string[] {
  const earned: string[] = []
  const existing = new Set(state.badges)

  const check = (badge: string, condition: boolean) => {
    if (condition && !existing.has(badge as never)) earned.push(badge)
  }

  check('first_log', logs.length >= 1)
  check('logs_10', logs.length >= 10)
  check('logs_50', logs.length >= 50)
  check('logs_100', logs.length >= 100)
  check('minutes_500', state.totalMinutes >= 500)
  check('minutes_1000', state.totalMinutes >= 1000)

  // Streak calculation
  const streak = calculateStreak(logs)
  check('streak_7', streak >= 7)
  check('streak_30', streak >= 30)

  // All types
  const allTypes = new Set(logs.flatMap((l) => l.yogaTypes))
  check('all_types', allTypes.size >= 8)

  // Locations
  const allLocations = new Set(logs.map((l) => l.location))
  check('explorer', allLocations.size >= 5)

  // Time-based
  const hasNightOwl = logs.some((l) => {
    const h = parseInt(l.startTime.split(':')[0])
    return h >= 21
  })
  check('night_owl', hasNightOwl)

  const hasEarlyBird = logs.some((l) => {
    const h = parseInt(l.startTime.split(':')[0])
    return h < 6
  })
  check('early_bird', hasEarlyBird)

  return earned
}

export function calculateStreak(logs: YogaLog[]): number {
  if (!logs.length) return 0
  const dates = [...new Set(logs.map((l) => l.date))].sort().reverse()
  if (!dates.length) return 0

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (dates[0] !== today && dates[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000)
    if (diff === 1) streak++
    else break
  }
  return streak
}
