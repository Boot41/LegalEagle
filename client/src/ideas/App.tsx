import React, { useState } from 'react';
import { Search, Upload, Shield, Clock, FileCheck, Zap, ChevronDown } from 'lucide-react';
import LandingPage from './components/LandingPage';
import UploadComponent from './components/UploadComponent';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <LandingPage />
    </div>
  );
}

export default App;