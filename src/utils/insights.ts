import type { YogaLog, InsightResult } from '../types'
import { calculateStreak } from './xp'

export function generateInsights(logs: YogaLog[]): InsightResult[] {
  const results: InsightResult[] = []
  if (!logs.length) return results

  // Shoulder/neck tightness
  const shoulderCount = logs.filter(l =>
    l.bodySignals.includes('shoulder_tight')
  ).length
  if (shoulderCount >= 3) {
    results.push({
      type: 'suggestion',
      icon: '🧘',
      message: `最近 ${shoulderCount} 次練習都出現肩頸緊繃，試試更多陰瑜伽或修復型練習，讓這個區域深度放鬆吧。`,
    })
  }

  // Fatigue
  const fatigueCount = logs.filter(l =>
    l.bodySignals.includes('fatigue') || l.emotions.includes('tired')
  ).length
  if (fatigueCount >= 3) {
    results.push({
      type: 'suggestion',
      icon: '💤',
      message: `你最近常感到疲累，身體在說需要修復。不妨試試瑜伽睡眠或修復型瑜伽，讓自己真正休息。`,
    })
  }

  // Long absence
  if (logs.length > 0) {
    const lastDate = new Date(logs[0].date)
    const today = new Date()
    const daysDiff = Math.round((today.getTime() - lastDate.getTime()) / 86400000)
    if (daysDiff >= 14) {
      results.push({
        type: 'suggestion',
        icon: '🌱',
        message: `好久沒練習了，已經 ${daysDiff} 天。不需要做太多，從 15 分鐘的輕柔伸展開始，讓身體重新記起這份感覺。`,
      })
    } else if (daysDiff >= 7) {
      results.push({
        type: 'suggestion',
        icon: '🌿',
        message: `已經 ${daysDiff} 天沒有練習了，想念那種練習後的輕盈感嗎？今天回來吧。`,
      })
    }
  }

  // Streak celebration
  const streak = calculateStreak(logs)
  if (streak >= 7) {
    results.push({
      type: 'celebration',
      icon: '🔥',
      message: `太厲害了！你已經連續練習 ${streak} 天，這份堅持是你送給自己最好的禮物。`,
    })
  } else if (streak >= 3) {
    results.push({
      type: 'celebration',
      icon: '✨',
      message: `連續 ${streak} 天，你正在建立美好的練習習慣，繼續下去！`,
    })
  }

  // Most common yoga type
  const typeCount: Record<string, number> = {}
  logs.forEach(l => l.yogaTypes.forEach(t => {
    typeCount[t] = (typeCount[t] || 0) + 1
  }))
  const topType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]
  if (topType && topType[1] >= 3) {
    results.push({
      type: 'pattern',
      icon: '📊',
      message: `你最常練習的是「${getTypeLabel(topType[0])}」，這反映了你目前最需要的能量狀態。`,
    })
  }

  // Energy improvement
  const withEnergy = logs.filter(l => l.energyBefore > 0 && l.energyAfter > 0)
  if (withEnergy.length >= 3) {
    const avgImprovement = withEnergy.reduce((sum, l) => sum + (l.energyAfter - l.energyBefore), 0) / withEnergy.length
    if (avgImprovement > 0.5) {
      results.push({
        type: 'celebration',
        icon: '⚡',
        message: `練習讓你的能量平均提升了 ${avgImprovement.toFixed(1)} 分，你的身體在告訴你瑜伽真的有效。`,
      })
    }
  }

  // Lower back care
  const lowerBackCount = logs.filter(l => l.bodySignals.includes('lower_back')).length
  if (lowerBackCount >= 2) {
    results.push({
      type: 'suggestion',
      icon: '🌊',
      message: `下背不舒服出現了 ${lowerBackCount} 次，多加入一些貓牛式、橋式練習，溫柔照顧這個區域。`,
    })
  }

  // Variety encouragement
  const uniqueTypes = new Set(logs.flatMap(l => l.yogaTypes)).size
  if (uniqueTypes >= 5) {
    results.push({
      type: 'celebration',
      icon: '🦋',
      message: `你已經嘗試了 ${uniqueTypes} 種瑜伽類型，多元探索讓你的練習更豐富立體。`,
    })
  }

  return results.slice(0, 5)
}

function getTypeLabel(id: string): string {
  const map: Record<string, string> = {
    hatha: '哈達', vinyasa: '流動', yin: '陰瑜伽', restorative: '修復',
    power: '力量', ashtanga: '阿斯坦加', kundalini: '昆達里尼',
    nidra: '瑜伽睡眠', meditation: '冥想', breathing: '呼吸練習',
  }
  return map[id] || id
}

export function getWeeklyStats(logs: YogaLog[]) {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 86400000)
  const weekLogs = logs.filter(l => new Date(l.date) >= weekAgo)
  return {
    count: weekLogs.length,
    minutes: weekLogs.reduce((s, l) => s + l.durationMin, 0),
    avgEnergy: weekLogs.length
      ? weekLogs.reduce((s, l) => s + (l.energyAfter - l.energyBefore), 0) / weekLogs.length
      : 0,
  }
}

export function getMonthlyStats(logs: YogaLog[]) {
  const now = new Date()
  const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthLogs = logs.filter(l => new Date(l.date) >= monthAgo)
  return {
    count: monthLogs.length,
    minutes: monthLogs.reduce((s, l) => s + l.durationMin, 0),
  }
}

export function buildChartData(logs: YogaLog[], period: 'week' | 'month') {
  const days = period === 'week' ? 7 : 30
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const dateStr = d.toISOString().split('T')[0]
    const dayLogs = logs.filter(l => l.date === dateStr)
    result.push({
      date: dateStr,
      label: period === 'week'
        ? ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
        : `${d.getDate()}`,
      minutes: dayLogs.reduce((s, l) => s + l.durationMin, 0),
      count: dayLogs.length,
      avgEnergy: dayLogs.length
        ? dayLogs.reduce((s, l) => s + l.energyAfter, 0) / dayLogs.length
        : 0,
    })
  }
  return result
}
