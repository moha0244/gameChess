"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

import { Difficulty, PieceColorChoice, saveSettings } from "@/lib/gameSetting"

import { Button } from "../ui/button"

const Hero = () => {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<Difficulty>("Difficile")
  const [color, setColor] = useState<PieceColorChoice>("Blancs")

  const handlePlay = () => {
    saveSettings({ difficulty, color })
    router.push("/Game")
  }

  return (
    <section className="px-4 pb-16 pt-32 text-center">
      {/* ... le reste identique ... */}

      <div className="mx-auto max-w-3xl rounded-xl border border-orange-900/20 bg-[#161d26] p-12 shadow-2xl">
        <div className="mb-6 text-left">
          <label className="mb-3 block text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Niveau de difficulté
          </label>
          <div className="flex gap-2">
            {(["Facile", "Moyen", "Difficile"] as Difficulty[]).map((lvl) => (
              <Button
                key={lvl}
                active={difficulty === lvl}
                onClick={() => setDifficulty(lvl)}
              >
                {lvl}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8 text-left">
          <label className="mb-3 block text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Couleur des pièces
          </label>
          <div className="flex gap-2">
            {(["Blancs", "Noirs"] as PieceColorChoice[]).map((c) => (
              <Button key={c} active={color === c} onClick={() => setColor(c)}>
                {c}
              </Button>
            ))}
          </div>
        </div>

        <Button variant="primary" onClick={handlePlay}>
          Jouer contre l IA
        </Button>
      </div>
    </section>
  )
}

export default Hero
