/** Color of a chess piece */
export type PieceColor = "white" | "black";

/** Type of a chess piece */
export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";

/** Represents a chess piece on the board */
export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved: boolean;
}

/** Board position as [row, col] - 0-indexed from top-left */
export type Position = [number, number];

/** A single square on the board - either has a piece or is empty */
export type Square = Piece | null;

/** 8x8 board represented as a 2D array */
export type Board = Square[][];

/** Represents a move from one position to another */
export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  isEnPassant?: boolean;
  isCastling?: boolean;
  isPromotion?: boolean;
  promotedTo?: PieceType;
}

/** Game status */
export type GameStatus = "playing" | "check" | "checkmate" | "stalemate" | "draw";

/** Complete game state */
export interface GameState {
  board: Board;
  currentTurn: PieceColor;
  selectedPosition: Position | null;
  validMoves: Position[];
  moveHistory: Move[];
  capturedPieces: { white: Piece[]; black: Piece[] };
  gameStatus: GameStatus;
  lastMove: Move | null;
  enPassantTarget: Position | null;
}
