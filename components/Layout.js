import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import ToolCards from './ToolCards';
import FeedbackSection from './FeedbackSection';

const Layout = ({ children, user, handleLogin, handleLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    updateDarkModeStyles(isDark);

    // Load clean ads
    loadCleanAds();

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const loadCleanAds = () => {
    // Only non-intrusive ads
    loadNativeBannerAds();
    loadVintageBannerAds();
  };

  const loadNativeBannerAds = () => {
    try {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(s){
          s.dataset.zone='10209722';
          s.src='https://groleegni.net/vignette.min.js';
          s.async = true;
        })(document.createElement('script'));
      `;
      document.head.appendChild(script);
    } catch (error) {
      console.log('Native ad load error:', error);
    }
  };

  const loadVintageBannerAds = () => {
    try {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(s){
          s.dataset.zone='10212308';
          s.src='https://gizokraijaw.net/vignette.min.js';
          s.async = true;
        })(document.createElement('script'));
      `;
      document.head.appendChild(script);
    } catch (error) {
      console.log('Vintage ad load error:', error);
    }
  };

  const updateDarkModeStyles = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
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

  const navigateTo = (path) => {
    router.push(path);
  };

  // Native Banner Ad Component
  const NativeBannerAd = () => {
    return (
      <div style={{
        margin: '25px 0',
        padding: '20px',
        backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        borderRadius: '12px',
        textAlign: 'center',
        minHeight: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div id="native-banner-ad"></div>
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          fontSize: '0.7rem',
          color: darkMode ? '#94a3b8' : '#64748b',
          background: darkMode ? '#334155' : '#e2e8f0',
          padding: '4px 8px',
          borderRadius: '6px',
          fontWeight: '500'
        }}>
          Advertisement
        </div>
      </div>
    );
  };

  // Vintage Banner Ad Component
  const VintageBannerAd = () => {
    return (
      <div style={{
        margin: '20px 0',
        padding: '15px',
        backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        borderRadius: '10px',
        textAlign: 'center',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div id="vintage-banner-ad"></div>
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          fontSize: '0.7rem',
          color: darkMode ? '#94a3b8' : '#64748b',
          background: darkMode ? '#334155' : '#e2e8f0',
          padding: '3px 6px',
          borderRadius: '4px',
          fontWeight: '500'
        }}>
          Sponsored
        </div>
      </div>
    );
  };

  const containerStyle = {
    fontFamily: "'Inter', sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '12px' : '24px',
    paddingBottom: isMobile ? '80px' : '40px',
    minHeight: '100vh',
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    boxSizing: 'border-box',
    position: 'relative'
  };

  return (
    <div style={containerStyle}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        isMobile={isMobile}
      />

      <main>
        <VintageBannerAd />
        
        {children}
        
        <NativeBannerAd />
      </main>

      <ToolCards
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      <NativeBannerAd />

      <FeedbackSection
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      <Footer
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />
    </div>
  );
};

export default Layout;
