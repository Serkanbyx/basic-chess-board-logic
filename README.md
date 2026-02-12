# Basic Chess Board Logic

An interactive chess board application with complete piece movement logic, built with modern web technologies.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)

## Features

- **Complete Chess Rules** — All standard piece movements including castling, en passant, and pawn promotion
- **Check & Checkmate Detection** — Real-time detection of check, checkmate, stalemate, and draw conditions
- **Visual Feedback** — Highlighted valid moves, last move indicators, and check warnings
- **Move History** — Algebraic notation for all moves played
- **Captured Pieces** — Track captured pieces for both sides
- **Responsive Design** — Works on desktop and mobile devices

## Tech Stack

| Technology | Purpose |
| --- | --- |
| **React 19** | UI components |
| **TypeScript** | Type safety |
| **Vite 7** | Build tool & dev server |
| **Zustand** | Global state management |
| **React Router** | Client-side routing |
| **Tailwind CSS 4** | Utility-first styling |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/basic-chess-board-logic.git
cd basic-chess-board-logic

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Board.tsx        # 8x8 chess board grid
│   ├── Square.tsx       # Individual board square
│   ├── ChessPiece.tsx   # Piece rendering with Unicode symbols
│   ├── GameInfo.tsx     # Turn indicator & game status
│   ├── MoveHistory.tsx  # Algebraic notation move log
│   ├── CapturedPieces.tsx  # Captured pieces display
│   └── PromotionModal.tsx  # Pawn promotion picker
├── constants/
│   └── board.ts         # Board setup & piece symbols
├── pages/
│   └── GamePage.tsx     # Main game layout
├── store/
│   └── useGameStore.ts  # Zustand state management
├── types/
│   └── chess.ts         # TypeScript type definitions
├── utils/
│   ├── moveValidation.ts  # Move generation & validation
│   └── notation.ts      # Algebraic notation converter
├── App.tsx              # Root component with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles & Tailwind imports
```

## How It Works

1. **Click** a piece to select it — valid moves are highlighted
2. **Click** a highlighted square to move the piece
3. The game alternates turns between White and Black
4. Special moves (castling, en passant, promotion) are fully supported
5. The game detects check, checkmate, stalemate, and insufficient material draws

## Deploy

This project is configured for **Netlify** deployment. Push to your repository and connect it to Netlify, or use the Netlify CLI:

```bash
npx netlify-cli deploy --prod
```

## License

MIT
