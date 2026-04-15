import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { PageTransition, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'
import { useLogStore } from '../store/useLogStore'
import { formatDuration } from '../utils/date'
import { YOGA_TYPES, EMOTIONS, BODY_SIGNALS, LOCATION_OPTIONS } from '../data/options'
import { POSE_MAP } from '../data/poses'
import type { YogaLog } from '../types'

const YOGA_TYPE_MAP    = Object.fromEntries(YOGA_TYPES.map(t => [t.id, t]))
const EMOTION_MAP      = Object.fromEntries(EMOTIONS.map(e => [e.id, e]))
const SIGNAL_MAP       = Object.fromEntries(BODY_SIGNALS.map(s => [s.id, s]))
const LOCATION_MAP     = Object.fromEntries(LOCATION_OPTIONS.map(l => [l.id, l]))

type FilterType = 'all' | 'favorite' | string

export function Timeline() {
  const { logs, loadLogs, toggleFav } = useLogStore()
  const [expanded, setExpanded]   = useState<number | null>(null)
  const [filter, setFilter]       = useState<FilterType>('all')
  const [searchQuery, setSearch]  = useState('')

  useEffect(() => { loadLogs() }, [])

  const filtered = logs.filter(log => {
    if (filter === 'favorite' && !log.isFavorite) return false
    if (filter !== 'all' && filter !== 'favorite' && !log.yogaTypes.includes(filter)) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return log.yogaTypes.some(t => YOGA_TYPE_MAP[t]?.label.includes(q))
        || log.note?.toLowerCase().includes(q)
        || log.poses.some(p => POSE_MAP[p]?.name.includes(q) || p.toLowerCase().includes(q))
    }
    return true
  })

  const grouped = filtered.reduce<Record<string, YogaLog[]>>((acc, log) => {
    const key = log.date.substring(0, 7)
    ;(acc[key] = acc[key] || []).push(log)
    return acc
  }, {})
  const months = Object.keys(grouped).sort().reverse()

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-28">
      {/* ── STICKY HEADER ─────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-cream-100/95 backdrop-blur-sm border-b border-cream-200 px-4 pt-safe">
        <div className="pt-5 pb-3 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="font-display font-semibold text-warm-700 text-lg">練習日誌</h1>
            <span className="text-[11px] text-warm-300">{logs.length} 筆紀錄</span>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-300 pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="搜尋類型、動作、筆記…"
              value={searchQuery}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-white border border-cream-200 text-[13px] text-warm-600 placeholder-warm-300 focus:outline-none focus:border-sage-300 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-300">
                <CloseIcon />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            <FilterChip label="全部"  active={filter === 'all'}      onClick={() => setFilter('all')} />
            <FilterChip label="收藏"  active={filter === 'favorite'} onClick={() => setFilter('favorite')} />
            {YOGA_TYPES.slice(0, 6).map(t => (
              <FilterChip
                key={t.id}
                label={t.label}
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
            <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="text-warm-300" size={20} />
            </div>
            <p className="text-[14px] font-medium text-warm-500">
              {searchQuery ? `找不到「${searchQuery}」` : '還沒有練習紀錄'}
            </p>
            <p className="text-[12px] text-warm-300 mt-1">
              {searchQuery ? '試試其他關鍵字' : '開始你的第一次練習吧'}
            </p>
          </div>
        )}

        <StaggerContainer className="space-y-6">
          {months.map(month => {
            const [y, m] = month.split('-')
            const mLogs  = grouped[month]
            return (
              <StaggerItem key={month}>
                {/* Month header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-cream-200" />
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-warm-500">{y} 年 {parseInt(m)} 月</span>
                    <span className="text-[11px] text-warm-300">{mLogs.length} 次 · {formatDuration(mLogs.reduce((s, l) => s + l.durationMin, 0))}</span>
                  </div>
                  <div className="h-px flex-1 bg-cream-200" />
                </div>

                <div className="space-y-2.5">
                  {mLogs.map(log => (
                    <LogCard
                      key={log.id}
                      log={log}
                      isExpanded={expanded === log.id}
                      onToggle={() => setExpanded(expanded === log.id ? null : log.id!)}
                      onFav={() => toggleFav(log.id!)}
                    />
                  ))}
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </PageTransition>
  )
}

/* ─── Filter chip ────────────────────────────────────────────── */
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200
        ${active ? 'bg-warm-600 text-white border-warm-600' : 'bg-white text-warm-400 border-cream-200'}`}
    >
      {label}
    </motion.button>
  )
}

/* ─── Log card ───────────────────────────────────────────────── */
function LogCard({ log, isExpanded, onToggle, onFav }: {
  log: YogaLog; isExpanded: boolean; onToggle: () => void; onFav: () => void
}) {
  const types = log.yogaTypes.map(t => YOGA_TYPE_MAP[t]).filter(Boolean)
  const loc   = LOCATION_MAP[log.location]
  const presetPoses   = log.poses.map(id => POSE_MAP[id]).filter(Boolean)
  const customPoses   = log.poses.filter(id => !POSE_MAP[id])
  const energyDiff    = log.energyAfter - log.energyBefore
  const energyLabel   = (e: number) => ['', '很差', '偏低', '普通', '不錯', '很好'][Math.max(1, Math.min(5, e))]

  return (
    <Card className="overflow-hidden">
      <motion.button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3.5 text-left" whileTap={{ scale: 0.99 }}>
        {/* Date badge */}
        <div className="flex-shrink-0 w-11 text-center">
          <p className="text-[18px] font-bold text-warm-700 leading-none">
            {new Date(log.date + 'T00:00:00').getDate()}
          </p>
          <p className="text-[10px] text-warm-300 mt-0.5 leading-none">
            {['日','一','二','三','四','五','六'][new Date(log.date + 'T00:00:00').getDay()]}
          </p>
        </div>

        <div className="w-px h-8 bg-cream-200 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {types.length > 0
              ? types.slice(0, 2).map(t => (
                <span key={t.id} className="text-[11px] bg-sage-50 text-sage-600 px-2 py-0.5 rounded-lg font-medium">{t.label}</span>
              ))
              : <span className="text-[11px] text-warm-400 bg-cream-100 px-2 py-0.5 rounded-lg">自由練習</span>
            }
          </div>
          <div className="flex items-center gap-2 text-[11px] text-warm-400">
            <span>{formatDuration(log.durationMin)}</span>
            {loc && <><span className="text-cream-300">·</span><span>{loc.label}</span></>}
            {log.poses.length > 0 && <><span className="text-cream-300">·</span><span>{log.poses.length} 個動作</span></>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Favourite */}
          <motion.button whileTap={{ scale: 0.8 }} onClick={e => { e.stopPropagation(); onFav() }}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors
              ${log.isFavorite ? 'text-blush-400 bg-blush-50' : 'text-warm-200'}`}
          >
            <HeartIcon filled={log.isFavorite} />
          </motion.button>
          {/* Chevron */}
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-warm-300">
            <ChevronIcon />
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <div className="border-t border-cream-100">
              {/* Poses */}
              {(presetPoses.length > 0 || customPoses.length > 0) && (
                <Section label="練習體位">
                  <div className="grid grid-cols-4 gap-2">
                    {presetPoses.map(pose => (
                      <div key={pose.id} className="flex flex-col items-center gap-1">
                        <div className="w-full aspect-square rounded-xl bg-cream-50 overflow-hidden p-1">
                          <img src={pose.image} alt={pose.name} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-[10px] text-warm-400 text-center leading-tight">{pose.name}</p>
                      </div>
                    ))}
                  </div>
                  {customPoses.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {customPoses.map(name => (
                        <span key={name} className="text-[11px] px-2.5 py-1 rounded-full bg-beige-50 text-beige-600 border border-beige-100">{name}</span>
                      ))}
                    </div>
                  )}
                </Section>
              )}

              {/* Energy */}
              {log.energyBefore > 0 && (
                <Section label="能量前後">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-cream-50 rounded-2xl p-3 text-center">
                      <p className="text-[13px] font-semibold text-warm-600">{energyLabel(log.energyBefore)}</p>
                      <p className="text-[10px] text-warm-300 mt-0.5">練習前</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`text-base font-bold ${energyDiff > 0 ? 'text-sage-400' : energyDiff < 0 ? 'text-blush-400' : 'text-warm-300'}`}>
                        {energyDiff > 0 ? '↑' : energyDiff < 0 ? '↓' : '→'}
                      </span>
                      {energyDiff !== 0 && (
                        <span className={`text-[11px] font-medium ${energyDiff > 0 ? 'text-sage-500' : 'text-blush-400'}`}>
                          {energyDiff > 0 ? '+' : ''}{energyDiff}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 bg-cream-50 rounded-2xl p-3 text-center">
                      <p className="text-[13px] font-semibold text-warm-600">{energyLabel(log.energyAfter)}</p>
                      <p className="text-[10px] text-warm-300 mt-0.5">練習後</p>
                    </div>
                  </div>
                </Section>
              )}

              {/* Completion */}
              <Section label="完成度">
                <div>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-warm-400">今日完成</span>
                    <span className="font-semibold text-sage-600">{log.completionLevel}%</span>
                  </div>
                  <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-400" style={{ width: `${log.completionLevel}%` }} />
                  </div>
                </div>
              </Section>

              {/* Body signals */}
              {log.bodySignals.length > 0 && (
                <Section label="身體感受">
                  <div className="flex flex-wrap gap-1.5">
                    {log.bodySignals.map(s => {
                      const def = SIGNAL_MAP[s]
                      return def
                        ? <span key={s} className="text-[11px] bg-cream-100 text-warm-500 px-2.5 py-1 rounded-xl">{def.label}</span>
                        : <span key={s} className="text-[11px] bg-beige-50 text-beige-600 px-2.5 py-1 rounded-xl border border-beige-100">{s}</span>
                    })}
                  </div>
                  {log.bodyNote && <p className="text-[12px] text-warm-500 leading-relaxed mt-2 bg-cream-50 rounded-xl p-2.5">{log.bodyNote}</p>}
                </Section>
              )}

              {/* Emotions */}
              {log.emotions.length > 0 && (
                <Section label="情緒狀態">
                  <div className="flex flex-wrap gap-1.5">
                    {log.emotions.map(e => {
                      const def = EMOTION_MAP[e]
                      return def
                        ? <span key={e} className="text-[11px] bg-sage-50 text-sage-600 px-2.5 py-1 rounded-xl">{def.label}</span>
                        : <span key={e} className="text-[11px] bg-beige-50 text-beige-600 px-2.5 py-1 rounded-xl border border-beige-100">{e}</span>
                    })}
                  </div>
                  {log.emotionNote && <p className="text-[12px] text-warm-500 leading-relaxed mt-2 bg-cream-50 rounded-xl p-2.5">{log.emotionNote}</p>}
                </Section>
              )}

              {/* Goals */}
              {log.goals.length > 0 && (
                <Section label="今日目標">
                  <div className="flex flex-wrap gap-1.5">
                    {log.goals.map(g => <span key={g} className="text-[11px] bg-blush-50 text-blush-500 px-2.5 py-1 rounded-xl">{g}</span>)}
                  </div>
                </Section>
              )}

              {/* Note */}
              {log.note && (
                <Section label="給自己的話">
                  <div className="bg-cream-50 rounded-2xl p-3.5">
                    <p className="text-[13px] text-warm-500 leading-relaxed">{log.note}</p>
                    <p className="text-[10px] text-warm-300 mt-2 text-right">
                      {new Date(log.createdAt).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 記錄
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
      <p className="text-[10px] font-semibold text-warm-300 uppercase tracking-widest mb-2">{label}</p>
      {children}
    </div>
  )
}

/* ─── Icons ──────────────────────────────────────────────────── */
function SearchIcon({ className = 'text-warm-300', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className={className}>
      <circle cx="11" cy="11" r="7" /><path d="M16.5 16.5l4 4" />
    </svg>
  )
}
function CloseIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M6 6l12 12M6 18L18 6" /></svg>
}
function HeartIcon({ filled }: { filled: boolean }) {
  return filled
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
}
function ChevronIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
}
