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

    // Initialize dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    updateDarkModeStyles(isDark);

    // Load PropellerAds scripts
    loadPropellerAds();

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const loadPropellerAds = () => {
    // Global PropellerAds scripts
    const adsScripts = [
      {
        id: 'propeller-push',
        src: 'https://3nbf4.com/act/files/tag.min.js?z=10209677',
        dataset: { zone: '10209677' }
      },
      {
        id: 'propeller-inpage',
        src: 'https://nap5k.com/tag.min.js',
        dataset: { zone: '10209689' }
      }
    ];

    adsScripts.forEach(scriptConfig => {
      const script = document.createElement('script');
      script.id = scriptConfig.id;
      script.src = scriptConfig.src;
      script.async = true;
      script.dataset.cfasync = "false";
      
      if (scriptConfig.dataset) {
        Object.keys(scriptConfig.dataset).forEach(key => {
          script.dataset[key] = scriptConfig.dataset[key];
        });
      }
      
      document.head.appendChild(script);
    });
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

  // Ads Components
  const VintageBannerAd = () => {
    useEffect(() => {
      const script = document.createElement('script');
      script.innerHTML = `(function(s){s.dataset.zone='10212308',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
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
        {/* Vintage Banner Ad will load here */}
        <div id="vintage-banner-ad"></div>
      </div>
    );
  };

  const NativeBannerAd = () => {
    useEffect(() => {
      const script = document.createElement('script');
      script.innerHTML = `(function(s){s.dataset.zone='10209722',s.src='https://groleegni.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }, []);

    return (
      <div style={{
        margin: '20px 0',
        padding: '10px',
        backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        borderRadius: '8px',
        textAlign: 'center',
        minHeight: '250px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Native Banner Ad will load here */}
        <div id="native-banner-ad"></div>
      </div>
    );
  };

  const containerStyle = {
    fontFamily: "'Inter', sans-serif",
    maxWidth: '100%',
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
        
        {/* Content ke beech mein Native Banner */}
        <NativeBannerAd />
      </main>

      <ToolCards
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
      />

      {/* ToolCards ke baad ek aur Native Banner */}
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
