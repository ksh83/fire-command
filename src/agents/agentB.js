// 에이전트 B — 역할별 대응방안 생성
import { callClaude } from '../lib/claude'
import { searchManual } from '../lib/rag'

const SYSTEM = (role) => `
너는 소방 현장 지휘 지원 AI다.
입력된 키워드와 매뉴얼 내용을 바탕으로
${role}에게 필요한 현장 대응 정보를 생성해라.

출력 형식 (JSON만, preamble 없음):
{
  "role": "${role}",
  "priority": ["1순위 액션", "2순위 액션", "3순위 액션"],
  "warning": ["위험사항1", "위험사항2"],
  "checklist": ["체크항목1", "체크항목2"],
  "info": ["참고정보1", "참고정보2"]
}

원칙:
- 직관적이고 짧게 (항목당 20자 이내)
- 현장에서 즉시 실행 가능한 내용만
- 불확실한 내용 제외
- 우선순위 최대 5개
`.trim()

export async function generateMission(role, keywords) {
  try {
    // RAG 검색 (Supabase 미연결 시 빈 문자열)
    let manual = ''
    try {
      const keywordStr = Object.values(keywords || {}).flat().join(' ')
      manual = await searchManual(keywordStr)
    } catch {
      manual = ''
    }

    const raw = await callClaude({
      system: SYSTEM(role),
      user: `키워드: ${JSON.stringify(keywords)}\n\n매뉴얼: ${manual || '(매뉴얼 미연결)'}`,
      maxTokens: 1000,
    })

    const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0]
    if (!jsonStr) return null
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('[AgentB] 오류:', e)
    return null
  }
}
