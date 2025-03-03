import React from 'react';
import DocumentUpload from './DocumentUpload';

const DocumentAnalysisContainer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Document Analysis</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your legal documents to extract and analyze text using our advanced OCR technology.
          Get insights and summaries in seconds.
        </p>
      </div>
      
      <DocumentUpload />
    </div>
  );
};

export default DocumentAnalysisContainer;
