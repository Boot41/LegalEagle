import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, AlertTriangle } from 'lucide-react';
import '../index.css';

// Define interface for upload response
interface UploadResponse {
  fileUrl?: string;
  fileId?: string;
  ocrText?: string;
  complianceResults?: string;
  riskScore?: number;
  error?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

// Define prop types
interface DocumentUploadProps {
  onUpload?: (text: string, uploadResponse: UploadResponse) => void;
  icon?: React.ReactNode;
  title?: string;
}

const UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT || 'http://localhost:8080/upload';
const UPLOAD_TIMEOUT = 120000; // 2 minutes timeout
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000; // 1 second
const MAX_CONCURRENT_UPLOADS = 3; // Limit concurrent uploads

// Singleton upload queue manager
class UploadQueueManager {
  private static instance: UploadQueueManager;
  private activeUploads: number = 0;
  private queue: (() => Promise<void>)[] = [];

  private constructor() {}

  public static getInstance(): UploadQueueManager {
    if (!UploadQueueManager.instance) {
      UploadQueueManager.instance = new UploadQueueManager();
    }
    return UploadQueueManager.instance;
  }

  public async enqueue(uploadFn: () => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      const wrappedUpload = async () => {
        try {
          await uploadFn();
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          this.activeUploads--;
          this.processQueue();
        }
      };

      if (this.activeUploads < MAX_CONCURRENT_UPLOADS) {
        this.activeUploads++;
        wrappedUpload();
      } else {
        this.queue.push(wrappedUpload);
      }
    });
  }

  private processQueue() {
    while (this.activeUploads < MAX_CONCURRENT_UPLOADS && this.queue.length > 0) {
      const nextUpload = this.queue.shift();
      if (nextUpload) {
        this.activeUploads++;
        nextUpload();
      }
    }
  }
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onUpload, 
  icon, 
  title = 'Document OCR Extractor' 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse>({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadQueueManager = UploadQueueManager.getInstance();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('File change event triggered', files);

    if (files && files.length > 0) {
      const file = files[0];
      console.log('Selected file details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      // Validate file size (10MB limit)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        console.error('File size validation failed', {
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE
        });
        setUploadResponse({
          error: 'File is too large. Maximum file size is 10MB.'
        });
        return;
      }

      // Validate file type
      const ALLOWED_TYPES = [
        'application/pdf', 
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'image/tiff'
      ];
      if (!ALLOWED_TYPES.includes(file.type)) {
        console.error('File type validation failed', {
          fileType: file.type,
          allowedTypes: ALLOWED_TYPES
        });
        setUploadResponse({
          error: 'Invalid file type. Supported types: PDF, JPG, PNG, GIF, TIFF'
        });
        return;
      }

      setSelectedFile(file);
      setUploadResponse({});
    }
  };

  const handleUpload = useCallback(async () => {
    console.log('Upload process started');
    
    if (!selectedFile) {
      console.error('No file selected for upload');
      setUploadResponse({ error: 'Please select a file first' });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
    setUploadResponse({});

    try {
      await uploadQueueManager.enqueue(async () => {
        // Create an AbortController to manage request timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.warn('Upload operation timed out');
          controller.abort();
        }, UPLOAD_TIMEOUT);

        try {
          console.log('Sending upload request', {
            endpoint: UPLOAD_ENDPOINT,
            fileDetails: {
              name: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size
            }
          });

          const response = await fetch(UPLOAD_ENDPOINT, {
            method: 'POST',
            body: formData,
            signal: controller.signal
          });

          // Clear the timeout
          clearTimeout(timeoutId);

          console.log('Upload response received', {
            status: response.status,
            statusText: response.statusText
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed', {
              status: response.status,
              errorText: errorText
            });
            
            // Specific handling for 403 Forbidden
            if (response.status === 403) {
              throw new Error('Concurrent upload limit reached. Please wait and try again.');
            }
            
            throw new Error(`Upload failed: ${errorText || response.statusText}`);
          }

          const result = await response.json();
          console.log('Full upload response:', result);
          console.log('Response keys:', Object.keys(result));
          
          // Comprehensive error checking
          if (!result.fileURL) {
            console.error('Missing fileURL in upload response', result);
            setUploadResponse({ 
              error: 'Upload failed: No file URL received' 
            });
            return;
          }

          const uploadResult: UploadResponse = {
            fileUrl: result.fileURL,
            fileId: result.fileID,
            ocrText: result.ocrText || 'No text extracted',
            complianceResults: result.complianceResults,
            riskScore: result.riskScore,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            fileSize: selectedFile.size
          };
          console.log('Parsed upload result:', uploadResult);

          setUploadResponse(uploadResult);
          
          // Call onUpload callback if provided
          if (onUpload && uploadResult.ocrText) {
            console.log('Calling onUpload callback');
            onUpload(uploadResult.ocrText, uploadResult);
          }
        } catch (error) {
          // Handle fetch-specific errors
          if (error instanceof DOMException && error.name === 'AbortError') {
            console.error('Upload timed out');
            throw new Error('Upload timed out. Please try again.');
          }
          console.error('Fetch error details:', error);
          throw error;
        }
      });
    } catch (error) {
      console.error('Complete upload error:', error);
      const errorResponse: UploadResponse = { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred during upload' 
      };
      setUploadResponse(errorResponse);

      // Call onUpload with error if needed
      if (onUpload) {
        onUpload('', errorResponse);
      }
    } finally {
      console.log('Upload process completed');
      setIsLoading(false);
    }
  }, [selectedFile, onUpload]);

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadResponse({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-card w-full max-w-4xl mx-auto rounded-3xl overflow-hidden">
      <div className="p-8 space-y-6 w-full">
        <div className="border-2 border-dashed rounded-xl p-8 text-center max-w-3xl mx-auto">
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
                  : 'Supports PDF, JPG, PNG, GIF, TIFF (max 10MB)'}
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
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center relative z-0"
                    type="button"
                    onClick={handleRemoveFile}
                  >
                    <X size={20} className="mr-1" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center relative max-w-3xl mx-auto">
          <button 
            onClick={handleUpload}
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
        </div>

        {uploadResponse.error && (
          <div className="text-red-500 text-center mt-4 flex items-center justify-center space-x-2 max-w-3xl mx-auto">
            <AlertTriangle className="text-red-500" size={20} />
            <span>{uploadResponse.error}</span>
          </div>
        )}

        {uploadResponse.ocrText && (
          <div className="
            mt-4 
            p-6 
            bg-[#1C1C1C] 
            border 
            border-gray-800 
            rounded-2xl 
            shadow-lg 
            transition-all 
            hover:border-green-500/30
            max-w-4xl
            mx-auto
          ">
            <div className="flex items-center space-x-4 mb-4">
              <div className="
                w-12 
                h-12 
                rounded-xl 
                bg-gradient-to-br 
                from-green-500 
                to-blue-500 
                flex 
                items-center 
                justify-center 
                text-white
              ">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Extracted Document Text
              </h3>
            </div>
            
            <div className="
              bg-[#121212] 
              border 
              border-gray-800 
              rounded-lg 
              p-4 
              max-h-64 
              overflow-y-auto 
              text-gray-300 
              leading-relaxed 
              tracking-wide
            ">
              <p className="whitespace-pre-wrap break-words">
                {uploadResponse.ocrText}
              </p>
            </div>

            {uploadResponse.complianceResults && (
              <div className="mt-4">
                <h3 className="text-lg font-bold text-white">
                  Compliance Results
                </h3>
                <p className="text-gray-300">
                  {uploadResponse.complianceResults}
                </p>
              </div>
            )}

            {uploadResponse.riskScore !== undefined && (
              <div className="mt-4">
                <h3 className="text-lg font-bold text-white">
                  Risk Score
                </h3>
                <p className="text-gray-300">
                  {uploadResponse.riskScore}
                </p>
              </div>
            )}

            {uploadResponse.fileUrl && (
              <div className="mt-4 flex justify-end">
                <a 
                  href={uploadResponse.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="
                    inline-flex 
                    items-center 
                    space-x-2 
                    px-4 
                    py-2 
                    bg-gradient-to-r 
                    from-green-500/20 
                    to-blue-500/20 
                    text-white 
                    rounded-lg 
                    hover:from-green-500/30 
                    hover:to-blue-500/30 
                    transition-all
                  "
                >
                  <Upload size={16} />
                  <span>View Original Document</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;