import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraphCanvas } from '../components/graphs/GraphCanvas'
import { GlassCard } from '../components/shared/GlassCard'
import { useStore } from '../store'

export function Graphs() {
  const { completeModule, addXP } = useStore()
  useEffect(() => { addXP(10); completeModule('graphs') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#ff6b3515', border: '1px solid #ff6b3530' }}>🕸️</div>
          <div>
            <h1 className="text-2xl font-black text-white">Graphs</h1>
            <p className="text-white/40 text-sm">BFS • DFS • Dijkstra • Topological Sort</p>
          </div>
          <span className="ml-auto text-graphs font-mono font-bold text-sm hidden sm:block">V+E operations</span>
        </div>
      </motion.div>

      <GlassCard delay={0.1} className="p-6">
        <h2 className="text-base font-bold text-graphs mb-1">Graph Algorithm Visualizer</h2>
        <p className="text-sm text-white/40 mb-4">Select an algorithm and click Run. Click a node label to set it as the start. Watch the traversal unfold step by step.</p>
        <GraphCanvas />
      </GlassCard>

      <GlassCard delay={0.2} className="p-6">
        <h2 className="text-base font-bold text-white mb-4">Algorithm Comparison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'BFS',      color: '#00d4ff', time: 'O(V+E)', space: 'O(V)', use: 'Shortest path (unweighted), level traversal, connected components' },
            { name: 'DFS',      color: '#a855f7', time: 'O(V+E)', space: 'O(V)', use: 'Topological sort, cycle detection, strongly connected components' },
            { name: 'Dijkstra', color: '#ff6b35', time: 'O((V+E) log V)', space: 'O(V)', use: 'Shortest path in weighted graph (non-negative weights)' },
          ].map(a => (
            <div key={a.name} className="rounded-xl p-4 border" style={{ background: `${a.color}08`, borderColor: `${a.color}20` }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm" style={{ color: a.color }}>{a.name}</h3>
                <span className="text-xs font-mono text-white/30">Space: {a.space}</span>
              </div>
              <p className="text-xs font-mono mb-2" style={{ color: a.color }}>Time: {a.time}</p>
              <p className="text-xs text-white/50">{a.use}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard delay={0.3} className="p-6">
        <h2 className="text-base font-bold text-white mb-4">Graph Representations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Adjacency Matrix', best: 'Edge check O(1)', worst: 'Space O(V²)', code: 'graph[u][v] = weight' },
            { name: 'Adjacency List',   best: 'Space O(V+E)',    worst: 'Edge check O(deg)', code: 'graph[u].append((v, w))' },
          ].map(r => (
            <div key={r.name} className="rounded-xl p-4 border border-white/08 bg-white/02">
              <h3 className="font-semibold text-sm text-white/80 mb-2">{r.name}</h3>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-trees">✓ {r.best}</span>
                <span className="text-xs text-graphs">⚠ {r.worst}</span>
              </div>
              <code className="block mt-2 text-xs font-mono text-arrays/80 bg-bg/60 rounded px-2 py-1">{r.code}</code>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
