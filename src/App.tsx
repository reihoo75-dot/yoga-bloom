import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { BottomNav } from './components/ui/BottomNav'
import { Onboarding } from './pages/Onboarding'
import { Home } from './pages/Home'
import { QuickLog } from './pages/QuickLog'
import { Timeline } from './pages/Timeline'
import { Insights } from './pages/Insights'
import { AvatarGarden } from './pages/AvatarGarden'
import { Settings } from './pages/Settings'
import { CompletionScreen } from './pages/CompletionScreen'
import { useAppStore } from './store/useAppStore'

export function App() {
  const location = useLocation()
  const { settings, loadAvatarState } = useAppStore()

  useEffect(() => {
    loadAvatarState()
  }, [])

  const isOnboarding = !settings.onboardingComplete
  const isCompletion = location.pathname === '/completion'
  const isLog = location.pathname === '/log'
  const hideNav = isOnboarding || isCompletion || isLog

  if (isOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <div className="min-h-screen bg-cream-100 font-sans max-w-lg mx-auto relative">
      <Routes location={location} key={location.pathname}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Home />} />
        <Route path="/log" element={<QuickLog />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/garden" element={<AvatarGarden />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/completion" element={<CompletionScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideNav && <BottomNav />}
    </div>
  )
}
