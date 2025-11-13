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

// AI Models with fallback priority
const AI_MODELS = [
  { name: 'gemini-pro', label: 'Google Gemini Pro', free: true },
  { name: 'claude-instant', label: 'Claude Instant', free: true },
  { name: 'llama-3', label: 'Meta Llama 3', free: true },
  { name: 'mistral', label: 'Mistral 7B', free: true },
];

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
  const [generationStatus, setGenerationStatus] = useState('');
  const router = useRouter();

  // Cache system
  const [responseCache, setResponseCache] = useState(new Map());

  // Enhanced responsive detection
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Enhanced dark mode with professional theme
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    updateDarkModeStyles(isDark);
  }, []);

  const updateDarkModeStyles = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#cbd5e1');
      root.style.setProperty('--border-color', '#334155');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
    }
  };

  // Enhanced user initialization
  useEffect(() => {
    const initUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // Load usage count
      const count = parseInt(localStorage.getItem('guestUsage') || '0');
      setUsageCount(count);
      
      // Load cache from localStorage
      const savedCache = localStorage.getItem('responseCache');
      if (savedCache) {
        setResponseCache(new Map(JSON.parse(savedCache)));
      }
    };

    initUser();

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

  // Enhanced cache management
  const saveToCache = (key, data) => {
    const newCache = new Map(responseCache);
    newCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: 30 * 60 * 1000 // 30 minutes
    });
    
    // Keep only last 50 entries
    if (newCache.size > 50) {
      const firstKey = newCache.keys().next().value;
      newCache.delete(firstKey);
    }
    
    setResponseCache(newCache);
    localStorage.setItem('responseCache', JSON.stringify(Array.from(newCache.entries())));
  };

  const getFromCache = (key) => {
    const cached = responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  };

  // Enhanced generation with multiple fallbacks
  const generateWithFallback = async (inputData, retryCount = 0) => {
    const cacheKey = JSON.stringify(inputData);
    const cachedResponse = getFromCache(cacheKey);
    
    if (cachedResponse) {
      setGenerationStatus('🚀 Using cached response...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      return cachedResponse;
    }

    // Try models in sequence with retry logic
    for (let i = 0; i < AI_MODELS.length; i++) {
      const model = AI_MODELS[i];
      setGenerationStatus(`🔄 Trying ${model.label}...`);
      
      try {
        const response = await callModelAPI(model.name, inputData);
        
        if (response && response.success) {
          const result = {
            prompt: response.prompt,
            modelUsed: model.name,
            modelLabel: model.label,
            cached: false
          };
          
          // Save to cache
          saveToCache(cacheKey, result);
          return result;
        }
      } catch (error) {
        console.warn(`${model.label} failed:`, error.message);
        
        // If last model failed and we have retries left, retry
        if (i === AI_MODELS.length - 1 && retryCount < 2) {
          setGenerationStatus(`🔄 Retrying with different approach... (${retryCount + 1}/2)`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return generateWithFallback(inputData, retryCount + 1);
        }
      }
      
      // Small delay between model attempts
      if (i < AI_MODELS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    throw new Error('All AI models are currently unavailable. Please try again in a moment.');
  };

  const callModelAPI = async (model, inputData) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...inputData,
        model: model
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Generation failed');
    }

    return data;
  };

  const canGenerate = () => user || usageCount < 5;

  // Enhanced submit handler with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !canGenerate()) return;

    setLoading(true);
    setOutput('');
    setUsedModel('');
    setFeedbackGiven(null);
    setGenerationStatus('🚀 Starting generation...');

    try {
      const inputData = {
        idea: input,
        language,
        tone,
        maxTokens,
        type: 'prompt'
      };

      const result = await generateWithFallback(inputData);

      setOutput(result.prompt);
      setUsedModel(result.modelLabel);

      // Save to database
      await supabase.from('prompts').insert({
        user_id: user?.id || null,
        input: input.trim(),
        output: result.prompt,
        model_used: result.modelUsed,
        language,
        tone,
        max_tokens: maxTokens,
        type: 'prompt',
      });

      // Update usage for guests
      if (!user) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('guestUsage', newCount.toString());
        if (newCount >= 5) setShowLoginModal(true);
      }

      setGenerationStatus('✅ Generation completed!');

    } catch (err) {
      console.error('Generation error:', err);
      setGenerationStatus('❌ Generation failed');
      
      // Enhanced error messages
      if (err.message.includes('unavailable')) {
        alert('😔 All AI services are currently busy. Please try again in 30 seconds.');
      } else if (err.message.includes('rate limit')) {
        alert('⚡ Too many requests. Please wait a moment before trying again.');
      } else {
        alert('❌ ' + err.message);
      }
    } finally {
      setLoading(false);
      setTimeout(() => setGenerationStatus(''), 3000);
    }
  };

  const handleRegenerate = () => {
    if (input.trim()) {
      handleSubmit({ preventDefault: () => {} });
    }
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
    a.download = `ai-prompt-${Date.now()}.txt`;
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

  // Professional styling variables
  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 16px' : '0 24px',
      paddingBottom: isMobile ? '80px' : '40px',
      minHeight: '100vh',
      background: 'var(--bg-primary, #ffffff)',
      color: 'var(--text-primary, #1e293b)',
    },

    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isMobile ? '20px 0' : '24px 0',
      borderBottom: `1px solid var(--border-color, #e2e8f0)`,
      marginBottom: '32px',
    },

    logo: {
      fontSize: isMobile ? '1.5rem' : '1.75rem',
      fontWeight: '800',
      background: 'linear(135deg, #667eea 0%, #764ba2 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
    },

    button: (bg, color = '#fff') => ({
      padding: isMobile ? '12px 20px' : '10px 20px',
      backgroundColor: bg,
      color: color,
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: isMobile ? '0.95rem' : '0.9rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      minHeight: isMobile ? '48px' : '44px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      ':hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      },
    }),

    navLink: (isActive = false) => ({
      color: isActive ? '#3b82f6' : 'var(--text-secondary, #64748b)',
      textDecoration: 'none',
      fontWeight: isActive ? '600' : '500',
      padding: '10px 16px',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      ':hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        color: '#3b82f6',
      },
    }),

    card: {
      backgroundColor: 'var(--bg-secondary, #f8fafc)',
      border: `1px solid var(--border-color, #e2e8f0)`,
      borderRadius: '16px',
      padding: isMobile ? '20px' : '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },

    input: {
      width: '100%',
      padding: isMobile ? '16px' : '14px',
      borderRadius: '12px',
      border: `1px solid var(--border-color, #e2e8f0)`,
      backgroundColor: 'var(--bg-primary, #ffffff)',
      color: 'var(--text-primary, #1e293b)',
      fontSize: '1rem',
      marginBottom: '16px',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      ':focus': {
        outline: 'none',
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* Enhanced Header */}
      <header style={styles.header}>
        <div onClick={() => navigateTo('/')} style={styles.logo}>
          <div style={{ fontSize: '1.5em' }}>🚀</div>
          PromptCraft
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span onClick={() => navigateTo('/')} style={styles.navLink(router.pathname === '/')}>
                🏠 Home
              </span>
              <span onClick={() => navigateTo('/seo')} style={styles.navLink(router.pathname === '/seo')}>
                🔍 SEO
              </span>
              <span onClick={() => navigateTo('/code')} style={styles.navLink(router.pathname === '/code')}>
                💻 Code
              </span>
              <span onClick={() => navigateTo('/email')} style={styles.navLink(router.pathname === '/email')}>
                ✉️ Email
              </span>
              <span onClick={() => navigateTo('/translate')} style={styles.navLink(router.pathname === '/translate')}>
                🔄 Translate
              </span>
              <span onClick={() => navigateTo('/blog-outline')} style={styles.navLink(router.pathname === '/blog-outline')}>
                📝 Outline
              </span>
              <span onClick={() => navigateTo('/blog')} style={styles.navLink(router.pathname === '/blog')}>
                📚 Blog
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '20px' }}>
              {user ? (
                <>
                  <span style={{ color: 'var(--text-secondary, #64748b)', fontSize: '0.9rem' }}>
                    👋 Welcome, {user.email?.split('@')[0]}
                  </span>
                  <button onClick={handleLogout} style={styles.button('#6b7280')}>
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={handleLogin} style={styles.button('#3b82f6')}>
                  <span>🔐</span>
                  Login
                </button>
              )}
              
              <button
                onClick={toggleDarkMode}
                style={styles.button(darkMode ? '#4b5563' : '#e5e7eb', darkMode ? '#f9fafb' : '#374151')}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </nav>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary, #1e293b)',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '8px',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </header>

      {/* Mobile Menu */}
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
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary, #ffffff)',
            borderRadius: '20px',
            padding: '24px',
            flex: 1,
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <span onClick={() => navigateTo('/')} style={styles.navLink(router.pathname === '/')}>
                🏠 Home
              </span>
              <span onClick={() => navigateTo('/seo')} style={styles.navLink(router.pathname === '/seo')}>
                🔍 SEO Tools
              </span>
              <span onClick={() => navigateTo('/code')} style={styles.navLink(router.pathname === '/code')}>
                💻 Code Assistant
              </span>
              <span onClick={() => navigateTo('/email')} style={styles.navLink(router.pathname === '/email')}>
                ✉️ Email Writer
              </span>
              <span onClick={() => navigateTo('/translate')} style={styles.navLink(router.pathname === '/translate')}>
                🔄 Translator
              </span>
              <span onClick={() => navigateTo('/blog-outline')} style={styles.navLink(router.pathname === '/blog-outline')}>
                📝 Blog Outline
              </span>
              <span onClick={() => navigateTo('/blog')} style={styles.navLink(router.pathname === '/blog')}>
                📚 Blog Articles
              </span>
            </div>

            <div style={{ paddingTop: '20px', borderTop: `1px solid var(--border-color, #e2e8f0)` }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ color: '#3b82f6', fontSize: '1rem', fontWeight: '600' }}>
                    👋 Hello, {user.email?.split('@')[0]}
                  </div>
                  <button onClick={handleLogout} style={styles.button('#ef4444')}>
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} style={styles.button('#3b82f6')}>
                  🔐 Login with Google
                </button>
              )}
              
              <button
                onClick={toggleDarkMode}
                style={styles.button('#6b7280', '#ffffff')}
              >
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <main style={{ 
        display: 'grid', 
        gap: '24px',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        alignItems: 'start'
      }}>
        
        {/* Left Column - Input Section */}
        <div>
          {/* Usage Alert */}
          {!canGenerate() && !user && (
            <div style={{
              ...styles.card,
              background: 'linear(135deg, #fef3c7, #fde68a)',
              border: '1px solid #f59e0b',
              color: '#92400e',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🚨</span>
                <strong>Free Limit Reached</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                You've used all 5 free prompts. Login for unlimited access!
              </p>
              <button 
                onClick={handleLogin}
                style={{
                  ...styles.button('#3b82f6'),
                  marginTop: '12px',
                  width: '100%'
                }}
              >
                🔐 Login to Continue
              </button>
            </div>
          )}

          {/* Configuration Card */}
          <div style={styles.card}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '700' }}>
              ⚙️ Configuration
            </h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Tone & Template Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem' }}>
                    🎵 Tone
                  </label>
                  <select 
                    value={tone} 
                    onChange={(e) => setTone(e.target.value)} 
                    style={styles.input}
                  >
                    {TONES.map(toneOption => (
                      <option key={toneOption} value={toneOption}>{toneOption}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem' }}>
                    📝 Template
                  </label>
                  <select 
                    value={template} 
                    onChange={handleTemplateChange} 
                    style={styles.input}
                  >
                    {TEMPLATES.map(template => (
                      <option key={template.value} value={template.value}>{template.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tokens Slider */}
              <div>
                <label style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  fontSize: '0.9rem'
                }}>
                  <span>📏 Response Length</span>
                  <span style={{ color: '#3b82f6' }}>{maxTokens} tokens</span>
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
                    height: '6px',
                    borderRadius: '5px',
                    background: 'linear(90deg, #3b82f6 0%, #3b82f6 ' + ((maxTokens - 200) / 600 * 100) + '%, #e2e8f0 ' + ((maxTokens - 200) / 600 * 100) + '%, #e2e8f0 100%)',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary, #64748b)', marginTop: '4px' }}>
                  <span>Short</span>
                  <span>Long</span>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
                  🌐 Language
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="lang" 
                      checked={language === 'English'} 
                      onChange={() => setLanguage('English')} 
                      style={{ transform: 'scale(1.1)' }}
                    />
                    <span>🇺🇸 English</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="lang" 
                      checked={language === 'Hindi'} 
                      onChange={() => setLanguage('Hindi')} 
                      style={{ transform: 'scale(1.1)' }}
                    />
                    <span>🇮🇳 हिंदी</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Input Card */}
          <div style={styles.card}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: '700' }}>
              💡 Your Idea
            </h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you want to create... (e.g., 'a social media post about climate change')"
                rows={6}
                style={{
                  ...styles.input,
                  resize: 'vertical',
                  minHeight: '140px',
                  fontSize: '16px',
                }}
                required
              />
              
              {/* Generation Status */}
              {loading && generationStatus && (
                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.9rem',
                  color: '#3b82f6',
                  textAlign: 'center',
                }}>
                  {generationStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !canGenerate() || !input.trim()}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading || !canGenerate() || !input.trim() 
                    ? 'linear(135deg, #9ca3af, #6b7280)' 
                    : 'linear(135deg, #3b82f6, #1d4ed8)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (loading || !canGenerate() || !input.trim()) 
                    ? 'not-allowed' 
                    : 'pointer',
                  transition: 'all 0.2s ease',
                  minHeight: '56px',
                  opacity: (loading || !canGenerate() || !input.trim()) ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite' }}>⚡</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Generate AI Prompt
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Output Section */}
        <div>
          {output && (
            <div style={styles.card}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px' 
              }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                  🎉 Your AI Prompt
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={handleRegenerate}
                    disabled={loading}
                    style={{
                      ...styles.button('#10b981'),
                      opacity: loading ? 0.6 : 1,
                      padding: '10px',
                    }}
                    title="Regenerate"
                  >
                    🔄
                  </button>
                  <button 
                    onClick={exportTxt}
                    style={{
                      ...styles.button('#8b5cf6'),
                      padding: '10px',
                    }}
                    title="Download"
                  >
                    💾
                  </button>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'var(--bg-primary, #ffffff)',
                border: `1px solid var(--border-color, #e2e8f0)`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                position: 'relative',
              }}>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  margin: 0,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}>
                  {output}
                </pre>
              </div>
              
              {/* Model Info */}
              {usedModel && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #64748b)' }}>
                    Generated with:
                  </span>
                  <code style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                  }}>
                    {usedModel}
                  </code>
                </div>
              )}
              
              {/* Feedback Section */}
              {feedbackGiven === null && (
                <div style={{
                  padding: '16px',
                  backgroundColor: 'rgba(248, 250, 252, 0.8)',
                  border: `1px solid var(--border-color, #e2e8f0)`,
                  borderRadius: '12px',
                }}>
                  <p style={{ 
                    margin: '0 0 12px 0',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: 'var(--text-primary, #1e293b)'
                  }}>
                    Was this helpful?
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleFeedback(true)}
                      style={styles.button('#22c55e')}
                    >
                      👍 Yes
                    </button>
                    <button 
                      onClick={() => handleFeedback(false)}
                      style={styles.button('#ef4444')}
                    >
                      👎 No
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!output && (
            <div style={{
              ...styles.card,
              textAlign: 'center',
              padding: '40px 24px',
              color: 'var(--text-secondary, #64748b)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: '600' }}>
                Ready to Create Magic?
              </h3>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                Enter your idea above and watch as AI transforms it into the perfect prompt!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Login Modal */}
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
            backgroundColor: 'var(--bg-primary, #ffffff)',
            padding: isMobile ? '32px 24px' : '32px',
            borderRadius: '20px',
            textAlign: 'center',
            maxWidth: isMobile ? '100%' : '400px',
            width: isMobile ? '100%' : '90%',
            border: `1px solid var(--border-color, #e2e8f0)`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ 
              margin: '0 0 12px',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary, #1e293b)'
            }}>
              Unlock Unlimited Access!
            </h3>
            <p style={{ 
              margin: '0 0 32px', 
              color: 'var(--text-secondary, #64748b)',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              Login with Google to generate unlimited AI prompts and access all features.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
              <button 
                onClick={handleLogin} 
                style={{
                  ...styles.button('#3b82f6', '#fff'),
                  flex: isMobile ? 1 : 'none',
                }}
              >
                <span>🔐</span>
                Continue with Google
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                style={{ 
                  ...styles.button('#6b7280', '#fff'),
                  flex: isMobile ? 1 : 'none',
                }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Footer */}
      {!isMobile && (
        <footer style={{ 
          textAlign: 'center', 
          padding: '32px 0 24px 0',
          marginTop: '40px',
          borderTop: `1px solid var(--border-color, #e2e8f0)`,
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '24px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #64748b)' }}>
              🔒 Secure & Private
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #64748b)' }}>
              ⚡ Multiple AI Models
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #64748b)' }}>
              🎯 Professional Quality
            </span>
          </div>
          <p style={{ 
            margin: 0, 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary, #64748b)',
          }}>
            Powered by Advanced AI • Made with ❤️ for Creators
          </p>
        </footer>
      )}

      {/* Add some CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
