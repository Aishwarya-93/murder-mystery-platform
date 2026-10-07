import React, { useState } from 'react';
import { api } from '../api/client.js';
import { useGameStore } from '../store/gameStore.js';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Shield, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-ink flex items-center justify-center p-4 selection:bg-signal selection:text-ink">
      <div className="paper-sheet max-w-md w-full p-6 sm:p-8 rounded shadow-desk border-2 border-signal relative space-y-6 text-ink">
        {/* Header Stamps */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-signal" />
            <span className="font-typewriter text-xs font-bold tracking-widest text-ink uppercase">
              METROPOLITAN POLICE // 1986
            </span>
          </div>
          <span className="stamp stamp-open text-xs">AUTHORIZED ACCESS</span>
        </div>

        <div className="space-y-1">
          <h1 className="font-typewriter text-2xl font-bold tracking-wide uppercase text-ink">
            MURDER MYSTERY
          </h1>
          <p className="font-serif text-xs text-ink/75 leading-relaxed">
            Hampstead Case File Archive • Case-1986-2310. Enter your assigned Squad Code and security passcode to enter the investigation desk.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-typewriter font-bold text-ink mb-1">
              SQUAD IDENTIFIER CODE:
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. BAKER"
              required
              className="w-full bg-label/90 text-ink font-mono text-sm px-3.5 py-2 rounded border border-ink/40 focus:border-signal focus:outline-none uppercase tracking-wider"
            />
          </div>

          <div>
            <label className="block text-xs font-typewriter font-bold text-ink mb-1">
              CONFIDENTIAL PASSCODE:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-label/90 text-ink font-mono text-sm px-3.5 py-2 rounded border border-ink/40 focus:border-signal focus:outline-none"
            />
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-alarm/20 rounded border border-alarm/40 text-xs font-serif text-alarm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !code.trim() || !password.trim()}
            className="w-full py-2.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-sm rounded shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{submitting ? 'Verifying Credentials...' : 'Open Case File Dossier'}</span>
          </button>
        </form>

        {/* Footer info & demo hints */}
        <div className="pt-3 border-t border-ink/20 text-center space-y-2">
          <p className="text-[11px] font-mono text-ink/60">
            Demo Squads: <strong>BAKER</strong> / <code>case1986</code> &bull; <strong>YARD</strong> / <code>case1986</code>
          </p>
          <div className="text-[11px] font-serif text-ink/60">
            <Link to="/hq" className="hover:text-signal underline">
              Organizers: Emergency Login (/hq)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
