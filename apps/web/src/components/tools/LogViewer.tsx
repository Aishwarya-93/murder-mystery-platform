import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Search, Filter, Clock, AlertCircle, Terminal, Shield, HelpCircle } from 'lucide-react';

interface LogItem {
  id: number;
  source: string;
  timestamp: string;
  message: string;
  tz: string;
}

export const LogViewer: React.FC = () => {
  const { levelDetail, submitAnswer } = useGameStore();
  const logs: LogItem[] = levelDetail?.logs || [];

  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [answerInput, setAnswerInput] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sources = ['ALL', 'SEC', 'DOORBELL', 'PC', 'PHONE', 'THERMO'];

  const filteredLogs = logs.filter((log) => {
    const matchesSource = filterSource === 'ALL' || log.source === filterSource;
    const matchesSearch =
      searchTerm === '' ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.timestamp.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim()) return;
    setSubmitting(true);
    setErrorMessage(null);

    const res = await submitAnswer(answerInput.trim());
    if (!res.correct) {
      if (res.nudge) {
        setErrorMessage(res.nudge);
      } else {
        setErrorMessage('Incorrect time calculation. Check panel skew against doorbell courier handoff.');
      }
    } else {
      setAnswerInput('');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-5">
      {/* Visual Exhibits Row: Stopped Clock Exhibit & ME Protocol */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Visual Stopped Clock Exhibit (5 cols) */}
        <div className="md:col-span-5 bg-[#251910] p-4 rounded-sm border-2 border-signal/40 shadow-desk flex flex-col items-center justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between pb-1.5 border-b border-signal/20 text-[11px] font-mono text-dim">
            <span className="font-typewriter font-bold text-signal">EXHIBIT #A: DESK CLOCK</span>
            <span className="px-1.5 py-0.5 rounded bg-alarm/20 text-alarm font-bold">FROZEN</span>
          </div>

          {/* SVG Illustration of Staged Desk Clock stopped at 22:17 */}
          <div className="py-3 flex flex-col items-center">
            <div className="relative w-36 h-36 rounded-full border-4 border-[#C8A051] bg-[#140D08] shadow-[0_0_20px_rgba(200,160,81,0.25)] flex items-center justify-center">
              {/* Dial tick marks */}
              <div className="absolute inset-2 rounded-full border border-dashed border-[#C8A051]/30" />
              
              {/* Clock numerals */}
              <span className="absolute top-2 font-mono text-[10px] text-[#C8A051] font-bold">12</span>
              <span className="absolute right-2.5 font-mono text-[10px] text-[#C8A051] font-bold">3</span>
              <span className="absolute bottom-2 font-mono text-[10px] text-[#C8A051] font-bold">6</span>
              <span className="absolute left-2.5 font-mono text-[10px] text-[#C8A051] font-bold">9</span>

              {/* Hour & Minute Hands stopped at 10:17 (22:17) */}
              {/* Hour hand pointing at ~10 (approx -60 deg from 12) */}
              <div
                className="absolute w-1.5 h-10 bg-[#E8C071] origin-bottom rounded-full"
                style={{ transform: 'rotate(-55deg) translateY(-50%)' }}
              />
              {/* Minute hand pointing at 17 min (approx 102 deg from 12) */}
              <div
                className="absolute w-1 h-14 bg-[#FAF0D4] origin-bottom rounded-full"
                style={{ transform: 'rotate(102deg) translateY(-50%)' }}
              />
              {/* Center brass pin */}
              <div className="w-3 h-3 rounded-full bg-[#E8C071] border border-ink z-10 shadow" />

              {/* Staged crack in glass */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100">
                <path d="M 50 50 L 72 25 L 85 32 M 50 50 L 30 75" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
              </svg>
            </div>

            <div className="mt-2 text-center">
              <span className="font-typewriter text-xs font-bold text-label block">
                HANDS FROZEN AT 22:17
              </span>
              <span className="text-[10px] font-mono text-alarm italic">
                * Staging suspected by Pathologist
              </span>
            </div>
          </div>

          <div className="w-full text-center text-[10px] font-mono text-dim/80 pt-1 border-t border-signal/20">
            LOCATION: STUDY CARPET &bull; LETTER OPENER NEARBY
          </div>
        </div>

        {/* Pathologist Note (7 cols) */}
        <div className="md:col-span-7 paper-sheet p-4 rounded-sm border-l-4 border-alarm shadow-paper flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-ink/20">
              <span className="font-typewriter font-bold text-xs flex items-center gap-2 text-alarm">
                <Clock className="w-4 h-4 text-alarm" />
                PATHOLOGY CADAVER PROTOCOL
              </span>
              <span className="stamp stamp-open text-[9px]">OFFICIAL ME NOTE</span>
            </div>

            <blockquote className="font-serif text-xs text-ink/90 leading-relaxed italic bg-manila/50 p-3 rounded border border-ink/15">
              "The physical trauma and body temperature indicate that the true time of death occurred strictly between <strong>45 and 75 minutes</strong> following the last confirmed, genuine physical human activity in the study. The smashed clock appearance suggests deliberate staging."
            </blockquote>

            <div className="text-[11px] font-mono text-ink/80 space-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-signal" />
                <span>UK Local Time in late October is on <strong>British Summer Time (BST = UTC+1)</strong>.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-alarm" />
                <span>Compare courier handoff across systems to detect hardware clock drift.</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-ink/60 pt-2 border-t border-ink/15 text-right">
            DR. H. ABERNATHY, METROPOLITAN CORONER
          </div>
        </div>
      </div>

      {/* CRT TELEMETRY CONSOLE */}
      <div className="crt-terminal p-4 space-y-3">
        {/* Terminal Header & Status LEDs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#2A4520] text-xs font-mono relative z-10">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#8BC34A]" />
            <span className="font-typewriter font-bold text-[#A5D6A7] tracking-wider uppercase text-[11px]">
              INCIDENT FORENSIC TELEMETRY RECORDER // MODEL-86
            </span>
          </div>

          {/* LED indicators */}
          <div className="flex items-center gap-3 text-[10px] text-dim">
            <span className="flex items-center gap-1 text-[#8BC34A]">
              <span className="w-2 h-2 rounded-full bg-[#8BC34A] animate-ping" />
              PWR: ON
            </span>
            <span className="flex items-center gap-1 text-[#FFB74D]">
              <span className="w-2 h-2 rounded-full bg-[#FFB74D]" />
              REC: 28 EVENTS
            </span>
            <span className="text-[#9E9E9E]">CH: 4 SENSORS</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-[#141E10]/80 rounded border border-[#254018] relative z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-[#8BC34A] mr-1" />
            {sources.map((src) => (
              <button
                key={src}
                onClick={() => setFilterSource(src)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  filterSource === src
                    ? 'bg-[#8BC34A] text-ink font-bold shadow'
                    : 'bg-[#10190D] text-[#81C784] hover:bg-[#1C2B17] border border-[#23381B]'
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-xs min-w-[170px]">
            <Search className="w-3.5 h-3.5 text-[#81C784] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter telemetry streams..."
              className="w-full bg-[#0D150B] text-[#A5D6A7] font-mono text-xs pl-8 pr-3 py-1 rounded border border-[#254018] focus:border-[#8BC34A] focus:outline-none"
            />
          </div>
        </div>

        {/* Telemetry Log Table */}
        <div className="rounded border border-[#254018] bg-[#0A1008] overflow-x-auto shadow-inner max-h-[380px] overflow-y-auto relative z-10">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-[#142010] text-[#A5D6A7] sticky top-0 border-b border-[#254018] z-10">
              <tr>
                <th className="py-2 px-3">SOURCE</th>
                <th className="py-2 px-3">RECORDED TIMESTAMP</th>
                <th className="py-2 px-3">HARDWARE REFERENCE</th>
                <th className="py-2 px-3">EVENT TELEMETRY LOG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182913]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#121E0F] transition-colors">
                  <td className="py-1.5 px-3 whitespace-nowrap">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.source === 'SEC'
                          ? 'bg-[#E65100]/25 text-[#FFB74D] border border-[#E65100]/40'
                          : log.source === 'DOORBELL'
                          ? 'bg-[#2E7D32]/25 text-[#81C784] border border-[#2E7D32]/40'
                          : log.source === 'PC'
                          ? 'bg-[#1565C0]/25 text-[#90CAF9] border border-[#1565C0]/40'
                          : 'bg-[#424242]/25 text-[#BDBDBD]'
                      }`}
                    >
                      {log.source}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 text-[#E8F5E9] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-1.5 px-3 text-[#81C784]/80 whitespace-nowrap text-[11px]">
                    {log.tz}
                  </td>
                  <td className="py-1.5 px-3 text-[#C8E6C9] font-mono text-[11px]">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-tape/90 rounded border-2 border-signal/40 space-y-2.5 shadow-desk">
        <label className="block text-xs font-serif text-label font-medium">
          Enter the start of the Medical Examiner's window of death (4-digit 24-hr UK BST time, e.g. 2145):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            maxLength={5}
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="2237"
            className="flex-1 bg-ink text-label font-mono text-sm px-3.5 py-2 rounded border border-signal/50 focus:border-signal focus:outline-none tracking-widest uppercase shadow-inner"
          />
          <button
            type="submit"
            disabled={submitting || !answerInput.trim()}
            className="px-6 py-2 bg-signal hover:bg-signal/90 text-ink font-typewriter font-bold text-xs rounded transition-all shadow-md disabled:opacity-50"
          >
            {submitting ? 'Verifying Chronology...' : 'Submit TOD Window'}
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-alarm font-serif mt-1 p-2 rounded bg-alarm/15 border border-alarm/30">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
};
