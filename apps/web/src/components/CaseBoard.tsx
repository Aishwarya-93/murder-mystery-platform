import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { Lock, CheckCircle2, AlertTriangle, FolderOpen } from 'lucide-react';

export const CaseBoard: React.FC = () => {
  const { levels, selectedLevelId, selectLevel, addToast } = useGameStore();

  const handleSelect = (levelId: number, status: string) => {
    if (status === 'SEALED') {
      addToast(`Case #${levelId} is sealed. Conclude preceding cases to break the seal.`, 'warning');
      return;
    }
    selectLevel(levelId);
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-tape/95 border-b md:border-b-0 md:border-r border-signal/20 p-2 md:p-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 select-none">
      <div className="hidden md:flex items-center justify-between px-2 pb-2 border-b border-signal/30 text-dim">
        <span className="font-typewriter text-xs font-bold tracking-widest text-label uppercase">
          Case Registry
        </span>
        <span className="text-[11px] font-mono">10 DOSSIERS</span>
      </div>

      <nav className="flex md:flex-col gap-1.5 min-w-max md:min-w-0" aria-label="Case Dossiers">
        {levels.map((lvl) => {
          const isSelected = lvl.id === selectedLevelId;
          const isSealed = lvl.status === 'SEALED';
          const isSolved = lvl.status === 'SOLVED';
          const isSkipped = lvl.status === 'SKIPPED';
          const isOpen = lvl.status === 'OPEN';

          return (
            <button
              key={lvl.id}
              onClick={() => handleSelect(lvl.id, lvl.status)}
              disabled={isSealed}
              className={`text-left p-2 md:p-2.5 rounded transition-all duration-150 relative border flex items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-manila text-ink border-signal shadow-paper font-semibold'
                  : isSealed
                  ? 'bg-ink/40 text-dim/60 border-dim/20 cursor-not-allowed opacity-60'
                  : 'bg-ink/80 text-label border-signal/20 hover:border-signal/50 hover:bg-ink'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className={`font-typewriter text-xs ${isSelected ? 'text-signal font-bold' : 'text-dim'}`}>
                  #{String(lvl.id).padStart(2, '0')}
                </span>
                <span className="truncate text-xs md:text-sm font-serif">
                  {lvl.title}
                </span>
              </div>

              {/* Physical style stamp */}
              <div className="shrink-0 flex items-center">
                {isSolved && (
                  <span className={`stamp stamp-closed text-[10px] ${isSelected ? 'border-ink text-ink' : ''}`}>
                    CLOSED
                  </span>
                )}
                {isSkipped && (
                  <span className="stamp stamp-skipped text-[10px]">
                    SKIPPED
                  </span>
                )}
                {isOpen && (
                  <span className={`stamp stamp-open text-[10px] ${isSelected ? 'border-ink text-ink' : ''}`}>
                    OPEN
                  </span>
                )}
                {isSealed && (
                  <span className="stamp stamp-sealed text-[10px] flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    SEALED
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
