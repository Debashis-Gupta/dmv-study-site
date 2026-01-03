import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import questions from '../data.js'
import { shuffle, makeChoices } from '../utils.js'

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)) }

export default function Practice() {
  const [count, setCount] = useState(10)
  const [seed, setSeed] = useState(0)

  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null) // string
  const [score, setScore] = useState(0)
  const [showExpl, setShowExpl] = useState(true)
  const [answers, setAnswers] = useState([]) // Track all answers for review
  const [startTime, setStartTime] = useState(null)
  const [questionStartTime, setQuestionStartTime] = useState(null)
  const [questionTimes, setQuestionTimes] = useState([]) // Track time per question

  const quiz = useMemo(() => {
    const n = clamp(Number(count) || 1, 1, 150)
    return shuffle(questions).slice(0, n)
  }, [count, seed])

  const q = quiz[idx]
  const choices = useMemo(() => q ? makeChoices(questions, q, 4) : [], [q])

  const correct = q?.answer?.trim()

  function pick(choice) {
    if (selected) return
    
    const timeSpent = questionStartTime ? Date.now() - questionStartTime : 0
    setSelected(choice)
    const isCorrect = choice === correct
    if (isCorrect) setScore(s => s + 1)
    
    // Store the answer for review
    const answerData = {
      question: q,
      selected: choice,
      correct: correct,
      isCorrect: isCorrect,
      timeSpent: timeSpent
    }
    setAnswers(prev => [...prev, answerData])
    setQuestionTimes(prev => [...prev, timeSpent])
    
    // Auto-advance to next question or results after a delay
    setTimeout(() => {
      if (idx + 1 >= quiz.length) {
        // Last question - don't increment, just let done become true
        setIdx(quiz.length)
      } else {
        next()
      }
    }, showExpl ? 2000 : 1500) // Longer delay if explanation is shown
  }

  function next() {
    if (idx + 1 < quiz.length) {
      setSelected(null)
      setIdx(i => i + 1)
      setQuestionStartTime(Date.now())
    }
  }

  function restart() {
    setIdx(0)
    setSelected(null)
    setScore(0)
    setAnswers([])
    setQuestionTimes([])
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
    setSeed(s => s + 1)
  }

  const done = idx >= quiz.length
  const totalTime = startTime ? Date.now() - startTime : 0

  useEffect(() => {
    setIdx(0); 
    setSelected(null); 
    setScore(0)
    setAnswers([])
    setQuestionTimes([])
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
  }, [count, seed])

  return (
    <div>
      <div className="h1">Practice Set 🎯</div>
      <p className="p">Pick how many questions. Options are auto-generated: 1 correct + 3 distractors.</p>

      <div className="grid">
        <div className="card col-6">
          <div className="small">How many questions?</div>
          <input className="input" type="number" min="1" max="150" value={count} onChange={(e) => setCount(e.target.value)} />
        </div>
        <div className="card col-6">
          <div className="small">Settings</div>
          <label className="small" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input type="checkbox" checked={showExpl} onChange={(e) => setShowExpl(e.target.checked)} />
            Show explanation after answering
          </label>
          <div className="kpi" style={{ marginTop: 8 }}>
            <span>Score: {score}</span>
            <span>Progress: {Math.min(idx + 1, quiz.length)} / {quiz.length}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14 }} />

      {done ? (
        <motion.div 
          className="card" 
          initial={{ opacity: 0, scale: 0.8, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        >
          <motion.div 
            style={{ fontSize: 22, fontWeight: 900, textAlign: 'center' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
          >
            {score === quiz.length ? '🎉 Perfect Score! 🎉' : 
             score >= quiz.length * 0.8 ? '🌟 Excellent! 🌟' : 
             score >= quiz.length * 0.6 ? '👍 Good Job! 👍' : 
             '📚 Keep Studying! 📚'}
          </motion.div>
          
          <div className="small" style={{ textAlign: 'center', marginTop: 8 }}>Your score</div>
          <motion.div 
            style={{ fontSize: 34, fontWeight: 900, marginTop: 6, textAlign: 'center' }}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
          >
            {score} / {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
          </motion.div>

          {totalTime > 0 && (
            <motion.div 
              style={{ textAlign: 'center', marginTop: 10 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="small">⏱️ Total time: {Math.round(totalTime / 1000)}s</div>
              <div className="small">⚡ Avg per question: {Math.round(totalTime / quiz.length / 1000)}s</div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{ marginTop: 16 }}
          >
            <details>
              <summary style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}>
                📊 Review Your Answers
              </summary>
              <div style={{ marginTop: 12, maxHeight: '300px', overflowY: 'auto' }}>
                {answers.map((answer, i) => (
                  <motion.div
                    key={i}
                    className={`card ${answer.isCorrect ? 'good' : 'bad'}`}
                    style={{ 
                      margin: '8px 0', 
                      padding: '12px',
                      border: `2px solid ${answer.isCorrect ? '#4CAF50' : '#f44336'}`,
                      borderRadius: '8px'
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>
                      Q{i + 1}: {answer.question.question}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: 4 }}>
                      <span style={{ color: answer.isCorrect ? '#4CAF50' : '#f44336' }}>
                        Your answer: {answer.selected}
                      </span>
                      {!answer.isCorrect && (
                        <div style={{ color: '#4CAF50' }}>
                          Correct answer: {answer.correct}
                        </div>
                      )}
                      <div style={{ color: '#666', fontSize: '11px', marginTop: 2 }}>
                        ⏱️ {Math.round(answer.timeSpent / 1000)}s
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </details>
          </motion.div>

          <motion.div 
            style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}
            className="btn-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <button className="btn btn-primary" onClick={restart}>
              🚀 New Practice Set
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={q?.id}
            className="card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 1.05 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
          >
            <motion.div 
              className="small"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Question {idx + 1} of {quiz.length}
            </motion.div>
            
            <motion.div 
              style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {q?.question}
            </motion.div>

            <motion.div 
              style={{ marginTop: 12, display: 'grid', gap: 10 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {choices.map((c, index) => {
                const isGood = selected && c === correct
                const isBad = selected && c === selected && selected !== correct
                return (
                  <motion.button
                    key={c}
                    className={'option' + (isGood ? ' good' : '') + (isBad ? ' bad' : '')}
                    onClick={() => pick(c)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ 
                      scale: selected ? 1 : 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: selected ? 1 : 0.98 
                    }}
                    style={{
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {selected && isGood && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '20px'
                        }}
                      >
                        ✅
                      </motion.div>
                    )}
                    {selected && isBad && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '20px'
                        }}
                      >
                        ❌
                      </motion.div>
                    )}
                    {c}
                  </motion.button>
                )
              })}
            </motion.div>

            {selected && showExpl && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: "spring" }}
                style={{ 
                  marginTop: 14,
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.12)'
                }}
              >
                <div className="small" style={{ fontWeight: 600 }}>💡 Explanation</div>
                <div style={{ marginTop: 6 }}>{q?.explanation}</div>
              </motion.div>
            )}

            <motion.div 
              style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {!selected && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  style={{ fontSize: '14px', color: '#666', alignSelf: 'center' }}
                >
                  👆 Select an answer above
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
