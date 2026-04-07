import { useState } from 'react'
import { CATEGORY_COLORS } from '../data/demoScenario'

const CATEGORIES = ['대상물', '화재', '인명', '소방력', '지휘', '건물정보', '기상', '대외']

export default function KeywordSection({ keywords }) {
  const [open, setOpen] = useState(false)

  const allKeywords = CATEGORIES.flatMap((cat) =>
    (keywords[cat] || []).map((kw) => ({ cat, kw }))
  )
  const preview = allKeywords.slice(0, 3)

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a' }}>
      {/* 헤더 */}
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-white font-semibold text-lg">🏷 키워드</span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {/* 접힘: 미리보기 태그 */}
      {!open && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {preview.length === 0 ? (
            <span className="text-gray-500 text-sm">키워드 없음</span>
          ) : (
            preview.map(({ cat, kw }) => (
              <Tag key={cat + kw} color={CATEGORY_COLORS[cat]} label={kw} />
            ))
          )}
        </div>
      )}

      {/* 펼침: 카테고리별 전체 */}
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {CATEGORIES.map((cat) => {
            const kws = keywords[cat] || []
            if (kws.length === 0) return null
            return (
              <div key={cat}>
                <p className="text-xs text-gray-500 mb-1">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {kws.map((kw) => (
                    <Tag key={kw} color={CATEGORY_COLORS[cat]} label={kw} />
                  ))}
                </div>
              </div>
            )
          })}
          {allKeywords.length === 0 && (
            <p className="text-gray-500 text-sm">키워드 없음</p>
          )}
        </div>
      )}
    </div>
  )
}

function Tag({ color, label }) {
  return (
    <span
      className="text-sm text-white rounded-full px-3 py-1"
      style={{ background: color + '33', border: `1px solid ${color}66` }}
    >
      {label}
    </span>
  )
}
