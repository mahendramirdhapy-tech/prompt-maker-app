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

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, []);

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
