import { GoogleGenAI } from "@google/genai";
import { GameState, Player } from "../types";
import { TOP_PITS } from "../constants";

// Initialize Gemini
// Note: In a real app, never expose keys on frontend. This is for the requested demo structure.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getBestMove = async (gameState: GameState): Promise<number> => {
  // Fallback AI (Random valid move) if API key is missing or fails
  const validMoves = TOP_PITS.filter(i => gameState.board[i] > 0);
  const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

  if (!process.env.API_KEY) {
    console.warn("No API Key provided, using random AI");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Fake thinking
    return randomMove;
  }

  try {
    const prompt = `
      You are playing Turkish Mangala. You are the TOP player (indices 7-12).
      The current board state is (indices 0-13): ${JSON.stringify(gameState.board)}.
      Indices 0-5 are opponent pits. Index 6 is opponent store.
      Indices 7-12 are your pits. Index 13 is your store.
      Your goal is to maximize your score in index 13.
      Rules:
      1. Distribute stones counter-clockwise.
      2. If last stone in own store, play again.
      3. If last stone in opponent pit makes count even, capture.
      4. If last stone in own empty pit, capture opposite.
      
      Return ONLY a valid index from [7, 8, 9, 10, 11, 12] representing your move.
      Do not return JSON. Just the number.
      Pick the move that maximizes immediate gain or gives an extra turn.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    if (text) {
        const move = parseInt(text.trim());
        if (TOP_PITS.includes(move) && gameState.board[move] > 0) {
            return move;
        }
    }
    return randomMove;
  } catch (error) {
    console.error("AI Error:", error);
    return randomMove;
  }
};