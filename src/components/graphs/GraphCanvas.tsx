import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { bfsSteps, dfsSteps, dijkstraSteps } from '../../algorithms/graphs'
import type { GraphAlgorithm } from '../../types'
import { useGraphBuilder } from '../../hooks/useGraphBuilder'
import { useAnimationControls } from '../../hooks/useAnimationControls'
import { StepControls } from '../shared/StepControls'
import type { GraphStep } from '../../algorithms/graphs'

const NODE_STATE_COLORS: Record<string, string> = {
  unvisited: '#1a1a2e',
  queued:    '#a855f7',
  visiting:  '#ff6b35',
  visited:   '#00ff88',
  path:      '#00d4ff',
  start:     '#00d4ff',
  end:       '#ff6b35',
}
const NODE_STATE_BORDER: Record<string, string> = {
  unvisited: '#2a2a3e',
  queued:    '#a855f7',
  visiting:  '#ff6b35',
  visited:   '#00ff88',
  path:      '#00d4ff',
  start:     '#00d4ff',
  end:       '#ff6b35',
}
const EDGE_STATE_COLORS: Record<string, string> = {
  unvisited: 'rgba(255,255,255,0.1)',
  active:    '#ff6b35',
  path:      '#00d4ff',
  visited:   'rgba(0,255,136,0.3)',
}

const ALGOS: { id: GraphAlgorithm; label: string; color: string }[] = [
  { id: 'bfs',      label: 'BFS',      color: '#00d4ff' },
  { id: 'dfs',      label: 'DFS',      color: '#a855f7' },
  { id: 'dijkstra', label: 'Dijkstra', color: '#ff6b35' },
]

export function GraphCanvas() {
  const { nodes, edges, resetStates, setNodeStates, setEdgeStates, loadDefault } = useGraphBuilder()
  const [algo, setAlgo] = useState<GraphAlgorithm>('bfs')
  const [startId, setStartId] = useState('a')
  const controls = useAnimationControls<GraphStep>()
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)

  const currentStep = controls.steps[controls.currentStep]
  const displayNodes = currentStep?.nodes ?? nodes
  const displayEdges = currentStep?.edges ?? edges

  // Sync steps to node/edge state
  const runAlgo = useCallback(() => {
    resetStates()
    const freshNodes = nodes.map(n => ({ ...n, state: 'unvisited' as const, distance: Infinity, previous: null }))
    const freshEdges = edges.map(e => ({ ...e, state: 'unvisited' as const }))
    let steps: GraphStep[] = []
    if (algo === 'bfs')      steps = bfsSteps(freshNodes, freshEdges, startId)
    else if (algo === 'dfs') steps = dfsSteps(freshNodes, freshEdges, startId)
    else                     steps = dijkstraSteps(freshNodes, freshEdges, startId)
    controls.setSteps(steps)
    controls.play()
  }, [algo, nodes, edges, startId, controls, resetStates])

  const algoColor = ALGOS.find(a => a.id === algo)?.color ?? '#00d4ff'

  return (
    <div className="flex flex-col gap-5">
      {/* Graph canvas */}
      <div className="viz-container overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full rounded-xl bg-bg/40 border border-white/5"
          style={{ minHeight: 360, cursor: 'crosshair' }}
          viewBox="0 0 620 380"
        >
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="rgba(255,255,255,0.3)" />
            </marker>
          </defs>

          {/* Edges */}
          {displayEdges.map(edge => {
            const src = displayNodes.find(n => n.id === edge.source)
            const tgt = displayNodes.find(n => n.id === edge.target)
            if (!src || !tgt) return null
            const mx = (src.x + tgt.x) / 2
            const my = (src.y + tgt.y) / 2
            const color = EDGE_STATE_COLORS[edge.state] ?? EDGE_STATE_COLORS.unvisited
            return (
              <g key={edge.id}>
                <motion.line
                  x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  stroke={color}
                  strokeWidth={edge.state !== 'unvisited' ? 2.5 : 1.5}
                  initial={false}
                  animate={{ stroke: color }}
                  transition={{ duration: 0.3 }}
                  style={{ filter: edge.state === 'path' ? `drop-shadow(0 0 6px ${color})` : 'none' }}
                />
                {/* Weight label */}
                <text x={mx} y={my - 6} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="JetBrains Mono">
                  {edge.weight}
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {displayNodes.map(node => {
            const bg = NODE_STATE_COLORS[node.state] ?? '#1a1a2e'
            const border = NODE_STATE_BORDER[node.state] ?? '#2a2a3e'
            const isActive = node.state !== 'unvisited'

            return (
              <motion.g
                key={node.id}
                initial={false}
                animate={{ x: 0, y: 0 }}
                style={{ cursor: 'pointer' }}
                onClick={() => setStartId(node.id)}
              >
                {isActive && <circle cx={node.x} cy={node.y} r={28} fill={border} opacity={0.12} />}
                <motion.circle
                  cx={node.x} cy={node.y} r={22}
                  fill={`${bg}33`}
                  stroke={border}
                  strokeWidth={node.id === startId ? 3 : 2}
                  initial={false}
                  animate={{ fill: `${bg}33`, stroke: border }}
                  transition={{ duration: 0.3 }}
                  style={{ filter: isActive ? `drop-shadow(0 0 10px ${border})` : 'none' }}
                />
                <text
                  x={node.x} y={node.y}
                  textAnchor="middle" dominantBaseline="central"
                  fill={isActive ? border : 'rgba(255,255,255,0.8)'}
                  fontSize="14" fontWeight="700" fontFamily="JetBrains Mono"
                >
                  {node.label}
                </text>
                {/* Distance label for Dijkstra */}
                {currentStep?.distances && node.distance !== undefined && node.distance !== Infinity && (
                  <text x={node.x} y={node.y + 34} textAnchor="middle" fill="#ff6b35" fontSize="10" fontFamily="JetBrains Mono">
                    d={node.distance}
                  </text>
                )}
              </motion.g>
            )
          })}
        </svg>

        {/* Queue display */}
        {currentStep?.queue && currentStep.queue.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/40 font-mono">{algo === 'dfs' ? 'Stack:' : 'Queue:'}</span>
            {currentStep.queue.map((id, i) => {
              const node = displayNodes.find(n => n.id === id)
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: `${algoColor}20`, border: `1px solid ${algoColor}40`, color: algoColor }}
                >
                  {node?.label ?? id}
                </motion.span>
              )
            })}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="glass rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Algorithm selector */}
          <div className="flex gap-2">
            {ALGOS.map(a => (
              <button key={a.id} onClick={() => setAlgo(a.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: algo === a.id ? `${a.color}20` : 'rgba(255,255,255,0.05)',
                  border: algo === a.id ? `1px solid ${a.color}50` : '1px solid transparent',
                  color: algo === a.id ? a.color : 'rgba(255,255,255,0.5)',
                }}
              >{a.label}</button>
            ))}
          </div>

          {/* Start node selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Start:</span>
            <div className="flex gap-1 flex-wrap">
              {nodes.map(n => (
                <button key={n.id} onClick={() => setStartId(n.id)}
                  className="w-7 h-7 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: startId === n.id ? `${algoColor}25` : 'rgba(255,255,255,0.06)',
                    border: startId === n.id ? `1px solid ${algoColor}60` : '1px solid transparent',
                    color: startId === n.id ? algoColor : 'rgba(255,255,255,0.5)',
                  }}
                >{n.label}</button>
              ))}
            </div>
          </div>

          <button onClick={runAlgo}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-bg ml-auto"
            style={{ background: algoColor, boxShadow: `0 0 16px ${algoColor}50` }}
          >Run {ALGOS.find(a => a.id === algo)?.label}</button>

          <button onClick={() => { loadDefault(); controls.reset() }} className="btn-ghost text-xs">Reset</button>
        </div>

        <StepControls
          controls={controls}
          description={currentStep?.description}
          color={algoColor}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: 'Unvisited', color: '#2a2a3e' },
          { label: 'Start',     color: '#00d4ff' },
          { label: 'In Queue',  color: '#a855f7' },
          { label: 'Visiting',  color: '#ff6b35' },
          { label: 'Visited',   color: '#00ff88' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: s.color, background: `${s.color}20` }} />
            <span className="text-xs text-white/40">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
