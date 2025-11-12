// pages/image.js
import { useState } from 'react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setImageUrl('');

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } else {
        const err = await res.json();
        alert('❌ ' + (err.error || 'Image generation failed'));
      }
    } catch (err) {
      console.error(err);
      alert('⚠️ Network error');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'ai-image.png';
    a.click();
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>🖼️ AI Image Generator</h1>
      <p>Powered by AI Horde (Free & Open)</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image (e.g., 'A Diwali festival in Mumbai at night')"
          rows="3"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            marginTop: '0.5rem',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '🎨 Generating...' : '✨ Generate Image'}
        </button>
      </form>

      {imageUrl && (
        <div style={{ marginTop: '2rem' }}>
          <img
            src={imageUrl}
            alt="AI Generated"
            style={{ width: '100%', borderRadius: '12px', border: '1px solid #eee' }}
          />
          <button
            onClick={downloadImage}
            style={{
              marginTop: '1rem',
              padding: '8px 16px',
              backgroundColor: '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            📥 Download
          </button>
        </div>
      )}

      <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
        🔒 No data stored • Images generated via AI Horde (free tier)
      </footer>
    </div>
  );
  }
