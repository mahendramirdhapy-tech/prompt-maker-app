// pages/translate.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdsComponent from '../components/AdsComponent';

export default function Translator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fromLang, setFromLang] = useState('English');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Please enter some text to translate');
      return;
    }
    
    setLoading(true);
    setOutput('');

    const targetLang = fromLang === 'English' ? 'Hindi' : 'English';
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: `Translate the following text from ${fromLang} to ${targetLang}. Only provide the translation without any additional text:\n\n${input}`,
          language: targetLang,
          tone: 'Professional',
          maxTokens: 500,
          type: 'prompt'
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setOutput(data.prompt || data.result || 'Translation not available');
      } else {
        alert('❌ ' + (data.error || 'Translation failed'));
      }
    } catch (e) {
      console.error('Translation error:', e);
      alert('⚠️ ' + (e.message || 'Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    if (output) {
      setInput(output);
      setOutput('');
    }
    setFromLang(fromLang === 'English' ? 'Hindi' : 'English');
  };

  const clearText = () => {
    setInput('');
    setOutput('');
  };

  return (
    <>
      <Head>
        <title>Hindi ↔ English Translator | Free Online Translation Tool</title>
        <meta 
          name="description" 
          content="Free online Hindi to English and English to Hindi translator. Fast, accurate translations with professional results. No registration required." 
        />
        <meta 
          name="keywords" 
          content="hindi to english translator, english to hindi translation, free translator, online translation, hindi english converter, language translator" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Your Company Name" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Hindi ↔ English Translator | Free Online Translation Tool" />
        <meta property="og:description" content="Free online Hindi to English and English to Hindi translator. Fast, accurate translations with professional results." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yoursite.com/translate" />
        <meta property="og:image" content="https://yoursite.com/translator-og-image.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hindi ↔ English Translator" />
        <meta name="twitter:description" content="Free online Hindi to English and English to Hindi translator." />
        <meta name="twitter:image" content="https://yoursite.com/translator-twitter-image.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://yoursite.com/translate" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Hindi English Translator",
              "description": "Free online Hindi to English and English to Hindi translation tool",
              "url": "https://yoursite.com/translate",
              "applicationCategory": "UtilityApplication",
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
          marginBottom: '1.5rem',
          fontSize: '2rem',
          fontWeight: '700',
          paddingTop: '0.5rem'
        }}>
          🔄 Hindi ↔ English Translator
        </h1>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '20px', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: fromLang === 'English' ? '#3b82f6' : '#e2e8f0',
            color: fromLang === 'English' ? 'white' : '#64748b',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}>
            <span>{fromLang === 'English' ? '🇺🇸' : '🇮🇳'}</span>
            {fromLang}
          </div>
          
          <button
            onClick={swapLanguages}
            style={{
              padding: '10px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}
            title="Swap languages"
            aria-label="Swap languages"
          >
            ⇄
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: fromLang === 'Hindi' ? '#3b82f6' : '#e2e8f0',
            color: fromLang === 'Hindi' ? 'white' : '#64748b',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}>
            <span>{fromLang === 'Hindi' ? '🇺🇸' : '🇮🇳'}</span>
            {fromLang === 'English' ? 'Hindi' : 'English'}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter text in ${fromLang}...`}
              rows="6"
              style={{ 
                width: '100%', 
                padding: '16px', 
                fontSize: '16px', 
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              required
              aria-label={`Text to translate from ${fromLang}`}
            />
            {input && (
              <button
                type="button"
                onClick={clearText}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
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
                aria-label="Clear text"
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
              padding: '14px', 
              backgroundColor: loading ? '#94a3b8' : '#3b82f6', 
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
            aria-label={loading ? 'Translating...' : 'Translate text'}
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
                Translating...
              </>
            ) : (
              <>🌐 Translate</>
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
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{ 
                margin: 0, 
                color: '#1e293b',
                fontSize: '1.25rem'
              }}>
                Translation Result:
              </h2>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                aria-label="Copy translation to clipboard"
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
              minHeight: '100px'
            }}>
              {output}
            </div>
          </div>
        )}
        
        {/* Additional SEO Content */}
        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>About Our Hindi English Translator</h2>
          <p style={{ lineHeight: '1.6', color: '#475569', marginBottom: '1rem' }}>
            Our free online translator provides instant Hindi to English and English to Hindi translations. 
            Whether you need to translate documents, emails, or casual conversations, our tool delivers 
            accurate results with professional quality.
          </p>
          <p style={{ lineHeight: '1.6', color: '#475569' }}>
            <strong>Key Features:</strong> Fast translation, easy to use, no registration required, 
            and works on all devices. Perfect for students, professionals, and anyone needing 
            quick language translation between Hindi and English.
          </p>
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
