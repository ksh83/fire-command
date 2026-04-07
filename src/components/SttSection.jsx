import { useState, useRef } from 'react'
import { correctSlang } from '../lib/slang'

export default function SttSection({ onTranscript }) {
  const [open, setOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [lines, setLines] = useState([])
  const [interim, setInterim] = useState('')
  const [corrections, setCorrections] = useState([])
  const recogRef = useRef(null)

  const startSTT = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('이 브라우저는 음성인식을 지원하지 않습니다.')
      return
    }
    const recog = new SpeechRecognition()
    recog.lang = 'ko-KR'
    recog.continuous = true
    recog.interimResults = true

    recog.onresult = (e) => {
      let finalText = ''
      let interimText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript
        else interimText += e.results[i][0].transcript
      }
      if (finalText) {
        const { corrected, changes } = correctSlang(finalText.trim())
        setLines((prev) => [...prev.slice(-20), corrected])
        if (changes.length > 0) {
          setCorrections((prev) => [...prev.slice(-5), ...changes])
        }
        onTranscript?.(corrected)
      }
      setInterim(interimText)
    }

    recog.onend = () => setListening(false)
    recog.start()
    recogRef.current = recog
    setListening(true)
  }

  const stopSTT = () => {
    recogRef.current?.stop()
    setListening(false)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a' }}>
      {/* 헤더 */}
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center gap-2 text-white font-semibold text-lg">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{
              background: listening ? '#ef4444' : '#4b5563',
              boxShadow: listening ? '0 0 6px #ef4444' : 'none',
            }}
          />
          무전 실시간
        </span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {/* 본문 */}
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* STT 텍스트 */}
          <div
            className="rounded-lg p-3 min-h-[80px] text-base text-gray-300 space-y-1 overflow-y-auto"
            style={{ background: '#0f0f0f', maxHeight: 160 }}
          >
            {lines.slice(-5).map((l, i) => (
              <p key={i}>{l}</p>
            ))}
            {interim && <p className="text-gray-500 italic">{interim}</p>}
            {lines.length === 0 && !interim && (
              <p className="text-gray-600">수신 대기 중...</p>
            )}
          </div>

          {/* 컨트롤 */}
          <div className="flex gap-2">
            {!listening ? (
              <button
                onClick={startSTT}
                className="flex-1 py-2 rounded-lg text-white font-semibold text-base"
                style={{ background: '#ef4444' }}
              >
                🎙 수신 시작
              </button>
            ) : (
              <button
                onClick={stopSTT}
                className="flex-1 py-2 rounded-lg text-white font-semibold text-base"
                style={{ background: '#374151' }}
              >
                ⏹ 수신 중지
              </button>
            )}
          </div>

          {/* 수동 입력 */}
          <ManualInput onSubmit={(t) => {
            const { corrected, changes } = correctSlang(t)
            setLines((prev) => [...prev.slice(-20), '[수동] ' + corrected])
            if (changes.length > 0) {
              setCorrections((prev) => [...prev.slice(-5), ...changes])
            }
            onTranscript?.('[수동] ' + corrected)
          }} />

          {/* 은어 보정 내역 */}
          {corrections.length > 0 && (
            <div className="rounded-lg px-3 py-2" style={{ background: '#0f0f0f', border: '1px solid #374151' }}>
              <p className="text-xs text-gray-500 mb-1">🔤 은어 보정</p>
              <div className="flex flex-wrap gap-1">
                {corrections.slice(-6).map((c, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#1f2937', color: '#9ca3af' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ManualInput({ onSubmit }) {
  const [val, setVal] = useState('')
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 rounded-lg px-3 py-2 text-white text-base outline-none"
        style={{ background: '#0f0f0f', border: '1px solid #333' }}
        placeholder="은어 수동입력..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && val.trim()) {
            onSubmit(val.trim())
            setVal('')
          }
        }}
      />
      <button
        className="px-4 py-2 rounded-lg text-white font-semibold"
        style={{ background: '#374151' }}
        onClick={() => {
          if (val.trim()) { onSubmit(val.trim()); setVal('') }
        }}
      >
        추가
      </button>
    </div>
  )
}
