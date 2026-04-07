// 에이전트 C — 카카오 비즈메시지 전송 (대원 역할)
// 카카오 알림톡 API 직접 호출은 CORS 제한으로 백엔드 프록시 필요.
// POC 단계에서는 콘솔 출력 + 시뮬레이션.

const KAKAO_ACCESS_TOKEN = import.meta.env.VITE_KAKAO_ACCESS_TOKEN
const KAKAO_TEMPLATE_ID = import.meta.env.VITE_KAKAO_TEMPLATE_ID
const KAKAO_SENDER_KEY = import.meta.env.VITE_KAKAO_SENDER_KEY

export function buildKakaoMessage(scenarioName, mission) {
  const time = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return [
    `[임전무퇴 현장상황 ${time}]`,
    `📍 ${scenarioName}`,
    mission.priority?.[0] ? `⚠️ ${mission.priority[0]}` : '',
    mission.priority?.[1] ? `⚠️ ${mission.priority[1]}` : '',
    mission.info?.[0] ? `✅ ${mission.info[0]}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function sendKakaoMessage(phoneNumbers, message) {
  // POC: 실제 전송 대신 시뮬레이션
  console.log('[AgentC] 카카오 메시지 전송 시뮬레이션')
  console.log('수신자:', phoneNumbers)
  console.log('내용:\n', message)

  // 실제 연동 시 아래 주석 해제 + 백엔드 프록시 경유
  /*
  const response = await fetch('/api/kakao/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      senderKey: KAKAO_SENDER_KEY,
      templateCode: KAKAO_TEMPLATE_ID,
      receiverList: phoneNumbers.map(phone => ({ phone, message })),
    }),
  })
  return response.ok
  */

  return true
}
