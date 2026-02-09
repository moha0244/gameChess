export type Difficulty = "Facile" | "Moyen" | "Difficile"
export type PieceColorChoice = "Blancs" | "Noirs"

export interface GameSettings {
  difficulty: Difficulty
  color: PieceColorChoice
}

const STORAGE_KEY = "chess:settings"

export function saveSettings(settings: GameSettings) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function loadSettings(): GameSettings | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)

    const difficulty = parsed.difficulty as Difficulty
    const color = parsed.color as PieceColorChoice

    const isDifficultyValid = ["Facile", "Moyen", "Difficile"].includes(
      difficulty
    )
    const isColorValid = ["Blancs", "Noirs"].includes(color)

    if (isDifficultyValid && isColorValid) {
      return { difficulty, color }
    }

    return null
  } catch {
    return null
  }
}

export function clearSettings() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
