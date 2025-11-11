// pages/index.js
import { useState, useEffect } from 'react';

// Predefined templates
const TEMPLATES = [
  { label: 'Custom Idea', value: '' },
  { label: 'Blog Introduction', value: 'Write a compelling intro for a blog about' },
  { label: 'Python Code Debugger', value: 'Debug this Python code:' },
  { label: 'Instagram Caption', value: 'Write a catchy Instagram caption for a photo of' },
  { label: 'Story Starter', value: 'Write the first paragraph of a short story about' },
  { label: 'Email Draft', value: 'Draft a professional email about' },
];

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usedModel, setUsedModel] = useState('');
  const [language, setLanguage] = useState('English');
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [template, setTemplate] = useState('');

  // Load history & theme from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptHistory');
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setHistory(savedHistory ? JSON.parse(savedHistory) : []);
    setDarkMode(savedDark);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleTemplateChange = (e) => {
    const val = e.target.value;
    setTemplate(val);
    if (val) {
      setInput(val + ' ');
    } else {
      setInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');
    setUsedModel('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: input, language }),
      });

      const data = await res.json();

      if (data.success) {
        setOutput(data.prompt);
        setUsedModel(data.modelUsed);

        // Save to history
        const newEntry = {
          id: Date.now(),
          input: input.trim(),
          output: data.prompt,
          language: data.language,
          model: data.modelUsed,
          timestamp: new Date().toISOString(),
        };
        const updatedHistory = [newEntry, ...history.slice(0, 9)]; // Keep last 10
        setHistory(updatedHistory);
        localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));
      } else {
        alert('❌ ' + (data.error || 'Failed to generate prompt.'));
      }
    } catch (err) {
      console.error(err);
      alert('⚠️ Network error.');
    } finally {
      setLoading(false);
    }
  };

  const sharePrompt = () => {
    if (!output) return;
    const text = encodeURIComponent(output);
    const url = `https://prompt-maker-app.vercel.app`;
    
    // Try Web Share API (mobile/desktop modern browsers)
    if (navigator.share) {
      navigator.share({
        title: 'AI Prompt',
        text: output,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: Twitter & WhatsApp
      const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
      const whatsappUrl = `https://wa.me/?text=${text}`;
      alert('Choose: [1] Twitter, [2] WhatsApp');
      // Better: show buttons, but for simplicity, opening Twitter
      window.open(twitterUrl, '_blank');
    }
  };

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      setHistory([]);
      localStorage.removeItem('promptHistory');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">🤖 AI Prompt Maker</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Free models • Auto fallback • Save & share prompts
        </p>

        {/* Template Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Prompt Template</label>
          <select
            value={template}
            onChange={handleTemplateChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {TEMPLATES.map((t) => (
              <option key={t.value || 'custom'} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language Toggle */}
        <div className="mb-4 flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="lang"
              checked={language === 'English'}
              onChange={() => setLanguage('English')}
              className="mr-2"
            />
            English
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="lang"
              checked={language === 'Hindi'}
              onChange={() => setLanguage('Hindi')}
              className="mr-2"
            />
            हिंदी
          </label>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your idea..."
            rows="4"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium ${
              loading
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? '⚙️ Generating...' : '✨ Generate Optimized Prompt'}
          </button>
        </form>

        {/* Output */}
        {output && (
          <div className="mb-8 p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold">✅ Your AI Prompt:</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  📋 Copy
                </button>
                <button
                  onClick={sharePrompt}
                  className="text-sm bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                >
                  📤 Share
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap break-words bg-gray-100 dark:bg-gray-900 p-3 rounded-md border">
              {output}
            </pre>
            {usedModel && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Model: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{usedModel}</code>
              </p>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">📜 Recent Prompts</h3>
              <button
                onClick={clearHistory}
                className="text-sm text-red-500 hover:underline"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                  onClick={() => {
                    setInput(item.input);
                    setOutput(item.output);
                    setUsedModel(item.model);
                    setLanguage(item.language);
                  }}
                >
                  <p className="font-medium truncate">{item.input}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(item.timestamp).toLocaleString()} • {item.language}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          🔒 No data stored on server • Powered by OpenRouter (free tier)
        </footer>
      </div>
    </div>
  );
}
