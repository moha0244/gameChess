"use client"

import React, { useEffect, useMemo } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function StatusModal({
  open,
  type, // "check" | "checkmate" | "draw"
  sideInCheck,
  winner,
  onClose,
  onRestart,
}) {
  useEffect(() => {
    if (!open) return

    if (type === "check") {
      const t = setTimeout(() => onClose?.(), 2000)
      return () => clearTimeout(t)
    }

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, type, onClose])

  const sideLabel = (c) => (c === "w" ? "Blancs" : c === "b" ? "Noirs" : "")

  const content = useMemo(() => {
    const getContent = () => {
      if (type === "check") {
        return {
          variant: "toast",
          title: null,
          message: `${sideLabel(sideInCheck)} sont en échec !`,
          showActions: false,
        }
      }

      if (type === "draw") {
        return {
          variant: "modal",
          title: "Partie nulle",
          message: "Aucun coup légal : pat ou autre condition de nul.",
          showActions: true,
        }
      }

      return {
        variant: "modal",
        title: "Échec et mat !",
        message: winner
          ? `${sideLabel(winner)} gagnent la partie.`
          : "Fin de partie.",
        showActions: true,
      }
    }

    return getContent()
  }, [type, sideInCheck, winner])

  if (!open) return null

  // ====== VARIANTE 1 : TOAST (ÉCHEC) ======
  if (content.variant === "toast") {
    return (
      <div className="fixed bottom-10 left-1/2 z-[9999] -translate-x-1/2 min-w-[200px]">
        <div className="flex items-center gap-3 rounded-xl border-2 border-orange-500 bg-[#161d26] px-5 py-3 shadow-[0_0_20px_rgba(245,124,0,0.4)] animate-bounce">
          <AlertTriangle className="text-orange-400" size={20} />
          <span className="text-lg font-bold text-white">
            {content.message}
          </span>
        </div>
      </div>
    )
  }

  // ====== VARIANTE 2 : MODAL (MAT / NUL) ======
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative w-[92%] max-w-md rounded-2xl border border-gray-800 bg-[#161d26] p-6 shadow-2xl">
        <h2 className="text-xl font-extrabold tracking-tight text-[#f57c00]">
          {content.title}
        </h2>

        <p className="mt-2 text-sm text-gray-300">{content.message}</p>

        {content.showActions && (
          <div className="mt-6 space-y-3">
            <button
              onClick={onRestart}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#f57c00] px-4 py-3 font-bold text-white transition-all hover:bg-[#ff8f00] active:scale-95"
            >
              Recommencer une nouvelle partie
            </button>

            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#242c38] px-4 py-3 text-center font-bold text-gray-300 transition-all hover:bg-[#2d3745]"
            >
              Retour au menu
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
