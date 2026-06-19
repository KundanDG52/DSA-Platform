import { motion } from 'framer-motion'
import { Crown, Zap } from 'lucide-react'
import { LEADERBOARD } from '../../utils/constants'
import { useStore } from '../../store'

export function Leaderboard() {
  const { xp, level } = useStore()
  const myRank = LEADERBOARD.filter(p => p.xp > xp).length + 1

  const all = [
    ...LEADERBOARD,
    { rank: myRank, name: 'You', xp, level, avatar: '★', color: '#00d4ff' },
  ].sort((a, b) => b.xp - a.xp).slice(0, 6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Crown size={14} className="text-dp" />
        <span className="text-xs font-semibold text-dp uppercase tracking-wider">Leaderboard</span>
      </div>

      <div className="flex flex-col gap-2">
        {all.map((player, i) => {
          const isMe = player.name === 'You'
          return (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={{
                background: isMe ? `${player.color}12` : 'rgba(255,255,255,0.03)',
                border: isMe ? `1px solid ${player.color}30` : '1px solid transparent',
              }}
            >
              <span className="w-5 text-center text-xs font-bold" style={{ color: i < 3 ? ['#f59e0b','#9ca3af','#cd7c5a'][i] : 'rgba(255,255,255,0.3)' }}>
                {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
              </span>

              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: `${player.color}20`, color: player.color }}
              >
                {player.avatar}
              </div>

              <span className="flex-1 text-sm font-medium text-white truncate">{player.name}</span>

              <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: player.color }}>
                <Zap size={10} /> {player.xp.toLocaleString()}
              </div>

              <span className="text-xs text-white/30 font-mono w-12 text-right">Lv.{player.level}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
