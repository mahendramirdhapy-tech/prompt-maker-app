// pages/index.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const TEMPLATES = [
  { label: 'Custom Idea', value: '' },
  { label: 'Blog Intro', value: 'Write a blog intro about' },
  { label: 'Instagram Caption', value: 'Write an Instagram caption for' },
  { label: 'Twitter Post', value: 'Write a viral tweet about' },
  { label: 'LinkedIn Post', value: 'Write a professional LinkedIn post about' },
  { label: 'Code Debugger', value: 'Debug this code:' },
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
  const [isMobile, setIsMobile] = useState(false); // ← नया: मोबाइल डिटेक्शन

  // Dark mode sync
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.body.style.backgroundColor = isDark ? '#111827' : '#f9fafb';
    document.body.style.color = isDark ? '#f9fafb' : '#111827';
  }, []);

  // User & usage init
  useEffect(() => {
    const init = async () => {
      const {  { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      const count = parseInt(localStorage.getItem('guestUsage') || '0');
      setUsageCount(count);
    };
    init();
  }, []);

  // Client-side mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        body: JSON.stringify({ idea: input, language, tone, maxTokens, type: 'prompt' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed');

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
        type: 'prompt',
      });

      if (!user) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('guestUsage', newCount.toString());
        if (newCount >= 5) setShowLoginModal(true);
      }
    } catch (err) {
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => handleSubmit({ preventDefault: () => {} });
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://aipromptmaker.online' },
    });
    if (error) console.error('Login error:', error);
  };

  const exportTxt = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFeedback = async (rating) => {
    setFeedbackGiven(rating);
    const {  prompts } = await supabase
      .from('prompts')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);
    if (prompts?.length) {
      await supabase.from('feedback').insert({ prompt_id: prompts[0].id, rating, comment: feedbackComment });
    }
  };

  const handleTemplateChange = (e) => {
    const val = e.target.value;
    setTemplate(val);
    if (val) setInput(val + ' ');
    else setInput('');
  };

  const buttonStyle = (bg, color = '#fff') => ({
    padding: '6px 12px',
    backgroundColor: bg,
    color,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  });

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 16px',
      paddingBottom: '40px',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
        marginBottom: '24px',
      }}>
        <a href="/" style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: '#2563eb',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          🤖 PromptMaker
        </a>

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              fontSize: '1.5rem',
              background: 'none',
              border: 'none',
              color: darkMode ? '#f9fafb' : '#111827',
              cursor: 'pointer',
            }}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}

        {/* Desktop Nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/" style={{ color: darkMode ? '#93c5fd' : '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Home</a>
            <a href="/seo" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>🔍 SEO</a>
            <a href="/code" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>💻 Code</a>
            <a href="/email" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>✉️ Email</a>
            <a href="/translate" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>🔄 Translate</a>
            <a href="/blog-outline" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>📝 Outline</a>
            <a href="/blog" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>📚 Blog</a>
            {user ? (
              <span style={{ color: darkMode ? '#93c5fd' : '#3b82f6', fontSize: '0.875rem' }}>
                Hi, {user.email?.split('@')[0]}
              </span>
            ) : (
              <button onClick={handleLogin} style={buttonStyle('#4f46e5')}>Login</button>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={buttonStyle(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#111827')}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px 0',
          borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          marginBottom: '24px',
        }}>
          <a href="/" style={{ color: darkMode ? '#93c5fd' : '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Home</a>
          <a href="/seo" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>🔍 SEO</a>
          <a href="/code" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>💻 Code</a>
          <a href="/email" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>✉️ Email</a>
          <a href="/translate" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>🔄 Translate</a>
          <a href="/blog-outline" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>📝 Outline</a>
          <a href="/blog" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>📚 Blog</a>
          {user ? (
            <span style={{ color: darkMode ? '#93c5fd' : '#3b82f6', fontSize: '0.875rem' }}>
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
            style={buttonStyle(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#1f2937')}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      )}

      {/* Usage Warning */}
      {!canGenerate() && !user && (
        <div style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          🚨 5 free prompts used! <button onClick={handleLogin} style={{ color: '#4f46e5', fontWeight: '600', background: 'none', border: 'none' }}>Login to continue</button>
        </div>
      )}

      {/* Controls */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Tone</label>
        <select value={tone} onChange={(e) => setTone(e.target.value)} style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: darkMode ? '1px solid #374151' : '1px solid #d1d5db',
          backgroundColor: darkMode ? '#1f2937' : '#fff',
          color: darkMode ? '#f9fafb' : '#000',
        }}>
          {TONES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: '6px' }}>
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

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Template</label>
        <select
          value={template}
          onChange={handleTemplateChange}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: darkMode ? '1px solid #374151' : '1px solid #d1d5db',
            backgroundColor: darkMode ? '#1f2937' : '#fff',
            color: darkMode ? '#f9fafb' : '#000',
          }}
        >
          {TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input type="radio" name="lang" checked={language === 'English'} onChange={() => setLanguage('English')} />
          <span style={{ marginLeft: '6px' }}>English</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input type="radio" name="lang" checked={language === 'Hindi'} onChange={() => setLanguage('Hindi')} />
          <span style={{ marginLeft: '6px' }}>हिंदी</span>
        </label>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your idea..."
          rows="4"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: darkMode ? '1px solid #374151' : '1px solid #d1d5db',
            backgroundColor: darkMode ? '#1f2937' : '#fff',
            color: darkMode ? '#f9fafb' : '#000',
            marginBottom: '12px',
            boxSizing: 'border-box',
          }}
          required
        />
        <button
          type="submit"
          disabled={loading || !canGenerate()}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading || !canGenerate() ? (darkMode ? '#4b5563' : '#9ca3af') : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: (loading || !canGenerate()) ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⚙️ Generating...' : '✨ Generate Prompt'}
        </button>
      </form>

      {/* Output */}
      {output && (
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          backgroundColor: darkMode ? '#1f2937' : '#fff',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontWeight: '600' }}>🧠 Your AI Prompt</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleRegenerate} style={buttonStyle('#0d9488')}>🔁</button>
              <button onClick={exportTxt} style={buttonStyle('#7e22ce')}>💾</button>
            </div>
          </div>
          <pre style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontSize: '0.95rem',
            backgroundColor: darkMode ? '#111827' : '#f9fafb',
            padding: '14px',
            borderRadius: '8px',
            margin: 0,
          }}>{output}</pre>
          {usedModel && (
            <p style={{ marginTop: '12px', fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280' }}>
              Model: <code style={{ backgroundColor: darkMode ? '#1f2937' : '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{usedModel}</code>
            </p>
          )}
          {feedbackGiven === null && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ marginBottom: '8px', fontSize: '0.9rem' }}>Was this helpful?</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleFeedback(true)} style={buttonStyle('#22c55e')}>👍 Yes</button>
                <button onClick={() => handleFeedback(false)} style={buttonStyle('#ef4444')}>👎 No</button>
                {feedbackGiven === false && (
                  <input
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="What went wrong?"
                    style={{ marginLeft: '8px', padding: '6px', fontSize: '0.875rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && !user && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h3 style={{ margin: '0 0 12px' }}>Continue for Free!</h3>
            <p style={{ margin: '0 0 20px', color: '#555' }}>Login with Google to get unlimited prompts.</p>
            <div>
              <button onClick={handleLogin} style={buttonStyle('#4f46e5', '#fff')}>Google Login</button>
              <button
                onClick={() => setShowLoginModal(false)}
                style={{ marginLeft: '12px', color: '#6b7280', background: 'none', border: 'none', fontSize: '0.95rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', paddingTop: '24px', fontSize: '0.85rem', color: darkMode ? '#9ca3af' : '#6b7280' }}>
        Powered by OpenRouter • Made with ❤️ by Mahendra
      </footer>
    </div>
  );
}
