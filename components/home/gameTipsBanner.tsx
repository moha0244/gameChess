import { Lightbulb, ShieldCheck, Zap } from "lucide-react"

export default function GameTipsBanner() {
  const tips = [
    {
      icon: <Zap className="text-[#f57c00]" size={24} />,
      title: "Contrôlez le centre",
      desc: "Occupez les cases du centre pour dominer l'espace.",
    },
    {
      icon: <ShieldCheck className="text-[#f57c00]" size={24} />,
      title: "Sécurité du Roi",
      desc: "Ne tardez pas à roquer pour mettre votre Roi à l'abri.",
    },
    {
      icon: <Lightbulb className="text-[#f57c00]" size={24} />,
      title: "Évitez le Pat",
      desc: "En fin de partie, vérifiez que l'adversaire a toujours un coup légal.",
    },
  ]

  return (
    <div className="border-y border-white/5 bg-[#111821] py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="mt-1 shrink-0 rounded-lg bg-orange-500/10 p-2">
              {tip.icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-200">{tip.title}</h4>
              <p className="text-sm leading-relaxed text-gray-500">
                {tip.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
