import { memo, useCallback } from "react";
import type { Position, Square as SquareType } from "../types/chess";
import { ChessPiece } from "./ChessPiece";
import { FILE_LABELS, RANK_LABELS } from "../constants/board";

interface SquareProps {
  piece: SquareType;
  position: Position;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMoveSquare: boolean;
  isKingInCheck: boolean;
  onClick: (position: Position) => void;
}

/** Renders a single square on the chess board */
const Square = memo(
  ({
    piece,
    position,
    isSelected,
    isValidMove,
    isLastMoveSquare,
    isKingInCheck,
    onClick,
  }: SquareProps) => {
    const [row, col] = position;
    const isLight = (row + col) % 2 === 0;

    const handleClick = useCallback(() => {
      onClick(position);
    }, [onClick, position]);

    /* Base color */
    const baseColor = isLight
      ? "bg-amber-100"
      : "bg-amber-800";

    /* Selected highlight */
    const selectedClass = isSelected
      ? "ring-4 ring-inset ring-sky-400 bg-sky-300/40"
      : "";

    /* Last move highlight */
    const lastMoveClass = isLastMoveSquare && !isSelected
      ? "last-move-highlight"
      : "";

    /* King in check */
    const checkClass = isKingInCheck ? "king-in-check" : "";

    /* Coordinate labels (file on bottom row, rank on left column) */
    const showFile = row === 7;
    const showRank = col === 0;

    return (
      <button
        className={`
          relative flex items-center justify-center
          aspect-square w-full
          ${baseColor} ${selectedClass} ${lastMoveClass} ${checkClass}
          transition-colors duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
          cursor-pointer
        `}
        onClick={handleClick}
        aria-label={`${FILE_LABELS[col]}${RANK_LABELS[row]}${piece ? ` - ${piece.color} ${piece.type}` : ""}`}
      >
        {/* Coordinate labels */}
        {showRank && (
          <span
            className={`absolute top-0.5 left-1 text-[10px] font-bold ${
              isLight ? "text-amber-800" : "text-amber-100"
            }`}
          >
            {RANK_LABELS[row]}
          </span>
        )}
        {showFile && (
          <span
            className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${
              isLight ? "text-amber-800" : "text-amber-100"
            }`}
          >
            {FILE_LABELS[col]}
          </span>
        )}

        {/* Piece */}
        {piece && <ChessPiece piece={piece} isSelected={isSelected} />}

        {/* Valid move indicator */}
        {isValidMove && !piece && (
          <div className="valid-move-dot h-3 w-3 rounded-full bg-gray-900/40 md:h-4 md:w-4" />
        )}

        {/* Valid capture indicator */}
        {isValidMove && piece && (
          <div className="absolute inset-0 rounded-full border-[3px] border-gray-900/40 md:border-4" />
        )}
      </button>
    );
  }
);

Square.displayName = "Square";

export { Square };
