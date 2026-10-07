import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { Clock, FastForward, Award, FileText, CheckCircle2, Pin, Shield } from 'lucide-react';

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
  const { levelDetail, loadingLevel, skipLevel } = useGameStore();

  if (loadingLevel || !levelDetail) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-dim font-serif italic desk-surface">
        <div className="bg-ink/80 p-6 rounded border border-signal/40 shadow-desk text-center space-y-2">
          <Shield className="w-6 h-6 text-signal mx-auto animate-pulse" />
          <p className="font-typewriter text-xs text-label">UNSEALING DOSSIER ARCHIVE...</p>
        </div>
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
    <main className="flex-1 p-3 md:p-6 overflow-y-auto space-y-6 desk-surface">
      {/* 1. PHYSICAL MANILA DOSSIER JACKET */}
      <div className="manila-folder p-4 md:p-6 rounded-sm text-ink shadow-desk border-2 border-[#8E6C38] relative space-y-4">
        {/* Brass paperclip graphic on top-right */}
        <div className="paperclip" />

        {/* Dossier Header & Classification */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-ink/25">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-typewriter text-xs tracking-widest font-bold uppercase text-ink/75">
                METROPOLITAN POLICE SERVICE &bull; CASE FILE #{String(id).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-mono bg-ink/15 text-ink px-1.5 py-0.5 rounded">
                INCIDENT DATE: 23-OCT-2026
              </span>
            </div>
            <h2 className="font-typewriter text-xl md:text-2xl font-bold tracking-wide uppercase text-ink mt-0.5">
              {title}
            </h2>
          </div>

          {/* Rubber Status Stamps */}
          <div className="flex items-center gap-2">
            {isSolved && <span className="stamp stamp-closed text-xs">SOLVED</span>}
            {isSkipped && <span className="stamp stamp-skipped text-xs">SKIPPED</span>}
            {status === 'OPEN' && <span className="stamp stamp-open text-xs">IN PROGRESS</span>}

            <span className="text-[11px] font-mono text-ink/80 bg-ink/10 px-2.5 py-1 rounded border border-ink/20 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-signal" />
              <span>Est: {estimatedMinutes} min</span>
            </span>
          </div>
        </div>

        {/* 2. CONFIDENTIAL CASE BRIEFING MEMO */}
        <div className="bg-[#EFE5CD] p-4 sm:p-5 rounded-sm border border-ink/20 shadow-sm relative space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-ink/15 text-[10px] font-mono text-ink/65 uppercase">
            <span>OFFICIAL BRIEFING &bull; DISPATCH NW3</span>
            <span className="font-typewriter font-bold tracking-widest text-alarm">RESTRICTED INVESTIGATOR EYES ONLY</span>
          </div>

          <div className="font-serif text-xs md:text-sm text-ink leading-relaxed whitespace-pre-wrap pt-1">
            {story}
          </div>
        </div>

        {/* 3. MULTI-STAGE PROGRESS TRACKER (IF MULTI-STAGE) */}
        {stages && stages.length > 1 && (
          <div className="pt-2 flex items-center gap-2 text-xs font-typewriter flex-wrap">
            <span className="text-ink font-bold text-[11px]">DOSSIER PHASES:</span>
            {stages.map((st, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  i === currentStageIndex
                    ? 'bg-signal text-ink font-bold border border-ink shadow-sm'
                    : i < currentStageIndex
                    ? 'bg-ok/25 text-ok border border-ok/40 font-bold'
                    : 'bg-ink/10 text-ink/40'
                }`}
              >
                Phase {i + 1}: {st.name}
              </span>
            ))}
          </div>
        )}

        {/* 4. INVESTIGATOR DIRECTIVE & HANDWRITTEN POST-IT NOTE */}
        {currentStage && (
          <div className="bg-[#FAF2DA] p-3 rounded border-l-4 border-signal shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="font-typewriter text-[11px] font-bold text-signal uppercase tracking-wider block">
                PRIMARY INVESTIGATION DIRECTIVE:
              </span>
              <p className="font-serif text-xs text-ink/90 leading-relaxed italic">
                {currentStage.instruction}
              </p>
            </div>

            {/* Handwritten marginal note */}
            <div className="shrink-0 font-handwriting text-base text-alarm -rotate-1 self-end sm:self-center pr-1 select-none">
              — Check all angles!
            </div>
          </div>
        )}

        {/* 5. SOFT CAP TIMER & SKIP OPTION */}
        {status === 'OPEN' && (
          <div className="pt-2 border-t border-ink/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink/70">
            <span>
              Soft Cap Standard: {softCapMinutes} min
              {!canSkip && remainingUntilSkip > 0 && ` &bull; Skip unlock in ${Math.ceil(remainingUntilSkip / 60)}m`}
            </span>

            {canSkip && (
              <button
                onClick={skipLevel}
                className="px-3.5 py-1.5 bg-alarm hover:bg-alarm/90 text-label font-typewriter font-bold text-xs rounded shadow flex items-center gap-1.5 transition-all animate-pulse"
                title="Soft cap elapsed. Reveal the clue card and proceed."
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Reveal Clue Card (Mark Case Skipped)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 6. PRIMARY INVESTIGATION TOOL WORKSPACE */}
      <section aria-label="Investigation Workspace" className="relative">
        {renderTool()}
      </section>

      {/* 7. UNLOCKED EVIDENCE CLUE CARD (IF SOLVED / SKIPPED) */}
      {(isSolved || isSkipped) && reveal && (
        <div className="polaroid-frame text-ink shadow-desk border-2 border-signal relative space-y-3 p-5 sm:p-6">
          <div className="thumbtack" />

          <div className="flex items-center justify-between pb-2 border-b-2 border-ink/20">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-signal" />
              <span className="font-typewriter font-bold text-xs sm:text-sm tracking-wider uppercase text-ink">
                VERIFIED FORENSIC DISCOVERY // CASE #{String(id).padStart(2, '0')}
              </span>
            </div>
            <span className="stamp stamp-closed text-[10px]">PINNED TO CORKBOARD</span>
          </div>

          <div className="font-serif text-xs sm:text-sm leading-relaxed text-ink/95 whitespace-pre-wrap bg-[#f5ecdc] p-4 rounded border border-ink/15">
            {reveal}
          </div>

          <div className="text-[10px] font-mono text-ink/60 text-right">
            EXHIBIT RECORD ID: CR-1986-{String(id).padStart(2, '0')} &bull; PERMANENT POLICE ARCHIVE
          </div>
        </div>
      )}
    </main>
  );
};
