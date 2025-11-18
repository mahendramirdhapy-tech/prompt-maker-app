// pages/index.js - SIMPLIFIED VERSION
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Basic SEO data
  const pageTitle = "AI Prompt Maker - Free AI Prompt Generator Tool";
  const pageDescription = "Transform your ideas into perfect AI prompts";

  // Client-side only effects
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Set initial dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOutput(`Generated prompt for: ${input}`);
      setLoading(false);
    }, 2000);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Basic styles
  const containerStyle = {
    fontFamily: "'Inter', sans-serif",
    maxWidth: '100%',
    margin: '0 auto',
    padding: isMobile ? '12px' : '24px',
    minHeight: '100vh',
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
  };

  const cardStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: isMobile ? '16px' : '20px',
    marginBottom: '16px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    fontSize: '16px',
    marginBottom: '12px',
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={containerStyle}>
        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '20px 0', marginBottom: '20px' }}>
          <h1 style={{ 
            fontSize: isMobile ? '1.8rem' : '2.5rem', 
            color: '#3b82f6',
            margin: '0 0 8px 0'
          }}>
            AI Prompt Maker
          </h1>
          <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', margin: 0 }}>
            Transform your ideas into perfect AI prompts
          </p>
          <button 
            onClick={toggleDarkMode}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: darkMode ? '#4b5563' : '#e5e7eb',
              color: darkMode ? '#f9fafb' : '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>

        {/* MAIN CONTENT */}
        <main>
          <div style={cardStyle}>
            <h2>💡 Your Idea</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you want to create..."
                rows={4}
                style={{...inputStyle, minHeight: '100px'}}
                required
              />
              
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: loading ? '#9ca3af' : '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '⚡ Generating...' : '✨ Generate AI Prompt'}
              </button>
            </form>
          </div>

          {output && (
            <div style={cardStyle}>
              <h2>🎉 Your AI Prompt</h2>
              <div style={{
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {output}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
