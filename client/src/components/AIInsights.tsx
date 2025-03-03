import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Loader2, 
  AlertTriangle, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

// Interface defining the props for AIInsights component
interface AIInsightsProps {
  documentText: string;
  icon?: React.ReactNode;
  title: string;
}

// Interface for insight sections
interface InsightSection {
  title: string;
  content: string;
  expanded?: boolean;
}

// Default insights text when no document is analyzed
const DEFAULT_INSIGHTS = `## AI-Powered Legal Insights

- **Instant Document Analysis**: Leverage cutting-edge AI to extract critical insights from your legal documents
- **Comprehensive Coverage**: Analyze contracts, agreements, and legal texts with unprecedented accuracy
- **Actionable Intelligence**: Transform complex legal text into clear, actionable recommendations

*Upload a document to get personalized, in-depth legal insights.*`;

// AIInsights component for generating AI-powered document insights
const AIInsights: React.FC<AIInsightsProps> = ({ 
  documentText, 
  icon, 
  title 
}) => {
  // State management for insights, loading, and error handling
  const [insights, setInsights] = useState<string>(DEFAULT_INSIGHTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [insightSections, setInsightSections] = useState<InsightSection[]>([]);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  // Effect to generate insights when document text changes
  useEffect(() => {
    const generateInsights = async () => {
      // Only generate insights if document text is not empty
      if (!documentText.trim()) {
        setInsights(DEFAULT_INSIGHTS);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Validate Groq API key
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) {
          throw new Error('Groq API Key is missing. Please check your environment configuration.');
        }

        // API request to generate insights
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192', // Groq's Llama 3 model
            messages: [
              {
                role: 'system',
                content: `You are an expert legal document analyst. 
                Provide a highly structured and concise analysis of the document. 
                Follow these strict guidelines:
                1. Use a clear, professional tone
                2. Organize insights into maximum 3-4 key points
                3. Use markdown formatting for readability
                4. Highlight critical information
                5. Avoid unnecessary legal jargon
                6. Focus on practical implications`
              },
              {
                role: 'user',
                content: `Analyze the following legal document and provide a structured, concise summary:

Document Content:
${documentText}

Required Output Format:
## Key Insights
- **Headline Insight 1**: Brief, impactful description
- **Headline Insight 2**: Brief, impactful description
- **Potential Implications**: Concise list of actionable insights

Emphasize clarity, brevity, and practical understanding.`
              }
            ],
            max_tokens: 350,
            temperature: 0.6,
            top_p: 1,
            stream: false
          })
        });

        // Handle API response errors
        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Full error response:', errorBody);
          throw new Error(`Failed to generate insights: ${errorBody}`);
        }

        // Extract and set insights from API response
        const data = await response.json();
        const generatedInsights = data.choices[0]?.message?.content?.trim() || 'No insights generated.';
        
        setInsights(generatedInsights);
        
        // Parse insights into sections
        const sections = parseInsightsIntoSections(generatedInsights);
        setInsightSections(sections);
      } catch (err) {
        // Error handling
        console.error('Error generating AI insights:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate AI insights. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  }, [documentText]);

  // Parse insights text into structured sections
  const parseInsightsIntoSections = (text: string): InsightSection[] => {
    const sections: InsightSection[] = [];
    
    // Split by markdown headers
    const lines = text.split('\n');
    let currentTitle = '';
    let currentContent = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if line is a header
      if (line.startsWith('##')) {
        // If we already have content, save the previous section
        if (currentTitle) {
          sections.push({
            title: currentTitle,
            content: currentContent.trim(),
            expanded: false
          });
        }
        
        // Start a new section
        currentTitle = line.replace(/^##\s*/, '').trim();
        currentContent = '';
      } else if (line.startsWith('#')) {
        // Main title, skip
        continue;
      } else {
        // Add to current content
        currentContent += line + '\n';
      }
    }
    
    // Add the last section
    if (currentTitle) {
      sections.push({
        title: currentTitle,
        content: currentContent.trim(),
        expanded: false
      });
    }
    
    // If no sections were found, create a default one
    if (sections.length === 0) {
      sections.push({
        title: 'Document Analysis',
        content: text,
        expanded: false
      });
    }
    
    return sections;
  };
  
  // Toggle section expansion
  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  // Render component with insights, loading state, and error handling
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        bg-[#1C1C1C] 
        border 
        border-gray-800 
        rounded-2xl 
        p-6 
        space-y-4
      "
    >
      {/* Component header with icon and title */}
      <div className="flex items-center space-x-4">
        {icon || (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="
              w-12 
              h-12 
              rounded-xl 
              bg-gradient-to-br 
              from-purple-500 
              to-pink-500 
              flex 
              items-center 
              justify-center 
              text-white
            "
          >
            <Zap size={24} />
          </motion.div>
        )}
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      {/* Animated content area for insights, loading, and errors */}
      <AnimatePresence>
        {/* Loading state */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center space-x-3 text-gray-400"
          >
            <Loader2 className="animate-spin" />
            <span>Generating insights...</span>
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              flex 
              items-center 
              space-x-2 
              bg-red-900/20 
              border 
              border-red-900 
              text-red-400 
              px-4 
              py-2 
              rounded-lg
            "
          >
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Insights display */}
        {!isLoading && !error && insights && (
          <div className="space-y-4">
            {/* Summary view */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                bg-[#121212] 
                border 
                border-gray-800 
                rounded-lg 
                p-4 
                text-gray-300
              "
            >
              <div className="flex items-start space-x-3 mb-3">
                <Lightbulb className="text-yellow-400 flex-shrink-0 mt-1" />
                <div className="prose prose-invert">
                  {!showDetails && (
                    <div>
                      {insights.split('\n').slice(0, 5).map((line, index) => (
                        <p key={index} className={index >= 3 ? 'text-gray-500' : ''}>{line}</p>
                      ))}
                      {insights.split('\n').length > 5 && (
                        <p className="text-gray-500">...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* View details button */}
              <div className="flex justify-end mt-2">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center space-x-1 text-[#3ECF8E] hover:text-[#4ADBA2] transition-colors text-sm font-medium"
                >
                  <span>{showDetails ? 'Hide Details' : 'View Details'}</span>
                  {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </motion.div>
            
            {/* Detailed view */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Expandable sections */}
                  <div className="space-y-3">
                    {insightSections.map((section, index) => (
                      <div 
                        key={index}
                        className="bg-[#1A1A1A] border border-gray-800 rounded-lg overflow-hidden"
                      >
                        {/* Section header */}
                        <button
                          onClick={() => toggleSection(index)}
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-[#222] transition-colors"
                        >
                          <h4 className="font-medium text-white flex items-center">
                            <span className="w-6 h-6 rounded-full bg-[#3ECF8E] flex items-center justify-center text-black mr-2">
                              {index + 1}
                            </span>
                            {section.title}
                          </h4>
                          {expandedSection === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        
                        {/* Section content */}
                        <AnimatePresence>
                          {expandedSection === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 border-t border-gray-800 prose prose-invert max-w-none">
                                {section.content.split('\n').map((line, lineIndex) => (
                                  <p key={lineIndex}>{line}</p>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                  
                  {/* Additional actions */}
                  <div className="flex justify-end mt-4 space-x-3">
                    <button 
                      className="flex items-center space-x-1 text-white bg-[#3ECF8E] hover:bg-[#4ADBA2] px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      onClick={() => {
                        // Example action - could be expanded to export as PDF, etc.
                        const blob = new Blob([insights], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'legal-document-insights.txt';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <ExternalLink size={16} />
                      <span>Export Insights</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIInsights;
