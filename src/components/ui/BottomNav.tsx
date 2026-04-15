import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { to: '/',          label: '首頁', icon: HomeIcon },
  { to: '/log',       label: '記錄', icon: LogIcon },
  { to: '/timeline',  label: '日誌', icon: TimelineIcon },
  { to: '/insights',  label: '洞察', icon: InsightsIcon },
  { to: '/partners',  label: '商家', icon: PartnersIcon },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-cream-200"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)' }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto px-1" style={{ height: 56 }}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex-1"
          >
            {({ isActive }) => (
              <div className={`h-full flex flex-col items-center justify-center transition-colors duration-200 ${isActive ? 'text-sage-500' : 'text-warm-300'}`}>
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`w-10 h-7 flex items-center justify-center rounded-xl mb-0.5 transition-colors duration-200 ${isActive ? 'bg-sage-50' : 'bg-transparent'}`}
                >
                  <Icon active={isActive} />
                </motion.div>
                <span className="text-[10px] font-medium leading-none tracking-wide select-none block">
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

/* ─── Icons (24 × 24) ─────────────────────────────────────────── */

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-[22px] h-[22px] relative z-10" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l9-9 9 9" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} />
      <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}
        fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.12 : 0}
      />
    </svg>
  )
}

function LogIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-[22px] h-[22px] relative z-10" fill="none" viewBox="0 0 24 24" strokeLinecap="round">
      <rect x="4" y="3" width="16" height="18" rx="3"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}
        fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.1 : 0}
      />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} />
    </svg>
  )
}

function TimelineIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-[22px] h-[22px] relative z-10" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} />
      <circle cx="4" cy="6"  r="1.5" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? 'currentColor' : 'none'} />
      <circle cx="4" cy="12" r="1.5" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? 'currentColor' : 'none'} />
      <circle cx="4" cy="18" r="1.5" stroke="currentColor" strokeWidth={active ? 2 : 1.5} fill={active ? 'currentColor' : 'none'} />
    </svg>
  )
}

function InsightsIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-[22px] h-[22px] relative z-10" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V14" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} />
      <path d="M9 20V8"  stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} />
      <path d="M14 20V12" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} />
      <path d="M19 20V5" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} />
    </svg>
  )
}

function PartnersIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-[22px] h-[22px] relative z-10" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1-5h16l1 5" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} />
      <rect x="2" y="9" width="20" height="2" rx="1" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.7} fillOpacity={active ? 0.15 : 0} />
      <path d="M5 11v8a1 1 0 001 1h12a1 1 0 001-1v-8" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} />
      <path d="M9 11v9M15 11v9" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} opacity="0.5" />
    </svg>
  )
}
