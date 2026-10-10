import React, { useEffect, useState } from 'react';
import { CaseDossier } from '../components/CaseDossier.js';
import { useGameStore } from '../store/gameStore.js';
import { useNavigate } from 'react-router-dom';

import { Header } from '../components/Header.js';
import { LevelWorkspace } from '../components/LevelWorkspace.js';
import { RightDrawer } from '../components/RightDrawer.js';
import { ClueCardModal } from '../components/ClueCardModal.js';
import { FinalTheoryModal } from '../components/FinalTheoryModal.js';
import { ToastContainer } from '../components/ToastContainer.js';

export const InvestigationDesk: React.FC = () => {
  const { team, init } = useGameStore();
  const navigate = useNavigate();
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    // If not authenticated, redirect to login
    const checkAuth = setTimeout(() => {
      const state = useGameStore.getState();
      if (!state.team && !state.isAdmin) {
        navigate('/login');
      }
    }, 400);

    return () => clearTimeout(checkAuth);
  }, [navigate]);

  return (
    <div className="min-h-screen desk-surface text-label flex flex-col overflow-hidden select-none">
      {/* Top Chronometer & Case Status Bar */}
      <Header onOpenDossier={() => setIsDossierOpen(true)} />

      {/* Main investigation desk: current case file in the centre.
          The old left list of all levels (CaseBoard) has been removed. */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Center: Current Physical Case File & Working Desk Surface */}
        <LevelWorkspace />

        {/* Right: still here for now (Hints, Notebook, Standings).
            Will be converted to a pop-out drawer in the next step. */}
        <RightDrawer />
      </main>

      {/* Overlays & Evidence Modals */}
      <ClueCardModal />
      <FinalTheoryModal />
      <ToastContainer />
      {isDossierOpen && (
        <CaseDossier onClose={() => setIsDossierOpen(false)} />
      )}
    </div>
  );
};