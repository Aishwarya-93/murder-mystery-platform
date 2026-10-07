import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { Award, BookOpen, HelpCircle, Trophy, Save, Check, ChevronRight, Pin, FileQuestion } from 'lucide-react';

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
    <aside className="w-full lg:w-80 xl:w-96 bg-[#21160e] border-t-2 lg:border-t-0 lg:border-l-2 border-signal/30 flex flex-col shrink-0 h-80 lg:h-auto overflow-hidden shadow-2xl">
      {/* Tab Navigation Bar with Vintage Tabs */}
      <div className="flex border-b-2 border-signal/30 bg-[#160f0a] text-xs font-serif overflow-x-auto select-none">
        <button
          onClick={() => setActiveDrawerTab('evidence')}
          className={`flex-1 min-w-[75px] py-2.5 px-2 text-center flex items-center justify-center gap-1.5 transition-all border-b-2 ${
            activeDrawerTab === 'evidence'
              ? 'border-signal text-signal font-typewriter font-bold bg-[#291b11] shadow-inner'
              : 'border-transparent text-dim hover:text-label'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span className="text-[11px]">Evidence ({evidenceBoard.length})</span>
        </button>

        <button
          onClick={() => setActiveDrawerTab('notebook')}
          className={`flex-1 min-w-[75px] py-2.5 px-2 text-center flex items-center justify-center gap-1.5 transition-all border-b-2 ${
            activeDrawerTab === 'notebook'
              ? 'border-signal text-signal font-typewriter font-bold bg-[#291b11] shadow-inner'
              : 'border-transparent text-dim hover:text-label'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="text-[11px]">Logbook</span>
        </button>

        <button
          onClick={() => setActiveDrawerTab('hints')}
          className={`flex-1 min-w-[75px] py-2.5 px-2 text-center flex items-center justify-center gap-1.5 transition-all border-b-2 ${
            activeDrawerTab === 'hints'
              ? 'border-signal text-signal font-typewriter font-bold bg-[#291b11] shadow-inner'
              : 'border-transparent text-dim hover:text-label'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="text-[11px]">Intel/Hints</span>
        </button>

        <button
          onClick={() => setActiveDrawerTab('leaderboard')}
          className={`flex-1 min-w-[75px] py-2.5 px-2 text-center flex items-center justify-center gap-1.5 transition-all border-b-2 ${
            activeDrawerTab === 'leaderboard'
              ? 'border-signal text-signal font-typewriter font-bold bg-[#291b11] shadow-inner'
              : 'border-transparent text-dim hover:text-label'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span className="text-[11px]">Standings</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto">
        {/* 1. EVIDENCE BOARD: REAL DETECTIVE CORKBOARD */}
        {activeDrawerTab === 'evidence' && (
          <div className="cork-board min-h-full p-4 space-y-4">
            {/* Header Plaque */}
            <div className="bg-[#1b1108]/90 border border-signal/40 p-2 rounded shadow-inner flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-alarm" />
                <span className="font-typewriter font-bold tracking-widest text-signal uppercase text-[11px]">
                  EVIDENCE CORKBOARD
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#D6C296] bg-ink/80 px-2 py-0.5 rounded border border-signal/30">
                {evidenceBoard.length}/10 PINNED
              </span>
            </div>

            {evidenceBoard.length === 0 ? (
              <div className="text-center py-12 px-4 text-label/60 text-xs font-serif italic border-2 border-dashed border-[#5a3e28] rounded bg-[#271910]/60 space-y-2">
                <Pin className="w-6 h-6 text-alarm/60 mx-auto" />
                <p>The incident board is empty.</p>
                <p className="text-[11px] text-dim">
                  Solve Case #01 to pin the first photograph and forensic breakthrough to the board.
                </p>
              </div>
            ) : (
              <div className="space-y-4 relative">
                {/* Evidence Cards on Corkboard */}
                {evidenceBoard.map((card, idx) => {
                  const rotation = (idx % 3 === 0 ? -1.5 : idx % 3 === 1 ? 1 : -0.5);
                  return (
                    <div
                      key={card.level}
                      style={{ transform: `rotate(${rotation}deg)` }}
                      className="polaroid-frame relative text-ink transition-transform hover:rotate-0 duration-200"
                    >
                      {/* Red 3D Thumbtack on top center */}
                      <div className="thumbtack" />

                      {/* Small Red String Indicator between cards */}
                      {idx > 0 && (
                        <div className="absolute -top-3 left-3 w-8 h-0.5 bg-alarm/80 -rotate-45 pointer-events-none" />
                      )}

                      {/* Card Content Header */}
                      <div className="flex items-center justify-between pb-1 mb-2 border-b border-ink/20 pt-1">
                        <span className="font-typewriter text-[11px] font-bold text-ink tracking-wider">
                          EXHIBIT #{String(card.level).padStart(2, '0')}: {card.title}
                        </span>
                        <span className="stamp stamp-closed text-[8px] py-0 px-1 border-ok text-ok">
                          VERIFIED
                        </span>
                      </div>

                      {/* Clue Text */}
                      <div className="text-xs font-serif leading-relaxed text-ink/90 whitespace-pre-wrap">
                        {card.text}
                      </div>

                      {/* Date / Evidence Index Stamp */}
                      <div className="mt-2 pt-1 border-t border-ink/10 flex justify-between items-center text-[9px] font-mono text-ink/60">
                        <span>DISPATCH: 23-OCT-2026</span>
                        <span className="font-typewriter uppercase">EVID-TAG #{card.level}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. TEAM NOTEBOOK: AUTHENTIC DETECTIVE SPIRAL LOGBOOK */}
        {activeDrawerTab === 'notebook' && (
          <div className="h-full bg-[#EAD8B5] text-ink p-4 flex flex-col gap-2 relative shadow-inner">
            {/* Top Spiral Wire Binding decoration */}
            <div className="flex items-center justify-between pb-2 border-b-2 border-ink/30 text-xs">
              <span className="font-typewriter text-ink font-bold tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-signal" />
                SQUAD FIELD LOGBOOK
              </span>

              <span className="flex items-center gap-1 text-[11px] font-mono text-ink/75 bg-ink/10 px-2 py-0.5 rounded">
                {notebookSaved ? (
                  <>
                    <Check className="w-3 h-3 text-ok" />
                    <span className="text-[10px]">Saved to Dossier</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 text-signal animate-spin" />
                    <span className="text-[10px]">Autosaving...</span>
                  </>
                )}
              </span>
            </div>

            <p className="text-[11px] text-ink/70 font-serif italic border-l-2 border-alarm pl-2 py-0.5">
              Confidential investigative notebook. Entries are saved in real-time and shared with your squad.
            </p>

            {/* Lined Legal Pad Textarea */}
            <textarea
              value={notebookText}
              onChange={handleNotebookChange}
              placeholder="Record witness contradictions, timeline notes, deciphered codes, and investigator theories here..."
              className="flex-1 w-full bg-[#F5EACB] text-ink font-mono text-xs p-3 rounded border border-ink/30 focus:border-signal focus:outline-none resize-none leading-relaxed shadow-inner"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, rgba(160, 120, 80, 0.2) 24px)',
                lineHeight: '24px'
              }}
            />
          </div>
        )}

        {/* 3. HINTS LADDER: SEALED EVIDENCE ENVELOPES */}
        {activeDrawerTab === 'hints' && (
          <div className="p-4 space-y-3 bg-[#1d130a]">
            <div className="flex items-center justify-between pb-1.5 border-b border-signal/20">
              <span className="font-typewriter text-xs text-signal uppercase tracking-wider font-bold">
                Classified Case Intel
              </span>
              <span className="text-[10px] font-mono text-dim bg-ink px-2 py-0.5 rounded border border-signal/20">
                {levelDetail?.hintsUsed || 0} of {levelDetail?.totalHints || 3} Unsealed
              </span>
            </div>

            <p className="text-[11px] text-dim font-serif italic">
              Opening intelligence tiers incurs no scoring penalty. Telemetry is logged for case documentation only.
            </p>

            {levelDetail && (
              <div className="space-y-3">
                {[1, 2, 3].map((tier) => {
                  const isRevealed = tier <= (levelDetail.hintsUsed || 0);
                  const hintText = levelDetail.hintsRevealed?.[tier - 1];

                  return (
                    <div
                      key={tier}
                      className={`p-3 rounded border relative transition-all ${
                        isRevealed
                          ? 'aged-parchment text-ink border-signal shadow-paper'
                          : 'bg-ink/70 text-dim border-dim/20'
                      }`}
                    >
                      {/* Envelope Seal Stamp */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-typewriter font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <FileQuestion className="w-3.5 h-3.5 text-signal" />
                          INTEL ENVELOPE &bull; TIER {tier}
                        </span>
                        <span
                          className={`text-[9px] font-typewriter px-1.5 py-0.5 rounded ${
                            isRevealed
                              ? 'bg-ok/20 text-ok border border-ok/40 font-bold'
                              : 'bg-alarm/15 text-alarm border border-alarm/30'
                          }`}
                        >
                          {isRevealed ? 'SEAL BROKEN' : 'CONFIDENTIAL SEAL'}
                        </span>
                      </div>

                      {isRevealed ? (
                        <div className="font-serif leading-relaxed text-xs text-ink/90 pt-1 border-t border-ink/15">
                          {hintText}
                        </div>
                      ) : (
                        <div className="text-dim/60 font-serif italic text-[11px]">
                          Evidence sealed under seal #{tier}. Click below to break the seal.
                        </div>
                      )}
                    </div>
                  );
                })}

                {(levelDetail.hintsUsed || 0) < (levelDetail.totalHints || 3) && (
                  <button
                    onClick={requestHint}
                    className="w-full mt-3 py-2 px-3 bg-signal hover:bg-signal/90 text-ink font-typewriter font-bold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-desk"
                  >
                    <span>Unseal Intel Tier {(levelDetail.hintsUsed || 0) + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. LEADERBOARD: PRECINCT BULLETIN BOARD */}
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
                <div className="stamp stamp-skipped text-xs">CLASSIFIED UNDER CODE 4417</div>
                <p>Standings have been officially redacted by Headquarters for the final interrogation phase.</p>
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
                    className="flex items-center justify-between p-2.5 rounded bg-ink/90 border border-signal/25 text-xs hover:border-signal/50 transition-colors shadow-sm"
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
                          Kit #{entry.kitNo} &bull; Case #{entry.currentLevel}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-typewriter font-bold text-signal text-xs">
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
