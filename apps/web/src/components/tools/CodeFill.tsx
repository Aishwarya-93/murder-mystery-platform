import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { api } from '../../api/client.js';
import { Code, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';

export const CodeFill: React.FC = () => {
  const { submitAnswer } = useGameStore();

  const [activeLang, setActiveLang] = useState<'python' | 'java' | 'cpp'>('python');
  const [blank1, setBlank1] = useState('60');
  const [blank2, setBlank2] = useState('+');
  const [blank3, setBlank3] = useState('%');

  const [checkingBlanks, setCheckingBlanks] = useState(false);
  const [blankResults, setBlankResults] = useState<[boolean, boolean, boolean] | null>(null);

  const [outputInput, setOutputInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckBlanks = async () => {
    setCheckingBlanks(true);
    try {
      const res = await api.checkBlanks([blank1, blank2, blank3]);
      if (res.results) {
        setBlankResults(res.results as [boolean, boolean, boolean]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to check blanks.');
    } finally {
      setCheckingBlanks(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outputInput.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    const res = await submitAnswer(outputInput.trim());
    if (!res.correct) {
      setErrorMessage(res.nudge || 'Calculated program output does not match. Double-check your minute math.');
    } else {
      setOutputInput('');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="paper-sheet p-3 rounded text-xs text-ink font-serif border border-ink/20">
        <p>
          A technician began building an inverse restoration script to decode the smart lock's forged timestamp and discover the erased liaison source. Select the correct operators in the code below, verify your syntax, and enter the expected console output.
        </p>
      </div>

      {/* Code Editor Frame */}
      <div className="bg-ink rounded border border-signal/40 shadow-desk overflow-hidden">
        {/* Language Tabs */}
        <div className="bg-tape px-3 py-2 border-b border-signal/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-mono">
            <Code className="w-3.5 h-3.5 text-signal mr-1" />
            {(['python', 'java', 'cpp'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  activeLang === lang
                    ? 'bg-signal text-ink font-bold'
                    : 'text-dim hover:text-label bg-ink/50'
                }`}
              >
                {lang === 'python' ? 'Python 3' : lang === 'java' ? 'Java 17' : 'C++ 20'}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-dim">READ-ONLY AUDIT VIEW</div>
        </div>

        {/* Code Content with Inline Select Dropdowns */}
        <div className="p-4 font-mono text-xs sm:text-sm text-label/90 space-y-1 overflow-x-auto leading-relaxed">
          {activeLang === 'python' && (
            <>
              <div><span className="text-dim">1:</span> <span className="text-yellow-400">SHIFT_MIN</span> = 42</div>
              <div><span className="text-dim">2:</span> <span className="text-yellow-400">DROPPED_SOURCE</span> = <span className="text-green-300">"LIAISON_4417"</span></div>
              <div><span className="text-dim">3:</span> <span className="text-yellow-400">forged</span> = <span className="text-green-300">"22:26"</span> <span className="text-dim italic"># only forged row in export</span></div>
              <div><span className="text-dim">4:</span> </div>
              <div><span className="text-dim">5:</span> hour, minute = forged.split(<span className="text-green-300">":"</span>)</div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-dim">6:</span> total = int(hour) *{' '}
                <select
                  value={blank1}
                  onChange={(e) => setBlank1(e.target.value)}
                  className="bg-tape text-label px-2 py-0.5 rounded border border-signal font-bold text-xs"
                >
                  <option value="24">24</option>
                  <option value="60">60</option>
                  <option value="100">100</option>
                  <option value="3600">3600</option>
                </select>
                {' '}+ int(minute) <span className="text-dim italic"># Blank 1: hours to minutes</span>
                {blankResults && (
                  blankResults[0] ? <CheckCircle className="w-4 h-4 text-ok" /> : <XCircle className="w-4 h-4 text-alarm" />
                )}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-dim">7:</span> total = total{' '}
                <select
                  value={blank2}
                  onChange={(e) => setBlank2(e.target.value)}
                  className="bg-tape text-label px-2 py-0.5 rounded border border-signal font-bold text-xs"
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="*">*</option>
                  <option value="//">//</option>
                </select>
                {' '}SHIFT_MIN <span className="text-dim italic"># Blank 2: undo backwards shift</span>
                {blankResults && (
                  blankResults[1] ? <CheckCircle className="w-4 h-4 text-ok" /> : <XCircle className="w-4 h-4 text-alarm" />
                )}
              </div>
              <div><span className="text-dim">8:</span> real_hour = total // 60</div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-dim">9:</span> real_minute = total{' '}
                <select
                  value={blank3}
                  onChange={(e) => setBlank3(e.target.value)}
                  className="bg-tape text-label px-2 py-0.5 rounded border border-signal font-bold text-xs"
                >
                  <option value="//">//</option>
                  <option value="%">%</option>
                  <option value="/">/</option>
                  <option value="**">**</option>
                </select>
                {' '}60 <span className="text-dim italic"># Blank 3: remaining minutes</span>
                {blankResults && (
                  blankResults[2] ? <CheckCircle className="w-4 h-4 text-ok" /> : <XCircle className="w-4 h-4 text-alarm" />
                )}
              </div>
              <div><span className="text-dim">10:</span> print(f<span className="text-green-300">"&#123;real_hour:02d&#125;&#123;real_minute:02d&#125;-&#123;DROPPED_SOURCE[-4:]&#125;"</span>)</div>
            </>
          )}

          {activeLang === 'java' && (
            <>
              <div><span className="text-dim">1:</span> <span className="text-blue-300">int</span> shiftMin = 42;</div>
              <div><span className="text-dim">2:</span> String droppedSource = <span className="text-green-300">"LIAISON_4417"</span>;</div>
              <div><span className="text-dim">3:</span> String forged = <span className="text-green-300">"22:26"</span>;</div>
              <div><span className="text-dim">4:</span> String[] parts = forged.split(<span className="text-green-300">":"</span>);</div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-dim">5:</span> <span className="text-blue-300">int</span> total = Integer.parseInt(parts[0]) *{' '}
                <select
                  value={blank1}
                  onChange={(e) => setBlank1(e.target.value)}
                  className="bg-tape text-label px-2 py-0.5 rounded border border-signal font-bold text-xs"
                >
                  <option value="24">24</option>
                  <option value="60">60</option>
                  <option value="100">100</option>
                  <option value="3600">3600</option>
                </select>
                {' '}+ Integer.parseInt(parts[1]);
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-dim">6:</span> total = total{' '}
                <select
                  value={blank2}
                  onChange={(e) => setBlank2(e.target.value)}
                  className="bg-tape text-label px-2 py-0.5 rounded border border-signal font-bold text-xs"
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="*">*</option>
                  <option value="/">/</option>
                </select>
                {' '}shiftMin;
              </div>
              <div><span className="text-dim">7:</span> <span className="text-blue-300">int</span> realHour = total / 60;</div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-dim">8:</span> <span className="text-blue-300">int</span> realMinute = total{' '}
                <select
                  value={blank3}
                  onChange={(e) => setBlank3(e.target.value)}
                  className="bg-tape text-label px-2 py-0.5 rounded border border-signal font-bold text-xs"
                >
                  <option value="/">/</option>
                  <option value="%">%</option>
                  <option value="*">*</option>
                  <option value="&">&</option>
                </select>
                {' '}60;
              </div>
              <div><span className="text-dim">9:</span> System.out.printf(<span className="text-green-300">"%02d%02d-%s\n"</span>, realHour, realMinute, droppedSource.substring(droppedSource.length() - 4));</div>
            </>
          )}

          {activeLang === 'cpp' && (
            <>
              <div><span className="text-dim">1:</span> <span className="text-blue-300">const int</span> SHIFT_MIN = 42;</div>
              <div><span className="text-dim">2:</span> std::string dropped_source = <span className="text-green-300">"LIAISON_4417"</span>;</div>
              <div><span className="text-dim">3:</span> std::string forged = <span className="text-green-300">"22:26"</span>;</div>
              <div><span className="text-dim">4:</span> <span className="text-blue-300">int</span> hour = std::stoi(forged.substr(0, 2));</div>
              <div><span className="text-dim">5:</span> <span className="text-blue-300">int</span> minute = std::stoi(forged.substr(3, 2));</div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-dim">6:</span> <span className="text-blue-300">int</span> total = hour *{' '}
                <select
                  value={blank1}
                  onChange={(e) => setBlank1(e.target.value)}
                  className="bg-tape text-label px-2 py-0.5 rounded border border-signal font-bold text-xs"
                >
                  <option value="24">24</option>
                  <option value="60">60</option>
                  <option value="100">100</option>
                  <option value="3600">3600</option>
                </select>
                {' '}+ minute;
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-dim">7:</span> total = total{' '}
                <select
                  value={blank2}
                  onChange={(e) => setBlank2(e.target.value)}
                  className="bg-tape text-label px-2 py-0.5 rounded border border-signal font-bold text-xs"
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="*">*</option>
                  <option value="/">/</option>
                </select>
                {' '}SHIFT_MIN;
              </div>
              <div><span className="text-dim">8:</span> <span className="text-blue-300">int</span> real_hour = total / 60;</div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-dim">9:</span> <span className="text-blue-300">int</span> real_minute = total{' '}
                <select
                  value={blank3}
                  onChange={(e) => setBlank3(e.target.value)}
                  className="bg-tape text-label px-2 py-0.5 rounded border border-signal font-bold text-xs"
                >
                  <option value="/">/</option>
                  <option value="%">%</option>
                  <option value="*">*</option>
                  <option value="&">&</option>
                </select>
                {' '}60;
              </div>
              <div><span className="text-dim">10:</span> std::cout &lt;&lt; (real_hour &lt; 10 ? <span className="text-green-300">"0"</span> : <span className="text-green-300">""</span>) &lt;&lt; real_hour &lt;&lt; (real_minute &lt; 10 ? <span className="text-green-300">"0"</span> : <span className="text-green-300">""</span>) &lt;&lt; real_minute &lt;&lt; <span className="text-green-300">"-"</span> &lt;&lt; dropped_source.substr(dropped_source.length() - 4) &lt;&lt; std::endl;</div>
            </>
          )}
        </div>

        {/* Check Blanks Action */}
        <div className="bg-tape/60 p-3 border-t border-signal/20 flex items-center justify-between">
          <span className="text-xs text-dim font-mono">
            Check selections on server (Stage 1 validation)
          </span>
          <button
            onClick={handleCheckBlanks}
            disabled={checkingBlanks}
            className="px-4 py-1.5 bg-ink hover:bg-ink/80 text-signal border border-signal/40 font-serif font-bold text-xs rounded transition-colors"
          >
            {checkingBlanks ? 'Checking Blanks...' : 'Verify Code Blanks'}
          </button>
        </div>
      </div>

      {/* Program Output Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-tape/80 rounded border border-signal/30 space-y-2">
        <label className="block text-xs font-serif text-label font-medium">
          Enter the exact console output produced by the repaired script (format: HHMM-XXXX):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={outputInput}
            onChange={(e) => setOutputInput(e.target.value)}
            placeholder="2308-4417"
            className="flex-1 bg-ink text-label font-mono text-sm px-3 py-1.5 rounded border border-signal/40 focus:border-signal focus:outline-none uppercase"
          />
          <button
            type="submit"
            disabled={submitting || !outputInput.trim()}
            className="px-5 py-1.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors disabled:opacity-50"
          >
            {submitting ? 'Verifying Output...' : 'Submit Output String'}
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
