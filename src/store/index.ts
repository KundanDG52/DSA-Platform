import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserState, Achievement, TopicProgress } from '../types'
import { ACHIEVEMENTS, getLevelFromXP } from '../utils/constants'

interface AppStore extends UserState {
  addXP: (amount: number, source?: string) => void
  completeModule: (id: string) => void
  completeProblem: (id: string) => void
  checkAchievement: (id: string) => void
  updateStreak: () => void
  resetProgress: () => void
}

const initialState: UserState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastVisitDate: '',
  topicProgress: {},
  achievements: ACHIEVEMENTS.map(a => ({ ...a, earned: false })),
  completedProblems: [],
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addXP: (amount, _source) => {
        set(s => {
          const newXP = s.xp + amount
          return { xp: newXP, level: getLevelFromXP(newXP) }
        })
      },

      completeModule: (id) => {
        set(s => {
          const existing = s.topicProgress[id]
          if (existing?.completed) return s
          const progress: TopicProgress = { id, completed: true, xpEarned: 100, lastVisited: Date.now() }
          const newXP = s.xp + 100
          return {
            xp: newXP,
            level: getLevelFromXP(newXP),
            topicProgress: { ...s.topicProgress, [id]: progress },
          }
        })
        get().checkAchievement('first_step')
        const allModules = ['arrays', 'linkedlist', 'trees', 'graphs', 'sorting', 'dp']
        const prog = get().topicProgress
        if (allModules.every(m => prog[m]?.completed)) get().checkAchievement('perfectionist')
      },

      completeProblem: (id) => {
        set(s => {
          if (s.completedProblems.includes(id)) return s
          const newXP = s.xp + 50
          return {
            xp: newXP,
            level: getLevelFromXP(newXP),
            completedProblems: [...s.completedProblems, id],
          }
        })
      },

      checkAchievement: (id) => {
        set(s => {
          const achievements = s.achievements.map(a =>
            a.id === id && !a.earned ? { ...a, earned: true, earnedAt: Date.now() } : a
          )
          return { achievements }
        })
      },

      updateStreak: () => {
        const today = new Date().toDateString()
        const last = get().lastVisitDate
        if (last === today) return
        const yesterday = new Date(Date.now() - 86_400_000).toDateString()
        const newStreak = last === yesterday ? get().streak + 1 : 1
        set({ lastVisitDate: today, streak: newStreak })
        if (newStreak >= 7) get().checkAchievement('streak_7')
      },

      resetProgress: () => set({ ...initialState }),
    }),
    {
      name: 'dsa-platform-v1',
      partialize: s => ({
        xp: s.xp,
        level: s.level,
        streak: s.streak,
        lastVisitDate: s.lastVisitDate,
        topicProgress: s.topicProgress,
        achievements: s.achievements,
        completedProblems: s.completedProblems,
      }),
    }
  )
)
