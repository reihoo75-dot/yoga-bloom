import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TagButton } from '../components/ui/TagButton'
import { Button } from '../components/ui/Button'
import { EnergyPicker } from '../components/ui/EnergyPicker'
import { CompletionSlider } from '../components/ui/CompletionSlider'
import { PageTransition } from '../components/ui/PageTransition'
import { BodyPartSelector } from '../components/ui/BodyPartSelector'
import { PosePicker } from '../components/ui/PosePicker'
import { CustomTagInput } from '../components/ui/CustomTagInput'
import { useLogStore } from '../store/useLogStore'
import { useAppStore } from '../store/useAppStore'
import {
  DURATION_OPTIONS, LOCATION_OPTIONS, YOGA_TYPES, GOALS,
  BODY_SIGNALS, EMOTIONS
} from '../data/options'
import { calculateXP, calculateResources, checkNewBadges } from '../utils/xp'
import { today, currentTime } from '../utils/date'
import type { YogaLog } from '../types'

type Section = 'duration' | 'location' | 'types' | 'goals' | 'poses' | 'signals' | 'emotions' | 'completion' | 'note'

const SECTIONS: { id: Section; label: string; hint: string }[] = [
  { id: 'duration',   label: '練習時長',     hint: '今天練了多久？' },
  { id: 'location',   label: '練習地點',     hint: '在哪裡練習？' },
  { id: 'types',      label: '瑜伽類型',     hint: '今天練了什麼類型？' },
  { id: 'goals',      label: '今日目標',     hint: '這次想達成什麼？' },
  { id: 'poses',      label: '練習體位',     hint: '今天練了哪些動作？' },
  { id: 'signals',    label: '身體感受',     hint: '練習後身體的感覺？' },
  { id: 'emotions',   label: '情緒狀態',     hint: '練習前後的心情？' },
  { id: 'completion', label: '完成度與能量', hint: '今天的狀況如何？' },
  { id: 'note',       label: '給自己的話',   hint: '想對自己說些什麼？' },
]

interface LogState extends Partial<YogaLog> {
  customPoses: string[]
  customBodySignals: string[]
  customEmotions: string[]
  customYogaTypes: string[]
  customGoals: string[]
  customLocation: string
}

const defaultLog = (): LogState => ({
  date: today(),
  startTime: currentTime(),
  durationMin: 30,
  location: '',
  yogaTypes: [],
  goals: [],
  poses: [],
  bodySignals: [],
  bodyParts: [],
  bodyNote: '',
  emotions: [],
  emotionNote: '',
  completionLevel: 80,
  energyBefore: 3,
  energyAfter: 3,
  note: '',
  isFavorite: false,
  customPoses: [],
  customBodySignals: [],
  customEmotions: [],
  customYogaTypes: [],
  customGoals: [],
  customLocation: '',
})

export function QuickLog() {
  const navigate = useNavigate()
  const [log, setLog] = useState<LogState>(defaultLog)
  const [openSection, setOpenSection] = useState<Section>('duration')
  const [isSaving, setIsSaving] = useState(false)
  const { addLog } = useLogStore()
  const { avatarState, addXP, addResources, addBadge } = useAppStore()
  const { logs } = useLogStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  function toggle(field: keyof YogaLog, value: string) {
    setLog(prev => {
      const arr = (prev[field] as string[]) || []
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  function addCustomTag(
    field: 'customPoses' | 'customBodySignals' | 'customEmotions' | 'customYogaTypes' | 'customGoals',
    value: string
  ) {
    setLog(prev => {
      const logField: keyof LogState =
        field === 'customPoses' ? 'poses' :
        field === 'customBodySignals' ? 'bodySignals' :
        field === 'customEmotions' ? 'emotions' :
        field === 'customYogaTypes' ? 'yogaTypes' : 'goals'
      const existing = (prev[logField] as string[]) || []
      return {
        ...prev,
        [field]: prev[field].includes(value) ? prev[field] : [...prev[field], value],
        [logField]: existing.includes(value) ? existing : [...existing, value],
      }
    })
  }

  function addCustomPoseFromPicker(poseName: string) {
    setLog(prev => ({
      ...prev,
      customPoses: prev.customPoses.includes(poseName) ? prev.customPoses : [...prev.customPoses, poseName],
      poses: !prev.poses?.includes(poseName) ? [...(prev.poses || []), poseName] : prev.poses,
    }))
  }

  async function handleSave() {
    setIsSaving(true)
    const allPoses = [...(log.poses || []), ...log.customPoses.filter(p => !log.poses?.includes(p))]
    const allSignals = [...(log.bodySignals || []), ...log.customBodySignals.filter(s => !log.bodySignals?.includes(s))]
    const allEmotions = [...(log.emotions || []), ...log.customEmotions.filter(e => !log.emotions?.includes(e))]

    const finalLog: Omit<YogaLog, 'id'> = {
      date: log.date!,
      startTime: log.startTime!,
      durationMin: log.durationMin!,
      location: log.customLocation || log.location || 'home',
      yogaTypes: log.yogaTypes!,
      goals: log.goals!,
      poses: allPoses,
      bodySignals: allSignals,
      bodyParts: log.bodyParts || [],
      bodyNote: log.bodyNote || '',
      emotions: allEmotions,
      emotionNote: log.emotionNote || '',
      completionLevel: log.completionLevel!,
      energyBefore: log.energyBefore!,
      energyAfter: log.energyAfter!,
      note: log.note!,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    }

    await addLog(finalLog)
    const { total } = calculateXP(finalLog)
    const { leaves, stars, petals } = calculateResources(finalLog)
    await addXP(total)
    await addResources(leaves, stars, petals)

    const allLogs = [...logs, finalLog as YogaLog]
    const updatedState = {
      ...avatarState,
      totalLogs: avatarState.totalLogs + 1,
      totalMinutes: avatarState.totalMinutes + finalLog.durationMin,
    }
    const newBadges = checkNewBadges(updatedState, allLogs)
    for (const b of newBadges) await addBadge(b)

    navigate('/completion', { state: { log: finalLog, xp: total } })
  }

  const isValid = log.durationMin! > 0

  function getCompletedCount(section: Section): number {
    switch (section) {
      case 'duration': return log.durationMin! > 0 ? 1 : 0
      case 'location': return (log.location || log.customLocation) ? 1 : 0
      case 'types': return (log.yogaTypes?.length || 0) + log.customYogaTypes.length
      case 'goals': return (log.goals?.length || 0) + log.customGoals.length
      case 'poses': return (log.poses?.length || 0) + log.customPoses.length
      case 'signals': return (log.bodySignals?.length || 0) + log.customBodySignals.length + (log.bodyParts?.length || 0)
      case 'emotions': return (log.emotions?.length || 0) + log.customEmotions.length
      case 'completion': return 1
      case 'note': return log.note ? 1 : 0
    }
  }

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-36">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-cream-100/95 backdrop-blur-sm border-b border-cream-200 px-4 py-3 pt-safe">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center text-warm-400"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="text-center">
            <h1 className="font-display font-semibold text-warm-600 text-base">記錄練習</h1>
            <p className="text-xs text-warm-300">{log.date}</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div ref={scrollRef} className="px-4 pt-4 space-y-2.5">
        {SECTIONS.map((section, idx) => {
          const count = getCompletedCount(section.id)
          return (
            <LogSection
              key={section.id}
              section={section}
              index={idx}
              isOpen={openSection === section.id}
              onToggle={() => setOpenSection(openSection === section.id ? 'duration' : section.id)}
              delay={idx * 0.04}
              completedCount={count}
            >
              {/* ── DURATION ── */}
              {section.id === 'duration' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map(d => (
                      <motion.button
                        key={d}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setLog(p => ({ ...p, durationMin: d }))}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all duration-200 min-h-[44px]
                          ${log.durationMin === d
                            ? 'bg-sage-300 text-white border-sage-300 shadow-soft'
                            : 'bg-white/70 text-warm-400 border-cream-200'
                          }`}
                      >
                        {d} 分
                      </motion.button>
                    ))}
                  </div>
                  <CustomTextInput
                    placeholder="自訂分鐘數"
                    type="number"
                    value={log.durationMin === DURATION_OPTIONS.find(d => d === log.durationMin) ? '' : String(log.durationMin || '')}
                    onChange={v => setLog(p => ({ ...p, durationMin: parseInt(v) || 30 }))}
                    suffix="分鐘"
                  />
                </div>
              )}

              {/* ── LOCATION ── */}
              {section.id === 'location' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {LOCATION_OPTIONS.map(l => (
                      <TagButton
                        key={l.id}
                        label={l.label}
                        selected={log.location === l.id && !log.customLocation}
                        onClick={() => setLog(p => ({ ...p, location: l.id, customLocation: '' }))}
                      />
                    ))}
                  </div>
                  <CustomTextInput
                    placeholder="自訂地點..."
                    value={log.customLocation}
                    onChange={v => setLog(p => ({ ...p, customLocation: v, location: v ? '' : p.location }))}
                  />
                </div>
              )}

              {/* ── YOGA TYPES ── */}
              {section.id === 'types' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {YOGA_TYPES.map(t => (
                      <TagButton
                        key={t.id}
                        label={t.label}
                        selected={log.yogaTypes?.includes(t.id)}
                        onClick={() => toggle('yogaTypes', t.id)}
                      />
                    ))}
                  </div>
                  <CustomTagInput
                    onAdd={v => addCustomTag('customYogaTypes', v)}
                    placeholder="自訂類型..."
                    existingCustom={log.customYogaTypes}
                  />
                </div>
              )}

              {/* ── GOALS ── */}
              {section.id === 'goals' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {GOALS.map(g => (
                      <TagButton
                        key={g.id}
                        label={g.label}
                        selected={log.goals?.includes(g.id)}
                        onClick={() => toggle('goals', g.id)}
                        color="blush"
                      />
                    ))}
                  </div>
                  <CustomTagInput
                    onAdd={v => addCustomTag('customGoals', v)}
                    placeholder="自訂目標..."
                    existingCustom={log.customGoals}
                    color="blush"
                  />
                </div>
              )}

              {/* ── POSES ── */}
              {section.id === 'poses' && (
                <PosePicker
                  selected={log.poses || []}
                  onToggle={id => toggle('poses', id)}
                  onAddCustom={addCustomPoseFromPicker}
                  customPoses={log.customPoses}
                />
              )}

              {/* ── BODY SIGNALS ── */}
              {section.id === 'signals' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-warm-400 mb-2">常見感受（可多選）</p>
                    <div className="flex flex-wrap gap-2">
                      {BODY_SIGNALS.map(s => (
                        <TagButton
                          key={s.id}
                          label={s.label}
                          selected={log.bodySignals?.includes(s.id)}
                          onClick={() => toggle('bodySignals', s.id)}
                          color="blush"
                          size="sm"
                        />
                      ))}
                    </div>
                    <div className="mt-2">
                      <CustomTagInput
                        onAdd={v => addCustomTag('customBodySignals', v)}
                        placeholder="自訂身體感受..."
                        existingCustom={log.customBodySignals}
                        color="blush"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-warm-500 mb-2">標記今天的身體部位</p>
                    <BodyPartSelector
                      selected={log.bodyParts || []}
                      onChange={parts => setLog(p => ({ ...p, bodyParts: parts }))}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-warm-400 mb-2">補充說明</p>
                    <textarea
                      value={log.bodyNote}
                      onChange={e => setLog(p => ({ ...p, bodyNote: e.target.value }))}
                      placeholder="今天身體有什麼特別的感受？"
                      rows={3}
                      maxLength={100}
                      className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-200 text-sm text-warm-600
                        placeholder-warm-200 focus:outline-none focus:border-sage-200 resize-none leading-relaxed"
                    />
                    <p className="text-right text-xs text-warm-300 mt-1">{(log.bodyNote || '').length}/100</p>
                  </div>
                </div>
              )}

              {/* ── EMOTIONS ── */}
              {section.id === 'emotions' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-warm-400 mb-2">今天的情緒（可多選）</p>
                    <div className="flex flex-wrap gap-2">
                      {EMOTIONS.map(e => (
                        <TagButton
                          key={e.id}
                          label={e.label}
                          selected={log.emotions?.includes(e.id)}
                          onClick={() => toggle('emotions', e.id)}
                          size="sm"
                        />
                      ))}
                    </div>
                    <div className="mt-2">
                      <CustomTagInput
                        onAdd={v => addCustomTag('customEmotions', v)}
                        placeholder="自訂情緒標籤..."
                        existingCustom={log.customEmotions}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-warm-400 mb-2">情緒補充說明</p>
                    <textarea
                      value={log.emotionNote}
                      onChange={e => setLog(p => ({ ...p, emotionNote: e.target.value }))}
                      placeholder="今天的心情怎麼樣？練習前後有什麼不一樣的感受嗎？"
                      rows={3}
                      maxLength={100}
                      className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-200 text-sm text-warm-600
                        placeholder-warm-200 focus:outline-none focus:border-sage-200 resize-none leading-relaxed"
                    />
                    <p className="text-right text-xs text-warm-300 mt-1">{(log.emotionNote || '').length}/100</p>
                  </div>
                </div>
              )}

              {/* ── COMPLETION & ENERGY ── */}
              {section.id === 'completion' && (
                <div className="space-y-5">
                  <CompletionSlider
                    value={log.completionLevel!}
                    onChange={v => setLog(p => ({ ...p, completionLevel: v }))}
                  />
                  <EnergyPicker
                    value={log.energyBefore!}
                    onChange={v => setLog(p => ({ ...p, energyBefore: v }))}
                    label="練習前的能量"
                  />
                  <EnergyPicker
                    value={log.energyAfter!}
                    onChange={v => setLog(p => ({ ...p, energyAfter: v }))}
                    label="練習後的能量"
                  />
                </div>
              )}

              {/* ── NOTE ── */}
              {section.id === 'note' && (
                <div>
                  <textarea
                    value={log.note}
                    onChange={e => setLog(p => ({ ...p, note: e.target.value }))}
                    placeholder="今天的練習有什麼感覺，或是想對自己說的話，都可以留在這裡。"
                    rows={5}
                    className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-200 text-sm text-warm-600
                      placeholder-warm-200 focus:outline-none focus:border-sage-200
                      resize-none leading-relaxed"
                  />
                  <p className="text-xs text-warm-300 mt-2 leading-relaxed">
                    這是給未來的你看的紀錄，不需要寫得很好，只要寫得真實。
                  </p>
                </div>
              )}
            </LogSection>
          )
        })}
      </div>

      {/* Sticky bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-cream-100/95 backdrop-blur-sm border-t border-cream-200 p-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 text-left">
            <p className="text-xs text-warm-400">
              {[
                log.durationMin ? `${log.durationMin}分鐘` : '',
                log.yogaTypes?.length ? log.yogaTypes.length + '種瑜伽' : '',
                ((log.poses?.length || 0) + log.customPoses.length) > 0 ? ((log.poses?.length || 0) + log.customPoses.length) + '個動作' : '',
              ].filter(Boolean).join('・') || '點選上方項目開始記錄'}
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleSave}
            disabled={!isValid || isSaving}
            className="shadow-soft-xl px-8"
          >
            {isSaving && (
              <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
              </motion.svg>
            )}
            完成紀錄
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}

/* ─── LogSection ──────────────────────────────────────────────────── */

function LogSection({
  section, isOpen, onToggle, children, delay, completedCount, index,
}: {
  section: { id: string; label: string; hint: string }
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  delay: number
  completedCount: number
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl border border-cream-200/60 shadow-soft overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left min-h-[56px]"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold transition-colors
            ${completedCount > 0 ? 'bg-sage-300 text-white' : 'bg-cream-200 text-warm-300'}`}>
            {completedCount > 0 ? '✓' : index + 1}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-warm-600 text-[13px] leading-tight">{section.label}</p>
            {!isOpen && (
              <p className="text-[11px] text-warm-300 leading-tight mt-0.5">{section.hint}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {completedCount > 0 && (
            <span className="text-[11px] bg-sage-50 text-sage-400 rounded-full px-2 py-0.5 font-medium">
              {completedCount}
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-warm-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── CustomTextInput ─────────────────────────────────────────────── */

function CustomTextInput({
  placeholder,
  value,
  onChange,
  suffix,
  type = 'text',
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  suffix?: string
  type?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 text-sm text-warm-500 placeholder-warm-200
          focus:outline-none focus:border-sage-200 min-h-[44px]"
      />
      {suffix && <span className="text-sm text-warm-300 flex-shrink-0">{suffix}</span>}
    </div>
  )
}
