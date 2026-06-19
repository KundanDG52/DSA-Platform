import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  bubbleSortSteps, insertionSortSteps, selectionSortSteps,
  mergeSortSteps, quickSortSteps, heapSortSteps, generateArray,
} from '../../algorithms/sorting'
import type { SortStep, SortAlgorithm } from '../../types'
import { Play, Pause, RefreshCw } from 'lucide-react'

interface RunnerState {
  steps: SortStep[]
  currentStep: number
  done: boolean
}

const ALGO_META: Record<SortAlgorithm, { label: string; color: string; complexity: string }> = {
  bubble:    { label: 'Bubble',    color: '#00d4ff', complexity: 'O(n²)' },
  insertion: { label: 'Insertion', color: '#00ff88', complexity: 'O(n²)' },
  selection: { label: 'Selection', color: '#f59e0b', complexity: 'O(n²)' },
  merge:     { label: 'Merge',     color: '#a855f7', complexity: 'O(n log n)' },
  quick:     { label: 'Quick',     color: '#ff6b35', complexity: 'O(n log n)' },
  heap:      { label: 'Heap',      color: '#ec4899', complexity: 'O(n log n)' },
}

const GENERATE_FUNCS: Record<SortAlgorithm, (arr: number[]) => SortStep[]> = {
  bubble: bubbleSortSteps, insertion: insertionSortSteps, selection: selectionSortSteps,
  merge: mergeSortSteps, quick: quickSortSteps, heap: heapSortSteps,
}

export function SortingRace() {
  const [selectedAlgos, setSelectedAlgos] = useState<SortAlgorithm[]>(['bubble', 'merge', 'quick'])
  const [arraySize, setArraySize] = useState(20)
  const [inputType, setInputType] = useState<'random' | 'sorted' | 'reverse' | 'nearly'>('random')
  const [speed, setSpeed] = useState(2)
  const [runners, setRunners] = useState<Record<string, RunnerState>>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function buildRunners() {
    const arr = generateArray(arraySize, inputType)
    const newRunners: Record<string, RunnerState> = {}
    for (const algo of selectedAlgos) {
      newRunners[algo] = { steps: GENERATE_FUNCS[algo](arr), currentStep: 0, done: false }
    }
    setRunners(newRunners)
    setIsPlaying(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => { buildRunners() }, [selectedAlgos, arraySize, inputType])

  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(30, 300 / speed)
      intervalRef.current = setInterval(() => {
        setRunners(prev => {
          const next = { ...prev }
          let allDone = true
          for (const algo of Object.keys(next)) {
            const r = next[algo]
            if (!r.done) {
              allDone = false
              if (r.currentStep < r.steps.length - 1) {
                next[algo] = { ...r, currentStep: r.currentStep + 1 }
              } else {
                next[algo] = { ...r, done: true }
              }
            }
          }
          if (allDone) setIsPlaying(false)
          return next
        })
      }, delay)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, speed])

  function toggleAlgo(algo: SortAlgorithm) {
    setSelectedAlgos(prev =>
      prev.includes(algo)
        ? prev.length > 1 ? prev.filter(a => a !== algo) : prev
        : [...prev, algo]
    )
  }

  const MAX_VAL = arraySize

  return (
    <div className="flex flex-col gap-5">
      {/* Algorithm selector */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-2">
        {(Object.keys(ALGO_META) as SortAlgorithm[]).map(algo => {
          const meta = ALGO_META[algo]
          const selected = selectedAlgos.includes(algo)
          return (
            <button key={algo} onClick={() => toggleAlgo(algo)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: selected ? `${meta.color}20` : 'rgba(255,255,255,0.05)',
                border: selected ? `1px solid ${meta.color}50` : '1px solid rgba(255,255,255,0.08)',
                color: selected ? meta.color : 'rgba(255,255,255,0.4)',
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: selected ? meta.color : 'rgba(255,255,255,0.2)' }} />
              {meta.label}
              <span className="font-mono opacity-60">{meta.complexity}</span>
            </button>
          )
        })}
      </div>

      {/* Races */}
      <div className="flex flex-col gap-3">
        {selectedAlgos.map(algo => {
          const meta = ALGO_META[algo]
          const runner = runners[algo]
          if (!runner) return null
          const step = runner.steps[runner.currentStep]
          if (!step) return null

          const totalBars = step.array.length

          return (
            <div key={algo} className="glass rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: meta.color }} />
                  <span className="font-semibold text-sm" style={{ color: meta.color }}>{meta.label} Sort</span>
                  <span className="text-xs font-mono text-white/30">{meta.complexity}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/30 font-mono">
                  <span>⚖️ {step.comparisons}</span>
                  <span>↕️ {step.swaps}</span>
                  {runner.done && <span className="text-trees font-semibold">✓ Done</span>}
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-px h-20" style={{ minHeight: 80 }}>
                {step.array.map((val, i) => {
                  const isComparing = step.comparing.includes(i)
                  const isSwapping  = step.swapping.includes(i)
                  const isSorted    = step.sorted.includes(i)
                  const isPivot     = step.pivot === i
                  const barColor = isPivot ? '#ec4899' : isSwapping ? '#f59e0b' : isComparing ? '#ff6b35' : isSorted ? meta.color : `${meta.color}40`
                  const heightPct = (val / MAX_VAL) * 100

                  return (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-sm min-w-0 transition-all"
                      style={{
                        height: `${heightPct}%`,
                        background: barColor,
                        boxShadow: (isComparing || isSwapping || isPivot) ? `0 0 6px ${barColor}` : 'none',
                      }}
                      layout
                    />
                  )
                })}
              </div>

              <p className="text-xs text-white/40 font-mono truncate">{step.description}</p>
            </div>
          )
        })}
      </div>

      {/* Playback controls */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        <button
          onClick={() => setIsPlaying(v => !v)}
          className="px-5 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 text-bg"
          style={{ background: '#00d4ff', boxShadow: '0 0 16px #00d4ff50' }}
        >
          {isPlaying ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
        </button>

        <button onClick={buildRunners} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <RefreshCw size={14} className="text-white/60" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Size:</span>
          <input type="range" min={8} max={50} step={2} value={arraySize}
            onChange={e => setArraySize(+e.target.value)}
            className="w-24" style={{ accentColor: '#00d4ff' }} />
          <span className="text-xs font-mono text-white/50 w-4">{arraySize}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Speed:</span>
          <input type="range" min={0.5} max={8} step={0.5} value={speed}
            onChange={e => setSpeed(+e.target.value)}
            className="w-24" style={{ accentColor: '#00d4ff' }} />
          <span className="text-xs font-mono text-white/50 w-8">{speed}x</span>
        </div>

        <div className="flex gap-2 ml-auto">
          {(['random', 'sorted', 'reverse', 'nearly'] as const).map(t => (
            <button key={t} onClick={() => setInputType(t)}
              className="px-2.5 py-1 rounded-lg text-xs transition-all capitalize"
              style={{
                background: inputType === t ? '#00d4ff20' : 'rgba(255,255,255,0.05)',
                border: inputType === t ? '1px solid #00d4ff40' : '1px solid transparent',
                color: inputType === t ? '#00d4ff' : 'rgba(255,255,255,0.4)',
              }}
            >{t}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
