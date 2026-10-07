import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Users, FileText, AlertCircle, CheckCircle2, Pin, Link as LinkIcon, User } from 'lucide-react';

interface Suspect {
  id: string;
  name: string;
  role: string;
  statement: string;
}

interface EvidenceCard {
  id: string;
  title: string;
  description: string;
}

export const MatchBoard: React.FC = () => {
  const { levelDetail, submitAnswer } = useGameStore();

  const suspects: Suspect[] = levelDetail?.suspects || [];
  const evidenceCards: EvidenceCard[] = levelDetail?.evidenceCards || [];

  const [matches, setMatches] = useState<Record<string, string>>({
    lena: '',
    daniel: '',
    clara: '',
    noah: '',
    adrian: '',
    mira: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ correctCount?: number; error?: string } | null>(null);

  const handleSelect = (suspectId: string, evidenceId: string) => {
    setMatches((prev) => ({ ...prev, [suspectId]: evidenceId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    // Calculate display code: Lena number, Daniel number, Clara number, Noah number
    // e.g. E3 -> 3, E5 -> 5, E2 -> 2, E7 -> 7 => 3527
    const getNum = (v: string) => v.replace(/^E/, '') || '0';
    const code = `${getNum(matches.lena || '')}${getNum(matches.daniel || '')}${getNum(matches.clara || '')}${getNum(matches.noah || '')}`;

    const res = await submitAnswer(code);

    if (!res.correct) {
      // Calculate how many rows are correct for partial feedback
      const canonical: Record<string, string> = {
        lena: 'E3',
        daniel: 'E5',
        clara: 'E2',
        noah: 'E7',
        adrian: 'none',
        mira: 'none'
      };
      let correctCount = 0;
      Object.keys(canonical).forEach((k) => {
        if ((matches[k] || 'none') === canonical[k]) {
          correctCount++;
        }
      });
      setFeedback({ correctCount, error: `${correctCount} of 6 statements correctly matched.` });
    }
    setSubmitting(false);
  };

  // Get active linked evidence IDs
  const activeLinkedEvidences = Object.values(matches).filter((v) => v && v !== 'none');

  return (
    <div className="space-y-5">
      {/* Overview Dossier Banner */}
      <div className="paper-sheet p-4 rounded-lg border-2 border-amber-900/40 shadow-sm text-xs text-ink font-serif flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-xl leading-relaxed">
          Cross-examine each suspect's recorded alibi against physical evidence retrieved from 8 Park Terrace. Identify which evidence document directly refutes their testimony, or declare <strong className="text-red-900 font-bold">No Contradiction</strong> if current evidence does not break their statement.
        </p>
        <span className="stamp stamp-open text-[10px]">CORROBORATION BOARD</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Suspect Statements (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b-2 border-signal/30 text-xs">
            <span className="font-typewriter font-bold text-label flex items-center gap-2">
              <Users className="w-4 h-4 text-signal" />
              SUSPECT INTERROGATION DOSSIERS
            </span>
            <span className="text-[11px] font-mono text-dim">6 DEPOSITIONS RECORDED</span>
          </div>

          <div className="space-y-3">
            {suspects.map((s) => {
              const matchedEv = matches[s.id];
              return (
                <div
                  key={s.id}
                  className="relative p-4 rounded-lg bg-gradient-to-r from-[#241e19] to-[#1c1814] border-2 border-[#5c4631] text-xs space-y-2 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:border-amber-600/60"
                >
                  {/* Subtle red thumbtack top-left */}
                  <div className="thumbtack absolute -top-2 left-3 z-10" />

                  {/* Header info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar silhouette badge */}
                      <div className="w-8 h-8 rounded bg-[#120f0d] border border-[#5c4631] flex items-center justify-center text-amber-500 font-bold text-xs shadow-inner">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-typewriter font-bold text-[#e6d8c3] text-sm tracking-wide">
                          {s.name}
                        </div>
                        <div className="text-[10px] text-amber-500/80 font-mono">
                          {s.role}
                        </div>
                      </div>
                    </div>

                    {/* Match Selection Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={matches[s.id] || ''}
                        onChange={(e) => handleSelect(s.id, e.target.value)}
                        className="bg-[#0f0d0b] text-[#e6d8c3] text-xs font-mono py-1.5 px-2.5 rounded border border-[#5c4631] focus:border-amber-500 focus:outline-none shadow-inner"
                      >
                        <option value="">-- Match Evidence --</option>
                        <option value="none">No Contradiction</option>
                        {evidenceCards.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.id}: {e.title.slice(0, 24)}...
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Testimony Block */}
                  <blockquote className="font-serif italic text-zinc-300 text-xs bg-[#120f0d]/80 p-3 rounded border-l-4 border-amber-700 leading-relaxed">
                    "{s.statement}"
                  </blockquote>

                  {/* Red string connection badge */}
                  {matchedEv && (
                    <div className="flex items-center justify-between pt-1 border-t border-[#3d2e20] text-[11px] font-mono">
                      <span className="flex items-center gap-1.5 text-red-400 font-bold">
                        <LinkIcon className="w-3 h-3 text-red-500" />
                        {matchedEv === 'none' ? 'DECLARED UNCONTRADICTED' : `THREAD LINKED TO EVIDENCE ${matchedEv}`}
                      </span>
                      <span className="text-[10px] text-zinc-500">EXHIBIT CONNECTION TAG</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Physical Evidence Registry (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b-2 border-signal/30 text-xs">
            <span className="font-typewriter font-bold text-label flex items-center gap-2">
              <FileText className="w-4 h-4 text-signal" />
              PHYSICAL EVIDENCE ARCHIVE
            </span>
            <span className="text-[11px] font-mono text-dim">9 EXHIBITS</span>
          </div>

          <div className="cork-board p-3 rounded-lg border-2 border-[#5c4631] max-h-[580px] overflow-y-auto space-y-2.5 shadow-inner">
            {evidenceCards.map((e) => {
              const isLinked = activeLinkedEvidences.includes(e.id);
              return (
                <div
                  key={e.id}
                  className={`paper-sheet p-3.5 rounded border transition-all relative ${
                    isLinked
                      ? 'border-red-700 bg-[#fff9ee] shadow-[0_0_12px_rgba(185,28,28,0.4)] scale-[1.01]'
                      : 'border-amber-900/30 hover:border-amber-900/60'
                  }`}
                >
                  {/* Brass pushpin on top */}
                  <div className="thumbtack absolute -top-2 right-4 z-10" />

                  <div className="flex items-center justify-between pb-1 border-b border-ink/15 mb-1.5">
                    <span className="font-typewriter font-bold text-xs text-red-950 flex items-center gap-1.5">
                      <Pin className="w-3 h-3 text-red-800" />
                      {e.title}
                    </span>
                    <span className="px-1.5 py-0.2 bg-amber-900/10 rounded text-[10px] font-mono font-bold text-amber-900 border border-amber-900/20">
                      {e.id}
                    </span>
                  </div>

                  <p className="font-serif text-xs text-zinc-900 leading-relaxed">
                    {e.description}
                  </p>

                  {isLinked && (
                    <div className="mt-2 pt-1 border-t border-dashed border-red-400 text-[10px] font-mono font-bold text-red-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block mr-1" />
                      CROSS-EXAMINATION PINNED TO WITNESS
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Action Box */}
      <div className="p-4 bg-tape/90 rounded-lg border-2 border-signal/40 shadow-desk flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-typewriter text-xs text-label font-bold block tracking-wider">
            CONTRADICTION VERIFICATION MATRIX
          </span>
          <span className="text-[11px] font-mono text-dim">
            Select an evidence item (or 'No Contradiction') for each individual to verify findings.
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || Object.values(matches).some((v) => !v)}
          className="px-7 py-2.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors shadow-md disabled:opacity-50"
        >
          {submitting ? 'Verifying Statements...' : 'Verify Contradictions'}
        </button>
      </div>

      {feedback?.error && (
        <div className="p-3 bg-red-950/80 rounded-lg border-2 border-red-800 text-xs font-serif text-red-200 flex items-center gap-2.5 shadow">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{feedback.error}</span>
        </div>
      )}
    </div>
  );
};
