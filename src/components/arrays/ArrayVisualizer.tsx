import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepControls } from '../shared/StepControls'
import { useAnimationControls } from '../../hooks/useAnimationControls'
import {
  insertSteps, deleteSteps, searchSteps, reverseSteps,
  slidingWindowSteps, twoPointerSteps, prefixSumSteps,
} from '../../algorithms/arrays'
import type { ArrayStep, ArrayElementState } from '../../types'

const STATE_COLORS: Record<ArrayElementState, string> = {
  normal:       '#1a1a2e',
  selected:     '#00d4ff',
  comparing:    '#ff6b35',
  sorted:       '#00ff88',
  window:       '#a855f7',
  pivot:        '#ec4899',
  'pointer-left':  '#00d4ff',
  'pointer-right': '#ff6b35',
  found:        '#00ff88',
  swapping:     '#f59e0b',
}

const STATE_BORDER: Record<ArrayElementState, string> = {
  normal:       '#2a2a3e',
  selected:     '#00d4ff',
  comparing:    '#ff6b35',
  sorted:       '#00ff88',
  window:       '#a855f7',
  pivot:        '#ec4899',
  'pointer-left':  '#00d4ff',
  'pointer-right': '#ff6b35',
  found:        '#00ff88',
  swapping:     '#f59e0b',
}

type Op = 'search' | 'reverse' | 'insert' | 'delete' | 'sliding' | 'twopointer' | 'prefix'

const OPS: { id: Op; label: string; needsValue?: boolean; secondValue?: string }[] = [
  { id: 'search',     label: 'Search',        needsValue: true },
  { id: 'reverse',    label: 'Reverse'                        },
  { id: 'insert',     label: 'Insert',        needsValue: true, secondValue: 'Index' },
  { id: 'delete',     label: 'Delete',        needsValue: true },
  { id: 'sliding',    label: 'Sliding Window',needsValue: true },
  { id: 'twopointer', label: 'Two Pointers',  needsValue: true },
  { id: 'prefix',     label: 'Prefix Sum'                     },
]

const DEFAULT_ARRAY = [15, 6, 33, 20, 8, 45, 12, 27]

export function ArrayVisualizer() {
  const [array, setArray] = useState(DEFAULT_ARRAY)
  const [op, setOp] = useState<Op>('search')
  const [val1, setVal1] = useState('15')
  const [val2, setVal2] = useState('2')
  const [customInput, setCustomInput] = useState(DEFAULT_ARRAY.join(', '))
  const controls = useAnimationControls<ArrayStep>()

  const current = controls.steps[controls.currentStep]

  function run() {
    const v1 = parseInt(val1) || 0
    const v2 = parseInt(val2) || 0
    let steps: ArrayStep[] = []
    switch (op) {
      case 'search':      steps = searchSteps(array, v1); break
      case 'reverse':     steps = reverseSteps(array); break
      case 'insert':      steps = insertSteps(array, v2, v1); break
      case 'delete':      steps = deleteSteps(array, v1); break
      case 'sliding':     steps = slidingWindowSteps(array, Math.max(1, v1)); break
      case 'twopointer':  steps = twoPointerSteps(array, v1); break
      case 'prefix':      steps = prefixSumSteps(array); break
    }
    controls.setSteps(steps)
    controls.play()
  }

  function applyCustom() {
    const arr = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 14)
    if (arr.length > 0) { setArray(arr); controls.reset() }
  }

  const elements = current?.elements ?? array.map((v, i) => ({ id: i, value: v, state: 'normal' as ArrayElementState }))

  return (
    <div className="flex flex-col gap-5">
      {/* Array display */}
      <div className="viz-container">
        <div className="flex flex-wrap items-end justify-center gap-2 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {elements.map((el, i) => {
              const bg = STATE_COLORS[el.state]
              const border = STATE_BORDER[el.state]
              const isHighlighted = el.state !== 'normal'
              return (
                <motion.div
                  key={el.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6, y: -20 }}
                  animate={{
                    opacity: 1, scale: isHighlighted ? 1.1 : 1, y: 0,
                    boxShadow: isHighlighted ? `0 0 20px ${border}80` : 'none',
                  }}
                  exit={{ opacity: 0, scale: 0.6, y: 20 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold font-mono transition-all"
                    style={{
                      background: isHighlighted ? `${bg}30` : '#1a1a2e',
                      border: `2px solid ${border}`,
                      color: isHighlighted ? bg : 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {el.value}
                  </div>
                  <span className="text-[10px] text-white/25 font-mono">{i}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* State legend */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { label: 'Current',  color: '#ff6b35', state: 'comparing' },
            { label: 'Window',   color: '#a855f7', state: 'window' },
            { label: 'Found',    color: '#00ff88', state: 'found' },
            { label: 'Swap',     color: '#f59e0b', state: 'swapping' },
            { label: 'Pointer L',color: '#00d4ff', state: 'pointer-left' },
            { label: 'Pointer R',color: '#ff6b35', state: 'pointer-right' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
              <span className="text-[10px] text-white/40">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="glass rounded-2xl p-5 flex flex-col gap-4">
        {/* Operation selector */}
        <div className="flex flex-wrap gap-2">
          {OPS.map(o => (
            <button
              key={o.id}
              onClick={() => setOp(o.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: op === o.id ? '#00d4ff20' : 'rgba(255,255,255,0.05)',
                border: op === o.id ? '1px solid #00d4ff50' : '1px solid transparent',
                color: op === o.id ? '#00d4ff' : 'rgba(255,255,255,0.5)',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex flex-wrap gap-3 items-end">
          {OPS.find(o => o.id === op)?.needsValue && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/40">{op === 'insert' ? 'Value' : op === 'delete' ? 'Index' : op === 'sliding' ? 'Window Size' : op === 'twopointer' ? 'Target Sum' : 'Value'}</label>
              <input
                type="number"
                value={val1}
                onChange={e => setVal1(e.target.value)}
                className="w-24 bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:border-arrays/50 outline-none"
              />
            </div>
          )}
          {op === 'insert' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/40">Index</label>
              <input
                type="number"
                value={val2}
                onChange={e => setVal2(e.target.value)}
                className="w-24 bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:border-arrays/50 outline-none"
              />
            </div>
          )}
          <button onClick={run} className="btn-primary">Run</button>
        </div>

        {/* Step controls */}
        <StepControls controls={controls} description={current?.description} color="#00d4ff" />
      </div>

      {/* Custom array input */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <span className="text-xs text-white/40">Custom array:</span>
        <input
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          className="flex-1 min-w-[180px] bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:border-arrays/50 outline-none"
          placeholder="e.g. 5, 3, 8, 1, 9"
        />
        <button onClick={applyCustom} className="btn-ghost text-xs">Apply</button>
        <button
          onClick={() => { const a = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1); setArray(a); setCustomInput(a.join(', ')); controls.reset() }}
          className="btn-ghost text-xs"
        >
          Random
        </button>
      </div>
    </div>
  )
}
