import { useState } from 'react'
import { ROLE_COLORS } from '../data/demoScenario'

function MissionCard({ title, items = [], type = 'default', color }) {
  const [checked, setChecked] = useState([])

  const toggle = (i) => {
    setChecked((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    )
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a' }}>
      <div
        className="px-4 py-3 font-semibold text-base"
        style={{ background: '#222', color }}
      >
        {title}
      </div>
      <div className="px-4 py-3 space-y-2">
        {items.map((item, i) => {
          const done = checked.includes(i)
          const isWarn = item.startsWith('⚠️')
          return (
            <button
              key={i}
              className="w-full flex items-start gap-3 text-left py-1 active:opacity-60"
              onClick={() => toggle(i)}
              style={{
                background: isWarn ? '#7f1d1d22' : 'transparent',
                borderRadius: 8,
                padding: '4px 8px',
              }}
            >
              {type === 'checklist' && (
                <span
                  className="mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 text-sm"
                  style={{
                    border: `2px solid ${done ? color : '#4b5563'}`,
                    background: done ? color : 'transparent',
                  }}
                >
                  {done && '✓'}
                </span>
              )}
              {type === 'numbered' && (
                <span
                  className="font-bold text-base flex-shrink-0 w-6 text-center"
                  style={{ color }}
                >
                  {i + 1}
                </span>
              )}
              {type === 'default' && isWarn && (
                <span className="flex-shrink-0 mt-0.5">⚠️</span>
              )}
              <span
                className="text-base leading-snug"
                style={{
                  color: done ? '#4b5563' : '#ffffff',
                  textDecoration: done ? 'line-through' : 'none',
                }}
              >
                {type === 'default' && isWarn ? item.replace('⚠️ ', '') : item}
              </span>
            </button>
          )
        })}
        {items.length === 0 && (
          <p className="text-gray-500 text-sm">없음</p>
        )}
      </div>
    </div>
  )
}

export default function MissionScreen({ role, mission, onBack }) {
  const color = ROLE_COLORS[role] || '#ffffff'
  const now = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const cards = buildCards(role, mission, color)

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* 역할 헤더 바 */}
      <div
        className="flex items-center gap-3 px-4 py-4"
        style={{ background: color + '22', borderBottom: `2px solid ${color}` }}
      >
        <button
          onClick={onBack}
          className="text-gray-400 text-2xl leading-none"
        >
          ←
        </button>
        <span className="text-2xl font-bold text-white">{role}</span>
        <span className="text-sm ml-auto" style={{ color }}>
          업데이트 {now}
        </span>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {cards.map((card, i) => (
          <MissionCard key={i} {...card} color={color} />
        ))}
      </div>
    </div>
  )
}

function buildCards(role, mission, color) {
  if (!mission) return []

  const base = [
    {
      title: '🚨 최우선 과제',
      items: mission.priority || [],
      type: 'numbered',
    },
    {
      title: '⚠️ 위험 판단',
      items: (mission.warning || []).map((w) =>
        w.startsWith('⚠️') ? w : '⚠️ ' + w
      ),
      type: 'default',
    },
    {
      title: '✅ 체크리스트',
      items: mission.checklist || [],
      type: 'checklist',
    },
    {
      title: 'ℹ️ 참고 정보',
      items: mission.info || [],
      type: 'default',
    },
  ]

  return base.filter((c) => c.items.length > 0)
}
