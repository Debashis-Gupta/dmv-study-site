export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function hasNumber(s) {
  return /\d/.test(s)
}

function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim()
}

function tokenJaccard(a, b) {
  const ta = new Set(normalize(a).split(' ').filter(Boolean))
  const tb = new Set(normalize(b).split(' ').filter(Boolean))
  if (ta.size === 0 || tb.size === 0) return 0
  let inter = 0
  for (const t of ta) if (tb.has(t)) inter++
  const union = ta.size + tb.size - inter
  return union ? inter / union : 0
}

export function makeChoices(allQuestions, correctQuestion, k = 4) {
  const correct = correctQuestion.answer.trim()
  const correctHasNum = hasNumber(correct)
  const pool = allQuestions
    .filter(q => q.id !== correctQuestion.id)
    .map(q => q.answer.trim())
    .filter(a => a && normalize(a) !== normalize(correct))

  // Prefer similar "type" answers (numbers with numbers).
  const preferred = pool.filter(a => (correctHasNum ? hasNumber(a) : true))

  const candidates = (preferred.length >= 20 ? preferred : pool)

  const picked = []
  const maxTries = 800
  let tries = 0
  while (picked.length < k - 1 && tries < maxTries) {
    tries++
    const a = candidates[Math.floor(Math.random() * candidates.length)]
    if (!a) continue
    if (picked.some(x => normalize(x) === normalize(a))) continue
    // Avoid extremely similar answers
    if (tokenJaccard(a, correct) > 0.75) continue
    // Rough length similarity (prevents "Yes" vs full sentence)
    const lenRatio = Math.min(a.length, correct.length) / Math.max(a.length, correct.length)
    if (lenRatio < 0.25) continue
    picked.push(a)
  }

  // Fallback if heuristics were too strict
  while (picked.length < k - 1) {
    const a = pool[Math.floor(Math.random() * pool.length)]
    if (!a) continue
    if (picked.some(x => normalize(x) === normalize(a))) continue
    picked.push(a)
  }

  return shuffle([correct, ...picked]).slice(0, k)
}
