import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InvestigationDesk } from './pages/InvestigationDesk.js';
import { LoginPage } from './pages/LoginPage.js';
import { AdminLoginPage } from './pages/AdminLoginPage.js';
import { AdminDashboard } from './pages/AdminDashboard.js';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvestigationDesk />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/hq" element={<AdminLoginPage />} />
        <Route path="/hq/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
