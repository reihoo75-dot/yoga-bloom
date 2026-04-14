import { create } from 'zustand'
import type { UserSettings, AvatarState, AvatarId, StageId, SpecialState } from '../types'
import { STAGES } from '../data/avatars'
import { getAvatarState, saveAvatarState, getSpecialStateByDate, saveSpecialState } from '../db'

const SETTINGS_KEY = 'yoga_bloom_settings'

const defaultSettings: UserSettings = {
  nickname: '',
  avatar: 'capybara',
  theme: 'sage',
  reminderTime: '',
  onboardingComplete: false,
}

const defaultAvatarState: AvatarState = {
  xp: 0,
  level: 1,
  stage: 1,
  totalLogs: 0,
  totalMinutes: 0,
  resources: { leaves: 0, stars: 0, petals: 0 },
  badges: [],
}

function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultSettings
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    return defaultSettings
  }
}

function persistSettings(settings: UserSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

function computeStage(xp: number): StageId {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (xp >= STAGES[i].minXp) return STAGES[i].id
  }
  return 1
}

interface AppStore {
  settings: UserSettings
  avatarState: AvatarState
  pendingXP: number // for animation
  isLoaded: boolean
  todaySpecialState: SpecialState | null

  updateSettings: (partial: Partial<UserSettings>) => void
  setAvatar: (id: AvatarId) => void
  completeOnboarding: (nickname: string, avatar: AvatarId) => void

  loadAvatarState: () => Promise<void>
  addXP: (amount: number) => Promise<{ gained: number; newXP: number; leveledUp: boolean }>
  addResources: (leaves: number, stars: number, petals: number) => Promise<void>
  addBadge: (badge: string) => Promise<void>
  clearPendingXP: () => void

  loadTodaySpecialState: (date: string) => Promise<void>
  setTodaySpecialState: (state: SpecialState) => Promise<void>
  clearTodaySpecialState: (date: string) => Promise<void>
}

export const useAppStore = create<AppStore>((set, get) => ({
  settings: loadSettings(),
  avatarState: defaultAvatarState,
  pendingXP: 0,
  isLoaded: false,
  todaySpecialState: null,

  updateSettings: (partial) => {
    const next = { ...get().settings, ...partial }
    persistSettings(next)
    set({ settings: next })
  },

  setAvatar: (id) => {
    get().updateSettings({ avatar: id })
  },

  completeOnboarding: (nickname, avatar) => {
    get().updateSettings({ nickname, avatar, onboardingComplete: true })
  },

  loadAvatarState: async () => {
    const state = await getAvatarState()
    set({ avatarState: state ?? defaultAvatarState, isLoaded: true })
  },

  addXP: async (amount) => {
    const current = get().avatarState
    const newXP = current.xp + amount
    const newStage = computeStage(newXP)
    const leveledUp = newStage > current.stage
    const next: AvatarState = {
      ...current,
      xp: newXP,
      stage: newStage,
      level: newStage,
    }
    await saveAvatarState(next)
    set({ avatarState: next, pendingXP: amount })
    return { gained: amount, newXP, leveledUp }
  },

  addResources: async (leaves, stars, petals) => {
    const current = get().avatarState
    const next: AvatarState = {
      ...current,
      resources: {
        leaves: current.resources.leaves + leaves,
        stars: current.resources.stars + stars,
        petals: current.resources.petals + petals,
      },
    }
    await saveAvatarState(next)
    set({ avatarState: next })
  },

  addBadge: async (badge) => {
    const current = get().avatarState
    if (current.badges.includes(badge as never)) return
    const next: AvatarState = {
      ...current,
      badges: [...current.badges, badge as never],
    }
    await saveAvatarState(next)
    set({ avatarState: next })
  },

  clearPendingXP: () => set({ pendingXP: 0 }),

  loadTodaySpecialState: async (date) => {
    const state = await getSpecialStateByDate(date)
    set({ todaySpecialState: state })
  },

  setTodaySpecialState: async (state) => {
    await saveSpecialState(state)
    set({ todaySpecialState: state })
  },

  clearTodaySpecialState: async (date) => {
    const { deleteSpecialState } = await import('../db')
    await deleteSpecialState(date)
    set({ todaySpecialState: null })
  },
}))
