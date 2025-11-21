import { GameState, Player } from '../types';
import { 
  BOTTOM_PITS, 
  BOTTOM_STORE, 
  INITIAL_STONES, 
  TOP_PITS, 
  TOP_STORE, 
  TOTAL_PITS 
} from '../constants';

export const createInitialState = (): GameState => {
  // Initialize 4 stones in regular pits, 0 in stores
  const board = new Array(TOTAL_PITS).fill(INITIAL_STONES);
  board[BOTTOM_STORE] = 0;
  board[TOP_STORE] = 0;

  return {
    board,
    currentPlayer: Player.BOTTOM,
    isGameOver: false,
    winner: null,
    lastMoveIndices: [],
    message: "Oyun Başladı! Hamle yapmak için bir kuyu seç."
  };
};

export const checkWinner = (board: number[]): { gameOver: boolean; winner: Player | 'DRAW' | null; finalBoard: number[] } => {
  const bottomSideEmpty = BOTTOM_PITS.every(i => board[i] === 0);
  const topSideEmpty = TOP_PITS.every(i => board[i] === 0);

  if (!bottomSideEmpty && !topSideEmpty) {
    return { gameOver: false, winner: null, finalBoard: board };
  }

  const finalBoard = [...board];
  
  // Rule: The side that finishes first takes all remaining stones from the opponent
  if (bottomSideEmpty) {
    let remaining = 0;
    TOP_PITS.forEach(i => {
      remaining += finalBoard[i];
      finalBoard[i] = 0;
    });
    finalBoard[BOTTOM_STORE] += remaining;
  } else {
    let remaining = 0;
    BOTTOM_PITS.forEach(i => {
      remaining += finalBoard[i];
      finalBoard[i] = 0;
    });
    finalBoard[TOP_STORE] += remaining;
  }

  const bottomScore = finalBoard[BOTTOM_STORE];
  const topScore = finalBoard[TOP_STORE];

  let winner: Player | 'DRAW' | null = null;
  if (bottomScore > topScore) winner = Player.BOTTOM;
  else if (topScore > bottomScore) winner = Player.TOP;
  else winner = 'DRAW';

  return { gameOver: true, winner, finalBoard };
};

export const makeMove = (currentState: GameState, pitIndex: number): GameState => {
  const { board, currentPlayer } = currentState;
  
  // Validation
  if (currentState.isGameOver) return currentState;
  if (board[pitIndex] === 0) return currentState; // Cannot pick empty pit

  // Check if pit belongs to current player
  const isBottomTurn = currentPlayer === Player.BOTTOM;
  if (isBottomTurn && !BOTTOM_PITS.includes(pitIndex)) return currentState;
  if (!isBottomTurn && !TOP_PITS.includes(pitIndex)) return currentState;

  const nextBoard = [...board];
  let stones = nextBoard[pitIndex];
  let currentIndex = pitIndex;
  const affectedIndices = [pitIndex];

  // Rule: Picking up stones
  if (stones === 1) {
    nextBoard[pitIndex] = 0;
    currentIndex = (currentIndex + 1) % TOTAL_PITS;
    // Skip opponent store
    if (isBottomTurn && currentIndex === TOP_STORE) currentIndex = 0;
    if (!isBottomTurn && currentIndex === BOTTOM_STORE) currentIndex = (currentIndex + 1) % TOTAL_PITS;
    
    nextBoard[currentIndex]++;
    affectedIndices.push(currentIndex);
  } else {
    // Leave one stone, pick up the rest
    nextBoard[pitIndex] = 1;
    stones--; // One left behind
    
    while (stones > 0) {
      currentIndex = (currentIndex + 1) % TOTAL_PITS;
      
      // Skip opponent store
      if (isBottomTurn && currentIndex === TOP_STORE) continue;
      if (!isBottomTurn && currentIndex === BOTTOM_STORE) continue;

      nextBoard[currentIndex]++;
      stones--;
      affectedIndices.push(currentIndex);
    }
  }

  // --- End of turn logic ---
  
  let nextPlayer = isBottomTurn ? Player.TOP : Player.BOTTOM;
  let message = "";

  // 1. Last stone in own store? -> Play Again
  const landedInOwnStore = isBottomTurn ? currentIndex === BOTTOM_STORE : currentIndex === TOP_STORE;
  
  if (landedInOwnStore) {
    nextPlayer = currentPlayer; // Keep turn
    message = "Son taş hazineye! Tekrar oyna.";
  } else {
    // 2. Last stone in opponent pit making it even? -> Capture
    const landedInOpponentSide = isBottomTurn ? TOP_PITS.includes(currentIndex) : BOTTOM_PITS.includes(currentIndex);
    
    if (landedInOpponentSide && nextBoard[currentIndex] % 2 === 0) {
      const captured = nextBoard[currentIndex];
      nextBoard[currentIndex] = 0;
      nextBoard[isBottomTurn ? BOTTOM_STORE : TOP_STORE] += captured;
      message = "Çift yaptın ve taşları kaptın!";
    }
    
    // 3. Last stone in own empty pit (was empty before drop, so now 1) + Opposite not empty? -> Capture Both
    // Note: logic says nextBoard[currentIndex] is 1 now.
    const landedInOwnSide = isBottomTurn ? BOTTOM_PITS.includes(currentIndex) : TOP_PITS.includes(currentIndex);
    if (landedInOwnSide && nextBoard[currentIndex] === 1) {
      // Calculate opposite pit index
      // Total 14. Index i opposite is 12 - i (roughly, for 0-5 and 7-12 mapping)
      // Map: 0<->12, 1<->11, 2<->10, 3<->9, 4<->8, 5<->7
      const oppositeIndex = 12 - currentIndex;
      
      if (nextBoard[oppositeIndex] > 0) {
         const ownStone = nextBoard[currentIndex];
         const oppositeStones = nextBoard[oppositeIndex];
         
         nextBoard[currentIndex] = 0;
         nextBoard[oppositeIndex] = 0;
         nextBoard[isBottomTurn ? BOTTOM_STORE : TOP_STORE] += (ownStone + oppositeStones);
         message = "Kurnazca! Karşı kuyuyu boşalttın.";
      }
    }
  }

  if (!message) {
    message = nextPlayer === Player.BOTTOM ? "Sıra sende." : "Rakip düşünüyor...";
  }

  const checkResult = checkWinner(nextBoard);

  return {
    board: checkResult.finalBoard,
    currentPlayer: checkResult.gameOver ? currentPlayer : nextPlayer, // Winner keeps flair
    isGameOver: checkResult.gameOver,
    winner: checkResult.winner,
    lastMoveIndices: affectedIndices,
    message: checkResult.gameOver ? (checkResult.winner === Player.BOTTOM ? "Kazandın!" : checkResult.winner === Player.TOP ? "Kaybettin..." : "Berabere!") : message
  };
};