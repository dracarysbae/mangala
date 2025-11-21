export enum Player {
  BOTTOM = 'BOTTOM', // The local user
  TOP = 'TOP'        // The opponent (AI or Friend)
}

export interface GameState {
  board: number[]; // Indices 0-5 (Bottom), 6 (Bottom Store), 7-12 (Top), 13 (Top Store)
  currentPlayer: Player;
  isGameOver: boolean;
  winner: Player | 'DRAW' | null;
  lastMoveIndices: number[]; // For highlighting
  message: string;
}

export enum GameMode {
  MENU = 'MENU',
  PVP_LOCAL = 'PVP_LOCAL',
  PVP_ONLINE = 'PVP_ONLINE', // Simulated
  VS_AI = 'VS_AI',
  TUTORIAL = 'TUTORIAL'
}

export interface TutorialStep {
  title: string;
  description: string;
  image?: string; // Optional placeholder for visual aid
}

export interface StoneStyle {
  color: string;
  offsetX: number;
  offsetY: number;
  rotation: number;
}