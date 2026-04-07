// 카카오 비즈메시지 전송 시뮬레이션 UI (대원 역할)
import { useState } from 'react'
import { buildKakaoMessage, sendKakaoMessage } from '../agents/agentC'
import { SCENARIO_INFO } from '../data/demoScenario'

// 데모용 수신자 목록
const DEMO_RECEIVERS = [
  { name: '김○○ 대원', phone: '010-1234-5678' },
  { name: '이○○ 대원', phone: '010-2345-6789' },
  { name: '박○○ 대원', phone: '010-3456-7890' },
]

export default function KakaoPanel({ mission }) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [preview, setPreview] = useState('')

  const message = buildKakaoMessage(SCENARIO_INFO.location, mission || {})

  const handleSend = async () => {
    setSending(true)
    setSent(false)
    setPreview(message)
    const phones = DEMO_RECEIVERS.map((r) => r.phone)
    await sendKakaoMessage(phones, message)
    setSending(false)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a' }}>
      {/* 헤더 */}
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center gap-2 text-white font-semibold text-lg">
          <span className="text-yellow-400">💬</span>
          카카오 전파
        </span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* 메시지 미리보기 */}
          <div
            className="rounded-lg p-3 text-sm"
            style={{ background: '#0f0f0f', border: '1px solid #374151' }}
          >
            <p className="text-xs text-gray-500 mb-2">📋 전송 내용 미리보기</p>
            <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm font-sans">
              {message}
            </pre>
          </div>

          {/* 수신자 목록 */}
          <div>
            <p className="text-xs text-gray-500 mb-2">👥 수신 대상 ({DEMO_RECEIVERS.length}명)</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_RECEIVERS.map((r) => (
                <span
                  key={r.phone}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ background: '#374151', color: '#d1d5db' }}
                >
                  {r.name}
                </span>
              ))}
            </div>
          </div>

          {/* 전송 버튼 */}
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full py-3 rounded-xl text-white font-semibold text-base active:opacity-80 transition-all"
            style={{
              background: sent ? '#166534' : sending ? '#374151' : '#f59e0b',
              color: sent || sending ? '#fff' : '#0a0a0a',
            }}
          >
            {sending ? '⏳ 전송 중...' : sent ? '✅ 전송 완료 (시뮬레이션)' : '📲 카카오 메시지 전파'}
          </button>

          {/* 전송 결과 */}
          {sent && preview && (
            <div
              className="rounded-lg p-3 text-sm"
              style={{ background: '#052e16', border: '1px solid #166534' }}
            >
              <p className="text-xs text-green-400 mb-1">✅ 전송 완료 — {DEMO_RECEIVERS.length}명 수신</p>
              <p className="text-gray-400 text-xs">
                {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          )}

          <p className="text-xs text-gray-600 text-center">
            ※ 실제 전송은 백엔드 프록시 연동 필요 (현재 시뮬레이션)
          </p>
        </div>
      )}
    </div>
  )
}
