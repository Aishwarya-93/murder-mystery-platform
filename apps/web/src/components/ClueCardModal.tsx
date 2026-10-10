import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { Award, Check, X } from 'lucide-react';

export const ClueCardModal: React.FC = () => {
  const { newlyUnlockedClue, closeClueModal } = useGameStore();
  const [wipingDone, setWipingDone] = useState(false);

  useEffect(() => {
    if (newlyUnlockedClue) {
      setWipingDone(false);
      const timer = setTimeout(() => {
        setWipingDone(true);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlockedClue]);

  // Escape key to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeClueModal();
  }, [closeClueModal]);

  useEffect(() => {
    if (newlyUnlockedClue) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [newlyUnlockedClue, handleKeyDown]);

  if (!newlyUnlockedClue) return null;

  return (
    // Backdrop: full-screen, scrollable vertically so tall content is accessible
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clue-modal-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) closeClueModal(); }}
    >
      {/* my-auto centres the card when there is spare vertical room */}
      <div className="my-auto w-full max-w-xl min-w-[320px]">
        <div className="relative paper-sheet w-full rounded-lg text-ink shadow-[0_20px_60px_rgba(0,0,0,0.85)] border-4 border-[#8c6d48] animate-in fade-in zoom-in-95 duration-200">
          {/* Red Thumbtack on top center */}
          <div className="thumbtack absolute -top-3 left-1/2 -translate-x-1/2 z-20" />

          {/* Sticky header with close button — always reachable even on short screens */}
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 p-5 pb-3 border-b-2 border-ink/20 paper-sheet rounded-t-lg">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-red-800 shrink-0" />
              <span
                id="clue-modal-title"
                className="font-typewriter text-xs sm:text-sm font-bold tracking-widest text-red-950 uppercase"
              >
                CASE #{String(newlyUnlockedClue.level).padStart(2, '0')} // FORENSIC EXHIBIT
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="stamp stamp-closed text-xs">EVIDENCE UNLOCKED</span>
              <button
                onClick={closeClueModal}
                aria-label="Close"
                className="p-1.5 rounded-full hover:bg-ink/10 text-ink/70 hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content body */}
          <div className="p-5 sm:p-7 space-y-4">
            <h2 className="text-xl sm:text-2xl font-typewriter font-bold text-zinc-950 leading-tight">
              {newlyUnlockedClue.title}
            </h2>

            {/* Clue Body with Redaction Wipe Reveal */}
            <div className="relative font-serif text-sm sm:text-base leading-relaxed bg-manila/60 p-5 rounded-lg border border-ink/20 whitespace-pre-wrap min-h-[130px] shadow-inner">
              {!wipingDone && (
                <div
                  className="absolute inset-0 bg-[#120f0d] text-amber-400 font-mono flex items-center justify-center text-xs tracking-widest uppercase overflow-hidden animate-redact-wipe select-none z-10 p-4 text-center rounded-lg border border-amber-900/60"
                  style={{ transformOrigin: 'right center' }}
                >
                  [ TOP SECRET ARCHIVE EXHIBIT • DECRYPTING REDACTED CLUSTERS ]
                </div>
              )}
              <div className="text-zinc-950 font-medium">
                {newlyUnlockedClue.text}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-ink/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-zinc-600 font-mono italic">
                This exhibit has been permanently pinned to your squad's Evidence Corkboard.
              </span>
              <button
                onClick={closeClueModal}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-b from-[#8b261e] to-[#6d1b14] hover:from-[#a02c23] hover:to-[#7c1f17] text-[#fdfbf7] font-serif font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 shrink-0 active:translate-y-0.5"
              >
                <Check className="w-4 h-4" />
                <span>Examine Evidence Board</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
