// pages/prompt-builder.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import AdsComponent from '../components/AdsComponent';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PromptBuilder() {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Check dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);

    // Load categories
    loadCategories();

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const loadCategories = async () => {
    try {
      console.log('Loading categories from user_prompt_categories...');
      const { data, error } = await supabase
        .from('user_prompt_categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error loading categories:', error);
        return;
      }
      
      console.log('Categories loaded:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !prompt.trim()) {
      alert('Please fill in both title and prompt fields');
      return;
    }

    setLoading(true);

    try {
      const promptData = {
        title: title.trim(),
        description: description.trim(),
        prompt_text: prompt.trim(),
        category_id: category || null,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        is_public: isPublic,
        usage_count: 0,
        rating: 0
      };

      console.log('Saving prompt to user_prompts table:', promptData);

      const { data, error } = await supabase
        .from('user_prompts')
        .insert([promptData])
        .select();

      if (error) {
        console.error('Supabase Error Details:', error);
        throw error;
      }

      console.log('Prompt saved successfully:', data);
      alert('Prompt saved successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setPrompt('');
      setCategory('');
      setTags('');
      setIsPublic(true);
      
      // Redirect to prompts page
      router.push('/prompts');
    } catch (error) {
      console.error('Error saving prompt:', error);
      alert(`Error saving prompt: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: isMobile ? '16px' : '24px',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    backButton: {
      padding: '10px 20px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: '24px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: isMobile ? '2rem' : '2.5rem',
      fontWeight: '700',
      color: '#3b82f6',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontSize: '1.1rem'
    },
    form: {
      backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
      borderRadius: '12px',
      padding: isMobile ? '20px' : '32px',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    formGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: darkMode ? '#f8fafc' : '#1e293b',
      fontSize: '1rem'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      minHeight: '200px',
      resize: 'vertical',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#1e293b',
      boxSizing: 'border-box'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px'
    },
    checkbox: {
      width: '18px',
      height: '18px'
    },
    saveButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: loading ? '#9ca3af' : '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease'
    },
    previewSection: {
      marginTop: '32px',
      padding: '20px',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '8px'
    },
    previewTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '12px',
      color: darkMode ? '#f8fafc' : '#1e293b'
    },
    previewContent: {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      lineHeight: '1.6',
      color: darkMode ? '#cbd5e1' : '#4b5563'
    }
  };

  return (
    <>
      <Head>
        <title>Prompt Builder - AI Prompt Maker</title>
        <meta name="description" content="Create and save your custom AI prompts with our Prompt Builder tool" />
      </Head>

      <div style={styles.container}>
        <button 
          onClick={() => router.back()} 
          style={styles.backButton}
        >
          ← Back to Library
        </button>

        <header style={styles.header}>
          <h1 style={styles.title}>Prompt Builder</h1>
          <p style={styles.subtitle}>Create and save your custom AI prompts</p>
        </header>

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Prompt Title *</label>
            <input
              type="text"
              placeholder="e.g., Creative Story Generator, Professional Email Template"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <input
              type="text"
              placeholder="Brief description of what this prompt does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '8px' }}>
                No categories found. Please check if user_prompt_categories table exists.
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., creative, writing, story, fiction"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Prompt Text *</label>
            <textarea
              placeholder={`Enter your prompt here...

You can use {variables} for dynamic parts. For example:
"Write a creative story about {topic} with {character} as the main character."

Users will be able to replace {topic} and {character} with their own values.`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={styles.textarea}
              rows="8"
            />
          </div>

          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor="isPublic" style={styles.label}>
              Make this prompt public (visible to all users)
            </label>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            style={styles.saveButton}
          >
            {loading ? 'Saving...' : '💾 Save to Library'}
          </button>
        </div>

        {/* Preview Section */}
        {prompt && (
          <div style={styles.previewSection}>
            <h3 style={styles.previewTitle}>Preview</h3>
            <div style={styles.previewContent}>
              {prompt}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
          borderRadius: '12px',
          border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
        }}>
          <h3 style={{
            color: darkMode ? '#f8fafc' : '#1e293b',
            marginBottom: '12px',
            fontSize: '1.1rem'
          }}>💡 Tips for Creating Great Prompts</h3>
          <ul style={{
            color: darkMode ? '#cbd5e1' : '#64748b',
            paddingLeft: '20px',
            margin: 0,
            lineHeight: '1.6'
          }}>
            <li>Use clear and specific instructions</li>
            <li>Include examples when possible</li>
            <li>Use {"{variables}"} for customizable parts</li>
            <li>Specify the desired format and tone</li>
            <li>Add context about the target audience</li>
          </ul>
        </div>
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

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </>
  );
}
