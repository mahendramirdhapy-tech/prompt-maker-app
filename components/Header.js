// components/Header.js - PROFESSIONAL NAVBAR VERSION WITH AUTH & ADS
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const Header = ({ darkMode, setDarkMode, user, handleLogin, handleLogout, isMobile }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  // Update user when prop changes
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setCurrentUser(session?.user || null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load PropellerAds for mobile sidebar
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      const script = document.createElement('script');
      script.innerHTML = `(function(s){s.dataset.zone='10209722',s.src='https://groleegni.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [mobileMenuOpen, isMobile]);

  // Navigation items
  const navItems = [
    { path: '/features', label: 'Features', icon: '⚡', dropdown: true },
    { path: '/about', label: 'About', icon: '👥' },
    { path: '/contact', label: 'Contact', icon: '📞' },
  ];

  const FEATURES_ITEMS = [
    { path: '/seo', label: '🔍 SEO Tool' },
    { path: '/code', label: '💻 Code Assistant' },
    { path: '/email', label: '✉️ Email Writer' },
    { path: '/translate', label: '🔄 Translator' },
    { path: '/audio', label: '🎵 Audio Tool' },
    { path: '/prompts', label: '📚 Prompt Library' },
    { path: '/multitool', label: '🌐 Multi Tool' },
    { path: '/pdf', label: '📄 PDF Maker' },
    { path: '/catalog-maker', label: '💾 Catalog Maker' },
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

  // Enhanced login handler
  const enhancedHandleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  // Enhanced logout handler
  const enhancedHandleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      if (handleLogout) handleLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Professional Styles
  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: isScrolled 
      ? (darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)')
      : (darkMode ? '#0f172a' : '#ffffff'),
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
    borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
  };

  const navContainerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '0 15px' : '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
  };

  const logoStyle = {
    fontSize: isMobile ? '1.4rem' : '1.8rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const mobileMenuButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: darkMode ? '#f8fafc' : '#1e293b',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    transition: 'all 0.3s ease',
  };

  const hamburgerLineStyle = {
    width: '20px',
    height: '2px',
    backgroundColor: darkMode ? '#f8fafc' : '#1e293b',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  };

  // Button Styles
  const buttonStyle = (bgColor = '#3b82f6', textColor = '#fff') => ({
    padding: isMobile ? '10px 16px' : '10px 20px',
    backgroundColor: bgColor,
    color: textColor,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: isMobile ? '0.85rem' : '0.9rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  });

  // Mobile Sidebar Styles
  const mobileSidebarStyle = {
    position: 'fixed',
    top: 0,
    left: mobileMenuOpen ? '0' : '-100%',
    width: '300px',
    height: '100vh',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    zIndex: 1001,
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
    zIndex: 1000,
    display: mobileMenuOpen ? 'block' : 'none'
  };

  const navItemStyle = {
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
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottom: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`,
  };

  // Features Dropdown Style
  const featuresDropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: '8px 0',
    minWidth: '240px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    zIndex: 1000,
    marginTop: '8px'
  };

  // Mobile Sidebar Ad Component
  const MobileSidebarAd = () => {
    return (
      <div style={{
        padding: '15px',
        borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        textAlign: 'center',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkMode ? '#0f172a' : '#f1f5f9',
        margin: '10px 0'
      }}>
        {/* Native Banner Ad Container for Mobile Sidebar */}
        <div id="sidebar-mobile-ad"></div>
      </div>
    );
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
          {/* Sidebar Header */}
          <div style={{
            padding: '25px',
            borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: darkMode 
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
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
                padding: '5px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = darkMode ? '#94a3b8' : '#64748b';
              }}
            >
              ✕
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div style={{ padding: '10px 0', flex: 1 }}>
            {/* Home Link */}
            <button
              onClick={() => navigateTo('/')}
              style={navItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🏠</span>
              Home
            </button>

            {/* Features Dropdown in Mobile */}
            <div>
              <button
                onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                style={navItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                  e.currentTarget.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                Features {showFeaturesDropdown ? '▲' : '▼'}
              </button>
              {showFeaturesDropdown && (
                <div style={{ 
                  backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                  borderLeft: `3px solid ${darkMode ? '#3b82f6' : '#3b82f6'}`
                }}>
                  {FEATURES_ITEMS.map((feature) => (
                    <button
                      key={feature.path}
                      onClick={() => navigateTo(feature.path)}
                      style={{
                        ...navItemStyle,
                        fontSize: '0.9rem',
                        padding: '14px 20px 14px 40px',
                        borderBottom: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)';
                        e.currentTarget.style.color = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
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
            {navItems.filter(item => !item.dropdown).map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                style={navItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                  e.currentTarget.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}

            {/* Mobile Sidebar Advertisement */}
            <MobileSidebarAd />
          </div>

          {/* Sidebar Footer */}
          <div style={{
            padding: '25px',
            borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {currentUser ? (
              <button 
                onClick={enhancedHandleLogout} 
                style={buttonStyle('#6b7280', '#fff')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                👤 Logout
              </button>
            ) : (
              <>
                <button 
                  onClick={enhancedHandleLogin} 
                  style={buttonStyle('#3b82f6', '#fff')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🔐 Login
                </button>
                <button 
                  onClick={enhancedHandleLogin} 
                  style={buttonStyle('#10b981', '#fff')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  📝 Sign Up Free
                </button>
              </>
            )}
            
            <button 
              onClick={toggleDarkMode} 
              style={buttonStyle(darkMode ? '#4b5563' : '#e5e7eb', darkMode ? '#f9fafb' : '#374151')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header style={headerStyle}>
        <div style={navContainerStyle}>
          {/* Logo and Mobile Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                style={mobileMenuButtonStyle}
                aria-label="Toggle menu"
              >
                <span style={{
                  ...hamburgerLineStyle,
                  transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
                }}></span>
                <span style={{
                  ...hamburgerLineStyle,
                  opacity: mobileMenuOpen ? 0 : 1
                }}></span>
                <span style={{
                  ...hamburgerLineStyle,
                  transform: mobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
                }}></span>
              </button>
            )}

            {/* Logo */}
            <h1 
              style={logoStyle}
              onClick={() => navigateTo('/')}
            >
              <span>🚀</span>
              AI Prompt Maker
            </h1>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
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
                  padding: '10px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#3b82f6';
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>🏠</span>
                Home
              </button>

              {/* Features Dropdown */}
              <div
                onMouseEnter={() => setShowFeaturesDropdown(true)}
                onMouseLeave={() => setShowFeaturesDropdown(false)}
                style={{ position: 'relative' }}
              >
                <button 
                  style={{
                    color: darkMode ? '#cbd5e1' : '#64748b',
                    backgroundColor: showFeaturesDropdown 
                      ? (darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)')
                      : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>⚡</span>
                  Features {showFeaturesDropdown ? '▲' : '▼'}
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
                          transition: 'all 0.2s ease',
                          borderRadius: '6px'
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

              {/* Other Navigation Items */}
              {navItems.filter(item => !item.dropdown).map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  style={{
                    color: darkMode ? '#cbd5e1' : '#64748b',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#3b82f6';
                    e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Auth Buttons & Dark Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isMobile && (
              <>
                {currentUser ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      color: darkMode ? '#cbd5e1' : '#64748b',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      👋 Hi, {currentUser.email?.split('@')[0]}
                    </span>
                    <button 
                      onClick={enhancedHandleLogout}
                      style={buttonStyle('#6b7280', '#fff')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      👤 Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={enhancedHandleLogin}
                      style={{
                        color: darkMode ? '#cbd5e1' : '#64748b',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3b82f6';
                        e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      🔐 Login
                    </button>
                    <button 
                      onClick={enhancedHandleLogin}
                      style={buttonStyle('#10b981', '#fff')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      📝 Sign Up Free
                    </button>
                  </>
                )}
              </>
            )}
            
            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} style={{
              background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '10px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(15deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0) scale(1)';
            }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Add space for fixed header */}
      <div style={{ height: '70px' }}></div>
    </>
  );
};

export default Header;
