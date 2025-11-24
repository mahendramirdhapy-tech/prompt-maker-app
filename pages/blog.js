// pages/blog.js
import Head from 'next/head';
import Layout from '../components/Layout';
export default function Blog() {
  const articles = [
    {
      title: "5 Best Practices for Writing AI Prompts in Hindi",
      excerpt: "Learn how to craft effective prompts in Hindi for better AI responses using free models like Llama and Mistral.",
      slug: "hindi-ai-prompt-tips",
      date: "10 November 2025",
    },
    {
      title: "How to Generate Coding Prompts That Actually Work",
      excerpt: "Stop getting vague code! Here’s how to write precise prompts for debugging, automation, and app development.",
      slug: "coding-prompt-guide",
      date: "9 November 2025",
    },
    {
      title: "Why Free AI Models Are Enough for Prompt Engineering",
      excerpt: "You don’t need GPT-4! Free models like Gemma, Llama 3.2, and Mistral can generate excellent prompts with the right technique.",
      slug: "free-models-prompt-engineering",
      date: "8 November 2025",
    },
  ];

  return (
    <>
      <Head>
        <title>AI Prompt Guides & Tutorials | Prompt Maker Blog</title>
        <meta
          name="description"
          content="Learn how to write better AI prompts with free tools. Tutorials in Hindi & English for developers, writers, and marketers."
        />
        <meta name="keywords" content="ai prompt tutorial, how to write ai prompts, hindi prompt guide, free ai tool blog" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#2563eb', marginBottom: '1rem' }}>
          📚 Prompt Engineering Blog
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Free guides to help you write better prompts — in <strong>English</strong> and <strong>हिंदी</strong>.
        </p>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {articles.map((article, i) => (
            <div
              key={i}
              style={{
                padding: '1.25rem',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                  {article.title}
                </h2>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{article.date}</span>
              </div>
              <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{article.excerpt}</p>
              <a
                href={`/blog/${article.slug}`}
                style={{
                  color: '#2563eb',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                Read Guide →
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>✨ Try Our Free Prompt Generator</h3>
          <p style={{ color: '#374151', marginBottom: '1rem' }}>
            Turn your rough ideas into powerful AI prompts — in seconds!
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '8px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
            }}
          >
            Generate Prompt Now
          </a>
        </div>
      </div>
    </>
  );
}
