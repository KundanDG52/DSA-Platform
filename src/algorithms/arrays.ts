import type { ArrayElement, ArrayStep } from '../types'

function makeElements(arr: number[]): ArrayElement[] {
  return arr.map((value, i) => ({ id: i, value, state: 'normal' }))
}

function clone(els: ArrayElement[]): ArrayElement[] {
  return els.map(e => ({ ...e }))
}

// ─── Insert ─────────────────────────────────────────────────────────────────
export function insertSteps(arr: number[], index: number, value: number): ArrayStep[] {
  const steps: ArrayStep[] = []
  let els = makeElements(arr)

  steps.push({ elements: clone(els), description: `Insert ${value} at index ${index}` })

  // highlight insertion point
  els = els.map((e, i) => ({ ...e, state: i === index ? 'selected' : 'normal' }))
  steps.push({ elements: clone(els), description: `Shift elements right from index ${index}` })

  const newArr = [...arr.slice(0, index), value, ...arr.slice(index)]
  els = makeElements(newArr)
  els[index] = { ...els[index], state: 'found' }
  steps.push({ elements: clone(els), description: `Inserted ${value} at index ${index}` })

  els = makeElements(newArr)
  steps.push({ elements: clone(els), description: `Done! Array length: ${newArr.length}` })

  return steps
}

// ─── Delete ──────────────────────────────────────────────────────────────────
export function deleteSteps(arr: number[], index: number): ArrayStep[] {
  const steps: ArrayStep[] = []
  let els = makeElements(arr)

  steps.push({ elements: clone(els), description: `Delete element at index ${index}` })

  els = els.map((e, i) => ({ ...e, state: i === index ? 'selected' : 'normal' }))
  steps.push({ elements: clone(els), description: `Mark element arr[${index}]=${arr[index]} for deletion` })

  const newArr = arr.filter((_, i) => i !== index)
  els = makeElements(newArr)
  steps.push({ elements: clone(els), description: `Removed element, shift left complete` })

  return steps
}

// ─── Linear Search ───────────────────────────────────────────────────────────
export function searchSteps(arr: number[], target: number): ArrayStep[] {
  const steps: ArrayStep[] = []
  const els = makeElements(arr)

  steps.push({ elements: clone(els), description: `Search for ${target}` })

  for (let i = 0; i < arr.length; i++) {
    const current = els.map((e, j) => ({
      ...e,
      state: j < i ? 'sorted' : j === i ? 'comparing' : 'normal',
    })) as ArrayElement[]
    steps.push({ elements: current, description: `Compare arr[${i}]=${arr[i]} with ${target}` })

    if (arr[i] === target) {
      const found = current.map((e, j) => ({ ...e, state: j === i ? 'found' : e.state })) as ArrayElement[]
      steps.push({ elements: found, description: `Found ${target} at index ${i}!` })
      return steps
    }
  }

  steps.push({
    elements: els.map(e => ({ ...e, state: 'comparing' })),
    description: `${target} not found in array`,
  })

  return steps
}

// ─── Reverse ─────────────────────────────────────────────────────────────────
export function reverseSteps(arr: number[]): ArrayStep[] {
  const steps: ArrayStep[] = []
  const a = [...arr]
  let left = 0
  let right = a.length - 1

  steps.push({ elements: makeElements(a), description: 'Two-pointer reverse: left=0, right=end' })

  while (left < right) {
    const els = makeElements(a)
    els[left] = { ...els[left], state: 'pointer-left' }
    els[right] = { ...els[right], state: 'pointer-right' }
    steps.push({ elements: clone(els), description: `Compare pointers: left=${left}, right=${right}` })

    ;[a[left], a[right]] = [a[right], a[left]]
    const swapped = makeElements(a)
    swapped[left] = { ...swapped[left], state: 'swapping' }
    swapped[right] = { ...swapped[right], state: 'swapping' }
    steps.push({ elements: clone(swapped), description: `Swap arr[${left}] and arr[${right}]` })

    left++
    right--
  }

  steps.push({ elements: makeElements(a), description: 'Array reversed!' })
  return steps
}

// ─── Sliding Window (Max Sum) ────────────────────────────────────────────────
export function slidingWindowSteps(arr: number[], k: number): ArrayStep[] {
  const steps: ArrayStep[] = []

  if (k > arr.length) return steps

  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0)
  let maxSum = windowSum

  const mark = (start: number): ArrayElement[] =>
    arr.map((v, i) => ({
      id: i,
      value: v,
      state: i >= start && i < start + k ? 'window' : 'normal',
    }))

  steps.push({ elements: mark(0), description: `Initial window [0..${k-1}], sum=${windowSum}` })

  for (let i = 1; i <= arr.length - k; i++) {
    windowSum = windowSum - arr[i - 1] + arr[i + k - 1]
    if (windowSum > maxSum) maxSum = windowSum
    steps.push({
      elements: mark(i),
      description: `Slide window to [${i}..${i+k-1}], sum=${windowSum}, max=${maxSum}`,
    })
  }

  steps.push({ elements: mark(0), description: `Max subarray sum of length ${k} = ${maxSum}` })
  return steps
}

// ─── Two Pointer (Pair Sum) ──────────────────────────────────────────────────
export function twoPointerSteps(arr: number[], target: number): ArrayStep[] {
  const steps: ArrayStep[] = []
  const sorted = [...arr].sort((a, b) => a - b)
  let left = 0
  let right = sorted.length - 1

  const mark = (l: number, r: number, state?: 'found'): ArrayElement[] =>
    sorted.map((v, i) => ({
      id: i,
      value: v,
      state:
        i === l ? (state === 'found' ? 'found' : 'pointer-left') :
        i === r ? (state === 'found' ? 'found' : 'pointer-right') :
        'normal',
    }))

  steps.push({ elements: mark(left, right), description: `Find pair summing to ${target} (sorted array)` })

  while (left < right) {
    const sum = sorted[left] + sorted[right]
    steps.push({ elements: mark(left, right), description: `${sorted[left]} + ${sorted[right]} = ${sum}` })

    if (sum === target) {
      steps.push({ elements: mark(left, right, 'found'), description: `Found pair! (${sorted[left]}, ${sorted[right]}) = ${target}` })
      return steps
    } else if (sum < target) {
      left++
      steps.push({ elements: mark(left, right), description: `Sum too small, move left pointer →` })
    } else {
      right--
      steps.push({ elements: mark(left, right), description: `Sum too large, move right pointer ←` })
    }
  }

  steps.push({ elements: mark(left, right), description: `No pair found summing to ${target}` })
  return steps
}

// ─── Prefix Sum ──────────────────────────────────────────────────────────────
export function prefixSumSteps(arr: number[]): ArrayStep[] {
  const steps: ArrayStep[] = []
  const prefix = new Array(arr.length + 1).fill(0)

  steps.push({
    elements: arr.map((v, i) => ({ id: i, value: v, state: 'normal' })),
    description: 'Build prefix sum array',
  })

  for (let i = 1; i <= arr.length; i++) {
    prefix[i] = prefix[i - 1] + arr[i - 1]
    steps.push({
      elements: arr.map((v, j) => ({
        id: j,
        value: j < i ? prefix[j + 1] : v,
        state: j === i - 1 ? 'found' : j < i - 1 ? 'sorted' : 'normal',
      })),
      description: `prefix[${i}] = prefix[${i-1}] + arr[${i-1}] = ${prefix[i-1]} + ${arr[i-1]} = ${prefix[i]}`,
    })
  }

  return steps
}

// ─── Two Sum (Hash Map) ──────────────────────────────────────────────────────
export interface TwoSumStep {
  array: number[]
  current: number
  map: Map<number, number>
  found: [number, number] | null
  description: string
}

export function twoSumSteps(arr: number[], target: number): TwoSumStep[] {
  const steps: TwoSumStep[] = []
  const map = new Map<number, number>()

  steps.push({ array: [...arr], current: -1, map: new Map(), found: null, description: `Find two numbers summing to ${target} using hash map` })

  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i]
    steps.push({
      array: [...arr],
      current: i,
      map: new Map(map),
      found: null,
      description: `arr[${i}]=${arr[i]}, complement needed: ${target}-${arr[i]}=${complement}`,
    })

    if (map.has(complement)) {
      const j = map.get(complement)!
      steps.push({
        array: [...arr],
        current: i,
        map: new Map(map),
        found: [j, i],
        description: `Found! arr[${j}]=${arr[j]} + arr[${i}]=${arr[i]} = ${target} ✓`,
      })
      return steps
    }

    map.set(arr[i], i)
    steps.push({
      array: [...arr],
      current: i,
      map: new Map(map),
      found: null,
      description: `Store {${arr[i]}: ${i}} in hash map`,
    })
  }

  steps.push({ array: [...arr], current: -1, map: new Map(map), found: null, description: 'No solution found' })
  return steps
}
