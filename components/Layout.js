// Layout.js - UPDATED VERSION
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import ToolCards from './ToolCards';
import FeedbackSection from './FeedbackSection';

const Layout = ({ children, user, handleLogin, handleLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [adsLoaded, setAdsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
      }
    };

    checkScreenSize();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScreenSize);
    }

    const isDark = typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false;
    setDarkMode(isDark);

    // Load ads after component mounts
    if (typeof window !== 'undefined' && !window.adsLoaded) {
      loadAdScripts();
      window.adsLoaded = true;
      setAdsLoaded(true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, []);

  const loadAdScripts = () => {
    if (typeof document === 'undefined') return;
    
    console.log('Loading ad scripts...');

    // First ad (728x90)
    try {
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.innerHTML = `
        atOptions = {
          'key': '615b610ffe45a0412605aecbdac54718',
          'format': 'iframe',
          'height': 90,
          'width': 728,
          'params': {}
        };
      `;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.src = '//www.highperformanceformat.com/615b610ffe45a0412605aecbdac54718/invoke.js';
      document.head.appendChild(script2);
      
      console.log('First ad script loaded');
    } catch (error) {
      console.error('Error loading first ad:', error);
    }

    // Second ad (320x50)
    try {
      const script3 = document.createElement('script');
      script3.type = 'text/javascript';
      script3.innerHTML = `
        atOptions = {
          'key': '76390f46075c4f249d538d793d556a83',
          'format': 'iframe',
          'height': 50,
          'width': 320,
          'params': {}
        };
      `;
      document.head.appendChild(script3);

      const script4 = document.createElement('script');
      script4.type = 'text/javascript';
      script4.src = '//www.highperformanceformat.com/76390f46075c4f249d538d793d556a83/invoke.js';
      document.head.appendChild(script4);
      
      console.log('Second ad script loaded');
    } catch (error) {
      console.error('Error loading second ad:', error);
    }

    // Third ad
    try {
      const script5 = document.createElement('script');
      script5.async = true;
      script5.setAttribute('data-cfasync', 'false');
      script5.src = '//pl28186536.effectivegatecpm.com/d63cce37510d96a8534132920fcceba7/invoke.js';
      document.head.appendChild(script5);
      
      console.log('Third ad script loaded');
    } catch (error) {
      console.error('Error loading third ad:', error);
    }
  };

  // Simple AdBanner Component
  const AdBanner = ({ adId, size = 'medium', position = 'center', showPlaceholder = false }) => {
    const containerId = `container-${adId}`;
    
    const adStyle = {
      margin: '20px auto',
      textAlign: position,
      width: '100%',
      display: 'flex',
      justifyContent: position === 'center' ? 'center' : 'flex-start',
      alignItems: 'center',
      minHeight: size === 'large' ? '90px' : '50px',
      backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
      borderRadius: '8px',
      overflow: 'hidden',
      padding: '10px',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    };

    const placeholderStyle = {
      ...adStyle,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: darkMode ? '#94a3b8' : '#64748b',
      fontSize: '0.9rem'
    };

    if (showPlaceholder) {
      return (
        <div style={placeholderStyle}>
          <div>Advertisement</div>
          <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
            {size === 'large' ? '728 × 90' : '320 × 50'}
          </div>
        </div>
      );
    }

    return (
      <div style={adStyle}>
        <div id={containerId} style={{ width: '100%', textAlign: 'center' }}>
          {/* Ad will be injected here by script */}
        </div>
      </div>
    );
  };

  const navigateTo = (path) => {
    router.push(path);
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
        AdBanner={AdBanner}
      />

      {/* Top Ad */}
      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
        {!isMobile ? (
          <AdBanner 
            adId="615b610ffe45a0412605aecbdac54718" 
            size="large" 
            showPlaceholder={!adsLoaded}
          />
        ) : (
          <AdBanner 
            adId="76390f46075c4f249d538d793d556a83" 
            size="medium" 
            showPlaceholder={!adsLoaded}
          />
        )}
      </div>

      <main>
        {children}
      </main>

      {/* Middle Ad */}
      <div style={{ margin: '30px 0' }}>
        <AdBanner 
          adId="76390f46075c4f249d538d793d556a83" 
          size="medium" 
          showPlaceholder={!adsLoaded}
        />
      </div>

      <ToolCards
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      {/* Bottom Ad */}
      <div style={{ margin: '30px 0' }}>
        <AdBanner 
          adId="d63cce37510d96a8534132920fcceba7" 
          size="medium" 
          showPlaceholder={!adsLoaded}
        />
      </div>

      <FeedbackSection
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      <Footer
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
        AdBanner={AdBanner}
      />
    </div>
  );
};

export default Layout;
