import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LandingPage from './components/LandingPage';
import SearchPage from './components/SearchPage';
import DocumentAnalysisPage from './components/DocumentAnalysisPage';
import AddRule from './components/AddRule';
import Dashboard from './components/Dashboard';
import './index.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="document" element={<DocumentAnalysisPage />} />
          <Route path="rules" element={<AddRule />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;