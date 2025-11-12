// pages/index.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  // Responsive screen detection
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Add responsive class to body
      if (mobile) {
        document.body.classList.add('mobile-view');
        document.body.classList.remove('tablet-view', 'desktop-view');
      } else if (tablet) {
        document.body.classList.add('tablet-view');
        document.body.classList.remove('mobile-view', 'desktop-view');
      } else {
        document.body.classList.add('desktop-view');
        document.body.classList.remove('mobile-view', 'tablet-view');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Dark mode sync
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    updateDarkModeStyles(isDark);
  }, []);

  const updateDarkModeStyles = (isDark) => {
    document.body.style.backgroundColor = isDark ? '#111827' : '#f9fafb';
    document.body.style.color = isDark ? '#f9fafb' : '#111827';
  };

  // User & usage init
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      const count = parseInt(localStorage.getItem('guestUsage') || '0');
      setUsageCount(count);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (event === 'SIGNED_IN') {
          setShowLoginModal(false);
        }
      }
    );

    return () => subscription.unsubscribe();
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
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}/auth/callback`
        },
      });
      if (error) throw error;
    } catch (error) {
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
    updateDarkModeStyles(newDarkMode);
  };

  const navigateTo = (path) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  // Responsive Styles
  const containerStyles = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: isMobile ? '0 12px' : '0 20px',
    paddingBottom: isMobile ? '80px' : '40px',
    minHeight: '100vh',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '12px 0' : '16px 0',
    borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
    marginBottom: '24px',
    position: isMobile ? 'sticky' : 'static',
    top: 0,
    backgroundColor: darkMode ? '#111827' : '#f9fafb',
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  };

  const logoStyles = {
    fontSize: isMobile ? '1.25rem' : '1.5rem',
    fontWeight: '800',
    color: '#2563eb',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  };

  const buttonStyles = (bg, color = '#fff') => ({
    padding: isMobile ? '10px 16px' : '8px 16px',
    backgroundColor: bg,
    color: color,
    border: 'none',
    borderRadius: isMobile ? '12px' : '8px',
    cursor: 'pointer',
    fontSize: isMobile ? '0.9rem' : '0.875rem',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    minHeight: isMobile ? '44px' : 'auto',
    minWidth: isMobile ? '44px' : 'auto',
  });

  const navLinkStyles = (isActive = false) => ({
    color: isActive ? (darkMode ? '#93c5fd' : '#3b82f6') : (darkMode ? '#d1d5db' : '#4b5563'),
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '400',
    padding: isMobile ? '12px 16px' : '8px 12px',
    borderRadius: isMobile ? '10px' : '6px',
    transition: 'all 0.2s',
    cursor: 'pointer',
    backgroundColor: isActive ? (darkMode ? '#374151' : '#f3f4f6') : 'transparent',
    fontSize: isMobile ? '1rem' : '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minHeight: isMobile ? '44px' : 'auto',
  });

  const formControlStyles = {
    width: '100%',
    padding: isMobile ? '14px' : '12px',
    borderRadius: isMobile ? '12px' : '8px',
    border: darkMode ? '1px solid #374151' : '1px solid #d1d5db',
    backgroundColor: darkMode ? '#1f2937' : '#fff',
    color: darkMode ? '#f9fafb' : '#000',
    fontSize: isMobile ? '16px' : '1rem', // Prevent zoom on iOS
    marginBottom: isMobile ? '16px' : '12px',
    boxSizing: 'border-box',
  };

  const mobileBottomNav = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: darkMode ? '#1f2937' : '#fff',
    borderTop: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '8px 0',
    zIndex: 1000,
  };

  const mobileNavButton = (isActive = false) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    background: 'none',
    border: 'none',
    color: isActive ? '#2563eb' : (darkMode ? '#9ca3af' : '#6b7280'),
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: isActive ? '600' : '400',
    minWidth: '60px',
  });

  return (
    <div style={containerStyles}>
      {/* Header */}
      <header style={headerStyles}>
        <div onClick={() => navigateTo('/')} style={logoStyles}>
          🤖 {isMobile ? 'PM' : 'PromptMaker'}
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              <span onClick={() => navigateTo('/')} style={navLinkStyles(router.pathname === '/')}>
                🏠 Home
              </span>
              <span onClick={() => navigateTo('/seo')} style={navLinkStyles(router.pathname === '/seo')}>
                🔍 SEO
              </span>
              <span onClick={() => navigateTo('/code')} style={navLinkStyles(router.pathname === '/code')}>
                💻 Code
              </span>
              <span onClick={() => navigateTo('/email')} style={navLinkStyles(router.pathname === '/email')}>
                ✉️ Email
              </span>
              <span onClick={() => navigateTo('/translate')} style={navLinkStyles(router.pathname === '/translate')}>
                🔄 Translate
              </span>
              <span onClick={() => navigateTo('/blog-outline')} style={navLinkStyles(router.pathname === '/blog-outline')}>
                📝 Outline
              </span>
              <span onClick={() => navigateTo('/blog')} style={navLinkStyles(router.pathname === '/blog')}>
                📚 Blog
              </span>
            </div>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px' }}>
                <span style={{ color: darkMode ? '#93c5fd' : '#3b82f6', fontSize: '0.875rem' }}>
                  👋 {user.email?.split('@')[0]}
                </span>
                <button onClick={handleLogout} style={buttonStyles('#6b7280')}>
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} style={buttonStyles('#4f46e5')}>
                Login
              </button>
            )}
            
            <button
              onClick={toggleDarkMode}
              style={buttonStyles(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#111827')}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: darkMode ? '#f9fafb' : '#111827',
                cursor: 'pointer',
                fontSize: '1.5rem',
                padding: '8px',
              }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            backgroundColor: darkMode ? '#1f2937' : '#fff',
            marginTop: '60px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '20px',
            flex: 1,
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span onClick={() => navigateTo('/')} style={navLinkStyles(router.pathname === '/')}>
                🏠 Home
              </span>
              <span onClick={() => navigateTo('/seo')} style={navLinkStyles(router.pathname === '/seo')}>
                🔍 SEO Tools
              </span>
              <span onClick={() => navigateTo('/code')} style={navLinkStyles(router.pathname === '/code')}>
                💻 Code Assistant
              </span>
              <span onClick={() => navigateTo('/email')} style={navLinkStyles(router.pathname === '/email')}>
                ✉️ Email Writer
              </span>
              <span onClick={() => navigateTo('/translate')} style={navLinkStyles(router.pathname === '/translate')}>
                🔄 Translator
              </span>
              <span onClick={() => navigateTo('/blog-outline')} style={navLinkStyles(router.pathname === '/blog-outline')}>
                📝 Blog Outline
              </span>
              <span onClick={() => navigateTo('/blog')} style={navLinkStyles(router.pathname === '/blog')}>
                📚 Blog Articles
              </span>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: darkMode ? '1px solid #374151' : '1px solid #e5e7eb' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ color: darkMode ? '#93c5fd' : '#3b82f6', fontSize: '1rem' }}>
                    👋 Hello, {user.email?.split('@')[0]}
                  </div>
                  <button onClick={handleLogout} style={buttonStyles('#ef4444')}>
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} style={buttonStyles('#4f46e5')}>
                  🔐 Login with Google
                </button>
              )}
              
              <button
                onClick={toggleDarkMode}
                style={buttonStyles(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#1f2937')}
              >
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ paddingBottom: isMobile ? '60px' : '0' }}>
        {/* Usage Warning */}
        {!canGenerate() && !user && (
          <div style={{
            backgroundColor: '#fef3c7',
            color: '#92400e',
            padding: isMobile ? '16px' : '12px 16px',
            borderRadius: isMobile ? '12px' : '8px',
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: isMobile ? '0.95rem' : '0.9rem'
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
                textDecoration: 'underline',
                fontSize: 'inherit',
              }}
            >
              Login to continue
            </button>
          </div>
        )}

        {/* Controls Grid */}
        <div style={{ 
          display: 'grid', 
          gap: isMobile ? '16px' : '12px',
          marginBottom: '24px',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        }}>
          {/* Tone Select */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: isMobile ? '1rem' : '0.9rem' }}>
              🎵 Tone
            </label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} style={formControlStyles}>
              {TONES.map(toneOption => (
                <option key={toneOption} value={toneOption}>{toneOption}</option>
              ))}
            </select>
          </div>

          {/* Template Select */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: isMobile ? '1rem' : '0.9rem' }}>
              📝 Template
            </label>
            <select value={template} onChange={handleTemplateChange} style={formControlStyles}>
              {TEMPLATES.map(template => (
                <option key={template.value} value={template.value}>{template.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Max Tokens Slider */}
        <div style={{ marginBottom: isMobile ? '20px' : '16px' }}>
          <label style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontWeight: '600', 
            marginBottom: '8px',
            fontSize: isMobile ? '1rem' : '0.9rem'
          }}>
            <span>📏 Length: {maxTokens} tokens</span>
          </label>
          <input
            type="range"
            min="200"
            max="800"
            step="200"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            style={{ 
              width: '100%',
              height: isMobile ? '8px' : '6px',
              borderRadius: '5px',
            }}
          />
        </div>

        {/* Language Selection */}
        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          gap: isMobile ? '20px' : '16px' 
        }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            gap: '8px',
            fontSize: isMobile ? '1rem' : '0.9rem'
          }}>
            <input 
              type="radio" 
              name="lang" 
              checked={language === 'English'} 
              onChange={() => setLanguage('English')} 
              style={{ transform: isMobile ? 'scale(1.2)' : 'scale(1)' }}
            />
            <span>🇺🇸 English</span>
          </label>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            gap: '8px',
            fontSize: isMobile ? '1rem' : '0.9rem'
          }}>
            <input 
              type="radio" 
              name="lang" 
              checked={language === 'Hindi'} 
              onChange={() => setLanguage('Hindi')} 
              style={{ transform: isMobile ? 'scale(1.2)' : 'scale(1)' }}
            />
            <span>🇮🇳 हिंदी</span>
          </label>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your idea or select a template above..."
            rows={isMobile ? 6 : 5}
            style={{
              ...formControlStyles,
              resize: 'vertical',
              minHeight: isMobile ? '140px' : '120px',
              fontSize: isMobile ? '16px' : '1rem', // Prevent zoom on iOS
            }}
            required
          />
          <button
            type="submit"
            disabled={loading || !canGenerate() || !input.trim()}
            style={{
              width: '100%',
              padding: isMobile ? '18px' : '16px',
              backgroundColor: loading || !canGenerate() || !input.trim() 
                ? (darkMode ? '#4b5563' : '#9ca3af') 
                : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: isMobile ? '14px' : '8px',
              fontSize: isMobile ? '1.1rem' : '1rem',
              fontWeight: '600',
              cursor: (loading || !canGenerate() || !input.trim()) 
                ? 'not-allowed' 
                : 'pointer',
              transition: 'all 0.2s',
              minHeight: isMobile ? '60px' : 'auto',
            }}
          >
            {loading ? '⚙️ Generating...' : '✨ Generate Prompt'}
          </button>
        </form>

        {/* Output Section */}
        {output && (
          <div style={{
            padding: isMobile ? '16px' : '20px',
            borderRadius: isMobile ? '16px' : '12px',
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
              <h3 style={{ margin: 0, fontWeight: '600', fontSize: isMobile ? '1.2rem' : '1.1rem' }}>
                🧠 Your AI Prompt
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={handleRegenerate} 
                  style={buttonStyles('#0d9488')}
                  title="Regenerate"
                >
                  {isMobile ? '🔄' : '🔁'}
                </button>
                <button 
                  onClick={exportTxt} 
                  style={buttonStyles('#7e22ce')}
                  title="Download as TXT"
                >
                  {isMobile ? '💾' : '💾'}
                </button>
              </div>
            </div>
            
            <pre style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: isMobile ? '0.9rem' : '0.85rem',
              lineHeight: '1.5',
              backgroundColor: darkMode ? '#111827' : '#f9fafb',
              padding: isMobile ? '16px' : '14px',
              borderRadius: isMobile ? '12px' : '8px',
              margin: 0,
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              maxHeight: isMobile ? '300px' : '400px',
              overflowY: 'auto',
            }}>
              {output}
            </pre>
            
            {usedModel && (
              <p style={{ 
                marginTop: '12px', 
                fontSize: isMobile ? '0.8rem' : '0.75rem', 
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
                  fontSize: isMobile ? '0.95rem' : '0.9rem',
                  color: darkMode ? '#d1d5db' : '#4b5563'
                }}>
                  Was this helpful?
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handleFeedback(true)} 
                    style={buttonStyles('#22c55e')}
                  >
                    {isMobile ? '👍 Yes' : '👍 Yes'}
                  </button>
                  <button 
                    onClick={() => handleFeedback(false)} 
                    style={buttonStyles('#ef4444')}
                  >
                    {isMobile ? '👎 No' : '👎 No'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav style={mobileBottomNav}>
          <button 
            onClick={() => navigateTo('/')} 
            style={mobileNavButton(router.pathname === '/')}
          >
            <div style={{ fontSize: '1.2rem' }}>🏠</div>
            <span>Home</span>
          </button>
          
          <button 
            onClick={() => navigateTo('/code')} 
            style={mobileNavButton(router.pathname === '/code')}
          >
            <div style={{ fontSize: '1.2rem' }}>💻</div>
            <span>Code</span>
          </button>
          
          <button 
            onClick={() => navigateTo('/email')} 
            style={mobileNavButton(router.pathname === '/email')}
          >
            <div style={{ fontSize: '1.2rem' }}>✉️</div>
            <span>Email</span>
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            style={mobileNavButton()}
          >
            <div style={{ fontSize: '1.2rem' }}>☰</div>
            <span>More</span>
          </button>
        </nav>
      )}

      {/* Login Modal */}
      {showLoginModal && !user && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: isMobile ? '20px' : '0',
        }}>
          <div style={{
            backgroundColor: darkMode ? '#1f2937' : 'white',
            padding: isMobile ? '24px 20px' : '24px',
            borderRadius: isMobile ? '20px' : '16px',
            textAlign: 'center',
            maxWidth: isMobile ? '100%' : '400px',
            width: isMobile ? '100%' : '90%',
            border: darkMode ? '1px solid #374151' : 'none',
            margin: isMobile ? '20px' : '0',
          }}>
            <h3 style={{ 
              margin: '0 0 16px',
              color: darkMode ? '#f9fafb' : '#111827',
              fontSize: isMobile ? '1.3rem' : '1.2rem'
            }}>
              Continue for Free!
            </h3>
            <p style={{ 
              margin: '0 0 24px', 
              color: darkMode ? '#d1d5db' : '#555',
              fontSize: isMobile ? '1rem' : '0.95rem'
            }}>
              Login with Google to get unlimited prompts.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
              <button 
                onClick={handleLogin} 
                style={buttonStyles('#4f46e5', '#fff')}
              >
                Sign in with Google
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                style={{ 
                  color: darkMode ? '#9ca3af' : '#6b7280', 
                  background: 'none', 
                  border: 'none', 
                  fontSize: isMobile ? '1rem' : '0.95rem',
                  cursor: 'pointer',
                  padding: '12px 16px',
                }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {!isMobile && (
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
      )}
    </div>
  );
  }
