import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import type { PieceType } from "../types/chess";
import { PIECE_SYMBOLS } from "../constants/board";
import { useGameStore } from "../store/useGameStore";

/** Promotion piece options */
const PROMOTION_PIECES: PieceType[] = ["queen", "rook", "bishop", "knight"];

/** Modal overlay for pawn promotion selection */
const PromotionModal = () => {
  const pendingPromotion = useGameStore((s) => s.pendingPromotion);
  const promotePawn = useGameStore((s) => s.promotePawn);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* Move focus to the first option whenever the modal opens */
  useEffect(() => {
    if (pendingPromotion) {
      buttonRefs.current[0]?.focus();
    }
  }, [pendingPromotion]);

  if (!pendingPromotion) return null;

  const { piece } = pendingPromotion;

  /** Keep focus within the modal and allow arrow-key navigation */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = PROMOTION_PIECES.length;
    const currentIndex = buttonRefs.current.findIndex(
      (button) => button === document.activeElement
    );

    const focusAt = (index: number) => {
      const next = (index + count) % count;
      buttonRefs.current[next]?.focus();
    };

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusAt(currentIndex + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusAt(currentIndex - 1);
        break;
      case "Tab":
        /* Trap focus inside the modal since a promotion choice is required */
        event.preventDefault();
        focusAt(currentIndex + (event.shiftKey ? -1 : 1));
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Promote pawn"
      onKeyDown={handleKeyDown}
    >
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        <h2 className="mb-4 text-center text-lg font-semibold text-gray-200">
          Promote Pawn
        </h2>
        <div className="flex gap-3">
          {PROMOTION_PIECES.map((type, index) => (
            <button
              key={type}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
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
