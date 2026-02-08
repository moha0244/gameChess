import { PlayerColor, SquareClickPayload, SquareUI } from "@/lib/chessBoard"

export default function ChessSquare({
  square,
  currentTurn,
  onSquareClick,
}: {
  square: SquareUI
  currentTurn: PlayerColor
  onSquareClick: (payload: SquareClickPayload) => void
}) {
  const {
    isLight,
    isSelected,
    isValidMove,
    pieceSymbol,
    pieceColor,
    squareName,
  } = square

  const showMoveDot = isValidMove && !pieceSymbol
  const showCaptureRing =
    isValidMove && !!pieceSymbol && pieceColor !== currentTurn

  return (
    <button
      className={`
        relative flex items-center justify-center
        ${isLight ? "bg-gray-300" : "bg-gray-700"}
        ${isSelected ? "ring-2 ring-inset ring-yellow-500" : ""}
        ${isValidMove ? "cursor-pointer" : ""}
        transition-all hover:opacity-90
      `}
      onClick={() =>
        onSquareClick({
          squareName,
          hasPiece: !!pieceSymbol,
          pieceColor,
        })
      }
    >
      {showMoveDot && (
        <div className="absolute h-4 w-4 rounded-full bg-orange-500/70" />
      )}

      {showCaptureRing && (
        <div className="absolute inset-0 rounded border-4 border-orange-500/60" />
      )}

      {pieceSymbol && (
        <span
          className={`
            text-3xl md:text-4xl
            ${pieceColor === "w" ? "text-white" : "text-gray-900"}
            ${isSelected ? "scale-110" : ""}
            transition-transform
          `}
        >
          {pieceSymbol}
        </span>
      )}
    </button>
  )
}
