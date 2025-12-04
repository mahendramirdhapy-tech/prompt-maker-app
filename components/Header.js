import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import ToolCards from './ToolCards';
import FeedbackSection from './FeedbackSection';

const Layout = ({ children, user, handleLogin, handleLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
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
    updateDarkModeStyles(isDark);

    // Load advertisement scripts only once
    if (!window.adsLoaded) {
      loadAdScripts();
      window.adsLoaded = true;
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, []);

  const loadAdScripts = () => {
    // Function to load a script
    const loadScript = (innerHTML, src, async = false, dataAttr = null) => {
      if (typeof document === 'undefined') return;
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      
      if (innerHTML) {
        script.innerHTML = innerHTML;
      }
      
      if (src) {
        script.src = src;
      }
      
      if (async) {
        script.async = true;
      }
      
      if (dataAttr) {
        script.setAttribute('data-cfasync', dataAttr);
      }
      
      document.head.appendChild(script);
    };

    // First ad (728x90)
    loadScript(
      `atOptions = {
        'key': '615b610ffe45a0412605aecbdac54718',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
      };`,
      null
    );
    loadScript(null, '//www.highperformanceformat.com/615b610ffe45a0412605aecbdac54718/invoke.js');

    // Second ad (320x50)
    loadScript(
      `atOptions = {
        'key': '76390f46075c4f249d538d793d556a83',
        'format': 'iframe',
        'height': 50,
        'width': 320,
        'params': {}
      };`,
      null
    );
    loadScript(null, '//www.highperformanceformat.com/76390f46075c4f249d538d793d556a83/invoke.js');

    // Third ad
    loadScript(
      null,
      '//pl28186536.effectivegatecpm.com/d63cce37510d96a8534132920fcceba7/invoke.js',
      true,
      'false'
    );
  };

  const updateDarkModeStyles = (isDark) => {
    if (typeof document !== 'undefined') {
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
    }
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  const AdBanner = ({ id, isMobile, isLeaderboard = false }) => {
    if (isMobile && isLeaderboard) {
      return null; // Don't show leaderboard ads on mobile
    }

    const adStyle = {
      margin: '20px auto',
      textAlign: 'center',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: isLeaderboard ? '90px' : '50px',
      backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
      borderRadius: '8px',
      overflow: 'hidden'
    };

    return (
      <div style={adStyle}>
        <div id={`container-${id}`} />
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

      {/* Top Ad (Leaderboard) */}
      <AdBanner 
        id="615b610ffe45a0412605aecbdac54718" 
        isMobile={isMobile} 
        isLeaderboard={true}
      />

      <main>
        {children}
      </main>

      {/* Middle Ad (Mobile) */}
      <AdBanner 
        id="76390f46075c4f249d538d793d556a83" 
        isMobile={isMobile}
      />

      <ToolCards
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      {/* Bottom Ad */}
      <AdBanner 
        id="d63cce37510d96a8534132920fcceba7" 
        isMobile={isMobile}
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
      />
    </div>
  );
};

export default Layout;
