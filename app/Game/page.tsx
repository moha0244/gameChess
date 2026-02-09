"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Chess } from "chess.js"
import { Crown } from "lucide-react"

import { GameSettings, loadSettings } from "@/lib/gameSetting"
import GameSidebar from "@/components/Game/GameSidebar"
import ChessArea from "@/components/Game/chessArea"
import Navbar from "@/components/NavBar"

export default function GamePage() {
  const router = useRouter()
  const chessAreaRef = useRef(null)
  const [game, setGame] = useState(new Chess())
  const [turn, setTurn] = useState("w")
  const [gameKey, setGameKey] = useState(0)
  const [settings, setSettings] = useState<GameSettings | null>(null)

  useEffect(() => {
    const s = loadSettings()
    if (!s) {
      router.replace("/")
      return
    }
    setSettings(s)
  }, [router])

  const handleReset = () => {
    setGameKey((prev) => prev + 1)
  }

  if (!settings) return null
  const playerColor = settings.color === "Blancs" ? "w" : "b"

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#0f141a] p-4 text-white lg:p-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 ">
            <ChessArea
              playerColor={playerColor}
              difficulty={settings.difficulty}
              key={gameKey}
            />
          </div>

          <div className="h-full lg:col-span-5">
            <GameSidebar
              difficulty={settings.difficulty}
              color={settings.color}
              turn={turn}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
