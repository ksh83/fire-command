import { DEMO_SCRIPTS } from '../data/demoScenario'

export default function ActSelector({ currentAct, onChange }) {
  return (
    <div className="flex gap-2 px-4 py-2">
      {['act1', 'act2', 'act3'].map((act) => {
        const active = currentAct === act
        return (
          <button
            key={act}
            onClick={() => onChange(act)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: active ? '#ef4444' : '#1a1a1a',
              color: active ? '#fff' : '#9ca3af',
              border: active ? '1px solid #ef4444' : '1px solid #2a2a2a',
            }}
          >
            {DEMO_SCRIPTS[act].label.split(' ')[0]}
          </button>
        )
      })}
    </div>
  )
}
