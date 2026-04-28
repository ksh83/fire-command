import { useState, useRef } from 'react'
import { correctSlang } from '../lib/slang'
import { localExtractKeywords } from '../agents/agentA'

export default function SttSection({ onTranscript, onLiveKeywords }) {
  const [open, setOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [lines, setLines] = useState([])
  const [interim, setInterim] = useState('')
  const [corrections, setCorrections] = useState([])
  const [liveKeywords, setLiveKeywords] = useState(null)
  const recogRef = useRef(null)

  const handleLiveText = (text) => {
    const kws = localExtractKeywords(text)
    if (kws) {
      setLiveKeywords(kws)
      onLiveKeywords?.(kws)
    }
  }

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
      if (interimText) {
        setInterim(interimText)
        handleLiveText(interimText)
      }
      if (finalText) {
        const { corrected, changes } = correctSlang(finalText.trim())
        setLines((prev) => [...prev.slice(-20), corrected])
        setInterim('')
        if (changes.length > 0) {
          setCorrections((prev) => [...prev.slice(-5), ...changes])
        }
        handleLiveText(corrected)
        onTranscript?.(corrected)
      }
    }

    recog.onend = () => setListening(false)
    recog.start()
    recogRef.current = recog
    setListening(true)
    setLiveKeywords(null)
  }

  const stopSTT = () => {
    recogRef.current?.stop()
    setListening(false)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a' }}>
      {/* 헤더 */}
      <button
        className="w-full flex items-center justify-between px-5 py-4"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center gap-3 text-white font-semibold text-xl">
          <span
            className="w-3.5 h-3.5 rounded-full inline-block"
            style={{
              background: listening ? '#ef4444' : '#4b5563',
              boxShadow: listening ? '0 0 8px #ef4444' : 'none',
            }}
          />
          무전 실시간
        </span>
        <span className="text-gray-400 text-lg">{open ? '▲' : '▼'}</span>
      </button>

      {/* 본문 */}
      {open && (
        <div className="px-5 pb-5 space-y-4">
          {/* STT 텍스트 */}
          <div
            className="rounded-lg p-4 min-h-[100px] text-lg text-gray-300 space-y-1.5 overflow-y-auto"
            style={{ background: '#0f0f0f', maxHeight: 200 }}
          >
            {lines.slice(-5).map((l, i) => (
              <p key={i}>{l}</p>
            ))}
            {interim && <p className="text-yellow-400 italic">{interim}</p>}
            {lines.length === 0 && !interim && (
              <p className="text-gray-600 text-base">수신 대기 중...</p>
            )}
          </div>

          {/* 실시간 키워드 표시 */}
          {listening && liveKeywords && (
            <div className="rounded-lg px-4 py-3" style={{ background: '#0f172a', border: '1px solid #1e40af' }}>
              <p className="text-sm text-blue-400 font-semibold mb-2">📡 실시간 감지 키워드</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(liveKeywords).flatMap(([cat, words]) =>
                  words.map((w) => (
                    <span
                      key={cat + w}
                      className="text-sm text-white px-3 py-1 rounded-full animate-pulse"
                      style={{ background: '#1e3a8a', border: '1px solid #3b82f6' }}
                    >
                      {w}
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 컨트롤 */}
          <div className="flex gap-3">
            {!listening ? (
              <button
                onClick={startSTT}
                className="flex-1 py-4 rounded-xl text-white font-bold text-lg"
                style={{ background: '#ef4444' }}
              >
                🎙 무전 시작
              </button>
            ) : (
              <button
                onClick={stopSTT}
                className="flex-1 py-4 rounded-xl text-white font-bold text-lg"
                style={{ background: '#374151' }}
              >
                ⏹ 무전 중지
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
            handleLiveText(corrected)
            onTranscript?.('[수동] ' + corrected)
          }} />

          {/* 은어 보정 내역 */}
          {corrections.length > 0 && (
            <div className="rounded-lg px-4 py-3" style={{ background: '#0f0f0f', border: '1px solid #374151' }}>
              <p className="text-sm text-gray-500 mb-1.5">🔤 은어 보정</p>
              <div className="flex flex-wrap gap-1.5">
                {corrections.slice(-6).map((c, i) => (
                  <span key={i} className="text-sm px-3 py-1 rounded-full" style={{ background: '#1f2937', color: '#9ca3af' }}>
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
    <div className="flex gap-3">
      <input
        className="flex-1 rounded-xl px-4 py-3 text-white text-lg outline-none"
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
        className="px-5 py-3 rounded-xl text-white font-semibold text-lg"
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
