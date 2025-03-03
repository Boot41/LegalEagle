import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, HelpCircle, FileCheck, Upload, Zap, X, FileSearch } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import DocumentAnalysisContainer from './DocumentAnalysisContainer';
import AIDocumentInsights from './AIDocumentInsights';

// Define the type for uploaded documents
interface UploadedDocument {
  id?: string;
  name: string;
  type: string;
  size: number;
  path?: string;
  uploadedAt?: Date;
}

const DocumentAnalysisPage: React.FC = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [activeView, setActiveView] = useState<'upload' | 'analysis' | 'insights'>('upload');
  const [uploadedText, setUploadedText] = useState<string>('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isDocumentInfoModalOpen, setIsDocumentInfoModalOpen] = useState(false);

  const handleDocumentUpload = (ocrText: string, uploadResponse: any) => {
    // Create an UploadedDocument object from the upload response
    const newDocument: UploadedDocument = {
      id: uploadResponse.fileId,
      name: uploadResponse.fileName || 'Uploaded Document',
      type: uploadResponse.fileType || 'unknown',
      size: uploadResponse.fileSize || 0,
      path: uploadResponse.fileUrl,
      uploadedAt: new Date()
    };

    // Update the list of uploaded documents
    setUploadedDocuments(prevDocuments => [...prevDocuments, newDocument]);

    // Set the OCR text and switch to analysis view
    setUploadedText(ocrText);
    setActiveView('analysis');
  };

  const handleNewUpload = () => {
    setActiveView('upload');
    setUploadedText('');
  };

  const DocumentInfoModal = () => (
    <AnimatePresence>
      {isDocumentInfoModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsDocumentInfoModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1C1C1C] 
              rounded-2xl 
              border border-gray-800 
              max-w-2xl 
              w-full 
              p-8 
              relative 
              max-h-[80vh] 
              overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsDocumentInfoModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-[#3ECF8E] mb-6 flex items-center">
              <FileText className="mr-4 w-10 h-10" />
              Document Processing Guidelines
            </h2>

            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  Supported File Formats
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>PDF (Portable Document Format)</li>
                  <li>JPEG/JPG (Image files)</li>
                  <li>PNG (Portable Network Graphics)</li>
                  <li>GIF (Graphics Interchange Format)</li>
                  <li>TIFF (Tagged Image File Format)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  File Size Limitations
                </h3>
                <p>
                  Maximum file size: 10 MB
                  Larger files may cause processing delays or errors.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  Text Extraction Capabilities
                </h3>
                <p>
                  Our AI can extract text from various document types, 
                  including scanned documents and images with clear text.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const HelpModal = () => (
    <AnimatePresence>
      {isHelpModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsHelpModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1C1C1C] 
              rounded-2xl 
              border border-gray-800 
              max-w-2xl 
              w-full 
              p-8 
              relative 
              max-h-[80vh] 
              overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsHelpModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-[#3ECF8E] mb-6">
              Document Intelligence Guide
            </h2>

            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  Supported Document Types
                </h3>
                <p>
                  We support PDF, JPG, PNG, GIF, and TIFF files up to 10MB in size. 
                  Our AI can extract text and analyze document contents intelligently.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  How It Works
                </h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Upload your document</li>
                  <li>Our AI processes the document</li>
                  <li>View detailed insights and analysis</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  Privacy & Security
                </h3>
                <p>
                  All uploaded documents are processed securely and are not stored 
                  permanently. Your data privacy is our top priority.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="w-full space-y-10 relative">
      {/* Help Modal */}
      <HelpModal />
      
      {/* Document Info Modal */}
      <DocumentInfoModal />

      {/* Heading Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 25px 50px -12px rgba(62, 207, 142, 0.3)"
        }}
        className="bg-[#1C1C1C] 
          rounded-2xl 
          overflow-hidden 
          border border-gray-900 
          transition-all duration-300 
          hover:border-[#3ECF8E]
          grid grid-cols-1 md:grid-cols-2
          gap-8
          p-8"
      >
        <div className="flex flex-col justify-center space-y-6">
          <motion.h1 
            className="text-5xl font-black 
              bg-gradient-to-br from-[#3ECF8E] to-[#7EDCB5] 
              bg-clip-text text-transparent
              tracking-tighter
              font-['Clash_Display', 'Inter', 'system-ui']
              drop-shadow-[0_5px_5px_rgba(62,207,142,0.2)]
              uppercase
              leading-[1.1]"
          >
            Document Intelligence
          </motion.h1>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            Transform your documents with AI-powered analysis. 
            Upload, analyze, and gain actionable insights instantly 
            with our advanced document intelligence platform.
          </p>
          
          <div className="flex flex-wrap gap-3 items-center">
            <button 
              onClick={() => setActiveView('upload')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2
                ${activeView === 'upload' 
                  ? 'bg-[#3ECF8E] text-white hover:bg-[#4ADBA2]' 
                  : 'bg-[#1C1C1C] text-[#3ECF8E] border border-[#3ECF8E] hover:bg-[#3ECF8E]/10'
                }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload Document</span>
            </button>
            
            <button 
              onClick={() => setActiveView('insights')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2
                ${!uploadedText ? 'opacity-50 cursor-not-allowed' : ''}
                ${activeView === 'insights' 
                  ? 'bg-[#3ECF8E] text-white hover:bg-[#4ADBA2]' 
                  : 'bg-[#1C1C1C] text-[#3ECF8E] border border-[#3ECF8E] hover:bg-[#3ECF8E]/10'
                }`}
              disabled={!uploadedText}
            >
              <Zap className="w-5 h-5" />
              <span>AI Insights</span>
            </button>

            <button 
              onClick={() => setActiveView('analysis')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2
                ${!uploadedText ? 'opacity-50 cursor-not-allowed' : ''}
                ${activeView === 'analysis' 
                  ? 'bg-[#3ECF8E] text-white hover:bg-[#4ADBA2]' 
                  : 'bg-[#1C1C1C] text-[#3ECF8E] border border-[#3ECF8E] hover:bg-[#3ECF8E]/10'
                }`}
              disabled={!uploadedText}
            >
              <FileSearch className="w-5 h-5" />
              <span>Document Analysis</span>
            </button>

            <div className="flex space-x-2">
              <button 
                onClick={() => setIsHelpModalOpen(true)}
                className="text-[#3ECF8E] hover:bg-[#3ECF8E]/10 
                p-2 rounded-full 
                transition-all duration-300"
                title="Help and Information"
              >
                <HelpCircle className="w-6 h-6" />
              </button>

              <button 
                onClick={() => setIsDocumentInfoModalOpen(true)}
                className="text-[#3ECF8E] hover:bg-[#3ECF8E]/10 
                p-2 rounded-full 
                transition-all duration-300"
                title="Document Processing Guidelines"
              >
                <FileText className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ 
              rotate: [0, 5, -5, 0],
              transition: { 
                duration: 5, 
                repeat: Infinity, 
                repeatType: "loop" 
              }
            }}
            className="w-full max-w-[300px] aspect-square 
            bg-gradient-to-br from-[#3ECF8E]/20 to-[#7EDCB5]/20 
            rounded-2xl 
            flex items-center justify-center"
          >
            <FileCheck className="w-32 h-32 text-[#3ECF8E] opacity-70" />
          </motion.div>
        </div>
      </motion.div>

      {/* Dynamic Content Area */}
      <div className="glass-card p-6 rounded-xl border border-gray-800">
        {activeView === 'upload' ? (
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
              <div className="
                w-10 
                h-10 
                rounded-xl 
                bg-gradient-to-br 
                from-green-500 
                to-blue-500 
                flex 
                items-center 
                justify-center 
                text-white 
                mr-3
              ">
                <Upload size={20} />
              </div>
              Upload New Document
            </h2>
            <p className="text-gray-400 mb-8">
              Upload your legal documents for AI-powered analysis and insights. We support PDF, JPEG, PNG, and other common formats.
            </p>
            <DocumentUpload 
              onUpload={(ocrText, uploadResponse) => handleDocumentUpload(ocrText, uploadResponse)} 
              title="Upload Document for Analysis" 
            />
          </div>
        ) : activeView === 'insights' ? (
          <AIDocumentInsights 
            documents={uploadedDocuments}
          />
        ) : (
          <DocumentAnalysisContainer 
            ocrText={uploadedText} 
            onNewUpload={handleNewUpload}
            uploadedDocuments={uploadedDocuments}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentAnalysisPage;
