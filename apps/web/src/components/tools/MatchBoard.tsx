import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Users, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="paper-sheet p-3 rounded text-xs text-ink font-serif border border-ink/20">
        <p>
          Cross-examine each individual's recorded statement against the physical evidence files. Identify which evidence document directly refutes their testimony, or declare <strong>No Contradiction</strong> if current evidence does not break their statement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Suspect Statements (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between pb-1 border-b border-signal/20 text-xs">
            <span className="font-typewriter font-bold text-label flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-signal" />
              RECORDED TESTIMONY & CLAIMS
            </span>
            <span className="text-[11px] font-mono text-dim">6 STATEMENTS</span>
          </div>

          {suspects.map((s) => (
            <div
              key={s.id}
              className="p-3 rounded bg-tape/80 border border-signal/30 text-xs space-y-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-typewriter font-bold text-label text-xs sm:text-sm">
                    {s.name}
                  </span>
                  <span className="text-[10px] text-signal font-mono ml-2">
                    ({s.role})
                  </span>
                </div>

                {/* Evidence Dropdown */}
                <select
                  value={matches[s.id] || ''}
                  onChange={(e) => handleSelect(s.id, e.target.value)}
                  className="bg-ink text-label text-xs font-mono py-1 px-2 rounded border border-signal/40 focus:border-signal focus:outline-none"
                >
                  <option value="">-- Match Evidence --</option>
                  <option value="none">No Contradiction</option>
                  {evidenceCards.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.id}
                    </option>
                  ))}
                </select>
              </div>

              <blockquote className="font-serif italic text-dim text-xs bg-ink/50 p-2 rounded border-l-2 border-signal">
                "{s.statement}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Right Column: Evidence Index (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-signal/20 text-xs">
            <span className="font-typewriter font-bold text-label flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-signal" />
              PHYSICAL EVIDENCE REGISTRY
            </span>
            <span className="text-[11px] font-mono text-dim">9 CARDS</span>
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {evidenceCards.map((e) => (
              <div
                key={e.id}
                className="p-2.5 rounded bg-ink/80 border border-signal/20 text-xs hover:border-signal/50 transition-colors"
              >
                <div className="font-typewriter font-bold text-signal text-[11px] mb-0.5">
                  {e.title}
                </div>
                <div className="font-serif text-[11px] text-dim leading-relaxed">
                  {e.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button & Feedback */}
      <div className="p-3 bg-tape rounded border border-signal/30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-typewriter text-xs text-label font-bold block">
            CONTRADICTION VERIFICATION MATRIX
          </span>
          <span className="text-[11px] font-mono text-dim">
            Select an evidence item (or 'No Contradiction') for every individual.
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || Object.values(matches).some((v) => !v)}
          className="px-6 py-2 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors shadow disabled:opacity-50"
        >
          {submitting ? 'Verifying Statements...' : 'Verify Contradictions'}
        </button>
      </div>

      {feedback?.error && (
        <div className="p-2.5 bg-alarm/20 rounded border border-alarm/40 text-xs font-serif text-alarm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.error}</span>
        </div>
      )}
    </div>
  );
};
