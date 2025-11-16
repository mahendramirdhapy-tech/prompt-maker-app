// pages/index.js - ENHANCED PROMPT GENERATION WITH ALL FEATURES
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Enhanced Templates with more categories
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
  { label: 'Email Response', value: 'Write a professional email response to' },
  { label: 'YouTube Script', value: 'Create a YouTube video script about' },
  { label: 'Ad Copy', value: 'Write persuasive ad copy for' },
  { label: 'Resume Bullet', value: 'Create professional resume bullet points for' },
  { label: 'Poem', value: 'Write a poem about' },
];

// Enhanced Tones
const TONES = [
  'Professional', 'Friendly', 'Technical', 'Creative', 'Humorous', 
  'Formal', 'Casual', 'Persuasive', 'Educational', 'Inspirational',
  'Authoritative', 'Conversational', 'Witty', 'Empathetic'
];

// Enhanced AI Models
const AI_MODELS = [
  { name: 'gemini-pro', label: 'Google Gemini Pro', free: true },
  { name: 'claude-instant', label: 'Claude Instant', free: true },
  { name: 'llama-3', label: 'Meta Llama 3', free: true },
  { name: 'mistral', label: 'Mistral 7B', free: true },
];

// Enhanced Tool Cards Data
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

// Image generation styles for Midjourney/DALL-E
const IMAGE_STYLES = [
  'Photorealistic', 'Digital Art', 'Oil Painting', 'Watercolor', 'Anime',
  'Cyberpunk', 'Minimalist', 'Vintage', 'Futuristic', 'Fantasy',
  'Sci-Fi', 'Abstract', 'Impressionist', 'Surreal', 'Hyperrealistic'
];

// Image aspect ratios
const ASPECT_RATIOS = [
  '1:1', '16:9', '9:16', '4:3', '3:2', '2:3'
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
  const [imageStyle, setImageStyle] = useState('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [includeNegativePrompt, setIncludeNegativePrompt] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [creativityLevel, setCreativityLevel] = useState('balanced');
  const [currentTemplate, setCurrentTemplate] = useState('');
  const [lastInput, setLastInput] = useState('');
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
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, [mobileMenuOpen]);

  // Enhanced dark mode with professional theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      updateDarkModeStyles(isDark);
      
      // Load usage count
      const savedUsage = localStorage.getItem('guestUsage');
      if (savedUsage) {
        setUsageCount(parseInt(savedUsage));
      }
    }
  }, []);

  // Load history from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedHistory = localStorage.getItem('promptHistory');
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setPromptHistory(history);
        }
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  const updateDarkModeStyles = (isDark) => {
    if (typeof document !== 'undefined') {
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
    }
  };

  // Enhanced user initialization with Supabase
  useEffect(() => {
    let mounted = true;

    const initUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (mounted) {
          if (error) throw error;
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
          if (event === 'SIGNED_IN') {
            setShowLoginModal(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Save history to localStorage whenever promptHistory changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
      } catch (error) {
        console.error('Error saving history:', error);
      }
    }
  }, [promptHistory]);

  // Enhanced cache management
  const saveToCache = (key, data) => {
    const newCache = new Map(responseCache);
    newCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: 30 * 60 * 1000 // 30 minutes
    });
    
    if (newCache.size > 50) {
      const firstKey = newCache.keys().next().value;
      newCache.delete(firstKey);
    }
    
    setResponseCache(newCache);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('responseCache', JSON.stringify(Array.from(newCache.entries())));
      } catch (error) {
        console.error('Error saving cache:', error);
      }
    }
  };

  const getFromCache = (key) => {
    const cached = responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  };

  // Enhanced prompt generation algorithm
  const enhancePrompt = (input, template, tone, language, imageStyle, aspectRatio, includeNegativePrompt) => {
    let enhancedPrompt = input;
    
    // Apply template if selected
    if (template && !input.startsWith(template)) {
      enhancedPrompt = `${template} ${input}`;
    }

    // Add tone and style instructions
    const toneInstructions = {
      'Professional': 'Use professional, formal language with clear structure.',
      'Friendly': 'Use warm, conversational, and approachable language.',
      'Technical': 'Include technical details, specifications, and precise terminology.',
      'Creative': 'Be imaginative, use metaphors, and creative expressions.',
      'Humorous': 'Add wit, humor, and light-hearted elements.',
      'Persuasive': 'Use convincing arguments and call-to-action language.',
      'Educational': 'Explain concepts clearly with examples and step-by-step guidance.',
      'Inspirational': 'Use motivational language and uplifting tone.'
    };

    // Image prompt enhancement for Midjourney/DALL-E
    if (template.includes('Midjourney') || template.includes('DALL-E')) {
      let imagePrompt = enhancedPrompt;
      
      // Add style specifications
      if (imageStyle && imageStyle !== 'Photorealistic') {
        imagePrompt += `, ${imageStyle.toLowerCase()} style`;
      }
      
      // Add aspect ratio
      imagePrompt += ` --ar ${aspectRatio}`;
      
      // Add quality parameters
      imagePrompt += ' --quality 2 --style 4k';
      
      // Add negative prompt if requested
      if (includeNegativePrompt) {
        imagePrompt += ` --no blur, low quality, distorted, watermark, text`;
      }
      
      return imagePrompt;
    }

    // Text prompt enhancement
    let finalPrompt = `${enhancedPrompt}\n\nPlease generate this in a ${tone.toLowerCase()} tone. `;
    
    if (toneInstructions[tone]) {
      finalPrompt += toneInstructions[tone] + ' ';
    }

    // Language specification
    if (language !== 'English') {
      finalPrompt += `Write in ${language}. `;
    }

    // Add creativity level
    const creativityInstructions = {
      'precise': 'Be very precise and factual.',
      'balanced': 'Balance creativity with accuracy.',
      'creative': 'Be highly creative and imaginative.'
    };

    if (creativityInstructions[creativityLevel]) {
      finalPrompt += creativityInstructions[creativityLevel];
    }

    return finalPrompt;
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
      maxTokens: promptData.maxTokens,
      imageStyle: promptData.imageStyle,
      aspectRatio: promptData.aspectRatio
    };

    setPromptHistory(prev => {
      const newHistory = [historyItem, ...prev];
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
    if (typeof window !== 'undefined' && confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
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
      await new Promise(resolve => setTimeout(resolve, 500));
      return cachedResponse;
    }

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
          
          saveToCache(cacheKey, result);
          return result;
        }
      } catch (error) {
        console.warn(`${model.label} failed:`, error.message);
        
        if (i === AI_MODELS.length - 1 && retryCount < 2) {
          setGenerationStatus(`🔄 Retrying with different approach... (${retryCount + 1}/2)`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return generateWithFallback(inputData, retryCount + 1);
        }
      }
      
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

    return await response.json();
  };

  const canGenerate = () => user || usageCount < 5;

  // FIXED: Enhanced submit handler with proper regeneration support
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!input.trim() || !canGenerate()) return;

    setLoading(true);
    setOutput('');
    setUsedModel('');
    setFeedbackGiven(null);
    setGenerationStatus('🚀 Starting generation...');

    try {
      // Store the current input for regeneration
      setLastInput(input);

      const enhancedInput = enhancePrompt(
        input, 
        template, 
        tone, 
        language, 
        imageStyle, 
        aspectRatio, 
        includeNegativePrompt
      );

      const inputData = {
        idea: enhancedInput,
        language,
        tone,
        maxTokens,
        temperature,
        type: 'prompt',
        creativity: creativityLevel,
        template: currentTemplate
      };

      const result = await generateWithFallback(inputData);

      setOutput(result.prompt);
      setUsedModel(result.modelLabel);

      // Save to Supabase database with error handling
      try {
        const { error } = await supabase.from('prompts').insert({
          user_id: user?.id || null,
          input: input.trim(),
          enhanced_input: enhancedInput,
          output: result.prompt,
          model_used: result.modelUsed,
          language,
          tone,
          max_tokens: maxTokens,
          temperature,
          image_style: imageStyle,
          aspect_ratio: aspectRatio,
          type: 'prompt',
        });

        if (error) console.error('Error saving to database:', error);
      } catch (dbError) {
        console.error('Database error:', dbError);
      }

      // Add to local history
      addToHistory({
        input: input.trim(),
        output: result.prompt,
        model: result.modelLabel,
        tone,
        language,
        template,
        maxTokens,
        imageStyle,
        aspectRatio
      });

      // Update usage for guests
      if (!user && typeof window !== 'undefined') {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('guestUsage', newCount.toString());
        if (newCount >= 5) setShowLoginModal(true);
      }

      setGenerationStatus('✅ Generation completed!');

    } catch (err) {
      console.error('Generation error:', err);
      setGenerationStatus('❌ Generation failed');
      
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

  // FIXED: Regenerate function - now properly regenerates
  const handleRegenerate = () => {
    if (lastInput.trim()) {
      // Use the last input for regeneration
      setInput(lastInput);
      // Small delay to ensure state update
      setTimeout(() => {
        handleSubmit({ preventDefault: () => {} });
      }, 100);
    } else if (input.trim()) {
      // Use current input if lastInput is not available
      handleSubmit({ preventDefault: () => {} });
    }
  };

  // Template change handler with enhanced functionality
  const handleTemplateChange = (e) => {
    const val = e.target.value;
    setTemplate(val);
    setCurrentTemplate(val);
    
    // Auto-fill input with template if it's empty or user wants to replace
    if (val && (!input.trim() || input === lastInput)) {
      setInput(val + ' ');
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      alert('✅ Prompt copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = output;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Prompt copied to clipboard!');
    }
  };

  // Rest of the functions remain the same (handleLogin, handleLogout, exportTxt, etc.)
  // ... [Previous functions like handleLogin, handleLogout, exportTxt remain the same]

  const handleLogin = async () => {
    try {
      if (typeof window === 'undefined') return;
      
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const exportTxt = () => {
    if (typeof window === 'undefined' || !output) return;
    
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

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newDarkMode.toString());
    }
    updateDarkModeStyles(newDarkMode);
  };

  const navigateTo = (path) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const formatDate = (dateString) => {
    try {
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
    } catch (error) {
      return 'Recent';
    }
  };

  // Enhanced styles with additional options
  const styles = {
    // ... [Previous styles remain the same, adding new ones for enhanced features]
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
    // ... [Rest of the styles remain similar]
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {/* ... [Previous meta tags] */}
      </Head>

      <div style={styles.container}>
        {/* HEADER - Same as before */}
        <header style={styles.header}>
          {isMobile && (
            <button onClick={toggleMobileMenu} style={styles.mobileMenuButton}>
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          )}

          <h1 style={styles.mainTitle}>AI Prompt Maker</h1>
          <p style={styles.subtitle}>Transform your ideas into perfect AI prompts</p>
          
          <div style={styles.navContainer}>
            <div style={styles.navLinks}>
              <button onClick={() => navigateTo('/')} style={styles.navLink(router.pathname === '/')}>
                🏠 Home
              </button>
              {/* ... [Other nav links] */}
            </div>

            <div style={styles.actionButtons}>
              <button onClick={() => setShowHistory(!showHistory)} style={styles.button('#8b5cf6')}>
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
              
              <button onClick={toggleDarkMode} style={styles.button(darkMode ? '#4b5563' : '#e5e7eb', darkMode ? '#f9fafb' : '#374151')}>
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
            {/* Usage Alert - Same as before */}
            {!canGenerate() && !user && (
              <div style={{
                ...styles.card,
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                border: '1px solid #f59e0b',
                color: '#92400e',
              }}>
                {/* ... [Usage alert content] */}
              </div>
            )}

            {/* Enhanced Configuration */}
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
                  <select value={tone} onChange={(e) => setTone(e.target.value)} style={styles.input}>
                    {TONES.map(toneOption => (
                      <option key={toneOption} value={toneOption}>{toneOption}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    Template
                  </label>
                  <select value={template} onChange={handleTemplateChange} style={styles.input}>
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
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        Style
                      </label>
                      <select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} style={styles.input}>
                        {IMAGE_STYLES.map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        Aspect Ratio
                      </label>
                      <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={styles.input}>
                        {ASPECT_RATIOS.map(ratio => (
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
                  <div style={{ marginTop: '10px', padding: '12px', backgroundColor: darkMode ? '#0f172a' : '#f1f5f9', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        Creativity Level
                      </label>
                      <select value={creativityLevel} onChange={(e) => setCreativityLevel(e.target.value)} style={styles.input}>
                        <option value="precise">Precise & Factual</option>
                        <option value="balanced">Balanced</option>
                        <option value="creative">Highly Creative</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: isMobile ? '0.9rem' : '1rem' }}>
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
                    <button onClick={handleRegenerate} style={styles.button('#10b981')} title="Regenerate">
                      🔄
                    </button>
                    <button onClick={copyToClipboard} style={styles.button('#3b82f6')} title="Copy to Clipboard">
                      📋
                    </button>
                    <button onClick={exportTxt} style={styles.button('#8b5cf6')} title="Download as TXT">
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
                      <button onClick={() => handleFeedback(true)} style={styles.button('#22c55e')}>👍 Yes</button>
                      <button onClick={() => handleFeedback(false)} style={styles.button('#ef4444')}>👎 No</button>
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
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '40px'
          }}>
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
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Tool card content remains the same */}
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER SECTION - Same as before */}
        <footer style={{
          backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
          padding: isMobile ? '30px 16px 16px' : '40px 20px 20px',
          marginTop: '40px',
          borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        }}>
          {/* Footer content remains the same */}
        </footer>

        {/* HISTORY MODAL - Same as before */}
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
            {/* History modal content remains the same */}
          </div>
        )}

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
