// RAG 검색 — Supabase pgvector
// Supabase URL/Key 없으면 빈 문자열 반환
import { supabase } from './supabase'

const EMBEDDING_MODEL = 'text-embedding-3-small'

// OpenAI 임베딩 생성 (RAG 단계에서 필요)
async function getEmbedding(text) {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!openaiKey) throw new Error('OPENAI_API_KEY 없음')

  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  })
  const data = await res.json()
  return data.data[0].embedding
}

export async function searchManual(query, topK = 5) {
  if (!supabase) return ''

  try {
    const embedding = await getEmbedding(query)
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: topK,
    })
    if (error) throw error
    return (data || []).map((d) => d.content).join('\n\n')
  } catch (e) {
    console.warn('[RAG] 검색 실패 (정상 — Supabase 미설정):', e.message)
    return ''
  }
}

// Supabase에 문서 임베딩 저장 (스크립트용)
export async function embedAndStore(content, category, source) {
  const embedding = await getEmbedding(content)
  const { error } = await supabase.from('documents').insert({
    content,
    embedding,
    category,
    source,
  })
  if (error) throw error
}
