import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import {
  BookOpen,
  HelpCircle,
  Trophy,
  Save,
  Check,
  ChevronRight,
  FileQuestion,
  Briefcase,
  X,
} from 'lucide-react';

const ALLOWED_TABS = ['notebook', 'hints', 'leaderboard'];

export const RightDrawer: React.FC = () => {
  const {
    activeDrawerTab,
    setActiveDrawerTab,
    notebookText,
    notebookSaved,
    setNotebookText,
    saveNotebook,
    levelDetail,
    requestHint,
    leaderboard,
    leaderboardHidden,
  } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const notebookDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const handleNotebookChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNotebookText(e.target.value);

    if (notebookDebounceRef.current) {
      clearTimeout(notebookDebounceRef.current);
    }

    notebookDebounceRef.current = setTimeout(() => {
      void saveNotebook();
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (notebookDebounceRef.current) {
        clearTimeout(notebookDebounceRef.current);
      }
    };
  }, []);

  // Evidence and Characters now live in the Case Dossier,
  // so fall back to the Logbook if the stored tab is one of those.
  useEffect(() => {
    if (!ALLOWED_TABS.includes(activeDrawerTab as string)) {
      setActiveDrawerTab('notebook');
    }
  }, [activeDrawerTab, setActiveDrawerTab]);

  // Close with the Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const formatElapsed = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const tabClass = (tab: string) =>
    `flex-1 min-w-[75px] py-2.5 px-2 text-center flex items-center justify-center gap-1.5 transition-all motion-reduce:transition-none border-b-2 ${
      activeDrawerTab === tab
        ? 'border-signal text-signal font-typewriter font-bold bg-[#291b11] shadow-inner'
        : 'border-transparent text-dim hover:text-label'
    }`;

  return (
    <>
      {/* Floating button that opens the field tools drawer */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open field tools: logbook, intel and standings"
        aria-expanded={isOpen}
        className="fixed bottom-4 right-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded border-2 border-signal/60 bg-[#291b11] text-signal font-typewriter font-bold text-xs shadow-2xl hover:bg-[#33200f] focus:outline-none focus-visible:ring-2 focus-visible:ring-signal"
      >
        <Briefcase className="w-4 h-4" aria-hidden="true" />
        <span>Field Tools</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <aside
            role="dialog"
            aria-label="Field tools"
            className="fixed top-0 right-0 z-40 h-full w-full sm:w-96 bg-[#21160e] border-l-2 border-signal/30 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#160f0a] border-b border-signal/30">
              <span className="font-typewriter text-xs font-bold text-signal uppercase tracking-wider">
                Field Tools
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close field tools"
                className="p-1 text-dim hover:text-label focus:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b-2 border-signal/30 bg-[#160f0a] text-xs font-serif overflow-x-auto select-none">
              <button
                type="button"
                onClick={() => setActiveDrawerTab('notebook')}
                className={tabClass('notebook')}
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-[11px]">Logbook</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawerTab('hints')}
                className={tabClass('hints')}
              >
                <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-[11px]">Intel/Hints</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawerTab('leaderboard')}
                className={tabClass('leaderboard')}
              >
                <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-[11px]">Standings</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {/* 1. TEAM NOTEBOOK */}
              {activeDrawerTab === 'notebook' && (
                <div className="h-full bg-[#EAD8B5] text-ink p-4 flex flex-col gap-2 relative shadow-inner">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-ink/30 text-xs">
                    <span className="font-typewriter text-ink font-bold tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-signal" />
                      Squad Field Logbook
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-mono text-ink/75 bg-ink/10 px-2 py-0.5 rounded">
                      {notebookSaved ? (
                        <>
                          <Check className="w-3 h-3 text-ok" />
                          <span className="text-[10px]">Saved to Dossier</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3 text-signal animate-spin motion-reduce:animate-none" />
                          <span className="text-[10px]">Autosaving...</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-[11px] text-ink/70 font-serif italic border-l-2 border-alarm pl-2 py-0.5">
                    Confidential investigative notebook. Entries are saved in
                    real-time and shared with your squad.
                  </p>

                  <textarea
                    value={notebookText}
                    onChange={handleNotebookChange}
                    aria-label="Squad field logbook"
                    placeholder="Record witness contradictions, timeline notes, deciphered codes, and investigator theories here..."
                    className="flex-1 w-full bg-[#F5EACB] text-ink font-mono text-xs p-3 rounded border border-ink/30 focus:border-signal focus:outline-none resize-none leading-relaxed shadow-inner"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(transparent, transparent 23px, rgba(160, 120, 80, 0.2) 24px)',
                      lineHeight: '24px',
                    }}
                  />
                </div>
              )}

              {/* 2. HINTS LADDER */}
              {activeDrawerTab === 'hints' && (
                <div className="p-4 space-y-3 bg-[#1d130a]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-signal/20">
                    <span className="font-typewriter text-xs text-signal uppercase tracking-wider font-bold">
                      Classified Case Intel
                    </span>

                    <span className="text-[10px] font-mono text-dim bg-ink px-2 py-0.5 rounded border border-signal/20">
                      {levelDetail?.hintsUsed || 0} of{' '}
                      {levelDetail?.totalHints || 3} Unsealed
                    </span>
                  </div>

                  <p className="text-[11px] text-dim font-serif italic">
                    Opening intelligence tiers incurs no scoring penalty.
                    Telemetry is logged for case documentation only.
                  </p>

                  {levelDetail && (
                    <div className="space-y-3">
                      {[1, 2, 3].map((tier) => {
                        const isRevealed =
                          tier <= (levelDetail.hintsUsed || 0);
                        const hintText =
                          levelDetail.hintsRevealed?.[tier - 1];

                        return (
                          <div
                            key={tier}
                            className={`p-3 rounded border relative transition-all motion-reduce:transition-none ${
                              isRevealed
                                ? 'aged-parchment text-ink border-signal shadow-paper'
                                : 'bg-ink/70 text-dim border-dim/20'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-typewriter font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                <FileQuestion className="w-3.5 h-3.5 text-signal" />
                                INTEL ENVELOPE • TIER {tier}
                              </span>

                              <span
                                className={`text-[9px] font-typewriter px-1.5 py-0.5 rounded ${
                                  isRevealed
                                    ? 'bg-ok/20 text-ok border border-ok/40 font-bold'
                                    : 'bg-alarm/15 text-alarm border border-alarm/30'
                                }`}
                              >
                                {isRevealed
                                  ? 'SEAL BROKEN'
                                  : 'CONFIDENTIAL SEAL'}
                              </span>
                            </div>

                            {isRevealed ? (
                              <div className="font-serif leading-relaxed text-xs text-ink/90 pt-1 border-t border-ink/15">
                                {hintText}
                              </div>
                            ) : (
                              <div className="text-dim/60 font-serif italic text-[11px]">
                                Evidence sealed under seal #{tier}. Click below
                                to break the seal.
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {(levelDetail.hintsUsed || 0) <
                        (levelDetail.totalHints || 3) && (
                        <button
                          type="button"
                          onClick={requestHint}
                          className="w-full mt-3 py-2 px-3 bg-signal hover:bg-signal/90 text-ink font-typewriter font-bold text-xs rounded transition-all motion-reduce:transition-none flex items-center justify-center gap-2 shadow-desk focus:outline-none focus-visible:ring-2 focus-visible:ring-label"
                        >
                          <span>
                            Unseal Intel Tier{' '}
                            {(levelDetail.hintsUsed || 0) + 1}
                          </span>
                          <ChevronRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 3. LEADERBOARD */}
              {activeDrawerTab === 'leaderboard' && (
                <div className="p-4 space-y-3 bg-[#1d130a]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-signal/20">
                    <span className="font-typewriter text-xs text-signal uppercase tracking-wider font-bold">
                      Precinct Squad Standings
                    </span>

                    <span className="text-[10px] font-mono text-dim bg-ink px-2 py-0.5 rounded border border-signal/20">
                      LIVE TELETYPE
                    </span>
                  </div>

                  {leaderboardHidden ? (
                    <div className="text-center py-10 px-4 text-dim text-xs font-serif italic border border-dashed border-alarm/40 rounded bg-alarm/5 space-y-2">
                      <div className="stamp stamp-skipped text-xs">
                        CLASSIFIED UNDER CODE 4417
                      </div>
                      <p>
                        Standings have been officially redacted by Headquarters
                        for the final interrogation phase.
                      </p>
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="text-center py-10 text-dim text-xs font-serif italic">
                      Awaiting first squad teletype dispatches...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {leaderboard.map((entry, idx) => (
                        <div
                          key={entry.teamId}
                          className="flex items-center justify-between p-2.5 rounded bg-ink/90 border border-signal/25 text-xs hover:border-signal/50 transition-colors motion-reduce:transition-none shadow-sm"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div
                              className={`w-6 h-6 rounded flex items-center justify-center font-typewriter font-bold text-xs ${
                                idx === 0
                                  ? 'bg-signal text-ink shadow-[0_0_8px_rgba(166,115,50,0.5)]'
                                  : 'bg-tape text-dim'
                              }`}
                            >
                              {idx + 1}
                            </div>

                            <div className="truncate">
                              <div className="font-serif text-label font-bold truncate">
                                {entry.teamName}
                              </div>
                              <div className="text-[10px] text-dim font-mono">
                                Kit #{entry.kitNo} • Case #{entry.currentLevel}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-typewriter font-bold text-signal text-xs">
                              {entry.levelsSolved} solved
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
        </>
      )}
    </>
  );
};