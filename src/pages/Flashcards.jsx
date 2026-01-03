import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import questions from '../data.js'
import { shuffle } from '../utils.js'

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)) }

export default function Flashcards() {
  const [maxCount, setMaxCount] = useState(25)
  const [deckKey, setDeckKey] = useState(0)
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const deck = useMemo(() => {
    const n = clamp(Number(maxCount) || 1, 1, 100)
    return shuffle(questions).slice(0, n)
  }, [deckKey, maxCount])

  const card = deck[idx]

  function next() {
    setFlipped(false)
    setIdx((i) => (i + 1) % deck.length)
  }

  function prev() {
    setFlipped(false)
    setIdx((i) => (i - 1 + deck.length) % deck.length)
  }

  function newDeck() {
    setIdx(0)
    setFlipped(false)
    setDeckKey(k => k + 1)
  }

  return (
    <div>
      <div className="h1">Flashcards 🃏</div>
      <p className="p">Flip to reveal the answer and explanation. Make a new deck anytime.</p>

      <div className="grid">
        <div className="card col-6">
          <div className="small">Max cards (1–100)</div>
          <input className="input" type="number" min="1" max="100" value={maxCount} onChange={(e) => setMaxCount(e.target.value)} />
        </div>
        <div className="card col-6">
          <div className="small">Progress</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{idx + 1} / {deck.length}</div>
          <div className="small">Tip: spacebar to flip</div>
        </div>
      </div>

      <div style={{ marginTop: 14 }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={card?.id + '-' + flipped}
          className="card"
          role="button"
          tabIndex={0}
          onClick={() => setFlipped(f => !f)}
          onKeyDown={(e) => { if (e.code === 'Space') { e.preventDefault(); setFlipped(f => !f) } }}
          initial={{ opacity: 0, rotateX: 12, y: 10 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ cursor: 'pointer' }}
        >
          {!flipped ? (
            <>
              <div className="small">Question</div>
              <div style={{ fontSize: 22, fontWeight: 850 }}>{card?.question}</div>
              <div className="small" style={{ marginTop: 10 }}>Click to flip</div>
            </>
          ) : (
            <>
              <div className="small">Answer</div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{card?.answer}</div>
              <div className="small" style={{ marginTop: 10 }}>Explanation</div>
              <div style={{ marginTop: 6 }}>{card?.explanation}</div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }} className="btn-container">
        <button className="btn" onClick={prev}>⬅ Prev</button>
        <button className="btn" onClick={() => setFlipped(f => !f)}>🔄 Flip</button>
        <button className="btn" onClick={next}>Next ➡</button>
        <button className="btn btn-primary" onClick={newDeck}>✨ New deck</button>
      </div>
    </div>
  )
}
