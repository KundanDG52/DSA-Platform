import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, RotateCcw } from 'lucide-react'

interface ListNode { id: number; value: number; state: 'normal' | 'active' | 'slow' | 'fast' | 'new' | 'deleted' }

let nodeIdCounter = 0

export function LinkedListViz() {
  const [nodes, setNodes] = useState<ListNode[]>([
    { id: ++nodeIdCounter, value: 1, state: 'normal' },
    { id: ++nodeIdCounter, value: 2, state: 'normal' },
    { id: ++nodeIdCounter, value: 3, state: 'normal' },
    { id: ++nodeIdCounter, value: 4, state: 'normal' },
  ])
  const [newValue, setNewValue] = useState('5')
  const [listType, setListType] = useState<'singly' | 'doubly' | 'circular'>('singly')
  const [cycleRunning, setCycleRunning] = useState(false)
  const [slow, setSlow] = useState(-1)
  const [fast, setFast] = useState(-1)
  const [cycleMsg, setCycleMsg] = useState('')

  function appendNode() {
    const v = parseInt(newValue)
    if (isNaN(v)) return
    setNodes(prev => [...prev, { id: ++nodeIdCounter, value: v, state: 'new' }])
    setTimeout(() => setNodes(prev => prev.map(n => n.state === 'new' ? { ...n, state: 'normal' } : n)), 600)
  }

  function prependNode() {
    const v = parseInt(newValue)
    if (isNaN(v)) return
    setNodes(prev => [{ id: ++nodeIdCounter, value: v, state: 'new' }, ...prev])
    setTimeout(() => setNodes(prev => prev.map(n => n.state === 'new' ? { ...n, state: 'normal' } : n)), 600)
  }

  function deleteNode(id: number) {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, state: 'deleted' } : n))
    setTimeout(() => setNodes(prev => prev.filter(n => n.id !== id)), 400)
  }

  async function runFloydCycle() {
    if (nodes.length < 2) return
    setCycleRunning(true)
    setCycleMsg("Floyd's Cycle Detection: slow and fast pointers")
    let s = 0, f = 0

    for (let i = 0; i < nodes.length * 2; i++) {
      setSlow(s); setFast(f)
      await new Promise(r => setTimeout(r, 600))
      if (s === f && i > 0) {
        setCycleMsg(`Cycle detected! Both pointers at index ${s}`)
        setCycleRunning(false)
        setTimeout(() => { setSlow(-1); setFast(-1); setCycleMsg('') }, 2000)
        return
      }
      s = (s + 1) % nodes.length
      f = (f + 2) % nodes.length
    }
    setCycleMsg('No cycle found! ✓')
    setCycleRunning(false)
    setTimeout(() => { setSlow(-1); setFast(-1); setCycleMsg('') }, 2000)
  }

  function reverseList() {
    setNodes(prev => [...prev].reverse().map((n, i) => ({ ...n, state: i === 0 ? 'active' : 'normal' })))
    setTimeout(() => setNodes(prev => prev.map(n => ({ ...n, state: 'normal' }))), 500)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* List type selector */}
      <div className="flex gap-2 flex-wrap">
        {(['singly', 'doubly', 'circular'] as const).map(t => (
          <button key={t} onClick={() => setListType(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize"
            style={{
              background: listType === t ? '#f59e0b20' : 'rgba(255,255,255,0.05)',
              border: listType === t ? '1px solid #f59e0b50' : '1px solid transparent',
              color: listType === t ? '#f59e0b' : 'rgba(255,255,255,0.5)',
            }}
          >{t}</button>
        ))}
      </div>

      {/* Node visualization */}
      <div className="viz-container overflow-x-auto">
        <div className="flex items-center gap-2 flex-nowrap min-h-[80px] py-2">
          <AnimatePresence mode="popLayout">
            {nodes.map((node, i) => {
              const isSlow = slow === i
              const isFast = fast === i
              const isActive = node.state === 'active'
              const color = isFast ? '#00d4ff' : isSlow ? '#ff6b35' : isActive ? '#00ff88' : node.state === 'new' ? '#00ff88' : undefined

              return (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0, x: -20 }}
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  <div
                    className="relative w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2 cursor-pointer group transition-all"
                    style={{
                      background: color ? `${color}20` : '#1a1a2e',
                      borderColor: color ?? '#2a2a3e',
                      boxShadow: color ? `0 0 16px ${color}60` : 'none',
                    }}
                    onClick={() => !cycleRunning && deleteNode(node.id)}
                  >
                    <span className="text-sm font-bold font-mono" style={{ color: color ?? 'rgba(255,255,255,0.85)' }}>
                      {node.value}
                    </span>
                    <span className="text-[9px] text-white/25 font-mono">[{i}]</span>
                    <Trash2 size={10} className="absolute top-1 right-1 text-white/0 group-hover:text-red-400/60 transition-colors" />

                    {/* Floyd labels */}
                    {isSlow && <div className="absolute -top-5 text-[9px] font-bold text-sorting">slow</div>}
                    {isFast && <div className="absolute -bottom-5 text-[9px] font-bold text-arrays">fast</div>}
                  </div>

                  {/* Arrow */}
                  {(i < nodes.length - 1 || listType === 'circular') && (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {listType === 'doubly' && <div className="w-2 h-0.5 bg-white/20 rotate-180" style={{ borderLeft: '4px solid transparent', borderRight: '4px solid rgba(255,255,255,0.2)' }} />}
                      <div className="w-6 h-0.5 bg-white/20" />
                      <div className="w-0 h-0" style={{ borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid rgba(255,255,255,0.2)' }} />
                    </div>
                  )}
                  {listType === 'circular' && i === nodes.length - 1 && (
                    <span className="text-[9px] text-white/30 ml-1">→ head</span>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Null pointer */}
          {listType !== 'circular' && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="w-6 h-0.5 bg-white/10" />
              <span className="text-xs text-white/20 font-mono">null</span>
            </div>
          )}
        </div>

        {cycleMsg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-mono text-white/60 bg-bg/60 rounded-lg px-3 py-2 border border-white/5"
          >
            {cycleMsg}
          </motion.p>
        )}
      </div>

      {/* Controls */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <input
          type="number" value={newValue}
          onChange={e => setNewValue(e.target.value)}
          className="w-20 bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:border-linkedlist/50 outline-none"
          placeholder="Value"
        />
        <button onClick={appendNode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#f59e0b20', border: '1px solid #f59e0b40', color: '#f59e0b' }}>
          <Plus size={12} /> Append
        </button>
        <button onClick={prependNode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#f59e0b20', border: '1px solid #f59e0b40', color: '#f59e0b' }}>
          <Plus size={12} /> Prepend
        </button>
        <button onClick={reverseList} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#00d4ff20', border: '1px solid #00d4ff40', color: '#00d4ff' }}>
          <RotateCcw size={12} /> Reverse
        </button>
        <button
          onClick={runFloydCycle}
          disabled={cycleRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
          style={{ background: '#00ff8820', border: '1px solid #00ff8840', color: '#00ff88' }}
        >
          🐢🐇 Floyd's Cycle
        </button>
        <button onClick={() => setNodes([{ id: ++nodeIdCounter, value: 1, state: 'normal' }, { id: ++nodeIdCounter, value: 2, state: 'normal' }, { id: ++nodeIdCounter, value: 3, state: 'normal' }, { id: ++nodeIdCounter, value: 4, state: 'normal' }])} className="btn-ghost text-xs ml-auto">Reset</button>
      </div>
    </div>
  )
}
