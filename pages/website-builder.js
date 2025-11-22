import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function WebsiteBuilder() {
  const router = useRouter();
  const [elements, setElements] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [websiteName, setWebsiteName] = useState('My Website');
  const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo');
  const [user, setUser] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef(null);

  // OpenRouter Free Models
  const AI_MODELS = [
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', free: true },
    { id: 'google/gemini-pro', name: 'Gemini Pro', free: true },
    { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B', free: true },
    { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', free: true },
    { id: 'microsoft/wizardlm-2-8x22b', name: 'WizardLM 2', free: true }
  ];

  // Pre-built Templates
  const TEMPLATES = [
    {
      id: 'business',
      name: 'Business Website',
      elements: [
        {
          id: 'header1',
          type: 'header',
          content: '<h1 style="font-size: 3rem; font-weight: bold; text-align: center; margin: 0; color: white;">Professional Business</h1><p style="text-align: center; color: white; font-size: 1.25rem; margin-top: 1rem;">We provide the best services for your business growth</p>',
          styles: { 
            padding: '4rem 2rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            textAlign: 'center'
          },
          position: 0
        },
        {
          id: 'section1',
          type: 'section',
          content: '<div style="max-width: 1200px; margin: 0 auto;"><h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 2rem;">Our Services</h2><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;"><div style="text-align: center; padding: 2rem; background: #f8fafc; border-radius: 0.5rem;"><h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Web Development</h3><p>Professional website development services</p></div><div style="text-align: center; padding: 2rem; background: #f8fafc; border-radius: 0.5rem;"><h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">SEO Optimization</h3><p>Improve your search engine rankings</p></div><div style="text-align: center; padding: 2rem; background: #f8fafc; border-radius: 0.5rem;"><h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Digital Marketing</h3><p>Reach more customers online</p></div></div></div>',
          styles: { 
            padding: '4rem 2rem',
            backgroundColor: 'white'
          },
          position: 1
        },
        {
          id: 'footer1',
          type: 'footer',
          content: '<div style="max-width: 1200px; margin: 0 auto; text-align: center;"><p>&copy; 2024 Professional Business. All rights reserved.</p><div style="margin-top: 1rem;"><a href="#" style="color: white; margin: 0 1rem;">Privacy Policy</a><a href="#" style="color: white; margin: 0 1rem;">Terms of Service</a><a href="#" style="color: white; margin: 0 1rem;">Contact</a></div></div>',
          styles: { 
            padding: '3rem 2rem', 
            backgroundColor: '#1f2937', 
            color: 'white',
            marginTop: '2rem'
          },
          position: 2
        }
      ]
    },
    {
      id: 'portfolio',
      name: 'Portfolio Website',
      elements: [
        {
          id: 'header2',
          type: 'header',
          content: '<h1 style="font-size: 3rem; font-weight: bold; text-align: center; margin: 0; color: white;">Creative Portfolio</h1><p style="text-align: center; color: white; font-size: 1.25rem; margin-top: 1rem;">Showcasing my work and creativity</p>',
          styles: { 
            padding: '4rem 2rem', 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
            color: 'white',
            textAlign: 'center'
          },
          position: 0
        },
        {
          id: 'section2',
          type: 'section',
          content: '<div style="max-width: 1200px; margin: 0 auto;"><h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 2rem;">My Work</h2><p style="text-align: center; font-size: 1.125rem; margin-bottom: 3rem;">Check out some of my recent projects and creative work</p></div>',
          styles: { 
            padding: '4rem 2rem',
            backgroundColor: 'white'
          },
          position: 1
        },
        {
          id: 'footer2',
          type: 'footer',
          content: '<div style="max-width: 1200px; margin: 0 auto; text-align: center;"><p>&copy; 2024 Creative Portfolio. All rights reserved.</p></div>',
          styles: { 
            padding: '3rem 2rem', 
            backgroundColor: '#374151', 
            color: 'white',
            marginTop: '2rem'
          },
          position: 2
        }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Store',
      elements: [
        {
          id: 'header3',
          type: 'header',
          content: '<h1 style="font-size: 3rem; font-weight: bold; text-align: center; margin: 0; color: white;">Online Store</h1><p style="text-align: center; color: white; font-size: 1.25rem; margin-top: 1rem;">Best products at amazing prices</p>',
          styles: { 
            padding: '4rem 2rem', 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
            color: 'white',
            textAlign: 'center'
          },
          position: 0
        },
        {
          id: 'section3',
          type: 'section',
          content: '<div style="max-width: 1200px; margin: 0 auto;"><h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 2rem;">Featured Products</h2><p style="text-align: center; font-size: 1.125rem;">Discover our most popular items</p></div>',
          styles: { 
            padding: '4rem 2rem',
            backgroundColor: 'white'
          },
          position: 1
        },
        {
          id: 'footer3',
          type: 'footer',
          content: '<div style="max-width: 1200px; margin: 0 auto; text-align: center;"><p>&copy; 2024 Online Store. All rights reserved.</p><p style="margin-top: 1rem;">Free shipping on orders over $50</p></div>',
          styles: { 
            padding: '3rem 2rem', 
            backgroundColor: '#1e40af', 
            color: 'white',
            marginTop: '2rem'
          },
          position: 2
        }
      ]
    },
    {
      id: 'blog',
      name: 'Blog Website',
      elements: [
        {
          id: 'header4',
          type: 'header',
          content: '<h1 style="font-size: 3rem; font-weight: bold; text-align: center; margin: 0; color: white;">My Blog</h1><p style="text-align: center; color: white; font-size: 1.25rem; margin-top: 1rem;">Sharing thoughts and ideas</p>',
          styles: { 
            padding: '4rem 2rem', 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
            color: 'white',
            textAlign: 'center'
          },
          position: 0
        },
        {
          id: 'section4',
          type: 'section',
          content: '<div style="max-width: 800px; margin: 0 auto;"><h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">Latest Posts</h2><p style="font-size: 1.125rem; line-height: 1.7;">Welcome to my blog where I share my thoughts and experiences.</p></div>',
          styles: { 
            padding: '4rem 2rem',
            backgroundColor: 'white'
          },
          position: 1
        },
        {
          id: 'footer4',
          type: 'footer',
          content: '<div style="max-width: 1200px; margin: 0 auto; text-align: center;"><p>&copy; 2024 My Blog. All rights reserved.</p></div>',
          styles: { 
            padding: '3rem 2rem', 
            backgroundColor: '#065f46', 
            color: 'white',
            marginTop: '2rem'
          },
          position: 2
        }
      ]
    },
    {
      id: 'landing',
      name: 'Landing Page',
      elements: [
        {
          id: 'header5',
          type: 'header',
          content: '<h1 style="font-size: 3.5rem; font-weight: bold; text-align: center; margin: 0; color: white;">Amazing Product</h1><p style="text-align: center; color: white; font-size: 1.5rem; margin-top: 1.5rem; margin-bottom: 2rem;">The solution you\'ve been waiting for</p><button style="background-color: #f59e0b; color: white; font-weight: 600; padding: 1rem 2rem; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1.125rem;">Get Started Now</button>',
          styles: { 
            padding: '6rem 2rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            textAlign: 'center'
          },
          position: 0
        },
        {
          id: 'footer5',
          type: 'footer',
          content: '<div style="max-width: 1200px; margin: 0 auto; text-align: center;"><p>&copy; 2024 Amazing Product. All rights reserved.</p></div>',
          styles: { 
            padding: '3rem 2rem', 
            backgroundColor: '#1f2937', 
            color: 'white',
            marginTop: '2rem'
          },
          position: 1
        }
      ]
    }
  ];

  // Check user authentication on component mount
  useEffect(() => {
    checkUser();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  // Google Auth Login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/website-builder`
      }
    });
    
    if (error) {
      console.error('Google login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  // Logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    } else {
      setUser(null);
    }
  };

  // Add new element to canvas
  const addElement = (type) => {
    const newElement = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      position: elements.length,
      layout: { 
        display: 'block',
        width: '100%',
        margin: '0 auto'
      }
    };
    setElements([...elements, newElement]);
  };

  // Update element content
  const updateElement = (id, updates) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  // Delete element
  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
  };

  // Move element
  const moveElement = (id, direction) => {
    const index = elements.findIndex(el => el.id === id);
    if (index === -1) return;

    const newElements = [...elements];
    if (direction === 'up' && index > 0) {
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
    } else if (direction === 'down' && index < elements.length - 1) {
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
    }
    setElements(newElements);
  };

  // Get default content for each element type
  const getDefaultContent = (type) => {
    switch (type) {
      case 'header':
        return '<h1 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin: 0;">Welcome to My Website</h1>';
      case 'text':
        return '<p style="font-size: 1.125rem; line-height: 1.6;">Start editing this text to add your content...</p>';
      case 'button':
        return '<button style="background-color: #3b82f6; color: white; font-weight: 600; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem;">Click Me</button>';
      case 'section':
        return '<div style="background-color: #f8fafc; padding: 2rem; border-radius: 0.5rem;"><h2 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 1rem;">Section Title</h2><p style="font-size: 1.125rem;">Section content goes here...</p></div>';
      case 'footer':
        return '<footer style="text-align: center; padding: 1.5rem;"><p>&copy; 2024 My Website. All rights reserved.</p></footer>';
      case 'image':
        return '<div style="text-align: center;"><img src="https://via.placeholder.com/800x400/3b82f6/ffffff?text=Your+Image" alt="Placeholder Image" style="max-width: 100%; height: auto; border-radius: 0.5rem;" /><p style="margin-top: 0.5rem; color: #6b7280; font-size: 0.875rem;">Add your image URL above</p></div>';
      default:
        return '';
    }
  };

  // Get default styles for each element type
  const getDefaultStyles = (type) => {
    switch (type) {
      case 'header':
        return { 
          padding: '3rem 2rem', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          textAlign: 'center'
        };
      case 'text':
        return { 
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        };
      case 'button':
        return { 
          textAlign: 'center', 
          padding: '2rem' 
        };
      case 'section':
        return { 
          padding: '3rem 2rem',
          backgroundColor: '#f8fafc'
        };
      case 'footer':
        return { 
          padding: '2rem', 
          backgroundColor: '#1f2937', 
          color: 'white',
          marginTop: '2rem'
        };
      case 'image':
        return { 
          padding: '2rem',
          textAlign: 'center'
        };
      default:
        return {};
    }
  };

  // Apply template
  const applyTemplate = (template) => {
    setElements(template.elements);
    setShowTemplates(false);
  };

  // Save website to Supabase
  const saveWebsite = async () => {
    if (!user) {
      alert('Please login to save your website');
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('websites')
        .insert([
          {
            name: websiteName,
            elements: elements,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;
      
      alert('Website saved successfully!');
    } catch (error) {
      console.error('Error saving website:', error);
      alert('Error saving website: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Download website as HTML
  const downloadWebsite = () => {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${websiteName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate complete HTML
  const generateHTML = () => {
    const elementsHTML = elements.map(element => `
      <div style="${Object.entries(element.styles).map(([key, value]) => `${key}: ${value}`).join('; ')}">
        ${element.content}
      </div>
    `).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${websiteName}</title>
    <style>
        body { 
            margin: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
        }
    </style>
</head>
<body>
    ${elementsHTML}
</body>
</html>`;
  };

  // Publish website
  const publishWebsite = async () => {
    if (!user) {
      alert('Please login to publish your website');
      return;
    }
    await saveWebsite();
    alert('Website published successfully! You can now download the HTML file.');
  };

  // Get AI assistance with fallback system
  const getAIAssistance = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for AI assistance');
      return;
    }

    setIsLoading(true);
    setAiResponse('');

    try {
      let response = await tryAIModel(selectedModel, aiPrompt);
      
      if (!response.success) {
        const fallbackModels = AI_MODELS.filter(model => model.id !== selectedModel);
        
        for (let model of fallbackModels) {
          response = await tryAIModel(model.id, aiPrompt);
          if (response.success) {
            setSelectedModel(model.id);
            break;
          }
        }
      }

      if (response.success) {
        setAiResponse(response.content);
      } else {
        setAiResponse('❌ All AI models are currently unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('AI Error:', error);
      setAiResponse('❌ Error connecting to AI service. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Try a specific AI model
  const tryAIModel = async (modelId, prompt) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Website Builder'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'user',
              content: `I'm building a website and need help with content. Here's what I need: ${prompt}. Please provide relevant, professional website content.`
            }
          ],
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Model ${modelId} failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          success: true,
          content: data.choices[0].message.content,
          model: modelId
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(`Model ${modelId} error:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Drag and drop functionality
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('elementType', type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('elementType');
    addElement(type);
  };

  // Inline CSS Styles
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  };

  const headerStyle = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 1rem',
    position: 'sticky',
    top: 0,
    zIndex: 50
  };

  const headerInnerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '4rem'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const inputStyle = {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    minWidth: '200px'
  };

  const selectStyle = {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    backgroundColor: 'white'
  };

  const mainContainerStyle = {
    display: 'flex',
    height: 'calc(100vh - 4rem)',
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const sidebarStyle = {
    width: '16rem',
    backgroundColor: 'white',
    borderRight: '1px solid #e5e7eb',
    padding: '1rem',
    overflowY: 'auto'
  };

  const workspaceStyle = {
    flex: '1',
    padding: '1.5rem',
    backgroundColor: '#f3f4f6',
    overflow: 'auto'
  };

  const canvasStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    minHeight: '100%',
    padding: '1.5rem',
    border: elements.length === 0 ? '2px dashed #d1d5db' : 'none',
    position: 'relative'
  };

  const componentStyle = {
    padding: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    cursor: 'move',
    marginBottom: '0.75rem',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s'
  };

  const componentHoverStyle = {
    ...componentStyle,
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff'
  };

  const aiPanelStyle = {
    width: '20rem',
    backgroundColor: 'white',
    borderLeft: '1px solid #e5e7eb',
    padding: '1rem',
    overflowY: 'auto'
  };

  const textareaStyle = {
    width: '100%',
    height: '8rem',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    resize: 'vertical',
    fontSize: '0.875rem'
  };

  const aiResponseStyle = {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap'
  };

  const emptyCanvasStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280'
  };

  const modelInfoStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem'
  };

  const templateModalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const templateGridStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '2rem',
    maxWidth: '800px',
    maxHeight: '80vh',
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  };

  const templateCardStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s'
  };

  const templateCardHoverStyle = {
    ...templateCardStyle,
    borderColor: '#3b82f6',
    backgroundColor: '#f8fafc'
  };

  return (
    <div style={containerStyle}>
      <Head>
        <title>Website Builder | AI Prompt Maker</title>
        <meta name="description" content="Build your website with AI assistance" />
      </Head>

      {/* Template Modal */}
      {showTemplates && (
        <div style={templateModalStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Choose a Template</h2>
              <button 
                onClick={() => setShowTemplates(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={templateGridStyle}>
              {TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  style={templateCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                  onClick={() => applyTemplate(template)}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {template.id === 'business' && '💼'}
                    {template.id === 'portfolio' && '🎨'}
                    {template.id === 'ecommerce' && '🛒'}
                    {template.id === 'blog' && '📝'}
                    {template.id === 'landing' && '🚀'}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {template.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {template.elements.length} components
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Website Builder
            </h1>
            <input
              type="text"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              style={inputStyle}
              placeholder="Website name"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Welcome, {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
                >
                  👤 Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleGoogleLogin}
                style={{ ...buttonStyle, backgroundColor: '#db4437' }}
              >
                🔐 Login with Google
              </button>
            )}
            <button
              onClick={() => setShowTemplates(true)}
              style={{ ...buttonStyle, backgroundColor: '#8b5cf6' }}
            >
              🎨 Templates
            </button>
            <button
              onClick={() => setIsPreview(!isPreview)}
              style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
            >
              {isPreview ? '✏️ Edit' : '👁️ Preview'}
            </button>
            <button
              onClick={saveWebsite}
              disabled={isSaving}
              style={{ 
                ...buttonStyle, 
                backgroundColor: isSaving ? '#9ca3af' : '#3b82f6',
                opacity: isSaving ? 0.6 : 1
              }}
            >
              {isSaving ? '💾 Saving...' : '💾 Save'}
            </button>
            <button
              onClick={downloadWebsite}
              style={{ ...buttonStyle, backgroundColor: '#059669' }}
            >
              ⬇️ Download HTML
            </button>
            <button
              onClick={publishWebsite}
              style={{ ...buttonStyle, backgroundColor: '#d97706' }}
            >
              🚀 Publish
            </button>
          </div>
        </div>
      </header>

      <div style={mainContainerStyle}>
        {/* Sidebar - Components */}
        {!isPreview && (
          <div style={sidebarStyle}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Components
            </h2>
            <div>
              {[
                { type: 'header', icon: '📄', label: 'Header' },
                { type: 'text', icon: '📝', label: 'Text' },
                { type: 'button', icon: '🔘', label: 'Button' },
                { type: 'image', icon: '🖼️', label: 'Image' },
                { type: 'section', icon: '📦', label: 'Section' },
                { type: 'footer', icon: '👣', label: 'Footer' }
              ].map((component) => (
                <div
                  key={component.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component.type)}
                  style={componentStyle}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, componentHoverStyle);
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, componentStyle);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{component.icon}</span>
                    <span style={{ fontWeight: '500' }}>{component.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Canvas */}
        <div style={workspaceStyle}>
          <div
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={canvasStyle}
          >
            {elements.length === 0 ? (
              <div style={emptyCanvasStyle}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Start Building Your Website
                </h3>
                <p style={{ marginBottom: '2rem' }}>
                  Drag components from the sidebar, use AI assistance, or start with a template
                </p>
                <button
                  onClick={() => setShowTemplates(true)}
                  style={{ ...buttonStyle, backgroundColor: '#8b5cf6', padding: '1rem 2rem', fontSize: '1rem' }}
                >
                  🎨 Choose a Template
                </button>
              </div>
            ) : (
              elements.map((element, index) => (
                <WebsiteElement
                  key={element.id}
                  element={element}
                  onUpdate={updateElement}
                  onDelete={deleteElement}
                  onMove={moveElement}
                  isPreview={isPreview}
                  canMoveUp={index > 0}
                  canMoveDown={index < elements.length - 1}
                />
              ))
            )}
          </div>
        </div>

        {/* AI Assistance Panel */}
        {!isPreview && (
          <div style={aiPanelStyle}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              AI Assistant
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Model Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  AI Model:
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  style={selectStyle}
                >
                  {AI_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} {model.free ? ' (Free)' : ''}
                    </option>
                  ))}
                </select>
                <div style={modelInfoStyle}>
                  Current: {AI_MODELS.find(m => m.id === selectedModel)?.name}
                </div>
              </div>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Tell me what kind of content you need for your website... (e.g., 'Write a header for a tech company', 'Create product descriptions')"
                style={textareaStyle}
              />
              <button
                onClick={getAIAssistance}
                disabled={isLoading}
                style={{ 
                  ...buttonStyle, 
                  backgroundColor: '#8b5cf6',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? '🔄 Generating...' : '🤖 Get AI Help'}
              </button>
              
              {aiResponse && (
                <div style={aiResponseStyle}>
                  <h4 style={{ 
                    fontWeight: '600', 
                    marginBottom: '0.5rem', 
                    color: aiResponse.startsWith('❌') ? '#ef4444' : '#059669' 
                  }}>
                    {aiResponse.startsWith('❌') ? 'Error' : 'AI Suggestion'}:
                  </h4>
                  <p style={{ margin: 0 }}>{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Website Element Component
function WebsiteElement({ element, onUpdate, onDelete, onMove, isPreview, canMoveUp, canMoveDown }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleSave = () => {
    onUpdate(element.id, { content: editContent });
    setIsEditing(false);
  };

  const handleImageUrlSave = () => {
    if (imageUrl.trim()) {
      const imgContent = `<img src="${imageUrl}" alt="User uploaded image" style="max-width: 100%; height: auto; border-radius: 0.5rem;" />`;
      onUpdate(element.id, { content: imgContent });
    }
    setShowImageUrlInput(false);
    setImageUrl('');
  };

  const extractTextFromHTML = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const elementStyle = {
    position: 'relative',
    marginBottom: '1rem',
    ...element.styles,
    border: isEditing ? '2px solid #3b82f6' : 'none',
    padding: isEditing ? '1rem' : '0'
  };

  const controlsStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    display: 'flex',
    gap: '0.25rem',
    opacity: isPreview ? 0 : 1,
    transition: 'opacity 0.2s'
  };

  const controlButtonStyle = {
    background: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  };

  const editAreaStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const editTextareaStyle = {
    width: '100%',
    height: '8rem',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    resize: 'vertical'
  };

  const editButtonsStyle = {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end'
  };

  const imageUrlInputStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem'
  };

  const urlInputStyle = {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem'
  };

  return (
    <div 
      style={elementStyle}
      onMouseEnter={(e) => {
        if (!isPreview && !isEditing) {
          e.currentTarget.querySelector('.element-controls').style.opacity = 1;
        }
      }}
      onMouseLeave={(e) => {
        if (!isPreview && !isEditing) {
          e.currentTarget.querySelector('.element-controls').style.opacity = 0;
        }
      }}
    >
      {!isPreview && (
        <div className="element-controls" style={controlsStyle}>
          {element.type === 'image' && (
            <button
              onClick={() => setShowImageUrlInput(!showImageUrlInput)}
              style={controlButtonStyle}
            >
              📁 Image URL
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={controlButtonStyle}
          >
            {isEditing ? '❌' : '✏️'} Edit
          </button>
          {canMoveUp && (
            <button
              onClick={() => onMove(element.id, 'up')}
              style={controlButtonStyle}
            >
              ⬆️ Up
            </button>
          )}
          {canMoveDown && (
            <button
              onClick={() => onMove(element.id, 'down')}
              style={controlButtonStyle}
            >
              ⬇️ Down
            </button>
          )}
          <button
            onClick={() => onDelete(element.id)}
            style={{...controlButtonStyle, borderColor: '#ef4444', color: '#ef4444'}}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {showImageUrlInput && (
        <div style={imageUrlInputStyle}>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            style={urlInputStyle}
          />
          <button
            onClick={handleImageUrlSave}
            style={{...controlButtonStyle, backgroundColor: '#10b981', color: 'white', border: 'none'}}
          >
            Save
          </button>
          <button
            onClick={() => setShowImageUrlInput(false)}
            style={{...controlButtonStyle, backgroundColor: '#6b7280', color: 'white', border: 'none'}}
          >
            Cancel
          </button>
        </div>
      )}

      {isEditing && !isPreview ? (
        <div style={editAreaStyle}>
          <textarea
            value={extractTextFromHTML(editContent)}
            onChange={(e) => setEditContent(e.target.value)}
            style={editTextareaStyle}
            placeholder="Enter your content here..."
          />
          <div style={editButtonsStyle}>
            <button
              onClick={handleSave}
              style={{...controlButtonStyle, backgroundColor: '#10b981', color: 'white', border: 'none'}}
            >
              💾 Save
            </button>
            <button
              onClick={() => {
                setEditContent(element.content);
                setIsEditing(false);
              }}
              style={{...controlButtonStyle, backgroundColor: '#6b7280', color: 'white', border: 'none'}}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: element.content }} />
      )}
    </div>
  );
}
