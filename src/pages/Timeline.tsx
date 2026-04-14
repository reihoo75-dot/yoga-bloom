import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { PageTransition, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'
import { useLogStore } from '../store/useLogStore'
import { formatDate, formatDuration } from '../utils/date'
import { YOGA_TYPES, EMOTIONS, BODY_SIGNALS, LOCATION_OPTIONS } from '../data/options'
import { POSE_MAP, DIFFICULTY_LABELS } from '../data/poses'
import type { YogaLog } from '../types'

const YOGA_TYPE_MAP = Object.fromEntries(YOGA_TYPES.map(t => [t.id, t]))
const EMOTION_MAP = Object.fromEntries(EMOTIONS.map(e => [e.id, e]))
const SIGNAL_MAP = Object.fromEntries(BODY_SIGNALS.map(s => [s.id, s]))
const LOCATION_MAP = Object.fromEntries(LOCATION_OPTIONS.map(l => [l.id, l]))

type FilterType = 'all' | 'favorite' | string

export function Timeline() {
  const { logs, loadLogs, toggleFav } = useLogStore()
  const [expanded, setExpanded] = useState<number | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { loadLogs() }, [])

  const filtered = logs.filter(log => {
    if (filter === 'favorite' && !log.isFavorite) return false
    if (filter !== 'all' && filter !== 'favorite' && !log.yogaTypes.includes(filter)) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchType = log.yogaTypes.some(t => YOGA_TYPE_MAP[t]?.label.includes(q))
      const matchNote = log.note?.toLowerCase().includes(q)
      const matchPose = log.poses.some(p => {
        const def = POSE_MAP[p]
        return def?.name.includes(q) || p.toLowerCase().includes(q)
      })
      return matchType || matchNote || matchPose
    }
    return true
  })

  // Group by month
  const grouped = filtered.reduce<Record<string, YogaLog[]>>((acc, log) => {
    const key = log.date.substring(0, 7) // YYYY-MM
    if (!acc[key]) acc[key] = []
    acc[key].push(log)
    return acc
  }, {})

  const months = Object.keys(grouped).sort().reverse()

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-cream-100/95 backdrop-blur-sm border-b border-cream-200 px-5 pt-safe">
        <div className="py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display font-semibold text-warm-600 text-lg">練習日誌</h1>
            <span className="text-xs text-warm-300">{logs.length} 筆紀錄</span>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="搜尋動作、類型、筆記..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-8 rounded-xl bg-white border border-cream-200 text-sm
                text-warm-500 placeholder-warm-300 focus:outline-none focus:border-sage-300"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-warm-300 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-300 text-xs"
              >✕</button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <FilterChip label="全部" active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterChip label="♥ 收藏" active={filter === 'favorite'} onClick={() => setFilter('favorite')} />
            {YOGA_TYPES.slice(0, 6).map(t => (
              <FilterChip
                key={t.id}
                label={t.icon + ' ' + t.label}
                active={filter === t.id}
                onClick={() => setFilter(filter === t.id ? 'all' : t.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🌱</p>
            <p className="text-warm-400">
              {searchQuery ? `找不到「${searchQuery}」相關紀錄` : '還沒有練習紀錄'}
            </p>
            <p className="text-warm-300 text-sm mt-1">
              {searchQuery ? '試試其他關鍵字' : '開始你的第一次練習吧'}
            </p>
          </div>
        )}

        <StaggerContainer className="space-y-6">
          {months.map(month => {
            const [y, m] = month.split('-')
            const label = `${y} 年 ${parseInt(m)} 月`
            const monthLogs = grouped[month]
            const monthMinutes = monthLogs.reduce((s, l) => s + l.durationMin, 0)
            return (
              <StaggerItem key={month}>
                <div>
                  {/* Month header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-cream-200" />
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-warm-500 font-semibold px-2">{label}</p>
                      <span className="text-xs text-warm-300">{monthLogs.length} 次 · {formatDuration(monthMinutes)}</span>
                    </div>
                    <div className="h-px flex-1 bg-cream-200" />
                  </div>

                  <div className="space-y-3">
                    {monthLogs.map(log => (
                      <LogCard
                        key={log.id}
                        log={log}
                        isExpanded={expanded === log.id}
                        onToggle={() => setExpanded(expanded === log.id ? null : log.id!)}
                        onFav={() => toggleFav(log.id!)}
                      />
                    ))}
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </PageTransition>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200
        ${active ? 'bg-sage-400 text-white border-sage-400' : 'bg-white text-warm-400 border-cream-200'}`}
    >
      {label}
    </motion.button>
  )
}

function LogCard({ log, isExpanded, onToggle, onFav }: {
  log: YogaLog; isExpanded: boolean; onToggle: () => void; onFav: () => void
}) {
  const types = log.yogaTypes.map(t => YOGA_TYPE_MAP[t]).filter(Boolean)
  const loc = LOCATION_MAP[log.location]

  // Separate preset poses from custom poses
  const presetPoses = log.poses.map(id => POSE_MAP[id]).filter(Boolean)
  const customPoseNames = log.poses.filter(id => !POSE_MAP[id])

  const energyDiff = log.energyAfter - log.energyBefore
  const energyEmoji = (e: number) => ['', '😩', '😕', '😐', '😊', '🤩'][Math.max(1, Math.min(5, e))]

  return (
    <Card className="overflow-hidden">
      {/* Collapsed header */}
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
        whileTap={{ scale: 0.99 }}
      >
        {/* Date badge */}
        <div className="flex-shrink-0 w-12 h-14 rounded-2xl bg-sage-50 flex flex-col items-center justify-center gap-0.5">
          <span className="text-sm font-bold text-sage-600 leading-none">
            {new Date(log.date + 'T00:00:00').getDate()}
          </span>
          <span className="text-[10px] text-sage-400 leading-none">
            {new Date(log.date + 'T00:00:00').toLocaleDateString('zh-TW', { month: 'short' })}
          </span>
          <span className="text-[10px] text-warm-300 leading-none">
            {['日', '一', '二', '三', '四', '五', '六'][new Date(log.date + 'T00:00:00').getDay()]}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Type tags */}
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {types.length > 0 ? types.slice(0, 2).map(t => (
              <span key={t.id} className="text-xs bg-sage-50 text-sage-600 px-2 py-0.5 rounded-lg font-medium">
                {t.icon} {t.label}
              </span>
            )) : (
              <span className="text-xs text-warm-400 bg-cream-100 px-2 py-0.5 rounded-lg">自由練習</span>
            )}
            {log.isFavorite && <span className="text-blush-400 text-xs">♥</span>}
          </div>
          {/* Meta row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-warm-400 bg-cream-50 px-1.5 py-0.5 rounded">
              ⏱ {formatDuration(log.durationMin)}
            </span>
            {loc && (
              <span className="text-xs text-warm-400 bg-cream-50 px-1.5 py-0.5 rounded">
                {loc.icon} {loc.label}
              </span>
            )}
            {log.poses.length > 0 && (
              <span className="text-xs text-warm-300">
                {log.poses.length} 個動作
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onFav() }}
            className={`text-lg w-8 h-8 flex items-center justify-center rounded-xl
              ${log.isFavorite ? 'text-blush-400 bg-blush-50' : 'text-warm-200'}`}
          >
            {log.isFavorite ? '♥' : '♡'}
          </motion.button>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-warm-300 text-xs"
          >
            ▼
          </motion.span>
        </div>
      </motion.button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-cream-100">
              {/* ── POSES ── */}
              {(presetPoses.length > 0 || customPoseNames.length > 0) && (
                <Section label="練習的體位法">
                  <div className="grid grid-cols-4 gap-2">
                    {presetPoses.map(pose => (
                      <div key={pose.id} className="flex flex-col items-center gap-1">
                        <div className="w-full aspect-square rounded-xl bg-cream-50 overflow-hidden p-1">
                          <img
                            src={pose.image}
                            alt={pose.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-[10px] text-warm-500 text-center leading-tight">{pose.name}</p>
                      </div>
                    ))}
                  </div>
                  {customPoseNames.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {customPoseNames.map(name => (
                        <span key={name} className="text-xs px-2.5 py-1 rounded-full bg-beige-50 text-beige-600 border border-beige-100">
                          ✏️ {name}
                        </span>
                      ))}
                    </div>
                  )}
                </Section>
              )}

              {/* ── ENERGY ── */}
              {log.energyBefore > 0 && (
                <Section label="練習前後能量">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-cream-50 rounded-2xl p-3 text-center">
                      <p className="text-2xl">{energyEmoji(log.energyBefore)}</p>
                      <p className="text-[10px] text-warm-300 mt-1">練習前</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-lg ${energyDiff > 0 ? 'text-sage-400' : energyDiff < 0 ? 'text-blush-400' : 'text-warm-300'}`}>
                        {energyDiff > 0 ? '↑' : energyDiff < 0 ? '↓' : '→'}
                      </span>
                      {energyDiff !== 0 && (
                        <span className={`text-xs font-medium ${energyDiff > 0 ? 'text-sage-500' : 'text-blush-400'}`}>
                          {energyDiff > 0 ? '+' : ''}{energyDiff}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 bg-cream-50 rounded-2xl p-3 text-center">
                      <p className="text-2xl">{energyEmoji(log.energyAfter)}</p>
                      <p className="text-[10px] text-warm-300 mt-1">練習後</p>
                    </div>
                  </div>
                </Section>
              )}

              {/* ── COMPLETION ── */}
              <Section label="完成度">
                <div>
                  <div className="flex justify-between text-xs text-warm-400 mb-1.5">
                    <span>今日完成</span>
                    <span className="font-semibold text-sage-600">{log.completionLevel}%</span>
                  </div>
                  <div className="h-2.5 bg-cream-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-400"
                      style={{ width: `${log.completionLevel}%` }}
                    />
                  </div>
                </div>
              </Section>

              {/* ── BODY SIGNALS ── */}
              {log.bodySignals.length > 0 && (
                <Section label="身體感受">
                  <div className="flex flex-wrap gap-1.5">
                    {log.bodySignals.map(s => {
                      const def = SIGNAL_MAP[s]
                      return def ? (
                        <span key={s} className="text-xs bg-cream-100 text-warm-500 px-2.5 py-1 rounded-xl">
                          {def.icon} {def.label}
                        </span>
                      ) : (
                        <span key={s} className="text-xs bg-beige-50 text-beige-600 px-2.5 py-1 rounded-xl border border-beige-100">
                          {s}
                        </span>
                      )
                    })}
                  </div>
                  {log.bodyNote && (
                    <p className="text-xs text-warm-500 leading-relaxed mt-2 bg-cream-50 rounded-xl p-2.5">
                      {log.bodyNote}
                    </p>
                  )}
                </Section>
              )}

              {/* ── EMOTIONS ── */}
              {log.emotions.length > 0 && (
                <Section label="情緒狀態">
                  <div className="flex flex-wrap gap-1.5">
                    {log.emotions.map(e => {
                      const def = EMOTION_MAP[e]
                      return def ? (
                        <span key={e} className="text-xs bg-sage-50 text-sage-600 px-2.5 py-1 rounded-xl">
                          {def.icon} {def.label}
                        </span>
                      ) : (
                        <span key={e} className="text-xs bg-beige-50 text-beige-600 px-2.5 py-1 rounded-xl border border-beige-100">
                          {e}
                        </span>
                      )
                    })}
                  </div>
                  {log.emotionNote && (
                    <p className="text-xs text-warm-500 leading-relaxed mt-2 bg-cream-50 rounded-xl p-2.5">
                      {log.emotionNote}
                    </p>
                  )}
                </Section>
              )}

              {/* ── GOALS ── */}
              {log.goals.length > 0 && (
                <Section label="今日目標">
                  <div className="flex flex-wrap gap-1.5">
                    {log.goals.map(g => (
                      <span key={g} className="text-xs bg-blush-50 text-blush-500 px-2.5 py-1 rounded-xl">
                        {g}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── NOTE ── */}
              {log.note && (
                <Section label="給自己的話">
                  <div className="bg-cream-50 rounded-2xl p-3.5">
                    <p className="text-sm text-warm-500 leading-relaxed">{log.note}</p>
                    <p className="text-[10px] text-warm-300 mt-2 text-right">
                      {new Date(log.createdAt).toLocaleString('zh-TW', {
                        month: 'numeric', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })} 記錄
                    </p>
                  </div>
                </Section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-cream-50 last:border-b-0">
      <p className="text-[10px] font-semibold text-warm-300 uppercase tracking-wide mb-2">{label}</p>
      {children}
    </div>
  )
}
