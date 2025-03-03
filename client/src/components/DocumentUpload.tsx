import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import '../index.css';

// Define interface for upload response
interface UploadResponse {
  fileUrl?: string;
  ocrText?: string;
  error?: string;
}

const UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT || 'http://localhost:8080/upload';

const DocumentUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse>({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const removeButtonRef = useRef<HTMLButtonElement>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('File change event triggered', files);

    if (files && files.length > 0) {
      const file = files[0];
      console.log('Selected file:', file);
      
      setSelectedFile(file);
      setUploadResponse({});
    }
  };

  const handleUpload = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log('Upload button clicked');
    console.log('Selected file:', selectedFile);
    
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
    setUploadResponse({});

    try {
      console.log('Sending request to:', UPLOAD_ENDPOINT);
      const response = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful, result:', result);
      
      setUploadResponse({
        fileUrl: result.fileUrl,
        ocrText: result.ocrText || 'No text extracted',
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResponse({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="bg-gradient-to-r from-green-500 to-indigo-500 p-6 flex items-center">
        <div className="bg-white/20 p-3 rounded-full mr-4">
          <FileText className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Document OCR Extractor
        </h2>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="border-2 border-dashed rounded-xl p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Upload size={28} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700">
                {selectedFile ? selectedFile.name : 'Upload your document'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {selectedFile 
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB - ${selectedFile.type}` 
                  : 'Supports PDF, JPG, PNG, TIFF (max 10MB)'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.tiff"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Upload document"
                  id="file-upload-input"
                />
                <button 
                  className="btn-secondary py-2 px-4 rounded-lg cursor-pointer relative z-0"
                  type="button"
                >
                  Browse Files
                </button>
              </div>
              
              {selectedFile && (
                <div className="relative">
                  <button 
                    ref={removeButtonRef}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center relative z-0"
                    type="button"
                  >
                    <X size={20} className="mr-1" />
                    Remove
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadResponse({});
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute inset-0 z-10 opacity-0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center relative">
          <button 
            ref={uploadButtonRef}
            disabled={!selectedFile || isLoading}
            className="btn-primary flex items-center space-x-2 px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed relative z-0"
            type="button"
          >
            {isLoading ? (
              <>
                <Upload size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span>Upload Document</span>
              </>
            )}
          </button>
          <button
            onClick={handleUpload}
            className="absolute inset-0 z-10 opacity-0"
            disabled={!selectedFile || isLoading}
          />
        </div>

        {uploadResponse.error && (
          <div className="text-red-500 text-center mt-4">
            {uploadResponse.error}
          </div>
        )}

        {uploadResponse.ocrText && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Extracted Text:</h3>
            <p className="whitespace-pre-wrap break-words">
              {uploadResponse.ocrText}
            </p>
            {uploadResponse.fileUrl && (
              <a 
                href={uploadResponse.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block mt-2 underline text-blue-600 hover:text-blue-800"
              >
                View Original Document
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;