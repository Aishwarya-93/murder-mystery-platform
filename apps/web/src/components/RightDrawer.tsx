import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { Award, BookOpen, HelpCircle, Trophy, Save, Check, ChevronRight } from 'lucide-react';

export const RightDrawer: React.FC = () => {
  const {
    activeDrawerTab,
    setActiveDrawerTab,
    evidenceBoard,
    notebookText,
    notebookSaved,
    setNotebookText,
    saveNotebook,
    levelDetail,
    requestHint,
    leaderboard,
    leaderboardHidden
  } = useGameStore();

  const notebookDebounceRef = useRef<any>(null);

  const handleNotebookChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotebookText(val);

    if (notebookDebounceRef.current) {
      clearTimeout(notebookDebounceRef.current);
    }
    notebookDebounceRef.current = setTimeout(() => {
      saveNotebook();
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (notebookDebounceRef.current) clearTimeout(notebookDebounceRef.current);
    };
  }, []);

  const formatElapsed = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 bg-tape/95 border-t lg:border-t-0 lg:border-l border-signal/20 flex flex-col shrink-0 h-80 lg:h-auto overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-signal/30 bg-ink/70 text-xs font-serif overflow-x-auto">
        <button
          onClick={() => setActiveDrawerTab('evidence')}
          className={`flex-1 min-w-[70px] py-2.5 px-2 text-center flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeDrawerTab === 'evidence'
              ? 'border-signal text-signal font-semibold bg-tape/40'
              : 'border-transparent text-dim hover:text-label'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Evidence ({evidenceBoard.length})</span>
        </button>

        <button
          onClick={() => setActiveDrawerTab('notebook')}
          className={`flex-1 min-w-[70px] py-2.5 px-2 text-center flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeDrawerTab === 'notebook'
              ? 'border-signal text-signal font-semibold bg-tape/40'
              : 'border-transparent text-dim hover:text-label'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Notebook</span>
        </button>

        <button
          onClick={() => setActiveDrawerTab('hints')}
          className={`flex-1 min-w-[70px] py-2.5 px-2 text-center flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeDrawerTab === 'hints'
              ? 'border-signal text-signal font-semibold bg-tape/40'
              : 'border-transparent text-dim hover:text-label'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Hints</span>
        </button>

        <button
          onClick={() => setActiveDrawerTab('leaderboard')}
          className={`flex-1 min-w-[70px] py-2.5 px-2 text-center flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeDrawerTab === 'leaderboard'
              ? 'border-signal text-signal font-semibold bg-tape/40'
              : 'border-transparent text-dim hover:text-label'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Board</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 p-3 overflow-y-auto">
        {/* 1. Evidence Board */}
        {activeDrawerTab === 'evidence' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-signal/20">
              <span className="font-typewriter text-xs text-signal uppercase tracking-wider font-bold">
                Evidence Board
              </span>
              <span className="text-[11px] text-dim font-mono">
                {evidenceBoard.length}/10 Clues Unlocked
              </span>
            </div>

            {evidenceBoard.length === 0 ? (
              <div className="text-center py-8 text-dim text-xs font-serif italic border border-dashed border-dim/30 rounded p-4">
                No clue cards unlocked yet. Conclude Case #01 to pin the first piece of forensic evidence.
              </div>
            ) : (
              evidenceBoard.map((card) => (
                <div
                  key={card.level}
                  className="paper-sheet p-3 rounded text-ink shadow-paper border-l-4 border-signal"
                >
                  <div className="flex items-center justify-between gap-1 pb-1 mb-1 border-b border-ink/15">
                    <span className="font-typewriter text-[11px] font-bold text-ink">
                      CASE #{String(card.level).padStart(2, '0')}: {card.title}
                    </span>
                    <span className="stamp stamp-closed text-[9px] py-0 px-1">CLUE PINNED</span>
                  </div>
                  <div className="text-xs font-serif whitespace-pre-wrap leading-relaxed text-ink/90">
                    {card.text}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. Team Notebook */}
        {activeDrawerTab === 'notebook' && (
          <div className="h-full flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1 border-b border-signal/20 text-xs">
              <span className="font-typewriter text-signal uppercase tracking-wider font-bold">
                Investigator Logbook
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-dim">
                {notebookSaved ? (
                  <>
                    <Check className="w-3 h-3 text-ok" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 text-signal animate-spin" />
                    <span>Saving...</span>
                  </>
                )}
              </span>
            </div>

            <p className="text-[11px] text-dim font-serif italic">
              Autosaved shared working notes for your team.
            </p>

            <textarea
              value={notebookText}
              onChange={handleNotebookChange}
              placeholder="Record suspects' alibis, timestamps, calculations, and deductions here..."
              className="flex-1 w-full bg-ink/90 text-label font-mono text-xs p-3 rounded border border-signal/30 focus:border-signal focus:outline-none resize-none leading-relaxed"
            />
          </div>
        )}

        {/* 3. Hints Ladder */}
        {activeDrawerTab === 'hints' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-signal/20">
              <span className="font-typewriter text-xs text-signal uppercase tracking-wider font-bold">
                Investigation Hints
              </span>
              <span className="text-[11px] text-dim font-mono">
                {levelDetail?.hintsUsed || 0} of {levelDetail?.totalHints || 3} Revealed
              </span>
            </div>

            <p className="text-[11px] text-dim font-serif italic">
              Hints carry no point penalties. Organizers log hint counts for post-event telemetry only.
            </p>

            {levelDetail && (
              <div className="space-y-2.5">
                {[1, 2, 3].map((tier) => {
                  const isRevealed = tier <= (levelDetail.hintsUsed || 0);
                  const hintText = levelDetail.hintsRevealed?.[tier - 1];

                  return (
                    <div
                      key={tier}
                      className={`p-2.5 rounded border text-xs transition-all ${
                        isRevealed
                          ? 'bg-manila text-ink border-signal shadow-paper'
                          : 'bg-ink/60 text-dim border-dim/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-typewriter font-bold text-[11px] uppercase tracking-wider">
                          Hint Tier {tier}
                        </span>
                        <span className="text-[10px] font-mono">
                          {isRevealed ? 'UNSEALED' : 'SEALED'}
                        </span>
                      </div>

                      {isRevealed ? (
                        <div className="font-serif leading-relaxed text-ink/90">
                          {hintText}
                        </div>
                      ) : (
                        <div className="text-dim/60 font-serif italic text-[11px]">
                          Evidence sealed. Unlock below when needed.
                        </div>
                      )}
                    </div>
                  );
                })}

                {(levelDetail.hintsUsed || 0) < (levelDetail.totalHints || 3) && (
                  <button
                    onClick={requestHint}
                    className="w-full mt-2 py-2 px-3 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>Open Hint Tier {(levelDetail.hintsUsed || 0) + 1}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. Leaderboard */}
        {activeDrawerTab === 'leaderboard' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-signal/20">
              <span className="font-typewriter text-xs text-signal uppercase tracking-wider font-bold">
                Live Squad Standings
              </span>
              <span className="text-[10px] font-mono text-dim">LIVE SSE</span>
            </div>

            {leaderboardHidden ? (
              <div className="text-center py-8 text-dim text-xs font-serif italic border border-dashed border-dim/30 rounded p-4">
                Standings have been classified by event headquarters as teams enter the final phase.
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8 text-dim text-xs font-serif italic">
                Awaiting first squad reports...
              </div>
            ) : (
              <div className="space-y-1.5">
                {leaderboard.map((entry, idx) => (
                  <div
                    key={entry.teamId}
                    className="flex items-center justify-between p-2 rounded bg-ink/80 border border-signal/20 text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className={`w-5 font-typewriter font-bold text-center ${idx === 0 ? 'text-signal' : 'text-dim'}`}>
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <div className="font-serif text-label font-medium truncate">
                          {entry.teamName}
                        </div>
                        <div className="text-[10px] text-dim font-mono">
                          Kit #{entry.kitNo} • Case #{entry.currentLevel}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-typewriter font-bold text-signal">
                        {entry.levelsSolved} / 10
                      </div>
                      <div className="text-[10px] text-dim font-mono">
                        {formatElapsed(entry.totalElapsedSeconds)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
