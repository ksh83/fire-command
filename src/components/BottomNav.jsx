import { ROLE_COLORS } from '../data/demoScenario'

const TABS = [
  { key: 'dashboard', label: '대시보드', icon: '🏠' },
  { key: 'mission', label: '임무', icon: '📋' },
  { key: 'timeline', label: '타임라인', icon: '⏱' },
  { key: 'report', label: '리포트', icon: '📝' },
]

export default function BottomNav({ role, current, onChange }) {
  const tabs = TABS
  const color = ROLE_COLORS[role] || '#ffffff'

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex z-50"
      style={{ background: '#111111', borderTop: '1px solid #2a2a2a' }}
    >
      {tabs.map((tab) => {
        const active = current === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="flex-1 flex flex-col items-center justify-center py-3 transition-colors"
            style={{ color: active ? color : '#6b7280', minHeight: 60 }}
          >
            <span className="text-2xl leading-none">{tab.icon}</span>
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
