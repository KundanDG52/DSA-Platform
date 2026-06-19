import type { Topic, Achievement } from '../types'

export const TOPICS: Topic[] = [
  {
    id: 'arrays',
    name: 'Arrays',
    icon: '⬛',
    description: 'Sliding window, two pointers, prefix sums',
    path: '/arrays',
    color: '#00d4ff',
    glowClass: 'glow-arrays',
    difficulty: 1,
    estimatedMinutes: 45,
    subtopics: ['Insert/Delete', 'Sliding Window', 'Two Pointers', 'Prefix Sum', 'Two Sum'],
  },
  {
    id: 'linkedlist',
    name: 'Linked Lists',
    icon: '🔗',
    description: 'Nodes, pointers, Floyd\'s cycle detection',
    path: '/linkedlist',
    color: '#f59e0b',
    glowClass: 'glow-linked',
    difficulty: 2,
    estimatedMinutes: 40,
    subtopics: ['Singly', 'Doubly', 'Circular', 'Reverse', 'Cycle Detection'],
  },
  {
    id: 'trees',
    name: 'Trees',
    icon: '🌳',
    description: 'BST, AVL, traversals, tries',
    path: '/trees',
    color: '#00ff88',
    glowClass: 'glow-trees',
    difficulty: 3,
    estimatedMinutes: 60,
    subtopics: ['BST Insert', 'AVL Rotations', 'Traversals', 'Trie', 'Segment Tree'],
  },
  {
    id: 'graphs',
    name: 'Graphs',
    icon: '🕸️',
    description: 'BFS, DFS, Dijkstra, topological sort',
    path: '/graphs',
    color: '#ff6b35',
    glowClass: 'glow-graphs',
    difficulty: 4,
    estimatedMinutes: 75,
    subtopics: ['BFS', 'DFS', 'Dijkstra', 'Topo Sort', 'Components'],
  },
  {
    id: 'sorting',
    name: 'Sorting',
    icon: '📊',
    description: 'Bubble, merge, quick, heap sort races',
    path: '/sorting',
    color: '#ec4899',
    glowClass: 'glow-sorting',
    difficulty: 2,
    estimatedMinutes: 50,
    subtopics: ['Bubble', 'Merge', 'Quick', 'Heap', 'Comparison'],
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    icon: '🧮',
    description: 'Memoization, tabulation, optimal substructure',
    path: '/dp',
    color: '#a855f7',
    glowClass: 'glow-dp',
    difficulty: 5,
    estimatedMinutes: 90,
    subtopics: ['Fibonacci', 'LCS', 'Knapsack', 'Coin Change', 'LIS'],
  },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step',    name: 'First Step',      description: 'Complete your first module', icon: '🚀', earned: false, xpReward: 50,  color: '#00d4ff' },
  { id: 'array_master',  name: 'Array Ace',        description: 'Master all array operations',  icon: '⚡', earned: false, xpReward: 100, color: '#00d4ff' },
  { id: 'tree_whisperer',name: 'Tree Whisperer',   description: 'Build a BST with 10+ nodes',   icon: '🌳', earned: false, xpReward: 150, color: '#00ff88' },
  { id: 'graph_guru',    name: 'Graph Guru',       description: 'Run all graph algorithms',      icon: '🕸️', earned: false, xpReward: 200, color: '#ff6b35' },
  { id: 'sort_master',   name: 'Sort Master',      description: 'Compare all sorting algorithms',icon: '🏆', earned: false, xpReward: 150, color: '#ec4899' },
  { id: 'dp_wizard',     name: 'DP Wizard',        description: 'Solve all DP problems',         icon: '🧙', earned: false, xpReward: 250, color: '#a855f7' },
  { id: 'streak_7',      name: '7-Day Streak',     description: 'Visit 7 days in a row',         icon: '🔥', earned: false, xpReward: 100, color: '#f59e0b' },
  { id: 'perfectionist', name: 'Perfectionist',    description: 'Complete every module',         icon: '💎', earned: false, xpReward: 500, color: '#ec4899' },
]

export const LEADERBOARD = [
  { rank: 1, name: 'Arjun K.',    xp: 4850, level: 12, avatar: 'A', color: '#00d4ff' },
  { rank: 2, name: 'Sarah M.',    xp: 4200, level: 11, avatar: 'S', color: '#00ff88' },
  { rank: 3, name: 'Wei C.',      xp: 3900, level: 10, avatar: 'W', color: '#a855f7' },
  { rank: 4, name: 'Alex R.',     xp: 3400, level: 9,  avatar: 'A', color: '#ff6b35' },
  { rank: 5, name: 'Priya N.',    xp: 2800, level: 8,  avatar: 'P', color: '#ec4899' },
]

export const DAILY_CHALLENGES = [
  { id: 'dc1', title: 'Find the Duplicate',      topic: 'Arrays',  difficulty: 2, xpReward: 75  },
  { id: 'dc2', title: 'Reverse a Linked List',   topic: 'Linked Lists', difficulty: 1, xpReward: 50  },
  { id: 'dc3', title: 'Validate BST',            topic: 'Trees',   difficulty: 3, xpReward: 100 },
  { id: 'dc4', title: 'Number of Islands',       topic: 'Graphs',  difficulty: 3, xpReward: 125 },
  { id: 'dc5', title: 'Climbing Stairs',         topic: 'DP',      difficulty: 2, xpReward: 75  },
]

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1500, 2400, 3600, 5000, 7000, 10000]

export function getLevelFromXP(xp: number): number {
  return LEVEL_THRESHOLDS.findLastIndex(t => xp >= t) + 1
}

export function getXPToNextLevel(xp: number): { current: number; needed: number; percent: number } {
  const level = getLevelFromXP(xp)
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const current = xp - currentThreshold
  const needed = nextThreshold - currentThreshold
  return { current, needed, percent: Math.min(100, (current / needed) * 100) }
}

export const LEVEL_TITLES = [
  'Novice', 'Apprentice', 'Learner', 'Practitioner', 'Intermediate',
  'Advanced', 'Expert', 'Master', 'Grandmaster', 'Legend',
]
