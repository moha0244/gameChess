import { useMemo } from "react"
import type { Chess } from "chess.js"

import { SquareUI } from "@/lib/chessBoard"

export default function BoardModel({
  game,
  selectedSquare,
  validMoves,
  toSymbol,
  children,
}: {
  game: Chess
  selectedSquare: string | null
  validMoves: string[]
  toSymbol: (piece: any | null) => string | null
  children: (squares: SquareUI[]) => React.ReactNode
}) {
  const squares = useMemo<SquareUI[]>(() => {
    const boardArray: SquareUI[] = []
    const gameBoard = game.board()

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameBoard[row][col]
        const squareName = `${String.fromCharCode(97 + col)}${8 - row}`
        const isLight = (row + col) % 2 === 0

        boardArray.push({
          row,
          col,
          squareName,
          isLight,
          pieceSymbol: toSymbol(piece),
          pieceColor: piece ? piece.color : null,
          isSelected: selectedSquare === squareName,
          isValidMove: validMoves.includes(squareName),
        })
      }
    }

    return boardArray
  }, [game, selectedSquare, validMoves, toSymbol])

  return <>{children(squares)}</>
}
