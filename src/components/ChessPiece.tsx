import { memo } from "react";
import type { Piece } from "../types/chess";
import { PIECE_SYMBOLS } from "../constants/board";

interface ChessPieceProps {
  piece: Piece;
  isSelected: boolean;
}

/** Renders a chess piece with Unicode symbol */
const ChessPiece = memo(({ piece, isSelected }: ChessPieceProps) => {
  const symbol = PIECE_SYMBOLS[piece.color][piece.type];

  return (
    <span
      className={`
        piece-hover select-none text-4xl leading-none
        md:text-5xl
        ${isSelected ? "piece-selected" : ""}
        ${
          piece.color === "white"
            ? "text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]"
            : "text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.25)]"
        }
      `}
      role="img"
      aria-label={`${piece.color} ${piece.type}`}
    >
      {symbol}
    </span>
  );
});

ChessPiece.displayName = "ChessPiece";

export { ChessPiece };
