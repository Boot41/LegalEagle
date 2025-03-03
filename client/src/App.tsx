import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LandingPage from './components/LandingPage';
import SearchBar from './components/SearchBar';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="search" element={<SearchBar />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;