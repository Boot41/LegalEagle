import React from 'react';
// import { Outlet } from 'react-router-dom';
import { 
  FileText, 
  Home, 
  Info, 
  ChevronRight 
} from 'lucide-react';

import SearchBar from './SearchBar';
import DocumentAnalysisContainer from './DocumentAnalysisContainer';

const Header = () => (
  <header className="py-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
    <div className="w-full px-8 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-indigo-500 flex items-center justify-center text-white">
          <FileText size={20} />
        </div>
        <h1 className="text-3xl font-bold gradient-text">
          LegalEagle
        </h1>
      </div>
      
      <nav>
        <ul className="flex space-x-8">
          <li>
            <a href="/" className="nav-link active flex items-center">
              <Home size={18} className="mr-1.5" />
              Home
            </a>
          </li>
          <li>
            <a href="#" className="nav-link flex items-center">
              <Info size={18} className="mr-1.5" />
              About
            </a>
          </li>
          <li>
            <a href="#" className="btn-primary flex items-center text-sm">
              Get Started
              <ChevronRight size={16} className="ml-1" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="py-8 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
    <div className="w-full px-8 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-indigo-500 flex items-center justify-center text-white">
          <FileText size={16} />
        </div>
        <span className="font-semibold gradient-text">LegalEagle</span>
      </div>
      
      <p className="text-gray-500 text-sm">
        {new Date().getFullYear()} LegalEagle. All rights reserved.
      </p>
      
      <div className="flex space-x-4 mt-4 md:mt-0">
        <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">Privacy</a>
        <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">Terms</a>
        <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      <Header />

      <main className="w-full px-8 py-8">
        <div className="w-full space-y-8">
          <SearchBar />
          <DocumentAnalysisContainer />          
          {/* <Outlet /> */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
