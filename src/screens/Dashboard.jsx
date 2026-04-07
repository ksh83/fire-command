import { useState, useCallback } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import SttSection from '../components/SttSection'
import KeywordSection from '../components/KeywordSection'
import MissionPreview from '../components/MissionPreview'
import ActSelector from '../components/ActSelector'
import MissionScreen from './MissionScreen'
import TimelineScreen from './TimelineScreen'
import ReportScreen from './ReportScreen'
import {
  SCENARIO_INFO,
  DEMO_KEYWORDS,
  DEMO_MISSIONS,
  DEMO_SCRIPTS,
  TIMELINE_TRIGGERS,
} from '../data/demoScenario'
import { extractKeywords } from '../agents/agentA'
import { generateMission } from '../agents/agentB'

export default function Dashboard({ role }) {
  const [tab, setTab] = useState('dashboard')
  const [act, setAct] = useState('act1')
  const [keywords, setKeywords] = useState(DEMO_KEYWORDS.act1)
  const [mission, setMission] = useState(DEMO_MISSIONS.act1[role])
  const [missionExpanded, setMissionExpanded] = useState(false)
  const [timeline, setTimeline] = useState([])
  const [newMissionBanner, setNewMissionBanner] = useState(false)
  const [loadingAgent, setLoadingAgent] = useState(false)

  // 막 전환 시 데모 데이터로 업데이트
  const handleActChange = (newAct) => {
    setAct(newAct)
    setKeywords(DEMO_KEYWORDS[newAct])
    setMission(DEMO_MISSIONS[newAct][role])
    showBanner()

    // 타임라인 자동 추가
    const script = DEMO_SCRIPTS[newAct]
    TIMELINE_TRIGGERS.forEach(({ keyword, icon, label }) => {
      if (script.text.includes(keyword)) {
        setTimeline((prev) => {
          const exists = prev.find((t) => t.label === label)
          if (exists) return prev
          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
              icon,
              label,
              text: script.text.split('\n').find((l) => l.includes(keyword)) || '',
              open: false,
            },
          ]
        })
      }
    })
  }

  const showBanner = () => {
    setNewMissionBanner(true)
    setTimeout(() => setNewMissionBanner(false), 3000)
  }

  // STT 텍스트 수신 시 에이전트 A,B 호출
  const handleTranscript = useCallback(async (text) => {
    setLoadingAgent(true)
    try {
      const kws = await extractKeywords(text)
      if (kws) {
        setKeywords((prev) => {
          const merged = { ...prev }
          Object.keys(kws).forEach((cat) => {
            if (!merged[cat]) merged[cat] = []
            kws[cat].forEach((k) => {
              if (!merged[cat].includes(k)) merged[cat].push(k)
            })
          })
          return merged
        })
      }

      const m = await generateMission(role, kws || keywords)
      if (m) {
        setMission(m)
        showBanner()
      }
    } catch (e) {
      console.error('에이전트 오류:', e)
    } finally {
      setLoadingAgent(false)
    }
  }, [role, keywords])

  // ── 탭 렌더링 ────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (tab) {
      case 'mission':
        return (
          <MissionScreen
            role={role}
            mission={mission}
            onBack={() => setTab('dashboard')}
          />
        )
      case 'timeline':
        return (
          <TimelineScreen
            timeline={timeline}
            setTimeline={setTimeline}
            onBack={() => setTab('dashboard')}
          />
        )
      case 'report':
        return (
          <ReportScreen
            timeline={timeline}
            onBack={() => setTab('dashboard')}
          />
        )
      default:
        return (
          <div className="flex-1 overflow-y-auto px-4 pb-24 pt-3 space-y-3">
            {/* 데모 막 선택 */}
            <ActSelector currentAct={act} onChange={handleActChange} />

            {/* 로딩 배너 */}
            {loadingAgent && (
              <div
                className="rounded-lg px-4 py-2 text-sm text-white text-center"
                style={{ background: '#374151' }}
              >
                ⚡ AI 에이전트 분석 중...
              </div>
            )}

            {/* 새 임무 배너 */}
            {newMissionBanner && (
              <div
                className="rounded-lg px-4 py-2 text-sm text-white text-center animate-pulse"
                style={{ background: '#7f1d1d' }}
              >
                🔴 새 임무가 업데이트 되었습니다
              </div>
            )}

            <SttSection onTranscript={handleTranscript} />
            <KeywordSection keywords={keywords} />
            <MissionPreview
              role={role}
              mission={mission}
              onExpand={() => setTab('mission')}
            />
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0a0a0a' }}>
      <Header
        role={role}
        scenarioName={SCENARIO_INFO.location}
        dispatchTime={SCENARIO_INFO.dispatchTime}
      />
      {renderContent()}
      <BottomNav role={role} current={tab} onChange={setTab} />
    </div>
  )
}
