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
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Updated table names: user_prompt_categories and user_prompts
      const [categoriesResponse, promptsResponse] = await Promise.all([
        supabase.from('user_prompt_categories').select('*').order('name'),
        supabase.from('user_prompts')
          .select(`
            *,
            user_prompt_categories (
              name,
              icon
            )
          `)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
      ]);

      if (categoriesResponse.error) {
        console.error('Error fetching categories:', categoriesResponse.error);
      } else {
        setCategories(categoriesResponse.data || []);
      }

      if (promptsResponse.error) {
        console.error('Error fetching prompts:', promptsResponse.error);
      } else {
        setPrompts(promptsResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = selectedCategory === 'all' || 
                           prompt.user_prompt_categories?.name === selectedCategory;
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (prompt.tags && prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = async (text, prompt) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Prompt copied to clipboard!');
      
      // Usage count update karen
      if (prompt && prompt.id) {
        await supabase
          .from('user_prompts')
          .update({ usage_count: (prompt.usage_count || 0) + 1 })
          .eq('id', prompt.id);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy prompt. Please try again.');
    }
  };

  const handleUseTemplate = (prompt) => {
    router.push({
      pathname: '/prompt-builder',
      query: { 
        template: prompt.id,
        title: prompt.title,
        description: prompt.description,
        prompt_text: prompt.prompt_text,
        category_id: prompt.category_id,
        tags: prompt.tags?.join(',')
      }
    });
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#f8fafc' : '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '30px',
      flexWrap: 'wrap'
    },
    backButton: {
      padding: '10px 20px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0
    },
    hero: {
      textAlign: 'center',
      marginBottom: '40px',
      padding: '40px 20px',
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: darkMode ? '1px solid #334155' : 'none'
    },
    heroTitle: {
      fontSize: '2rem',
      color: darkMode ? '#f8fafc' : '#1e293b',
      marginBottom: '10px'
    },
    heroSubtitle: {
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontSize: '1.1rem'
    },
    controls: {
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      marginBottom: '30px',
      border: darkMode ? '1px solid #334155' : 'none'
    },
    searchInput: {
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto 30px',
      padding: '15px 20px',
      border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '12px',
      fontSize: '1rem',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      display: 'block'
    },
    categoriesSection: {
      marginBottom: '20px'
    },
    categoriesTitle: {
      marginBottom: '15px',
      color: darkMode ? '#f8fafc' : '#374151',
      fontSize: '1.1rem'
    },
    categoriesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px'
    },
    categoryFilter: {
      padding: '12px 20px',
      border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#374151',
      borderRadius: '25px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      fontSize: '0.9rem'
    },
    activeCategory: {
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f620',
      fontWeight: '600'
    },
    stats: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px',
      padding: '0 10px',
      flexWrap: 'wrap'
    },
    statItem: {
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontSize: '0.9rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '25px',
      marginBottom: '40px'
    },
    card: {
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    categoryBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      backgroundColor: '#3b82f620',
      color: '#3b82f6'
    },
    metrics: {
      display: 'flex',
      gap: '10px',
      fontSize: '0.8rem',
      color: darkMode ? '#cbd5e1' : '#64748b'
    },
    cardTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: darkMode ? '#f8fafc' : '#1e293b',
      marginBottom: '10px',
      lineHeight: '1.3'
    },
    cardDescription: {
      color: darkMode ? '#cbd5e1' : '#64748b',
      lineHeight: '1.5',
      marginBottom: '15px',
      flexGrow: 1
    },
    preview: {
      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '15px',
      borderLeft: '4px solid #3b82f6'
    },
    previewCode: {
      color: darkMode ? '#cbd5e1' : '#475569',
      fontFamily: "'Monaco', 'Consolas', monospace",
      fontSize: '0.85rem',
      lineHeight: '1.4',
      margin: 0
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '20px'
    },
    tag: {
      background: darkMode ? '#334155' : '#f1f5f9',
      color: darkMode ? '#e2e8f0' : '#475569',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    actions: {
      display: 'flex',
      gap: '10px',
      marginTop: 'auto'
    },
    actionButton: {
      flex: 1,
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    copyButton: {
      background: darkMode ? '#334155' : '#f1f5f9',
      color: darkMode ? '#f8fafc' : '#374151'
    },
    useButton: {
      background: '#3b82f6',
      color: 'white'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: darkMode ? '1px solid #334155' : 'none'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '20px'
    },
    emptyTitle: {
      color: darkMode ? '#f8fafc' : '#1e293b',
      marginBottom: '10px'
    },
    emptyText: {
      color: darkMode ? '#cbd5e1' : '#64748b'
    },
    footer: {
      textAlign: 'center',
      padding: '30px',
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: darkMode ? '1px solid #334155' : 'none'
    },
    footerLink: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '600'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px',
      textAlign: 'center'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: `4px solid ${darkMode ? '#334155' : '#f1f5f9'}`,
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>Loading prompt library...</p>
        </div>
        
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Prompt Library - AI Prompt Maker</title>
        <meta name="description" content="Browse our collection of AI prompts for various use cases including creative writing, coding, business, and more." />
        <meta name="keywords" content="AI prompts, prompt library, chatgpt prompts, AI templates, creative writing prompts" />
      </Head>

      <div style={styles.container}>
        <nav style={styles.nav}>
          <button 
            onClick={() => router.push('/')}
            style={styles.backButton}
          >
            ← Back to Home
          </button>
          <h1 style={styles.title}>AI Prompt Library</h1>
        </nav>

        <div style={styles.hero}>
          <h2 style={styles.heroTitle}>Discover Ready-to-Use AI Prompts</h2>
          <p style={styles.heroSubtitle}>Copy, customize, and use professionally crafted prompts for various tasks</p>
        </div>

        <div style={styles.controls}>
          <input
            type="text"
            placeholder="🔍 Search prompts by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.categoriesSection}>
            <h3 style={styles.categoriesTitle}>Filter by Category:</h3>
            <div style={styles.categoriesGrid}>
              <button
                style={{
                  ...styles.categoryFilter,
                  ...(selectedCategory === 'all' ? styles.activeCategory : {})
                }}
                onClick={() => setSelectedCategory('all')}
              >
                🌟 All Prompts
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  style={{
                    ...styles.categoryFilter,
                    ...(selectedCategory === category.name ? styles.activeCategory : {})
                  }}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.stats}>
          <span style={styles.statItem}>
            Total Prompts: <strong>{filteredPrompts.length}</strong>
          </span>
          <span style={styles.statItem}>
            Categories: <strong>{categories.length}</strong>
          </span>
          <span style={styles.statItem}>
            Showing: <strong>{filteredPrompts.length}</strong> prompts
          </span>
        </div>

        <div style={styles.grid}>
          {filteredPrompts.map(prompt => (
            <div key={prompt.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.categoryBadge}>
                  {prompt.user_prompt_categories?.icon} {prompt.user_prompt_categories?.name || 'Uncategorized'}
                </div>
                <div style={styles.metrics}>
                  <span>👤 {prompt.usage_count || 0}</span>
                  {prompt.rating > 0 && (
                    <span>⭐ {prompt.rating}</span>
                  )}
                </div>
              </div>

              <h3 style={styles.cardTitle}>{prompt.title}</h3>
              
              {prompt.description && (
                <p style={styles.cardDescription}>{prompt.description}</p>
              )}

              <div style={styles.preview}>
                <code style={styles.previewCode}>
                  {prompt.prompt_text.substring(0, 100)}...
                </code>
              </div>

              {prompt.tags && prompt.tags.length > 0 && (
                <div style={styles.tagsContainer}>
                  {prompt.tags.map((tag, index) => (
                    <span key={index} style={styles.tag}>#{tag}</span>
                  ))}
                </div>
              )}

              <div style={styles.actions}>
                <button
                  onClick={() => copyToClipboard(prompt.prompt_text, prompt)}
                  style={{...styles.actionButton, ...styles.copyButton}}
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => handleUseTemplate(prompt)}
                  style={{...styles.actionButton, ...styles.useButton}}
                >
                  ✏️ Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPrompts.length === 0 && !loading && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No prompts found</h3>
            <p style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search terms or select a different category' 
                : 'No prompts available yet. Be the first to create one!'
              }
            </p>
            <button 
              onClick={() => router.push('/prompt-builder')}
              style={styles.backButton}
            >
              ➕ Create First Prompt
            </button>
          </div>
        )}

        <footer style={styles.footer}>
          <p>
            Need a custom prompt?{' '}
            <a 
              href="/prompt-builder" 
              style={styles.footerLink}
              onClick={(e) => {
                e.preventDefault();
                router.push('/prompt-builder');
              }}
            >
              Create your own →
            </a>
          </p>
        </footer>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background-color: ${darkMode ? '#0f172a' : '#f8fafc'};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        * {
          box-sizing: border-box;
        }

        input:focus, button:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .prompts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
