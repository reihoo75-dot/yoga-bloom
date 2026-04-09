import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AvatarSVG } from '../components/avatar/AvatarSVG'
import { Button } from '../components/ui/Button'
import { useAppStore } from '../store/useAppStore'
import { AVATARS } from '../data/avatars'
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

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="px-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'backOut' }}
        className="mb-8"
      >
        <div className="text-7xl mb-4">🌸</div>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-sage-300 to-transparent mx-auto" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="text-3xl font-display font-semibold text-warm-600 mb-3">
          Yoga Bloom
        </h1>
        <p className="text-warm-400 leading-relaxed mb-2">你的每日回歸自我的旅程</p>
        <p className="text-warm-300 text-sm leading-relaxed">
          不是追蹤數據，而是與自己溫柔相遇
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-12"
      >
        <Button size="lg" fullWidth onClick={onNext}>
          開始我的旅程 🌱
        </Button>
      </motion.div>
    </div>
  )
}

function NameStep({ value, onChange, onNext }: {
  value: string; onChange: (v: string) => void; onNext: () => void
}) {
  return (
    <div className="px-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✨</div>
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

      <Button
        size="lg"
        fullWidth
        onClick={onNext}
        disabled={!value.trim()}
      >
        繼續 →
      </Button>
    </div>
  )
}

function AvatarStep({ selected, onChange, onNext }: {
  selected: AvatarId; onChange: (id: AvatarId) => void; onNext: () => void
}) {
  const current = AVATARS.find(a => a.id === selected)!

  return (
    <div className="px-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🐾</div>
        <h2 className="text-2xl font-display font-semibold text-warm-600 mb-1">
          選擇你的夥伴
        </h2>
        <p className="text-warm-400 text-sm">牠會陪你一起成長</p>
      </div>

      {/* Selected avatar display */}
      <div className="flex flex-col items-center mb-6">
        <motion.div
          key={selected}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
        >
          <AvatarSVG id={selected} size={100} />
        </motion.div>
        <motion.div
          key={selected + 'text'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-2"
        >
          <p className="font-medium text-warm-600">{current.name} · {current.subtitle}</p>
          <p className="text-xs text-warm-400 mt-1 max-w-[240px] mx-auto">{current.description}</p>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {AVATARS.map(av => (
          <motion.button
            key={av.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(av.id)}
            className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200
              ${selected === av.id
                ? 'border-sage-400 bg-sage-50'
                : 'border-transparent bg-white/60 hover:bg-white/90'
              }`}
          >
            <AvatarSVG id={av.id} size={52} />
            <span className="text-xs text-warm-500 mt-1">{av.name}</span>
          </motion.button>
        ))}
      </div>

      <Button size="lg" fullWidth onClick={onNext}>
        就選牠了 🌟
      </Button>
    </div>
  )
}

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
          準備好了，{nickname || '你'} 🌸
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
          開始旅程 ✨
        </Button>
      </motion.div>
    </div>
  )
}
