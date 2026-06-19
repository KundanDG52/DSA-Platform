import { useState } from 'react'
import { motion } from 'framer-motion'
import { fibSteps } from '../../algorithms/dp'
import { useAnimationControls } from '../../hooks/useAnimationControls'
import { StepControls } from '../shared/StepControls'
import type { FibStep } from '../../algorithms/dp'

export function FibonacciTree() {
  const [n, setN] = useState(6)
  const controls = useAnimationControls<FibStep>()
  const current = controls.steps[controls.currentStep]

  function run() {
    controls.setSteps(fibSteps(n))
    controls.play()
  }

  const memo = current?.memo ?? new Map<number, number>()
  const callStack = current?.callStack ?? []
  const maxN = n

  // Build visualization as table
  const rows = []
  for (let i = 0; i <= maxN; i++) {
    const computed = memo.has(i)
    const inStack = callStack.includes(i)
    const isCurrent = current?.n === i
    rows.push({ n: i, value: computed ? memo.get(i) : null, computed, inStack, isCurrent })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="viz-container">
        <h4 className="text-sm font-semibold text-dp mb-3">
          Fibonacci with Memoization
          {current?.result !== null && current?.result !== undefined && (
            <span className="ml-2 text-trees">fib({current.n}) = {current.result}</span>
          )}
        </h4>

        {/* Call stack */}
        {callStack.length > 0 && (
          <div className="mb-4">
            <span className="text-xs text-white/40 font-mono mb-2 block">Call Stack:</span>
            <div className="flex gap-1 flex-wrap">
              {callStack.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-bold"
                  style={{
                    background: i === callStack.length - 1 ? '#ff6b3530' : '#a855f715',
                    border: i === callStack.length - 1 ? '1px solid #ff6b35' : '1px solid #a855f730',
                    color: i === callStack.length - 1 ? '#ff6b35' : '#a855f7',
                  }}
                >
                  fib({val})
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Memo table */}
        <div>
          <span className="text-xs text-white/40 font-mono mb-2 block">Memo Table:</span>
          <div className="flex flex-wrap gap-2">
            {rows.map(row => (
              <motion.div
                key={row.n}
                animate={{
                  scale: row.isCurrent ? 1.15 : 1,
                  boxShadow: row.computed ? '0 0 12px #00ff8840' : 'none',
                }}
                className="flex flex-col items-center rounded-xl overflow-hidden"
                style={{
                  border: row.isCurrent ? '2px solid #ff6b35' : row.computed ? '2px solid #00ff8840' : '1px solid rgba(255,255,255,0.06)',
                  minWidth: 48,
                }}
              >
                <div className="px-3 py-1 text-xs font-mono font-bold w-full text-center"
                  style={{
                    background: row.isCurrent ? '#ff6b3520' : row.inStack ? '#a855f715' : '#13131a',
                    color: row.isCurrent ? '#ff6b35' : row.inStack ? '#a855f7' : 'rgba(255,255,255,0.4)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >n={row.n}</div>
                <div className="px-3 py-2 text-sm font-bold font-mono text-center"
                  style={{ color: row.computed ? '#00ff88' : 'rgba(255,255,255,0.2)' }}
                >
                  {row.value !== null ? row.value : '?'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <span className="text-xs text-white/40">n =</span>
        <input
          type="range" min={2} max={12} value={n}
          onChange={e => { setN(+e.target.value); controls.reset() }}
          className="w-32" style={{ accentColor: '#a855f7' }}
        />
        <span className="text-sm font-bold font-mono text-dp">{n}</span>
        <button onClick={run}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-bg"
          style={{ background: '#a855f7', boxShadow: '0 0 16px #a855f750' }}
        >Visualize fib({n})</button>
        <StepControls controls={controls} description={current?.description} color="#a855f7" />
      </div>
    </div>
  )
}
