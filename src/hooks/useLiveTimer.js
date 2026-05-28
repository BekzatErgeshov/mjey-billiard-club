import { useEffect, useState } from 'react'

export function useLiveTimer(startedAt) {
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    if (!startedAt) return
    const startMs = new Date(startedAt).getTime()
    const tick = () => setElapsedMs(Date.now() - startMs)
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startedAt])

  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    elapsedMs,
    elapsedMinutes: Math.floor(totalSeconds / 60),
    elapsedHours: totalSeconds / 3600,
    formatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  }
}
