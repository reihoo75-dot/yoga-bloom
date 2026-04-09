import { create } from 'zustand'
import type { YogaLog } from '../types'
import { getAllLogs, addLog as dbAddLog, updateLog, deleteLog, toggleFavorite } from '../db'

interface LogStore {
  logs: YogaLog[]
  isLoading: boolean
  lastAdded: YogaLog | null

  loadLogs: () => Promise<void>
  addLog: (log: Omit<YogaLog, 'id'>) => Promise<number>
  editLog: (id: number, changes: Partial<YogaLog>) => Promise<void>
  removeLog: (id: number) => Promise<void>
  toggleFav: (id: number) => Promise<void>
}

export const useLogStore = create<LogStore>((set, get) => ({
  logs: [],
  isLoading: false,
  lastAdded: null,

  loadLogs: async () => {
    set({ isLoading: true })
    const logs = await getAllLogs()
    set({ logs, isLoading: false })
  },

  addLog: async (log) => {
    const id = await dbAddLog(log)
    const newLog = { ...log, id }
    set((state) => ({
      logs: [newLog, ...state.logs],
      lastAdded: newLog,
    }))
    return id
  },

  editLog: async (id, changes) => {
    await updateLog(id, changes)
    set((state) => ({
      logs: state.logs.map((l) => (l.id === id ? { ...l, ...changes } : l)),
    }))
  },

  removeLog: async (id) => {
    await deleteLog(id)
    set((state) => ({ logs: state.logs.filter((l) => l.id !== id) }))
  },

  toggleFav: async (id) => {
    const log = get().logs.find((l) => l.id === id)
    if (!log) return
    await toggleFavorite(id, log.isFavorite)
    set((state) => ({
      logs: state.logs.map((l) =>
        l.id === id ? { ...l, isFavorite: !l.isFavorite } : l
      ),
    }))
  },
}))
