const Footer = ({ darkMode, isMobile, navigateTo }) => {
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
    marginBottom: '6px'
  };

  return (
    <footer style={footerStyle}>
      <div style={footerGridStyle}>
        
        {/* Company Info */}
        <div>
          <h3 style={{
            color: darkMode ? '#f8fafc' : '#1e293b',
            margin: '0 0 12px 0',
            fontSize: isMobile ? '1rem' : '1.1rem'
          }}>
            AI Prompt Maker
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
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 style={{
            color: darkMode ? '#f8fafc' : '#1e293b',
            margin: '0 0 12px 0',
            fontSize: isMobile ? '1rem' : '1.1rem'
          }}>
            Quick Links
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => navigateTo('/')} style={linkButtonStyle}>
              🏠 Home
            </button>
            <button onClick={() => navigateTo('/seo')} style={linkButtonStyle}>
              🔍 SEO Tools
            </button>
            <button onClick={() => navigateTo('/code')} style={linkButtonStyle}>
              💻 Code Assistant
            </button>
            <button onClick={() => navigateTo('/email')} style={linkButtonStyle}>
              ✉️ Email Writer
            </button>
            <button onClick={() => navigateTo('/translate')} style={linkButtonStyle}>
              🔄 Translator
            </button>
            <button onClick={() => window.open('https://pixel-forge-kappa.vercel.app/', '_blank')} style={linkButtonStyle}>
              🎨 Pixel Forge
            </button>
          </div>
        </div>
        
        {/* Support */}
        <div>
          <h3 style={{
            color: darkMode ? '#f8fafc' : '#1e293b',
            margin: '0 0 12px 0',
            fontSize: isMobile ? '1rem' : '1.1rem'
          }}>
            Support
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => navigateTo('/help')} style={linkButtonStyle}>
              ❓ Help Center
            </button>
            <button onClick={() => navigateTo('/contact')} style={linkButtonStyle}>
              📧 Contact Us
            </button>
            <button onClick={() => navigateTo('/feedback')} style={linkButtonStyle}>
              💬 Feedback
            </button>
            <button onClick={() => navigateTo('/blog')} style={linkButtonStyle}>
              📚 Blog
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div style={{
        borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        paddingTop: isMobile ? '15px' : '20px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '15px' : '20px',
          marginBottom: isMobile ? '12px' : '15px',
          flexWrap: 'wrap'
        }}>
          <button onClick={() => navigateTo('/privacy')} style={linkButtonStyle}>
            Privacy Policy
          </button>
          <button onClick={() => navigateTo('/terms')} style={linkButtonStyle}>
            Terms of Service
          </button>
          <button onClick={() => navigateTo('/cookies')} style={linkButtonStyle}>
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
      </div>
    </footer>
  );
};

export default Footer;
