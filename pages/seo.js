// pages/seo.js
import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function SeoGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Please enter a topic or title to generate SEO description');
      return;
    }
    
    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: `Generate a compelling SEO meta description (150-160 characters) for: "${input}". Make it engaging, include relevant keywords, and encourage clicks. Focus on benefits and value proposition.`,
          language: 'English',
          tone: 'Professional',
          maxTokens: 100,
          type: 'prompt'
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        const description = data.prompt || data.result || '';
        setOutput(description);
        setCharCount(description.length);
      } else {
        alert('❌ ' + (data.error || 'Failed to generate SEO description'));
      }
    } catch (e) {
      console.error('SEO generation error:', e);
      alert('⚠️ ' + (e.message || 'Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => {
    setInput('');
    setOutput('');
    setCharCount(0);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('✅ SEO description copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Layout>
      <Head>
        <title>SEO Meta Description Generator | Free AI-Powered Tool & Complete Guide</title>
        <meta 
          name="description" 
          content="Generate compelling SEO meta descriptions instantly. Free AI-powered tool plus complete guide to writing meta descriptions that boost click-through rates and rankings." 
        />
        <meta 
          name="keywords" 
          content="seo meta description generator, meta description creator, seo tool, search engine optimization, meta tag generator, free seo tool, seo best practices, meta description length" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="AI Prompt Maker" />
        <meta property="og:title" content="SEO Meta Description Generator & Complete Guide" />
        <meta property="og:description" content="Free AI-powered SEO meta description generator with comprehensive guide to writing effective meta descriptions." />
      </Head>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '2rem auto', 
        padding: '0 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>

        {/* Tool Section */}
        <div style={{ 
          padding: '2rem',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          marginBottom: '3rem'
        }}>

          <h1 style={{ 
            textAlign: 'center', 
            color: '#1e293b',
            marginBottom: '0.5rem',
            fontSize: '2.25rem',
            fontWeight: '700'
          }}>
            🔍 SEO Meta Description Generator
          </h1>
          
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '1.125rem',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Create compelling, search-engine-optimized meta descriptions that boost your click-through rates
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your blog title, product name, or topic..."
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  fontSize: '16px', 
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  paddingRight: '40px'
                }}
                required
                aria-label="Enter topic for SEO description"
              />
              {input && (
                <button
                  type="button"
                  onClick={clearInput}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  aria-label="Clear input"
                >
                  ✕
                </button>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{ 
                width: '100%', 
                padding: '16px', 
                backgroundColor: loading ? '#94a3b8' : '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              aria-label={loading ? 'Generating SEO description...' : 'Generate SEO description'}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Generating...
                </>
              ) : (
                <>✨ Generate SEO Description</>
              )}
            </button>
          </form>

          {output && (
            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    color: '#1e293b',
                    fontSize: '1.25rem'
                  }}>
                    Your SEO Meta Description:
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: charCount > 160 ? '#dc2626' : charCount >= 150 ? '#16a34a' : '#64748b'
                  }}>
                    <span>{charCount} characters</span>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: charCount > 160 ? '#dc2626' : charCount >= 150 ? '#16a34a' : '#f59e0b'
                    }}></span>
                    <span>
                      {charCount > 160 ? 'Too long (ideal: 150-160)' : 
                       charCount >= 150 ? 'Perfect length!' : 'Too short (aim for 150-160)'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#0d9488',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  aria-label="Copy SEO description to clipboard"
                >
                  📋 Copy
                </button>
              </div>
              
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                backgroundColor: '#f8fafc', 
                padding: '16px', 
                borderRadius: '6px',
                fontSize: '16px',
                lineHeight: '1.5',
                borderLeft: '4px solid #2563eb'
              }}>
                {output}
              </div>
            </div>
          )}

          {/* SEO Tips Section */}
          <div style={{ 
            marginTop: '3rem', 
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ 
              color: '#1e293b', 
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              💡 SEO Best Practices
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f0f9ff',
                borderRadius: '6px',
                borderLeft: '4px solid #0ea5e9'
              }}>
                <strong>Ideal Length:</strong> 150-160 characters for optimal display in search results
              </div>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                borderLeft: '4px solid #22c55e'
              }}>
                <strong>Include Keywords:</strong> Place primary keywords naturally in the description
              </div>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fef7ed',
                borderRadius: '6px',
                borderLeft: '4px solid #f59e0b'
              }}>
                <strong>Call to Action:</strong> Use action-oriented language to encourage clicks
              </div>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                borderRadius: '6px',
                borderLeft: '4px solid #ef4444'
              }}>
                <strong>Avoid Duplication:</strong> Create unique descriptions for each page
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: '#1e293b',
            marginBottom: '2rem',
            textAlign: 'center',
            fontWeight: '700'
          }}>
            The Complete Guide to Writing Effective SEO Meta Descriptions
          </h2>

          {/* Introduction */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            marginBottom: '2rem',
            borderLeft: '4px solid #0ea5e9'
          }}>
            <h3 style={{ color: '#0369a1', marginTop: 0 }}>📖 Introduction</h3>
            <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
              Meta descriptions are one of the most critical yet often overlooked elements of SEO. 
              While they don't directly impact search rankings, they significantly influence click-through rates (CTR), 
              which indirectly affects your SEO performance. A compelling meta description can be the difference between 
              a user clicking your result or your competitor's.
            </p>
            <p style={{ lineHeight: '1.7' }}>
              In this comprehensive guide, we'll explore everything you need to know about creating meta descriptions 
              that not only meet technical requirements but also drive real results for your website.
            </p>
          </div>

          {/* What are Meta Descriptions */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1rem' }}>
              🤔 What Exactly Are Meta Descriptions?
            </h3>
            <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
              A meta description is an HTML attribute that provides a brief summary of a web page. 
              Search engines often display meta descriptions in search results below the page title. 
              While Google may sometimes rewrite meta descriptions, providing a well-crafted one gives 
              you control over your message in most cases.
            </p>
            
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '1rem'
            }}>
              <h4 style={{ color: '#475569', marginTop: 0 }}>💻 Technical Structure:</h4>
              <pre style={{ 
                backgroundColor: '#1e293b', 
                color: '#e2e8f0', 
                padding: '1rem', 
                borderRadius: '6px',
                overflowX: 'auto',
                fontSize: '14px'
              }}>
{`<meta name="description" content="Your compelling description 
that encourages users to click through to your website. 
Keep it between 150-160 characters for optimal display.">`}
              </pre>
            </div>
          </div>

          {/* Why Meta Descriptions Matter */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1rem' }}>
              🎯 Why Meta Descriptions Are Crucial for SEO Success
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <h4 style={{ color: '#166534', marginTop: 0 }}>✅ Increased Click-Through Rates</h4>
                <p style={{ lineHeight: '1.6', margin: 0 }}>
                  Well-written meta descriptions can improve CTR by 5-15%. Higher CTR signals to search engines 
                  that your content is relevant and valuable, potentially boosting rankings over time.
                </p>
              </div>
              
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#fef7ed',
                borderRadius: '8px',
                border: '1px solid #fed7aa'
              }}>
                <h4 style={{ color: '#9a3412', marginTop: 0 }}>🔍 User Intent Matching</h4>
                <p style={{ lineHeight: '1.6', margin: 0 }}>
                  Meta descriptions help users understand if your page matches their search intent, 
                  reducing bounce rates and improving user experience metrics.
                </p>
              </div>
              
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <h4 style={{ color: '#0c4a6e', marginTop: 0 }}>🎪 Brand Messaging Control</h4>
                <p style={{ lineHeight: '1.6', margin: 0 }}>
                  You control the narrative and can include brand messaging, unique selling propositions, 
                  and calls to action that differentiate you from competitors.
                </p>
              </div>
            </div>
          </div>

          {/* Best Practices Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              🏆 Meta Description Best Practices: Actionable Strategies
            </h3>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#475569', marginBottom: '1rem' }}>1. Optimal Length and Formatting</h4>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                borderLeft: '4px solid #3b82f6'
              }}>
                <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
                  <strong>Character Count:</strong> Aim for 150-160 characters. While Google may display up to 320 characters in some cases, 
                  the safe range ensures your description won't be truncated in most search results.
                </p>
                <p style={{ lineHeight: '1.7' }}>
                  <strong>Readability:</strong> Write in complete sentences with proper punctuation. Avoid keyword stuffing and 
                  ensure the description flows naturally for human readers.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#475569', marginBottom: '1rem' }}>2. Keyword Optimization Strategy</h4>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                borderLeft: '4px solid #10b981'
              }}>
                <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
                  <strong>Primary Keyword Placement:</strong> Include your main keyword naturally within the first 100 characters. 
                  Google may bold matching search terms, making your result more visually appealing.
                </p>
                <p style={{ lineHeight: '1.7' }}>
                  <strong>Secondary Keywords:</strong> Incorporate related terms and synonyms to capture broader search intent 
                  while maintaining readability.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#475569', marginBottom: '1rem' }}>3. Compelling Call-to-Action (CTA)</h4>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                borderLeft: '4px solid #f59e0b'
              }}>
                <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
                  <strong>Action-Oriented Language:</strong> Use verbs that encourage clicks like "Discover," "Learn," "Explore," 
                  "Get," or "Find." Create a sense of urgency or value proposition.
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '6px' }}>
                    <strong style={{ color: '#047857' }}>✅ Good Example:</strong>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '14px' }}>"Discover 10 proven strategies to boost your website traffic. Get step-by-step guidance and actionable tips."</p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '6px' }}>
                    <strong style={{ color: '#dc2626' }}>❌ Poor Example:</strong>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '14px' }}>"This page discusses strategies for website traffic. You can find information here."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Mistakes to Avoid */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              ⚠️ Common Meta Description Mistakes to Avoid
            </h3>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#fef2f2',
              borderRadius: '8px',
              borderLeft: '4px solid #ef4444'
            }}>
              <ul style={{ lineHeight: '1.7', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Duplicate Descriptions:</strong> Every page should have a unique meta description. 
                  Duplicates confuse search engines and users.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Keyword Stuffing:</strong> Avoid repetitive keyword usage that creates unnatural, spammy-sounding text.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Being Too Vague:</strong> Generic descriptions like "Welcome to our website" provide no value 
                  and won't encourage clicks.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Ignoring User Intent:</strong> Match the description to what users are actually searching for, 
                  not just what you want to promote.
                </li>
                <li>
                  <strong>Forgetting Mobile Users:</strong> Test how your descriptions appear on mobile devices, 
                  where character display may differ.
                </li>
              </ul>
            </div>
          </div>

          {/* Advanced Strategies */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              🚀 Advanced Meta Description Strategies
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <h4 style={{ color: '#0c4a6e', marginTop: 0 }}>📊 Schema Markup Integration</h4>
                <p style={{ lineHeight: '1.6' }}>
                  Combine meta descriptions with structured data to enhance rich snippets. 
                  While meta descriptions handle the text, schema markup can add star ratings, 
                  product prices, or event dates to your search results.
                </p>
              </div>
              
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#faf5ff',
                borderRadius: '8px',
                border: '1px solid #e9d5ff'
              }}>
                <h4 style={{ color: '#6b21a8', marginTop: 0 }}>🎯 Dynamic Descriptions</h4>
                <p style={{ lineHeight: '1.6' }}>
                  For e-commerce sites or large directories, use dynamic meta descriptions 
                  that include product names, categories, or location-specific information 
                  while maintaining consistent quality.
                </p>
              </div>
            </div>
          </div>

          {/* Industry-Specific Examples */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              🏢 Industry-Specific Meta Description Examples
            </h3>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#475569' }}>📝 Blog Content Example</h4>
                <p style={{ 
                  backgroundColor: '#f1f5f9', 
                  padding: '1rem', 
                  borderRadius: '6px',
                  borderLeft: '4px solid #64748b',
                  margin: 0
                }}>
                  "Learn how to create effective SEO meta descriptions that boost click-through rates. 
                  Get proven formulas, best practices, and avoid common mistakes. Start optimizing today!"
                </p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0.5rem 0 0 0' }}>
                  <strong>Analysis:</strong> Includes primary keyword "SEO meta descriptions," addresses user pain points, 
                  and provides clear value proposition.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#475569' }}>🛒 E-commerce Product Example</h4>
                <p style={{ 
                  backgroundColor: '#f1f5f9', 
                  padding: '1rem', 
                  borderRadius: '6px',
                  borderLeft: '4px solid #64748b',
                  margin: 0
                }}>
                  "Buy the latest wireless headphones with noise cancellation. Free shipping & 30-day returns. 
                  Compare features, read reviews, and find the perfect audio solution for your needs."
                </p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0.5rem 0 0 0' }}>
                  <strong>Analysis:</strong> Highlights key features, includes purchase incentives, and addresses common customer concerns.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#475569' }}>🏢 Service Business Example</h4>
                <p style={{ 
                  backgroundColor: '#f1f5f9', 
                  padding: '1rem', 
                  borderRadius: '6px',
                  borderLeft: '4px solid #64748b',
                  margin: 0
                }}>
                  "Professional web design services for small businesses. Responsive, SEO-optimized websites 
                  that convert visitors into customers. Get your free consultation and quote today."
                </p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0.5rem 0 0 0' }}>
                  <strong>Analysis:</strong> Targets specific audience, highlights benefits, includes clear call-to-action with low barrier.
                </p>
              </div>
            </div>
          </div>

          {/* Testing and Optimization */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              🔧 Testing and Optimizing Your Meta Descriptions
            </h3>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <h4 style={{ color: '#166534', marginTop: 0 }}>✅ A/B Testing Framework</h4>
              <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
                While you can't directly A/B test meta descriptions in Google Search Console, you can:
              </p>
              <ul style={{ lineHeight: '1.7', paddingLeft: '1.5rem' }}>
                <li>Monitor CTR changes in Google Search Console after updating descriptions</li>
                <li>Test different approaches on similar pages and compare performance</li>
                <li>Use tools like our generator above to create multiple options and choose the most compelling</li>
                <li>Analyze competitor descriptions that rank well for inspiration</li>
              </ul>
            </div>
          </div>

          {/* Conclusion */}
          <div style={{
            padding: '2rem',
            backgroundColor: '#fef7ed',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #fed7aa'
          }}>
            <h3 style={{ color: '#9a3412', marginTop: 0 }}>🎉 Start Optimizing Today</h3>
            <p style={{ lineHeight: '1.7', fontSize: '1.125rem' }}>
              Effective meta descriptions are a powerful tool in your SEO arsenal. While they require careful crafting, 
              the investment pays off in higher click-through rates, better qualified traffic, and improved user engagement. 
              Use the generator above to create compelling descriptions, then apply the strategies in this guide to maximize your results.
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            div {
              padding: 1rem !important;
            }
            
            h1 {
              font-size: 1.75rem !important;
            }
            
            h2 {
              font-size: 1.5rem !important;
            }
            
            h3 {
              font-size: 1.25rem !important;
            }
          }

          @media (max-width: 480px) {
            .grid-container {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}
