import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { Clock, ShieldAlert, Award, FileText, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { team, eventClock, setTheoryModalOpen, setActiveDrawerTab, logout, levels } = useGameStore();

  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!eventClock) return;
    setRemainingSeconds(eventClock.remainingSeconds);

    if (eventClock.state !== 'RUNNING') return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [eventClock]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isLevel10Solved = levels.find(l => l.id === 10)?.status === 'SOLVED';

  return (
    <header className="bg-tape border-b border-signal/30 px-4 py-2 text-label flex flex-wrap items-center justify-between gap-3 shadow-md z-30 select-none">
      {/* Left: Branding & Case ID */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded border border-signal flex items-center justify-center font-typewriter text-signal font-bold text-sm bg-ink">
          1986
        </div>
        <div>
          <div className="font-typewriter text-base md:text-lg tracking-wider font-bold text-label flex items-center gap-2">
            MURDER MYSTERY
            <span className="text-xs px-2 py-0.5 rounded bg-ink border border-dim/50 text-dim tracking-normal">
              CASE-1986-2310
            </span>
          </div>
          <div className="text-xs text-dim font-serif hidden sm:block">
            Metropolitan Special Investigations Archive • Keats Grove Incident
          </div>
        </div>
      </div>

      {/* Center: Event Clock */}
      <div className="flex items-center gap-2 bg-ink/80 px-3 py-1.5 rounded border border-signal/40">
        <Clock className="w-4 h-4 text-signal animate-pulse" />
        <span className="font-mono text-sm tracking-widest font-semibold text-label">
          {formatTime(remainingSeconds)}
        </span>
        <span
          className={`text-[10px] uppercase font-typewriter px-1.5 py-0.5 rounded ${
            eventClock?.state === 'RUNNING'
              ? 'bg-ok/20 text-ok border border-ok/40'
              : eventClock?.state === 'PAUSED'
              ? 'bg-signal/20 text-signal border border-signal/40'
              : 'bg-alarm/20 text-alarm border border-alarm/40'
          }`}
        >
          {eventClock?.state || 'CLOCK READY'}
        </span>
      </div>

      {/* Right: Team Info & Fast Navigation */}
      <div className="flex items-center gap-2 sm:gap-3">
        {team && (
          <div className="text-right hidden md:block">
            <div className="text-xs font-typewriter text-label font-bold">
              {team.name}
            </div>
            <div className="text-[11px] text-signal font-mono">
              Unit Code: {team.code} • Kit #{team.kitNo}
            </div>
          </div>
        )}

        {/* Evidence Board Button */}
        <button
          onClick={() => setActiveDrawerTab('evidence')}
          className="px-2.5 py-1 text-xs font-serif bg-manila/15 hover:bg-manila/25 text-label rounded border border-manila/30 flex items-center gap-1.5 transition-colors"
          title="Open Evidence Board"
        >
          <Award className="w-3.5 h-3.5 text-signal" />
          <span className="hidden sm:inline">Evidence Board</span>
        </button>

        {/* Case Theory Form Button */}
        <button
          onClick={() => setTheoryModalOpen(true)}
          className={`px-2.5 py-1 text-xs font-serif rounded border flex items-center gap-1.5 transition-all ${
            isLevel10Solved
              ? 'bg-signal text-ink font-bold border-signal animate-bounce'
              : 'bg-ink hover:bg-tape text-label border-signal/40'
          }`}
          title="Open Final Case Theory Dossier"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Case Theory</span>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-1.5 rounded hover:bg-alarm/20 text-dim hover:text-alarm transition-colors"
          title="Exit Session"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Organizer Banner Bar if present */}
      {eventClock?.banner && (
        <div className="w-full bg-alarm/20 border-t border-alarm/40 py-1 px-3 text-xs text-label font-typewriter flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-alarm flex-shrink-0" />
          <span>BROADCAST FROM HEADQUARTERS: {eventClock.banner}</span>
        </div>
      )}
    </header>
  );
};
