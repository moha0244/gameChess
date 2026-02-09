import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"

const GameSidebar = ({ difficulty, color, turn, onReset }) => (
  <div className="flex h-full w-[560px] flex-col gap-6">
    <div className="rounded-xl border border-gray-800 bg-[#161d26] p-6 shadow-xl">
      <h2 className="mb-6 text-lg font-bold tracking-wide text-[#f57c00]">
        Partie en cours
      </h2>

      <div className="mb-8 space-y-4 text-lg">
        <div className="flex justify-between border-b border-gray-800 pb-3">
          <span className="font-medium text-gray-500">Difficulté</span>
          <span className="font-semibold text-gray-200">{difficulty}</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-3">
          <span className="font-medium text-gray-500">Vos pièces</span>
          <span className="font-semibold text-gray-200">{color}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="font-medium text-gray-500">Tour</span>
          <span className="font-semibold text-gray-200">
            {turn === "w" ? "Vous" : "IA"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onReset}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#f57c00] px-4 py-3 font-bold text-white transition-all hover:bg-[#ff8f00] active:scale-95"
        >
          <RotateCcw size={18} /> Nouvelle partie
        </button>
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#242c38] px-4 py-3 text-center font-bold text-gray-300 transition-all hover:bg-[#2d3745]"
        >
          <ArrowLeft size={18} /> Retour à l accueil
        </Link>
      </div>
    </div>

    <div className="rounded-xl border border-gray-800 bg-[#161d26] p-6">
      <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-gray-300">
        Instructions
      </h3>
      <ul className="space-y-3 text-lg leading-relaxed text-gray-500">
        <li>• Cliquez sur une pièce pour la sélectionner</li>
        <li>• Cliquez sur une case pour déplacer</li>
        <li>• L IA joue automatiquement après vous</li>
      </ul>
    </div>
  </div>
)

export default GameSidebar
