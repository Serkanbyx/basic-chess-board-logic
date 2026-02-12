import type { Board, PieceColor, PieceType } from "../types/chess";

/** Board dimensions */
export const BOARD_SIZE = 8;

/** Unicode chess piece symbols */
export const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  },
};

/** Column labels (a-h) for algebraic notation */
export const FILE_LABELS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

/** Row labels (1-8) for algebraic notation */
export const RANK_LABELS = ["8", "7", "6", "5", "4", "3", "2", "1"] as const;

/** Creates the initial chess board setup */
export const createInitialBoard = (): Board => {
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );

  /** Piece order for the back rank */
  const backRank: PieceType[] = [
    "rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook",
  ];

  /* Place black pieces (top of board - rows 0 and 1) */
  for (let col = 0; col < BOARD_SIZE; col++) {
    board[0][col] = { type: backRank[col], color: "black", hasMoved: false };
    board[1][col] = { type: "pawn", color: "black", hasMoved: false };
  }

  /* Place white pieces (bottom of board - rows 6 and 7) */
  for (let col = 0; col < BOARD_SIZE; col++) {
    board[7][col] = { type: backRank[col], color: "white", hasMoved: false };
    board[6][col] = { type: "pawn", color: "white", hasMoved: false };
  }

  return board;
};
