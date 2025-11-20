// pages/blog-outline.js
import { useState } from 'react';
export default function BlogOutline() {
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
          idea: `Create a detailed blog outline with H2/H3 headings for: ${input}`,
          language: 'English',
          tone: 'Professional',
          maxTokens: 600,
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
      <h1>📝 Blog Outline Generator</h1>
      <p>Get a structured blog outline with headings in seconds.</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your blog topic..."
          style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}
        >
          {loading ? 'Generating...' : '📑 Generate Outline'}
        </button>
      </form>

      {output && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Your Blog Outline:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '4px' }}>{output}</pre>
        </div>
      )}
    </div>
  );
}
