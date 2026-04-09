import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TagButton } from '../components/ui/TagButton'
import { Button } from '../components/ui/Button'
import { EnergyPicker } from '../components/ui/EnergyPicker'
import { CompletionSlider } from '../components/ui/CompletionSlider'
import { PageTransition } from '../components/ui/PageTransition'
import { useLogStore } from '../store/useLogStore'
import { useAppStore } from '../store/useAppStore'
import {
  DURATION_OPTIONS, LOCATION_OPTIONS, YOGA_TYPES, GOALS,
  POSES, BODY_SIGNALS, EMOTIONS
} from '../data/options'
import { calculateXP, calculateResources, checkNewBadges } from '../utils/xp'
import { today, currentTime } from '../utils/date'
import type { YogaLog } from '../types'

type Section = 'duration' | 'location' | 'types' | 'goals' | 'poses' | 'signals' | 'emotions' | 'completion' | 'note'

const SECTIONS: { id: Section; label: string; emoji: string }[] = [
  { id: 'duration', label: '練習時長', emoji: '⏱️' },
  { id: 'location', label: '練習地點', emoji: '📍' },
  { id: 'types', label: '瑜伽類型', emoji: '🧘' },
  { id: 'goals', label: '練習目標', emoji: '🎯' },
  { id: 'poses', label: '練習動作', emoji: '🌿' },
  { id: 'signals', label: '身體感受', emoji: '💫' },
  { id: 'emotions', label: '情緒狀態', emoji: '🌊' },
  { id: 'completion', label: '完成度與能量', emoji: '⚡' },
  { id: 'note', label: '給自己的話', emoji: '📝' },
]

const defaultLog = (): Partial<YogaLog> => ({
  date: today(),
  startTime: currentTime(),
  durationMin: 30,
  location: '',
  yogaTypes: [],
  goals: [],
  poses: [],
  bodySignals: [],
  emotions: [],
  completionLevel: 80,
  energyBefore: 3,
  energyAfter: 3,
  note: '',
  isFavorite: false,
})

export function QuickLog() {
  const navigate = useNavigate()
  const [log, setLog] = useState(defaultLog)
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

  async function handleSave() {
    setIsSaving(true)
    const finalLog: Omit<YogaLog, 'id'> = {
      date: log.date!,
      startTime: log.startTime!,
      durationMin: log.durationMin!,
      location: log.location || 'home',
      yogaTypes: log.yogaTypes!,
      goals: log.goals!,
      poses: log.poses!,
      bodySignals: log.bodySignals!,
      emotions: log.emotions!,
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

    // Update stats and check badges
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

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-cream-100/95 backdrop-blur-sm border-b border-cream-200 px-5 py-4 pt-safe">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center text-warm-400"
          >
            ←
          </button>
          <h1 className="font-display font-semibold text-warm-600">記錄練習</h1>
          <div className="w-10" />
        </div>
      </div>

      <div ref={scrollRef} className="px-5 pt-4 space-y-3">
        {SECTIONS.map((section, idx) => (
          <LogSection
            key={section.id}
            section={section}
            isOpen={openSection === section.id}
            onToggle={() => setOpenSection(openSection === section.id ? 'duration' : section.id)}
            delay={idx * 0.04}
          >
            {section.id === 'duration' && (
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map(d => (
                  <motion.button
                    key={d}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setLog(p => ({ ...p, durationMin: d }))}
                    className={`px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all duration-200 min-h-[44px]
                      ${log.durationMin === d
                        ? 'bg-sage-400 text-white border-sage-400 shadow-glow scale-105'
                        : 'bg-white/70 text-warm-500 border-sage-100'
                      }`}
                  >
                    {d} 分
                  </motion.button>
                ))}
                <div className="flex items-center gap-2 mt-1 w-full">
                  <input
                    type="number"
                    placeholder="自訂分鐘"
                    min={1}
                    max={300}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-white/70 border border-sage-100 text-sm text-warm-500 focus:outline-none focus:border-sage-300"
                    onChange={e => setLog(p => ({ ...p, durationMin: parseInt(e.target.value) || 30 }))}
                  />
                </div>
              </div>
            )}

            {section.id === 'location' && (
              <div className="flex flex-wrap gap-2">
                {LOCATION_OPTIONS.map(l => (
                  <TagButton
                    key={l.id}
                    label={l.label}
                    icon={l.icon}
                    selected={log.location === l.id}
                    onClick={() => setLog(p => ({ ...p, location: l.id }))}
                  />
                ))}
              </div>
            )}

            {section.id === 'types' && (
              <div className="flex flex-wrap gap-2">
                {YOGA_TYPES.map(t => (
                  <TagButton
                    key={t.id}
                    label={t.label}
                    icon={t.icon}
                    selected={log.yogaTypes?.includes(t.id)}
                    onClick={() => toggle('yogaTypes', t.id)}
                  />
                ))}
              </div>
            )}

            {section.id === 'goals' && (
              <div className="flex flex-wrap gap-2">
                {GOALS.map(g => (
                  <TagButton
                    key={g.id}
                    label={g.label}
                    icon={g.icon}
                    selected={log.goals?.includes(g.id)}
                    onClick={() => toggle('goals', g.id)}
                    color="blush"
                  />
                ))}
              </div>
            )}

            {section.id === 'poses' && (
              <div className="flex flex-wrap gap-2">
                {POSES.map(p => (
                  <TagButton
                    key={p.id}
                    label={p.label}
                    icon={p.icon}
                    selected={log.poses?.includes(p.id)}
                    onClick={() => toggle('poses', p.id)}
                    color="beige"
                    size="sm"
                  />
                ))}
              </div>
            )}

            {section.id === 'signals' && (
              <div className="flex flex-wrap gap-2">
                {BODY_SIGNALS.map(s => (
                  <TagButton
                    key={s.id}
                    label={s.label}
                    icon={s.icon}
                    selected={log.bodySignals?.includes(s.id)}
                    onClick={() => toggle('bodySignals', s.id)}
                    color="blush"
                    size="sm"
                  />
                ))}
              </div>
            )}

            {section.id === 'emotions' && (
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map(e => (
                  <TagButton
                    key={e.id}
                    label={e.label}
                    icon={e.icon}
                    selected={log.emotions?.includes(e.id)}
                    onClick={() => toggle('emotions', e.id)}
                    size="sm"
                  />
                ))}
              </div>
            )}

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

            {section.id === 'note' && (
              <textarea
                value={log.note}
                onChange={e => setLog(p => ({ ...p, note: e.target.value }))}
                placeholder="今天有什麼感覺，想留給自己？"
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-cream-200 text-sm text-warm-600
                  placeholder-warm-200 focus:outline-none focus:border-sage-300 focus:ring-2 focus:ring-sage-50
                  resize-none leading-relaxed"
              />
            )}
          </LogSection>
        ))}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-cream-100/95 backdrop-blur-sm border-t border-cream-200 p-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
        <Button
          size="lg"
          fullWidth
          onClick={handleSave}
          disabled={!isValid || isSaving}
          className="shadow-soft-xl"
        >
          {isSaving ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              🌸
            </motion.span>
          ) : '🌸'}
          完成紀錄
        </Button>
      </div>
    </PageTransition>
  )
}

function LogSection({
  section,
  isOpen,
  onToggle,
  children,
  delay,
}: {
  section: { id: string; label: string; emoji: string }
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/80 shadow-soft overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left min-h-[56px]"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{section.emoji}</span>
          <span className="font-medium text-warm-600 text-sm">{section.label}</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-warm-300 text-sm"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
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
