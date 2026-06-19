import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Menu, X, Zap, Flame } from 'lucide-react'
import { useStore } from '../../store'
import { getLevelFromXP, getXPToNextLevel, LEVEL_TITLES } from '../../utils/constants'

const NAV_LINKS = [
  { to: '/arrays',     label: 'Arrays',   color: '#00d4ff' },
  { to: '/linkedlist', label: 'LinkedList', color: '#f59e0b' },
  { to: '/trees',      label: 'Trees',    color: '#00ff88' },
  { to: '/graphs',     label: 'Graphs',   color: '#ff6b35' },
  { to: '/sorting',    label: 'Sorting',  color: '#ec4899' },
  { to: '/dp',         label: 'DP',       color: '#a855f7' },
]

export function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const xp = useStore(s => s.xp)
  const streak = useStore(s => s.streak)
  const level = getLevelFromXP(xp)
  const { percent } = getXPToNextLevel(xp)
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-white shrink-0">
          <div className="w-7 h-7 rounded-lg bg-arrays/20 border border-arrays/40 flex items-center justify-center">
            <Brain size={14} className="text-arrays" />
          </div>
          <span className="hidden sm:block gradient-text text-sm font-extrabold tracking-tight">DSA Visualizer</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {NAV_LINKS.map(link => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ color: active ? link.color : 'rgba(255,255,255,0.5)' }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: `${link.color}12`, border: `1px solid ${link.color}30` }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right side: XP + streak */}
        <div className="ml-auto flex items-center gap-3">
          {streak > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-sorting">
              <Flame size={12} /> {streak}d
            </div>
          )}

          <Link to="/" className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <Zap size={11} className="text-arrays" />
              <span className="text-xs font-bold text-arrays">{xp.toLocaleString()} XP</span>
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-arrays"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] text-white/40">Lv.{level} {title}</span>
            </div>
          </Link>

          <Link to="/playground" className="btn-ghost text-xs hidden md:block">Playground</Link>

          {/* Mobile menu toggle */}
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-white/10" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 overflow-hidden"
          >
            <nav className="p-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: location.pathname === link.to ? link.color : 'rgba(255,255,255,0.6)',
                    background: location.pathname === link.to ? `${link.color}10` : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/playground" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60">
                Playground
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
