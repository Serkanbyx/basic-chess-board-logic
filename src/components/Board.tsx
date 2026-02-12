import { useCallback } from "react";
import type { Position } from "../types/chess";
import { BOARD_SIZE } from "../constants/board";
import { useGameStore } from "../store/useGameStore";
import { findKing } from "../utils/moveValidation";
import { Square } from "./Square";

/** Main chess board grid component */
const Board = () => {
  const board = useGameStore((s) => s.board);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const selectedPosition = useGameStore((s) => s.selectedPosition);
  const validMoves = useGameStore((s) => s.validMoves);
  const lastMove = useGameStore((s) => s.lastMove);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const selectSquare = useGameStore((s) => s.selectSquare);

  /** Check if a position is in the valid moves list */
  const isValidMoveSquare = useCallback(
    (row: number, col: number): boolean =>
      validMoves.some(([r, c]) => r === row && c === col),
    [validMoves]
  );

  /** Check if a position is part of the last move */
  const isLastMoveSquare = useCallback(
    (row: number, col: number): boolean => {
      if (!lastMove) return false;
      return (
        (lastMove.from[0] === row && lastMove.from[1] === col) ||
        (lastMove.to[0] === row && lastMove.to[1] === col)
      );
    },
    [lastMove]
  );

  /* Find king position for check highlight (precompute) */
  const kingInCheckPos =
    gameStatus === "check" || gameStatus === "checkmate"
      ? findKing(board, currentTurn)
      : null;

  return (
    <div
      className="grid grid-cols-8 overflow-hidden rounded-lg border-2 border-amber-900/60 shadow-2xl"
      role="grid"
      aria-label="Chess board"
    >
      {Array.from({ length: BOARD_SIZE }, (_, row) =>
        Array.from({ length: BOARD_SIZE }, (_, col) => {
          const position: Position = [row, col];
          const piece = board[row][col];
          const isSelected =
            selectedPosition !== null &&
            selectedPosition[0] === row &&
            selectedPosition[1] === col;

          const isKingCheck =
            kingInCheckPos !== null &&
            kingInCheckPos[0] === row &&
            kingInCheckPos[1] === col;

          return (
            <Square
              key={`${row}-${col}`}
              piece={piece}
              position={position}
              isSelected={isSelected}
              isValidMove={isValidMoveSquare(row, col)}
              isLastMoveSquare={isLastMoveSquare(row, col)}
              isKingInCheck={isKingCheck}
              onClick={selectSquare}
            />
          );
        })
      )}
    </div>
  );
};

export { Board };
