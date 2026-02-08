"use client"

import React from "react"
import { Crown } from "lucide-react"

const Navbar = () => {
  return (
    <nav className="flex items-center border-b-2 border-gray-800 bg-[#0f141a] px-8 py-4">
      <div className="flex items-center gap-2 text-[#f57c00]">
        <Crown size={24} fill="currentColor" />
        <span className="text-3xl font-bold tracking-tight text-white">
          Échecs Stratégiques
        </span>
      </div>
    </nav>
  )
}

export default Navbar
