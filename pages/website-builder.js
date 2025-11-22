import { useState, useRef, useEffect } from 'react';
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
        return '<h1 class="text-4xl font-bold text-center">Welcome to My Website</h1>';
      case 'text':
        return '<p class="text-lg">Start editing this text to add your content...</p>';
      case 'button':
        return '<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Click Me</button>';
      case 'section':
        return '<div class="bg-gray-100 p-8 rounded-lg"><h2 class="text-2xl font-bold mb-4">Section Title</h2><p>Section content goes here...</p></div>';
      case 'footer':
        return '<footer class="bg-gray-800 text-white p-6 text-center">&copy; 2024 My Website. All rights reserved.</footer>';
      default:
        return '';
    }
  };

  // Get default styles for each element type
  const getDefaultStyles = (type) => {
    switch (type) {
      case 'header':
        return 'p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white';
      case 'text':
        return 'p-4';
      case 'button':
        return 'text-center p-4';
      case 'section':
        return 'my-4';
      case 'footer':
        return 'mt-8';
      default:
        return '';
    }
  };

  // Save website
  const saveWebsite = async () => {
    try {
      // Here you can integrate with your Supabase
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

  // Get AI assistance using your existing OpenRouter setup
  const getAIAssistance = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for AI assistance');
      return;
    }

    setIsLoading(true);
    try {
      // Use your existing OpenRouter API integration
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Website Builder | Your App Name</title>
        <meta name="description" content="Build your website with AI assistance" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Website Builder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Website name"
              />
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={saveWebsite}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={publishWebsite}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Components */}
        {!isPreview && (
          <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Components</h2>
            <div className="space-y-3">
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
                  className="p-4 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{component.icon}</span>
                    <span className="font-medium">{component.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <div
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`bg-white rounded-lg shadow-sm border-2 border-dashed ${
              elements.length === 0 ? 'border-gray-300' : 'border-transparent'
            } min-h-full p-6`}
          >
            {elements.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Start Building Your Website
                </h3>
                <p className="text-gray-500">
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
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
            <div className="space-y-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Tell me what kind of content you need for your website..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                onClick={getAIAssistance}
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Generating...' : 'Get AI Help'}
              </button>
              
              {aiResponse && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-semibold mb-2">AI Suggestion:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
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
function WebsiteElement({ element, onUpdate, onDelete, isPreview }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);

  const handleSave = () => {
    onUpdate(element.id, content);
    setIsEditing(false);
  };

  return (
    <div className={`relative group mb-4 ${element.styles}`}>
      {!isPreview && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white p-1 rounded"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(element.id)}
            className="bg-red-500 text-white p-1 rounded"
          >
            🗑️
          </button>
        </div>
      )}

      {isEditing && !isPreview ? (
        <div className="border-2 border-blue-500 p-4 rounded-lg">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 p-2 border border-gray-300 rounded"
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setContent(element.content);
                setIsEditing(false);
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded"
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
