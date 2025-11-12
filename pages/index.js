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
  const [isMobile, setIsMobile] = useState(false);

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
      const { session } = await supabase.auth.getSession();
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
        body: JSON.stringify({ 
          idea: input, 
          language, 
          tone, 
          maxTokens, 
          type: 'prompt' 
        }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to generate prompt');

      setOutput(data.prompt);
      setUsedModel(data.modelUsed);

      // Save to database
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

      // Update usage count for guests
      if (!user) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('guestUsage', newCount.toString());
        if (newCount >= 5) setShowLoginModal(true);
      }
    } catch (err) {
      console.error('Generation error:', err);
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleSubmit({ preventDefault: () => {} });
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: window.location.origin 
      },
    });
    if (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const exportTxt = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFeedback = async (rating) => {
    setFeedbackGiven(rating);
    
    try {
      const { data: prompts, error } = await supabase
        .from('prompts')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (prompts?.length && !error) {
        await supabase.from('feedback').insert({ 
          prompt_id: prompts[0].id, 
          rating, 
          comment: feedbackComment 
        });
      }
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const handleTemplateChange = (e) => {
    const val = e.target.value;
    setTemplate(val);
    if (val) {
      setInput(val + ' ');
    } else {
      setInput('');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.body.style.backgroundColor = newDarkMode ? '#111827' : '#f9fafb';
    document.body.style.color = newDarkMode ? '#f9fafb' : '#111827';
  };

  // Button style helper
  const buttonStyle = (bg, color = '#fff') => ({
    padding: '8px 16px',
    backgroundColor: bg,
    color: color,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
  });

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 16px',
      paddingBottom: '40px',
      minHeight: '100vh',
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
          gap: '8px',
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

        {/* Desktop Navigation */}
        {!isMobile && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px' 
          }}>
            <a href="/" style={{ 
              color: darkMode ? '#93c5fd' : '#3b82f6', 
              textDecoration: 'none', 
              fontWeight: '600' 
            }}>
              Home
            </a>
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  color: darkMode ? '#93c5fd' : '#3b82f6', 
                  fontSize: '0.875rem' 
                }}>
                  Hi, {user.email?.split('@')[0]}
                </span>
                <button 
                  onClick={handleLogout}
                  style={buttonStyle('#ef4444')}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin} 
                style={buttonStyle('#4f46e5')}
              >
                Login
              </button>
            )}
            
            <button
              onClick={toggleDarkMode}
              style={buttonStyle(
                darkMode ? '#374151' : '#e5e7eb', 
                darkMode ? '#f9fafb' : '#111827'
              )}
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
          <a href="/" style={{ 
            color: darkMode ? '#93c5fd' : '#3b82f6', 
            textDecoration: 'none', 
            fontWeight: '600' 
          }}>
            Home
          </a>
          
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ 
                color: darkMode ? '#93c5fd' : '#3b82f6', 
                fontSize: '0.875rem' 
              }}>
                Hi, {user.email?.split('@')[0]}
              </span>
              <button 
                onClick={handleLogout}
                style={buttonStyle('#ef4444')}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin} 
              style={buttonStyle('#4f46e5')}
            >
              Login
            </button>
          )}
          
          <button
            onClick={() => {
              toggleDarkMode();
              setMobileMenuOpen(false);
            }}
            style={buttonStyle(
              darkMode ? '#374151' : '#e5e7eb', 
              darkMode ? '#f9fafb' : '#1f2937'
            )}
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
          padding: '12px 16px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          🚨 You've used all 5 free prompts!{' '}
          <button 
            onClick={handleLogin}
            style={{ 
              color: '#4f46e5', 
              fontWeight: '600', 
              background: 'none', 
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Login to continue
          </button>
        </div>
      )}

      {/* Controls Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontWeight: '600' 
          }}>
            Tone
          </label>
          <select 
            value={tone} 
            onChange={(e) => setTone(e.target.value)} 
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: darkMode ? '1px solid #374151' : '1px solid #d1d5db',
              backgroundColor: darkMode ? '#1f2937' : '#fff',
              color: darkMode ? '#f9fafb' : '#000',
              fontSize: '1rem',
            }}
          >
            {TONES.map(toneOption => (
              <option key={toneOption} value={toneOption}>
                {toneOption}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontWeight: '600', 
            marginBottom: '6px' 
          }}>
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
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontWeight: '600' 
          }}>
            Template
          </label>
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
              fontSize: '1rem',
            }}
          >
            {TEMPLATES.map(template => (
              <option key={template.value} value={template.value}>
                {template.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ 
          marginBottom: '20px', 
          display: 'flex', 
          gap: '16px' 
        }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            gap: '6px'
          }}>
            <input 
              type="radio" 
              name="lang" 
              checked={language === 'English'} 
              onChange={() => setLanguage('English')} 
            />
            <span>English</span>
          </label>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            gap: '6px'
          }}>
            <input 
              type="radio" 
              name="lang" 
              checked={language === 'Hindi'} 
              onChange={() => setLanguage('Hindi')} 
            />
            <span>हिंदी</span>
          </label>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your idea or select a template above..."
          rows="5"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: darkMode ? '1px solid #374151' : '1px solid #d1d5db',
            backgroundColor: darkMode ? '#1f2937' : '#fff',
            color: darkMode ? '#f9fafb' : '#000',
            marginBottom: '16px',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: '120px',
          }}
          required
        />
        <button
          type="submit"
          disabled={loading || !canGenerate() || !input.trim()}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: loading || !canGenerate() || !input.trim() 
              ? (darkMode ? '#4b5563' : '#9ca3af') 
              : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: (loading || !canGenerate() || !input.trim()) 
              ? 'not-allowed' 
              : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {loading ? '⚙️ Generating...' : '✨ Generate Prompt'}
        </button>
      </form>

      {/* Output Section */}
      {output && (
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          backgroundColor: darkMode ? '#1f2937' : '#fff',
          marginBottom: '24px',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <h3 style={{ margin: 0, fontWeight: '600' }}>
              🧠 Your AI Prompt
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleRegenerate} 
                style={buttonStyle('#0d9488')}
                title="Regenerate"
              >
                🔁
              </button>
              <button 
                onClick={exportTxt} 
                style={buttonStyle('#7e22ce')}
                title="Download as TXT"
              >
                💾
              </button>
            </div>
          </div>
          
          <pre style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            backgroundColor: darkMode ? '#111827' : '#f9fafb',
            padding: '16px',
            borderRadius: '8px',
            margin: 0,
            border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          }}>
            {output}
          </pre>
          
          {usedModel && (
            <p style={{ 
              marginTop: '12px', 
              fontSize: '0.875rem', 
              color: darkMode ? '#9ca3af' : '#6b7280' 
            }}>
              Model: {' '}
              <code style={{ 
                backgroundColor: darkMode ? '#1f2937' : '#e5e7eb', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontSize: '0.8rem',
              }}>
                {usedModel}
              </code>
            </p>
          )}
          
          {/* Feedback Section */}
          {feedbackGiven === null && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ 
                marginBottom: '8px', 
                fontSize: '0.9rem',
                color: darkMode ? '#d1d5db' : '#4b5563'
              }}>
                Was this helpful?
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => handleFeedback(true)} 
                  style={buttonStyle('#22c55e')}
                >
                  👍 Yes
                </button>
                <button 
                  onClick={() => handleFeedback(false)} 
                  style={buttonStyle('#ef4444')}
                >
                  👎 No
                </button>
                {feedbackGiven === false && (
                  <input
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="What went wrong?"
                    style={{ 
                      flex: 1,
                      padding: '8px',
                      fontSize: '0.875rem', 
                      borderRadius: '4px', 
                      border: darkMode ? '1px solid #374151' : '1px solid #d1d5db',
                      backgroundColor: darkMode ? '#1f2937' : '#fff',
                      color: darkMode ? '#f9fafb' : '#000',
                    }}
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
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: darkMode ? '#1f2937' : 'white',
            padding: '24px',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
            border: darkMode ? '1px solid #374151' : 'none',
          }}>
            <h3 style={{ 
              margin: '0 0 12px',
              color: darkMode ? '#f9fafb' : '#111827'
            }}>
              Continue for Free!
            </h3>
            <p style={{ 
              margin: '0 0 20px', 
              color: darkMode ? '#d1d5db' : '#555' 
            }}>
              Login with Google to get unlimited prompts.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={handleLogin} 
                style={buttonStyle('#4f46e5', '#fff')}
              >
                Sign in with Google
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                style={{ 
                  color: darkMode ? '#9ca3af' : '#6b7280', 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  padding: '8px 16px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        paddingTop: '24px', 
        fontSize: '0.85rem', 
        color: darkMode ? '#9ca3af' : '#6b7280',
        borderTop: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
        marginTop: '24px',
      }}>
        🔒 No data stored • Powered by OpenRouter • Made with ❤️ by Mahendra
      </footer>
    </div>
  );
}
