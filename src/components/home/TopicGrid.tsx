import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ChevronRight } from 'lucide-react'
import { TOPICS } from '../../utils/constants'
import { DifficultyStars } from '../shared/Badge'
import { ProgressRing } from '../shared/ProgressRing'
import { useStore } from '../../store'

export function TopicGrid() {
  const topicProgress = useStore(s => s.topicProgress)

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Learning Modules</h2>
          <p className="text-white/40 text-sm mt-1">Master every fundamental data structure</p>
        </div>
        <span className="text-xs text-white/30">{Object.values(topicProgress).filter(p => p.completed).length}/{TOPICS.length} completed</span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map((topic, i) => {
          const progress = topicProgress[topic.id]
          const pct = progress?.completed ? 100 : 0

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={topic.path} className="topic-card block group">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                    style={{ background: `${topic.color}15`, borderColor: `${topic.color}30` }}
                  >
                    {topic.icon}
                  </div>
                  <ProgressRing percent={pct} size={44} stroke={4} color={topic.color} label={`${pct}%`} />
                </div>

                <h3 className="font-bold text-white text-base mb-1" style={{ color: pct > 0 ? topic.color : 'white' }}>
                  {topic.name}
                </h3>
                <p className="text-xs text-white/40 mb-3 leading-relaxed">{topic.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <DifficultyStars difficulty={topic.difficulty} color={topic.color} />
                    <div className="flex items-center gap-1 text-xs text-white/30">
                      <Clock size={10} /> {topic.estimatedMinutes}min
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Subtopic chips */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {topic.subtopics.slice(0, 3).map(sub => (
                    <span
                      key={sub}
                      className="text-[10px] px-2 py-0.5 rounded-full border"
                      style={{ borderColor: `${topic.color}25`, color: `${topic.color}99` }}
                    >
                      {sub}
                    </span>
                  ))}
                  {topic.subtopics.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 text-white/20">+{topic.subtopics.length - 3}</span>
                  )}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
