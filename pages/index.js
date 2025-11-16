// pages/index.js - FIXED VERSION
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

  // FIXED STYLES - navLink function issue resolved
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

    header: {
      textAlign: 'center',
      padding: isMobile ? '15px 0' : '30px 0',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      marginBottom: '20px',
      position: 'relative',
    },

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

    navLinks: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '8px' : '12px',
      alignItems: 'center',
      width: isMobile ? '100%' : 'auto',
    },

    // FIXED: navLink as object instead of function
    navLink: {
      color: darkMode ? '#cbd5e1' : '#64748b',
      cursor: 'pointer',
      padding: isMobile ? '10px 12px' : '6px 12px',
      borderRadius: '8px',
      fontSize: isMobile ? '0.9rem' : '0.9rem',
      backgroundColor: 'transparent',
      textAlign: isMobile ? 'left' : 'center',
      width: isMobile ? '100%' : 'auto',
      display: 'block',
      border: 'none',
      background: 'none',
      fontFamily: 'inherit',
    },

    navLinkActive: {
      color: '#3b82f6',
      backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
    },

    actionButtons: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '8px' : '12px',
      alignItems: 'center',
      width: isMobile ? '100%' : 'auto',
    },

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
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AI Prompt Maker" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <meta name="keywords" content="AI prompt generator, free AI tools, ChatGPT prompts, content creation, AI writing assistant, GPT-4 prompts, Gemini AI, Claude AI, Llama AI" />
        <meta name="author" content="AI Prompt Maker" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
      </Head>

      <div style={styles.container}>
        {/* HEADER */}
        <header style={styles.header}>
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              style={styles.mobileMenuButton}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          )}

          <h1 style={styles.mainTitle}>AI Prompt Maker</h1>
          <p style={styles.subtitle}>Transform your ideas into perfect AI prompts</p>
          
          <div style={styles.navContainer}>
            <div style={styles.navLinks}>
              {/* FIXED: Using style objects directly instead of function calls */}
              <button 
                onClick={() => navigateTo('/')} 
                style={{
                  ...styles.navLink,
                  ...(router.pathname === '/' ? styles.navLinkActive : {})
                }}
              >
                🏠 Home
              </button>
              <button 
                onClick={() => navigateTo('/seo')} 
                style={{
                  ...styles.navLink,
                  ...(router.pathname === '/seo' ? styles.navLinkActive : {})
                }}
              >
                🔍 SEO
              </button>
              <button 
                onClick={() => navigateTo('/code')} 
                style={{
                  ...styles.navLink,
                  ...(router.pathname === '/code' ? styles.navLinkActive : {})
                }}
              >
                💻 Code
              </button>
              <button 
                onClick={() => navigateTo('/email')} 
                style={{
                  ...styles.navLink,
                  ...(router.pathname === '/email' ? styles.navLinkActive : {})
                }}
              >
                ✉️ Email
              </button>
              <button 
                onClick={() => navigateTo('/translate')} 
                style={{
                  ...styles.navLink,
                  ...(router.pathname === '/translate' ? styles.navLinkActive : {})
                }}
              >
                🔄 Translate
              </button>
              <button 
                onClick={() => navigateTo('/audio')} 
                style={{
                  ...styles.navLink,
                  ...(router.pathname === '/audio' ? styles.navLinkActive : {})
                }}
              >
                🎵 Audio Tool
              </button>
              <button 
                onClick={() => navigateTo('/catalog-maker')} 
                style={{
                  ...styles.navLink,
                  ...(router.pathname === '/catalog-maker' ? styles.navLinkActive : {})
                }}
              >
                📋 Catalog Maker
              </button>
              <button 
                onClick={() => navigateTo('/prompts')} 
                style={{
                  ...styles.navLink,
                  ...(router.pathname === '/prompts' ? styles.navLinkActive : {})
                }}
              >
                📚 Library
              </button>
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

        {/* MAIN CONTENT - Rest of the component remains the same */}
        {/* ... [Rest of the JSX code remains unchanged] ... */}
      </div>
    </>
  );
}
