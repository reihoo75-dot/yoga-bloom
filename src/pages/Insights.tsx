import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, CartesianGrid,
} from 'recharts'
import { Card } from '../components/ui/Card'
import { PageTransition, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'
import { useLogStore } from '../store/useLogStore'
import { generateInsights, buildChartData, getWeeklyStats, getMonthlyStats } from '../utils/insights'
import { calculateStreak } from '../utils/xp'
import { formatDuration } from '../utils/date'
import type { InsightPeriod } from '../types'

const TABS: { id: InsightPeriod; label: string }[] = [
  { id: 'week',    label: '週' },
  { id: 'month',   label: '月' },
  { id: 'quarter', label: '季' },
  { id: 'year',    label: '年' },
]

const CHART = { primary: '#8FAF8F', secondary: '#D4C4B4', accent: '#C4A87C', light: '#B8D0B8' }

const EMOTION_LABELS: Record<string, string> = {
  calm: '平靜', happy: '愉快', focused: '專注', tired: '疲憊',
  anxious: '焦慮', sad: '低落', grateful: '感恩', proud: '有成就感',
  restless: '不安', peaceful: '祥和', motivated: '有動力', release: '釋放感',
}

export function Insights() {
  const { logs, loadLogs } = useLogStore()
  const [period, setPeriod] = useState<InsightPeriod>('week')
  useEffect(() => { loadLogs() }, [])

  const insights    = generateInsights(logs)
  const weekly      = getWeeklyStats(logs)
  const monthly     = getMonthlyStats(logs)
  const streak      = calculateStreak(logs)
  const totalMins   = logs.reduce((s, l) => s + l.durationMin, 0)
  const chartData   = buildChartData(logs, period === 'week' ? 'week' : 'month')

  const topEmotions = Object.entries(
    logs.flatMap(l => l.emotions).reduce<Record<string, number>>((a, e) => { a[e] = (a[e] || 0) + 1; return a }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, count]) => ({ label: EMOTION_LABELS[id] || id, count }))

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-28">
      {/* ── STICKY HEADER ─────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-cream-100/95 backdrop-blur-sm border-b border-cream-200 px-5 pt-safe pb-0">
        <div className="pt-5 pb-3">
          <h1 className="font-display font-semibold text-warm-700 text-lg mb-3">練習洞察</h1>
          <div className="flex gap-1 bg-cream-200/80 rounded-2xl p-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setPeriod(t.id)}
                className={`flex-1 py-1.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${period === t.id ? 'bg-white text-warm-600 shadow-soft' : 'text-warm-400'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* ── STATS GRID ──────────────────────────────────── */}
        <StaggerContainer className="grid grid-cols-2 gap-2.5">
          <StaggerItem><StatCard label="總練習次數" value={String(logs.length)} unit="次"  accent="#8FAF8F" /></StaggerItem>
          <StaggerItem><StatCard label="總練習時間" value={formatDuration(totalMins)} unit="" accent="#C4A87C" /></StaggerItem>
          <StaggerItem><StatCard label="本週練習" value={String(weekly.count)} unit={`次 · ${formatDuration(weekly.minutes)}`} accent="#D4B4C4" /></StaggerItem>
          <StaggerItem><StatCard label="最長連續" value={String(streak)} unit="天" accent="#A8C4A8" /></StaggerItem>
        </StaggerContainer>

        {/* ── INSIGHTS ────────────────────────────────────── */}
        {insights.length > 0 && (
          <Card animate className="p-4" delay={0.2}>
            <SectionTitle>智能建議</SectionTitle>
            <div className="space-y-2 mt-3">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className={`flex gap-3 p-3 rounded-2xl items-start ${
                    insight.type === 'celebration' ? 'bg-sage-50'
                    : insight.type === 'suggestion' ? 'bg-cream-100'
                    : 'bg-beige-50'
                  }`}
                >
                  {/* Colour dot instead of emoji */}
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    insight.type === 'celebration' ? 'bg-sage-400' : insight.type === 'suggestion' ? 'bg-beige-400' : 'bg-warm-300'
                  }`} />
                  <p className="text-[13px] text-warm-500 leading-relaxed">{insight.message}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Empty state */}
        {logs.length === 0 && (
          <Card animate className="py-12 text-center" delay={0.1}>
            <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
              <ChartIcon />
            </div>
            <p className="text-[14px] font-medium text-warm-500">還沒有練習數據</p>
            <p className="text-[12px] text-warm-300 mt-1">開始練習後，這裡會顯示你的洞察</p>
          </Card>
        )}

        {/* ── PREMIUM GATE ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FAF8F4 0%, #F2EDE4 100%)', border: '1px solid #DDD5C8' }}
        >
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-beige-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[11px] font-bold text-beige-600 tracking-wide uppercase">Premium 功能</span>
            </div>
            <p className="text-[13px] font-semibold text-warm-700 mb-0.5">深度練習分析</p>
            <p className="text-[12px] text-warm-400 leading-relaxed mb-3">解鎖月/季/年度趨勢、體位進步追蹤、身體熱力圖、個人化建議報告。</p>
            <button className="w-full py-2.5 rounded-2xl bg-warm-500 text-white text-[13px] font-semibold shadow-soft">
              升級 Premium
            </button>
          </div>
        </motion.div>

        {logs.length > 0 && (
          <>
            {/* ── DURATION CHART ──────────────────────────── */}
            <Card animate className="p-4" delay={0.25}>
              <SectionTitle>練習時長</SectionTitle>
              <p className="text-[12px] text-warm-400 mt-0.5 mb-3">{period === 'week' ? '過去 7 天' : '過去 30 天'}每日分鐘數</p>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE5DA" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#B8A090' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#B8A090' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #EDE5DA', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} formatter={(v: number) => [`${v} 分鐘`, '']} labelStyle={{ color: '#8B6F5E', fontWeight: 600 }} />
                  <Bar dataKey="minutes" fill={CHART.primary} radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* ── ENERGY CHART ────────────────────────────── */}
            <Card animate className="p-4" delay={0.3}>
              <SectionTitle>能量趨勢</SectionTitle>
              <p className="text-[12px] text-warm-400 mt-0.5 mb-3">練習後的平均能量狀態</p>
              <ResponsiveContainer width="100%" height={110}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={CHART.secondary} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={CHART.secondary} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE5DA" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#B8A090' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#B8A090' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #EDE5DA', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [v.toFixed(1), '能量']} />
                  <Area type="monotone" dataKey="avgEnergy" stroke={CHART.secondary} fill="url(#energyGrad)" strokeWidth={2} dot={{ fill: CHART.secondary, r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* ── EMOTIONS CHART ──────────────────────────── */}
            {topEmotions.length > 0 && (
              <Card animate className="p-4" delay={0.35}>
                <SectionTitle>常見情緒</SectionTitle>
                <p className="text-[12px] text-warm-400 mt-0.5 mb-3">練習中最常出現的情緒狀態</p>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={topEmotions} layout="vertical" margin={{ top: 0, right: 8, left: 10, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#B8A090' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#9A8070' }} axisLine={false} tickLine={false} width={52} />
                    <Tooltip contentStyle={{ background: 'white', border: '1px solid #EDE5DA', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} 次`, '']} />
                    <Bar dataKey="count" fill={CHART.accent} radius={[0, 6, 6, 0]} maxBarSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* ── FREQUENCY CHART ─────────────────────────── */}
            <Card animate className="p-4" delay={0.4}>
              <SectionTitle>練習頻率</SectionTitle>
              <p className="text-[12px] text-warm-400 mt-0.5 mb-3">哪些日子你最常練習</p>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE5DA" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#B8A090' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#B8A090' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #EDE5DA', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} 次`, '']} />
                  <Line type="monotone" dataKey="count" stroke={CHART.light} strokeWidth={2.5} dot={{ fill: CHART.primary, r: 3.5, strokeWidth: 0 }} activeDot={{ r: 5, fill: CHART.primary }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </div>
    </PageTransition>
  )
}

/* ─── Sub-components ──────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-semibold text-warm-600">{children}</p>
}

function StatCard({ label, value, unit, accent }: { label: string; value: string; unit: string; accent: string }) {
  return (
    <div className="bg-white rounded-3xl p-4 border border-cream-200/60 shadow-soft">
      {/* Accent bar */}
      <div className="w-6 h-1 rounded-full mb-3" style={{ background: accent }} />
      <p className="text-xl font-display font-bold text-warm-700">{value}</p>
      {unit && <p className="text-[11px] text-warm-400 mt-0.5">{unit}</p>}
      <p className="text-[11px] text-warm-300 mt-1.5">{label}</p>
    </div>
  )
}

function ChartIcon() {
  return (
    <svg className="w-6 h-6 text-warm-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V14M9 20V8M14 20V12M19 20V5" />
    </svg>
  )
}
