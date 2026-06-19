import type { SortStep } from '../types'

function step(
  array: number[],
  comparing: number[],
  swapping: number[],
  sorted: number[],
  comparisons: number,
  swaps: number,
  description: string,
  pivot?: number
): SortStep {
  return { array: [...array], comparing, swapping, sorted, comparisons, swaps, description, pivot }
}

// ─── Bubble Sort ─────────────────────────────────────────────────────────────
export function bubbleSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const a = [...input]
  const sorted: number[] = []
  let comparisons = 0
  let swaps = 0

  steps.push(step(a, [], [], [], 0, 0, 'Start Bubble Sort'))

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++
      steps.push(step(a, [j, j + 1], [], sorted, comparisons, swaps, `Compare a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}`))
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swaps++
        steps.push(step(a, [], [j, j + 1], sorted, comparisons, swaps, `Swap ${a[j + 1]} ↔ ${a[j]}`))
      }
    }
    sorted.unshift(a.length - 1 - i)
  }
  sorted.unshift(0)
  steps.push(step(a, [], [], [...Array(a.length).keys()], comparisons, swaps, 'Sorted!'))
  return steps
}

// ─── Insertion Sort ───────────────────────────────────────────────────────────
export function insertionSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const a = [...input]
  let comparisons = 0
  let swaps = 0

  steps.push(step(a, [], [], [0], 0, 0, 'Start Insertion Sort'))

  for (let i = 1; i < a.length; i++) {
    const key = a[i]
    let j = i - 1
    steps.push(step(a, [i], [], [...Array(i).keys()], comparisons, swaps, `Insert a[${i}]=${key} into sorted portion`))

    while (j >= 0 && a[j] > key) {
      comparisons++
      steps.push(step(a, [j, j + 1], [], [...Array(j).keys()], comparisons, swaps, `${a[j]} > ${key}, shift right`))
      a[j + 1] = a[j]
      swaps++
      steps.push(step(a, [], [j, j + 1], [...Array(j).keys()], comparisons, swaps, `Shifted a[${j}] → a[${j+1}]`))
      j--
    }
    a[j + 1] = key
    steps.push(step(a, [], [], [...Array(i + 1).keys()], comparisons, swaps, `Placed ${key} at index ${j+1}`))
  }

  steps.push(step(a, [], [], [...Array(a.length).keys()], comparisons, swaps, 'Sorted!'))
  return steps
}

// ─── Selection Sort ───────────────────────────────────────────────────────────
export function selectionSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const a = [...input]
  const sorted: number[] = []
  let comparisons = 0
  let swaps = 0

  steps.push(step(a, [], [], [], 0, 0, 'Start Selection Sort'))

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i
    steps.push(step(a, [minIdx], [], sorted, comparisons, swaps, `Find minimum in subarray from index ${i}`))

    for (let j = i + 1; j < a.length; j++) {
      comparisons++
      steps.push(step(a, [minIdx, j], [], sorted, comparisons, swaps, `Compare a[${j}]=${a[j]} with current min a[${minIdx}]=${a[minIdx]}`))
      if (a[j] < a[minIdx]) {
        minIdx = j
        steps.push(step(a, [minIdx], [], sorted, comparisons, swaps, `New minimum: a[${minIdx}]=${a[minIdx]}`))
      }
    }

    if (minIdx !== i) {
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
      swaps++
      steps.push(step(a, [], [i, minIdx], sorted, comparisons, swaps, `Swap minimum ${a[i]} to position ${i}`))
    }
    sorted.push(i)
  }
  sorted.push(a.length - 1)
  steps.push(step(a, [], [], [...Array(a.length).keys()], comparisons, swaps, 'Sorted!'))
  return steps
}

// ─── Merge Sort ───────────────────────────────────────────────────────────────
export function mergeSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const a = [...input]
  let comparisons = 0
  let swaps = 0
  const sorted: number[] = []

  function merge(arr: number[], l: number, m: number, r: number) {
    const left = arr.slice(l, m + 1)
    const right = arr.slice(m + 1, r + 1)
    let i = 0, j = 0, k = l

    while (i < left.length && j < right.length) {
      comparisons++
      steps.push(step(arr, [l + i, m + 1 + j], [], sorted, comparisons, swaps, `Compare ${left[i]} and ${right[j]}`))
      if (left[i] <= right[j]) {
        arr[k] = left[i]; i++
      } else {
        arr[k] = right[j]; j++
        swaps++
      }
      steps.push(step(arr, [], [k], sorted, comparisons, swaps, `Placed ${arr[k]} at index ${k}`))
      k++
    }
    while (i < left.length) { arr[k] = left[i]; i++; k++ }
    while (j < right.length) { arr[k] = right[j]; j++; k++ }

    for (let x = l; x <= r; x++) sorted.push(x)
    steps.push(step(arr, [], [], [...new Set(sorted)], comparisons, swaps, `Merged subarray [${l}..${r}]`))
  }

  function mergeSort(arr: number[], l: number, r: number) {
    if (l >= r) return
    const m = Math.floor((l + r) / 2)
    steps.push(step(arr, [l, r], [], sorted, comparisons, swaps, `Split [${l}..${r}] → [${l}..${m}] and [${m+1}..${r}]`))
    mergeSort(arr, l, m)
    mergeSort(arr, m + 1, r)
    merge(arr, l, m, r)
  }

  steps.push(step(a, [], [], [], 0, 0, 'Start Merge Sort'))
  mergeSort(a, 0, a.length - 1)
  steps.push(step(a, [], [], [...Array(a.length).keys()], comparisons, swaps, 'Sorted!'))
  return steps
}

// ─── Quick Sort ────────────────────────────────────────────────────────────────
export function quickSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const a = [...input]
  let comparisons = 0
  let swaps = 0
  const sorted: number[] = []

  function partition(arr: number[], low: number, high: number): number {
    const pivotVal = arr[high]
    steps.push(step(arr, [], [], sorted, comparisons, swaps, `Pivot: ${pivotVal} at index ${high}`, high))
    let i = low - 1

    for (let j = low; j < high; j++) {
      comparisons++
      steps.push(step(arr, [j, high], [], sorted, comparisons, swaps, `Compare ${arr[j]} with pivot ${pivotVal}`, high))
      if (arr[j] <= pivotVal) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        swaps++
        steps.push(step(arr, [], [i, j], sorted, comparisons, swaps, `${arr[j]} ≤ pivot, swap a[${i}] ↔ a[${j}]`, high))
      }
    }
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    swaps++
    sorted.push(i + 1)
    steps.push(step(arr, [], [i + 1, high], [...new Set(sorted)], comparisons, swaps, `Place pivot at index ${i+1}`, i + 1))
    return i + 1
  }

  function quickSort(arr: number[], low: number, high: number) {
    if (low >= high) {
      if (low === high) sorted.push(low)
      return
    }
    const pi = partition(arr, low, high)
    quickSort(arr, low, pi - 1)
    quickSort(arr, pi + 1, high)
  }

  steps.push(step(a, [], [], [], 0, 0, 'Start Quick Sort'))
  quickSort(a, 0, a.length - 1)
  steps.push(step(a, [], [], [...Array(a.length).keys()], comparisons, swaps, 'Sorted!'))
  return steps
}

// ─── Heap Sort ────────────────────────────────────────────────────────────────
export function heapSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const a = [...input]
  let comparisons = 0
  let swaps = 0
  const sorted: number[] = []

  function heapify(arr: number[], n: number, i: number) {
    let largest = i
    const l = 2 * i + 1
    const r = 2 * i + 2

    if (l < n) {
      comparisons++
      steps.push(step(arr, [largest, l], [], sorted, comparisons, swaps, `Compare parent=${arr[largest]} with left=${arr[l]}`))
      if (arr[l] > arr[largest]) largest = l
    }
    if (r < n) {
      comparisons++
      steps.push(step(arr, [largest, r], [], sorted, comparisons, swaps, `Compare largest=${arr[largest]} with right=${arr[r]}`))
      if (arr[r] > arr[largest]) largest = r
    }

    if (largest !== i) {
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
      swaps++
      steps.push(step(arr, [], [i, largest], sorted, comparisons, swaps, `Swap ${arr[largest]} ↔ ${arr[i]}`))
      heapify(arr, n, largest)
    }
  }

  steps.push(step(a, [], [], [], 0, 0, 'Start Heap Sort — Build max-heap'))

  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) heapify(a, a.length, i)
  steps.push(step(a, [], [], [], comparisons, swaps, 'Max-heap built'))

  for (let i = a.length - 1; i > 0; i--) {
    ;[a[0], a[i]] = [a[i], a[0]]
    swaps++
    sorted.push(i)
    steps.push(step(a, [], [0, i], [...new Set(sorted)], comparisons, swaps, `Move max ${a[i]} to index ${i}`))
    heapify(a, i, 0)
  }
  sorted.push(0)
  steps.push(step(a, [], [], [...Array(a.length).keys()], comparisons, swaps, 'Sorted!'))
  return steps
}

export function generateArray(size: number, type: 'random' | 'sorted' | 'reverse' | 'nearly'): number[] {
  const arr = Array.from({ length: size }, (_, i) => i + 1)
  if (type === 'sorted') return arr
  if (type === 'reverse') return arr.reverse()
  if (type === 'nearly') {
    for (let i = 0; i < Math.floor(size / 10); i++) {
      const a = Math.floor(Math.random() * size)
      const b = Math.floor(Math.random() * size)
      ;[arr[a], arr[b]] = [arr[b], arr[a]]
    }
    return arr
  }
  // random shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
