import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { api } from '../../api/client.js';
import { Code, CheckCircle, XCircle, AlertCircle, Play, Terminal, Printer, FileCode } from 'lucide-react';

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
    <div className="space-y-5">
      {/* Overview Dossier Banner */}
      <div className="paper-sheet p-4 rounded-lg border-2 border-amber-900/40 shadow-sm text-xs text-ink font-serif flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-xl leading-relaxed">
          A technician began building an inverse restoration script to decode the smart lock's forged timestamp and discover the erased liaison source. Select the correct operators in the continuous teletype printout below, verify your syntax, and enter the expected console output.
        </p>
        <span className="stamp stamp-open text-[10px]">CONTINUOUS TELETYPE FEED</span>
      </div>

      {/* Dot-Matrix Continuous Feed Tractor Paper Container */}
      <div className="relative bg-[#fcf9f2] rounded-lg border-2 border-[#bfa888] shadow-[0_10px_25px_rgba(0,0,0,0.4)] overflow-hidden text-zinc-950">
        {/* Top Control Bar with Language Selection */}
        <div className="bg-[#241e19] px-4 py-2.5 border-b-2 border-[#5c4631] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-mono">
            <FileCode className="w-4 h-4 text-amber-500 mr-1" />
            {(['python', 'java', 'cpp'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeLang === lang
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                    : 'text-[#c9a777] hover:text-[#e6d8c3] bg-[#14110f] border border-[#5c4631]/50'
                }`}
              >
                {lang === 'python' ? 'Python 3' : lang === 'java' ? 'Java 17' : 'C++ 20'}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-[#c9a777]/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>DOT-MATRIX LISTING // TRACTOR MARGIN</span>
          </div>
        </div>

        {/* Paper with Tractor-Feed Margins */}
        <div className="relative p-4 sm:p-6 font-mono text-xs sm:text-sm bg-[linear-gradient(to_bottom,#fcf9f2_0px,#fcf9f2_28px,#f4f0e4_28px,#f4f0e4_56px)] bg-[size:100%_56px]">
          {/* Left Tractor Holes */}
          <div className="absolute left-1.5 top-0 bottom-0 flex flex-col justify-around text-zinc-400 text-[10px] pointer-events-none select-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i}>○</span>
            ))}
          </div>

          {/* Right Tractor Holes */}
          <div className="absolute right-1.5 top-0 bottom-0 flex flex-col justify-around text-zinc-400 text-[10px] pointer-events-none select-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i}>○</span>
            ))}
          </div>

          {/* Code Listing Content */}
          <div className="pl-4 pr-4 space-y-1.5 overflow-x-auto text-zinc-900 leading-relaxed font-bold">
            {activeLang === 'python' && (
              <>
                <div><span className="text-zinc-500 font-normal">01:</span> <span className="text-amber-800">SHIFT_MIN</span> = 42</div>
                <div><span className="text-zinc-500 font-normal">02:</span> <span className="text-amber-800">DROPPED_SOURCE</span> = <span className="text-emerald-800">"LIAISON_4417"</span></div>
                <div><span className="text-zinc-500 font-normal">03:</span> <span className="text-amber-800">forged</span> = <span className="text-emerald-800">"22:26"</span> <span className="text-zinc-500 font-normal italic"># only forged row in export</span></div>
                <div><span className="text-zinc-500 font-normal">04:</span> </div>
                <div><span className="text-zinc-500 font-normal">05:</span> hour, minute = forged.split(<span className="text-emerald-800">":"</span>)</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-normal">06:</span> total = int(hour) *{' '}
                  <select
                    value={blank1}
                    onChange={(e) => setBlank1(e.target.value)}
                    className="bg-[#fff9ea] text-zinc-950 px-2.5 py-0.5 rounded border-2 border-red-800 font-bold text-xs shadow-sm"
                  >
                    <option value="24">24</option>
                    <option value="60">60</option>
                    <option value="100">100</option>
                    <option value="3600">3600</option>
                  </select>
                  {' '}+ int(minute) <span className="text-zinc-600 font-normal italic text-xs"># [Blank 1: hours to minutes]</span>
                  {blankResults && (
                    blankResults[0] ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <XCircle className="w-4 h-4 text-red-700" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-normal">07:</span> total = total{' '}
                  <select
                    value={blank2}
                    onChange={(e) => setBlank2(e.target.value)}
                    className="bg-[#fff9ea] text-zinc-950 px-2.5 py-0.5 rounded border-2 border-red-800 font-bold text-xs shadow-sm"
                  >
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="*">*</option>
                    <option value="//">//</option>
                  </select>
                  {' '}SHIFT_MIN <span className="text-zinc-600 font-normal italic text-xs"># [Blank 2: undo backwards shift]</span>
                  {blankResults && (
                    blankResults[1] ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <XCircle className="w-4 h-4 text-red-700" />
                  )}
                </div>
                <div><span className="text-zinc-500 font-normal">08:</span> real_hour = total // 60</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-normal">09:</span> real_minute = total{' '}
                  <select
                    value={blank3}
                    onChange={(e) => setBlank3(e.target.value)}
                    className="bg-[#fff9ea] text-zinc-950 px-2.5 py-0.5 rounded border-2 border-red-800 font-bold text-xs shadow-sm"
                  >
                    <option value="//">//</option>
                    <option value="%">%</option>
                    <option value="/">/</option>
                    <option value="**">**</option>
                  </select>
                  {' '}60 <span className="text-zinc-600 font-normal italic text-xs"># [Blank 3: remaining minutes]</span>
                  {blankResults && (
                    blankResults[2] ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <XCircle className="w-4 h-4 text-red-700" />
                  )}
                </div>
                <div><span className="text-zinc-500 font-normal">10:</span> print(f<span className="text-emerald-800">"&#123;real_hour:02d&#125;&#123;real_minute:02d&#125;-&#123;DROPPED_SOURCE[-4:]&#125;"</span>)</div>
              </>
            )}

            {activeLang === 'java' && (
              <>
                <div><span className="text-zinc-500 font-normal">01:</span> <span className="text-blue-800">int</span> shiftMin = 42;</div>
                <div><span className="text-zinc-500 font-normal">02:</span> String droppedSource = <span className="text-emerald-800">"LIAISON_4417"</span>;</div>
                <div><span className="text-zinc-500 font-normal">03:</span> String forged = <span className="text-emerald-800">"22:26"</span>;</div>
                <div><span className="text-zinc-500 font-normal">04:</span> String[] parts = forged.split(<span className="text-emerald-800">":"</span>);</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-normal">05:</span> <span className="text-blue-800">int</span> total = Integer.parseInt(parts[0]) *{' '}
                  <select
                    value={blank1}
                    onChange={(e) => setBlank1(e.target.value)}
                    className="bg-[#fff9ea] text-zinc-950 px-2.5 py-0.5 rounded border-2 border-red-800 font-bold text-xs shadow-sm"
                  >
                    <option value="24">24</option>
                    <option value="60">60</option>
                    <option value="100">100</option>
                    <option value="3600">3600</option>
                  </select>
                  {' '}+ Integer.parseInt(parts[1]);
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-normal">06:</span> total = total{' '}
                  <select
                    value={blank2}
                    onChange={(e) => setBlank2(e.target.value)}
                    className="bg-[#fff9ea] text-zinc-950 px-2.5 py-0.5 rounded border-2 border-red-800 font-bold text-xs shadow-sm"
                  >
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="*">*</option>
                    <option value="/">/</option>
                  </select>
                  {' '}shiftMin;
                </div>
                <div><span className="text-zinc-500 font-normal">07:</span> <span className="text-blue-800">int</span> realHour = total / 60;</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-normal">08:</span> <span className="text-blue-800">int</span> realMinute = total{' '}
                  <select
                    value={blank3}
                    onChange={(e) => setBlank3(e.target.value)}
                    className="bg-[#fff9ea] text-zinc-950 px-2.5 py-0.5 rounded border-2 border-red-800 font-bold text-xs shadow-sm"
                  >
                    <option value="/">/</option>
                    <option value="%">%</option>
                    <option value="*">*</option>
                    <option value="&">&</option>
                  </select>
                  {' '}60;
                </div>
                <div><span className="text-zinc-500 font-normal">09:</span> System.out.printf(<span className="text-emerald-800">"%02d%02d-%s\n"</span>, realHour, realMinute, droppedSource.substring(droppedSource.length() - 4));</div>
              </>
            )}

            {activeLang === 'cpp' && (
              <>
                <div><span className="text-zinc-500 font-normal">01:</span> <span className="text-blue-800">const int</span> SHIFT_MIN = 42;</div>
                <div><span className="text-zinc-500 font-normal">02:</span> std::string dropped_source = <span className="text-emerald-800">"LIAISON_4417"</span>;</div>
                <div><span className="text-zinc-500 font-normal">03:</span> std::string forged = <span className="text-emerald-800">"22:26"</span>;</div>
                <div><span className="text-zinc-500 font-normal">04:</span> <span className="text-blue-800">int</span> hour = std::stoi(forged.substr(0, 2));</div>
                <div><span className="text-zinc-500 font-normal">05:</span> <span className="text-blue-800">int</span> minute = std::stoi(forged.substr(3, 2));</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-normal">06:</span> <span className="text-blue-800">int</span> total = hour *{' '}
                  <select
                    value={blank1}
                    onChange={(e) => setBlank1(e.target.value)}
                    className="bg-[#fff9ea] text-zinc-950 px-2.5 py-0.5 rounded border-2 border-red-800 font-bold text-xs shadow-sm"
                  >
                    <option value="24">24</option>
                    <option value="60">60</option>
                    <option value="100">100</option>
                    <option value="3600">3600</option>
                  </select>
                  {' '}+ minute;
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-normal">07:</span> total = total{' '}
                  <select
                    value={blank2}
                    onChange={(e) => setBlank2(e.target.value)}
                    className="bg-[#fff9ea] text-zinc-950 px-2.5 py-0.5 rounded border-2 border-red-800 font-bold text-xs shadow-sm"
                  >
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="*">*</option>
                    <option value="/">/</option>
                  </select>
                  {' '}SHIFT_MIN;
                </div>
                <div><span className="text-zinc-500 font-normal">08:</span> <span className="text-blue-800">int</span> real_hour = total / 60;</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-normal">09:</span> <span className="text-blue-800">int</span> real_minute = total{' '}
                  <select
                    value={blank3}
                    onChange={(e) => setBlank3(e.target.value)}
                    className="bg-[#fff9ea] text-zinc-950 px-2.5 py-0.5 rounded border-2 border-red-800 font-bold text-xs shadow-sm"
                  >
                    <option value="/">/</option>
                    <option value="%">%</option>
                    <option value="*">*</option>
                    <option value="&">&</option>
                  </select>
                  {' '}60;
                </div>
                <div><span className="text-zinc-500 font-normal">10:</span> std::cout &lt;&lt; (real_hour &lt; 10 ? <span className="text-emerald-800">"0"</span> : <span className="text-emerald-800">""</span>) &lt;&lt; real_hour &lt;&lt; (real_minute &lt; 10 ? <span className="text-emerald-800">"0"</span> : <span className="text-emerald-800">""</span>) &lt;&lt; real_minute &lt;&lt; <span className="text-emerald-800">"-"</span> &lt;&lt; dropped_source.substr(dropped_source.length() - 4) &lt;&lt; std::endl;</div>
              </>
            )}
          </div>
        </div>

        {/* Validate Blanks Server Bar */}
        <div className="bg-[#241e19] px-4 py-3 border-t-2 border-[#5c4631] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#c9a777] font-mono text-xs">
            Verify operator selections against syntax interpreter:
          </span>
          <button
            onClick={handleCheckBlanks}
            disabled={checkingBlanks}
            className="px-5 py-2 bg-[#171412] hover:bg-[#2b251f] text-amber-400 border border-amber-600/60 font-serif font-bold text-xs rounded transition-all shadow active:translate-y-0.5"
          >
            {checkingBlanks ? 'Interpreting Syntax...' : 'Verify Code Operators'}
          </button>
        </div>
      </div>

      {/* Program Output Verification Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-tape/90 rounded-lg border-2 border-signal/40 shadow-desk space-y-3">
        <label className="block text-xs font-serif text-label font-medium flex items-center gap-2">
          <Terminal className="w-4 h-4 text-signal" />
          <span>Enter the exact console output produced by the repaired script (format: HHMM-XXXX):</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={outputInput}
            onChange={(e) => setOutputInput(e.target.value)}
            placeholder="2308-4417"
            className="flex-1 bg-ink text-label font-mono text-sm px-3.5 py-2 rounded border border-signal/40 focus:border-signal focus:outline-none uppercase shadow-inner tracking-wider"
          />
          <button
            type="submit"
            disabled={submitting || !outputInput.trim()}
            className="px-6 py-2 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors shadow disabled:opacity-50"
          >
            {submitting ? 'Verifying Output...' : 'Submit Output String'}
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-alarm font-serif mt-1 p-2 bg-red-950/60 rounded border border-red-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
};
