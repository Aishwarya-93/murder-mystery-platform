import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Fingerprint,
  KeyRound,
  Shield,
} from 'lucide-react';

import { api } from '../api/client.js';
import { useGameStore } from '../store/gameStore.js';

export const LoginPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { init } = useGameStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!code.trim() || !password.trim() || submitting) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await api.login(code.trim(), password.trim());
      await init();
      navigate('/');
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please verify your squad credentials.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="case-login">
      {/* Background investigation room */}
      <div className="investigation-scene" aria-hidden="true">
        <div className="scene-light scene-light--left" />
        <div className="scene-light scene-light--right" />

        <div className="investigation-board">
          <div className="board-paper board-paper--one">
            <span className="paper-heading">INCIDENT REPORT</span>
            <span className="paper-lines" />
            <span className="paper-lines paper-lines--short" />
            <span className="paper-lines" />
            <span className="paper-lines paper-lines--medium" />
          </div>

          <div className="board-paper board-paper--two">
            <span className="paper-heading">WITNESS STATEMENT</span>
            <span className="paper-lines" />
            <span className="paper-lines paper-lines--medium" />
            <span className="paper-lines" />
            <span className="paper-lines paper-lines--short" />
          </div>

          <div className="board-paper board-paper--three">
            <span className="paper-heading">ARCHIVE / 07</span>
            <span className="paper-lines" />
            <span className="paper-lines paper-lines--short" />
            <span className="paper-lines paper-lines--medium" />
          </div>

          <div className="board-photo board-photo--one">
            <div className="photo-silhouette" />
            <span>EXHIBIT A</span>
          </div>

          <div className="board-photo board-photo--two">
            <div className="photo-building" />
            <span>LOCATION RECORD</span>
          </div>

          <div className="board-note board-note--one">
            <span>CHECK THE TIMELINE</span>
          </div>

          <div className="board-note board-note--two">
            <span>RESTRICTED</span>
          </div>

          {/* Evidence threads are decorative, not interactive */}
          <span className="evidence-thread thread--one" />
          <span className="evidence-thread thread--two" />
          <span className="evidence-thread thread--three" />
          <span className="evidence-thread thread--four" />

          <span className="evidence-pin pin--one" />
          <span className="evidence-pin pin--two" />
          <span className="evidence-pin pin--three" />
          <span className="evidence-pin pin--four" />

          <div className="board-vignette" />
        </div>

        <div className="scene-desk" />
      </div>

      {/* Foreground case file */}
      <section className="case-login-content">
        <div className="case-access-card">
          <span className="case-card-clip" aria-hidden="true" />
          <span className="case-card-pin" aria-hidden="true" />

          <header className="case-card-header">
            <div className="case-brand">
              <div className="case-brand-mark">
                <Fingerprint size={27} strokeWidth={1.5} />
              </div>

              <div>
                <p className="case-brand-overline">CONFIDENTIAL ARCHIVE</p>
                <h1 className="case-brand-title">
                  MURDER
                  <br />
                  MYSTERY
                </h1>
              </div>
            </div>

            <span className="case-confidential-stamp">
              CONFIDENTIAL
            </span>
          </header>

          <div className="case-meta">
            <span>CASE FILE: MM-2026-2310</span>
            <span className="case-status">
              <span className="status-dot" />
              SEALED
            </span>
          </div>

          <div className="case-card-intro">
            <p className="case-eyebrow">23 OCTOBER 2026</p>
            <h2>Case File Access</h2>
            <p>
              The investigation remains open. Verify your assigned
              investigator credentials to access the case desk.
            </p>
          </div>

          <div className="case-divider">
            <span />
            <Shield size={15} />
            <span />
          </div>

          <form className="case-login-form" onSubmit={handleLogin}>
            <div className="case-field">
              <label htmlFor="squad-code">INVESTIGATOR / SQUAD ID</label>

              <div className="case-input-wrap">
                <Fingerprint size={17} aria-hidden="true" />

                <input
                  id="squad-code"
                  name="code"
                  type="text"
                  autoComplete="username"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter assigned identifier"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="case-field">
              <label htmlFor="squad-password">CONFIDENTIAL PASSCODE</label>

              <div className="case-input-wrap">
                <KeyRound size={17} aria-hidden="true" />

                <input
                  id="squad-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your passcode"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="case-login-error" role="alert">
                <AlertCircle size={17} aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="case-open-button"
              disabled={submitting || !code.trim() || !password.trim()}
            >
              <span>{submitting ? 'VERIFYING CLEARANCE…' : 'OPEN CASE FILE'}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>

            <p className="case-security-note">
              <Shield size={12} aria-hidden="true" />
              AUTHORIZED INVESTIGATORS ONLY
            </p>
          </form>

          <footer className="case-card-footer">
            <span>METROPOLITAN INVESTIGATION ARCHIVE</span>
            <span className="case-footer-seal">MM / 26</span>
          </footer>
        </div>

        <div className="case-scene-caption">
          <span className="caption-indicator" />
          <span>INVESTIGATION ROOM</span>
          <span className="caption-divider">/</span>
          <span>CASE STATUS: ACTIVE</span>
        </div>

        <Link to="/hq" className="case-admin-link">
          Event organizer access
        </Link>
      </section>
    </main>
  );
};