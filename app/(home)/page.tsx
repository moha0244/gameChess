import Navbar from "@/components/NavBar"
import Footer from "@/components/home/Footer"
import Hero from "@/components/home/Hero"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f141a] text-white selection:bg-orange-500/30">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  )
}
