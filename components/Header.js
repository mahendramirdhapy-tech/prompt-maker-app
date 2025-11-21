// components/Header.js - COMPLETE VERSION
import { useState } from 'react';
import { useRouter } from 'next/router';

const Header = ({ darkMode, setDarkMode, user, handleLogin, handleLogout, isMobile }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);

  // Navigation items
  const navItems = [
    { path: '/features', label: 'Features', icon: '⚡', dropdown: true },
  ];

  const FEATURES_ITEMS = [
    { path: '/seo', label: '🔍 SEO Tool' },
    { path: '/code', label: '💻 Code Assistant' },
    { path: '/email', label: '✉️ Email Writer' },
    { path: '/translate', label: '🔄 Translator' },
    { path: '/audio', label: '🎵 Audio Tool' },
    { path: '/prompts', label: '📚 Prompt Library' },
  ];

  const navigateTo = (path) => {
    router.push(path);
    setMobileMenuOpen(false);
    setShowFeaturesDropdown(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Update CSS variables
    const root = document.documentElement;
    if (newDarkMode) {
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#cbd5e1');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
    }
  };

  // Styles
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '15px 0' : '20px 0',
    borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    marginBottom: '20px',
    position: 'relative',
  };

  const logoStyle = {
    fontSize: isMobile ? '1.5rem' : '2rem',
    fontWeight: '900',
    color: '#3b82f6',
    margin: 0,
    textDecoration: 'none',
    cursor: 'pointer'
  };

  const mobileMenuButtonStyle = {
    position: 'absolute',
    top: isMobile ? '15px' : '25px',
    left: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: darkMode ? '#f8fafc' : '#1e293b',
    zIndex: 100,
    padding: '8px',
    borderRadius: '6px',
    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  };

  const buttonStyle = (bgColor = '#3b82f6', textColor = '#fff') => ({
    padding: isMobile ? '10px 14px' : '8px 16px',
    backgroundColor: bgColor,
    color: textColor,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: isMobile ? '0.85rem' : '0.9rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  });

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
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
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

  const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px 20px',
    color: darkMode ? '#cbd5e1' : '#64748b',
    textDecoration: 'none',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  // Features Dropdown Style
  const featuresDropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    padding: '8px 0',
    minWidth: '220px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    marginTop: '8px'
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobile && (
        <div 
          style={sidebarOverlayStyle}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div style={mobileSidebarStyle}>
          <div style={{
            padding: '20px',
            borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: darkMode ? '#f8fafc' : '#1e293b' }}>
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

          <div style={{ flex: 1, padding: '20px 0' }}>
            {/* Home Link */}
            <button
              onClick={() => navigateTo('/')}
              style={navItemStyle}
            >
              <span style={{ fontSize: '1.2rem' }}>🏠</span>
              Home
            </button>

            {/* Features Dropdown in Mobile */}
            <div>
              <button
                onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                style={navItemStyle}
              >
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                Features {showFeaturesDropdown ? '▲' : '▼'}
              </button>
              {showFeaturesDropdown && (
                <div style={{ paddingLeft: '20px' }}>
                  {FEATURES_ITEMS.map((feature) => (
                    <button
                      key={feature.path}
                      onClick={() => navigateTo(feature.path)}
                      style={{
                        ...navItemStyle,
                        fontSize: '0.9rem',
                        padding: '12px 20px'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{feature.icon}</span>
                      {feature.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Other Navigation Items */}
            {navItems.map((item) => (
              !item.dropdown && (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  style={navItemStyle}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            ))}
          </div>

          <div style={{
            padding: '20px',
            borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {user ? (
              <button onClick={handleLogout} style={buttonStyle('#6b7280')}>
                👤 Logout
              </button>
            ) : (
              <button onClick={handleLogin} style={buttonStyle()}>
                🔐 Login
              </button>
            )}
            <button onClick={toggleDarkMode} style={buttonStyle(darkMode ? '#4b5563' : '#e5e7eb', darkMode ? '#f9fafb' : '#374151')}>
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header style={headerStyle}>
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            style={mobileMenuButtonStyle}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 
            style={logoStyle}
            onClick={() => navigateTo('/')}
          >
            AI Prompt Maker
          </h1>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '30px', 
            position: 'relative' 
          }}>
            {/* Home Link */}
            <button
              onClick={() => navigateTo('/')}
              style={{
                color: darkMode ? '#cbd5e1' : '#64748b',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                padding: '8px 16px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
              }}
            >
              🏠 Home
            </button>

            {navItems.map((item) => (
              <div key={item.path} style={{ position: 'relative' }}>
                {item.dropdown ? (
                  // Features Dropdown
                  <div
                    onMouseEnter={() => setShowFeaturesDropdown(true)}
                    onMouseLeave={() => setShowFeaturesDropdown(false)}
                  >
                    <button 
                      style={{
                        color: darkMode ? '#cbd5e1' : '#64748b',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        padding: '8px 16px',
                        transition: 'color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        if (!showFeaturesDropdown) {
                          e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                        }
                      }}
                    >
                      <span>{item.icon}</span>
                      {item.label} {showFeaturesDropdown ? '▲' : '▼'}
                    </button>
                    
                    {showFeaturesDropdown && (
                      <div style={featuresDropdownStyle}>
                        {FEATURES_ITEMS.map((feature) => (
                          <button
                            key={feature.path}
                            onClick={() => navigateTo(feature.path)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 16px',
                              color: darkMode ? '#cbd5e1' : '#64748b',
                              textDecoration: 'none',
                              border: 'none',
                              background: 'none',
                              width: '100%',
                              textAlign: 'left',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                              e.currentTarget.style.color = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                            }}
                          >
                            <span style={{ fontSize: '1rem' }}>{feature.icon}</span>
                            {feature.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular Navigation Items
                  <button 
                    onClick={() => navigateTo(item.path)}
                    style={{
                      color: darkMode ? '#cbd5e1' : '#64748b',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '8px 16px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isMobile && (
            <>
              {user ? (
                <button 
                  onClick={handleLogout}
                  style={buttonStyle('#6b7280')}
                >
                  👤 Logout
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleLogin}
                    style={buttonStyle()}
                  >
                    🔐 Login
                  </button>
                  <button 
                    onClick={handleLogin}
                    style={buttonStyle('#10b981')}
                  >
                    📝 Sign Up
                  </button>
                </>
              )}
            </>
          )}
          
          {!isMobile && (
            <button onClick={toggleDarkMode} style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '8px',
              borderRadius: '6px',
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
