import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Cpu, Printer, AlertCircle, CheckCircle2 } from 'lucide-react';

export const KitStation: React.FC = () => {
  const { team, levelDetail, submitAnswer } = useGameStore();

  const [answerInput, setAnswerInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const kitNo = team?.kitNo || levelDetail?.kitNo || 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    const res = await submitAnswer(answerInput.trim());
    if (!res.correct) {
      setErrorMessage('Hardware register output does not reconcile with Kit #' + kitNo + '. Inspect truth table connections.');
    } else {
      setAnswerInput('');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* Physical Station Callout Card */}
      <div className="bg-tape p-5 rounded border-2 border-signal/40 shadow-desk space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-signal/30">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-signal" />
            <span className="font-typewriter font-bold text-sm text-label">
              PHYSICAL HARDWARE STATION // RELAY LOGIC ANALYSIS
            </span>
          </div>
          <span className="stamp stamp-open text-xs">OFFLINE STATION</span>
        </div>

        <p className="font-serif text-xs leading-relaxed text-dim">
          The garage controller runs dedicated electromechanical relay logic and holds internal non-volatile memory registers. Refer to the physical digital electronics breadboard kit placed on your squad table.
        </p>

        {/* Big Kit Number Display */}
        <div className="p-4 bg-ink/90 rounded border border-signal/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-dim block">ASSIGNED HARDWARE UNIT:</span>
            <span className="font-typewriter text-2xl font-bold text-signal">
              KIT #{kitNo}
            </span>
          </div>

          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3 py-1.5 bg-tape hover:bg-tape/80 text-label font-serif text-xs rounded border border-signal/30 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-signal" />
            <span>Printable Task Worksheet</span>
          </button>
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-tape/80 rounded border border-signal/30 space-y-3">
        <label className="block text-xs font-serif text-label font-medium">
          Enter the value you read from your physical Kit #{kitNo}:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="e.g. 67"
            className="flex-1 bg-ink text-label font-mono text-sm px-3 py-2 rounded border border-signal/40 focus:border-signal focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !answerInput.trim()}
            className="px-6 py-2 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors shadow disabled:opacity-50"
          >
            {submitting ? 'Verifying Hardware...' : 'Submit Kit Value'}
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-alarm font-serif mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>

      {/* Printable Task Sheet Modal */}
      {showPrintModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="worksheet-title"
          className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white"
        >
          <div className="paper-sheet max-w-2xl w-full p-8 rounded text-ink shadow-desk border-2 border-signal relative print:border-none print:shadow-none print:max-w-none print:w-full">
            <div className="flex items-center justify-between pb-3 border-b-2 border-ink mb-4">
              <div>
                <h3 id="worksheet-title" className="font-typewriter text-lg font-bold">
                  CASE ARCHIVE 1986 // GARAGE CONTROLLER WORKSHEET
                </h3>
                <span className="text-xs font-mono text-ink/75">METROPOLITAN INVESTIGATION UNIT</span>
              </div>
              <div className="border-2 border-ink px-3 py-1 font-typewriter font-bold text-sm">
                KIT #{kitNo}
              </div>
            </div>

            <div className="space-y-4 font-serif text-xs leading-relaxed">
              <p>
                <strong>Squad Name:</strong> {team?.name || '__________________________'} &nbsp;&nbsp;&nbsp;&nbsp;
                <strong>Date:</strong> 23 October 2026
              </p>
              <div className="border border-dashed border-ink/40 p-12 text-center text-ink/50 italic">
                [ ORGANIZER KIT TASK INSTRUCTIONS SHEET ]
                <br />
                <span className="text-[11px]">The organizer supplies physical circuit wiring / relay schematic here.</span>
              </div>
              <div className="pt-8 border-t border-ink/20 flex justify-between text-xs font-mono">
                <div>OFFICER SIGNATURE: __________________</div>
                <div>REGISTER VALUE: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-1.5 rounded border border-ink/40 font-serif text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-1.5 bg-signal text-ink font-serif font-bold text-xs rounded flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
