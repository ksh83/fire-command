// Claude API 호출 헬퍼 (브라우저에서 직접 호출)
// 프로덕션에서는 백엔드 프록시 권장

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const MODEL = 'claude-sonnet-4-6'

export async function callClaude({ system, user, maxTokens = 1000 }) {
  if (!API_KEY) {
    throw new Error('API 키가 설정되지 않았습니다 (VITE_ANTHROPIC_API_KEY)')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })

  if (!response.ok) {
    let errMsg = `HTTP ${response.status}`
    try {
      const err = await response.json()
      errMsg = err?.error?.message || errMsg
    } catch {}
    throw new Error(errMsg)
  }

  const data = await response.json()
  return data.content[0].text
}
