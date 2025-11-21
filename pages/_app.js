// pages/_app.js
import Head from 'next/head';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Layout Component jo har page pe show hoga
function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check screen size
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Initialize dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const navigateTo = (path) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // STYLES
  const containerStyle = {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    maxWidth: '100%',
    margin: '0 auto',
    padding: isMobile ? '12px' : '24px',
    paddingBottom: isMobile ? '80px' : '40px',
    minHeight: '100vh',
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    boxSizing: 'border-box',
    position: 'relative',
    background: darkMode 
      ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '15px 0' : '20px 0',
    marginBottom: '20px',
    position: 'relative',
  };

  const logoStyle = {
    fontSize: isMobile ? '1.5rem' : '2rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    cursor: 'pointer'
  };

  const navButtonStyle = {
    color: darkMode ? '#cbd5e1' : '#64748b',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '10px 16px',
    transition: 'all 0.3s ease',
    borderRadius: '10px'
  };

  // Mobile Sidebar Styles
  const mobileSidebarStyle = {
    position: 'fixed',
    top: 0,
    left: mobileMenuOpen ? '0' : '-100%',
    width: '280px',
    height: '100vh',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  };

  const sidebarOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    display: mobileMenuOpen ? 'block' : 'none'
  };

  const footerStyle = {
    background: darkMode 
      ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: isMobile ? '40px 16px 20px' : '60px 20px 30px',
    marginTop: '60px',
    borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
  };

  return (
    <div style={containerStyle}>
      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobile && (
        <div 
          style={sidebarOverlayStyle}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      {isMobile && (
        <div style={mobileSidebarStyle}>
          {/* Sidebar Header */}
          <div style={{
            padding: '25px',
            borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ 
              margin: 0, 
              color: darkMode ? '#f8fafc' : '#1e293b',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800'
            }}>
              🚀 AI Tools
            </h3>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: darkMode ? '#94a3b8' : '#64748b',
              }}
            >
              ✕
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div style={{ padding: '20px 0', flex: 1 }}>
            {[
              { path: '/', label: '🏠 Home', icon: '🏠' },
              { path: '/seo', label: '🔍 SEO Tool', icon: '🔍' },
              { path: '/code', label: '💻 Code Assistant', icon: '💻' },
              { path: '/email', label: '✉️ Email Writer', icon: '✉️' },
              { path: '/translate', label: '🔄 Translator', icon: '🔄' },
              { path: '/audio', label: '🎵 Audio Tool', icon: '🎵' },
              { path: '/prompts', label: '📚 Prompt Library', icon: '📚' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  textDecoration: 'none',
                  border: 'none',
                  background: 'none',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div style={{
            padding: '25px',
            borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          }}>
            <button 
              onClick={toggleDarkMode} 
              style={{
                padding: '12px 20px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                width: '100%'
              }}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={headerStyle}>
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: darkMode ? '#f8fafc' : '#1e293b',
              zIndex: 100,
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            }}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}

        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginLeft: isMobile ? '50px' : '0'
        }}>
          <h1 style={logoStyle} onClick={() => navigateTo('/')}>
            AI Prompt Maker
          </h1>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {[
              { path: '/seo', label: '🔍 SEO', color: '#3b82f6' },
              { path: '/code', label: '💻 Code', color: '#10b981' },
              { path: '/email', label: '✉️ Email', color: '#ec4899' },
              { path: '/translate', label: '🔄 Translate', color: '#8b5cf6' },
              { path: '/audio', label: '🎵 Audio', color: '#f59e0b' },
              { path: '/prompts', label: '📚 Prompts', color: '#06b6d4' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                style={navButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = item.color;
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.label}
              </button>
            ))}
            
            <button onClick={toggleDarkMode} style={{
              background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '10px',
              borderRadius: '10px',
              transition: 'all 0.3s ease'
            }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </nav>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main>
        {children}
      </main>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: darkMode ? '#f8fafc' : '#1e293b',
            margin: '0 0 16px 0',
            fontSize: isMobile ? '1.2rem' : '1.3rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI Prompt Maker
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            {[
              { path: '/', label: 'Home' },
              { path: '/seo', label: 'SEO Tool' },
              { path: '/code', label: 'Code Assistant' },
              { path: '/email', label: 'Email Writer' },
              { path: '/translate', label: 'Translator' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                style={{
                  color: darkMode ? '#93c5fd' : '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  background: 'none',
                  border: 'none',
                  padding: '5px 10px',
                  fontWeight: '600',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <p style={{ 
            margin: '0', 
            color: darkMode ? '#94a3b8' : '#475569',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            lineHeight: '1.6'
          }}>
            © 2024 AI Prompt Maker. All rights reserved.<br />
            Powered by multiple AI models • Made with ❤️ for creators worldwide
          </p>
        </div>
      </footer>
    </div>
  );
}

// Main App Component
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Prompt Maker - Free AI Tools | Code Debugger, Translator, SEO Tools</title>
        <meta name="title" content="Prompt Maker - Free AI Tools | Code Debugger, Translator, SEO Tools" />
        <meta
          name="description"
          content="Free AI tools platform - AI Prompt Generator, Code Debugger, AI Translator, SEO Meta Tools. 100% Free, No Signup Required. Try Now!"
        />
        <meta name="keywords" content="ai prompt generator, free prompt maker, code debugger, ai translator, seo tools, free ai tools, no signup ai tools" />
        <meta name="author" content="Prompt Maker" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aipromptmaker.online/" />
        <meta property="og:title" content="Prompt Maker - Free AI Tools Platform" />
        <meta
          property="og:description"
          content="Free AI tools - Prompt Generator, Code Debugger, Translator, SEO Tools. No Signup Required."
        />
        <meta property="og:image" content="https://aipromptmaker.online/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://aipromptmaker.online/" />
        <meta property="twitter:title" content="Prompt Maker - Free AI Tools Platform" />
        <meta
          property="twitter:description"
          content="Free AI tools - Prompt Generator, Code Debugger, Translator, SEO Tools."
        />
        <meta property="twitter:image" content="https://aipromptmaker.online/og-image.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="FeI7rBqbWesNjgaCWozMEhBcFPU7EjubLYkWmS85vOI" />
        
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* ✅ AUTO ADS CODE */}
      <Script
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8739462043637379"
        crossOrigin="anonymous"
      />
      <Script
        id="google-auto-ads"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-8739462043637379",
              enable_page_level_ads: true
            });
          `,
        }}
      />

      {/* ✅ NEW GOOGLE TAG - UPDATED CODE */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=GTN-GL5G74"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GTN-GL5G74');
          `,
        }}
      />

      {/* Layout with Header and Footer */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
