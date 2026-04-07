import { useEffect, useState } from 'react'
import { ROLE_COLORS } from '../data/demoScenario'

export default function Header({ role, scenarioName, dispatchTime }) {
  const [elapsed, setElapsed] = useState('00:00')

  useEffect(() => {
    if (!dispatchTime) return
    const [h, m] = dispatchTime.split(':').map(Number)
    const start = new Date()
    start.setHours(h, m, 0, 0)

    const tick = () => {
      const now = new Date()
      let diff = Math.floor((now - start) / 1000)
      if (diff < 0) diff = 0
      const mm = String(Math.floor(diff / 60)).padStart(2, '0')
      const ss = String(diff % 60).padStart(2, '0')
      setElapsed(`${mm}:${ss}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [dispatchTime])

  const color = ROLE_COLORS[role] || '#ffffff'

  return (
    <header
      className="flex items-center justify-between px-4 py-3 sticky top-0 z-50"
      style={{
        background: '#111111',
        borderBottom: `2px solid ${color}`,
      }}
    >
      <span className="text-xl font-bold tracking-widest text-white">임전무퇴</span>
      <span className="text-base font-medium text-gray-300">
        {scenarioName || '대기중'}
      </span>
      <span className="text-base font-mono text-white tabular-nums">
        ⏱ {elapsed}
      </span>
    </header>
  )
}
