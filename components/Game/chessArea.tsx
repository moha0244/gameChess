import { Crown, Target } from "lucide-react"

import ProfileCard from "./chessBoard/ProfileCard"
import BoardModel from "./chessBoard/boardModel"
import ChessBoard from "./chessBoard/chessBoard"
import ChessGame from "./chessBoard/chessGame"
import StatusModal from "./modal/statusModal"

/**
 * Composant "page / zone" qui assemble  :
 * - profil IA
 * - échiquier
 * - profil joueur
 *

 */
export default function ChessArea({ playerColor, difficulty }) {
  const playerProfile = {
    icon: Crown,
    name: "Vous",
    subtext: playerColor === "w" ? "Blancs" : "Noirs",
    isTurn: (turn) => turn === playerColor,
  }

  const aiProfile = {
    icon: Target,
    name: "IA",
    subtext: difficulty,
    isTurn: (turn) => turn !== playerColor,
  }

  const topProfile = playerColor === "w" ? aiProfile : playerProfile
  const bottomProfile = playerColor === "w" ? playerProfile : aiProfile

  return (
    <ChessGame playerColor={playerColor} difficulty={difficulty}>
      {({
        game,
        turn,
        selectedSquare,
        validMoves,
        onSquareClick,
        toSymbol,
        statusModal,
        closeModal,
        resetGame,
      }) => (
        <>
          <StatusModal
            open={statusModal.open}
            type={statusModal.type}
            title={statusModal.title}
            sideInCheck={statusModal.sideInCheck}
            winner={statusModal.winner}
            onClose={closeModal}
            onRestart={resetGame}
          />

          <div className="group mx-auto flex w-full  flex-col">
            {/* Profil du haut */}
            <ProfileCard
              icon={topProfile.icon}
              name={topProfile.name}
              subtext={topProfile.subtext}
              isTurn={topProfile.isTurn(turn)}
              rounded="rounded-t-xl"
              border="border-x border-t border-gray-800/50"
            />

            {/* Échiquier */}
            <div className="relative border-x border-gray-800/50 bg-gray-900 p-6">
              <BoardModel
                game={game}
                selectedSquare={selectedSquare}
                validMoves={validMoves}
                toSymbol={toSymbol}
              >
                {(squares) => (
                  <ChessBoard
                    squares={squares}
                    currentTurn={turn}
                    onSquareClick={onSquareClick}
                  />
                )}
              </BoardModel>
            </div>

            {/* Profil du bas */}
            <ProfileCard
              icon={bottomProfile.icon}
              name={bottomProfile.name}
              subtext={bottomProfile.subtext}
              isTurn={bottomProfile.isTurn(turn)}
              rounded="rounded-b-xl"
              border="border border-gray-800/50 shadow-lg"
            />
          </div>
        </>
      )}
    </ChessGame>
  )
}
