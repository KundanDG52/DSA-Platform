import { Play, Pause, SkipBack, SkipForward, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import type { AnimationControls } from '../../hooks/useAnimationControls'

interface StepControlsProps<T> {
  controls: AnimationControls<T>
  description?: string
  color?: string
}

export function StepControls<T>({ controls, description, color = '#00d4ff' }: StepControlsProps<T>) {
  const { currentStep, steps, isPlaying, speed, play, pause, reset, stepBack, stepForward, setSpeed } = controls
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0

  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer" onClick={e => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        controls.goToStep(Math.round(x * (steps.length - 1)))
      }}>
        <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${progress}%`, background: color, boxShadow: `0 0 8px ${color}80` }} />
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-white/70 font-mono bg-bg/60 rounded-lg px-3 py-2 min-h-[38px] border border-white/5">
          {description || 'Ready'}
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={reset} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Reset">
          <RefreshCw size={14} className="text-white/60" />
        </button>
        <button onClick={stepBack} disabled={currentStep === 0} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30" title="Step back">
          <ChevronLeft size={14} className="text-white/60" />
        </button>
        <button
          onClick={isPlaying ? pause : play}
          disabled={steps.length === 0}
          className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-30"
          style={{ background: color, color: '#0a0a0f', boxShadow: `0 0 16px ${color}50` }}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={stepForward} disabled={currentStep >= steps.length - 1} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30" title="Step forward">
          <ChevronRight size={14} className="text-white/60" />
        </button>
        <button onClick={() => { reset(); setTimeout(() => controls.goToStep(steps.length - 1), 50) }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Skip to end">
          <SkipForward size={14} className="text-white/60" />
        </button>

        {/* Speed */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-white/40">Speed</span>
          <input
            type="range" min="0.25" max="4" step="0.25" value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="w-20 accent-current"
            style={{ accentColor: color }}
          />
          <span className="text-xs font-mono text-white/60 w-8">{speed}x</span>
        </div>

        {/* Step counter */}
        <span className="text-xs text-white/30 font-mono">
          {steps.length > 0 ? `${currentStep + 1}/${steps.length}` : '—'}
        </span>
      </div>
    </div>
  )
}
