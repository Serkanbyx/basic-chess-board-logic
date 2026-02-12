import { useGameStore } from "../store/useGameStore";

/** Displays current game status and turn information */
const GameInfo = () => {
  const currentTurn = useGameStore((s) => s.currentTurn);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const moveHistory = useGameStore((s) => s.moveHistory);
  const resetGame = useGameStore((s) => s.resetGame);

  /** Generate status message based on game state */
  const getStatusMessage = (): string => {
    switch (gameStatus) {
      case "checkmate":
        return `Checkmate! ${currentTurn === "white" ? "Black" : "White"} wins!`;
      case "stalemate":
        return "Stalemate! It's a draw.";
      case "draw":
        return "Draw by insufficient material.";
      case "check":
        return `${currentTurn === "white" ? "White" : "Black"} is in check!`;
      default:
        return `${currentTurn === "white" ? "White" : "Black"}'s turn`;
    }
  };

  /** Status badge color */
  const getStatusColor = (): string => {
    switch (gameStatus) {
      case "checkmate":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "stalemate":
      case "draw":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "check":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  const isGameOver =
    gameStatus === "checkmate" ||
    gameStatus === "stalemate" ||
    gameStatus === "draw";

  return (
    <div className="flex flex-col gap-4">
      {/* Status Badge */}
      <div
        className={`rounded-lg border px-4 py-3 text-center text-sm font-semibold ${getStatusColor()}`}
      >
        {getStatusMessage()}
      </div>

      {/* Turn Indicator */}
      {!isGameOver && (
        <div className="flex items-center justify-center gap-3">
          <div
            className={`h-4 w-4 rounded-full border-2 ${
              currentTurn === "white"
                ? "border-gray-400 bg-white"
                : "border-gray-600 bg-gray-900"
            }`}
          />
          <span className="text-sm text-gray-400">
            Move {Math.floor(moveHistory.length / 2) + 1}
          </span>
        </div>
      )}

      {/* New Game Button */}
      <button
        onClick={resetGame}
        className="rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer"
      >
        {isGameOver ? "Play Again" : "New Game"}
      </button>
    </div>
  );
};

export { GameInfo };
