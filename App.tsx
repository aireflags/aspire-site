
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AspireAI from './pages/aspireAI';
import OfferMaker from './pages/OfferMaker';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 max-w-md mx-auto relative overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/aspireAI" element={<AspireAI />} />
          <Route path="/offerMaker" element={<OfferMaker />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {/* Persistent UI Elements */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default App;
