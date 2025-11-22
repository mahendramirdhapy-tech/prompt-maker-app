// pages/website-builder.js - COMPLETE REACT COMPONENT
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const WebsiteBuilder = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Website builder states
  const [websiteType, setWebsiteType] = useState('business');
  const [websiteStyle, setWebsiteStyle] = useState('modern');
  const [colorScheme, setColorScheme] = useState('blue');
  const [pages, setPages] = useState(['home', 'about']);
  const [features, setFeatures] = useState(['responsive']);
  const [websiteDescription, setWebsiteDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Website types
  const WEBSITE_TYPES = [
    { value: 'business', label: 'Business Website', icon: '🏢' },
    { value: 'portfolio', label: 'Portfolio', icon: '💼' },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
    { value: 'blog', label: 'Blog', icon: '📝' },
    { value: 'landing', label: 'Landing Page', icon: '🚀' },
  ];

  const WEBSITE_STYLES = [
    { value: 'modern', label: 'Modern', icon: '🎨' },
    { value: 'minimal', label: 'Minimal', icon: '⚪' },
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'creative', label: 'Creative', icon: '✨' },
  ];

  const COLOR_SCHEMES = [
    { value: 'blue', label: 'Blue', color: '#3B82F6' },
    { value: 'green', label: 'Green', color: '#10B981' },
    { value: 'purple', label: 'Purple', color: '#8B5CF6' },
    { value: 'dark', label: 'Dark', color: '#1F2937' },
  ];

  const AVAILABLE_PAGES = [
    { value: 'home', label: 'Home' },
    { value: 'about', label: 'About' },
    { value: 'services', label: 'Services' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'blog', label: 'Blog' },
    { value: 'contact', label: 'Contact' },
  ];

  const AVAILABLE_FEATURES = [
    { value: 'responsive', label: 'Responsive Design' },
    { value: 'darkmode', label: 'Dark Mode' },
    { value: 'animations', label: 'Animations' },
    { value: 'contactform', label: 'Contact Form' },
    { value: 'gallery', label: 'Image Gallery' },
  ];

  const generateWebsite = async () => {
    if (!websiteDescription.trim()) {
      alert('Please describe your website requirements');
      return;
    }

    setLoading(true);
    try {
      // Simulate AI generation
      setTimeout(() => {
        const sampleCode = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${websiteDescription}</title>
    <style>
        /* Generated CSS for ${websiteDescription} */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f8fafc;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to ${websiteDescription}</h1>
        <p>This website was generated using AI Website Builder</p>
    </div>
</body>
</html>
        `;
        setGeneratedCode(sampleCode);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Generation error:', error);
      setLoading(false);
    }
  };

  // Styles
  const containerStyle = {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    minHeight: '100vh',
    padding: isMobile ? '20px' : '40px',
  };

  const cardStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: isMobile ? '20px' : '30px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const buttonStyle = (color = '#3B82F6') => ({
    backgroundColor: color,
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  });

  return (
    <>
      <Head>
        <title>AI Website Builder - Create Professional Websites</title>
        <meta name="description" content="Generate professional websites with AI" />
      </Head>

      <div style={containerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: isMobile ? '2rem' : '3rem',
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            🚀 AI Website Builder
          </h1>
          <p style={{ 
            color: darkMode ? '#cbd5e1' : '#64748b',
            fontSize: isMobile ? '1rem' : '1.2rem'
          }}>
            Create professional websites in minutes with AI
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* Configuration Side */}
          <div>
            <div style={cardStyle}>
              <h2 style={{ marginBottom: '20px' }}>⚙️ Website Configuration</h2>
              
              {/* Website Type */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
                  Website Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {WEBSITE_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setWebsiteType(type.value)}
                      style={{
                        ...buttonStyle(websiteType === type.value ? '#3B82F6' : (darkMode ? '#374151' : '#f3f4f6')),
                        padding: '15px 10px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Website Style */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
                  Design Style
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {WEBSITE_STYLES.map(style => (
                    <button
                      key={style.value}
                      onClick={() => setWebsiteStyle(style.value)}
                      style={{
                        ...buttonStyle(websiteStyle === style.value ? '#3B82F6' : (darkMode ? '#374151' : '#f3f4f6')),
                        padding: '15px 10px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{style.icon}</span>
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Scheme */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
                  Color Scheme
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {COLOR_SCHEMES.map(scheme => (
                    <button
                      key={scheme.value}
                      onClick={() => setColorScheme(scheme.value)}
                      style={{
                        backgroundColor: scheme.color,
                        border: colorScheme === scheme.value ? '3px solid white' : 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                      title={scheme.label}
                    />
                  ))}
                </div>
              </div>

              {/* Pages Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
                  Pages Needed
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {AVAILABLE_PAGES.map(page => (
                    <label key={page.value} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={pages.includes(page.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPages([...pages, page.value]);
                          } else {
                            setPages(pages.filter(p => p !== page.value));
                          }
                        }}
                      />
                      {page.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
                  Features
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                  {AVAILABLE_FEATURES.map(feature => (
                    <label key={feature.value} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={features.includes(feature.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFeatures([...features, feature.value]);
                          } else {
                            setFeatures(features.filter(f => f !== feature.value));
                          }
                        }}
                      />
                      {feature.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Input */}
            <div style={cardStyle}>
              <h3 style={{ marginBottom: '15px' }}>💬 Describe Your Website</h3>
              <textarea
                value={websiteDescription}
                onChange={(e) => setWebsiteDescription(e.target.value)}
                placeholder="Describe what you want your website to look like, what it should do, and any specific requirements..."
                rows="6"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: `1px solid ${darkMode ? '#374151' : '#d1d5db'}`,
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                  color: darkMode ? '#f8fafc' : '#1e293b',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
              
              <button
                onClick={generateWebsite}
                disabled={loading || !websiteDescription.trim()}
                style={{
                  ...buttonStyle(),
                  width: '100%',
                  marginTop: '15px',
                  opacity: (loading || !websiteDescription.trim()) ? 0.6 : 1
                }}
              >
                {loading ? '🔄 Generating...' : '✨ Generate Website'}
              </button>
            </div>
          </div>

          {/* Output Side */}
          <div>
            <div style={cardStyle}>
              <h2 style={{ marginBottom: '20px' }}>🎉 Generated Website</h2>
              
              {generatedCode ? (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginBottom: '15px',
                    flexWrap: 'wrap'
                  }}>
                    <button style={buttonStyle()} onClick={() => navigator.clipboard.writeText(generatedCode)}>
                      📋 Copy Code
                    </button>
                    <button style={buttonStyle('#10B981')} onClick={() => {
                      const blob = new Blob([generatedCode], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'website.html';
                      a.click();
                    }}>
                      💾 Download HTML
                    </button>
                  </div>
                  
                  <pre style={{
                    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                    padding: '20px',
                    borderRadius: '8px',
                    overflow: 'auto',
                    fontSize: '0.8rem',
                    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    maxHeight: '400px'
                  }}>
                    {generatedCode}
                  </pre>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: darkMode ? '#94a3b8' : '#6b7280'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌐</div>
                  <h3 style={{ marginBottom: '10px' }}>No Website Generated Yet</h3>
                  <p>Configure your website and click "Generate Website" to see the magic!</p>
                </div>
              )}
            </div>

            {/* Preview Info */}
            <div style={cardStyle}>
              <h3 style={{ marginBottom: '15px' }}>👁️ Live Preview</h3>
              <div style={{
                backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                border: `2px dashed ${darkMode ? '#374151' : '#d1d5db'}`,
                borderRadius: '8px',
                padding: '40px 20px',
                textAlign: 'center',
                color: darkMode ? '#94a3b8' : '#6b7280'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🖥️</div>
                <p>Live preview will appear here once you generate your website</p>
                <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                  The generated code includes HTML, CSS, and JavaScript
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ✅ This is the default export that Next.js requires
export default WebsiteBuilder;
