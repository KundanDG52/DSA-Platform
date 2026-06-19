import { useState, useRef, useCallback, useEffect } from 'react'

export interface AnimationControls<T> {
  steps: T[]
  currentStep: number
  isPlaying: boolean
  speed: number
  play: () => void
  pause: () => void
  reset: () => void
  stepForward: () => void
  stepBack: () => void
  setSpeed: (s: number) => void
  setSteps: (steps: T[]) => void
  goToStep: (n: number) => void
}

export function useAnimationControls<T>(initialSteps: T[] = []): AnimationControls<T> {
  const [steps, setStepsState] = useState<T[]>(initialSteps)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeedState] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const play = useCallback(() => {
    if (steps.length === 0) return
    setIsPlaying(true)
  }, [steps.length])

  const pause = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
  }, [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
    setCurrentStep(0)
  }, [])

  const stepForward = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const stepBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s)
  }, [])

  const setSteps = useCallback((newSteps: T[]) => {
    setStepsState(newSteps)
    setCurrentStep(0)
    setIsPlaying(false)
    clearTimer()
  }, [])

  const goToStep = useCallback((n: number) => {
    setCurrentStep(Math.max(0, Math.min(n, steps.length - 1)))
  }, [steps.length])

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const delay = Math.max(50, 800 / speed)
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            clearTimer()
            return prev
          }
          return prev + 1
        })
      }, delay)
    } else {
      clearTimer()
    }
    return clearTimer
  }, [isPlaying, speed, steps.length])

  return { steps, currentStep, isPlaying, speed, play, pause, reset, stepForward, stepBack, setSpeed, setSteps, goToStep }
}
