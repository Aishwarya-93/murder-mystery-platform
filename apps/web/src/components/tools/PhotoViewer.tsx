import React, { useState, useRef } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { ZoomIn, ZoomOut, RotateCcw, Image, AlertCircle, FileText } from 'lucide-react';

export const PhotoViewer: React.FC = () => {
  const { levelDetail, submitAnswer } = useGameStore();

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [answerInput, setAnswerInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const photoUrl = levelDetail?.photoUrl || '/api/levels/7/assets/images/l7_geo_photo.jpg';
  const attribution = levelDetail?.attribution || 'Evidence Exhibit';

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.3, 3.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.3, 0.8));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    const res = await submitAnswer(answerInput.trim());
    if (!res.correct) {
      setErrorMessage('Location could not be reconciled. Examine distinctive coastal cliffs, monuments, or enter coordinates.');
    } else {
      setAnswerInput('');
    }
    setSubmitting(false);
  };

  const isSolved = levelDetail?.status === 'SOLVED' || levelDetail?.status === 'SKIPPED';

  return (
    <div className="space-y-4 select-none">
      {/* Photo Viewer Container */}
      <div className="bg-tape p-4 rounded border-2 border-signal/40 shadow-desk space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-signal/30 text-xs">
          <span className="font-typewriter font-bold text-label flex items-center gap-2">
            <Image className="w-4 h-4 text-signal" />
            ADRIAN'S 22:21 SOCIAL MEDIA ALIBI EVIDENCE PHOTO
          </span>
          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded bg-ink/70 hover:bg-ink text-label border border-signal/30"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded bg-ink/70 hover:bg-ink text-label border border-signal/30"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 rounded bg-ink/70 hover:bg-ink text-label border border-signal/30"
              title="Reset view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
          className="relative bg-ink/90 rounded border border-signal/30 h-72 sm:h-96 overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          <img
            src={photoUrl}
            alt="Adrian Cross alibi evidence photograph"
            draggable={false}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
            className="max-h-full max-w-full object-contain pointer-events-none select-none"
          />

          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-ink/80 text-[10px] font-mono text-dim border border-signal/20 pointer-events-none">
            Zoom: {Math.round(scale * 100)}% • Click & drag to pan
          </div>
        </div>

        <div className="text-[11px] text-dim font-serif italic text-right">
          {attribution}
        </div>
      </div>

      {/* Unlocked Memorial Registry (Shown on solve) */}
      {isSolved && (
        <div className="paper-sheet p-5 rounded border-l-4 border-signal text-ink shadow-paper space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-ink/20">
            <span className="font-typewriter font-bold text-xs flex items-center gap-2">
              <FileText className="w-4 h-4 text-signal" />
              MUNICIPAL RECORD: JULIAN MARSH MEMORIAL REGISTRY
            </span>
            <span className="stamp stamp-closed text-[9px]">CROSS-REFERENCED</span>
          </div>
          <div className="font-serif text-xs leading-relaxed text-ink/90 p-3 bg-manila/50 rounded border border-ink/15">
            <p className="font-typewriter font-bold text-sm text-center mb-1">
              IN LOVING MEMORY OF JULIAN MARSH (1996 – 2023)
            </p>
            <p className="text-center italic text-ink/80">
              "Seeking the truth that was taken from him."
            </p>
            <p className="mt-2 text-center font-bold">
              Dedicated by his mother, Helen Marsh, and his brother, Adrian Cross (Marsh).
            </p>
            <p className="text-[11px] text-center font-mono text-ink/70 mt-1">
              Location: West Cliff, Whitby, England
            </p>
          </div>
        </div>
      )}

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-tape/80 rounded border border-signal/30 space-y-2">
        <label className="block text-xs font-serif text-label font-medium">
          Enter the true location or landmark where this photograph was taken (or enter coordinates lat,lng):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="e.g. Whitby, West Cliff Whitby, or 54.4897, -0.6173"
            className="flex-1 bg-ink text-label font-mono text-xs sm:text-sm px-3 py-1.5 rounded border border-signal/40 focus:border-signal focus:outline-none uppercase"
          />
          <button
            type="submit"
            disabled={submitting || !answerInput.trim()}
            className="px-5 py-1.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors disabled:opacity-50"
          >
            {submitting ? 'Verifying Geo...' : 'Verify Location'}
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
