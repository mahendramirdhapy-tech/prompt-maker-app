// pages/index.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TEMPLATES = [
  { label: 'Custom Idea', value: '' },
  { label: 'Blog Intro', value: 'Write a blog intro about' },
  { label: 'Instagram Caption', value: 'Write an Instagram caption for' },
  { label: 'Twitter Post', value: 'Write a viral tweet about' },
  { label: 'LinkedIn Post', value: 'Write a professional LinkedIn post about' },
  { label: 'Code Debugger', value: 'Debug this code:' },
];

const TONES = ['Professional', 'Friendly', 'Technical', 'Creative', 'Humorous'];

export default function Home() {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usedModel, setUsedModel] = useState('');
  const [language, setLanguage] = useState('English');
  const [template, setTemplate] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [tone, setTone] = useState('Professional');
  const [maxTokens, setMaxTokens] = useState(600);
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 🌙 Dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      document.body.style.backgroundColor = isDark ? '#111827' : '#f9fafb';
      document.body.style.color = isDark ? '#f9fafb' : '#111827';
    }
  }, []);

  // 👤 User init
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (typeof window !== 'undefined') {
        const count = parseInt(localStorage.getItem('guestUsage') || '0');
        setUsageCount(count);
      }
    };
    init();
  }, []);

  // 📱 Mobile detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const canGenerate = () => user || usageCount < 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !canGenerate()) return;

    setLoading(true);
    setOutput('');
    setUsedModel('');
    setFeedbackGiven(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: input, language, tone, maxTokens, type: 'prompt' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed');

      setOutput(data.prompt);
      setUsedModel(data.modelUsed);

      await supabase.from('prompts').insert({
        user_id: user?.id || null,
        input: input.trim(),
        output: data.prompt,
        model_used: data.modelUsed,
        language,
        tone,
        max_tokens: maxTokens,
        type: 'prompt',
      });

      if (!user && typeof window !== 'undefined') {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('guestUsage', newCount.toString());
        if (newCount >= 5) setShowLoginModal(true);
      }
    } catch (err) {
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => handleSubmit({ preventDefault: () => {} });

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://aipromptmaker.online' },
    });
    if (error) console.error('Login error:', error);
  };

  const exportTxt = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFeedback = async (rating) => {
    setFeedbackGiven(rating);
    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);

    if (prompts?.length && !error) {
      await supabase.from('feedback').insert({
        prompt_id: prompts[0].id,
        rating,
        comment: feedbackComment,
      });
    }
  };

  const handleTemplateChange = (e) => {
    const val = e.target.value;
    setTemplate(val);
    if (val) setInput(val + ' ');
    else setInput('');
  };

  const buttonStyle = (bg, color = '#fff') => ({
    padding: '6px 12px',
    backgroundColor: bg,
    color,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  });

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 16px',
      paddingBottom: '40px',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
        marginBottom: '24px',
      }}>
        <a href="/" style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: '#2563eb',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          🤖 PromptMaker
        </a>

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              fontSize: '1.5rem',
              background: 'none',
              border: 'none',
              color: darkMode ? '#f9fafb' : '#111827',
              cursor: 'pointer',
            }}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}

        {/* Desktop Nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/" style={{ color: darkMode ? '#93c5fd' : '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Home</a>
            <a href="/seo" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>🔍 SEO</a>
            <a href="/code" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>💻 Code</a>
            <a href="/email" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>✉️ Email</a>
            <a href="/translate" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>🔄 Translate</a>
            <a href="/blog-outline" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>📝 Outline</a>
            <a href="/blog" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>📚 Blog</a>
            {user ? (
              <span style={{ color: darkMode ? '#93c5fd' : '#3b82f6', fontSize: '0.875rem' }}>
                Hi, {user.email?.split('@')[0]}
              </span>
            ) : (
              <button onClick={handleLogin} style={buttonStyle('#4f46e5')}>Login</button>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={buttonStyle(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#111827')}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px 0',
          borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          marginBottom: '24px',
        }}>
          <a href="/" style={{ color: darkMode ? '#93c5fd' : '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Home</a>
          <a href="/seo" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>🔍 SEO</a>
          <a href="/code" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>💻 Code</a>
          <a href="/email" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>✉️ Email</a>
          <a href="/translate" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>🔄 Translate</a>
          <a href="/blog-outline" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>📝 Outline</a>
          <a href="/blog" style={{ color: darkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}>📚 Blog</a>
          {user ? (
            <span style={{ color: darkMode ? '#93c5fd' : '#3b82f6', fontSize: '0.875rem' }}>
              Hi, {user.email?.split('@')[0]}
            </span>
          ) : (
            <button onClick={handleLogin} style={buttonStyle('#4f46e5')}>Login</button>
          )}
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              setMobileMenuOpen(false);
            }}
            style={buttonStyle(darkMode ? '#374151' : '#e5e7eb', darkMode ? '#f9fafb' : '#1f2937')}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      )}

      {/* बाकी UI (Input, Output, Feedback, Modal, Footer) */}
      {/* 👇 यह सब तुम्हारे मूल कोड से वैसा ही रहेगा */}
    </div>
  );
}
