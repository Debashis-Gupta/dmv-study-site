import { Routes, Route, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import Home from './pages/Home.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Practice from './pages/Practice.jsx'
import Learn from './pages/Learn.jsx'

function Pill({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 'pill' + (isActive ? ' btn-primary' : '')}
      style={{ display: 'inline-block' }}
    >
      {children}
    </NavLink>
  )
}

export default function App() {
  return (
    <div className="container">
      <div className="nav">
        <div className="nav-left">
          <div className="badge">DMV Happy Practice ✨</div>
          <div className="small">Flashcards • MCQs • Learn</div>
        </div>
        <div className="nav-links">
          <Pill to="/">Home</Pill>
          <Pill to="/flashcards">Flashcards</Pill>
          <Pill to="/practice">Practice</Pill>
          <Pill to="/learn">Learning</Pill>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/learn" element={<Learn />} />
        </Routes>
      </motion.div>

      <div className="small" style={{ marginTop: 18 }}>
        🚫 No accounts • 🔒 No tracking
      </div>

      <motion.div 
        style={{ 
          marginTop: 20, 
          paddingTop: 15, 
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center' 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="small" style={{ color: '#666' }}>
          © 2026 Copyright by <strong>Debashis Gupta</strong> ✨
        </div>
      </motion.div>
    </div>
  )
}
