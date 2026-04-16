import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AvatarSVG } from '../components/avatar/AvatarSVG'
import { BrandLogo } from '../components/ui/BrandLogo'
import { Button } from '../components/ui/Button'
import { useAppStore } from '../store/useAppStore'
import { AVATARS, STAGES } from '../data/avatars'
import type { AvatarId } from '../types'

export function Onboarding() {
  const [step, setStep] = useState(0)
  const [nickname, setNickname] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>('capybara')
  const navigate = useNavigate()
  const completeOnboarding = useAppStore(s => s.completeOnboarding)

  const steps = [
    <WelcomeStep key="welcome" onNext={() => setStep(1)} />,
    <NameStep key="name" value={nickname} onChange={setNickname} onNext={() => setStep(2)} />,
    <AvatarStep
      key="avatar"
      selected={selectedAvatar}
      onChange={setSelectedAvatar}
      onNext={() => setStep(3)}
    />,
    <ReadyStep
      key="ready"
      nickname={nickname}
      avatar={selectedAvatar}
      onStart={() => {
        completeOnboarding(nickname, selectedAvatar)
        navigate('/')
      }}
    />,
  ]

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-sage-100 opacity-50" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blush-100 opacity-40" />
        <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full bg-beige-100 opacity-50" />
      </div>

      {/* Step indicator */}
      {step > 0 && (
        <div className="flex justify-center gap-2 pt-safe pt-6 z-10">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? 'w-8 bg-sage-400' : 'w-4 bg-sage-200'
              }`}
            />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── Welcome Step ─────────────────────────────────────────────── */

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="px-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'backOut' }}
        className="flex justify-center mb-6"
      >
        <BrandLogo size={108} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h1 className="text-[22px] font-display font-bold text-warm-700 tracking-[0.18em] uppercase mb-2">
          Yoga Flow Journal
        </h1>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-sage-300 to-transparent mx-auto mb-3" />
        <p className="text-warm-400 text-sm leading-relaxed mb-1">你的每日回歸自我的旅程</p>
        <p className="text-warm-300 text-[13px] leading-relaxed">
          不是追蹤數據，而是與自己溫柔相遇
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-10"
      >
        <Button size="lg" fullWidth onClick={onNext}>
          開始我的瑜珈紀錄
        </Button>
      </motion.div>
    </div>
  )
}

/* ── Name Step ────────────────────────────────────────────────── */

function NameStep({ value, onChange, onNext }: {
  value: string; onChange: (v: string) => void; onNext: () => void
}) {
  return (
    <div className="px-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-semibold text-warm-600 mb-2">
          我該怎麼稱呼你？
        </h2>
        <p className="text-warm-400 text-sm">留下你喜歡的名字，或暱稱都可以</p>
      </div>

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="你的名字..."
        maxLength={20}
        className="w-full px-5 py-4 bg-white/80 border border-cream-200 rounded-2xl text-warm-600 placeholder-warm-200
          focus:outline-none focus:border-sage-300 focus:ring-2 focus:ring-sage-100 text-center text-lg mb-8"
      />

      <Button size="lg" fullWidth onClick={onNext} disabled={!value.trim()}>
        繼續 →
      </Button>
    </div>
  )
}

/* ── Avatar Step ──────────────────────────────────────────────── */

function AvatarStep({ selected, onChange, onNext }: {
  selected: AvatarId; onChange: (id: AvatarId) => void; onNext: () => void
}) {
  const current = AVATARS.find(a => a.id === selected)!

  return (
    <div className="px-5">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-display font-semibold text-warm-600 mb-1">
          選擇你的夥伴
        </h2>
        <p className="text-warm-400 text-sm">牠會陪你一起成長</p>
      </div>

      {/* Selected avatar + description */}
      <div className="flex flex-col items-center mb-4">
        <motion.div
          key={selected}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
        >
          <AvatarSVG id={selected} size={88} />
        </motion.div>
        <motion.div
          key={selected + 'text'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-2"
        >
          <p className="font-semibold text-warm-600 text-[15px]">{current.name} · {current.subtitle}</p>
          <p className="text-xs text-warm-400 mt-1 max-w-[240px] mx-auto leading-relaxed">{current.description}</p>
        </motion.div>
      </div>

      {/* Growth stages preview */}
      <GrowthStagesPreview avatarId={selected} />

      {/* Avatar grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-5 mt-4">
        {AVATARS.map(av => (
          <motion.button
            key={av.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(av.id)}
            className={`flex flex-col items-center py-3 px-2 rounded-2xl border-2 transition-all duration-200
              ${selected === av.id
                ? 'border-sage-400 bg-sage-50'
                : 'border-transparent bg-white/60'
              }`}
          >
            <AvatarSVG id={av.id} size={48} />
            <span className="text-[11px] text-warm-500 mt-1">{av.name}</span>
          </motion.button>
        ))}
      </div>

      <Button size="lg" fullWidth onClick={onNext}>
        就選牠了
      </Button>
    </div>
  )
}

/* ── Growth Stages Preview ────────────────────────────────────── */

function GrowthStagesPreview({ avatarId }: { avatarId: AvatarId }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5 px-1">
        <span className="text-[10px] font-bold text-warm-300 uppercase tracking-wider">成長旅程</span>
        <div className="flex-1 h-px bg-cream-200" />
      </div>
      <div className="flex gap-2 justify-center">
        {STAGES.map((stage, i) => {
          const isUnlocked = i === 0
          return (
            <div key={stage.id} className="flex flex-col items-center gap-1.5">
              <div
                className="relative rounded-2xl overflow-hidden flex-shrink-0"
                style={{ width: 52, height: 52 }}
              >
                <img
                  src={`/images/avatars/avatar_${avatarId}_${stage.id}.png`}
                  alt={stage.name}
                  className="w-full h-full object-cover"
                  style={{
                    filter: isUnlocked ? 'none' : 'blur(4px) brightness(0.65)',
                  }}
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {isUnlocked && (
                  <div className="absolute bottom-0 left-0 right-0 h-4 flex items-center justify-center"
                    style={{ background: 'linear-gradient(to top, rgba(143,175,143,0.5), transparent)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </div>
              <span className={`text-[9px] font-medium ${isUnlocked ? 'text-sage-500' : 'text-warm-300'}`}>
                {stage.name}
              </span>
              {!isUnlocked && (
                <span className="text-[8px] text-warm-200">{stage.minXp} XP</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Ready Step ───────────────────────────────────────────────── */

function ReadyStep({ nickname, avatar, onStart }: {
  nickname: string; avatar: AvatarId; onStart: () => void
}) {
  const def = AVATARS.find(a => a.id === avatar)!

  return (
    <div className="px-8 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="flex justify-center mb-4"
      >
        <div
          className="w-36 h-36 rounded-full flex items-center justify-center"
          style={{ backgroundColor: def.bgColor }}
        >
          <AvatarSVG id={avatar} size={110} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-display font-semibold text-warm-600 mb-2">
          準備好了，{nickname || '你'}
        </h2>
        <p className="text-warm-400 text-sm leading-relaxed mb-1">
          {def.name}很開心能陪你一起練習
        </p>
        <p className="text-warm-300 text-sm">
          「{def.emotionalTone}」將是你們共同的旅程
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-10"
      >
        <Button size="lg" fullWidth onClick={onStart}>
          開始我的瑜珈紀錄
        </Button>
      </motion.div>
    </div>
  )
}
