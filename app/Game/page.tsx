"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Chess } from "chess.js"
import { Crown } from "lucide-react"

import { GameSettings, loadSettings } from "@/lib/gameSetting"
import GameSidebar from "@/components/Game/GameSidebar"
import ChessArea from "@/components/Game/chessArea"
import Navbar from "@/components/NavBar"

export default function GamePage() {
  const router = useRouter()
  const [game, setGame] = useState(new Chess())
  const [turn, setTurn] = useState("w")
  const [settings, setSettings] = useState<GameSettings | null>(null)

  useEffect(() => {
    const s = loadSettings()
    if (!s) {
      router.replace("/")
      return
    }
    setSettings(s)
  }, [router])

  const resetGame = () => setGame(new Chess())

  if (!settings) return null
  const playerColor = settings.color === "Blancs" ? "w" : "b"

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-[#0f141a] p-4 text-white lg:p-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ChessArea
              playerColor={playerColor}
              difficulty={settings.difficulty}
            />
          </div>
          <div className="lg:col-span-4">
            <GameSidebar
              difficulty={settings.difficulty}
              color={settings.color}
              turn={turn}
              onReset={resetGame}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
