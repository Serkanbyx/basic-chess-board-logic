import { Board } from "../components/Board";
import { CapturedPieces } from "../components/CapturedPieces";
import { GameInfo } from "../components/GameInfo";
import { MoveHistory } from "../components/MoveHistory";
import { PromotionModal } from "../components/PromotionModal";

/** Main game page - assembles the chess board and sidebar */
const GamePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-6">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-100 md:text-3xl">
          ♚ Chess Board
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Click a piece to select, then click a valid square to move
        </p>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* Board Section */}
        <div className="flex flex-col gap-2">
          {/* Black captured pieces (shown above board) */}
          <div className="flex min-h-[28px] items-center gap-1">
            <CapturedPieces color="black" />
          </div>

          {/* Chess Board */}
          <div className="w-[min(85vw,480px)] md:w-[480px]">
            <Board />
          </div>

          {/* White captured pieces (shown below board) */}
          <div className="flex min-h-[28px] items-center gap-1">
            <CapturedPieces color="white" />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex w-full max-w-xs flex-col gap-5 lg:w-64">
          <GameInfo />
          <MoveHistory />
        </aside>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-600">
        Built with React, TypeScript, Zustand & Tailwind CSS
      </footer>

      {/* Promotion Modal Overlay */}
      <PromotionModal />
    </div>
  );
};

export { GamePage };
