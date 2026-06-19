# DSA Platform

An interactive Data Structures & Algorithms learning platform with step-by-step visualizations, a built-in code playground, and a gamified XP/leveling system.

## Features

- **Visual algorithm walkthroughs** — Arrays, Sorting, Trees, Graphs, Linked Lists, Dynamic Programming
- **Code Playground** — Monaco-powered in-browser editor with live execution
- **Gamification** — XP rewards, level progression, and daily challenges
- **Smooth animations** — Framer Motion transitions throughout

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Visualizations | D3.js |
| Editor | Monaco Editor |
| State | Zustand |
| Routing | React Router v6 |
| Testing | Vitest + Testing Library |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Production build
npm run build
```

## Project Structure

```
src/
├── algorithms/       # Algorithm logic + unit tests
├── components/
│   ├── arrays/       # Array visualizers
│   ├── dp/           # Dynamic programming visualizers
│   ├── graphs/       # Graph canvas
│   ├── home/         # Home page sections
│   ├── layout/       # Navbar, Layout wrapper
│   ├── linkedlist/   # Linked list visualizer
│   ├── shared/       # Reusable UI (GlassCard, Badge, etc.)
│   ├── sorting/      # Sorting race visualizer
│   └── trees/        # BST visualizer
├── hooks/            # Custom React hooks
├── pages/            # Route-level page components
├── store/            # Zustand global state
├── types/            # Shared TypeScript types
└── utils/            # Constants and helpers
```

## Deployment

Deployed on [Vercel](https://vercel.com). Every push to `main` triggers a production build via `tsc && vite build`.
