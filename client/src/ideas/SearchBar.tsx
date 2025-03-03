import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">Search Legal Documents</h3>
      <div 
        className={`relative flex items-center transition-all duration-300 ${
          isFocused 
            ? 'bg-white border-2 border-sky-500 shadow-md ring-4 ring-sky-100' 
            : 'bg-white border border-slate-200'
        } rounded-lg overflow-hidden`}
      >
        <div className="pl-4">
          <Search className={`h-5 w-5 ${isFocused ? 'text-sky-500' : 'text-slate-400'} transition-colors duration-300`} />
        </div>
        <input
          type="text"
          placeholder="Search by keyword, document type, or date..."
          className="w-full py-3 px-3 bg-transparent outline-none text-slate-800 placeholder-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="pr-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm font-medium text-slate-500">Suggested:</span>
        <button className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-slate-700 transition-colors">
          Contracts
        </button>
        <button className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-slate-700 transition-colors">
          NDAs
        </button>
        <button className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-slate-700 transition-colors">
          Compliance Reports
        </button>
        <button className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-slate-700 transition-colors">
          Recent Documents
        </button>
      </div>
    </div>
  );
};

export default SearchBar;