import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from './Navbar'
import { useStore } from '../../store'

interface LayoutProps {
  children: ReactNode
}

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const updateStreak = useStore(s => s.updateStreak)

  useEffect(() => {
    updateStreak()
  }, [updateStreak])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1 pt-14"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
