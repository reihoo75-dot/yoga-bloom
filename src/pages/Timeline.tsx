import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { TagButton } from '../components/ui/TagButton'
import { PageTransition, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'
import { useLogStore } from '../store/useLogStore'
import { formatDate, formatDuration } from '../utils/date'
import { YOGA_TYPES, EMOTIONS, BODY_SIGNALS, LOCATION_OPTIONS } from '../data/options'
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

  useEffect(() => { loadLogs() }, [])

  const filtered = logs.filter(log => {
    if (filter === 'all') return true
    if (filter === 'favorite') return log.isFavorite
    return log.yogaTypes.includes(filter)
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
      <div className="sticky top-0 z-20 bg-cream-100/95 backdrop-blur-sm border-b border-cream-200 px-5 py-4 pt-safe">
        <h1 className="font-display font-semibold text-warm-600 text-lg">練習日誌</h1>

        {/* Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <FilterChip label="全部" active={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterChip label="♥ 收藏" active={filter === 'favorite'} onClick={() => setFilter('favorite')} />
          {YOGA_TYPES.slice(0, 5).map(t => (
            <FilterChip
              key={t.id}
              label={t.icon + ' ' + t.label}
              active={filter === t.id}
              onClick={() => setFilter(filter === t.id ? 'all' : t.id)}
            />
          ))}
        </div>
      </div>

      <div className="px-5 pt-4">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🌱</p>
            <p className="text-warm-400">還沒有練習紀錄</p>
            <p className="text-warm-300 text-sm mt-1">開始你的第一次練習吧</p>
          </div>
        )}

        <StaggerContainer className="space-y-6">
          {months.map(month => {
            const [y, m] = month.split('-')
            const label = `${y} 年 ${parseInt(m)} 月`
            return (
              <StaggerItem key={month}>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-cream-200" />
                    <p className="text-xs text-warm-400 font-medium px-2">{label}</p>
                    <div className="h-px flex-1 bg-cream-200" />
                  </div>
                  <div className="space-y-3">
                    {grouped[month].map(log => (
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
        ${active ? 'bg-sage-400 text-white border-sage-400' : 'bg-white/70 text-warm-400 border-cream-200'}`}
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

  return (
    <Card className="overflow-hidden">
      {/* Header row */}
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
        whileTap={{ scale: 0.99 }}
      >
        {/* Date badge */}
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-sage-50 flex flex-col items-center justify-center">
          <span className="text-xs text-sage-500 font-medium leading-none">
            {new Date(log.date + 'T00:00:00').toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' }).replace('/', '/')}
          </span>
          <span className="text-xs text-warm-300 mt-0.5">
            {['日', '一', '二', '三', '四', '五', '六'][new Date(log.date + 'T00:00:00').getDay()]}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {types.length > 0 ? types.slice(0, 2).map(t => (
              <span key={t.id} className="text-xs bg-sage-50 text-sage-600 px-2 py-0.5 rounded-lg">
                {t.icon} {t.label}
              </span>
            )) : (
              <span className="text-xs text-warm-400">自由練習</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-warm-400">{log.startTime}</span>
            <span className="text-warm-200">·</span>
            <span className="text-xs text-warm-400">{formatDuration(log.durationMin)}</span>
            {loc && <><span className="text-warm-200">·</span><span className="text-xs text-warm-400">{loc.icon} {loc.label}</span></>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onFav() }}
            className={`text-xl ${log.isFavorite ? 'text-blush-400' : 'text-warm-200'}`}
          >
            {log.isFavorite ? '♥' : '♡'}
          </motion.button>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-warm-300 text-xs"
          >
            ▼
          </motion.span>
        </div>
      </motion.button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-cream-100 space-y-3">
              {/* Goals */}
              {log.goals.length > 0 && (
                <div>
                  <p className="text-xs text-warm-300 mb-1.5">目標</p>
                  <div className="flex flex-wrap gap-1.5">
                    {log.goals.map(g => (
                      <span key={g} className="text-xs bg-blush-50 text-blush-500 px-2 py-1 rounded-lg">{g}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Body signals */}
              {log.bodySignals.length > 0 && (
                <div>
                  <p className="text-xs text-warm-300 mb-1.5">身體感受</p>
                  <div className="flex flex-wrap gap-1.5">
                    {log.bodySignals.map(s => {
                      const def = SIGNAL_MAP[s]
                      return def ? (
                        <span key={s} className="text-xs bg-cream-100 text-warm-500 px-2 py-1 rounded-lg">
                          {def.icon} {def.label}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Emotions */}
              {log.emotions.length > 0 && (
                <div>
                  <p className="text-xs text-warm-300 mb-1.5">情緒</p>
                  <div className="flex flex-wrap gap-1.5">
                    {log.emotions.map(e => {
                      const def = EMOTION_MAP[e]
                      return def ? (
                        <span key={e} className="text-xs bg-sage-50 text-sage-600 px-2 py-1 rounded-lg">
                          {def.icon} {def.label}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Energy */}
              {log.energyBefore > 0 && (
                <div className="flex gap-3">
                  <div className="flex-1 bg-cream-50 rounded-2xl p-2.5 text-center">
                    <p className="text-xs text-warm-300">練習前能量</p>
                    <p className="text-lg">{['', '😩', '😕', '😐', '😊', '🤩'][log.energyBefore]}</p>
                  </div>
                  <div className="flex items-center text-warm-300">→</div>
                  <div className="flex-1 bg-cream-50 rounded-2xl p-2.5 text-center">
                    <p className="text-xs text-warm-300">練習後能量</p>
                    <p className="text-lg">{['', '😩', '😕', '😐', '😊', '🤩'][log.energyAfter]}</p>
                  </div>
                </div>
              )}

              {/* Completion */}
              <div>
                <div className="flex justify-between text-xs text-warm-400 mb-1">
                  <span>完成度</span>
                  <span>{log.completionLevel}%</span>
                </div>
                <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-400"
                    style={{ width: `${log.completionLevel}%` }}
                  />
                </div>
              </div>

              {/* Note */}
              {log.note && (
                <div className="bg-cream-50 rounded-2xl p-3">
                  <p className="text-xs text-warm-300 mb-1">📝 筆記</p>
                  <p className="text-sm text-warm-500 leading-relaxed">{log.note}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
