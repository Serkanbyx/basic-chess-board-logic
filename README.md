# ♟️ Basic Chess Board Logic

A fully interactive chess board application with complete piece movement logic, real-time check/checkmate detection, and a modern responsive UI. Play a complete game of chess right in your browser!

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

## Features

- **Complete Chess Rules**: All standard piece movements including castling (king-side & queen-side), en passant captures, and pawn promotion
- **Check & Checkmate Detection**: Real-time detection of check, checkmate, stalemate, and insufficient material draw conditions
- **Visual Move Feedback**: Highlighted valid moves with gray dots, capture indicators, last move highlights, and pulsing check warnings
- **Move History**: Full algebraic notation log for all moves played, grouped by move number
- **Captured Pieces Tracker**: Visual display of captured pieces for both sides, sorted by piece value
- **Pawn Promotion Modal**: Elegant modal picker for choosing promotion piece (Queen, Rook, Bishop, Knight)
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop and mobile devices
- **Accessibility**: ARIA attributes, semantic HTML, focus rings, and keyboard-friendly interactions

## Live Demo

[♟️ View Live Demo](https://basic-chess-board-logic.netlify.app/)

## Screenshots

### Main Game Screen

The main game screen features an 8x8 chess board with file/rank coordinate labels, a sidebar displaying game status, move history, and captured pieces for both sides.

### Piece Selection & Valid Moves

When a piece is selected, valid moves are highlighted with animated gray dots on empty squares and rings on capturable squares. The selected piece gets a sky-blue ring with a subtle scale effect.

### Pawn Promotion

When a pawn reaches the last rank, a modal overlay appears with a backdrop blur effect, allowing the player to choose between Queen, Rook, Bishop, or Knight.

## Technologies

- **React 19**: Modern UI components with hooks and memoization for optimal rendering
- **TypeScript 5**: Full type safety with dedicated type definitions for pieces, positions, moves, and game state
- **Vite 7**: Lightning-fast build tool with HMR for rapid development
- **Zustand 5**: Lightweight global state management for the entire game state
- **React Router 7**: Client-side routing infrastructure
- **Tailwind CSS 4**: Utility-first CSS framework with responsive design utilities and custom animations

## Installation

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/Serkanbyx/basic-chess-board-logic.git
cd basic-chess-board-logic
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. Open the application in your browser
2. **Select a piece** by clicking on it — valid moves will be highlighted on the board
3. **Make a move** by clicking on any highlighted square
4. The game automatically alternates turns between White and Black
5. **Special moves** like castling, en passant, and pawn promotion are fully supported
6. Monitor the game through the **sidebar** which shows current turn, game status, move history, and captured pieces
7. When the game ends (checkmate, stalemate, or draw), click **Play Again** to start a new game

## How It Works?

### Move Validation Engine

The core move validation logic is implemented as a pure utility module, completely decoupled from UI and state management:

```typescript
// Raw move generation for each piece type
generatePawnMoves(position, board, enPassantTarget)
generateKnightMoves(position, board)
generateSlidingMoves(position, board, directions)  // Rook, Bishop, Queen
generateKingMoves(position, board, gameState)       // Includes castling
```

### Legal Move Filtering

Every pseudo-legal move is validated by simulating the move and checking if it leaves the own king in check:

```typescript
// Filters out moves that would leave the king in check
const legalMoves = pseudoLegalMoves.filter(move => {
  const simulatedBoard = applyMove(board, move);
  return !isInCheck(simulatedBoard, currentColor);
});
```

### Game State Detection

```typescript
isInCheck(board, color)           // King under attack?
hasLegalMoves(board, color)       // Any legal moves available?
isInsufficientMaterial(board)     // K vs K, K+B vs K, K+N vs K
```

- **Checkmate**: In check + no legal moves
- **Stalemate**: Not in check + no legal moves
- **Draw**: Insufficient material to force checkmate

### Algebraic Notation

Moves are converted to standard algebraic notation including special annotations:

```
e4, Nf3, Bxe5, O-O, O-O-O, exd6 e.p., e8=Q, Qh4#, Rfe1+
```

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Board.tsx            # 8x8 chess board grid with memoization
│   ├── Square.tsx           # Individual square with visual states
│   ├── ChessPiece.tsx       # Piece rendering with Unicode symbols
│   ├── GameInfo.tsx         # Turn indicator & game status badges
│   ├── MoveHistory.tsx      # Algebraic notation move log
│   ├── CapturedPieces.tsx   # Captured pieces display sorted by value
│   └── PromotionModal.tsx   # Accessible pawn promotion picker
├── constants/
│   └── board.ts             # Initial board setup & piece symbols
├── pages/
│   └── GamePage.tsx         # Main game layout with responsive grid
├── store/
│   └── useGameStore.ts      # Zustand store with all game actions
├── types/
│   └── chess.ts             # TypeScript type definitions
├── utils/
│   ├── moveValidation.ts    # Pure move generation & validation
│   └── notation.ts          # Algebraic notation converter
├── App.tsx                  # Root component with routing
├── main.tsx                 # Application entry point
└── index.css                # Global styles, Tailwind imports & animations
```

## Customization

### Add Custom Animations

You can modify piece animations in `index.css`:

```css
/* Custom piece hover effect */
.piece-hover:hover {
  transform: scale(1.15);
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

/* Custom check warning animation */
@keyframes king-in-check {
  0%, 100% { box-shadow: inset 0 0 20px rgba(239, 68, 68, 0.6); }
  50% { box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.9); }
}
```

### Change Board Colors

Modify square colors in the `Square.tsx` component by updating the Tailwind classes:

```typescript
// Light square: bg-amber-100 → your color
// Dark square: bg-amber-800 → your color
```

### Adjust Board Size

Update the responsive board sizing in `Board.tsx`:

```typescript
// Default: w-[min(85vw,480px)] md:w-[480px]
// Larger:  w-[min(90vw,600px)] md:w-[600px]
```

## Features in Detail

### Completed Features

- ✅ Full piece movement validation for all 6 piece types
- ✅ King-side and queen-side castling with all prerequisite checks
- ✅ En passant capture detection and execution
- ✅ Pawn promotion with modal picker (Queen, Rook, Bishop, Knight)
- ✅ Real-time check detection with visual king highlight
- ✅ Checkmate and stalemate detection
- ✅ Insufficient material draw detection (K vs K, K+B vs K, K+N vs K)
- ✅ Algebraic notation move history
- ✅ Captured pieces tracking and display
- ✅ Last move highlighting
- ✅ Responsive design for mobile and desktop
- ✅ Accessibility with ARIA attributes and semantic HTML
- ✅ Memoized components for optimized rendering

### Future Features

- [ ] 🔮 50-move rule draw detection
- [ ] 🔮 Threefold repetition detection
- [ ] 🔮 Move timer / clock for each player
- [ ] 🔮 Undo / redo move functionality
- [ ] 🔮 PGN import and export
- [ ] 🔮 AI opponent integration
- [ ] 🔮 Sound effects for moves and captures
- [ ] 🔮 Dark / light theme toggle

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes with clear messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `refactor:` for code refactoring
   - `docs:` for documentation updates
   - `chore:` for maintenance tasks
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Developer

**Serkan Bayraktar**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Acknowledgments

- **React Team** for the powerful UI framework
- **Zustand** for simple and effective state management
- **Tailwind CSS** for rapid UI development
- **Vite** for the blazing-fast development experience
- **Unicode Chess Symbols** for beautiful piece rendering without external assets

## Contact

- **Issues**: [GitHub Issues](https://github.com/Serkanbyx/basic-chess-board-logic/issues)
- **Email**: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- **Website**: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
