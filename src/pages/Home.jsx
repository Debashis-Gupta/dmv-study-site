import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import questions from '../data.js'

export default function Home() {
  const navigate = useNavigate()

  const navigateToSection = (path) => {
    navigate(path)
  }
  return (
    <div>
      <div className="h1">Study smarter (and happier) 🚗</div>
      <p className="p">
        Pick flashcards for quick memory, do randomized multiple-choice practice, or browse everything in Learning.
      </p>

      <div className="grid">
        <motion.div 
          className="card col-6" 
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigateToSection('/flashcards')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ fontSize: 18, fontWeight: 800 }}>📚 Flashcards</div>
          <div className="small">Flip cards. See answer + explanation. Up to 100 at a time.</div>
          <div style={{ 
            marginTop: '8px', 
            fontSize: '12px', 
            color: 'rgba(124,58,237,0.8)',
            fontWeight: 600 
          }}>
            Click to start →
          </div>
        </motion.div>

        <motion.div 
          className="card col-6" 
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigateToSection('/practice')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ fontSize: 18, fontWeight: 800 }}>🎯 Practice Set (MCQ)</div>
          <div className="small">Pick how many questions. Options auto-generated (1 correct + 3 distractors).</div>
          <div style={{ 
            marginTop: '8px', 
            fontSize: '12px', 
            color: 'rgba(124,58,237,0.8)',
            fontWeight: 600 
          }}>
            Click to start →
          </div>
        </motion.div>

        <motion.div 
          className="card col-12" 
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigateToSection('/learn')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ fontSize: 18, fontWeight: 800 }}>📖 Learning</div>
          <div className="small">Search all questions. Expand to view answer + explanation.</div>
          <div style={{ 
            marginTop: '8px', 
            fontSize: '12px', 
            color: 'rgba(124,58,237,0.8)',
            fontWeight: 600 
          }}>
            Click to start →
          </div>
        </motion.div>
      </div>

      <hr />

      {/* <div className="kpi">
        <span>✅ {questions.length} questions loaded</span>
        <span>🎯 No login required</span>
        <span>📦 Works on GitHub Pages</span>
      </div> */}
    </div>
  )
}
