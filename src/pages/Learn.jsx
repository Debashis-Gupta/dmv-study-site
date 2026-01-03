import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import questions from '../data.js'

function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim()
}

export default function Learn() {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const needle = normalize(q)
    if (!needle) return questions
    return questions.filter(x =>
      normalize(x.question).includes(needle) ||
      normalize(x.answer).includes(needle) ||
      normalize(x.explanation).includes(needle)
    )
  }, [q])

  return (
    <div>
      <div className="h1">Learning 📚</div>
      <p className="p">Search and expand any item to see the answer and explanation.</p>

      <div className="card">
        <div className="small">Search</div>
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try: speed limit, alcohol, right-of-way..." />
        <div className="small" style={{ marginTop: 8 }}>{filtered.length} results</div>
      </div>

      <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
        {filtered.map((item) => (
          <motion.details
            key={item.id}
            className="card"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.15 }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 850, fontSize: 16 }}>
              {item.id}. {item.question}
            </summary>
            <div style={{ marginTop: 10 }}>
              <div className="small">Answer</div>
              <div style={{ fontWeight: 900, fontSize: 18, marginTop: 4 }}>{item.answer}</div>
              <div className="small" style={{ marginTop: 10 }}>Explanation</div>
              <div style={{ marginTop: 4 }}>{item.explanation}</div>
            </div>
          </motion.details>
        ))}
      </div>
    </div>
  )
}
