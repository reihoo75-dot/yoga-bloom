export interface YogaLog {
  id?: number
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  durationMin: number
  location: string
  yogaTypes: string[]
  goals: string[]
  poses: string[]           // preset + custom pose ids/names
  bodySignals: string[]     // preset + custom signals
  bodyParts: string[]       // body regions selected from figure
  bodyNote: string          // free text body feeling note
  emotions: string[]        // preset + custom emotions
  emotionNote: string       // free text emotion note
  completionLevel: number   // 0-100
  energyBefore: number      // 1-5
  energyAfter: number       // 1-5
  note: string
  isFavorite: boolean
  createdAt: string
}

export interface UserSettings {
  nickname: string
  avatar: AvatarId
  theme: ThemeId
  reminderTime: string
  onboardingComplete: boolean
}

export interface AvatarState {
  xp: number
  level: number
  stage: StageId
  totalLogs: number
  totalMinutes: number
  resources: {
    leaves: number
    stars: number
    petals: number
  }
  badges: BadgeId[]
}

export type AvatarId = 'capybara' | 'deer' | 'fox' | 'cat' | 'seal' | 'bunny'
export type ThemeId = 'sage' | 'blush' | 'warm'
export type StageId = 1 | 2 | 3 | 4 | 5
export type BadgeId =
  | 'first_log'
  | 'streak_7'
  | 'streak_30'
  | 'logs_10'
  | 'logs_50'
  | 'logs_100'
  | 'minutes_500'
  | 'minutes_1000'
  | 'all_types'
  | 'explorer'
  | 'night_owl'
  | 'early_bird'

export interface AvatarDef {
  id: AvatarId
  name: string
  subtitle: string
  personality: string
  description: string
  emotionalTone: string
  color: string
  bgColor: string
}

export interface StageDef {
  id: StageId
  name: string
  minXp: number
  maxXp: number
  description: string
}

export interface InsightResult {
  type: 'suggestion' | 'pattern' | 'celebration'
  message: string
  icon: string
}

export type InsightPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year'

export interface PoseDef {
  id: string
  name: string           // Chinese name
  nameEn: string         // English name
  icon: string           // emoji
  image?: string         // path to actual image (optional)
  description: string    // short description
  bodyParts: string[]    // which body parts this targets
  category: 'standing' | 'floor' | 'seated' | 'inversion' | 'balance' | 'restorative' | 'prone'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface BodyPartDef {
  id: string
  label: string
  recommendedPoses: string[]  // pose ids
}

export interface MonthlyTheme {
  month: number          // 1-12
  name: string           // theme name
  description: string    // short description
  messages: string[]     // encouragement messages pool
  color: string          // tailwind color key
}

// ─── Daily Intention Cards ─────────────────────────────────────────────────

export type BodyStateIndex = 0 | 1 | 2 | 3 | 4
export type MindStateIndex = 0 | 1 | 2 | 3 | 4

export interface StateCard {
  text: string
  task: string
}

export interface DailyCardSelection {
  date: string
  bodyIndex: BodyStateIndex
  mindIndex: MindStateIndex
  variant: number        // 0 | 1 | 2
}

// ─── Breathing ────────────────────────────────────────────────────────────

export type BreathingMode = 'box' | 'calm' | 'energize'

export interface BreathingSession {
  id?: number
  date: string            // YYYY-MM-DD
  startTime: string       // HH:mm
  durationSec: number
  mode: BreathingMode
  cyclesCompleted: number
  createdAt: string
}

// ─── Special States ────────────────────────────────────────────────────────

export type SpecialStateType = 'menstrual' | 'cold' | 'fatigue' | 'poor_sleep'

export interface SpecialState {
  id?: number
  date: string            // YYYY-MM-DD
  states: SpecialStateType[]
  note: string
  updatedAt: string
}
