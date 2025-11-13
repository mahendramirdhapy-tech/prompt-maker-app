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
  const [promptHistory, setPromptHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
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

  // Load history from localStorage on component mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem('promptHistory');
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          // Sort by timestamp descending (newest first)
          history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setPromptHistory(history);
        }
      } catch (error) {
        console.error('Error loading history:', error);
      }
    };

    loadHistory();
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

  // Save history to localStorage whenever promptHistory changes
  useEffect(() => {
    const saveHistory = () => {
      try {
        localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
      } catch (error) {
        console.error('Error saving history:', error);
      }
    };

    saveHistory();
  }, [promptHistory]);

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

  // Add to history function
  const addToHistory = (promptData) => {
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      input: promptData.input,
      output: promptData.output,
      model: promptData.model,
      tone: promptData.tone,
      language: promptData.language,
      template: promptData.template,
      maxTokens: promptData.maxTokens
    };

    setPromptHistory(prev => {
      const newHistory = [historyItem, ...prev];
      // Keep only last 100 items to prevent localStorage overflow
      return newHistory.slice(0, 100);
    });
  };

  // Load from history function
  const loadFromHistory = (historyItem) => {
    setInput(historyItem.input);
    setOutput(historyItem.output);
    setUsedModel(historyItem.model);
    setTone(historyItem.tone);
    setLanguage(historyItem.language);
    setTemplate(historyItem.template);
    setMaxTokens(historyItem.maxTokens);
    setSelectedHistory(historyItem);
    setShowHistory(false);
  };

  // Clear history function
  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      setPromptHistory([]);
      localStorage.removeItem('promptHistory');
    }
  };

  // Delete single history item
  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    setPromptHistory(prev => prev.filter(item => item.id !== id));
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

      // Add to local history
      addToHistory({
        input: input.trim(),
        output: result.prompt,
        model: result.modelLabel,
        tone,
        language,
        template,
        maxTokens
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

  // Format date for history display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  };

  // Professional styling variables - TEXT ONLY LOGO
  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 12px' : '0 24px',
      paddingBottom: isMobile ? '80px' : '40px',
      minHeight: '100vh',
      background: 'var(--bg-primary, #ffffff)',
      color: 'var(--text-primary, #1e293b)',
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
    },

    // Centered Header with Text Logo at Top
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '20px 0 16px 0' : '32px 0 24px 0',
      borderBottom: `1px solid var(--border-color, #e2e8f0)`,
      marginBottom: '24px',
      width: '100%',
      boxSizing: 'border-box',
      gap: '16px',
    },

    // Centered Logo Container
    logoContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      width: '100%',
      textAlign: 'center',
    },

    // Text Only Logo - Beautiful Styling
    logoText: {
      fontSize: isMobile ? '2rem' : '2.8rem',
      fontWeight: '900',
      background: 'linear(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textDecoration: 'none',
      cursor: 'pointer',
      textAlign: 'center',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
      margin: 0,
      padding: 0,
    },

    logoSubtitle: {
      fontSize: isMobile ? '0.9rem' : '1.1rem',
      color: 'var(--text-secondary, #64748b)',
      fontWeight: '500',
      textAlign: 'center',
      maxWidth: '500px',
      lineHeight: '1.4',
      margin: 0,
    },

    // Navigation Row Below Logo
    navRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      flexWrap: 'wrap',
      gap: '12px',
    },

    button: (bg, color = '#fff') => ({
      padding: isMobile ? '12px 16px' : '10px 20px',
      backgroundColor: bg,
      color: color,
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: isMobile ? '0.9rem' : '0.9rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      minHeight: isMobile ? '44px' : '44px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      flexShrink: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      ':hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      },
    }),

    // Generate Button with Proper Colors
    generateButton: {
      width: '100%',
      padding: isMobile ? '18px' : '20px',
      background: loading || !canGenerate() || !input.trim() 
        ? 'linear(135deg, #9ca3af, #6b7280)' 
        : 'linear(135deg, #10b981, #059669, #047857)',
      color: '#fff',
      border: 'none',
      borderRadius: '16px',
      fontSize: isMobile ? '1.1rem' : '1.2rem',
      fontWeight: '700',
      cursor: (loading || !canGenerate() || !input.trim()) 
        ? 'not-allowed' 
        : 'pointer',
      transition: 'all 0.3s ease',
      minHeight: '64px',
      opacity: (loading || !canGenerate() || !input.trim()) ? 0.6 : 1,
      boxShadow: (loading || !canGenerate() || !input.trim()) 
        ? '0 2px 4px rgba(0,0,0,0.1)' 
        : '0 4px 12px rgba(16, 185, 129, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      ':hover': (loading || !canGenerate() || !input.trim()) 
        ? {} 
        : {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
            background: 'linear(135deg, #059669, #047857, #065f46)',
          },
    },

    navLink: (isActive = false) => ({
      color: isActive ? '#3b82f6' : 'var(--text-secondary, #64748b)',
      textDecoration: 'none',
      fontWeight: isActive ? '600' : '500',
      padding: isMobile ? '10px 12px' : '10px 16px',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      flexShrink: 0,
      whiteSpace: 'nowrap',
      ':hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        color: '#3b82f6',
      },
    }),

    card: {
      backgroundColor: 'var(--bg-secondary, #f8fafc)',
      border: `1px solid var(--border-color, #e2e8f0)`,
      borderRadius: '16px',
      padding: isMobile ? '16px' : '24px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      width: '100%',
      boxSizing: 'border-box',
    },

    input: {
      width: '100%',
      padding: isMobile ? '14px' : '14px',
      borderRadius: '12px',
      border: `1px solid var(--border-color, #e2e8f0)`,
      backgroundColor: 'var(--bg-primary, #ffffff)',
      color: 'var(--text-primary, #1e293b)',
      fontSize: '16px',
      marginBottom: '16px',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      WebkitAppearance: 'none',
      ':focus': {
        outline: 'none',
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* Enhanced Header with Text Only Logo */}
      <header style={styles.header}>
        {/* Text Logo Container - Centered at Top */}
        <div style={styles.logoContainer}>
          <h1 
            onClick={() => navigateTo('/')} 
            style={styles.logoText}
          >
            AI Prompt Maker
          </h1>
          <p style={styles.logoSubtitle}>
            Transform your ideas into perfect AI prompts with multiple AI models
          </p>
        </div>

        {/* Navigation Row */}
        <div style={styles.navRow}>
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              flexWrap: 'wrap',
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2px',
                flexWrap: 'wrap'
              }}>
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
            </nav>
          )}

          {/* Right Side Actions */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            width: isMobile ? '100%' : 'auto',
          }}>
            {/* History Button */}
            {!isMobile && (
              <button 
                onClick={() => setShowHistory(!showHistory)}
                style={styles.button('#8b5cf6')}
                title="View History"
              >
                <span>📚</span>
                History ({promptHistory.length})
              </button>
            )}

            {user ? (
              <>
                <span style={{ 
                  color: 'var(--text-secondary, #64748b)', 
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}>
                  👋 {user.email?.split('@')[0]}
                </span>
                <button onClick={handleLogout} style={styles.button('#6b7280')}>
                  Logout
                </button>
              </>
            ) : (
              <button onClick={handleLogin} style={styles.button('#3b82f6')}>
                <span>🔐</span>
                {isMobile ? 'Login' : 'Login'}
              </button>
            )}
            
            <button
              onClick={toggleDarkMode}
              style={styles.button(darkMode ? '#4b5563' : '#e5e7eb', darkMode ? '#f9fafb' : '#374151')}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Mobile Menu Button */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Mobile History Button */}
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  style={{
                    ...styles.button('#8b5cf6'),
                    padding: '10px 12px',
                  }}
                  title="History"
                >
                  <span>📚</span>
                  {promptHistory.length > 0 && (
                    <span style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: '18px', 
                      height: '18px', 
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '4px'
                    }}>
                      {promptHistory.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary, #1e293b)',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    padding: '8px',
                    flexShrink: 0,
                  }}
                >
                  {mobileMenuOpen ? '✕' : '☰'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Rest of the code remains exactly the same */}
      {/* Only the header section has been updated */}

      {/* Main Content Grid */}
      <main style={{ 
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '20px',
        alignItems: 'stretch',
        marginRight: showHistory && !isMobile ? '400px' : '0',
        transition: 'margin-right 0.3s ease',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        
        {/* Left Column - Input Section */}
        <div style={{ 
          flex: isMobile ? '0 0 auto' : '1',
          width: '100%',
          minWidth: 0,
        }}>
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
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '700' }}>
              ⚙️ Configuration
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Tone & Template Row */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: '12px' 
              }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)', marginTop: '4px' }}>
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
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '700' }}>
              💡 Your Idea
            </h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you want to create... (e.g., 'a social media post about climate change')"
                rows={isMobile ? 5 : 6}
                style={{
                  ...styles.input,
                  resize: 'vertical',
                  minHeight: isMobile ? '120px' : '140px',
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

              {/* Generate Button with Proper Colors */}
              <button
                type="submit"
                disabled={loading || !canGenerate() || !input.trim()}
                style={styles.generateButton}
              >
                {loading ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite', fontSize: '1.2em' }}>⚡</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '1.3em' }}>✨</span>
                    Generate AI Prompt
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Output Section */}
        <div style={{ 
          flex: isMobile ? '0 0 auto' : '1',
          width: '100%',
          minWidth: 0,
        }}>
          {output && (
            <div style={styles.card}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '1.1rem', 
                  fontWeight: '700',
                  flex: 1,
                  minWidth: '200px'
                }}>
                  🎉 Your AI Prompt
                </h2>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button 
                    onClick={handleRegenerate}
                    disabled={loading}
                    style={{
                      ...styles.button('#10b981'),
                      opacity: loading ? 0.6 : 1,
                      padding: '10px 12px',
                    }}
                    title="Regenerate"
                  >
                    🔄
                  </button>
                  <button 
                    onClick={exportTxt}
                    style={{
                      ...styles.button('#8b5cf6'),
                      padding: '10px 12px',
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
                padding: '16px',
                marginBottom: '16px',
                position: 'relative',
                overflow: 'auto',
                maxHeight: isMobile ? '300px' : '400px',
              }}>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '0.9rem',
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
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #64748b)' }}>
                    Generated with:
                  </span>
                  <code style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
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
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--text-primary, #1e293b)'
                  }}>
                    Was this helpful?
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
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
              padding: isMobile ? '32px 20px' : '40px 24px',
              color: 'var(--text-secondary, #64748b)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600' }}>
                Ready to Create Magic?
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Enter your idea above and watch as AI transforms it into the perfect prompt!
              </p>
              
              {/* History Preview */}
              {promptHistory.length > 0 && (
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px solid var(--border-color, #e2e8f0)` }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: '600' }}>
                    📚 Recent Prompts: {promptHistory.length}
                  </p>
                  <button 
                    onClick={() => setShowHistory(true)}
                    style={styles.button('#8b5cf6')}
                  >
                    View History
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 767px) {
          body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  );
}
