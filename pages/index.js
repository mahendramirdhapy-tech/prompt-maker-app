// pages/index.js - COMPLETE MODERN UI WITH ALL FEATURES
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

// Tool Cards Data - COMPLETE
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

// Features Dropdown Items
const FEATURES_ITEMS = [
  { path: '/seo', label: '🔍 SEO Tool' },
  { path: '/code', label: '💻 Code Assistant' },
  { path: '/email', label: '✉️ Email Writer' },
  { path: '/translate', label: '🔄 Translator' },
  { path: '/audio', label: '🎵 Audio Tool' },
  { path: '/prompts', label: '📚 Prompt Library' },
  { path: '/website-builder', label: '🌐 Website Builder' },
];

// Pricing Plans
const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '5 prompts per day',
      'Basic AI models',
      'Standard templates',
      'Community support'
    ],
    buttonText: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    features: [
      'Unlimited prompts',
      'All AI models access',
      'Advanced templates',
      'Priority support',
      'Image to prompt feature',
      'Export capabilities'
    ],
    buttonText: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: 'per month',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom templates',
      'API access',
      'Dedicated support',
      'Advanced analytics'
    ],
    buttonText: 'Contact Sales',
    popular: false
  }
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

  // Navigation States
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const router = useRouter();

  // SEO data
  const pageTitle = "AI Prompt Maker - Free AI Prompt Generator Tool";
  const pageDescription = "Transform your ideas into perfect AI prompts with our free AI Prompt Generator. Support for multiple AI models including GPT-4, Gemini, Claude, and Llama.";

  // Navigation items
  const navItems = [
    { path: '/pricing', label: 'Pricing', icon: '💰', action: () => setShowPricingModal(true) },
    { path: '/features', label: 'Features', icon: '⚡', dropdown: true },
  ];

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
            setShowFeaturesDropdown(false);
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
    setMobileMenuOpen(false);
    setShowFeaturesDropdown(false);
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

  // MODERN STYLES
  const containerStyle = {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    maxWidth: '100%',
    margin: '0 auto',
    padding: isMobile ? '12px' : '24px',
    paddingBottom: isMobile ? '80px' : '40px',
    minHeight: '100vh',
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    boxSizing: 'border-box',
    position: 'relative',
    background: darkMode 
      ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '15px 0' : '20px 0',
    marginBottom: '20px',
    position: 'relative',
  };

  const logoStyle = {
    fontSize: isMobile ? '1.5rem' : '2rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  };

  const mainTitleStyle = {
    fontSize: isMobile ? '2rem' : '3.5rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 12px 0',
    lineHeight: '1.1',
    textAlign: 'center'
  };

  const subtitleStyle = {
    fontSize: isMobile ? '1rem' : '1.3rem',
    color: darkMode ? '#cbd5e1' : '#64748b',
    margin: '0',
    lineHeight: '1.4',
    textAlign: 'center',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  // Features Dropdown Style
  const featuresDropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: '8px 0',
    minWidth: '220px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    zIndex: 1000,
    marginTop: '8px'
  };

  // Mobile Sidebar Styles
  const mobileSidebarStyle = {
    position: 'fixed',
    top: 0,
    left: mobileMenuOpen ? '0' : '-100%',
    width: '300px',
    height: '100vh',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
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
    padding: isMobile ? '12px 16px' : '10px 20px',
    backgroundColor: bgColor,
    color: textColor,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: isMobile ? '0.9rem' : '0.95rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    minHeight: isMobile ? '44px' : 'auto',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  });

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    border: `1px solid ${darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)'}`,
    borderRadius: '16px',
    padding: isMobile ? '20px' : '24px',
    marginBottom: '20px',
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)'
  };

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '14px' : '16px',
    borderRadius: '12px',
    border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    fontSize: isMobile ? '16px' : '16px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    minHeight: isMobile ? '44px' : 'auto',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: isMobile ? '140px' : '180px',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.6'
  };

  const generateButtonStyle = {
    width: '100%',
    padding: isMobile ? '18px' : '20px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontSize: isMobile ? '1.1rem' : '1.2rem',
    fontWeight: '700',
    cursor: (loading || !canGenerate() || !input.trim()) ? 'not-allowed' : 'pointer',
    marginTop: '10px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.1)',
    opacity: (loading || !canGenerate() || !input.trim()) ? 0.6 : 1
  };

  const mainContentStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '20px' : '30px',
    alignItems: 'stretch',
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const sectionStyle = {
    flex: 1,
    minWidth: 0
  };

  const toolsGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '60px'
  };

  const footerStyle = {
    background: darkMode 
      ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: isMobile ? '40px 16px 20px' : '60px 20px 30px',
    marginTop: '60px',
    borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
  };

  const footerGridStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: isMobile ? '30px' : '40px',
    marginBottom: '30px'
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
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
          {/* Sidebar Header */}
          <div style={{
            padding: '25px',
            borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: darkMode 
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <h3 style={{ 
              margin: 0, 
              color: darkMode ? '#f8fafc' : '#1e293b',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800'
            }}>
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

          {/* Sidebar Navigation */}
          <div style={{ padding: '20px 0', flex: 1 }}>
            {navItems.map((item) => (
              <div key={item.path}>
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px 20px',
                        color: darkMode ? '#cbd5e1' : '#64748b',
                        textDecoration: 'none',
                        border: 'none',
                        background: 'none',
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                      {item.label} {showFeaturesDropdown ? '▲' : '▼'}
                    </button>
                    {showFeaturesDropdown && (
                      <div style={{ paddingLeft: '20px' }}>
                        {FEATURES_ITEMS.map((feature) => (
                          <button
                            key={feature.path}
                            onClick={() => {
                              navigateTo(feature.path);
                              setMobileMenuOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 20px',
                              color: darkMode ? '#cbd5e1' : '#64748b',
                              textDecoration: 'none',
                              border: 'none',
                              background: 'none',
                              width: '100%',
                              textAlign: 'left',
                              fontSize: '0.9rem',
                              cursor: 'pointer'
                            }}
                          >
                            <span style={{ fontSize: '1.1rem' }}>{feature.icon}</span>
                            {feature.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        navigateTo(item.path);
                      }
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 20px',
                      color: darkMode ? '#cbd5e1' : '#64748b',
                      textDecoration: 'none',
                      border: 'none',
                      background: 'none',
                      width: '100%',
                      textAlign: 'left',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            
            {/* Additional Mobile Navigation Items */}
            <button onClick={() => navigateTo('/')} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              color: darkMode ? '#cbd5e1' : '#64748b',
              textDecoration: 'none',
              border: 'none',
              background: 'none',
              width: '100%',
              textAlign: 'left',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🏠</span>
              Home
            </button>
            <button onClick={() => setShowImageToPrompt(true)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              color: darkMode ? '#cbd5e1' : '#64748b',
              textDecoration: 'none',
              border: 'none',
              background: 'none',
              width: '100%',
              textAlign: 'left',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🖼️</span>
              Image to Prompt
            </button>
            <button onClick={() => setShowHistory(true)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              color: darkMode ? '#cbd5e1' : '#64748b',
              textDecoration: 'none',
              border: 'none',
              background: 'none',
              width: '100%',
              textAlign: 'left',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              <span style={{ fontSize: '1.2rem' }}>📚</span>
              History
            </button>
          </div>

          {/* Sidebar Footer */}
          <div style={{
            padding: '25px',
            borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {user ? (
              <button onClick={handleLogout} style={buttonStyle('#6b7280', '#fff')}>
                👤 Logout
              </button>
            ) : (
              <button onClick={handleLogin} style={buttonStyle('#3b82f6', '#fff')}>
                🔐 Login with Google
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
                padding: '10px',
                borderRadius: '10px',
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
            <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
              {navItems.map((item) => (
                <div key={item.path} style={{ position: 'relative' }}>
                  {item.dropdown ? (
                    <div>
                      <button 
                        onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                        onMouseEnter={() => setShowFeaturesDropdown(true)}
                        style={{
                          color: darkMode ? '#cbd5e1' : '#64748b',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: '600',
                          padding: '10px 16px',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          borderRadius: '10px'
                        }}
                      >
                        {item.label} {showFeaturesDropdown ? '▲' : '▼'}
                      </button>
                      
                      {showFeaturesDropdown && (
                        <div 
                          style={featuresDropdownStyle}
                          onMouseLeave={() => setShowFeaturesDropdown(false)}
                        >
                          {FEATURES_ITEMS.map((feature) => (
                            <button
                              key={feature.path}
                              onClick={() => {
                                navigateTo(feature.path);
                                setShowFeaturesDropdown(false);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                color: darkMode ? '#cbd5e1' : '#64748b',
                                textDecoration: 'none',
                                border: 'none',
                                background: 'none',
                                width: '100%',
                                textAlign: 'left',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                borderRadius: '8px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                                e.currentTarget.style.color = '#3b82f6';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                              }}
                            >
                              <span style={{ fontSize: '1rem' }}>{feature.icon}</span>
                              {feature.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={item.action || (() => navigateTo(item.path))}
                      style={{
                        color: darkMode ? '#cbd5e1' : '#64748b',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        padding: '10px 16px',
                        transition: 'all 0.3s ease',
                        borderRadius: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3b82f6';
                        e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
              
              {/* Additional Desktop Navigation Buttons */}
              <button onClick={() => setShowImageToPrompt(true)} style={buttonStyle('#ec4899')}>
                🖼️ Image to Prompt
              </button>
              <button onClick={() => setShowHistory(!showHistory)} style={buttonStyle('#8b5cf6')}>
                📚 History
              </button>
            </nav>
          )}

          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isMobile && (
              <>
                {user ? (
                  <button 
                    onClick={handleLogout}
                    style={{
                      color: darkMode ? '#cbd5e1' : '#64748b',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ef4444';
                      e.currentTarget.style.backgroundColor = darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleLogin}
                      style={{
                        color: darkMode ? '#cbd5e1' : '#64748b',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3b82f6';
                        e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Login
                    </button>
                    <button 
                      onClick={handleLogin}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        padding: '10px 20px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.4), 0 4px 6px -2px rgba(59, 130, 246, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.1)';
                      }}
                    >
                      Sign Up Free
                    </button>
                  </>
                )}
              </>
            )}
            
            {!isMobile && (
              <button onClick={toggleDarkMode} style={{
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '10px',
                borderRadius: '10px',
                transition: 'all 0.3s ease'
              }}>
                {darkMode ? '☀️' : '🌙'}
              </button>
            )}
          </div>
        </header>

        {/* MAIN HEADER CONTENT */}
        <header style={{
          textAlign: 'center',
          padding: isMobile ? '30px 0' : '60px 0',
          marginBottom: '30px',
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
            gap: isMobile ? '20px' : '40px',
            marginTop: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: isMobile ? '1.5rem' : '2rem', 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                10K+
              </div>
              <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
                Prompts Generated
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: isMobile ? '1.5rem' : '2rem', 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                4
              </div>
              <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
                AI Models
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: isMobile ? '1.5rem' : '2rem', 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                12+
              </div>
              <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
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
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
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
                fontSize: isMobile ? '1.3rem' : '1.5rem',
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151' }}>
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151' }}>
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
                    margin: '0 0 12px 0', 
                    fontSize: isMobile ? '1.1rem' : '1.2rem',
                    color: darkMode ? '#e2e8f0' : '#374151'
                  }}>
                    🎨 Image Settings
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                    gap: isMobile ? '12px' : '16px' 
                  }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151' }}>
                        Style
                      </label>
                      <select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} style={inputStyle}>
                        {IMAGE_STYLES.map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151' }}>
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: isMobile ? '0.9rem' : '1rem', color: darkMode ? '#e2e8f0' : '#374151' }}>
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
                    fontSize: isMobile ? '0.95rem' : '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0',
                    fontWeight: '600'
                  }}
                >
                  {advancedOptions ? '▼' : '▶'} Advanced Options
                </button>

                {advancedOptions && (
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '16px', 
                    backgroundColor: darkMode ? '#0f172a' : '#f1f5f9', 
                    borderRadius: '12px',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151' }}>
                        Creativity Level
                      </label>
                      <select value={creativityLevel} onChange={(e) => setCreativityLevel(e.target.value)} style={inputStyle}>
                        <option value="precise">Precise & Factual</option>
                        <option value="balanced">Balanced</option>
                        <option value="creative">Highly Creative</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151' }}>
                        Temperature: {temperature}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        style={{ width: '100%', height: '6px', borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151' }}>
                  Response Length: {maxTokens} tokens
                </label>
                <input
                  type="range"
                  min="200"
                  max="800"
                  step="200"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  style={{ width: '100%', height: '6px', borderRadius: '3px' }}
                />
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151' }}>
                  Language
                </label>
                <div style={{ display: 'flex', gap: isMobile ? '16px' : '20px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.9rem' : '1rem', color: darkMode ? '#e2e8f0' : '#374151' }}>
                    <input 
                      type="radio" 
                      name="lang" 
                      checked={language === 'English'} 
                      onChange={() => setLanguage('English')} 
                      style={{ width: '18px', height: '18px' }}
                    />
                    English
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.9rem' : '1rem', color: darkMode ? '#e2e8f0' : '#374151' }}>
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
                fontSize: isMobile ? '1.3rem' : '1.5rem',
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
                  rows={isMobile ? 5 : 6}
                  style={textareaStyle}
                  required
                />
                
                {loading && generationStatus && (
                  <div style={{
                    padding: isMobile ? '12px' : '14px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    textAlign: 'center',
                    fontSize: isMobile ? '0.9rem' : '1rem',
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
                  gap: isMobile ? '12px' : '0'
                }}>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: isMobile ? '1.3rem' : '1.5rem',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '700'
                  }}>
                    🎉 Your AI Prompt
                  </h2>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={copyToClipboard} style={buttonStyle('#3b82f6')} title="Copy to Clipboard">
                      📋 Copy
                    </button>
                    <button onClick={exportTxt} style={buttonStyle('#8b5cf6')} title="Download as TXT">
                      💾 Export
                    </button>
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  padding: isMobile ? '16px' : '20px',
                  marginBottom: '16px',
                  maxHeight: isMobile ? '350px' : '450px',
                  overflowY: 'auto',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
                }}>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0,
                    fontSize: isMobile ? '0.9rem' : '1rem',
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
                    padding: isMobile ? '12px' : '16px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '8px' : '0',
                    textAlign: isMobile ? 'center' : 'left',
                    border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
                  }}>
                    <span style={{ fontWeight: '600', color: darkMode ? '#e2e8f0' : '#374151' }}>Generated with:</span>
                    <code style={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: isMobile ? '0.8rem' : '0.9rem',
                      fontWeight: '600',
                      color: '#1d4ed8'
                    }}>
                      {usedModel}
                    </code>
                  </div>
                )}

                {/* AI Models Showcase */}
                <div style={{
                  padding: '16px',
                  backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                  borderRadius: '12px',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  marginTop: '16px'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: darkMode ? '#e2e8f0' : '#374151', fontSize: '1rem' }}>
                    🤖 Powered by Multiple AI Models:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {AI_MODELS.map((model, index) => (
                      <span key={index} style={{
                        backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
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
                padding: isMobile ? '40px 20px' : '60px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: isMobile ? '300px' : '400px',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)'
              }}>
                <div style={{ 
                  fontSize: isMobile ? '4rem' : '5rem', 
                  marginBottom: '20px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🚀
                </div>
                <h3 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: isMobile ? '1.4rem' : '1.8rem',
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
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  maxWidth: '400px',
                  lineHeight: '1.6'
                }}>
                  Enter your idea above to generate professional AI prompts using multiple AI models including Gemini, Claude, Llama, and Mistral.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* TOOL CARDS SECTION */}
        <section style={{ marginTop: '60px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            color: darkMode ? '#f8fafc' : '#1e293b',
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🛠️ Our Free AI Tools
          </h2>
          
          <div style={toolsGridStyle}>
            {TOOL_CARDS.map((tool) => (
              <div
                key={tool.id}
                onClick={() => navigateTo(tool.path)}
                style={{
                  backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)'}`,
                  borderRadius: '16px',
                  padding: '25px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 8px 15px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  display: 'inline-block',
                  marginBottom: '16px',
                  alignSelf: 'flex-start',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {tool.label}
                </div>

                <h3 style={{
                  margin: '0 0 12px 0',
                  color: darkMode ? '#f8fafc' : '#1e293b',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  lineHeight: '1.3'
                }}>
                  {tool.title}
                </h3>

                <p style={{
                  margin: '0 0 20px 0',
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  flex: 1
                }}>
                  {tool.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: darkMode ? '#94a3b8' : '#94a3b8',
                  paddingTop: '15px',
                  borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  <span>By {tool.author}</span>
                  <span>{tool.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEEDBACK DISPLAY SECTION */}
        <section style={{
          marginTop: '80px',
          padding: isMobile ? '40px 0' : '60px 0',
          background: darkMode 
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: isMobile ? '0 16px' : '0 20px'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '50px'
            }}>
              <h2 style={{
                color: darkMode ? '#f8fafc' : '#1e293b',
                fontSize: isMobile ? '2rem' : '2.8rem',
                margin: '0 0 16px 0',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                💬 User Feedback
              </h2>
              <p style={{
                color: darkMode ? '#cbd5e1' : '#64748b',
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                margin: '0',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.6'
              }}>
                See what our users are saying about their experience with AI Prompt Maker
              </p>
            </div>

            {feedbackLoading ? (
              <div style={{
                textAlign: 'center',
                padding: '60px',
                color: darkMode ? '#cbd5e1' : '#64748b'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: `3px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  borderTop: `3px solid #3b82f6`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px'
                }}></div>
                <p style={{ fontSize: '1.1rem', margin: '0' }}>Loading feedback...</p>
              </div>
            ) : recentFeedbacks.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '25px',
                marginBottom: '40px'
              }}>
                {recentFeedbacks.map((feedback) => (
                  <div key={feedback.id} style={{
                    backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: `1px solid ${darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)'}`,
                    borderRadius: '16px',
                    padding: '25px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}>
                    {/* Rating */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      fontSize: '1.8rem'
                    }}>
                      {feedback.rating ? '👍' : '👎'}
                    </div>

                    {/* User Info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: feedback.rating 
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'linear-gradient(135deg, #ef4444, #dc2626)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}>
                        {feedback.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{
                          margin: '0 0 6px 0',
                          color: darkMode ? '#f8fafc' : '#1e293b',
                          fontSize: '1.1rem',
                          fontWeight: '600'
                        }}>
                          {feedback.name}
                        </h4>
                        <p style={{
                          margin: '0',
                          color: darkMode ? '#94a3b8' : '#64748b',
                          fontSize: '0.85rem'
                        }}>
                          {new Date(feedback.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Feedback Message */}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        margin: '0',
                        color: darkMode ? '#cbd5e1' : '#64748b',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {feedback.comment}
                      </p>
                    </div>

                    {/* Category */}
                    <div style={{
                      marginTop: '20px',
                      paddingTop: '20px',
                      borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                    }}>
                      <span style={{
                        background: feedback.rating 
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                        color: feedback.rating ? '#10b981' : '#ef4444',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {feedback.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px',
                color: darkMode ? '#94a3b8' : '#64748b',
                backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                borderRadius: '16px',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💬</div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', color: darkMode ? '#e2e8f0' : '#374151' }}>No Feedback Yet</h3>
                <p style={{ margin: '0 0 25px 0', fontSize: '1.1rem' }}>
                  Be the first to share your experience with us!
                </p>
                <button 
                  onClick={() => navigateTo('/feedback')}
                  style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 20px -5px rgba(59, 130, 246, 0.4), 0 6px 8px -3px rgba(59, 130, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)';
                  }}
                >
                  💬 Share Your Feedback
                </button>
              </div>
            )}

            {/* Call to Action */}
            <div style={{
              textAlign: 'center',
              padding: '40px',
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
              borderRadius: '20px',
              border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{
                margin: '0 0 16px 0',
                color: darkMode ? '#f8fafc' : '#1e293b',
                fontSize: isMobile ? '1.5rem' : '1.8rem',
                fontWeight: '700'
              }}>
                Share Your Experience
              </h3>
              <p style={{
                margin: '0 0 30px 0',
                color: darkMode ? '#cbd5e1' : '#64748b',
                fontSize: isMobile ? '1rem' : '1.1rem',
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.6'
              }}>
                Help us improve by sharing your valuable feedback and suggestions. Your opinion matters!
              </p>
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={() => navigateTo('/feedback')}
                  style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 20px -5px rgba(59, 130, 246, 0.4), 0 6px 8px -3px rgba(59, 130, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)';
                  }}
                >
                  💬 Give Feedback
                </button>
                <button 
                  onClick={() => navigateTo('/contact')}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: 'transparent',
                    color: darkMode ? '#cbd5e1' : '#64748b',
                    border: `2px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '700',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode ? 'rgba(71, 85, 105, 0.2)' : 'rgba(203, 213, 225, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* COMPLETE FOOTER SECTION */}
        <footer style={footerStyle}>
          <div style={footerGridStyle}>
            
            {/* Company Info */}
            <div>
              <h3 style={{
                color: darkMode ? '#f8fafc' : '#1e293b',
                margin: '0 0 16px 0',
                fontSize: isMobile ? '1.2rem' : '1.3rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                AI Prompt Maker
              </h3>
              <p style={{
                color: darkMode ? '#cbd5e1' : '#64748b',
                margin: '0 0 20px 0',
                fontSize: isMobile ? '0.9rem' : '1rem',
                lineHeight: '1.6'
              }}>
                Transform your ideas into perfect AI prompts with our advanced multi-model AI technology. 
                Free tool for creators, writers, and developers worldwide.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ 
                  padding: '8px 14px', 
                  background: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)',
                  borderRadius: '10px',
                  fontSize: isMobile ? '0.75rem' : '0.8rem',
                  fontWeight: '600',
                  color: darkMode ? '#e2e8f0' : '#374151',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  🚀 Fast
                </span>
                <span style={{ 
                  padding: '8px 14px', 
                  background: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)',
                  borderRadius: '10px',
                  fontSize: isMobile ? '0.75rem' : '0.8rem',
                  fontWeight: '600',
                  color: darkMode ? '#e2e8f0' : '#374151',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  🔒 Secure
                </span>
                <span style={{ 
                  padding: '8px 14px', 
                  background: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)',
                  borderRadius: '10px',
                  fontSize: isMobile ? '0.75rem' : '0.8rem',
                  fontWeight: '600',
                  color: darkMode ? '#e2e8f0' : '#374151',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  🎯 AI Powered
                </span>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 style={{
                color: darkMode ? '#f8fafc' : '#1e293b',
                margin: '0 0 16px 0',
                fontSize: isMobile ? '1.1rem' : '1.2rem',
                fontWeight: '700'
              }}>
                Quick Links
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => navigateTo('/')} style={{
                  color: darkMode ? '#93c5fd' : '#3b82f6',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#60a5fa' : '#1d4ed8';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#93c5fd' : '#3b82f6';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span>🏠</span>
                  Home
                </button>
                <button onClick={() => navigateTo('/seo')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#e2e8f0' : '#374151';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span>🔍</span>
                  SEO Tools
                </button>
                <button onClick={() => navigateTo('/code')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#e2e8f0' : '#374151';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span>💻</span>
                  Code Assistant
                </button>
                <button onClick={() => navigateTo('/email')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#e2e8f0' : '#374151';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span>✉️</span>
                  Email Writer
                </button>
                <button onClick={() => navigateTo('/translate')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#e2e8f0' : '#374151';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span>🔄</span>
                  Translator
                </button>
                <button onClick={() => navigateTo('/audio')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#e2e8f0' : '#374151';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span>🎵</span>
                  Audio Tool
                </button>
              </div>
            </div>
            
            {/* Support */}
            <div>
              <h3 style={{
                color: darkMode ? '#f8fafc' : '#1e293b',
                margin: '0 0 16px 0',
                fontSize: isMobile ? '1.1rem' : '1.2rem',
                fontWeight: '700'
              }}>
                Support
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => navigateTo('/help')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#e2e8f0' : '#374151';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span>❓</span>
                  Help Center
                </button>
                <button onClick={() => navigateTo('/contact')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#e2e8f0' : '#374151';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span>📧</span>
                  Contact Us
                </button>
                <button onClick={() => navigateTo('/feedback')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#e2e8f0' : '#374151';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span>💬</span>
                  Feedback
                </button>
                <button onClick={() => navigateTo('/blog')} style={{
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = darkMode ? '#e2e8f0' : '#374151';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <span>📚</span>
                  Blog
                </button>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div style={{
            borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            paddingTop: isMobile ? '20px' : '30px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: isMobile ? '20px' : '30px',
              marginBottom: isMobile ? '16px' : '20px',
              flexWrap: 'wrap'
            }}>
              <button onClick={() => navigateTo('/privacy')} style={{
                color: darkMode ? '#93c5fd' : '#3b82f6',
                cursor: 'pointer',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                background: 'none',
                border: 'none',
                padding: '0',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#93c5fd' : '#3b82f6';
              }}
              >
                Privacy Policy
              </button>
              <button onClick={() => navigateTo('/terms')} style={{
                color: darkMode ? '#93c5fd' : '#3b82f6',
                cursor: 'pointer',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                background: 'none',
                border: 'none',
                padding: '0',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#93c5fd' : '#3b82f6';
              }}
              >
                Terms of Service
              </button>
              <button onClick={() => navigateTo('/cookies')} style={{
                color: darkMode ? '#93c5fd' : '#3b82f6',
                cursor: 'pointer',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                background: 'none',
                border: 'none',
                padding: '0',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#93c5fd' : '#3b82f6';
              }}
              >
                Cookie Policy
              </button>
            </div>
            
            <p style={{ 
              margin: '0', 
              color: darkMode ? '#94a3b8' : '#475569',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              lineHeight: '1.6'
            }}>
              © 2024 AI Prompt Maker. All rights reserved. 
              <br style={{ display: isMobile ? 'block' : 'none' }} />
              Powered by multiple AI models • Made with ❤️ for creators worldwide
            </p>
          </div>
        </footer>

        {/* IMAGE TO PROMPT MODAL */}
        {showImageToPrompt && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: isMobile ? '10px' : '20px'
          }}>
            <div style={{
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              borderRadius: '20px',
              padding: isMobile ? '20px' : '30px',
              width: isMobile ? '100%' : '500px',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
              }}>
                <h2 style={{ 
                  margin: 0,
                  background: 'linear-gradient(135deg, #ec4899, #db2777)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '700'
                }}>
                  🖼️ Image to Prompt
                </h2>
                <button
                  onClick={() => {
                    setShowImageToPrompt(false);
                    setSelectedImage(null);
                    setImagePreview(null);
                    setImageAnalysis('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: darkMode ? '#94a3b8' : '#64748b',
                    transition: 'all 0.3s ease',
                    padding: '5px',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = darkMode ? '#94a3b8' : '#64748b';
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ 
                  fontSize: '4rem', 
                  marginBottom: '20px',
                  background: 'linear-gradient(135deg, #ec4899, #db2777)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🚧
                </div>
                <h3 style={{ 
                  margin: '0 0 15px 0',
                  color: darkMode ? '#f8fafc' : '#1e293b',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  Coming Soon
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  fontSize: '1.1rem',
                  lineHeight: '1.6'
                }}>
                  Image to Prompt feature is currently under development. 
                  We're working hard to bring you this amazing feature soon!
                </p>
                
                <button
                  onClick={() => setShowImageToPrompt(false)}
                  style={{
                    marginTop: '25px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HISTORY MODAL */}
        {showHistory && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: isMobile ? '10px' : '20px'
          }}>
            <div style={{
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              borderRadius: '20px',
              padding: isMobile ? '20px' : '30px',
              width: isMobile ? '100%' : '600px',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
              }}>
                <h2 style={{ 
                  margin: 0,
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '700'
                }}>
                  📚 Prompt History
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: darkMode ? '#94a3b8' : '#64748b',
                    transition: 'all 0.3s ease',
                    padding: '5px',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = darkMode ? '#94a3b8' : '#64748b';
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '20px'
              }}>
                {promptHistory.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '50px 20px',
                    color: darkMode ? '#94a3b8' : '#64748b'
                  }}>
                    <div style={{ 
                      fontSize: '4rem', 
                      marginBottom: '20px',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      📝
                    </div>
                    <h3 style={{ 
                      margin: '0 0 15px 0',
                      color: darkMode ? '#e2e8f0' : '#374151',
                      fontSize: '1.5rem',
                      fontWeight: '700'
                    }}>
                      No History Yet
                    </h3>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '1.1rem',
                      lineHeight: '1.6'
                    }}>
                      Your generated prompts will appear here for quick access and reuse.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
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
                          backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                          border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <button
                          onClick={(e) => deleteHistoryItem(item.id, e)}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '6px 10px',
                            fontSize: '0.8rem',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                          }}
                        >
                          🗑️
                        </button>

                        <div style={{ marginRight: '50px' }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '12px'
                          }}>
                            <strong style={{
                              color: darkMode ? '#f8fafc' : '#1e293b',
                              fontSize: '1rem',
                              lineHeight: '1.4'
                            }}>
                              {item.input.substring(0, 70)}{item.input.length > 70 ? '...' : ''}
                            </strong>
                            <span style={{
                              color: darkMode ? '#94a3b8' : '#64748b',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}>
                              {formatDate(item.timestamp)}
                            </span>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap',
                            marginBottom: '8px'
                          }}>
                            <span style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              color: '#3b82f6',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}>
                              {item.tone}
                            </span>
                            <span style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              color: '#10b981',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}>
                              {item.model}
                            </span>
                            {item.type === 'image' && (
                              <span style={{
                                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                color: '#ec4899',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                              }}>
                                🖼️ Image
                              </span>
                            )}
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
                  paddingTop: '20px',
                  borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  <span style={{
                    color: darkMode ? '#94a3b8' : '#64748b',
                    fontWeight: '600'
                  }}>
                    {promptHistory.length} prompts
                  </span>
                  <button
                    onClick={clearHistory}
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                      color: '#ef4444',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Clear All History
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRICING MODAL */}
        {showPricingModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: isMobile ? '10px' : '20px'
          }}>
            <div style={{
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              borderRadius: '20px',
              padding: isMobile ? '20px' : '40px',
              width: isMobile ? '100%' : '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
            }}>
              {/* Close Button */}
              <button
                onClick={() => setShowPricingModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: darkMode ? '#94a3b8' : '#64748b',
                  transition: 'all 0.3s ease',
                  padding: '5px',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = darkMode ? '#94a3b8' : '#64748b';
                }}
              >
                ✕
              </button>

              <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '40px',
                color: darkMode ? '#f8fafc' : '#1e293b',
                fontSize: isMobile ? '2rem' : '2.8rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                💰 Choose Your Plan
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '25px',
                marginBottom: '40px'
              }}>
                {PRICING_PLANS.map((plan, index) => (
                  <div key={index} style={{
                    backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                    border: plan.popular ? '2px solid #3b82f6' : `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '16px',
                    padding: '30px',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    boxShadow: plan.popular 
                      ? '0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.1)'
                      : '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = plan.popular 
                      ? '0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.1)'
                      : '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)';
                  }}
                  >
                    {plan.popular && (
                      <div style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.1)'
                      }}>
                        MOST POPULAR
                      </div>
                    )}

                    <h3 style={{
                      textAlign: 'center',
                      margin: '0 0 20px 0',
                      color: darkMode ? '#f8fafc' : '#1e293b',
                      fontSize: '1.5rem',
                      fontWeight: '700'
                    }}>
                      {plan.name}
                    </h3>

                    <div style={{
                      textAlign: 'center',
                      marginBottom: '25px'
                    }}>
                      <span style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {plan.price}
                      </span>
                      <span style={{
                        color: darkMode ? '#94a3b8' : '#64748b',
                        marginLeft: '5px',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        /{plan.period}
                      </span>
                    </div>

                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 30px 0'
                    }}>
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '12px',
                          color: darkMode ? '#cbd5e1' : '#64748b',
                          fontSize: '0.9rem',
                          lineHeight: '1.4'
                        }}>
                          <span style={{ 
                            color: '#10b981',
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                          }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => {
                        if (plan.name === 'Free') {
                          setShowPricingModal(false);
                        } else if (plan.name === 'Pro') {
                          handleLogin();
                        } else {
                          window.location.href = 'mailto:sales@aipromptmaker.com';
                        }
                        setShowPricingModal(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: plan.popular 
                          ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                          : (plan.name === 'Free' 
                              ? 'linear-gradient(135deg, #10b981, #059669)'
                              : 'linear-gradient(135deg, #8b5cf6, #7c3aed)'),
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '700',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 15px 20px -5px rgba(0, 0, 0, 0.3), 0 6px 8px -3px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                ))}
              </div>

              <div style={{
                textAlign: 'center',
                padding: '25px',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
                borderRadius: '16px',
                border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                backdropFilter: 'blur(10px)'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  fontSize: '1rem',
                  lineHeight: '1.6'
                }}>
                  💡 <strong style={{ color: darkMode ? '#e2e8f0' : '#374151' }}>All plans include:</strong> Multi-AI model support, Template library, Mobile responsive design, Regular updates, and 24/7 customer support
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
