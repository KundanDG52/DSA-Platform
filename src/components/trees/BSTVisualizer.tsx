import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { insertBST, deleteBST, computeLayout, buildDefaultBST, traversalSteps } from '../../algorithms/trees'
import type { BSTNode, TraversalType } from '../../types'
import { StepControls } from '../shared/StepControls'
import { useAnimationControls } from '../../hooks/useAnimationControls'

const STATE_COLORS: Record<string, string> = {
  normal:      '#1a1a2e',
  comparing:   '#ff6b35',
  inserting:   '#00ff88',
  visited:     '#a855f7',
  found:       '#00ff88',
  highlighted: '#00d4ff',
}
const STATE_BORDER: Record<string, string> = {
  normal:      '#2a2a3e',
  comparing:   '#ff6b35',
  inserting:   '#00ff88',
  visited:     '#a855f7',
  found:       '#00ff88',
  highlighted: '#00d4ff',
}

const TRAVERSALS: { id: TraversalType; label: string }[] = [
  { id: 'inorder',   label: 'Inorder (L→Root→R)' },
  { id: 'preorder',  label: 'Preorder (Root→L→R)' },
  { id: 'postorder', label: 'Postorder (L→R→Root)' },
  { id: 'levelorder',label: 'Level-Order (BFS)' },
]

export function BSTVisualizer() {
  const [root, setRoot] = useState<BSTNode | null>(buildDefaultBST())
  const [insertVal, setInsertVal] = useState('35')
  const [deleteVal, setDeleteVal] = useState('30')
  const [traversal, setTraversal] = useState<TraversalType>('inorder')
  const [visitedOrder, setVisitedOrder] = useState<number[]>([])
  const controls = useAnimationControls<number[]>()

  const SVG_W = 620
  const SVG_H = 360
  const { nodes, edges } = computeLayout(root, SVG_W)

  const updateNodeStates = useCallback((visited: number[]) => {
    function mark(node: BSTNode | null): BSTNode | null {
      if (!node) return null
      return {
        ...node,
        state: visited.includes(node.value) ? 'visited' : 'normal',
        left: mark(node.left),
        right: mark(node.right),
      }
    }
    setRoot(r => mark(r))
    setVisitedOrder(visited)
  }, [])

  function handleInsert() {
    const v = parseInt(insertVal)
    if (isNaN(v)) return
    const { root: newRoot } = insertBST(root, v)
    function resetStates(node: BSTNode | null): BSTNode | null {
      if (!node) return null
      return { ...node, state: 'normal', left: resetStates(node.left), right: resetStates(node.right) }
    }
    setRoot(resetStates(newRoot))
    controls.reset()
    setVisitedOrder([])
  }

  function handleDelete() {
    const v = parseInt(deleteVal)
    if (isNaN(v)) return
    setRoot(deleteBST(root, v))
    controls.reset()
    setVisitedOrder([])
  }

  function handleTraversal() {
    if (!root) return
    const snapshots = traversalSteps(root, traversal)
    controls.setSteps(snapshots)
    controls.play()
  }

  // Sync animation frame to tree display
  const currentVisited = controls.steps[controls.currentStep]
  const displayVisited = currentVisited ?? visitedOrder

  return (
    <div className="flex flex-col gap-5">
      {/* SVG Tree */}
      <div className="viz-container overflow-x-auto">
        <svg
          width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ minWidth: 320, maxWidth: '100%' }}
        >
          {/* Edges */}
          {edges.map(e => (
            <motion.line
              key={e.id}
              x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          ))}

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map(node => {
              const isVisited = displayVisited.includes(node.value)
              const color = isVisited ? '#a855f7' : STATE_COLORS[node.state] ?? '#1a1a2e'
              const border = isVisited ? '#a855f7' : STATE_BORDER[node.state] ?? '#2a2a3e'
              const isActive = node.state !== 'normal'

              return (
                <motion.g
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                >
                  {/* Glow */}
                  {(isVisited || isActive) && (
                    <circle cx={node.x} cy={node.y} r="26" fill={border} opacity="0.12" />
                  )}

                  <circle
                    cx={node.x} cy={node.y} r="20"
                    fill={`${color}22`}
                    stroke={border}
                    strokeWidth={isVisited || isActive ? 2.5 : 1.5}
                    style={{ filter: (isVisited || isActive) ? `drop-shadow(0 0 8px ${border})` : 'none' }}
                  />
                  <text
                    x={node.x} y={node.y}
                    textAnchor="middle" dominantBaseline="central"
                    fill={isVisited ? '#a855f7' : isActive ? border : 'rgba(255,255,255,0.85)'}
                    fontSize="13" fontWeight="700" fontFamily="JetBrains Mono, monospace"
                  >
                    {node.value}
                  </text>
                </motion.g>
              )
            })}
          </AnimatePresence>
        </svg>

        {/* Traversal order display */}
        {displayVisited.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-white/40">Visited:</span>
            {displayVisited.map((v, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                style={{ background: '#a855f720', border: '1px solid #a855f740', color: '#a855f7' }}
              >
                {v}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insert / Delete */}
        <div className="glass rounded-2xl p-4 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-trees">BST Operations</h4>
          <div className="flex gap-2">
            <input
              type="number" value={insertVal}
              onChange={e => setInsertVal(e.target.value)}
              className="flex-1 bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:border-trees/50 outline-none"
              placeholder="Value"
            />
            <button onClick={handleInsert}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-bg transition-all"
              style={{ background: '#00ff88', boxShadow: '0 0 16px #00ff8850' }}
            >Insert</button>
          </div>
          <div className="flex gap-2">
            <input
              type="number" value={deleteVal}
              onChange={e => setDeleteVal(e.target.value)}
              className="flex-1 bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:border-graphs/50 outline-none"
              placeholder="Value"
            />
            <button onClick={handleDelete}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#ff6b3520', border: '1px solid #ff6b3550', color: '#ff6b35' }}
            >Delete</button>
          </div>
          <button
            onClick={() => { setRoot(buildDefaultBST()); controls.reset(); setVisitedOrder([]) }}
            className="btn-ghost text-xs"
          >Reset Tree</button>
        </div>

        {/* Traversal */}
        <div className="glass rounded-2xl p-4 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-dp">Tree Traversals</h4>
          <div className="flex flex-col gap-1.5">
            {TRAVERSALS.map(t => (
              <button
                key={t.id}
                onClick={() => setTraversal(t.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-all"
                style={{
                  background: traversal === t.id ? '#a855f720' : 'rgba(255,255,255,0.04)',
                  border: traversal === t.id ? '1px solid #a855f740' : '1px solid transparent',
                  color: traversal === t.id ? '#a855f7' : 'rgba(255,255,255,0.5)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button onClick={handleTraversal}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-bg transition-all"
            style={{ background: '#a855f7', boxShadow: '0 0 16px #a855f750' }}
          >
            Animate Traversal
          </button>
          <StepControls controls={controls} color="#a855f7" />
        </div>
      </div>
    </div>
  )
}
