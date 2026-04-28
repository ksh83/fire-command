import { DEMO_SCRIPTS } from '../data/demoScenario'

export default function ActSelector({ currentAct, onChange }) {
  return (
    <div className="flex gap-3 px-5 py-3">
      {['act1', 'act2', 'act3'].map((act) => {
        const active = currentAct === act
        const label = DEMO_SCRIPTS[act].label.split(' ')[0]
        return (
          <button
            key={act}
            onClick={() => onChange(act)}
            className="flex-1 py-4 rounded-xl font-bold text-lg transition-all"
            style={{
              background: active ? '#ef4444' : '#1a1a1a',
              color: active ? '#fff' : '#9ca3af',
              border: active ? '2px solid #ef4444' : '2px solid #2a2a2a',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
