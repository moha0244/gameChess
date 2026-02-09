import Navbar from "@/components/NavBar"
import ConfigCard from "@/components/home/configCard"
import FeatureGrid from "@/components/home/featureGrid"
import GameTipsBanner from "@/components/home/gameTipsBanner"
import Showcase from "@/components/home/showCase"
import StepGuide from "@/components/home/stepGuide"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f141a] text-white selection:bg-orange-500/30">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-32">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:items-center xl:gap-32">
          <ConfigCard />
          <Showcase />
        </div>
      </main>

      <GameTipsBanner />
      <StepGuide />
      <FeatureGrid />
    </div>
  )
}
