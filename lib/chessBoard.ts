// chessBoard/chess.types.ts

import type { Chess } from "chess.js"

/** Couleur du joueur */
export type PlayerColor = "w" | "b"

/** Infos envoyées quand on clique une case */
export interface SquareClickPayload {
  squareName: string
  hasPiece: boolean
  pieceColor: PlayerColor | null
}

/** Données UI d'une case  */
export interface SquareUI {
  row: number
  col: number
  squareName: string
  isLight: boolean
  pieceSymbol: string | null
  pieceColor: PlayerColor | null
  isSelected: boolean
  isValidMove: boolean
}

/** Ce que ChessGame expose à ChessArea */
export interface ChessGameRenderState {
  game: Chess
  turn: PlayerColor
  selectedSquare: string | null
  validMoves: string[]
  onSquareClick: (payload: SquareClickPayload) => void
  toSymbol: (piece: any | null) => string | null
}
