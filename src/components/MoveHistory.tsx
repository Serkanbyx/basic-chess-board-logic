import { useRef, useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import { moveToNotation } from "../utils/notation";

/** Displays the move history in algebraic notation */
const MoveHistory = () => {
  const moveHistory = useGameStore((s) => s.moveHistory);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to bottom when new moves are added */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory.length]);

  if (moveHistory.length === 0) {
    return (
      <div className="rounded-lg bg-gray-800/50 p-4 text-center text-sm text-gray-500">
        No moves yet. White goes first.
      </div>
    );
  }

  /* Group moves into pairs (white + black) */
  const movePairs: { number: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moveToNotation(moveHistory[i]),
      black: moveHistory[i + 1] ? moveToNotation(moveHistory[i + 1]) : undefined,
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Move History
      </h3>
      <div
        ref={scrollRef}
        className="max-h-48 overflow-y-auto rounded-lg bg-gray-800/50 p-2 scrollbar-thin scrollbar-thumb-gray-700"
      >
        <div className="grid grid-cols-[2rem_1fr_1fr] gap-x-2 gap-y-0.5 text-sm">
          {movePairs.map((pair) => (
            <div key={pair.number} className="contents">
              <span className="text-gray-600">{pair.number}.</span>
              <span className="font-mono text-gray-300">{pair.white}</span>
              <span className="font-mono text-gray-400">
                {pair.black ?? ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { MoveHistory };
