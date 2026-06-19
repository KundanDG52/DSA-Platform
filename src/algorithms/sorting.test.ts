import { describe, it, expect } from 'vitest'
import { bubbleSortSteps, insertionSortSteps, selectionSortSteps, mergeSortSteps, quickSortSteps, heapSortSteps, generateArray } from './sorting'

function finalArray(steps: ReturnType<typeof bubbleSortSteps>) {
  return steps[steps.length - 1].array
}

const SORTED = [1, 2, 3, 4, 5, 6, 7, 8]

describe('bubbleSortSteps', () => {
  it('sorts correctly', () => {
    expect(finalArray(bubbleSortSteps([5, 3, 8, 1, 4]))).toEqual([1, 3, 4, 5, 8])
  })
  it('handles already sorted input', () => {
    expect(finalArray(bubbleSortSteps([1, 2, 3]))).toEqual([1, 2, 3])
  })
})

describe('insertionSortSteps', () => {
  it('sorts correctly', () => {
    expect(finalArray(insertionSortSteps([4, 2, 7, 1, 5]))).toEqual([1, 2, 4, 5, 7])
  })
})

describe('selectionSortSteps', () => {
  it('sorts correctly', () => {
    expect(finalArray(selectionSortSteps([64, 25, 12, 22, 11]))).toEqual([11, 12, 22, 25, 64])
  })
})

describe('mergeSortSteps', () => {
  it('sorts correctly', () => {
    expect(finalArray(mergeSortSteps([38, 27, 43, 3, 9, 82, 10]))).toEqual([3, 9, 10, 27, 38, 43, 82])
  })
  it('handles single element', () => {
    expect(finalArray(mergeSortSteps([42]))).toEqual([42])
  })
})

describe('quickSortSteps', () => {
  it('sorts correctly', () => {
    const result = finalArray(quickSortSteps([10, 7, 8, 9, 1, 5]))
    expect(result).toEqual([1, 5, 7, 8, 9, 10])
  })
})

describe('heapSortSteps', () => {
  it('sorts correctly', () => {
    expect(finalArray(heapSortSteps([12, 11, 13, 5, 6, 7]))).toEqual([5, 6, 7, 11, 12, 13])
  })
})

describe('generateArray', () => {
  it('generates sorted array', () => {
    expect(generateArray(5, 'sorted')).toEqual([1, 2, 3, 4, 5])
  })
  it('generates reverse array', () => {
    expect(generateArray(5, 'reverse')).toEqual([5, 4, 3, 2, 1])
  })
  it('generates random array of correct length', () => {
    expect(generateArray(10, 'random')).toHaveLength(10)
  })
})
