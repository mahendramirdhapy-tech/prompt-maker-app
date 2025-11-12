// pages/code.js
import { useState } from 'react';

export default function CodeInterpreter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: `Explain this code in simple terms:\n\n${input}`,
          language: 'English',
          tone: 'Friendly',
          maxTokens: 300,
          type: 'prompt'
        }),
      });
      const data = await res.json();
      if (data.success) setOutput(data.prompt);
      else alert('❌ ' + data.error);
    } catch (e) {
      alert('⚠️ Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
      <h1>💻 Code Interpreter</h1>
      <p>Paste any Python/JavaScript code — get a simple explanation.</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your code here..."
          rows="6"
          style={{ width: '100%', padding: '10px', fontSize: '14px', marginBottom: '10px', fontFamily: 'monospace' }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}
        >
          {loading ? 'Explaining...' : '🔍 Explain Code'}
        </button>
      </form>

      {output && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Explanation:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '4px' }}>{output}</pre>
        </div>
      )}
    </div>
  );
}
