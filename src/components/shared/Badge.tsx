import { motion } from 'framer-motion'

interface BadgeProps {
  icon: string
  name: string
  description: string
  earned: boolean
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({ icon, name, description, earned, color = '#00d4ff', size = 'md' }: BadgeProps) {
  const sizes = { sm: 'w-12 h-12 text-xl', md: 'w-16 h-16 text-2xl', lg: 'w-20 h-20 text-3xl' }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center gap-2 ${!earned ? 'opacity-40 grayscale' : ''}`}
      title={description}
    >
      <div
        className={`${sizes[size]} rounded-2xl flex items-center justify-center border transition-all`}
        style={{
          background: earned ? `linear-gradient(135deg, ${color}20, ${color}10)` : 'rgba(255,255,255,0.04)',
          borderColor: earned ? `${color}60` : 'rgba(255,255,255,0.08)',
          boxShadow: earned ? `0 0 20px ${color}30` : 'none',
        }}
      >
        <span>{icon}</span>
      </div>
      <span className="text-xs font-medium text-white/70 text-center leading-tight">{name}</span>
    </motion.div>
  )
}

interface LevelBadgeProps {
  level: number
  title: string
}

export function LevelBadge({ level, title }: LevelBadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-arrays/10 border border-arrays/30 rounded-full px-3 py-1">
      <span className="text-arrays font-mono font-bold text-sm">Lv.{level}</span>
      <span className="text-white/70 text-xs">{title}</span>
    </div>
  )
}

interface DifficultyStarsProps {
  difficulty: 1 | 2 | 3 | 4 | 5
  color?: string
}

export function DifficultyStars({ difficulty, color = '#00d4ff' }: DifficultyStarsProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-sm"
          style={{ background: i < difficulty ? color : 'rgba(255,255,255,0.12)' }}
        />
      ))}
    </div>
  )
}
