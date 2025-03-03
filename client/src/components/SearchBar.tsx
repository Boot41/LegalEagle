import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchResult {
  file_id: string;
  file_url: string;
  ocr_text: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);

  // Determine the correct API endpoint
  const API_ENDPOINT = 'http://localhost:8080/search';

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_ENDPOINT}?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6">
      <div className="flex items-center mb-6">
        <div className="bg-green-100 p-3 rounded-full mr-4">
          <Search className="text-green-600" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Document Search
        </h2>
      </div>

      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search documents (e.g., invoice, contract)"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="btn-primary px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            Search Results
          </h3>
          <ul className="space-y-4">
            {results.map((doc) => (
              <li 
                key={doc.file_id} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>File ID:</strong> {doc.file_id}
                    </p>
                    <p className="text-gray-800 mb-2 line-clamp-2">
                      {doc.ocr_text.substring(0, 200)}...
                    </p>
                  </div>
                  <a 
                    href={doc.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    View Document
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
