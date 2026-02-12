import type { Move, PieceType, Position } from "../types/chess";
import { FILE_LABELS, RANK_LABELS } from "../constants/board";

/** Piece type to algebraic notation letter */
const PIECE_LETTERS: Record<PieceType, string> = {
  king: "K",
  queen: "Q",
  rook: "R",
  bishop: "B",
  knight: "N",
  pawn: "",
};

/** Convert a board position to algebraic notation (e.g., [0, 0] => "a8") */
export const positionToAlgebraic = ([row, col]: Position): string =>
  `${FILE_LABELS[col]}${RANK_LABELS[row]}`;

/** Convert a move to algebraic notation string */
export const moveToNotation = (move: Move): string => {
  /* Castling */
  if (move.isCastling) {
    return move.to[1] === 6 ? "O-O" : "O-O-O";
  }

  const pieceLetter = PIECE_LETTERS[move.piece.type];
  const capture = move.captured ? "x" : "";
  const fromFile = move.piece.type === "pawn" && move.captured ? FILE_LABELS[move.from[1]] : "";
  const destination = positionToAlgebraic(move.to);
  const promotion = move.isPromotion && move.promotedTo ? `=${PIECE_LETTERS[move.promotedTo]}` : "";

  return `${pieceLetter}${fromFile}${capture}${destination}${promotion}`;
};
