// pages/website-builder.js - WITH OPENROUTER AI INTEGRATION
import { useState, useRef } from 'react';
import Head from 'next/head';

export default function WebsiteBuilder() {
  const [elements, setElements] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [websiteName, setWebsiteName] = useState('My Website');
  const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo');
  const canvasRef = useRef(null);

  // OpenRouter Free Models
  const AI_MODELS = [
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', free: true },
    { id: 'google/gemini-pro', name: 'Gemini Pro', free: true },
    { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B', free: true },
    { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', free: true },
    { id: 'microsoft/wizardlm-2-8x22b', name: 'WizardLM 2', free: true }
  ];

  // Add new element to canvas
  const addElement = (type) => {
    const newElement = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      position: elements.length
    };
    setElements([...elements, newElement]);
  };

  // Update element content
  const updateElement = (id, content) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, content } : el
    ));
  };

  // Delete element
  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
  };

  // Get default content for each element type
  const getDefaultContent = (type) => {
    switch (type) {
      case 'header':
        return '<h1 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin: 0;">Welcome to My Website</h1>';
      case 'text':
        return '<p style="font-size: 1.125rem; line-height: 1.6;">Start editing this text to add your content...</p>';
      case 'button':
        return '<button style="background-color: #3b82f6; color: white; font-weight: 600; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer;">Click Me</button>';
      case 'section':
        return '<div style="background-color: #f8fafc; padding: 2rem; border-radius: 0.5rem;"><h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Section Title</h2><p>Section content goes here...</p></div>';
      case 'footer':
        return '<footer style="background-color: #1f2937; color: white; padding: 1.5rem; text-align: center;">&copy; 2024 My Website. All rights reserved.</footer>';
      default:
        return '';
    }
  };

  // Get default styles for each element type
  const getDefaultStyles = (type) => {
    switch (type) {
      case 'header':
        return { padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' };
      case 'text':
        return { padding: '1rem' };
      case 'button':
        return { textAlign: 'center', padding: '1rem' };
      case 'section':
        return { margin: '1rem 0' };
      case 'footer':
        return { marginTop: '2rem' };
      default:
        return {};
    }
  };

  // Save website
  const saveWebsite = async () => {
    try {
      console.log('Saving website:', { name: websiteName, elements });
      alert('Website saved successfully!');
    } catch (error) {
      console.error('Error saving website:', error);
      alert('Error saving website');
    }
  };

  // Publish website
  const publishWebsite = async () => {
    await saveWebsite();
    alert('Website published successfully!');
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
      // Try with selected model first
      let response = await tryAIModel(selectedModel, aiPrompt);
      
      // If first model fails, try fallback models
      if (!response.success) {
        const fallbackModels = AI_MODELS.filter(model => model.id !== selectedModel);
        
        for (let model of fallbackModels) {
          console.log(`Trying fallback model: ${model.name}`);
          response = await tryAIModel(model.id, aiPrompt);
          if (response.success) {
            setSelectedModel(model.id); // Switch to working model
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
    padding: '0 1rem'
  };

  const headerInnerStyle = {
    maxWidth: '1200px',
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
    fontWeight: '600'
  };

  const inputStyle = {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem'
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
    height: 'calc(100vh - 4rem)'
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
    border: elements.length === 0 ? '2px dashed #d1d5db' : 'none'
  };

  const componentStyle = {
    padding: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    cursor: 'move',
    marginBottom: '0.75rem',
    backgroundColor: '#f9fafb'
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

  return (
    <div style={containerStyle}>
      <Head>
        <title>Website Builder | AI Prompt Maker</title>
        <meta name="description" content="Build your website with AI assistance" />
      </Head>

      {/* Header */}
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Website Builder
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="text"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              style={inputStyle}
              placeholder="Website name"
            />
            <button
              onClick={() => setIsPreview(!isPreview)}
              style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={saveWebsite}
              style={buttonStyle}
            >
              Save
            </button>
            <button
              onClick={publishWebsite}
              style={{ ...buttonStyle, backgroundColor: '#10b981' }}
            >
              Publish
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
                { type: 'section', icon: '📦', label: 'Section' },
                { type: 'footer', icon: '👣', label: 'Footer' }
              ].map((component) => (
                <div
                  key={component.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component.type)}
                  style={componentStyle}
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
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Start Building Your Website
                </h3>
                <p>
                  Drag components from the sidebar or use AI assistance to get started
                </p>
              </div>
            ) : (
              elements.map((element) => (
                <div
                  key={element.id}
                  style={{
                    position: 'relative',
                    marginBottom: '1rem',
                    ...element.styles
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: element.content }} />
                  {!isPreview && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      display: 'flex',
                      gap: '0.25rem'
                    }}>
                      <button
                        onClick={() => {
                          const newContent = prompt('Edit content:', element.content.replace(/<[^>]*>/g, ''));
                          if (newContent) {
                            updateElement(element.id, newContent);
                          }
                        }}
                        style={{
                          background: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteElement(element.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
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
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: aiResponse.startsWith('❌') ? '#ef4444' : '#059669' }}>
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
