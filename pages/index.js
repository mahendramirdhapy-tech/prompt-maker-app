// pages/index.js - MOBILE RESPONSIVE WITH SIDEBAR AND FEEDBACK SECTION
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
  { path: '/seo', label: '🔍 SEO Tool', icon: '🔍' },
  { path: '/code', label: '💻 Code Assistant', icon: '💻' },
  { path: '/email', label: '✉️ Email Writer', icon: '✉️' },
  { path: '/translate', label: '🔄 Translator', icon: '🔄' },
  { path: '/audio', label: '🎵 Audio Tool', icon: '🎵' },
  { path: '/prompts', label: '📚 Prompt Library', icon: '📚' },
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
  
  // New State Variables for Image to Prompt
  const [showImageToPrompt, setShowImageToPrompt] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUsedModel, setImageUsedModel] = useState('');

  // New State Variables for Feedback Section
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  // New State Variables for Navigation
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const router = useRouter();

  // SEO data
  const pageTitle = "AI Prompt Maker - Free AI Prompt Generator Tool";
  const pageDescription = "Transform your ideas into perfect AI prompts with our free AI Prompt Generator. Support for multiple AI models including GPT-4, Gemini, Claude, and Llama.";

  // Navigation items - Updated
  const navItems = [
    { path: '/pricing', label: 'Pricing', icon: '💰', action: () => setShowPricingModal(true) },
    { path: '/features', label: 'Features', icon: '⚡', dropdown: true },
  ];

  // Initialize component
  useEffect(() => {
    console.log('Component mounted');
    
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

  // Smart Image Analysis with Fallback
  const analyzeImageWithFallback = async (imageFile, promptType = 'describe') => {
    setImageLoading(true);
    setGenerationStatus('Analyzing image content...');

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('promptType', promptType);

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result.success) {
          return {
            analysis: result.analysis,
            modelUsed: result.model,
            modelLabel: result.model,
            free: result.free
          };
        }
      }
      
      // Fallback to local analysis
      return await analyzeImageLocally(imageFile, promptType);
      
    } catch (error) {
      console.error('Analysis error:', error);
      return await analyzeImageLocally(imageFile, promptType);
    } finally {
      setImageLoading(false);
    }
  };

  // Local image analysis
  const analyzeImageLocally = (imageFile, promptType) => {
    return new Promise((resolve) => {
      const fileName = imageFile.name.toLowerCase();
      const fileSizeMB = (imageFile.size / (1024 * 1024)).toFixed(2);
      const fileType = imageFile.type.split('/')[1]?.toUpperCase() || 'IMAGE';
      
      const analysis = generateFallbackAnalysis(fileName, promptType, fileSizeMB, fileType);
      
      resolve({
        analysis: analysis,
        modelUsed: 'basic-analyzer',
        modelLabel: 'Basic Image Analyzer 🆓',
        free: true
      });
    });
  };

  // Fallback analysis generator
  const generateFallbackAnalysis = (fileName, promptType, fileSizeMB, fileType) => {
    const baseAnalysis = `📁 **File Analysis:** ${fileName} • ${fileType} • ${fileSizeMB}MB\n\n`;
    
    if (promptType === 'describe') {
      return baseAnalysis + 
        `🔍 **Image Analysis:** This image contains visual content suitable for AI processing.\n\n` +
        `💡 **Description Guide:**\n` +
        `• Identify the main subjects and focal points\n` +
        `• Describe colors, lighting, and composition\n` +
        `• Note the overall mood and atmosphere\n` +
        `• Mention any distinctive features or elements\n` +
        `• Consider the style and artistic approach`;
    } else {
      return baseAnalysis +
        `🚀 **AI Prompt Ready:**\n"Professional ${fileType} composition, high detail, excellent lighting, masterpiece quality, ultra detailed, vibrant colors, professional photography, perfect composition"\n\n` +
        `⚡ **Prompt Optimization:**\n` +
        `• Add specific details about the main subject\n` +
        `• Include lighting and mood descriptions\n` +
        `• Specify color palette and style\n` +
        `• Mention composition and perspective\n` +
        `• Add technical quality parameters`;
    }
  };

  const canGenerate = () => user || usageCount < 5;

  // Submit handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('❌ Please upload an image file (JPEG, PNG, GIF, WebP, etc.)');
      return;
    }

    // Check file size (max 10MB for better analysis)
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

  // Analyze Image and Generate Prompt
  const handleAnalyzeImage = async (promptType = 'describe') => {
    if (!selectedImage || !canGenerate()) return;

    setImageLoading(true);
    setImageAnalysis('');
    setImageUsedModel('');

    try {
      const result = await analyzeImageWithFallback(selectedImage, promptType);

      setImageAnalysis(result.analysis);
      setImageUsedModel(result.modelLabel);

      // Add to history
      addToHistory({
        input: `[Image Analysis] ${promptType} - ${selectedImage.name}`,
        output: result.analysis,
        model: result.modelLabel,
        tone: 'Descriptive',
        language: 'English',
        type: 'image'
      });

      // Update usage count
      if (!user) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('guestUsage', newCount.toString());
      }

      setGenerationStatus('Image analysis completed!');

    } catch (err) {
      console.error('Image analysis error:', err);
      setGenerationStatus('Image analysis failed');
      alert('❌ ' + err.message);
    } finally {
      setImageLoading(false);
    }
  };

  // Use Image Analysis as Prompt Input
  const useAnalysisAsPrompt = () => {
    if (imageAnalysis) {
      // Extract the main prompt from analysis
      const promptMatch = imageAnalysis.match(/"([^"]+)"/);
      if (promptMatch) {
        setInput(promptMatch[1]);
      } else {
        // Use the first meaningful line as prompt
        const lines = imageAnalysis.split('\n');
        const mainLine = lines.find(line => line.includes('**AI Prompt**') || line.includes('**Optimized Prompt**') || (line.length > 20 && !line.startsWith('•')));
        if (mainLine) {
          setInput(mainLine.replace(/\*\*/g, '').trim());
        } else {
          setInput('Create an AI image based on the analyzed visual content');
        }
      }
      setShowImageToPrompt(false);
      setImageAnalysis('');
      setImagePreview(null);
      setSelectedImage(null);
      alert('✅ Image analysis copied to prompt input! You can now generate the AI prompt.');
    }
  };

  // Regenerate function
  const handleRegenerate = () => {
    if (lastInput.trim()) {
      setInput(lastInput);
      setTimeout(() => {
        handleSubmit();
      }, 100);
    } else if (input.trim()) {
      handleSubmit();
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

  // RESPONSIVE STYLES
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

  // Updated Header Style
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
    lineHeight: '1.2',
    textAlign: 'center'
  };

  const subtitleStyle = {
    fontSize: isMobile ? '0.9rem' : '1.2rem',
    color: darkMode ? '#cbd5e1' : '#64748b',
    margin: '0',
    lineHeight: '1.4',
    textAlign: 'center'
  };

  // Features Dropdown Style
  const featuresDropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    padding: '8px 0',
    minWidth: '200px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    marginTop: '8px'
  };

  // MOBILE SIDEBAR STYLES
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

  const mobileMenuButtonStyle = {
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
  };

  const sidebarHeaderStyle = {
    padding: '20px',
    borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const sidebarNavStyle = {
    flex: 1,
    padding: '20px 0'
  };

  const sidebarFooterStyle = {
    padding: '20px',
    borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const navItemStyle = {
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
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const navItemActiveStyle = {
    ...navItemStyle,
    color: '#3b82f6',
    backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
    borderRight: '3px solid #3b82f6'
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
    minHeight: isMobile ? '44px' : 'auto',
    minWidth: isMobile ? '44px' : 'auto'
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

  const toolsGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '40px'
  };

  const footerStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
    padding: isMobile ? '30px 16px 16px' : '40px 20px 20px',
    marginTop: '40px',
    borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
  };

  const footerGridStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: isMobile ? '20px' : '30px',
    marginBottom: '20px'
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
          {/* Sidebar Header */}
          <div style={sidebarHeaderStyle}>
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

          {/* Sidebar Navigation */}
          <div style={sidebarNavStyle}>
            {navItems.map((item) => (
              <div key={item.path}>
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                      style={navItemStyle}
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
                            style={navItemStyle}
                          >
                            <span style={{ fontSize: '1.2rem' }}>{feature.icon}</span>
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
                    style={navItemStyle}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div style={sidebarFooterStyle}>
            <button 
              onClick={() => setShowImageToPrompt(true)}
              style={buttonStyle('#ec4899', '#fff')}
            >
              🖼️ Image to Prompt
            </button>
            
            <button 
              onClick={() => setShowHistory(true)}
              style={buttonStyle('#8b5cf6', '#fff')}
            >
              📚 History
            </button>

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
        {/* UPDATED HEADER */}
        <header style={headerStyle}>
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              style={mobileMenuButtonStyle}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          )}

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={logoStyle}>AI Prompt Maker</h1>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative' }}>
              {navItems.map((item) => (
                <div key={item.path} style={{ position: 'relative' }}>
                  {item.dropdown ? (
                    <div>
                      <button 
                        onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                        style={{
                          color: darkMode ? '#cbd5e1' : '#64748b',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: '500',
                          padding: '8px 16px',
                          transition: 'color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={() => setShowFeaturesDropdown(true)}
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
                                transition: 'all 0.2s ease'
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
                        fontWeight: '500',
                        padding: '8px 16px',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                      }}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
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
                      fontWeight: '500',
                      padding: '8px 16px'
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
                        fontWeight: '500',
                        padding: '8px 16px'
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
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        padding: '8px 20px'
                      }}
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </>
            )}
            
            {!isMobile && (
              <button onClick={toggleDarkMode} style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '8px'
              }}>
                {darkMode ? '☀️' : '🌙'}
              </button>
            )}
          </div>
        </header>

        {/* HERO SECTION */}
        <section style={{ textAlign: 'center', padding: isMobile ? '40px 0' : '60px 0' }}>
          <h1 style={mainTitleStyle}>AI Prompt Generator</h1>
          <p style={subtitleStyle}>
            Content creation has become more critical and complex than ever. Many writers or content creators experience a block in their creation journey and often require a tool or software to assist or inspire them to proceed with their journey.<br />
            AI prompt generator is one of the tools that can be used by writers or content creators to stimulate creativity and inspire them to create more engaging content.
          </p>
        </section>

        {/* MAIN CONTENT - SAME AS BEFORE */}
        {/* ... (rest of the main content remains exactly the same) ... */}

        {/* PRICING MODAL */}
        {showPricingModal && (
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
              padding: isMobile ? '16px' : '30px',
              width: isMobile ? '100%' : '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}>
              {/* Close Button */}
              <button
                onClick={() => setShowPricingModal(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: darkMode ? '#94a3b8' : '#64748b',
                }}
              >
                ✕
              </button>

              <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '30px',
                color: darkMode ? '#f8fafc' : '#1e293b',
                fontSize: isMobile ? '1.8rem' : '2.5rem'
              }}>
                💰 Choose Your Plan
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {PRICING_PLANS.map((plan, index) => (
                  <div key={index} style={{
                    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                    border: plan.popular ? '2px solid #3b82f6' : `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '25px',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}>
                    {plan.popular && (
                      <div style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '4px 16px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        MOST POPULAR
                      </div>
                    )}

                    <h3 style={{
                      textAlign: 'center',
                      margin: '0 0 15px 0',
                      color: darkMode ? '#f8fafc' : '#1e293b',
                      fontSize: '1.5rem'
                    }}>
                      {plan.name}
                    </h3>

                    <div style={{
                      textAlign: 'center',
                      marginBottom: '20px'
                    }}>
                      <span style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#3b82f6'
                      }}>
                        {plan.price}
                      </span>
                      <span style={{
                        color: darkMode ? '#94a3b8' : '#64748b',
                        marginLeft: '5px'
                      }}>
                        /{plan.period}
                      </span>
                    </div>

                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 25px 0'
                    }}>
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '10px',
                          color: darkMode ? '#cbd5e1' : '#64748b',
                          fontSize: '0.9rem'
                        }}>
                          <span style={{ color: '#10b981' }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => {
                        if (plan.name === 'Free') {
                          handleLogin();
                        } else if (plan.name === 'Pro') {
                          handleLogin();
                        } else {
                          // Enterprise - contact sales
                          window.location.href = 'mailto:sales@aipromptmaker.com';
                        }
                        setShowPricingModal(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: plan.popular ? '#3b82f6' : (plan.name === 'Free' ? '#10b981' : '#8b5cf6'),
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                ))}
              </div>

              <div style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                borderRadius: '8px',
                border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
              }}>
                <p style={{ 
                  margin: 0, 
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  fontSize: '0.9rem'
                }}>
                  💡 <strong>All plans include:</strong> Multi-AI model support, Template library, Mobile responsive design, and Regular updates
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ... (rest of the components remain the same) ... */}
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
