import React, { useState } from 'react';
import { api } from '../api/client.js';
import { useGameStore } from '../store/gameStore.js';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Shield, AlertCircle, Fingerprint, Lock, Compass } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { init } = useGameStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !password.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await api.login(code.trim(), password.trim());
      await init();
      navigate('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify squad credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen desk-surface flex items-center justify-center p-4 selection:bg-signal selection:text-ink relative overflow-hidden">
      {/* Subtle ambient lighting vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

      {/* Manila Evidence Folder / Case Envelope */}
      <div className="relative paper-sheet max-w-lg w-full p-6 sm:p-9 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-[#8c6d48] space-y-6 text-ink z-10">
        {/* Brass Paperclip on top-left */}
        <div className="paperclip absolute -top-3 left-8 z-20" />

        {/* Header Stamps & Police Crest */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b-2 border-ink/30 gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-900" />
            <span className="font-typewriter text-xs sm:text-sm font-bold tracking-widest text-red-950 uppercase">
              NEW SCOTLAND YARD // HOMICIDE SQUAD
            </span>
          </div>
          <span className="stamp stamp-open text-xs">OFFICIAL DOSSIER</span>
        </div>

        {/* Case Title and Investigation Meta */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              CONFIDENTIAL CASE #1986-2310
            </span>
            <span className="text-[10px] font-mono text-red-900 font-bold">
              EVENT DATE: 23 OCT 2026
            </span>
          </div>
          <h1 className="font-typewriter text-2xl sm:text-3xl font-bold tracking-wide uppercase text-zinc-950">
            THE HAMPSTEAD MURDER
          </h1>
          <p className="font-serif text-xs text-zinc-800 leading-relaxed pt-1">
            Archival Crime Scene Dossier • 8 Park Terrace. Enter your squad credentials to unlock the investigation desk and examine forensic exhibits.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 bg-manila/50 p-4 sm:p-5 rounded-lg border border-ink/20 shadow-inner">
          <div>
            <label className="block text-xs font-typewriter font-bold text-zinc-950 mb-1">
              SQUAD IDENTIFIER CODE:
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. BAKER"
              required
              className="w-full bg-[#fdfbf7] text-zinc-950 font-mono text-sm px-3.5 py-2.5 rounded border border-ink/40 focus:border-red-900 focus:outline-none uppercase tracking-widest shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-typewriter font-bold text-zinc-950 mb-1">
              CONFIDENTIAL PASSCODE:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#fdfbf7] text-zinc-950 font-mono text-sm px-3.5 py-2.5 rounded border border-ink/40 focus:border-red-900 focus:outline-none shadow-inner"
            />
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-red-100 rounded border border-red-300 text-xs font-serif text-red-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !code.trim() || !password.trim()}
            className="w-full py-3 bg-gradient-to-b from-[#8b261e] to-[#6d1b14] hover:from-[#a02c23] hover:to-[#7c1f17] text-[#fdfbf7] font-serif font-bold text-sm rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:translate-y-0.5"
          >
            <KeyRound className="w-4 h-4" />
            <span>{submitting ? 'Authenticating Clearance...' : 'Open Case File Dossier'}</span>
          </button>
        </form>

        {/* Footer info & demo hints */}
        <div className="pt-3 border-t border-ink/20 text-center space-y-2">
          <p className="text-[11px] font-mono text-zinc-600">
            Assigned Squads: <strong>BAKER</strong> / <code>case1986</code> &bull; <strong>YARD</strong> / <code>case1986</code>
          </p>
          <div className="text-[11px] font-serif text-zinc-600">
            <Link to="/hq" className="hover:text-red-900 underline font-medium">
              Event Organizers & Chief Inspector HQ (/hq)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
