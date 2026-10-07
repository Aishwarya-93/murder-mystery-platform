import React, { useState, useEffect } from 'react';
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
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlockedClue]);

  if (!newlyUnlockedClue) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clue-modal-title"
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="paper-sheet max-w-xl w-full p-6 sm:p-8 rounded-sm text-ink shadow-desk border-2 border-signal relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeClueModal}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded hover:bg-ink/10 text-ink/70 hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Stamps */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-ink/20">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-signal" />
            <span
              id="clue-modal-title"
              className="font-typewriter text-xs sm:text-sm font-bold tracking-widest text-ink uppercase"
            >
              CASE #{String(newlyUnlockedClue.level).padStart(2, '0')} FORENSIC BREAKTHROUGH
            </span>
          </div>
          <span className="stamp stamp-closed text-xs">
            EVIDENCE UNLOCKED
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-typewriter font-bold mb-4 text-ink leading-tight">
          {newlyUnlockedClue.title}
        </h2>

        {/* Clue Body with Redaction Wipe Reveal */}
        <div className="relative font-serif text-sm sm:text-base leading-relaxed bg-manila/50 p-4 rounded border border-ink/10 whitespace-pre-wrap min-h-[120px]">
          {/* Animated Redaction Overlay */}
          {!wipingDone && (
            <div
              className="absolute inset-0 bg-redact text-label font-typewriter flex items-center justify-center text-xs tracking-widest uppercase overflow-hidden animate-redact-wipe select-none z-10"
              style={{ transformOrigin: 'right center' }}
            >
              [ TOP SECRET EVIDENCE CLUSTER • REMOVING REDACTION BARS ]
            </div>
          )}

          <div className="text-ink/95">
            {newlyUnlockedClue.text}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-ink/20 flex items-center justify-between gap-4">
          <span className="text-xs text-ink/70 font-mono italic">
            This clue has been permanently pinned to your squad's Evidence Board.
          </span>
          <button
            onClick={closeClueModal}
            className="px-5 py-2 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-sm rounded shadow transition-all flex items-center gap-2 shrink-0"
          >
            <Check className="w-4 h-4" />
            <span>Examine Evidence Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
