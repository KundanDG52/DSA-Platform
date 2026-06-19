import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrayVisualizer } from '../components/arrays/ArrayVisualizer'
import { TwoSumViz } from '../components/arrays/TwoSumViz'
import { GlassCard } from '../components/shared/GlassCard'
import { useStore } from '../store'

const COMPLEXITY = [
  { op: 'Access',  best: 'O(1)',   avg: 'O(1)',    worst: 'O(1)'  },
  { op: 'Search',  best: 'O(1)',   avg: 'O(n)',    worst: 'O(n)'  },
  { op: 'Insert',  best: 'O(1)',   avg: 'O(n)',    worst: 'O(n)'  },
  { op: 'Delete',  best: 'O(1)',   avg: 'O(n)',    worst: 'O(n)'  },
]

export function Arrays() {
  const { completeModule, addXP } = useStore()

  useEffect(() => {
    addXP(10)
    completeModule('arrays')
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-arrays/15 border border-arrays/30 flex items-center justify-center text-xl">⬛</div>
          <div>
            <h1 className="text-2xl font-black text-white">Arrays</h1>
            <p className="text-white/40 text-sm">Contiguous memory • O(1) access • O(n) insert/delete</p>
          </div>
          <span className="ml-auto text-arrays font-mono font-bold text-sm hidden sm:block">O(1) access</span>
        </div>
      </motion.div>

      {/* Main visualizer */}
      <GlassCard delay={0.1} className="p-6">
        <h2 className="text-base font-bold text-arrays mb-4">Interactive Array Visualizer</h2>
        <ArrayVisualizer />
      </GlassCard>

      {/* Two Sum problem */}
      <GlassCard delay={0.2} className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-bold text-white">Problem: Two Sum</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#00ff8820', color: '#00ff88', border: '1px solid #00ff8840' }}>Easy</span>
        </div>
        <p className="text-sm text-white/40 mb-4">Given an array of integers and a target sum, find two numbers that add up to the target using a hash map.</p>
        <TwoSumViz />
      </GlassCard>

      {/* Complexity table */}
      <GlassCard delay={0.3} className="p-6">
        <h2 className="text-base font-bold text-white mb-4">Time Complexity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-white/40 font-medium">Operation</th>
                <th className="text-center py-2 text-trees font-medium">Best</th>
                <th className="text-center py-2 text-sorting font-medium">Average</th>
                <th className="text-center py-2 text-graphs font-medium">Worst</th>
              </tr>
            </thead>
            <tbody>
              {COMPLEXITY.map(row => (
                <tr key={row.op} className="border-b border-white/5">
                  <td className="py-2.5 font-medium text-white/70">{row.op}</td>
                  <td className="py-2.5 text-center font-mono text-trees">{row.best}</td>
                  <td className="py-2.5 text-center font-mono text-sorting">{row.avg}</td>
                  <td className="py-2.5 text-center font-mono text-graphs">{row.worst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Key concepts */}
      <GlassCard delay={0.4} className="p-6">
        <h2 className="text-base font-bold text-white mb-4">Key Patterns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Sliding Window', desc: 'Maintain a window of elements. Slide right, adjusting window as needed.', color: '#a855f7', complexity: 'O(n)' },
            { title: 'Two Pointers',   desc: 'Use two indices moving toward each other or in the same direction.', color: '#00d4ff', complexity: 'O(n)' },
            { title: 'Prefix Sum',     desc: 'Precompute cumulative sums for O(1) range sum queries.', color: '#00ff88', complexity: 'O(n) build, O(1) query' },
            { title: 'Hash Map',       desc: 'Store value→index mapping for O(1) complement lookups.', color: '#ff6b35', complexity: 'O(n)' },
          ].map(p => (
            <div key={p.title} className="rounded-xl p-4 border" style={{ background: `${p.color}08`, borderColor: `${p.color}25` }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm" style={{ color: p.color }}>{p.title}</h3>
                <span className="text-xs font-mono text-white/30">{p.complexity}</span>
              </div>
              <p className="text-xs text-white/50">{p.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
