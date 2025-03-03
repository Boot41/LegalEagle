import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      style={{
        backgroundColor: '#FFD700', // Bright yellow
        color: 'black',
        width: '100%',  // Explicitly set width to 100%
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'  // Ensure padding doesn't increase total width
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 
          style={{
            fontSize: '4rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            width: '100%',
            textAlign: 'center'
          }}
        >
          Legal Eagle
        </h1>
        
        <p 
          style={{
            fontSize: '1.5rem', 
            fontWeight: '600',
            marginBottom: '2rem',
            width: '100%',
            textAlign: 'center'
          }}
        >
          Simplifying Legal Document Management
        </p>
      </motion.div>

      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 
            style={{
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              marginTop: '3rem',
              width: '100%',
              textAlign: 'center'
            }}
          >
            Key Features
          </h2>
          <ul 
            style={{
              listStyleType: 'none', 
              padding: 0,
              fontSize: '1.2rem',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <li>📄 Intelligent Document Parsing</li>
            <li>🔍 Advanced Search Capabilities</li>
            <li>🔒 Secure Document Management</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage;
