import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

const UploadComponent = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    
    setUploadStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.2;
      setUploadStatus(success ? 'success' : 'error');
      
      if (success) {
        setTimeout(() => {
          setFiles([]);
          setUploadStatus('idle');
        }, 2000);
      }
    }, 1500);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">Upload Legal Documents</h3>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
          isDragging 
            ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-100' 
            : 'border-slate-200 hover:border-sky-400 hover:bg-slate-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <Upload className={`h-12 w-12 ${isDragging ? 'text-sky-500' : 'text-slate-300'} mb-4 animate-bounce`} />
          <p className="text-lg font-medium text-slate-700 mb-2">Drag and drop your files here</p>
          <p className="text-sm text-slate-500 mb-4">or</p>
          <button 
            onClick={openFileDialog}
            className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors shadow-sm font-medium"
          >
            Browse Files
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            multiple 
            onChange={handleFileInputChange}
          />
          <p className="text-xs text-slate-500 mt-4">
            Supported formats: PDF, DOCX, TXT, RTF (Max 10MB per file)
          </p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-slate-900">Selected Files ({files.length})</h4>
            <button 
              onClick={() => setFiles([])}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200"
              >
                <div className="flex items-center">
                  <div className="bg-slate-100 p-2 rounded mr-3">
                    <File className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button 
              onClick={handleUpload}
              disabled={uploadStatus === 'uploading'}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                uploadStatus === 'uploading' 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-sky-500 text-white hover:bg-sky-600'
              }`}
            >
              {uploadStatus === 'idle' && 'Upload Files'}
              {uploadStatus === 'uploading' && 'Uploading...'}
              {uploadStatus === 'success' && 'Upload Successful!'}
              {uploadStatus === 'error' && 'Upload Failed - Try Again'}
            </button>
          </div>
          
          {uploadStatus === 'uploading' && (
            <div className="mt-4">
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-sky-500 h-2.5 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="mt-4 flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>All files uploaded successfully!</span>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <div className="mt-4 flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>There was an error uploading your files. Please try again.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadComponent;