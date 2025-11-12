// pages/index.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const TEMPLATES = [
  { label: 'Custom Idea', value: '' },
  { label: 'Blog Introduction', value: 'Write a compelling intro for a blog about' },
  { label: 'Python Code Debugger', value: 'Debug this Python code:' },
  { label: 'Instagram Caption', value: 'Write a catchy Instagram caption for a photo of' },
  { label: 'Story Starter', value: 'Write the first paragraph of a short story about' },
  { label: 'Email Draft', value: 'Draft a professional email about' },
  { label: 'Twitter Post', value: 'Write a viral tweet about' },
  { label: 'LinkedIn Post', value: 'Write a professional LinkedIn post about' },
];

const TONES = ['Professional', 'Friendly', 'Technical', 'Creative', 'Humorous'];

export default function Home() {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usedModel, setUsedModel] = useState('');
  const [language, setLanguage] = useState('English');
  const [template, setTemplate] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [tone, setTone] = useState('Professional');
  const [maxTokens, setMaxTokens] = useState(600);
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const buttonStyle = (bg, color = '#fff') => ({
    padding: '6px 12px',
    backgroundColor: bg,
    color,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  });

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      const guestCount = parseInt(localStorage.getItem('guestUsage') || '0');
      setUsageCount(guestCount);
    };
    init();

    const savedDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDark);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#111827' : '#f9fafb';
    document.body.style.color = darkMode ? '#f9fafb' : '#111827';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleTemplateChange = (e) => {
    const val = e.target.value;
    setTemplate(val);
    if (val) setInput(val + ' ');
    else setInput('');
  };

  const canGenerate = () => user || usageCount < 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !canGenerate()) return;

    setLoading(true);
    setOutput('');
    setUsedModel('');
    setFeedbackGiven(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idea: input, 
          language, 
          tone, 
          maxTokens,
          type: 'social' // केवल social या prompt — image नहीं
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert('❌ ' + (data.error || 'Failed to generate.'));
        return;
      }

      setOutput(data.prompt);
      setUsedModel(data.modelUsed);

      await supabase.from('prompts').insert({
        user_id: user?.id || null,
        input: input.trim(),
        output: data.prompt,
        model_used: data.modelUsed,
        language,
        tone,
        max_tokens: maxTokens,
        type: 'prompt', // यहाँ prompt/social दोनों के लिए "prompt" सेव करें
      });

      if (!user) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('guestUsage', newCount.toString());
        if (newCount >= 5) setShowLoginModal(true);
      }
    } catch (err) {
      console.error(err);
      alert('⚠️ Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => handleSubmit({ preventDefault: () => {} });

  const handleFeedback = async (rating) => {
    setFeedbackGiven(rating);
    const { data: prompts } = await supabase
      .from('prompts')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);

    if (prompts?.length > 0) {
      await supabase.from('feedback').insert({
        prompt_id: prompts[0].id,
        rating,
        comment: feedbackComment,
      });
    }
  };

  const exportAsTxt = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://aipromptmaker.online' },
    });
    if (error) console.error('Login error:', error);
  };

  const containerStyle = {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '1.5rem',
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

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: darkMode ? '#f9fafb' : '#111827',
  };

  return (
    <div style={containerStyle}>
      {/* Navbar - Mobile Responsive */}
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

        {/* Desktop Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', '@media (max-width: 768px)': { display: 'none' } }}>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <a href="/" style={{ color: darkMode ? '#93c5fd' : '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Home</a>
            <a href="/blog" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none', fontWeight: '500' }}>📚 Blog</a>
            <a href="/image" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none', fontWeight: '500' }}>🖼️ Image</a>
          </div>
          {user ? (
            <span style={{ color: darkMode ? '#93c5fd' : '#3b82f6', fontSize: '0.9rem' }}>
              Hi, {user.email?.split('@')[0]}
            </span>
          ) : (
            <button onClick={handleLogin} style={buttonStyle('#4f46e5')}>Login</button>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={buttonStyle(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#111827')}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ 
            display: 'none', 
            '@media (max-width: 768px)': { display: 'block' },
            background: 'none',
            border: '1px solid #374151',
            borderRadius: '4px',
            padding: '4px 8px',
            color: darkMode ? '#f9fafb' : '#111827'
          }}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem 0',
          borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          marginBottom: '2rem',
          '@media (min-width: 769px)': { display: 'none' }
        }}>
          <a href="/" style={{ color: darkMode ? '#93c5fd' : '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Home</a>
          <a href="/blog" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none', fontWeight: '500' }}>📚 Blog</a>
          <a href="/image" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none', fontWeight: '500' }}>🖼️ Image</a>
          {user ? (
            <span style={{ color: darkMode ? '#93c5fd' : '#3b82f6', fontSize: '0.9rem' }}>
              Hi, {user.email?.split('@')[0]}
            </span>
          ) : (
            <button onClick={handleLogin} style={buttonStyle('#4f46e5')}>Login</button>
          )}
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              setMobileMenuOpen(false);
            }}
            style={buttonStyle(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#111827')}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      )}

      {!canGenerate() && !user && (
        <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
          🚨 You’ve used 5 free prompts!&nbsp;
          <button onClick={handleLogin} style={{ color: '#4f46e5', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
            Login to continue
          </button>
        </div>
      )}

      {/* Tone */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Tone</label>
        <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ ...inputStyle, padding: '8px' }}>
          {TONES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Max Tokens */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between' }}>
          Max Length: {maxTokens} tokens
        </label>
        <input
          type="range"
          min="200"
          max="800"
          step="200"
          value={maxTokens}
          onChange={(e) => setMaxTokens(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Template Selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Prompt Template</label>
        <select
          value={template}
          onChange={handleTemplateChange}
          style={{ ...inputStyle, padding: '8px' }}
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
          disabled={loading || !canGenerate()}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading || !canGenerate() ? (darkMode ? '#4b5563' : '#9ca3af') : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: (loading || !canGenerate()) ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⚙️ Generating...' : '✨ Generate Prompt'}
        </button>
      </form>

      {/* Output */}
      {output && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '600' }}>🧠 Your AI Prompt</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleRegenerate} style={buttonStyle('#0d9488')}>🔁 Regenerate</button>
              <button onClick={exportAsTxt} style={buttonStyle('#7e22ce')}>💾 TXT</button>
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

          {/* Feedback */}
          {feedbackGiven === null && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>Was this helpful?</p>
              <div>
                <button onClick={() => handleFeedback(true)} style={buttonStyle('#22c55e')}>👍 Yes</button>
                <button onClick={() => handleFeedback(false)} style={buttonStyle('#ef4444')}>👎 No</button>
                {feedbackGiven === false && (
                  <input
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="What went wrong?"
                    style={{ marginLeft: '0.5rem', padding: '4px', width: '200px' }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && !user && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ margin: '0 0 1rem' }}>Continue for Free!</h3>
            <p style={{ margin: '0 0 1.5rem' }}>Login with Google to get unlimited prompts.</p>
            <div>
              <button onClick={handleLogin} style={buttonStyle('#4f46e5')}>Google Login</button>
              <button onClick={() => setShowLoginModal(false)} style={{ marginLeft: '1rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280' }}>
        🔒 No data stored on server • Powered by OpenRouter (Created By Mahendra)
      </footer>
    </div>
  );
      }
