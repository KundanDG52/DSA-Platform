// ─── Array Types ────────────────────────────────────────────────────────────
export type ArrayElementState =
  | 'normal' | 'selected' | 'comparing' | 'sorted'
  | 'window' | 'pivot' | 'pointer-left' | 'pointer-right' | 'found' | 'swapping'

export interface ArrayElement {
  id: number
  value: number
  state: ArrayElementState
}

export interface ArrayStep {
  elements: ArrayElement[]
  description: string
  comparisons?: number
  swaps?: number
}

// ─── Sorting Types ───────────────────────────────────────────────────────────
export type SortAlgorithm = 'bubble' | 'insertion' | 'selection' | 'merge' | 'quick' | 'heap'

export interface SortStep {
  array: number[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
  pivot?: number
  comparisons: number
  swaps: number
  description: string
}

// ─── Tree Types ──────────────────────────────────────────────────────────────
export type TreeNodeState = 'normal' | 'comparing' | 'inserting' | 'visited' | 'found' | 'highlighted'

export interface BSTNode {
  id: string
  value: number
  left: BSTNode | null
  right: BSTNode | null
  state: TreeNodeState
  x?: number
  y?: number
  parentX?: number
  parentY?: number
}

export type TraversalType = 'inorder' | 'preorder' | 'postorder' | 'levelorder'

// ─── Graph Types ─────────────────────────────────────────────────────────────
export type GraphNodeState = 'unvisited' | 'queued' | 'visiting' | 'visited' | 'path' | 'start' | 'end'
export type GraphEdgeState = 'unvisited' | 'active' | 'path' | 'visited'

export interface GraphNode {
  id: string
  label: string
  x: number
  y: number
  state: GraphNodeState
  distance: number
  previous: string | null
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  weight: number
  state: GraphEdgeState
}

export type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra' | 'topo'

// ─── DP Types ────────────────────────────────────────────────────────────────
export interface FibNode {
  id: string
  n: number
  value: number | null
  state: 'pending' | 'computing' | 'memoized' | 'done'
  children: FibNode[]
  depth: number
  x?: number
  y?: number
}

export interface LCSCell {
  row: number
  col: number
  value: number
  state: 'empty' | 'computing' | 'match' | 'path' | 'done'
  arrow?: 'diag' | 'left' | 'up'
}

// ─── Linked List Types ───────────────────────────────────────────────────────
export interface ListNode {
  id: string
  value: number
  next: string | null
  prev: string | null
  state: 'normal' | 'active' | 'slow' | 'fast' | 'deleted' | 'new'
}

// ─── Gamification Types ──────────────────────────────────────────────────────
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: number
  xpReward: number
  color: string
}

export interface TopicProgress {
  id: string
  completed: boolean
  xpEarned: number
  lastVisited?: number
}

export interface UserState {
  xp: number
  level: number
  streak: number
  lastVisitDate: string
  topicProgress: Record<string, TopicProgress>
  achievements: Achievement[]
  completedProblems: string[]
}

// ─── Topic/Module Definition ─────────────────────────────────────────────────
export interface Topic {
  id: string
  name: string
  icon: string
  description: string
  path: string
  color: string
  glowClass: string
  difficulty: 1 | 2 | 3 | 4 | 5
  estimatedMinutes: number
  subtopics: string[]
}
