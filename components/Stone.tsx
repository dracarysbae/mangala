import React from 'react';
import { StoneStyle } from '../types';

interface StoneProps {
  styleParams: StoneStyle;
}

const Stone: React.FC<StoneProps> = ({ styleParams }) => {
  // Determine base color class and map to a hex for gradient simulation if needed,
  // or just rely on the parent passing the tailwind class.
  // Here we apply a glass overlay effect.
  
  return (
    <div
      className={`absolute rounded-full stone-shadow stone-glass ${styleParams.color} border border-white/10 transition-all duration-500 ease-out`}
      style={{
        width: '14px',
        height: '14px',
        transform: `translate(${styleParams.offsetX}px, ${styleParams.offsetY}px) rotate(${styleParams.rotation}deg)`,
        zIndex: 10,
        boxShadow: '1px 2px 4px rgba(0,0,0,0.5)'
      }}
    >
      {/* Highlight for 3D effect */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-white opacity-30 blur-[1px]"></div>
    </div>
  );
};

export default React.memo(Stone);