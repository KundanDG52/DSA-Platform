import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { LinkedListViz } from '../components/linkedlist/LinkedListViz'
import { GlassCard } from '../components/shared/GlassCard'
import { useStore } from '../store'

export function LinkedList() {
  const { completeModule, addXP } = useStore()
  useEffect(() => { addXP(10); completeModule('linkedlist') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#f59e0b15', border: '1px solid #f59e0b30' }}>🔗</div>
          <div>
            <h1 className="text-2xl font-black text-white">Linked Lists</h1>
            <p className="text-white/40 text-sm">Nodes • Pointers • Floyd's Cycle Detection</p>
          </div>
        </div>
      </motion.div>

      <GlassCard delay={0.1} className="p-6">
        <h2 className="text-base font-bold text-linkedlist mb-1">Interactive Linked List</h2>
        <p className="text-sm text-white/40 mb-4">
          Click a node to delete it. Use the controls to append, prepend, or reverse.
          Run Floyd's algorithm to detect cycles with the tortoise &amp; hare pointers.
        </p>
        <LinkedListViz />
      </GlassCard>

      <GlassCard delay={0.2} className="p-6">
        <h2 className="text-base font-bold text-white mb-4">Operations Complexity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-white/40 font-medium">Operation</th>
                <th className="text-center py-2 text-trees font-medium">Singly</th>
                <th className="text-center py-2 text-linkedlist font-medium">Doubly</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: 'Access by index',  singly: 'O(n)', doubly: 'O(n)'  },
                { op: 'Search',           singly: 'O(n)', doubly: 'O(n)'  },
                { op: 'Insert at head',   singly: 'O(1)', doubly: 'O(1)'  },
                { op: 'Insert at tail',   singly: 'O(n)', doubly: 'O(1)*' },
                { op: 'Insert in middle', singly: 'O(n)', doubly: 'O(n)'  },
                { op: 'Delete at head',   singly: 'O(1)', doubly: 'O(1)'  },
                { op: 'Delete at tail',   singly: 'O(n)', doubly: 'O(1)*' },
                { op: 'Reverse',          singly: 'O(n)', doubly: 'O(n)'  },
              ].map(r => (
                <tr key={r.op} className="border-b border-white/5">
                  <td className="py-2.5 text-white/70">{r.op}</td>
                  <td className="py-2.5 text-center font-mono text-trees text-xs">{r.singly}</td>
                  <td className="py-2.5 text-center font-mono text-linkedlist text-xs">{r.doubly}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-white/30 mt-2">* With tail pointer</p>
        </div>
      </GlassCard>

      <GlassCard delay={0.3} className="p-6">
        <h2 className="text-base font-bold text-white mb-3">Floyd's Cycle Detection</h2>
        <p className="text-sm text-white/50 mb-3">
          Use two pointers: <span className="text-graphs font-semibold">slow</span> (moves 1 step) and{' '}
          <span className="text-arrays font-semibold">fast</span> (moves 2 steps).
          If there's a cycle, they will eventually meet. Time O(n), Space O(1).
        </p>
        <pre className="code-block text-xs text-white/70">{`def hasCycle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next        # 1 step
        fast = fast.next.next   # 2 steps
        if slow == fast:
            return True         # Cycle detected!
    return False`}</pre>
      </GlassCard>
    </div>
  )
}
