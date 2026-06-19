import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { twoSumSteps } from '../../algorithms/arrays'
import type { TwoSumStep } from '../../algorithms/arrays'
import { useAnimationControls } from '../../hooks/useAnimationControls'
import { StepControls } from '../shared/StepControls'

const DEFAULT_ARR = [2, 7, 11, 15]

export function TwoSumViz() {
  const [arr] = useState(DEFAULT_ARR)
  const [target, setTarget] = useState('9')
  const controls = useAnimationControls<TwoSumStep>()
  const current = controls.steps[controls.currentStep]

  function run() {
    const t = parseInt(target) || 9
    controls.setSteps(twoSumSteps(arr, t))
    controls.play()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="viz-container">
        <h4 className="text-sm font-semibold text-white/60 mb-1">Two Sum — Hash Map Approach <span className="text-white/30 font-mono text-xs">O(n)</span></h4>

        {/* Array */}
        <div className="flex items-end gap-2 flex-wrap">
          {arr.map((v, i) => {
            const isFound = current?.found && (current.found[0] === i || current.found[1] === i)
            const isCurrent = current?.current === i
            return (
              <motion.div key={i} animate={{ scale: isFound ? 1.2 : isCurrent ? 1.1 : 1 }} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold font-mono"
                  style={{
                    background: isFound ? '#00ff8830' : isCurrent ? '#00d4ff20' : '#1a1a2e',
                    border: `2px solid ${isFound ? '#00ff88' : isCurrent ? '#00d4ff' : '#2a2a3e'}`,
                    color: isFound ? '#00ff88' : isCurrent ? '#00d4ff' : 'rgba(255,255,255,0.8)',
                    boxShadow: isFound ? '0 0 20px #00ff8860' : undefined,
                  }}
                >
                  {v}
                </div>
                <span className="text-[10px] text-white/25 font-mono">{i}</span>
              </motion.div>
            )
          })}
        </div>

        {/* Hash Map visualization */}
        <div className="mt-3">
          <span className="text-xs text-white/40 font-mono mb-2 block">HashMap (value → index):</span>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            <AnimatePresence>
              {current?.map && Array.from(current.map.entries()).map(([k, v]) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 py-1.5 rounded-lg border text-xs font-mono"
                  style={{ background: '#a855f720', borderColor: '#a855f740', color: '#a855f7' }}
                >
                  {k} → [{v}]
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <span className="text-xs text-white/40">Target sum:</span>
        <input
          type="number" value={target}
          onChange={e => setTarget(e.target.value)}
          className="w-20 bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:border-arrays/50 outline-none"
        />
        <button onClick={run} className="btn-primary">Visualize</button>
        <StepControls controls={controls} description={current?.description} color="#00d4ff" />
      </div>
    </div>
  )
}
