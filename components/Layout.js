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

    // Load all ads
    loadAllAds();

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const loadAllAds = () => {
    // PropellerAds Monetag Format
    const monetagScript = document.createElement('script');
    monetagScript.src = 'https://fpyf8.com/88/tag.min.js';
    monetagScript.setAttribute('data-zone', '187915');
    monetagScript.setAttribute('data-cfasync', 'false');
    monetagScript.async = true;
    document.head.appendChild(monetagScript);

    // Existing PropellerAds
    loadPropellerAds();
  };

  const loadPropellerAds = () => {
    // Push Notifications
    const pushScript = document.createElement('script');
    pushScript.src = 'https://3nbf4.com/act/files/tag.min.js?z=10209677';
    pushScript.setAttribute('data-cfasync', 'false');
    pushScript.async = true;
    document.head.appendChild(pushScript);

    // In-Page Push
    const inpageScript = document.createElement('script');
    inpageScript.src = 'https://nap5k.com/tag.min.js';
    inpageScript.setAttribute('data-zone', '10209689');
    inpageScript.async = true;
    document.head.appendChild(inpageScript);
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

  // Monetag Ad Component (PropellerAds through)
  const MonetagAd = ({ position = 'native' }) => {
    const adStyle = {
      margin: '20px 0',
      padding: position === 'banner' ? '10px' : '15px',
      backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '8px',
      textAlign: 'center',
      minHeight: position === 'banner' ? '100px' : '250px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    };

    return (
      <div style={adStyle}>
        {/* Monetag Ad Container */}
        <div id={`monetag-ad-${position}`}></div>
        
        {/* Fallback Text */}
        <div style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          fontSize: '0.7rem',
          color: darkMode ? '#94a3b8' : '#64748b',
          background: darkMode ? '#334155' : '#e2e8f0',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          Monetag Ad
        </div>
      </div>
    );
  };

  // Vintage Banner Ad Component
  const VintageBannerAd = () => {
    useEffect(() => {
      const loadVintageAd = () => {
        const script = document.createElement('script');
        script.innerHTML = `
          (function(s){
            s.dataset.zone='10212308';
            s.src='https://gizokraijaw.net/vignette.min.js';
            s.async = true;
          })(document.createElement('script'));
        `;
        document.head.appendChild(script);
      };

      setTimeout(loadVintageAd, 1000);
    }, []);

    return (
      <div style={{
        margin: '20px 0',
        padding: '10px',
        backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        borderRadius: '8px',
        textAlign: 'center',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div id="vintage-banner-ad"></div>
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
        {/* Header ke niche Monetag Banner */}
        <MonetagAd position="banner" />
        
        {children}
        
        {/* Content ke beech Monetag Native */}
        <MonetagAd position="native" />
      </main>

      <ToolCards
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      {/* ToolCards ke baad Monetag Ad */}
      <MonetagAd position="native" />

      <FeedbackSection
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      {/* Footer se pehle Vintage Banner */}
      <VintageBannerAd />

      <Footer
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      {/* Global Ads Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Global Monetag Ads Loader
            setTimeout(function() {
              try {
                var monetagScript = document.createElement('script');
                monetagScript.src = 'https://fpyf8.com/88/tag.min.js';
                monetagScript.setAttribute('data-zone', '187915');
                monetagScript.setAttribute('data-cfasync', 'false');
                monetagScript.async = true;
                document.head.appendChild(monetagScript);
              } catch(e) { 
                console.log('Monetag ad load error:', e);
              }
            }, 2000);
          `
        }}
      />
    </div>
  );
};

export default Layout;
