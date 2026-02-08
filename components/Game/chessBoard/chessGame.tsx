import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Chess } from "chess.js"

const PIECES = {
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
  k: "♚",
  P: "♙",
  N: "♘",
  B: "♗",
  R: "♖",
  Q: "♕",
  K: "♔",
}

const PIECE_VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 }

// Compat chess.js (selon versions)
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

export default function ChessGame({ playerColor, difficulty, children }) {
  const [game, setGame] = useState(() => new Chess())
  const gameRef = useRef(game)
  const aiTimeoutRef = useRef(null)

  const [selectedSquare, setSelectedSquare] = useState(null)
  const [validMoves, setValidMoves] = useState([])

  const [statusModal, setStatusModal] = useState({
    open: false,
    type: "check", // "check" | "checkmate" | "draw"
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
          sideInCheck: sideToMove,
          winner,
        })
      } else {
        setStatusModal({
          open: true,
          type: "draw",
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

  function minimax(g, depth, maximizing, aiColor) {
    if (depth === 0 || isGameOver(g)) {
      return { score: evaluateBoard(g, aiColor), move: null }
    }

    const moves = g.moves()
    let bestMove = null

    if (maximizing) {
      let bestScore = -Infinity
      for (const m of moves) {
        const next = new Chess(g.fen())
        next.move(m)
        const { score } = minimax(next, depth - 1, false, aiColor)
        if (score > bestScore) {
          bestScore = score
          bestMove = m
        }
      }
      return { score: bestScore, move: bestMove }
    } else {
      let bestScore = Infinity
      for (const m of moves) {
        const next = new Chess(g.fen())
        next.move(m)
        const { score } = minimax(next, depth - 1, true, aiColor)
        if (score < bestScore) {
          bestScore = score
          bestMove = m
        }
      }
      return { score: bestScore, move: bestMove }
    }
  }

  function minimaxAB(g, depth, alpha, beta, maximizing, aiColor) {
    if (depth === 0 || isGameOver(g)) {
      return { score: evaluateBoard(g, aiColor), move: null }
    }

    const moves = g.moves()
    let bestMove = null

    if (maximizing) {
      let bestScore = -Infinity
      for (const m of moves) {
        const next = new Chess(g.fen())
        next.move(m)
        const { score } = minimaxAB(
          next,
          depth - 1,
          alpha,
          beta,
          false,
          aiColor
        )

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
        const next = new Chess(g.fen())
        next.move(m)
        const { score } = minimaxAB(next, depth - 1, alpha, beta, true, aiColor)

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

  const computedAiDelayMs = useMemo(() => {
    if (difficulty === "Facile") return 600
    if (difficulty === "Moyen") return 900
    return 1200 // Difficile
  }, [difficulty])

  const pickAIMove = useCallback(
    (g) => {
      const moves = g.moves()
      if (!moves.length) return null

      const aiColor = playerColor === "w" ? "b" : "w"

      // 1) Facile : random
      if (difficulty === "Facile") {
        return moves[Math.floor(Math.random() * moves.length)]
      }

      // Réglages profondeur (à ajuster selon perf)
      const depth = difficulty === "Moyen" ? 2 : 3

      // 2) Moyen : minimax
      if (difficulty === "Moyen") {
        const { move } = minimax(g, depth, true, aiColor)
        return move ?? moves[0]
      }

      // 3) Difficile : minimax alpha-beta
      const { move } = minimaxAB(g, depth, -Infinity, Infinity, true, aiColor)
      return move ?? moves[0]
    },
    [playerColor, difficulty]
  )

  const makeAIMove = useCallback(() => {
    const current = gameRef.current
    const aiColor = playerColor === "w" ? "b" : "w"
    if (current.turn() !== aiColor) return
    if (isGameOver(current)) return

    const g = new Chess(current.fen())
    const move = pickAIMove(g)
    if (!move) {
      evaluate(g)
      return
    }

    g.move(move)
    setGame(g)
    evaluate(g)
  }, [playerColor, pickAIMove, evaluate])

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
