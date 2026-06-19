import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Zap, ChevronRight } from 'lucide-react'
import { DAILY_CHALLENGES } from '../../utils/constants'
import { useStore } from '../../store'

const DIFFICULTY_LABELS = ['', 'Easy', 'Medium', 'Hard', 'Expert', 'Legend']
const DIFFICULTY_COLORS = ['', '#00ff88', '#f59e0b', '#ff6b35', '#ec4899', '#a855f7']

export function DailyChallenge() {
  const todayIdx = new Date().getDate() % DAILY_CHALLENGES.length
  const challenge = DAILY_CHALLENGES[todayIdx]
  const { completedProblems, completeProblem } = useStore()
  const isDone = completedProblems.includes(challenge.id)
  const [solved, setSolved] = useState(isDone)

  const handleSolve = () => {
    if (solved) return
    setSolved(true)
    completeProblem(challenge.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-5 border border-arrays/20"
      style={{ boxShadow: '0 0 30px rgba(0,212,255,0.06)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Target size={14} className="text-arrays" />
        <span className="text-xs font-semibold text-arrays uppercase tracking-wider">Daily Challenge</span>
        <span className="ml-auto text-xs text-white/30">{new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
      </div>

      <h3 className="text-base font-bold text-white mb-1">{challenge.title}</h3>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">{challenge.topic}</span>
        <span className="text-xs font-semibold" style={{ color: DIFFICULTY_COLORS[challenge.difficulty] }}>
          {DIFFICULTY_LABELS[challenge.difficulty]}
        </span>
        <div className="flex items-center gap-1 ml-auto text-xs text-arrays font-semibold">
          <Zap size={11} /> +{challenge.xpReward} XP
        </div>
      </div>

      <button
        onClick={handleSolve}
        disabled={solved}
        className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
        style={{
          background: solved ? 'rgba(0,255,136,0.15)' : 'linear-gradient(135deg, #00d4ff20, #a855f720)',
          border: solved ? '1px solid rgba(0,255,136,0.4)' : '1px solid rgba(0,212,255,0.3)',
          color: solved ? '#00ff88' : 'white',
        }}
      >
        {solved ? '✓ Completed!' : (<>Solve Challenge <ChevronRight size={14} /></>)}
      </button>
    </motion.div>
  )
}
