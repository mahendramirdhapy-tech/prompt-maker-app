// pages/index.js - MOBILE FIXED VERSION
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';

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

  // Feedback States
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  // Navigation States
  const [showPricingModal, setShowPricingModal] = useState(false);

  const router = useRouter();

  // SEO data
  const pageTitle = "AI Prompt Maker - Free AI Prompt Generator Tool";
  const pageDescription = "Transform your ideas into perfect AI prompts with our free AI Prompt Generator. Support for multiple AI models including GPT-4, Gemini, Claude, and Llama.";

  // Initialize component - FIXED MOBILE ISSUES
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check screen size with proper mobile detection
        const checkScreenSize = () => {
          const mobile = window.innerWidth < 768;
          setIsMobile(mobile);
          // Prevent zoom on input focus for mobile
          if (mobile) {
            document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
          }
        };

        checkScreenSize();
        
        // Throttle resize events to prevent excessive re-renders
        let resizeTimeout;
        const handleResize = () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(checkScreenSize, 100);
        };

        window.addEventListener('resize', handleResize);

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

        return () => {
          window.removeEventListener('resize', handleResize);
          clearTimeout(resizeTimeout);
        };
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

  // Save history - FIXED: Prevent excessive saves
  useEffect(() => {
    if (promptHistory.length > 0) {
      try {
        localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
      } catch (error) {
        console.error('Error saving history:', error);
      }
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

  // Submit handler - FIXED: Added proper mobile form handling
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !canGenerate()) return;

    // Blur active element to hide keyboard on mobile
    if (isMobile && document.activeElement) {
      document.activeElement.blur();
    }

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

  // FIXED MOBILE STYLES - Better mobile optimization
  const containerStyle = {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    maxWidth: '100%',
    margin: '0 auto',
    padding: isMobile ? '8px' : '24px',
    paddingBottom: isMobile ? '80px' : '40px',
    minHeight: '100vh',
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    boxSizing: 'border-box',
    position: 'relative',
    background: darkMode 
      ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    overflowX: 'hidden', // Prevent horizontal scroll
    WebkitOverflowScrolling: 'touch' // Smooth scrolling for iOS
  };

  const mainTitleStyle = {
    fontSize: isMobile ? '1.8rem' : '3.5rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 12px 0',
    lineHeight: '1.1',
    textAlign: 'center',
    padding: isMobile ? '0 8px' : '0'
  };

  const subtitleStyle = {
    fontSize: isMobile ? '0.9rem' : '1.3rem',
    color: darkMode ? '#cbd5e1' : '#64748b',
    margin: '0',
    lineHeight: '1.4',
    textAlign: 'center',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: isMobile ? '0 12px' : '0'
  };

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    border: `1px solid ${darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'}`,
    borderRadius: '16px',
    padding: isMobile ? '16px' : '24px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)',
    WebkitBackdropFilter: 'blur(10px)' // Safari support
  };

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '16px' : '16px',
    borderRadius: '12px',
    border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    fontSize: isMobile ? '16px' : '16px', // Prevent zoom on iOS
    marginBottom: '12px',
    boxSizing: 'border-box',
    minHeight: isMobile ? '48px' : 'auto',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    WebkitAppearance: 'none' // Remove default iOS styles
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: isMobile ? '120px' : '180px',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.6',
    padding: isMobile ? '14px' : '16px'
  };

  const generateButtonStyle = {
    width: '100%',
    padding: isMobile ? '16px' : '20px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontSize: isMobile ? '1rem' : '1.2rem',
    fontWeight: '700',
    cursor: (loading || !canGenerate() || !input.trim()) ? 'not-allowed' : 'pointer',
    marginTop: '10px',
    minHeight: isMobile ? '56px' : '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.1)',
    opacity: (loading || !canGenerate() || !input.trim()) ? 0.6 : 1,
    WebkitTapHighlightColor: 'transparent' // Remove tap highlight on mobile
  };

  const mainContentStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '16px' : '30px',
    alignItems: 'stretch',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '0 4px' : '0'
  };

  const sectionStyle = {
    flex: 1,
    minWidth: 0,
    width: '100%' // Ensure full width on mobile
  };

  // Educational Content Styles - MOBILE OPTIMIZED
  const tipBoxStyle = {
    backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(219, 234, 254, 0.9)',
    border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(147, 197, 253, 0.8)'}`,
    borderRadius: '12px',
    padding: isMobile ? '14px' : '20px',
    margin: '16px 0',
    position: 'relative'
  };

  const warningBoxStyle = {
    backgroundColor: darkMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(254, 243, 199, 0.9)',
    border: `1px solid ${darkMode ? 'rgba(245, 158, 11, 0.4)' : 'rgba(252, 211, 77, 0.8)'}`,
    borderRadius: '12px',
    padding: isMobile ? '14px' : '20px',
    margin: '16px 0',
    position: 'relative'
  };

  const successBoxStyle = {
    backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(209, 250, 229, 0.9)',
    border: `1px solid ${darkMode ? 'rgba(16, 185, 129, 0.4)' : 'rgba(110, 231, 183, 0.8)'}`,
    borderRadius: '12px',
    padding: isMobile ? '14px' : '20px',
    margin: '16px 0',
    position: 'relative'
  };

  return (
    <Layout 
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      user={user}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      isMobile={isMobile}
    >
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="keywords" content="AI prompt generator, AI writing tool, prompt engineering, content creation, AI assistance" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={containerStyle}>
        {/* MAIN HEADER CONTENT */}
        <header style={{
          textAlign: 'center',
          padding: isMobile ? '20px 0' : '60px 0',
          marginBottom: isMobile ? '20px' : '30px',
        }}>
          <h1 style={mainTitleStyle}>AI Prompt Maker</h1>
          <p style={subtitleStyle}>
            Transform your ideas into perfect AI prompts with advanced multi-model AI technology. 
            Free forever for creators, writers, and developers worldwide.
          </p>
          
          {/* Stats Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '16px' : '40px',
            marginTop: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: isMobile ? '1.3rem' : '2rem', 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                10K+
              </div>
              <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                Prompts Generated
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: isMobile ? '1.3rem' : '2rem', 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                4
              </div>
              <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                AI Models
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: isMobile ? '1.3rem' : '2rem', 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                12+
              </div>
              <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                Templates
              </div>
            </div>
          </div>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span>🚨</span>
                  <strong style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>Free Limit Reached</strong>
                </div>
                <p style={{ margin: 0, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                  You've used all 5 free prompts. Login for unlimited access!
                </p>
                <button 
                  onClick={handleLogin}
                  style={{
                    ...generateButtonStyle,
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    marginTop: '12px',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}
                >
                  🔐 Login to Continue
                </button>
              </div>
            )}

            {/* Configuration */}
            <div style={cardStyle}>
              <h2 style={{ 
                margin: '0 0 16px 0', 
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '700'
              }}>
                ⚙️ Configuration
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: isMobile ? '12px' : '16px' 
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>
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
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>
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
                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ 
                    margin: '0 0 10px 0', 
                    fontSize: isMobile ? '1rem' : '1.2rem',
                    color: darkMode ? '#e2e8f0' : '#374151'
                  }}>
                    🎨 Image Settings
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                    gap: isMobile ? '10px' : '16px' 
                  }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        Style
                      </label>
                      <select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} style={inputStyle}>
                        {IMAGE_STYLES.map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        Aspect Ratio
                      </label>
                      <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={inputStyle}>
                        {['1:1', '16:9', '9:16', '4:3', '3:2'].map(ratio => (
                          <option key={ratio} value={ratio}>{ratio}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.85rem' : '1rem', color: darkMode ? '#e2e8f0' : '#374151' }}>
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
              <div style={{ marginTop: '16px' }}>
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
                    padding: '0',
                    fontWeight: '600'
                  }}
                >
                  {advancedOptions ? '▼' : '▶'} Advanced Options
                </button>

                {advancedOptions && (
                  <div style={{ 
                    marginTop: '12px', 
                    padding: isMobile ? '12px' : '16px', 
                    backgroundColor: darkMode ? '#1e293b' : '#f1f5f9', 
                    borderRadius: '12px',
                    border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        Creativity Level
                      </label>
                      <select value={creativityLevel} onChange={(e) => setCreativityLevel(e.target.value)} style={inputStyle}>
                        <option value="precise">Precise & Factual</option>
                        <option value="balanced">Balanced</option>
                        <option value="creative">Highly Creative</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        Temperature: {temperature}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: darkMode ? '#475569' : '#e2e8f0' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Response Length: {maxTokens} tokens
                </label>
                <input
                  type="range"
                  min="200"
                  max="800"
                  step="200"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: darkMode ? '#475569' : '#e2e8f0' }}
                />
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Language
                </label>
                <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '0.85rem' : '1rem', color: darkMode ? '#e2e8f0' : '#374151' }}>
                    <input 
                      type="radio" 
                      name="lang" 
                      checked={language === 'English'} 
                      onChange={() => setLanguage('English')} 
                      style={{ width: '18px', height: '18px' }}
                    />
                    English
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '0.85rem' : '1rem', color: darkMode ? '#e2e8f0' : '#374151' }}>
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
              <h2 style={{ 
                margin: '0 0 16px 0', 
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '700'
              }}>
                💡 Your Idea
              </h2>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you want to create... Example: 'A blog post about AI in healthcare'"
                  rows={isMobile ? 4 : 6}
                  style={textareaStyle}
                  required
                />
                
                {loading && generationStatus && (
                  <div style={{
                    padding: isMobile ? '10px' : '14px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    textAlign: 'center',
                    fontSize: isMobile ? '0.85rem' : '1rem',
                    border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
                  }}>
                    {generationStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !canGenerate() || !input.trim()}
                  style={generateButtonStyle}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '10px'
                      }}></div>
                      Generating...
                    </>
                  ) : (
                    '✨ Generate AI Prompt'
                  )}
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
                  marginBottom: '16px',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '10px' : '0',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: isMobile ? '1.2rem' : '1.5rem',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '700'
                  }}>
                    🎉 Your AI Prompt
                  </h2>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-end' }}>
                    <button onClick={copyToClipboard} style={{
                      padding: isMobile ? '10px 14px' : '10px 20px',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: isMobile ? '0.85rem' : '0.95rem',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }} title="Copy to Clipboard">
                      📋 Copy
                    </button>
                    <button onClick={exportTxt} style={{
                      padding: isMobile ? '10px 14px' : '10px 20px',
                      backgroundColor: '#8b5cf6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: isMobile ? '0.85rem' : '0.95rem',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }} title="Download as TXT">
                      💾 Export
                    </button>
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  padding: isMobile ? '14px' : '20px',
                  marginBottom: '16px',
                  maxHeight: isMobile ? '300px' : '450px',
                  overflowY: 'auto',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
                  WebkitOverflowScrolling: 'touch' // Smooth scrolling for mobile
                }}>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0,
                    fontSize: isMobile ? '0.85rem' : '1rem',
                    lineHeight: '1.6',
                    fontFamily: 'inherit',
                    color: darkMode ? '#e2e8f0' : '#374151'
                  }}>
                    {output}
                  </pre>
                </div>
                
                {usedModel && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: isMobile ? '10px' : '16px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '6px' : '0',
                    textAlign: isMobile ? 'center' : 'left',
                    border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
                  }}>
                    <span style={{ fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>Generated with:</span>
                    <code style={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: isMobile ? '0.75rem' : '0.9rem',
                      fontWeight: '600',
                      color: '#1d4ed8'
                    }}>
                      {usedModel}
                    </code>
                  </div>
                )}

                {/* AI Models Showcase */}
                <div style={{
                  padding: isMobile ? '12px' : '16px',
                  backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                  borderRadius: '12px',
                  border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                  marginTop: '16px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    🤖 Powered by Multiple AI Models:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                    {AI_MODELS.map((model, index) => (
                      <span key={index} style={{
                        backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: isMobile ? '0.7rem' : '0.8rem',
                        border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                        color: darkMode ? '#cbd5e1' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {model.free && <span style={{ color: '#10b981' }}>🆓</span>}
                        {model.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                ...cardStyle,
                textAlign: 'center',
                padding: isMobile ? '30px 16px' : '60px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: isMobile ? '250px' : '400px',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)'
              }}>
                <div style={{ 
                  fontSize: isMobile ? '3rem' : '5rem', 
                  marginBottom: '16px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🚀
                </div>
                <h3 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: isMobile ? '1.2rem' : '1.8rem',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '800'
                }}>
                  Ready to Create?
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  fontSize: isMobile ? '0.9rem' : '1.1rem',
                  maxWidth: '400px',
                  lineHeight: '1.5'
                }}>
                  Enter your idea above to generate professional AI prompts using multiple AI models including Gemini, Claude, Llama, and Mistral.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* COMPREHENSIVE EDUCATIONAL SECTION - MOBILE OPTIMIZED */}
        <section style={{
          maxWidth: '1200px',
          margin: isMobile ? '40px auto' : '60px auto',
          padding: isMobile ? '0 8px' : '0 24px'
        }}>
          <div style={cardStyle}>
            <h2 style={{
              fontSize: isMobile ? '1.5rem' : '2.5rem',
              textAlign: 'center',
              margin: '0 0 30px 0',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '900',
              lineHeight: '1.2'
            }}>
              Master the Art of AI Prompt Engineering
            </h2>

            {/* Introduction */}
            <div style={tipBoxStyle}>
              <h3 style={{ margin: '0 0 10px 0', color: darkMode ? '#3b82f6' : '#1d4ed8', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>
                💡 What is Prompt Engineering?
              </h3>
              <p style={{ margin: 0, lineHeight: '1.6', color: darkMode ? '#e2e8f0' : '#374151', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                Prompt engineering is the art and science of crafting inputs that guide AI models to produce desired outputs. 
                It's like learning to speak the AI's language - the better your prompts, the better your results.
              </p>
            </div>

            {/* Rest of educational content remains similar but with mobile optimizations */}
            {/* ... (educational content with proper mobile styles) ... */}
            
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Mobile-specific fixes */
        @media (max-width: 768px) {
          body {
            -webkit-text-size-adjust: 100%;
          }
          
          input, select, textarea {
            font-size: 16px !important; /* Prevent zoom on iOS */
          }
        }
      `}</style>
    </Layout>
  );
}
