import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { Clock, HelpCircle, FastForward, Award, FileText } from 'lucide-react';

import { LogViewer } from './tools/LogViewer.js';
import { MorsePlayer } from './tools/MorsePlayer.js';
import { DocViewer } from './tools/DocViewer.js';
import { SqlConsole } from './tools/SqlConsole.js';
import { MatchBoard } from './tools/MatchBoard.js';
import { DiaryTable } from './tools/DiaryTable.js';
import { PhotoViewer } from './tools/PhotoViewer.js';
import { KitStation } from './tools/KitStation.js';
import { CodeFill } from './tools/CodeFill.js';
import { FlagForm } from './tools/FlagForm.js';

export const LevelWorkspace: React.FC = () => {
  const { levelDetail, loadingLevel, skipLevel, requestHint } = useGameStore();

  if (loadingLevel || !levelDetail) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-dim font-serif italic">
        Loading case documentation...
      </div>
    );
  }

  const {
    id,
    title,
    status,
    estimatedMinutes,
    softCapMinutes,
    story,
    stages,
    currentStageIndex,
    canSkip,
    remainingUntilSkip,
    reveal
  } = levelDetail;

  const currentStage = stages?.[currentStageIndex] || stages?.[0];

  const renderTool = () => {
    switch (id) {
      case 1:
        return <LogViewer />;
      case 2:
        return <MorsePlayer />;
      case 3:
        return <DocViewer />;
      case 4:
        return <SqlConsole />;
      case 5:
        return <MatchBoard />;
      case 6:
        return <DiaryTable />;
      case 7:
        return <PhotoViewer />;
      case 8:
        return <KitStation />;
      case 9:
        return <CodeFill />;
      case 10:
        return <FlagForm />;
      default:
        return <div>Tool not found for Level {id}</div>;
    }
  };

  const isSolved = status === 'SOLVED';
  const isSkipped = status === 'SKIPPED';

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      {/* Case Header Banner */}
      <div className="paper-sheet p-5 rounded border border-signal/40 shadow-desk space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-ink/20">
          <div className="flex items-center gap-3">
            <span className="font-typewriter text-xl md:text-2xl font-bold text-ink">
              CASE #{String(id).padStart(2, '0')}: {title.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isSolved && <span className="stamp stamp-closed text-xs">SOLVED</span>}
            {isSkipped && <span className="stamp stamp-skipped text-xs">SKIPPED</span>}
            {status === 'OPEN' && <span className="stamp stamp-open text-xs">IN PROGRESS</span>}

            <span className="text-xs font-mono text-ink/75 bg-ink/10 px-2 py-1 rounded flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-signal" />
              <span>Est: {estimatedMinutes}m</span>
            </span>
          </div>
        </div>

        {/* Story Briefing */}
        <div className="font-serif text-xs md:text-sm text-ink/90 leading-relaxed whitespace-pre-wrap">
          {story}
        </div>

        {/* Stage Progress Tracker */}
        {stages && stages.length > 1 && (
          <div className="pt-2 border-t border-ink/15 flex items-center gap-2 text-xs font-typewriter">
            <span className="text-ink font-bold">CASE STAGE:</span>
            {stages.map((st, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  i === currentStageIndex
                    ? 'bg-signal text-ink font-bold border border-ink'
                    : i < currentStageIndex
                    ? 'bg-ok/20 text-ok border border-ok/40'
                    : 'bg-ink/10 text-ink/50'
                }`}
              >
                Stage {i + 1}: {st.name}
              </span>
            ))}
          </div>
        )}

        {/* Current Stage Instruction */}
        {currentStage && (
          <div className="p-2.5 rounded bg-manila/60 border border-ink/15 text-xs font-serif italic text-ink/90">
            <strong>Stage Directive:</strong> {currentStage.instruction}
          </div>
        )}

        {/* Soft Cap Skip Option */}
        {status === 'OPEN' && (
          <div className="pt-2 flex flex-wrap items-center justify-between text-xs font-mono text-ink/70">
            <span>
              Soft cap timer: {softCapMinutes} min
              {!canSkip && remainingUntilSkip > 0 && ` (${Math.ceil(remainingUntilSkip / 60)} min until skip option)`}
            </span>

            {canSkip && (
              <button
                onClick={skipLevel}
                className="px-3 py-1 bg-alarm/20 hover:bg-alarm/30 text-alarm font-serif font-bold text-xs rounded border border-alarm/40 flex items-center gap-1.5 transition-colors"
                title="Soft cap elapsed. Reveal the clue and advance."
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Reveal the Clue (Skip Level)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Primary Investigation Tool */}
      <section aria-label="Investigation Workspace">
        {renderTool()}
      </section>

      {/* Clue Card Attached if already solved/skipped */}
      {(isSolved || isSkipped) && reveal && (
        <div className="paper-sheet p-5 rounded border-l-4 border-signal shadow-paper text-ink space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-ink/20">
            <span className="font-typewriter font-bold text-xs flex items-center gap-2">
              <Award className="w-4 h-4 text-signal" />
              FORENSIC CLUE CARD // CASE #{String(id).padStart(2, '0')}
            </span>
            <span className="stamp stamp-closed text-[9px]">SAVED TO EVIDENCE BOARD</span>
          </div>
          <div className="font-serif text-xs leading-relaxed text-ink/95 whitespace-pre-wrap">
            {reveal}
          </div>
        </div>
      )}
    </main>
  );
};
