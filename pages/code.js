// pages/code.js
import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function CodeInterpreter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('auto');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Please enter some code to explain');
      return;
    }
    
    setLoading(true);
    setOutput('');

    try {
      const detectLang = language === 'auto' ? '' : `(${language} code)`;
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: `Explain this code ${detectLang} in simple, beginner-friendly terms. Break it down step by step and describe what each part does:\n\n${input}`,
          language: 'English',
          tone: 'Friendly',
          maxTokens: 500,
          type: 'prompt'
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setOutput(data.prompt || data.result || 'Explanation not available');
      } else {
        alert('❌ ' + (data.error || 'Failed to explain code'));
      }
    } catch (e) {
      console.error('Code explanation error:', e);
      alert('⚠️ ' + (e.message || 'Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const clearCode = () => {
    setInput('');
    setOutput('');
  };

  const copyExplanation = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('✅ Explanation copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const insertSampleCode = () => {
    const sampleCode = `// Sample JavaScript code
function calculateSum(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}

const result = calculateSum([1, 2, 3, 4, 5]);
console.log(result);`;
    setInput(sampleCode);
  };

  return (
    <Layout>
      <Head>
        <title>Code Interpreter & Explainer | Free AI-Powered Code Analysis</title>
        <meta 
          name="description" 
          content="Understand any code instantly. Free AI-powered code interpreter that explains Python, JavaScript, and other programming languages in simple terms." 
        />
        <meta 
          name="keywords" 
          content="code interpreter, code explainer, python code explanation, javascript explanation, learn programming, code analysis, ai code helper" 
        />
      </Head>

      <div style={{ 
        maxWidth: '900px', 
        margin: '2rem auto', 
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'relative'
      }}>

        <h1 style={{ 
          textAlign: 'center', 
          color: '#1e293b',
          marginBottom: '0.5rem',
          fontSize: '2.25rem',
          fontWeight: '700',
          paddingTop: '0.5rem'
        }}>
          💻 Code Interpreter & Explainer
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '1.125rem',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Paste any code and get a simple, beginner-friendly explanation instantly
        </p>

        {/* Language Selection */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <label style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#374151' 
          }}>
            Language:
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              backgroundColor: 'white',
              fontSize: '14px'
            }}
          >
            <option value="auto">Auto-detect</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="PHP">PHP</option>
            <option value="Ruby">Ruby</option>
            <option value="Go">Go</option>
          </select>
          
          <button
            type="button"
            onClick={insertSampleCode}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: 'auto'
            }}
          >
            Try Sample Code
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste your ${language === 'auto' ? 'code' : language + ' code'} here...`}
              rows="10"
              style={{ 
                width: '100%', 
                padding: '16px', 
                fontSize: '14px', 
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                lineHeight: '1.5',
                backgroundColor: '#1f2937',
                color: '#f3f4f6'
              }}
              required
              aria-label="Code input for explanation"
            />
            {input && (
              <button
                type="button"
                onClick={clearCode}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'white'
                }}
                aria-label="Clear code"
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
            aria-label={loading ? 'Explaining code...' : 'Explain code'}
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
                Analyzing Code...
              </>
            ) : (
              <>🔍 Explain Code</>
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
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <h3 style={{ 
                margin: 0, 
                color: '#1e293b',
                fontSize: '1.25rem'
              }}>
                Code Explanation:
              </h3>
              
              <button
                onClick={copyExplanation}
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
                aria-label="Copy explanation to clipboard"
              >
                📋 Copy Explanation
              </button>
            </div>
            
            <div style={{ 
              whiteSpace: 'pre-wrap', 
              backgroundColor: '#f8fafc', 
              padding: '16px', 
              borderRadius: '6px',
              fontSize: '16px',
              lineHeight: '1.6',
              borderLeft: '4px solid #2563eb'
            }}>
              {output}
            </div>
          </div>
        )}

        {/* Features Section */}
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
            🚀 How It Helps You Learn
          </h2>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              borderLeft: '4px solid #0ea5e9'
            }}>
              <strong>Step-by-Step Breakdown</strong>
              <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px' }}>
                Understand each line and function in simple language
              </p>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              borderLeft: '4px solid #22c55e'
            }}>
              <strong>Multiple Languages</strong>
              <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px' }}>
                Supports JavaScript, Python, Java, C++, PHP, Ruby, Go and more
              </p>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#fef7ed',
              borderRadius: '8px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <strong>Beginner Friendly</strong>
              <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '14px' }}>
                No technical jargon - perfect for learning programming
              </p>
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
    </Layout>
  );
}
