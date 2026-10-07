import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { Info, AlertTriangle, AlertOctagon, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGameStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-3 rounded shadow-desk border flex items-start gap-2.5 transition-all text-xs font-serif ${
            t.severity === 'alert'
              ? 'bg-alarm text-label border-alarm/80 shadow-alarm/20'
              : t.severity === 'warning'
              ? 'bg-tape text-label border-signal/60'
              : 'bg-ink text-label border-signal/40'
          }`}
        >
          {t.severity === 'alert' ? (
            <AlertOctagon className="w-4 h-4 text-label shrink-0 mt-0.5" />
          ) : t.severity === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-signal shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-signal shrink-0 mt-0.5" />
          )}

          <div className="flex-1 leading-snug">
            {t.message}
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="p-0.5 rounded hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
