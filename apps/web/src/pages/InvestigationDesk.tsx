import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { useNavigate } from 'react-router-dom';

import { Header } from '../components/Header.js';
import { CaseBoard } from '../components/CaseBoard.js';
import { LevelWorkspace } from '../components/LevelWorkspace.js';
import { RightDrawer } from '../components/RightDrawer.js';
import { ClueCardModal } from '../components/ClueCardModal.js';
import { FinalTheoryModal } from '../components/FinalTheoryModal.js';
import { ToastContainer } from '../components/ToastContainer.js';

export const InvestigationDesk: React.FC = () => {
  const { team, init } = useGameStore();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-ink text-label flex flex-col overflow-hidden">
      {/* Top Bar */}
      <Header />

      {/* Main Investigation Desk Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left: 10 Stamped Case Files */}
        <CaseBoard />

        {/* Center: Current Investigation Workspace */}
        <LevelWorkspace />

        {/* Right: Drawer (Evidence Board, Notebook, Hints, Leaderboard) */}
        <RightDrawer />
      </div>

      {/* Overlays */}
      <ClueCardModal />
      <FinalTheoryModal />
      <ToastContainer />
    </div>
  );
};
