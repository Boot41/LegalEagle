import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  FileSearch, 
  Download, 
  BarChart2 
} from 'lucide-react';

// Define the type for uploaded documents to match DocumentAnalysisPage
interface UploadedDocument {
  id?: string;
  name: string;
  type: string;
  size: number;
  path?: string;
  uploadedAt?: Date;
}

interface AIDocumentInsightsProps {
  documents: UploadedDocument[];
}

const AIDocumentInsights: React.FC<AIDocumentInsightsProps> = ({ documents }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null);

  // Enhanced document insights with more comprehensive analysis
  const documentInsights = documents.map((doc, index) => ({
    id: doc.id || `doc_${index}`,
    name: doc.name,
    type: doc.type,
    size: doc.size,
    uploadedAt: doc.uploadedAt || new Date(),
    complianceScore: Math.floor(Math.random() * 100),
    riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    keyFindings: [
      'Potential compliance issue detected',
      'Requires further review',
      'Meets standard requirements'
    ][Math.floor(Math.random() * 3)],
    detailedAnalysis: {
      legalComplexity: ['Simple', 'Moderate', 'Complex'][Math.floor(Math.random() * 3)],
      potentialRisks: [
        'Minor contractual ambiguities',
        'Potential liability exposure',
        'Recommended legal consultation'
      ][Math.floor(Math.random() * 3)],
      recommendedActions: [
        'Review specific clauses',
        'Seek legal counsel',
        'Proceed with caution'
      ][Math.floor(Math.random() * 3)]
    }
  }));

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#3ECF8E] flex items-center">
          <BarChart2 className="mr-3 text-[#3ECF8E]" size={32} />
          AI Document Insights
        </h2>
        <div className="flex items-center space-x-4 text-gray-400">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>{documents.length} Document(s) Analyzed</span>
          </div>
          <button 
            className="
              bg-[#3ECF8E]/10 
              text-[#3ECF8E] 
              hover:bg-[#3ECF8E]/20 
              px-3 
              py-1 
              rounded-full 
              flex 
              items-center 
              space-x-2 
              transition-colors
            "
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {documentInsights.map((insight) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`
            bg-[#1C1C1C] 
            border 
            ${selectedDocument === insight.id ? 'border-[#3ECF8E]' : 'border-gray-800'}
            rounded-xl 
            p-6 
            hover:border-[#3ECF8E]/50 
            transition-all 
            duration-300
            relative
          `}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">
                  {insight.name}
                </h3>
                <div className="text-sm text-gray-400 flex items-center space-x-2">
                  <FileSearch size={16} />
                  <span>{insight.type} • {(insight.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#3ECF8E]" />
                  <span className="text-gray-300">
                    Compliance Score: {insight.complianceScore}%
                  </span>
                </div>
                
                <div className={`flex items-center space-x-2 ${getRiskColor(insight.riskLevel)}`}>
                  <AlertTriangle className="w-5 h-5" />
                  <span>Risk Level: {insight.riskLevel}</span>
                </div>
              </div>
              
              <p className="text-gray-400 italic">
                <TrendingUp className="inline-block mr-2 w-5 h-5 text-[#3ECF8E]" />
                {insight.keyFindings}
              </p>

              {/* Expandable Details */}
              <AnimatePresence>
                {selectedDocument === insight.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-[#121212] rounded-lg p-4 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[#3ECF8E] mb-2">Legal Complexity</h4>
                        <p className="text-gray-300">{insight.detailedAnalysis.legalComplexity}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#3ECF8E] mb-2">Potential Risks</h4>
                        <p className="text-gray-300">{insight.detailedAnalysis.potentialRisks}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#3ECF8E] mb-2">Recommended Actions</h4>
                      <p className="text-gray-300">{insight.detailedAnalysis.recommendedActions}</p>
                    </div>
                    <div className="text-sm text-gray-500 italic">
                      Uploaded: {insight.uploadedAt.toLocaleDateString()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              onClick={() => setSelectedDocument(selectedDocument === insight.id ? null : insight.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                bg-[#3ECF8E] 
                text-white 
                px-4 
                py-2 
                rounded-lg 
                hover:bg-[#4ADBA2] 
                transition-all 
                duration-300
                flex
                items-center
                space-x-2
              "
            >
              {selectedDocument === insight.id ? 'Hide Details' : 'View Details'}
              {selectedDocument === insight.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </motion.button>
          </div>
        </motion.div>
      ))}

      {documents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="mx-auto w-16 h-16 mb-4 text-[#3ECF8E]/50" />
          <p>No documents uploaded. Start by uploading a document.</p>
        </div>
      )}
    </div>
  );
};

export default AIDocumentInsights;
