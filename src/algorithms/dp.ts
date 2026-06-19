// ─── Fibonacci (Memoization) ──────────────────────────────────────────────────
export interface FibStep {
  n: number
  memo: Map<number, number>
  callStack: number[]
  result: number | null
  description: string
}

export function fibSteps(n: number): FibStep[] {
  const steps: FibStep[] = []
  const memo = new Map<number, number>()
  const callStack: number[] = []

  function fib(x: number): number {
    callStack.push(x)
    if (memo.has(x)) {
      steps.push({ n: x, memo: new Map(memo), callStack: [...callStack], result: memo.get(x)!, description: `fib(${x}) = ${memo.get(x)} (memoized ✓)` })
      callStack.pop()
      return memo.get(x)!
    }
    if (x <= 1) {
      memo.set(x, x)
      steps.push({ n: x, memo: new Map(memo), callStack: [...callStack], result: x, description: `fib(${x}) = ${x} (base case)` })
      callStack.pop()
      return x
    }
    steps.push({ n: x, memo: new Map(memo), callStack: [...callStack], result: null, description: `fib(${x}) = fib(${x-1}) + fib(${x-2})` })
    const result = fib(x - 1) + fib(x - 2)
    memo.set(x, result)
    steps.push({ n: x, memo: new Map(memo), callStack: [...callStack], result, description: `fib(${x}) = ${result} (stored in memo)` })
    callStack.pop()
    return result
  }

  fib(n)
  return steps
}

// ─── LCS ─────────────────────────────────────────────────────────────────────
export interface LCSStep {
  dp: number[][]
  i: number
  j: number
  description: string
  lcs?: string
}

export function lcsSteps(s1: string, s2: string): LCSStep[] {
  const steps: LCSStep[] = []
  const m = s1.length
  const n = s2.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  steps.push({ dp: dp.map(r => [...r]), i: -1, j: -1, description: `LCS("${s1}", "${s2}") — initialize DP table` })

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
        steps.push({ dp: dp.map(r => [...r]), i, j, description: `s1[${i-1}]='${s1[i-1]}' == s2[${j-1}]='${s2[j-1]}' → dp[${i}][${j}] = ${dp[i][j]}` })
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        steps.push({ dp: dp.map(r => [...r]), i, j, description: `s1[${i-1}]='${s1[i-1]}' ≠ s2[${j-1}]='${s2[j-1]}' → max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}` })
      }
    }
  }

  // Backtrack to find LCS
  let i = m, j = n
  let lcs = ''
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) { lcs = s1[i - 1] + lcs; i--; j-- }
    else if (dp[i - 1][j] > dp[i][j - 1]) i--
    else j--
  }
  steps.push({ dp: dp.map(r => [...r]), i: -1, j: -1, description: `LCS = "${lcs}" (length ${dp[m][n]})`, lcs })

  return steps
}

// ─── Knapsack 0/1 ─────────────────────────────────────────────────────────────
export interface KnapsackItem { weight: number; value: number; name: string }

export interface KnapsackStep {
  dp: number[][]
  i: number
  w: number
  included: boolean
  description: string
  selectedItems?: number[]
}

export function knapsackSteps(items: KnapsackItem[], capacity: number): KnapsackStep[] {
  const steps: KnapsackStep[] = []
  const n = items.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0))

  steps.push({ dp: dp.map(r => [...r]), i: 0, w: 0, included: false, description: `0/1 Knapsack: ${n} items, capacity=${capacity}` })

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      const item = items[i - 1]
      if (item.weight <= w) {
        const withItem = dp[i - 1][w - item.weight] + item.value
        const withoutItem = dp[i - 1][w]
        dp[i][w] = Math.max(withItem, withoutItem)
        const included = withItem > withoutItem
        steps.push({
          dp: dp.map(r => [...r]), i, w, included,
          description: `Item ${item.name}(w=${item.weight},v=${item.value}) at cap=${w}: ${included ? 'Include' : 'Skip'} → ${dp[i][w]}`,
        })
      } else {
        dp[i][w] = dp[i - 1][w]
        steps.push({ dp: dp.map(r => [...r]), i, w, included: false, description: `Item ${item.name} too heavy (${item.weight} > ${w}), skip` })
      }
    }
  }

  // Backtrack
  const selected: number[] = []
  let i = n, w = capacity
  while (i > 0 && w > 0) {
    if (dp[i][w] !== dp[i - 1][w]) { selected.push(i - 1); w -= items[i - 1].weight }
    i--
  }
  steps.push({ dp: dp.map(r => [...r]), i: -1, w: -1, included: false, description: `Max value = ${dp[n][capacity]}. Selected: ${selected.map(j => items[j].name).join(', ')}`, selectedItems: selected })

  return steps
}

// ─── Coin Change ──────────────────────────────────────────────────────────────
export interface CoinStep {
  dp: number[]
  amount: number
  coin: number
  description: string
}

export function coinChangeSteps(coins: number[], amount: number): CoinStep[] {
  const steps: CoinStep[] = []
  const INF = amount + 1
  const dp = new Array(amount + 1).fill(INF)
  dp[0] = 0

  steps.push({ dp: [...dp], amount: 0, coin: -1, description: `Coin Change: coins=[${coins}], target=${amount}. dp[0]=0` })

  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) {
      if (dp[a - coin] + 1 < dp[a]) {
        dp[a] = dp[a - coin] + 1
        steps.push({ dp: [...dp], amount: a, coin, description: `Using coin ${coin}: dp[${a}] = dp[${a-coin}]+1 = ${dp[a]}` })
      }
    }
  }

  const result = dp[amount] === INF ? -1 : dp[amount]
  steps.push({ dp: [...dp], amount, coin: -1, description: `Min coins for ${amount} = ${result === -1 ? 'impossible' : result}` })
  return steps
}
