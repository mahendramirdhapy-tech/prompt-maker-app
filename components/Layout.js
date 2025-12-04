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

    // Load advertisement scripts
    loadAdScripts();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, []);

  const loadAdScripts = () => {
    // Load first ad script
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

    // Load second ad script
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

    // Load third ad script
    const script5 = document.createElement('script');
    script5.async = true;
    script5.setAttribute('data-cfasync', 'false');
    script5.src = '//pl28186536.effectivegatecpm.com/d63cce37510d96a8534132920fcceba7/invoke.js';
    document.head.appendChild(script5);
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
        {children}
        
        {/* Advertisement Placeholders */}
        <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
          <div id="container-615b610ffe45a0412605aecbdac54718"></div>
        </div>
        
        <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
          <div id="container-76390f46075c4f249d538d793d556a83"></div>
        </div>
        
        <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
          <div id="container-d63cce37510d96a8534132920fcceba7"></div>
        </div>
      </main>

      <ToolCards
        darkMode={darkMode}
        isMobile={isMobile}
        navigateTo={navigateTo}
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
