import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { api } from '../../api/client.js';
import { Play, RotateCcw, Volume2, AlertCircle, FileText } from 'lucide-react';

export const MorsePlayer: React.FC = () => {
  const { levelDetail, submitAnswer } = useGameStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [pulseData, setPulseData] = useState<any>(null);
  const [answerInput, setAnswerInput] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutIdsRef = useRef<any[]>([]);

  useEffect(() => {
    // Fetch pulse timing data
    api.getMorseData().then((data) => {
      setPulseData(data);
    }).catch((err) => {
      console.warn('Could not fetch morse pulses:', err);
    });

    return () => {
      stopPlayback();
    };
  }, []);

  const stopPlayback = () => {
    timeoutIdsRef.current.forEach((t) => clearTimeout(t));
    timeoutIdsRef.current = [];
    setIsPlaying(false);
    setPulseActive(false);
  };

  const playMorseSound = () => {
    if (!pulseData || !pulseData.pulses) return;
    stopPlayback();

    // Create or resume Web Audio context
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    setIsPlaying(true);
    let currentTimeMs = 0;

    pulseData.pulses.forEach((p: { on: boolean; duration: number }) => {
      const duration = p.duration / speed;
      const startTime = currentTimeMs;

      // Visual pulse
      const tVisual = setTimeout(() => {
        setPulseActive(p.on);
      }, startTime);
      timeoutIdsRef.current.push(tVisual);

      // Audio beep via Web Audio oscillator
      if (p.on) {
        const tAudio = setTimeout(() => {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(680, ctx.currentTime);

            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration / 1000);
          } catch (e) {
            // Audio policy fallback
          }
        }, startTime);
        timeoutIdsRef.current.push(tAudio);
      }

      currentTimeMs += duration;
    });

    // End of playback
    const tEnd = setTimeout(() => {
      stopPlayback();
    }, currentTimeMs + 200);
    timeoutIdsRef.current.push(tEnd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim()) return;
    setSubmitting(true);
    setErrorMessage(null);

    const res = await submitAnswer(answerInput.trim());
    if (!res.correct) {
      setErrorMessage(res.nudge || 'Decoding does not match. Check cadence of short and long taps.');
    } else {
      setAnswerInput('');
    }
    setSubmitting(false);
  };

  // Morse reference chart appears after Hint 1 is revealed
  const isHint1Revealed = (levelDetail?.hintsUsed || 0) >= 1;
  const isSolved = levelDetail?.status === 'SOLVED' || levelDetail?.status === 'SKIPPED';

  return (
    <div className="space-y-4">
      {/* Tape Deck Box */}
      <div className="bg-tape p-4 rounded border-2 border-signal/40 shadow-paper space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-signal/30 text-xs">
          <span className="font-typewriter font-bold text-label flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-signal" />
            REEL CASSETTE DECK // TAPE 07
          </span>
          <span className="text-[11px] font-mono text-dim">24 SEC RECOVERED TRACK</span>
        </div>

        {/* Pulse Visualizer Display (No dots or dashes shown) */}
        <div className="bg-ink p-6 rounded border border-signal/30 flex flex-col items-center justify-center gap-3">
          <div
            className={`w-16 h-16 rounded-full transition-all duration-75 border-2 ${
              pulseActive
                ? 'bg-signal border-label scale-110 shadow-[0_0_25px_rgba(154,106,50,0.8)]'
                : 'bg-tape/60 border-signal/30 scale-95'
            }`}
          />
          <div className="text-[11px] font-mono tracking-wider text-dim">
            {pulseActive ? 'SIGNAL DETECTED [PULSE ON]' : isPlaying ? 'LISTENING [INTERVAL]' : 'PLAYER IDLE'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={playMorseSound}
              disabled={isPlaying}
              className="px-4 py-2 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPlaying ? 'Playing...' : 'Play Audio Reel'}</span>
            </button>

            <button
              onClick={stopPlayback}
              disabled={!isPlaying}
              className="px-3 py-2 bg-ink hover:bg-ink/80 text-label font-serif text-xs rounded border border-signal/30 transition-colors flex items-center gap-1 disabled:opacity-40"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Stop / Reset</span>
            </button>
          </div>

          {/* Speed Controls */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-dim text-[11px] mr-1">TAPE SPEED:</span>
            {[0.5, 0.75, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded ${
                  speed === s
                    ? 'bg-signal text-ink font-bold'
                    : 'bg-ink/80 text-dim hover:text-label border border-signal/20'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Morse Reference Chart (Only after Hint 1) */}
      {isHint1Revealed && (
        <div className="paper-sheet p-3 rounded text-xs text-ink font-mono border border-ink/20">
          <div className="font-typewriter font-bold text-ink mb-1.5 flex items-center justify-between">
            <span>OFFICIAL TELEGRAPHIC SIGNAL CODE CHART</span>
            <span className="stamp stamp-open text-[9px]">HINT 1 ATTACHMENT</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 text-center text-[11px] text-ink/90">
            <div>A: · —</div>
            <div>E: ·</div>
            <div>I: · ·</div>
            <div>J: · — — —</div>
            <div>L: · — · ·</div>
            <div>M: — —</div>
            <div>N: — ·</div>
            <div>O: — — —</div>
            <div>T: —</div>
            <div>U: · · —</div>
          </div>
        </div>
      )}

      {/* Recovered Transcript Card (Shown on solve) */}
      {isSolved && (
        <div className="paper-sheet p-4 rounded border-l-4 border-ok text-ink shadow-paper space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-ink/15">
            <span className="font-typewriter font-bold text-xs flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-ok" />
              RECOVERED SESSION TRANSCRIPT: TAPE 07
            </span>
            <span className="stamp stamp-closed text-[9px]">RESTORED</span>
          </div>
          <div className="font-serif text-xs leading-relaxed text-ink/90 italic">
            <strong>DR. ELIAS VANE:</strong> "You weren't the one who killed him, Mira. We both know that. But who do you think the police will believe when the report carries an official seal?"
          </div>
        </div>
      )}

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-tape/80 rounded border border-signal/30 space-y-2">
        <label className="block text-xs font-serif text-label font-medium">
          Enter the decoded message tapped by Mira (e.g. JULIAN or NOT ME JULIAN):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="NOT ME JULIAN"
            className="flex-1 bg-ink text-label font-mono text-sm px-3 py-1.5 rounded border border-signal/40 focus:border-signal focus:outline-none tracking-wider uppercase"
          />
          <button
            type="submit"
            disabled={submitting || !answerInput.trim()}
            className="px-5 py-1.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors disabled:opacity-50"
          >
            {submitting ? 'Verifying...' : 'Submit Message'}
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
