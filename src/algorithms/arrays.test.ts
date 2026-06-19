import { describe, it, expect } from 'vitest'
import { insertSteps, deleteSteps, searchSteps, reverseSteps, slidingWindowSteps, twoPointerSteps, twoSumSteps } from './arrays'

describe('insertSteps', () => {
  it('inserts a value at the given index', () => {
    const steps = insertSteps([1, 2, 3], 1, 99)
    const final = steps[steps.length - 1].elements.map(e => e.value)
    expect(final).toEqual([1, 99, 2, 3])
  })
  it('inserts at head', () => {
    const steps = insertSteps([1, 2, 3], 0, 0)
    const final = steps[steps.length - 1].elements.map(e => e.value)
    expect(final).toEqual([0, 1, 2, 3])
  })
})

describe('deleteSteps', () => {
  it('deletes element at given index', () => {
    const steps = deleteSteps([1, 2, 3, 4], 2)
    const final = steps[steps.length - 1].elements.map(e => e.value)
    expect(final).toEqual([1, 2, 4])
  })
})

describe('searchSteps', () => {
  it('finds element that exists', () => {
    const steps = searchSteps([5, 3, 8, 1], 8)
    const last = steps[steps.length - 1]
    expect(last.description).toContain('Found')
  })
  it('reports not found', () => {
    const steps = searchSteps([5, 3, 8, 1], 99)
    const last = steps[steps.length - 1]
    expect(last.description).toContain('not found')
  })
})

describe('reverseSteps', () => {
  it('reverses the array', () => {
    const steps = reverseSteps([1, 2, 3, 4, 5])
    const final = steps[steps.length - 1].elements.map(e => e.value)
    expect(final).toEqual([5, 4, 3, 2, 1])
  })
  it('handles single element', () => {
    const steps = reverseSteps([42])
    const final = steps[steps.length - 1].elements.map(e => e.value)
    expect(final).toEqual([42])
  })
})

describe('slidingWindowSteps', () => {
  it('produces steps for window size 3', () => {
    const steps = slidingWindowSteps([1, 3, 2, 5, 4], 3)
    expect(steps.length).toBeGreaterThan(0)
    const last = steps[steps.length - 1]
    expect(last.description).toContain('Max')
  })
})

describe('twoPointerSteps', () => {
  it('finds a pair summing to target', () => {
    const steps = twoPointerSteps([1, 2, 3, 4, 6], 6)
    const found = steps.some(s => s.description.includes('Found'))
    expect(found).toBe(true)
  })
})

describe('twoSumSteps', () => {
  it('finds indices of two sum', () => {
    const steps = twoSumSteps([2, 7, 11, 15], 9)
    const last = steps[steps.length - 1]
    expect(last.found).toEqual([0, 1])
  })
  it('returns no solution when impossible', () => {
    const steps = twoSumSteps([1, 2, 3], 100)
    const last = steps[steps.length - 1]
    expect(last.found).toBeNull()
  })
})
