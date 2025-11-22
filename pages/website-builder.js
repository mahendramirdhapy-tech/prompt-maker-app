// pages/ai-website-builder.js - FIXED AI INTEGRATION
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function AIWebsiteBuilder() {
  const [websiteCode, setWebsiteCode] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [websiteName, setWebsiteName] = useState('My AI Website');
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [aiError, setAiError] = useState('');

  // Use the same models as your other pages
  const AI_MODELS = [
    { id: 'google/gemini-pro', name: 'Gemini Pro' },
    { id: 'meta-llama/llama-3-8b-instruct:free', name: 'Llama 3 8B' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B' }
  ];

  // Pre-built Templates (same as before)
  const PRE_BUILT_TEMPLATES = [
    {
      id: 'business',
      name: 'Business Website',
      description: 'Professional corporate website',
      category: 'Business',
      code: `<!DOCTYPE html>
<html>
<head>
    <title>Business Pro</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .header { background: #3b82f6; color: white; padding: 4rem 2rem; text-align: center; }
        .services { padding: 4rem 2rem; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; }
        .service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .service-card { background: white; padding: 2rem; border-radius: 10px; text-align: center; }
    </style>
</head>
<body>
    <header class="header">
        <h1>Business Solutions</h1>
        <p>Professional services for growth</p>
    </header>
    <section class="services">
        <div class="container">
            <h2>Our Services</h2>
            <div class="service-grid">
                <div class="service-card"><h3>Web Development</h3><p>Custom websites</p></div>
                <div class="service-card"><h3>Digital Marketing</h3><p>Grow online presence</p></div>
            </div>
        </div>
    </section>
</body>
</html>`
    },
    // ... other templates same as before
  ];

  // Initialize with first template
  useEffect(() => {
    if (PRE_BUILT_TEMPLATES.length > 0 && !generatedCode) {
      const template = PRE_BUILT_TEMPLATES[0];
      setGeneratedCode(template.code);
      setPreviewHtml(template.code);
      setSelectedTemplate(template.id);
    }
  }, []);

  // FIXED AI Generation - Using your existing API setup
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert('Please describe the website you want to create');
      return;
    }

    setIsGenerating(true);
    setAiError('');
    
    try {
      console.log('Sending AI request...');
      
      // Use your existing API route that works in other pages
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          type: 'website',
          context: 'Generate complete HTML website code with CSS'
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI Response data:', data);
      
      if (data.result) {
        const htmlCode = extractHTMLFromResponse(data.result);
        console.log('Extracted HTML code length:', htmlCode.length);
        
        setGeneratedCode(htmlCode);
        setPreviewHtml(htmlCode);
        setActiveTab('preview');
        setAiError('');
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        // Fallback to template if no result
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      setAiError(error.message);
      // Fallback to smart template selection
      generateFromTemplate(aiPrompt);
    } finally {
      setIsGenerating(false);
    }
  };

  // Extract HTML from AI response - IMPROVED VERSION
  const extractHTMLFromResponse = (response) => {
    console.log('Raw AI response:', response);
    
    // Multiple patterns to extract HTML
    const patterns = [
      /```html\n([\s\S]*?)\n```/,  // ```html code ```
      /```\n([\s\S]*?)\n```/,      // ``` code ```
      /<html[\s\S]*<\/html>/i,     // Complete HTML document
      /<\!DOCTYPE html[\s\S]*<\/html>/i, // DOCTYPE HTML
      /<head>[\s\S]*<\/head>[\s\S]*<body>[\s\S]*<\/body>/i, // Head and Body
    ];

    for (let pattern of patterns) {
      const match = response.match(pattern);
      if (match) {
        const code = match[1] || match[0];
        console.log('Found HTML with pattern:', pattern);
        return code;
      }
    }

    // If no HTML found, check if it's already HTML
    if (response.includes('<div') || response.includes('<h1') || response.includes('<p')) {
      console.log('Response appears to be HTML');
      return response;
    }

    // Last resort - wrap in basic HTML structure
    console.log('Wrapping response in HTML structure');
    return `<!DOCTYPE html>
<html>
<head>
    <title>${websiteName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.6; }
        .content { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="content">
        ${response}
    </div>
</body>
</html>`;
  };

  // Smart template-based generation as fallback
  const generateFromTemplate = (prompt) => {
    console.log('Using template fallback for:', prompt);
    
    let selectedTemplate = PRE_BUILT_TEMPLATES[0];
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('blog') || promptLower.includes('article')) {
      selectedTemplate = PRE_BUILT_TEMPLATES[4];
    } else if (promptLower.includes('shop') || promptLower.includes('store') || promptLower.includes('product')) {
      selectedTemplate = PRE_BUILT_TEMPLATES[2];
    } else if (promptLower.includes('food') || promptLower.includes('restaurant') || promptLower.includes('menu')) {
      selectedTemplate = PRE_BUILT_TEMPLATES[3];
    } else if (promptLower.includes('portfolio') || promptLower.includes('design') || promptLower.includes('creative')) {
      selectedTemplate = PRE_BUILT_TEMPLATES[1];
    } else if (promptLower.includes('business') || promptLower.includes('corporate') || promptLower.includes('company')) {
      selectedTemplate = PRE_BUILT_TEMPLATES[0];
    }
    
    setGeneratedCode(selectedTemplate.code);
    setPreviewHtml(selectedTemplate.code);
    setSelectedTemplate(selectedTemplate.id);
    setAiError('AI is currently unavailable. Using template instead.');
  };

  // Apply template
  const applyTemplate = (template) => {
    setGeneratedCode(template.code);
    setPreviewHtml(template.code);
    setSelectedTemplate(template.id);
    setActiveTab('preview');
    setAiError('');
  };

  // Download website code
  const downloadCode = () => {
    if (!generatedCode) {
      alert('No website code to download');
      return;
    }
    
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${websiteName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save website to localStorage
  const saveWebsite = () => {
    if (!generatedCode) {
      alert('No website to save');
      return;
    }
    
    const websiteData = {
      name: websiteName,
      code: generatedCode,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('ai_website_builder_saved', JSON.stringify(websiteData));
    alert('Website saved locally!');
  };

  // Load saved website
  const loadSavedWebsite = () => {
    try {
      const saved = localStorage.getItem('ai_website_builder_saved');
      if (saved) {
        const websiteData = JSON.parse(saved);
        setWebsiteName(websiteData.name);
        setGeneratedCode(websiteData.code);
        setPreviewHtml(websiteData.code);
        setActiveTab('preview');
        alert('Website loaded from save!');
      } else {
        alert('No saved website found');
      }
    } catch (error) {
      console.error('Error loading saved website:', error);
      alert('Error loading saved website');
    }
  };

  // Reset website
  const resetWebsite = () => {
    setGeneratedCode('');
    setPreviewHtml('');
    setAiPrompt('');
    setSelectedTemplate(null);
    setAiError('');
  };

  // Test AI Connection
  const testAIConnection = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Hello, are you working?',
          type: 'test'
        })
      });
      
      const data = await response.json();
      alert(`AI Connection Test: ${response.ok ? 'SUCCESS' : 'FAILED'}\nResponse: ${JSON.stringify(data)}`);
    } catch (error) {
      alert(`AI Connection Test: FAILED\nError: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Inline Styles
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: 'white'
  };

  const headerStyle = {
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
    padding: '1rem 2rem'
  };

  const mainStyle = {
    display: 'flex',
    height: 'calc(100vh - 80px)'
  };

  const sidebarStyle = {
    width: '350px',
    backgroundColor: '#1e293b',
    padding: '1.5rem',
    borderRight: '1px solid #334155',
    overflowY: 'auto'
  };

  const contentStyle = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column'
  };

  const tabContainerStyle = {
    display: 'flex',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155'
  };

  const tabStyle = {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    borderBottom: '2px solid transparent'
  };

  const activeTabStyle = {
    ...tabStyle,
    color: '#3b82f6',
    borderBottomColor: '#3b82f6'
  };

  const previewStyle = {
    flex: '1',
    padding: '0',
    backgroundColor: 'white'
  };

  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none'
  };

  const codeEditorStyle = {
    flex: '1',
    backgroundColor: '#1e293b',
    padding: '1rem',
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#e2e8f0'
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '120px',
    padding: '1rem',
    border: '1px solid #334155',
    borderRadius: '0.5rem',
    backgroundColor: '#0f172a',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1rem',
    resize: 'vertical'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    marginRight: '0.5rem',
    marginBottom: '0.5rem'
  };

  const errorStyle = {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem'
  };

  return (
    <div style={containerStyle}>
      <Head>
        <title>AI Website Builder | Create Websites with AI</title>
        <meta name="description" content="Generate complete websites using AI" />
      </Head>

      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#3b82f6' }}>
            🚀 AI Website Builder
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              placeholder="Website name"
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #334155',
                borderRadius: '0.375rem',
                backgroundColor: '#0f172a',
                color: 'white',
                minWidth: '200px'
              }}
            />
            <button onClick={saveWebsite} style={buttonStyle}>
              💾 Save
            </button>
            <button onClick={loadSavedWebsite} style={{ ...buttonStyle, backgroundColor: '#8b5cf6' }}>
              📂 Load
            </button>
            <button onClick={downloadCode} style={{ ...buttonStyle, backgroundColor: '#059669' }}>
              ⬇️ Download
            </button>
            <button onClick={resetWebsite} style={{ ...buttonStyle, backgroundColor: '#dc2626' }}>
              🗑️ Reset
            </button>
            <button onClick={testAIConnection} style={{ ...buttonStyle, backgroundColor: '#f59e0b' }}>
              🔧 Test AI
            </button>
          </div>
        </div>
      </header>

      {aiError && (
        <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '1rem', textAlign: 'center' }}>
          ⚠️ {aiError}
        </div>
      )}

      <div style={mainStyle}>
        {/* Sidebar */}
        <div style={sidebarStyle}>
          <h3 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>🤖 AI Website Generator</h3>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
              Describe your website:
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: Create a modern restaurant website with menu and contact section..."
              style={textareaStyle}
            />
            <button 
              onClick={generateWithAI}
              disabled={isGenerating}
              style={{
                ...buttonStyle,
                width: '100%',
                backgroundColor: isGenerating ? '#6b7280' : '#8b5cf6',
                opacity: isGenerating ? 0.7 : 1
              }}
            >
              {isGenerating ? '🔄 AI is Generating...' : '✨ Generate with AI'}
            </button>
            
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <strong>Working Examples:</strong>
              <br/>• "Create a portfolio for a web developer"
              <br/>• "Make a restaurant website with menu"
              <br/>• "Build an e-commerce store for clothes"
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>🎨 Quick Templates</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PRE_BUILT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  style={{
                    padding: '1rem',
                    backgroundColor: selectedTemplate === template.id ? '#3b82f6' : '#334155',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>
                      {template.category === 'Business' && '💼'}
                      {template.category === 'Portfolio' && '🎨'}
                      {template.category === 'E-commerce' && '🛒'}
                      {template.category === 'Food' && '🍕'}
                      {template.category === 'Blog' && '📝'}
                    </span>
                    <div>
                      <div style={{ fontWeight: '600' }}>{template.name}</div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{template.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={contentStyle}>
          {/* Tabs */}
          <div style={tabContainerStyle}>
            <button 
              style={activeTab === 'preview' ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab('preview')}
            >
              👁️ Preview
            </button>
            <button 
              style={activeTab === 'code' ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab('code')}
            >
              📝 Code
            </button>
          </div>

          {/* Content */}
          {activeTab === 'preview' && generatedCode && (
            <div style={previewStyle}>
              <iframe
                srcDoc={previewHtml}
                style={iframeStyle}
                title="Website Preview"
                sandbox="allow-same-origin"
              />
            </div>
          )}

          {activeTab === 'code' && generatedCode && (
            <div style={contentStyle}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem',
                backgroundColor: '#1e293b',
                borderBottom: '1px solid #334155'
              }}>
                <h3 style={{ margin: 0, color: '#e2e8f0' }}>HTML Code</h3>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    alert('Code copied to clipboard!');
                  }}
                  style={{ ...buttonStyle, backgroundColor: '#6b7280', padding: '0.5rem 1rem' }}
                >
                  📋 Copy Code
                </button>
              </div>
              <textarea
                value={generatedCode}
                onChange={(e) => {
                  setGeneratedCode(e.target.value);
                  setPreviewHtml(e.target.value);
                }}
                style={{
                  ...codeEditorStyle,
                  minHeight: '100%',
                  border: 'none',
                  outline: 'none',
                  resize: 'none'
                }}
                spellCheck={false}
              />
            </div>
          )}

          {!generatedCode && (
            <div style={{ 
              flex: '1', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#94a3b8',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#e2e8f0' }}>
                Create Your Website with AI
              </h2>
              <p style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '500px' }}>
                Describe the website you want to create and let AI generate the complete code, 
                or start with one of our professional templates.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button 
                  onClick={() => document.querySelector('textarea')?.focus()}
                  style={{ ...buttonStyle, backgroundColor: '#8b5cf6', padding: '1rem 2rem', fontSize: '1.125rem' }}
                >
                  🎨 Describe Your Website
                </button>
                <button 
                  onClick={() => applyTemplate(PRE_BUILT_TEMPLATES[0])}
                  style={{ ...buttonStyle, backgroundColor: '#3b82f6', padding: '1rem 2rem', fontSize: '1.125rem' }}
                >
                  💼 Start with Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
