import { motion } from 'framer-motion'
import { Zap, Trophy, Flame } from 'lucide-react'
import { useStore } from '../../store'
import { getXPToNextLevel, LEVEL_TITLES } from '../../utils/constants'
import { Badge } from '../shared/Badge'
import { ProgressRing } from '../shared/ProgressRing'

export function XPBar() {
  const { xp, level, streak, achievements } = useStore()
  const { current, needed, percent } = getXPToNextLevel(xp)
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
  const nextTitle = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)]
  const earnedAchievements = achievements.filter(a => a.earned)

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-5 col-span-1 md:col-span-2 flex items-center gap-6"
        >
          <ProgressRing percent={percent} size={72} stroke={6} color="#00d4ff" label={`Lv.${level}`} sublabel={title} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-white font-bold">{title}</span>
                <span className="text-white/30 text-xs ml-2">→ {nextTitle}</span>
              </div>
              <div className="flex items-center gap-1 text-arrays text-sm font-bold">
                <Zap size={13} /> {xp.toLocaleString()} XP
              </div>
            </div>
            <div className="relative h-2.5 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: 'linear-gradient(90deg, #00d4ff, #a855f7)', boxShadow: '0 0 12px #00d4ff80' }}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-white/30">
              <span>{current.toLocaleString()} XP</span>
              <span>{needed.toLocaleString()} XP to Lv.{level + 1}</span>
            </div>
          </div>
        </motion.div>

        {/* Streak + Trophy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-5 flex flex-col justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sorting/15 border border-sorting/30 flex items-center justify-center">
              <Flame size={18} className="text-sorting" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{streak}</div>
              <div className="text-xs text-white/40">Day Streak</div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-10 rounded-xl bg-dp/15 border border-dp/30 flex items-center justify-center">
              <Trophy size={18} className="text-dp" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{earnedAchievements.length}</div>
              <div className="text-xs text-white/40">Badges Earned</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      {earnedAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 glass rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-white/60 mb-4">Recent Achievements</h3>
          <div className="flex flex-wrap gap-4">
            {achievements.map(a => (
              <Badge key={a.id} icon={a.icon} name={a.name} description={a.description} earned={a.earned} color={a.color} size="sm" />
            ))}
          </div>
        </motion.div>
      )}
    </section>
  )
}
