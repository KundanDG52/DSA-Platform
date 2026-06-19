import { HeroSection } from '../components/home/HeroSection'
import { XPBar } from '../components/home/XPBar'
import { TopicGrid } from '../components/home/TopicGrid'
import { DailyChallenge } from '../components/home/DailyChallenge'

export function Home() {
  return (
    <div>
      <HeroSection />
      <XPBar />
      <TopicGrid />
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <DailyChallenge />
      </div>
    </div>
  )
}
