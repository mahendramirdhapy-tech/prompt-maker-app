// pages/index.js - MOBILE RESPONSIVE VERSION
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Enhanced Templates
const TEMPLATES = [
  { label: 'Custom Idea', value: '' },
  { label: 'Blog Intro', value: 'Write a blog intro about' },
  { label: 'Instagram Caption', value: 'Write an Instagram caption for' },
  { label: 'Twitter Post', value: 'Write a viral tweet about' },
  { label: 'LinkedIn Post', value: 'Write a professional LinkedIn post about' },
  { label: 'Code Debugger', value: 'Debug this code:' },
  { label: 'Midjourney Image', value: 'Create a detailed Midjourney prompt for' },
  { label: 'DALL-E Image', value: 'Generate a DALL-E image prompt for' },
  { label: 'Story Writer', value: 'Write a creative story about' },
  { label: 'Product Description', value: 'Write a compelling product description for' },
  { label: 'YouTube Script', value: 'Create a YouTube video script about' },
  { label: 'Ad Copy', value: 'Write persuasive ad copy for' },
];

// Enhanced Tones
const TONES = [
  'Professional', 'Friendly', 'Technical', 'Creative', 'Humorous',
  'Formal', 'Casual', 'Persuasive', 'Educational', 'Inspirational'
];

// AI Models
const AI_MODELS = [
  { name: 'gemini-pro', label: 'Google Gemini Pro', free: true },
  { name: 'claude-instant', label: 'Claude Instant', free: true },
  { name: 'llama-3', label: 'Meta Llama 3', free: true },
  { name: 'mistral', label: 'Mistral 7B', free: true },
];

// Tool Cards Data
const TOOL_CARDS = [
  {
    id: 1,
    title: '🔍 SEO Tool',
    description: 'Optimize your content for search engines with our advanced SEO analysis tool.',
    path: '/seo',
    author: 'AI Prompt Maker',
    date: 'November 13, 2024',
    label: 'FREE TOOLS'
  },
  {
    id: 2,
    title: '💻 Code Assistant',
    description: 'Get help with coding, debugging, and code explanations from AI.',
    path: '/code',
    author: 'AI Prompt Maker',
    date: 'November 13, 2024',
    label: 'FREE TOOLS'
  },
  {
    id: 3,
    title: '✉️ Email Writer',
    description: 'Create professional emails quickly with our AI-powered email writer.',
    path: '/email',
    author: 'AI Prompt Maker',
    date: 'November 13, 2024',
    label: 'FREE TOOLS'
  },
  {
    id: 4,
    title: '🔄 Translator',
    description: 'Translate text between multiple languages with high accuracy.',
    path: '/translate',
    author: 'AI Prompt Maker',
    date: 'November 13, 2024',
    label: 'FREE TOOLS'
  },
  {
    id: 5,
    title: '🎵 Audio Tool',
    description: 'Audio processing and enhancement tools for your media files.',
    path: '/audio',
    author: 'AI Prompt Maker',
    date: 'November 13, 2024',
    label: 'FREE TOOLS'
  },
  {
    id: 6,
    title: '📚 Prompt Library',
    description: 'Explore our collection of pre-made AI prompts for various use cases.',
    path: '/prompts',
    author: 'AI Prompt Maker',
    date: 'November 13, 2024',
    label: 'FREE TOOLS'
  }
];

// Image generation styles
const IMAGE_STYLES = [
  'Photorealistic', 'Digital Art', 'Oil Painting', 'Watercolor', 'Anime',
  'Cyberpunk', 'Minimalist', 'Vintage', 'Futuristic', 'Fantasy'
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
  const [usageCount, setUsageCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [promptHistory, setPromptHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [imageStyle, setImageStyle] = useState('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [includeNegativePrompt, setIncludeNegativePrompt] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [creativityLevel, setCreativityLevel] = useState('balanced');
  const [lastInput, setLastInput] = useState('');
  const router = useRouter();

  // SEO data
  const pageTitle = "AI Prompt Maker - Free AI Prompt Generator Tool";
  const pageDescription = "Transform your ideas into perfect AI prompts with our free AI Prompt Generator. Support for multiple AI models including GPT-4, Gemini, Claude, and Llama.";

  // Client-side only effects
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    updateDarkModeStyles(isDark);
    
    const savedUsage = localStorage.getItem('guestUsage');
    if (savedUsage) {
      setUsageCount(parseInt(savedUsage));
    }

    try {
      const savedHistory = localStorage.getItem('promptHistory');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setPromptHistory(history.slice(0, 50));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  // User initialization
  useEffect(() => {
    let mounted = true;

    const initUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };

    initUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setUser(session?.user || null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }, [promptHistory]);

  const updateDarkModeStyles = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#cbd5e1');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
    }
  };

  // Enhanced prompt generation algorithm
  const enhancePrompt = (input, template, tone, language, imageStyle, aspectRatio, includeNegativePrompt) => {
    let enhancedPrompt = input;
    
    if (template && !input.startsWith(template)) {
      enhancedPrompt = `${template} ${input}`;
    }

    // Image prompt enhancement
    if (template.includes('Midjourney') || template.includes('DALL-E')) {
      let imagePrompt = enhancedPrompt;
      
      if (imageStyle && imageStyle !== 'Photorealistic') {
        imagePrompt += `, ${imageStyle.toLowerCase()} style`;
      }
      
      imagePrompt += ` --ar ${aspectRatio}`;
      imagePrompt += ' --quality 2';
      
      if (includeNegativePrompt) {
        imagePrompt += ` --no blur, low quality, distorted, watermark`;
      }
      
      return imagePrompt;
    }

    // Text prompt enhancement
    let finalPrompt = `${enhancedPrompt}\n\nGenerate this in a ${tone.toLowerCase()} tone`;
    
    if (language !== 'English') {
      finalPrompt += ` in ${language}`;
    }

    return finalPrompt;
  };

  const addToHistory = (promptData) => {
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      input: promptData.input,
      output: promptData.output,
      model: promptData.model,
      tone: promptData.tone,
      language: promptData.language,
    };

    setPromptHistory(prev => [historyItem, ...prev.slice(0, 49)]);
  };

  const generateWithFallback = async (inputData) => {
    for (let i = 0; i < AI_MODELS.length; i++) {
      const model = AI_MODELS[i];
      setGenerationStatus(`Trying ${model.label}...`);
      
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...inputData,
            model: model.name
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result && result.success) {
            return {
              prompt: result.prompt,
              modelUsed: model.name,
              modelLabel: model.label,
            };
          }
        }
      } catch (error) {
        console.warn(`${model.label} failed:`, error.message);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    throw new Error('All AI models are currently unavailable. Please try again.');
  };

  const canGenerate = () => user || usageCount < 5;

  // FIXED: Submit handler with regeneration support
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!input.trim() || !canGenerate()) return;

    setLoading(true);
    setOutput('');
    setUsedModel('');
    setFeedbackGiven(null);
    setGenerationStatus('Starting generation...');

    try {
      setLastInput(input);

      const enhancedInput = enhancePrompt(
        input, template, tone, language, imageStyle, aspectRatio, includeNegativePrompt
      );

      const inputData = {
        idea: enhancedInput,
        language,
        tone,
        maxTokens,
        temperature,
        creativity: creativityLevel
      };

      const result = await generateWithFallback(inputData);

      setOutput(result.prompt);
      setUsedModel(result.modelLabel);

      // Save to database
      try {
        await supabase.from('prompts').insert({
          user_id: user?.id || null,
          input: input.trim(),
          output: result.prompt,
          model_used: result.modelUsed,
          language,
          tone,
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
      }

      // Add to history
      addToHistory({
        input: input.trim(),
        output: result.prompt,
        model: result.modelLabel,
        tone,
        language,
      });

      // Update usage count
      if (!user) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('guestUsage', newCount.toString());
      }

      setGenerationStatus('Generation completed!');

    } catch (err) {
      console.error('Generation error:', err);
      setGenerationStatus('Generation failed');
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Regenerate function
  const handleRegenerate = () => {
    if (lastInput.trim()) {
      setInput(lastInput);
      setTimeout(() => {
        handleSubmit({ preventDefault: () => {} });
      }, 100);
    } else if (input.trim()) {
      handleSubmit({ preventDefault: () => {} });
    }
  };

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      alert('✅ Prompt copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setPromptHistory([]);
      localStorage.removeItem('promptHistory');
    }
  };

  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    setPromptHistory(prev => prev.filter(item => item.id !== id));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch (error) {
      return 'Recent';
    }
  };

  // Add CSS styles for responsive design
  const styles = `
    .mobile-container {
      max-width: 100%;
      margin: 0 auto;
      padding: 12px;
      padding-bottom: 80px;
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
    }
    
    .desktop-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      padding-bottom: 40px;
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
    }
    
    .mobile-header {
      text-align: center;
      padding: 15px 0;
      border-bottom: 1px solid;
      margin-bottom: 20px;
      position: relative;
    }
    
    .desktop-header {
      text-align: center;
      padding: 30px 0;
      border-bottom: 1px solid;
      margin-bottom: 20px;
      position: relative;
    }
    
    .mobile-title {
      font-size: 1.8rem;
      font-weight: 900;
      color: #3b82f6;
      margin: 0 0 8px 0;
    }
    
    .desktop-title {
      font-size: 3rem;
      font-weight: 900;
      color: #3b82f6;
      margin: 0 0 8px 0;
    }
    
    .mobile-subtitle {
      font-size: 0.9rem;
      margin: 0;
    }
    
    .desktop-subtitle {
      font-size: 1.2rem;
      margin: 0;
    }
    
    .mobile-menu-button {
      position: absolute;
      top: 15px;
      left: 15px;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      z-index: 100;
    }
    
    .mobile-nav-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 15px;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      padding: 16px;
      border-radius: 0 0 12px 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 99;
      border: 1px solid;
    }
    
    .desktop-nav-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      gap: 8px;
    }
    
    .mobile-main {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .desktop-main {
      display: flex;
      flex-direction: row;
      gap: 20px;
    }
    
    .mobile-card {
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      border: 1px solid;
    }
    
    .desktop-card {
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      border: 1px solid;
    }
    
    .mobile-input {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid;
      font-size: 14px;
      margin-bottom: 12px;
      box-sizing: border-box;
    }
    
    .desktop-input {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid;
      font-size: 16px;
      margin-bottom: 12px;
      box-sizing: border-box;
    }
    
    .mobile-textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .desktop-textarea {
      min-height: 120px;
      resize: vertical;
    }
    
    .mobile-button {
      padding: 8px 12px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    .desktop-button {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    .mobile-generate-button {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      margin-top: 10px;
    }
    
    .desktop-generate-button {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      margin-top: 10px;
    }
    
    .mobile-tools-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .desktop-tools-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .mobile-footer {
      padding: 30px 16px 16px;
      margin-top: 40px;
      border-top: 1px solid;
    }
    
    .desktop-footer {
      padding: 40px 20px 20px;
      margin-top: 40px;
      border-top: 1px solid;
    }
    
    .mobile-footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .desktop-footer-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      margin-bottom: 20px;
    }
    
    @media (min-width: 768px) {
      .mobile-only {
        display: none !important;
      }
    }
    
    @media (max-width: 767px) {
      .desktop-only {
        display: none !important;
      }
    }
  `;

  // Dynamic style application based on dark mode
  const dynamicStyles = `
    ${styles}
    
    .dark-mode {
      background-color: #0f172a;
      color: #f8fafc;
    }
    
    .light-mode {
      background-color: #ffffff;
      color: #1e293b;
    }
    
    .dark-border {
      border-color: #334155;
    }
    
    .light-border {
      border-color: #e2e8f0;
    }
    
    .dark-bg {
      background-color: #1e293b;
    }
    
    .light-bg {
      background-color: #f8fafc;
    }
    
    .dark-input {
      background-color: #0f172a;
      color: #f8fafc;
    }
    
    .light-input {
      background-color: #ffffff;
      color: #1e293b;
    }
    
    .dark-text-secondary {
      color: #cbd5e1;
    }
    
    .light-text-secondary {
      color: #64748b;
    }
  `;

  const navItems = [
    { path: '/', label: '🏠 Home' },
    { path: '/seo', label: '🔍 SEO' },
    { path: '/code', label: '💻 Code' },
    { path: '/email', label: '✉️ Email' },
    { path: '/translate', label: '🔄 Translate' },
    { path: '/audio', label: '🎵 Audio' },
    { path: '/catalog-maker', label: '📋 Catalog' },
    { path: '/prompts', label: '📚 Library' },
  ];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <style>{dynamicStyles}</style>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={isMobile ? "mobile-container" : "desktop-container"} 
           style={{ 
             backgroundColor: darkMode ? '#0f172a' : '#ffffff',
             color: darkMode ? '#f8fafc' : '#1e293b'
           }}>
        
        {/* HEADER */}
        <header className={isMobile ? "mobile-header" : "desktop-header"} 
                style={{ 
                  borderColor: darkMode ? '#334155' : '#e2e8f0'
                }}>
          
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-button"
              style={{
                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: darkMode ? '#f8fafc' : '#1e293b'
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          )}

          <h1 className={isMobile ? "mobile-title" : "desktop-title"}>AI Prompt Maker</h1>
          <p className={isMobile ? "mobile-subtitle" : "desktop-subtitle"}
             style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>
            Transform your ideas into perfect AI prompts
          </p>
          
          <div className={isMobile ? (mobileMenuOpen ? "mobile-nav-container" : "mobile-only") : "desktop-nav-container"}
               style={{
                 backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                 borderColor: darkMode ? '#334155' : '#e2e8f0'
               }}>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: isMobile ? '8px' : '12px',
              alignItems: 'center',
              width: isMobile ? '100%' : 'auto',
            }}>
              {navItems.map((item) => (
                <button 
                  key={item.path}
                  onClick={() => navigateTo(item.path)} 
                  style={{
                    color: darkMode ? '#cbd5e1' : '#64748b',
                    cursor: 'pointer',
                    padding: isMobile ? '10px 12px' : '6px 12px',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.9rem' : '0.9rem',
                    backgroundColor: router.pathname === item.path 
                      ? (darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)')
                      : 'transparent',
                    border: 'none',
                    fontFamily: 'inherit',
                    color: router.pathname === item.path ? '#3b82f6' : (darkMode ? '#cbd5e1' : '#64748b')
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: isMobile ? '8px' : '12px',
              alignItems: 'center',
              width: isMobile ? '100%' : 'auto',
            }}>
              <button onClick={() => setShowHistory(!showHistory)} 
                      className={isMobile ? "mobile-button" : "desktop-button"}
                      style={{ backgroundColor: '#8b5cf6', color: '#fff' }}>
                📚 History
              </button>

              {user ? (
                <button onClick={handleLogout} 
                        className={isMobile ? "mobile-button" : "desktop-button"}
                        style={{ backgroundColor: '#6b7280', color: '#fff' }}>
                  Logout
                </button>
              ) : (
                <button onClick={handleLogin} 
                        className={isMobile ? "mobile-button" : "desktop-button"}
                        style={{ backgroundColor: '#3b82f6', color: '#fff' }}>
                  Login
                </button>
              )}
              
              <button onClick={toggleDarkMode} 
                      className={isMobile ? "mobile-button" : "desktop-button"}
                      style={{ 
                        backgroundColor: darkMode ? '#4b5563' : '#e5e7eb', 
                        color: darkMode ? '#f9fafb' : '#374151' 
                      }}>
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className={isMobile ? "mobile-main" : "desktop-main"}>
          
          {/* Input Section */}
          <div style={{ flex: 1 }}>
            {!canGenerate() && !user && (
              <div className={isMobile ? "mobile-card" : "desktop-card"}
                   style={{
                     background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                     border: '1px solid #f59e0b',
                     color: '#92400e',
                   }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span>🚨</span>
                  <strong>Free Limit Reached</strong>
                </div>
                <p style={{ margin: 0, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                  You've used all 5 free prompts. Login for unlimited access!
                </p>
                <button 
                  onClick={handleLogin}
                  className={isMobile ? "mobile-generate-button" : "desktop-generate-button"}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    marginTop: '10px',
                  }}
                >
                  🔐 Login to Continue
                </button>
              </div>
            )}

            {/* Configuration */}
            <div className={isMobile ? "mobile-card" : "desktop-card"}
                 style={{
                   backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                   borderColor: darkMode ? '#334155' : '#e2e8f0'
                 }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: isMobile ? '1.2rem' : '1.4rem' }}>⚙️ Configuration</h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: isMobile ? '10px' : '12px' 
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                    Tone
                  </label>
                  <select 
                    value={tone} 
                    onChange={(e) => setTone(e.target.value)} 
                    className={isMobile ? "mobile-input" : "desktop-input"}
                    style={{
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                      color: darkMode ? '#f8fafc' : '#1e293b',
                      borderColor: darkMode ? '#334155' : '#d1d5db'
                    }}
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
                    onChange={(e) => setTemplate(e.target.value)} 
                    className={isMobile ? "mobile-input" : "desktop-input"}
                    style={{
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                      color: darkMode ? '#f8fafc' : '#1e293b',
                      borderColor: darkMode ? '#334155' : '#d1d5db'
                    }}
                  >
                    {TEMPLATES.map(template => (
                      <option key={template.value} value={template.value}>{template.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Generation Options */}
              {(template.includes('Midjourney') || template.includes('DALL-E')) && (
                <div style={{ marginTop: '12px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '1rem' : '1.1rem' }}>🎨 Image Settings</h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                    gap: isMobile ? '10px' : '12px' 
                  }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                        Style
                      </label>
                      <select 
                        value={imageStyle} 
                        onChange={(e) => setImageStyle(e.target.value)} 
                        className={isMobile ? "mobile-input" : "desktop-input"}
                        style={{
                          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                          color: darkMode ? '#f8fafc' : '#1e293b',
                          borderColor: darkMode ? '#334155' : '#d1d5db'
                        }}
                      >
                        {IMAGE_STYLES.map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                        Aspect Ratio
                      </label>
                      <select 
                        value={aspectRatio} 
                        onChange={(e) => setAspectRatio(e.target.value)} 
                        className={isMobile ? "mobile-input" : "desktop-input"}
                        style={{
                          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                          color: darkMode ? '#f8fafc' : '#1e293b',
                          borderColor: darkMode ? '#334155' : '#d1d5db'
                        }}
                      >
                        {['1:1', '16:9', '9:16', '4:3', '3:2'].map(ratio => (
                          <option key={ratio} value={ratio}>{ratio}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={includeNegativePrompt} 
                        onChange={(e) => setIncludeNegativePrompt(e.target.checked)} 
                      />
                      Include Negative Prompt
                    </label>
                  </div>
                </div>
              )}

              {/* Advanced Options */}
              <div style={{ marginTop: '12px' }}>
                <button 
                  onClick={() => setAdvancedOptions(!advancedOptions)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: darkMode ? '#60a5fa' : '#3b82f6',
                    cursor: 'pointer',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0'
                  }}
                >
                  {advancedOptions ? '▼' : '▶'} Advanced Options
                </button>

                {advancedOptions && (
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '12px', 
                    backgroundColor: darkMode ? '#0f172a' : '#f1f5f9', 
                    borderRadius: '8px' 
                  }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                        Creativity Level
                      </label>
                      <select 
                        value={creativityLevel} 
                        onChange={(e) => setCreativityLevel(e.target.value)} 
                        className={isMobile ? "mobile-input" : "desktop-input"}
                        style={{
                          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                          color: darkMode ? '#f8fafc' : '#1e293b',
                          borderColor: darkMode ? '#334155' : '#d1d5db'
                        }}
                      >
                        <option value="precise">Precise & Factual</option>
                        <option value="balanced">Balanced</option>
                        <option value="creative">Highly Creative</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                        Temperature: {temperature}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '12px' }}>
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

              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Language
                </label>
                <div style={{ display: 'flex', gap: isMobile ? '12px' : '16px' }}>
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
            <div className={isMobile ? "mobile-card" : "desktop-card"}
                 style={{
                   backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                   borderColor: darkMode ? '#334155' : '#e2e8f0'
                 }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: isMobile ? '1.2rem' : '1.4rem' }}>💡 Your Idea</h2>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you want to create..."
                  rows={isMobile ? 4 : 5}
                  className={isMobile ? "mobile-input mobile-textarea" : "desktop-input desktop-textarea"}
                  style={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    color: darkMode ? '#f8fafc' : '#1e293b',
                    borderColor: darkMode ? '#334155' : '#d1d5db'
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
                  }}>
                    {generationStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !canGenerate() || !input.trim()}
                  className={isMobile ? "mobile-generate-button" : "desktop-generate-button"}
                  style={{
                    backgroundColor: loading || !canGenerate() || !input.trim() 
                      ? '#9ca3af' 
                      : '#10b981',
                    color: '#fff',
                  }}
                >
                  {loading ? '⚡ Generating...' : '✨ Generate AI Prompt'}
                </button>
              </form>
            </div>
          </div>

          {/* Output Section */}
          <div style={{ flex: 1 }}>
            {output ? (
              <div className={isMobile ? "mobile-card" : "desktop-card"}
                   style={{
                     backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                     borderColor: darkMode ? '#334155' : '#e2e8f0'
                   }}>
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
                    <button onClick={handleRegenerate} 
                            className={isMobile ? "mobile-button" : "desktop-button"}
                            style={{ backgroundColor: '#10b981', color: '#fff' }} 
                            title="Regenerate">
                      🔄
                    </button>
                    <button onClick={copyToClipboard} 
                            className={isMobile ? "mobile-button" : "desktop-button"}
                            style={{ backgroundColor: '#3b82f6', color: '#fff' }} 
                            title="Copy to Clipboard">
                      📋
                    </button>
                    <button onClick={exportTxt} 
                            className={isMobile ? "mobile-button" : "desktop-button"}
                            style={{ backgroundColor: '#8b5cf6', color: '#fff' }} 
                            title="Download as TXT">
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
                  }}>
                    <span>Generated with:</span>
                    <code style={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}>
                      {usedModel}
                    </code>
                  </div>
                )}
              </div>
            ) : (
              <div className={isMobile ? "mobile-card" : "desktop-card"}
                   style={{
                     backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                     borderColor: darkMode ? '#334155' : '#e2e8f0',
                     textAlign: 'center',
                     padding: isMobile ? '30px 16px' : '40px 20px',
                   }}>
                <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '12px' }}>🚀</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '1.2rem' : '1.4rem' }}>Ready to Create?</h3>
                <p style={{ 
                  margin: 0, 
                  color: darkMode ? '#cbd5e1' : '#64748b',
                }}>
                  Enter your idea above to generate AI prompts
                </p>
              </div>
            )}
          </div>
        </main>

        {/* TOOL CARDS SECTION */}
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            color: darkMode ? '#f8fafc' : '#1e293b',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}>
            🛠️ Our Free AI Tools
          </h2>
          
          <div className={isMobile ? "mobile-tools-grid" : "desktop-tools-grid"}>
            {TOOL_CARDS.map((tool) => (
              <div
                key={tool.id}
                onClick={() => navigateTo(tool.path)}
                style={{
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '12px'
                }}>
                  {tool.label}
                </div>

                <h3 style={{
                  margin: '0 0 10px 0',
                  color: darkMode ? '#f8fafc' : '#1e293b',
                  fontSize: '1.2rem',
                }}>
                  {tool.title}
                </h3>

                <p style={{
                  margin: '0 0 15px 0',
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  {tool.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: darkMode ? '#94a3b8' : '#94a3b8'
                }}>
                  <span>By {tool.author}</span>
                  <span>{tool.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPLETE FOOTER SECTION */}
        <footer className={isMobile ? "mobile-footer" : "desktop-footer"}
                style={{
                  backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                  borderColor: darkMode ? '#334155' : '#e2e8f0'
                }}>
          <div className={isMobile ? "mobile-footer-grid" : "desktop-footer-grid"}>
            
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
                <button onClick={() => navigateTo('/audio')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                }}>
                  🎵 Audio Tool
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
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '10px',
                borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
              }}>
                <h2 style={{ margin: 0 }}>📚 Prompt History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: darkMode ? '#94a3b8' : '#64748b',
                  }}
                >
                  ✕
                </button>
              </div>

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
                        onClick={() => {
                          setInput(item.input);
                          setOutput(item.output);
                          setUsedModel(item.model);
                          setTone(item.tone);
                          setShowHistory(false);
                        }}
                        style={{
                          backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                          border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
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
                        >
                          🗑️
                        </button>

                        <div style={{ marginRight: '40px' }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px'
                          }}>
                            <strong>
                              {item.input.substring(0, 60)}{item.input.length > 60 ? '...' : ''}
                            </strong>
                            <span style={{
                              color: darkMode ? '#94a3b8' : '#64748b',
                              fontSize: '0.8rem',
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
                              fontSize: '0.75rem'
                            }}>
                              {item.tone}
                            </span>
                            <span style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              color: '#10b981',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.75rem'
                            }}>
                              {item.model}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
      </div>
    </>
  );
}
