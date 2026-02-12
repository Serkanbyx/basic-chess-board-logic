import type { Board, Piece, PieceColor, Position } from "../types/chess";
import { BOARD_SIZE } from "../constants/board";

// ─── Helpers ────────────────────────────────────────────────

/** Check if a position is within the board boundaries */
const isInBounds = (row: number, col: number): boolean =>
  row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

/** Get the piece at a given board position */
const getPiece = (board: Board, [row, col]: Position): Piece | null =>
  board[row][col];

/** Deep clone a board for simulation purposes */
const cloneBoard = (board: Board): Board =>
  board.map((row) => row.map((sq) => (sq ? { ...sq } : null)));

/** Get the opponent's color */
const opponentColor = (color: PieceColor): PieceColor =>
  color === "white" ? "black" : "white";

// ─── Core: Raw Move Generation (no check filtering) ────────

/** Get raw pseudo-legal moves for a piece (doesn't check for pins/checks) */
const getRawMoves = (
  board: Board,
  position: Position,
  enPassantTarget: Position | null
): Position[] => {
  const piece = getPiece(board, position);
  if (!piece) return [];

  switch (piece.type) {
    case "pawn":
      return getPawnMoves(board, position, piece, enPassantTarget);
    case "rook":
      return getSlidingMoves(board, position, piece.color, ROOK_DIRECTIONS);
    case "bishop":
      return getSlidingMoves(board, position, piece.color, BISHOP_DIRECTIONS);
    case "queen":
      return getSlidingMoves(board, position, piece.color, QUEEN_DIRECTIONS);
    case "knight":
      return getKnightMoves(board, position, piece.color);
    case "king":
      return getKingMoves(board, position, piece);
    default:
      return [];
  }
};

// ─── Direction Vectors ──────────────────────────────────────

const ROOK_DIRECTIONS: Position[] = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
];

const BISHOP_DIRECTIONS: Position[] = [
  [-1, -1], [-1, 1], [1, -1], [1, 1],
];

const QUEEN_DIRECTIONS: Position[] = [...ROOK_DIRECTIONS, ...BISHOP_DIRECTIONS];

const KNIGHT_OFFSETS: Position[] = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1],
];

// ─── Piece-Specific Move Generators ─────────────────────────

/** Generate sliding moves (rook, bishop, queen) */
const getSlidingMoves = (
  board: Board,
  [row, col]: Position,
  color: PieceColor,
  directions: Position[]
): Position[] => {
  const moves: Position[] = [];

  for (const [dRow, dCol] of directions) {
    let r = row + dRow;
    let c = col + dCol;

    while (isInBounds(r, c)) {
      const target = board[r][c];

      if (!target) {
        moves.push([r, c]);
      } else {
        if (target.color !== color) moves.push([r, c]);
        break; // Blocked by piece
      }

      r += dRow;
      c += dCol;
    }
  }

  return moves;
};

/** Generate knight moves */
const getKnightMoves = (
  board: Board,
  [row, col]: Position,
  color: PieceColor
): Position[] => {
  const moves: Position[] = [];

  for (const [dRow, dCol] of KNIGHT_OFFSETS) {
    const r = row + dRow;
    const c = col + dCol;

    if (isInBounds(r, c)) {
      const target = board[r][c];
      if (!target || target.color !== color) {
        moves.push([r, c]);
      }
    }
  }

  return moves;
};

/** Generate pawn moves (including en passant) */
const getPawnMoves = (
  board: Board,
  [row, col]: Position,
  piece: Piece,
  enPassantTarget: Position | null
): Position[] => {
  const moves: Position[] = [];
  const direction = piece.color === "white" ? -1 : 1;
  const startRow = piece.color === "white" ? 6 : 1;

  /* Forward one square */
  const forwardRow = row + direction;
  if (isInBounds(forwardRow, col) && !board[forwardRow][col]) {
    moves.push([forwardRow, col]);

    /* Forward two squares from starting position */
    const doubleRow = row + direction * 2;
    if (row === startRow && !board[doubleRow][col]) {
      moves.push([doubleRow, col]);
    }
  }

  /* Diagonal captures */
  for (const dCol of [-1, 1]) {
    const captureCol = col + dCol;
    if (isInBounds(forwardRow, captureCol)) {
      const target = board[forwardRow][captureCol];

      /* Normal capture */
      if (target && target.color !== piece.color) {
        moves.push([forwardRow, captureCol]);
      }

      /* En passant capture */
      if (
        enPassantTarget &&
        enPassantTarget[0] === forwardRow &&
        enPassantTarget[1] === captureCol
      ) {
        moves.push([forwardRow, captureCol]);
      }
    }
  }

  return moves;
};

/** Generate king moves (including castling) */
const getKingMoves = (
  board: Board,
  [row, col]: Position,
  piece: Piece
): Position[] => {
  const moves: Position[] = [];

  /* Standard one-square moves */
  for (const [dRow, dCol] of QUEEN_DIRECTIONS) {
    const r = row + dRow;
    const c = col + dCol;

    if (isInBounds(r, c)) {
      const target = board[r][c];
      if (!target || target.color !== piece.color) {
        moves.push([r, c]);
      }
    }
  }

  /* Castling */
  if (!piece.hasMoved) {
    const backRank = piece.color === "white" ? 7 : 0;

    if (row === backRank) {
      /* King-side castling (short) */
      const kRook = board[backRank][7];
      if (
        kRook &&
        kRook.type === "rook" &&
        !kRook.hasMoved &&
        !board[backRank][5] &&
        !board[backRank][6] &&
        !isSquareAttacked(board, [backRank, 4], opponentColor(piece.color)) &&
        !isSquareAttacked(board, [backRank, 5], opponentColor(piece.color)) &&
        !isSquareAttacked(board, [backRank, 6], opponentColor(piece.color))
      ) {
        moves.push([backRank, 6]);
      }

      /* Queen-side castling (long) */
      const qRook = board[backRank][0];
      if (
        qRook &&
        qRook.type === "rook" &&
        !qRook.hasMoved &&
        !board[backRank][1] &&
        !board[backRank][2] &&
        !board[backRank][3] &&
        !isSquareAttacked(board, [backRank, 4], opponentColor(piece.color)) &&
        !isSquareAttacked(board, [backRank, 3], opponentColor(piece.color)) &&
        !isSquareAttacked(board, [backRank, 2], opponentColor(piece.color))
      ) {
        moves.push([backRank, 2]);
      }
    }
  }

  return moves;
};

// ─── Check / Pin Detection ──────────────────────────────────

/** Check if a specific square is attacked by a given color */
export const isSquareAttacked = (
  board: Board,
  [row, col]: Position,
  byColor: PieceColor
): boolean => {
  /* Check knight attacks */
  for (const [dRow, dCol] of KNIGHT_OFFSETS) {
    const r = row + dRow;
    const c = col + dCol;
    if (isInBounds(r, c)) {
      const piece = board[r][c];
      if (piece && piece.color === byColor && piece.type === "knight") return true;
    }
  }

  /* Check sliding attacks (rook/queen along ranks and files) */
  for (const [dRow, dCol] of ROOK_DIRECTIONS) {
    let r = row + dRow;
    let c = col + dCol;
    while (isInBounds(r, c)) {
      const piece = board[r][c];
      if (piece) {
        if (
          piece.color === byColor &&
          (piece.type === "rook" || piece.type === "queen")
        )
          return true;
        break;
      }
      r += dRow;
      c += dCol;
    }
  }

  /* Check sliding attacks (bishop/queen along diagonals) */
  for (const [dRow, dCol] of BISHOP_DIRECTIONS) {
    let r = row + dRow;
    let c = col + dCol;
    while (isInBounds(r, c)) {
      const piece = board[r][c];
      if (piece) {
        if (
          piece.color === byColor &&
          (piece.type === "bishop" || piece.type === "queen")
        )
          return true;
        break;
      }
      r += dRow;
      c += dCol;
    }
  }

  /* Check pawn attacks */
  const pawnDir = byColor === "white" ? 1 : -1; // Pawns attack "forward" relative to their color
  for (const dCol of [-1, 1]) {
    const r = row + pawnDir;
    const c = col + dCol;
    if (isInBounds(r, c)) {
      const piece = board[r][c];
      if (piece && piece.color === byColor && piece.type === "pawn") return true;
    }
  }

  /* Check king attacks (prevents kings from being adjacent) */
  for (const [dRow, dCol] of QUEEN_DIRECTIONS) {
    const r = row + dRow;
    const c = col + dCol;
    if (isInBounds(r, c)) {
      const piece = board[r][c];
      if (piece && piece.color === byColor && piece.type === "king") return true;
    }
  }

  return false;
};

/** Find the king's position for a given color */
export const findKing = (board: Board, color: PieceColor): Position | null => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.type === "king" && piece.color === color) {
        return [row, col];
      }
    }
  }
  return null;
};

/** Check if a color's king is currently in check */
export const isInCheck = (board: Board, color: PieceColor): boolean => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  return isSquareAttacked(board, kingPos, opponentColor(color));
};

// ─── Legal Move Filtering ───────────────────────────────────

/** Simulate a move and check if it leaves the king in check */
const doesMoveCauseCheck = (
  board: Board,
  from: Position,
  to: Position,
  color: PieceColor
): boolean => {
  const simBoard = cloneBoard(board);
  const piece = simBoard[from[0]][from[1]];

  /* Execute move on simulation board */
  simBoard[to[0]][to[1]] = piece;
  simBoard[from[0]][from[1]] = null;

  /* Handle en passant capture removal */
  if (piece && piece.type === "pawn" && from[1] !== to[1] && !board[to[0]][to[1]]) {
    simBoard[from[0]][to[1]] = null;
  }

  /* Handle castling rook movement */
  if (piece && piece.type === "king" && Math.abs(from[1] - to[1]) === 2) {
    const backRank = from[0];
    if (to[1] === 6) {
      simBoard[backRank][5] = simBoard[backRank][7];
      simBoard[backRank][7] = null;
    } else if (to[1] === 2) {
      simBoard[backRank][3] = simBoard[backRank][0];
      simBoard[backRank][0] = null;
    }
  }

  return isInCheck(simBoard, color);
};

/** Get all legal moves for a piece at a given position */
export const getValidMoves = (
  board: Board,
  position: Position,
  enPassantTarget: Position | null
): Position[] => {
  const piece = getPiece(board, position);
  if (!piece) return [];

  const rawMoves = getRawMoves(board, position, enPassantTarget);

  /* Filter out moves that would leave the king in check */
  return rawMoves.filter(
    (to) => !doesMoveCauseCheck(board, position, to, piece.color)
  );
};

// ─── Game Status Detection ──────────────────────────────────

/** Check if a player has any legal moves */
export const hasLegalMoves = (
  board: Board,
  color: PieceColor,
  enPassantTarget: Position | null
): boolean => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, [row, col], enPassantTarget);
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
};

/** Check for insufficient material draw */
export const isInsufficientMaterial = (board: Board): boolean => {
  const pieces: Piece[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col]) pieces.push(board[row][col]!);
    }
  }

  /* King vs King */
  if (pieces.length === 2) return true;

  /* King + minor piece vs King */
  if (pieces.length === 3) {
    const nonKing = pieces.find((p) => p.type !== "king");
    if (nonKing && (nonKing.type === "bishop" || nonKing.type === "knight")) {
      return true;
    }
  }

  /* King + Bishop vs King + Bishop (same color bishops) */
  if (pieces.length === 4) {
    const bishops = pieces.filter((p) => p.type === "bishop");
    if (bishops.length === 2 && bishops[0].color !== bishops[1].color) {
      return true; // Simplified: treat as draw for basic logic
    }
  }

  return false;
};
