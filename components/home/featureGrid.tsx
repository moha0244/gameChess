import { BarChart3, Target, Zap } from "lucide-react"

export default function FeatureGrid() {
  const features = [
    {
      icon: Zap,
      title: "Parties rapides",
      desc: "Pas de chargement, jouez instantanément.",
    },
    {
      icon: BarChart3,
      title: "Analyse locale",
      desc: "Calculs effectués sur votre navigateur.",
    },
    {
      icon: Target,
      title: "Entraînement",
      desc: "Parfait pour tester de nouvelles ouvertures.",
    },
  ]

  return (
    <section className="bg-[#161d26]/30 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 md:grid-cols-3">
        {features.map((f, i) => (
          <div key={i} className="group flex flex-col items-center text-center">
            <div className="mb-6 rounded-2xl bg-[#1c242e] p-6 text-[#f57c00] transition-all group-hover:bg-[#f57c00] group-hover:text-white">
              <f.icon size={32} />
            </div>
            <h3 className="mb-3 text-xl font-bold">{f.title}</h3>
            <p className="text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
