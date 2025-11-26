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

    // Load all ads only on client side
    if (typeof window !== 'undefined') {
      loadAllAds();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, []);

  const loadAllAds = () => {
    // All PropellerAds formats except Monetag
    loadNativeBannerAds();
    loadVintageBannerAds();
    loadPushNotifications();
    loadInPagePushAds();
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
      console.log('Native Banner Ads loaded - Zone: 10209722');
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
      console.log('Vintage Banner Ads loaded - Zone: 10212308');
    } catch (error) {
      console.log('Vintage ad load error:', error);
    }
  };

  const loadPushNotifications = () => {
    try {
      // Push Notifications Ads
      const script = document.createElement('script');
      script.src = 'https://3nbf4.com/act/files/tag.min.js?z=10233742';
      script.setAttribute('data-cfasync', 'false');
      script.async = true;
      document.head.appendChild(script);
      console.log('Push Notifications loaded - Zone: 10233742');
    } catch (error) {
      console.log('Push ad load error:', error);
    }
  };

  const loadInPagePushAds = () => {
    try {
      // In-Page Push Ads
      const script = document.createElement('script');
      script.src = 'https://nap5k.com/tag.min.js';
      script.setAttribute('data-zone', '10209689');
      script.async = true;
      document.head.appendChild(script);
      console.log('In-Page Push Ads loaded - Zone: 10209689');
    } catch (error) {
      console.log('In-Page Push ad load error:', error);
    }
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
        {/* Header ke niche Vintage Banner */}
        <VintageBannerAd />
        
        {children}
        
        {/* Content ke beech Native Banner */}
        <NativeBannerAd />
      </main>

      <ToolCards
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      {/* ToolCards ke baad Native Banner */}
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
