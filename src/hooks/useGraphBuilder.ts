import { useState, useCallback } from 'react'
import type { GraphNode, GraphEdge } from '../types'
import { buildDefaultGraph } from '../algorithms/graphs'

let nodeCounter = 0
let edgeCounter = 0

export function useGraphBuilder(initial?: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const [nodes, setNodes] = useState<GraphNode[]>(initial?.nodes ?? buildDefaultGraph().nodes)
  const [edges, setEdges] = useState<GraphEdge[]>(initial?.edges ?? buildDefaultGraph().edges)
  const [draggingEdgeFrom, setDraggingEdgeFrom] = useState<string | null>(null)
  const [mode, setMode] = useState<'select' | 'addNode' | 'addEdge' | 'delete'>('select')

  const addNode = useCallback((x: number, y: number) => {
    const id = `node_${++nodeCounter}`
    const label = String.fromCharCode(65 + (nodes.length % 26))
    setNodes(prev => [...prev, { id, label, x, y, state: 'unvisited', distance: Infinity, previous: null }])
  }, [nodes.length])

  const deleteNode = useCallback((id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id))
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id))
  }, [])

  const addEdge = useCallback((sourceId: string, targetId: string, weight = 1) => {
    if (sourceId === targetId) return
    const exists = edges.some(e =>
      (e.source === sourceId && e.target === targetId) ||
      (e.source === targetId && e.target === sourceId)
    )
    if (exists) return
    const id = `edge_${++edgeCounter}`
    setEdges(prev => [...prev, { id, source: sourceId, target: targetId, weight, state: 'unvisited' }])
  }, [edges])

  const deleteEdge = useCallback((id: string) => {
    setEdges(prev => prev.filter(e => e.id !== id))
  }, [])

  const updateNodePosition = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n))
  }, [])

  const setNodeStates = useCallback((updatedNodes: GraphNode[]) => {
    setNodes(updatedNodes)
  }, [])

  const setEdgeStates = useCallback((updatedEdges: GraphEdge[]) => {
    setEdges(updatedEdges)
  }, [])

  const resetStates = useCallback(() => {
    setNodes(prev => prev.map(n => ({ ...n, state: 'unvisited', distance: Infinity, previous: null })))
    setEdges(prev => prev.map(e => ({ ...e, state: 'unvisited' })))
  }, [])

  const loadDefault = useCallback(() => {
    const { nodes: n, edges: e } = buildDefaultGraph()
    setNodes(n); setEdges(e)
  }, [])

  return {
    nodes, edges, mode, draggingEdgeFrom,
    setMode, setDraggingEdgeFrom,
    addNode, deleteNode, addEdge, deleteEdge,
    updateNodePosition, setNodeStates, setEdgeStates,
    resetStates, loadDefault,
  }
}
