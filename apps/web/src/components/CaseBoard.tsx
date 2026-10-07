import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { Lock, FolderOpen, CheckCircle2, ChevronRight, FileSpreadsheet } from 'lucide-react';

export const CaseBoard: React.FC = () => {
  const { levels, selectedLevelId, selectLevel, addToast } = useGameStore();

  const handleSelect = (levelId: number, status: string) => {
    if (status === 'SEALED') {
      addToast(`Case #${levelId} is sealed under police evidence custody. Complete preceding investigations first.`, 'warning');
      return;
    }
    selectLevel(levelId);
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-[#23170e] border-b md:border-b-0 md:border-r-2 border-signal/30 p-2 md:p-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 select-none shadow-2xl relative">
      {/* Decorative top binder label */}
      <div className="hidden md:flex items-center justify-between px-2 pb-2.5 border-b border-signal/30 text-dim">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-signal" />
          <span className="font-typewriter text-xs font-bold tracking-widest text-label uppercase">
            Case Archives
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-ink border border-signal/20 text-signal">
          10 DOSSIERS
        </span>
      </div>

      <nav className="flex md:flex-col gap-2 min-w-max md:min-w-0 py-1" aria-label="Case Dossiers">
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
              className={`text-left p-2.5 rounded-sm transition-all duration-200 relative border flex items-center justify-between gap-2.5 group ${
                isSelected
                  ? 'manila-folder text-ink border-signal shadow-desk font-semibold md:translate-x-1.5 ring-1 ring-signal'
                  : isSealed
                  ? 'bg-ink/50 text-dim/60 border-dim/20 cursor-not-allowed opacity-60'
                  : 'bg-[#1b120a] text-label border-signal/20 hover:border-signal/60 hover:bg-[#251910] hover:shadow-paper'
              }`}
            >
              {/* Folder tab notch on left */}
              <div
                className={`w-1 self-stretch rounded-full shrink-0 ${
                  isSelected
                    ? 'bg-signal'
                    : isSolved
                    ? 'bg-ok'
                    : isSkipped
                    ? 'bg-alarm'
                    : isOpen
                    ? 'bg-signal/80'
                    : 'bg-dim/30'
                }`}
              />

              <div className="flex flex-col overflow-hidden flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-typewriter text-[11px] tracking-wider ${
                      isSelected ? 'text-signal font-bold' : 'text-dim group-hover:text-signal'
                    }`}
                  >
                    DOSSIER #{String(lvl.id).padStart(2, '0')}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-mono uppercase bg-ink/20 text-ink px-1 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="truncate text-xs md:text-sm font-serif leading-tight">
                  {lvl.title}
                </span>
              </div>

              {/* Physical Rubber Stamp */}
              <div className="shrink-0 flex items-center">
                {isSolved && (
                  <span className={`stamp stamp-closed text-[9px] ${isSelected ? 'border-ink text-ink font-bold' : ''}`}>
                    CLOSED
                  </span>
                )}
                {isSkipped && (
                  <span className="stamp stamp-skipped text-[9px]">
                    SKIPPED
                  </span>
                )}
                {isOpen && (
                  <span className={`stamp stamp-open text-[9px] ${isSelected ? 'border-ink text-ink font-bold' : ''}`}>
                    OPEN
                  </span>
                )}
                {isSealed && (
                  <span className="stamp stamp-sealed text-[9px] flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    SEALED
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Drawer Label */}
      <div className="hidden md:block mt-auto pt-3 border-t border-signal/20 text-[10px] text-dim/80 font-mono text-center">
        <span>ARCHIVE DRAWER NW3 &bull; CONFIDENTIAL</span>
      </div>
    </aside>
  );
};
