"use client"

import React from "react"
import { BarChart3, Target, Zap } from "lucide-react"

const FeatureItem = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center">
    <div className="mb-6 rounded-xl bg-[#1c242e] p-6 transition-transform group-hover:scale-110">
      <Icon className="text-[#f57c00]" size={40} />
    </div>
    <h3 className="mb-3 text-2xl font-bold">{title}</h3>
    <p className="max-w-[280px] text-base leading-relaxed text-gray-500">
      {desc}
    </p>
  </div>
)

const Footer = () => {
  return (
    <footer className="border-t-2 border-gray-800/50 py-20">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-4 text-center md:grid-cols-3">
        <FeatureItem
          icon={Zap}
          title="Parties rapides"
          desc="Lancez une partie en quelques secondes"
        />
        <FeatureItem
          icon={BarChart3}
          title="Analyse après la partie"
          desc="Comprenez vos erreurs et progressez"
        />
        <FeatureItem
          icon={Target}
          title="Entraînement ciblé"
          desc="Perfectionnez vos tactiques et stratégies"
        />
      </div>
    </footer>
  )
}

export default Footer
