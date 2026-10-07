import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import initSqlJs, { Database } from 'sql.js';
import { Play, Database as DbIcon, History, AlertCircle, Table, Check } from 'lucide-react';

export const SqlConsole: React.FC = () => {
  const { submitAnswer } = useGameStore();

  const [db, setDb] = useState<Database | null>(null);
  const [loadingDb, setLoadingDb] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [query, setQuery] = useState<string>('SELECT * FROM access_log ORDER BY ts DESC LIMIT 20;');
  const [results, setResults] = useState<{ columns: string[]; values: any[][] } | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Answer form
  const [deviceInput, setDeviceInput] = useState<string>('');
  const [patientInput, setPatientInput] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDatabase() {
      try {
        setLoadingDb(true);
        // Load WASM from local /vendor/sqljs/
        const SQL = await initSqlJs({
          locateFile: (file) => `/vendor/sqljs/${file}`
        });

        // Fetch level4.sqlite as ArrayBuffer
        const res = await fetch('/api/levels/4/assets/level4.sqlite', {
          credentials: 'include'
        });
        if (!res.ok) {
          throw new Error(`Failed to load patient database: status ${res.status}`);
        }
        const buf = await res.arrayBuffer();

        if (mounted) {
          const sqliteDb = new SQL.Database(new Uint8Array(buf));
          setDb(sqliteDb);
          setLoadingDb(false);

          // Run initial sample query
          const initial = sqliteDb.exec('SELECT * FROM access_log ORDER BY ts DESC LIMIT 10;');
          if (initial.length > 0) {
            setResults(initial[0]);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setLoadError(err.message || 'Error initializing SQL engine');
          setLoadingDb(false);
        }
      }
    }

    loadDatabase();

    return () => {
      mounted = false;
      if (db) {
        try {
          db.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const runQuery = (sqlToRun?: string) => {
    const q = (sqlToRun !== undefined ? sqlToRun : query).trim();
    if (!db || !q) return;

    setQueryError(null);

    // Read-only check
    const upper = q.toUpperCase();
    if (
      upper.includes('ATTACH') ||
      upper.includes('PRAGMA') ||
      upper.includes('.LOAD') ||
      upper.includes('DROP') ||
      upper.includes('ALTER') ||
      upper.includes('UPDATE') ||
      upper.includes('INSERT') ||
      upper.includes('DELETE')
    ) {
      setQueryError('Security Restriction: Read-only query environment. Data modification statements are rejected.');
      return;
    }

    try {
      const res = db.exec(q);
      if (res.length > 0) {
        // Cap at 200 rows
        const cols = res[0].columns;
        const vals = res[0].values.slice(0, 200);
        setResults({ columns: cols, values: vals });
      } else {
        setResults({ columns: [], values: [] });
      }

      setHistory((prev) => [q, ...prev.filter((item) => item !== q)].slice(0, 8));
    } catch (err: any) {
      setQueryError(err.message || 'SQL execution error');
      setResults(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runQuery();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceInput.trim() || !patientInput.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    const combined = `${deviceInput.trim()}-${patientInput.trim()}`;
    const res = await submitAnswer(combined);
    if (!res.correct) {
      setSubmitError(res.nudge || 'Values do not reconcile with the audit logs.');
    } else {
      setDeviceInput('');
      setPatientInput('');
    }
    setSubmitting(false);
  };

  if (loadingDb) {
    return (
      <div className="bg-tape p-8 rounded border border-signal/30 text-center font-mono text-xs text-label space-y-2">
        <DbIcon className="w-6 h-6 text-signal mx-auto animate-spin" />
        <p>Mounting client SQL WASM engine & loading encrypted patient archive...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-alarm/20 p-4 rounded border border-alarm/50 text-xs font-serif text-label flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-alarm shrink-0 mt-0.5" />
        <div>
          <strong>Database Archive Error:</strong> {loadError}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Schema Browser & Quick Queries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
        <div
          onClick={() => {
            setQuery('SELECT * FROM patients LIMIT 20;');
            runQuery('SELECT * FROM patients LIMIT 20;');
          }}
          className="p-2 rounded bg-tape/80 hover:bg-tape border border-signal/20 cursor-pointer transition-colors"
        >
          <div className="font-typewriter font-bold text-signal flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5" />
            patients
          </div>
          <div className="text-[11px] text-dim truncate">patient_code, display_name</div>
        </div>

        <div
          onClick={() => {
            setQuery('SELECT * FROM records LIMIT 20;');
            runQuery('SELECT * FROM records LIMIT 20;');
          }}
          className="p-2 rounded bg-tape/80 hover:bg-tape border border-signal/20 cursor-pointer transition-colors"
        >
          <div className="font-typewriter font-bold text-signal flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5" />
            records
          </div>
          <div className="text-[11px] text-dim truncate">record_id, patient_code, session_date, recording_ref, last_edited_at, edited_by</div>
        </div>

        <div
          onClick={() => {
            setQuery('SELECT * FROM access_log WHERE action = \'DELETE\' LIMIT 20;');
            runQuery('SELECT * FROM access_log WHERE action = \'DELETE\' LIMIT 20;');
          }}
          className="p-2 rounded bg-tape/80 hover:bg-tape border border-signal/20 cursor-pointer transition-colors"
        >
          <div className="font-typewriter font-bold text-signal flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5" />
            access_log
          </div>
          <div className="text-[11px] text-dim truncate">log_id, user_id, device, action, target_record, ts</div>
        </div>
      </div>

      {/* SQL Editor */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-typewriter font-bold text-label flex items-center gap-1.5">
            <DbIcon className="w-3.5 h-3.5 text-signal" />
            SQL AUDIT WORKSPACE (READ-ONLY)
          </span>
          <span className="text-[11px] text-dim font-mono">Press Ctrl+Enter to Execute</span>
        </div>

        <div className="relative rounded border border-signal/40 bg-ink shadow-inner overflow-hidden">
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-ink text-label font-mono text-xs p-3 focus:outline-none resize-y leading-relaxed"
            placeholder="SELECT * FROM patients WHERE ..."
          />
          <div className="bg-tape/60 border-t border-signal/20 px-3 py-1.5 flex items-center justify-between">
            {/* History pills */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-[70%]">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(h);
                    runQuery(h);
                  }}
                  className="px-1.5 py-0.5 rounded bg-ink/70 text-[10px] text-dim hover:text-label whitespace-nowrap truncate max-w-[140px]"
                  title={h}
                >
                  {h}
                </button>
              ))}
            </div>

            <button
              onClick={() => runQuery()}
              className="px-4 py-1 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors flex items-center gap-1 shadow"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run Query</span>
            </button>
          </div>
        </div>

        {queryError && (
          <div className="p-2 bg-alarm/20 rounded border border-alarm/40 text-xs text-alarm font-mono flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{queryError}</span>
          </div>
        )}
      </div>

      {/* Result Table */}
      {results && (
        <div className="rounded border border-signal/30 bg-ink shadow-inner overflow-x-auto max-h-[260px] overflow-y-auto">
          {results.columns.length === 0 ? (
            <div className="p-4 text-center text-xs text-dim font-mono">Query executed. 0 rows returned.</div>
          ) : (
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="bg-tape text-label sticky top-0 border-b border-signal/30 z-10">
                <tr>
                  {results.columns.map((c, i) => (
                    <th key={i} className="py-1.5 px-3 whitespace-nowrap text-[11px] font-bold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dim/20">
                {results.values.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-tape/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-1.5 px-3 text-label/90 whitespace-nowrap text-[11px]">
                        {cell === null ? (
                          <span className="text-dim/50 italic">NULL</span>
                        ) : String(cell) === 'REDACTED' ? (
                          <span className="bg-redact text-label font-bold px-1 rounded text-[10px]">[REDACTED]</span>
                        ) : (
                          String(cell)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-tape/80 rounded border border-signal/30 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-serif text-label font-medium mb-1">
              Q1: Device used to DELETE a record on the murder night (2026-10-23):
            </label>
            <input
              type="text"
              value={deviceInput}
              onChange={(e) => setDeviceInput(e.target.value)}
              placeholder="e.g. LENA_IPAD"
              className="w-full bg-ink text-label font-mono px-3 py-1.5 rounded border border-signal/40 focus:border-signal focus:outline-none uppercase"
            />
          </div>

          <div>
            <label className="block font-serif text-label font-medium mb-1">
              Q2: REDACTED patient code edited by Elias in the week after Julian's death:
            </label>
            <input
              type="text"
              value={patientInput}
              onChange={(e) => setPatientInput(e.target.value)}
              placeholder="e.g. P-0912"
              className="w-full bg-ink text-label font-mono px-3 py-1.5 rounded border border-signal/40 focus:border-signal focus:outline-none uppercase"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-dim">
            Combined format: [DEVICE]-[PATIENT_CODE] (e.g. LENA_IPAD-P0912)
          </span>
          <button
            type="submit"
            disabled={submitting || !deviceInput.trim() || !patientInput.trim()}
            className="px-5 py-1.5 bg-signal hover:bg-signal/90 text-ink font-serif font-bold text-xs rounded transition-colors disabled:opacity-50"
          >
            {submitting ? 'Auditing Database...' : 'Submit Audit Answer'}
          </button>
        </div>

        {submitError && (
          <div className="flex items-center gap-1.5 text-xs text-alarm font-serif mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}
      </form>
    </div>
  );
};
