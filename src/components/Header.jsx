import { useEffect, useState } from 'react'
import { ROLE_COLORS } from '../data/demoScenario'

export default function Header({ role, scenarioName, dispatchTime, onRoleReset }) {
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
      <button
        onClick={onRoleReset}
        className="text-xl font-bold tracking-widest text-white active:opacity-60"
        title="역할 재선택"
      >
        임전무퇴
      </button>
      <span className="text-sm font-medium text-gray-300 truncate mx-2 max-w-[140px]">
        {scenarioName || '대기중'}
      </span>
      <div className="flex items-center gap-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: color + '22', color }}
        >
          {role}
        </span>
        <span className="text-sm font-mono text-white tabular-nums">
          ⏱ {elapsed}
        </span>
      </div>
    </header>
  )
}
