export default function Showcase() {
  return (
    <div className="relative mx-auto hidden w-full max-w-2xl lg:block">
      <div className="absolute -inset-10 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1c242e] shadow-2xl transition-all duration-500 hover:scale-[1.05] lg:scale-110">
        <img
          src="/chess-picture.png"
          alt="Échiquier de jeu"
          className="h-auto min-h-[450px] w-full object-cover"
        />

        <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-full border border-white/5 bg-black/60 px-4 py-2 text-sm font-medium backdrop-blur-md">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500 shadow-[0_0_10px_#22c55e]" />
          <span className="text-gray-200">IA en ligne — Prête à jouer</span>
        </div>
      </div>
    </div>
  )
}
