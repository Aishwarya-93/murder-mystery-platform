import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { api } from '../api/client.js';
import { FileText, Save, Check, X, ShieldCheck, Scale, Award } from 'lucide-react';

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
      addToast('Case Theory dossier successfully saved and logged with Chief Inspector.', 'info');
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
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="paper-sheet max-w-4xl w-full max-h-[92vh] flex flex-col rounded-xl text-ink shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-4 border-[#5c4631] relative">
        {/* Top corner paperclip */}
        <div className="paperclip absolute -top-3 left-10 z-20" />

        {/* Modal Header */}
        <div className="p-5 sm:p-7 border-b-2 border-ink/20 flex flex-wrap items-center justify-between gap-4 bg-manila/80">
          <div className="flex items-center gap-3">
            <Scale className="w-7 h-7 text-red-900" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  CROWN PROSECUTION SERVICE // SPECIAL HOMICIDE DIVISION
                </span>
              </div>
              <h2
                id="theory-modal-title"
                className="text-lg sm:text-2xl font-typewriter font-bold uppercase text-zinc-950 tracking-wide"
              >
                FINAL CASE THEORY OF THE PROSECUTION
              </h2>
              <p className="text-xs font-serif text-zinc-800 italic pt-0.5">
                Formulate your squad’s complete synthesis of the events of 23 October 2026. Official finding for the Chief Inspector.
              </p>
            </div>
          </div>

          <button
            onClick={() => setTheoryModalOpen(false)}
            aria-label="Close"
            className="p-1.5 rounded-full hover:bg-ink/10 text-ink/70 hover:text-ink transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Questions List */}
        <div className="p-5 sm:p-7 flex-1 overflow-y-auto space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="space-y-2 bg-manila/40 p-4 rounded-lg border border-ink/15 shadow-sm">
              <label className="block text-xs sm:text-sm font-typewriter font-bold text-red-950">
                COUNT #{idx + 1}: {q.text}
              </label>
              <textarea
                rows={3}
                value={(answers as any)[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder="Detail your findings, corroborated exhibits, and forensic conclusions..."
                className="w-full text-xs sm:text-sm font-serif p-3 rounded bg-[#fdfbf7] text-zinc-950 border border-ink/30 focus:border-red-900 focus:outline-none leading-relaxed resize-y shadow-inner"
              />
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t-2 border-ink/20 flex flex-wrap items-center justify-between gap-4 bg-manila/90">
          <div className="text-xs font-mono text-zinc-700 flex items-center gap-2">
            {submittedAt ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-emerald-900">
                  OFFICIAL INDICTMENT FILED: {new Date(submittedAt).toLocaleTimeString()}
                </span>
              </>
            ) : (
              <span className="italic">Dossier draft pending filing with Chief Inspector</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheoryModalOpen(false)}
              className="px-5 py-2.5 border border-ink/30 hover:bg-ink/10 text-zinc-900 font-serif text-xs sm:text-sm rounded-lg transition-colors"
            >
              Close Dossier
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-7 py-2.5 bg-gradient-to-b from-[#8b261e] to-[#6d1b14] hover:from-[#a02c23] hover:to-[#7c1f17] text-[#fdfbf7] font-serif font-bold text-xs sm:text-sm rounded-lg shadow-md flex items-center gap-2 transition-all disabled:opacity-50 active:translate-y-0.5"
            >
              {saving ? <Save className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Save & Seal Prosecution Theory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
