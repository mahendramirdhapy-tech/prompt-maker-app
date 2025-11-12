// pages/seo.js
import { useState } from 'react';

export default function SeoGenerator() {
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
          idea: `Write a 160-character SEO meta description for: ${input}`,
          language: 'English',
          tone: 'Professional',
          maxTokens: 100,
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
      <h1>🔍 SEO Meta Description Generator</h1>
      <p>Create search-engine-friendly meta descriptions in seconds.</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your blog title or topic..."
          style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}
        >
          {loading ? 'Generating...' : '✨ Generate SEO Description'}
        </button>
      </form>

      {output && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Your SEO Meta Description:</h3>
          <p>{output}</p>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            style={{ marginTop: '10px', padding: '6px 12px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            📋 Copy
          </button>
        </div>
      )}
    </div>
  );
}
