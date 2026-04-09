export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function currentTime(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
  return `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function isToday(dateStr: string): boolean {
  return dateStr === today()
}

export function isYesterday(dateStr: string): boolean {
  const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  return dateStr === yest
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 21) return 'evening'
  return 'night'
}

export function daysAgo(dateStr: string): number {
  const d = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  return Math.floor((now.getTime() - d.getTime()) / 86400000)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} 分鐘`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} 小時 ${m} 分` : `${h} 小時`
}
