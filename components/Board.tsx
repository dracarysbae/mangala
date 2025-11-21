import React from 'react';
import Pit from './Pit';
import { GameState, Player } from '../types';
import { BOTTOM_PITS, TOP_PITS, BOTTOM_STORE, TOP_STORE } from '../constants';

interface BoardProps {
  gameState: GameState;
  onPitClick: (index: number) => void;
  playerType: Player; // Who is the local user?
}

const Board: React.FC<BoardProps> = ({ gameState, onPitClick, playerType }) => {
  const { board, currentPlayer, lastMoveIndices } = gameState;

  // Helper to determine if a pit is clickable
  const canClick = (index: number) => {
    if (gameState.isGameOver) return false;
    if (playerType === Player.BOTTOM && currentPlayer === Player.BOTTOM && BOTTOM_PITS.includes(index) && board[index] > 0) return true;
    // Allow Local PvP interactions for both sides if needed, but usually we rotate board. 
    // For this specific implementation, we assume 'playerType' is always BOTTOM (User) vs AI/Net.
    // For Pass & Play, we might toggle this, but keeping it simple:
    // If it's Bottom's turn, Bottom pits are clickable.
    // If it's Top's turn AND we are in Pass&Play mode (handled by parent logic), Top pits clickable.
    return false;
  };

  // For local PvP, we want both sides interactable when it's their turn.
  // The parent component will control if onPitClick actually fires based on mode.
  const isPitActive = (index: number) => {
     if (gameState.isGameOver) return false;
     if (board[index] === 0) return false;
     if (currentPlayer === Player.BOTTOM && BOTTOM_PITS.includes(index)) return true;
     if (currentPlayer === Player.TOP && TOP_PITS.includes(index)) return true;
     return false;
  };

  return (
    <div className="relative p-2 sm:p-8 rounded-3xl wood-texture shadow-2xl border-8 border-[#2d1e17] max-w-4xl w-full mx-auto select-none transform transition-transform">
      
      {/* Decorative Inlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-2 bg-[#2d1e17] rounded-b-xl opacity-50"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-2 bg-[#2d1e17] rounded-t-xl opacity-50"></div>

      <div className="flex justify-between items-stretch gap-4 sm:gap-8">
        
        {/* Top Store (Left side usually for Top player in this view) */}
        {/* Actually in Mangala, typically your store is on your RIGHT. 
            So for Top Player (facing us), their store is on OUR Left (Index 13).
            For Bottom Player, their store is on OUR Right (Index 6).
        */}
        <div className="flex flex-col justify-center">
          <Pit 
            index={TOP_STORE} 
            count={board[TOP_STORE]} 
            isStore 
            highlight={lastMoveIndices.includes(TOP_STORE)}
          />
          <div className="text-center mt-2 text-amber-500/50 font-cinzel text-sm">RAKİP</div>
        </div>

        {/* Rows Container */}
        <div className="flex-1 flex flex-col justify-center gap-4 sm:gap-8">
          
          {/* Top Row (Opponent) - Indices 12 down to 7 (Left to Right visually) */}
          <div className="flex justify-around items-center">
            {[...TOP_PITS].reverse().map((pitIndex) => (
              <Pit
                key={pitIndex}
                index={pitIndex}
                count={board[pitIndex]}
                isInteractable={isPitActive(pitIndex)}
                onClick={() => onPitClick(pitIndex)}
                highlight={lastMoveIndices.includes(pitIndex)}
                label={pitIndex.toString()} // Debug label, optional style
              />
            ))}
          </div>

          {/* Bottom Row (Player) - Indices 0 to 5 */}
          <div className="flex justify-around items-center">
            {BOTTOM_PITS.map((pitIndex) => (
              <Pit
                key={pitIndex}
                index={pitIndex}
                count={board[pitIndex]}
                isInteractable={isPitActive(pitIndex)}
                onClick={() => onPitClick(pitIndex)}
                highlight={lastMoveIndices.includes(pitIndex)}
                label={(pitIndex + 1).toString()}
              />
            ))}
          </div>

        </div>

        {/* Bottom Store (Right side) */}
        <div className="flex flex-col justify-center">
          <div className="text-center mb-2 text-emerald-500/50 font-cinzel text-sm">SEN</div>
          <Pit 
            index={BOTTOM_STORE} 
            count={board[BOTTOM_STORE]} 
            isStore 
            highlight={lastMoveIndices.includes(BOTTOM_STORE)}
          />
        </div>
      </div>
    </div>
  );
};

export default Board;