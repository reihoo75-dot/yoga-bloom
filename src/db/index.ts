import Dexie, { type Table } from 'dexie'
import type { YogaLog, AvatarState } from '../types'

class YogaBloomDB extends Dexie {
  logs!: Table<YogaLog, number>
  avatarState!: Table<AvatarState & { id: number }, number>

  constructor() {
    super('YogaBloomDB')
    this.version(1).stores({
      logs: '++id, date, createdAt, isFavorite',
      avatarState: 'id',
    })
  }
}

export const db = new YogaBloomDB()

// --- Logs ---
export async function addLog(log: Omit<YogaLog, 'id'>): Promise<number> {
  return await db.logs.add(log as YogaLog)
}

export async function updateLog(id: number, changes: Partial<YogaLog>): Promise<void> {
  await db.logs.update(id, changes)
}

export async function deleteLog(id: number): Promise<void> {
  await db.logs.delete(id)
}

export async function getAllLogs(): Promise<YogaLog[]> {
  return await db.logs.orderBy('createdAt').reverse().toArray()
}

export async function getLogsByDateRange(start: string, end: string): Promise<YogaLog[]> {
  return await db.logs
    .where('date')
    .between(start, end, true, true)
    .reverse()
    .toArray()
}

export async function getLogByDate(date: string): Promise<YogaLog[]> {
  return await db.logs.where('date').equals(date).toArray()
}

export async function toggleFavorite(id: number, current: boolean): Promise<void> {
  await db.logs.update(id, { isFavorite: !current })
}

// --- Avatar State ---
const AVATAR_STATE_ID = 1

export async function getAvatarState(): Promise<AvatarState | null> {
  const record = await db.avatarState.get(AVATAR_STATE_ID)
  if (!record) return null
  const { id: _id, ...state } = record
  return state
}

export async function saveAvatarState(state: AvatarState): Promise<void> {
  await db.avatarState.put({ ...state, id: AVATAR_STATE_ID })
}

// --- Export / Import ---
export async function exportAllData(): Promise<string> {
  const logs = await getAllLogs()
  const avatarState = await getAvatarState()
  return JSON.stringify({ logs, avatarState, exportedAt: new Date().toISOString() }, null, 2)
}

export async function importAllData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString)
  if (data.logs && Array.isArray(data.logs)) {
    await db.logs.clear()
    await db.logs.bulkAdd(data.logs)
  }
  if (data.avatarState) {
    await saveAvatarState(data.avatarState)
  }
}

export async function clearAllData(): Promise<void> {
  await db.logs.clear()
  await db.avatarState.clear()
}

// --- CSV Export ---
export async function exportAsCSV(): Promise<string> {
  const logs = await getAllLogs()
  const headers = [
    'id',
    'date',
    'startTime',
    'durationMin',
    'location',
    'yogaTypes',
    'goals',
    'poses',
    'bodySignals',
    'emotions',
    'completionLevel',
    'energyBefore',
    'energyAfter',
    'note',
    'isFavorite',
    'createdAt',
  ]

  const rows = logs.map(log => [
    log.id ?? '',
    log.date,
    log.startTime,
    log.durationMin,
    log.location,
    log.yogaTypes.join(';'),
    log.goals.join(';'),
    log.poses.join(';'),
    log.bodySignals.join(';'),
    log.emotions.join(';'),
    log.completionLevel,
    log.energyBefore,
    log.energyAfter,
    `"${(log.note ?? '').replace(/"/g, '""')}"`,
    log.isFavorite,
    log.createdAt,
  ])

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}