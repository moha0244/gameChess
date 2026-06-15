import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Chess } from "chess.js"

import { useStockfish } from "@/hooks/use-stockfish"

const PIECES = {
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
  k: "♚",
  P: "♟",
  N: "♞",
  B: "♝",
  R: "♜",
  Q: "♛",
  K: "♚",
}

const PIECE_VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 }

// Compat chess.js
const isCheck = (g) =>
  (typeof g.isCheck === "function" && g.isCheck()) ||
  (typeof g.inCheck === "function" && g.inCheck()) ||
  (typeof g.in_check === "function" && g.in_check()) ||
  false

const isCheckmate = (g) =>
  (typeof g.isCheckmate === "function" && g.isCheckmate()) ||
  (typeof g.inCheckmate === "function" && g.inCheckmate()) ||
  (typeof g.in_checkmate === "function" && g.in_checkmate()) ||
  false

const isGameOver = (g) =>
  (typeof g.isGameOver === "function" && g.isGameOver()) ||
  (typeof g.game_over === "function" && g.game_over()) ||
  false

// Évaluation matérielle + mobilité, du point de vue de l'IA.
function evaluateBoard(g, aiColor) {
  const board = g.board()
  let score = 0

  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue
      const val = PIECE_VALUE[piece.type] ?? 0
      score += piece.color === aiColor ? val : -val
    }
  }

  const mobility = g.moves().length
  score += g.turn() === aiColor ? mobility : -mobility

  return score
}

// Tri des coups : captures (MVV-LVA) puis promotions d'abord. Un bon ordre
// fait élaguer l'alpha-beta beaucoup plus tôt -> recherche bien plus rapide.
function moveOrderScore(m) {
  let s = 0
  if (m.captured) {
    s +=
      1000 + (PIECE_VALUE[m.captured] ?? 0) - (PIECE_VALUE[m.piece] ?? 0) / 10
  }
  if (m.promotion) s += 800
  return s
}

function orderedMoves(g) {
  const moves = g.moves({ verbose: true })
  moves.sort((a, b) => moveOrderScore(b) - moveOrderScore(a))
  return moves
}

// Alpha-beta unique
function searchAB(g, depth, alpha, beta, maximizing, aiColor) {
  if (depth === 0 || isGameOver(g)) {
    return { score: evaluateBoard(g, aiColor), move: null }
  }

  const moves = orderedMoves(g)
  let bestMove = null

  if (maximizing) {
    let bestScore = -Infinity
    for (const m of moves) {
      g.move(m)
      const { score } = searchAB(g, depth - 1, alpha, beta, false, aiColor)
      g.undo()
      if (score > bestScore) {
        bestScore = score
        bestMove = m
      }
      alpha = Math.max(alpha, bestScore)
      if (beta <= alpha) break
    }
    return { score: bestScore, move: bestMove }
  } else {
    let bestScore = Infinity
    for (const m of moves) {
      g.move(m)
      const { score } = searchAB(g, depth - 1, alpha, beta, true, aiColor)
      g.undo()
      if (score < bestScore) {
        bestScore = score
        bestMove = m
      }
      beta = Math.min(beta, bestScore)
      if (beta <= alpha) break
    }
    return { score: bestScore, move: bestMove }
  }
}

export default function ChessGame({ playerColor, difficulty, children }) {
  const [game, setGame] = useState(() => new Chess())
  const gameRef = useRef(game)
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedSquare, setSelectedSquare] = useState(null)
  const [validMoves, setValidMoves] = useState<string[]>([])
  const [statusModal, setStatusModal] = useState<{
    open: boolean
    type: "check" | "checkmate" | "draw"
    title: string | null
    sideInCheck: "w" | "b" | null
    winner: "w" | "b" | null
  }>({
    open: false,
    type: "check",
    title: null,
    sideInCheck: null,
    winner: null,
  })

  useEffect(() => {
    gameRef.current = game
  }, [game])

  const toSymbol = useCallback((piece) => {
    if (!piece) return null
    const key = piece.color === "w" ? piece.type.toUpperCase() : piece.type
    return PIECES[key]
  }, [])

  const resetSelection = useCallback(() => {
    setSelectedSquare(null)
    setValidMoves([])
  }, [])

  const closeModal = useCallback(() => {
    setStatusModal((prev) => ({ ...prev, open: false }))
  }, [])

  const resetGame = useCallback(() => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
    aiTimeoutRef.current = null

    const fresh = new Chess()
    setGame(fresh)
    resetSelection()
    setStatusModal({
      open: false,
      type: "check",
      title: null,
      sideInCheck: null,
      winner: null,
    })
  }, [resetSelection])

  const evaluate = useCallback((g) => {
    // Game over: checkmate OU nul
    if (isGameOver(g)) {
      if (isCheckmate(g)) {
        const sideToMove = g.turn() // camp qui ne peut plus jouer
        const winner = sideToMove === "w" ? "b" : "w"
        setStatusModal({
          open: true,
          type: "checkmate",
          title: null,
          sideInCheck: sideToMove,
          winner,
        })
      } else {
        let reason = "Match nul"
        if (g.isStalemate()) reason = "Pat (Stalemate)"
        else if (g.isThreefoldRepetition()) reason = "Triple répétition"
        else if (g.isInsufficientMaterial())
          reason = "Mat impossible (Matériel insuffisant)"
        else if (g.isDraw()) reason = "Règle des 50 coups"

        setStatusModal({
          open: true,
          type: "draw",
          title: reason,
          sideInCheck: null,
          winner: null,
        })
      }
      return
    }

    // Sinon : juste échec
    if (isCheck(g)) {
      setStatusModal({
        open: true,
        type: "check",
        title: null,
        sideInCheck: g.turn(),
        winner: null,
      })
    }
  }, [])

  const computeValidMoves = useCallback((squareName) => {
    const g = gameRef.current
    setValidMoves(
      g.moves({ square: squareName, verbose: true }).map((m) => m.to)
    )
  }, [])

  // Stockfish est chargé pour le mode Difficile.
  const { getBestMove } = useStockfish(difficulty === "Difficile")

  const computedAiDelayMs = useMemo(() => {
    if (difficulty === "Facile") return 600
    if (difficulty === "Moyen") return 700
    return 400 // Difficile
  }, [difficulty])

  // Moteur JS (Facile = aléatoire, Moyen = alpha-beta). Sert aussi de secours
  // au mode Difficile si Stockfish est indisponible. Renvoie un coup "verbose".
  const pickJsMove = useCallback(
    (g, aiColor) => {
      const moves = g.moves({ verbose: true })
      if (!moves.length) return null

      if (difficulty === "Facile") {
        return moves[Math.floor(Math.random() * moves.length)]
      }

      // Moyen (et secours Difficile) : alpha-beta optimisé.
      const { move } = searchAB(g, 3, -Infinity, Infinity, true, aiColor)
      return move ?? moves[0]
    },
    [difficulty]
  )

  const makeAIMove = useCallback(async () => {
    const current = gameRef.current
    const aiColor = playerColor === "w" ? "b" : "w"
    if (current.turn() !== aiColor) return
    if (isGameOver(current)) return

    const fen = current.fen()
    const g = new Chess(fen)
    let applied: any = null

    if (difficulty === "Difficile") {
      const uci = await getBestMove(fen, { skillLevel: 20, movetime: 1200 })

      // Garde-fou : la partie a-t-elle changé pendant la réflexion (reset…) ?
      if (gameRef.current.fen() !== fen) return

      if (uci) {
        applied = g.move({
          from: uci.slice(0, 2),
          to: uci.slice(2, 4),
          promotion: uci.length > 4 ? uci[4] : undefined,
        })
      }
      // Secours moteur JS si Stockfish indisponible (CDN bloqué, hors-ligne).
      if (!applied) {
        const m = pickJsMove(g, aiColor)
        if (m) applied = g.move(m)
      }
    } else {
      const m = pickJsMove(g, aiColor)
      if (m) applied = g.move(m)
    }

    if (!applied) {
      evaluate(g)
      return
    }

    setGame(g)
    evaluate(g)
  }, [playerColor, difficulty, getBestMove, pickJsMove, evaluate])

  const tryMove = useCallback(
    (from, to) => {
      const current = gameRef.current
      if (isGameOver(current)) return false
      if (current.turn() !== playerColor) return false

      const g = new Chess(current.fen())
      const move = g.move({ from, to, promotion: "q" })
      if (!move) return false

      setGame(g)
      resetSelection()
      evaluate(g)

      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
      aiTimeoutRef.current = setTimeout(makeAIMove, computedAiDelayMs)
      return true
    },
    [makeAIMove, resetSelection, evaluate, playerColor]
  )

  // Si le joueur est noir, l'IA (blanc) joue au début
  useEffect(() => {
    const g = gameRef.current
    if (playerColor === "b" && g.turn() === "w") {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
      aiTimeoutRef.current = setTimeout(makeAIMove, computedAiDelayMs)
    }
  }, [playerColor, makeAIMove])

  const onSquareClick = useCallback(
    ({ squareName, hasPiece, pieceColor }) => {
      const current = gameRef.current
      if (isGameOver(current)) return
      if (current.turn() !== playerColor) return

      if (selectedSquare) {
        if (hasPiece && pieceColor === playerColor) {
          setSelectedSquare(squareName)
          computeValidMoves(squareName)
          return
        }

        if (!validMoves.includes(squareName)) return
        tryMove(selectedSquare, squareName)
        return
      }

      if (hasPiece && pieceColor === playerColor) {
        setSelectedSquare(squareName)
        computeValidMoves(squareName)
        return
      }

      resetSelection()
    },
    [
      playerColor,
      selectedSquare,
      validMoves,
      tryMove,
      computeValidMoves,
      resetSelection,
    ]
  )

  const value = useMemo(
    () => ({
      game,
      turn: game.turn(),
      selectedSquare,
      validMoves,
      onSquareClick,
      toSymbol,
      statusModal,
      closeModal,
      resetGame,
    }),
    [
      game,
      selectedSquare,
      validMoves,
      onSquareClick,
      toSymbol,
      statusModal,
      closeModal,
      resetGame,
    ]
  )

  return children(value)
}
