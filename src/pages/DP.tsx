import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FibonacciTree } from '../components/dp/FibonacciTree'
import { LCSGrid } from '../components/dp/LCSGrid'
import { GlassCard } from '../components/shared/GlassCard'
import { useStore } from '../store'

export function DP() {
  const { completeModule, addXP } = useStore()
  useEffect(() => { addXP(10); completeModule('dp') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#a855f715', border: '1px solid #a855f730' }}>🧮</div>
          <div>
            <h1 className="text-2xl font-black text-white">Dynamic Programming</h1>
            <p className="text-white/40 text-sm">Overlapping subproblems • Optimal substructure • Memoization</p>
          </div>
        </div>
      </motion.div>

      {/* Core concepts */}
      <GlassCard delay={0.05} className="p-6">
        <h2 className="text-base font-bold text-dp mb-3">Two Pillars of DP</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 border border-dp/20 bg-dp/05">
            <h3 className="font-bold text-dp text-sm mb-2">Overlapping Subproblems</h3>
            <p className="text-xs text-white/50">Same subproblems are solved multiple times. Memoization (top-down) or tabulation (bottom-up) stores results to avoid recomputation.</p>
            <div className="mt-2 font-mono text-xs text-dp/70 bg-bg/60 rounded px-2 py-1.5">fib(5) = fib(4) + fib(3)<br/>fib(4) = fib(3) + fib(2)  ← repeated!</div>
          </div>
          <div className="rounded-xl p-4 border border-trees/20 bg-trees/05">
            <h3 className="font-bold text-trees text-sm mb-2">Optimal Substructure</h3>
            <p className="text-xs text-white/50">Optimal solution of the problem contains optimal solutions to its subproblems.</p>
            <div className="mt-2 font-mono text-xs text-trees/70 bg-bg/60 rounded px-2 py-1.5">shortest_path(A, C) =<br/>shortest_path(A, B) + path(B, C)</div>
          </div>
        </div>
      </GlassCard>

      <GlassCard delay={0.1} className="p-6">
        <h2 className="text-base font-bold text-dp mb-1">Fibonacci: Memoization</h2>
        <p className="text-sm text-white/40 mb-4">Watch how top-down DP avoids redundant calls. Once computed, results are stored and reused.</p>
        <FibonacciTree />
      </GlassCard>

      <GlassCard delay={0.2} className="p-6">
        <h2 className="text-base font-bold text-dp mb-1">Longest Common Subsequence</h2>
        <p className="text-sm text-white/40 mb-4">Classic 2D DP. Watch the table fill as we compare characters. The longest subsequence common to both strings.</p>
        <LCSGrid />
      </GlassCard>

      <GlassCard delay={0.3} className="p-6">
        <h2 className="text-base font-bold text-white mb-4">Classic DP Problems</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Fibonacci',      diff: 'Easy',   pattern: '1D DP / recursion+memo',         complexity: 'O(n)' },
            { name: 'Climbing Stairs',diff: 'Easy',   pattern: '1D DP (same as Fibonacci)',       complexity: 'O(n)' },
            { name: 'LCS',            diff: 'Medium', pattern: '2D DP grid fill',                 complexity: 'O(m×n)' },
            { name: '0/1 Knapsack',   diff: 'Medium', pattern: '2D DP — include/exclude item',    complexity: 'O(n×W)' },
            { name: 'Coin Change',    diff: 'Medium', pattern: '1D BFS-style table fill',         complexity: 'O(amount × coins)' },
            { name: 'Edit Distance',  diff: 'Hard',   pattern: '2D grid — insert/delete/replace', complexity: 'O(m×n)' },
          ].map(p => (
            <div key={p.name} className="flex items-start gap-3 p-3 rounded-xl bg-white/03 border border-white/06">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm text-white/85">{p.name}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: p.diff === 'Easy' ? '#00ff8820' : p.diff === 'Medium' ? '#f59e0b20' : '#ff6b3520', color: p.diff === 'Easy' ? '#00ff88' : p.diff === 'Medium' ? '#f59e0b' : '#ff6b35' }}>{p.diff}</span>
                </div>
                <p className="text-xs text-white/40">{p.pattern}</p>
              </div>
              <span className="text-xs font-mono text-dp/70 whitespace-nowrap">{p.complexity}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
