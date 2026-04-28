import { ROLE_COLORS } from '../data/demoScenario'

export default function MissionPreview({ role, mission, onExpand }) {
  const color = ROLE_COLORS[role] || '#ffffff'
  const items = mission?.priority || []

  return (
    <div
      className="rounded-xl px-5 py-5 cursor-pointer active:opacity-80"
      style={{ background: '#1a1a1a', border: `1px solid ${color}33` }}
      onClick={onExpand}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-xl" style={{ color }}>
          📋 역할별 임무
        </span>
        <span className="text-gray-400 text-base">전체보기 ↑</span>
      </div>
      <div className="space-y-3">
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="text-base font-bold mt-0.5" style={{ color }}>
              {i + 1}
            </span>
            <span className="text-lg text-white leading-snug">{item}</span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-500 text-base">대기 중...</p>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <div className="w-12 h-1 rounded-full" style={{ background: color + '66' }} />
      </div>
    </div>
  )
}
