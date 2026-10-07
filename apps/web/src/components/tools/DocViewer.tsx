import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Lock, FileText, PhoneCall, Newspaper, AlertCircle, Printer } from 'lucide-react';

export const DocViewer: React.FC = () => {
  const { levelDetail, submitAnswer } = useGameStore();
  const currentStage = levelDetail?.currentStageIndex || 0;

  // Stage 1 Gate state
  const [gateYear, setGateYear] = useState('');
  const [gateSurname, setGateSurname] = useState('');

  // Stage 2 Questions state
  const [minutesInput, setMinutesInput] = useState('');
  const [badgeInput, setBadgeInput] = useState('');
  const [earlyMinutesInput, setEarlyMinutesInput] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<'D2' | 'D3' | 'D4'>('D2');

  const handleStage1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateYear.trim() || !gateSurname.trim()) return;
    setSubmitting(true);
    setErrorMessage(null);

    const combined = `${gateYear.trim()}${gateSurname.trim()}`;
    const res = await submitAnswer(combined);
    if (!res.correct) {
      setErrorMessage(res.nudge || 'Invalid archive authorization. Check play premiere year and husband surname.');
    }
    setSubmitting(false);
  };

  const handleStage2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!minutesInput.trim() || !badgeInput.trim()) return;
    setSubmitting(true);
    setErrorMessage(null);

    const combined = `${minutesInput.trim()}-${badgeInput.trim()}`;
    const res = await submitAnswer(combined);
    if (!res.correct) {
      setErrorMessage(res.nudge || 'Values do not reconcile with official D2/D3 documents.');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* STAGE 1: GATE */}
      {currentStage === 0 && (
        <div className="paper-sheet p-5 rounded border-2 border-signal shadow-paper space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ink/20">
            <span className="font-typewriter font-bold text-xs uppercase flex items-center gap-2">
              <Lock className="w-4 h-4 text-signal" />
              RESTRICTED POLICE ARCHIVE // SECURITY PASS-KEY
            </span>
            <span className="stamp stamp-sealed text-[10px]">LOCKED</span>
          </div>

          <p className="font-serif text-xs leading-relaxed text-ink/90">
            To view the sealed 2023 homicide dossier, identify Patrick Hamilton's Victorian stage thriller where a husband dims the gas lamps and insists his wife imagined it.
          </p>

          <form onSubmit={handleStage1Submit} className="space-y-3 bg-manila/60 p-4 rounded border border-ink/15">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-typewriter font-bold text-ink mb-1">
                  Year of London Premiere:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={gateYear}
                  onChange={(e) => setGateYear(e.target.value)}
                  placeholder="e.g. 1938"
                  className="w-full bg-label/90 text-ink font-mono text-sm px-3 py-1.5 rounded border border-ink/40 focus:border-signal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-typewriter font-bold text-ink mb-1">
                  Husband's Surname:
                </label>
                <input
                  type="text"
                  value={gateSurname}
                  onChange={(e) => setGateSurname(e.target.value)}
                  placeholder="e.g. MANNINGHAM"
                  className="w-full bg-label/90 text-ink font-mono text-sm px-3 py-1.5 rounded border border-ink/40 focus:border-signal focus:outline-none uppercase"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-ink/70">
                Combined password format: [YEAR][SURNAME]
              </span>
              <button
                type="submit"
                disabled={submitting || !gateYear.trim() || !gateSurname.trim()}
                className="px-5 py-2 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors shadow disabled:opacity-50"
              >
                {submitting ? 'Authenticating...' : 'Unlock Restricted File'}
              </button>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-1.5 text-xs text-alarm font-serif mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* STAGE 2: UNLOCKED DOCUMENTS */}
      {currentStage >= 1 && (
        <div className="space-y-4">
          {/* Document Navigation Tabs */}
          <div className="flex items-center justify-between bg-tape p-1.5 rounded border border-signal/30 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveDocTab('D2')}
                className={`px-3 py-1.5 rounded font-serif transition-colors flex items-center gap-1.5 ${
                  activeDocTab === 'D2'
                    ? 'bg-manila text-ink font-bold shadow'
                    : 'text-dim hover:text-label'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Doc 2: Police Report</span>
              </button>

              <button
                onClick={() => setActiveDocTab('D3')}
                className={`px-3 py-1.5 rounded font-serif transition-colors flex items-center gap-1.5 ${
                  activeDocTab === 'D3'
                    ? 'bg-manila text-ink font-bold shadow'
                    : 'text-dim hover:text-label'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Doc 3: Phone Records</span>
              </button>

              <button
                onClick={() => setActiveDocTab('D4')}
                className={`px-3 py-1.5 rounded font-serif transition-colors flex items-center gap-1.5 ${
                  activeDocTab === 'D4'
                    ? 'bg-manila text-ink font-bold shadow'
                    : 'text-dim hover:text-label'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Doc 4: Gazette Press Clip</span>
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="p-1.5 text-dim hover:text-label rounded"
              title="Print evidence sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          {/* Document Content View */}
          <div className="paper-sheet p-6 rounded shadow-paper border border-ink/20 text-ink min-h-[320px]">
            {activeDocTab === 'D2' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                  <div>
                    <h3 className="font-typewriter text-base font-bold tracking-widest uppercase">
                      METROPOLITAN POLICE SERVICE // INCIDENT REPORT
                    </h3>
                    <p className="text-[11px] font-mono text-ink/75">
                      REF: CRIM-02-12-23 • SECTOR 4B • CONFIDENTIAL
                    </p>
                  </div>
                  <span className="stamp stamp-open text-xs">OFFICIAL COPY</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <strong>Date of Incident:</strong> 02 December 2023<br />
                    <strong>Location:</strong> 8 Park Terrace, London NW1<br />
                    <strong>Deceased:</strong> Julian Marsh (Male, 27)
                  </div>
                  <div>
                    <strong>999 Emergency Dispatch Logged:</strong> 22:20 BST<br />
                    <strong>First Responding Officer Arrival:</strong> 22:05 BST<br />
                    <strong>Attending Officer:</strong> Badge 4417
                  </div>
                </div>

                <div className="p-3 bg-manila/50 rounded border border-ink/20 text-xs font-serif leading-relaxed">
                  <h4 className="font-typewriter font-bold mb-1">FORENSIC ATTENDANCE SUMMARY:</h4>
                  <p>
                    Responding officer arrived on scene. Discovered subject Julian Marsh deceased in ground floor drawing room. Individual Mira Vale discovered in shock beside the body. Initial rigor and physical state evaluated.
                  </p>
                  <p className="mt-2 font-mono font-bold text-signal">
                    OFFICIAL ESTIMATED TIME OF DEATH: 20:40 BST
                  </p>
                  <p className="mt-2 text-[11px] text-ink/70 italic">
                    Officer Signature: [Smudged stamp: Det. Const. Badge 4417]
                  </p>
                </div>
              </div>
            )}

            {activeDocTab === 'D3' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                  <div>
                    <h3 className="font-typewriter text-base font-bold tracking-widest uppercase">
                      BRITISH TELECOM // SUBSCRIBER CALL RECORD
                    </h3>
                    <p className="text-[11px] font-mono text-ink/75">
                      SUB: JULIAN MARSH • LINE ID: 020 7946 0144
                    </p>
                  </div>
                  <span className="stamp stamp-closed text-xs">CERTIFIED</span>
                </div>

                <div className="text-xs font-mono">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-ink/40">
                        <th className="py-1">TIME</th>
                        <th className="py-1">DESTINATION</th>
                        <th className="py-1">CALLED PARTY</th>
                        <th className="py-1">DURATION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/15 text-[11px]">
                      <tr>
                        <td className="py-1">18:40:12</td>
                        <td>020 7946 0882</td>
                        <td>Helen Marsh (Mother)</td>
                        <td>04m 12s</td>
                      </tr>
                      <tr className="bg-signal/10 font-bold">
                        <td className="py-1 text-signal">21:12:04</td>
                        <td className="text-signal">020 7946 0912</td>
                        <td className="text-signal">Dr. Elias Vane (Consultant)</td>
                        <td className="text-signal">00m 47s</td>
                      </tr>
                      <tr>
                        <td className="py-1">21:45:00</td>
                        <td>--</td>
                        <td>NO OUTGOING TRAFFIC</td>
                        <td>--</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-manila/50 rounded border border-ink/20 text-xs font-serif leading-relaxed italic">
                  Note: Telecommunications exchange timestamp is synchronized against Rugby atomic reference. Call initiation is verified accurate to within ±200ms.
                </div>
              </div>
            )}

            {activeDocTab === 'D4' && (
              <div className="space-y-3 font-serif">
                <div className="border-b-2 border-ink pb-1 font-typewriter">
                  <span className="text-sm font-bold tracking-wider">THE NORTH LONDON GAZETTE</span>
                  <span className="text-xs text-ink/70 block font-mono">5 December 2023 • Page 4</span>
                </div>
                <h4 className="font-bold text-sm leading-snug">
                  HAMPSTEAD TRAGEDY: PSYCHOLOGIST'S PATIENT QUESTIONED IN UNRESOLVED DEATH
                </h4>
                <p className="text-xs leading-relaxed text-ink/90">
                  Police sources confirmed yesterday that investigators are scrutinizing the final hours of Julian Marsh, found deceased in Park Terrace late Saturday evening. Prominent consultant psychologist Dr. Elias Vane expressed deep sorrow, confirming he had spoken with Mr. Marsh during past clinical assessments.
                </p>
                <p className="text-xs leading-relaxed text-ink/90">
                  A police spokesperson stated that responding officers arrived swiftly, noting the victim was estimated to have expired well before 9:00 PM.
                </p>
              </div>
            )}
          </div>

          {/* Stage 2 Discrepancy Form */}
          <form onSubmit={handleStage2Submit} className="p-3 bg-tape/80 rounded border border-signal/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-serif text-label font-medium mb-1">
                  Minutes between estimated TOD (20:40) and Julian's call (21:12):
                </label>
                <input
                  type="text"
                  value={minutesInput}
                  onChange={(e) => setMinutesInput(e.target.value)}
                  placeholder="32"
                  className="w-full bg-ink text-label font-mono px-3 py-1.5 rounded border border-signal/40 focus:border-signal focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-serif text-label font-medium mb-1">
                  Badge number of the first responding officer on scene:
                </label>
                <input
                  type="text"
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  placeholder="4417"
                  className="w-full bg-ink text-label font-mono px-3 py-1.5 rounded border border-signal/40 focus:border-signal focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="block font-serif text-dim text-[11px] mb-1">
                Optional: Minutes the officer arrived before 999 call was logged (recorded for organizers):
              </label>
              <input
                type="text"
                value={earlyMinutesInput}
                onChange={(e) => setEarlyMinutesInput(e.target.value)}
                placeholder="15"
                className="w-32 bg-ink text-label font-mono text-xs px-2.5 py-1 rounded border border-dim/40 focus:border-signal focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-dim">
                Submission format: [Minutes]-[Badge] (e.g. 32-4417)
              </span>
              <button
                type="submit"
                disabled={submitting || !minutesInput.trim() || !badgeInput.trim()}
                className="px-5 py-1.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors disabled:opacity-50"
              >
                {submitting ? 'Checking Dossier...' : 'Submit Forensic Discrepancy'}
              </button>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-1.5 text-xs text-alarm font-serif mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
