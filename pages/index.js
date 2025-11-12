// pages/index.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

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

  // Dark mode sync
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.body.style.backgroundColor = isDark ? '#111827' : '#f9fafb';
    document.body.style.color = isDark ? '#f9fafb' : '#111827';
  }, []);

  // User & usage init - FIXED
  useEffect(() => {
    const init = async () => {
      // ✅ FIXED: Removed extra braces
      const { session } = await supabase.auth.getSession();
      setUser(session?.user || null);
      const count = parseInt(localStorage.getItem('guestUsage') || '0');
      setUsageCount(count);
    };
    init();
  }, []);

  // Client-side mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
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

      if (!user) {
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

  // ✅ FIXED: Correct destructuring
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
        comment: feedbackComment 
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

  // ... rest of the JSX remains the same
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 16px',
      paddingBottom: '40px',
    }}>
      {/* Your JSX content remains exactly the same */}
    </div>
  );
}
