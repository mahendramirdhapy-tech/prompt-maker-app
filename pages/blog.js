// pages/blog.js
import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');

  const articles = [
    {
      title: "5 Best Practices for Writing AI Prompts in Hindi",
      excerpt: "Learn how to craft effective prompts in Hindi for better AI responses using free models like Llama and Mistral.",
      slug: "hindi-ai-prompt-tips",
      date: "10 November 2025",
      category: "Hindi Guide",
      readTime: "5 min read",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi60hbLdT20bwH998Y9gpoqtPmZ6KCN93LFbpZEsrnIxtD7Pwv6QI64nS1Kowb3D8gWYH0eTZioJgkDr07nlth4z_c4QIGHJNPZOq-krTqm9rIZYSBEG8Iw8XSs-hOV7wY3lnljO5WICs4wCr5RXGdFTQU88rdO-tKGArdVoTqrfywps8UW8QyHPac9IpOp/s1024/hindi-prompts.png"
    },
    {
      title: "How to Generate Coding Prompts That Actually Work",
      excerpt: "Stop getting vague code! Here's how to write precise prompts for debugging, automation, and app development.",
      slug: "coding-prompt-guide",
      date: "9 November 2025",
      category: "Programming",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop"
    },
    {
      title: "Why Free AI Models Are Enough for Prompt Engineering",
      excerpt: "You don't need GPT-4! Free models like Gemma, Llama 3.2, and Mistral can generate excellent prompts with the right technique.",
      slug: "free-models-prompt-engineering",
      date: "8 November 2025",
      category: "AI Models",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"
    },
    {
      title: "Advanced Prompt Engineering Techniques for Developers",
      excerpt: "Master chain-of-thought, few-shot learning, and other advanced techniques to improve AI responses significantly.",
      slug: "advanced-prompt-techniques",
      date: "7 November 2025",
      category: "Advanced",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop"
    },
    {
      title: "Hindi vs English: Which Language Works Better for AI Prompts?",
      excerpt: "Comparative analysis of prompt effectiveness in different languages with practical examples and benchmarks.",
      slug: "hindi-english-prompt-comparison",
      date: "6 November 2025",
      category: "Hindi Guide",
      readTime: "6 min read",
      image: "https://unsplash.com/photos/man-using-laptop-between-eyeglasses-and-iphone-uTi9PhSJPm8"
    },
    {
      title: "10 Common Prompt Writing Mistakes and How to Avoid Them",
      excerpt: "Discover the most frequent errors people make when writing AI prompts and learn how to fix them.",
      slug: "common-prompt-mistakes",
      date: "5 November 2025",
      category: "Beginner",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop"
    },
    {
      title: "How to Use AI Prompts for Content Writing and Blogging",
      excerpt: "Generate high-quality blog posts, articles, and social media content using optimized AI prompts.",
      slug: "content-writing-prompts",
      date: "4 November 2025",
      category: "Content Writing",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=300&fit=crop"
    },
    {
      title: "Prompt Engineering for Business: Increase Productivity 3x",
      excerpt: "Implement AI prompts in your business workflow to automate tasks and boost team productivity.",
      slug: "business-prompt-engineering",
      date: "3 November 2025",
      category: "Business",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop"
    },
    {
      title: "Free AI Tools for Prompt Engineering: Complete Guide 2025",
      excerpt: "Comprehensive list of free AI tools and platforms for effective prompt engineering without spending money.",
      slug: "free-ai-tools-guide",
      date: "2 November 2025",
      category: "Tools",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop"
    },
    {
      title: "How to Write Prompts for Image Generation AI (DALL-E, Midjourney)",
      excerpt: "Learn the art of writing effective prompts for AI image generators to get exactly what you imagine.",
      slug: "image-generation-prompts",
      date: "1 November 2025",
      category: "Image AI",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=300&fit=crop"
    },
    {
      title: "ChatGPT Prompt Engineering: Secret Tips from Experts",
      excerpt: "Professional tips and hidden techniques to get better results from ChatGPT and similar models.",
      slug: "chatgpt-secret-tips",
      date: "31 October 2025",
      category: "ChatGPT",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"
    },
    {
      title: "Building Custom AI Assistants with Effective Prompt Design",
      excerpt: "Create specialized AI assistants for different tasks using systematic prompt design approaches.",
      slug: "custom-ai-assistants",
      date: "30 October 2025",
      category: "Advanced",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=500&h=300&fit=crop"
    },
    {
      title: "Hindi Technical Terms for AI Prompt Engineering",
      excerpt: "Essential Hindi vocabulary and technical terms you need to know for effective prompt writing.",
      slug: "hindi-technical-terms",
      date: "29 October 2025",
      category: "Hindi Guide",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=500&h=300&fit=crop"
    },
    {
      title: "Prompt Templates for Daily Use: Copy-Paste Ready",
      excerpt: "Collection of ready-to-use prompt templates for emails, content creation, coding, and analysis.",
      slug: "prompt-templates",
      date: "28 October 2025",
      category: "Templates",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=500&h=300&fit=crop"
    },
    {
      title: "Measuring Prompt Effectiveness: Metrics and Analysis",
      excerpt: "How to evaluate and measure the quality of your AI prompts using quantitative and qualitative methods.",
      slug: "measuring-prompt-effectiveness",
      date: "27 October 2025",
      category: "Advanced",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop"
    },
    {
      title: "AI Prompt Security: Protecting Your Data and Privacy",
      excerpt: "Important security considerations when using AI prompts to protect sensitive information and maintain privacy.",
      slug: "ai-prompt-security",
      date: "26 October 2025",
      category: "Security",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500&h=300&fit=crop"
    },
    {
      title: "Multilingual Prompt Engineering: Beyond English and Hindi",
      excerpt: "Techniques for writing effective prompts in multiple languages including regional Indian languages.",
      slug: "multilingual-prompt-engineering",
      date: "25 October 2025",
      category: "Multilingual",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1529254479751-fbacb4c3b7d7?w=500&h=300&fit=crop"
    },
    {
      title: "Automating Workflows with AI Prompts: Practical Examples",
      excerpt: "Step-by-step guide to automating business and personal workflows using AI prompt chains.",
      slug: "automating-workflows-prompts",
      date: "24 October 2025",
      category: "Automation",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
    },
    {
      title: "Educational Applications of AI Prompts for Students and Teachers",
      excerpt: "How students and educators can use AI prompts for learning, teaching, and academic research.",
      slug: "educational-ai-prompts",
      date: "23 October 2025",
      category: "Education",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=300&fit=crop"
    },
    {
      title: "The Psychology Behind Effective AI Prompt Design",
      excerpt: "Understanding cognitive principles and psychological factors that make some prompts work better than others.",
      slug: "psychology-prompt-design",
      date: "22 October 2025",
      category: "Psychology",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop"
    },
    {
      title: "Real-World Case Studies: Successful Prompt Engineering Examples",
      excerpt: "Analysis of real-world successful prompt engineering implementations across different industries.",
      slug: "prompt-engineering-case-studies",
      date: "21 October 2025",
      category: "Case Studies",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop"
    },
    {
      title: "Mobile Apps for Prompt Engineering On The Go",
      excerpt: "Best mobile applications for creating, testing, and managing AI prompts from your smartphone.",
      slug: "mobile-apps-prompt-engineering",
      date: "20 October 2025",
      category: "Mobile",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop"
    },
    {
      title: "Future of Prompt Engineering: Trends and Predictions for 2026",
      excerpt: "Expert predictions on where prompt engineering is heading and how to prepare for future developments.",
      slug: "future-prompt-engineering",
      date: "19 October 2025",
      category: "Future",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop"
    },
    {
      title: "Debugging AI Responses: How to Fix Poor Outputs",
      excerpt: "Systematic approach to identifying why AI gives poor responses and how to fix your prompts.",
      slug: "debugging-ai-responses",
      date: "18 October 2025",
      category: "Debugging",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop"
    },
    {
      title: "Community Resources for Prompt Engineering Learners",
      excerpt: "Best online communities, forums, and resources to learn prompt engineering and stay updated.",
      slug: "prompt-engineering-community",
      date: "17 October 2025",
      category: "Resources",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop"
    }
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(articles.map(article => article.category))];

  return (
    <>
      <Head>
        <title>AI Prompt Engineering Blog - Complete Guides & Tutorials 2025</title>
        <meta
          name="description"
          content="Master AI prompt engineering with our complete blog. Free tutorials in Hindi & English for developers, writers, and businesses. Learn ChatGPT, Llama, Mistral prompt techniques."
        />
        <meta name="keywords" content="AI prompt engineering, ChatGPT prompts, Hindi AI guide, free AI tools, prompt writing, AI tutorial, machine learning prompts, Llama prompts, Mistral AI" />
        <meta name="author" content="Prompt Maker" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="AI Prompt Engineering Blog - Complete Guides & Tutorials" />
        <meta property="og:description" content="Free AI prompt engineering tutorials in Hindi and English for developers and writers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/blog" />
        <link rel="canonical" href="https://yourdomain.com/blog" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "AI Prompt Engineering Blog",
              "description": "Free AI prompt engineering tutorials and guides",
              "url": "https://yourdomain.com/blog",
              "publisher": {
                "@type": "Organization",
                "name": "Prompt Maker"
              }
            })
          }}
        />
      </Head>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1rem',
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.6'
      }}>
        {/* Header Section */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            color: '#2563eb', 
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🚀 AI Prompt Engineering Blog
          </h1>
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '2rem',
            fontSize: '1.25rem'
          }}>
            Free guides to help you write better prompts — in <strong>English</strong> and <strong>हिंदी</strong>
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px',
                border: '2px solid #e5e7eb',
                borderRadius: '50px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(category)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        {/* AdSense Banner */}
        <div style={{ 
          textAlign: 'center', 
          margin: '2rem 0',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '8px'
        }}>
          {/* AdSense Code Here */}
          <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            Advertisement Space
          </div>
        </div>

        {/* Articles Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {filteredArticles.map((article, i) => (
            <article
              key={i}
              style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
              }}
            >
              {/* Article Image with Next.js Image component */}
              <div style={{
                width: '100%',
                height: '200px',
                borderRadius: '12px',
                marginBottom: '1rem',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    style={{ 
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  style={{
                    display: article.image ? 'none' : 'flex',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f3f4f6',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    fontSize: '14px'
                  }}
                >
                  🖼️ Image Loading...
                </div>
              </div>

              {/* Article Meta */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <span style={{ 
                  padding: '4px 12px', 
                  backgroundColor: '#dbeafe', 
                  color: '#2563eb',
                  borderRadius: '20px',
                  fontWeight: '600'
                }}>
                  {article.category}
                </span>
                <div style={{ color: '#9ca3af' }}>
                  <span>{article.date}</span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Article Content */}
              <h2 style={{ 
                fontSize: '1.375rem', 
                fontWeight: '700', 
                color: '#111827',
                marginBottom: '0.75rem',
                lineHeight: '1.4'
              }}>
                {article.title}
              </h2>
              <p style={{ 
                color: '#4b5563', 
                marginBottom: '1.25rem',
                lineHeight: '1.6'
              }}>
                {article.excerpt}
              </p>
              <a
                href={`/blog/${article.slug}`}
                style={{
                  color: '#2563eb',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.color = '#2563eb'}
              >
                Read Complete Guide 
                <span style={{ marginLeft: '8px', transition: 'transform 0.3s ease' }}>→</span>
              </a>
            </article>
          ))}
        </div>

        {/* Mid-page AdSense */}
        <div style={{ 
          textAlign: 'center', 
          margin: '3rem 0',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '8px'
        }}>
          {/* AdSense Code Here */}
          <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            Advertisement Space
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          backgroundColor: '#f0f9ff', 
          borderRadius: '16px', 
          textAlign: 'center',
          border: '2px solid #bae6fd'
        }}>
          <h3 style={{ 
            fontWeight: '700', 
            marginBottom: '0.75rem',
            fontSize: '1.5rem',
            color: '#0369a1'
          }}>
            ✨ Try Our Free Prompt Generator
          </h3>
          <p style={{ 
            color: '#374151', 
            marginBottom: '1.5rem',
            fontSize: '1.125rem'
          }}>
            Turn your rough ideas into powerful AI prompts — in seconds!
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              backgroundColor: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1.125rem',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Generate Prompt Now
          </a>
        </div>

        {/* Bottom AdSense */}
        <div style={{ 
          textAlign: 'center', 
          margin: '3rem 0 1rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '8px'
        }}>
          {/* AdSense Code Here */}
          <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            Advertisement Space
          </div>
        </div>
      </div>
    </>
  );
}
