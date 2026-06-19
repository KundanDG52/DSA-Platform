import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { SortingRace } from '../components/sorting/SortingRace'
import { GlassCard } from '../components/shared/GlassCard'
import { useStore } from '../store'

const COMPLEXITY_TABLE = [
  { name: 'Bubble',    best: 'O(n)',      avg: 'O(n²)',      worst: 'O(n²)',       space: 'O(1)',      stable: true  },
  { name: 'Insertion', best: 'O(n)',      avg: 'O(n²)',      worst: 'O(n²)',       space: 'O(1)',      stable: true  },
  { name: 'Selection', best: 'O(n²)',     avg: 'O(n²)',      worst: 'O(n²)',       space: 'O(1)',      stable: false },
  { name: 'Merge',     best: 'O(n log n)',avg: 'O(n log n)', worst: 'O(n log n)',  space: 'O(n)',      stable: true  },
  { name: 'Quick',     best: 'O(n log n)',avg: 'O(n log n)', worst: 'O(n²)',       space: 'O(log n)',  stable: false },
  { name: 'Heap',      best: 'O(n log n)',avg: 'O(n log n)', worst: 'O(n log n)',  space: 'O(1)',      stable: false },
]

export function Sorting() {
  const { completeModule, addXP } = useStore()
  useEffect(() => { addXP(10); completeModule('sorting') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#ec489915', border: '1px solid #ec489930' }}>📊</div>
          <div>
            <h1 className="text-2xl font-black text-white">Sorting Algorithms</h1>
            <p className="text-white/40 text-sm">Race multiple algorithms side-by-side in real time</p>
          </div>
        </div>
      </motion.div>

      <GlassCard delay={0.1} className="p-6">
        <h2 className="text-base font-bold text-sorting mb-1">Sorting Race</h2>
        <p className="text-sm text-white/40 mb-4">
          Select algorithms, choose input type, hit Play. Watch comparisons and swaps counter in real time.
          <span className="text-sorting ml-1">🟠 Comparing</span>
          <span className="text-sorting ml-3">🟡 Swapping</span>
          <span className="text-sorting ml-3">💗 Pivot</span>
        </p>
        <SortingRace />
      </GlassCard>

      <GlassCard delay={0.2} className="p-6">
        <h2 className="text-base font-bold text-white mb-4">Complexity Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-white/40 font-medium">Algorithm</th>
                <th className="text-center py-2 text-trees text-xs font-medium">Best</th>
                <th className="text-center py-2 text-sorting text-xs font-medium">Average</th>
                <th className="text-center py-2 text-graphs text-xs font-medium">Worst</th>
                <th className="text-center py-2 text-dp text-xs font-medium">Space</th>
                <th className="text-center py-2 text-white/40 text-xs font-medium">Stable?</th>
              </tr>
            </thead>
            <tbody>
              {COMPLEXITY_TABLE.map(row => (
                <tr key={row.name} className="border-b border-white/5">
                  <td className="py-2.5 font-semibold text-white/80">{row.name}</td>
                  <td className="py-2.5 text-center font-mono text-xs text-trees">{row.best}</td>
                  <td className="py-2.5 text-center font-mono text-xs text-sorting">{row.avg}</td>
                  <td className="py-2.5 text-center font-mono text-xs text-graphs">{row.worst}</td>
                  <td className="py-2.5 text-center font-mono text-xs text-dp">{row.space}</td>
                  <td className="py-2.5 text-center text-xs">{row.stable ? <span className="text-trees">Yes</span> : <span className="text-graphs">No</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
