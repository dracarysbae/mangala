import React, { useState } from 'react';
import { TUTORIAL_STEPS } from '../constants';
import { ChevronRight, ChevronLeft, SkipForward, CheckCircle2 } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
  onSkip: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose, onSkip }) => {
  const [step, setStep] = useState(0);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');

  const handleNext = () => {
    if (step < TUTORIAL_STEPS.length - 1) {
      setSlideDir('right');
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setSlideDir('left');
      setStep(step - 1);
    }
  };

  const currentStep = TUTORIAL_STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 animate-fade-in">
      {/* Card Container */}
      <div className="relative bg-[#1a110d] border border-amber-700/40 rounded-3xl max-w-lg w-full shadow-[0_0_60px_rgba(217,119,6,0.15)] overflow-hidden flex flex-col h-auto min-h-[500px]">
        
        {/* Texture & Ambient Light */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-600/20 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Top Bar */}
        <div className="relative z-10 px-6 py-4 flex justify-between items-center bg-black/20 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1">
              {TUTORIAL_STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-6 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'w-1.5 bg-gray-700'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-amber-500/70 font-cinzel uppercase tracking-widest ml-2">Adım {step + 1} / {TUTORIAL_STEPS.length}</span>
          </div>
          
          <button 
            onClick={onSkip} 
            className="group flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-amber-400 transition-colors uppercase tracking-wider"
          >
            <span className="hidden sm:inline">Öğreticiyi Geç</span>
            <span className="sm:hidden">Geç</span>
            <SkipForward size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 p-8 flex flex-col items-center justify-center text-center overflow-hidden">
          <div 
            key={step}
            className={`flex-1 flex flex-col items-center justify-center ${slideDir === 'right' ? 'animate-slide-in' : 'animate-slide-in'}`}
          >
            {/* Decorative Number */}
            <div className="mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-900/40 to-black border border-amber-500/30 flex items-center justify-center shadow-inner transform rotate-3">
               <span className="text-4xl font-cinzel text-amber-500 drop-shadow-lg">{step + 1}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400 mb-5 font-cinzel font-bold drop-shadow-sm">
              {currentStep.title}
            </h3>
            
            <div className="bg-black/30 p-6 rounded-xl border border-white/5 shadow-lg backdrop-blur-sm w-full">
              <p className="text-gray-300 leading-relaxed text-lg font-lato">
                {currentStep.description}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="relative z-10 p-6 bg-[#0f0a08]/80 backdrop-blur-md border-t border-amber-900/20 flex justify-between items-center gap-4">
          
          <button 
            onClick={handlePrev}
            disabled={step === 0}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border
              ${step === 0 
                ? 'border-gray-800 text-gray-700 cursor-not-allowed bg-transparent' 
                : 'border-amber-900/50 text-amber-500 hover:bg-amber-900/20 hover:border-amber-500/50 hover:scale-105'}
            `}
          >
            <ChevronLeft size={24} />
          </button>

          {step === TUTORIAL_STEPS.length - 1 ? (
             <button 
               onClick={onClose}
               className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white h-12 rounded-xl font-bold transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 font-cinzel tracking-wider text-sm sm:text-base"
             >
               Oyuna Başla <CheckCircle2 size={20} />
             </button>
          ) : (
            <button 
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white h-12 rounded-xl font-bold transition-all shadow-[0_4px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 font-cinzel tracking-wider text-sm sm:text-base"
            >
              Devam Et <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;