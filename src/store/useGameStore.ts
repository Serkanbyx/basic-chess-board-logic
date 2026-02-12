import { create } from "zustand";
import type {
  Board,
  GameState,
  GameStatus,
  Move,
  Piece,
  PieceColor,
  PieceType,
  Position,
} from "../types/chess";
import { createInitialBoard } from "../constants/board";
import {
  getValidMoves,
  hasLegalMoves,
  isInCheck,
  isInsufficientMaterial,
} from "../utils/moveValidation";

// ─── Store Actions ──────────────────────────────────────────

interface GameActions {
  /** Select a square on the board */
  selectSquare: (position: Position) => void;
  /** Promote a pawn to a specific piece type */
  promotePawn: (pieceType: PieceType) => void;
  /** Reset the game to initial state */
  resetGame: () => void;
}

/** Pending promotion state */
interface PromotionState {
  pendingPromotion: {
    from: Position;
    to: Position;
    piece: Piece;
    captured?: Piece;
  } | null;
}

type GameStore = GameState & GameActions & PromotionState;

// ─── Initial State ──────────────────────────────────────────

const createInitialState = (): GameState & PromotionState => ({
  board: createInitialBoard(),
  currentTurn: "white",
  selectedPosition: null,
  validMoves: [],
  moveHistory: [],
  capturedPieces: { white: [], black: [] },
  gameStatus: "playing",
  lastMove: null,
  enPassantTarget: null,
  pendingPromotion: null,
});

// ─── Helper Functions ───────────────────────────────────────

/** Deep clone the board to avoid mutations */
const cloneBoard = (board: Board): Board =>
  board.map((row) => row.map((sq) => (sq ? { ...sq } : null)));

/** Determine game status after a move */
const determineGameStatus = (
  board: Board,
  nextTurn: PieceColor,
  enPassantTarget: Position | null
): GameStatus => {
  const inCheck = isInCheck(board, nextTurn);
  const hasLegal = hasLegalMoves(board, nextTurn, enPassantTarget);

  if (inCheck && !hasLegal) return "checkmate";
  if (!inCheck && !hasLegal) return "stalemate";
  if (isInsufficientMaterial(board)) return "draw";
  if (inCheck) return "check";
  return "playing";
};

// ─── Zustand Store ──────────────────────────────────────────

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  selectSquare: (position: Position) => {
    const state = get();
    const { board, currentTurn, selectedPosition, validMoves, gameStatus, enPassantTarget } = state;

    /* Ignore clicks during checkmate/stalemate/draw or pending promotion */
    if (gameStatus === "checkmate" || gameStatus === "stalemate" || gameStatus === "draw") return;
    if (state.pendingPromotion) return;

    const [row, col] = position;
    const clickedPiece = board[row][col];

    /* If a piece is already selected... */
    if (selectedPosition) {
      /* Check if the clicked square is a valid move destination */
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

      if (isValidMove) {
        executeMove(position, set, get);
        return;
      }

      /* Clicking on another own piece: re-select */
      if (clickedPiece && clickedPiece.color === currentTurn) {
        const newValidMoves = getValidMoves(board, position, enPassantTarget);
        set({ selectedPosition: position, validMoves: newValidMoves });
        return;
      }

      /* Clicking on empty square or enemy piece (not valid move): deselect */
      set({ selectedPosition: null, validMoves: [] });
      return;
    }

    /* No piece selected yet - select if it's the current turn's piece */
    if (clickedPiece && clickedPiece.color === currentTurn) {
      const newValidMoves = getValidMoves(board, position, enPassantTarget);
      set({ selectedPosition: position, validMoves: newValidMoves });
    }
  },

  promotePawn: (pieceType: PieceType) => {
    const state = get();
    const { pendingPromotion } = state;
    if (!pendingPromotion) return;

    const { from, to, piece, captured } = pendingPromotion;
    const newBoard = cloneBoard(state.board);

    /* Place promoted piece */
    newBoard[to[0]][to[1]] = {
      type: pieceType,
      color: piece.color,
      hasMoved: true,
    };
    newBoard[from[0]][from[1]] = null;

    const move: Move = {
      from,
      to,
      piece,
      captured,
      isPromotion: true,
      promotedTo: pieceType,
    };

    const nextTurn: PieceColor = piece.color === "white" ? "black" : "white";
    const newCaptured = { ...state.capturedPieces };
    if (captured) {
      newCaptured[captured.color] = [...newCaptured[captured.color], captured];
    }

    const gameStatus = determineGameStatus(newBoard, nextTurn, null);

    set({
      board: newBoard,
      currentTurn: nextTurn,
      selectedPosition: null,
      validMoves: [],
      moveHistory: [...state.moveHistory, move],
      capturedPieces: newCaptured,
      gameStatus,
      lastMove: move,
      enPassantTarget: null,
      pendingPromotion: null,
    });
  },

  resetGame: () => {
    set(createInitialState());
  },
}));

// ─── Move Execution (extracted for readability) ─────────────

const executeMove = (
  to: Position,
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore
) => {
  const state = get();
  const from = state.selectedPosition!;
  const newBoard = cloneBoard(state.board);
  const piece = newBoard[from[0]][from[1]]!;
  const captured = newBoard[to[0]][to[1]] ?? undefined;

  /* Detect special moves */
  const isCastling = piece.type === "king" && Math.abs(from[1] - to[1]) === 2;
  const isEnPassant =
    piece.type === "pawn" &&
    from[1] !== to[1] &&
    !newBoard[to[0]][to[1]] &&
    state.enPassantTarget !== null;
  const isPromotion =
    piece.type === "pawn" && (to[0] === 0 || to[0] === 7);

  /* Handle pawn promotion: show modal first */
  if (isPromotion) {
    set({
      pendingPromotion: { from, to, piece, captured },
    });
    return;
  }

  /* Execute the move */
  newBoard[to[0]][to[1]] = { ...piece, hasMoved: true };
  newBoard[from[0]][from[1]] = null;

  /* Handle en passant capture */
  let enPassantCaptured: Piece | undefined;
  if (isEnPassant) {
    enPassantCaptured = newBoard[from[0]][to[1]] ?? undefined;
    newBoard[from[0]][to[1]] = null;
  }

  /* Handle castling rook movement */
  if (isCastling) {
    const backRank = from[0];
    if (to[1] === 6) {
      /* King-side */
      newBoard[backRank][5] = { ...newBoard[backRank][7]!, hasMoved: true };
      newBoard[backRank][7] = null;
    } else if (to[1] === 2) {
      /* Queen-side */
      newBoard[backRank][3] = { ...newBoard[backRank][0]!, hasMoved: true };
      newBoard[backRank][0] = null;
    }
  }

  /* Determine en passant target for next move */
  let newEnPassantTarget: Position | null = null;
  if (piece.type === "pawn" && Math.abs(from[0] - to[0]) === 2) {
    const epRow = (from[0] + to[0]) / 2;
    newEnPassantTarget = [epRow, to[1]];
  }

  /* Record the move */
  const actualCaptured = captured ?? enPassantCaptured;
  const move: Move = {
    from,
    to,
    piece,
    captured: actualCaptured,
    isEnPassant,
    isCastling,
  };

  /* Update captured pieces */
  const newCaptured = { ...state.capturedPieces };
  if (actualCaptured) {
    newCaptured[actualCaptured.color] = [
      ...newCaptured[actualCaptured.color],
      actualCaptured,
    ];
  }

  /* Determine next turn and game status */
  const nextTurn: PieceColor = piece.color === "white" ? "black" : "white";
  const gameStatus = determineGameStatus(newBoard, nextTurn, newEnPassantTarget);

  set({
    board: newBoard,
    currentTurn: nextTurn,
    selectedPosition: null,
    validMoves: [],
    moveHistory: [...state.moveHistory, move],
    capturedPieces: newCaptured,
    gameStatus,
    lastMove: move,
    enPassantTarget: newEnPassantTarget,
    pendingPromotion: null,
  });
};
