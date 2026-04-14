import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { to: '/', label: '首頁', icon: HomeIcon },
  { to: '/log', label: '記錄', icon: LogIcon },
  { to: '/timeline', label: '日誌', icon: TimelineIcon },
  { to: '/insights', label: '洞察', icon: InsightsIcon },
  { to: '/breathing', label: '呼吸', icon: BreathingIcon },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-cream-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-[52px] min-h-[52px] rounded-2xl transition-all duration-200
              ${isActive ? 'text-sage-500' : 'text-warm-300'}`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 -m-1.5 bg-sage-50 rounded-xl"
                    />
                  )}
                  <Icon active={isActive} />
                </motion.div>
                <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-sage-500' : 'text-warm-300'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24">
      <path d={active
        ? 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10'
        : 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10'}
        stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}
      />
    </svg>
  )
}

function LogIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"
        stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}
        fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}
      />
      <path d="M12 8v4l3 3" stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round"
      />
    </svg>
  )
}

function TimelineIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function InsightsIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24">
      <path d="M3 18l4-8 4 6 3-4 3 6" stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round"
      />
      <rect x="3" y="3" width="18" height="18" rx="3"
        stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}
        fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.1 : 0}
      />
    </svg>
  )
}

function BreathingIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"
        stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}
        fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.18 : 0}
      />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41"
        stroke="currentColor" strokeWidth={active ? 2 : 1.6}
        strokeLinecap="round"
      />
    </svg>
  )
}
