import type { GraphNode, GraphEdge } from '../types'

export interface GraphStep {
  nodes: GraphNode[]
  edges: GraphEdge[]
  queue: string[]
  description: string
  distances?: Record<string, number>
}

function cloneNodes(nodes: GraphNode[]): GraphNode[] {
  return nodes.map(n => ({ ...n }))
}
function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map(e => ({ ...e }))
}

function getNeighbors(nodeId: string, edges: GraphEdge[], directed = false): string[] {
  const neighbors: string[] = []
  for (const e of edges) {
    if (e.source === nodeId) neighbors.push(e.target)
    else if (!directed && e.target === nodeId) neighbors.push(e.source)
  }
  return neighbors
}

// ─── BFS ─────────────────────────────────────────────────────────────────────
export function bfsSteps(nodes: GraphNode[], edges: GraphEdge[], startId: string): GraphStep[] {
  const steps: GraphStep[] = []
  const ns = cloneNodes(nodes)
  const es = cloneEdges(edges)

  ns.forEach(n => { n.state = 'unvisited' })
  es.forEach(e => { e.state = 'unvisited' })

  const queue: string[] = [startId]
  const visited = new Set<string>([startId])

  const startNode = ns.find(n => n.id === startId)!
  startNode.state = 'start'

  steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [...queue], description: `BFS from node ${startNode.label}. Queue: [${startNode.label}]` })

  while (queue.length > 0) {
    const curr = queue.shift()!
    const currNode = ns.find(n => n.id === curr)!
    currNode.state = 'visiting'
    steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [...queue], description: `Process ${currNode.label}` })

    const neighbors = getNeighbors(curr, es)
    for (const nId of neighbors) {
      const edge = es.find(e => (e.source === curr && e.target === nId) || (e.source === nId && e.target === curr))
      if (edge) edge.state = 'active'

      if (!visited.has(nId)) {
        visited.add(nId)
        queue.push(nId)
        const neighbor = ns.find(n => n.id === nId)!
        neighbor.state = 'queued'
        if (edge) edge.state = 'path'
      }
      steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [...queue], description: `Explore ${currNode.label} → ${ns.find(n => n.id === nId)?.label}` })
    }

    currNode.state = 'visited'
    steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [...queue], description: `${currNode.label} fully explored` })
  }

  return steps
}

// ─── DFS ─────────────────────────────────────────────────────────────────────
export function dfsSteps(nodes: GraphNode[], edges: GraphEdge[], startId: string): GraphStep[] {
  const steps: GraphStep[] = []
  const ns = cloneNodes(nodes)
  const es = cloneEdges(edges)

  ns.forEach(n => { n.state = 'unvisited' })
  es.forEach(e => { e.state = 'unvisited' })

  const visited = new Set<string>()
  const stack: string[] = []

  function dfs(id: string) {
    visited.add(id)
    stack.push(id)
    const curr = ns.find(n => n.id === id)!
    curr.state = 'visiting'
    steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [...stack], description: `Visit ${curr.label}, stack: [${stack.map(s => ns.find(n => n.id === s)?.label).join(',')}]` })

    for (const nId of getNeighbors(id, es)) {
      if (!visited.has(nId)) {
        const edge = es.find(e => (e.source === id && e.target === nId) || (e.source === nId && e.target === id))
        if (edge) edge.state = 'path'
        steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [...stack], description: `Recurse into ${ns.find(n => n.id === nId)?.label}` })
        dfs(nId)
        stack.pop()
        steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [...stack], description: `Backtrack to ${curr.label}` })
      }
    }

    curr.state = 'visited'
    steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [...stack], description: `${curr.label} fully explored` })
  }

  ns.find(n => n.id === startId)!.state = 'start'
  steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [], description: `Start DFS from ${ns.find(n => n.id === startId)?.label}` })
  dfs(startId)

  return steps
}

// ─── Dijkstra ────────────────────────────────────────────────────────────────
export function dijkstraSteps(nodes: GraphNode[], edges: GraphEdge[], startId: string): GraphStep[] {
  const steps: GraphStep[] = []
  const ns = cloneNodes(nodes)
  const es = cloneEdges(edges)

  const dist: Record<string, number> = {}
  const prev: Record<string, string | null> = {}
  const visited = new Set<string>()

  ns.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; n.state = 'unvisited' })
  es.forEach(e => { e.state = 'unvisited' })
  dist[startId] = 0
  ns.find(n => n.id === startId)!.state = 'start'

  steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [], description: `Dijkstra from ${ns.find(n => n.id === startId)?.label}. All distances = ∞ except start = 0`, distances: { ...dist } })

  for (let i = 0; i < ns.length; i++) {
    // Pick node with min distance
    let u = ''
    let minDist = Infinity
    for (const n of ns) {
      if (!visited.has(n.id) && dist[n.id] < minDist) {
        minDist = dist[n.id]; u = n.id
      }
    }
    if (!u) break

    visited.add(u)
    const uNode = ns.find(n => n.id === u)!
    uNode.state = 'visiting'
    steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [], description: `Process ${uNode.label} (dist=${dist[u]})`, distances: { ...dist } })

    for (const e of es) {
      const vId = e.source === u ? e.target : e.target === u ? e.source : null
      if (!vId || visited.has(vId)) continue
      const vNode = ns.find(n => n.id === vId)!
      const alt = dist[u] + e.weight
      const eCopy = es.find(ed => ed.id === e.id)!
      eCopy.state = 'active'
      steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [], description: `Edge ${uNode.label}→${vNode.label}: ${dist[u]} + ${e.weight} = ${alt} (current: ${dist[vId] === Infinity ? '∞' : dist[vId]})`, distances: { ...dist } })

      if (alt < dist[vId]) {
        dist[vId] = alt
        prev[vId] = u
        vNode.state = 'queued'
        eCopy.state = 'path'
        steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [], description: `Update dist[${vNode.label}] = ${alt}`, distances: { ...dist } })
      } else {
        eCopy.state = 'unvisited'
      }
    }

    uNode.state = 'visited'
    steps.push({ nodes: cloneNodes(ns), edges: cloneEdges(es), queue: [], description: `${uNode.label} settled with distance ${dist[u]}`, distances: { ...dist } })
  }

  return steps
}

// ─── Default Graph ────────────────────────────────────────────────────────────
export function buildDefaultGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    { id: 'a', label: 'A', x: 300, y: 80,  state: 'unvisited', distance: Infinity, previous: null },
    { id: 'b', label: 'B', x: 160, y: 200, state: 'unvisited', distance: Infinity, previous: null },
    { id: 'c', label: 'C', x: 440, y: 200, state: 'unvisited', distance: Infinity, previous: null },
    { id: 'd', label: 'D', x: 80,  y: 340, state: 'unvisited', distance: Infinity, previous: null },
    { id: 'e', label: 'E', x: 260, y: 340, state: 'unvisited', distance: Infinity, previous: null },
    { id: 'f', label: 'F', x: 520, y: 340, state: 'unvisited', distance: Infinity, previous: null },
  ]
  const edges: GraphEdge[] = [
    { id: 'ab', source: 'a', target: 'b', weight: 4,  state: 'unvisited' },
    { id: 'ac', source: 'a', target: 'c', weight: 2,  state: 'unvisited' },
    { id: 'bd', source: 'b', target: 'd', weight: 5,  state: 'unvisited' },
    { id: 'be', source: 'b', target: 'e', weight: 11, state: 'unvisited' },
    { id: 'ce', source: 'c', target: 'e', weight: 3,  state: 'unvisited' },
    { id: 'cf', source: 'c', target: 'f', weight: 8,  state: 'unvisited' },
    { id: 'de', source: 'd', target: 'e', weight: 2,  state: 'unvisited' },
    { id: 'ef', source: 'e', target: 'f', weight: 1,  state: 'unvisited' },
  ]
  return { nodes, edges }
}
