import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { OptInPage } from './pages/OptIn';
import { ConfirmPage } from './pages/Confirm';
import App from './App'; // Your existing app

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/app" /> : <OptInPage />} 
      />
      <Route path="/confirm" element={<ConfirmPage />} />
      <Route 
        path="/app/*" 
        element={user ? <App /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}

export default Router;
