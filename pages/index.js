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

  // SIMPLE FIXED STYLES - No complex CSS that might break
  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 12px' : '0 24px',
      paddingBottom: isMobile ? '80px' : '40px',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      overflowX: 'hidden',
    },

    // SIMPLE HEADER - Fixed display issue
    header: {
      textAlign: 'center',
      padding: isMobile ? '20px 0' : '30px 0',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      marginBottom: '30px',
    },

    // SIMPLE TEXT LOGO - No gradient, just solid color
    mainTitle: {
      fontSize: isMobile ? '2rem' : '3rem',
      fontWeight: '900',
      color: '#3b82f6', // Solid blue color instead of gradient
      margin: '0 0 8px 0',
      padding: '0',
      lineHeight: '1.1',
    },

    subtitle: {
      fontSize: isMobile ? '1rem' : '1.2rem',
      color: darkMode ? '#cbd5e1' : '#64748b',
      margin: '0',
      fontWeight: '500',
    },

    // Navigation container
    navContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
      flexWrap: 'wrap',
      gap: '10px',
    },

    button: (bg, color = '#fff') => ({
      padding: isMobile ? '10px 14px' : '8px 16px',
      backgroundColor: bg,
      color: color,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '0.9rem' : '0.9rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    }),

    // Generate Button - SIMPLE VERSION
    generateButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: loading || !canGenerate() || !input.trim() 
        ? '#9ca3af' 
        : '#10b981',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
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
      padding: '20px',
      marginBottom: '20px',
    },

    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      fontSize: '16px',
      marginBottom: '16px',
      boxSizing: 'border-box',
    },
  };

  return (
    <div style={styles.container}>
      {/* SIMPLE HEADER - Guaranteed to display */}
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>
          AI Prompt Maker
        </h1>
        <p style={styles.subtitle}>
          Transform your ideas into perfect AI prompts
        </p>
        
        {/* Navigation */}
        <div style={styles.navContainer}>
          {/* Left side - Navigation links */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span onClick={() => navigateTo('/')} style={{ 
              color: router.pathname === '/' ? '#3b82f6' : (darkMode ? '#cbd5e1' : '#64748b'),
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: router.pathname === '/' ? (darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)') : 'transparent',
            }}>
              Home
            </span>
           <footer style={{
  backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
  padding: '40px 20px 20px 20px',
  marginTop: '50px',
  borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
}}>
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '30px',
    marginBottom: '30px'
  }}>
    
    {/* Company Info */}
    <div>
      <h3 style={{
        color: darkMode ? '#f8fafc' : '#1e293b',
        margin: '0 0 15px 0',
        fontSize: '1.1rem'
      }}>
        AI Prompt Maker
      </h3>
      <p style={{
        color: darkMode ? '#cbd5e1' : '#64748b',
        margin: '0 0 15px 0',
        fontSize: '0.9rem',
        lineHeight: '1.5'
      }}>
        Transform your ideas into perfect AI prompts with our advanced multi-model AI technology.
      </p>
      <div style={{ display: 'flex', gap: '15px' }}>
        <span style={{ 
          padding: '8px 12px', 
          backgroundColor: darkMode ? '#334155' : '#e2e8f0',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          🚀 Fast
        </span>
        <span style={{ 
          padding: '8px 12px', 
          backgroundColor: darkMode ? '#334155' : '#e2e8f0',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          🔒 Secure
        </span>
      </div>
    </div>
    
    {/* Quick Links */}
    <div>
      <h3 style={{
        color: darkMode ? '#f8fafc' : '#1e293b',
        margin: '0 0 15px 0',
        fontSize: '1.1rem'
      }}>
        Quick Links
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a href="/" style={{
          color: darkMode ? '#93c5fd' : '#3b82f6',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          🏠 Home
        </a>
        <a href="/seo" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          🔍 SEO Tools
        </a>
        <a href="/code" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          💻 Code Assistant
        </a>
        <a href="/blog" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          📚 Blog
        </a>
      </div>
    </div>
    
    {/* Support */}
    <div>
      <h3 style={{
        color: darkMode ? '#f8fafc' : '#1e293b',
        margin: '0 0 15px 0',
        fontSize: '1.1rem'
      }}>
        Support
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a href="/help" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          ❓ Help Center
        </a>
        <a href="/contact" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          📧 Contact Us
        </a>
        <a href="/feedback" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          💬 Feedback
        </a>
      </div>
    </div>
  </div>
  
  {/* Bottom Section */}
  <div style={{
    borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    paddingTop: '20px',
    textAlign: 'center'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '15px',
      flexWrap: 'wrap'
    }}>
      <a href="/privacy" style={{
        color: darkMode ? '#93c5fd' : '#3b82f6',
        textDecoration: 'none',
        fontSize: '0.8rem'
      }}>
        Privacy Policy
      </a>
      <a href="/terms" style={{
        color: darkMode ? '#93c5fd' : '#3b82f6',
        textDecoration: 'none',
        fontSize: '0.8rem'
      }}>
        Terms of Service
      </a>
      <a href="/cookies" style={{
        color: darkMode ? '#93c5fd' : '#3b82f6',
        textDecoration: 'none',
        fontSize: '0.8rem'
      }}>
        Cookie Policy
      </a>
    </div>
    
    <p style={{ 
      margin: '0', 
      color: darkMode ? '#94a3b8' : '#475569',
      fontSize: '0.8rem',
      lineHeight: '1.5'
    }}>
      © 2024 AI Prompt Maker. All rights reserved. 
      <br />
      Powered by multiple AI models • Made with ❤️ for creators worldwide
    </p>
  </div>
</footer>
            <span onClick={() => navigateTo('/code')} style={{ 
              color: darkMode ? '#cbd5e1' : '#64748b',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '6px',
            }}>
              Code
            </span>
            {/* Add other navigation links as needed */}
          </div>

          {/* Right side - Actions */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              style={styles.button('#8b5cf6')}
            >
              📚 History
            </button>

            {user ? (
              <button onClick={handleLogout} style={styles.button('#6b7280')}>
                Logout
              </button>
            ) : (
              <button onClick={handleLogin} style={styles.button('#3b82f6')}>
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
        </div>
      </header>

      {/* MAIN CONTENT - Simplified */}
      <main style={{ 
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '20px',
      }}>
        
        {/* Input Section */}
        <div style={{ flex: 1 }}>
          {/* Configuration */}
          <div style={styles.card}>
            <h2 style={{ margin: '0 0 16px 0' }}>⚙️ Configuration</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
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
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
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

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
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

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Language
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input 
                    type="radio" 
                    name="lang" 
                    checked={language === 'English'} 
                    onChange={() => setLanguage('English')} 
                  />
                  English
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
            <h2 style={{ margin: '0 0 16px 0' }}>💡 Your Idea</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you want to create..."
                rows="5"
                style={{
                  ...styles.input,
                  minHeight: '120px',
                  resize: 'vertical',
                }}
                required
              />
              
              {loading && generationStatus && (
                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  textAlign: 'center',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0 }}>🎉 Your AI Prompt</h2>
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
                padding: '16px',
                marginBottom: '16px',
              }}>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                  fontSize: '0.9rem',
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
                  padding: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}>
                  <span>Generated with:</span>
                  <code style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}>
                    {usedModel}
                  </code>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              ...styles.card,
              textAlign: 'center',
              padding: '40px 20px',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ margin: '0 0 8px 0' }}>Ready to Create?</h3>
              <p style={{ margin: 0, color: darkMode ? '#cbd5e1' : '#64748b' }}>
                Enter your idea above to generate AI prompts
              </p>
            </div>
          )}
        </div>
      </main>

<footer style={{
  backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
  padding: '40px 20px 20px 20px',
  marginTop: '50px',
  borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
}}>
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '30px',
    marginBottom: '30px'
  }}>
    
    {/* Company Info */}
    <div>
      <h3 style={{
        color: darkMode ? '#f8fafc' : '#1e293b',
        margin: '0 0 15px 0',
        fontSize: '1.1rem'
      }}>
        AI Prompt Maker
      </h3>
      <p style={{
        color: darkMode ? '#cbd5e1' : '#64748b',
        margin: '0 0 15px 0',
        fontSize: '0.9rem',
        lineHeight: '1.5'
      }}>
        Transform your ideas into perfect AI prompts with our advanced multi-model AI technology.
      </p>
      <div style={{ display: 'flex', gap: '15px' }}>
        <span style={{ 
          padding: '8px 12px', 
          backgroundColor: darkMode ? '#334155' : '#e2e8f0',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          🚀 Fast
        </span>
        <span style={{ 
          padding: '8px 12px', 
          backgroundColor: darkMode ? '#334155' : '#e2e8f0',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          🔒 Secure
        </span>
      </div>
    </div>
    
    {/* Quick Links */}
    <div>
      <h3 style={{
        color: darkMode ? '#f8fafc' : '#1e293b',
        margin: '0 0 15px 0',
        fontSize: '1.1rem'
      }}>
        Quick Links
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a href="/" style={{
          color: darkMode ? '#93c5fd' : '#3b82f6',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          🏠 Home
        </a>
        <a href="/seo" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          🔍 SEO Tools
        </a>
        <a href="/code" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          💻 Code Assistant
        </a>
        <a href="/blog" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          📚 Blog
        </a>
      </div>
    </div>
    
    {/* Support */}
    <div>
      <h3 style={{
        color: darkMode ? '#f8fafc' : '#1e293b',
        margin: '0 0 15px 0',
        fontSize: '1.1rem'
      }}>
        Support
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a href="/help" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          ❓ Help Center
        </a>
        <a href="/contact" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          📧 Contact Us
        </a>
        <a href="/feedback" style={{
          color: darkMode ? '#cbd5e1' : '#64748b',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          💬 Feedback
        </a>
      </div>
    </div>
  </div>
  
  {/* Bottom Section */}
  <div style={{
    borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    paddingTop: '20px',
    textAlign: 'center'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '15px',
      flexWrap: 'wrap'
    }}>
      <a href="/privacy" style={{
        color: darkMode ? '#93c5fd' : '#3b82f6',
        textDecoration: 'none',
        fontSize: '0.8rem'
      }}>
        Privacy Policy
      </a>
      <a href="/terms" style={{
        color: darkMode ? '#93c5fd' : '#3b82f6',
        textDecoration: 'none',
        fontSize: '0.8rem'
      }}>
        Terms of Service
      </a>
      <a href="/cookies" style={{
        color: darkMode ? '#93c5fd' : '#3b82f6',
        textDecoration: 'none',
        fontSize: '0.8rem'
      }}>
        Cookie Policy
      </a>
    </div>
    
    <p style={{ 
      margin: '0', 
      color: darkMode ? '#94a3b8' : '#475569',
      fontSize: '0.8rem',
      lineHeight: '1.5'
    }}>
      © 2024 AI Prompt Maker. All rights reserved. 
      <br />
      Powered by multiple AI models • Made with ❤️ Mahendra
    </p>
  </div>
</footer>

      {/* Add basic CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
