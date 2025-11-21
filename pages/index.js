// pages/index.js - FIXED VERSION WITHOUT ERRORS
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

// AI Models for Text Generation
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
  // ... other tools (shortened for brevity)
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
  
  // Image to Prompt States
  const [showImageToPrompt, setShowImageToPrompt] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUsedModel, setImageUsedModel] = useState('');

  // Feedback States
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  const router = useRouter();

  // SEO data
  const pageTitle = "AI Prompt Maker - Free AI Prompt Generator Tool";
  const pageDescription = "Transform your ideas into perfect AI prompts with our free AI Prompt Generator. Support for multiple AI models including GPT-4, Gemini, Claude, and Llama.";

  // Initialize component
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check screen size
        const checkScreenSize = () => {
          const mobile = window.innerWidth < 768;
          setIsMobile(mobile);
          if (!mobile) {
            setMobileMenuOpen(false);
          }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        // Initialize dark mode
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        updateDarkModeStyles(isDark);
        
        // Initialize usage count
        const savedUsage = localStorage.getItem('guestUsage');
        if (savedUsage) {
          setUsageCount(parseInt(savedUsage));
        }

        // Initialize history
        try {
          const savedHistory = localStorage.getItem('promptHistory');
          if (savedHistory) {
            const history = JSON.parse(savedHistory);
            setPromptHistory(history.slice(0, 50));
          }
        } catch (error) {
          console.error('Error loading history:', error);
        }

        // Initialize user
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // Fetch recent feedbacks
        fetchRecentFeedbacks();

        return () => window.removeEventListener('resize', checkScreenSize);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeApp();
  }, []);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }, [promptHistory]);

  // Fetch recent feedbacks function
  const fetchRecentFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRecentFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

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
      type: promptData.type || 'text'
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

  // Submit handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !canGenerate()) return;

    setLoading(true);
    setOutput('');
    setUsedModel('');
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
          type: 'text'
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
        type: 'text'
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

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('❌ Please upload an image file (JPEG, PNG, GIF, WebP, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('❌ Image size should be less than 10MB for optimal analysis');
      return;
    }

    setSelectedImage(file);
    setImageAnalysis('');
    setImageUsedModel('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
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

  // STYLES
  const containerStyle = {
    fontFamily: "'Inter', sans-serif",
    maxWidth: '100%',
    margin: '0 auto',
    padding: isMobile ? '12px' : '24px',
    paddingBottom: isMobile ? '80px' : '40px',
    minHeight: '100vh',
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    boxSizing: 'border-box',
    position: 'relative'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '15px 0' : '20px 0',
    borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    marginBottom: '20px',
    position: 'relative',
  };

  const logoStyle = {
    fontSize: isMobile ? '1.5rem' : '2rem',
    fontWeight: '900',
    color: '#3b82f6',
    margin: 0,
    textDecoration: 'none'
  };

  const mainTitleStyle = {
    fontSize: isMobile ? '1.8rem' : '3rem',
    fontWeight: '900',
    color: '#3b82f6',
    margin: '0 0 8px 0',
    lineHeight: '1.2'
  };

  const subtitleStyle = {
    fontSize: isMobile ? '0.9rem' : '1.2rem',
    color: darkMode ? '#cbd5e1' : '#64748b',
    margin: '0',
    lineHeight: '1.4'
  };

  // Mobile Sidebar Styles
  const mobileSidebarStyle = {
    position: 'fixed',
    top: 0,
    left: mobileMenuOpen ? '0' : '-100%',
    width: '280px',
    height: '100vh',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  };

  const sidebarOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    display: mobileMenuOpen ? 'block' : 'none'
  };

  const buttonStyle = (bgColor, textColor = '#fff') => ({
    padding: isMobile ? '10px 14px' : '8px 16px',
    backgroundColor: bgColor,
    color: textColor,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: isMobile ? '0.85rem' : '0.9rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    minHeight: isMobile ? '44px' : 'auto'
  });

  const cardStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: isMobile ? '16px' : '20px',
    marginBottom: '16px',
    boxSizing: 'border-box'
  };

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '12px' : '12px',
    borderRadius: '8px',
    border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    fontSize: isMobile ? '16px' : '16px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    minHeight: isMobile ? '44px' : 'auto'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: isMobile ? '120px' : '150px',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.5'
  };

  const generateButtonStyle = {
    width: '100%',
    padding: isMobile ? '16px' : '16px',
    backgroundColor: loading || !canGenerate() || !input.trim() ? '#9ca3af' : '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: isMobile ? '1.1rem' : '1.1rem',
    fontWeight: '700',
    cursor: (loading || !canGenerate() || !input.trim()) ? 'not-allowed' : 'pointer',
    marginTop: '10px',
    minHeight: '54px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const mainContentStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '16px' : '20px',
    alignItems: 'stretch'
  };

  const sectionStyle = {
    flex: 1,
    minWidth: 0
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobile && (
        <div 
          style={sidebarOverlayStyle}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      {isMobile && (
        <div style={mobileSidebarStyle}>
          <div style={{
            padding: '20px',
            borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: darkMode ? '#f8fafc' : '#1e293b' }}>
              🚀 AI Tools
            </h3>
            <button
              onClick={() => setMobileMenuOpen(false)}
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

          <div style={{ padding: '20px 0', flex: 1 }}>
            <button onClick={() => navigateTo('/')} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              color: darkMode ? '#cbd5e1' : '#64748b',
              textDecoration: 'none',
              border: 'none',
              background: 'none',
              width: '100%',
              textAlign: 'left',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              <span>🏠</span>
              Home
            </button>
            <button onClick={() => setShowImageToPrompt(true)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              color: darkMode ? '#cbd5e1' : '#64748b',
              textDecoration: 'none',
              border: 'none',
              background: 'none',
              width: '100%',
              textAlign: 'left',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              <span>🖼️</span>
              Image to Prompt
            </button>
            <button onClick={() => setShowHistory(true)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              color: darkMode ? '#cbd5e1' : '#64748b',
              textDecoration: 'none',
              border: 'none',
              background: 'none',
              width: '100%',
              textAlign: 'left',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              <span>📚</span>
              History
            </button>
          </div>

          <div style={{
            padding: '20px',
            borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {user ? (
              <button onClick={handleLogout} style={buttonStyle('#6b7280', '#fff')}>
                👤 Logout
              </button>
            ) : (
              <button onClick={handleLogin} style={buttonStyle('#3b82f6', '#fff')}>
                🔐 Login
              </button>
            )}
            
            <button 
              onClick={toggleDarkMode} 
              style={buttonStyle(darkMode ? '#4b5563' : '#e5e7eb', darkMode ? '#f9fafb' : '#374151')}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      )}

      <div style={containerStyle}>
        {/* HEADER */}
        <header style={headerStyle}>
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              style={{
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
              }}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          )}

          {/* Logo */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginLeft: isMobile ? '50px' : '0'
          }}>
            <h1 style={logoStyle}>AI Prompt Maker</h1>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button onClick={() => setShowImageToPrompt(true)} style={buttonStyle('#ec4899')}>
                🖼️ Image to Prompt
              </button>
              <button onClick={() => setShowHistory(true)} style={buttonStyle('#8b5cf6')}>
                📚 History
              </button>
              
              {user ? (
                <button onClick={handleLogout} style={buttonStyle('#6b7280')}>
                  👤 Logout
                </button>
              ) : (
                <button onClick={handleLogin} style={buttonStyle('#3b82f6')}>
                  🔐 Login
                </button>
              )}
              
              <button onClick={toggleDarkMode} style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '8px'
              }}>
                {darkMode ? '☀️' : '🌙'}
              </button>
            </nav>
          )}
        </header>

        {/* MAIN HEADER CONTENT */}
        <header style={{
          textAlign: 'center',
          padding: isMobile ? '15px 0' : '30px 0',
          borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          marginBottom: '20px',
        }}>
          <h1 style={mainTitleStyle}>AI Prompt Maker</h1>
          <p style={subtitleStyle}>Transform your ideas into perfect AI prompts</p>
        </header>

        {/* MAIN CONTENT */}
        <main style={mainContentStyle}>
          
          {/* Input Section */}
          <div style={sectionStyle}>
            {!canGenerate() && !user && (
              <div style={{
                ...cardStyle,
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
                  style={{
                    ...generateButtonStyle,
                    backgroundColor: '#3b82f6',
                  }}
                >
                  🔐 Login to Continue
                </button>
              </div>
            )}

            {/* Configuration */}
            <div style={cardStyle}>
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
                    style={inputStyle}
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
                    style={inputStyle}
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
                      <select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} style={inputStyle}>
                        {IMAGE_STYLES.map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                        Aspect Ratio
                      </label>
                      <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={inputStyle}>
                        {['1:1', '16:9', '9:16', '4:3', '3:2'].map(ratio => (
                          <option key={ratio} value={ratio}>{ratio}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                      <input 
                        type="checkbox" 
                        checked={includeNegativePrompt} 
                        onChange={(e) => setIncludeNegativePrompt(e.target.checked)} 
                        style={{ width: '18px', height: '18px' }}
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
                      <select value={creativityLevel} onChange={(e) => setCreativityLevel(e.target.value)} style={inputStyle}>
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
                        style={{ width: '100%', height: '6px' }}
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
                  style={{ width: '100%', height: '6px' }}
                />
              </div>

              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Language
                </label>
                <div style={{ display: 'flex', gap: isMobile ? '12px' : '16px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <input 
                      type="radio" 
                      name="lang" 
                      checked={language === 'English'} 
                      onChange={() => setLanguage('English')} 
                      style={{ width: '18px', height: '18px' }}
                    />
                    English
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    <input 
                      type="radio" 
                      name="lang" 
                      checked={language === 'Hindi'} 
                      onChange={() => setLanguage('Hindi')} 
                      style={{ width: '18px', height: '18px' }}
                    />
                    हिंदी
                  </label>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div style={cardStyle}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: isMobile ? '1.2rem' : '1.4rem' }}>💡 Your Idea</h2>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you want to create..."
                  rows={isMobile ? 4 : 5}
                  style={textareaStyle}
                  required
                />
                
                {loading && generationStatus && (
                  <div style={{
                    padding: isMobile ? '10px' : '12px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    textAlign: 'center',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}>
                    {generationStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !canGenerate() || !input.trim()}
                  style={generateButtonStyle}
                >
                  {loading ? '⚡ Generating...' : '✨ Generate AI Prompt'}
                </button>
              </form>
            </div>
          </div>

          {/* Output Section */}
          <div style={sectionStyle}>
            {output ? (
              <div style={cardStyle}>
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
                    <button onClick={copyToClipboard} style={buttonStyle('#3b82f6')} title="Copy to Clipboard">
                      📋 Copy
                    </button>
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  padding: isMobile ? '12px' : '16px',
                  marginBottom: '12px',
                  maxHeight: isMobile ? '300px' : '400px',
                  overflowY: 'auto'
                }}>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0,
                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                    lineHeight: '1.5',
                    fontFamily: 'inherit'
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
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '8px' : '0',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    <span>Generated with:</span>
                    <code style={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: isMobile ? '0.8rem' : '0.9rem'
                    }}>
                      {usedModel}
                    </code>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                ...cardStyle,
                textAlign: 'center',
                padding: isMobile ? '30px 16px' : '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: isMobile ? '200px' : '300px'
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

        {/* MODALS */}
        {/* Image to Prompt Modal */}
        {showImageToPrompt && (
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
              width: isMobile ? '100%' : '500px',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h2 style={{ margin: 0 }}>🖼️ Image to Prompt</h2>
                <button
                  onClick={() => setShowImageToPrompt(false)}
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

              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚧</div>
                <h3 style={{ margin: '0 0 10px 0' }}>Coming Soon</h3>
                <p style={{ margin: 0, color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Image to Prompt feature is under development
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
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
              width: isMobile ? '100%' : '500px',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
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

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {promptHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📝</div>
                    <h3 style={{ margin: '0 0 10px 0' }}>No History Yet</h3>
                    <p style={{ margin: 0, color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Your generated prompts will appear here
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {promptHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setInput(item.input);
                          setOutput(item.output);
                          setShowHistory(false);
                        }}
                        style={{
                          backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                          border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                          {item.input.substring(0, 60)}{item.input.length > 60 ? '...' : ''}
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          fontSize: '0.8rem',
                          color: darkMode ? '#94a3b8' : '#64748b'
                        }}>
                          <span>{item.tone}</span>
                          <span>{formatDate(item.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {promptHistory.length > 0 && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <button
                    onClick={clearHistory}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear All History
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
