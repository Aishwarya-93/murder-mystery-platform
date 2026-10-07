import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ArrowUp, ArrowDown, BookOpen, AlertCircle, Sparkles, Volume2, Key, Disc, FileText } from 'lucide-react';

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

  // Rotation angles for organic paper stacking effect
  const rotations = ['rotate-[-0.4deg]', 'rotate-[0.6deg]', 'rotate-[-0.3deg]', 'rotate-[0.5deg]', 'rotate-[-0.5deg]'];

  return (
    <div className="space-y-5">
      {/* Overview Dossier Banner */}
      <div className="paper-sheet p-4 rounded-lg border-2 border-amber-900/40 shadow-sm text-xs text-ink font-serif flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-xl leading-relaxed">
          Mira's handwritten therapy notes were recovered unbound and disordered from her bedside bureau. Examine cross-references to Julian's funeral, Dr. Vane's private sessions, and the growing silence to reconstruct the authentic chronological sequence of events.
        </p>
        <span className="stamp stamp-open text-[10px]">EVIDENCE EXHIBIT 13</span>
      </div>

      {/* Disordered Diary Pages List */}
      <div className="space-y-3.5">
        {pages.map((p, idx) => (
          <div
            key={p.id}
            className={`paper-sheet p-5 rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.35)] border-2 border-[#bfa888] text-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all relative transform ${
              rotations[idx % rotations.length]
            } hover:rotate-0 hover:border-amber-700`}
          >
            {/* Lined paper left margin styling */}
            <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-red-400/30 hidden sm:block" />

            <div className="flex-1 space-y-2 sm:pl-4">
              <div className="flex items-center gap-2">
                <span className="font-typewriter font-bold text-xs uppercase tracking-wider text-red-950">
                  SHEET POSITION #{idx + 1}
                </span>
                <span className="text-[11px] font-mono text-zinc-600 font-bold px-1.5 py-0.5 rounded bg-manila/80 border border-ink/10">
                  {p.label}
                </span>
              </div>

              {/* Authentic Handwriting */}
              <p className="font-handwriting text-xl sm:text-2xl text-zinc-950 leading-relaxed font-normal">
                {p.text}
              </p>
            </div>

            {/* Reorder Buttons */}
            <div className="flex sm:flex-col items-center gap-1.5 shrink-0 self-end sm:self-center z-10 bg-amber-950/10 p-1 rounded-lg border border-amber-900/20">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0 || isSolved}
                aria-label={`Move ${p.label} up`}
                className="p-2 rounded bg-amber-100 hover:bg-amber-200 text-zinc-900 border border-amber-300 disabled:opacity-30 transition-all shadow-sm active:translate-y-0.5"
                title="Move earlier in timeline"
              >
                <ArrowUp className="w-4 h-4 text-zinc-900" />
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === pages.length - 1 || isSolved}
                aria-label={`Move ${p.label} down`}
                className="p-2 rounded bg-amber-100 hover:bg-amber-200 text-zinc-900 border border-amber-300 disabled:opacity-30 transition-all shadow-sm active:translate-y-0.5"
                title="Move later in timeline"
              >
                <ArrowDown className="w-4 h-4 text-zinc-900" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Verify Order Button */}
      {!isSolved && (
        <div className="p-4 bg-tape/90 rounded-lg border-2 border-signal/40 shadow-desk flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-typewriter text-label font-bold">RECONSTRUCTED SEQUENCE:</span>
            <span className="font-mono text-signal font-bold tracking-widest bg-ink px-2.5 py-1 rounded border border-signal/30">
              {pages.map((p) => p.label.slice(-1)).join(' → ')}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors shadow-md disabled:opacity-50"
          >
            {submitting ? 'Verifying Chronology...' : 'Verify Chronological Order'}
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-950/80 rounded-lg border-2 border-red-800 text-xs font-serif text-red-200 flex items-center gap-2 shadow">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SOLVED ARTIFACTS: Mira's Confirmed Statement & Antique Music Box */}
      {isSolved && (
        <div className="space-y-5 pt-4 border-t-2 border-[#5c4631]">
          {/* Mira's First Spoken Statement Card */}
          <div className="paper-sheet p-5 rounded-lg border-l-4 border-ok text-ink shadow-[0_6px_20px_rgba(0,0,0,0.3)] space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-ink/20">
              <span className="font-typewriter font-bold text-xs flex items-center gap-2 text-zinc-950">
                <BookOpen className="w-4 h-4 text-ok" />
                MIRA VALE: VERIFIED WITNESS STATEMENT
              </span>
              <span className="stamp stamp-closed text-[9px]">CONFIRMED</span>
            </div>
            <blockquote className="font-serif italic text-xs leading-relaxed text-zinc-900 bg-manila/50 p-3 rounded border border-ink/10">
              "You read it in the order I wrote it. Elias always told me I had it jumbled. He came the day before he died. He brought my music box back and said he'd had it repaired. It doesn't play. I haven't touched it."
            </blockquote>
          </div>

          {/* Ornate Antique Music Box Showcase */}
          <div className="relative bg-gradient-to-b from-[#2e1d14] via-[#22150e] to-[#160c07] p-6 rounded-xl border-4 border-[#5c3a21] shadow-[0_15px_35px_rgba(0,0,0,0.7)] space-y-5 text-center">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#5c3a21] text-xs gap-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <span className="font-typewriter font-bold text-[#e6d8c3] tracking-wider text-xs sm:text-sm">
                  EXHIBIT 14: THE INLAID MAHOGANY MUSIC BOX
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-black/60 text-[#c9a777] font-mono text-[11px] border border-[#5c3a21]">
                SWISS CYLINDER MOVEMENT
              </span>
            </div>

            {/* Embedded SVG Illustration in ornate velvet-lined frame */}
            <div className="flex justify-center p-4 bg-[#100804] rounded-lg border-2 border-[#452a17] shadow-inner">
              <img
                src="/api/levels/6/assets/musicbox.svg"
                alt="Antique Music Box with concealed false base"
                className="max-h-64 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
              />
            </div>

            {!musicBoxOpen ? (
              <button
                onClick={() => setMusicBoxOpen(true)}
                className="px-7 py-3 bg-gradient-to-b from-[#b8860b] to-[#926808] hover:from-[#d4af37] hover:to-[#b8860b] text-zinc-950 font-serif font-bold text-sm rounded-lg transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-2.5 mx-auto active:translate-y-0.5 border border-yellow-300/40"
              >
                <Sparkles className="w-4 h-4" />
                <span>Examine Mechanism & Open Concealed False Base</span>
              </button>
            ) : (
              <div className="paper-sheet p-5 rounded-lg text-left border-l-4 border-alarm space-y-3 shadow-xl animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-1.5 border-b border-ink/20">
                  <span className="font-typewriter font-bold text-xs text-alarm flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-alarm" />
                    CONCEALED MICRO-CASSETTE: DR. VANE'S FINAL CONFESSION RECORDING
                  </span>
                  <span className="stamp stamp-skipped text-[9px]">RESTRICTED TESTIMONY</span>
                </div>
                <div className="font-serif text-xs leading-relaxed text-zinc-950 italic bg-manila/60 p-4 rounded border border-ink/15">
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
