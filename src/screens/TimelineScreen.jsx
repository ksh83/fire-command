import { useState } from 'react'

export default function TimelineScreen({ timeline, setTimeline, onBack }) {
  const toggle = (id) => {
    setTimeline((prev) =>
      prev.map((t) => (t.id === id ? { ...t, open: !t.open } : t))
    )
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* 헤더 */}
      <div
        className="flex items-center gap-3 px-4 py-4"
        style={{ background: '#1a1a1a', borderBottom: '2px solid #ef4444' }}
      >
        <button onClick={onBack} className="text-gray-400 text-2xl leading-none">
          ←
        </button>
        <span className="text-2xl font-bold text-white">⏱ 타임라인</span>
      </div>

      <div className="px-4 pt-4">
        {timeline.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-5xl mb-4">📋</p>
            <p>막을 전환하면 타임라인이 자동 기록됩니다</p>
          </div>
        ) : (
          <div className="relative">
            {/* 세로선 */}
            <div
              className="absolute left-6 top-0 bottom-0 w-0.5"
              style={{ background: '#2a2a2a' }}
            />
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.id} className="flex gap-4 relative">
                  {/* 아이콘 */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xl"
                    style={{ background: '#222', border: '2px solid #333' }}
                  >
                    {item.icon}
                  </div>
                  {/* 내용 */}
                  <div
                    className="flex-1 rounded-xl p-3 cursor-pointer active:opacity-70"
                    style={{ background: '#1a1a1a' }}
                    onClick={() => toggle(item.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{item.label}</span>
                      <span className="text-xs text-gray-500 tabular-nums">{item.time}</span>
                    </div>
                    <p
                      className="text-sm text-gray-400"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: item.open ? undefined : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: item.open ? 'visible' : 'hidden',
                      }}
                    >
                      {item.text}
                    </p>
                    {!item.open && item.text.length > 80 && (
                      <span className="text-xs text-gray-600">더보기</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
