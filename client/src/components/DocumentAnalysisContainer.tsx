import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import AIInsights from './AIInsights';

// Define the type for uploaded documents
interface UploadedDocument {
  id?: string;
  name: string;
  type: string;
  size: number;
  path?: string;
  uploadedAt?: Date;
  complianceStatus?: string;
}

// Define prop types for DocumentAnalysisContainer
interface DocumentAnalysisContainerProps {
  ocrText: string;
  onNewUpload: () => void;
  uploadedDocuments: UploadedDocument[];
}

// Compliance color utility function
const getComplianceColor = (status: string): string => {
  switch(status?.toLowerCase()) {
    case 'pass': return 'text-green-500 bg-green-900 bg-opacity-20';
    case 'fail': return 'text-red-500 bg-red-900 bg-opacity-20';
    case 'warning': return 'text-yellow-500 bg-yellow-900 bg-opacity-20';
    default: return 'text-gray-500 bg-gray-900 bg-opacity-20';
  }
};

const appleScrollVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      duration: 0.8
    }
  },
  exit: { 
    opacity: 0.3, 
    y: 20,
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      duration: 0.8
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      duration: 0.8
    }
  },
  exit: { 
    opacity: 0.3, 
    y: 20,
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      duration: 0.8
    }
  }
};

const DocumentAnalysisContainer: React.FC<DocumentAnalysisContainerProps> = ({ 
  ocrText, 
  onNewUpload, 
  uploadedDocuments 
}) => {
  const [documentText, setDocumentText] = useState(ocrText);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);

  // Update documentText when ocrText prop changes
  useEffect(() => {
    setDocumentText(ocrText);
  }, [ocrText]);

  // Handle document navigation
  const navigateToNextDocument = () => {
    if (selectedDocumentIndex < uploadedDocuments.length - 1) {
      setSelectedDocumentIndex(prev => prev + 1);
    }
  };

  const navigateToPreviousDocument = () => {
    if (selectedDocumentIndex > 0) {
      setSelectedDocumentIndex(prev => prev - 1);
    }
  };

  // Get the currently selected document
  const currentDocument = uploadedDocuments[selectedDocumentIndex];

  return (
    <motion.div 
      variants={appleScrollVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ amount: 0.1 }}
      className="w-full bg-[#1C1C1C] text-white py-20 px-4 md:px-8 lg:px-16 rounded-3xl"
    >
      <div className="w-full max-w-7xl mx-auto">
        <motion.div 
          variants={itemVariants}
          className="
            bg-[#2C2C2C] 
            rounded-3xl 
            p-10 
            border 
            border-gray-800 
            hover:border-purple-500/50 
            transition-all 
            duration-300 
            ease-in-out 
            transform 
            hover:-translate-y-2 
            hover:shadow-2xl
            group
          "
        >
          <div className="flex items-center justify-between mb-8">
            <div className="
              w-20 
              h-20 
              rounded-2xl 
              bg-gradient-to-br 
              from-purple-500 
              to-pink-500 
              flex 
              items-center 
              justify-center 
              text-white 
              group-hover:scale-110 
              transition-transform 
              duration-300
            ">
              <Zap size={40} />
            </div>
          </div>
          
          <h3 className="text-3xl font-bold mb-4 text-white">
            AI-Powered Insights
          </h3>
          
          <p className="text-gray-400 mb-6">
            Get instant, comprehensive legal insights with our cutting-edge artificial intelligence.
          </p>

          <AIInsights 
            documentText={documentText}
            title="AI-Powered Insights"
            icon={
              <div className="
                w-16 
                h-16 
                rounded-2xl 
                bg-gradient-to-br 
                from-purple-500 
                to-pink-500 
                flex 
                items-center 
                justify-center 
                text-white 
                group-hover:scale-105 
                transition-transform
              ">
                <Zap size={32} />
              </div>
            }
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DocumentAnalysisContainer;
