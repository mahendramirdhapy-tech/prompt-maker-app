// components/Footer.js - WITH ADS SUPPORT
const Footer = ({ darkMode, isMobile, navigateTo, AdBanner }) => {
  const footerStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
    padding: isMobile ? '30px 16px 16px' : '40px 20px 20px',
    marginTop: '40px',
    borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
  };

  const footerGridStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: isMobile ? '20px' : '30px',
    marginBottom: '20px'
  };

  const linkButtonStyle = {
    color: darkMode ? '#cbd5e1' : '#64748b',
    cursor: 'pointer',
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    padding: '0',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  };

  return (
    <footer style={footerStyle}>
      {/* Ad before Footer Content */}
      {AdBanner && (
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto 30px auto',
          padding: isMobile ? '0 10px' : '0'
        }}>
          <AdBanner 
            adId="d63cce37510d96a8534132920fcceba7" 
            size={isMobile ? 'medium' : 'large'} 
            position="center"
          />
        </div>
      )}

      <div style={footerGridStyle}>
        
        {/* Company Info */}
        <div>
          <h3 style={{
            color: darkMode ? '#f8fafc' : '#1e293b',
            margin: '0 0 12px 0',
            fontSize: isMobile ? '1rem' : '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🚀</span> AI Prompt Maker
          </h3>
          <p style={{
            color: darkMode ? '#cbd5e1' : '#64748b',
            margin: '0 0 12px 0',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            lineHeight: '1.5'
          }}>
            Transform your ideas into perfect AI prompts with our advanced multi-model AI technology. 
            Free tool for creators, writers, and developers.
          </p>
          {/* Small ad in company info section */}
          {AdBanner && isMobile && (
            <div style={{ marginTop: '15px' }}>
              <AdBanner 
                adId="76390f46075c4f249d538d793d556a83" 
                size="small" 
                position="left"
              />
            </div>
          )}
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 style={{
            color: darkMode ? '#f8fafc' : '#1e293b',
            margin: '0 0 12px 0',
            fontSize: isMobile ? '1rem' : '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚡</span> Quick Links
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button 
              onClick={() => navigateTo('/')} 
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>🏠</span> Home
            </button>
            <button 
              onClick={() => navigateTo('/seo')} 
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>🔍</span> SEO Tools
            </button>
            <button 
              onClick={() => navigateTo('/code')} 
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>💻</span> Code Assistant
            </button>
            <button 
              onClick={() => navigateTo('/email')} 
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>✉️</span> Email Writer
            </button>
            <button 
              onClick={() => navigateTo('/translate')} 
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>🔄</span> Translator
            </button>
            <button 
              onClick={() => window.open('https://pixel-forge-kappa.vercel.app/', '_blank')} 
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>🎨</span> Pixel Forge
            </button>
          </div>
        </div>
        
        {/* Support */}
        <div>
          <h3 style={{
            color: darkMode ? '#f8fafc' : '#1e293b',
            margin: '0 0 12px 0',
            fontSize: isMobile ? '1rem' : '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🤝</span> Support
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button 
              onClick={() => navigateTo('/help')} 
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>❓</span> Help Center
            </button>
            <button 
              onClick={() => navigateTo('/contact')} 
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>📧</span> Contact Us
            </button>
            <button 
              onClick={() => navigateTo('/feedback')} 
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>💬</span> Feedback
            </button>
            <button 
              onClick={() => navigateTo('/blog')} 
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>📚</span> Blog
            </button>
          </div>
          {/* Small ad in support section for desktop */}
          {AdBanner && !isMobile && (
            <div style={{ marginTop: '20px' }}>
              <AdBanner 
                adId="76390f46075c4f249d538d793d556a83" 
                size="small" 
                position="left"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Section */}
      <div style={{
        borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        paddingTop: isMobile ? '15px' : '20px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '15px' : '20px',
          marginBottom: isMobile ? '12px' : '15px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => navigateTo('/privacy')} 
            style={{
              ...linkButtonStyle,
              fontSize: isMobile ? '0.75rem' : '0.8rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = darkMode ? '#94a3b8' : '#475569';
            }}
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => navigateTo('/terms')} 
            style={{
              ...linkButtonStyle,
              fontSize: isMobile ? '0.75rem' : '0.8rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = darkMode ? '#94a3b8' : '#475569';
            }}
          >
            Terms of Service
          </button>
          <button 
            onClick={() => navigateTo('/cookies')} 
            style={{
              ...linkButtonStyle,
              fontSize: isMobile ? '0.75rem' : '0.8rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = darkMode ? '#60a5fa' : '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = darkMode ? '#94a3b8' : '#475569';
            }}
          >
            Cookie Policy
          </button>
        </div>
        
        <p style={{ 
          margin: '0', 
          color: darkMode ? '#94a3b8' : '#475569',
          fontSize: isMobile ? '0.75rem' : '0.8rem',
          lineHeight: '1.5'
        }}>
          © 2024 AI Prompt Maker. All rights reserved.<br />
          Powered by multiple AI models • Made with ❤️ for creators worldwide
        </p>
        
        {/* Small ad at the very bottom */}
        {AdBanner && isMobile && (
          <div style={{ marginTop: '15px' }}>
            <AdBanner 
              adId="d63cce37510d96a8534132920fcceba7" 
              size="small" 
              position="center"
            />
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
