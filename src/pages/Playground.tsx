import { useState, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { Play, Copy, RotateCcw } from 'lucide-react'
import { GlassCard } from '../components/shared/GlassCard'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

const STARTER_CODE = `// DSA Playground — JavaScript
// Write your algorithm and click Run

function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test cases
const testCases = [
  { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
  { input: [[3, 2, 4], 6],      expected: [1, 2] },
  { input: [[3, 3], 6],         expected: [0, 1] },
];

for (const tc of testCases) {
  const result = twoSum(...tc.input);
  const pass = JSON.stringify(result) === JSON.stringify(tc.expected);
  console.log(\`\${pass ? '✓' : '✗'} twoSum(\${JSON.stringify(tc.input[0])}, \${tc.input[1]}) = \${JSON.stringify(result)}\`);
}
`

const EXAMPLES = [
  { label: 'Two Sum',         code: STARTER_CODE },
  { label: 'Binary Search',   code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const arr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log('Search 7:', binarySearch(arr, 7));   // 3
console.log('Search 6:', binarySearch(arr, 6));   // -1
console.log('Search 1:', binarySearch(arr, 1));   // 0
` },
  { label: 'Fibonacci DP',    code: `function fibonacci(n) {
  const memo = new Map();
  function fib(k) {
    if (k <= 1) return k;
    if (memo.has(k)) return memo.get(k);
    const result = fib(k - 1) + fib(k - 2);
    memo.set(k, result);
    return result;
  }
  return fib(n);
}

for (let i = 0; i <= 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}
` },
  { label: 'BFS',             code: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}

const graph = {
  A: ['B', 'C'],
  B: ['D', 'E'],
  C: ['F'],
  D: [], E: [], F: []
};
console.log('BFS from A:', bfs(graph, 'A').join(' → '));
` },
]

function runCode(code: string): string {
  const logs: string[] = []
  const fakeConsole = { log: (...args: unknown[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')) }
  try {
    const fn = new Function('console', code)
    fn(fakeConsole)
    return logs.join('\n') || '(no output)'
  } catch (e) {
    return `❌ Error: ${e instanceof Error ? e.message : String(e)}`
  }
}

export function Playground() {
  const [code, setCode] = useState(STARTER_CODE)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)

  function execute() {
    setRunning(true)
    setTimeout(() => {
      setOutput(runCode(code))
      setRunning(false)
    }, 50)
  }

  function copyCode() {
    navigator.clipboard.writeText(code).catch(() => {})
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#00d4ff15', border: '1px solid #00d4ff30' }}>⚡</div>
          <div>
            <h1 className="text-2xl font-black text-white">Playground</h1>
            <p className="text-white/40 text-sm">Write, run and test algorithms in the browser</p>
          </div>
        </div>
      </motion.div>

      {/* Examples */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map(ex => (
          <button
            key={ex.label}
            onClick={() => { setCode(ex.code); setOutput('') }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff80' }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <GlassCard className="overflow-hidden" style={{ minHeight: 420 }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/05">
            <span className="text-xs font-semibold text-white/50">editor.js</span>
            <div className="flex gap-2">
              <button onClick={copyCode} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Copy">
                <Copy size={13} className="text-white/40" />
              </button>
              <button onClick={() => { setCode(STARTER_CODE); setOutput('') }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Reset">
                <RotateCcw size={13} className="text-white/40" />
              </button>
            </div>
          </div>

          <Suspense fallback={<div className="p-6 text-white/30 text-sm font-mono">Loading editor...</div>}>
            <MonacoEditor
              height="360px"
              defaultLanguage="javascript"
              value={code}
              onChange={v => setCode(v ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: '"JetBrains Mono", Consolas, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                padding: { top: 12 },
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </Suspense>

          <div className="px-4 py-3 border-t border-white/05">
            <button
              onClick={execute}
              disabled={running}
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm text-bg disabled:opacity-60 transition-all"
              style={{ background: '#00d4ff', boxShadow: '0 0 16px #00d4ff50' }}
            >
              <Play size={14} />
              {running ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </GlassCard>

        {/* Output */}
        <GlassCard className="overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-white/05 flex items-center justify-between">
            <span className="text-xs font-semibold text-white/50">output</span>
            {output && <button onClick={() => setOutput('')} className="text-xs text-white/30 hover:text-white/60">Clear</button>}
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto" style={{ minHeight: 360 }}>
            {output ? (
              <pre className="text-white/80 whitespace-pre-wrap leading-relaxed">{output}</pre>
            ) : (
              <p className="text-white/20">Run your code to see output here...</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Big-O reference */}
      <GlassCard className="p-6">
        <h2 className="text-base font-bold text-white mb-4">Big-O Cheat Sheet</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'O(1)',      label: 'Constant', color: '#00ff88', width: '4%'  },
            { name: 'O(log n)', label: 'Logarithmic', color: '#00d4ff', width: '20%' },
            { name: 'O(n)',      label: 'Linear',   color: '#f59e0b', width: '40%' },
            { name: 'O(n log n)',label: 'Linearithmic', color: '#ff6b35', width: '60%' },
            { name: 'O(n²)',     label: 'Quadratic',color: '#ec4899', width: '80%' },
            { name: 'O(2ⁿ)',     label: 'Exponential', color: '#a855f7', width: '100%'},
          ].map(c => (
            <div key={c.name} className="flex flex-col gap-2">
              <div className="h-1.5 rounded-full bg-white/08">
                <div className="h-full rounded-full" style={{ width: c.width, background: c.color }} />
              </div>
              <span className="font-mono text-xs font-bold" style={{ color: c.color }}>{c.name}</span>
              <span className="text-[10px] text-white/40">{c.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
