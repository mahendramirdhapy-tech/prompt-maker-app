// pages/prompts.js
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
      const [categoriesResponse, promptsResponse] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('prompts').select('*, categories(name, color, icon)').eq('is_public', true).order('usage_count', { ascending: false })
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
    const matchesCategory = selectedCategory === 'all' || prompt.categories?.name === selectedCategory;
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Prompt copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading prompts...</div>;
  }

  return (
    <>
      <Head>
        <title>Prompt Library - AI Prompt Maker</title>
        <meta name="description" content="Browse our collection of AI prompts for various use cases" />
      </Head>

      <div className="prompt-library">
        <button onClick={() => router.back()} className="back-button">
          ← Back
        </button>

        <header className="library-header">
          <h1>Prompt Library</h1>
          <p>Discover and use pre-made prompts for various AI tasks</p>
        </header>

        <div className="library-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            <button
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Prompts
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.name)}
                style={{ '--category-color': category.color }}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="prompts-grid">
          {filteredPrompts.map(prompt => (
            <div key={prompt.id} className="prompt-card">
              <div className="prompt-header">
                <div className="prompt-category" style={{ color: prompt.categories?.color }}>
                  {prompt.categories?.icon} {prompt.categories?.name}
                </div>
                <div className="prompt-stats">
                  <span className="usage-count">👤 {prompt.usage_count}</span>
                  {prompt.rating > 0 && (
                    <span className="rating">⭐ {prompt.rating}</span>
                  )}
                </div>
              </div>

              <h3 className="prompt-title">{prompt.title}</h3>
              <p className="prompt-description">{prompt.description}</p>

              <div className="prompt-tags">
                {prompt.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>

              <div className="prompt-actions">
                <button
                  onClick={() => copyToClipboard(prompt.prompt_text)}
                  className="copy-btn"
                >
                  📋 Copy Prompt
                </button>
                <button
                  onClick={() => router.push(`/prompt-builder?template=${prompt.id}`)}
                  className="use-btn"
                >
                  ✏️ Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="no-results">
            <h3>No prompts found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .prompt-library {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
        }

        .back-button {
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 30px;
        }

        .library-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .library-header h1 {
          font-size: 3rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }

        .library-controls {
          margin-bottom: 40px;
        }

        .search-box {
          max-width: 500px;
          margin: 0 auto 20px;
        }

        .search-input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .category-btn {
          padding: 10px 20px;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 25px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .category-btn.active {
          background: var(--category-color, #3b82f6);
          color: white;
          border-color: var(--category-color, #3b82f6);
        }

        .prompts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }

        .prompt-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .prompt-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .prompt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .prompt-category {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .prompt-stats {
          display: flex;
          gap: 10px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .prompt-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 10px;
          color: #1e293b;
        }

        .prompt-description {
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 15px;
        }

        .prompt-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 20px;
        }

        .tag {
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .prompt-actions {
          display: flex;
          gap: 10px;
        }

        .copy-btn, .use-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
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

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .loading {
          text-align: center;
          padding: 100px 20px;
          font-size: 1.2rem;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .prompts-grid {
            grid-template-columns: 1fr;
          }
          
          .category-filters {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 10px;
          }
        }
      `}</style>
    </>
  );
}
