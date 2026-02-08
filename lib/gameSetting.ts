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
    const parsed = JSON.parse(raw) as Partial<GameSettings>
    const difficultyOk =
      parsed.difficulty === "Facile" ||
      parsed.difficulty === "Moyen" ||
      parsed.difficulty === "Difficile"
    const colorOk = parsed.color === "Blancs" || parsed.color === "Noirs"

    if (!difficultyOk || !colorOk) return null
    return { difficulty: parsed.difficulty, color: parsed.color }
  } catch {
    return null
  }
}

export function clearSettings() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
