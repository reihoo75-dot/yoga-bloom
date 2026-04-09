import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AvatarSVG } from '../components/avatar/AvatarSVG'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageTransition } from '../components/ui/PageTransition'
import { useAppStore } from '../store/useAppStore'
import { AVATARS } from '../data/avatars'
import { exportAllData, importAllData, exportAsCSV, clearAllData } from '../db'
import type { AvatarId } from '../types'

export function Settings() {
  const { settings, updateSettings } = useAppStore()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [message, setMessage] = useState('')
  const [nickname, setNickname] = useState(settings.nickname)

  async function handleExportJSON() {
    const data = await exportAllData()
    download(data, 'yoga-bloom-backup.json', 'application/json')
    flash('已匯出 JSON ✓')
  }

  async function handleExportCSV() {
    const data = await exportAsCSV()
    download(data, 'yoga-bloom-logs.csv', 'text/csv;charset=utf-8;')
    flash('已匯出 CSV ✓')
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        await importAllData(text)
        flash('匯入成功！請重新整理頁面 ✓')
      } catch {
        flash('匯入失敗，請確認檔案格式')
      }
    }
    input.click()
  }

  async function handleClear() {
    await clearAllData()
    localStorage.removeItem('yoga_bloom_settings')
    setShowClearConfirm(false)
    flash('資料已清除，請重新整理頁面')
  }

  function download(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function flash(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <PageTransition className="min-h-screen bg-cream-100 pb-24">
      <div className="px-5 pt-safe">
        <div className="pt-8 pb-4">
          <h1 className="font-display font-semibold text-warm-600 text-lg">設定</h1>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-sage-400 text-white px-5 py-2.5 rounded-full text-sm shadow-soft-lg"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile */}
        <Card animate className="p-4 mb-3" delay={0.05}>
          <p className="text-xs font-medium text-warm-400 mb-3">個人資料</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-warm-400 block mb-1">暱稱</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  maxLength={20}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 text-sm text-warm-600
                    focus:outline-none focus:border-sage-300"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    updateSettings({ nickname })
                    flash('已儲存 ✓')
                  }}
                >
                  儲存
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Avatar selection */}
        <Card animate className="p-4 mb-3" delay={0.1}>
          <p className="text-xs font-medium text-warm-400 mb-3">選擇夥伴</p>
          <div className="grid grid-cols-3 gap-2">
            {AVATARS.map(av => (
              <motion.button
                key={av.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => updateSettings({ avatar: av.id as AvatarId })}
                className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200
                  ${settings.avatar === av.id
                    ? 'border-sage-400 bg-sage-50'
                    : 'border-transparent bg-cream-50'
                  }`}
              >
                <AvatarSVG id={av.id} size={52} />
                <span className="text-xs text-warm-500 mt-1">{av.name}</span>
                <span className="text-[10px] text-warm-300">{av.subtitle}</span>
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Theme */}
        <Card animate className="p-4 mb-3" delay={0.15}>
          <p className="text-xs font-medium text-warm-400 mb-3">主題色調</p>
          <div className="flex gap-3">
            {[
              { id: 'sage', label: '鼠尾草', color: '#8FAF8F', bg: '#F0F5F0' },
              { id: 'blush', label: '淡玫瑰', color: '#EDB0B8', bg: '#FDF5F6' },
              { id: 'warm', label: '溫暖棕', color: '#8B6F5E', bg: '#F5EDE8' },
            ].map(theme => (
              <motion.button
                key={theme.id}
                whileTap={{ scale: 0.93 }}
                onClick={() => updateSettings({ theme: theme.id as 'sage' | 'blush' | 'warm' })}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all
                  ${settings.theme === theme.id ? 'border-warm-400' : 'border-transparent bg-cream-50'}`}
              >
                <div className="w-8 h-8 rounded-full shadow-soft" style={{ backgroundColor: theme.color }} />
                <span className="text-xs text-warm-500">{theme.label}</span>
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Reminder */}
        <Card animate className="p-4 mb-3" delay={0.2}>
          <p className="text-xs font-medium text-warm-400 mb-3">提醒設定</p>
          <div className="flex items-center gap-3">
            <span className="text-warm-500 text-sm flex-1">每日練習提醒</span>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={e => updateSettings({ reminderTime: e.target.value })}
              className="px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-sm text-warm-600 focus:outline-none"
            />
          </div>
          <p className="text-xs text-warm-300 mt-2">（需瀏覽器支援通知權限）</p>
        </Card>

        {/* Data */}
        <Card animate className="p-4 mb-3" delay={0.25}>
          <p className="text-xs font-medium text-warm-400 mb-3">資料管理</p>
          <div className="space-y-2">
            <Button variant="secondary" fullWidth onClick={handleExportJSON}>
              📦 匯出備份 (JSON)
            </Button>
            <Button variant="secondary" fullWidth onClick={handleExportCSV}>
              📊 匯出表格 (CSV)
            </Button>
            <Button variant="secondary" fullWidth onClick={handleImport}>
              📥 匯入資料
            </Button>
          </div>
        </Card>

        {/* Danger zone */}
        <Card animate className="p-4 mb-4" delay={0.3}>
          <p className="text-xs font-medium text-red-400 mb-3">危險操作</p>
          <AnimatePresence>
            {showClearConfirm ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="bg-red-50 rounded-2xl p-3 text-center">
                  <p className="text-sm text-red-500 font-medium">確定要清除所有資料嗎？</p>
                  <p className="text-xs text-red-400 mt-1">此操作無法復原，所有練習紀錄將永久刪除</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" fullWidth onClick={() => setShowClearConfirm(false)}>
                    取消
                  </Button>
                  <Button variant="danger" fullWidth onClick={handleClear}>
                    確認清除
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setShowClearConfirm(true)}
                className="text-red-400 hover:bg-red-50"
              >
                🗑️ 清除所有資料
              </Button>
            )}
          </AnimatePresence>
        </Card>

        {/* About */}
        <div className="text-center pb-6">
          <p className="text-xs text-warm-300">Yoga Bloom v1.0</p>
          <p className="text-xs text-warm-200 mt-0.5">你的每日回歸自我的旅程</p>
        </div>
      </div>
    </PageTransition>
  )
}
