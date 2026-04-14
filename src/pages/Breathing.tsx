import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { addBreathingSession } from '../db'

// ─── Mode definitions ──────────────────────────────────────────────────────

type BreathingMode = 'box' | 'calm' | 'energize'
type Phase = 'inhale' | 'hold_in' | 'exhale' | 'hold_out'

interface ModeConfig {
  id: BreathingMode
  label: string
  description: string
  emoji: string
  color: string
  ringColor: string
  glowColor: string
  phases: { phase: Phase; label: string; durationSec: number }[]
}

const MODES: ModeConfig[] = [
  {
    id: 'box',
    label: '方形呼吸',
    description: '4-4-4-4，穩定專注，釋放壓力',
    emoji: '⬜',
    color: 'from-sage-100 to-sage-200',
    ringColor: 'border-sage-400',
    glowColor: '#8FAF8F',
    phases: [
      { phase: 'inhale',   label: '吸氣',  durationSec: 4 },
      { phase: 'hold_in',  label: '屏息',  durationSec: 4 },
      { phase: 'exhale',   label: '呼氣',  durationSec: 4 },
      { phase: 'hold_out', label: '屏息',  durationSec: 4 },
    ],
  },
  {
    id: 'calm',
    label: '平靜呼吸',
    description: '4-7-8，深度放鬆，幫助入睡',
    emoji: '🌙',
    color: 'from-blush-50 to-blush-100',
    ringColor: 'border-blush-300',
    glowColor: '#EDB0B8',
    phases: [
      { phase: 'inhale',   label: '吸氣',  durationSec: 4 },
      { phase: 'hold_in',  label: '屏息',  durationSec: 7 },
      { phase: 'exhale',   label: '呼氣',  durationSec: 8 },
    ],
  },
  {
    id: 'energize',
    label: '活力呼吸',
    description: '6-2-4，提振精神，增加能量',
    emoji: '⚡',
    color: 'from-beige-50 to-beige-100',
    ringColor: 'border-beige-400',
    glowColor: '#D4B896',
    phases: [
      { phase: 'inhale',   label: '吸氣',  durationSec: 6 },
      { phase: 'hold_in',  label: '屏息',  durationSec: 2 },
      { phase: 'exhale',   label: '呼氣',  durationSec: 4 },
    ],
  },
]

function getCycleLength(mode: ModeConfig) {
  return mode.phases.reduce((s, p) => s + p.durationSec, 0)
}

function getPhaseFromElapsed(mode: ModeConfig, elapsedInCycle: number) {
  let acc = 0
  for (const p of mode.phases) {
    acc += p.durationSec
    if (elapsedInCycle < acc) {
      const phaseElapsed = elapsedInCycle - (acc - p.durationSec)
      return { ...p, remaining: p.durationSec - phaseElapsed }
    }
  }
  return { ...mode.phases[0], remaining: mode.phases[0].durationSec }
}

// ─── Orb scale per phase ───────────────────────────────────────────────────

const ORB_SCALE: Record<Phase, number> = {
  inhale: 1.35,
  hold_in: 1.35,
  exhale: 0.7,
  hold_out: 0.7,
}

// ─── Component ────────────────────────────────────────────────────────────

export function Breathing() {
  const navigate = useNavigate()
  const [selectedMode, setSelectedMode] = useState<BreathingMode>('box')
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)

  // Timer state stored in ref to avoid stale closure
  const elapsedRef = useRef(0)
  const cyclesRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<string>('')
  const startDateRef = useRef<string>('')

  // Reactive display state
  const [displayPhase, setDisplayPhase] = useState<{ label: string; remaining: number; phase: Phase }>({
    label: '準備好了嗎？', remaining: 0, phase: 'inhale',
  })
  const [displayCycles, setDisplayCycles] = useState(0)
  const [displayElapsed, setDisplayElapsed] = useState(0)

  const mode = MODES.find(m => m.id === selectedMode)!

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleStart = () => {
    elapsedRef.current = 0
    cyclesRef.current = 0
    const now = new Date()
    startDateRef.current = now.toISOString().slice(0, 10)
    startTimeRef.current = now.toTimeString().slice(0, 5)
    setDisplayElapsed(0)
    setDisplayCycles(0)
    setRunning(true)
    setFinished(false)
  }

  const handleStop = async () => {
    stopTimer()
    setRunning(false)

    // Save session if at least one full cycle completed
    if (cyclesRef.current > 0) {
      await addBreathingSession({
        date: startDateRef.current,
        startTime: startTimeRef.current,
        durationSec: elapsedRef.current,
        mode: selectedMode,
        cyclesCompleted: cyclesRef.current,
        createdAt: new Date().toISOString(),
      })
      setFinished(true)
    }
  }

  // Timer tick every 100ms for smooth countdown
  useEffect(() => {
    if (!running) return

    const cycleLen = getCycleLength(mode)

    intervalRef.current = setInterval(() => {
      elapsedRef.current += 0.1
      const elapsed = elapsedRef.current
      const elapsedInCycle = elapsed % cycleLen
      const cycles = Math.floor(elapsed / cycleLen)

      // Detect completed cycle
      if (cycles > cyclesRef.current) {
        cyclesRef.current = cycles
        setDisplayCycles(cycles)
      }

      const phaseInfo = getPhaseFromElapsed(mode, elapsedInCycle)
      setDisplayPhase({
        label: phaseInfo.label,
        remaining: Math.ceil(phaseInfo.remaining),
        phase: phaseInfo.phase,
      })
      setDisplayElapsed(Math.floor(elapsed))
    }, 100)

    return () => stopTimer()
  }, [running, mode, stopTimer])

  const orbScale = running ? ORB_SCALE[displayPhase.phase] : 1
  const phaseDuration = running
    ? mode.phases.find(p => p.phase === displayPhase.phase)?.durationSec ?? 1
    : 1

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-cream-200 text-warm-400">
          ‹
        </button>
        <h1 className="text-lg font-semibold text-warm-600">呼吸練習</h1>
      </div>

      {/* Mode selector */}
      <AnimatePresence>
        {!running && !finished && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-4 mb-2"
          >
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMode(m.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-medium transition-all duration-200
                    ${selectedMode === m.id
                      ? 'bg-white border-sage-300 text-sage-600 shadow-sm'
                      : 'bg-white/60 border-cream-200 text-warm-400'
                    }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Mode description */}
            <p className="text-xs text-warm-400 text-center mt-3">{mode.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orb area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">
        {/* Animated orb */}
        <div className="relative flex items-center justify-center">
          {/* Glow rings */}
          {running && (
            <>
              <motion.div
                className="absolute rounded-full"
                style={{ backgroundColor: mode.glowColor, opacity: 0.12 }}
                animate={{ width: orbScale * 200 + 40, height: orbScale * 200 + 40 }}
                transition={{ duration: phaseDuration, ease: displayPhase.phase === 'inhale' ? 'easeInOut' : 'easeInOut' }}
              />
              <motion.div
                className="absolute rounded-full"
                style={{ backgroundColor: mode.glowColor, opacity: 0.08 }}
                animate={{ width: orbScale * 200 + 80, height: orbScale * 200 + 80 }}
                transition={{ duration: phaseDuration, ease: 'easeInOut', delay: 0.1 }}
              />
            </>
          )}

          {/* Main orb */}
          <motion.div
            className={`rounded-full bg-gradient-to-br ${mode.color} border-4 ${mode.ringColor} flex items-center justify-center shadow-lg`}
            style={{ width: 200, height: 200 }}
            animate={{ scale: orbScale }}
            transition={{ duration: phaseDuration, ease: 'easeInOut' }}
          >
            {running ? (
              <div className="text-center">
                <p className="text-4xl font-light text-warm-600 leading-none">{displayPhase.remaining}</p>
                <p className="text-sm text-warm-400 mt-1">{displayPhase.label}</p>
              </div>
            ) : finished ? (
              <div className="text-center px-4">
                <p className="text-3xl">✨</p>
                <p className="text-sm font-medium text-warm-600 mt-1">完成了！</p>
              </div>
            ) : (
              <div className="text-center px-4">
                <p className="text-3xl">{mode.emoji}</p>
                <p className="text-xs text-warm-400 mt-2">{mode.label}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Stats row */}
        {(running || finished) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-8"
          >
            <div className="text-center">
              <p className="text-2xl font-light text-warm-600">{displayCycles}</p>
              <p className="text-xs text-warm-300">完成循環</p>
            </div>
            <div className="w-px h-8 bg-cream-200" />
            <div className="text-center">
              <p className="text-2xl font-light text-warm-600">{formatTime(displayElapsed)}</p>
              <p className="text-xs text-warm-300">練習時長</p>
            </div>
          </motion.div>
        )}

        {/* Phase guide — show all phases */}
        {running && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1"
          >
            {mode.phases.map((p, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-300
                  ${displayPhase.phase === p.phase
                    ? 'bg-warm-100 text-warm-600 font-medium'
                    : 'text-warm-300'
                  }`}>
                  <span>{p.label}</span>
                  <span className="opacity-60">{p.durationSec}s</span>
                </div>
                {i < mode.phases.length - 1 && (
                  <span className="text-warm-200 text-xs">›</span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="px-6 pb-10 space-y-3">
        {finished ? (
          <>
            <div className="bg-white rounded-3xl p-4 text-center border border-cream-200">
              <p className="text-sm text-warm-500 font-medium">練習已記錄 🎉</p>
              <p className="text-xs text-warm-300 mt-1">
                {displayCycles} 個循環 · {formatTime(displayElapsed)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setFinished(false); setDisplayElapsed(0); setDisplayCycles(0) }}
                className="flex-1 py-3.5 rounded-2xl border border-cream-200 bg-white text-warm-500 font-medium text-sm"
              >
                再練一次
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3.5 rounded-2xl bg-sage-400 text-white font-medium text-sm"
              >
                返回首頁
              </button>
            </div>
          </>
        ) : running ? (
          <button
            onClick={handleStop}
            className="w-full py-4 rounded-3xl bg-white border border-cream-200 text-warm-500 font-medium text-sm shadow-sm"
          >
            結束練習
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-3xl bg-sage-400 text-white font-semibold text-base shadow-md active:scale-95 transition-transform"
          >
            開始練習
          </button>
        )}
      </div>
    </div>
  )
}
