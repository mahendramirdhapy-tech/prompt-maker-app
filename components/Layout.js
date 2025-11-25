import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import ToolCards from './ToolCards';
import FeedbackSection from './FeedbackSection';

const Layout = ({ children, user, handleLogin, handleLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pushPermission, setPushPermission] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    updateDarkModeStyles(isDark);

    // Load all ads only on client side
    if (typeof window !== 'undefined') {
      loadAllAds();
      checkPushPermission();
    }

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const checkPushPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setPushPermission(true);
      }
    }
  };

  const loadAllAds = () => {
    // Non-intrusive banner ads
    loadNativeBannerAds();
    loadVintageBannerAds();
    
    // Push notifications ads
    loadPushNotifications();
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

  const loadPushNotifications = () => {
    try {
      const script = document.createElement('script');
      script.src = 'https://3nbf4.com/act/files/tag.min.js?z=10209677';
      script.setAttribute('data-cfasync', 'false');
      script.async = true;
      document.head.appendChild(script);
    } catch (error) {
      console.log('Push ad load error:', error);
    }
  };

  const requestPushPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setPushPermission(true);
          alert('Push notifications enabled! You will receive updates.');
        } else {
          alert('Push notifications blocked. You can enable them later from browser settings.');
        }
      });
    } else {
      alert('Your browser does not support push notifications.');
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

  // Push Notification Permission Component
  const PushNotificationPrompt = () => {
    if (!isClient || pushPermission || !('Notification' in window)) return null;

    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        border: `2px solid ${darkMode ? '#3b82f6' : '#3b82f6'}`,
        borderRadius: '12px',
        padding: '15px',
        maxWidth: '300px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease-out'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          marginBottom: '10px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🔔</span>
          <div>
            <h4 style={{ 
              margin: '0 0 5px 0', 
              color: darkMode ? '#f8fafc' : '#1e293b',
              fontSize: '1rem'
            }}>
              Get Updates!
            </h4>
            <p style={{ 
              margin: '0', 
              color: darkMode ? '#cbd5e1' : '#64748b',
              fontSize: '0.8rem',
              lineHeight: '1.4'
            }}>
              Enable push notifications to stay updated with our latest AI tools and features.
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => setPushPermission(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: darkMode ? '#cbd5e1' : '#64748b',
              border: `1px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
          >
            Later
          </button>
          <button
            onClick={requestPushPermission}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}
          >
            Enable
          </button>
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
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

      {/* Push Notification Prompt - Only shows on client side */}
      {isClient && <PushNotificationPrompt />}

      {/* Global Push Ads Script - Only loads on client side */}
      {isClient && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global Push Ads Loader with retry
              function loadPushAds() {
                try {
                  var existingScript = document.querySelector('script[src*="3nbf4.com"]');
                  if (existingScript) existingScript.remove();
                  
                  var script = document.createElement('script');
                  script.src = 'https://3nbf4.com/act/files/tag.min.js?z=10209677';
                  script.setAttribute('data-cfasync', 'false');
                  script.async = true;
                  document.head.appendChild(script);
                } catch(e) {
                  console.log('Push ads load error:', e);
                  // Retry after 5 seconds
                  setTimeout(loadPushAds, 5000);
                }
              }
              
              // Load push ads after page load
              setTimeout(loadPushAds, 3000);
            `
          }}
        />
      )}
    </div>
  );
};

export default Layout;
