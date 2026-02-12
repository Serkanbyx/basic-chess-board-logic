import type { PieceType } from "../types/chess";
import { PIECE_SYMBOLS } from "../constants/board";
import { useGameStore } from "../store/useGameStore";

/** Promotion piece options */
const PROMOTION_PIECES: PieceType[] = ["queen", "rook", "bishop", "knight"];

/** Modal overlay for pawn promotion selection */
const PromotionModal = () => {
  const pendingPromotion = useGameStore((s) => s.pendingPromotion);
  const promotePawn = useGameStore((s) => s.promotePawn);

  if (!pendingPromotion) return null;

  const { piece } = pendingPromotion;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Promote pawn"
    >
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        <h2 className="mb-4 text-center text-lg font-semibold text-gray-200">
          Promote Pawn
        </h2>
        <div className="flex gap-3">
          {PROMOTION_PIECES.map((type) => (
            <button
              key={type}
              onClick={() => promotePawn(type)}
              className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-4xl transition-all hover:scale-110 hover:border-sky-500 hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer"
              aria-label={`Promote to ${type}`}
              title={type.charAt(0).toUpperCase() + type.slice(1)}
            >
              {PIECE_SYMBOLS[piece.color][type]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { PromotionModal };
