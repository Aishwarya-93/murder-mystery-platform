
import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  FolderClosed,
  LockKeyhole,
  NotebookPen,
  Users,
  X,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore.js';

type DossierPage =
  | 'overview'
  | 'characters'
  | 'timeline'
  | 'documents'
  | 'evidence'
  | 'notes';

const pages: { id: DossierPage; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'timeline', label: 'Timeline', icon: CalendarDays },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'evidence', label: 'Evidence', icon: FolderClosed },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
];

interface CaseDossierProps {
  onClose: () => void;
}

export const CaseDossier: React.FC<CaseDossierProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState<DossierPage>('overview');

  const {
    team,
    levelDetail,
    levels,
    evidenceBoard,
    notebookText,
    setNotebookText,
    saveNotebook,
  } = useGameStore();

  const discoveredLevels = levels.filter(
    level => level.status === 'SOLVED' || level.status === 'SKIPPED'
  );

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return (
          <>
            <p className="dossier-kicker">METROPOLITAN SPECIAL INVESTIGATIONS</p>
            <h2 className="dossier-page-title">Case Overview</h2>
            <div className="dossier-rule" />
            <p className="dossier-body">
              This file contains the information collected during your investigation.
              Review verified discoveries and your own notes as the case develops.
            </p>
            <div className="dossier-facts">
              <div>
                <span>INVESTIGATING UNIT</span>
                <strong>{team?.name || 'Assigned investigation team'}</strong>
              </div>
              <div>
                <span>CURRENT INCIDENT</span>
                <strong>23 October 2026</strong>
              </div>
              <div>
                <span>ACTIVE FILE</span>
                <strong>{levelDetail?.title || 'Investigation pending'}</strong>
              </div>
              <div>
                <span>VERIFIED DISCOVERIES</span>
                <strong>{evidenceBoard.length} evidence file(s)</strong>
              </div>
            </div>
            <p className="dossier-handwritten">
              Keep your observations separate from verified evidence.
            </p>
          </>
        );

      case 'characters':
        return (
          <>
            <p className="dossier-kicker">PERSONS OF INTEREST</p>
            <h2 className="dossier-page-title">Character Files</h2>
            <div className="dossier-rule" />
            <p className="dossier-body">
              Character files will be recorded here as verified character
              information becomes available.
            </p>
            <div className="dossier-empty">
              <LockKeyhole size={20} />
              <p>
                No separate character records have been indexed yet.
                Check the discovered documents and evidence for established names.
              </p>
            </div>
          </>
        );

      case 'timeline':
        return (
          <>
            <p className="dossier-kicker">CHRONOLOGICAL RECORD</p>
            <h2 className="dossier-page-title">Timeline</h2>
            <div className="dossier-rule" />
            <p className="dossier-body">
              The timeline lists completed investigations, not future events.
            </p>
            <div className="dossier-timeline">
              {discoveredLevels.length === 0 ? (
                <p className="dossier-muted">No discoveries recorded yet.</p>
              ) : (
                discoveredLevels.map(level => (
                  <article className="dossier-timeline-entry" key={level.id}>
                    <span className="dossier-timeline-dot" />
                    <div>
                      <span className="dossier-timeline-date">
                        {level.solvedAt
                          ? new Date(level.solvedAt).toLocaleString()
                          : 'DISCOVERY RECORDED'}
                      </span>
                      <h3>{level.title}</h3>
                      <p>
                        {level.status === 'SOLVED'
                          ? 'Investigation solved.'
                          : 'Investigation skipped; clue recorded.'}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </>
        );

      case 'documents':
        return (
          <>
            <p className="dossier-kicker">ARCHIVE INDEX</p>
            <h2 className="dossier-page-title">Documents</h2>
            <div className="dossier-rule" />
            {discoveredLevels.length === 0 ? (
              <p className="dossier-muted">
                Documents will be indexed as investigations are completed.
              </p>
            ) : (
              <div className="dossier-document-list">
                {discoveredLevels.map(level => (
                  <article className="dossier-document" key={level.id}>
                    <FileText size={21} />
                    <div>
                      <h3>{level.title}</h3>
                      <p>Investigation file · Case {String(level.id).padStart(2, '0')}</p>
                    </div>
                    <span>FILED</span>
                  </article>
                ))}
              </div>
            )}
          </>
        );

      case 'evidence':
        return (
          <>
            <p className="dossier-kicker">VERIFIED MATERIAL</p>
            <h2 className="dossier-page-title">Evidence Index</h2>
            <div className="dossier-rule" />
            {evidenceBoard.length === 0 ? (
              <p className="dossier-muted">
                No evidence has been unlocked yet. Complete an investigation
                to add its revealed clue here.
              </p>
            ) : (
              <div className="dossier-evidence-list">
                {evidenceBoard.map(card => (
                  <article className="dossier-evidence-item" key={card.level}>
                    <span className="dossier-exhibit">
                      EXHIBIT {String(card.level).padStart(2, '0')}
                    </span>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </article>
                ))}
              </div>
            )}
          </>
        );

      case 'notes':
        return (
          <>
            <p className="dossier-kicker">PRIVATE INVESTIGATOR NOTES</p>
            <h2 className="dossier-page-title">Working Notes</h2>
            <div className="dossier-rule" />
            <p className="dossier-body">
              Record your own observations and theories. Notes are not treated
              as verified evidence.
            </p>
            <textarea
              className="dossier-notes-input"
              value={notebookText}
              onChange={event => setNotebookText(event.target.value)}
              placeholder="Record your observations..."
              aria-label="Investigation notes"
            />
            <button
              className="dossier-save-button"
              onClick={() => void saveNotebook()}
            >
              <NotebookPen size={16} />
              Save notes
            </button>
          </>
        );
    }
  };

  if (!isOpen) {
    return (
      <div className="dossier-overlay" role="dialog" aria-modal="true" aria-label="Case dossier">
        <button className="dossier-close" onClick={onClose} aria-label="Close dossier">
          <X size={21} />
        </button>

        <button
          className="dossier-cover"
          onClick={() => setIsOpen(true)}
          aria-label="Open the case dossier"
        >
          <span className="dossier-cover-clip" />
          <span className="dossier-cover-top">METROPOLITAN POLICE SERVICE</span>
          <span className="dossier-cover-title">CASE<br />DOSSIER</span>
          <span className="dossier-cover-rule" />
          <span className="dossier-cover-field">INCIDENT DATE: 23 OCTOBER 2026</span>
          <span className="dossier-cover-field">
            INVESTIGATOR: {team?.name || 'AUTHORIZED PERSONNEL'}
          </span>
          <span className="dossier-cover-stamp">CONFIDENTIAL</span>
          <span className="dossier-cover-bottom">CLICK TO OPEN FILE</span>
        </button>

        <p className="dossier-scene-caption">
          EVIDENCE ARCHIVE · RESTRICTED ACCESS
        </p>
      </div>
    );
  }

  const currentIndex = pages.findIndex(page => page.id === activePage);

  return (
    <div className="dossier-overlay dossier-overlay-open" role="dialog" aria-modal="true" aria-label="Open case dossier">
      <div className="dossier-open-shell">
        <header className="dossier-open-header">
          <div>
            <span className="dossier-kicker">CONFIDENTIAL CASE FILE</span>
            <h2>Investigation Dossier</h2>
          </div>
          <button className="dossier-close-inline" onClick={onClose} aria-label="Close dossier">
            <X size={21} />
          </button>
        </header>

        <div className="dossier-book">
          <nav className="dossier-tabs" aria-label="Dossier sections">
            {pages.map(page => {
              const Icon = page.icon;
              return (
                <button
                  key={page.id}
                  className={`dossier-tab ${activePage === page.id ? 'active' : ''}`}
                  onClick={() => setActivePage(page.id)}
                  aria-current={activePage === page.id ? 'page' : undefined}
                >
                  <Icon size={16} />
                  <span>{page.label}</span>
                </button>
              );
            })}
          </nav>

          <article className="dossier-paper" key={activePage}>
            <span className="dossier-paper-clip" />
            {renderPage()}
            <footer className="dossier-page-footer">
              <span>METROPOLITAN SPECIAL INVESTIGATIONS</span>
              <span>PAGE {currentIndex + 1} / {pages.length}</span>
            </footer>
          </article>
        </div>

        <footer className="dossier-book-controls">
          <button
            onClick={() => setActivePage(pages[Math.max(0, currentIndex - 1)].id)}
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={16} /> Previous page
          </button>
          <span>HANDLE WITH CARE · OFFICIAL RECORD</span>
          <button
            onClick={() => setActivePage(pages[Math.min(pages.length - 1, currentIndex + 1)].id)}
            disabled={currentIndex === pages.length - 1}
          >
            Next page <ArrowRight size={16} />
          </button>
        </footer>
      </div>
    </div>
  );
};
