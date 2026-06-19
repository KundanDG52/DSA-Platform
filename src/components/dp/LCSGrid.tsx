import { useState } from 'react'
import { motion } from 'framer-motion'
import { lcsSteps } from '../../algorithms/dp'
import { useAnimationControls } from '../../hooks/useAnimationControls'
import { StepControls } from '../shared/StepControls'
import type { LCSStep } from '../../algorithms/dp'

export function LCSGrid() {
  const [s1, setS1] = useState('ABCBDAB')
  const [s2, setS2] = useState('BDCAB')
  const controls = useAnimationControls<LCSStep>()

  const current = controls.steps[controls.currentStep]

  function run() {
    controls.setSteps(lcsSteps(s1, s2))
    controls.play()
  }

  const dp = current?.dp
  const ci = current?.i ?? -1
  const cj = current?.j ?? -1

  return (
    <div className="flex flex-col gap-4">
      <div className="viz-container overflow-auto">
        <h4 className="text-sm font-semibold text-dp mb-3">
          Longest Common Subsequence
          {current?.lcs && <span className="ml-2 text-trees">LCS = "{current.lcs}"</span>}
        </h4>

        {dp && (
          <div className="overflow-auto">
            <table className="border-separate border-spacing-1 text-xs font-mono">
              <thead>
                <tr>
                  <td className="w-8 h-8" />
                  <td className="w-8 h-8 text-center text-white/30">ε</td>
                  {s2.split('').map((c, j) => (
                    <td key={j} className="w-8 h-8 text-center font-bold" style={{ color: '#a855f7' }}>{c}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row, i) => (
                  <tr key={i}>
                    <td className="w-8 h-8 text-center font-bold" style={{ color: '#a855f7' }}>
                      {i === 0 ? 'ε' : s1[i - 1]}
                    </td>
                    {row.map((val, j) => {
                      const isActive = i === ci && j === cj
                      const isPath = i <= ci && j <= cj && val > 0
                      return (
                        <motion.td
                          key={j}
                          initial={false}
                          animate={{
                            background: isActive ? '#a855f7' : isPath && val > 0 ? '#a855f715' : '#13131a',
                          }}
                          transition={{ duration: 0.2 }}
                          className="w-8 h-8 text-center rounded-lg border"
                          style={{
                            borderColor: isActive ? '#a855f7' : 'rgba(255,255,255,0.06)',
                            color: isActive ? '#0a0a0f' : val > 0 ? '#a855f7' : 'rgba(255,255,255,0.3)',
                            fontWeight: isActive || val > 0 ? '700' : '400',
                          }}
                        >
                          {val}
                        </motion.td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/40">String 1</label>
            <input value={s1} onChange={e => setS1(e.target.value.toUpperCase().slice(0, 10))}
              className="bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:border-dp/50 outline-none w-28"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/40">String 2</label>
            <input value={s2} onChange={e => setS2(e.target.value.toUpperCase().slice(0, 10))}
              className="bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:border-dp/50 outline-none w-28"
            />
          </div>
          <button onClick={run}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-bg"
            style={{ background: '#a855f7', boxShadow: '0 0 16px #a855f750' }}
          >Visualize LCS</button>
        </div>
        <StepControls controls={controls} description={current?.description} color="#a855f7" />
      </div>
    </div>
  )
}
