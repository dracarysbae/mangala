import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import Tutorial from './components/Tutorial';
import { GameState, GameMode, Player } from './types';
import { createInitialState, makeMove } from './services/gameLogic';
import { getBestMove } from './services/aiService';
import { Play, Users, Cpu, HelpCircle, Trophy, LogOut, Wifi } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MENU);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // First Time Load Check
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('mangala_tutorial_seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('mangala_tutorial_seen', 'true');
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('mangala_tutorial_seen', 'true');
  };

  // Effect for AI turn
  useEffect(() => {
    const runAiTurn = async () => {
      if (gameMode === GameMode.VS_AI && 
          gameState.currentPlayer === Player.TOP && 
          !gameState.isGameOver &&
          !isThinking) {
        
        setIsThinking(true);
        // Artificial delay for realism
        const delay = Math.random() * 1000 + 500; 
        
        try {
            const bestMove = await getBestMove(gameState);
            setTimeout(() => {
                setGameState(prev => makeMove(prev, bestMove));
                setIsThinking(false);
            }, delay);
        } catch (e) {
            setIsThinking(false);
        }
      }
    };

    runAiTurn();
  }, [gameState.currentPlayer, gameMode, gameState.isGameOver, gameState, isThinking]);

  const handlePitClick = (index: number) => {
    if (isThinking || gameState.isGameOver) return;

    // Safety check for player turn vs index owner
    const isPlayerOne = index >= 0 && index <= 5;
    const isPlayerTwo = index >= 7 && index <= 12;

    if (gameMode === GameMode.VS_AI) {
      if (gameState.currentPlayer === Player.BOTTOM && isPlayerOne) {
        setGameState(prev => makeMove(prev, index));
      }
    } else {
      // Local PvP or "Online" Simulation
      if ((gameState.currentPlayer === Player.BOTTOM && isPlayerOne) ||
          (gameState.currentPlayer === Player.TOP && isPlayerTwo)) {
        setGameState(prev => makeMove(prev, index));
      }
    }
  };

  const resetGame = (mode: GameMode) => {
    setGameState(createInitialState());
    setGameMode(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0503] via-[#2d1e17] to-[#000000] text-white flex flex-col items-center overflow-hidden relative selection:bg-amber-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
      <div className="absolute w-[800px] h-[800px] bg-amber-700/10 rounded-full blur-[150px] top-[-200px] left-[-200px] pointer-events-none"></div>
      <div className="absolute w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[150px] bottom-[-100px] right-[-100px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full p-4 sm:p-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300/50">
              <Trophy className="text-black drop-shadow-sm" size={20} />
           </div>
           <h1 className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
             Mystic Mangala
           </h1>
        </div>
        
        <button 
          onClick={() => setShowTutorial(true)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 active:scale-95"
        >
          <HelpCircle className="text-amber-200" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl flex flex-col items-center justify-center p-4 relative z-10">
        
        {gameMode === GameMode.MENU && (
          <div className="flex flex-col gap-6 w-full max-w-md animate-fade-in">
            <div className="text-center mb-4 sm:mb-8">
               <p className="text-amber-100/70 text-lg font-cinzel tracking-widest uppercase">Türk Zeka ve Strateji Oyunu</p>
            </div>

            <button 
              onClick={() => resetGame(GameMode.VS_AI)}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-800 to-amber-950 p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
            >
              <div className="relative flex items-center justify-between bg-[#1a0f0a] backdrop-blur-md px-6 py-6 rounded-xl h-full group-hover:bg-[#25160e] transition-colors border-t border-white/10">
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-full bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                    <Cpu size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white font-cinzel">Yapay Zeka</h3>
                    <p className="text-amber-400/50 text-sm">Gemini Usta'ya meydan oku</p>
                  </div>
                </div>
                <Play className="text-white/30 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
              </div>
            </button>

            <button 
              onClick={() => resetGame(GameMode.PVP_LOCAL)}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
            >
               <div className="relative flex items-center justify-between bg-[#0a1a12] backdrop-blur-md px-6 py-6 rounded-xl h-full group-hover:bg-[#0e2117] transition-colors border-t border-white/10">
                <div className="flex items-center gap-5">
                   <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors">
                    <Users size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white font-cinzel">Arkadaşınla</h3>
                    <p className="text-emerald-400/50 text-sm">Aynı cihazda karşılıklı</p>
                  </div>
                </div>
                <Play className="text-white/30 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
              </div>
            </button>

             <button 
              onClick={() => resetGame(GameMode.PVP_ONLINE)}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-800 to-indigo-950 p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
            >
               <div className="relative flex items-center justify-between bg-[#0f0f24] backdrop-blur-md px-6 py-6 rounded-xl h-full group-hover:bg-[#151530] transition-colors border-t border-white/10">
                <div className="flex items-center gap-5">
                   <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500/20 transition-colors">
                    <Wifi size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white font-cinzel">Online</h3>
                    <p className="text-indigo-400/50 text-sm">Uzaktaki arkadaşınla</p>
                  </div>
                </div>
                <Play className="text-white/30 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        )}

        {gameMode !== GameMode.MENU && (
          <div className="w-full flex flex-col items-center gap-6 animate-scale-in">
            
            {/* Status Bar */}
            <div className="flex items-center gap-4 px-8 py-4 bg-[#1a0f0a]/80 backdrop-blur-xl rounded-2xl border border-amber-900/30 shadow-2xl max-w-full mx-4">
               <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${gameState.currentPlayer === Player.BOTTOM ? 'bg-emerald-500 text-emerald-500 animate-pulse' : 'bg-gray-700 text-transparent'}`}></div>
               <span className="text-base sm:text-lg font-cinzel text-amber-100/90 min-w-[150px] text-center tracking-wide">{gameState.message}</span>
               <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${gameState.currentPlayer === Player.TOP ? 'bg-amber-500 text-amber-500 animate-pulse' : 'bg-gray-700 text-transparent'}`}></div>
            </div>

            {gameMode === GameMode.PVP_ONLINE && (
               <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-indigo-900/90 px-4 py-1 rounded-full text-xs border border-indigo-500/30 text-indigo-200">
                  Simülasyon Modu
               </div>
            )}

            <Board 
              gameState={gameState} 
              onPitClick={handlePitClick} 
              playerType={Player.BOTTOM} 
            />

            <div className="flex gap-4 mt-4 z-20">
              <button 
                onClick={() => setGameMode(GameMode.MENU)}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-red-950/30 text-red-400 border border-red-900/30 hover:bg-red-900/50 transition-colors backdrop-blur-sm"
              >
                <LogOut size={18} /> Menü
              </button>
              
              {gameState.isGameOver && (
                 <button 
                 onClick={() => setGameState(createInitialState())}
                 className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:scale-105 transition-all border border-emerald-400/20"
               >
                 <Play size={18} /> Tekrar Oyna
               </button>
              )}
            </div>
          </div>
        )}
      </main>

      {showTutorial && <Tutorial onClose={handleCloseTutorial} onSkip={handleSkipTutorial} />}

    </div>
  );
};

export default App;