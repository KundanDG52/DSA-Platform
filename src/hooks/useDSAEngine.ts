import { useState, useCallback } from 'react'
import { useAnimationControls } from './useAnimationControls'
import type { ArrayStep } from '../types'
import {
  insertSteps, deleteSteps, searchSteps,
  reverseSteps, slidingWindowSteps, twoPointerSteps, prefixSumSteps,
} from '../algorithms/arrays'

export type ArrayOperation = 'insert' | 'delete' | 'search' | 'reverse' | 'sliding' | 'twopointer' | 'prefix'

export function useArrayEngine(initial = [64, 34, 25, 12, 22, 11, 90]) {
  const [array, setArray] = useState<number[]>(initial)
  const [operation, setOperation] = useState<ArrayOperation>('search')
  const controls = useAnimationControls<ArrayStep>()

  const runOperation = useCallback((op: ArrayOperation, ...args: number[]) => {
    setOperation(op)
    let steps: ArrayStep[] = []
    switch (op) {
      case 'insert':    steps = insertSteps(array, args[0] ?? 0, args[1] ?? 0); break
      case 'delete':    steps = deleteSteps(array, args[0] ?? 0); break
      case 'search':    steps = searchSteps(array, args[0] ?? 0); break
      case 'reverse':   steps = reverseSteps(array); break
      case 'sliding':   steps = slidingWindowSteps(array, args[0] ?? 3); break
      case 'twopointer':steps = twoPointerSteps(array, args[0] ?? 0); break
      case 'prefix':    steps = prefixSumSteps(array); break
    }
    controls.setSteps(steps)
    controls.play()
  }, [array, controls])

  const setNewArray = useCallback((arr: number[]) => {
    setArray(arr)
    controls.reset()
  }, [controls])

  return { array, setNewArray, operation, controls, runOperation }
}
