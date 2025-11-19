// pages/seo.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdsComponent from '../components/AdsComponent';

export default function SeoGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Please enter a topic or title to generate SEO description');
      return;
    }
    
    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: `Generate a compelling SEO meta description (150-160 characters) for: "${input}". Make it engaging, include relevant keywords, and encourage clicks. Focus on benefits and value proposition.`,
          language: 'English',
          tone: 'Professional',
          maxTokens: 100,
          type: 'prompt'
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        const description = data.prompt || data.result || '';
        setOutput(description);
        setCharCount(description.length);
      } else {
        alert('❌ ' + (data.error || 'Failed to generate SEO description'));
      }
    } catch (e) {
      console.error('SEO generation error:', e);
      alert('⚠️ ' + (e.message || 'Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => {
    setInput('');
    setOutput('');
    setCharCount(0);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('✅ SEO description copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <>
      <Head>
        <title>SEO Meta Description Generator | Free AI-Powered Tool</title>
        <meta 
          name="description" 
          content="Generate compelling SEO meta descriptions instantly. Free AI-powered tool for creating search-engine-optimized meta descriptions that boost click-through rates." 
        />
        <meta 
          name="keywords" 
          content="seo meta description generator, meta description creator, seo tool, search engine optimization, meta tag generator, free seo tool" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Your Company Name" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="SEO Meta Description Generator | Free AI-Powered Tool" />
        <meta property="og:description" content="Generate compelling SEO meta descriptions instantly. Free AI-powered tool for creating search-engine-optimized meta descriptions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yoursite.com/seo" />
        <meta property="og:image" content="https://yoursite.com/seo-generator-og-image.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SEO Meta Description Generator" />
        <meta name="twitter:description" content="Free AI-powered tool for creating compelling SEO meta descriptions instantly." />
        <meta name="twitter:image" content="https://yoursite.com/seo-generator-twitter-image.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://yoursite.com/seo" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SEO Meta Description Generator",
              "description": "Free AI-powered tool for generating compelling SEO meta descriptions",
              "url": "https://yoursite.com/seo",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Any",
              "permissions": "browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Your Company Name"
              }
            })
          }}
        />
      </Head>

      <div style={{ 
        maxWidth: '800px', 
        margin: '2rem auto', 
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'relative'
      }}>
        {/* Back to Home Button */}
        <Link href="index" passHref>
          <button
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              padding: '8px 16px',
              backgroundColor: '#64748b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#475569';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#64748b';
            }}
          >
            ← Back to Home
          </button>
        </Link>

        <h1 style={{ 
          textAlign: 'center', 
          color: '#1e293b',
          marginBottom: '0.5rem',
          fontSize: '2.25rem',
          fontWeight: '700',
          paddingTop: '0.5rem'
        }}>
          🔍 SEO Meta Description Generator
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '1.125rem',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Create compelling, search-engine-optimized meta descriptions that boost your click-through rates
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your blog title, product name, or topic..."
              style={{ 
                width: '100%', 
                padding: '16px', 
                fontSize: '16px', 
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                paddingRight: '40px'
              }}
              required
              aria-label="Enter topic for SEO description"
            />
            {input && (
              <button
                type="button"
                onClick={clearInput}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                aria-label="Clear input"
              >
                ✕
              </button>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{ 
              width: '100%', 
              padding: '16px', 
              backgroundColor: loading ? '#94a3b8' : '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            aria-label={loading ? 'Generating SEO description...' : 'Generate SEO description'}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Generating...
              </>
            ) : (
              <>✨ Generate SEO Description</>
            )}
          </button>
        </form>

        {output && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            border: '1px solid #e2e8f0', 
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#1e293b',
                  fontSize: '1.25rem'
                }}>
                  Your SEO Meta Description:
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: charCount > 160 ? '#dc2626' : charCount >= 150 ? '#16a34a' : '#64748b'
                }}>
                  <span>{charCount} characters</span>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: charCount > 160 ? '#dc2626' : charCount >= 150 ? '#16a34a' : '#f59e0b'
                  }}></span>
                  <span>
                    {charCount > 160 ? 'Too long (ideal: 150-160)' : 
                     charCount >= 150 ? 'Perfect length!' : 'Too short (aim for 150-160)'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0d9488',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#0f766e';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#0d9488';
                }}
                aria-label="Copy SEO description to clipboard"
              >
                📋 Copy
              </button>
            </div>
            
            <div style={{ 
              whiteSpace: 'pre-wrap', 
              backgroundColor: '#f8fafc', 
              padding: '16px', 
              borderRadius: '6px',
              fontSize: '16px',
              lineHeight: '1.5',
              borderLeft: '4px solid #2563eb'
            }}>
              {output}
            </div>
          </div>
        )}

        {/* SEO Tips Section */}
        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ 
            color: '#1e293b', 
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            💡 SEO Best Practices
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '6px',
              borderLeft: '4px solid #0ea5e9'
            }}>
              <strong>Ideal Length:</strong> 150-160 characters for optimal display in search results
            </div>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '6px',
              borderLeft: '4px solid #22c55e'
            }}>
              <strong>Include Keywords:</strong> Place primary keywords naturally in the description
            </div>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef7ed',
              borderRadius: '6px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <strong>Call to Action:</strong> Use action-oriented language to encourage clicks
            </div>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              borderRadius: '6px',
              borderLeft: '4px solid #ef4444'
            }}>
              <strong>Avoid Duplication:</strong> Create unique descriptions for each page
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}
