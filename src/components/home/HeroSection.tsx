import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

interface FloatNode { x: number; y: number; vx: number; vy: number; r: number; color: string }
interface FloatEdge { a: number; b: number; opacity: number }

const COLORS = ['#00d4ff', '#00ff88', '#ff6b35', '#a855f7', '#ec4899', '#f59e0b']

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let W = canvas.offsetWidth
    let H = canvas.offsetHeight

    canvas.width = W; canvas.height = H

    const nodes: FloatNode[] = Array.from({ length: 20 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 3 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    const edges: FloatEdge[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < 0.18) edges.push({ a: i, b: j, opacity: Math.random() * 0.3 + 0.05 })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Draw edges
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b]
        const dx = b.x - a.x, dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 250) continue
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(255,255,255,${e.opacity * (1 - dist / 250)})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.color + '80'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.strokeStyle = n.color
        ctx.lineWidth = 1.5
        ctx.stroke()

        // glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3)
        grd.addColorStop(0, n.color + '30')
        grd.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // move
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-arrays/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-2 bg-arrays/10 border border-arrays/30 rounded-full px-4 py-1.5 text-xs font-semibold text-arrays"
        >
          <Sparkles size={12} />
          Interactive DSA Learning Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl md:text-7xl font-black leading-tight"
        >
          Master DSA{' '}
          <span className="gradient-text">Visually</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed"
        >
          Step-by-step animated visualizations of arrays, trees, graphs, sorting, and dynamic programming.
          Learn by watching, then master by doing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link to="/arrays" className="btn-primary flex items-center gap-2 text-sm font-bold">
            Start Learning <ArrowRight size={16} />
          </Link>
          <Link to="/playground" className="btn-ghost text-sm">
            Open Playground
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-8 pt-4"
        >
          {[
            { label: 'Algorithms', value: '40+' },
            { label: 'Visualizations', value: '80+' },
            { label: 'Problems', value: '20+' },
            { label: 'Modules', value: '6' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl font-black gradient-text">{stat.value}</span>
              <span className="text-xs text-white/40 mt-0.5">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </section>
  )
}
