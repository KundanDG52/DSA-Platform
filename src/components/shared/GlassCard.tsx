import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: string
  hover?: boolean
  onClick?: () => void
  delay?: number
}

export function GlassCard({ children, className = '', glow, hover = false, onClick, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      onClick={onClick}
      className={`glass rounded-2xl ${glow ?? ''} ${hover ? 'cursor-pointer' : ''} ${className}`}
      style={glow ? { boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)` } : undefined}
    >
      {children}
    </motion.div>
  )
}
