import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ArrowUp, ArrowDown, BookOpen, AlertCircle, Sparkles, Volume2 } from 'lucide-react';

interface DiaryPage {
  id: string;
  label: string;
  text: string;
}

export const DiaryTable: React.FC = () => {
  const { levelDetail, submitAnswer } = useGameStore();

  const initialPages: DiaryPage[] = levelDetail?.diaryPages || [];
  const [pages, setPages] = useState<DiaryPage[]>(initialPages);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Music Box state
  const [musicBoxOpen, setMusicBoxOpen] = useState(false);

  useEffect(() => {
    if (initialPages.length > 0 && pages.length === 0) {
      setPages(initialPages);
    }
  }, [initialPages]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newPages = [...pages];
    const temp = newPages[index - 1];
    newPages[index - 1] = newPages[index];
    newPages[index] = temp;
    setPages(newPages);
  };

  const moveDown = (index: number) => {
    if (index === pages.length - 1) return;
    const newPages = [...pages];
    const temp = newPages[index + 1];
    newPages[index + 1] = newPages[index];
    newPages[index] = temp;
    setPages(newPages);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    const orderStr = pages.map((p) => p.id).join(',');
    const res = await submitAnswer(orderStr);

    if (!res.correct) {
      setErrorMessage('The chronological progression does not align. Compare relative references between the funeral, session notes, and silence.');
    }
    setSubmitting(false);
  };

  const isSolved = levelDetail?.status === 'SOLVED' || levelDetail?.status === 'SKIPPED';

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="paper-sheet p-3 rounded text-xs text-ink font-serif border border-ink/20">
        <p>
          Mira's handwritten therapy notes were recovered unbound and disordered. Use the <strong>Move Up</strong> and <strong>Move Down</strong> controls to reconstruct the authentic chronological sequence of events.
        </p>
      </div>

      {/* Diary Pages List */}
      <div className="space-y-3">
        {pages.map((p, idx) => (
          <div
            key={p.id}
            className="paper-sheet p-4 rounded shadow-paper border border-ink/20 text-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-transform"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-typewriter font-bold text-xs text-ink/70">
                  SHEET POSITION #{idx + 1}
                </span>
                <span className="text-[11px] font-mono text-dim">
                  ({p.label})
                </span>
              </div>
              {/* Handwriting font */}
              <p className="font-handwriting text-lg sm:text-xl text-ink leading-snug">
                {p.text}
              </p>
            </div>

            {/* Accessible Reorder Buttons */}
            <div className="flex sm:flex-col items-center gap-1 shrink-0 self-end sm:self-center">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0 || isSolved}
                aria-label={`Move ${p.label} up`}
                className="p-1.5 rounded bg-ink/10 hover:bg-ink/20 text-ink disabled:opacity-30 transition-colors"
                title="Move earlier in timeline"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === pages.length - 1 || isSolved}
                aria-label={`Move ${p.label} down`}
                className="p-1.5 rounded bg-ink/10 hover:bg-ink/20 text-ink disabled:opacity-30 transition-colors"
                title="Move later in timeline"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Verify Order Button */}
      {!isSolved && (
        <div className="p-3 bg-tape rounded border border-signal/30 flex items-center justify-between gap-3">
          <span className="font-typewriter text-xs text-label">
            Reconstructed Sequence: {pages.map((p) => p.label.slice(-1)).join(' → ')}
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors shadow disabled:opacity-50"
          >
            {submitting ? 'Verifying Chronology...' : 'Verify Chronological Order'}
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-2.5 bg-alarm/20 rounded border border-alarm/40 text-xs font-serif text-alarm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SOLVE ARTIFACTS: Mira's Statement & Music Box */}
      {isSolved && (
        <div className="space-y-4 pt-4 border-t border-signal/30">
          {/* Mira's First Spoken Statement Card */}
          <div className="paper-sheet p-4 rounded border-l-4 border-signal text-ink shadow-paper space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-ink/20">
              <span className="font-typewriter font-bold text-xs flex items-center gap-2 text-ink">
                <BookOpen className="w-4 h-4 text-signal" />
                MIRA VALE: WITNESS STATEMENT RECORD
              </span>
              <span className="stamp stamp-closed text-[9px]">CONFIRMED</span>
            </div>
            <blockquote className="font-serif italic text-xs leading-relaxed text-ink/90">
              "You read it in the order I wrote it. Elias always told me I had it jumbled. He came the day before he died. He brought my music box back and said he'd had it repaired. It doesn't play. I haven't touched it."
            </blockquote>
          </div>

          {/* Music Box Interactive Illustration */}
          <div className="bg-tape p-5 rounded border-2 border-signal shadow-desk space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-signal/30 text-xs">
              <span className="font-typewriter font-bold text-label">
                EXHIBIT 14: THE INLAID MAHOGANY MUSIC BOX
              </span>
              <span className="text-[11px] font-mono text-dim">RETURNED BY DR. VANE</span>
            </div>

            {/* Embedded SVG Illustration */}
            <div className="flex justify-center p-2 bg-ink/40 rounded">
              <img
                src="/api/levels/6/assets/musicbox.svg"
                alt="Antique Music Box with concealed false base"
                className="max-h-64 object-contain"
              />
            </div>

            {!musicBoxOpen ? (
              <button
                onClick={() => setMusicBoxOpen(true)}
                className="px-6 py-2.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-sm rounded transition-all shadow flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Examine & Open Concealed False Base</span>
              </button>
            ) : (
              <div className="paper-sheet p-4 rounded text-left border-l-4 border-alarm space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-1 border-b border-ink/20">
                  <span className="font-typewriter font-bold text-xs text-alarm flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-alarm" />
                    CONCEALED MICRO-CASSETTE: DR. VANE'S FINAL TESTIMONY
                  </span>
                  <span className="stamp stamp-skipped text-[9px]">EMERGENCY RECORDING</span>
                </div>
                <div className="font-serif text-xs leading-relaxed text-ink/90 italic bg-manila/50 p-3 rounded">
                  <strong>DR. ELIAS VANE:</strong> "If you're hearing this, something has gone wrong. Three days ago I realised who my assistant really is. He used his father's name. I should have known Helen's son by his eyes the day he walked in."
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
