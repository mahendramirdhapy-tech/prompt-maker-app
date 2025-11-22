// pages/ai-website-builder.js
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
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // AI Models
  const AI_MODELS = [
    { id: 'google/gemini-pro', name: 'Gemini Pro', free: true },
    { id: 'meta-llama/llama-3-8b-instruct:free', name: 'Llama 3 8B', free: true },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B', free: true }
  ];

  // Pre-built Templates
  const PRE_BUILT_TEMPLATES = [
    {
      id: 'business',
      name: 'Business Website',
      description: 'Professional corporate website with services section',
      category: 'Business',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Pro</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }
        .services { 
            padding: 4rem 2rem;
            background: #f8fafc;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .service-grid { 
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        .service-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        }
        .footer {
            background: #1f2937;
            color: white;
            padding: 2rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>Business Solutions</h1>
        <p>Professional services for your business growth</p>
    </header>
    
    <section class="services">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 2rem;">Our Services</h2>
            <div class="service-grid">
                <div class="service-card">
                    <h3>Web Development</h3>
                    <p>Custom websites and web applications</p>
                </div>
                <div class="service-card">
                    <h3>Digital Marketing</h3>
                    <p>Grow your online presence</p>
                </div>
                <div class="service-card">
                    <h3>SEO Optimization</h3>
                    <p>Improve search engine rankings</p>
                </div>
            </div>
        </div>
    </section>
    
    <footer class="footer">
        <p>&copy; 2024 Business Pro. All rights reserved.</p>
    </footer>
</body>
</html>`
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Creative portfolio for designers and developers',
      category: 'Portfolio',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; }
        .hero { 
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 6rem 2rem;
            text-align: center;
        }
        .projects { padding: 4rem 2rem; }
        .container { max-width: 1200px; margin: 0 auto; }
        .project-grid { 
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        .project-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .project-image {
            height: 200px;
            background: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6b7280;
        }
        .project-content { padding: 1.5rem; }
        .footer {
            background: #374151;
            color: white;
            padding: 2rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <section class="hero">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">Creative Portfolio</h1>
        <p style="font-size: 1.25rem;">Showcasing amazing work and projects</p>
    </section>
    
    <section class="projects">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 2rem;">Featured Projects</h2>
            <div class="project-grid">
                <div class="project-card">
                    <div class="project-image">Project Image</div>
                    <div class="project-content">
                        <h3>Web Design</h3>
                        <p>Beautiful and functional website designs</p>
                    </div>
                </div>
                <div class="project-card">
                    <div class="project-image">Project Image</div>
                    <div class="project-content">
                        <h3>Brand Identity</h3>
                        <p>Complete brand identity packages</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <footer class="footer">
        <p>&copy; 2024 Creative Portfolio. All rights reserved.</p>
    </footer>
</body>
</html>`
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Store',
      description: 'Online store with product listings',
      category: 'E-commerce',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Online Store</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; }
        .navbar {
            background: #1f2937;
            color: white;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .hero {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }
        .products {
            padding: 4rem 2rem;
            background: #f9fafb;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        .product-card {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .price {
            color: #059669;
            font-weight: bold;
            font-size: 1.25rem;
            margin: 1rem 0;
        }
        .btn {
            background: #3b82f6;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <h2>ShopNow</h2>
        <div>
            <button style="background: none; border: none; color: white; margin-left: 1rem;">Cart (0)</button>
        </div>
    </nav>
    
    <section class="hero">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Amazing Products</h1>
        <p style="font-size: 1.125rem;">Best quality at the best prices</p>
    </section>
    
    <section class="products">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 2rem;">Featured Products</h2>
            <div class="product-grid">
                <div class="product-card">
                    <h3>Product One</h3>
                    <p class="price">$29.99</p>
                    <button class="btn">Add to Cart</button>
                </div>
                <div class="product-card">
                    <h3>Product Two</h3>
                    <p class="price">$39.99</p>
                    <button class="btn">Add to Cart</button>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      description: 'Food ordering and menu website',
      category: 'Food',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tasty Bites</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', serif; }
        .hero {
            background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
            color: #7c2d12;
            padding: 4rem 2rem;
            text-align: center;
        }
        .menu {
            padding: 4rem 2rem;
            background: #fff7ed;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        .menu-item {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .price {
            color: #ea580c;
            font-weight: bold;
            font-size: 1.25rem;
        }
    </style>
</head>
<body>
    <section class="hero">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">Tasty Bites</h1>
        <p style="font-size: 1.25rem;">Delicious food made with love</p>
    </section>
    
    <section class="menu">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 2rem; color: #7c2d12;">Our Menu</h2>
            <div class="menu-grid">
                <div class="menu-item">
                    <h3>Pasta Carbonara</h3>
                    <p class="price">$12.99</p>
                    <p>Creamy pasta with bacon and cheese</p>
                </div>
                <div class="menu-item">
                    <h3>Grilled Salmon</h3>
                    <p class="price">$18.99</p>
                    <p>Fresh salmon with lemon butter sauce</p>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`
    },
    {
      id: 'blog',
      name: 'Blog Website',
      description: 'Clean blog layout with articles',
      category: 'Blog',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thoughtful Blog</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; line-height: 1.7; }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        .blog-posts {
            padding: 4rem 2rem;
            max-width: 800px;
            margin: 0 auto;
        }
        .post {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .post-date {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body>
    <header class="header">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Thoughtful Blog</h1>
        <p style="font-size: 1.125rem;">Sharing ideas and experiences</p>
    </header>
    
    <section class="blog-posts">
        <article class="post">
            <div class="post-date">Published on January 15, 2024</div>
            <h2 style="margin-bottom: 1rem;">Getting Started with Web Development</h2>
            <p>Learn the fundamentals of modern web development and build your first website...</p>
        </article>
        
        <article class="post">
            <div class="post-date">Published on January 10, 2024</div>
            <h2 style="margin-bottom: 1rem;">The Future of AI in Design</h2>
            <p>Exploring how artificial intelligence is transforming the design industry...</p>
        </article>
    </section>
</body>
</html>`
    }
  ];

  // Initialize with first template
  useEffect(() => {
    if (PRE_BUILT_TEMPLATES.length > 0 && !generatedCode) {
      setGeneratedCode(PRE_BUILT_TEMPLATES[0].code);
      setPreviewHtml(PRE_BUILT_TEMPLATES[0].code);
      setSelectedTemplate(PRE_BUILT_TEMPLATES[0].id);
    }
  }, []);

  // Generate website with AI
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert('Please describe the website you want to create');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Use your existing API route
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create a complete HTML website with CSS based on this description: ${aiPrompt}. 
          Requirements:
          - Return only valid HTML code with embedded CSS
          - Include proper responsive design
          - Make it visually appealing
          - Include common sections like header, main content, footer
          - Use modern CSS features
          - Make sure it works on mobile devices
          - Don't include any explanations, just the HTML code`,
          type: 'website-code'
        })
      });

      const data = await response.json();
      
      if (data.result) {
        const htmlCode = extractHTMLFromResponse(data.result);
        setGeneratedCode(htmlCode);
        setPreviewHtml(htmlCode);
        setActiveTab('preview');
      } else {
        // Fallback to template-based generation
        generateFromTemplate(aiPrompt);
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      // Fallback to template-based generation
      generateFromTemplate(aiPrompt);
    } finally {
      setIsGenerating(false);
    }
  };

  // Extract HTML from AI response
  const extractHTMLFromResponse = (response) => {
    // Try to find HTML code in the response
    const htmlMatch = response.match(/```html\n([\s\S]*?)\n```/) || 
                     response.match(/```\n([\s\S]*?)\n```/) ||
                     response.match(/<html[\s\S]*<\/html>/);
    
    if (htmlMatch) {
      return htmlMatch[1] || htmlMatch[0];
    }
    
    // If no HTML found, return the response as is (might be plain HTML)
    return response;
  };

  // Smart template-based generation as fallback
  const generateFromTemplate = (prompt) => {
    let selectedTemplate = PRE_BUILT_TEMPLATES[0];
    
    // Simple keyword matching to choose template
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('blog') || promptLower.includes('article')) {
      selectedTemplate = PRE_BUILT_TEMPLATES[4]; // Blog
    } else if (promptLower.includes('shop') || promptLower.includes('store') || promptLower.includes('product')) {
      selectedTemplate = PRE_BUILT_TEMPLATES[2]; // E-commerce
    } else if (promptLower.includes('food') || promptLower.includes('restaurant') || promptLower.includes('menu')) {
      selectedTemplate = PRE_BUILT_TEMPLATES[3]; // Restaurant
    } else if (promptLower.includes('portfolio') || promptLower.includes('design') || promptLower.includes('creative')) {
      selectedTemplate = PRE_BUILT_TEMPLATES[1]; // Portfolio
    }
    
    setGeneratedCode(selectedTemplate.code);
    setPreviewHtml(selectedTemplate.code);
    setSelectedTemplate(selectedTemplate.id);
  };

  // Apply template
  const applyTemplate = (template) => {
    setGeneratedCode(template.code);
    setPreviewHtml(template.code);
    setSelectedTemplate(template.id);
    setActiveTab('preview');
  };

  // Download website code
  const downloadCode = () => {
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

  // Save website (simulated - you can integrate with your backend)
  const saveWebsite = () => {
    localStorage.setItem(`website_${websiteName}`, generatedCode);
    alert('Website saved locally!');
  };

  // Reset website
  const resetWebsite = () => {
    setGeneratedCode('');
    setPreviewHtml('');
    setAiPrompt('');
    setSelectedTemplate(null);
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

  const templateGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  };

  const templateCardStyle = {
    backgroundColor: '#334155',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s'
  };

  const selectedTemplateStyle = {
    ...templateCardStyle,
    borderColor: '#3b82f6',
    backgroundColor: '#374151'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <button onClick={downloadCode} style={{ ...buttonStyle, backgroundColor: '#059669' }}>
              ⬇️ Download
            </button>
            <button onClick={resetWebsite} style={{ ...buttonStyle, backgroundColor: '#dc2626' }}>
              🗑️ Reset
            </button>
          </div>
        </div>
      </header>

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
              {isGenerating ? '🔄 Generating...' : '✨ Generate with AI'}
            </button>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>🎨 Quick Templates</h4>
            <div style={templateGridStyle}>
              {PRE_BUILT_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  style={selectedTemplate === template.id ? selectedTemplateStyle : templateCardStyle}
                  onClick={() => applyTemplate(template)}
                  onMouseEnter={(e) => {
                    if (selectedTemplate !== template.id) {
                      e.currentTarget.style.backgroundColor = '#374151';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTemplate !== template.id) {
                      e.currentTarget.style.backgroundColor = '#334155';
                    }
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {template.category === 'Business' && '💼'}
                    {template.category === 'Portfolio' && '🎨'}
                    {template.category === 'E-commerce' && '🛒'}
                    {template.category === 'Food' && '🍕'}
                    {template.category === 'Blog' && '📝'}
                  </div>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{template.name}</h5>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {generatedCode && (
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#e2e8f0' }}>💡 Tips</h4>
              <ul style={{ fontSize: '0.875rem', color: '#94a3b8', paddingLeft: '1rem', margin: 0 }}>
                <li>Edit the code in the Code tab</li>
                <li>See changes instantly in Preview</li>
                <li>Download when ready</li>
                <li>Use AI to generate new designs</li>
              </ul>
            </div>
          )}
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

          {activeTab === 'code' && (
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
                Describe the website you want to create, choose from our templates, or start with a blank slate. 
                Our AI will generate beautiful, responsive code for you.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button 
                  onClick={() => document.querySelector('textarea').focus()}
                  style={{ ...buttonStyle, backgroundColor: '#8b5cf6', padding: '1rem 2rem', fontSize: '1.125rem' }}
                >
                  🎨 Describe Your Website
                </button>
                <button 
                  onClick={() => applyTemplate(PRE_BUILT_TEMPLATES[0])}
                  style={{ ...buttonStyle, backgroundColor: '#3b82f6', padding: '1rem 2rem', fontSize: '1.125rem' }}
                >
                  💼 Use a Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
