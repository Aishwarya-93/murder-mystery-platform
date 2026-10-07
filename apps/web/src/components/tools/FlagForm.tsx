import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ShieldAlert, KeyRound, AlertCircle, Volume2, FileText, CheckCircle2 } from 'lucide-react';

export const FlagForm: React.FC = () => {
  const { levelDetail, submitAnswer, setTheoryModalOpen } = useGameStore();

  const [flagInput, setFlagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    const res = await submitAnswer(flagInput.trim());
    if (!res.correct) {
      setErrorMessage('Verification flag rejected. Follow the OSINT marker referencing badge 4417.');
    } else {
      setFlagInput('');
    }
    setSubmitting(false);
  };

  const isSolved = levelDetail?.status === 'SOLVED' || levelDetail?.status === 'SKIPPED';

  return (
    <div className="space-y-4">
      {/* Interrogation Room Scene Briefing */}
      <div className="paper-sheet p-4 rounded border-l-4 border-alarm text-ink shadow-paper space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-ink/20">
          <span className="font-typewriter font-bold text-xs uppercase flex items-center gap-2 text-alarm">
            <ShieldAlert className="w-4 h-4 text-alarm" />
            INTERROGATION LOG: ADRIAN CROSS STATEMENT
          </span>
          <span className="stamp stamp-closed text-[9px]">WITNESSED</span>
        </div>

        <blockquote className="font-serif italic text-xs leading-relaxed text-ink/90 bg-manila/60 p-3 rounded border border-ink/10">
          "You think I acted alone? I'm not a network administrator. I didn't schedule that security maintenance window from 21:20 to 23:50 that blinded every sensor in the house. I didn't delete my name from the system log export. Ask who requested account <strong>LIAISON_4417</strong>. And ask who signed Julian's altered death report three years ago."
        </blockquote>

        <p className="font-serif text-xs leading-relaxed text-ink/80">
          External intelligence indicates that club members' public social profiles contain encoded Base64 parameters pointing toward QR verification targets. Trace the identity associated with badge/liaison <strong>4417</strong>.
        </p>
      </div>

      {/* Flag Form */}
      {!isSolved && (
        <form onSubmit={handleSubmit} className="p-4 bg-tape/80 rounded border border-signal/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-serif text-label font-medium">
            <KeyRound className="w-4 h-4 text-signal" />
            <span>Enter Case Verification Flag (e.g. FLAG&#123;NAME_SURNAME&#125;):</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="FLAG{...}"
              className="flex-1 bg-ink text-label font-mono text-sm px-3 py-2 rounded border border-signal/40 focus:border-signal focus:outline-none uppercase"
            />
            <button
              type="submit"
              disabled={submitting || !flagInput.trim()}
              className="px-6 py-2 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors shadow disabled:opacity-50"
            >
              {submitting ? 'Verifying Flag...' : 'Submit Final Flag'}
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-alarm font-serif mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      )}

      {/* Unlocked Artifacts: Recording Nine & Elias's Note */}
      {isSolved && (
        <div className="space-y-4 pt-2">
          {/* Recording Nine */}
          <div className="paper-sheet p-4 rounded border-l-4 border-alarm text-ink shadow-paper space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-ink/20">
              <span className="font-typewriter font-bold text-xs text-alarm flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-alarm" />
                TRANSCRIPT: RECORDING NINE (PATIENT P-0912)
              </span>
              <span className="stamp stamp-skipped text-[9px]">CRIMINAL CONFESSION</span>
            </div>
            <div className="font-serif text-xs leading-relaxed text-ink/90 italic bg-manila/50 p-3 rounded">
              <strong>DETECTIVE ROWAN HALE:</strong> "I altered the time of death on Julian's file to 20:40 because you told me you were at that dinner until 9:15, Elias. You told me it was an accident. But if anyone ever links badge 4417 to that crime scene before the 999 dispatch was logged... we both go down for murder."
            </div>
          </div>

          {/* Elias's Last Note */}
          <div className="paper-sheet p-4 rounded border-l-4 border-signal text-ink shadow-paper space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-ink/20">
              <span className="font-typewriter font-bold text-xs text-ink flex items-center gap-2">
                <FileText className="w-4 h-4 text-signal" />
                DR. ELIAS VANE: SEALED FINAL NOTE
              </span>
              <span className="stamp stamp-closed text-[9px]">EVIDENCE 10</span>
            </div>
            <div className="font-serif text-sm leading-relaxed text-ink/90 font-bold text-center py-3 bg-manila/40 rounded">
              "The person investigating my death already knows who killed me."
              <span className="block text-xs font-normal text-ink/70 mt-1 font-mono">
                Filed under Subject: Detective Rowan Hale
              </span>
            </div>
          </div>

          {/* Proceed to Final Theory Action */}
          <div className="bg-tape p-4 rounded border-2 border-signal flex items-center justify-between gap-4">
            <div>
              <span className="font-typewriter text-xs font-bold text-label block">
                ALL 10 FORENSIC CASES CONCLUDED
              </span>
              <span className="text-[11px] font-serif text-dim">
                Proceed to the Final Case Theory of the Prosecution to formulate your official finding.
              </span>
            </div>

            <button
              onClick={() => setTheoryModalOpen(true)}
              className="px-6 py-2.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs sm:text-sm rounded shadow transition-all animate-pulse"
            >
              Open Final Case Theory Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
