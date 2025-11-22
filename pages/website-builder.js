// pages/website-builder.js - WITH INLINE CSS
import { useState, useRef } from 'react';
import Head from 'next/head';

export default function WebsiteBuilder() {
  const [elements, setElements] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [websiteName, setWebsiteName] = useState('My Website');
  const canvasRef = useRef(null);

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
        return 'padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;';
      case 'text':
        return 'padding: 1rem;';
      case 'button':
        return 'text-align: center; padding: 1rem;';
      case 'section':
        return 'margin: 1rem 0;';
      case 'footer':
        return 'margin-top: 2rem;';
      default:
        return '';
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

  // Get AI assistance
  const getAIAssistance = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for AI assistance');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `I'm building a website. ${aiPrompt}. Please provide helpful content or suggestions.`,
          type: 'website-content'
        })
      });

      const data = await response.json();
      setAiResponse(data.result || 'No response from AI');
    } catch (error) {
      console.error('AI Error:', error);
      setAiResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
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
    lineHeight: '1.5'
  };

  const emptyCanvasStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280'
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
                <WebsiteElement
                  key={element.id}
                  element={element}
                  onUpdate={updateElement}
                  onDelete={deleteElement}
                  isPreview={isPreview}
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
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Tell me what kind of content you need for your website..."
                style={textareaStyle}
              />
              <button
                onClick={getAIAssistance}
                disabled={isLoading}
                style={{ ...buttonStyle, backgroundColor: '#8b5cf6' }}
              >
                {isLoading ? 'Generating...' : 'Get AI Help'}
              </button>
              
              {aiResponse && (
                <div style={aiResponseStyle}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>AI Suggestion:</h4>
                  <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Website Element Component with Inline CSS
function WebsiteElement({ element, onUpdate, onDelete, isPreview }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);

  const handleSave = () => {
    onUpdate(element.id, content);
    setIsEditing(false);
  };

  const elementStyle = {
    position: 'relative',
    marginBottom: '1rem',
    ...(isEditing && !isPreview ? {
      border: '2px solid #3b82f6',
      borderRadius: '0.5rem',
      padding: '1rem'
    } : {})
  };

  const controlsStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    opacity: 0,
    transition: 'opacity 0.2s',
    display: 'flex',
    gap: '0.25rem'
  };

  const controlButtonStyle = {
    background: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    width: '1.875rem',
    height: '1.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const editAreaStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const editTextareaStyle = {
    width: '100%',
    height: '8rem',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem'
  };

  const editButtonsStyle = {
    display: 'flex',
    gap: '0.5rem'
  };

  return (
    <div 
      style={{...elementStyle, ...(JSON.parse(`{"${element.styles}"}`))}}
      onMouseEnter={(e) => {
        if (!isPreview) {
          e.currentTarget.querySelector('.element-controls').style.opacity = 1;
        }
      }}
      onMouseLeave={(e) => {
        if (!isPreview) {
          e.currentTarget.querySelector('.element-controls').style.opacity = 0;
        }
      }}
    >
      {!isPreview && (
        <div className="element-controls" style={controlsStyle}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={controlButtonStyle}
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(element.id)}
            style={{...controlButtonStyle, borderColor: '#ef4444'}}
          >
            🗑️
          </button>
        </div>
      )}

      {isEditing && !isPreview ? (
        <div style={editAreaStyle}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={editTextareaStyle}
          />
          <div style={editButtonsStyle}>
            <button
              onClick={handleSave}
              style={{...controlButtonStyle, backgroundColor: '#10b981', color: 'white', border: 'none', width: 'auto', padding: '0 0.75rem'}}
            >
              Save
            </button>
            <button
              onClick={() => {
                setContent(element.content);
                setIsEditing(false);
              }}
              style={{...controlButtonStyle, backgroundColor: '#6b7280', color: 'white', border: 'none', width: 'auto', padding: '0 0.75rem'}}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
}
