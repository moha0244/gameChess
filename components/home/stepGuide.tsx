export default function StepGuide() {
  const steps = [
    {
      id: 1,
      title: "Paramétrez",
      desc: "Choisissez votre camp et la difficulté.",
    },
    {
      id: 2,
      title: "Affrontez",
      desc: "Jouez contre notre IA établi à l'aide d'une methode minimax ",
    },
    { id: 3, title: "Progressez", desc: "Analysez vos coups et gagnez." },
  ]

  return (
    <section className="py-24">
      <h2 className="mb-16 text-center text-3xl font-bold">
        Comment ça <span className="text-[#f57c00]">marche</span> ?
      </h2>
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 md:flex-row">
        {steps.map((s) => (
          <div
            key={s.id}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f57c00] text-xl font-black text-[#f57c00]">
              {s.id}
            </div>
            <h3 className="mb-2 text-xl font-bold">{s.title}</h3>
            <p className="text-gray-500">{s.desc}</p>
            {s.id < 3 && (
              <div className="absolute right-[-20%] top-6 hidden h-[2px] w-[40%] bg-white/5 md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
