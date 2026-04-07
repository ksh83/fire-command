import { ROLES, ROLE_COLORS, ROLE_DESC } from '../data/demoScenario'

export default function RoleSelect({ onSelect }) {
  const mainRoles = ROLES.slice(0, 4)
  const lastRole = ROLES[4]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{ background: '#0a0a0a' }}>
      {/* 타이틀 */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-widest text-white mb-2">임전무퇴</h1>
        <p className="text-sm text-gray-400">전주덕진소방서 현장지휘 지원시스템</p>
      </div>

      {/* 역할 그리드 */}
      <div className="w-full max-w-lg space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {mainRoles.map((role) => (
            <button
              key={role}
              onClick={() => onSelect(role)}
              className="flex flex-col items-center justify-center rounded-xl py-6 px-4 transition-all active:scale-95"
              style={{
                background: '#1a1a1a',
                border: `2px solid ${ROLE_COLORS[role]}33`,
                minHeight: 96,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = ROLE_COLORS[role]
                e.currentTarget.style.background = `${ROLE_COLORS[role]}18`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${ROLE_COLORS[role]}33`
                e.currentTarget.style.background = '#1a1a1a'
              }}
            >
              <span className="text-2xl font-bold text-white mb-1">{role}</span>
              <span className="text-sm" style={{ color: ROLE_COLORS[role] }}>{ROLE_DESC[role]}</span>
            </button>
          ))}
        </div>

        {/* 대원 — 전체폭 */}
        <button
          onClick={() => onSelect(lastRole)}
          className="w-full flex flex-col items-center justify-center rounded-xl py-5 px-4 transition-all active:scale-95"
          style={{
            background: '#1a1a1a',
            border: `2px solid ${ROLE_COLORS[lastRole]}33`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = ROLE_COLORS[lastRole]
            e.currentTarget.style.background = `${ROLE_COLORS[lastRole]}18`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = `${ROLE_COLORS[lastRole]}33`
            e.currentTarget.style.background = '#1a1a1a'
          }}
        >
          <span className="text-2xl font-bold text-white mb-1">{lastRole}</span>
          <span className="text-sm" style={{ color: ROLE_COLORS[lastRole] }}>{ROLE_DESC[lastRole]}</span>
        </button>
      </div>
    </div>
  )
}
