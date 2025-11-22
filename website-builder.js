// pages/website-builder.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function WebsiteBuilder() {
  const [websiteCode, setWebsiteCode] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [websiteName, setWebsiteName] = useState('My AI Website');
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [aiError, setAiError] = useState('');

  // Pre-built Templates
  const PRE_BUILT_TEMPLATES = [
    {
      id: 'business',
      name: 'Business Website',
      description: 'Professional corporate website',
      category: 'Business',
      icon: 'fas fa-briefcase',
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
    {
      id: 'portfolio',
      name: 'Portfolio Website',
      description: 'Showcase your work and skills',
      category: 'Portfolio', 
      icon: 'fas fa-palette',
      code: `<!DOCTYPE html>
<html>
<head>
    <title>My Portfolio</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .hero { background: #8b5cf6; color: white; padding: 6rem 2rem; text-align: center; }
        .projects { padding: 4rem 2rem; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; }
        .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .project-card { background: white; padding: 2rem; border-radius: 10px; }
    </style>
</head>
<body>
    <section class="hero">
        <h1>John Doe</h1>
        <p>Web Developer & Designer</p>
    </section>
    <section class="projects">
        <div class="container">
            <h2>My Projects</h2>
            <div class="project-grid">
                <div class="project-card"><h3>E-commerce Website</h3></div>
                <div class="project-card"><h3>Business Dashboard</h3></div>
            </div>
        </div>
    </section>
</body>
</html>`
    }
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

  // Apply template
  const applyTemplate = (template) => {
    setGeneratedCode(template.code);
    setPreviewHtml(template.code);
    setSelectedTemplate(template.id);
    setActiveTab('preview');
    setAiError('');
  };

  // AI Generation function
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert('Please describe the website you want to create');
      return;
    }

    setIsGenerating(true);
    setAiError('');
    
    try {
      // Use your existing API
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

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.result) {
        const htmlCode = extractHTMLFromResponse(data.result);
        setGeneratedCode(htmlCode);
        setPreviewHtml(htmlCode);
        setActiveTab('preview');
        setAiError('');
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      setAiError(error.message);
      // Fallback to template
      generateFromTemplate(aiPrompt);
    } finally {
      setIsGenerating(false);
    }
  };

  // Extract HTML from AI response
  const extractHTMLFromResponse = (response) => {
    const patterns = [
      /```html\n([\s\S]*?)\n```/,
      /```\n([\s\S]*?)\n```/,
      /<html[\s\S]*<\/html>/i,
    ];

    for (let pattern of patterns) {
      const match = response.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return response;
  };

  // Smart template fallback
  const generateFromTemplate = (prompt) => {
    let selectedTemplate = PRE_BUILT_TEMPLATES[0];
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('portfolio') || promptLower.includes('design')) {
      selectedTemplate = PRE_BUILT_TEMPLATES[1];
    }
    
    applyTemplate(selectedTemplate);
    setAiError('AI is currently unavailable. Using template instead.');
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

  // Copy code to clipboard
  const copyCode = () => {
    if (!generatedCode) {
      alert('No code to copy');
      return;
    }
    
    navigator.clipboard.writeText(generatedCode)
      .then(() => alert('Code copied to clipboard!'))
      .catch(() => alert('Failed to copy code'));
  };

  // Reset website
  const resetWebsite = () => {
    setGeneratedCode('');
    setPreviewHtml('');
    setAiPrompt('');
    setSelectedTemplate(null);
    setAiError('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white' 
    }}>
      <Head>
        <title>AI Website Builder | Prompt Maker</title>
      </Head>

      {/* Header */}
      <header style={{ 
        backgroundColor: '#1e293b', 
        borderBottom: '1px solid #334155', 
        padding: '1rem 2rem' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          maxWidth: '1400px', 
          margin: '0 auto' 
        }}>
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
            <button onClick={downloadCode} style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}>
              ⬇️ Download
            </button>
            <button onClick={resetWebsite} style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}>
              🗑️ Reset
            </button>
          </div>
        </div>
      </header>

      {aiError && (
        <div style={{ 
          backgroundColor: '#fef3c7', 
          color: '#92400e', 
          padding: '1rem', 
          textAlign: 'center' 
        }}>
          ⚠️ {aiError}
        </div>
      )}

      <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <div style={{ 
          width: '350px', 
          backgroundColor: '#1e293b', 
          padding: '1.5rem',
          borderRight: '1px solid #334155',
          overflowY: 'auto'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>🤖 AI Website Generator</h3>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
              Describe your website:
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: Create a modern restaurant website with menu and contact section..."
              style={{
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
              }}
            />
            <button 
              onClick={generateWithAI}
              disabled={isGenerating}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: isGenerating ? '#6b7280' : '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                width: '100%',
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
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            backgroundColor: '#1e293b', 
            borderBottom: '1px solid #334155' 
          }}>
            <button 
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: activeTab === 'preview' ? '#3b82f6' : '#94a3b8',
                cursor: 'pointer',
                borderBottom: activeTab === 'preview' ? '2px solid #3b82f6' : '2px solid transparent'
              }}
              onClick={() => setActiveTab('preview')}
            >
              👁️ Preview
            </button>
            <button 
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: activeTab === 'code' ? '#3b82f6' : '#94a3b8',
                cursor: 'pointer',
                borderBottom: activeTab === 'code' ? '2px solid #3b82f6' : '2px solid transparent'
              }}
              onClick={() => setActiveTab('code')}
            >
              📝 Code
            </button>
          </div>

          {/* Content */}
          {activeTab === 'preview' && generatedCode && (
            <div style={{ flex: '1', padding: '0', backgroundColor: 'white' }}>
              <iframe
                srcDoc={previewHtml}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Website Preview"
                sandbox="allow-same-origin"
              />
            </div>
          )}

          {activeTab === 'code' && generatedCode && (
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
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
                  onClick={copyCode}
                  style={{ 
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
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
                  flex: '1',
                  backgroundColor: '#1e293b',
                  padding: '1rem',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#e2e8f0',
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
                  style={{ 
                    padding: '1rem 2rem',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1.125rem'
                  }}
                >
                  🎨 Describe Your Website
                </button>
                <button 
                  onClick={() => applyTemplate(PRE_BUILT_TEMPLATES[0])}
                  style={{ 
                    padding: '1rem 2rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1.125rem'
                  }}
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
