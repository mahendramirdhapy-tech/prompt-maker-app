// pages/prompt-library.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Updated table names: prompt_categories and prompt_library
      const [categoriesResponse, promptsResponse] = await Promise.all([
        supabase.from('prompt_categories').select('*').order('name'),
        supabase.from('prompt_library')
          .select(`
            *,
            prompt_categories (
              name,
              color,
              icon
            )
          `)
          .eq('is_public', true)
          .order('usage_count', { ascending: false })
      ]);

      if (categoriesResponse.data) setCategories(categoriesResponse.data);
      if (promptsResponse.data) setPrompts(promptsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = selectedCategory === 'all' || 
                           prompt.prompt_categories?.name === selectedCategory;
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Prompt copied to clipboard!');
      
      // Usage count update karen
      await supabase
        .from('prompt_library')
        .update({ usage_count: prompt.usage_count + 1 })
        .eq('id', prompt.id);
        
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleUseTemplate = (promptId) => {
    router.push(`/prompt-builder?template=${promptId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading prompt library...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Prompt Library - AI Prompt Maker</title>
        <meta name="description" content="Browse our collection of AI prompts for various use cases" />
      </Head>

      <div className="prompt-library-container">
        <nav className="library-nav">
          <button onClick={() => router.back()} className="back-btn">
            ← Back to Home
          </button>
          <h1>AI Prompt Library</h1>
        </nav>

        <div className="library-hero">
          <h2>Discover Ready-to-Use AI Prompts</h2>
          <p>Copy, customize, and use professionally crafted prompts for various tasks</p>
        </div>

        <div className="library-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search prompts by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="categories-section">
            <h3>Filter by Category:</h3>
            <div className="categories-grid">
              <button
                className={`category-filter ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                🌟 All Prompts
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-filter ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.name)}
                  style={{ 
                    borderColor: selectedCategory === category.name ? category.color : '#e2e8f0',
                    backgroundColor: selectedCategory === category.name ? category.color + '20' : 'white'
                  }}
                >
                  <span className="category-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="prompts-stats">
          <span className="stat-item">
            Total Prompts: <strong>{filteredPrompts.length}</strong>
          </span>
          <span className="stat-item">
            Categories: <strong>{categories.length}</strong>
          </span>
        </div>

        <div className="prompts-grid">
          {filteredPrompts.map(prompt => (
            <div key={prompt.id} className="prompt-card">
              <div className="card-header">
                <div 
                  className="category-badge"
                  style={{ backgroundColor: prompt.prompt_categories?.color + '20', color: prompt.prompt_categories?.color }}
                >
                  {prompt.prompt_categories?.icon} {prompt.prompt_categories?.name}
                </div>
                <div className="prompt-metrics">
                  <span className="metric">👤 {prompt.usage_count || 0}</span>
                  {prompt.rating > 0 && (
                    <span className="metric">⭐ {prompt.rating}</span>
                  )}
                </div>
              </div>

              <h3 className="prompt-title">{prompt.title}</h3>
              
              {prompt.description && (
                <p className="prompt-desc">{prompt.description}</p>
              )}

              <div className="prompt-preview">
                <code>{prompt.prompt_text.substring(0, 100)}...</code>
              </div>

              <div className="tags-container">
                {prompt.tags?.map((tag, index) => (
                  <span key={index} className="prompt-tag">#{tag}</span>
                ))}
              </div>

              <div className="card-actions">
                <button
                  onClick={() => copyToClipboard(prompt.prompt_text)}
                  className="action-btn copy-btn"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => handleUseTemplate(prompt.id)}
                  className="action-btn use-btn"
                >
                  ✏️ Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No prompts found</h3>
            <p>Try adjusting your search terms or select a different category</p>
          </div>
        )}

        <footer className="library-footer">
          <p>Need a custom prompt? <a href="/index">Create your own →</a></p>
        </footer>
      </div>

      <style jsx>{`
        .prompt-library-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          background: #f8fafc;
        }

        .library-nav {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .back-btn {
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .library-nav h1 {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .library-hero {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .library-hero h2 {
          font-size: 2rem;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .library-hero p {
          color: #64748b;
          font-size: 1.1rem;
        }

        .library-controls {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 30px;
        }

        .search-container {
          max-width: 600px;
          margin: 0 auto 30px;
        }

        .search-input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .categories-section h3 {
          margin-bottom: 15px;
          color: #374151;
          font-size: 1.1rem;
        }

        .categories-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .category-filter {
          padding: 12px 20px;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 25px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .category-filter.active {
          font-weight: 600;
        }

        .prompts-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 0 10px;
        }

        .stat-item {
          color: #64748b;
          font-size: 0.9rem;
        }

        .prompts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .prompt-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .prompt-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .category-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .prompt-metrics {
          display: flex;
          gap: 10px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .prompt-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .prompt-desc {
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 15px;
          flex-grow: 1;
        }

        .prompt-preview {
          background: #f8fafc;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          border-left: 4px solid #3b82f6;
        }

        .prompt-preview code {
          color: #475569;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }

        .prompt-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .card-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }

        .action-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .copy-btn {
          background: #f1f5f9;
          color: #374151;
        }

        .use-btn {
          background: #3b82f6;
          color: white;
        }

        .copy-btn:hover {
          background: #e2e8f0;
        }

        .use-btn:hover {
          background: #2563eb;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          color: #1e293b;
          margin-bottom: 10px;
        }

        .empty-state p {
          color: #64748b;
        }

        .library-footer {
          text-align: center;
          padding: 30px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .library-footer a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
        }

        .library-footer a:hover {
          text-decoration: underline;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f1f5f9;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .prompts-grid {
            grid-template-columns: 1fr;
          }
          
          .categories-grid {
            overflow-x: auto;
            padding-bottom: 10px;
          }
          
          .card-header {
            flex-direction: column;
            gap: 10px;
          }
          
          .prompt-metrics {
            align-self: flex-start;
          }
        }
      `}</style>
    </>
  );
                }
