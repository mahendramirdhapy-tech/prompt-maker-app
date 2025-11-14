// pages/translate.js
import { useState } from 'react';

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
    <div style={{ 
      maxWidth: '800px', 
      margin: '2rem auto', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#1e293b',
        marginBottom: '1.5rem',
        fontSize: '2rem',
        fontWeight: '700'
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
            <h3 style={{ 
              margin: 0, 
              color: '#1e293b',
              fontSize: '1.25rem'
            }}>
              Translation:
            </h3>
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
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
