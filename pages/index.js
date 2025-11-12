// pages/index.js

import { useState, useEffect, useCallback } from 'react';
// Assuming '../lib/supabase.js' handles env vars correctly
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
const GUEST_MAX_USAGE = 5;

// Utility function for inline button styles (for cleaner rendering)
const buttonStyle = (bg, color = '#fff') => ({
  padding: '6px 12px',
  backgroundColor: bg,
  color,
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'background-color 0.2s',
});

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

  // --- Effect Hooks ---

  // 1. Initialize Dark mode (Client-side only)
  useEffect(() => {
    // Check if window/localStorage is available
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      document.body.style.backgroundColor = isDark ? '#111827' : '#f9fafb';
      document.body.style.color = isDark ? '#f9fafb' : '#111827';
    }
  }, []);
  
  // Update body styles when darkMode state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
        document.body.style.backgroundColor = darkMode ? '#111827' : '#f9fafb';
        document.body.style.color = darkMode ? '#f9fafb' : '#111827';
        localStorage.setItem('darkMode', darkMode);
    }
  }, [darkMode]);


  // 2. User & usage init
  useEffect(() => {
    const init = async () => {
      // Supabase auth is async, so we use await
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // Get guest usage count
      const count = parseInt(localStorage.getItem('guestUsage') || '0');
      setUsageCount(count);
    };
    init();
  }, []);

  // 3. Client-side mobile detection
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkMobile(); // Initial check
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);
  
  // --- Helper Functions ---
  
  const canGenerate = () => user || usageCount < GUEST_MAX_USAGE;

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault(); // Use optional chaining just in case
    
    if (!input.trim() || !canGenerate()) {
        if (!canGenerate()) setShowLoginModal(true);
        return;
    }

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
      
      if (!data.success) throw new Error(data.error || 'Failed to generate content');

      setOutput(data.prompt);
      setUsedModel(data.modelUsed);

      // Log prompt to Supabase
      const { error: insertError } = await supabase.from('prompts').insert({
        user_id: user?.id || null,
        input: input.trim(),
        output: data.prompt,
        model_used: data.modelUsed,
        language,
        tone,
        max_tokens: maxTokens,
        type: 'prompt',
      });
      if (insertError) console.error("Supabase insert error:", insertError);


      // Handle guest usage limit
      if (!user) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('guestUsage', newCount.toString());
        if (newCount >= GUEST_MAX_USAGE) setShowLoginModal(true);
      }
    } catch (err) {
      alert('❌ Generation Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [input, language, tone, maxTokens, user, usageCount]); // Dependencies for useCallback

  const handleRegenerate = () => handleSubmit(); // Cleaner call for useCallback

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      // Ensure this redirectTo URL is correct for your Supabase configuration
      options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : 'https://aipromptmaker.online' },
    });
    if (error) console.error('Login error:', error);
  };

  const exportTxt = () => {
    if (!output) return;
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
    
    // 1. Get the ID of the last generated prompt (assuming success and prompt was logged)
    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) {
        console.error("Error fetching last prompt ID:", error);
        return;
    }
    
    // 2. Insert feedback
    if (prompts?.length) {
      await supabase.from('feedback').insert({ 
        prompt_id: prompts[0].id, 
        rating, 
        comment: feedbackComment 
      });
      // Clear comment after submission
      if (rating === false) setFeedbackComment(''); 
    }
  };

  const handleTemplateChange = (e) => {
    const val = e.target.value;
    setTemplate(val);
    // Set input with a space to allow user to immediately type after the template
    setInput(val ? val + ' ' : '');
  };

  // --- Component Rendering ---
  
  const baseColor = darkMode ? '#f9fafb' : '#111827';
  const secondaryBg = darkMode ? '#1f2937' : '#fff';

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 16px',
      paddingBottom: '40px',
      color: baseColor, // Ensure text color is set based on dark mode
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
              color: baseColor,
              cursor: 'pointer',
            }}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        )}

        {/* Desktop Nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/" style={{ color: darkMode ? '#93c5fd' : '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Home</a>
            <a href="/seo" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>🔍 SEO</a>
            {/* ... other desktop links ... */}
            {user ? (
              <span style={{ color: darkMode ? '#93c5fd' : '#3b82f6', fontSize: '0.875rem' }}>
                Hi, {user.email?.split('@')[0]}
              </span>
            ) : (
              <button onClick={handleLogin} style={buttonStyle('#4f46e5')}>Login</button>
            )}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              style={buttonStyle(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#111827')}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px 0',
          borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          marginBottom: '24px',
        }}>
          {/* Mobile Links */}
          <a href="/" style={{ color: darkMode ? '#93c5fd' : '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Home</a>
          <a href="/seo" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>🔍 SEO</a>
          {/* ... other mobile links ... */}
          {user ? (
            <span style={{ color: darkMode ? '#93c5fd' : '#3b82f6', fontSize: '0.875rem' }}>
              Hi, {user.email?.split('@')[0]}
            </span>
          ) : (
            <button onClick={handleLogin} style={buttonStyle('#4f46e5')}>Login</button>
          )}
          <button
            onClick={() => {
              setDarkMode(prev => !prev);
              setMobileMenuOpen(false);
            }}
            style={buttonStyle(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#1f2937')}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </nav>
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
          🚨 **{GUEST_MAX_USAGE} free prompts used!** <button onClick={handleLogin} style={{ color: '#4f46e5', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>Login to continue</button>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Tone Select */}
        <div>
          <label htmlFor="tone-select" style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Tone</label>
          <select 
            id="tone-select"
            value={tone} 
            onChange={(e) => setTone(e.target.value)} 
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: darkMode ? '1px solid #374151' : '1px solid #d1d5db',
              backgroundColor: secondaryBg,
              color: baseColor,
            }}>
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Template Select */}
        <div>
          <label htmlFor="template-select" style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Template</label>
          <select
            id="template-select"
            value={template}
            onChange={handleTemplateChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: darkMode ? '1px solid #374151' : '1px solid #d1d5db',
              backgroundColor: secondaryBg,
              color: baseColor,
            }}
          >
            {TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        
        {/* Language & Max Tokens */}
        <div style={{ gridColumn: isMobile ? '1' : 'span 1' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Language</label>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="radio" name="lang" checked={language === 'English'} onChange={() => setLanguage('English')} />
              <span style={{ marginLeft: '6px' }}>English</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="radio" name="lang" checked={language === 'Hindi'} onChange={() => setLanguage('Hindi')} />
              <span style={{ marginLeft: '6px' }}>हिंदी</span>
            </label>
          </div>
          
          <label htmlFor="max-tokens" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: '6px' }}>
            Max Length: {maxTokens} tokens
          </label>
          <input
            id="max-tokens"
            type="range"
            min="200"
            max="800"
            step="200"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#2563eb' }}
          />
        </div>
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
            backgroundColor: secondaryBg,
            color: baseColor,
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
            transition: 'background-color 0.2s',
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
          backgroundColor: secondaryBg,
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontWeight: '600' }}>🧠 Your AI Prompt</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleRegenerate} style={buttonStyle('#0d9488')} aria-label="Regenerate">🔁</button>
              <button onClick={exportTxt} style={buttonStyle('#7e22ce')} aria-label="Export to Text File">💾</button>
            </div>
          </div>
          <pre style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontSize: '0.95rem',
            backgroundColor: darkMode ? '#111827' : '#f9fafb',
            color: baseColor,
            padding: '14px',
            borderRadius: '8px',
            margin: 0,
          }}>{output}</pre>
          
          {usedModel && (
            <p style={{ marginTop: '12px', fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280' }}>
              Model: <code style={{ backgroundColor: darkMode ? '#1f2937' : '#e5e7eb', padding: '2px 6px', borderRadius: '4px', color: baseColor }}>{usedModel}</code>
            </p>
          )}
          
          {feedbackGiven === null && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ marginBottom: '8px', fontSize: '0.9rem' }}>Was this helpful?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => handleFeedback(true)} style={buttonStyle('#22c55e')}>👍 Yes</button>
                <button onClick={() => setFeedbackGiven(false)} style={buttonStyle('#ef4444')}>👎 No</button>
                
                {feedbackGiven === false && (
                    <>
                        <input
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            placeholder="What went wrong?"
                            style={{ 
                                padding: '6px', 
                                fontSize: '0.875rem', 
                                borderRadius: '4px', 
                                border: darkMode ? '1px solid #374151' : '1px solid #ccc',
                                backgroundColor: secondaryBg,
                                color: baseColor,
                            }}
                        />
                        <button onClick={() => handleFeedback(false)} style={buttonStyle('#f97316')}>Submit Feedback</button>
                    </>
                )}
              </div>
            </div>
          )}
          {feedbackGiven !== null && (
             <p style={{ marginTop: '16px', fontSize: '0.9rem', color: feedbackGiven ? '#22c55e' : '#ef4444' }}>
                {feedbackGiven ? 'Thanks for the positive feedback!' : 'We appreciate your feedback and will use it to improve.'}
             </p>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && !user && (
        <div 
          role="dialog"
          aria-modal="true"
          style={{
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
            color: '#111827', // Ensure modal text is readable
          }}>
            <h3 style={{ margin: '0 0 12px' }}>Continue for Free!</h3>
            <p style={{ margin: '0 0 20px', color: '#555' }}>Login with Google to get unlimited prompts.</p>
            <div>
              <button onClick={handleLogin} style={buttonStyle('#4f46e5', '#fff')}>Google Login</button>
              <button
                onClick={() => setShowLoginModal(false)}
                style={{ marginLeft: '12px', color: '#6b7280', background: 'none', border: 'none', fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', paddingTop: '24px', fontSize: '0.85rem', color: darkMode ? '#9ca3af' : '#6b7280' }}>
        🔒 No data stored • Powered by OpenRouter • Made with ❤️ by Mahendra
      </footer>
    </div>
  );
}
