import { PlayerColor, SquareClickPayload, SquareUI } from "@/lib/chessBoard"

import ChessSquare from "./chessSquare"

export default function ChessBoard({
  squares,
  currentTurn,
  onSquareClick,
}: {
  squares: SquareUI[]
  currentTurn: PlayerColor
  onSquareClick: (payload: SquareClickPayload) => void
}) {
  return (
    <div className="aspect-square w-full overflow-hidden rounded-lg">
      <div className="grid h-full grid-cols-8 grid-rows-8 border-2 border-gray-700">
        {squares.map((sq) => (
          <ChessSquare
            key={`${sq.row}-${sq.col}`}
            square={sq}
            currentTurn={currentTurn}
            onSquareClick={onSquareClick}
          />
        ))}
      </div>
    </div>
  )
}
