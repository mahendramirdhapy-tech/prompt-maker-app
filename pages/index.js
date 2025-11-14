// pages/index.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import { useRouter } from 'next/router';
import Head from 'next/head';

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

  // Page specific SEO data
  const pageTitle = "AI Prompt Maker - Free AI Prompt Generator Tool";
  const pageDescription = "Transform your ideas into perfect AI prompts with our free AI Prompt Generator. Support for multiple AI models including GPT-4, Gemini, Claude, and Llama. No login required.";
  const pageUrl = "https://aipromptmaker.online/";
  const pageImage = "https://aipromptmaker.online/og-image.jpg";

  // Cache system
  const [responseCache, setResponseCache] = useState(new Map());

  // Enhanced responsive detection
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close mobile menu when switching to desktop
      if (!mobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [mobileMenuOpen]);

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

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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

  // SIMPLE FIXED STYLES
  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '12px' : '24px',
      paddingBottom: isMobile ? '80px' : '40px',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      overflowX: 'hidden',
    },

    // SIMPLE HEADER
    header: {
      textAlign: 'center',
      padding: isMobile ? '15px 0' : '30px 0',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      marginBottom: '20px',
      position: 'relative',
    },

    // SIMPLE TEXT LOGO
    mainTitle: {
      fontSize: isMobile ? '1.8rem' : '3rem',
      fontWeight: '900',
      color: '#3b82f6',
      margin: '0 0 8px 0',
      padding: '0',
      lineHeight: '1.1',
    },

    subtitle: {
      fontSize: isMobile ? '0.9rem' : '1.2rem',
      color: darkMode ? '#cbd5e1' : '#64748b',
      margin: '0',
      fontWeight: '500',
    },

    // Mobile Menu Button
    mobileMenuButton: {
      position: 'absolute',
      top: isMobile ? '15px' : '25px',
      left: '15px',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: darkMode ? '#f8fafc' : '#1e293b',
      zIndex: 100,
      padding: '8px',
      borderRadius: '6px',
      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },

    // Navigation container
    navContainer: {
      display: isMobile ? (mobileMenuOpen ? 'flex' : 'none') : 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '15px',
      gap: isMobile ? '12px' : '8px',
      flexWrap: 'wrap',
      position: isMobile ? 'absolute' : 'static',
      top: isMobile ? '100%' : 'auto',
      left: isMobile ? '0' : 'auto',
      right: isMobile ? '0' : 'auto',
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      padding: isMobile ? '16px' : '0',
      borderRadius: isMobile ? '0 0 12px 12px' : '0',
      boxShadow: isMobile ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
      zIndex: isMobile ? 99 : 'auto',
      border: isMobile ? `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` : 'none',
    },

    button: (bg, color = '#fff') => ({
      padding: isMobile ? '8px 12px' : '8px 16px',
      backgroundColor: bg,
      color: color,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      textDecoration: 'none',
    }),

    // Navigation Links Container
    navLinks: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '8px' : '12px',
      alignItems: 'center',
      width: isMobile ? '100%' : 'auto',
    },

    navLink: (isActive = false) => ({
      color: isActive ? '#3b82f6' : (darkMode ? '#cbd5e1' : '#64748b'),
      cursor: 'pointer',
      padding: isMobile ? '10px 12px' : '6px 12px',
      borderRadius: '8px',
      fontSize: isMobile ? '0.9rem' : '0.9rem',
      backgroundColor: isActive ? (darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)') : 'transparent',
      textAlign: isMobile ? 'left' : 'center',
      width: isMobile ? '100%' : 'auto',
      display: 'block',
      border: 'none',
      background: 'none',
      fontFamily: 'inherit',
    }),

    // Action Buttons Container
    actionButtons: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '8px' : '12px',
      alignItems: 'center',
      width: isMobile ? '100%' : 'auto',
    },

    // Generate Button
    generateButton: {
      width: '100%',
      padding: isMobile ? '14px' : '16px',
      backgroundColor: loading || !canGenerate() || !input.trim() 
        ? '#9ca3af' 
        : '#10b981',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: isMobile ? '1rem' : '1.1rem',
      fontWeight: '700',
      cursor: (loading || !canGenerate() || !input.trim()) 
        ? 'not-allowed' 
        : 'pointer',
      marginTop: '10px',
    },

    card: {
      backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '12px',
      padding: isMobile ? '16px' : '20px',
      marginBottom: '16px',
    },

    input: {
      width: '100%',
      padding: isMobile ? '10px' : '12px',
      borderRadius: '8px',
      border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      fontSize: isMobile ? '14px' : '16px',
      marginBottom: '12px',
      boxSizing: 'border-box',
    },
  };

  return (
    <>
      {/* SEO Head Section */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AI Prompt Maker" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        
        {/* Additional Meta Tags */}
        <meta name="keywords" content="AI prompt generator, free AI tools, ChatGPT prompts, content creation, AI writing assistant, GPT-4 prompts, Gemini AI, Claude AI, Llama AI" />
        <meta name="author" content="AI Prompt Maker" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        
        {/* Structured Data for FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is AI Prompt Maker?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "AI Prompt Maker is a free online tool that helps you create perfect AI prompts for various AI models like GPT-4, Gemini, Claude, and Llama. It transforms your basic ideas into well-structured prompts that generate better AI responses."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is AI Prompt Maker free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, AI Prompt Maker is completely free to use. You get 5 free prompts without login, and unlimited access after creating a free account."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which AI models are supported?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We support multiple AI models including Google Gemini Pro, Claude Instant, Meta Llama 3, and Mistral 7B. The system automatically selects the best available model for your prompt."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I use generated prompts for commercial purposes?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, all prompts generated by our tool can be used for personal and commercial purposes without any restrictions."
                  }
                }
              ]
            })
          }}
        />
      </Head>

      <div style={styles.container}>
        {/* SIMPLE HEADER */}
        <header style={styles.header}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              style={styles.mobileMenuButton}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          )}

          <h1 style={styles.mainTitle}>
            AI Prompt Maker
          </h1>
          <p style={styles.subtitle}>
            Transform your ideas into perfect AI prompts
          </p>
          
          {/* Navigation */}
          <div style={styles.navContainer}>
            {/* Navigation Links */}
            <div style={styles.navLinks}>
              <button 
                onClick={() => navigateTo('/')} 
                style={styles.navLink(router.pathname === '/')}
              >
                🏠 Home
              </button>
              <button 
                onClick={() => navigateTo('/seo')} 
                style={styles.navLink(router.pathname === '/seo')}
              >
                🔍 SEO
              </button>
              <button 
                onClick={() => navigateTo('/code')} 
                style={styles.navLink(router.pathname === '/code')}
              >
                💻 Code
              </button>
              <button 
                onClick={() => navigateTo('/email')} 
                style={styles.navLink(router.pathname === '/email')}
              >
                ✉️ Email
              </button>
              <button 
                onClick={() => navigateTo('/translate')} 
                style={styles.navLink(router.pathname === '/translate')}
              >
                🔄 Translate
              </button>
              <button 
                onClick={() => navigateTo('/prompts')} 
                style={styles.navLink(router.pathname === '/prompts')}
              >
                📚 Library
              </button>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                style={styles.button('#8b5cf6')}
              >
                📚 History
              </button>

              {user ? (
                <button onClick={handleLogout} style={styles.button('#6b7280')}>
                  {isMobile ? 'Logout' : 'Logout'}
                </button>
              ) : (
                <button onClick={handleLogin} style={styles.button('#3b82f6')}>
                  {isMobile ? 'Login' : 'Login'}
                </button>
              )}
              
              <button
                onClick={toggleDarkMode}
                style={styles.button(darkMode ? '#4b5563' : '#e5e7eb', darkMode ? '#f9fafb' : '#374151')}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main style={{ 
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '16px' : '20px',
        }}>
          
          {/* Input Section */}
          <div style={{ flex: 1 }}>
            {/* Usage Alert */}
            {!canGenerate() && !user && (
              <div style={{
                ...styles.card,
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                border: '1px solid #f59e0b',
                color: '#92400e',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>🚨</span>
                  <strong style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>Free Limit Reached</strong>
                </div>
                <p style={{ margin: 0, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                  You've used all 5 free prompts. Login for unlimited access!
                </p>
                <button 
                  onClick={handleLogin}
                  style={{
                    ...styles.button('#3b82f6'),
                    marginTop: '10px',
                    width: '100%',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}
                >
                  🔐 Login to Continue
                </button>
              </div>
            )}

            {/* Configuration */}
            <div style={styles.card}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: isMobile ? '1.2rem' : '1.4rem' }}>⚙️ Configuration</h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: isMobile ? '10px' : '12px' 
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    Tone
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
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    Template
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

              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Response Length: {maxTokens} tokens
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

              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Language
                </label>
                <div style={{ display: 'flex', gap: isMobile ? '12px' : '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <input 
                      type="radio" 
                      name="lang" 
                      checked={language === 'English'} 
                      onChange={() => setLanguage('English')} 
                    />
                    English
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <input 
                      type="radio" 
                      name="lang" 
                      checked={language === 'Hindi'} 
                      onChange={() => setLanguage('Hindi')} 
                    />
                    हिंदी
                  </label>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div style={styles.card}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: isMobile ? '1.2rem' : '1.4rem' }}>💡 Your Idea</h2>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you want to create..."
                  rows={isMobile ? 4 : 5}
                  style={{
                    ...styles.input,
                    minHeight: isMobile ? '100px' : '120px',
                    resize: 'vertical',
                  }}
                  required
                />
                
                {loading && generationStatus && (
                  <div style={{
                    padding: isMobile ? '10px' : '12px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    textAlign: 'center',
                    fontSize: isMobile ? '0.8rem' : '0.9rem'
                  }}>
                    {generationStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !canGenerate() || !input.trim()}
                  style={styles.generateButton}
                >
                  {loading ? '⚡ Generating...' : '✨ Generate AI Prompt'}
                </button>
              </form>
            </div>
          </div>

          {/* Output Section */}
          <div style={{ flex: 1 }}>
            {output ? (
              <div style={styles.card}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '8px' : '0'
                }}>
                  <h2 style={{ margin: 0, fontSize: isMobile ? '1.2rem' : '1.4rem' }}>🎉 Your AI Prompt</h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={handleRegenerate}
                      style={styles.button('#10b981')}
                    >
                      🔄
                    </button>
                    <button 
                      onClick={exportTxt}
                      style={styles.button('#8b5cf6')}
                    >
                      💾
                    </button>
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  padding: isMobile ? '12px' : '16px',
                  marginBottom: '12px',
                }}>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0,
                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                    lineHeight: '1.5',
                  }}>
                    {output}
                  </pre>
                </div>
                
                {usedModel && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: isMobile ? '10px' : '12px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: isMobile ? '0.8rem' : '0.9rem'
                  }}>
                    <span>Generated with:</span>
                    <code style={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: isMobile ? '0.75rem' : '0.8rem',
                    }}>
                      {usedModel}
                    </code>
                  </div>
                )}

                {/* Feedback Section */}
                {feedbackGiven === null && (
                  <div style={{
                    padding: isMobile ? '12px' : '16px',
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '12px',
                  }}>
                    <p style={{ 
                      margin: '0 0 10px 0',
                      fontSize: isMobile ? '0.85rem' : '0.9rem',
                      fontWeight: '600',
                    }}>
                      Was this helpful?
                    </p>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
            ) : (
              <div style={{
                ...styles.card,
                textAlign: 'center',
                padding: isMobile ? '30px 16px' : '40px 20px',
              }}>
                <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '12px' }}>🚀</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '1.2rem' : '1.4rem' }}>Ready to Create?</h3>
                <p style={{ 
                  margin: 0, 
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}>
                  Enter your idea above to generate AI prompts
                </p>
              </div>
            )}
          </div>
        </main>

        {/* FOOTER SECTION */}
        <footer style={{
          backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
          padding: isMobile ? '30px 16px 16px' : '40px 20px 20px',
          marginTop: '40px',
          borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '20px' : '30px',
            marginBottom: '20px'
          }}>
            
            {/* Company Info */}
            <div>
              <h3 style={{
                color: darkMode ? '#f8fafc' : '#1e293b',
                margin: '0 0 12px 0',
                fontSize: isMobile ? '1rem' : '1.1rem'
              }}>
                AI Prompt Maker
              </h3>
              <p style={{
                color: darkMode ? '#cbd5e1' : '#64748b',
                margin: '0 0 12px 0',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                lineHeight: '1.5'
              }}>
                Transform your ideas into perfect AI prompts with our advanced multi-model AI technology. Free tool for creators, writers, and developers.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ 
                  padding: '6px 10px', 
                  backgroundColor: darkMode ? '#334155' : '#e2e8f0',
                  borderRadius: '6px',
                  fontSize: isMobile ? '0.7rem' : '0.8rem',
                  fontWeight: '500'
                }}>
                  🚀 Fast
                </span>
                <span style={{ 
                  padding: '6px 10px', 
                  backgroundColor: darkMode ? '#334155' : '#e2e8f0',
                  borderRadius: '6px',
                  fontSize: isMobile ? '0.7rem' : '0.8rem',
                  fontWeight: '500'
                }}>
                  🔒 Secure
                </span>
                <span style={{ 
                  padding: '6px 10px', 
                  backgroundColor: darkMode ? '#334155' : '#e2e8f0',
                  borderRadius: '6px',
                  fontSize: isMobile ? '0.7rem' : '0.8rem',
                  fontWeight: '500'
                }}>
                  🎯 AI Powered
                </span>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 style={{
                color: darkMode ? '#f8fafc' : '#1e293b',
                margin: '0 0 12px 0',
                fontSize: isMobile ? '1rem' : '1.1rem'
              }}>
                Quick Links
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button onClick={() => navigateTo('/')} style={{
                  color: darkMode ? '#93c5fd' : '#3b82f6',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                }}>
                  🏠 Home
                </button>
                <button onClick={() => navigateTo('/seo')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                }}>
                  🔍 SEO Tools
                </button>
                <button onClick={() => navigateTo('/code')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                }}>
                  💻 Code Assistant
                </button>
                <button onClick={() => navigateTo('/email')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                }}>
                  ✉️ Email Writer
                </button>
                <button onClick={() => navigateTo('/translate')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                }}>
                  🔄 Translator
                </button>
              </div>
            </div>
            
            {/* Support */}
            <div>
              <h3 style={{
                color: darkMode ? '#f8fafc' : '#1e293b',
                margin: '0 0 12px 0',
                fontSize: isMobile ? '1rem' : '1.1rem'
              }}>
                Support
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button onClick={() => navigateTo('/help')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                }}>
                  ❓ Help Center
                </button>
                <button onClick={() => navigateTo('/contact')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                }}>
                  📧 Contact Us
                </button>
                <button onClick={() => navigateTo('/feedback')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                }}>
                  💬 Feedback
                </button>
                <button onClick={() => navigateTo('/blog')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                }}>
                  📚 Blog
                </button>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div style={{
            borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            paddingTop: isMobile ? '15px' : '20px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: isMobile ? '15px' : '20px',
              marginBottom: isMobile ? '12px' : '15px',
              flexWrap: 'wrap'
            }}>
              <button onClick={() => navigateTo('/privacy')} style={{
                color: darkMode ? '#93c5fd' : '#3b82f6',
                cursor: 'pointer',
                fontSize: isMobile ? '0.75rem' : '0.8rem',
                background: 'none',
                border: 'none',
                padding: '0',
              }}>
                Privacy Policy
              </button>
              <button onClick={() => navigateTo('/terms')} style={{
                color: darkMode ? '#93c5fd' : '#3b82f6',
                cursor: 'pointer',
                fontSize: isMobile ? '0.75rem' : '0.8rem',
                background: 'none',
                border: 'none',
                padding: '0',
              }}>
                Terms of Service
              </button>
              <button onClick={() => navigateTo('/cookies')} style={{
                color: darkMode ? '#93c5fd' : '#3b82f6',
                cursor: 'pointer',
                fontSize: isMobile ? '0.75rem' : '0.8rem',
                background: 'none',
                border: 'none',
                padding: '0',
              }}>
                Cookie Policy
              </button>
            </div>
            
            <p style={{ 
              margin: '0', 
              color: darkMode ? '#94a3b8' : '#475569',
              fontSize: isMobile ? '0.75rem' : '0.8rem',
              lineHeight: '1.5'
            }}>
              © 2024 AI Prompt Maker. All rights reserved. 
              <br />
              Powered by multiple AI models • Made with ❤️ for creators worldwide
            </p>
          </div>
        </footer>

        {/* HISTORY MODAL */}
        {showHistory && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: isMobile ? '10px' : '20px'
          }}>
            <div style={{
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              borderRadius: '12px',
              padding: isMobile ? '16px' : '20px',
              width: isMobile ? '100%' : '600px',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '10px',
                borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
              }}>
                <h2 style={{ 
                  margin: 0, 
                  color: darkMode ? '#f8fafc' : '#1e293b',
                  fontSize: isMobile ? '1.3rem' : '1.5rem'
                }}>
                  📚 Prompt History
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: isMobile ? '1.3rem' : '1.5rem',
                    cursor: 'pointer',
                    color: darkMode ? '#94a3b8' : '#64748b',
                    padding: '5px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* History List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '16px'
              }}>
                {promptHistory.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: darkMode ? '#94a3b8' : '#64748b'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📝</div>
                    <h3 style={{ margin: '0 0 10px 0' }}>No History Yet</h3>
                    <p style={{ margin: 0 }}>Your generated prompts will appear here</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {promptHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        style={{
                          backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                          border: `1px solid ${selectedHistory?.id === item.id ? '#3b82f6' : (darkMode ? '#334155' : '#e2e8f0')}`,
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = darkMode ? '#1e40af20' : '#3b82f610';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = darkMode ? '#0f172a' : '#f8fafc';
                        }}
                      >
                        {/* Delete Button */}
                        <button
                          onClick={(e) => deleteHistoryItem(item.id, e)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            fontSize: '0.8rem'
                          }}
                          title="Delete this history"
                        >
                          🗑️
                        </button>

                        {/* History Content */}
                        <div style={{ marginRight: '40px' }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px'
                          }}>
                            <strong style={{
                              color: darkMode ? '#f8fafc' : '#1e293b',
                              fontSize: isMobile ? '0.9rem' : '1rem'
                            }}>
                              {item.input.substring(0, 60)}{item.input.length > 60 ? '...' : ''}
                            </strong>
                            <span style={{
                              color: darkMode ? '#94a3b8' : '#64748b',
                              fontSize: isMobile ? '0.7rem' : '0.8rem',
                              whiteSpace: 'nowrap'
                            }}>
                              {formatDate(item.timestamp)}
                            </span>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap',
                            marginBottom: '6px'
                          }}>
                            <span style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              color: '#3b82f6',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: isMobile ? '0.7rem' : '0.75rem'
                            }}>
                              {item.tone}
                            </span>
                            <span style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              color: '#10b981',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: isMobile ? '0.7rem' : '0.75rem'
                            }}>
                              {item.model}
                            </span>
                          </div>

                          <p style={{
                            margin: 0,
                            color: darkMode ? '#cbd5e1' : '#64748b',
                            fontSize: isMobile ? '0.8rem' : '0.85rem',
                            lineHeight: '1.4'
                          }}>
                            {item.output.substring(0, 80)}{item.output.length > 80 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              {promptHistory.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  <span style={{
                    color: darkMode ? '#94a3b8' : '#64748b',
                    fontSize: isMobile ? '0.8rem' : '0.9rem'
                  }}>
                    {promptHistory.length} prompts
                  </span>
                  <button
                    onClick={clearHistory}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: isMobile ? '0.8rem' : '0.9rem',
                      fontWeight: '600'
                    }}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add basic CSS */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}
