// pages/about.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

export default function About() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize component
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check screen size
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

        // Initialize user
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        return () => window.removeEventListener('resize', checkScreenSize);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeApp();
  }, []);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

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

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    updateDarkModeStyles(newDarkMode);
  };

  // Styles
  const containerStyle = {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '20px 16px' : '40px 24px',
    minHeight: '100vh',
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    boxSizing: 'border-box',
    background: darkMode 
      ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: isMobile ? '40px' : '60px',
  };

  const titleStyle = {
    fontSize: isMobile ? '2.5rem' : '3.5rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 16px 0',
    lineHeight: '1.1',
  };

  const subtitleStyle = {
    fontSize: isMobile ? '1.1rem' : '1.3rem',
    color: darkMode ? '#cbd5e1' : '#64748b',
    margin: '0',
    lineHeight: '1.6',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    border: `1px solid ${darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)'}`,
    borderRadius: '16px',
    padding: isMobile ? '24px' : '32px',
    marginBottom: '30px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)'
  };

  const sectionTitleStyle = {
    fontSize: isMobile ? '1.5rem' : '2rem',
    fontWeight: '800',
    color: darkMode ? '#f8fafc' : '#1e293b',
    margin: '0 0 20px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const textStyle = {
    fontSize: isMobile ? '1rem' : '1.1rem',
    lineHeight: '1.7',
    color: darkMode ? '#cbd5e1' : '#64748b',
    marginBottom: '20px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '30px',
    marginBottom: '40px',
  };

  const featureCardStyle = {
    backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  };

  const teamGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '24px',
    marginTop: '30px',
  };

  const teamCardStyle = {
    backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    gap: '20px',
    margin: '40px 0',
  };

  const statCardStyle = {
    backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
  };

  return (
    <Layout 
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      user={user}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      isMobile={isMobile}
    >
      <Head>
        <title>About Us - AI Prompt Maker</title>
        <meta name="description" content="Learn about AI Prompt Maker - Our mission, features, team, and why we're the best AI prompt generation tool." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div style={containerStyle}>
        {/* Header Section */}
        <header style={headerStyle}>
          <h1 style={titleStyle}>About AI Prompt Maker</h1>
          <p style={subtitleStyle}>
            Empowering creators, writers, and developers worldwide with advanced AI technology to transform ideas into perfect prompts.
          </p>
        </header>

        {/* Stats Section */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={{ 
              fontSize: isMobile ? '2rem' : '2.5rem', 
              fontWeight: '800',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              10K+
            </div>
            <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
              Prompts Generated
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={{ 
              fontSize: isMobile ? '2rem' : '2.5rem', 
              fontWeight: '800',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              4
            </div>
            <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
              AI Models
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={{ 
              fontSize: isMobile ? '2rem' : '2.5rem', 
              fontWeight: '800',
              background: 'linear-gradient(135deg, #ec4899, #db2777)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              12+
            </div>
            <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
              Templates
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={{ 
              fontSize: isMobile ? '2rem' : '2.5rem', 
              fontWeight: '800',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              50+
            </div>
            <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '0.9rem' }}>
              Countries Served
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>
            <span>🎯</span> Our Mission
          </h2>
          <p style={textStyle}>
            At AI Prompt Maker, we believe that everyone should have access to powerful AI tools without complexity. 
            Our mission is to democratize AI technology by providing an intuitive, user-friendly platform that 
            transforms simple ideas into professional-grade AI prompts.
          </p>
          <p style={textStyle}>
            We're committed to making AI accessible to creators, writers, developers, and businesses worldwide, 
            helping them unlock their creative potential and streamline their workflow with cutting-edge AI models.
          </p>
        </div>

        {/* Features Section */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>
            <span>⚡</span> Why Choose AI Prompt Maker?
          </h2>
          <div style={gridStyle}>
            <div style={featureCardStyle}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤖</div>
              <h3 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 12px 0' }}>Multi-AI Model Support</h3>
              <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', margin: 0, fontSize: '0.95rem' }}>
                Access multiple AI models including Gemini, Claude, Llama, and Mistral in one platform
              </p>
            </div>
            <div style={featureCardStyle}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎨</div>
              <h3 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 12px 0' }}>Advanced Templates</h3>
              <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', margin: 0, fontSize: '0.95rem' }}>
                12+ specialized templates for blogs, social media, code, images, and more
              </p>
            </div>
            <div style={featureCardStyle}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 12px 0' }}>Lightning Fast</h3>
              <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', margin: 0, fontSize: '0.95rem' }}>
                Generate high-quality prompts in seconds with our optimized AI infrastructure
              </p>
            </div>
            <div style={featureCardStyle}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💯</div>
              <h3 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 12px 0' }}>Free Forever</h3>
              <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', margin: 0, fontSize: '0.95rem' }}>
                Core features available for free with generous usage limits for all users
              </p>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>
            <span>🔧</span> Our Technology
          </h2>
          <p style={textStyle}>
            AI Prompt Maker leverages state-of-the-art AI models and modern web technologies to deliver 
            a seamless user experience. Our platform is built with:
          </p>
          <div style={gridStyle}>
            <div>
              <h4 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 12px 0' }}>🤖 AI Models</h4>
              <ul style={{ color: darkMode ? '#cbd5e1' : '#64748b', paddingLeft: '20px', margin: 0 }}>
                <li>Google Gemini Pro</li>
                <li>Claude Instant</li>
                <li>Meta Llama 3</li>
                <li>Mistral 7B</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 12px 0' }}>💻 Tech Stack</h4>
              <ul style={{ color: darkMode ? '#cbd5e1' : '#64748b', paddingLeft: '20px', margin: 0 }}>
                <li>Next.js & React</li>
                <li>Supabase Auth</li>
                <li>Modern CSS</li>
                <li>RESTful APIs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>
            <span>👥</span> Meet Our Team
          </h2>
          <p style={textStyle}>
            We're a passionate team of developers, designers, and AI enthusiasts dedicated to creating 
            the best AI tools for our community.
          </p>
          <div style={teamGridStyle}>
            <div style={teamCardStyle}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                A
              </div>
              <h3 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 8px 0' }}>Alex Chen</h3>
              <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: 0, fontSize: '0.9rem' }}>
                Founder & CEO
              </p>
            </div>
            <div style={teamCardStyle}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                S
              </div>
              <h3 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 8px 0' }}>Sarah Johnson</h3>
              <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: 0, fontSize: '0.9rem' }}>
                AI Engineer
              </p>
            </div>
            <div style={teamCardStyle}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                M
              </div>
              <h3 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 8px 0' }}>Mike Rodriguez</h3>
              <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: 0, fontSize: '0.9rem' }}>
                Full Stack Developer
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>
            <span>❤️</span> Our Values
          </h2>
          <div style={gridStyle}>
            <div>
              <h4 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔓</span> Accessibility
              </h4>
              <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', margin: 0, fontSize: '0.95rem' }}>
                We believe AI should be accessible to everyone, regardless of technical expertise.
              </p>
            </div>
            <div>
              <h4 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>💡</span> Innovation
              </h4>
              <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', margin: 0, fontSize: '0.95rem' }}>
                We continuously innovate to provide the best AI tools and features for our users.
              </p>
            </div>
            <div>
              <h4 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🤝</span> Community
              </h4>
              <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', margin: 0, fontSize: '0.95rem' }}>
                Our users are at the heart of everything we do. We listen, learn, and grow together.
              </p>
            </div>
            <div>
              <h4 style={{ color: darkMode ? '#f8fafc' : '#1e293b', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚡</span> Quality
              </h4>
              <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', margin: 0, fontSize: '0.95rem' }}>
                We're committed to delivering high-quality, reliable AI tools that users can depend on.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          ...cardStyle,
          textAlign: 'center',
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
          border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
        }}>
          <h2 style={{ 
            color: darkMode ? '#f8fafc' : '#1e293b',
            fontSize: isMobile ? '1.8rem' : '2.2rem',
            margin: '0 0 16px 0',
            fontWeight: '800'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            color: darkMode ? '#cbd5e1' : '#64748b',
            fontSize: isMobile ? '1.1rem' : '1.2rem',
            margin: '0 0 30px 0',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            Join thousands of creators and developers already using AI Prompt Maker to supercharge their workflow.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '700',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 20px -5px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🚀 Start Creating Now
          </button>
        </div>
      </div>
    </Layout>
  );
}
