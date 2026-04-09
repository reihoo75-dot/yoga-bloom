import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, CartesianGrid
} from 'recharts'
import { Card } from '../components/ui/Card'
import { PageTransition, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'
import { useLogStore } from '../store/useLogStore'
import { generateInsights, buildChartData, getWeeklyStats, getMonthlyStats } from '../utils/insights'
import { calculateStreak } from '../utils/xp'
import { formatDuration } from '../utils/date'
import type { InsightPeriod } from '../types'

const TABS: { id: InsightPeriod; label: string }[] = [
  { id: 'week', label: '週' },
  { id: 'month', label: '月' },
  { id: 'quarter', label: '季' },
  { id: 'year', label: '年' },
]

const SOFT_COLORS = {
  primary: '#8FAF8F',
  secondary: '#EDB0B8',
  accent: '#D4B896',
  light: '#C2D6C2',
}

export function Insights() {
  const { logs, loadLogs } = useLogStore()
  const [period, setPeriod] = useState<InsightPeriod>('week')

  useEffect(() => { loadLogs() }, [])

  const insights = generateInsights(logs)
  const weekly = getWeeklyStats(logs)
  const monthly = getMonthlyStats(logs)
  const streak = calculateStreak(logs)
  const totalMinutes = logs.reduce((s, l) => s + l.durationMin, 0)

  const chartData = buildChartData(
    logs,
    period === 'week' ? 'week' : 'month'
  )

  // Emotion frequency data
  const emotionFreq = logs.flatMap(l => l.emotions).reduce<Record<string, number>>((acc, e) => {
    acc[e] = (acc[e] || 0) + 1
    return acc
  }, {})
  const topEmotions = Object.entries(emotionFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const EMOTION_LABELS: Record<string, string> = {
        calm: '平靜', happy: '愉快', focused: '專注', tired: '疲憊',
        anxious: '焦慮', sad: '低落', grateful: '感恩', proud: '有成就感',
        restless: '不安', peaceful: '祥和', motivated: '有動力', release: '釋放感',
      }
      return { label: EMOTION_LABELS[id] || id, count }
    })

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-cream-100/95 backdrop-blur-sm border-b border-cream-200 px-5 py-4 pt-safe">
        <h1 className="font-display font-semibold text-warm-600 text-lg mb-3">練習洞察</h1>

        {/* Period tabs */}
        <div className="flex gap-1 bg-cream-200 rounded-2xl p-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setPeriod(t.id)}
              className={`flex-1 py-1.5 rounded-xl text-sm font-medium transition-all duration-200
                ${period === t.id ? 'bg-white text-sage-500 shadow-soft' : 'text-warm-400'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Summary stats */}
        <StaggerContainer className="grid grid-cols-2 gap-3">
          <StaggerItem>
            <StatCard label="總練習次數" value={logs.length.toString()} unit="次" color="sage" icon="🧘" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="總練習時間" value={formatDuration(totalMinutes)} unit="" color="blush" icon="⏱️" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="本週練習" value={weekly.count.toString()} unit={`次 / ${formatDuration(weekly.minutes)}`} color="beige" icon="📅" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="最長連續" value={streak.toString()} unit="天" color="warm" icon="🔥" />
          </StaggerItem>
        </StaggerContainer>

        {/* Insights messages */}
        {insights.length > 0 && (
          <Card animate className="p-4" delay={0.2}>
            <p className="text-xs font-medium text-warm-400 mb-3">💡 智能建議</p>
            <div className="space-y-2">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`flex gap-3 p-3 rounded-2xl ${
                    insight.type === 'celebration' ? 'bg-sage-50'
                    : insight.type === 'suggestion' ? 'bg-blush-50'
                    : 'bg-beige-50'
                  }`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{insight.icon}</span>
                  <p className="text-sm text-warm-500 leading-relaxed">{insight.message}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {logs.length === 0 && (
          <Card animate className="p-8 text-center" delay={0.1}>
            <p className="text-4xl mb-3">📊</p>
            <p className="text-warm-400">還沒有練習數據</p>
            <p className="text-warm-300 text-sm mt-1">開始練習後，這裡會出現你的洞察</p>
          </Card>
        )}

        {logs.length > 0 && (
          <>
            {/* Minutes chart */}
            <Card animate className="p-4" delay={0.25}>
              <p className="text-xs text-warm-400 mb-1">練習時長</p>
              <p className="text-sm text-warm-500 mb-3">
                {period === 'week' ? '過去 7 天' : '過去 30 天'}的每日練習分鐘數
              </p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D8" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#B89A80' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#B89A80' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #F0E8D8', borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [`${v} 分鐘`, '時長']}
                  />
                  <Bar dataKey="minutes" fill={SOFT_COLORS.primary} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Energy trend */}
            <Card animate className="p-4" delay={0.3}>
              <p className="text-xs text-warm-400 mb-1">能量變化趨勢</p>
              <p className="text-sm text-warm-500 mb-3">練習後的平均能量狀態，看看你在哪些時候最有活力</p>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={SOFT_COLORS.secondary} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={SOFT_COLORS.secondary} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D8" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#B89A80' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#B89A80' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #F0E8D8', borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [v.toFixed(1), '能量']}
                  />
                  <Area type="monotone" dataKey="avgEnergy" stroke={SOFT_COLORS.secondary} fill="url(#energyGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Emotion frequency */}
            {topEmotions.length > 0 && (
              <Card animate className="p-4" delay={0.35}>
                <p className="text-xs text-warm-400 mb-1">常見情緒</p>
                <p className="text-sm text-warm-500 mb-3">你在練習中最常感受到的情緒狀態</p>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={topEmotions} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#B89A80' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#9A7868' }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip
                      contentStyle={{ background: 'white', border: '1px solid #F0E8D8', borderRadius: 12, fontSize: 12 }}
                      formatter={(v: number) => [`${v} 次`, '出現次數']}
                    />
                    <Bar dataKey="count" fill={SOFT_COLORS.accent} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Practice count line */}
            <Card animate className="p-4" delay={0.4}>
              <p className="text-xs text-warm-400 mb-1">練習頻率</p>
              <p className="text-sm text-warm-500 mb-3">哪些日子你最常練習？找到你的練習節奏</p>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D8" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#B89A80' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#B89A80' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #F0E8D8', borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [`${v} 次`, '練習次數']}
                  />
                  <Line type="monotone" dataKey="count" stroke={SOFT_COLORS.light} strokeWidth={2.5} dot={{ fill: SOFT_COLORS.primary, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </div>
    </PageTransition>
  )
}

function StatCard({ label, value, unit, color, icon }: {
  label: string; value: string; unit: string; color: string; icon: string
}) {
  const bg = {
    sage: 'from-sage-50 to-sage-100/50',
    blush: 'from-blush-50 to-blush-100/50',
    beige: 'from-beige-50 to-beige-100/50',
    warm: 'from-warm-50 to-warm-100/50',
  }[color] ?? 'from-cream-50 to-cream-100'

  return (
    <div className={`bg-gradient-to-br ${bg} rounded-3xl p-4 border border-white/60`}>
      <span className="text-2xl">{icon}</span>
      <p className="text-xl font-display font-semibold text-warm-600 mt-2">{value}</p>
      {unit && <p className="text-xs text-warm-400">{unit}</p>}
      <p className="text-xs text-warm-300 mt-1">{label}</p>
    </div>
  )
}
