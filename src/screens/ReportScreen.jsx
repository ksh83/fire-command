import { useState } from 'react'
import { SCENARIO_INFO } from '../data/demoScenario'
import { callClaude } from '../lib/claude'

const INITIAL_FORM = {
  사망: '',
  부상: '',
  구조인원: '',
  투입차량: '',
  투입인원: '',
  재산피해: '',
  발화원인: '',
  특이사항: '',
}

export default function ReportScreen({ timeline, keywords, mission, role, onBack }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState(null)

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const buildData = () => {
    // 키워드 요약 (카테고리별 핵심어)
    const keywordSummary = keywords
      ? Object.entries(keywords)
          .filter(([, v]) => v && v.length > 0)
          .map(([k, v]) => `${k}: ${v.join(', ')}`)
          .join('\n')
      : ''

    // 임무 요약 (역할별 판단 결과)
    const missionSummary = mission
      ? [
          mission.priority?.length ? `우선과제: ${mission.priority.join(' / ')}` : '',
          mission.warning?.length ? `위험판단: ${mission.warning.join(' / ')}` : '',
          mission.info?.length ? `참고정보: ${mission.info.join(' / ')}` : '',
        ]
          .filter(Boolean)
          .join('\n')
      : ''

    return {
      ...SCENARIO_INFO,
      보고역할: role || '미지정',
      타임라인수: timeline.length,
      타임라인: timeline.map((t) => `${t.time} ${t.icon} ${t.label}`).join('\n'),
      키워드분석: keywordSummary,
      AI임무판단: missionSummary,
      ...form,
    }
  }

  const generate = async (type) => {
    setLoading(true)
    setReportType(type)
    setResult('')

    const system =
      type === 'hq'
        ? `너는 소방서 현장활동 결과보고서 작성 전문가다.
입력된 데이터를 바탕으로 공문서 형식의 보고서를 작성해라.
형식: 전주덕진소방서 현장활동 결과보고
구성: 1.발생개요 2.활동내용 3.인명피해 4.재산피해 5.투입자원 6.특이사항
키워드분석과 AI임무판단 내용을 활동내용과 특이사항에 반영해라.
타임라인이 있으면 활동내용에 시간순으로 포함해라.`
        : `너는 소방서 대변인이다.
입력된 데이터를 바탕으로 간결하고 명확한 언론 브리핑문을 작성해라.
사실만 포함, 수사 중 사항은 "조사 중"으로 표기, 200자 이내.
인명/재산 피해 현황을 포함하고 현장 상황을 요약해라.`

    try {
      const text = await callClaude({
        system,
        user: JSON.stringify(buildData(), null, 2),
        maxTokens: 1500,
      })
      setResult(text)
    } catch (e) {
      setResult('오류: ' + e.message)
    } finally {
      setLoading(false)
    }
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
        <span className="text-2xl font-bold text-white">📝 사후 리포트</span>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* 자동 수집 */}
        <div className="rounded-xl p-4" style={{ background: '#1a1a1a' }}>
          <p className="text-sm text-gray-400 mb-2 font-semibold">📊 자동 수집</p>
          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
            <Info label="신고" value={SCENARIO_INFO.dispatchTime} />
            <Info label="도착" value={SCENARIO_INFO.arrivalTime} />
            <Info label="현장" value={SCENARIO_INFO.location} />
            <Info label="타임라인" value={`${timeline.length}건`} />
          </div>
          {timeline.length > 0 && (
            <div className="mt-2 space-y-1">
              {timeline.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="tabular-nums text-gray-600">{t.time}</span>
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          )}
          {keywords && Object.values(keywords).some(v => v?.length > 0) && (
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-1">AI 키워드 분석</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(keywords)
                  .filter(([, v]) => v?.length > 0)
                  .flatMap(([, v]) => v)
                  .slice(0, 12)
                  .map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#1f2937', color: '#9ca3af' }}>
                      {kw}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* 수동 입력 */}
        <div className="rounded-xl p-4 space-y-3" style={{ background: '#1a1a1a' }}>
          <p className="text-sm text-gray-400 mb-1 font-semibold">✍️ 수동 입력</p>
          {[
            { key: '사망', unit: '명', type: 'number' },
            { key: '부상', unit: '명', type: 'number' },
            { key: '구조인원', unit: '명', type: 'number' },
            { key: '투입차량', unit: '대', type: 'number' },
            { key: '투입인원', unit: '명', type: 'number' },
          ].map(({ key, unit, type }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-base text-gray-300 w-20">{key}</span>
              <input
                type={type}
                className="flex-1 rounded-lg px-3 py-2 text-white text-base outline-none"
                style={{ background: '#0f0f0f', border: '1px solid #333' }}
                placeholder="0"
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
              />
              <span className="text-gray-500 text-sm">{unit}</span>
            </div>
          ))}
          {[
            { key: '재산피해', placeholder: '원 추정' },
            { key: '발화원인', placeholder: '조사 중' },
          ].map(({ key, placeholder }) => (
            <div key={key}>
              <p className="text-sm text-gray-400 mb-1">{key}</p>
              <input
                className="w-full rounded-lg px-3 py-2 text-white text-base outline-none"
                style={{ background: '#0f0f0f', border: '1px solid #333' }}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
              />
            </div>
          ))}
          <div>
            <p className="text-sm text-gray-400 mb-1">특이사항</p>
            <textarea
              className="w-full rounded-lg px-3 py-2 text-white text-base outline-none resize-none"
              style={{ background: '#0f0f0f', border: '1px solid #333' }}
              rows={3}
              placeholder="특이사항 입력..."
              value={form.특이사항}
              onChange={(e) => setField('특이사항', e.target.value)}
            />
          </div>
        </div>

        {/* 생성 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => generate('hq')}
            disabled={loading}
            className="flex-1 py-4 rounded-xl text-white font-semibold text-base active:opacity-80"
            style={{ background: '#1d4ed8' }}
          >
            📋 본부 보고서
          </button>
          <button
            onClick={() => generate('press')}
            disabled={loading}
            className="flex-1 py-4 rounded-xl text-white font-semibold text-base active:opacity-80"
            style={{ background: '#7c3aed' }}
          >
            📢 언론 브리핑
          </button>
        </div>

        {/* 결과 */}
        {loading && (
          <div
            className="rounded-xl p-4 text-center text-gray-400 animate-pulse"
            style={{ background: '#1a1a1a' }}
          >
            ⚡ Claude AI 작성 중...
          </div>
        )}
        {result && (
          <div className="rounded-xl p-4" style={{ background: '#1a1a1a' }}>
            <p className="text-xs text-gray-500 mb-2">
              {reportType === 'hq' ? '📋 본부 보고서' : '📢 언론 브리핑'}
            </p>
            <p className="text-base text-white whitespace-pre-wrap leading-relaxed">{result}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500">{label}:</span>
      <span className="text-white">{value || '-'}</span>
    </div>
  )
}
