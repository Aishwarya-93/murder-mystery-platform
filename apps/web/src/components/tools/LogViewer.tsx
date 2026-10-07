import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Search, Filter, Clock, AlertCircle } from 'lucide-react';

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
        setErrorMessage('Incorrect time calculation. Check panel skew against doorbell handoff.');
      }
    } else {
      setAnswerInput('');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* ME Note Callout */}
      <div className="paper-sheet p-3.5 rounded border-l-4 border-signal text-xs font-serif leading-relaxed">
        <div className="font-typewriter font-bold text-ink mb-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-signal" />
          <span>MEDICAL EXAMINER PRELIMINARY NOTE</span>
        </div>
        <p className="text-ink/90">
          "Time of death is strictly between <strong>45 and 75 minutes</strong> after the last confirmed physical human activity in the study. Late October operates on British Summer Time (BST = UTC+1). Note any hardware clock skews before calculating."
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-tape/60 rounded border border-signal/20">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-signal mr-1" />
          {sources.map((src) => (
            <button
              key={src}
              onClick={() => setFilterSource(src)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                filterSource === src
                  ? 'bg-signal text-ink font-bold'
                  : 'bg-ink/70 text-dim hover:text-label'
              }`}
            >
              {src}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs min-w-[180px]">
          <Search className="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search forensic telemetry..."
            className="w-full bg-ink/90 text-label font-mono text-xs pl-8 pr-3 py-1 rounded border border-signal/30 focus:border-signal focus:outline-none"
          />
        </div>
      </div>

      {/* Telemetry Log Table */}
      <div className="rounded border border-signal/30 bg-ink/90 overflow-x-auto shadow-inner max-h-[380px] overflow-y-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead className="bg-tape text-label sticky top-0 border-b border-signal/30 z-10">
            <tr>
              <th className="py-2 px-3">SOURCE</th>
              <th className="py-2 px-3">RECORDED TIMESTAMP</th>
              <th className="py-2 px-3">TIMEZONE / REF</th>
              <th className="py-2 px-3">LOG EVENT & TELEMETRY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dim/20">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-tape/40 transition-colors">
                <td className="py-1.5 px-3 whitespace-nowrap">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.source === 'SEC'
                        ? 'bg-signal/20 text-signal border border-signal/40'
                        : log.source === 'DOORBELL'
                        ? 'bg-ok/20 text-ok border border-ok/40'
                        : log.source === 'PC'
                        ? 'bg-blue-900/30 text-blue-300 border border-blue-500/40'
                        : 'bg-dim/20 text-dim'
                    }`}
                  >
                    {log.source}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-label whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-1.5 px-3 text-dim whitespace-nowrap text-[11px]">
                  {log.tz}
                </td>
                <td className="py-1.5 px-3 text-label/90 font-mono">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-tape/80 rounded border border-signal/30 space-y-2">
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
            className="flex-1 bg-ink text-label font-mono text-sm px-3 py-1.5 rounded border border-signal/40 focus:border-signal focus:outline-none tracking-widest uppercase"
          />
          <button
            type="submit"
            disabled={submitting || !answerInput.trim()}
            className="px-5 py-1.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors disabled:opacity-50"
          >
            {submitting ? 'Checking...' : 'Submit Answer'}
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
  );
};
