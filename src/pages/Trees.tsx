import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BSTVisualizer } from '../components/trees/BSTVisualizer'
import { GlassCard } from '../components/shared/GlassCard'
import { useStore } from '../store'

export function Trees() {
  const { completeModule, addXP } = useStore()
  useEffect(() => { addXP(10); completeModule('trees') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#00ff8815', border: '1px solid #00ff8830' }}>🌳</div>
          <div>
            <h1 className="text-2xl font-black text-white">Trees</h1>
            <p className="text-white/40 text-sm">BST • AVL • Traversals • Tries</p>
          </div>
          <span className="ml-auto text-trees font-mono font-bold text-sm hidden sm:block">O(log n) avg</span>
        </div>
      </motion.div>

      <GlassCard delay={0.1} className="p-6">
        <h2 className="text-base font-bold text-trees mb-4">Binary Search Tree</h2>
        <p className="text-sm text-white/40 mb-4">Click a node to set it as start for traversal. Insert values to watch the tree grow with animated comparisons.</p>
        <BSTVisualizer />
      </GlassCard>

      <GlassCard delay={0.2} className="p-6">
        <h2 className="text-base font-bold text-white mb-4">BST Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'BST Property',    desc: 'Left subtree values < root < right subtree values', color: '#00ff88' },
            { label: 'Balanced BST',    desc: 'Height O(log n). AVL and Red-Black trees self-balance.', color: '#00d4ff' },
            { label: 'Degenerate Tree', desc: 'Sorted input → linked list. Height O(n). Always balance!', color: '#ff6b35' },
          ].map(p => (
            <div key={p.label} className="rounded-xl p-4 border" style={{ background: `${p.color}08`, borderColor: `${p.color}20` }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: p.color }}>{p.label}</h3>
              <p className="text-xs text-white/50">{p.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard delay={0.3} className="p-6">
        <h2 className="text-base font-bold text-white mb-4">Traversal Complexity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-white/40 font-medium">Traversal</th>
                <th className="text-left py-2 text-white/40 font-medium">Order</th>
                <th className="text-left py-2 text-white/40 font-medium">Use Case</th>
                <th className="text-center py-2 text-trees font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Inorder',    order: 'L → Root → R', use: 'Sorted output from BST',     complexity: 'O(n)' },
                { name: 'Preorder',   order: 'Root → L → R', use: 'Copy tree, serialize',        complexity: 'O(n)' },
                { name: 'Postorder',  order: 'L → R → Root', use: 'Delete tree, evaluate expr',  complexity: 'O(n)' },
                { name: 'Level-Order',order: 'BFS by level',  use: 'Shortest path, level info',  complexity: 'O(n)' },
              ].map(r => (
                <tr key={r.name} className="border-b border-white/5">
                  <td className="py-2.5 font-medium text-dp">{r.name}</td>
                  <td className="py-2.5 font-mono text-xs text-white/60">{r.order}</td>
                  <td className="py-2.5 text-xs text-white/50">{r.use}</td>
                  <td className="py-2.5 text-center font-mono text-trees text-xs">{r.complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
