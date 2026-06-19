import type { BSTNode, TraversalType } from '../types'

let nodeIdCounter = 0
function makeId() { return `n${++nodeIdCounter}` }

// ─── BST Operations ──────────────────────────────────────────────────────────
export function insertBST(root: BSTNode | null, value: number): { root: BSTNode; steps: string[] } {
  const steps: string[] = []

  function insert(node: BSTNode | null, val: number): BSTNode {
    if (!node) {
      steps.push(`Create new node with value ${val}`)
      return { id: makeId(), value: val, left: null, right: null, state: 'inserting' }
    }
    steps.push(`At node ${node.value}: ${val} ${val < node.value ? '<' : '>'} ${node.value}, go ${val < node.value ? 'left' : 'right'}`)
    if (val < node.value) {
      return { ...node, left: insert(node.left, val), state: 'comparing' }
    } else if (val > node.value) {
      return { ...node, right: insert(node.right, val), state: 'comparing' }
    }
    steps.push(`Value ${val} already exists`)
    return node
  }

  const newRoot = insert(root, value)
  return { root: newRoot, steps }
}

export function deleteBST(root: BSTNode | null, value: number): BSTNode | null {
  if (!root) return null
  if (value < root.value) return { ...root, left: deleteBST(root.left, value) }
  if (value > root.value) return { ...root, right: deleteBST(root.right, value) }

  if (!root.left) return root.right
  if (!root.right) return root.left

  // Find inorder successor
  let successor = root.right
  while (successor.left) successor = successor.left
  return { ...root, value: successor.value, right: deleteBST(root.right, successor.value) }
}

export function searchBST(root: BSTNode | null, value: number): string[] {
  const steps: string[] = []
  let node = root
  while (node) {
    if (value === node.value) {
      steps.push(`Found ${value}!`)
      return steps
    }
    steps.push(`At ${node.value}: go ${value < node.value ? 'left' : 'right'}`)
    node = value < node.value ? node.left : node.right
  }
  steps.push(`${value} not found`)
  return steps
}

// ─── Traversals ──────────────────────────────────────────────────────────────
export function traverseBST(root: BSTNode | null, type: TraversalType): number[] {
  const result: number[] = []

  function inorder(node: BSTNode | null) {
    if (!node) return
    inorder(node.left)
    result.push(node.value)
    inorder(node.right)
  }

  function preorder(node: BSTNode | null) {
    if (!node) return
    result.push(node.value)
    preorder(node.left)
    preorder(node.right)
  }

  function postorder(node: BSTNode | null) {
    if (!node) return
    postorder(node.left)
    postorder(node.right)
    result.push(node.value)
  }

  function levelorder(node: BSTNode | null) {
    if (!node) return
    const queue: BSTNode[] = [node]
    while (queue.length) {
      const curr = queue.shift()!
      result.push(curr.value)
      if (curr.left) queue.push(curr.left)
      if (curr.right) queue.push(curr.right)
    }
  }

  if (type === 'inorder') inorder(root)
  else if (type === 'preorder') preorder(root)
  else if (type === 'postorder') postorder(root)
  else levelorder(root)

  return result
}

export function traversalSteps(root: BSTNode | null, type: TraversalType): number[][] {
  const snapshots: number[][] = []
  const visited: number[] = []

  function inorder(node: BSTNode | null) {
    if (!node) return
    inorder(node.left)
    visited.push(node.value)
    snapshots.push([...visited])
    inorder(node.right)
  }

  function preorder(node: BSTNode | null) {
    if (!node) return
    visited.push(node.value)
    snapshots.push([...visited])
    preorder(node.left)
    preorder(node.right)
  }

  function postorder(node: BSTNode | null) {
    if (!node) return
    postorder(node.left)
    postorder(node.right)
    visited.push(node.value)
    snapshots.push([...visited])
  }

  function levelorder(node: BSTNode | null) {
    if (!node) return
    const queue: BSTNode[] = [node]
    while (queue.length) {
      const curr = queue.shift()!
      visited.push(curr.value)
      snapshots.push([...visited])
      if (curr.left) queue.push(curr.left)
      if (curr.right) queue.push(curr.right)
    }
  }

  if (type === 'inorder') inorder(root)
  else if (type === 'preorder') preorder(root)
  else if (type === 'postorder') postorder(root)
  else levelorder(root)

  return snapshots
}

// ─── Layout Computation (for D3-free rendering) ───────────────────────────────
export interface LayoutNode {
  id: string
  value: number
  x: number
  y: number
  state: string
  parentId: string | null
}

export interface LayoutEdge {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export function computeLayout(root: BSTNode | null, width: number): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  const nodes: LayoutNode[] = []
  const edges: LayoutEdge[] = []

  function getHeight(node: BSTNode | null): number {
    if (!node) return 0
    return 1 + Math.max(getHeight(node.left), getHeight(node.right))
  }

  function assign(node: BSTNode | null, depth: number, left: number, right: number, parentId: string | null) {
    if (!node) return
    const x = (left + right) / 2
    const y = 60 + depth * 70
    nodes.push({ id: node.id, value: node.value, x, y, state: node.state, parentId })

    const parentNode = nodes.find(n => n.id === parentId)
    if (parentNode) {
      edges.push({ id: `${parentId}-${node.id}`, x1: parentNode.x, y1: parentNode.y, x2: x, y2: y })
    }

    assign(node.left,  depth + 1, left,       x,     node.id)
    assign(node.right, depth + 1, x,           right, node.id)
  }

  const h = getHeight(root)
  assign(root, 0, 0, width, null)
  return { nodes, edges }
}

export function buildDefaultBST(): BSTNode | null {
  const values = [50, 30, 70, 20, 40, 60, 80]
  let root: BSTNode | null = null
  for (const v of values) {
    const result = insertBST(root, v)
    root = result.root
  }
  // Reset states
  function resetStates(node: BSTNode | null): BSTNode | null {
    if (!node) return null
    return { ...node, state: 'normal', left: resetStates(node.left), right: resetStates(node.right) }
  }
  return resetStates(root)
}
