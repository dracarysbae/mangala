import React, { useMemo } from 'react';
import Stone from './Stone';
import { StoneStyle } from '../types';
import { STONE_COLORS } from '../constants';

interface PitProps {
  count: number;
  index: number;
  isStore?: boolean;
  onClick?: () => void;
  isInteractable?: boolean;
  highlight?: boolean;
  label?: string;
}

const Pit: React.FC<PitProps> = ({ count, index, isStore = false, onClick, isInteractable, highlight, label }) => {
  
  const stones = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Distribute randomly within the circle/oval
      const radiusX = isStore ? 24 : 14;
      const radiusY = isStore ? 64 : 14;
      
      // Better distribution to avoid perfect center clutter
      const r = Math.sqrt(Math.random()) * 0.9; 
      const theta = Math.random() * 2 * Math.PI;
      
      const offsetX = r * radiusX * Math.cos(theta);
      const offsetY = r * radiusY * Math.sin(theta);

      return {
        color: STONE_COLORS[i % STONE_COLORS.length],
        offsetX,
        offsetY,
        rotation: Math.random() * 360
      } as StoneStyle;
    });
  }, [count, isStore]);

  return (
    <div className="flex flex-col items-center gap-2 transition-transform duration-200">
      {label && !isStore && (
        <span className="text-[10px] sm:text-xs text-amber-200/40 font-cinzel tracking-widest">{label}</span>
      )}
      <div
        onClick={isInteractable ? onClick : undefined}
        className={`
          relative flex items-center justify-center
          ${isStore ? 'w-20 h-64 sm:w-24 sm:h-80 rounded-[3rem]' : 'w-16 h-16 sm:w-20 sm:h-20 rounded-full'}
          ${highlight ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black/50' : ''}
          ${isInteractable ? 'cursor-pointer hover:brightness-110 active:scale-95' : ''}
          bg-[#1a0b05]
          pit-shadow
          border border-white/5
          transition-all duration-300
        `}
        style={{
           // Subtle inner texture
           backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")',
           backgroundBlendMode: 'overlay',
           backgroundSize: '200px'
        }}
      >
        {/* Stone Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           {stones.map((s, i) => (
             <Stone key={`${index}-${i}`} styleParams={s} />
           ))}
        </div>
        
        {/* Count Badge - Floating with glow */}
        <div className={`
          absolute ${isStore ? 'bottom-4' : '-bottom-2'} 
          bg-black/80 text-amber-100 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30
          shadow-[0_0_10px_rgba(0,0,0,0.8)]
          backdrop-blur-sm
          z-20
        `}>
          {count}
        </div>
      </div>
    </div>
  );
};

export default Pit;