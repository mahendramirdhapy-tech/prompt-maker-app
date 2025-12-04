// Layout.js
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
    if (typeof window !== 'undefined' && !adsLoaded) {
      loadAdScripts();
      setAdsLoaded(true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, [adsLoaded]);

  const loadAdScripts = () => {
    if (typeof document === 'undefined') return;

    // First ad (728x90)
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

    // Second ad (320x50)
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

    // Third ad
    const script5 = document.createElement('script');
    script5.async = true;
    script5.setAttribute('data-cfasync', 'false');
    script5.src = '//pl28186536.effectivegatecpm.com/d63cce37510d96a8534132920fcceba7/invoke.js';
    document.head.appendChild(script5);
  };

  // AdBanner Component
  const AdBanner = ({ adId, size = 'medium', position = 'center' }) => {
    if (!adsLoaded) return null;

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
      padding: '10px'
    };

    const containerId = `container-${adId}`;

    return (
      <div style={adStyle}>
        <div id={containerId} />
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
        AdBanner={AdBanner} // Pass AdBanner as prop
      />

      {/* Top Ad */}
      {!isMobile && (
        <AdBanner 
          adId="615b610ffe45a0412605aecbdac54718" 
          size="large" 
        />
      )}

      <main>
        {children}
      </main>

      {/* Middle Ad */}
      <AdBanner 
        adId="76390f46075c4f249d538d793d556a83" 
        size="medium" 
      />

      <ToolCards
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      {/* Bottom Ad */}
      <AdBanner 
        adId="d63cce37510d96a8534132920fcceba7" 
        size="medium" 
      />

      <FeedbackSection
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      <Footer
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
        AdBanner={AdBanner} // Pass AdBanner as prop
      />
    </div>
  );
};

export default Layout;
