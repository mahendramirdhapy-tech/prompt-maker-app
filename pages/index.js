// pages/index.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Predefined templates
const TEMPLATES = [
  { label: 'Custom Idea', value: '' },
  { label: 'Blog Introduction', value: 'Write a compelling intro for a blog about' },
  { label: 'Python Code Debugger', value: 'Debug this Python code:' },
  { label: 'Instagram Caption', value: 'Write a catchy Instagram caption for a photo of' },
];

const TONES = ['Professional', 'Friendly', 'Technical', 'Creative', 'Humorous'];
const MAX_TOKENS_OPTIONS = [200, 400, 600, 800];

export default function Home() {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usedModel, setUsedModel] = useState('');
  const [language, setLanguage] = useState('English');
  const [template, setTemplate] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  // New: Advanced Controls
  const [tone, setTone] = useState('Professional');
  const [maxTokens, setMaxTokens] = useState(600);
  const [feedbackGiven, setFeedbackGiven] = useState(null); // null, true, false
  const [feedbackComment, setFeedbackComment] = useState('');

  // Usage
  const [usageCount, setUsageCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Button style utility
  const buttonStyle = (bg, color = '#fff') => ({
    padding: '6px 12px',
    backgroundColor: bg,
    color,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  });

  // Init
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // Guest usage from localStorage
      const guestCount = parseInt(localStorage.getItem('guestUsage') || '0');
      setUsageCount(guestCount);
    };
    checkSession();

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

  // ✅ Check if user can generate
  const canGenerate = () => {
    if (user) return true;
    return usageCount < 5;
  };

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
        body: JSON.stringify({ idea: input, language, tone, maxTokens }),
      });

      const data = await res.json();

      if (data.success) {
        setOutput(data.prompt);
        setUsedModel(data.modelUsed);

        // Save to Supabase
        const { data: promptData, error } = await supabase
          .from('prompts')
          .insert({
            user_id: user?.id || null,
            input: input.trim(),
            output: data.prompt,
            model_used: data.modelUsed,
            language,
            tone,
            max_tokens: maxTokens,
          })
          .select();

        // Update usage
        if (!user) {
          const newCount = usageCount + 1;
          setUsageCount(newCount);
          localStorage.setItem('guestUsage', newCount.toString());
          if (newCount >= 5) setShowLoginModal(true);
        }
      } else {
        alert('❌ ' + (data.error || 'Failed'));
      }
    } catch (err) {
      console.error(err);
      alert('⚠️ Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleSubmit({ preventDefault: () => {} });
  };

  const handleFeedback = async (rating) => {
    setFeedbackGiven(rating);
    const { data: promptData } = await supabase
      .from('prompts')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (promptData) {
      await supabase.from('feedback').insert({
        prompt_id: promptData.id,
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://aipromptmaker.online' },
    });
    if (error) console.error('Login error:', error);
  };

  // ====== UI ======
  const containerStyle = {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif',
  };

  // ... (same styles as before for input, card, etc.)

  return (
    <div style={containerStyle}>
      {/* Navbar */}
      <nav style={{ /* same as before */ }}>
        <a href="/" style={{ /* logo */ }}>🤖 PromptMaker</a>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <a href="/">Home</a>
          <a href="/blog">📚 Blog</a>
          {user ? (
            <span style={{ color: '#93c5fd' }}>Hi, {user.email?.split('@')[0]}</span>
          ) : (
            <button onClick={handleLogin} style={buttonStyle('#4f46e5', '#fff')}>
              Login
            </button>
          )}
          <button onClick={() => setDarkMode(!darkMode)} style={buttonStyle(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#111827')}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </nav>

      {!canGenerate() && !user && (
        <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          🚨 You’ve used 5 free prompts! <button onClick={handleLogin} style={{ color: '#4f46e5', fontWeight: '600' }}>Login to continue</button>
        </div>
      )}

      {/* Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tone</label>
        <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ width: '100%', padding: '8px' }}>
          {TONES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label>Max Length: {maxTokens} tokens</label>
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

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your idea..."
          rows="4"
          style={{ /* same as before */ }}
          required
        />
        <button
          type="submit"
          disabled={loading || !canGenerate()}
          style={{ /* same, but red if limit reached */ }}
        >
          {loading ? '⚙️ Generating...' : '✨ Generate Prompt'}
        </button>
      </form>

      {/* Output */}
      {output && (
        <div style={{ /* card style */ }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>Your Prompt:</h3>
            <div>
              <button onClick={handleRegenerate} style={buttonStyle('#0d9488')}>🔁 Regenerate</button>
              <button onClick={exportAsTxt} style={buttonStyle('#7e22ce')}>💾 TXT</button>
            </div>
          </div>
          <pre>{output}</pre>

          {/* Feedback */}
          {feedbackGiven === null && (
            <div style={{ marginTop: '1rem' }}>
              <p>Was this helpful?</p>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
            <h3>Continue for Free!</h3>
            <p>Login with Google to get unlimited prompts.</p>
            <button onClick={handleLogin} style={buttonStyle('#4f46e5')}>Google Login</button>
            <button onClick={() => setShowLoginModal(false)} style={{ marginLeft: '1rem', color: '#6b7280' }}>Close</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>🔒 No data stored on server • Powered by OpenRouter</footer>
    </div>
  );
}
