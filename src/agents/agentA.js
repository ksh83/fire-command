// 에이전트 A — 소방 무전 키워드 추출
import { callClaude } from '../lib/claude'

const SYSTEM = `
너는 소방 현장 무전 분석 전문가다.
입력된 무전 텍스트에서 키워드를 추출해 반드시 아래 JSON 형식으로만 응답해라.
preamble 없이 JSON만 출력.

{
  "대상물": [],
  "화재": [],
  "인명": [],
  "소방력": [],
  "지휘": [],
  "건물정보": [],
  "기상": [],
  "대외": []
}

추출 기준:
- 대상물: 건물유형, 구조특성, 층수, 준공연도, 위험물
- 화재: 발화위치, 연소규모, 확산방향, 특이연소
- 인명: 요구조자 수/위치/상태, 사상자
- 소방력: 출동차량종류/수량, 추가요청, 장비상태
- 지휘: 지휘권확립여부, 구역설정, 대응단계
- 건물정보: 스프링클러, 피난경로, 점검이력
- 기상: 풍향, 풍속, 야간여부, 강수
- 대외: 언론, 민원, 대피주민
키워드는 간결하게, 10자 이내로 작성.
`.trim()

export async function extractKeywords(text) {
  try {
    const raw = await callClaude({
      system: SYSTEM,
      user: `무전 텍스트:\n${text}`,
      maxTokens: 500,
    })

    // JSON 파싱
    const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0]
    if (!jsonStr) return null
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('[AgentA] 오류:', e)
    return null
  }
}
