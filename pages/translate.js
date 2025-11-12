// pages/translate.js
import { useState } from 'react';

export default function Translator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fromLang, setFromLang] = useState('English');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');

    const targetLang = fromLang === 'English' ? 'Hindi' : 'English';
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: `Translate to ${targetLang}:\n\n${input}`,
          language: targetLang,
          tone: 'Professional',
          maxTokens: 500,
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
      <h1>🔄 Hindi ↔ English Translator</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        <label>
          <input
            type="radio"
            name="lang"
            checked={fromLang === 'English'}
            onChange={() => setFromLang('English')}
          /> English
        </label>
        <label>
          <input
            type="radio"
            name="lang"
            checked={fromLang === 'Hindi'}
            onChange={() => setFromLang('Hindi')}
          /> हिंदी
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter text in ${fromLang}...`}
          rows="6"
          style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}
        >
          {loading ? 'Translating...' : '🌐 Translate'}
        </button>
      </form>

      {output && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>Translation:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '4px' }}>{output}</pre>
        </div>
      )}
    </div>
  );
}
