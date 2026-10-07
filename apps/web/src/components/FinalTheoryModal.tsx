import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { api } from '../api/client.js';
import { FileText, Save, Check, X, ShieldCheck } from 'lucide-react';

interface TheoryAnswers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
}

export const FinalTheoryModal: React.FC = () => {
  const { isTheoryModalOpen, setTheoryModalOpen, addToast } = useGameStore();

  const [questions, setQuestions] = useState<Array<{ id: string; text: string }>>([]);
  const [answers, setAnswers] = useState<TheoryAnswers>({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: ''
  });
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isTheoryModalOpen) {
      api.getTheory().then((res) => {
        if (res.questions) setQuestions(res.questions);
        if (res.submission) {
          setAnswers({
            q1: res.submission.q1 || '',
            q2: res.submission.q2 || '',
            q3: res.submission.q3 || '',
            q4: res.submission.q4 || '',
            q5: res.submission.q5 || '',
            q6: res.submission.q6 || '',
            q7: res.submission.q7 || '',
            q8: res.submission.q8 || ''
          });
          setSubmittedAt(res.submission.submitted_at);
        }
      });
    }
  }, [isTheoryModalOpen]);

  const handleChange = (id: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.saveTheory(answers);
      setSubmittedAt(res.submittedAt);
      addToast('Case Theory dossier successfully saved and logged.', 'info');
    } catch (err: any) {
      addToast(err.message || 'Failed to save theory', 'alert');
    } finally {
      setSaving(false);
    }
  };

  if (!isTheoryModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="theory-modal-title"
      className="fixed inset-0 z-50 bg-ink/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="paper-sheet max-w-4xl w-full max-h-[90vh] flex flex-col rounded text-ink shadow-desk border-2 border-signal relative">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-ink/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-signal" />
            <div>
              <h2
                id="theory-modal-title"
                className="text-lg sm:text-xl font-typewriter font-bold uppercase text-ink"
              >
                FINAL CASE THEORY OF THE PROSECUTION
              </h2>
              <p className="text-xs font-serif text-ink/75 italic">
                Formulate your squad’s complete synthesis of the events of 23 October 2026. Editable until event conclusion.
              </p>
            </div>
          </div>

          <button
            onClick={() => setTheoryModalOpen(false)}
            aria-label="Close"
            className="p-1 rounded hover:bg-ink/10 text-ink/70 hover:text-ink transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Questions List */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5">
          {questions.map((q, idx) => (
            <div key={q.id} className="space-y-1.5 bg-manila/40 p-3 rounded border border-ink/10">
              <label className="block text-xs sm:text-sm font-typewriter font-bold text-ink">
                Question {idx + 1}: {q.text}
              </label>
              <textarea
                rows={3}
                value={(answers as any)[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder="Write your squad's finding and supporting evidence..."
                className="w-full text-xs sm:text-sm font-serif p-2.5 rounded bg-label/80 text-ink border border-ink/30 focus:border-signal focus:outline-none leading-relaxed resize-y"
              />
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-ink/20 flex flex-wrap items-center justify-between gap-3 bg-manila/60">
          <div className="text-xs font-mono text-ink/70 flex items-center gap-2">
            {submittedAt ? (
              <>
                <ShieldCheck className="w-4 h-4 text-ok" />
                <span>Last Filed: {new Date(submittedAt).toLocaleTimeString()}</span>
              </>
            ) : (
              <span>Not yet filed with headquarters</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheoryModalOpen(false)}
              className="px-4 py-2 border border-ink/30 hover:bg-ink/10 text-ink font-serif text-xs sm:text-sm rounded transition-colors"
            >
              Close Window
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs sm:text-sm rounded shadow flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? <Save className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Save & File Theory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
