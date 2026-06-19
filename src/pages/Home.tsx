import { HeroSection } from '../components/home/HeroSection'
import { XPBar } from '../components/home/XPBar'
import { TopicGrid } from '../components/home/TopicGrid'
import { DailyChallenge } from '../components/home/DailyChallenge'
import { Leaderboard } from '../components/home/Leaderboard'

export function Home() {
  return (
    <div>
      <HeroSection />
      <XPBar />
      <TopicGrid />
      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyChallenge />
        <Leaderboard />
      </div>
    </div>
  )
}
