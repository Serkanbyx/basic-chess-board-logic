import type { PieceColor } from "../types/chess";
import { PIECE_SYMBOLS } from "../constants/board";
import { useGameStore } from "../store/useGameStore";

interface CapturedPiecesProps {
  color: PieceColor;
}

/** Displays captured pieces for a given color */
const CapturedPieces = ({ color }: CapturedPiecesProps) => {
  const capturedPieces = useGameStore((s) => s.capturedPieces[color]);

  if (capturedPieces.length === 0) return null;

  /* Sort captured pieces by value (queen > rook > bishop > knight > pawn) */
  const pieceOrder: Record<string, number> = { queen: 0, rook: 1, bishop: 2, knight: 3, pawn: 4, king: 5 };
  const sorted = [...capturedPieces].sort(
    (a, b) => pieceOrder[a.type] - pieceOrder[b.type]
  );

  return (
    <div className="flex flex-wrap gap-0.5">
      {sorted.map((piece, index) => (
        <span
          key={`${piece.type}-${index}`}
          className="text-lg opacity-70 md:text-xl"
          title={`Captured ${piece.color} ${piece.type}`}
        >
          {PIECE_SYMBOLS[piece.color][piece.type]}
        </span>
      ))}
    </div>
  );
};

export { CapturedPieces };
