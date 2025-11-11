// pages/index.js
import { useState, useEffect } from 'react';

// Predefined templates
const TEMPLATES = [
  { label: 'Custom Idea', value: '' },
  { label: 'Blog Introduction', value: 'Write a compelling intro for a blog about' },
  { label: 'Python Code Debugger', value: 'Debug this Python code:' },
  { label: 'Instagram Caption', value: 'Write a catchy Instagram caption for a photo of' },
  { label: 'Story Starter', value: 'Write the first paragraph of a short story about' },
  { label: 'Email Draft', value: 'Draft a professional email about' },
];

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usedModel, setUsedModel] = useState('');
  const [language, setLanguage] = useState('English');
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [template, setTemplate] = useState('');

  // Utility for button styles
  const buttonStyle = (bg, hoverBg, color = '#fff') => ({
    padding: '6px 12px',
    backgroundColor: bg,
    color: color,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptHistory');
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setHistory(savedHistory ? JSON.parse(savedHistory) : []);
    setDarkMode(savedDark);
  }, []);

  // Apply body theme
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#111827' : '#f9fafb';
    document.body.style.color = darkMode ? '#f9fafb' : '#111827';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleTemplateChange = (e) => {
    const val = e.target.value;
    setTemplate(val);
    if (val) {
      setInput(val + ' ');
    } else {
      setInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');
    setUsedModel('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: input, language }),
      });

      const data = await res.json();

      if (data.success) {
        setOutput(data.prompt);
        setUsedModel(data.modelUsed);

        const newEntry = {
          id: Date.now(),
          input: input.trim(),
          output: data.prompt,
          language: data.language,
          model: data.modelUsed,
          timestamp: new Date().toISOString(),
        };
        const updatedHistory = [newEntry, ...history.slice(0, 9)];
        setHistory(updatedHistory);
        localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));
      } else {
        alert('❌ ' + (data.error || 'Failed to generate prompt.'));
      }
    } catch (err) {
      console.error(err);
      alert('⚠️ Network error.');
    } finally {
      setLoading(false);
    }
  };

  const sharePrompt = () => {
    if (!output) return;
    const encoded = encodeURIComponent(output);
    if (navigator.share) {
      navigator.share({ title: 'AI Prompt', text: output }).catch(console.warn);
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
    }
  };

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      setHistory([]);
      localStorage.removeItem('promptHistory');
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: darkMode ? '1px solid #374151' : '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: darkMode ? '#1f2937' : '#fff',
    color: darkMode ? '#f9fafb' : '#000',
    marginBottom: '0.5rem',
  };

  const cardStyle = {
    padding: '1.25rem',
    marginTop: '1.5rem',
    border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
    borderRadius: '12px',
    backgroundColor: darkMode ? '#1f2937' : '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  };

  const historyItemStyle = {
    padding: '12px',
    marginBottom: '8px',
    border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: darkMode ? '#374151' : '#f3f4f6',
    cursor: 'pointer',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: darkMode ? '#f9fafb' : '#111827',
  };

  return (
    <div style={containerStyle}>
      {/* ====== NAVBAR ====== */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0',
        borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <a
          href="/"
          style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#2563eb',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🤖 PromptMaker
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <a
              href="/"
              style={{
                color: darkMode ? '#93c5fd' : '#3b82f6',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Home
            </a>
            <a
              href="/blog"
              style={{
                color: darkMode ? '#d1d5db' : '#4b5563',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '1rem'
              }}
            >
              📚 Blog
            </a>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={buttonStyle(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#4b5563' : '#d1d5db', darkMode ? '#f9fafb' : '#111827')}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </nav>

      <p style={{ textAlign: 'center', color: darkMode ? '#9ca3af' : '#6b7280', marginBottom: '1.5rem' }}>
        Free models • Auto fallback • Save & share prompts
      </p>

      {/* Template Selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Prompt Template</label>
        <select
          value={template}
          onChange={handleTemplateChange}
          style={{
            ...inputStyle,
            padding: '8px',
          }}
        >
          {TEMPLATES.map((t) => (
            <option key={t.value || 'custom'} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Language Toggle */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="radio"
            name="lang"
            checked={language === 'English'}
            onChange={() => setLanguage('English')}
            style={{ marginRight: '6px' }}
          />
          English
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="radio"
            name="lang"
            checked={language === 'Hindi'}
            onChange={() => setLanguage('Hindi')}
            style={{ marginRight: '6px' }}
          />
          हिंदी
        </label>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your idea..."
          rows="4"
          style={inputStyle}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? (darkMode ? '#4b5563' : '#9ca3af') : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⚙️ Generating...' : '✨ Generate Optimized Prompt'}
        </button>
      </form>

      {/* Output */}
      {output && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '600' }}>✅ Your AI Prompt:</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                style={buttonStyle('#0d9488', '#0a7a6f')}
              >
                📋 Copy
              </button>
              <button
                onClick={sharePrompt}
                style={buttonStyle('#7e22ce', '#6b21a8')}
              >
                📤 Share
              </button>
            </div>
          </div>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              backgroundColor: darkMode ? '#111827' : '#f3f4f6',
              padding: '1rem',
              borderRadius: '6px',
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              fontSize: '0.95rem',
              color: darkMode ? '#f9fafb' : '#111827',
            }}
          >
            {output}
          </pre>
          {usedModel && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280' }}>
              Model used: <code style={{ backgroundColor: darkMode ? '#1f2937' : '#e5e7eb', padding: '2px 4px', borderRadius: '4px' }}>
                {usedModel}
              </code>
            </p>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '600' }}>📜 Recent Prompts</h3>
            <button
              onClick={clearHistory}
              style={{ color: '#ef4444', fontSize: '0.875rem', cursor: 'pointer' }}
            >
              Clear All
            </button>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {history.map((item) => (
              <div
                key={item.id}
                style={historyItemStyle}
                onClick={() => {
                  setInput(item.input);
                  setOutput(item.output);
                  setUsedModel(item.model);
                  setLanguage(item.language);
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.input}</div>
                <div style={{ fontSize: '0.75rem', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                  {new Date(item.timestamp).toLocaleString()} • {item.language}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280' }}>
        🔒 No data stored on server • Powered by OpenRouter (free tier)
      </footer>
    </div>
  );
}
