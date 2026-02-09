"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Difficulty, PieceColorChoice, saveSettings } from "@/lib/gameSetting"

import { Button } from "../ui/button"

export default function ConfigCard() {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<Difficulty>("Moyen")
  const [color, setColor] = useState<PieceColorChoice>("Blancs")

  const handlePlay = () => {
    saveSettings({ difficulty, color })
    router.push("/Game")
  }

  return (
    <div className="text-left">
      <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
        Affrontez <span className="text-[#f57c00]">l IA</span> stratégique
      </h1>
      <p className="mb-10 text-xl text-gray-400">
        Testez vos compétences tactiques contre une intelligence artificielle
        évolutive.
      </p>

      <div className="rounded-2xl border border-white/5 bg-[#161d26] p-8 shadow-2xl">
        <div className="space-y-8">
          <div>
            <label className="mb-4 block text-xs font-black uppercase tracking-widest text-gray-500">
              Difficulté
            </label>
            <div className="flex gap-2">
              {["Facile", "Moyen", "Difficile"].map((lvl) => (
                <Button
                  key={lvl}
                  active={difficulty === lvl}
                  onClick={() => setDifficulty(lvl as Difficulty)}
                  className="flex-1"
                >
                  {lvl}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-4 block text-xs font-black uppercase tracking-widest text-gray-500">
              Votre Camp
            </label>
            <div className="flex gap-2">
              {["Blancs", "Noirs"].map((c) => (
                <Button
                  key={c}
                  active={color === c}
                  onClick={() => setColor(c as PieceColorChoice)}
                  className="flex-1"
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handlePlay}
            className="w-full py-6 text-lg"
          >
            Lancer la partie
          </Button>
        </div>
      </div>
    </div>
  )
}
