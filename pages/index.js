// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usedModel, setUsedModel] = useState('');

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
        body: JSON.stringify({ idea: input }),
      });

      const data = await res.json();

      if (data.success) {
        setOutput(data.prompt);
        setUsedModel(data.modelUsed);
      } else {
        alert('❌ ' + (data.error || 'Failed to generate prompt. Try again.'));
      }
    } catch (err) {
      console.error(err);
      alert('⚠️ Network error. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2563eb' }}>🤖 AI Prompt Maker</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Uses only <strong>free OpenRouter models</strong> with auto-fallback!
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your idea (e.g., 'Write a Python script to scrape news headlines')"
          rows="4"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#94a3b8' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⚙️ Generating...' : '✨ Generate Optimized Prompt'}
        </button>
      </form>

      {output && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
          <h3>✅ Your AI-Optimized Prompt:</h3>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: '#fff',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              marginTop: '0.5rem',
            }}
          >
            {output}
          </pre>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              📋 Copy Prompt
            </button>
            {usedModel && (
              <small style={{ alignSelf: 'center', color: '#64748b' }}>
                Model used: <code>{usedModel}</code>
              </small>
            )}
          </div>
        </div>
      )}

      <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
        🔒 Your data never leaves this app. Powered by OpenRouter (free tier).
      </footer>
    </div>
  );
}
